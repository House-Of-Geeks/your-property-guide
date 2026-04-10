import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllSuburbSlugsWithDates } from "@/lib/services/suburb-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const suburbs = await getAllSuburbSlugsWithDates();
  return suburbs.map(({ slug, updatedAt }) => ({
    url: `${SITE_URL}/suburbs/${slug}`,
    lastModified: updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
}
