import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllRegionSlugs } from "@/lib/services/region-service";

export default function sitemap(): MetadataRoute.Sitemap {
  return getAllRegionSlugs().map((slug) => ({
    url: `${SITE_URL}/regions/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
}
