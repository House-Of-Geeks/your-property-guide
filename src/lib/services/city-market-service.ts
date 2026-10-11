import { db } from "@/lib/db";
import { LOCALITIES_ONLY } from "@/lib/non-localities";
import { publishedGrowth, publishesMedians, publishesUnitMedian } from "@/lib/published-medians";
import {
  COVERAGE_MIN_SUBURBS,
  REGION_COVERAGE_MIN_SUBURBS,
  meetsCoverageFloor,
  passesHouseScreens,
  type Coverage,
} from "@/lib/median-coverage";
import { isAllDwellingsOnly } from "@/lib/rental-labels";
import { describeSalesProvenance } from "@/lib/sales-provenance";
import { withRentAllColumn } from "@/lib/services/rental-service";
import { cityPostcodeWhere, type CapitalCity } from "@/lib/utils/metro";

// ── Bond-data rents ─────────────────────────────────────────────────────────

/**
 * The rental feeds whose rows are a bond-data median for the suburb itself.
 * Not the 2021 Census proxies, and not NSW, whose bond data is published by
 * postcode (every suburb in a postcode carries the postcode's figure).
 */
export const BOND_RENT_SOURCES: readonly string[] = ["rental-vic", "rental-sa", "rental-qld", "rental-wa"];

/** A suburb's latest rental row, when it is from a bond feed. */
export interface BondRent {
  slug: string;
  source: string;
  period: string;
  periodDate: Date;
  /** Weekly house rent; null where the feed records no dwelling type (WA). */
  house: number | null;
  /** All dwellings together (WA bond data); null elsewhere. */
  all: number | null;
}

type RentRow = { slug: string; source: string; period: string; periodDate: Date; house: number | null; unit: number | null; all: number | null };

/**
 * Each suburb's latest rental row (newest period, then the most recently
 * written, as the suburb page reads it), kept only when it comes from a bond
 * feed: the rent the suburb's own page prints with a bond-data source.
 */
export async function latestBondRents(slugs: string[]): Promise<Map<string, BondRent>> {
  if (slugs.length === 0) return new Map();
  const rows = await withRentAllColumn((withAll) =>
    withAll
      ? db.$queryRaw<RentRow[]>`
          SELECT DISTINCT ON (rs."suburbSlug") rs."suburbSlug" AS slug, rs.source, rs.period, rs."periodDate",
                 rs."medianRentHouse" AS house, rs."medianRentUnit" AS unit, rs."medianRentAll" AS "all"
          FROM "SuburbRentalStat" rs
          WHERE rs."suburbSlug" = ANY(${slugs})
          ORDER BY rs."suburbSlug", rs."periodDate" DESC, rs."updatedAt" DESC`
      : db.$queryRaw<RentRow[]>`
          SELECT DISTINCT ON (rs."suburbSlug") rs."suburbSlug" AS slug, rs.source, rs.period, rs."periodDate",
                 rs."medianRentHouse" AS house, rs."medianRentUnit" AS unit, NULL::int AS "all"
          FROM "SuburbRentalStat" rs
          WHERE rs."suburbSlug" = ANY(${slugs})
          ORDER BY rs."suburbSlug", rs."periodDate" DESC, rs."updatedAt" DESC`,
  );
  return bondRentMap(rows);
}

/** Pure: the bond-feed rows of a latest-row read, keyed by slug. Exported for tests. */
export function bondRentMap(rows: RentRow[]): Map<string, BondRent> {
  const out = new Map<string, BondRent>();
  for (const r of rows) {
    if (!BOND_RENT_SOURCES.includes(r.source)) continue;
    const figures = { source: r.source, medianRentHouse: r.house, medianRentUnit: r.unit, medianRentAll: r.all };
    const allOnly = isAllDwellingsOnly(figures);
    const house = !allOnly && r.house != null && Number(r.house) > 0 ? Number(r.house) : null;
    const all = r.all != null && Number(r.all) > 0 ? Number(r.all) : null;
    if (house == null && all == null) continue;
    out.set(r.slug, { slug: r.slug, source: r.source, period: r.period, periodDate: new Date(r.periodDate), house, all: allOnly ? all : null });
  }
  return out;
}

// City-level market rollups for the /property-market/{city} pages, and the
// region (LGA) pages. Aggregates the suburb dataset upward using the rule
// the suburb pages apply (src/lib/published-medians.ts): only suburbs whose
// own page publishes a median contribute to price figures, and a 12-month
// change counts only where the suburb's page prints one. The headline
// number is the MEDIAN of suburb medians, an average would let one
// waterfront enclave (or one bad row) drag the figure. It is called the
// typical suburb median, never "the median house price in {City}": it is
// not a median of sales, and on 10 Oct 2026 Adelaide's was $1,055,000
// against the SA Valuer-General's $975,000 for metropolitan Adelaide. It is
// printed only above the coverage floor (src/lib/median-coverage.ts):
// Brisbane's came from 23 suburbs and Moreton Bay's from 5 (review of
// 10 Oct 2026, suburbs-market 0.3).

