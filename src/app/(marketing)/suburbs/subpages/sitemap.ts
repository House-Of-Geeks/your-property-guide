// Force-dynamic: the sitemap.ts file convention in Next 16 is cached as
// static by default. With our DB-only data source, the build-phase
// short-circuit ended up baking an empty sitemap that never regenerated
// despite `revalidate` (same workaround as ../sitemap.ts; the shared
// unstable_cache in @/lib/sitemap-data dedupes the heavy DB query).
export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getIndexableSuburbsForSitemaps } from "@/lib/sitemap-data";

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

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const type = await props.id;
  // force-dynamic means any /sitemap/{id}.xml request reaches this function,
  // so reject ids outside the known types rather than emitting junk URLs.
  if (!(SUBPAGE_TYPES as readonly string[]).includes(type)) return [];

  const suburbs = await getIndexableSuburbsForSitemaps();
  return suburbs.map(({ slug, updatedAt }) => ({
    url: `${SITE_URL}/suburbs/${slug}/${type}`,
    lastModified: updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
}
