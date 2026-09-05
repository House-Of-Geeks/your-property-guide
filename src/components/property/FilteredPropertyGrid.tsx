"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { PropertyGrid } from "./PropertyGrid";
import type { ListingType, Property } from "@/types";

interface FilteredPropertyGridProps {
  properties: Property[];
  listingType: ListingType;
  emptyMessage?: string;
}

// Client-side counterpart of the server-side filtering in getProperties().
// The suburb /buy and /rent pages are ISR routes with no build-time render,
// and reading `searchParams` on the server during an ISR render throws
// DYNAMIC_SERVER_USAGE (every suburb's /buy and /rent page answered 500 in
// production, 5 Sep 2026). So the server renders the suburb's full (capped)
// listing set once and caches it, and the filters from PropertyFilters are
// applied here from the URL. Render this inside a Suspense boundary whose
// fallback is the unfiltered PropertyGrid: that fallback is what lands in
// the static HTML for crawlers, and the filtered grid takes over on the
// client. Same filter semantics as getProperties: a price filter excludes
// listings with no numeric price, sort defaults to the server's newest-first.
export function FilteredPropertyGrid({ properties, listingType, emptyMessage }: FilteredPropertyGridProps) {
  const searchParams = useSearchParams();
  const propertyType = searchParams.get("propertyType") || "";
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || 0;
  const minBeds = Number(searchParams.get("minBeds")) || 0;
  const sort = searchParams.get("sort") || "";

  const filtered = useMemo(() => {
    const priceOf = (p: Property): number | null =>
      listingType === "rent" ? (p.price.rentPerWeek ?? p.price.value) : p.price.value;
    const out = properties.filter((p) => {
      if (propertyType && p.propertyType !== propertyType) return false;
      if (minBeds && p.features.bedrooms < minBeds) return false;
      if (minPrice || maxPrice) {
        const price = priceOf(p);
        if (price == null) return false;
        if (minPrice && price < minPrice) return false;
        if (maxPrice && price > maxPrice) return false;
      }
      return true;
    });
    const byPrice = (dir: 1 | -1) => (a: Property, b: Property) => {
      const pa = priceOf(a), pb = priceOf(b);
      if (pa == null && pb == null) return 0;
      if (pa == null) return 1;
      if (pb == null) return -1;
      return (pa - pb) * dir;
    };
    switch (sort) {
      case "price-asc":  return [...out].sort(byPrice(1));
      case "price-desc": return [...out].sort(byPrice(-1));
      case "beds-desc":  return [...out].sort((a, b) => b.features.bedrooms - a.features.bedrooms);
      default:           return out; // server order: newest first
    }
  }, [properties, listingType, propertyType, minPrice, maxPrice, minBeds, sort]);

  return <PropertyGrid properties={filtered} emptyMessage={emptyMessage} />;
}
