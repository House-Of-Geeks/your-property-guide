// Read-only analysis for the Winter 2026 data report blog post.
//
// Pulls trusted suburb medians from the prod DB (SELECT only), classifies
// them into greater-capital areas via the shared postcode metro map, and
// prints the aggregate tables the report bakes in. Reuses the site's own
// trust gates so the report can never publish a number the site itself
// would refuse to show.
//
// Usage: DATABASE_URL=... npx tsx scripts/seo/winter-2026-report-data.ts

import pg from "pg";
import { CAPITAL_CITIES } from "../../src/lib/utils/metro";
import {
  isReliableSalesSource,
  MAX_PLAUSIBLE_ANNUAL_GROWTH,
} from "../../src/lib/suburb-data-quality";

const MIN_POPULATION = 750; // skip ghost suburbs / tiny localities
const MIN_PRICE = 150_000; // junk-row floor

// CBD-core postcodes are apartment-dominated markets where a "house"
// median is a tiny-sample artifact (Melbourne 3000 "$381k houses").
// Excluded from cheapest-house rankings; stated in the methodology.
const CBD_CORE: [number, number][] = [
  [2000, 2011], // Sydney core + inner harbourside
  [3000, 3010], // Melbourne CBD/Southbank/Docklands
  [4000, 4006], // Brisbane CBD + Fortitude Valley
  [5000, 5006], // Adelaide core
  [6000, 6005], // Perth core
  [7000, 7000], // Hobart core
  [800, 820], // Darwin core
];

function isCbdCore(postcode: string): boolean {
  const pc = Number.parseInt(postcode, 10);
  if (Number.isNaN(pc)) return false;
  return CBD_CORE.some(([lo, hi]) => pc >= lo && pc <= hi);
}

interface Row {
  slug: string;
  name: string;
  state: string;
  postcode: string;
  price: number;
  rent: number;
  growth: number;
  population: number;
  statsSource: string;
}

function capitalFor(postcode: string): string | null {
  const pc = Number.parseInt(postcode, 10);
  if (Number.isNaN(pc)) return null;
  for (const city of CAPITAL_CITIES) {
    if (city.ranges.some(([lo, hi]) => pc >= lo && pc <= hi)) return city.slug;
  }
  return null;
}

async function main() {
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    statement_timeout: 60_000,
  });
  await client.connect();

  const res = await client.query(`
    SELECT slug, name, state, postcode,
           "medianHousePrice" AS price,
           "medianRentHouse"  AS rent,
           "annualGrowthHouse" AS growth,
           population, "statsSource"
    FROM "Suburb"
    WHERE "medianHousePrice" > 0
  `);
  await client.end();

  const all: Row[] = res.rows;
  const trusted = all.filter(
    (r) =>
      isReliableSalesSource(r.statsSource) &&
      r.price >= MIN_PRICE &&
      r.population >= MIN_POPULATION,
  );

  const byState = new Map<string, Row[]>();
  const byCapital = new Map<string, Row[]>();
  for (const r of trusted) {
    byState.set(r.state, [...(byState.get(r.state) ?? []), r]);
    const cap = capitalFor(r.postcode);
    if (cap) byCapital.set(cap, [...(byCapital.get(cap) ?? []), r]);
  }

  const fmt = (r: Row) =>
    `${r.name} (${r.state} ${r.postcode}) slug=${r.slug} $${r.price.toLocaleString()} pop=${r.population} rent=$${r.rent}/wk growth=${r.growth}%`;

  console.log(`TOTAL rows with price>0: ${all.length}`);
  console.log(`TRUSTED (source+pop+price gates): ${trusted.length}`);
  console.log(
    `BY STATE: ${[...byState.entries()].map(([s, rows]) => `${s}=${rows.length}`).join(", ")}`,
  );

  // Price-only report: rental freshness isn't provenance-gated the way
  // sales are, so rent/yield tables stay out until that's verified.
  //
  // Apartment-artifact screen for capital rankings: in a metro house
  // market an implied gross yield above ~5.5% almost always means the
  // "house" median is really an apartment-dominated SA2 (ACT town
  // centres, CBD fringes). Regional rows are exempt — cheap regional
  // towns genuinely yield that much.
  const looksApartmentSkewed = (r: Row) =>
    r.rent > 0 && ((r.rent * 52) / r.price) * 100 > 5.5;

  for (const city of CAPITAL_CITIES) {
    const rows = (byCapital.get(city.slug) ?? []).filter(
      (r) => !isCbdCore(r.postcode) && !looksApartmentSkewed(r),
    );
    if (rows.length === 0) {
      console.log(`\n=== ${city.name}: NO TRUSTED ROWS ===`);
      continue;
    }
    const cheapest = [...rows].sort((a, b) => a.price - b.price).slice(0, 14);
    const under600 = rows.filter((r) => r.price < 600_000).length;
    const under500 = rows.filter((r) => r.price < 500_000).length;
    const under700 = rows.filter((r) => r.price < 700_000).length;

    console.log(`\n=== ${city.name} (${rows.length} trusted non-CBD-core suburbs) ===`);
    console.log(`  under $500k: ${under500}   under $600k: ${under600}   under $700k: ${under700}`);
    console.log(`  CHEAPEST:`);
    for (const r of cheapest) console.log(`    ${fmt(r)}`);
  }

  // Regional value: cheapest trusted suburbs OUTSIDE any greater capital,
  // with a stronger population floor so we're naming real towns.
  const regional = trusted
    .filter((r) => capitalFor(r.postcode) === null && r.population >= 2000 && !isCbdCore(r.postcode))
    .sort((a, b) => a.price - b.price)
    .slice(0, 15);
  console.log(`\n=== CHEAPEST REGIONAL (pop >= 2000, outside greater capitals) ===`);
  for (const r of regional) console.log(`  ${fmt(r)}`);

  const plausible = trusted.filter(
    (r) => Math.abs(r.growth) <= MAX_PLAUSIBLE_ANNUAL_GROWTH && r.growth !== 0,
  );
  const risers = [...plausible].sort((a, b) => b.growth - a.growth).slice(0, 15);
  const fallers = [...plausible]
    .filter((r) => r.growth < 0)
    .sort((a, b) => a.growth - b.growth)
    .slice(0, 15);

  console.log(`\n=== NATIONAL RISERS (plausible growth, n=${plausible.length}) ===`);
  for (const r of risers) console.log(`  ${fmt(r)}`);
  console.log(`\n=== NATIONAL FALLERS ===`);
  for (const r of fallers) console.log(`  ${fmt(r)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
