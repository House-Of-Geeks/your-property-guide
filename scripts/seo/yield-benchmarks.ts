// Read-only: the gross-yield benchmarks behind "What is a good rental yield
// in 2026?" on /rental-yield-calculator (commercial intent review, 30 Sep
// 2026, section 3.3; tracker item 15). Prints the TypeScript data file to
// stdout; redirect it into src/lib/data/yield-benchmarks.ts and commit, so
// the calculator page stays static (the build has no database).
//
//   DATABASE_URL=<prod, connection_limit=1> npx tsx scripts/seo/yield-benchmarks.ts > src/lib/data/yield-benchmarks.ts
//
// The gate is the yield ranking's (src/lib/services/suburb-rankings-service.ts,
// yieldFromSql): a house median the suburb's own page publishes
// (PUBLISHED_HOUSE_MEDIAN_SQL: a trusted sales feed, five or more sales where
// the count is known), a rent from the suburb's newest bond-data row, a
// population of at least 1,000, a yield inside the plausibility clamp, and
// only the states the ranking covers (YIELD_RANKED_STATES: Victoria and
// Queensland, whose rents are published for the suburb itself). Postal
// delivery names and institutions are dropped as everywhere else. Unit
// yields where the row also publishes a unit median and a unit rent.
// Every other state is listed with the reason the page prints.
import "dotenv/config";
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { CAPITAL_CITIES } from "../../src/lib/utils/metro";
import { isNonLocalitySlug } from "../../src/lib/non-localities";
import { PUBLISHED_HOUSE_MEDIAN_SQL, withPublishedSales } from "../../src/lib/published-medians";
import { YIELD_MIN_POPULATION, YIELD_RANKED_STATES } from "../../src/lib/ranking-notes";
import { MAX_PLAUSIBLE_GROSS_YIELD, grossYieldPercent } from "../../src/lib/suburb-snapshot";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

const STATE_NAMES: Record<string, string> = { NSW: "New South Wales", VIC: "Victoria", QLD: "Queensland", SA: "South Australia", WA: "Western Australia", TAS: "Tasmania", ACT: "Australian Capital Territory", NT: "Northern Territory" };
const CAPITAL_OF: Record<string, string> = { NSW: "Sydney", VIC: "Melbourne", QLD: "Brisbane", SA: "Adelaide", WA: "Perth", TAS: "Hobart", ACT: "Canberra", NT: "Darwin" };
// Why a state is not in the table, in the words the page prints. New South
// Wales matches the ranking and the suburb snapshot: its bond data is a
// postcode-level all-dwellings median, not a house rent for the suburb.
// South Australia matches the ranking (tracker item 15: sales medians under
// review). The rest have no bond-data rental feed on this site.
const WITHHELD: Record<string, string> = {
  NSW: "its bond data is published by postcode for all dwellings, not as a house rent for the suburb, and the suburb pages withhold a yield there too",
  SA: "its sales medians are under review",
  WA: "no bond-data rental feed on this site yet",
  TAS: "no bond-data rental feed on this site yet",
  ACT: "no bond-data rental feed on this site yet",
  NT: "no bond-data rental feed on this site yet",
};

type Row = {
  slug: string; name: string; state: string; postcode: string; population: number;
  medianHousePrice: number; medianUnitPrice: number; statsSource: string | null; salesCountHouse: number | null;
  rentHouse: number | null; rentUnit: number | null; rentSource: string; rentPeriod: Date;
};

const pad4 = (n: number) => String(n).padStart(4, "0");
const round1 = (n: number) => Math.round(n * 10) / 10;
function quantile(values: number[], q: number): number | null {
  if (!values.length) return null;
  const s = [...values].sort((a, b) => a - b);
  const pos = (s.length - 1) * q;
  const lo = Math.floor(pos), hi = Math.ceil(pos);
  return round1(s[lo] + (s[hi] - s[lo]) * (pos - lo));
}

