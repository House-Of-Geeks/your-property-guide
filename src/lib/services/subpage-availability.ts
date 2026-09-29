import { db } from "@/lib/db";
import {
  availabilityFrom,
  everyListingSubpage,
  hasRentalRow,
  type SubpageAvailability,
} from "@/lib/suburb-subpages";

/**
 * The sub-pages of one suburb that have something on them
 * (src/lib/suburb-subpages.ts).
 *
 * One groupBy on the Property table per page render, by the suburbSlug index;
 * the table holds a few hundred rows. It is deliberately not the sub-page
 * sitemaps' cached inventory: a cached read with a 24-hour life inside a page
 * that revalidates weekly shortens the page's own period to 24 hours (Next
 * takes the lowest revalidate used in a render), and every suburb page would
 * re-render seven times as often.
 */
export async function getSuburbSubpageAvailability(
  suburb: { slug: string; dataFreshness?: { rentalSource?: string | null } | null },
): Promise<SubpageAvailability> {
  const rental = hasRentalRow(suburb);
  try {
    const rows = await db.property.groupBy({
      by: ["listingType", "propertyType"],
      where: { suburbSlug: suburb.slug },
    });
    return availabilityFrom(rows, rental);
  } catch (err) {
    // Links are not worth a failed page: fall back to linking every listing
    // sub-page, as the pages did before.
    console.error("[subpage-availability] inventory read failed, linking every listing sub-page:", err);
    return everyListingSubpage(rental);
  }
}
