"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui";
import { MultiSuburbAutocomplete, type SelectedLocation } from "@/components/search/MultiSuburbAutocomplete";
import { PROPERTY_TYPES, BEDROOM_OPTIONS, PRICE_RANGES_BUY, PRICE_RANGES_RENT } from "@/lib/constants";

const MODES = [
  { value: "buy",            label: "Buy" },
  { value: "rent",           label: "Rent" },
  { value: "house-and-land", label: "House & Land" },
  { value: "sold",           label: "Sold" },
] as const;

type Mode = (typeof MODES)[number]["value"];

export function HeroSearch() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("buy");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({ propertyType: "", minPrice: "", maxPrice: "", minBeds: "" });
  const [selected, setSelected] = useState<SelectedLocation[]>([]);

  function setFilter(key: keyof typeof filters, value: string) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  function addLocation(loc: SelectedLocation) {
    if (loc.type === "school") {
      router.push(`/schools/${loc.slug}`);
      return;
    }
    setSelected((prev) => prev.find((s) => s.slug === loc.slug) ? prev : [...prev, loc]);
  }

  function removeLocation(slug: string) {
    setSelected((prev) => prev.filter((s) => s.slug !== slug));
  }

  function handleSearch() {
    const params = new URLSearchParams();
    // Resolve suburb slugs: suburbs use their own slug, schools use their suburbSlug
    const suburbSlugs = selected.map((s) => s.type === "school" ? (s.suburbSlug ?? "") : s.slug).filter(Boolean);
    if (suburbSlugs.length > 0) params.set("suburb", suburbSlugs.join(","));
    if (filters.propertyType) params.set("propertyType", filters.propertyType);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.minBeds) params.set("minBeds", filters.minBeds);
    const qs = params.toString();
    router.push(`/${mode}${qs ? `?${qs}` : ""}`);
  }

  const priceRanges = mode === "rent" ? PRICE_RANGES_RENT : PRICE_RANGES_BUY;
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="relative overflow-hidden">
      {/* Background photo */}
      <Image
        src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1800&q=80"
        alt="Australian home"
        fill
        className="object-cover object-center"
        priority
      />
      {/* Brand colour overlay */}
      <div className="absolute inset-0 gradient-brand opacity-85" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        {/* Headline */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Property search, made simple
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
            Search properties for sale, rent, and exclusive off-market opportunities across Australia.
          </p>
        </div>

        {/* Search card */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl overflow-visible">
          {/* Mode tabs */}
          <div className="flex border-b border-gray-100 px-1 pt-1">
            {MODES.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMode(m.value)}
                className={`relative px-4 py-3 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  mode === m.value
                    ? "text-primary"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {m.label}
                {mode === m.value && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {/* Input row */}
          <div className="flex items-center gap-2 p-2">
            <div className="flex-1 bg-gray-50 rounded-xl min-w-0">
              <MultiSuburbAutocomplete
                placeholder="Try a suburb, postcode or school..."
                showSchools
                size="lg"
                inputClassName="bg-gray-50"
                selected={selected}
                onAdd={addLocation}
                onRemove={removeLocation}
              />
            </div>
            <button
              type="button"
              onClick={() => setFiltersOpen((o) => !o)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border rounded-xl transition-colors shrink-0 cursor-pointer ${
                filtersOpen || activeFilterCount > 0
                  ? "border-primary text-primary bg-primary/5"
                  : "border-gray-300 text-gray-600 hover:border-gray-400"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-0.5 w-4 h-4 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <Button
              onClick={handleSearch}
              variant="gradient"
              size="lg"
              className="shrink-0 px-6"
            >
              <Search className="w-4 h-4" />
              Search
            </Button>
          </div>

          {/* Filter panel */}
          {filtersOpen && (
            <div className="border-t border-gray-100 px-4 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Property Type</label>
                <select
                  value={filters.propertyType}
                  onChange={(e) => setFilter("propertyType", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary"
                >
                  <option value="">Any</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Min Price</label>
                <select
                  value={filters.minPrice}
                  onChange={(e) => setFilter("minPrice", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary"
                >
                  <option value="">Any</option>
                  {priceRanges.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Max Price</label>
                <select
                  value={filters.maxPrice}
                  onChange={(e) => setFilter("maxPrice", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary"
                >
                  <option value="">Any</option>
                  {priceRanges.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Bedrooms</label>
                <select
                  value={filters.minBeds}
                  onChange={(e) => setFilter("minBeds", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary"
                >
                  <option value="">Any</option>
                  {BEDROOM_OPTIONS.map((b) => (
                    <option key={b.value} value={b.value}>{b.label}+ beds</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Quick suburb links */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {[
            { name: "Burpengary", slug: "burpengary-qld-4505" },
            { name: "Caboolture", slug: "caboolture-qld-4510" },
            { name: "Narangba",   slug: "narangba-qld-4504" },
            { name: "Morayfield", slug: "morayfield-qld-4506" },
            { name: "North Lakes", slug: "north-lakes-qld-4509" },
            { name: "Deception Bay", slug: "deception-bay-qld-4508" },
          ].map((s) => (
            <a
              key={s.slug}
              href={`/suburbs/${s.slug}`}
              className="text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors"
            >
              {s.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
