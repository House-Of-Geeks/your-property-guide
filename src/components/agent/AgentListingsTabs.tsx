"use client";

import { useState } from "react";
import { PropertyCard } from "@/components/property/PropertyCard";
import type { Property } from "@/types";

interface AgentListingsTabsProps {
  forSale: Property[];
  sold: Property[];
}

export function AgentListingsTabs({ forSale, sold }: AgentListingsTabsProps) {
  const [tab, setTab] = useState<"sale" | "sold">("sale");

  const listings = tab === "sale" ? forSale : sold;

  return (
    <div>
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setTab("sale")}
          className={`px-6 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
            tab === "sale"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          FOR SALE
          {forSale.length > 0 && (
            <span className="ml-2 text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
              {forSale.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("sold")}
          className={`px-6 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
            tab === "sold"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          SOLD
          {sold.length > 0 && (
            <span className="ml-2 text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
              {sold.length}
            </span>
          )}
        </button>
      </div>

      {listings.length === 0 ? (
        <p className="text-gray-500 py-8 text-center">No {tab === "sale" ? "current" : "sold"} listings.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
