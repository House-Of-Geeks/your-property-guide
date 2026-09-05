"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { PropertyGrid } from "./PropertyGrid";
import type { ListingType, Property } from "@/types";

export interface ListingFilterParams {
  propertyType?: string | null; // single value or comma-separated list
  minPrice?: string | null;
  maxPrice?: string | null;
  minBeds?: string | null;
  minBaths?: string | null;
  minCars?: string | null;
  sort?: string | null;         // "" | "newest" | "price-asc" | "price-desc" | "beds-desc"
}

export function readListingFilters(searchParams: URLSearchParams): ListingFilterParams {
  return {
    propertyType: searchParams.get("propertyType"),
    minPrice: searchParams.get("minPrice"),
    maxPrice: searchParams.get("maxPrice"),
    minBeds: searchParams.get("minBeds"),
    minBaths: searchParams.get("minBaths"),
    minCars: searchParams.get("minCars"),
    sort: searchParams.get("sort"),
  };
}

// Client-side counterpart of the server-side filtering in getProperties().
// ISR routes with no build-time render (the suburb and school pages) cannot
// read `searchParams` on the server: that is a dynamic-API call during the
// ISR render and it throws DYNAMIC_SERVER_USAGE (every suburb /buy and /rent
// page answered 500 in production until 5 Sep 2026). So the server renders
// the full (capped) listing set once, caches it, and the filters from the
// URL are applied here. Same semantics as getProperties: a price filter
// excludes listings with no numeric price; "" and "newest" keep the server's
// newest-first order.
export function applyListingFilters(properties: Property[], listingType: ListingType, f: ListingFilterParams): Property[] {
  const types = (f.propertyType ?? "").split(",").map((t) => t.trim()).filter(Boolean);
  const minPrice = Number(f.minPrice) || 0;
  const maxPrice = Number(f.maxPrice) || 0;
  const minBeds = Number(f.minBeds) || 0;
  const minBaths = Number(f.minBaths) || 0;
  const minCars = Number(f.minCars) || 0;
  const priceOf = (p: Property): number | null =>
    listingType === "rent" ? (p.price.rentPerWeek ?? p.price.value) : p.price.value;

  const out = properties.filter((p) => {
    if (types.length && !types.includes(p.propertyType)) return false;
    if (minBeds && p.features.bedrooms < minBeds) return false;
    if (minBaths && p.features.bathrooms < minBaths) return false;
    if (minCars && p.features.carSpaces < minCars) return false;
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
  switch (f.sort ?? "") {
    case "price-asc":  return [...out].sort(byPrice(1));
    case "price-desc": return [...out].sort(byPrice(-1));
    case "beds-desc":  return [...out].sort((a, b) => b.features.bedrooms - a.features.bedrooms);
    case "newest":     return [...out].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    default:           return out; // server order: newest first
  }
}

interface FilteredPropertyGridProps {
  properties: Property[];
  listingType: ListingType;
  emptyMessage?: string;
}

// Render inside a Suspense boundary whose fallback is the unfiltered
// PropertyGrid: the fallback is what lands in the static HTML for crawlers,
// and the filtered grid takes over on the client.
export function FilteredPropertyGrid({ properties, listingType, emptyMessage }: FilteredPropertyGridProps) {
  const searchParams = useSearchParams();
  const key = searchParams.toString();
  const filtered = useMemo(
    () => applyListingFilters(properties, listingType, readListingFilters(new URLSearchParams(key))),
    [properties, listingType, key],
  );
  return <PropertyGrid properties={filtered} emptyMessage={emptyMessage} />;
}
