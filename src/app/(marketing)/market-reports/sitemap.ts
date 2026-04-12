import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

const STATE_SLUGS = ["qld", "nsw", "vic", "wa", "sa", "tas", "nt", "act"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/market-reports`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    ...STATE_SLUGS.map((state) => ({
      url: `${SITE_URL}/market-reports/${state}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
