"use client";

import { useRouter } from "next/navigation";
import { SuburbAutocomplete } from "@/components/search/SuburbAutocomplete";

// Co-located client wrapper, the homepage hero's "Or, start with a suburb"
// search bar. Routes to the suburb profile on selection.

export function HomeSuburbSearch() {
  const router = useRouter();
  return (
    <SuburbAutocomplete
      placeholder="Try a suburb, postcode or school…"
      showSchools
      onSelectLocation={(slug) => router.push(`/suburbs/${slug}`)}
      onSelectSchool={(slug) => router.push(`/schools/${slug}`)}
      size="lg"
    />
  );
}
