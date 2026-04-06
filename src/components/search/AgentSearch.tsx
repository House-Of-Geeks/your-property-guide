"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Building2, X } from "lucide-react";
import { Button } from "@/components/ui";
import type { SuggestResponse, SuggestLocation, SuggestAgency } from "@/types/suggest";

export function AgentSearch() {
  const router = useRouter();
  const [query, setQuery]       = useState("");
  const [results, setResults]   = useState<SuggestResponse>({ locations: [], schools: [], agencies: [] });
  const [open, setOpen]         = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const inputRef    = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<string>(""); // selected suburb slug

  useEffect(() => {
    if (query.length < 2) {
      setResults({ locations: [], schools: [], agencies: [] });
      setOpen(false);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res  = await fetch(`/api/suggest?q=${encodeURIComponent(query)}&type=agents`);
        const data: SuggestResponse = await res.json();
        setResults(data);
        setOpen(data.locations.length > 0 || data.agencies.length > 0);
        setActiveIdx(-1);
      } catch { /* ignore */ }
    }, 180);
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current?.contains(e.target as Node) === false &&
        inputRef.current?.contains(e.target as Node) === false
      ) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const allItems: Array<{ type: "location"; data: SuggestLocation } | { type: "agency"; data: SuggestAgency }> = [
    ...results.locations.map((d) => ({ type: "location" as const, data: d })),
    ...results.agencies.map((d)  => ({ type: "agency"   as const, data: d })),
  ];

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown")  { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, allItems.length - 1)); }
    if (e.key === "ArrowUp")    { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, -1)); }
    if (e.key === "Escape")     { setOpen(false); }
    if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      const item = allItems[activeIdx];
      if (item.type === "location") pickLocation(item.data);
      else pickAgency(item.data);
    }
    if (e.key === "Enter" && activeIdx < 0) handleSearch();
  }, [open, activeIdx, allItems]); // eslint-disable-line react-hooks/exhaustive-deps

  function pickLocation(loc: SuggestLocation) {
    const label = `${loc.name}, ${loc.state} ${loc.postcode}`;
    setQuery(label);
    selectedRef.current = loc.slug;
    setOpen(false);
  }

  function pickAgency(agency: SuggestAgency) {
    setOpen(false);
    router.push(`/real-estate-agencies/${agency.slug}`);
  }

  function handleSearch() {
    if (selectedRef.current) {
      router.push(`/agents?suburb=${selectedRef.current}`);
    } else if (query.trim()) {
      router.push(`/agents?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="flex gap-2 bg-white rounded-xl shadow-xl p-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); selectedRef.current = ""; }}
            onFocus={() => { if (results.locations.length > 0 || results.agencies.length > 0) setOpen(true); }}
            onKeyDown={handleKeyDown}
            placeholder="Search by suburb, postcode or agency..."
            autoComplete="off"
            className="w-full pl-9 pr-8 py-3 text-sm rounded-lg outline-none focus:ring-2 focus:ring-primary bg-gray-50"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); selectedRef.current = ""; setOpen(false); inputRef.current?.focus(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button onClick={handleSearch} variant="gradient" size="lg" className="shrink-0 px-6">
          <Search className="w-4 h-4" />
          Search
        </Button>
      </div>

      {open && allItems.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
        >
          {results.locations.length > 0 && (
            <div>
              <p className="px-4 pt-3 pb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Suburbs</p>
              {results.locations.map((loc, i) => (
                <button
                  key={loc.slug}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); pickLocation(loc); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${activeIdx === i ? "bg-primary/5 text-primary" : "text-gray-700 hover:bg-gray-50"}`}
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

          {results.agencies.length > 0 && (
            <div className={results.locations.length > 0 ? "border-t border-gray-100" : ""}>
              <p className="px-4 pt-3 pb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Agencies</p>
              {results.agencies.map((agency, i) => {
                const idx = results.locations.length + i;
                return (
                  <button
                    key={agency.slug}
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); pickAgency(agency); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${activeIdx === idx ? "bg-primary/5 text-primary" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>
                      <span className="font-medium">{agency.name}</span>
                      {agency.suburb && <span className="text-gray-500">, {agency.suburb} {agency.state}</span>}
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
