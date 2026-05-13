import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Home, TrendingUp } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { getAllStatesWithStats } from "@/lib/services/suburb-rankings-service";
import { formatPrice } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";

// ISR, DB-querying services have build-phase guards, so we cache for 24h
// instead of running a function on every visit.
export const revalidate = 86400;

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

export default async function StatesPage() {
  const states = await getAllStatesWithStats();

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
        <Image
          src="/images/illustrations/contour.svg"
          alt=""
          width={1200}
          height={800}
          aria-hidden="true"
          className="absolute -right-40 -top-40 w-[1100px] max-w-none opacity-[0.10] pointer-events-none select-none"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pb-16">
          <div className="mb-8">
            <Breadcrumbs items={[{ label: "States" }]} />
          </div>

          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
            All 8 states &amp; territories
          </p>
          <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
            Australia, <span className="italic text-primary">one state at a time</span>.
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
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-2">
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
