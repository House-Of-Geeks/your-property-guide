import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Home, TrendingUp } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { getAllStatesWithStats } from "@/lib/services/suburb-rankings-service";
import { formatPrice } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Australian States Property Guide | Your Property Guide",
  description:
    "Explore property markets across all Australian states and territories. Suburb data, median prices, and local insights for QLD, NSW, VIC, WA, SA, TAS, NT, and ACT.",
  alternates: { canonical: `${SITE_URL}/states` },
  openGraph: {
    url: `${SITE_URL}/states`,
    title: "Australian States Property Guide | Your Property Guide",
    description:
      "Explore property markets across all Australian states and territories. Suburb data, median prices, and local insights.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const STATE_FLAGS: Record<string, string> = {
  QLD: "🦎",
  NSW: "🦁",
  VIC: "🌿",
  WA: "🌊",
  SA: "🌺",
  TAS: "🍎",
  NT: "⭐",
  ACT: "🏛️",
};

export default async function StatesPage() {
  const states = await getAllStatesWithStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <CollectionPageJsonLd
        name="Australian States & Territories"
        description="Explore property markets across all Australian states and territories."
        url="/states"
      />
      <BreadcrumbJsonLd items={[{ name: "States", url: "/states" }]} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 to-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <Breadcrumbs items={[{ label: "States" }]} />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4">
            Australian States Property Guide
          </h1>
          <p className="text-lg text-gray-600 mt-3 max-w-2xl">
            Explore property markets, suburb profiles, schools, and local data across all 8
            Australian states and territories.
          </p>
        </div>
      </div>

      {/* State cards */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {states.map((state) => (
            <Link
              key={state.state}
              href={`/states/${state.state.toLowerCase()}`}
              className="group rounded-2xl border border-gray-200 bg-white p-6 hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="text-3xl mb-3">{STATE_FLAGS[state.state] ?? "📍"}</div>
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                {state.stateName}
              </h2>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">{state.state}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>
                    <strong className="text-gray-900">{state.suburbCount.toLocaleString()}</strong>{" "}
                    suburbs
                  </span>
                </div>
                {state.avgMedianHousePrice && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Home className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>
                      Avg{" "}
                      <strong className="text-gray-900">
                        {formatPrice(state.avgMedianHousePrice)}
                      </strong>{" "}
                      median
                    </span>
                  </div>
                )}
                {state.avgAnnualGrowth != null && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>
                      <strong
                        className={
                          state.avgAnnualGrowth >= 0 ? "text-green-700" : "text-red-600"
                        }
                      >
                        {state.avgAnnualGrowth >= 0 ? "+" : ""}
                        {state.avgAnnualGrowth}%
                      </strong>{" "}
                      avg growth
                    </span>
                  </div>
                )}
              </div>

              <p className="text-sm font-semibold text-primary mt-5 group-hover:underline">
                Explore {state.state} →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
