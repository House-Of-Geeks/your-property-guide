import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllBlogSlugs } from "@/lib/services/blog-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
}
