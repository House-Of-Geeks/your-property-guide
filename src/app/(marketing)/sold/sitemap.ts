// force-dynamic + unstable_cache — see /suburbs/sitemap.ts.
export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { SITE_URL } from "@/lib/constants";
import { getPropertySitemapEntries } from "@/lib/services/property-service";

const getEntries = unstable_cache(
  async (): Promise<MetadataRoute.Sitemap> => {
    const entries = await getPropertySitemapEntries("sold");
    return entries.map((p) => ({
      url: `${SITE_URL}/sold/${p.slug}`,
      lastModified: p.dateSold ?? p.dateAdded,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  },
  ["sitemap-sold:v1"],
  { revalidate: 86400, tags: ["sitemap-sold"] },
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getEntries();
}
