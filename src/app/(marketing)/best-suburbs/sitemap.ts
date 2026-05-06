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

const STATES = ["nsw", "vic", "qld", "wa", "sa", "tas", "nt", "act"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/best-suburbs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // National-level category pages
    ...CATEGORIES.map((cat) => ({
      url: `${SITE_URL}/best-suburbs/${cat}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // State-level permutations: 6 categories × 8 states = 48 long-tail SEO pages
    ...CATEGORIES.flatMap((cat) =>
      STATES.map((state) => ({
        url: `${SITE_URL}/best-suburbs/${cat}/${state}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ),
  ];
}