export interface CityMarketSuburb {
  slug: string;
  name: string;
  postcode: string;
  medianHousePrice: number;
  annualGrowthHouse: number | null;
  population: number;
  /** House sales behind the median in the latest period, 0 when the source does not report a count. */
  salesCountHouse: number;
}

/** One Suburb row as the rollup needs it. Exported so the pure rollup can be tested without the DB. */
export interface CityMarketRow {
  slug: string;
  name: string;
  state?: string;
  postcode: string;
  medianHousePrice: number;
  medianUnitPrice: number;
  /** The Suburb row's own rent: never printed (it can be a census proxy). Rents come from bond data. */
  medianRentHouse: number;
  annualGrowthHouse: number | null;
  population: number;
  salesCountHouse: number;
  statsSource: string | null;
  salesUpdatedAt: Date | null;
}

export interface CityMarket {
  /** All suburbs matched to the metro area (incl. those without trusted prices). */
  suburbCount: number;
  /** Suburbs whose own page publishes a median: the N of "typical suburb median (N suburbs)". */
  pricedSuburbCount: number;
  /** The coverage floor's inputs: published medians among, and all, suburbs of 1,000 or more residents. */
  coverage: Coverage;
  /** The typical suburb median (median of the published suburb medians); null below the coverage floor. */
  medianHousePrice: number | null;
  /** The same for units, over the unit medians the feeds publish; null below the floor. */
  medianUnitPrice: number | null;
  unitSuburbCount: number;
  /** The typical suburb rent from bond data, with its feed and quarter; null below the floor or without a bond feed. */
  rent: CityRent | null;
  /** Median of the published 12-month changes; null where none is measured or below the floor. */
  medianAnnualGrowth: number | null;
  /** Ranked lists: empty below the coverage floor, where "the fastest" or "the cheapest" of a thin pool would not stand for the place. */
  topGrowth: CityMarketSuburb[];
  /** Screened: no CBD-core postcode or apartment market (src/lib/median-coverage.ts). */
  mostAffordable: CityMarketSuburb[];
  premium: CityMarketSuburb[];
  /**
   * The twenty established suburbs with the most recorded house sales
   * (population as the tie-break, and the fallback where a source reports
   * no counts). Valuation plan item 3: this is the "house prices by suburb"
   * table the city page leads with. Each row is a suburb's own published
   * median, so it is listed below the floor too.
   */
  busiest: CityMarketSuburb[];
  /** Sum of reported house sales across contributing suburbs. */
  totalSalesHouse: number;
  /** Most recent sales-data refresh across contributing suburbs. */
  salesAsOf: Date | null;
  /** The period the medians describe, from the feed's own record ("2024", "calendar 2025"); null when unknown. */
  salesPeriod: string | null;
}

/**
 * The typical suburb rent: the median of the suburbs' latest bond-data
 * medians for one quarter. House rents where the feed has them; all
 * dwellings together where it records no dwelling type (WA), labelled so.
 * Never the Suburb row's own rent, which can be a 2021 Census proxy: on
 * 10 Oct 2026 Perth printed "$350/wk" against WA bond medians of $640 to
 * $1,000 (review of 10 Oct 2026, renting-landlords 0.7).
 */
export interface CityRent {
  kind: "house" | "all";
  weekly: number;
  /** Suburbs behind it. */
  suburbs: number;
  /** The feed (rental-wa, rental-vic...). */
  source: string;
  /** The feed's period label ("2026-Q3"). */
  period: string;
}

/** Pure: the typical rent over the place's established suburbs, or null. Exported for tests. */
export function cityRent(rows: CityMarketRow[], rents: Map<string, BondRent> | undefined, established: number, minSuburbs: number): CityRent | null {
  if (!rents || rents.size === 0) return null;
  const mine = rows
    .filter((r) => r.population >= LIST_MIN_POPULATION)
    .map((r) => rents.get(r.slug))
    .filter((r): r is BondRent => r != null);
  if (mine.length === 0) return null;
  // One feed (the one most suburbs carry), one quarter (its newest).
  const bySource = new Map<string, BondRent[]>();
  for (const r of mine) bySource.set(r.source, [...(bySource.get(r.source) ?? []), r]);
  const feed = [...bySource.values()].sort((a, b) => b.length - a.length)[0];
  const newest = feed.reduce((d, r) => (r.periodDate > d ? r.periodDate : d), feed[0].periodDate);
  const quarter = feed.filter((r) => r.periodDate.getTime() === newest.getTime());
  const houses = quarter.map((r) => r.house).filter((v): v is number => v != null && v > 0);
  const alls = quarter.map((r) => r.all).filter((v): v is number => v != null && v > 0);
  const kind: CityRent["kind"] = houses.length > 0 ? "house" : "all";
  const values = kind === "house" ? houses : alls;
  if (!meetsCoverageFloor({ pool: values.length, suburbs: established }, minSuburbs)) return null;
  const weekly = medianPrice(values);
  return weekly == null ? null : { kind, weekly, suburbs: values.length, source: quarter[0].source, period: quarter[0].period };
}

