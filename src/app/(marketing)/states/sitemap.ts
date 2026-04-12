import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

const STATES = ["qld", "nsw", "vic", "wa", "sa", "tas", "nt", "act"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/states`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...STATES.map((state) => ({
      url: `${SITE_URL}/states/${state}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
