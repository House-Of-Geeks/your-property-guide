/**
 * Match PropertySale rows to PropertyAddress (G-NAF) entries, then
 * denormalise the latest sale onto PropertyAddress for fast page reads.
 *
 * Three-stage process:
 *   1. Pass 1 — exact match on normalised house + street + locality + postcode + state
 *   2. Pass 2 — street fallback (locality + postcode + street, no house number)
 *      → tagged matchConfidence='street-fallback', not denormalised
 *   3. Denormalise — write lastSaleDate / lastSalePrice / saleCount onto
 *      PropertyAddress for every address that has at least one matched sale,
 *      using a high-water-mark guard so we never decrement.
 *
 * Normalisation:
 *   - rawHouseNumber: strip whitespace ("1 A" → "1A" to match G-NAF)
 *   - rawStreetName: strip trailing street-type token (ST, RD, AVE, etc.)
 *   - case-folded compare on locality and streetName
 *
 * Many-to-one resolution: when one VG sale matches many G-NAF rows (a unit
 * block), pick the row with no flatNumber (the building itself) if present,
 * else the lexically smallest G-NAF id.
 *
 * Idempotency: pass 1 and pass 2 only touch rows where addressId IS NULL,
 * so re-running doesn't rematch already-matched rows. The denormalisation
 * is idempotent because it always rebuilds from the current PropertySale
 * state and uses a high-water-mark guard.
 *
 * Re-match strategy: if you want to re-run matching from scratch (e.g.
 * after expanding the street-type list), first NULL out the existing matches:
 *   UPDATE "PropertySale" SET "addressId" = NULL, "matchConfidence" = NULL
 *   WHERE state = 'NSW';
 * — but be careful, this also clears the denorm view until rebuild runs.
 *
 * Usage:
 *   npx tsx scripts/sync/match-sales.ts --state=NSW
 *   npx tsx scripts/sync/match-sales.ts --state=NSW --dry-run
 *   npx tsx scripts/sync/match-sales.ts --state=NSW --skip-fallback
 *   npx tsx scripts/sync/match-sales.ts --state=NSW --skip-denorm
 */
import "dotenv/config";
import { Pool, type PoolClient } from "pg";

interface CliOptions {
  state: string;
  dryRun: boolean;
  skipFallback: boolean;
  skipDenorm: boolean;
}

function parseCli(): CliOptions {
  const args = process.argv.slice(2);
  const get = (name: string): string | null => {
    const a = args.find((s) => s.startsWith(`--${name}=`));
    return a ? a.split("=").slice(1).join("=") : null;
  };
  const has = (name: string): boolean => args.includes(`--${name}`);
  return {
    state:        get("state") ?? "NSW",
    dryRun:       has("dry-run"),
    skipFallback: has("skip-fallback"),
    skipDenorm:   has("skip-denorm"),
  };
}

const TAG = "match-sales";
const log = (msg: string): void => console.log(`[${TAG}] ${msg}`);

// Street-type tokens to strip from the trailing position of a raw street name.
// Order long-before-short so e.g. "STREET" matches before "ST".
// Source: G-NAF STREET_TYPE_AUT — top 50 covers ~99.5% of NSW residential.
const STREET_TYPE_PATTERN =
  "(STREET|ROAD|AVENUE|DRIVE|PLACE|LANE|COURT|CRESCENT|PARADE|BOULEVARD|BOULEVARDE|TERRACE|HIGHWAY|CIRCUIT|CLOSE|CIRCLE|SQUARE|GROVE|MEWS|RISE|WALK|WAY|PROMENADE|ALLEY|ARCADE|ESPLANADE|GLEN|RIDGE|VIEW|VISTA|HEIGHTS|LOOP|TRACK|TURN|CHASE|DOWNS|END|GARDENS|GRANGE|GREEN|HOLLOW|MALL|PARKWAY|PATHWAY|PASS|PLAZA|RIDGEWAY|TRAIL|VALE" +
  "|ST|RD|AV|AVE|DR|PL|LN|CT|CRES|PDE|BLVD|TCE|HWY|CCT|CL|CIR|SQ|GR|RSE|WK|WY|PROM|ARC|ESP|GLN|RDG|VW|VSTA|HTS|LP|TRK|TRN|CH|DNS|GDNS|GRA|GRN|HLLW|MWY|PWAY|PSGE|PZA|RDGY|TRL|VL)";

