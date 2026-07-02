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

// No lastModified: it used to be `new Date()` on every request, which makes
// lastmod meaningless to crawlers. Omit the field rather than fake it.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/best-suburbs`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // National-level category pages
    ...CATEGORIES.map((cat) => ({
      url: `${SITE_URL}/best-suburbs/${cat}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // State-level permutations: 6 categories × 8 states = 48 long-tail SEO pages
    ...CATEGORIES.flatMap((cat) =>
      STATES.map((state) => ({
        url: `${SITE_URL}/best-suburbs/${cat}/${state}`,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ),
  ];
}
