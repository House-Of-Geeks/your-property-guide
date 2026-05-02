/**
 * NSW Property Sales Sync (NSW Valuer General PSI)
 *
 * Two outputs from one parse pass over the NSW VG yearly bulk ZIPs:
 *
 *   1. Suburb aggregate (existing): median house price, YoY growth, days on market
 *      → written to Suburb.medianHousePrice / annualGrowthHouse / daysOnMarket
 *
 *   2. Per-property rows (new): one PropertySale row per transaction
 *      → written via COPY in per-year transactions, idempotent via
 *        (source, sourceRowKey) unique key, undoable via runId
 *
 * The two outputs are isolated. If the row-capture writer fails, the suburb
 * aggregator still commits its updates. Each year's row write is its own
 * transaction — a partial backfill is preserved on failure.
 *
 * DAT record format (semicolon-delimited B-records, NSW VG NNME files):
 *   [0]  "B"               — record identifier
 *   [1]  district code
 *   [2]  property ID (NSW LRS internal — not G-NAF)
 *   [3]  sale counter
 *   [6]  unit number
 *   [7]  house number
 *   [8]  street name (sometimes includes type, e.g. "MAIN ST")
 *   [9]  locality (suburb, ALL CAPS)
 *   [10] postcode
 *   [11] area (numeric)
 *   [12] area type ("M" m² | "H" ha)
 *   [13] contract date (YYYYMMDD)
 *   [14] settlement date (YYYYMMDD)
 *   [15] purchase price
 *   [16] zoning code
 *   [17] nature of property (R=residence non-strata, V=vacant, 3=strata)
 *   [18] primary purpose
 *   [23] dealing number
 *
 * sourceRowKey = `${districtCode}:${propertyId}:${saleCounter}` (globally unique within NSW VG)
 *
 * CLI flags:
 *   --dry-run             — parse + count, write nothing
 *   --year=2024           — process only this year (no YoY aggregate; rows still capture)
 *   --years=2020,2021,..  — explicit year list (rows; aggregate uses last pair)
 *   --limit=10000         — cap rows per year (smoke test)
 *   --skip-aggregate      — only do row capture
 *   --skip-rows           — only do suburb aggregate (legacy behaviour)
 *   --no-cache            — re-download even if cached zip exists
 *
 * Source: https://valuergeneral.nsw.gov.au/__psi/yearly/{YEAR}.zip
 * License: NSW Government Open Data (CC BY 4.0)
 * Schedule: Quarterly (full year usually settled by ~Feb)
 *
 * Privacy: NEVER store purchaser/vendor names. Direct marketing is prohibited
 * by the VG licence. The NNME bulk feed already excludes personal names —
 * keep it that way.
 */
import "dotenv/config";
import AdmZip from "adm-zip";
import { Pool, type PoolClient } from "pg";
import { from as copyFrom } from "pg-copy-streams";
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";

const SOURCE_ID = "sales-nsw";        // suburb aggregator (existing)
const ROWS_SOURCE = "vg-nsw";          // PropertySale.source value
const BASE_URL = "https://www.valuergeneral.nsw.gov.au/__psi/yearly";
const CACHE_DIR = join(process.cwd(), ".cache", "sales-nsw");

// Column indices in the semicolon-delimited DAT B-records (0-based)
const COL_DISTRICT      = 1;
const COL_PROPERTY_ID   = 2;
const COL_SALE_COUNTER  = 3;
const COL_UNIT_NUMBER   = 6;
const COL_HOUSE_NUMBER  = 7;
const COL_STREET_NAME   = 8;
const COL_SUBURB        = 9;
const COL_POSTCODE      = 10;
const COL_AREA          = 11;
const COL_AREA_TYPE     = 12;
const COL_DATE          = 13;
const COL_SETTLE        = 14;
const COL_PRICE         = 15;
const COL_ZONING        = 16;
const COL_NATURE        = 17;
const COL_PURPOSE       = 18;
const COL_DEALING       = 23;

