"use client";

import { useRouter } from "next/navigation";
import { SuburbAutocomplete } from "./SuburbAutocomplete";

interface JumpToSuburbProps {
  placeholder?: string;
  size?: "default" | "lg";
}

/**
 * Thin Client wrapper around SuburbAutocomplete that navigates straight
 * to the suburb profile (or school page) on selection. Lets Server
 * Components drop in a "jump to suburb" picker without the
 * "Event handlers cannot be passed to Client Component props" error.
 */
export function JumpToSuburb({
  placeholder = "Search by suburb or postcode…",
  size = "default",
}: JumpToSuburbProps) {
  const router = useRouter();
  return (
    <SuburbAutocomplete
      placeholder={placeholder}
      size={size}
      onSelectLocation={(slug) => router.push(`/suburbs/${slug}`)}
      onSelectSchool={(slug) => router.push(`/schools/${slug}`)}
    />
  );
}
