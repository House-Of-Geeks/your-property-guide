import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Home, TrendingUp } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { unstable_cache } from "next/cache";
import { getAllStatesWithStats } from "@/lib/services/suburb-rankings-service";
import { NOT_PLACES_VERSION } from "@/lib/non-localities";
import { formatPrice } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";

// The cards query the DB. As a static ISR page this served its build-time
// render (the build is DB-free, so no cards) for up to a day after every
// deploy: on 13 Oct 2026 /states listed no state at all. Render on request
// instead and cache the eight summaries, the pattern /regions uses.
export const dynamic = "force-dynamic";

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

// The data cache outlives a deploy, so the deployment is part of the key:
// the averages change with the code that computes the state pages.
const getCachedStates = unstable_cache(
  getAllStatesWithStats,
  ["states-index:v1", NOT_PLACES_VERSION, process.env.VERCEL_DEPLOYMENT_ID ?? "local"],
  { revalidate: 86400, tags: ["states-index"] },
);

export default async function StatesPage() {
  const states = await getCachedStates();

  return (
    <>
      <CollectionPageJsonLd
        name="Australian States & Territories"
        description="Explore property markets across all Australian states and territories."
        url="/states"
      />
      <BreadcrumbJsonLd items={[{ name: "States", url: "/states" }]} />

      {/* Editorial hero */}
      <section className="relative bg-surface-warm border-b border-line overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pb-16">
          <div className="mb-8">
            <Breadcrumbs items={[{ label: "States" }]} />
          </div>

          <p className="text-[13px] font-sans text-ink-subtle mb-5">
            All 8 states &amp; territories
          </p>
          <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
            Australia, <span>one state at a time</span>
          </h1>
          <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-2xl">
            Suburb profiles, median prices, growth trends, and local market data for
            every state and territory.
          </p>
        </div>
      </section>

      {/* State cards */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {states.map((state) => (
            <Link
              key={state.state}
              href={`/states/${state.state.toLowerCase()}`}
              className="group rounded-2xl border border-line bg-surface-raised p-6 hover:border-primary/40 hover:shadow-md transition-all"
            >
              <p className="text-[13px] font-sans text-ink-subtle mb-2">
                {state.state}
              </p>
              <h2 className="font-display text-xl text-ink group-hover:text-primary transition-colors mb-5 leading-tight">
                {state.stateName}
              </h2>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-sm font-sans text-ink-muted">
                  <MapPin className="w-4 h-4 text-ink-subtle shrink-0" />
                  <span>
                    <strong className="text-ink font-display text-base">
                      {state.suburbCount.toLocaleString()}
                    </strong>{" "}
                    suburbs
                  </span>
                </div>
                {state.avgMedianHousePrice && (
                  <div className="flex items-center gap-2 text-sm font-sans text-ink-muted">
                    <Home className="w-4 h-4 text-ink-subtle shrink-0" />
                    <span>
                      Avg{" "}
                      <strong className="text-ink font-display text-base">
                        {formatPrice(state.avgMedianHousePrice)}
                      </strong>{" "}
                      median
                    </span>
                  </div>
                )}
                {state.avgAnnualGrowth != null && (
                  <div className="flex items-center gap-2 text-sm font-sans text-ink-muted">
                    <TrendingUp className="w-4 h-4 text-ink-subtle shrink-0" />
                    <span>
                      <strong
                        className={
                          state.avgAnnualGrowth >= 0
                            ? "text-emerald-700 font-display text-base"
                            : "text-red-700 font-display text-base"
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

              <p className="font-sans text-sm font-medium text-ink border-b border-line-strong group-hover:border-primary group-hover:text-primary pb-0.5 transition-colors mt-5 inline-block">
                Explore {state.state} →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
