import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SuburbHero, SuburbSectionNav } from "@/components/suburb/SuburbHero";
import { DataFreshnessNote, SuburbFAQ } from "@/components/suburb";
import { SuburbAppraisalCTA } from "@/components/suburb/SuburbAppraisalCTA";
import { SuburbSellingGuideCTA } from "@/components/suburb/SuburbSellingGuideCTA";
import { SuburbSchools } from "@/components/suburb/SuburbSchools";
import { SuburbWalkability } from "@/components/suburb/SuburbWalkability";
import { SuburbHazard } from "@/components/suburb/SuburbHazard";
import { SuburbClimate } from "@/components/suburb/SuburbClimate";
import { SuburbCrime } from "@/components/suburb/SuburbCrime";
import { SuburbInvestment } from "@/components/suburb/SuburbInvestment";
import { SuburbContextualLinks } from "@/components/suburb/SuburbContextualLinks";
import { SuburbMap } from "@/components/suburb/SuburbMap";
import { getSuburbSubpageAvailability } from "@/lib/services/subpage-availability";
import { SuburbPriceTrend } from "@/components/suburb/SuburbPriceTrend";
import { BreadcrumbJsonLd, PlaceJsonLd } from "@/components/seo";
import { Button } from "@/components/ui";
import { BUTTON_PRIMARY, Band, SectionHeading } from "@/components/premium";
import { getSuburbBySlug } from "@/lib/services/suburb-service";
import { isThinProfile } from "@/lib/suburb-indexability";
import { getSuburbCrimeWithLgaFallback } from "@/lib/services/data-freshness";
import { suburbTitle, suburbDescription } from "@/lib/utils/seo";
import { formatPriceFull, formatPercentage } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";
import { buildSuburbOgImageUrl } from "@/lib/og/helpers";
import { capitalCityFor } from "@/lib/utils/metro";
import {
  buildIntro,
  buildMarketSummary,
  buildDemographicsSummary,
  buildLifestyleSummary,
  buildInvestorView,
  buildBuyerView,
  buildSellerView,
  isAutoStubDescription,
} from "@/lib/suburb-narrative";
import {
  hasReliablePrice,
  PENDING_PRICE_LABEL,
  PENDING_PRICE_NOTE,
} from "@/lib/suburb-data-quality";
import { describeSalesProvenance, hasEnoughSales, thinSalesNote } from "@/lib/sales-provenance";
import { publishedGrowthFor } from "@/lib/published-medians";
import { PriceProvenance } from "@/components/suburb/PriceProvenance";
import { buildSnapshotProvenance, buildSnapshotStats, type SnapshotStat } from "@/lib/suburb-snapshot";
import { buildSuburbFaqs } from "@/lib/suburb-faq";
import { guideFunnelHref } from "@/lib/guide-funnel";
import { rentalSourceLabel } from "@/lib/rental-labels";

interface SuburbDetailPageProps {
  params: Promise<{ slug: string }>;
}

// ISR, suburb profiles aggregate several services (suburb + properties +
// crime + climate + walkability). Was rendering full SSR per request,
// burning function-GB-hours under crawl traffic. Suburb data only changes
// when the sync worker refreshes (monthly-ish), so 24h revalidate is
// extremely generous and still cuts function compute by ~99%.
// See /property/[slug]/page.tsx for why generateStaticParams returning []
// is required to actually enable ISR on Next 16 dynamic routes.
// Suburb data refreshes weekly via the sync worker (rental, sales,
// hazard, climate, schools, walkability). 24h was overkill and was
// the primary driver of function-invocation cost on first crawl +
// revalidation. 7d cuts re-revalidations by ~85% with no content
// freshness impact.
export const revalidate = 604800;
export const dynamicParams = true;
export function generateStaticParams() { return []; }

// A suburb is "thin" when it has no published price, no population and none
// of walkability, climate, crime or rental data of its own (or is a row filed
// under the wrong state, "Sydney, SA 2000"): the page is then mostly empty
// modules. It stays reachable (direct URL + internal links
// still work) but is kept out of the index until real data lands. The rule
// is isThinProfile in src/lib/suburb-indexability.ts, which the suburbs
// sitemap applies to the same signals, so the two cannot disagree.
function isThinSuburb(s: Awaited<ReturnType<typeof getSuburbBySlug>>): boolean {
  if (!s) return false;
  return isThinProfile({
    publishedPrice: !!s.stats.medianHousePrice || !!s.stats.medianUnitPrice,
    population: s.stats.population,
    place: { state: s.state, postcode: s.postcode },
    signals: {
      walkScore: s.stats.walkScore,
      hasClimate: s.climate != null,
      // Set when a row for this suburb exists (fetchFreshness), which is what
      // the sitemap counts.
      hasCrime: s.dataFreshness?.crimeSource != null,
      hasRental: s.dataFreshness?.rentalSource != null,
    },
  });
}

