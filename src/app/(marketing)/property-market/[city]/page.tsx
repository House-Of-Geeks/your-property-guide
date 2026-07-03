import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, Home, DollarSign, Building2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, FAQPageJsonLd, GuideArticleJsonLd } from "@/components/seo";
import { ExpertCTA } from "@/components/journey";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getCityMarket, type CityMarketSuburb } from "@/lib/services/city-market-service";
import { CAPITAL_CITIES, getCapitalCity } from "@/lib/utils/metro";
import { formatPrice, formatPriceFull } from "@/lib/utils/format";

// City-level market pages targeting the "{city} property market" /
// "{city} house prices" / "median house price {city}" query cluster —
// competitors hold top-10 with a handful of these pages while our
// footprint stopped at suburb level. Everything shown is aggregated
// upward from the suburb dataset through the same source-trust gates
// the suburb pages use.

const CURRENT_YEAR = 2026;

export const revalidate = 86400; // ISR daily, regen on demand
export const dynamicParams = true;

export function generateStaticParams() {
  // Skip prerender at build time — the page body queries the Suburb table
  // and the DB isn't reachable during `next build`.
  if (process.env.NEXT_PHASE === "phase-production-build") return [];
  return CAPITAL_CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getCapitalCity(citySlug);
  if (!city) return { title: "City Not Found" };

  const market = await getCityMarket(city);
  const title = `${city.name} Property Market ${CURRENT_YEAR} — House Prices & Growth`;
  const median = market.medianHousePrice
    ? `The median house price in ${city.name} is ${formatPriceFull(market.medianHousePrice)}. `
    : "";
  const description = `${city.name} property market ${CURRENT_YEAR}: ${median}Suburb medians, annual growth, the fastest-rising and most affordable suburbs across Greater ${city.name}, from verified sales data.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/property-market/${city.slug}` },
    openGraph: {
      url: `${SITE_URL}/property-market/${city.slug}`,
      // og titles don't get the root title.template — brand them explicitly
      title: `${title} | ${SITE_NAME}`,
      description,
      type: "article",
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image" },
  };
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface-raised p-6">
      <div className="flex items-center gap-2 mb-3 text-ink-subtle">
        {icon}
        <p className="text-xs font-sans uppercase tracking-[0.2em]">{label}</p>
      </div>
      <p className="font-display text-3xl text-ink leading-none">{value}</p>
      {sub && <p className="mt-2 text-xs font-sans text-ink-subtle">{sub}</p>}
    </div>
  );
}

