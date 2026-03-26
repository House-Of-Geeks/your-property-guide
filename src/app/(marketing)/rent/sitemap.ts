import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getProperties } from "@/lib/services/property-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getProperties({ listingType: "rent" });
  return properties.map((p) => ({
    url: `${SITE_URL}/rent/${p.slug}`,
    lastModified: new Date(p.dateAdded),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));
}
