// Force-dynamic: the sitemap.ts file convention in Next 16 is cached as
// static by default. With our DB-only data source, the build-phase
// short-circuit ended up baking an empty sitemap that never regenerated
// despite `revalidate` (same workaround as ../sitemap.ts; the shared
// unstable_cache in @/lib/sitemap-data dedupes the heavy DB query).
export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { SITE_URL } from "@/lib/constants";
import { getIndexableSuburbsForSitemaps } from "@/lib/sitemap-data";
import {
  getSuburbListingInventory,
  type SuburbListingInventoryRow,
} from "@/lib/services/property-service";

// Suburb intent sub-pages (/suburbs/[slug]/houses etc.). Split into one
// sitemap per type: ~15k indexable suburbs × 8 types would overflow the
// 50,000-URL-per-sitemap limit combined, but each per-type file stays well
// under it. Exported because Next emits these at
// /suburbs/subpages/sitemap/{id}.xml and the sitemap index
// (src/app/sitemap.xml/route.ts) must enumerate them.
export const SUBPAGE_TYPES = [
  "houses",
  "units",
  "townhouses",
  "land",
  "buy",
  "rent",
  "schools",
  "rental-market",
] as const;

export async function generateSitemaps() {
  return SUBPAGE_TYPES.map((id) => ({ id }));
}

// The six listing types render empty shells for suburbs with no matching
// stock (and those pages noindex themselves — see e.g. [slug]/buy/page.tsx),
// so submitting them would burn crawl budget on ~17,908 near-identical empty
// pages per type. Each predicate mirrors the getProperties() filter its page
// runs. schools + rental-market are absent here on purpose: they carry real
// data for every suburb and stay in the sitemap unconditionally.
const LISTING_TYPE_FILTERS: Partial<
  Record<(typeof SUBPAGE_TYPES)[number], (row: SuburbListingInventoryRow) => boolean>
> = {
  houses:       (r) => r.listingType === "buy" && r.propertyType === "house",
  units:        (r) => r.listingType === "buy" && r.propertyType === "unit",
  townhouses:   (r) => r.listingType === "buy" && r.propertyType === "townhouse",
  land:         (r) => r.listingType === "buy" && r.propertyType === "land",
  buy:          (r) => r.listingType === "buy",
  rent:         (r) => r.listingType === "rent",
};

// force-dynamic (above) means every crawler hit reaches this file, so the
// inventory groupBy is deduped through unstable_cache like the suburb list —
// one small query per day shared across the six listing-type sitemaps.
const getCachedListingInventory = unstable_cache(
  async () => getSuburbListingInventory(),
  ["sitemap-suburb-listing-inventory:v1"],
  { revalidate: 86400, tags: ["sitemap-suburbs"] },
);

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const type = await props.id;
  // force-dynamic means any /sitemap/{id}.xml request reaches this function,
  // so reject ids outside the known types rather than emitting junk URLs.
  if (!(SUBPAGE_TYPES as readonly string[]).includes(type)) return [];

  let suburbs = await getIndexableSuburbsForSitemaps();

  const filter = LISTING_TYPE_FILTERS[type as (typeof SUBPAGE_TYPES)[number]];
  if (filter) {
    const inventory = await getCachedListingInventory();
    const withStock = new Set(inventory.filter(filter).map((r) => r.suburbSlug));
    suburbs = suburbs.filter(({ slug }) => withStock.has(slug));
  }

  return suburbs.map(({ slug, updatedAt }) => ({
    url: `${SITE_URL}/suburbs/${slug}/${type}`,
    lastModified: updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
}
