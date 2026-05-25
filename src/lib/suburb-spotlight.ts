// "This week's read" — picks a curated suburb to spotlight on the
// homepage hero each day. Deterministic per UTC date so:
//   - All visitors on the same day see the same spotlight (consistent
//     OG previews, sitelinks, social shares)
//   - ISR caches cleanly under the 24h homepage revalidate
//   - The page feels alive (different suburb tomorrow) without any
//     stateful infrastructure
//
// Curated list, not random across all 9,600 suburbs, so the spotlight
// always lands on a recognisable name with good data.
//
// CURRENTLY NSW + VIC ONLY. QLD/WA suburbs were removed in 2026-05
// because their underlying price data comes from a 2021 census-mortgage
// proxy that's wildly inaccurate at the suburb level (see
// scripts/sync/sources/sales-qld.ts for the methodology). SA + NT + TAS
// + ACT use ABS annual SA2 data which is real but a year stale —
// acceptable for the spotlight if we expand the list later. For now,
// rotate only suburbs whose sales feed publishes current real prices.

export const SPOTLIGHT_SLUGS: readonly string[] = [
  // NSW — Valuer General, every actual transaction
  "bondi-nsw-2026",
  "newtown-nsw-2042",
  "manly-nsw-2095",
  "mosman-nsw-2088",
  "surry-hills-nsw-2010",
  // VIC — Dept of Transport quarterly suburb medians
  "toorak-vic-3142",
  "richmond-vic-3121",
  "fitzroy-vic-3065",
  "brighton-vic-3186",
  "south-yarra-vic-3141",
];

/**
 * Pick today's spotlight suburb slug. Deterministic by UTC date so
 * every request on the same day gets the same answer (cache-friendly).
 */
export function pickSpotlightSlug(now: Date = new Date()): string {
  // Compute days-since-epoch in UTC. This is the rotation index.
  const dayMs = 24 * 60 * 60 * 1000;
  const days = Math.floor(now.getTime() / dayMs);
  const idx = days % SPOTLIGHT_SLUGS.length;
  return SPOTLIGHT_SLUGS[idx];
}
