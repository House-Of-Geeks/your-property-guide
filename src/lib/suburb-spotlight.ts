// "This week's read" — picks a curated suburb to spotlight on the
// homepage hero each day. Deterministic per UTC date so:
//   - All visitors on the same day see the same spotlight (consistent
//     OG previews, sitelinks, social shares)
//   - ISR caches cleanly under the 24h homepage revalidate
//   - The page feels alive (different suburb tomorrow) without any
//     stateful infrastructure
//
// Curated list, not random across all 9,600 suburbs, so the spotlight
// always lands on a recognisable name with good data. Add/remove slugs
// here to tune the rotation.

export const SPOTLIGHT_SLUGS: readonly string[] = [
  // NSW
  "bondi-nsw-2026",
  "newtown-nsw-2042",
  "manly-nsw-2095",
  "mosman-nsw-2088",
  "surry-hills-nsw-2010",
  // VIC
  "toorak-vic-3142",
  "richmond-vic-3121",
  "fitzroy-vic-3065",
  "brighton-vic-3186",
  "south-yarra-vic-3141",
  // QLD
  "new-farm-qld-4005",
  "teneriffe-qld-4005",
  "paddington-qld-4064",
  "surfers-paradise-qld-4217",
  // WA / SA
  "cottesloe-wa-6011",
  "subiaco-wa-6008",
  "norwood-sa-5067",
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
