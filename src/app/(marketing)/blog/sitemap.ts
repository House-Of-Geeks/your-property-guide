import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getBlogPosts } from "@/lib/services/blog-service";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (process.env.NEXT_PHASE === "phase-production-build") return [];
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
}
