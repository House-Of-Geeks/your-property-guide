// Two rules for figures built from many suburb medians. Pure; tested in
// tests/lib/median-coverage.test.ts.
//
// 1. The house-median screens of a cheapest list. A "house" median in an
//    apartment-dominated market rests on the few houses among the
//    apartments, so it is not a house price for the area: on 10 Oct 2026
//    the cheapest Greater Melbourne suburbs were Melbourne 3000 ($381,000),
//    Southbank, Docklands and Travancore. The 8 July 2026 winter report
//    (scripts/seo/winter-2026-report-data.ts, and its published methodology
//    in /guides/cheapest-suburbs-australian-capitals-winter-2026) screened
//    out CBD-core postcodes, suburbs whose rent-to-price profile is an
//    apartment market's, and four areas by name; the 1 Oct city editions
//    dropped the screens (review of 10 Oct 2026, suburbs-market 0.2a).
//    Ported here, with one change: the rent is the suburb's latest bond-data
//    house rent, never a census proxy.
//
// 2. The coverage floor. A ranking of "the ten cheapest" or a figure called
//    the city's typical median needs a pool that stands for the city: on
//    10 Oct 2026 Brisbane's cheapest ten came from 17 suburbs (mostly
//    acreage), and Moreton Bay's headline median from 5 (review of 10 Oct
//    2026, suburbs-market 0.2b and 0.3).

// ── 1. House-median screens ─────────────────────────────────────────────────

/** CBD-core postcodes, as the July report screened them (inclusive ranges). */
export const CBD_CORE_RANGES: Record<string, [number, number][]> = {
  NSW: [[2000, 2011]], // Sydney core and inner harbourside
  VIC: [[3000, 3010]], // Melbourne CBD, Southbank, Docklands
  QLD: [[4000, 4006]], // Brisbane CBD and Fortitude Valley
  SA: [[5000, 5006]], // Adelaide core
  WA: [[6000, 6005]], // Perth core
  TAS: [[7000, 7000]], // Hobart core
  NT: [[800, 820]], // Darwin core
};

export function isCbdCore(state: string, postcode: string): boolean {
  const pc = Number.parseInt(postcode, 10);
  if (Number.isNaN(pc)) return false;
  return (CBD_CORE_RANGES[state] ?? []).some(([lo, hi]) => pc >= lo && pc <= hi);
}

/**
 * A gross yield above this, on the house median and the suburb's bond-data
 * house rent, marks a median that reflects apartment-heavy stock rather than
 * a detached-house market (the July report's rule, applied in the capitals).
 */
export const APARTMENT_SKEW_YIELD = 5.5;

export function looksApartmentSkewed(medianHousePrice: number, bondHouseRent: number | null | undefined): boolean {
  if (!(medianHousePrice > 0) || !bondHouseRent || bondHouseRent <= 0) return false;
  return ((bondHouseRent * 52) / medianHousePrice) * 100 > APARTMENT_SKEW_YIELD;
}

/** The areas the July report excluded by name on their rent-to-price profile. */
export const NAMED_APARTMENT_MARKETS: readonly { name: string; state: string }[] = [
  { name: "Travancore", state: "VIC" },
  { name: "Belconnen", state: "ACT" },
  { name: "Lawson", state: "ACT" },
  { name: "Barton", state: "ACT" },
];

export function isNamedApartmentMarket(name: string, state: string): boolean {
  return NAMED_APARTMENT_MARKETS.some((m) => m.state === state && m.name.toLowerCase() === name.toLowerCase());
}

export interface ScreenRow {
  name: string;
  state: string;
  postcode: string;
  medianHousePrice: number;
}

/** Whether a suburb's house median may stand in a cheapest-house list. */
export function passesHouseScreens(row: ScreenRow, bondHouseRent: number | null | undefined): boolean {
  return (
    !isCbdCore(row.state, row.postcode) &&
    !isNamedApartmentMarket(row.name, row.state) &&
    !looksApartmentSkewed(row.medianHousePrice, bondHouseRent)
  );
}

/** What a cheapest list prints about the screens. */
export const HOUSE_SCREEN_NOTE =
  `CBD-core postcodes and suburbs whose house median looks like an apartment market's are left out: a bond-data house rent above ${APARTMENT_SKEW_YIELD}% of the median a year, or Travancore and Belconnen, Lawson and Barton in the ACT, screened by name in our July 2026 report. A "house" median among apartments is not a house price for the area.`;

// ── 2. Coverage floor ───────────────────────────────────────────────────────

/** At least this many suburbs behind a ranking of ten, or a typical median: the ten are then at most a third of the pool. */
export const COVERAGE_MIN_SUBURBS = 30;

/**
 * And at least this share of the place's suburbs of 1,000 or more
 * residents. The review's example was a quarter; a fifth is used because the
 * ABS medians in Queensland, Western Australia, Tasmania, the ACT and the
 * Northern Territory go to the one suburb that carries a statistical area's
 * name, so even full ABS coverage reaches only part of a city's suburbs
 * (Perth: 66 medians, which the review judged acceptable, 0.2c), while
 * Brisbane's 17 (9%) and Hobart's 10 stay out.
 */
export const COVERAGE_MIN_SHARE = 0.2;

/** A region (LGA) has fewer suburbs than a capital: the same share, a lower count. */
export const REGION_COVERAGE_MIN_SUBURBS = 10;

export interface Coverage {
  /** Suburbs behind the figure (the ranking's pool, or the medians in the median). */
  pool: number;
  /** The place's suburbs of 1,000 or more residents. */
  suburbs: number;
}

export function meetsCoverageFloor(c: Coverage, minSuburbs = COVERAGE_MIN_SUBURBS): boolean {
  return c.pool >= minSuburbs && c.suburbs > 0 && c.pool / c.suburbs >= COVERAGE_MIN_SHARE;
}

/** The sentence a page prints when a pool is below the floor. */
export function coverageShortfall(c: Coverage, place: string, minSuburbs = COVERAGE_MIN_SUBURBS): string {
  const n = (v: number) => v.toLocaleString("en-AU");
  const have = c.pool === 0 ? "none" : c.pool === 1 ? "only one" : `only ${n(c.pool)}`;
  return `We publish a figure drawn from many suburbs only when at least ${n(minSuburbs)} suburbs and a fifth of ${place}'s ${n(c.suburbs)} suburbs of 1,000 or more residents have a published median; ${have} ${c.pool === 1 ? "does" : "do"}.`;
}
