// Build-time prerender exhausts DB connections — render on demand and cache daily.
export const revalidate = 86400;

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllAgencySlugs } from "@/lib/services/agent-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Skip at build time — runtime DB isn't reachable during `next build` and
  // the `revalidate` window will populate this on the first crawler hit.
  if (process.env.NEXT_PHASE === "phase-production-build") return [];
  const slugs = await getAllAgencySlugs();
  return slugs.map((slug) => ({
    url: `${SITE_URL}/real-estate-agencies/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));
}
