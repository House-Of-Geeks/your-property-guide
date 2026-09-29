// Which suburb pages the site itself marks indexable. One rule, isThinProfile,
// read by the page (from the gated Suburb object) and by the sitemap (from
// the raw row), so the sitemap lists exactly what the pages declare. Pure;
// tested in tests/seo/suburb-indexability.test.ts.
//
// The price side: suburb-service zeroes both medians when the sales source
// is distrusted or the median rests on fewer than five recorded sales.
// publishesPrices composes the same two functions the service uses
// (isReliableSalesSource, hasEnoughSales), so it cannot drift from it.
//
// The thin rule. Until 29 Sep 2026 a profile was thin (noindex) when it had
// neither a published price nor a population. That was written when such a
// page was mostly empty modules, and it caught far more than intended once
// the postcode-level census copies were cleared on 7 Sep 2026: about 3,500
// real localities went noindex overnight, among them pages that had been
// drawing postcode lookups. The pages are not empty: most carry
// walkability, climate, crime or rental data of their own. A locality with
// no price and no population is now indexable when it carries at least one
// of those four, and stays noindex when it carries none.
//
// One exception, found before the rule shipped: 29 rows that are not places.
// The South Australian crime and rental feeds record an interstate address
// now and then, and the sync filed each under SA beside the real suburb:
// "Sydney, SA 2000", "East Melbourne, SA 3002", "Townsville, SA 4810". Each
// carries a crime or rental row, so the rule above would have indexed it.
// Data of its own counts only for a row filed under the state its postcode
// belongs to (stateMatchesPostcode).
import { isReliableSalesSource } from "@/lib/suburb-data-quality";
import { hasEnoughSales } from "@/lib/sales-provenance";

export interface SuburbIndexRow {
  medianHousePrice: number;
  medianUnitPrice: number;
  population: number;
  statsSource: string | null;
  salesCountHouse: number | null;
}

/** Where the row says the suburb is. */
export interface SuburbPlace {
  state: string;
  postcode: string;
}

// Australia Post's postcode ranges by state.
const POSTCODE_RANGES: readonly (readonly [number, number, string])[] = [
  [200, 299, "ACT"], [2600, 2618, "ACT"], [2900, 2920, "ACT"],
  [1000, 2599, "NSW"], [2619, 2899, "NSW"], [2921, 2999, "NSW"],
  [800, 999, "NT"],
  [4000, 4999, "QLD"], [9000, 9999, "QLD"],
  [5000, 5999, "SA"],
  [7000, 7999, "TAS"],
  [3000, 3999, "VIC"], [8000, 8999, "VIC"],
  [6000, 6999, "WA"],
];

// Postcodes that straddle a border, where the localities on the far side are
// real: the states with a census-counted locality in the postcode on
// 29 Sep 2026 (read-only production count), and the Jervis Bay Territory.
const CROSS_BORDER: Readonly<Record<string, readonly string[]>> = {
  "0872": ["NT", "SA", "WA"],
  "2540": ["NSW", "ACT"],
  "2611": ["ACT", "NSW"],
  "2618": ["ACT", "NSW"],
  "2620": ["NSW", "ACT"],
  "3500": ["VIC", "NSW"],
  "3586": ["VIC", "NSW"],
  "3644": ["VIC", "NSW"],
  "3691": ["VIC", "NSW"],
  "3707": ["VIC", "NSW"],
  "4375": ["QLD", "NSW"],
  "4377": ["QLD", "NSW"],
  "4380": ["QLD", "NSW"],
  "4383": ["QLD", "NSW"],
  "4385": ["QLD", "NSW"],
  "4825": ["QLD", "NT"],
};

/** False for "Sydney, SA 2000", and for a postcode that is not four digits. */
export function stateMatchesPostcode({ state, postcode }: SuburbPlace): boolean {
  if (!/^\d{4}$/.test(postcode)) return false;
  if (CROSS_BORDER[postcode]?.includes(state)) return true;
  const n = Number(postcode);
  return POSTCODE_RANGES.some(([from, to, s]) => s === state && n >= from && n <= to);
}

/** The service publishes this row's medians (trusted source, enough sales). */
export function publishesPrices(row: Pick<SuburbIndexRow, "statsSource" | "salesCountHouse">): boolean {
  return isReliableSalesSource(row.statsSource) && hasEnoughSales(row.salesCountHouse);
}

/** Data a profile can carry of its own, besides a price and a population. */
export interface ProfileDataSignals {
  /** Walk score; 0 and null both mean none. */
  walkScore: number | null;
  /** A climate row (nearest Bureau of Meteorology station). */
  hasClimate: boolean;
  /** A crime row for the suburb itself, not the council-area fallback. */
  hasCrime: boolean;
  /** A bond-data rental row for the suburb. */
  hasRental: boolean;
}

/** How many of the four a profile needs when it has no price and no population. */
export const MIN_DATA_FAMILIES = 1;

export function dataFamilyCount(s: ProfileDataSignals): number {
  return [(s.walkScore ?? 0) > 0, s.hasClimate, s.hasCrime, s.hasRental].filter(Boolean).length;
}

/** The rule itself: the page and the sitemap both call this. */
export function isThinProfile(p: {
  publishedPrice: boolean;
  population: number;
  place: SuburbPlace;
  signals: ProfileDataSignals;
}): boolean {
  if (p.publishedPrice || p.population > 0) return false;
  if (!stateMatchesPostcode(p.place)) return true;
  return dataFamilyCount(p.signals) < MIN_DATA_FAMILIES;
}

/** isThinProfile over the raw row, for the sitemap. */
export function isThinSuburbRow(row: SuburbIndexRow & SuburbPlace, signals: ProfileDataSignals): boolean {
  return isThinProfile({
    publishedPrice: publishesPrices(row) && (row.medianHousePrice > 0 || row.medianUnitPrice > 0),
    population: row.population,
    place: { state: row.state, postcode: row.postcode },
    signals,
  });
}

/** Mirrors hasReliablePrice on the gated object: the agents sub-page indexes only with a published house median. */
export function hasPublishedHouseMedian(row: SuburbIndexRow): boolean {
  return publishesPrices(row) && row.medianHousePrice > 0;
}

/**
 * A suburb comparison's canonical URL path: the pair in lexicographic order,
 * the same rule the comparison page sets as its canonical. The compare
 * sitemap listed the more populous suburb first, so over half its URLs
 * (28 of 50 sampled) pointed at a page whose canonical was the other order.
 */
export function canonicalComparePath(aSlug: string, bSlug: string): string {
  const [first, second] = [aSlug, bSlug].sort();
  return `/suburbs/${first}/vs/${second}`;
}