export async function generateMetadata({ params }: SuburbDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const suburb = await getSuburbBySlug(slug);
  if (!suburb) return { title: "Suburb Not Found" };
  const thin = isThinSuburb(suburb);
  return {
    title: suburbTitle(suburb),
    description: suburbDescription(suburb),
    alternates: { canonical: `${SITE_URL}/suburbs/${slug}` },
    robots: thin ? { index: false, follow: true } : undefined,
    openGraph: {
      url: `${SITE_URL}/suburbs/${slug}`,
      title: suburbTitle(suburb),
      description: suburbDescription(suburb),
      type: "website",
      images: [
        {
          url: buildSuburbOgImageUrl(slug),
          width: 1200,
          height: 630,
          alt: `${suburb.name}, ${suburb.state} ${suburb.postcode} suburb profile`,
        },
      ],
    },
    twitter: { card: "summary_large_image" },
  };
}


// Shared section rhythm. Sections clear the sticky header (64px / 72px) and
// the section bar under it when jumped to. The page runs in premium bands
// (BRAND.md section 11): the photo hero, then light and quiet bands; the
// data, maps and charts stay on light bands.
const SECTION = "scroll-mt-32 sm:scroll-mt-36";
const H2 = "font-display text-[1.75rem] sm:text-3xl font-bold text-ink leading-tight tracking-[-0.02em]";
const H2_SMALL = "font-display text-2xl font-bold text-ink leading-tight tracking-[-0.02em]";
const PROSE = "font-sans text-base sm:text-lg text-ink-muted leading-[1.7]";
const TEXT_LINK = "font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink";

// The figures beside the answer: the snapshot tiles without the house median
// (the answer itself), the yield (the investment section owns it, on its own
// gate) and the walk score (the Location section's three scores own it).
const GLANCE_KEYS: ReadonlySet<SnapshotStat["key"]> = new Set(["unit", "rent", "dom", "population"]);

