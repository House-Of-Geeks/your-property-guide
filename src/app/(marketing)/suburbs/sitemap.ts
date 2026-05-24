// Force-dynamic + unstable_cache: the sitemap.ts file convention in Next 16
// is cached as static by default. With our DB-only data source, the build-
// phase short-circuit ended up baking an empty sitemap that never
// regenerated despite `revalidate`. Switching to force-dynamic guarantees
// the function actually runs at request time; unstable_cache then dedupes
// across crawler hits within a 24h window so the heavy DB query runs at
// most once per day.
export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { SITE_URL } from "@/lib/constants";
import { getIndexableSuburbSlugsWithDates } from "@/lib/services/suburb-service";

const getEntries = unstable_cache(
  async (): Promise<MetadataRoute.Sitemap> => {
    const suburbs = await getIndexableSuburbSlugsWithDates();
    return suburbs.map(({ slug, updatedAt }) => ({
      url: `${SITE_URL}/suburbs/${slug}`,
      lastModified: updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  },
  ["sitemap-suburbs:v1"],
  { revalidate: 86400, tags: ["sitemap-suburbs"] },
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getEntries();
}
