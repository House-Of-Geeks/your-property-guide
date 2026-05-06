// On-demand ISR keeps each crawler hit a 24h cache HIT. Lean projection
// (slug + dateAdded) avoids pulling full Property rows + images.
export const revalidate = 86400;

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getPropertySitemapEntries } from "@/lib/services/property-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Skip at build time — runtime DB isn't reachable during `next build`.
  if (process.env.NEXT_PHASE === "phase-production-build") return [];
  const entries = await getPropertySitemapEntries("rent");
  return entries.map((p) => ({
    url: `${SITE_URL}/rent/${p.slug}`,
    lastModified: p.dateAdded,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));
}
