import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllSuburbSlugs } from "@/lib/services/suburb-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllSuburbSlugs();
  return slugs.flatMap((slug) => [
    {
      url: `${SITE_URL}/suburbs/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/suburbs/${slug}/buy`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/suburbs/${slug}/rent`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    },
  ]);
}