export interface CityMarketOptions {
  /** Each suburb's latest bond-data rent (latestBondRents), for the apartment screen. */
  rents?: Map<string, BondRent>;
  /** The coverage floor's minimum count: COVERAGE_MIN_SUBURBS for a capital, REGION_COVERAGE_MIN_SUBURBS for a region. */
  minSuburbs?: number;
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** Median rounded to whole dollars, for price and rent figures. */
function medianPrice(values: number[]): number | null {
  const m = median(values);
  return m == null ? null : Math.round(m);
}

/** Median rounded to one decimal, for growth percentages. */
function medianPercent(values: number[]): number | null {
  const m = median(values);
  return m == null ? null : Math.round(m * 10) / 10;
}

const SUBURB_SELECT = {
  slug: true,
  name: true,
  state: true,
  postcode: true,
  medianHousePrice: true,
  medianUnitPrice: true,
  medianRentHouse: true,
  annualGrowthHouse: true,
  population: true,
  salesCountHouse: true,
  statsSource: true,
  salesUpdatedAt: true,
} as const;

/** The rents the rollup reads: for the suburbs of 1,000 or more residents, one query. */
async function rentsFor(rows: CityMarketRow[]): Promise<Map<string, BondRent>> {
  return latestBondRents(rows.filter((r) => r.population >= LIST_MIN_POPULATION).map((r) => r.slug));
}

export async function getCityMarket(city: CapitalCity): Promise<CityMarket> {
  // The city's suburbs by postcode range: the one membership the
  // best-suburbs city editions read too (cityPostcodeWhere, metro.ts).
  // One query after the other: the runtime pool holds a single connection.
  const rows: CityMarketRow[] = await db.suburb.findMany({
    where: {
      ...cityPostcodeWhere(city),
      ...LOCALITIES_ONLY,
    },
    select: SUBURB_SELECT,
  });
  const rents = await rentsFor(rows);
  return withSalesPeriod(buildCityMarket(rows, { rents, minSuburbs: COVERAGE_MIN_SUBURBS }), rows);
}

/**
 * The region (LGA) rollup for /regions/{slug}: the region's suburbs as
 * region-service reads them, with the region's coverage floor and the bond
 * rents.
 */
export async function getRegionRollup(region: string): Promise<CityMarket> {
  const rows: CityMarketRow[] = await db.suburb.findMany({
    where: { region, ...LOCALITIES_ONLY },
    select: SUBURB_SELECT,
  });
  const rents = await rentsFor(rows);
  return withSalesPeriod(buildCityMarket(rows, { rents, minSuburbs: REGION_COVERAGE_MIN_SUBURBS }), rows);
}

/** Lists and the coverage floor leave out localities smaller than this. */
export const LIST_MIN_POPULATION = 1000;

/** Pure rollup over the place's suburb rows. */
export function buildCityMarket(rows: CityMarketRow[], opts: CityMarketOptions = {}): CityMarket {
  const minSuburbs = opts.minSuburbs ?? COVERAGE_MIN_SUBURBS;
  // The suburbs whose own page publishes a median: a trusted source, and
  // five recorded sales where the count is known. Until 29 Sep 2026 the
  // five-sale floor was missing here, so a rollup counted, and its tables
  // printed, a median of two sales that the suburb's own page withheld.
  const priced = rows.filter((s) => publishesMedians(s) && s.medianHousePrice > 0);

  // Coverage: published medians among the suburbs of 1,000 or more residents.
  const established = rows.filter((s) => s.population >= LIST_MIN_POPULATION);
  const coverage: Coverage = { pool: priced.filter((s) => s.population >= LIST_MIN_POPULATION).length, suburbs: established.length };
  const covered = meetsCoverageFloor(coverage, minSuburbs);

  // A growth figure of exactly 0 is how the sales feeds store "no prior
  // period to compare", not a flat market; the suburb pages already treat
  // it as unknown (the snapshot prints growth only when it is non-zero),
  // so the rollup does the same rather than reporting a region as flat.
  // publishedGrowth is the suburb page's rule: 0 for those, for a change
  // beyond the plausibility clamp, and for a figure beside a feed that
  // measures no change (left there by an earlier import).
  const knownGrowth = (s: CityMarketRow): boolean => publishedGrowth(s) !== 0;

  const toCitySuburb = (s: (typeof priced)[number]): CityMarketSuburb => ({
    slug: s.slug,
    name: s.name,
    postcode: s.postcode,
    medianHousePrice: s.medianHousePrice,
    annualGrowthHouse: knownGrowth(s) ? s.annualGrowthHouse : null,
    population: s.population,
    salesCountHouse: s.salesCountHouse ?? 0,
  });

  const growthEligible = priced.filter(
    (s): s is CityMarketRow & { annualGrowthHouse: number } => knownGrowth(s),
  );

  // Affordability/premium lists exclude micro-localities: a "suburb" of 40
  // people with three sales makes a misleading list entry.
  const listEligible = priced.filter((s) => s.population >= LIST_MIN_POPULATION);

  // The cheapest list also leaves out the CBD cores and the apartment
  // markets, whose "house" median is not a house price (Melbourne 3000 at
  // $381,000 led it on 10 Oct 2026).
  const screened = listEligible.filter((s) =>
    passesHouseScreens({ name: s.name, state: s.state ?? "", postcode: s.postcode, medianHousePrice: s.medianHousePrice }, opts.rents?.get(s.slug)?.house),
  );

  // Units: the feeds that produce a unit median (publishesUnitMedian).
  const unitPriced = priced.filter((s) => publishesUnitMedian(s));
  const unitCovered = meetsCoverageFloor(
    { pool: unitPriced.filter((s) => s.population >= LIST_MIN_POPULATION).length, suburbs: established.length },
    minSuburbs,
  );

  const salesDates = priced
    .map((s) => s.salesUpdatedAt)
    .filter((d): d is Date => d != null)
    .sort((a, b) => b.getTime() - a.getTime());

  return {
    suburbCount: rows.length,
    pricedSuburbCount: priced.length,
    coverage,
    medianHousePrice: covered ? medianPrice(priced.map((s) => s.medianHousePrice)) : null,
    medianUnitPrice: unitCovered ? medianPrice(unitPriced.map((s) => s.medianUnitPrice)) : null,
    unitSuburbCount: unitPriced.length,
    rent: cityRent(rows, opts.rents, established.length, minSuburbs),
    medianAnnualGrowth: covered ? medianPercent(growthEligible.map((s) => s.annualGrowthHouse)) : null,
    topGrowth: covered
      ? [...growthEligible]
          .filter((s) => s.population >= LIST_MIN_POPULATION)
          .sort((a, b) => b.annualGrowthHouse - a.annualGrowthHouse)
          .slice(0, 8)
          .map(toCitySuburb)
      : [],
    mostAffordable: covered
      ? [...screened]
          .sort((a, b) => a.medianHousePrice - b.medianHousePrice)
          .slice(0, 8)
          .map(toCitySuburb)
      : [],
    premium: covered
      ? [...listEligible]
          .sort((a, b) => b.medianHousePrice - a.medianHousePrice)
          .slice(0, 8)
          .map(toCitySuburb)
      : [],
    busiest: [...listEligible]
      .sort(
        (a, b) =>
          (b.salesCountHouse ?? 0) - (a.salesCountHouse ?? 0) ||
          b.population - a.population ||
          a.name.localeCompare(b.name),
      )
      .slice(0, 20)
      .map(toCitySuburb),
    totalSalesHouse: priced.reduce((sum, s) => sum + (s.salesCountHouse ?? 0), 0),
    salesAsOf: salesDates[0] ?? null,
    salesPeriod: null,
  };
}

/** The feed most of the published medians come from: the place is one state, so one feed. */
export function mainSalesSource(rows: CityMarketRow[]): string | null {
  const counts = new Map<string, number>();
  for (const r of rows) if (publishesMedians(r) && r.medianHousePrice > 0 && r.statsSource) counts.set(r.statsSource, (counts.get(r.statsSource) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

/** The rollup with the period its medians describe, read from the feed's DataSource record. */
async function withSalesPeriod(market: CityMarket, rows: CityMarketRow[]): Promise<CityMarket> {
  const source = mainSalesSource(rows);
  if (!source || !market.medianHousePrice) return market;
  const feed = await db.dataSource.findUnique({ where: { id: source }, select: { dataAsOf: true } });
  const period = describeSalesProvenance({ source, periodEnd: feed?.dataAsOf ?? null, updatedAt: market.salesAsOf, salesCount: null, suburbName: "" })?.period ?? null;
  return { ...market, salesPeriod: period };
}
