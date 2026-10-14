// Which of a suburb's sub-pages have something on them, so that pages link
// only to those. Pure; tested in tests/seo/suburb-subpages.test.ts.
//
// On 29 Sep 2026, 13 suburbs had a listing. Every other suburb's six listing
// sub-pages (/buy, /rent, /houses, /units, /townhouses, /land: about 107,900
// URLs) were empty, answered 200 with noindex, and were linked from every
// profile. From then the links followed the stock.
//
// On 14 Oct 2026 the six listing sub-pages were retired with the rest of the
// listings portal (docs/portal-consolidation-2026-10-14.md): each one 308s to
// the suburb profile (next.config.ts). Their keys stay in SubpageAvailability,
// always false, so the pages that guard a link on them (the profile, the
// schools page and the rental-market page) draw none. The rental market is
// the one listed sub-page left that depends on data.

/** The listing sub-pages retired on 14 Oct 2026. Each 308s to /suburbs/[slug]. */
export const RETIRED_LISTING_SUBPAGES = ["buy", "rent", "houses", "units", "townhouses", "land"] as const;
export type RetiredListingSubpage = (typeof RETIRED_LISTING_SUBPAGES)[number];

/** A sub-page drawn in the tab strip. */
export type SuburbSubpage = "rental-market";

/** What a suburb's pages may link to. The retired listing sub-pages are never linked. */
export type SubpageAvailability = Record<RetiredListingSubpage, false> & { "rental-market": boolean };

/** A bond-data row exists for the suburb (suburb-service sets rentalSource from it). */
export function hasRentalRow(suburb: { dataFreshness?: { rentalSource?: string | null } | null }): boolean {
  return suburb.dataFreshness?.rentalSource != null;
}

/** The sub-pages of one suburb that have something on them. */
export function subpageAvailability(hasRentalData: boolean): SubpageAvailability {
  return {
    buy: false,
    rent: false,
    houses: false,
    units: false,
    townhouses: false,
    land: false,
    "rental-market": hasRentalData,
  };
}

export interface SubpageTab {
  label: string;
  href: string;
  active?: boolean;
}

const TABS: { label: string; key: SuburbSubpage }[] = [
  { label: "Rental market", key: "rental-market" },
];

/**
 * The tab strip of a sub-page: the page being read, and the sub-pages that
 * have something on them. One tab alone is not navigation; the header draws
 * the strip from two.
 */
export function subpageTabs(slug: string, active: SuburbSubpage, availability: SubpageAvailability): SubpageTab[] {
  return TABS
    .filter((t) => t.key === active || availability[t.key])
    .map((t) => ({ label: t.label, href: `/suburbs/${slug}/${t.key}`, active: t.key === active }));
}
