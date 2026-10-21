// force-dynamic + unstable_cache, see /suburbs/sitemap.ts.
export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { SITE_URL } from "@/lib/constants";
import { getAllPostcodesWithState } from "@/lib/services/postcode-service";
import { NOT_PLACES_VERSION } from "@/lib/non-localities";

export type PostcodeSitemapLink = { url: string; title: string };

// Same postcode set as before (LISTED_POSTCODES, four digits, one row per
// postcode). The state is the label only.
const getEntries = unstable_cache(
  async (): Promise<PostcodeSitemapLink[]> => {
    const postcodes = await getAllPostcodesWithState();
    return postcodes.map(({ postcode, state }) => ({
      url: `${SITE_URL}/postcodes/${postcode}`,
      title: `Postcode ${postcode}, ${state}`,
    }));
  },
  ["sitemap-postcodes:v2", NOT_PLACES_VERSION], // v2: state in the HTML label
  { revalidate: 86400, tags: ["sitemap-postcodes"] },
);

export async function getPostcodeSitemapLinks(): Promise<PostcodeSitemapLink[]> {
  return getEntries();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const links = await getEntries();
  return links.map(({ url }) => ({
    url,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));
}
