import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { STATE_NAME } from "@/lib/best-suburbs-headlines";

const STATE_SLUGS = ["qld", "nsw", "vic", "wa", "sa", "tas", "nt", "act"] as const;

// No lastModified: it used to be `new Date()` on every request, which makes
// lastmod meaningless to crawlers. Omit the field rather than fake it.

export type MarketReportSitemapLink = { url: string; title: string };

export function getMarketReportSitemapLinks(): MarketReportSitemapLink[] {
  return [
    {
      url: `${SITE_URL}/market-reports`,
      title: "Australian Property Market Reports",
    },
    ...STATE_SLUGS.map((state) => {
      const name = STATE_NAME[state.toUpperCase()] ?? state.toUpperCase();
      return {
        url: `${SITE_URL}/market-reports/${state}`,
        title: `${name} Property Market Report 2026`,
      };
    }),
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const hub = `${SITE_URL}/market-reports`;
  return getMarketReportSitemapLinks().map(({ url }) => ({
    url,
    changeFrequency: "weekly" as const,
    priority: url === hub ? 0.7 : 0.8,
  }));
}
