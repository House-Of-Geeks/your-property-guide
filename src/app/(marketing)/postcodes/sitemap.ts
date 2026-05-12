// force-dynamic + unstable_cache — see /suburbs/sitemap.ts.
export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { SITE_URL } from "@/lib/constants";
import { getAllPostcodes } from "@/lib/services/postcode-service";

const getEntries = unstable_cache(
  async (): Promise<MetadataRoute.Sitemap> => {
    const postcodes = await getAllPostcodes();
    return postcodes.map((postcode) => ({
      url: `${SITE_URL}/postcodes/${postcode}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  },
  ["sitemap-postcodes:v1"],
  { revalidate: 86400, tags: ["sitemap-postcodes"] },
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getEntries();
}
