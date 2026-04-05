"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MapPin, GraduationCap, Search, X } from "lucide-react";
import type { SuggestResponse, SuggestLocation, SuggestSchool } from "@/app/api/suggest/route";

/** Decode a suburb slug like "north-lakes-qld-4509" → "North Lakes, QLD 4509" */
export function slugToSuburbLabel(slug: string): string {
  if (!slug) return "";
  const parts = slug.split("-");
  if (parts.length < 3) return slug;
  const postcode = parts[parts.length - 1];
  const state = parts[parts.length - 2].toUpperCase();
  const nameParts = parts.slice(0, -2);
  const name = nameParts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
  return `${name}, ${state} ${postcode}`;
}

interface SuburbAutocompleteProps {
  /** Current suburb slug from URL (to pre-fill display value) */
  defaultSlug?: string;
  placeholder?: string;
  /** Whether to show schools in the dropdown */
  showSchools?: boolean;
  /** Called with the slug when a location is selected */
  onSelectLocation: (slug: string, label: string) => void;
  /** Called when school is selected (navigates directly if not provided) */
  onSelectSchool?: (slug: string) => void;
  /** Called when the input is cleared */
  onClear?: () => void;
  inputClassName?: string;
  /** Size variant */
  size?: "default" | "lg";
}

export function SuburbAutocomplete({
  defaultSlug = "",
  placeholder = "Search by suburb or postcode...",
  showSchools = false,
  onSelectLocation,
  onSelectSchool,
  onClear,
  inputClassName = "",
  size = "default",
}: SuburbAutocompleteProps) {
  const router = useRouter();
  const [query, setQuery] = useState(() => slugToSuburbLabel(defaultSlug));
  const [results, setResults] = useState<SuggestResponse>({ locations: [], schools: [] });
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Track whether the current query is a "confirmed" selection
  const selectedSlugRef = useRef(defaultSlug);

  // Fetch suggestions on query change
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults({ locations: [], schools: [] });
      setOpen(false);
      return;
    }
    // Don't re-fetch if query matches the current selection label
    const currentLabel = slugToSuburbLabel(selectedSlugRef.current);
    if (q === currentLabel) return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/suggest?q=${encodeURIComponent(q)}`);
        if (!res.ok) return;
        const data: SuggestResponse = await res.json();
        setResults(data);
        setOpen(data.locations.length > 0 || (showSchools && data.schools.length > 0));
        setActiveIdx(-1);
      } catch {
        // ignore
      }
    }, 180);
  }, [query, showSchools]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const allItems: Array<{ type: "location"; data: SuggestLocation } | { type: "school"; data: SuggestSchool }> = [
    ...results.locations.map((d) => ({ type: "location" as const, data: d })),
    ...(showSchools ? results.schools.map((d) => ({ type: "school" as const, data: d })) : []),
  ];

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!open) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, allItems.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, -1));
      } else if (e.key === "Enter" && activeIdx >= 0) {
        e.preventDefault();
        const item = allItems[activeIdx];
        if (item.type === "location") {
          pickLocation(item.data);
        } else {
          pickSchool(item.data);
        }
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    },
    [open, activeIdx, allItems] // eslint-disable-line react-hooks/exhaustive-deps
  );

  function pickLocation(loc: SuggestLocation) {
    const label = `${loc.name}, ${loc.state} ${loc.postcode}`;
    setQuery(label);
    selectedSlugRef.current = loc.slug;
    setOpen(false);
    setActiveIdx(-1);
    onSelectLocation(loc.slug, label);
  }

  function pickSchool(school: SuggestSchool) {
    setOpen(false);
    if (onSelectSchool) {
      onSelectSchool(school.slug);
    } else {
      router.push(`/schools/${school.slug}`);
    }
  }

  function handleClear() {
    setQuery("");
    selectedSlugRef.current = "";
    setResults({ locations: [], schools: [] });
    setOpen(false);
    inputRef.current?.focus();
    onClear?.();
  }

  const padClass = size === "lg" ? "px-5 py-4 text-base" : "px-4 py-3 text-sm";
  const hasValue = query.length > 0;

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            selectedSlugRef.current = "";
          }}
          onFocus={() => {
            if (results.locations.length > 0 || (showSchools && results.schools.length > 0)) {
              setOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full rounded-xl border-0 bg-transparent pl-9 pr-8 focus:ring-2 focus:ring-primary outline-none ${padClass} ${inputClassName}`}
        />
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {open && allItems.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
        >
          {results.locations.length > 0 && (
            <div>
              <p className="px-4 pt-3 pb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Locations
              </p>
              {results.locations.map((loc, i) => {
                const idx = i;
                return (
                  <button
                    key={loc.slug}
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); pickLocation(loc); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                      activeIdx === idx ? "bg-primary/5 text-primary" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>
                      <span className="font-medium">{loc.name}</span>
                      <span className="text-gray-500">, {loc.state}, {loc.postcode}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {showSchools && results.schools.length > 0 && (
            <div className={results.locations.length > 0 ? "border-t border-gray-100" : ""}>
              <p className="px-4 pt-3 pb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Schools
              </p>
              {results.schools.map((school, i) => {
                const idx = results.locations.length + i;
                return (
                  <button
                    key={school.slug}
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); pickSchool(school); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                      activeIdx === idx ? "bg-primary/5 text-primary" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>
                      <span className="font-medium">{school.name}</span>
                      {school.suburbName && (
                        <span className="text-gray-500">, {school.state}, {school.postcode}</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