export default async function SuburbDetailPage({ params }: SuburbDetailPageProps) {
  const { slug } = await params;
  const suburb = await getSuburbBySlug(slug);
  if (!suburb) notFound();

  const [crimeStat, availability] = await Promise.all([
    getSuburbCrimeWithLgaFallback(slug, suburb.state, suburb.region),
    // Which sub-pages have something on them: the page links only to those.
    getSuburbSubpageAvailability(suburb),
  ]);

  // Algorithmic narrative. Turns the structured suburb data into reading
  // copy that is unique per suburb (because the data is unique per
  // suburb) without any LLM call. Replaces the thin "X is a suburb in Y"
  // stub that the importer writes for most rows.
  const stubDescription = isAutoStubDescription(suburb.description, suburb.name);
  const intro = buildIntro(suburb);
  const marketSummary = buildMarketSummary(suburb);
  const demographicsSummary = buildDemographicsSummary(suburb);
  const lifestyleSummary = buildLifestyleSummary(suburb);
  const investorView = buildInvestorView(suburb);
  const buyerView = buildBuyerView(suburb);
  const sellerView = buildSellerView(suburb);
  // Whether we trust this suburb's median enough to print it as fact.
  // Drives the answer at the top of the page and the price section.
  const priceTrusted = hasReliablePrice(suburb);
  const houseGrowth = publishedGrowthFor(suburb);
  const salesProvenance = describeSalesProvenance({
    source: suburb.dataFreshness?.salesSource,
    periodEnd: suburb.dataFreshness?.salesPeriodEnd,
    updatedAt: suburb.dataFreshness?.salesAsOf,
    salesCount: suburb.dataFreshness?.salesCount,
    suburbName: suburb.name,
  });
  // A trusted feed with too few sales: say so instead of "pending".
  const thinSalesCount = !priceTrusted && salesProvenance && !hasEnoughSales(suburb.dataFreshness?.salesCount)
    ? suburb.dataFreshness?.salesCount ?? null
    : null;
  // Greater-capital classification (postcode-range based) for the place
  // line under the H1 and the city market-page link.
  const capitalCity = capitalCityFor(suburb.state, suburb.postcode);

  // The snapshot figures (every number already through the service gates),
  // shown once, beside the answer. A lone figure is not a panel: below two,
  // each figure stays in its own section further down instead.
  // Where the median is withheld the price section is the rent section, so
  // the rent stays there rather than in the panel.
  const glanceAll = buildSnapshotStats(suburb).filter((t) => GLANCE_KEYS.has(t.key) && (priceTrusted || t.key !== "rent"));
  const glance = glanceAll.length >= 2 ? glanceAll : [];
  const inGlance = new Set(glance.map((t) => t.key));
  const glanceProvenance = buildSnapshotProvenance(suburb, glance);

  const guideHref = guideFunnelHref("selling", { suburb: suburb.slug, from: "suburb-profile" });
  const hasFaqs = buildSuburbFaqs(suburb).length > 0;
  const hasSchools = suburb.schools.length > 0;
  const sectionLinks = [
    { label: "Prices", href: "#market" },
    { label: "About", href: "#about" },
    ...(hasSchools ? [{ label: "Schools", href: "#schools" }] : []),
    { label: "Location", href: "#location" },
    { label: "Demographics", href: "#demographics" },
    ...(hasFaqs ? [{ label: "FAQ", href: "#faq" }] : []),
  ];

  // Census figures for the demographics list; population and age only when
  // the panel at the top does not already carry them.
  const s = suburb.stats;
  const demographicFigures = [
    ...(inGlance.has("population")
      ? []
      : [
          { label: "Population", value: s.population ? s.population.toLocaleString() : "–" },
          { label: "Median age", value: s.medianAge ? String(s.medianAge) : "–" },
        ]),
    { label: "Family households", value: s.householdsFamily ? `${s.householdsFamily}%` : "–" },
    { label: "Lone person", value: s.householdsLonePerson ? `${s.householdsLonePerson}%` : "–" },
    { label: "Owner occupied", value: s.ownerOccupied ? `${s.ownerOccupied}%` : "–" },
    { label: "Renter occupied", value: s.renterOccupied ? `${s.renterOccupied}%` : "–" },
  ];
  // The reading of the median and what it means for each side: all of it
  // rests on a trusted median, so a withheld one leaves the rent alone.
  const hasPriceStory = Boolean(marketSummary || sellerView || buyerView);
  const hasLocationExtras = suburb.amenities.length > 0 || suburb.transportLinks.length > 0;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Suburbs", url: "/suburbs" },
          { name: suburb.name, url: `/suburbs/${suburb.slug}` },
        ]}
      />
      <PlaceJsonLd
        name={suburb.name}
        url={"/suburbs/" + suburb.slug}
        addressLocality={suburb.name}
        addressRegion={suburb.state}
        postalCode={suburb.postcode}
      />

      {/* First screen: the lookup answered (suburb, state and postcode in
          the H1; the median with its source), then the next step. */}
      <SuburbHero
        suburb={suburb}
        capitalCity={capitalCity}
        aside={glance.length > 0 ? (
          <div className="tone-light rounded-xl border border-line bg-white">
            <p className="px-5 pt-4 pb-3 text-[15px] font-semibold text-ink">
              {suburb.name} at a glance
            </p>
            <dl className="grid grid-cols-2 border-t border-line">
              {glance.map((t, i) => (
                <div
                  key={t.key}
                  className={`px-5 py-4 ${i % 2 === 1 ? "border-l border-line" : ""} ${i >= 2 ? "border-t border-line" : ""}`}
                >
                  <dt className="text-[13px] text-ink-muted">{t.label}</dt>
                  <dd className="mt-1 font-display text-2xl font-bold text-ink leading-none tracking-tight">
                    {t.value}
                  </dd>
                  {t.detail && <dd className="mt-1.5 text-xs text-ink-muted leading-snug">{t.detail}</dd>}
                </div>
              ))}
            </dl>
            {glanceProvenance.length > 0 && (
              <p className="border-t border-line px-5 py-3 text-xs text-ink-subtle leading-relaxed">
                {glanceProvenance.join(" · ")}
              </p>
            )}
          </div>
        ) : undefined}
      >
        {/* The median, gated: printed as fact only from a trusted feed with
            enough sales, with its sample, source and period under it. */}
        <div className="mt-7 sm:mt-9">
          <p className="text-[15px] font-semibold text-ink-muted">Median house price</p>
          {priceTrusted ? (
            <>
              <p className="mt-1 font-display text-[2.75rem] sm:text-6xl font-bold text-ink leading-none tracking-[-0.035em]">
                {formatPriceFull(suburb.stats.medianHousePrice)}
              </p>
              {/* The 12-month change only where a feed measures one (NSW, SA),
                  the rule the title, description and FAQ read: annualGrowthHouse
                  is a number, so the old null check printed "+0.0% over the
                  past year" under every Land Victoria and ABS median. Spaces
                  are written as strings (JSX spacing trap). The unit median
                  shows here only when the panel beside it does not. */}
              {(houseGrowth !== 0 || (suburb.stats.medianUnitPrice > 0 && !inGlance.has("unit"))) && (
                <p className="mt-3 font-sans text-base text-ink-muted leading-relaxed">
                  {houseGrowth !== 0 && (
                    <>
                      {/* text-success / text-danger take their light
                          values inside the hero's .tone-dark scope. */}
                      <span className={`font-semibold ${houseGrowth > 0 ? "text-success" : "text-danger"}`}>
                        {formatPercentage(houseGrowth)}
                      </span>
                      {" over the past year. "}
                    </>
                  )}
                  {suburb.stats.medianUnitPrice > 0 && !inGlance.has("unit") && (
                    <>
                      {"Median unit price "}
                      <span className="font-semibold text-ink">{formatPriceFull(suburb.stats.medianUnitPrice)}</span>
                      {"."}
                    </>
                  )}
                </p>
              )}
              <PriceProvenance provenance={salesProvenance} />
            </>
          ) : (
            // Untrusted source or too few sales: no figure, the reason, and
            // the methodology. Never the back-calculated "median".
            <>
              <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-ink leading-tight tracking-tight">
                {thinSalesCount ? "Too few sales for a median" : PENDING_PRICE_LABEL}
              </p>
              <p className="mt-2 font-sans text-sm text-ink-muted leading-relaxed max-w-xl">
                {thinSalesCount && salesProvenance ? thinSalesNote(thinSalesCount, salesProvenance.period) : PENDING_PRICE_NOTE}{" "}
                <Link href="/methodology" className={TEXT_LINK}>
                  How we source data
                </Link>
                .
              </p>
              <DataFreshnessNote
                label="Sales"
                asOf={suburb.dataFreshness?.salesAsOf ?? null}
              />
            </>
          )}
        </div>

        {/* The next step, for the sellers this template sends us: the guide
            (the funnel starts on question two with the suburb filled in),
            and the appraisal form further down the page. */}
        <div className="mt-8 border-t border-line pt-6">
          <p className="font-display text-lg sm:text-xl font-bold text-ink">
            Selling in {suburb.name}?
          </p>
          <p className="mt-1 text-[15px] text-ink-muted leading-relaxed max-w-lg">
            Get the free selling guide, personalised to {suburb.name}, or ask
            for a free appraisal from a local agent.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-4">
            <Link href={guideHref} className={`${BUTTON_PRIMARY} justify-center`}>
              Get the free selling guide
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <a href="#appraisal" className={`self-center sm:self-auto ${TEXT_LINK}`}>
              Free appraisal
            </a>
          </div>
        </div>
      </SuburbHero>

      <SuburbSectionNav links={sectionLinks} />

      {/* Prices: the reading of the median, the trend where growth is
          measured, what it means for each side, and the rent. */}
      <Band id="market" spacing="compact" className={SECTION}>
        <SectionHeading
          size="md"
          title={priceTrusted ? `House prices in ${suburb.name}` : `Rent in ${suburb.name}`}
        />
        <div className={`mt-8 grid gap-8 lg:gap-12 ${hasPriceStory ? "lg:grid-cols-12" : ""}`}>
          {hasPriceStory && (
            <div className="lg:col-span-7 space-y-6">
              {marketSummary && <p className={PROSE}>{marketSummary}</p>}
              {(sellerView || buyerView) && (
                <div className="grid sm:grid-cols-2 gap-6 border-t border-line pt-6">
                  {sellerView && (
                    <div>
                      <h3 className="font-sans text-base font-bold text-ink">For sellers</h3>
                      <p className="mt-1.5 font-sans text-[15px] text-ink-muted leading-relaxed">{sellerView}</p>
                      <p className="mt-2 text-sm">
                        <Link href="/real-estate-commission-calculator" className={TEXT_LINK}>
                          Work out your selling costs
                        </Link>
                      </p>
                    </div>
                  )}
                  {buyerView && (
                    <div>
                      <h3 className="font-sans text-base font-bold text-ink">For buyers</h3>
                      <p className="mt-1.5 font-sans text-[15px] text-ink-muted leading-relaxed">{buyerView}</p>
                      <p className="mt-2 text-sm">
                        <Link href="/borrowing-power-calculator" className={TEXT_LINK}>
                          See what you can borrow
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className={hasPriceStory ? "lg:col-span-5 space-y-6" : "max-w-xl space-y-6"}>
            {/* Five-year trajectory, same trust gate as the median. */}
            {priceTrusted && suburb.stats.medianHousePrice > 0 && suburb.stats.annualGrowthHouse !== 0 && (
              <SuburbPriceTrend
                medianHousePrice={suburb.stats.medianHousePrice}
                annualGrowthHouse={suburb.stats.annualGrowthHouse}
                suburbName={suburb.name}
              />
            )}
            {/* The rent, unless the panel at the top already shows it. */}
            <div>
              {!inGlance.has("rent") && (
                <dl className="grid grid-cols-2 border-y border-line">
                  {(suburb.stats.medianRentAll ?? 0) > 0 && !suburb.stats.medianRentHouse && !suburb.stats.medianRentUnit ? (
                    // WA bond data: one median across all dwellings, no split.
                    <>
                      <Figure label="Weekly rent (all dwellings)" value={`$${suburb.stats.medianRentAll}/wk`} />
                      <Figure label="House or unit rent" value="Not published" divided />
                    </>
                  ) : (
                    <>
                      <Figure label="Weekly rent (house)" value={suburb.stats.medianRentHouse ? `$${suburb.stats.medianRentHouse}/wk` : "–"} />
                      <Figure label="Weekly rent (unit)" value={suburb.stats.medianRentUnit ? `$${suburb.stats.medianRentUnit}/wk` : "–"} divided />
                    </>
                  )}
                </dl>
              )}
              <DataFreshnessNote
                label="Rental"
                asOf={suburb.dataFreshness?.rentalAsOf ?? null}
                source={rentalSourceLabel(suburb.dataFreshness?.rentalSource, suburb.postcode) ?? suburb.dataFreshness?.rentalSource ?? undefined}
              />
              {availability["rental-market"] && (
                <div className="mt-3">
                  <Link
                    href={`/suburbs/${suburb.slug}/rental-market`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-ink hover:text-primary"
                  >
                    The full {suburb.name} rental market <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </Band>

      {/* The one appraisal form, straight after the prices: the moment a
          reader has a number for the suburb and wants one for their home. */}
      <Band id="appraisal" tone="quiet" spacing="compact" className={SECTION}>
        <div className="mx-auto max-w-3xl">
          <SuburbAppraisalCTA suburbName={suburb.name} suburbSlug={suburb.slug} />
        </div>
      </Band>

      <Band spacing="compact">
        <div className="space-y-14 sm:space-y-20">
          {/* What it's like to live here: the curated description where there
              is one, else the narrative built from the suburb's own data, and
              the lifestyle summary woven from climate, schools and walkability. */}
          <section id="about" className={SECTION}>
            <div className="max-w-3xl">
              <SectionHeading size="md" title={<>What to know about {suburb.name}</>} />
              <div className="mt-6 space-y-4">
                {stubDescription
                  ? intro.map((para, i) => (
                      <p key={i} className="font-sans text-[17px] sm:text-xl text-ink leading-[1.65]">
                        {para}
                      </p>
                    ))
                  : (
                    <p className="font-sans text-[17px] sm:text-xl text-ink leading-[1.65]">
                      {suburb.description}
                    </p>
                  )}
              </div>
              {lifestyleSummary.length > 0 && (
                <div id="lifestyle" className={`mt-12 ${SECTION}`}>
                  <h2 className={H2}>What it&rsquo;s like to live here</h2>
                  <div className="mt-5 space-y-4">
                    {lifestyleSummary.map((para, i) => (
                      <p key={i} className={PROSE}>
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Schools and location: side by side on a wide screen. */}
          <div className="grid lg:grid-cols-12 gap-14 lg:gap-12 border-t border-line pt-12 sm:pt-16">
            {hasSchools && (
              <section id="schools" className={`${SECTION} lg:col-span-7`}>
                <div>
                  <h2 className={H2}>Schools in {suburb.name}</h2>
                  <div className="mt-4">
                    <SuburbSchools suburbName={suburb.name} schools={suburb.schools} />
                  </div>
                  <div className="mt-4">
                    <Link
                      href={`/suburbs/${suburb.slug}/schools`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-ink hover:text-primary"
                    >
                      All {suburb.schools.length} schools, with catchments <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </section>
            )}

            {/* Location: the map loads only when asked for. */}
            <section id="location" className={`${SECTION} ${hasSchools ? "lg:col-span-5" : "lg:col-span-8"}`}>
              <div>
                <h2 className={H2}>Location</h2>
                <div className="mt-5">
                  <SuburbMap name={suburb.name} state={suburb.state} postcode={suburb.postcode} />
                </div>
                {suburb.stats.walkScore !== null && (
                  <div id="walkability" className={`mt-8 ${SECTION}`}>
                    <h3 className="font-display text-xl font-bold text-ink mb-3">Walkability</h3>
                    <SuburbWalkability
                      walkScore={suburb.stats.walkScore}
                      transitScore={suburb.stats.transitScore}
                      bikeScore={suburb.stats.bikeScore}
                    />
                    <DataFreshnessNote
                      label="Walkability"
                      asOf={suburb.dataFreshness?.walkabilityAsOf ?? null}
                      source="OpenStreetMap"
                    />
                  </div>
                )}
                {hasLocationExtras && (
                  <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
                    {suburb.amenities.length > 0 && (
                      <div>
                        <h3 className="font-display text-xl font-bold text-ink mb-3">Amenities</h3>
                        <ul className="flex flex-wrap gap-2">
                          {suburb.amenities.map((a) => (
                            <li key={a} className="rounded-md border border-line px-2.5 py-1 text-sm text-ink-muted">{a}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {suburb.transportLinks.length > 0 && (
                      <div>
                        <h3 className="font-display text-xl font-bold text-ink mb-3">Transport</h3>
                        <ul className="flex flex-wrap gap-2">
                          {suburb.transportLinks.map((t) => (
                            <li key={t} className="rounded-md border border-line px-2.5 py-1 text-sm text-ink-muted">{t}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* The data sections, compact and side by side on a wide screen:
              who lives here, the investment figures, safety, hazard, weather. */}
          <div className="grid lg:grid-cols-2 gap-x-12 gap-y-14 border-t border-line pt-12 sm:pt-16">
            {/* Census data is independent of the sales feed, so always shown. */}
            <section id="demographics" className={SECTION}>
              <h2 className={H2_SMALL}>Demographics</h2>
              {demographicsSummary && (
                <p className="mt-3 font-sans text-[15px] sm:text-base text-ink-muted leading-relaxed">
                  {demographicsSummary}
                </p>
              )}
              <dl className={`mt-4 grid grid-cols-2 ${demographicFigures.length === 4 ? "sm:grid-cols-4" : "sm:grid-cols-3"} border-t border-line`}>
                {demographicFigures.map((f) => (
                  <div key={f.label} className="py-3 pr-3 border-b border-line">
                    <dt className="text-[13px] text-ink-muted">{f.label}</dt>
                    <dd className="mt-1 font-display text-xl font-bold text-ink leading-none">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <DataFreshnessNote
                label="Demographics"
                asOf={suburb.dataFreshness?.censusAsOf ?? null}
                source="ABS 2021 Census"
              />
            </section>

            {(suburb.stats.medianHousePrice > 0 || suburb.stats.medianUnitPrice > 0) && (
              <section id="investment" className={SECTION}>
                <h2 className={H2_SMALL}>Investment overview</h2>
                {investorView && (
                  <p className="mt-3 font-sans text-[15px] sm:text-base text-ink-muted leading-relaxed">
                    {investorView}
                  </p>
                )}
                <div className="mt-4">
                  <SuburbInvestment suburb={suburb} />
                </div>
              </section>
            )}

            {/* Crime: only with actual figures. Empty modules erode trust. */}
            {crimeStat && (
              <section id="crime" className={SECTION}>
                <h2 className={`${H2_SMALL} mb-4`}>Crime and safety</h2>
                <SuburbCrime
                  crimeStat={{
                    totalOffences: crimeStat.totalOffences,
                    offenceBreakdown: crimeStat.offenceBreakdown,
                    period: crimeStat.period,
                    state: crimeStat.state,
                    geoLevel: crimeStat.geoLevel,
                    lgaName: crimeStat.lgaName,
                  }}
                />
                <DataFreshnessNote
                  label="Crime"
                  asOf={suburb.dataFreshness?.crimeAsOf ?? null}
                  source={crimeStat.geoLevel === "lga" ? `${crimeStat.lgaName} (LGA-wide)` : undefined}
                />
              </section>
            )}

            {suburb.hazard && (
              <section id="hazard" className={SECTION}>
                <h2 className={`${H2_SMALL} mb-4`}>Flood and bushfire risk</h2>
                <SuburbHazard
                  floodClass={suburb.hazard.floodClass}
                  bushfireRisk={suburb.hazard.bushfireRisk}
                  floodSource={suburb.hazard.floodSource}
                  bushfireSource={suburb.hazard.bushfireSource}
                />
                <DataFreshnessNote
                  label="Hazard"
                  asOf={suburb.dataFreshness?.hazardAsOf ?? null}
                  source="Geoscience Australia"
                />
              </section>
            )}

            {/* Climate: only when BoM data is attached to the suburb. */}
            {suburb.climate && (
              <section id="climate" className={SECTION}>
                <h2 className={`${H2_SMALL} mb-4`}>Weather year-round</h2>
                <SuburbClimate climate={suburb.climate} withheld={suburb.climateWithheld} suburbName={suburb.name} />
                <DataFreshnessNote
                  label="Climate"
                  asOf={suburb.dataFreshness?.climateAsOf ?? null}
                  source="Bureau of Meteorology"
                />
              </section>
            )}
          </div>
        </div>
      </Band>

      {/* Listings were removed on 14 Oct 2026 ("confident moves"): the site
          is a guide and introduction service, not a portal, and the listing
          rows were legacy demo data. See docs/portal-consolidation-2026-10-14.md. */}

      <Band spacing="compact">
        <div className="space-y-14 sm:space-y-20">
          {/* Long-tail FAQ, answers the "people also ask" queries Google
              surfaces for "[suburb] real estate / suburb / postcode / rent".
              Emits FAQPage JSON-LD so answers can appear directly in SERP. */}
          <SuburbFAQ suburb={suburb} />

          {/* The page's one guide block, where a reader who has read this far
              decides. The buying guide is a link inside it. */}
          <SuburbSellingGuideCTA suburbName={suburb.name} suburbSlug={suburb.slug} />

          {/* Related links: the suburb's pages, its neighbours and the
              comparisons, the state's seller guides, the buyer tools. */}
          <SuburbContextualLinks
            suburb={{
              name: suburb.name,
              slug: suburb.slug,
              state: suburb.state,
              postcode: suburb.postcode,
              nearbySuburbs: suburb.nearbySuburbs,
            }}
            availability={availability}
          />

          {/* Sources and how we are paid */}
          <section className="border-t border-line pt-8 max-w-4xl space-y-3 font-sans text-sm text-ink-muted leading-relaxed">
            <p>
              <span className="font-semibold text-ink">Sources.</span>{" "}
              House and unit medians from the NSW Valuer General, Land Victoria,
              the SA Government and the ABS; rents from the state rental bond
              authorities. Census from the ABS (2021), climate from the Bureau of
              Meteorology, hazard from Geoscience Australia, schools from ACARA
              and crime from state police open data. Each figure carries its
              source and date.{" "}
              <Link href="/methodology" className={TEXT_LINK}>
                How we source data
              </Link>
            </p>
            <p>
              <span className="font-semibold text-ink">How we&rsquo;re paid.</span>{" "}
              The guides and this page are free. When a seller asks, we introduce
              one local agent, and the agent pays us for the introduction; it
              costs the seller nothing. If a figure looks wrong,{" "}
              <Link href="/contact" className={TEXT_LINK}>
                tell us
              </Link>{" "}
              and we&rsquo;ll fix it.
            </p>
          </section>
        </div>
      </Band>
    </>
  );
}

function Figure({ label, value, divided = false }: { label: string; value: string; divided?: boolean }) {
  return (
    <div className={`py-3 ${divided ? "pl-4 border-l border-line" : "pr-4"}`}>
      <dt className="text-[13px] text-ink-muted">{label}</dt>
      <dd className="mt-1 font-display text-2xl font-bold text-ink leading-none">{value}</dd>
    </div>
  );
}
