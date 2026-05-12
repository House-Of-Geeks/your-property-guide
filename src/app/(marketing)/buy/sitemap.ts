// force-dynamic + unstable_cache — see /suburbs/sitemap.ts for why the
// previous `revalidate` + build-phase-guard pattern was baking empty
// sitemaps that never regenerated.
export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { SITE_URL } from "@/lib/constants";
import { getPropertySitemapEntries } from "@/lib/services/property-service";

const getEntries = unstable_cache(
  async (): Promise<MetadataRoute.Sitemap> => {
    const entries = await getPropertySitemapEntries("buy");
    return entries.map((p) => ({
      url: `${SITE_URL}/buy/${p.slug}`,
      lastModified: p.dateAdded,
      changeFrequency: "daily" as const,
      priority: p.isFeatured ? 0.9 : 0.8,
    }));
  },
  ["sitemap-buy:v1"],
  { revalidate: 86400, tags: ["sitemap-buy"] },
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getEntries();
}
