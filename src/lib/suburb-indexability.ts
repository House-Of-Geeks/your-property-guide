// Which suburb pages the site itself marks indexable, as a rule over the raw
// Suburb row, so the sitemaps can list exactly what the pages declare. Pure;
// tested in tests/seo/suburb-indexability.test.ts.
//
// The pages decide from the gated Suburb object: suburb-service zeroes both
// medians when the sales source is distrusted or the median rests on fewer
// than five recorded sales, and the profile then calls itself thin (noindex)
// when it has neither a price nor a population. The sitemaps used to test
// the raw columns instead, so on 29 Sep 2026 the suburbs sitemap submitted
// 3,683 pages that answer noindex and the agents sitemap 1,268. These
// predicates compose the same two rules the service uses
// (isReliableSalesSource, hasEnoughSales), so they cannot drift from it on
// either; only the composition lives here.
import { isReliableSalesSource } from "@/lib/suburb-data-quality";
import { hasEnoughSales } from "@/lib/sales-provenance";

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

/** Mirrors isThinSuburb in suburbs/[slug]/page.tsx: no published price and no population. */
export function isThinSuburbRow(row: SuburbIndexRow): boolean {
  const priced = publishesPrices(row) && (row.medianHousePrice > 0 || row.medianUnitPrice > 0);
  return !priced && !(row.population > 0);
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
