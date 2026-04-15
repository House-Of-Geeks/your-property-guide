/**
 * Syncs suburb statistics from ABS Census 2021 data.
 *
 * Data sources (all free, no API key required):
 *   G02 - Selected medians and averages by Postal Area (POA)
 *     → medianAge, medianRentHouse, medianRentUnit, medianHousePrice (derived)
 *   G01 - Selected person characteristics by Postal Area (POA)
 *     → population
 *
 * Matching strategy: suburb.postcode → ABS POA code.
 * Multiple suburbs in the same postcode receive identical stats.
 *
 * medianHousePrice is derived from median monthly mortgage repayment
 * (a rough estimate — ABS does not publish sale prices at suburb level).
 * Formula: mortgage_monthly × MORTGAGE_TO_PRICE_FACTOR (calibrated to
 * 2021 median rates ~2.5%, 80% LVR, 30yr loan).
 *
 * Run:   npx tsx scripts/seed/sync-suburb-stats-abs.ts
 * Flags: --dry-run   Print changes without writing to DB
 *        --state QLD  Only process suburbs in a specific state
 *
 * Pipeline: re-run after each ABS Census release (every ~5 years).
 * Update CENSUS_YEAR constant to match the new dataset ID.
 */
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

// ─── Config ───────────────────────────────────────────────────────────────────
const CENSUS_YEAR  = "2021";
const SOURCE_LABEL = `abs-census-${CENSUS_YEAR}`;

// Derived house price = median_monthly_mortgage × factor
// Calibrated for 2021 low-rate environment (~2.5% p.a., 80% LVR, 30yr loan)
const MORTGAGE_TO_PRICE_FACTOR = 220;

const ABS_BASE = "https://api.data.abs.gov.au";
const ACCEPT   = "application/vnd.sdmx.data+json;version=2.0.0";

// ABS numeric state ID → state abbreviation
const ABS_STATE_ID_TO_ABBREV: Record<string, string> = {
  "1": "NSW", "2": "VIC", "3": "QLD", "4": "SA",
  "5": "WA",  "6": "TAS", "7": "NT",  "8": "ACT",
};

// Build state abbrev → index map from a dataset's stateDim
// (order differs between datasets — must be derived dynamically)
function buildStateIdx(stateDim: { id: string; name: string }[]): Record<string, number> {
  const map: Record<string, number> = {};
  stateDim.forEach((s, i) => {
    const abbrev = ABS_STATE_ID_TO_ABBREV[s.id];
    if (abbrev) map[abbrev] = i;
  });
  return map;
}

// ─── CLI args ─────────────────────────────────────────────────────────────────
const args       = process.argv.slice(2);
const DRY_RUN    = args.includes("--dry-run");
const stateArg   = args.find((a) => a.startsWith("--state"))?.split("=")[1]
                 ?? (args[args.indexOf("--state") + 1] !== undefined && !args[args.indexOf("--state") + 1].startsWith("--")
                     ? args[args.indexOf("--state") + 1]
                     : null);

// ─── DB ───────────────────────────────────────────────────────────────────────
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db      = new PrismaClient({ adapter });

