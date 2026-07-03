import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { CAPITAL_CITIES } from "@/lib/utils/metro";

// No lastModified: same reasoning as market-reports/sitemap.ts — a
// per-request `new Date()` makes lastmod meaningless to crawlers.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/property-market`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    ...CAPITAL_CITIES.map((city) => ({
      url: `${SITE_URL}/property-market/${city.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
