"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import type { SuggestLocation } from "@/types/suggest";

const STATES = [
  { code: "NSW", label: "New South Wales" },
  { code: "VIC", label: "Victoria" },
  { code: "QLD", label: "Queensland" },
  { code: "WA",  label: "Western Australia" },
  { code: "SA",  label: "South Australia" },
  { code: "TAS", label: "Tasmania" },
  { code: "NT",  label: "Northern Territory" },
  { code: "ACT", label: "ACT" },
];

interface Props {
  defaultQ?: string;
  defaultState?: string;
}

export function SuburbsSearchBar({ defaultQ = "", defaultState = "" }: Props) {
  const router = useRouter();
  const [query, setQuery]       = useState(defaultQ);
  const [state, setState]       = useState(defaultState);
  const [results, setResults]   = useState<SuggestLocation[]>([]);
  const [open, setOpen]         = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const wrapperRef  = useRef<HTMLDivElement>(null);

  // Fetch suggestions
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) { setResults([]); setOpen(false); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res  = await fetch(`/api/suggest?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data.locations ?? []);
        setOpen((data.locations ?? []).length > 0);
        setActiveIdx(-1);
      } catch { /* ignore */ }
    }, 180);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function pickLocation(loc: SuggestLocation) {
    setOpen(false);
    router.push(`/suburbs/${loc.slug}`);
  }

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, -1)); }
    else if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); pickLocation(results[activeIdx]); }
    else if (e.key === "Escape") setOpen(false);
  }, [open, activeIdx, results]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOpen(false);
    const params = new URLSearchParams();
    if (state) params.set("state", state);
    if (query.trim()) params.set("q", query.trim());
    const qs = params.toString();
    router.push(`/suburbs${qs ? `?${qs}` : ""}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-3 max-w-3xl mx-auto">
      {/* Search input with autocomplete */}
      <div ref={wrapperRef} className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search by suburb name or postcode…"
          autoComplete="off"
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black bg-white"
        />

        {open && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
            {results.map((loc, i) => (
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
                  <span className="text-gray-500">, {loc.state} {loc.postcode}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <select
        value={state}
        onChange={(e) => setState(e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-black bg-white"
      >
        <option value="">All States</option>
        {STATES.map((s) => (
          <option key={s.code} value={s.code}>{s.code} — {s.label}</option>
        ))}
      </select>

      <button
        type="submit"
        className="px-5 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors"
      >
        Search
      </button>
    </form>
  );
}
