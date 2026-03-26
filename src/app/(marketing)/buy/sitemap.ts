import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getProperties } from "@/lib/services/property-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getProperties({ listingType: "buy" });
  return properties.map((p) => ({
    url: `${SITE_URL}/buy/${p.slug}`,
    lastModified: new Date(p.dateAdded),
    changeFrequency: "daily" as const,
    priority: p.isFeatured ? 0.9 : 0.8,
  }));
}
