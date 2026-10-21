// force-dynamic + unstable_cache, see /suburbs/sitemap.ts.
export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { SITE_URL } from "@/lib/constants";
import { getAllAgentSlugs } from "@/lib/services/agent-service";

const getEntries = unstable_cache(
  async (): Promise<MetadataRoute.Sitemap> => {
    const slugs = await getAllAgentSlugs();
    // No lastModified: these rows have no content date. A timestamp taken
    // when the cache filled is not a content date. The directory is also
    // out of the sitemap index.
    return slugs.map((slug) => ({
      url: `${SITE_URL}/agents/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  },
  ["sitemap-agents:v2"],
  { revalidate: 86400, tags: ["sitemap-agents"] },
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getEntries();
}
