import { unstable_cache } from "next/cache";
import { NOT_PLACES_VERSION } from "@/lib/non-localities";
import {
  getTopComparisonPairsByState,
  type ComparisonPair,
} from "@/lib/services/suburb-rankings-service";

// The suburb-vs-suburb pages are an intentional, bounded set: the hand-curated
// popular pairs plus the top pairs per state that the comparison sitemap and
// the /compare hub publish. Any other /suburbs/[slug]/vs/[compareSlug] URL is
// a 404 before it touches the database. Everything that links to a comparison
// page (sitemap, hub, suburb footer links, quiz) reads this one module so a
// live link can never point at a pair the route refuses.

export const COMPARE_STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"];
export const COMPARE_PAIRS_PER_STATE = 80;

export interface PopularComparePair {
  aSlug: string;
  bSlug: string;
  aName: string;
  bName: string;
  subtitle: string;
}

// Hand-curated pairings: the queries most users type ("Bondi vs Coogee",
// "Toorak vs Brighton"). Prerendered at runtime and featured on /compare.
export const POPULAR_COMPARE_PAIRS: PopularComparePair[] = [
  // NSW
  { aSlug: "bondi-nsw-2026",         bSlug: "coogee-nsw-2034",        aName: "Bondi",       bName: "Coogee",        subtitle: "Eastern beaches" },
  { aSlug: "newtown-nsw-2042",       bSlug: "surry-hills-nsw-2010",   aName: "Newtown",     bName: "Surry Hills",   subtitle: "Inner west vs inner east" },
  { aSlug: "manly-nsw-2095",         bSlug: "mosman-nsw-2088",        aName: "Manly",       bName: "Mosman",        subtitle: "Northern beaches" },
  // VIC
  { aSlug: "richmond-vic-3121",      bSlug: "fitzroy-vic-3065",       aName: "Richmond",    bName: "Fitzroy",       subtitle: "Inner Melbourne" },
  { aSlug: "toorak-vic-3142",        bSlug: "brighton-vic-3186",      aName: "Toorak",      bName: "Brighton",      subtitle: "Prestige" },
  { aSlug: "carlton-vic-3053",       bSlug: "south-yarra-vic-3141",   aName: "Carlton",     bName: "South Yarra",   subtitle: "Inner-city living" },
  // QLD
  { aSlug: "new-farm-qld-4005",      bSlug: "teneriffe-qld-4005",     aName: "New Farm",    bName: "Teneriffe",     subtitle: "Inner Brisbane" },
  { aSlug: "paddington-qld-4064",    bSlug: "ashgrove-qld-4060",      aName: "Paddington",  bName: "Ashgrove",      subtitle: "Inner-west character" },
  { aSlug: "bulimba-qld-4171",       bSlug: "hawthorne-qld-4171",     aName: "Bulimba",     bName: "Hawthorne",     subtitle: "Brisbane riverside" },
];

/** Direction-independent key: /A/vs/B and /B/vs/A are the same comparison. */
export function comparePairKey(aSlug: string, bSlug: string): string {
  return [aSlug, bSlug].sort().join("|");
}

/** Top pairs per state, the list the comparison sitemap publishes. */
export const getCompareSitemapPairs = unstable_cache(
  async (): Promise<ComparisonPair[]> => {
    const byState = await Promise.all(
      COMPARE_STATES.map((s) => getTopComparisonPairsByState(s, COMPARE_PAIRS_PER_STATE)),
    );
    return byState.flat();
  },
  ["compare-sitemap-pairs:v1", NOT_PLACES_VERSION],
  { revalidate: 86400, tags: ["sitemap-compare"] },
);

const getAllowedKeys = unstable_cache(
  async (): Promise<string[]> => {
    const pairs = await getCompareSitemapPairs();
    return [
      ...new Set([
        ...POPULAR_COMPARE_PAIRS.map((p) => comparePairKey(p.aSlug, p.bSlug)),
        ...pairs.map((p) => comparePairKey(p.aSlug, p.bSlug)),
      ]),
    ];
  },
  ["compare-allowed-keys:v1", NOT_PLACES_VERSION],
  { revalidate: 86400, tags: ["sitemap-compare"] },
);

async function allowedSet(): Promise<Set<string>> {
  return new Set(await getAllowedKeys());
}

/** Whether /suburbs/[a]/vs/[b] is a published comparison, in either order. */
export async function isAllowedComparePair(aSlug: string, bSlug: string): Promise<boolean> {
  return (await allowedSet()).has(comparePairKey(aSlug, bSlug));
}

/** The candidates that form a published comparison with `slug`. */
export async function allowedCompareSlugs(slug: string, candidates: string[]): Promise<string[]> {
  const set = await allowedSet();
  return candidates.filter((c) => set.has(comparePairKey(slug, c)));
}

/** Every published pair as direction-independent keys, for client-side checks. */
export async function allowedComparePairKeys(): Promise<string[]> {
  return getAllowedKeys();
}
