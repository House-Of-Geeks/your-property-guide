// force-dynamic + unstable_cache — see /suburbs/sitemap.ts.
export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { getAllSchoolSlugs } from "@/lib/services/school-service";
import { SITE_URL } from "@/lib/constants";

const getEntries = unstable_cache(
  async (): Promise<MetadataRoute.Sitemap> => {
    const slugs = await getAllSchoolSlugs();
    return slugs.map((slug) => ({
      url: `${SITE_URL}/schools/${slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    }));
  },
  ["sitemap-schools:v1"],
  { revalidate: 86400, tags: ["sitemap-schools"] },
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getEntries();
}
