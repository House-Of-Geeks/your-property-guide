// force-dynamic + unstable_cache — see /suburbs/sitemap.ts.
export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { SITE_URL } from "@/lib/constants";
import { getPropertySitemapEntries } from "@/lib/services/property-service";

const getEntries = unstable_cache(
  async (): Promise<MetadataRoute.Sitemap> => {
    const entries = await getPropertySitemapEntries("rent");
    return entries.map((p) => ({
      url: `${SITE_URL}/rent/${p.slug}`,
      lastModified: p.dateAdded,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));
  },
  ["sitemap-rent:v1"],
  { revalidate: 86400, tags: ["sitemap-rent"] },
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getEntries();
}
