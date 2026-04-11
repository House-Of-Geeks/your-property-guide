import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllRegions } from "@/lib/services/region-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const regions = await getAllRegions();
  return [
    {
      url: `${SITE_URL}/regions`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    ...regions.map(({ slug }) => ({
      url: `${SITE_URL}/regions/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