const MIN_PRICE = 50_000;

// ─── CLI ────────────────────────────────────────────────────────────────────

interface CliOptions {
  dryRun: boolean;
  years: number[] | null;          // null → use default (current + prev year)
  limit: number | null;
  skipAggregate: boolean;
  skipRows: boolean;
  useCache: boolean;
}

function parseCli(): CliOptions {
  const args = process.argv.slice(2);
  const get = (name: string): string | null => {
    const a = args.find((s) => s.startsWith(`--${name}=`));
    return a ? a.split("=").slice(1).join("=") : null;
  };
  const has = (name: string): boolean => args.includes(`--${name}`);

  const yearArg = get("year");
  const yearsArg = get("years");
  let years: number[] | null = null;
  if (yearArg) years = [parseInt(yearArg, 10)];
  else if (yearsArg) years = yearsArg.split(",").map((s) => parseInt(s.trim(), 10));

  return {
    dryRun:        has("dry-run"),
    years,
    limit:         get("limit") ? parseInt(get("limit")!, 10) : null,
    skipAggregate: has("skip-aggregate"),
    skipRows:      has("skip-rows"),
    useCache:     !has("no-cache"),
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function median(nums: number[]): number | null {
  if (nums.length === 0) return null;
  const sorted = [...nums].sort((a, b) => a - b);
  const m = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? Math.round((sorted[m - 1] + sorted[m]) / 2) : sorted[m];
}

function parseDate(s: string): Date | null {
  if (!s || s.length < 8) return null;
  const y = parseInt(s.slice(0, 4), 10);
  const m = parseInt(s.slice(4, 6), 10) - 1;
  const d = parseInt(s.slice(6, 8), 10);
  const dt = new Date(Date.UTC(y, m, d));
  return isNaN(dt.getTime()) ? null : dt;
}

function titleCase(s: string): string {
  return s.toLowerCase().replace(/(?:^|\s|-|')\S/g, (c) => c.toUpperCase());
}

/** Escape a value for Postgres COPY CSV format (FORMAT csv, NULL '\\N'). */
function csvField(v: string | number | Date | null | undefined): string {
  if (v == null) return "\\N";
  if (v instanceof Date) return v.toISOString();
  const s = String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

// ─── Parsing ────────────────────────────────────────────────────────────────

interface YearAggregate {
  /** key = "SUBURB|POSTCODE" */
  prices: Map<string, { prices: number[]; days: number[] }>;
}

interface SaleRow {
  sourceRowKey:   string;
  rawHouseNumber: string | null;
  rawUnitNumber:  string | null;
  rawStreetName:  string | null;
  rawLocality:    string;
  rawPostcode:    string;
  contractDate:   Date;
  settlementDate: Date | null;
  price:          number;
  area:           number | null;
  areaType:       string | null;
  natureCode:     string | null;
  zoning:         string | null;
  primaryPurpose: string | null;
  dealingNumber:  string | null;
}

interface ParseResult {
  aggregate: YearAggregate;
  rows:      SaleRow[];
}

function parseDat(text: string, year: number, acc: ParseResult, captureRows: boolean, rowLimit: number | null): number {
  let count = 0;
  for (const line of text.split(/\r?\n/)) {
    if (!line.startsWith("B;")) continue;

    const cols = line.split(";");
    if (cols.length < 18) continue;

    const price = parseInt(cols[COL_PRICE]?.replace(/,/g, "") ?? "", 10);
    if (!price || price < MIN_PRICE) continue;

    const contractDate = parseDate(cols[COL_DATE]?.trim() ?? "");
    if (!contractDate || contractDate.getUTCFullYear() !== year) continue;

    const suburb   = cols[COL_SUBURB]?.trim();
    const postcode = cols[COL_POSTCODE]?.trim();
    if (!suburb || !postcode) continue;

    const settleDate = parseDate(cols[COL_SETTLE]?.trim() ?? "");
    const daysDiff   = settleDate ? Math.round((settleDate.getTime() - contractDate.getTime()) / 86_400_000) : null;
    const nature     = cols[COL_NATURE]?.trim().toUpperCase() ?? "";

    // ── Aggregate path: only "R" (non-strata residence) for backwards compat ──
    if (nature === "R") {
      const key = `${suburb}|${postcode}`;
      let entry = acc.aggregate.prices.get(key);
      if (!entry) { entry = { prices: [], days: [] }; acc.aggregate.prices.set(key, entry); }
      entry.prices.push(price);
      if (daysDiff !== null && daysDiff >= 1 && daysDiff <= 365) entry.days.push(daysDiff);
    }

    // ── Row path: capture all valid rows regardless of nature code ──
    if (captureRows && (rowLimit == null || acc.rows.length < rowLimit)) {
      const district = cols[COL_DISTRICT]?.trim() ?? "";
      const propId   = cols[COL_PROPERTY_ID]?.trim() ?? "";
      const saleCtr  = cols[COL_SALE_COUNTER]?.trim() ?? "";
      if (district && propId) {
        const areaRaw = cols[COL_AREA]?.trim() ?? "";
        const area    = areaRaw ? parseFloat(areaRaw) : null;
        acc.rows.push({
          sourceRowKey:   `${district}:${propId}:${saleCtr}`,
          rawHouseNumber: cols[COL_HOUSE_NUMBER]?.trim() || null,
          rawUnitNumber:  cols[COL_UNIT_NUMBER]?.trim()  || null,
          rawStreetName:  cols[COL_STREET_NAME]?.trim()  || null,
          rawLocality:    suburb,
          rawPostcode:    postcode,
          contractDate,
          settlementDate: settleDate,
          price,
          area:           area && !isNaN(area) ? area : null,
          areaType:       cols[COL_AREA_TYPE]?.trim() || null,
          natureCode:     nature || null,
          zoning:         cols[COL_ZONING]?.trim()    || null,
          primaryPurpose: cols[COL_PURPOSE]?.trim()   || null,
          dealingNumber:  cols[COL_DEALING]?.trim()   || null,
        });
      }
    }
    count++;
  }
  return count;
}

// ─── Download (cached) ──────────────────────────────────────────────────────

async function fetchYearZip(year: number, useCache: boolean): Promise<Buffer> {
  if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
  const cachePath = join(CACHE_DIR, `${year}.zip`);

  if (useCache && existsSync(cachePath)) {
    log(SOURCE_ID, `${year}: using cached ZIP (${cachePath})`);
    return readFileSync(cachePath);
  }

  const url = `${BASE_URL}/${year}.zip`;
  log(SOURCE_ID, `${year}: downloading ${url}`);
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; YourPropertyGuide/1.0)" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(cachePath, buf);
  log(SOURCE_ID, `${year}: cached ${(buf.length / 1024 / 1024).toFixed(1)} MB → ${cachePath}`);
  return buf;
}

async function loadYear(year: number, opts: CliOptions): Promise<ParseResult> {
  const buf = await fetchYearZip(year, opts.useCache);
  const outerZip = new AdmZip(buf);
  const outerEntries = outerZip.getEntries();
  log(SOURCE_ID, `${year}: ${outerEntries.length} weekly ZIPs in outer archive`);

  const acc: ParseResult = {
    aggregate: { prices: new Map() },
    rows:      [],
  };
  let recordCount = 0;
  let weekCount   = 0;
  const captureRows = !opts.skipRows;

  for (const outerEntry of outerEntries) {
    if (!outerEntry.entryName.toLowerCase().endsWith(".zip")) continue;
    const innerBuf = outerZip.readFile(outerEntry);
    if (!innerBuf) continue;
    const innerZip = new AdmZip(innerBuf);
    for (const innerEntry of innerZip.getEntries()) {
      if (!innerEntry.entryName.toUpperCase().endsWith(".DAT")) continue;
      const text = innerZip.readAsText(innerEntry, "utf8");
      recordCount += parseDat(text, year, acc, captureRows, opts.limit);
    }
    weekCount++;
    if (weekCount % 10 === 0) log(SOURCE_ID, `  ${year}: ${weekCount}/${outerEntries.length} weeks, ${recordCount} valid rows so far`);
    if (opts.limit != null && acc.rows.length >= opts.limit) {
      log(SOURCE_ID, `  ${year}: row limit ${opts.limit} reached, stopping early`);
      break;
    }
  }

  log(SOURCE_ID, `${year}: parsed ${recordCount} valid rows · ${acc.aggregate.prices.size} suburb/postcode combos · ${acc.rows.length} captured rows`);
  return acc;
}

// ─── Row writer (COPY into temp table → INSERT ON CONFLICT) ─────────────────

/**
 * Bulk-write rows for a single year inside a single transaction.
 * Returns { inserted, skipped } where skipped = rows that conflicted on
 * (source, sourceRowKey) — i.e. already in the table from a previous run.
 */
async function writeRowsForYear(
  client:   PoolClient,
  year:     number,
  rows:     SaleRow[],
  runId:    string,
  dryRun:   boolean,
): Promise<{ inserted: number; skipped: number }> {
  if (rows.length === 0) return { inserted: 0, skipped: 0 };

  if (dryRun) {
    log(SOURCE_ID, `${year}: [dry-run] would insert ${rows.length} rows (runId=${runId.slice(0, 8)}…)`);
    return { inserted: 0, skipped: 0 };
  }

  const COPY_COLS = [
    "id", "source", "sourceRowKey", "rawHouseNumber", "rawUnitNumber", "rawStreetName",
    "rawLocality", "rawPostcode", "state", "runId",
    "contractDate", "settlementDate", "price",
    "area", "areaType", "natureCode", "zoning", "primaryPurpose", "dealingNumber",
    "createdAt",
  ];
  const colsQuoted = COPY_COLS.map((c) => `"${c}"`).join(",");

  await client.query("BEGIN");
  try {
    // Temp table only exists for the duration of this transaction.
    await client.query(`CREATE TEMP TABLE _propertysale_load (LIKE "PropertySale" INCLUDING DEFAULTS) ON COMMIT DROP`);

    const stream = client.query(copyFrom(`COPY _propertysale_load (${colsQuoted}) FROM STDIN WITH (FORMAT csv, NULL '\\N')`));

    const now = new Date();
    const csvLines = rows.map((r) => {
      const id = `psale_${randomUUID().replace(/-/g, "").slice(0, 24)}`;
      return [
        csvField(id),
        csvField(ROWS_SOURCE),
        csvField(r.sourceRowKey),
        csvField(r.rawHouseNumber),
        csvField(r.rawUnitNumber),
        csvField(r.rawStreetName),
        csvField(r.rawLocality),
        csvField(r.rawPostcode),
        csvField("NSW"),
        csvField(runId),
        csvField(r.contractDate),
        csvField(r.settlementDate),
        csvField(r.price),
        csvField(r.area),
        csvField(r.areaType),
        csvField(r.natureCode),
        csvField(r.zoning),
        csvField(r.primaryPurpose),
        csvField(r.dealingNumber),
        csvField(now),
      ].join(",");
    });

    await pipeline(Readable.from(csvLines.map((l) => l + "\n")), stream);

    const result = await client.query(`
      INSERT INTO "PropertySale" (${colsQuoted})
      SELECT ${colsQuoted} FROM _propertysale_load
      ON CONFLICT (source, "sourceRowKey") DO NOTHING
    `);

    await client.query("COMMIT");
    const inserted = result.rowCount ?? 0;
    const skipped  = rows.length - inserted;
    log(SOURCE_ID, `${year}: COPY+INSERT done · ${inserted} inserted · ${skipped} skipped (already present)`);
    return { inserted, skipped };
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    throw err;
  }
}

// ─── Aggregate writer (existing logic, untouched semantically) ──────────────

async function writeAggregate(
  currentYear: number,
  prevYear: number,
  current: YearAggregate,
  prev: YearAggregate,
  dryRun: boolean,
): Promise<number> {
  interface SuburbStats {
    medianHousePrice:  number | null;
    annualGrowthHouse: number | null;
    salesCountHouse:   number;
    daysOnMarket:      number | null;
  }
  const statsMap = new Map<string, SuburbStats>();

  for (const [key, curr] of current.prices) {
    const medianHouse = median(curr.prices);
    const prevEntry   = prev.prices.get(key);
    const prevHouse   = prevEntry ? median(prevEntry.prices) : null;
    const yoyHouse    = (medianHouse && prevHouse)
      ? Math.round(((medianHouse - prevHouse) / prevHouse) * 1000) / 10
      : null;

    statsMap.set(key, {
      medianHousePrice:  medianHouse,
      annualGrowthHouse: yoyHouse,
      salesCountHouse:   curr.prices.length,
      daysOnMarket:      median(curr.days),
    });
  }

  log(SOURCE_ID, `aggregate: stats for ${statsMap.size} NSW suburb/postcode combos`);

  const suburbs = await prisma.suburb.findMany({
    where: { state: "NSW" },
    select: { id: true, name: true, postcode: true },
  });

  interface UpdateRow {
    id:                string;
    medianHousePrice:  number;
    annualGrowthHouse: number | null;
    salesCountHouse:   number;
    daysOnMarket:      number | null;
  }
  const updates: UpdateRow[] = [];
  for (const s of suburbs) {
    const stats = statsMap.get(`${s.name.toUpperCase()}|${s.postcode}`);
    if (!stats?.medianHousePrice) continue;
    updates.push({
      id:                s.id,
      medianHousePrice:  stats.medianHousePrice,
      annualGrowthHouse: stats.annualGrowthHouse,
      salesCountHouse:   stats.salesCountHouse,
      daysOnMarket:      stats.daysOnMarket,
    });
  }
  log(SOURCE_ID, `aggregate: ${updates.length} NSW suburbs would be updated`);

  if (dryRun) {
    log(SOURCE_ID, `aggregate: [dry-run] no DB writes`);
    return 0;
  }

  if (updates.length > 0) {
    await prisma.$executeRaw`
      UPDATE "Suburb" AS s
      SET
        "medianHousePrice"  = u.median_house,
        "annualGrowthHouse" = CASE WHEN u.yoy_house    IS NOT NULL THEN u.yoy_house    ELSE s."annualGrowthHouse" END,
        "salesCountHouse"   = u.sales_count,
        "daysOnMarket"      = CASE WHEN u.days_on_mkt  IS NOT NULL THEN u.days_on_mkt  ELSE s."daysOnMarket"      END,
        "statsSource"       = 'sales-nsw',
        "statsUpdatedAt"    = NOW(),
        "salesUpdatedAt"    = NOW()
      FROM UNNEST(
        ${updates.map((u) => u.id)}::text[],
        ${updates.map((u) => u.medianHousePrice)}::int[],
        ${updates.map((u) => u.annualGrowthHouse)}::float8[],
        ${updates.map((u) => u.salesCountHouse)}::int[],
        ${updates.map((u) => u.daysOnMarket)}::int[]
      ) AS u(id, median_house, yoy_house, sales_count, days_on_mkt)
      WHERE s.id = u.id
    `;
  }
  return updates.length;
}

// ─── Pre-flight assertions ──────────────────────────────────────────────────

async function preflight(): Promise<void> {
  // Confirm we're connected to a DB that has the expected baseline.
  const gnafCount = await prisma.propertyAddress.count({ where: { state: "NSW" } });
  if (gnafCount < 100_000) {
    throw new Error(
      `Pre-flight failed: only ${gnafCount} NSW PropertyAddress rows found. ` +
      `Expected ≥ 100k. Wrong DB or G-NAF not yet imported?`
    );
  }
  log(SOURCE_ID, `pre-flight: ${gnafCount.toLocaleString()} NSW G-NAF addresses ✓`);

  // Confirm PropertySale table exists and has expected columns
  const sample = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*)::bigint AS count FROM "PropertySale" WHERE state = 'NSW'
  `;
  log(SOURCE_ID, `pre-flight: ${sample[0].count} existing NSW PropertySale rows ✓`);
}

// ─── Orchestrator ───────────────────────────────────────────────────────────

export async function run(): Promise<void> {
  const opts = parseCli();
  await startSync(SOURCE_ID);
  log(SOURCE_ID, `options: ${JSON.stringify(opts)}`);

  // Default years: last full calendar year + the year before (for YoY)
  const now = new Date();
  const currentYear = now.getFullYear() - 1;
  const prevYear    = currentYear - 1;
  const yearsToLoad = opts.years ?? [currentYear, prevYear];
  const runId       = randomUUID();
  log(SOURCE_ID, `runId=${runId} · years=[${yearsToLoad.join(", ")}]`);

  let totalInserted = 0;
  let totalSkipped  = 0;
  let suburbsUpdated = 0;

  // Separate pg.Pool dedicated to bulk loads — does not share Prisma's connection budget.
  const pool = new Pool({ connectionString: process.env.DATABASE_URL!, max: 1 });

  try {
    await preflight();

    // Download + parse each year. Cached to disk so re-runs don't re-download.
    const yearResults = new Map<number, ParseResult>();
    for (const year of yearsToLoad) {
      yearResults.set(year, await loadYear(year, opts));
    }

    // ── Row writer (per-year transactions, isolated from aggregate) ──
    if (!opts.skipRows) {
      const client = await pool.connect();
      try {
        for (const year of yearsToLoad) {
          const result = yearResults.get(year)!;
          try {
            const { inserted, skipped } = await writeRowsForYear(client, year, result.rows, runId, opts.dryRun);
            totalInserted += inserted;
            totalSkipped  += skipped;
          } catch (err) {
            // Per-year failure: log but continue. Earlier years stay committed.
            log(SOURCE_ID, `${year}: ROW WRITE FAILED — ${err instanceof Error ? err.message : String(err)}`);
            log(SOURCE_ID, `${year}: continuing with remaining years; this year can be retried later`);
          }
        }
      } finally {
        client.release();
      }
    } else {
      log(SOURCE_ID, `--skip-rows set: row capture disabled`);
    }

    // ── Aggregate (existing path) — only when we have current+prev pair ──
    if (!opts.skipAggregate) {
      const current = yearResults.get(currentYear);
      const prev    = yearResults.get(prevYear);
      if (current && prev) {
        suburbsUpdated = await writeAggregate(currentYear, prevYear, current.aggregate, prev.aggregate, opts.dryRun);
      } else {
        log(SOURCE_ID, `aggregate: skipped (current+prev pair not in --years)`);
      }
    } else {
      log(SOURCE_ID, `--skip-aggregate set: suburb median update disabled`);
    }

    // ── Post-flight summary ──
    log(SOURCE_ID, `summary: ${totalInserted} rows inserted · ${totalSkipped} skipped (dupe) · ${suburbsUpdated} suburbs updated`);
    log(SOURCE_ID, `to undo this run's row writes: DELETE FROM "PropertySale" WHERE "runId" = '${runId}'`);

    await finishSync(SOURCE_ID, suburbsUpdated + totalInserted, new Date(`${Math.max(...yearsToLoad)}-12-31`));
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  } finally {
    await pool.end();
  }
}
