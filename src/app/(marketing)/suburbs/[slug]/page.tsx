import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Bus, ShoppingBag, BarChart3, TrendingUp } from "lucide-react";
import {
  SuburbHero,
  SuburbStats as SuburbStatsComponent,
  SuburbSnapshot,
  SectionDivider,
  DataFreshnessNote,
  SuburbAlertWidget,
  SuburbFAQ,
} from "@/components/suburb";
import { SuburbAppraisalCTA } from "@/components/suburb/SuburbAppraisalCTA";
import { SuburbSchools } from "@/components/suburb/SuburbSchools";
import { SuburbWalkability } from "@/components/suburb/SuburbWalkability";
import { SuburbHazard } from "@/components/suburb/SuburbHazard";
import { SuburbClimate } from "@/components/suburb/SuburbClimate";
import { SuburbCrime } from "@/components/suburb/SuburbCrime";
import { SuburbInvestment } from "@/components/suburb/SuburbInvestment";
import { SuburbContextualLinks } from "@/components/suburb/SuburbContextualLinks";
import { SuburbPriceTrend } from "@/components/suburb/SuburbPriceTrend";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { ExpertCTA, StickyMatchCTA } from "@/components/journey";
import { BreadcrumbJsonLd, PlaceJsonLd } from "@/components/seo";
import { Badge, Button } from "@/components/ui";
import { getSuburbBySlug } from "@/lib/services/suburb-service";
import { getPropertiesBySuburb } from "@/lib/services/property-service";
import { getSuburbCrimeWithLgaFallback } from "@/lib/services/data-freshness";
import { suburbTitle, suburbDescription } from "@/lib/utils/seo";
import { formatPriceFull, formatPercentage } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";
import { buildSuburbOgImageUrl } from "@/lib/og/helpers";
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
export const revalidate = 86400;
export const dynamicParams = true;
export function generateStaticParams() { return []; }

