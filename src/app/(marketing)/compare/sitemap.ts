// Surfaces suburb-vs-suburb comparison URLs so Google can discover the
// long-tail comparison pages at scale. Pairs are pulled from
// getTopComparisonPairsByState — top populous suburbs × their nearby
// suburbs, deduped lexicographically — so the sitemap reflects real
// comparison intent rather than every possible pair.
//
// force-dynamic + unstable_cache — see /suburbs/sitemap.ts.
export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { SITE_URL } from "@/lib/constants";
import {
  getTopComparisonPairsByState,
  type ComparisonPair,
} from "@/lib/services/suburb-rankings-service";

const STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"];
const PAIRS_PER_STATE = 80;

const getEntries = unstable_cache(
  async (): Promise<MetadataRoute.Sitemap> => {
    const byState = await Promise.all(
      STATES.map((s) => getTopComparisonPairsByState(s, PAIRS_PER_STATE)),
    );
    const pairs: ComparisonPair[] = byState.flat();
    return pairs.map((p) => ({
      url: `${SITE_URL}/suburbs/${p.aSlug}/vs/${p.bSlug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  },
  ["sitemap-compare:v1"],
  { revalidate: 86400, tags: ["sitemap-compare"] },
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getEntries();
}