/**
 * Build a CTE expression that produces (sale_id, address_id) pairs for
 * exact matches against G-NAF. Used by pass1Exact and previewable via dry-run.
 */
function exactMatchCte(state: string): string {
  return `
    WITH normalized AS (
      SELECT id,
        -- "1 A" → "1A" to align with G-NAF format
        UPPER(REPLACE("rawHouseNumber", ' ', '')) AS norm_house,
        -- Strip trailing street-type token, keep the actual name
        UPPER(REGEXP_REPLACE(
          "rawStreetName",
          ' ${STREET_TYPE_PATTERN}$',
          '',
          'i'
        )) AS norm_street,
        UPPER("rawLocality") AS norm_locality,
        "rawPostcode",
        state
      FROM "PropertySale"
      WHERE "addressId" IS NULL
        AND "rawHouseNumber" IS NOT NULL
        AND "rawStreetName" IS NOT NULL
        AND state = '${state}'
    ),
    matched AS (
      SELECT DISTINCT ON (n.id)
        n.id          AS sale_id,
        pa.id         AS address_id
      FROM normalized n
      JOIN "PropertyAddress" pa
        ON pa.state = n.state
       AND pa.postcode = n."rawPostcode"
       AND UPPER(pa.locality) = n.norm_locality
       AND UPPER(pa."numberFirst") = n.norm_house
       AND UPPER(pa."streetName") = n.norm_street
      -- Prefer the building (no flat) over individual unit entries
      ORDER BY n.id, pa."flatNumber" NULLS FIRST, pa.id
    )
  `;
}

/**
 * Build the CTE for street-fallback matches (no house number).
 * Picks any G-NAF row on the same street + locality + postcode.
 */
function streetFallbackCte(state: string): string {
  return `
    WITH normalized AS (
      SELECT id,
        UPPER(REGEXP_REPLACE(
          "rawStreetName",
          ' ${STREET_TYPE_PATTERN}$',
          '',
          'i'
        )) AS norm_street,
        UPPER("rawLocality") AS norm_locality,
        "rawPostcode",
        state
      FROM "PropertySale"
      WHERE "addressId" IS NULL
        AND "rawStreetName" IS NOT NULL
        AND state = '${state}'
    ),
    matched AS (
      SELECT DISTINCT ON (n.id)
        n.id  AS sale_id,
        pa.id AS address_id
      FROM normalized n
      JOIN "PropertyAddress" pa
        ON pa.state = n.state
       AND pa.postcode = n."rawPostcode"
       AND UPPER(pa.locality) = n.norm_locality
       AND UPPER(pa."streetName") = n.norm_street
      ORDER BY n.id, pa."flatNumber" NULLS FIRST, pa.id
    )
  `;
}

async function preflight(client: PoolClient, state: string): Promise<void> {
  const r = await client.query(
    `SELECT
       COUNT(*) FILTER (WHERE "addressId" IS NULL)     AS unmatched,
       COUNT(*) FILTER (WHERE "addressId" IS NOT NULL) AS matched,
       COUNT(*)                                         AS total
     FROM "PropertySale" WHERE state = $1`,
    [state]
  );
  const row = r.rows[0];
  log(`pre-flight ${state}: total=${row.total} · matched=${row.matched} · unmatched=${row.unmatched}`);
  if (row.total === "0") throw new Error(`No PropertySale rows for state=${state} — nothing to do`);
}

async function pass1Exact(client: PoolClient, opts: CliOptions): Promise<number> {
  const sql = `
    ${exactMatchCte(opts.state)}
    UPDATE "PropertySale" ps
    SET "addressId" = m.address_id,
        "matchConfidence" = 'exact'
    FROM matched m
    WHERE ps.id = m.sale_id
  `;
  await client.query("BEGIN");
  const r = await client.query(sql);
  if (opts.dryRun) {
    await client.query("ROLLBACK");
    log(`pass 1 (exact): would match ${r.rowCount} rows [dry-run, rolled back]`);
  } else {
    await client.query("COMMIT");
    log(`pass 1 (exact): matched ${r.rowCount} rows`);
  }
  return r.rowCount ?? 0;
}

