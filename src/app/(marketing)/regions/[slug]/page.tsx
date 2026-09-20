import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, Home, DollarSign, Building2 } from "lucide-react";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { Breadcrumbs } from "@/components/layout";
import { ExpertCTA } from "@/components/journey";
import { HomeValueAppraisal } from "@/components/journey/HomeValueAppraisal";
import { MatchAgent } from "@/components/journey/MatchAgent";
import { StatCard, SuburbTable } from "@/components/market/MarketTables";
import { MostSearchedSuburbs } from "@/components/suburb/MostSearchedSuburbs";
import {
  BreadcrumbJsonLd,
  PlaceJsonLd,
  ItemListJsonLd,
  FAQPageJsonLd,
  GuideArticleJsonLd,
} from "@/components/seo";
import {
  getRegionBySlug,
  getRegionSuburbs,
  getRegionMarket,
  getAllRegionSlugs,
} from "@/lib/services/region-service";
import { getProperties } from "@/lib/services/property-service";
import { buildCityNarrative } from "@/lib/city-narrative";
import {
  REGION_MARKET_YEAR,
  buildRegionFaqs,
  regionDescription,
  regionDisplayName,
  regionEyebrow,
  regionHasPrices,
  regionTitle,
} from "@/lib/region-market";
import { commissionOnMedian } from "@/lib/suburb-agents";
import { STATE_NAMES, type StateCode } from "@/lib/data/commission-rates";
import { topSuburbsAmong } from "@/lib/data/top-suburbs";
import { isReliableSalesSource } from "@/lib/suburb-data-quality";
import { capitalCityFor } from "@/lib/utils/metro";
import { formatPrice, formatPriceFull } from "@/lib/utils/format";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

// Region (LGA) house-prices pages. Content gap item 6: the same template
// the capital-city pages use (house prices first, the busiest suburbs, a
// sourced narrative, the appraisal block), built over the region's suburbs
// through the same source-trust gates. URLs are unchanged. Where a region
// has no suburb with a verified median, the page keeps the suburb, school
// and listing links and claims nothing about prices.

interface RegionPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true; // allow slugs not in generateStaticParams to SSR
export const revalidate = 86400; // cache as ISR for 24h, regen on demand

