import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Home, TrendingUp } from "lucide-react";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { unstable_cache } from "next/cache";
import { getAllStatesWithStats } from "@/lib/services/suburb-rankings-service";
import { NOT_PLACES_VERSION } from "@/lib/non-localities";
import { formatPrice } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";
import { Band, HeroLead, HeroTitle, PhotoHero } from "@/components/premium";

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
  openGraph: { ...DEFAULT_OG,
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
