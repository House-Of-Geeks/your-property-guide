import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllHouseAndLandSlugs } from "@/lib/services/house-and-land-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllHouseAndLandSlugs();
  return [
    {
      url: `${SITE_URL}/house-and-land`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    ...slugs.map((slug) => ({
      url: `${SITE_URL}/house-and-land/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
