// force-dynamic + unstable_cache, see /suburbs/sitemap.ts.
export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { SITE_URL } from "@/lib/constants";
import { getAllRegions } from "@/lib/services/region-service";
import { NOT_PLACES_VERSION } from "@/lib/non-localities";

const getEntries = unstable_cache(
  async (): Promise<MetadataRoute.Sitemap> => {
    const regions = await getAllRegions();
    return [
      {
        url: `${SITE_URL}/regions`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
      ...regions.map(({ slug }) => ({
        url: `${SITE_URL}/regions/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ];
  },
  ["sitemap-regions:v1", NOT_PLACES_VERSION],
  { revalidate: 86400, tags: ["sitemap-regions"] },
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getEntries();
}
