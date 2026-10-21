// Force-dynamic: the sitemap.ts file convention in Next 16 is cached as
// static by default. With our DB-only data source, the build-phase
// short-circuit ended up baking an empty sitemap that never regenerated
// despite `revalidate`. Switching to force-dynamic guarantees the function
// actually runs at request time; the shared unstable_cache in
// @/lib/sitemap-data then dedupes across crawler hits within a 24h window
// so the heavy DB query runs at most once per day.
export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getIndexableSuburbProfilesForSitemaps } from "@/lib/sitemap-data";

export type SuburbSitemapLink = {
  url: string;
  title: string;
  lastModified: Date;
};

// Only profiles that do not noindex themselves (src/lib/suburb-indexability.ts).
// Titles are the place name the profile page leads with. The HTML sitemap
// reads this same list, so a suburb cannot appear in one and not the other.
export async function getSuburbSitemapLinks(): Promise<SuburbSitemapLink[]> {
  const suburbs = await getIndexableSuburbProfilesForSitemaps();
  return suburbs.map(({ slug, name, state, postcode, updatedAt }) => ({
    url: `${SITE_URL}/suburbs/${slug}`,
    title: `${name}, ${state} ${postcode}`,
    lastModified: updatedAt,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const links = await getSuburbSitemapLinks();
  return links.map(({ url, lastModified }) => ({
    url,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
}
