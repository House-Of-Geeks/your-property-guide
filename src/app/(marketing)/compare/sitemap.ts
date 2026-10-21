// Surfaces suburb-vs-suburb comparison URLs so Google can discover the
// long-tail comparison pages at scale. Pairs are pulled from
// getTopComparisonPairsByState, top populous suburbs × their nearby
// suburbs, deduped lexicographically, so the sitemap reflects real
// comparison intent rather than every possible pair.
//
// force-dynamic + unstable_cache, see /suburbs/sitemap.ts.
export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { SITE_URL } from "@/lib/constants";
import { canonicalComparePath } from "@/lib/suburb-indexability";
import { NOT_PLACES_VERSION } from "@/lib/non-localities";
import {
  getTopComparisonPairsByState,
  type ComparisonPair,
} from "@/lib/services/suburb-rankings-service";

const STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"];
const PAIRS_PER_STATE = 80;

export type CompareSitemapLink = { url: string; title: string };

const getEntries = unstable_cache(
  async (): Promise<CompareSitemapLink[]> => {
    const byState = await Promise.all(
      STATES.map((s) => getTopComparisonPairsByState(s, PAIRS_PER_STATE)),
    );
    const pairs: ComparisonPair[] = byState.flat();
    const nameBySlug = new Map<string, string>();
    for (const pair of pairs) {
      nameBySlug.set(pair.aSlug, pair.aName);
      nameBySlug.set(pair.bSlug, pair.bName);
    }
    // The canonical order of each pair, once: the page canonicalises to the
    // lexicographic order, so that is the URL to submit.
    const paths = [...new Set(pairs.map((p) => canonicalComparePath(p.aSlug, p.bSlug)))];
    return paths.map((path) => {
      const [, aSlug, , bSlug] = path.split("/").slice(1);
      const aName = nameBySlug.get(aSlug) ?? aSlug;
      const bName = nameBySlug.get(bSlug) ?? bSlug;
      return {
        url: `${SITE_URL}${path}`,
        title: `${aName} vs ${bName}`,
      };
    });
  },
  ["sitemap-compare:v4", NOT_PLACES_VERSION], // v4: titles; v3 URL rules (no postal delivery name) unchanged
  { revalidate: 86400, tags: ["sitemap-compare"] },
);

export async function getCompareSitemapLinks(): Promise<CompareSitemapLink[]> {
  return getEntries();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const links = await getEntries();
  return links.map(({ url }) => ({
    url,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
}
