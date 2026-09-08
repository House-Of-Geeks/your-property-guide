// Read-only: the gross-yield benchmarks behind the rental yield calculator's
// "good yield" and "highest yield by state" tables (fix item 15). Prints the
// TypeScript data file to stdout; redirect it into src/lib/data/yield-benchmarks.ts
// and commit, so the calculator page stays static (the build has no database).
//
//   DATABASE_URL=<prod, connection_limit=1> npx tsx scripts/seo/yield-benchmarks.ts > src/lib/data/yield-benchmarks.ts
//
// Gate, the same as the suburb pages: a sales median from a suburb-level or
// SA2 feed (sales-nsw, sales-vic, sales-sa, sales-abs) built on 5+ sales where
// the count is known, and a rent from a bond-data feed: the suburb's newest
// SuburbRentalStat row, as the pages read it (the SA feed does not write
// through to the Suburb columns, which are stale there).
// Unit yields only where the state's sales feed publishes unit medians
// (VIC, SA and the ABS states); NSW unit prices predate the feeds and are
// left out. Yields above 20% are treated as data errors, as on the pages.
import "dotenv/config";
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { CAPITAL_CITIES } from "../../src/lib/utils/metro";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
const RELIABLE = ["sales-nsw", "sales-vic", "sales-sa", "sales-abs"];
const UNIT_PRICE_STATES = new Set(["VIC", "SA", "QLD", "WA", "TAS", "NT", "ACT"]);
const MAX_YIELD = 20;
// Cities the tables leave out, with the reason the page prints. Perth, Hobart,
// Canberra and Darwin have no bond-data rental feed on this site; Adelaide's
// sales medians are under review (Elizabeth at $697,500 and a median of
// suburb medians of $1.05M on 8 Sep 2026 do not match the market).
const WITHHELD_CITIES: Record<string, string> = {
  perth: "no bond-data rental feed on this site yet",
  hobart: "no bond-data rental feed on this site yet",
  canberra: "no bond-data rental feed on this site yet",
  darwin: "no bond-data rental feed on this site yet",
  adelaide: "South Australian sales medians under review",
};
const pad4 = (n: number) => String(n).padStart(4, "0");
const yieldOf = (rent: number, price: number) => (rent > 0 && price > 0 ? Math.round(((rent * 52) / price) * 1000) / 10 : null);
const median = (v: number[]) => { if (!v.length) return null; const s = [...v].sort((a, b) => a - b); const m = Math.floor(s.length / 2); return Math.round((s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2) * 10) / 10; };

