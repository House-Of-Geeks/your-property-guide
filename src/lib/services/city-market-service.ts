import { db } from "@/lib/db";
import { LOCALITIES_ONLY } from "@/lib/non-localities";
import { publishedGrowth, publishesMedians } from "@/lib/published-medians";
import { type CapitalCity } from "@/lib/utils/metro";

// City-level market rollups for the /property-market/{city} pages.
// Aggregates the suburb dataset upward using the rule the suburb pages
// apply (src/lib/published-medians.ts): only suburbs whose own page
// publishes a median contribute to price figures, and a 12-month change
// counts only where the suburb's page prints one. The headline number is
// the MEDIAN of suburb medians — an average would let one waterfront
// enclave (or one bad row) drag the figure.

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
  postcode: string;
  medianHousePrice: number;
  medianUnitPrice: number;
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
  /** Suburbs contributing verified price data. */
  pricedSuburbCount: number;
  medianHousePrice: number | null;
  medianUnitPrice: number | null;
  medianRentHouse: number | null;
  /** Median of plausible suburb-level annual growth figures. */
  medianAnnualGrowth: number | null;
  topGrowth: CityMarketSuburb[];
  mostAffordable: CityMarketSuburb[];
  premium: CityMarketSuburb[];
  /**
   * The twenty established suburbs with the most recorded house sales
   * (population as the tie-break, and the fallback where a source reports
   * no counts). Valuation plan item 3: this is the "house prices by suburb"
   * table the city page leads with.
   */
  busiest: CityMarketSuburb[];
  /** Sum of reported house sales across contributing suburbs. */
  totalSalesHouse: number;
  /** Most recent sales-data refresh across contributing suburbs. */
  salesAsOf: Date | null;
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** Median rounded to whole dollars — for price/rent figures. */
function medianPrice(values: number[]): number | null {
  const m = median(values);
  return m == null ? null : Math.round(m);
}

/** Median rounded to one decimal — for growth percentages. */
function medianPercent(values: number[]): number | null {
  const m = median(values);
  return m == null ? null : Math.round(m * 10) / 10;
}

const pad4 = (n: number) => String(n).padStart(4, "0");

export async function getCityMarket(city: CapitalCity): Promise<CityMarket> {
  const rows: CityMarketRow[] = await db.suburb.findMany({
    where: {
      state: city.state,
      ...LOCALITIES_ONLY,
      OR: city.ranges.map(([lo, hi]) => ({
        postcode: { gte: pad4(lo), lte: pad4(hi) },
      })),
    },
    select: {
      slug: true,
      name: true,
      postcode: true,
      medianHousePrice: true,
      medianUnitPrice: true,
      medianRentHouse: true,
      annualGrowthHouse: true,
      population: true,
      salesCountHouse: true,
      statsSource: true,
      salesUpdatedAt: true,
    },
  });
  return buildCityMarket(rows);
}

/** Pure rollup over the metro's suburb rows. */
export function buildCityMarket(rows: CityMarketRow[]): CityMarket {
  // The suburbs whose own page publishes a median: a trusted source, and
  // five recorded sales where the count is known. Until 29 Sep 2026 the
  // five-sale floor was missing here, so a rollup counted, and its tables
  // printed, a median of two sales that the suburb's own page withheld.
  const priced = rows.filter((s) => publishesMedians(s) && s.medianHousePrice > 0);

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
  const listEligible = priced.filter((s) => s.population >= 1000);

  const salesDates = priced
    .map((s) => s.salesUpdatedAt)
    .filter((d): d is Date => d != null)
    .sort((a, b) => b.getTime() - a.getTime());

  return {
    suburbCount: rows.length,
    pricedSuburbCount: priced.length,
    medianHousePrice: medianPrice(priced.map((s) => s.medianHousePrice)),
    medianUnitPrice: medianPrice(priced.map((s) => s.medianUnitPrice).filter((p) => p > 0)),
    medianRentHouse: medianPrice(priced.map((s) => s.medianRentHouse).filter((r) => r > 0)),
    medianAnnualGrowth: medianPercent(growthEligible.map((s) => s.annualGrowthHouse)),
    topGrowth: [...growthEligible]
      .filter((s) => s.population >= 1000)
      .sort((a, b) => b.annualGrowthHouse - a.annualGrowthHouse)
      .slice(0, 8)
      .map(toCitySuburb),
    mostAffordable: [...listEligible]
      .sort((a, b) => a.medianHousePrice - b.medianHousePrice)
      .slice(0, 8)
      .map(toCitySuburb),
    premium: [...listEligible]
      .sort((a, b) => b.medianHousePrice - a.medianHousePrice)
      .slice(0, 8)
      .map(toCitySuburb),
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
  };
}
