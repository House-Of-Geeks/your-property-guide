import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Home, TrendingUp } from "lucide-react";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { getAllStatesWithStats } from "@/lib/services/suburb-rankings-service";
import { formatPrice } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";
import { Band, HeroLead, HeroTitle, PhotoHero } from "@/components/premium";

// ISR, DB-querying services have build-phase guards, so we cache for 24h
// instead of running a function on every visit.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Australian States Property Guide",
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

export default async function StatesPage() {
  // Skip the DB at build (Railway proxy drops build-time connections); ISR
  // (revalidate above) fills real data on first request. Empty renders cleanly
  // — the cards map below produces nothing for an empty list.
  const states =
    process.env.NEXT_PHASE === "phase-production-build"
      ? ([] as Awaited<ReturnType<typeof getAllStatesWithStats>>)
      : await getAllStatesWithStats();

  return (
    <>
      <CollectionPageJsonLd
        name="Australian States & Territories"
        description="Explore property markets across all Australian states and territories."
        url="/states"
      />
      <BreadcrumbJsonLd items={[{ name: "States", url: "/states" }]} />

      <PhotoHero photo="market" breadcrumbs={[{ label: "States" }]}>
        <p className="text-sm text-ink-muted mb-5">
          All 8 states &amp; territories
        </p>
        <HeroTitle>
          Australia, <span>one state at a time</span>
        </HeroTitle>
        <HeroLead>
          Suburb profiles, median prices, growth trends, and local market data for
          every state and territory.
        </HeroLead>
      </PhotoHero>

      {/* State cards */}
      <Band tone="quiet" spacing="compact">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {states.map((state) => (
            <Link
              key={state.state}
              href={`/states/${state.state.toLowerCase()}`}
              className="group flex flex-col rounded-xl border border-line bg-surface-raised p-6 hover:border-ink transition-colors"
            >
              <p className="text-sm text-ink-subtle mb-2">
                {state.state}
              </p>
              <h2 className="text-2xl text-ink leading-tight tracking-[-0.02em] group-hover:text-primary transition-colors mb-5">
                {state.stateName}
              </h2>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-sm text-ink-muted">
                  <MapPin className="w-4 h-4 text-ink-subtle shrink-0" />
                  <span>
                    <strong className="text-ink font-semibold text-base">
                      {state.suburbCount.toLocaleString()}
                    </strong>{" "}
                    suburbs
                  </span>
                </div>
                {state.avgMedianHousePrice && (
                  <div className="flex items-center gap-2 text-sm text-ink-muted">
                    <Home className="w-4 h-4 text-ink-subtle shrink-0" />
                    <span>
                      Avg{" "}
                      <strong className="text-ink font-semibold text-base">
                        {formatPrice(state.avgMedianHousePrice)}
                      </strong>{" "}
                      median
                    </span>
                  </div>
                )}
                {state.avgAnnualGrowth != null && (
                  <div className="flex items-center gap-2 text-sm text-ink-muted">
                    <TrendingUp className="w-4 h-4 text-ink-subtle shrink-0" />
                    <span>
                      <strong
                        className={
                          state.avgAnnualGrowth >= 0
                            ? "text-emerald-700 font-semibold text-base"
                            : "text-red-700 font-semibold text-base"
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

              <p className="mt-auto pt-6 inline-flex items-center gap-1.5 text-base font-semibold text-ink group-hover:text-primary transition-colors">
                Explore {state.state} →
              </p>
            </Link>
          ))}
        </div>
      </Band>
    </>
  );
}
