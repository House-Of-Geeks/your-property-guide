import { hasRentalRow, subpageAvailability, type SubpageAvailability } from "@/lib/suburb-subpages";

/**
 * The sub-pages of one suburb that have something on them
 * (src/lib/suburb-subpages.ts).
 *
 * Until 14 Oct 2026 this ran a groupBy on the Property table per page render
 * to find which listing sub-pages had stock. Those sub-pages are retired
 * (docs/portal-consolidation-2026-10-14.md), so the answer comes from the
 * suburb alone and no query runs. Kept async so the pages that await it
 * need no change.
 */
export async function getSuburbSubpageAvailability(
  suburb: { slug: string; dataFreshness?: { rentalSource?: string | null } | null },
): Promise<SubpageAvailability> {
  return subpageAvailability(hasRentalRow(suburb));
}
