import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { ExpertCTA } from "@/components/journey";
import { unstable_cache } from "next/cache";
import { SITE_URL } from "@/lib/constants";
import { NOT_PLACES_VERSION } from "@/lib/non-localities";
import {
  cityCardFigure,
  getCityMarketSummaries,
  type CityMarketSummary,
} from "@/lib/services/city-market-service";
import { CAPITAL_CITIES } from "@/lib/utils/metro";

// Hub for the eight capital-city market pages. Kept lean: its job is to
// route users and internal equity into /property-market/{city}.

// The cards query the DB. As a static ISR page the hub served its build-time
// render (the build is DB-free, so no figures) for up to a day after every
// deploy: on 13 Oct 2026, after four deploys that day, all eight cards
// showed a bare dash while every city page printed its median. Render on
// request instead and cache the eight summaries, the pattern /regions moved
// to for the same reason.
export const dynamic = "force-dynamic";

// The data cache outlives a deploy, so the deployment is part of the key:
// the cards change with the code that computes the city pages, never a day
// later.
const getCachedSummaries = unstable_cache(
  getCityMarketSummaries,
  ["property-market-hub:v1", NOT_PLACES_VERSION, process.env.VERCEL_DEPLOYMENT_ID ?? "local"],
  { revalidate: 86400, tags: ["city-markets"] },
);

export const metadata: Metadata = {
  title: "Australian Property Market 2026 — City House Prices & Growth",
  description:
    "House prices and market data for every Australian capital: Sydney, Melbourne, Brisbane, Perth, Adelaide, Hobart, Canberra and Darwin. Suburb medians, growth and rankings from verified sales data.",
  alternates: { canonical: `${SITE_URL}/property-market` },
  openGraph: {
    url: `${SITE_URL}/property-market`,
    title: "Australian Property Market 2026 — City House Prices & Growth",
    description:
      "House prices and market data for every Australian capital, from verified government sales data.",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Australian property market 2026" }],
  },
  twitter: { card: "summary_large_image" },
};

export default async function PropertyMarketHubPage() {
  // A DB failure on a cold cache leaves the cards without a figure for this
  // one request (nothing is cached), rather than failing the page.
  let summaries: Map<string, CityMarketSummary> | null = null;
  try {
    const rows = await getCachedSummaries();
    summaries = new Map(rows.map((r) => [r.slug, r.summary]));
  } catch (err) {
    console.error("[property-market] city summaries unavailable", err);
  }
  const markets = CAPITAL_CITIES.map((city) => {
    const summary = summaries?.get(city.slug);
    return { city, figure: summary ? cityCardFigure(summary) : null };
  });

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Property Market", url: "/property-market" }]} />

      <section className="bg-surface-warm border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pb-16">
          <div className="mb-8">
            <Breadcrumbs items={[{ label: "Property Market" }]} />
          </div>
          <p className="text-[13px] font-sans text-ink-subtle mb-5">
            Updated July 2026
          </p>
          <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
            The Australian property market, <span>city by city</span>
          </h1>
          <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-2xl">
            Median house prices, 12-month growth and the fastest-moving suburbs in every capital,
            aggregated from verified government sales data.
          </p>
        </div>
      </section>

      <div className="relative h-[180px] sm:h-[260px] lg:h-[320px] border-b border-line bg-surface-sunken">
        <Image src="/images/photos/brisbane-view.jpg" alt="Old iron rooftops and jacarandas in flower with a city skyline in the distance" fill sizes="100vw" className="object-cover object-[50%_55%]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {markets.map(({ city, figure }) => (
            <Link
              key={city.slug}
              href={`/property-market/${city.slug}`}
              className="group rounded-2xl border border-line bg-surface-raised p-6 hover:border-primary/40 hover:shadow-card transition-all"
            >
              <p className="text-[13px] font-sans text-ink-subtle mb-2">
                {city.state}
              </p>
              <h2 className="font-display text-2xl text-ink leading-tight group-hover:text-primary transition-colors">
                {city.name}
              </h2>
              {figure?.kind === "median" && (
                <>
                  <p className="font-display text-xl text-ink mt-4">{figure.price}</p>
                  <p className="text-xs font-sans text-ink-subtle mt-1">
                    median house price
                    {figure.growth != null && (
                      <>
                        {" · "}
                        <span className={figure.growth >= 0 ? "text-emerald-700" : "text-red-700"}>
                          {figure.growth > 0 ? "+" : ""}
                          {figure.growth}% yr
                        </span>
                      </>
                    )}
                  </p>
                </>
              )}
              {figure?.kind === "none" && (
                <>
                  <p className="font-display text-lg text-ink mt-4">{figure.label}</p>
                  <p className="text-xs font-sans text-ink-subtle mt-1">{figure.note}</p>
                </>
              )}
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-sans font-medium text-ink group-hover:text-primary transition-colors">
                View market
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>

        <section className="mt-10 rounded-2xl border border-line bg-surface-warm p-5 text-sm font-sans text-ink-muted">
          <p className="leading-relaxed">
            City figures are the median of suburb-level medians from state valuers-general, state
            government sales records and the ABS; only verified sources contribute.{" "}
            <Link
              href="/methodology#median-prices"
              className="text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
            >
              Full methodology →
            </Link>
          </p>
        </section>
      </div>

      <ExpertCTA
        headline="Selling into this market?"
        body="The complete guide to selling in today's market: what it really costs, how agents price your home, and a 12-week plan to settlement. Free PDF, in your inbox in 60 seconds."
        ctaLabel="Get the free selling guide"
        href="/selling-guide"
      />
    </>
  );
}
