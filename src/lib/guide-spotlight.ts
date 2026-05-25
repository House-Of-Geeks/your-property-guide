// "This week's read" — picks a curated guide to spotlight on the
// homepage hero each day. Deterministic per UTC date so:
//   - All visitors on the same day see the same spotlight (consistent
//     OG previews, sitelinks, social shares)
//   - ISR caches cleanly under the 24h homepage revalidate
//   - The site feels alive (different guide tomorrow) without any
//     stateful infrastructure
//
// Replaces the earlier suburb spotlight. The site's positioning is
// education-led, so the hero's signature visual element should
// feature a guide — what we teach, not a number we report.

// Slugs MUST exist in src/lib/data/blogs.ts (which is what the blog
// service reads from). The static guide routes under
// /guides/buying-property-australia/page.tsx etc. are separate hand-
// written pages and do NOT have records in blogs.ts; using their
// slugs here would return null from getBlogPostBySlug and the card
// would render nothing.
//
// We rotate the most evergreen-but-meaty blog posts that fit a
// "today's read" frame. State market reads, scheme explainers,
// strategy primers.

export const SPOTLIGHT_GUIDE_SLUGS: readonly string[] = [
  "sydney-property-market-2026",
  "melbourne-property-market-2026",
  "brisbane-property-market-2026",
  "perth-property-market-2026",
  "adelaide-property-market-2026",
  "first-home-buyer-schemes-by-state-australia-2026",
  "rentvesting-australia-state-by-state-guide-2026",
  "australia-fastest-growing-suburbs-2026",
  "cheapest-suburbs-buy-house-australia-2026",
  "how-to-buy-property-interstate-australia-2026",
  "federal-budget-2026-property",
  "negative-gearing-changes-2026-budget",
  "cgt-changes-2026-budget",
];

/**
 * Pick today's spotlight guide slug. Deterministic by UTC date so
 * every request on the same day gets the same answer (cache-friendly).
 */
export function pickSpotlightGuideSlug(now: Date = new Date()): string {
  const dayMs = 24 * 60 * 60 * 1000;
  const days = Math.floor(now.getTime() / dayMs);
  const idx = days % SPOTLIGHT_GUIDE_SLUGS.length;
  return SPOTLIGHT_GUIDE_SLUGS[idx];
}
