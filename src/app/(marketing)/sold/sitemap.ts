// On-demand ISR keeps each crawler hit a 24h cache HIT. Lean projection
// (slug + dateSold/dateAdded) avoids pulling full Property rows + images.
export const revalidate = 86400;

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getPropertySitemapEntries } from "@/lib/services/property-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getPropertySitemapEntries("sold");
  return entries.map((p) => ({
    url: `${SITE_URL}/sold/${p.slug}`,
    lastModified: p.dateSold ?? p.dateAdded,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
}