// ─── ABS fetch helpers ────────────────────────────────────────────────────────
async function fetchAbsDataset(datasetId: string): Promise<{
  regionDim: { id: string; name: string }[];
  stateDim:  { id: string; name: string }[];
  meavgDim?: { id: string; name: string }[];
  pcharDim?: { id: string; name: string }[];
  sexpDim?:  { id: string; name: string }[];
  series:    Record<string, { observations: Record<string, number[][]> }>;
}> {
  const url = `${ABS_BASE}/data/ABS,${datasetId},1.0.0/all?startPeriod=${CENSUS_YEAR}&endPeriod=${CENSUS_YEAR}`;
  console.log(`  Fetching ${datasetId}…`);
  const res  = await fetch(url, { headers: { Accept: ACCEPT } });
  if (!res.ok) throw new Error(`ABS fetch failed: ${res.status} ${res.url}`);

  const data   = await res.json() as Record<string, unknown>;
  const struct = (data.data as Record<string, unknown[]>).structures[0] as Record<string, unknown>;
  const ds     = (data.data as Record<string, unknown[]>).dataSets[0] as Record<string, unknown>;

  const dims    = struct.dimensions as Record<string, unknown[]>;
  const seriesDims = dims.series as { id: string; values: { id: string; name: string }[] }[];

  const regionDim = (seriesDims.find((d) => d.id === "REGION")?.values ?? []);
  const stateDim  = (seriesDims.find((d) => d.id === "STATE")?.values ?? []);
  const meavgDim  = (seriesDims.find((d) => d.id === "MEDAVG")?.values ?? []);
  const pcharDim  = (seriesDims.find((d) => d.id === "PCHAR")?.values ?? []);
  const sexpDim   = (seriesDims.find((d) => d.id === "SEXP")?.values ?? []);

  return {
    regionDim,
    stateDim,
    meavgDim: meavgDim.length ? meavgDim : undefined,
    pcharDim: pcharDim.length ? pcharDim : undefined,
    sexpDim:  sexpDim.length  ? sexpDim  : undefined,
    series:   ds.series as Record<string, { observations: Record<string, number[][]> }>,
  };
}

function getObs(
  series:     Record<string, { observations: Record<string, number[][]> }>,
  key: string,
): number | null {
  const row = series[key];
  if (!row) return null;
  const obs = Object.values(row.observations ?? {});
  return obs.length ? obs[0][0] : null;
}

// G02 key: MEDAVG:REGION:REGION_TYPE:STATE
function g02Key(medavgIdx: number, regionIdx: number, stateIdx: number) {
  return `${medavgIdx}:${regionIdx}:0:${stateIdx}`;
}

