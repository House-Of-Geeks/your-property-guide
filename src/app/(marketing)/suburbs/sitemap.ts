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
import { isSecondaryLocality } from "@/lib/duplicate-localities";

// Only profiles that do not noindex themselves (src/lib/suburb-indexability.ts),
// less the rows that repeat another under a second postcode: their canonical
// is the primary's (src/lib/duplicate-localities.ts).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const suburbs = (await getIndexableSuburbProfilesForSitemaps()).filter(({ slug }) => !isSecondaryLocality(slug));
  return suburbs.map(({ slug, updatedAt }) => ({
    url: `${SITE_URL}/suburbs/${slug}`,
    lastModified: updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
}
