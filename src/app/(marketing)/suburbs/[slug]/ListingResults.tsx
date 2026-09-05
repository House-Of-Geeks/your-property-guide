import { PropertyGrid } from "@/components/property/PropertyGrid";
import { getProperties } from "@/lib/services/property-service";
import type { PropertyType } from "@/types";

interface Props {
  slug: string;
  listingType: "buy" | "rent";
  searchParams: Promise<Record<string, string | undefined>>;
  emptyMessage: string;
}

// The filtered listing grid for /suburbs/[slug]/buy and /rent. Reading
// `searchParams` is a dynamic API: awaited at the top of an ISR page it
// fails the render at request time in this Next version (every suburb's
// /buy and /rent answered 500 in production, 5 Sep 2026). Isolated in a
// Suspense child, the page shell stays cached and only the grid renders per
// request, the same shape the /buy and /rent hub pages use in Results.tsx.
export async function SuburbListingResults({ slug, listingType, searchParams, emptyMessage }: Props) {
  const sp = await searchParams;
  const properties = await getProperties({
    listingType,
    suburb: slug,
    propertyType: sp.propertyType as PropertyType | undefined,
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    minBeds: sp.minBeds ? Number(sp.minBeds) : undefined,
    sort: sp.sort,
  });
  return <PropertyGrid properties={properties} emptyMessage={emptyMessage} />;
}
