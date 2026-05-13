// force-dynamic + unstable_cache, see /suburbs/sitemap.ts.
export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { SITE_URL } from "@/lib/constants";
import { getAllHouseAndLandSlugs } from "@/lib/services/house-and-land-service";

const getEntries = unstable_cache(
  async (): Promise<MetadataRoute.Sitemap> => {
    const slugs = await getAllHouseAndLandSlugs();
    return [
      {
        url: `${SITE_URL}/house-and-land`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      },
      ...slugs.map((slug) => ({
        url: `${SITE_URL}/house-and-land/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ];
  },
  ["sitemap-house-and-land:v1"],
  { revalidate: 86400, tags: ["sitemap-house-and-land"] },
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getEntries();
}
