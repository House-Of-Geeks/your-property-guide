import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

const CATEGORIES = [
  "for-families",
  "highest-growth",
  "most-affordable",
  "most-walkable",
  "lowest-flood-risk",
  "best-rental-yield",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/best-suburbs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...CATEGORIES.map((cat) => ({
      url: `${SITE_URL}/best-suburbs/${cat}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