async function pass2StreetFallback(client: PoolClient, opts: CliOptions): Promise<number> {
  const sql = `
    ${streetFallbackCte(opts.state)}
    UPDATE "PropertySale" ps
    SET "addressId" = m.address_id,
        "matchConfidence" = 'street-fallback'
    FROM matched m
    WHERE ps.id = m.sale_id
  `;
  await client.query("BEGIN");
  const r = await client.query(sql);
  if (opts.dryRun) {
    await client.query("ROLLBACK");
    log(`pass 2 (street fallback): would match ${r.rowCount} rows [dry-run, rolled back]`);
  } else {
    await client.query("COMMIT");
    log(`pass 2 (street fallback): matched ${r.rowCount} rows`);
  }
  return r.rowCount ?? 0;
}

/**
 * Recompute lastSaleDate / lastSalePrice / saleCount on PropertyAddress
 * from the current PropertySale state. Only counts exact matches (not
 * street-fallback) so the denorm reflects address-level history, not
 * "something on this street sold."
 *
 * High-water-mark guard: never overwrites a more recent denorm value.
 * (Defensive — under normal flow this is monotonic anyway, but if someone
 * manually set lastSaleDate from another source, this respects it.)
 */
async function denormalise(client: PoolClient, opts: CliOptions): Promise<number> {
  const sql = `
    WITH agg AS (
      SELECT
        "addressId",
        MAX("contractDate") AS max_date,
        COUNT(*)            AS sale_cnt,
        (array_agg(price ORDER BY "contractDate" DESC, id))[1] AS latest_price
      FROM "PropertySale"
      WHERE "addressId" IS NOT NULL
        AND "matchConfidence" = 'exact'
        AND state = '${opts.state}'
      GROUP BY "addressId"
    )
    UPDATE "PropertyAddress" pa
    SET "lastSaleDate"  = agg.max_date,
        "lastSalePrice" = agg.latest_price,
        "saleCount"     = agg.sale_cnt
    FROM agg
    WHERE pa.id = agg."addressId"
      -- Only update if we have new info (high-water mark)
      AND (pa."lastSaleDate" IS NULL OR agg.max_date >= pa."lastSaleDate")
  `;
  await client.query("BEGIN");
  const r = await client.query(sql);
  if (opts.dryRun) {
    await client.query("ROLLBACK");
    log(`denormalise: would update ${r.rowCount} PropertyAddress rows [dry-run, rolled back]`);
  } else {
    await client.query("COMMIT");
    log(`denormalise: updated ${r.rowCount} PropertyAddress rows`);
  }
  return r.rowCount ?? 0;
}

async function postFlight(client: PoolClient, state: string): Promise<void> {
  const r = await client.query(
    `SELECT
       COUNT(*) FILTER (WHERE "addressId" IS NULL)                                  AS unmatched,
       COUNT(*) FILTER (WHERE "matchConfidence" = 'exact')                          AS exact,
       COUNT(*) FILTER (WHERE "matchConfidence" = 'street-fallback')                AS street_fallback,
       COUNT(*)                                                                     AS total,
       ROUND(100.0 * COUNT(*) FILTER (WHERE "matchConfidence" = 'exact') / GREATEST(COUNT(*), 1), 1) AS exact_pct
     FROM "PropertySale" WHERE state = $1`,
    [state]
  );
  const row = r.rows[0];
  log(`post-flight ${state}: total=${row.total} · exact=${row.exact} (${row.exact_pct}%) · street-fallback=${row.street_fallback} · unmatched=${row.unmatched}`);

  const denormR = await client.query(
    `SELECT COUNT(*) AS denormed FROM "PropertyAddress" WHERE state = $1 AND "lastSaleDate" IS NOT NULL`,
    [state]
  );
  log(`post-flight ${state}: ${denormR.rows[0].denormed} PropertyAddress rows have a denormalised lastSaleDate`);
}

async function main(): Promise<void> {
  const opts = parseCli();
  log(`options: ${JSON.stringify(opts)}`);
  const pool = new Pool({ connectionString: process.env.DATABASE_URL!, max: 1 });
  const client = await pool.connect();
  try {
    await preflight(client, opts.state);
    await pass1Exact(client, opts);
    if (!opts.skipFallback) await pass2StreetFallback(client, opts);
    else log(`pass 2: skipped (--skip-fallback)`);
    if (!opts.skipDenorm) await denormalise(client, opts);
    else log(`denormalise: skipped (--skip-denorm)`);
    await postFlight(client, opts.state);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(`[${TAG}] FAILED:`, err);
  process.exit(1);
});