// A suburb is "thin" when we have neither price data nor population — the
// page is mostly empty modules. We let it remain reachable (direct URL +
// internal links still work) but block search engines from indexing it
// until real data lands, so search quality signals don't degrade.
function isThinSuburb(s: Awaited<ReturnType<typeof getSuburbBySlug>>): boolean {
  if (!s) return false;
  const hasPrices = !!s.stats.medianHousePrice || !!s.stats.medianUnitPrice;
  const hasPopulation = !!s.stats.population;
  return !hasPrices && !hasPopulation;
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

export default async function SuburbDetailPage({ params }: SuburbDetailPageProps) {
  const { slug } = await params;
  const suburb = await getSuburbBySlug(slug);
  if (!suburb) notFound();

  const [properties, crimeStat] = await Promise.all([
    getPropertiesBySuburb(slug, 6),
    getSuburbCrimeWithLgaFallback(slug, suburb.state, suburb.region),
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
  // Drives the main price card display and the unit-price callout.
  const priceTrusted = hasReliablePrice(suburb);

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

      <SuburbHero suburb={suburb} />

      {/* Magazine-style snapshot band, sits below the satellite hero */}
      <SuburbSnapshot suburb={suburb} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">

        {/* About, editorial lead with decorative contour.
            Renders curated description if present; otherwise a multi-
            paragraph algorithmic narrative built from the suburb's real
            data (median, growth, demographics, walkability, climate). */}
        <section id="about" className="scroll-mt-16 relative">
          <Image
            src="/images/illustrations/contour.svg"
            alt=""
            width={1200}
            height={800}
            aria-hidden="true"
            className="absolute -right-32 -top-16 w-[800px] max-w-none opacity-[0.08] pointer-events-none select-none -z-10"
          />
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-3">
              <p className="font-display italic text-primary text-base mb-3 leading-none">
                The brief
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight">
                What to know about <span className="italic text-primary">{suburb.name}</span>.
              </h2>
            </div>
            <div className="lg:col-span-8 lg:col-start-5 space-y-5">
              {stubDescription
                ? intro.map((para, i) => (
                    <p key={i} className="font-sans text-lg sm:text-xl text-ink leading-[1.65] max-w-[65ch]">
                      {para}
                    </p>
                  ))
                : (
                  <p className="font-sans text-lg sm:text-xl text-ink leading-[1.65] max-w-[65ch]">
                    {suburb.description}
                  </p>
                )}
            </div>
          </div>
        </section>

        {/* Compare widget, refreshed visual */}
        {suburb.nearbySuburbs.length > 0 && (
          <section className="rounded-2xl border border-line bg-surface-raised shadow-card overflow-hidden">
            <div className="grid lg:grid-cols-12 gap-0 items-stretch">
              <div className="lg:col-span-4 bg-surface-warm border-b lg:border-b-0 lg:border-r border-line-warm p-6 sm:p-8 flex flex-col justify-center">
                <p className="text-xs font-sans uppercase tracking-[0.2em] text-cta mb-2">
                  Side by side
                </p>
                <h3 className="font-display text-2xl text-ink leading-tight">
                  Compare {suburb.name} with a nearby suburb.
                </h3>
                <p className="font-sans text-sm text-ink-muted leading-relaxed mt-3">
                  Median, growth, schools, walkability, all in one view.
                </p>
              </div>
              <div className="lg:col-span-8 p-6 sm:p-8">
                <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-4">
                  Nearby suburbs
                </p>
                <div className="flex flex-wrap gap-2">
                  {suburb.nearbySuburbs.slice(0, 8).map((s) => {
                    const label = s
                      .split("-")
                      .slice(0, -2)
                      .join(" ")
                      .replace(/\b\w/g, (c) => c.toUpperCase());
                    return (
                      <Link
                        key={s}
                        href={`/suburbs/${suburb.slug}/vs/${s}`}
                        className="group inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-surface-raised px-4 py-2 text-sm font-medium text-ink hover:bg-surface-warm hover:border-ink transition-colors"
                      >
                        {label}
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Market, asymmetric lead-stat + supporting grid */}
        <section id="market" className="scroll-mt-16">
          {marketSummary && (
            <p className="font-sans text-base sm:text-lg text-ink-muted leading-[1.7] max-w-3xl mb-8">
              {marketSummary}
            </p>
          )}
          {(buyerView || sellerView) && (
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {buyerView && (
                <div className="rounded-xl border border-line bg-surface-raised p-5">
                  <p className="text-[11px] font-sans uppercase tracking-[0.22em] text-cta mb-2">For buyers</p>
                  <p className="font-sans text-sm text-ink leading-relaxed">{buyerView}</p>
                </div>
              )}
              {sellerView && (
                <div className="rounded-xl border border-line bg-surface-raised p-5">
                  <p className="text-[11px] font-sans uppercase tracking-[0.22em] text-cta mb-2">For sellers</p>
                  <p className="font-sans text-sm text-ink leading-relaxed">{sellerView}</p>
                </div>
              )}
            </div>
          )}
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Lead stat */}
            <div className="lg:col-span-5">
              <p className="font-display italic text-primary text-base mb-3 leading-none">
                Market
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-6">
                The price of a home here.
              </h2>
              <div className="rounded-2xl border border-line-warm bg-surface-warm p-6 sm:p-8">
                {priceTrusted ? (
                  <>
                    <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-3 inline-flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-cta" /> Median house price
                    </p>
                    <p className="font-display text-5xl sm:text-6xl text-ink leading-none tracking-tight">
                      {formatPriceFull(suburb.stats.medianHousePrice)}
                    </p>
                  </>
                ) : (
                  // Unreliable source (currently QLD/WA census-mortgage
                  // proxy). Don't publish the back-calculated fiction
                  // as a "median". Show an honest pending state with a
                  // link to the methodology page.
                  <>
                    <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-3 inline-flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-cta" /> Median house price
                    </p>
                    <p className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight">
                      {PENDING_PRICE_LABEL}
                    </p>
                    <p className="font-sans text-sm text-ink-muted mt-3 leading-relaxed">
                      {PENDING_PRICE_NOTE}{" "}
                      <Link
                        href="/methodology"
                        className="text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
                      >
                        How we source data
                      </Link>
                      .
                    </p>
                  </>
                )}
                {priceTrusted && suburb.stats.annualGrowthHouse !== null && suburb.stats.annualGrowthHouse !== undefined && (
                  <p className="font-sans text-base text-ink-muted mt-4 leading-relaxed">
                    <span className={`font-medium ${suburb.stats.annualGrowthHouse >= 0 ? "text-success" : "text-danger"}`}>
                      {formatPercentage(suburb.stats.annualGrowthHouse)}
                    </span>{" "}
                    over the past year. Median unit price{" "}
                    <span className="font-medium text-ink">
                      {suburb.stats.medianUnitPrice ? formatPriceFull(suburb.stats.medianUnitPrice) : "n/a"}
                    </span>.
                  </p>
                )}
                <DataFreshnessNote
                  label="Sales"
                  asOf={suburb.dataFreshness?.salesAsOf ?? null}
                  source={suburb.dataFreshness?.salesSource ?? undefined}
                />
              </div>
            </div>

            {/* Supporting grid */}
            <div className="lg:col-span-7">
              <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-4">
                Rental and ownership
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <MetricCard label="Weekly rent (house)" value={suburb.stats.medianRentHouse ? `$${suburb.stats.medianRentHouse}/wk` : "–"} />
                <MetricCard label="Weekly rent (unit)"  value={suburb.stats.medianRentUnit  ? `$${suburb.stats.medianRentUnit}/wk`  : "–"} />
                <MetricCard label="Owner occupied"      value={suburb.stats.ownerOccupied   ? `${suburb.stats.ownerOccupied}%`     : "–"} />
                <MetricCard label="Renter occupied"     value={suburb.stats.renterOccupied  ? `${suburb.stats.renterOccupied}%`    : "–"} />
              </div>
              <div className="rounded-2xl border border-line bg-surface-raised p-5 sm:p-6">
                <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-3">
                  At a deeper level
                </p>
                <SuburbStatsComponent suburb={suburb} />
              </div>
              <DataFreshnessNote
                label="Rental"
                asOf={suburb.dataFreshness?.rentalAsOf ?? null}
                source={suburb.dataFreshness?.rentalSource ?? undefined}
              />
              <div className="mt-3">
                <Link
                  href={`/suburbs/${suburb.slug}/rental-market`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-ink hover:text-primary"
                >
                  Open the full rental market view <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* High-intent seller capture. Primary conversion CTA on the suburb
            page, lead-magnet for the appraisal flow. */}
        <section>
          <SuburbAppraisalCTA suburbName={suburb.name} suburbSlug={suburb.slug} />
        </section>

        {/* Secondary capture for visitors who aren't selling. Smaller
            footprint, lower visual weight. */}
        <section className="relative rounded-2xl border border-line-warm bg-surface-warm overflow-hidden">
          <div className="relative px-6 sm:px-8 py-6 sm:py-7">
            <SuburbAlertWidget suburbName={suburb.name} suburbSlug={suburb.slug} />
          </div>
        </section>

        {/* Investment Overview */}
        {(suburb.stats.medianHousePrice > 0 || suburb.stats.medianUnitPrice > 0) && (
          <section id="investment" className="scroll-mt-16">
            <p className="font-display italic text-primary text-base mb-3 leading-none">
              For investors
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-6">
              Investment overview.
            </h2>
            {investorView && (
              <p className="font-sans text-base sm:text-lg text-ink-muted leading-[1.7] max-w-3xl mb-8">
                {investorView}
              </p>
            )}
            <div className="grid lg:grid-cols-12 gap-6 mb-6">
              <div className="lg:col-span-7">
                <SuburbInvestment suburb={suburb} />
              </div>
              {suburb.stats.medianHousePrice > 0 &&
                suburb.stats.annualGrowthHouse !== 0 && (
                  <div className="lg:col-span-5">
                    <SuburbPriceTrend
                      medianHousePrice={suburb.stats.medianHousePrice}
                      annualGrowthHouse={suburb.stats.annualGrowthHouse}
                      suburbName={suburb.name}
                    />
                  </div>
                )}
            </div>
          </section>
        )}

        {/* Demographics */}
        <section id="demographics" className="scroll-mt-16">
          <p className="font-display italic text-primary text-base mb-3 leading-none">
            Who lives here
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-6">
            Demographics.
          </h2>
          {demographicsSummary && (
            <p className="font-sans text-base sm:text-lg text-ink-muted leading-[1.7] max-w-3xl mb-8">
              {demographicsSummary}
            </p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <MetricCard label="Population"          value={suburb.stats.population        ? suburb.stats.population.toLocaleString()      : "–"} />
            <MetricCard label="Median age"          value={suburb.stats.medianAge          ? String(suburb.stats.medianAge)                : "–"} />
            <MetricCard label="Family households"   value={suburb.stats.householdsFamily   ? `${suburb.stats.householdsFamily}%`           : "–"} />
            <MetricCard label="Lone person"         value={suburb.stats.householdsLonePerson ? `${suburb.stats.householdsLonePerson}%`     : "–"} />
          </div>
          <DataFreshnessNote
            label="Demographics"
            asOf={suburb.dataFreshness?.censusAsOf ?? null}
            source="ABS 2021 Census"
          />
        </section>

        {/* What it's like to live here — lifestyle narrative woven from
            walkability + climate + schools. Only renders when we have
            at least one of those data points (otherwise we'd be writing
            air). */}
        {lifestyleSummary.length > 0 && (
          <section id="lifestyle" className="scroll-mt-16">
            <p className="font-display italic text-primary text-base mb-3 leading-none">
              Day to day
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-6">
              What it&rsquo;s like to live here.
            </h2>
            <div className="space-y-5 max-w-3xl">
              {lifestyleSummary.map((para, i) => (
                <p key={i} className="font-sans text-base sm:text-lg text-ink-muted leading-[1.7]">
                  {para}
                </p>
              ))}
            </div>
          </section>
        )}

        <SectionDivider />

        {/* Crime — only renders when we have actual crime stats. Empty
            modules erode trust, so we omit rather than show "data not
            available". */}
        {crimeStat && (
          <section id="crime" className="scroll-mt-16">
            <p className="font-display italic text-primary text-base mb-3 leading-none">
              Safety
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-6">
              Crime and safety.
            </h2>
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
              source={crimeStat.geoLevel === "lga"
                ? `State Police Open Data, ${crimeStat.lgaName} (LGA-wide)`
                : "State Police Open Data"}
            />
          </section>
        )}

        {/* Walkability */}
        {suburb.stats.walkScore !== null && (
          <section id="walkability" className="scroll-mt-16">
            <p className="font-display italic text-primary text-base mb-3 leading-none">
              Getting around
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-6">
              Walkability.
            </h2>
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
          </section>
        )}

        {/* Hazard */}
        {suburb.hazard && (
          <section id="hazard" className="scroll-mt-16">
            <p className="font-display italic text-primary text-base mb-3 leading-none">
              Risk
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-6">
              Flood and bushfire risk.
            </h2>
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

        <SectionDivider />

        {/* Location */}
        <section id="location" className="scroll-mt-16">
          <p className="font-display italic text-primary text-base mb-3 leading-none">
            Place
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-6">
            Location.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            <div className="rounded-2xl border border-line bg-surface-raised p-6">
              <h3 className="font-display text-xl text-ink mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-cta" /> Amenities
              </h3>
              <div className="flex flex-wrap gap-2">
                {suburb.amenities.map((a) => (
                  <Badge key={a} variant="outline">{a}</Badge>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-line bg-surface-raised p-6">
              <h3 className="font-display text-xl text-ink mb-4 flex items-center gap-2">
                <Bus className="w-5 h-5 text-cta" /> Transport
              </h3>
              <div className="flex flex-wrap gap-2">
                {suburb.transportLinks.map((t) => (
                  <Badge key={t} variant="outline">{t}</Badge>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-display text-xl text-ink mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cta" /> Nearby suburbs
            </h3>
            <div className="flex flex-wrap gap-2">
              {suburb.nearbySuburbs.map((s) => (
                <Link key={s} href={`/suburbs/${s}`}>
                  <Badge variant="outline" className="cursor-pointer hover:border-ink hover:text-ink">
                    <MapPin className="w-3 h-3 mr-1" />
                    {s.split("-").slice(0, -2).join(" ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Schools */}
        <section id="schools" className="scroll-mt-16">
          <p className="font-display italic text-primary text-base mb-3 leading-none">
            Education
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-6">
            Schools in {suburb.name}.
          </h2>
          <SuburbSchools suburbName={suburb.name} schools={suburb.schools} />
          {suburb.schools.length > 0 && (
            <div className="mt-3">
              <Link
                href={`/suburbs/${suburb.slug}/schools`}
                className="inline-flex items-center gap-1 text-sm font-medium text-ink hover:text-primary"
              >
                View all {suburb.schools.length} schools <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
          <DataFreshnessNote label="School" asOf={null} source="ACARA" />
        </section>

        {/* Climate — only renders when BoM data is attached to the suburb. */}
        {suburb.climate && (
          <section id="climate" className="scroll-mt-16">
            <p className="font-display italic text-primary text-base mb-3 leading-none">
              Climate
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-6">
              Weather year-round.
            </h2>
            <SuburbClimate climate={suburb.climate} />
            <DataFreshnessNote
              label="Climate"
              asOf={suburb.dataFreshness?.climateAsOf ?? null}
              source="Bureau of Meteorology"
            />
          </section>
        )}

        {/* Properties */}
        {properties.length > 0 && (
          <section className="scroll-mt-16">
            <div className="grid lg:grid-cols-12 gap-6 mb-8 items-end">
              <div className="lg:col-span-7">
                <p className="font-display italic text-primary text-base mb-3 leading-none">
                  Listings
                </p>
                <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight">
                  Properties in {suburb.name}.
                </h2>
              </div>
              <div className="lg:col-span-5 flex flex-wrap gap-2 lg:justify-end">
                <Link href={`/suburbs/${suburb.slug}/buy`}>
                  <Button variant="outline" size="sm">For sale <ArrowRight className="w-4 h-4" /></Button>
                </Link>
                <Link href={`/suburbs/${suburb.slug}/rent`}>
                  <Button variant="outline" size="sm">For rent <ArrowRight className="w-4 h-4" /></Button>
                </Link>
                <Link href={`/suburbs/${suburb.slug}/houses`}>
                  <Button variant="outline" size="sm">Houses</Button>
                </Link>
                <Link href={`/suburbs/${suburb.slug}/units`}>
                  <Button variant="outline" size="sm">Units</Button>
                </Link>
                <Link href={`/suburbs/${suburb.slug}/townhouses`}>
                  <Button variant="outline" size="sm">Townhouses</Button>
                </Link>
              </div>
            </div>
            <PropertyGrid properties={properties} />
          </section>
        )}

        {/* Long-tail FAQ, answers the "people also ask" queries Google
            surfaces for "[suburb] real estate / suburb / postcode / rent".
            Emits FAQPage JSON-LD so answers can appear directly in SERP. */}
        <SuburbFAQ suburb={suburb} />

        {/* Contextual cross-links: listings, suburb info, guides, nearby */}
        <SuburbContextualLinks
          suburb={{
            name: suburb.name,
            slug: suburb.slug,
            state: suburb.state,
            nearbySuburbs: suburb.nearbySuburbs,
          }}
        />

        {/* Editorial integrity / sources note */}
        <section className="border-t border-line pt-8">
          <div className="grid lg:grid-cols-3 gap-6 font-sans text-sm">
            <div>
              <p className="font-medium text-ink mb-2 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cta" /> Sources cited
              </p>
              <p className="text-ink-muted leading-relaxed">
                Median, growth and rental data from state revenue offices and ABS.
                Census from ABS 2021. Climate from BoM. Hazard from Geoscience Australia.
                School data from ACARA. Crime from state police open data.{" "}
                <Link
                  href="/methodology"
                  className="text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
                >
                  Full methodology →
                </Link>
              </p>
            </div>
            <div>
              <p className="font-medium text-ink mb-2">Always dated</p>
              <p className="text-ink-muted leading-relaxed">
                Every figure on this page carries its source and as-of date in a
                tooltip. If a figure looks off to you, tell us and we&rsquo;ll fix
                it within a week.
              </p>
            </div>
            <div>
              <p className="font-medium text-ink mb-2">No login</p>
              <p className="text-ink-muted leading-relaxed">
                No paywall, no sign-up, no download form. The suburb data is the
                product. We earn from partner brokers and agents on the rare
                occasion you ask for one.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Soft expert CTA at the very bottom. Deep-links to /find-an-expert
          with the suburb pre-filled so visitors land directly in the lead
          engine on a contextually-relevant page (not the homepage anchor). */}
      <ExpertCTA
        headline={`Want a real human to help with ${suburb.name}?`}
        body="If you&rsquo;ve looked at the numbers and want someone to talk it through, whether that&rsquo;s an agent, broker, accountant or conveyancer, we&rsquo;ll find the right person for your situation. Free, no commitment."
        ctaLabel="Get connected"
        href={`/find-an-expert?suburb=${slug}`}
      />

      {/* Floating "Get connected" pill, slides up once the user scrolls
          past 30% of the page. Pre-fills the suburb on click. Dismissible
          per session. Sits above the mobile bottom nav. */}
      <StickyMatchCTA
        suburb={slug}
        label={`${suburb.name}, get connected`}
        dismissKey={`suburb:${slug}`}
      />
    </>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface-raised p-4 shadow-card">
      <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-1">{label}</p>
      <p className="font-display text-2xl text-ink leading-none">{value}</p>
    </div>
  );
}

