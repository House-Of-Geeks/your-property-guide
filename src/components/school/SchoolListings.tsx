"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { applyListingFilters, readListingFilters } from "@/components/property/FilteredPropertyGrid";
import { SchoolListingControls } from "./SchoolListingControls";
import type { Property } from "@/types";

export type SchoolListingSets = { buy: Property[]; rent: Property[]; sold: Property[] };

interface Props {
  schoolName: string;
  suburbName: string;
  suburbSlug: string;
  listings: SchoolListingSets;
}

export function schoolListingMode(mode: string | null | undefined): keyof SchoolListingSets {
  return mode === "rent" ? "rent" : mode === "sold" ? "sold" : "buy";
}

// The listing column of /schools/[slug]. The page is ISR and cannot read
// searchParams on the server (see FilteredPropertyGrid), so the server
// passes all three listing sets for the school's suburb and the mode, sort
// and filters from the URL are applied here. Render inside a Suspense
// boundary whose fallback is the server-rendered buy grid or empty state.
export function SchoolListings({ schoolName, suburbName, suburbSlug, listings }: Props) {
  const searchParams = useSearchParams();
  const key = searchParams.toString();
  const { mode, sort, properties } = useMemo(() => {
    const sp = new URLSearchParams(key);
    const mode = schoolListingMode(sp.get("mode"));
    const filters = readListingFilters(sp);
    return { mode, sort: filters.sort ?? "", properties: applyListingFilters(listings[mode], mode, filters) };
  }, [key, listings]);

  return (
    <>
      <SchoolListingControls count={properties.length} schoolName={schoolName} currentSort={sort} />
      {properties.length > 0 ? (
        <PropertyGrid properties={properties} />
      ) : (
        <SchoolListingsEmpty suburbName={suburbName} suburbSlug={suburbSlug} mode={mode} />
      )}
    </>
  );
}

export function SchoolListingsEmpty({ suburbName, suburbSlug, mode = "buy" }: { suburbName: string; suburbSlug: string; mode?: keyof SchoolListingSets }) {
  const what = mode === "rent" ? "rentals" : mode === "sold" ? "recent sales" : "listings";
  return (
    <div className="rounded-xl bg-white border border-gray-200 p-10 text-center">
      <GraduationCap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
      <p className="text-gray-500">No active {what} near {suburbName} right now.</p>
      <Link href={`/suburbs/${suburbSlug}`}
        className="mt-3 inline-block text-sm font-medium text-primary hover:text-primary/80">
        Explore {suburbName} →
      </Link>
    </div>
  );
}
