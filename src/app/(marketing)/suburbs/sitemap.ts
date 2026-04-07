import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllSuburbSlugsWithDates } from "@/lib/services/suburb-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const suburbs = await getAllSuburbSlugsWithDates();
  return suburbs.flatMap(({ slug, updatedAt }) => [
    {
      url: `${SITE_URL}/suburbs/${slug}`,
      lastModified: updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/suburbs/${slug}/buy`,
      lastModified: updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/suburbs/${slug}/rent`,
      lastModified: updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.7,
    },
  ]);
}
