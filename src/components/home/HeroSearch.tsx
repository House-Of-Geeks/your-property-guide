"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui";
import { SuburbAutocomplete } from "@/components/search/SuburbAutocomplete";

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
  const selectedRef = useRef<{ slug: string; label: string } | null>(null);
  // Keep a ref to the raw query string for keyword fallback
  const queryRef = useRef("");

  function handleSearch() {
    const sel = selectedRef.current;
    if (sel?.slug) {
      router.push(`/${mode}?suburb=${sel.slug}`);
    } else {
      router.push(`/${mode}`);
    }
  }

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
            <div className="flex-1 bg-gray-50 rounded-xl">
              <SuburbAutocomplete
                placeholder="Try a suburb, postcode or school..."
                showSchools
                size="lg"
                inputClassName="bg-gray-50"
                onSelectLocation={(slug, label) => {
                  selectedRef.current = { slug, label };
                }}
                onClear={() => {
                  selectedRef.current = null;
                }}
              />
            </div>
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