async function main() {
  const rentRows = await prisma.suburbRentalStat.findMany({ where: { suburbSlug: { not: null } }, orderBy: [{ periodDate: "desc" }, { updatedAt: "desc" }], select: { suburbSlug: true, medianRentHouse: true, medianRentUnit: true } });
  const latestRent = new Map<string, { house: number; unit: number }>();
  for (const r of rentRows) if (!latestRent.has(r.suburbSlug as string)) latestRent.set(r.suburbSlug as string, { house: r.medianRentHouse ?? 0, unit: r.medianRentUnit ?? 0 });
  const rows = await prisma.suburb.findMany({
    where: { statsSource: { in: RELIABLE }, medianHousePrice: { gt: 0 } },
    select: { slug: true, name: true, state: true, postcode: true, population: true, medianHousePrice: true, medianUnitPrice: true, medianRentHouse: true, medianRentUnit: true, salesCountHouse: true, statsSource: true },
  });
  const gated = rows.filter((r) => latestRent.has(r.slug) && (!r.salesCountHouse || r.salesCountHouse >= 5))
    .map((r) => ({ ...r, medianRentHouse: latestRent.get(r.slug)!.house, medianRentUnit: latestRent.get(r.slug)!.unit }));
  const withYield = gated.map((r) => ({ ...r, houseYield: yieldOf(r.medianRentHouse, r.medianHousePrice), unitYield: UNIT_PRICE_STATES.has(r.state) ? yieldOf(r.medianRentUnit, r.medianUnitPrice) : null }))
    .map((r) => ({ ...r, houseYield: r.houseYield !== null && r.houseYield <= MAX_YIELD ? r.houseYield : null, unitYield: r.unitYield !== null && r.unitYield <= MAX_YIELD ? r.unitYield : null }));

  const cities = CAPITAL_CITIES.map((c) => {
    const inCity = withYield.filter((r) => r.state === c.state && c.ranges.some(([lo, hi]) => r.postcode >= pad4(lo) && r.postcode <= pad4(hi)));
    const h = inCity.map((r) => r.houseYield).filter((y): y is number => y !== null);
    const u = inCity.map((r) => r.unitYield).filter((y): y is number => y !== null);
    const withheld = WITHHELD_CITIES[c.slug] ?? null;
    return { slug: c.slug, name: c.name, state: c.state, houseYield: withheld ? null : median(h), houseSuburbs: withheld ? 0 : h.length, unitYield: withheld ? null : median(u), unitSuburbs: withheld ? 0 : u.length, withheld };
  });
  // NSW rents are published by postcode, so a suburb-level ranking there
  // pairs a postcode rent with one suburb's price; NSW stays out of the list.
  const RANKED_STATES = ["VIC", "QLD"];
  const states = RANKED_STATES.filter((st) => withYield.some((r) => r.state === st)).map((state) => {
    const seen = new Set<string>();
    const top = withYield.filter((r) => r.state === state && r.houseYield !== null && r.population >= 1000)
      .sort((a, b) => (b.houseYield as number) - (a.houseYield as number))
      .filter((r) => { const k = r.name.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; })
      .slice(0, 5)
      .map((r) => ({ slug: r.slug, name: r.name, postcode: r.postcode, houseYield: r.houseYield as number, rent: r.medianRentHouse, price: r.medianHousePrice }));
    return { state, top };
  });
  const sources = await prisma.dataSource.findMany({ where: { id: { in: [...RELIABLE, "rental-nsw", "rental-vic", "rental-qld", "rental-sa"] } }, select: { id: true, dataAsOf: true } });
  const asOf = Object.fromEntries(sources.map((s) => [s.id, s.dataAsOf?.toISOString().slice(0, 10) ?? null]));
  const generated = new Date().toISOString().slice(0, 10);

  process.stdout.write(`// Generated by scripts/seo/yield-benchmarks.ts on ${generated} from production data. Do not edit by hand;
// regenerate after the quarterly syncs. Gate: sales median from a suburb-level or SA2 feed on 5+ sales,
// rent from a bond-data feed, yields above ${MAX_YIELD}% dropped; unit yields only where the state's sales
// feed publishes unit medians. Method line for the page lives in the component.
export const YIELD_BENCHMARKS_AS_OF = ${JSON.stringify(generated)};
export const YIELD_SOURCE_DATES: Record<string, string | null> = ${JSON.stringify(asOf)};
export interface CityYield { slug: string; name: string; state: string; houseYield: number | null; houseSuburbs: number; unitYield: number | null; unitSuburbs: number; withheld: string | null }
export const CITY_YIELDS: CityYield[] = ${JSON.stringify(cities, null, 2)};
export interface TopYieldSuburb { slug: string; name: string; postcode: string; houseYield: number; rent: number; price: number }
export const TOP_YIELD_BY_STATE: { state: string; top: TopYieldSuburb[] }[] = ${JSON.stringify(states, null, 2)};
`);
  console.error(`gated suburbs: ${gated.length} of ${rows.length} priced; cities: ${cities.map((c) => `${c.name} h${c.houseYield ?? "-"}%/${c.houseSuburbs} u${c.unitYield ?? "-"}%/${c.unitSuburbs}`).join(", ")}`);
}
main().finally(() => prisma.$disconnect());
