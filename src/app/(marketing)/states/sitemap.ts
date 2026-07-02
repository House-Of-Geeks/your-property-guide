import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

const STATES = ["qld", "nsw", "vic", "wa", "sa", "tas", "nt", "act"];

// No lastModified: it used to be `new Date()` on every request, which makes
// lastmod meaningless to crawlers. Omit the field rather than fake it.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/states`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...STATES.map((state) => ({
      url: `${SITE_URL}/states/${state}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
