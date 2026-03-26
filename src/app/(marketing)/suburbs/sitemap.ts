import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllSuburbSlugs } from "@/lib/services/suburb-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllSuburbSlugs();
  return slugs.map((slug) => ({
    url: `${SITE_URL}/suburbs/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
}
