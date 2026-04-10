import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllSuburbSlugsWithDates } from "@/lib/services/suburb-service";

// 15,000 suburbs × 3 URLs = 45,000 per file — under Google's 50,000 limit
const CHUNK_SIZE = 15_000;

export async function generateSitemaps() {
  const suburbs = await getAllSuburbSlugsWithDates();
  const count = Math.ceil(suburbs.length / CHUNK_SIZE);
  return Array.from({ length: count }, (_, i) => ({ id: i }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const suburbs = await getAllSuburbSlugsWithDates();
  const chunk = suburbs.slice(id * CHUNK_SIZE, (id + 1) * CHUNK_SIZE);
  return chunk.flatMap(({ slug, updatedAt }) => [
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
