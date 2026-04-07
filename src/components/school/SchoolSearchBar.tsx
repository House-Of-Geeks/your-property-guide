"use client";

import { useState, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { PROPERTY_TYPES, BEDROOM_OPTIONS, PRICE_RANGES_BUY, PRICE_RANGES_RENT } from "@/lib/constants";

const LISTING_MODES = [
  { value: "buy",  label: "Buy" },
  { value: "rent", label: "Rent" },
  { value: "sold", label: "Sold" },
] as const;

interface Props {
  schoolName: string;
  currentMode: string;
}

export function SchoolSearchBar({ schoolName, currentMode }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [modeOpen,  setModeOpen]  = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [bedsOpen,  setBedsOpen]  = useState(false);
  const [typeOpen,  setTypeOpen]  = useState(false);

  const mode        = currentMode || "buy";
  const minPrice    = searchParams.get("minPrice") ?? "";
  const maxPrice    = searchParams.get("maxPrice") ?? "";
  const minBeds     = searchParams.get("minBeds") ?? "";
  const propertyType = searchParams.get("propertyType") ?? "";
  const priceRanges = mode === "rent" ? PRICE_RANGES_RENT : PRICE_RANGES_BUY;

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function setMode(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value !== "buy") params.set("mode", value); else params.delete("mode");
    // Reset price when switching mode (buy/rent have different ranges)
    params.delete("minPrice");
    params.delete("maxPrice");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setModeOpen(false);
  }

  const priceLabel = (() => {
    const min = priceRanges.find((p) => p.value === minPrice)?.label;
    const max = priceRanges.find((p) => p.value === maxPrice)?.label;
    if (min && max) return `${min} – ${max}`;
    if (min) return `${min}+`;
    if (max) return `Up to ${max}`;
    return "Price";
  })();

  const bedsLabel = minBeds ? `${minBeds}+ beds` : "Beds";
  const typeLabel = PROPERTY_TYPES.find((t) => t.value === propertyType)?.label ?? "Property types";

  const modeLabel = LISTING_MODES.find((m) => m.value === mode)?.label ?? "Buy";

  const hasFilters = !!(minPrice || maxPrice || minBeds || propertyType);

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 flex-wrap">

        {/* School name "search" */}
        <div className="flex items-center gap-2 flex-1 min-w-0 bg-white border border-gray-300 rounded-full px-4 py-2 hover:border-gray-400 transition-colors cursor-default max-w-sm">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="text-sm text-gray-800 truncate font-medium">{schoolName}</span>
        </div>

        {/* Filters icon */}
        <button
          type="button"
          onClick={() => {}}
          className={`p-2 rounded-full border transition-colors ${hasFilters ? "border-primary text-primary" : "border-gray-300 text-gray-600 hover:border-gray-400"}`}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {/* Mode toggle */}
        <div className="relative">
          <button
            type="button"
            onClick={() => { setModeOpen((o) => !o); setPriceOpen(false); setBedsOpen(false); setTypeOpen(false); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-colors cursor-pointer ${
              mode !== "buy" ? "border-primary text-primary bg-primary/5" : "border-gray-300 text-gray-700 hover:border-gray-400"
            }`}
          >
            {modeLabel} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${modeOpen ? "rotate-180" : ""}`} />
          </button>
          {modeOpen && (
            <div className="absolute top-full mt-1 left-0 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden w-32">
              {LISTING_MODES.map((m) => (
                <button key={m.value} type="button" onClick={() => setMode(m.value)}
                  className={`w-full text-left px-4 py-2.5 text-sm cursor-pointer transition-colors ${m.value === mode ? "bg-primary/5 text-primary font-medium" : "text-gray-700 hover:bg-gray-50"}`}>
                  {m.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="relative">
          <button
            type="button"
            onClick={() => { setPriceOpen((o) => !o); setModeOpen(false); setBedsOpen(false); setTypeOpen(false); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-colors cursor-pointer ${
              (minPrice || maxPrice) ? "border-primary text-primary bg-primary/5" : "border-gray-300 text-gray-700 hover:border-gray-400"
            }`}
          >
            {priceLabel} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${priceOpen ? "rotate-180" : ""}`} />
          </button>
          {priceOpen && (
            <div className="absolute top-full mt-1 left-0 bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-4 w-64">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Min price</p>
                  <select value={minPrice} onChange={(e) => update("minPrice", e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary">
                    <option value="">Any</option>
                    {priceRanges.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Max price</p>
                  <select value={maxPrice} onChange={(e) => update("maxPrice", e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary">
                    <option value="">Any</option>
                    {priceRanges.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Beds */}
        <div className="relative">
          <button
            type="button"
            onClick={() => { setBedsOpen((o) => !o); setModeOpen(false); setPriceOpen(false); setTypeOpen(false); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-colors cursor-pointer ${
              minBeds ? "border-primary text-primary bg-primary/5" : "border-gray-300 text-gray-700 hover:border-gray-400"
            }`}
          >
            {bedsLabel} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${bedsOpen ? "rotate-180" : ""}`} />
          </button>
          {bedsOpen && (
            <div className="absolute top-full mt-1 left-0 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden w-36">
              <button type="button" onClick={() => { update("minBeds", ""); setBedsOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm cursor-pointer transition-colors ${!minBeds ? "bg-primary/5 text-primary font-medium" : "text-gray-700 hover:bg-gray-50"}`}>Any</button>
              {BEDROOM_OPTIONS.map((b) => (
                <button key={b.value} type="button" onClick={() => { update("minBeds", b.value); setBedsOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm cursor-pointer transition-colors ${b.value === minBeds ? "bg-primary/5 text-primary font-medium" : "text-gray-700 hover:bg-gray-50"}`}>
                  {b.label}+ beds
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Property type */}
        <div className="relative">
          <button
            type="button"
            onClick={() => { setTypeOpen((o) => !o); setModeOpen(false); setPriceOpen(false); setBedsOpen(false); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-colors cursor-pointer ${
              propertyType ? "border-primary text-primary bg-primary/5" : "border-gray-300 text-gray-700 hover:border-gray-400"
            }`}
          >
            {typeLabel} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${typeOpen ? "rotate-180" : ""}`} />
          </button>
          {typeOpen && (
            <div className="absolute top-full mt-1 left-0 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden w-44">
              <button type="button" onClick={() => { update("propertyType", ""); setTypeOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm cursor-pointer transition-colors ${!propertyType ? "bg-primary/5 text-primary font-medium" : "text-gray-700 hover:bg-gray-50"}`}>Any type</button>
              {PROPERTY_TYPES.map((t) => (
                <button key={t.value} type="button" onClick={() => { update("propertyType", t.value); setTypeOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm cursor-pointer transition-colors ${t.value === propertyType ? "bg-primary/5 text-primary font-medium" : "text-gray-700 hover:bg-gray-50"}`}>
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
