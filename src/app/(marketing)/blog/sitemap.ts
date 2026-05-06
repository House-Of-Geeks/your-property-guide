// On-demand ISR keeps each crawler hit a 24h cache HIT. Lean projection
// (slug + publishedAt + updatedAt) avoids pulling full markdown bodies.
export const revalidate = 86400;

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getBlogSitemapEntries } from "@/lib/services/blog-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getBlogSitemapEntries();
  return entries.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt ?? post.publishedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
}
