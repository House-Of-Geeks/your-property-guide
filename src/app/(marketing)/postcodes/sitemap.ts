import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllPostcodes } from "@/lib/services/postcode-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const postcodes = await getAllPostcodes();
  return postcodes.map((postcode) => ({
    url: `${SITE_URL}/postcodes/${postcode}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
}
