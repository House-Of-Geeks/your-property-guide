import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getProperties } from "@/lib/services/property-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getProperties({ listingType: "sold" });
  return properties.map((p) => ({
    url: `${SITE_URL}/sold/${p.slug}`,
    lastModified: new Date(p.dateSold ?? p.dateAdded),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
}