export async function generateStaticParams() {
  // Skip prerender at build time, DB isn't reachable during `next build`.
  // Pages render on-demand via dynamicParams=true.
  if (process.env.NEXT_PHASE === "phase-production-build") return [];
  const slugs = await getAllRegionSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: RegionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const region = await getRegionBySlug(slug);
  if (!region) return { title: "Region Not Found" };

  const market = await getRegionMarket(region.region);
  const name = regionDisplayName(region.region);
  const title = regionTitle(name, regionHasPrices(market));
  const description = regionDescription(name, region.state, market, region.suburbCount);
  const canonical = `${SITE_URL}/regions/${slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      url: canonical,
      // og titles don't get the root title.template — brand them explicitly
      title: `${title} | ${SITE_NAME}`,
      description,
      type: "article",
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RegionPage({ params }: RegionPageProps) {
  const { slug } = await params;
  const region = await getRegionBySlug(slug);
  if (!region) notFound();

  const [suburbs, market] = await Promise.all([
    getRegionSuburbs(region.region),
    getRegionMarket(region.region),
  ]);

  const name = regionDisplayName(region.region);
  const hasPrices = regionHasPrices(market);
  const stateSlug = region.state.toLowerCase();
  const stateName = STATE_NAMES[region.state as StateCode] ?? region.state;
  const pageTitle = hasPrices
    ? `${name} house prices ${REGION_MARKET_YEAR}`
    : `${name} property market ${REGION_MARKET_YEAR}`;
  const narrative = buildCityNarrative(
    { name, state: region.state },
    market,
    new Date(),
    { area: `the ${name} region`, unit: "region" },
  );
  const faqs = buildRegionFaqs(name, region.state, market);
  const commission = market.medianHousePrice ? commissionOnMedian(region.state, market.medianHousePrice) : null;

  // Which capital, if any, the region sits in: decided by the postcode of
  // the region's suburbs, same rule the suburb pages use for "in Greater X".
  const capitalHits = new Map<string, number>();
  for (const s of suburbs) {
    const c = capitalCityFor(s.state, s.postcode);
    if (c) capitalHits.set(c.slug, (capitalHits.get(c.slug) ?? 0) + 1);
  }
  const capitalSlug = [...capitalHits.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const capital = capitalSlug ? { slug: capitalSlug, name: capitalSlug.charAt(0).toUpperCase() + capitalSlug.slice(1) } : null;

  const suburbSlugs = suburbs.map((s) => s.slug);
  const mostSearched = topSuburbsAmong(suburbSlugs, 24);

  const allProperties = await getProperties({
    suburb: suburbSlugs.join(","),
    listingType: "buy",
  });
  const properties = allProperties.slice(0, 6);

  const housePrice = market.medianHousePrice ? formatPrice(market.medianHousePrice) : "N/A";
  const unitPrice = market.medianUnitPrice ? formatPrice(market.medianUnitPrice) : "N/A";
  const growth =
    market.medianAnnualGrowth != null
      ? `${market.medianAnnualGrowth > 0 ? "+" : ""}${market.medianAnnualGrowth}%`
      : "N/A";
  const rent = market.medianRentHouse ? `$${market.medianRentHouse}/wk` : "N/A";

  const linkChip =
    "inline-flex items-center rounded-lg border border-line bg-surface-raised px-3 py-1.5 text-sm font-sans font-medium text-ink hover:border-primary/40 hover:text-primary transition-colors";

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Regions", url: "/regions" },
          { name: region.region, url: `/regions/${slug}` },
        ]}
      />
      <PlaceJsonLd name={region.region} url={"/regions/" + slug} addressRegion={region.state} />
      <ItemListJsonLd
        name={"Suburbs in " + region.region}
        url={"/regions/" + slug}
        items={suburbs.slice(0, 20).map((s) => ({ name: s.name, url: "/suburbs/" + s.slug }))}
      />
      <GuideArticleJsonLd
        title={pageTitle}
        description={`${name} property market data for ${REGION_MARKET_YEAR}: median prices, growth and suburb rankings.`}
        url={`/regions/${slug}`}
        datePublished="2026-09-20"
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
                { label: "Regions", href: "/regions" },
                { label: region.region },
              ]}
            />
          </div>

          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
            {regionEyebrow(region.region, region.state, region.suburbCount)}
          </p>
          <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
            {hasPrices ? (
              <>
                {name} house prices, <span className="italic text-primary">{REGION_MARKET_YEAR}</span>.
              </>
            ) : (
              <>
                {name} property market, <span className="italic text-primary">{REGION_MARKET_YEAR}</span>.
              </>
            )}
          </h1>
          {/* Direct answer sentence for "median house price {region}", kept as
              plain prose so answer engines can quote it verbatim. */}
          <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-2xl">
            {market.medianHousePrice ? (
              <>
                The median house price in {name} is{" "}
                <span className="font-medium text-ink">{formatPriceFull(market.medianHousePrice)}</span>, the
                median of {market.pricedSuburbCount.toLocaleString()} suburb medians from verified government
                sales data. Below: house prices in the busiest suburbs, then the fastest-growing, most affordable
                and highest-priced suburbs in the {name} region of {stateName}.
              </>
            ) : (
              <>
                Suburb profiles, schools and listings across the {region.suburbCount.toLocaleString()} suburbs of
                the {name} region, {stateName}. Verified sales data has not yet been published for these suburbs,
                so this page shows no median prices until it is.
              </>
            )}
          </p>
        </div>
      </section>

      {/* Stat anchor row, only where the rollup found verified prices */}
      {hasPrices && (
        <section className="bg-surface-raised border-b border-line">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight mb-6">
              Median house price in {name}.
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={<Home className="w-4 h-4" />} label="Median house" value={housePrice} sub="median of suburb medians" />
              <StatCard icon={<Building2 className="w-4 h-4" />} label="Median unit" value={unitPrice} sub="median of suburb medians" />
              <StatCard icon={<TrendingUp className="w-4 h-4" />} label="Typical annual growth" value={growth} sub="house prices, last 12 months" />
              <StatCard icon={<DollarSign className="w-4 h-4" />} label="Median house rent" value={rent} sub="weekly, across tracked suburbs" />
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* What the numbers show, built from the same rollup (sourced and
            dated in its last paragraph). Describes; never recommends. */}
        {narrative.length > 0 && (
          <section className="max-w-3xl">
            <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight mb-5">
              What {name} house prices are doing.
            </h2>
            <div className="space-y-4">
              {narrative.map((p, i) => (
                <p
                  key={i}
                  className={
                    i === narrative.length - 1
                      ? "font-sans text-sm text-ink-subtle leading-relaxed"
                      : "font-sans text-base sm:text-lg text-ink-muted leading-[1.7]"
                  }
                >
                  {p}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* House prices by suburb: the busiest established suburbs. */}
        <SuburbTable
          as="h2"
          heading={
            market.busiest.length >= 20
              ? `House prices by suburb: ${name}'s twenty busiest`
              : `House prices by suburb in ${name}`
          }
          rows={market.busiest}
          showGrowth
          showSales
        />

        {market.topGrowth.length >= 3 && (
          <SuburbTable heading={`Fastest-growing ${name} suburbs`} rows={market.topGrowth} showGrowth />
        )}
        {market.mostAffordable.length >= 3 && (
          <SuburbTable heading={`Most affordable ${name} suburbs`} rows={market.mostAffordable} showGrowth />
        )}
        {market.premium.length >= 3 && (
          <SuburbTable heading={`${name}'s highest median prices`} rows={market.premium} />
        )}

        {/* Most searched suburbs in the region (from the Search Console export) */}
        <MostSearchedSuburbs label={name} suburbs={mostSearched} tone="ink" />

        {/* Real estate agents in the region: the regional "agents in" home
            the valuation plan owes, as a section rather than a new URL. The
            match request pre-sets the selling intent; the suburb is chosen
            on the form. Listing real agents follows the suburb agents pages
            once the directory holds them. */}
        <section id="agents" className="scroll-mt-16 rounded-2xl border border-line bg-surface-raised p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
                Real estate agents in {name}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight mb-4">
                Selling in {name}? Get matched to one local agent.
              </h2>
              <p className="font-sans text-base text-ink-muted leading-relaxed">
                Tell us the suburb and when you plan to sell. We match you to one agent who sells in that part of{" "}
                {name}, with recent sales there, and you decide whether to talk to them. Free for sellers.
              </p>
              {commission && market.medianHousePrice && (
                <p className="mt-4 font-sans text-sm text-ink-muted leading-relaxed">
                  Commission in {stateName} typically runs {commission.lowPct}% to {commission.highPct}%. On the{" "}
                  {name} median of {formatPriceFull(market.medianHousePrice)} that is{" "}
                  {formatPriceFull(commission.lowAmount)} to {formatPriceFull(commission.highAmount)}, before
                  marketing. Rates are negotiable; see the{" "}
                  <Link
                    href={`/guides/real-estate-commission-${stateSlug}`}
                    className="text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
                  >
                    {region.state} commission guide
                  </Link>
                  .
                </p>
              )}
            </div>
            <Suspense fallback={null}>
              <MatchAgent initialIntent="selling" source={`region-agents-${slug}`} compact />
            </Suspense>
          </div>
        </section>

        {/* Visible FAQ backing the FAQPage schema */}
        {faqs.length > 0 && (
          <section>
            <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight mb-6">
              {name} property market questions
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

        {/* Every suburb in the region, medians only where the source is trusted */}
        <section>
          <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight mb-2">
            Suburbs in {region.region}
          </h2>
          <p className="font-sans text-sm text-ink-muted mb-6">
            All {suburbs.length.toLocaleString()} suburbs in the {region.region} region, {stateName}. Medians are
            shown only where a verified sales source publishes one.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {suburbs.map((suburb) => {
              const trusted = isReliableSalesSource(suburb.statsSource);
              const house = trusted && suburb.medianHousePrice > 0 ? formatPriceFull(suburb.medianHousePrice) : "–";
              const unit = trusted && suburb.medianUnitPrice > 0 ? formatPriceFull(suburb.medianUnitPrice) : "–";
              return (
                <Link
                  key={suburb.slug}
                  href={`/suburbs/${suburb.slug}`}
                  className="group rounded-xl border border-line bg-surface-raised px-4 py-3 hover:border-primary/40 hover:shadow-sm transition-all"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-sans text-sm font-medium text-ink group-hover:text-primary transition-colors truncate">
                      {suburb.name}
                      <span className="text-xs text-ink-subtle font-normal ml-1.5">{suburb.postcode}</span>
                    </span>
                    <span className="font-display text-sm text-ink tabular-nums whitespace-nowrap">{house}</span>
                  </div>
                  <p className="text-xs font-sans text-ink-subtle mt-1">Units {unit}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Listings, where any are on file */}
        {properties.length > 0 && (
          <section>
            <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight mb-2">
              Houses for sale in {name}
            </h2>
            <p className="font-sans text-sm text-ink-muted mb-6">Active listings across the {region.region} region.</p>
            <PropertyGrid properties={properties} />
          </section>
        )}

        {/* Cross-links */}
        <section className="rounded-2xl border border-line bg-surface-warm p-6">
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">Keep exploring</p>
          <div className="flex flex-wrap gap-2">
            <Link href={`/regions/${slug}/schools`} className={linkChip}>
              Schools in {region.region}
            </Link>
            {capital && (
              <Link href={`/property-market/${capital.slug}`} className={linkChip}>
                {capital.name} house prices
              </Link>
            )}
            <Link href={`/market-reports/${stateSlug}`} className={linkChip}>
              {region.state} state market report
            </Link>
            <Link href={`/best-suburbs/highest-growth/${stateSlug}`} className={linkChip}>
              {region.state} growth ranking
            </Link>
            <Link href="/regions" className={linkChip}>
              All regions
            </Link>
          </div>
        </section>

        {/* Source note */}
        <section className="rounded-2xl border border-line bg-surface-warm p-5 text-sm font-sans text-ink-muted">
          <p className="text-xs uppercase tracking-[0.25em] text-ink-subtle mb-2">Data source</p>
          <p className="leading-relaxed">
            Figures are aggregated from suburb-level medians sourced from state valuers-general, state government
            sales records and the ABS. Only suburbs with a verified sales source contribute to price figures (
            {market.pricedSuburbCount.toLocaleString()} of {market.suburbCount.toLocaleString()} tracked{" "}
            {region.region} suburbs). Growth outliers from thin sales samples are excluded.{" "}
            <Link
              href="/methodology#median-prices"
              className="text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
            >
              Full methodology →
            </Link>
          </p>
        </section>
      </div>

      {/* Appraisal entry: region-price readers are one step from "what's mine
          worth". Suburb first, that suburb's median, then the appraisal form. */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-3xl">
          <HomeValueAppraisal />
        </div>
      </section>

      {/* Seller funnel exit */}
      <ExpertCTA
        headline={`Thinking about selling in ${name}?`}
        body="The complete guide to selling in today's market: what it really costs, how agents price your home, the 10 questions that catch bad agents out, and a 12-week plan to settlement. Free PDF, in your inbox in 60 seconds."
        ctaLabel="Get the free selling guide"
        href="/selling-guide"
      />
    </>
  );
}
