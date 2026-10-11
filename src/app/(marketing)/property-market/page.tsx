import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { ExpertCTA } from "@/components/journey";
import { SITE_URL } from "@/lib/constants";
import { getCityMarket } from "@/lib/services/city-market-service";
import { CAPITAL_CITIES } from "@/lib/utils/metro";
import { formatPrice } from "@/lib/utils/format";

// Hub for the eight capital-city market pages. Kept lean: its job is to
// route users and internal equity into /property-market/{city}.

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Australian Property Market 2026: City House Prices",
  description:
    "House prices for every Australian capital: typical suburb medians where enough suburbs publish one, suburb medians and rankings, each with its source.",
  alternates: { canonical: `${SITE_URL}/property-market` },
  openGraph: {
    url: `${SITE_URL}/property-market`,
    title: "Australian Property Market 2026: City House Prices",
    description:
      "House prices and market data for every Australian capital, from verified government sales data.",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Australian property market 2026" }],
  },
  twitter: { card: "summary_large_image" },
};

export default async function PropertyMarketHubPage() {
  // Build must stay DB-free (see 460c601): this static route prerenders at
  // `next build`, and an unguarded fetch here failed a deploy the moment
  // the DB was busy. Empty renders cleanly ("Not published" cards); ISR (revalidate
  // above) fills real data on first request.
  const markets =
    process.env.NEXT_PHASE === "phase-production-build"
      ? CAPITAL_CITIES.map((city) => ({
          city,
          market: null as Awaited<ReturnType<typeof getCityMarket>> | null,
        }))
      : await Promise.all(
          CAPITAL_CITIES.map(async (city) => ({ city, market: await getCityMarket(city) })),
        );

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Property Market", url: "/property-market" }]} />

      <section className="bg-surface-warm border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pb-16">
          <div className="mb-8">
            <Breadcrumbs items={[{ label: "Property Market" }]} />
          </div>
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
            Eight capital cities
          </p>
          <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
            The Australian property market, <span className="italic text-primary">city by city</span>.
          </h1>
          <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-2xl">
            The typical suburb median house price in every capital where enough suburbs publish one,
            the 12-month change where a feed measures it, and the suburb medians behind them.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {markets.map(({ city, market }) => (
            <Link
              key={city.slug}
              href={`/property-market/${city.slug}`}
              className="group rounded-2xl border border-line bg-surface-raised p-6 hover:border-primary/40 hover:shadow-card transition-all"
            >
              <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mb-2">
                {city.state}
              </p>
              <h2 className="font-display text-2xl text-ink leading-tight group-hover:text-primary transition-colors">
                {city.name}
              </h2>
              <p className="font-display text-xl text-ink mt-4">
                {market?.medianHousePrice ? formatPrice(market.medianHousePrice) : "Not published"}
              </p>
              <p className="text-xs font-sans text-ink-subtle mt-1">
                {market?.medianHousePrice
                  ? `typical suburb median (${market.pricedSuburbCount.toLocaleString("en-AU")} suburbs)`
                  : "too few suburbs with a published median"}
                {market != null && market.medianAnnualGrowth != null && (
                  <>
                    {" · "}
                    <span className={market.medianAnnualGrowth >= 0 ? "text-emerald-700" : "text-red-700"}>
                      {market.medianAnnualGrowth > 0 ? "+" : ""}
                      {market.medianAnnualGrowth}% yr
                    </span>
                  </>
                )}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-sans font-medium text-ink group-hover:text-primary transition-colors">
                View market
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>

        <section className="mt-10 rounded-2xl border border-line bg-surface-warm p-5 text-sm font-sans text-ink-muted">
          <p className="leading-relaxed">
            A city&rsquo;s typical suburb median is the median of the medians its suburbs&rsquo; own
            pages publish (NSW Valuer General sales, Land Victoria and SA Government quarterly medians,
            ABS statistical-area medians elsewhere), not a median of every sale. It is printed only when
            at least 30 suburbs and a fifth of the city&rsquo;s suburbs of 1,000 or more residents have
            one.{" "}
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
