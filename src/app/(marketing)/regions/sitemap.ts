// force-dynamic + unstable_cache, see /suburbs/sitemap.ts.
export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { SITE_URL } from "@/lib/constants";
import { getAllRegions } from "@/lib/services/region-service";
import { regionDisplayName } from "@/lib/region-market";
import { NOT_PLACES_VERSION } from "@/lib/non-localities";

export type RegionSitemapLink = { url: string; title: string };

// No lastModified. Region rows have no content-updated date. A timestamp
// taken when the cache filled told crawlers the page changed when it had
// not. Omit the field rather than fake it.
const getEntries = unstable_cache(
  async (): Promise<RegionSitemapLink[]> => {
    const regions = await getAllRegions();
    return [
      {
        url: `${SITE_URL}/regions`,
        title: "Property Regions Across Australia",
      },
      ...regions.map((region) => ({
        url: `${SITE_URL}/regions/${region.slug}`,
        title: `${regionDisplayName(region.region)}, ${region.state}`,
      })),
    ];
  },
  ["sitemap-regions:v2", NOT_PLACES_VERSION], // v2: drop the fake lastModified
  { revalidate: 86400, tags: ["sitemap-regions"] },
);

export async function getRegionSitemapLinks(): Promise<RegionSitemapLink[]> {
  return getEntries();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const links = await getEntries();
  return links.map(({ url }) => ({
    url,
    changeFrequency: "weekly" as const,
    priority: url === `${SITE_URL}/regions` ? 0.7 : 0.8,
  }));
}
