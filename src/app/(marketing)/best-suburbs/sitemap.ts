import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { isRanked, type RankingCategory } from "@/lib/ranking-notes";
import { bestSuburbsStateTitle } from "@/lib/best-suburbs-headlines";

const CATEGORIES: RankingCategory[] = [
  "for-families",
  "highest-growth",
  "most-affordable",
  "most-walkable",
  "lowest-flood-risk",
  "best-rental-yield",
];

const STATES = ["nsw", "vic", "qld", "wa", "sa", "tas", "nt", "act"];

// National <title> values, from CATEGORY_CONFIG in BestSuburbsListing plus
// " in Australia". Kept here so the sitemap module does not import the
// listing component.
const NATIONAL_TITLE: Record<RankingCategory, string> = {
  "for-families": "Best Suburbs for Families in Australia",
  "highest-growth": "Highest Growth Suburbs in Australia",
  "most-affordable": "Most Affordable Suburbs in Australia",
  "most-walkable": "Most Walkable Suburbs in Australia",
  "lowest-flood-risk": "Lowest Flood Risk Suburbs in Australia",
  "best-rental-yield": "Best Rental Yield Suburbs in Australia",
};

// No lastModified: it used to be `new Date()` on every request, which makes
// lastmod meaningless to crawlers. Omit the field rather than fake it.

export type BestSuburbSitemapLink = { url: string; title: string };

export function getBestSuburbSitemapLinks(): BestSuburbSitemapLink[] {
  return [
    {
      url: `${SITE_URL}/best-suburbs`,
      title: "Best Suburbs in Australia",
    },
    ...CATEGORIES.map((cat) => ({
      url: `${SITE_URL}/best-suburbs/${cat}`,
      title: NATIONAL_TITLE[cat],
    })),
    // State-level permutations: 6 categories × 8 states, less the states with
    // nothing to rank (those pages say why and answer noindex).
    ...CATEGORIES.flatMap((cat) =>
      STATES.filter((state) => isRanked(cat, state.toUpperCase())).map((state) => ({
        url: `${SITE_URL}/best-suburbs/${cat}/${state}`,
        title: bestSuburbsStateTitle(cat, state.toUpperCase()),
      })),
    ),
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  return getBestSuburbSitemapLinks().map(({ url }) => {
    // /best-suburbs is one segment, /best-suburbs/{cat} two, /best-suburbs/{cat}/{state} three.
    const segments = new URL(url).pathname.split("/").filter(Boolean).length;
    const priority = segments === 1 ? 0.8 : segments === 2 ? 0.7 : 0.6;
    return {
      url,
      changeFrequency: "weekly" as const,
      priority,
    };
  });
}
