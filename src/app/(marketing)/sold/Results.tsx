import { PropertyGrid } from "@/components/property/PropertyGrid";
import { getProperties } from "@/lib/services/property-service";
import type { PropertyType } from "@/types";

interface SoldResultsProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export async function SoldResults({ searchParams }: SoldResultsProps) {
  const params = await searchParams;
  const properties = await getProperties({
    listingType: "sold",
    suburb: params.suburb,
    propertyType: params.propertyType as PropertyType | undefined,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    minBeds: params.minBeds ? Number(params.minBeds) : undefined,
    sort: params.sort,
  });

  return (
    <>
      <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
        {properties.length.toLocaleString()} recently sold
      </p>
      <PropertyGrid properties={properties} emptyMessage="No sold results found matching your criteria." />
    </>
  );
}
