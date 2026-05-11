// Surfaces suburb-vs-suburb comparison URLs so Google can discover the
// long-tail comparison pages at scale. Pairs are pulled from
// getTopComparisonPairsByState — top populous suburbs × their nearby
// suburbs, deduped lexicographically — so the sitemap reflects real
// comparison intent rather than every possible pair.
//
// On-demand ISR — each crawler hit is a 24h cache HIT, the underlying
// query runs at most once per day.
export const revalidate = 86400;

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import {
  getTopComparisonPairsByState,
  type ComparisonPair,
} from "@/lib/services/suburb-rankings-service";

// Keep the same state list as the rankings service, in the same order it
// uses, so output is stable.
const STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"];
// Generous per-state cap. ~80 × 8 = up to 640 URLs in one sitemap —
// well under the 50K limit, but enough to give Google real coverage.
const PAIRS_PER_STATE = 80;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (process.env.NEXT_PHASE === "phase-production-build") return [];

  const byState = await Promise.all(
    STATES.map((s) => getTopComparisonPairsByState(s, PAIRS_PER_STATE)),
  );

  const pairs: ComparisonPair[] = byState.flat();

  return pairs.map((p) => ({
    url: `${SITE_URL}/suburbs/${p.aSlug}/vs/${p.bSlug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
}
