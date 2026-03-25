"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button, Select } from "@/components/ui";
import { SUBURBS, LISTING_TYPES } from "@/lib/constants";

export function HeroSearch() {
  const router = useRouter();
  const [listingType, setListingType] = useState("buy");
  const [suburb, setSuburb] = useState("");

  const handleSearch = () => {
    const params = suburb ? `?suburb=${suburb}` : "";
    router.push(`/${listingType}${params}`);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-brand opacity-95" />
      <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Find Your Perfect Property
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
            Discover homes for sale, rent, and exclusive off-market opportunities across the Moreton Bay region.
          </p>
        </div>

        {/* Search bar */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-2 sm:p-3">
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Listing type tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              {LISTING_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setListingType(type.value)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    listingType === type.value
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Suburb select */}
            <div className="flex-1">
              <select
                value={suburb}
                onChange={(e) => setSuburb(e.target.value)}
                className="w-full h-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-primary outline-none cursor-pointer"
              >
                <option value="">All Moreton Bay suburbs...</option>
                {SUBURBS.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name} {s.postcode}
                  </option>
                ))}
              </select>
            </div>

            {/* Search button */}
            <Button
              onClick={handleSearch}
              variant="gradient"
              size="lg"
              className="sm:px-8"
            >
              <Search className="w-4 h-4" />
              Search
            </Button>
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {SUBURBS.map((s) => (
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
