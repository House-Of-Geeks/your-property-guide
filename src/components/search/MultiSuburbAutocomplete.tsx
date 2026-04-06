"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, GraduationCap, Search, X } from "lucide-react";
import type { SuggestResponse, SuggestLocation } from "@/types/suggest";

export interface SelectedSuburb {
  slug: string;
  label: string;
}

interface MultiSuburbAutocompleteProps {
  placeholder?: string;
  showSchools?: boolean;
  selected: SelectedSuburb[];
  onAdd: (suburb: SelectedSuburb) => void;
  onRemove: (slug: string) => void;
  inputClassName?: string;
  size?: "default" | "lg";
}

export function MultiSuburbAutocomplete({
  placeholder = "Try a suburb or postcode...",
  showSchools = false,
  selected,
  onAdd,
  onRemove,
  inputClassName = "",
  size = "default",
}: MultiSuburbAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SuggestResponse>({ locations: [], schools: [], agencies: [] });
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults({ locations: [], schools: [], agencies: [] });
      setOpen(false);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/suggest?q=${encodeURIComponent(q)}`);
        if (!res.ok) return;
        const data: SuggestResponse = await res.json();
        // Filter out already-selected suburbs
        const selectedSlugs = new Set(selected.map((s) => s.slug));
        data.locations = data.locations.filter((l) => !selectedSlugs.has(l.slug));
        setResults(data);
        setOpen(data.locations.length > 0 || (showSchools && data.schools.length > 0));
        setActiveIdx(-1);
      } catch {
        // ignore
      }
    }, 180);
  }, [query, showSchools, selected]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const allItems = [
    ...results.locations.map((d) => ({ type: "location" as const, data: d })),
    ...(showSchools ? results.schools.map((d) => ({ type: "school" as const, data: d })) : []),
  ];

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && query === "" && selected.length > 0) {
        onRemove(selected[selected.length - 1].slug);
        return;
      }
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
        if (item.type === "location") pickLocation(item.data);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    },
    [open, activeIdx, allItems, query, selected] // eslint-disable-line react-hooks/exhaustive-deps
  );

  function pickLocation(loc: SuggestLocation) {
    const label = `${loc.name}, ${loc.state} ${loc.postcode}`;
    onAdd({ slug: loc.slug, label });
    setQuery("");
    setOpen(false);
    setActiveIdx(-1);
    inputRef.current?.focus();
  }

  const padClass = size === "lg" ? "px-5 py-3.5 text-base" : "px-4 py-3 text-sm";

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div
        className={`flex flex-wrap items-center gap-1.5 rounded-xl bg-transparent cursor-text ${padClass} ${inputClassName}`}
        onClick={() => inputRef.current?.focus()}
      >
        <Search className="w-4 h-4 text-gray-400 shrink-0" />

        {/* Pills */}
        {selected.map((s) => (
          <span
            key={s.slug}
            className="inline-flex items-center gap-1 bg-primary/10 text-primary text-sm font-medium px-2.5 py-0.5 rounded-full"
          >
            {s.label}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRemove(s.slug); }}
              className="ml-0.5 hover:text-primary-dark"
              aria-label={`Remove ${s.label}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          onFocus={() => {
            if (results.locations.length > 0) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={selected.length === 0 ? placeholder : "Add another suburb..."}
          autoComplete="off"
          className="flex-1 min-w-[120px] bg-transparent border-0 outline-none focus:ring-0 text-sm placeholder:text-gray-400"
        />

        {(selected.length > 0 || query) && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              selected.forEach((s) => onRemove(s.slug));
            }}
            className="text-gray-400 hover:text-gray-600 ml-1"
            aria-label="Clear all"
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
              {results.locations.map((loc, i) => (
                <button
                  key={loc.slug}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); pickLocation(loc); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                    activeIdx === i ? "bg-primary/5 text-primary" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>
                    <span className="font-medium">{loc.name}</span>
                    <span className="text-gray-500">, {loc.state}, {loc.postcode}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
