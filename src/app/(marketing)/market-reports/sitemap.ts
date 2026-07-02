import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

const STATE_SLUGS = ["qld", "nsw", "vic", "wa", "sa", "tas", "nt", "act"] as const;

// No lastModified: it used to be `new Date()` on every request, which makes
// lastmod meaningless to crawlers. Omit the field rather than fake it.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/market-reports`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    ...STATE_SLUGS.map((state) => ({
      url: `${SITE_URL}/market-reports/${state}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
