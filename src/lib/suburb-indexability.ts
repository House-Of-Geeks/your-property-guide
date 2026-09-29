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
// belongs to (stateMatchesPostcode, src/lib/postcode-states.ts). Since item
// 48 those rows redirect or answer 404; the check stays for the next one a
// feed makes.
import { isReliableSalesSource } from "@/lib/suburb-data-quality";
import { hasEnoughSales } from "@/lib/sales-provenance";
import { stateMatchesPostcode, type SuburbPlace } from "@/lib/postcode-states";

export { stateMatchesPostcode, type SuburbPlace };

export interface SuburbIndexRow {
  medianHousePrice: number;
  medianUnitPrice: number;
  population: number;
  statsSource: string | null;
  salesCountHouse: number | null;
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