async function main() {
  const states = [...YIELD_RANKED_STATES];
  const rows = await prisma.$queryRawUnsafe<Row[]>(`
    SELECT s.slug, s.name, s.state, s.postcode, s.population,
           s."medianHousePrice", s."medianUnitPrice", s."statsSource", s."salesCountHouse",
           r."medianRentHouse" AS "rentHouse", r."medianRentUnit" AS "rentUnit", r.source AS "rentSource", r."periodDate" AS "rentPeriod"
    FROM "Suburb" s
    JOIN LATERAL (
      SELECT rs."medianRentHouse", rs."medianRentUnit", rs.source, rs."periodDate"
      FROM "SuburbRentalStat" rs
      WHERE rs."suburbSlug" = s.slug
      ORDER BY rs."periodDate" DESC, rs."updatedAt" DESC
      LIMIT 1
    ) r ON TRUE
    WHERE ${PUBLISHED_HOUSE_MEDIAN_SQL}
      AND s.state IN (${states.map((st) => `'${st}'`).join(", ")})
      AND s.population >= ${YIELD_MIN_POPULATION}
      AND r."medianRentHouse" > 0
      AND (r."medianRentHouse" * 52.0 / s."medianHousePrice" * 100) <= ${MAX_PLAUSIBLE_GROSS_YIELD}
  `);
  // The published rule again in code (the SQL above is the same rule), then
  // the yields as the suburb pages work them out.
  const gated = rows
    .filter((r) => !isNonLocalitySlug(r.slug))
    .map((r) => withPublishedSales({ ...r, salesCountHouse: r.salesCountHouse == null ? null : Number(r.salesCountHouse), population: Number(r.population) }))
    .map((r) => ({
      ...r,
      houseYield: r.medianHousePrice > 0 ? grossYieldPercent(r.rentHouse ?? 0, r.medianHousePrice) : null,
      unitYield: r.medianUnitPrice > 0 ? grossYieldPercent(r.rentUnit ?? 0, r.medianUnitPrice) : null,
    }))
    .filter((r) => r.houseYield !== null);

  const inCapital = (r: { state: string; postcode: string }) => {
    const c = CAPITAL_CITIES.find((x) => x.state === r.state);
    return Boolean(c && c.ranges.some(([lo, hi]) => r.postcode >= pad4(lo) && r.postcode <= pad4(hi)));
  };
  const area = (key: string, name: string, kind: "city" | "regional" | "state", state: string, subset: typeof gated) => {
    const h = subset.map((r) => r.houseYield as number);
    const u = subset.map((r) => r.unitYield).filter((y): y is number => y !== null);
    const periods = subset.map((r) => r.rentPeriod.toISOString().slice(0, 10)).sort();
    return {
      key, name, kind, state,
      houseSuburbs: h.length, houseMedian: quantile(h, 0.5), houseLowerQuartile: quantile(h, 0.25), houseUpperQuartile: quantile(h, 0.75),
      unitSuburbs: u.length, unitMedian: quantile(u, 0.5),
      rentPeriod: periods[periods.length - 1] ?? null,
    };
  };
  const areas = states.flatMap((st) => {
    const inState = gated.filter((r) => r.state === st);
    const capital = CAPITAL_CITIES.find((c) => c.state === st);
    return [
      ...(capital ? [area(capital.slug, capital.name, "city" as const, st, inState.filter(inCapital))] : []),
      area(`regional-${st.toLowerCase()}`, `Regional ${STATE_NAMES[st]}`, "regional", st, inState.filter((r) => !inCapital(r))),
      area(st.toLowerCase(), STATE_NAMES[st], "state", st, inState),
    ];
  }).filter((a) => a.houseSuburbs > 0);
  const withheld = Object.keys(STATE_NAMES).filter((st) => !states.includes(st)).map((st) => ({ state: st, name: STATE_NAMES[st], capital: CAPITAL_OF[st], reason: WITHHELD[st] ?? "not published" }));

  const feedIds = ["rental-vic", "rental-qld", "sales-vic", "sales-abs", "sales-nsw", "sales-sa"];
  const sources = await prisma.dataSource.findMany({ where: { id: { in: feedIds } }, select: { id: true, dataAsOf: true } });
  const asOf = Object.fromEntries(sources.map((s) => [s.id, s.dataAsOf?.toISOString().slice(0, 10) ?? null]));
  const salesSources = Object.fromEntries(states.map((st) => [st, [...new Set(gated.filter((r) => r.state === st).map((r) => r.statsSource))].sort()]));
  const generated = new Date().toISOString().slice(0, 10);

  process.stdout.write(`// Generated by scripts/seo/yield-benchmarks.ts on ${generated} from production data. Do not edit by hand;
// regenerate after a rental or sales sync. Gate: the yield ranking's (a house median the suburb's own
// page publishes, a rent from the suburb's newest bond-data row, population ${YIELD_MIN_POPULATION}+, yields above
// ${MAX_PLAUSIBLE_GROSS_YIELD}% dropped, states ${states.join(" and ")}). Unit yields where the row also publishes a unit median and rent.
export const YIELD_BENCHMARKS_AS_OF = ${JSON.stringify(generated)};
/** dataAsOf of each feed on the day the file was generated. */
export const YIELD_SOURCE_DATES: Record<string, string | null> = ${JSON.stringify(asOf)};
/** The sales feeds behind each ranked state's medians. */
export const YIELD_SALES_SOURCES: Record<string, string[]> = ${JSON.stringify(salesSources)};
export interface YieldArea {
  key: string; name: string; kind: "city" | "regional" | "state"; state: string;
  houseSuburbs: number; houseMedian: number | null; houseLowerQuartile: number | null; houseUpperQuartile: number | null;
  unitSuburbs: number; unitMedian: number | null;
  /** Newest bond-data quarter among the suburbs counted. */
  rentPeriod: string | null;
}
export const YIELD_AREAS: YieldArea[] = ${JSON.stringify(areas, null, 2)};
export interface YieldWithheld { state: string; name: string; capital: string; reason: string }
export const YIELD_WITHHELD: YieldWithheld[] = ${JSON.stringify(withheld, null, 2)};
`);
  console.error(`rows ${rows.length}, gated ${gated.length}; ${areas.map((a) => `${a.name} h${a.houseMedian}%/${a.houseSuburbs} u${a.unitMedian ?? "-"}%/${a.unitSuburbs} rent ${a.rentPeriod}`).join("; ")}`);
}
main().finally(() => prisma.$disconnect());
