// Build-time prerender exhausts DB connections, so we serve via on-demand
// ISR instead of force-dynamic. Each crawler hit is a cache HIT for 24h.
export const revalidate = 86400;

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllAgencySlugs } from "@/lib/services/agent-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllAgencySlugs();
  return slugs.map((slug) => ({
    url: `${SITE_URL}/real-estate-agencies/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));
}
