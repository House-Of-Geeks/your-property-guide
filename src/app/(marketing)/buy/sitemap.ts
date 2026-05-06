// On-demand ISR keeps each crawler hit a 24h cache HIT. Lean projection
// (slug + dateAdded + isFeatured) avoids pulling full Property rows + images.
export const revalidate = 86400;

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getPropertySitemapEntries } from "@/lib/services/property-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getPropertySitemapEntries("buy");
  return entries.map((p) => ({
    url: `${SITE_URL}/buy/${p.slug}`,
    lastModified: p.dateAdded,
    changeFrequency: "daily" as const,
    priority: p.isFeatured ? 0.9 : 0.8,
  }));
}