function SuburbTable({
  heading,
  rows,
  showGrowth,
}: {
  heading: string;
  rows: CityMarketSuburb[];
  showGrowth?: boolean;
}) {
  if (rows.length === 0) return null;
  return (
    <section>
      <h3 className="font-display text-2xl text-ink mb-4 leading-tight">{heading}</h3>
      <div className="overflow-x-auto rounded-2xl border border-line bg-surface-raised">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-warm border-b border-line">
              <th className="px-4 py-3 text-left text-xs font-sans font-medium text-ink uppercase tracking-wide w-10">#</th>
              <th className="px-4 py-3 text-left text-xs font-sans font-medium text-ink uppercase tracking-wide">Suburb</th>
              <th className="px-4 py-3 text-right text-xs font-sans font-medium text-ink uppercase tracking-wide">Median price</th>
              {showGrowth && (
                <th className="px-4 py-3 text-right text-xs font-sans font-medium text-ink uppercase tracking-wide">Annual growth</th>
              )}
              <th className="px-4 py-3 text-right text-xs font-sans font-medium text-ink uppercase tracking-wide">Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row, i) => (
              <tr key={row.slug} className="hover:bg-surface-warm/60 transition-colors">
                <td className="px-4 py-3 font-sans text-ink-subtle tabular-nums">{i + 1}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/suburbs/${row.slug}`}
                    className="font-sans font-medium text-ink hover:text-primary transition-colors"
                  >
                    {row.name}
                  </Link>
                  <span className="text-xs font-sans text-ink-subtle ml-1.5">{row.postcode}</span>
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  <span className="font-display text-base text-ink">
                    {row.medianHousePrice > 0 ? formatPriceFull(row.medianHousePrice) : "-"}
                  </span>
                </td>
                {showGrowth && (
                  <td className="px-4 py-3 text-right tabular-nums">
                    <span
                      className={`font-display text-base ${
                        (row.annualGrowthHouse ?? 0) > 0
                          ? "text-emerald-700"
                          : (row.annualGrowthHouse ?? 0) < 0
                            ? "text-red-700"
                            : "text-ink-subtle"
                      }`}
                    >
                      {row.annualGrowthHouse
                        ? `${row.annualGrowthHouse > 0 ? "+" : ""}${row.annualGrowthHouse.toFixed(1)}%`
                        : "-"}
                    </span>
                  </td>
                )}
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/suburbs/${row.slug}`}
                    className="font-sans text-xs font-medium text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors whitespace-nowrap"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default async function CityMarketPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: citySlug } = await params;
  const city = getCapitalCity(citySlug);
  if (!city) notFound();

  const market = await getCityMarket(city);
  const stateSlug = city.state.toLowerCase();
  const pageTitle = `${city.name} Property Market ${CURRENT_YEAR}`;

  const housePrice = market.medianHousePrice ? formatPrice(market.medianHousePrice) : "N/A";
  const unitPrice = market.medianUnitPrice ? formatPrice(market.medianUnitPrice) : "N/A";
  const growth =
    market.medianAnnualGrowth != null
      ? `${market.medianAnnualGrowth > 0 ? "+" : ""}${market.medianAnnualGrowth}%`
      : "N/A";
  const rent = market.medianRentHouse ? `$${market.medianRentHouse}/wk` : "N/A";

  // Plain-sentence answers for the page's primary queries, mirrored into
  // FAQPage JSON-LD so SERP/AI answer engines can lift them directly.
  const faqs: { question: string; answer: string }[] = [];
  if (market.medianHousePrice) {
    faqs.push({
      question: `What is the median house price in ${city.name}?`,
      answer: `The median house price across Greater ${city.name} is ${formatPriceFull(market.medianHousePrice)}, calculated as the median of ${market.pricedSuburbCount.toLocaleString()} suburb-level medians from verified government sales data.${
        market.medianUnitPrice ? ` The median unit price is ${formatPriceFull(market.medianUnitPrice)}.` : ""
      }`,
    });
  }
  if (market.medianAnnualGrowth != null) {
    faqs.push({
      question: `Are ${city.name} house prices rising?`,
      answer: `The typical ${city.name} suburb recorded ${
        market.medianAnnualGrowth >= 0 ? "growth" : "a decline"
      } of ${market.medianAnnualGrowth}% in house prices over the past 12 months. Growth varies widely by suburb — the fastest-rising suburbs are listed on this page.`,
    });
  }
  if (market.topGrowth.length > 0) {
    const names = market.topGrowth.slice(0, 3).map((s) => s.name).join(", ");
    faqs.push({
      question: `Which ${city.name} suburbs are growing fastest?`,
      answer: `By 12-month house price growth, the fastest-rising Greater ${city.name} suburbs in our verified data are ${names}. See the full top-8 table on this page.`,
    });
  }
  if (market.mostAffordable.length > 0) {
    const names = market.mostAffordable.slice(0, 3).map((s) => s.name).join(", ");
    faqs.push({
      question: `What are the cheapest suburbs in ${city.name}?`,
      answer: `Among established suburbs (population 1,000+) with verified sales data, the most affordable Greater ${city.name} suburbs by median house price are ${names}.`,
    });
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Property Market", url: "/property-market" },
          { name: city.name, url: `/property-market/${city.slug}` },
        ]}
      />
      <GuideArticleJsonLd
        title={pageTitle}
        description={`${city.name} property market data for ${CURRENT_YEAR}: median prices, growth and suburb rankings.`}
        url={`/property-market/${city.slug}`}
        datePublished="2026-07-03"
      />
      {faqs.length > 0 && <FAQPageJsonLd faqs={faqs} />}

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
            <Breadcrumbs
              items={[
                { label: "Property Market", href: "/property-market" },
                { label: city.name },
              ]}
            />
          </div>

          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
            Greater {city.name} &middot; {market.suburbCount.toLocaleString()} suburbs tracked
          </p>
          <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
            {city.name} property market, <span className="italic text-primary">{CURRENT_YEAR}</span>.
          </h1>
          {/* Direct answer sentence for "median house price {city}" — kept as
              plain prose so answer engines can quote it verbatim. */}
          <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-2xl">
            {market.medianHousePrice ? (
              <>
                The median house price in {city.name} is{" "}
                <span className="font-medium text-ink">
                  {formatPriceFull(market.medianHousePrice)}
                </span>
                , the median of {market.pricedSuburbCount.toLocaleString()} suburb medians from
                verified government sales data.
              </>
            ) : (
              <>
                Suburb medians, annual growth and rankings across Greater {city.name}, from
                verified government sales data.
              </>
            )}{" "}
            Below: the fastest-growing, most affordable and highest-priced suburbs in Greater{" "}
            {city.name}.
          </p>
        </div>
      </section>

      {/* Stat anchor row */}
      <section className="bg-surface-raised border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<Home className="w-4 h-4" />}
              label="Median house"
              value={housePrice}
              sub="median of suburb medians"
            />
            <StatCard
              icon={<Building2 className="w-4 h-4" />}
              label="Median unit"
              value={unitPrice}
              sub="median of suburb medians"
            />
            <StatCard
              icon={<TrendingUp className="w-4 h-4" />}
              label="Typical annual growth"
              value={growth}
              sub="house prices, last 12 months"
            />
            <StatCard
              icon={<DollarSign className="w-4 h-4" />}
              label="Median house rent"
              value={rent}
              sub="weekly, across tracked suburbs"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <SuburbTable
          heading={`Fastest-growing ${city.name} suburbs`}
          rows={market.topGrowth}
          showGrowth
        />
        <SuburbTable
          heading={`Most affordable ${city.name} suburbs`}
          rows={market.mostAffordable}
          showGrowth
        />
        <SuburbTable heading={`${city.name}'s highest median prices`} rows={market.premium} />

        {/* Visible FAQ backing the FAQPage schema */}
        {faqs.length > 0 && (
          <section>
            <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight mb-6">
              {city.name} property market questions
            </h2>
            <dl className="divide-y divide-line border-y border-line">
              {faqs.map((faq) => (
                <div key={faq.question} className="py-5">
                  <dt className="font-display text-lg text-ink leading-snug mb-2">{faq.question}</dt>
                  <dd className="font-sans text-base text-ink-muted leading-relaxed">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* Cross-links: other capitals + the state report */}
        <section className="rounded-2xl border border-line bg-surface-warm p-6">
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
            Keep exploring
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/market-reports/${stateSlug}`}
              className="inline-flex items-center rounded-lg border border-line bg-surface-raised px-3 py-1.5 text-sm font-sans font-medium text-ink hover:border-primary/40 hover:text-primary transition-colors"
            >
              {city.state} state market report
            </Link>
            <Link
              href={`/best-suburbs/highest-growth/${stateSlug}`}
              className="inline-flex items-center rounded-lg border border-line bg-surface-raised px-3 py-1.5 text-sm font-sans font-medium text-ink hover:border-primary/40 hover:text-primary transition-colors"
            >
              {city.state} growth ranking
            </Link>
            {CAPITAL_CITIES.filter((c) => c.slug !== city.slug).map((c) => (
              <Link
                key={c.slug}
                href={`/property-market/${c.slug}`}
                className="inline-flex items-center rounded-lg border border-line bg-surface-raised px-3 py-1.5 text-sm font-sans font-medium text-ink hover:border-primary/40 hover:text-primary transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Source note */}
        <section className="rounded-2xl border border-line bg-surface-warm p-5 text-sm font-sans text-ink-muted">
          <p className="text-xs uppercase tracking-[0.25em] text-ink-subtle mb-2">Data source</p>
          <p className="leading-relaxed">
            Figures are aggregated from suburb-level medians sourced from state valuers-general,
            state government sales records and the ABS. Only suburbs with a verified sales source
            contribute to price figures ({market.pricedSuburbCount.toLocaleString()} of{" "}
            {market.suburbCount.toLocaleString()} tracked Greater {city.name} suburbs). Growth
            outliers from thin sales samples are excluded.{" "}
            <Link
              href="/methodology#median-prices"
              className="text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
            >
              Full methodology →
            </Link>
          </p>
        </section>
      </div>

      {/* Seller funnel exit — city-market readers are gauging whether it's
          a good time to sell. */}
      <ExpertCTA
        headline={`Thinking about selling in ${city.name}?`}
        body="The complete guide to selling in today's market: what it really costs, how agents price your home, the 10 questions that catch bad agents out, and a 12-week plan to settlement. Free PDF, in your inbox in 60 seconds."
        ctaLabel="Get the free selling guide"
        href="/selling-guide"
      />
    </>
  );
}
