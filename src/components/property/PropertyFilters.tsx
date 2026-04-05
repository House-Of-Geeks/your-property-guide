"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { Select } from "@/components/ui";
import { SuburbAutocomplete, slugToSuburbLabel } from "@/components/search/SuburbAutocomplete";
import { PROPERTY_TYPES, BEDROOM_OPTIONS, PRICE_RANGES_BUY, PRICE_RANGES_RENT, SORT_OPTIONS } from "@/lib/constants";
import type { ListingType } from "@/types";

interface PropertyFiltersProps {
  listingType: ListingType;
}

export function PropertyFilters({ listingType }: PropertyFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const priceRanges = listingType === "rent" ? PRICE_RANGES_RENT : PRICE_RANGES_BUY;
  const currentSuburbSlug = searchParams.get("suburb") ?? "";

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Suburb autocomplete — replaces the old hardcoded <Select> */}
      <div className="w-full sm:w-64 bg-white border border-gray-200 rounded-xl">
        <SuburbAutocomplete
          key={currentSuburbSlug} // re-mount when slug changes to reset display
          defaultSlug={currentSuburbSlug}
          placeholder="All suburbs..."
          showSchools={false}
          onSelectLocation={(slug) => updateFilter("suburb", slug)}
          onClear={() => updateFilter("suburb", "")}
        />
      </div>

      <div className="w-full sm:w-auto">
        <Select
          options={PROPERTY_TYPES.map((t) => ({ value: t.value, label: t.label }))}
          placeholder="Property Type"
          value={searchParams.get("propertyType") || ""}
          onChange={(e) => updateFilter("propertyType", e.target.value)}
        />
      </div>
      <div className="w-full sm:w-auto">
        <Select
          options={priceRanges.map((p) => ({ value: p.value, label: p.label }))}
          placeholder="Min Price"
          value={searchParams.get("minPrice") || ""}
          onChange={(e) => updateFilter("minPrice", e.target.value)}
        />
      </div>
      <div className="w-full sm:w-auto">
        <Select
          options={priceRanges.map((p) => ({ value: p.value, label: p.label }))}
          placeholder="Max Price"
          value={searchParams.get("maxPrice") || ""}
          onChange={(e) => updateFilter("maxPrice", e.target.value)}
        />
      </div>
      <div className="w-full sm:w-auto">
        <Select
          options={BEDROOM_OPTIONS.map((b) => ({ value: b.value, label: `${b.label} Beds` }))}
          placeholder="Bedrooms"
          value={searchParams.get("minBeds") || ""}
          onChange={(e) => updateFilter("minBeds", e.target.value)}
        />
      </div>
      <div className="w-full sm:w-auto">
        <Select
          options={SORT_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
          placeholder="Sort By"
          value={searchParams.get("sort") || ""}
          onChange={(e) => updateFilter("sort", e.target.value)}
        />
      </div>
    </div>
  );
}
