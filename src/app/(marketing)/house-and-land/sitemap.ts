// force-dynamic + unstable_cache, see /suburbs/sitemap.ts.
export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { SITE_URL } from "@/lib/constants";
import { hasHouseAndLandStock } from "@/lib/house-and-land-indexability";
import {
  getAllHouseAndLandSlugs,
  getLiveHouseAndLandPackageCount,
} from "@/lib/services/house-and-land-service";

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

// The hub and the package pages are submitted only while there is stock,
// read from the same cached count as the pages' robots
// (src/lib/house-and-land-indexability.ts); the gate sits outside the
// entries cache so it turns with the pages, not a day later. This is the
// only sitemap that lists /house-and-land. If the count cannot be read the
// sitemap submits nothing rather than a page that may answer noindex.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let live: number;
  try {
    live = await getLiveHouseAndLandPackageCount();
  } catch (err) {
    console.error("[house-and-land sitemap] stock count failed:", err);
    return [];
  }
  if (!hasHouseAndLandStock(live)) return [];
  return getEntries();
}
