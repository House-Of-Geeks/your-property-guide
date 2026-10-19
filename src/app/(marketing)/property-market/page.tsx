import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo";
import { ExpertCTA } from "@/components/journey";
import { Band, HeroLead, HeroTitle, PhotoHero } from "@/components/premium";
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
  openGraph: { ...DEFAULT_OG,
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

      <PhotoHero photo="market" breadcrumbs={[{ label: "Property Market" }]}>
        <p className="text-sm text-ink-muted mb-5">
          Updated July 2026
        </p>
        <HeroTitle>
          The Australian property market, <span>city by city</span>
        </HeroTitle>
        <HeroLead>
          Median house prices, 12-month growth and the fastest-moving suburbs in every capital,
          aggregated from verified government sales data.
        </HeroLead>
      </PhotoHero>

      <Band tone="quiet" spacing="compact">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {markets.map(({ city, figure }) => (
            <Link
              key={city.slug}
              href={`/property-market/${city.slug}`}
              className="group flex flex-col rounded-xl border border-line bg-surface-raised p-6 hover:border-ink transition-colors"
            >
              <p className="text-sm text-ink-subtle mb-2">
                {city.state}
              </p>
              <h2 className="text-3xl text-ink leading-tight tracking-[-0.025em] group-hover:text-primary transition-colors">
                {city.name}
              </h2>
              {figure?.kind === "median" && (
                <>
                  <p className="text-2xl font-bold text-ink mt-5">{figure.price}</p>
                  <p className="text-sm text-ink-subtle mt-1">
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
                  <p className="text-lg font-semibold text-ink mt-5">{figure.label}</p>
                  <p className="text-sm text-ink-subtle mt-1">{figure.note}</p>
                </>
              )}
              <span className="mt-auto pt-6 inline-flex items-center gap-1.5 text-base font-semibold text-ink group-hover:text-primary transition-colors">
                View market
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-10 max-w-3xl border-t border-line pt-6 text-sm text-ink-muted leading-relaxed">
          City figures are the median of suburb-level medians from state valuers-general, state
          government sales records and the ABS; only verified sources contribute.{" "}
          <Link
            href="/methodology#median-prices"
            className="font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink"
          >
            Full methodology →
          </Link>
        </p>
      </Band>

      <ExpertCTA
        headline="Selling into this market?"
        body="The complete guide to selling in today's market: what it really costs, how agents price your home, and a 12-week plan to settlement. Free PDF, in your inbox in 60 seconds."
        ctaLabel="Get the free selling guide"
        href="/selling-guide"
      />
    </>
  );
}
