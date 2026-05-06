import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllPostcodes } from "@/lib/services/postcode-service";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (process.env.NEXT_PHASE === "phase-production-build") return [];
  const postcodes = await getAllPostcodes();
  return postcodes.map((postcode) => ({
    url: `${SITE_URL}/postcodes/${postcode}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
}
