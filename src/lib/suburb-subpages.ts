// Which of a suburb's sub-pages have something on them, so that pages link
// only to those. Pure; tested in tests/seo/suburb-subpages.test.ts.
//
// On 29 Sep 2026, 13 suburbs had a listing. Every other suburb's six listing
// sub-pages (/buy, /rent, /houses, /units, /townhouses, /land: about 107,900
// URLs) were empty, answered 200 with noindex, and were linked from the tab
// strip on every sub-page, the contextual links on every profile, the schools
// page and the rental-market page. The sub-page sitemaps already listed only
// the pages with stock. The links now follow the same rule, from the same
// predicates, so the two cannot disagree.

export const LISTING_SUBPAGES = ["buy", "rent", "houses", "units", "townhouses", "land"] as const;
export type ListingSubpage = (typeof LISTING_SUBPAGES)[number];
export type SuburbSubpage = ListingSubpage | "rental-market";

export interface ListingInventoryRow {
  listingType: string;
  propertyType: string;
}

/** Each mirrors the getProperties() filter its page runs. */
export const LISTING_SUBPAGE_FILTERS: Record<ListingSubpage, (row: ListingInventoryRow) => boolean> = {
  houses:     (r) => r.listingType === "buy" && r.propertyType === "house",
  units:      (r) => r.listingType === "buy" && r.propertyType === "unit",
  townhouses: (r) => r.listingType === "buy" && r.propertyType === "townhouse",
  land:       (r) => r.listingType === "buy" && r.propertyType === "land",
  buy:        (r) => r.listingType === "buy",
  rent:       (r) => r.listingType === "rent",
};

export type SubpageAvailability = Record<SuburbSubpage, boolean>;

/** A bond-data row exists for the suburb (suburb-service sets rentalSource from it). */
export function hasRentalRow(suburb: { dataFreshness?: { rentalSource?: string | null } | null }): boolean {
  return suburb.dataFreshness?.rentalSource != null;
}

/** `rows` are the listing inventory rows of one suburb. */
export function availabilityFrom(rows: readonly ListingInventoryRow[], hasRentalData: boolean): SubpageAvailability {
  return {
    buy:        rows.some(LISTING_SUBPAGE_FILTERS.buy),
    rent:       rows.some(LISTING_SUBPAGE_FILTERS.rent),
    houses:     rows.some(LISTING_SUBPAGE_FILTERS.houses),
    units:      rows.some(LISTING_SUBPAGE_FILTERS.units),
    townhouses: rows.some(LISTING_SUBPAGE_FILTERS.townhouses),
    land:       rows.some(LISTING_SUBPAGE_FILTERS.land),
    "rental-market": hasRentalData,
  };
}

/**
 * Every listing sub-page linked, as before 29 Sep 2026. What a failed
 * inventory read falls back to: it must not hide a page that has stock.
 */
export function everyListingSubpage(hasRentalData: boolean): SubpageAvailability {
  return { buy: true, rent: true, houses: true, units: true, townhouses: true, land: true, "rental-market": hasRentalData };
}

export interface SubpageTab {
  label: string;
  href: string;
  active?: boolean;
}

const TABS: { label: string; key: SuburbSubpage }[] = [
  { label: "For sale",      key: "buy" },
  { label: "For rent",      key: "rent" },
  { label: "Houses",        key: "houses" },
  { label: "Units",         key: "units" },
  { label: "Townhouses",    key: "townhouses" },
  { label: "Land",          key: "land" },
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

const EMPTY_LEAD: Record<ListingSubpage, (name: string) => string> = {
  buy:        (n) => `No properties for sale in ${n} right now.`,
  rent:       (n) => `No rentals listed in ${n} right now.`,
  houses:     (n) => `No house listings in ${n} right now.`,
  units:      (n) => `No unit listings in ${n} right now.`,
  townhouses: (n) => `No townhouse listings in ${n} right now.`,
  land:       (n) => `No land listings in ${n} right now.`,
};

/** The empty state of a listing sub-page. It points at the tabs only when there are tabs to point at. */
export function emptyListingMessage(page: ListingSubpage, suburbName: string, availability: SubpageAvailability): string {
  const lead = EMPTY_LEAD[page](suburbName);
  if (LISTING_SUBPAGES.some((p) => p !== page && availability[p])) return `${lead} Try the other listing types above.`;
  if (page === "rent" && availability["rental-market"]) return `${lead} The rental market tab above has the latest median rents.`;
  return `${lead} Check back soon.`;
}
