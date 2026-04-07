"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { PROPERTY_TYPES, BEDROOM_OPTIONS, PRICE_RANGES_BUY, PRICE_RANGES_RENT } from "@/lib/constants";

const LISTING_MODES = [
  { value: "buy",  label: "Buy" },
  { value: "rent", label: "Rent" },
  { value: "sold", label: "Sold" },
] as const;

const PARKING_OPTIONS = [
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
];

interface Props {
  schoolName: string;
  currentMode: string;
}

export function SchoolSearchBar({ schoolName, currentMode }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [modeOpen,   setModeOpen]   = useState(false);
  const [priceOpen,  setPriceOpen]  = useState(false);
  const [bedsOpen,   setBedsOpen]   = useState(false);
  const [typeOpen,   setTypeOpen]   = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const mode         = currentMode || "buy";
  const minPrice     = searchParams.get("minPrice") ?? "";
  const maxPrice     = searchParams.get("maxPrice") ?? "";
  const minBeds      = searchParams.get("minBeds") ?? "";
  const minBaths     = searchParams.get("minBaths") ?? "";
  const minCars      = searchParams.get("minCars") ?? "";
  const propertyType = searchParams.get("propertyType") ?? "";
  const priceRanges  = mode === "rent" ? PRICE_RANGES_RENT : PRICE_RANGES_BUY;

  // Draft state for the filter panel (committed only on Apply)
  const [draftTypes,    setDraftTypes]    = useState<string[]>([]);
  const [draftMinPrice, setDraftMinPrice] = useState("");
  const [draftMaxPrice, setDraftMaxPrice] = useState("");
  const [draftMinBeds,  setDraftMinBeds]  = useState("");
  const [draftMinBaths, setDraftMinBaths] = useState("");
  const [draftMinCars,  setDraftMinCars]  = useState("");

  // Sync draft from URL when panel opens
  const prevFilterOpen = useRef(false);
  useEffect(() => {
    if (filterOpen && !prevFilterOpen.current) {
      setDraftTypes(propertyType ? propertyType.split(",").filter(Boolean) : []);
      setDraftMinPrice(minPrice);
      setDraftMaxPrice(maxPrice);
      setDraftMinBeds(minBeds);
      setDraftMinBaths(minBaths);
      setDraftMinCars(minCars);
    }
    prevFilterOpen.current = filterOpen;
  }, [filterOpen, propertyType, minPrice, maxPrice, minBeds, minBaths, minCars]);

  // Close dropdowns when clicking outside
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setModeOpen(false);
        setPriceOpen(false);
        setBedsOpen(false);
        setTypeOpen(false);
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function setMode(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value !== "buy") params.set("mode", value); else params.delete("mode");
    params.delete("minPrice");
    params.delete("maxPrice");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setModeOpen(false);
  }

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());
    if (draftTypes.length > 0) params.set("propertyType", draftTypes.join(",")); else params.delete("propertyType");
    if (draftMinPrice) params.set("minPrice", draftMinPrice); else params.delete("minPrice");
    if (draftMaxPrice) params.set("maxPrice", draftMaxPrice); else params.delete("maxPrice");
    if (draftMinBeds) params.set("minBeds", draftMinBeds); else params.delete("minBeds");
    if (draftMinBaths) params.set("minBaths", draftMinBaths); else params.delete("minBaths");
    if (draftMinCars) params.set("minCars", draftMinCars); else params.delete("minCars");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setFilterOpen(false);
  }

  function resetFilters() {
    setDraftTypes([]);
    setDraftMinPrice("");
    setDraftMaxPrice("");
    setDraftMinBeds("");
    setDraftMinBaths("");
    setDraftMinCars("");
  }

  function toggleDraftType(value: string) {
    setDraftTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
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
  const typeActiveCount = propertyType ? propertyType.split(",").filter(Boolean).length : 0;
  const typePillLabel = typeActiveCount === 1
    ? PROPERTY_TYPES.find((t) => t.value === propertyType)?.label ?? "Property types"
    : typeActiveCount > 1
    ? `${typeActiveCount} types`
    : "Property types";

  const modeLabel = LISTING_MODES.find((m) => m.value === mode)?.label ?? "Buy";

  const filterActiveCount = [
    propertyType ? 1 : 0,
    minPrice || maxPrice ? 1 : 0,
    minBeds ? 1 : 0,
    minBaths ? 1 : 0,
    minCars ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const draftPriceRanges = mode === "rent" ? PRICE_RANGES_RENT : PRICE_RANGES_BUY;

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-30" ref={barRef}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 flex-wrap">

        {/* School name */}
        <div className="flex items-center gap-2 flex-1 min-w-0 bg-white border border-gray-300 rounded-full px-4 py-2 hover:border-gray-400 transition-colors cursor-default max-w-sm">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="text-sm text-gray-800 truncate font-medium">{schoolName}</span>
        </div>

        {/* Filters icon */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setFilterOpen((o) => !o);
              setModeOpen(false); setPriceOpen(false); setBedsOpen(false); setTypeOpen(false);
            }}
            className={`relative p-2 rounded-full border transition-colors ${filterActiveCount > 0 || filterOpen ? "border-primary text-primary bg-primary/5" : "border-gray-300 text-gray-600 hover:border-gray-400"}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {filterActiveCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center leading-none">
                {filterActiveCount}
              </span>
            )}
          </button>

          {/* Full filter panel */}
          {filterOpen && (
            <div className="absolute top-full mt-2 left-0 bg-white rounded-2xl shadow-2xl border border-gray-100 z-40 w-80 p-5">
              {/* Property types */}
              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-900 mb-3">Property types</p>
                <div className="grid grid-cols-2 gap-2">
                  {PROPERTY_TYPES.map((t) => (
                    <label key={t.value} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={draftTypes.includes(t.value)}
                        onChange={() => toggleDraftType(t.value)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">{t.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <hr className="border-gray-100 mb-4" />

              {/* Price */}
              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-900 mb-3">Price</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Min</p>
                    <select
                      value={draftMinPrice}
                      onChange={(e) => setDraftMinPrice(e.target.value)}
                      className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary"
                    >
                      <option value="">Any</option>
                      {draftPriceRanges.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Max</p>
                    <select
                      value={draftMaxPrice}
                      onChange={(e) => setDraftMaxPrice(e.target.value)}
                      className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary"
                    >
                      <option value="">Any</option>
                      {draftPriceRanges.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100 mb-4" />

              {/* Bedrooms */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-900 mb-3">Bedrooms</p>
                <div className="flex gap-1.5 flex-wrap">
                  <button type="button" onClick={() => setDraftMinBeds("")}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${!draftMinBeds ? "border-primary text-primary bg-primary/5 font-medium" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                    Any
                  </button>
                  {BEDROOM_OPTIONS.map((b) => (
                    <button key={b.value} type="button" onClick={() => setDraftMinBeds(b.value)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${draftMinBeds === b.value ? "border-primary text-primary bg-primary/5 font-medium" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-900 mb-3">Bathrooms</p>
                <div className="flex gap-1.5 flex-wrap">
                  <button type="button" onClick={() => setDraftMinBaths("")}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${!draftMinBaths ? "border-primary text-primary bg-primary/5 font-medium" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                    Any
                  </button>
                  {BEDROOM_OPTIONS.map((b) => (
                    <button key={b.value} type="button" onClick={() => setDraftMinBaths(b.value)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${draftMinBaths === b.value ? "border-primary text-primary bg-primary/5 font-medium" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Parking */}
              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-900 mb-3">Parking</p>
                <div className="flex gap-1.5 flex-wrap">
                  <button type="button" onClick={() => setDraftMinCars("")}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${!draftMinCars ? "border-primary text-primary bg-primary/5 font-medium" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                    Any
                  </button>
                  {PARKING_OPTIONS.map((p) => (
                    <button key={p.value} type="button" onClick={() => setDraftMinCars(p.value)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${draftMinCars === p.value ? "border-primary text-primary bg-primary/5 font-medium" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-gray-100 mb-4" />

              {/* Actions */}
              <div className="flex items-center justify-between gap-3">
                <button type="button" onClick={resetFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors">
                  Reset filters
                </button>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setFilterOpen(false)}
                    className="px-4 py-2 text-sm font-medium border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button type="button" onClick={applyFilters}
                    className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mode toggle */}
        <div className="relative">
          <button
            type="button"
            onClick={() => { setModeOpen((o) => !o); setPriceOpen(false); setBedsOpen(false); setTypeOpen(false); setFilterOpen(false); }}
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
            onClick={() => { setPriceOpen((o) => !o); setModeOpen(false); setBedsOpen(false); setTypeOpen(false); setFilterOpen(false); }}
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
            onClick={() => { setBedsOpen((o) => !o); setModeOpen(false); setPriceOpen(false); setTypeOpen(false); setFilterOpen(false); }}
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
            onClick={() => { setTypeOpen((o) => !o); setModeOpen(false); setPriceOpen(false); setBedsOpen(false); setFilterOpen(false); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-colors cursor-pointer ${
              typeActiveCount > 0 ? "border-primary text-primary bg-primary/5" : "border-gray-300 text-gray-700 hover:border-gray-400"
            }`}
          >
            {typePillLabel} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${typeOpen ? "rotate-180" : ""}`} />
          </button>
          {typeOpen && (
            <div className="absolute top-full mt-1 left-0 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden w-44">
              <button type="button" onClick={() => { update("propertyType", ""); setTypeOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm cursor-pointer transition-colors ${typeActiveCount === 0 ? "bg-primary/5 text-primary font-medium" : "text-gray-700 hover:bg-gray-50"}`}>Any type</button>
              {PROPERTY_TYPES.map((t) => (
                <button key={t.value} type="button" onClick={() => { update("propertyType", t.value); setTypeOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm cursor-pointer transition-colors ${propertyType === t.value ? "bg-primary/5 text-primary font-medium" : "text-gray-700 hover:bg-gray-50"}`}>
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
