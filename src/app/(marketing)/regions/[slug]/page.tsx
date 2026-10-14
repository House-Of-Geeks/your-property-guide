import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TrendingUp, Home, DollarSign, Building2 } from "lucide-react";
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
import { stateRankingLink } from "@/lib/ranking-notes";
import { capitalCityFor } from "@/lib/utils/metro";
import { formatPrice, formatPriceFull } from "@/lib/utils/format";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Band, HeroLead, HeroTitle, PhotoHero, SectionHeading } from "@/components/premium";

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


  const housePrice = market.medianHousePrice ? formatPrice(market.medianHousePrice) : "N/A";
  const unitPrice = market.medianUnitPrice ? formatPrice(market.medianUnitPrice) : "N/A";
  const growth =
    market.medianAnnualGrowth != null
      ? `${market.medianAnnualGrowth > 0 ? "+" : ""}${market.medianAnnualGrowth}%`
      : "N/A";
  const rent = market.medianRentHouse ? `$${market.medianRentHouse}/wk` : "N/A";

  const linkChip =
    "inline-flex items-center rounded-lg border border-line bg-surface-raised px-3 py-1.5 text-sm font-medium text-ink hover:border-ink transition-colors";

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

      {/* Hero: the median answer sentence stays in the lead. */}
      <PhotoHero
        photo="street"
        breadcrumbs={[
          { label: "Regions", href: "/regions" },
          { label: region.region },
        ]}
      >
        <p className="text-sm text-ink-muted mb-5">
          {regionEyebrow(region.region, region.state, region.suburbCount)}
        </p>
        <HeroTitle>
          {hasPrices ? (
            <>
              {name} house prices, <span>{REGION_MARKET_YEAR}</span>.
            </>
          ) : (
            <>
              {name} property market, <span>{REGION_MARKET_YEAR}</span>.
            </>
          )}
        </HeroTitle>
        {/* Direct answer sentence for "median house price {region}", kept as
            plain prose so answer engines can quote it verbatim. */}
        <HeroLead>
          {market.medianHousePrice ? (
            <>
              The median house price in {name} is{" "}
              <span className="font-semibold text-ink">{formatPriceFull(market.medianHousePrice)}</span>, the
              median of {market.pricedSuburbCount.toLocaleString()} suburb medians from verified government
              sales data. Below: house prices in the busiest suburbs, then the fastest-growing, most affordable
              and highest-priced suburbs in the {name} region of {stateName}.
            </>
          ) : (
            <>
              Suburb profiles and schools across the {region.suburbCount.toLocaleString()} suburbs of
              the {name} region, {stateName}. Verified sales data has not yet been published for these suburbs,
              so this page shows no median prices until it is.
            </>
          )}
        </HeroLead>
      </PhotoHero>

      {/* Stat anchor row, only where the rollup found verified prices */}
      {hasPrices && (
        <Band spacing="compact">
          <SectionHeading size="md" title={<>Median house price in {name}</>} />
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<Home className="w-4 h-4" />} label="Median house" value={housePrice} sub="median of suburb medians" />
            <StatCard icon={<Building2 className="w-4 h-4" />} label="Median unit" value={unitPrice} sub="median of suburb medians" />
            <StatCard icon={<TrendingUp className="w-4 h-4" />} label="Typical annual growth" value={growth} sub="house prices, last 12 months" />
            <StatCard icon={<DollarSign className="w-4 h-4" />} label="Median house rent" value={rent} sub="weekly, across tracked suburbs" />
          </div>
        </Band>
      )}

      {/* What the numbers show, built from the same rollup (sourced and
          dated in its last paragraph). Describes; never recommends. Only
          present with a median, so it always follows the light stat band. */}
      {narrative.length > 0 && (
        <Band tone="dark" spacing="compact">
          <div className="max-w-3xl">
            <SectionHeading size="md" title={<>What {name} house prices are doing</>} />
            <div className="mt-8 space-y-4">
              {narrative.map((p, i) => (
                <p
                  key={i}
                  className={
                    i === narrative.length - 1
                      ? "text-sm text-ink-subtle leading-relaxed"
                      : "text-base sm:text-lg text-ink-muted leading-[1.7]"
                  }
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </Band>
      )}

      {/* The agents section closes this band so it is never empty: a region
          with no verified prices has no tables, and may have too few
          searched suburbs for that list. */}
      <Band tone="quiet" spacing="compact">
        <div className="space-y-14">
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
          <section id="agents" className="scroll-mt-16 rounded-xl border border-line bg-surface-raised p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
              <div>
                <p className="text-sm text-ink-subtle mb-3">
                  Real estate agents in {name}
                </p>
                <h2 className="text-2xl sm:text-3xl leading-tight tracking-[-0.02em] text-ink mb-4">
                  Selling in {name}? Get matched to one local agent
                </h2>
                <p className="text-base text-ink-muted leading-relaxed">
                  Tell us the suburb and when you plan to sell. We match you to one agent who sells in that part of{" "}
                  {name}, with recent sales there, and you decide whether to talk to them. Free for sellers.
                </p>
                {commission && market.medianHousePrice && (
                  <p className="mt-4 text-sm text-ink-muted leading-relaxed">
                    Commission in {stateName} typically runs {commission.lowPct}% to {commission.highPct}%. On the{" "}
                    {name} median of {formatPriceFull(market.medianHousePrice)} that is{" "}
                    {formatPriceFull(commission.lowAmount)} to {formatPriceFull(commission.highAmount)}, before
                    marketing. Rates are negotiable; see the{" "}
                    <Link
                      href={`/guides/real-estate-commission-${stateSlug}`}
                      className="font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink"
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
        </div>
      </Band>

      {/* The suburb list closes this band, so it is never empty either. */}
      <Band spacing="compact">
        <div className="space-y-14">
          {/* Visible FAQ backing the FAQPage schema */}
          {faqs.length > 0 && (
            <section>
              <SectionHeading size="md" title={<>{name} property market questions</>} />
              <dl className="mt-8 divide-y divide-line border-y border-line">
                {faqs.map((faq) => (
                  <div key={faq.question} className="py-5">
                    <dt className="text-lg font-semibold text-ink leading-snug mb-2">{faq.question}</dt>
                    <dd className="text-base text-ink-muted leading-relaxed">{faq.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {/* Every suburb in the region, medians only where the source is trusted */}
          <section>
            <SectionHeading size="md" title={<>Suburbs in {region.region}</>} />
            <p className="mt-3 text-sm text-ink-muted mb-8">
              All {suburbs.length.toLocaleString()} suburbs in the {region.region} region, {stateName}. Medians are
              shown only where the suburb&rsquo;s own page publishes one.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {suburbs.map((suburb) => {
                // Published figures: getRegionSuburbs has applied the suburb pages' rule.
                const house = suburb.medianHousePrice > 0 ? formatPriceFull(suburb.medianHousePrice) : "–";
                const unit = suburb.medianUnitPrice > 0 ? formatPriceFull(suburb.medianUnitPrice) : "–";
                return (
                  <Link
                    key={suburb.slug}
                    href={`/suburbs/${suburb.slug}`}
                    className="group rounded-xl border border-line bg-surface-raised px-4 py-3 hover:border-ink transition-colors"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm font-medium text-ink group-hover:text-primary transition-colors truncate">
                        {suburb.name}
                        <span className="text-xs text-ink-subtle font-normal ml-1.5">{suburb.postcode}</span>
                      </span>
                      <span className="text-sm font-semibold text-ink whitespace-nowrap">{house}</span>
                    </div>
                    <p className="text-xs text-ink-subtle mt-1">Units {unit}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </Band>

      <Band tone="quiet" spacing="compact">
        <div className="space-y-14">
          <div>
            {/* Cross-links */}
            <section>
              <p className="text-sm text-ink-subtle mb-3">Keep exploring</p>
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
                <Link href={stateRankingLink(region.state).href} className={linkChip}>
                  {stateRankingLink(region.state).label}
                </Link>
                <Link href="/regions" className={linkChip}>
                  All regions
                </Link>
              </div>
            </section>

            {/* Source note */}
            <section className="mt-10 max-w-3xl border-t border-line pt-6 text-sm text-ink-muted">
              <p className="text-sm font-semibold text-ink mb-2">Data source</p>
              <p className="leading-relaxed">
                Figures are aggregated from suburb-level medians sourced from state valuers-general, state government
                sales records and the ABS. Only suburbs whose own page publishes a median contribute to price figures (
                {market.pricedSuburbCount.toLocaleString()} of {market.suburbCount.toLocaleString()} tracked{" "}
                {region.region}
                {" suburbs): "}a verified sales source, and at least five recorded sales where the count is reported.
                A 12-month change is shown where the state&rsquo;s sales feed measures one, and left out beyond
                25%.{" "}
                <Link
                  href="/methodology#median-prices"
                  className="font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink"
                >
                  Full methodology →
                </Link>
              </p>
            </section>
          </div>
        </div>
      </Band>

      {/* Appraisal entry: region-price readers are one step from "what's mine
          worth". Suburb first, that suburb's median, then the appraisal form. */}
      <Band spacing="compact">
        <div className="max-w-3xl">
          <HomeValueAppraisal />
        </div>
      </Band>

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
