// force-dynamic + unstable_cache — see /suburbs/sitemap.ts.
export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { SITE_URL } from "@/lib/constants";
import { getAllAgentSlugs } from "@/lib/services/agent-service";

const getEntries = unstable_cache(
  async (): Promise<MetadataRoute.Sitemap> => {
    const slugs = await getAllAgentSlugs();
    return slugs.map((slug) => ({
      url: `${SITE_URL}/agents/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  },
  ["sitemap-agents:v1"],
  { revalidate: 86400, tags: ["sitemap-agents"] },
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getEntries();
}
