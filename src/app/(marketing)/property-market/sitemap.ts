import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { CAPITAL_CITIES } from "@/lib/utils/metro";

// No lastModified: same reasoning as market-reports/sitemap.ts. A per-request
// date makes lastmod meaningless to crawlers. Omit the field rather than fake it.

export type PropertyMarketSitemapLink = { url: string; title: string };

export function getPropertyMarketSitemapLinks(): PropertyMarketSitemapLink[] {
  return [
    {
      url: `${SITE_URL}/property-market`,
      title: "Australian Property Market 2026: City House Prices and Growth",
    },
    ...CAPITAL_CITIES.map((city) => ({
      url: `${SITE_URL}/property-market/${city.slug}`,
      title: `${city.name} House Prices & Property Market 2026: Median, Growth, Suburbs`,
    })),
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const hub = `${SITE_URL}/property-market`;
  return getPropertyMarketSitemapLinks().map(({ url }) => ({
    url,
    changeFrequency: "weekly" as const,
    priority: url === hub ? 0.7 : 0.8,
  }));
}
