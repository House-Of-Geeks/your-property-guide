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
