/**
 * Suburb Stub Importer
 *
 * Creates minimal Suburb records from crime + rental stats that already exist
 * in the DB. This allows sync data to link to suburb pages via suburbSlug.
 *
 * Only creates stubs for suburbs that have stats but no matching Suburb row yet.
 * Existing hand-crafted seed suburbs are left unchanged.
 *
 * Generated slug format: {name-lowercase-hyphenated}-{state-lowercase}-{postcode}
 * For stats with no postcode, uses the name+state slug-matcher fallback.
 */
import "dotenv/config";
import { randomUUID } from "crypto";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";

const SOURCE_ID = "import-suburbs";

function makeSlug(name: string, state: string, postcode: string): string {
  const namePart = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${namePart}-${state.toLowerCase()}-${postcode}`;
}

function titleCase(s: string): string {
  return s.toLowerCase().replace(/(?:^|\s|-|')\S/g, (c) => c.toUpperCase());
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    // Collect unique (name, state, postcode) from crime stats (has postcodes for SA, VIC)
    const crimeSuburbs = await prisma.suburbCrimeStat.findMany({
      where: {
        postcode: { not: null },
        state:    { in: ["SA", "VIC"] },
      },
      select:  { suburbName: true, state: true, postcode: true },
      distinct: ["suburbName", "state", "postcode"],
    });

    // Also collect from NSW crime (no postcodes — use empty string, will be name+state matched)
    const nswCrimeSuburbs = await prisma.suburbCrimeStat.findMany({
      where:   { state: "NSW" },
      select:  { suburbName: true, state: true },
      distinct: ["suburbName", "state"],
    });

    // Build a combined list, deduplicated by slug
    const toCreate = new Map<string, { name: string; state: string; postcode: string }>();

    for (const row of crimeSuburbs) {
      const postcode = row.postcode ?? "";
      const slug = makeSlug(row.suburbName, row.state, postcode);
      if (!toCreate.has(slug)) {
        toCreate.set(slug, { name: row.suburbName, state: row.state, postcode });
      }
    }

    for (const row of nswCrimeSuburbs) {
      // NSW crime stats have no postcode — use name+state slug; leave postcode empty
      // These can only be resolved by the name+state slug-matcher fallback
      // BUT: since the slug includes no postcode, we need to look up postcodes from ABS
      // For now: skip NSW stubs (would create slugs without postcodes that pages can't route to)
      void row;
    }

    log(SOURCE_ID, `found ${toCreate.size} suburbs to potentially stub`);

    // Fetch existing slugs to avoid overwriting seed data
    const existingSlugs = new Set(
      (await prisma.suburb.findMany({ select: { slug: true } })).map((r) => r.slug)
    );

    const regionMap: Record<string, string> = {
      SA: "South Australia",
      VIC: "Victoria",
      NSW: "New South Wales",
      QLD: "Queensland",
      WA: "Western Australia",
      TAS: "Tasmania",
      NT: "Northern Territory",
      ACT: "Australian Capital Territory",
    };

    const newSuburbs = [...toCreate.entries()]
      .filter(([slug]) => !existingSlugs.has(slug))
      .map(([slug, { name, state, postcode }]) => {
        const region = regionMap[state] ?? state;
        return {
          id:               randomUUID(),
          slug,
          name:             titleCase(name),
          postcode,
          state,
          region,
          description:      `${titleCase(name)} is a suburb in ${region}.`,
          heroImage:        "/images/suburbs/default.jpg",
          medianHousePrice: 0,
          medianUnitPrice:  0,
          medianRentHouse:  0,
          medianRentUnit:   0,
          annualGrowthHouse: 0,
          annualGrowthUnit:  0,
          daysOnMarket:     0,
          population:       0,
          medianAge:        0,
          ownerOccupied:    0,
          renterOccupied:   0,
          amenities:        [] as string[],
          transportLinks:   [] as string[],
          nearbySuburbs:    [] as string[],
          statsSource:      "stub",
        };
      });

    const skipped = toCreate.size - newSuburbs.length;

    // Batch insert in chunks of 500
    const CHUNK = 500;
    let created = 0;
    for (let i = 0; i < newSuburbs.length; i += CHUNK) {
      const chunk = newSuburbs.slice(i, i + CHUNK);
      const result = await prisma.suburb.createMany({ data: chunk, skipDuplicates: true });
      created += result.count;
    }

    log(SOURCE_ID, `created ${created} suburb stubs, skipped ${skipped} existing`);

    // Fix null slugs on stats tables using a single SQL UPDATE per table.
    // Match postcode first; fall back to name+state when suburb name is unique within state.

    // Pre-compute: suburbs where name+state is unique (for fallback matching)
    // uniqueSuburbs CTE: (lower_name, lower_state, slug) for suburbs with unique name+state
    const uniqueSuburbsCte = `
      unique_suburbs AS (
        SELECT LOWER(name) AS lname, LOWER(state) AS lstate, MIN(slug) AS slug
        FROM   "Suburb"
        GROUP  BY LOWER(name), LOWER(state)
        HAVING COUNT(*) = 1
      )
    `;

    // Rental: exact postcode match (only when postcode is non-empty)
    const rentalExact = await prisma.$executeRawUnsafe(`
      UPDATE "SuburbRentalStat" rs
      SET    "suburbSlug" = s.slug
      FROM   "Suburb" s
      WHERE  rs."suburbSlug" IS NULL
        AND  LOWER(rs."suburbName") = LOWER(s.name)
        AND  LOWER(rs.state)        = LOWER(s.state)
        AND  rs.postcode IS NOT NULL AND rs.postcode != ''
        AND  rs.postcode = s.postcode
    `);
    log(SOURCE_ID, `rental exact-match fix: ${rentalExact} rows`);

    // Rental: name+state fallback for rows still unmatched
    const rentalFallback = await prisma.$executeRawUnsafe(`
      WITH ${uniqueSuburbsCte}
      UPDATE "SuburbRentalStat" rs
      SET    "suburbSlug" = u.slug
      FROM   unique_suburbs u
      WHERE  rs."suburbSlug" IS NULL
        AND  LOWER(rs."suburbName") = u.lname
        AND  LOWER(rs.state)        = u.lstate
    `);
    log(SOURCE_ID, `rental fallback fix: ${rentalFallback} rows`);

    // Crime: exact postcode match
    const crimeExact = await prisma.$executeRawUnsafe(`
      UPDATE "SuburbCrimeStat" cs
      SET    "suburbSlug" = s.slug
      FROM   "Suburb" s
      WHERE  cs."suburbSlug" IS NULL
        AND  LOWER(cs."suburbName") = LOWER(s.name)
        AND  LOWER(cs.state)        = LOWER(s.state)
        AND  cs.postcode IS NOT NULL AND cs.postcode != ''
        AND  cs.postcode = s.postcode
    `);
    log(SOURCE_ID, `crime exact-match fix: ${crimeExact} rows`);

    // Crime: name+state fallback
    const crimeFallback = await prisma.$executeRawUnsafe(`
      WITH ${uniqueSuburbsCte}
      UPDATE "SuburbCrimeStat" cs
      SET    "suburbSlug" = u.slug
      FROM   unique_suburbs u
      WHERE  cs."suburbSlug" IS NULL
        AND  LOWER(cs."suburbName") = u.lname
        AND  LOWER(cs.state)        = u.lstate
    `);
    log(SOURCE_ID, `crime fallback fix: ${crimeFallback} rows`);

    await finishSync(SOURCE_ID, created);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