// G01 key: SEXP:PCHAR:REGION:REGION_TYPE:STATE (extra SEXP dimension)
function g01Key(sexpIdx: number, pcharIdx: number, regionIdx: number, stateIdx: number) {
  return `${sexpIdx}:${pcharIdx}:${regionIdx}:0:${stateIdx}`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`ABS Census ${CENSUS_YEAR} suburb stats sync${DRY_RUN ? " (DRY RUN)" : ""}`);
  if (stateArg) console.log(`Filtering to state: ${stateArg}`);

  // 1. Fetch ABS datasets
  const [g02, g01] = await Promise.all([
    fetchAbsDataset("C21_G02_POA"),
    fetchAbsDataset("C21_G01_POA"),
  ]);

  // Build postcode → region index maps
  const g02PoaMap: Record<string, number> = {};
  g02.regionDim.forEach((r, i) => { g02PoaMap[r.id] = i; });

  const g01PoaMap: Record<string, number> = {};
  g01.regionDim.forEach((r, i) => { g01PoaMap[r.id] = i; });

  // Build per-dataset state index maps (order differs between datasets)
  const g02StateIdx = buildStateIdx(g02.stateDim);
  const g01StateIdx = buildStateIdx(g01.stateDim);

  // G01 PCHAR index for total persons, and SEXP index for "Persons" (not Male/Female)
  const totalPersonsIdx = g01.pcharDim?.findIndex((v) => v.id === "P_1") ?? 13;
  const g01PersonsSexIdx = g01.sexpDim?.findIndex((v) => v.id === "3") ?? 1; // "3" = Persons

  // G02 MEDAVG indices
  const MEDAVG = {
    age:       0,  // Median age of persons
    mortgage:  4,  // Median mortgage repayment ($/monthly)
    rent:      5,  // Median rent ($/weekly)
  };

  // 2. Load all suburbs from DB
  // --resume: skip suburbs already synced (statsSource = SOURCE_LABEL)
  const resume   = args.includes("--resume");
  const whereClause = {
    ...(stateArg ? { state: stateArg.toUpperCase() } : {}),
    ...(resume   ? { NOT: { statsSource: SOURCE_LABEL } } : {}),
  };

  const suburbs = await db.suburb.findMany({
    where: whereClause,
    select: { slug: true, postcode: true, state: true },
    orderBy: { slug: "asc" },
  });

  console.log(`\nProcessing ${suburbs.length} suburbs…\n`);

  // Cache per-postcode results to avoid repeated lookups
  const cache: Record<string, {
    medianAge:         number | null;
    medianRentWeekly:  number | null;
    mortgageMonthly:   number | null;
    population:        number | null;
  }> = {};

  let updated = 0;
  let skipped = 0;
  let noData  = 0;

  for (const suburb of suburbs) {
    const { slug, postcode, state } = suburb;

    if (!cache[postcode]) {
      const regionIdxG02 = g02PoaMap[postcode] ?? -1;
      const regionIdxG01 = g01PoaMap[postcode] ?? -1;
      const g02Si = g02StateIdx[state] ?? -1;
      const g01Si = g01StateIdx[state] ?? -1;

      if (regionIdxG02 === -1 || g02Si === -1) {
        cache[postcode] = { medianAge: null, medianRentWeekly: null, mortgageMonthly: null, population: null };
      } else {
        const medianAge        = getObs(g02.series, g02Key(MEDAVG.age,      regionIdxG02, g02Si));
        const medianRentWeekly = getObs(g02.series, g02Key(MEDAVG.rent,     regionIdxG02, g02Si));
        const mortgageMonthly  = getObs(g02.series, g02Key(MEDAVG.mortgage, regionIdxG02, g02Si));
        const population       = (regionIdxG01 !== -1 && g01Si !== -1)
          ? getObs(g01.series, g01Key(g01PersonsSexIdx, totalPersonsIdx, regionIdxG01, g01Si))
          : null;
        cache[postcode] = { medianAge, medianRentWeekly, mortgageMonthly, population };
      }
    }

    const c = cache[postcode];

    if (c.medianRentWeekly === null && c.medianAge === null && c.population === null) {
      noData++;
      continue;
    }

    // Derive house price from mortgage repayment if available
    const derivedHousePrice = c.mortgageMonthly
      ? Math.round(c.mortgageMonthly * MORTGAGE_TO_PRICE_FACTOR / 1000) * 1000
      : null;

    if (DRY_RUN) {
      console.log(`  ${slug}: age=${c.medianAge} rent=$${c.medianRentWeekly}/wk price≈$${derivedHousePrice?.toLocaleString()} pop=${c.population}`);
      updated++;
      continue;
    }

    await db.suburb.update({
      where: { slug },
      data: {
        ...(c.medianAge        != null ? { medianAge:        c.medianAge        } : {}),
        ...(c.medianRentWeekly != null ? { medianRentHouse:  c.medianRentWeekly,
                                           medianRentUnit:   Math.round(c.medianRentWeekly * 0.85) } : {}),
        ...(c.population       != null ? { population:       c.population       } : {}),
        ...(derivedHousePrice  != null ? { medianHousePrice: derivedHousePrice,
                                           medianUnitPrice:  Math.round(derivedHousePrice * 0.72) } : {}),
        statsSource:    SOURCE_LABEL,
        statsUpdatedAt: new Date(),
        ...(c.medianRentWeekly != null ? { rentalUpdatedAt: new Date() } : {}),
      },
    });

    updated++;
    if (updated % 500 === 0) {
      console.log(`  ✅ ${updated}/${suburbs.length} updated…`);
    }
    // Reconnect every 1000 writes to avoid Railway socket timeout
    if (updated % 1000 === 0) {
      await db.$disconnect();
      await db.$connect();
    }
  }

  console.log(`\n✅ Done.`);
  console.log(`   Updated:  ${updated}`);
  console.log(`   No data:  ${noData}`);
  console.log(`   Skipped:  ${skipped}`);
  console.log(`\n   Source:   ABS Census ${CENSUS_YEAR} (G02 + G01 by Postal Area)`);
  console.log(`   Next run: After ABS Census ${parseInt(CENSUS_YEAR) + 5} release`);
  await db.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
