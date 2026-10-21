import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { STATE_NAME } from "@/lib/best-suburbs-headlines";

const STATES = ["qld", "nsw", "vic", "wa", "sa", "tas", "nt", "act"];

// No lastModified: it used to be `new Date()` on every request, which makes
// lastmod meaningless to crawlers. Omit the field rather than fake it.

export type StateSitemapLink = { url: string; title: string };

export function getStateSitemapLinks(): StateSitemapLink[] {
  return [
    {
      url: `${SITE_URL}/states`,
      title: "Australian States Property Guide",
    },
    ...STATES.map((state) => {
      const name = STATE_NAME[state.toUpperCase()] ?? state.toUpperCase();
      return {
        url: `${SITE_URL}/states/${state}`,
        title: `${name} Property Market | Suburbs, Schools & Data`,
      };
    }),
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const hub = `${SITE_URL}/states`;
  return getStateSitemapLinks().map(({ url }) => ({
    url,
    changeFrequency: "weekly" as const,
    priority: url === hub ? 0.8 : 0.7,
  }));
}
