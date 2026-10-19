import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Home, TrendingUp, GraduationCap, Building2 } from "lucide-react";
import { GuidePairCTA } from "@/components/journey";
import { BreadcrumbJsonLd, PlaceJsonLd, ItemListJsonLd } from "@/components/seo";
import {
  getStateStats,
  getStateRegions,
  getTopSuburbsByState,
  getStateName,
} from "@/lib/services/suburb-rankings-service";
import { priceSourceLine } from "@/lib/ranking-notes";
import { formatPrice, formatPriceFull, formatPercentage } from "@/lib/utils/format";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { MostSearchedSuburbs } from "@/components/suburb/MostSearchedSuburbs";
import { topSuburbsForState } from "@/lib/data/top-suburbs";
import { BUTTON_SECONDARY, Band, HeroLead, HeroTitle, PhotoHero, SectionHeading } from "@/components/premium";

const VALID_STATES = ["qld", "nsw", "vic", "wa", "sa", "tas", "nt", "act"];

interface StatePageProps {
  params: Promise<{ state: string }>;
}

export const revalidate = 86400; // cache as ISR for 24h, regen on demand

export async function generateStaticParams() {
  // Skip prerender at build time, page body queries the DB. Pages render
  // on-demand at runtime once params are seen.
  if (process.env.NEXT_PHASE === "phase-production-build") return [];
  return VALID_STATES.map((state) => ({ state }));
}

export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
  const { state } = await params;
  if (!VALID_STATES.includes(state.toLowerCase())) return { title: "Not Found" };

  const stateName = getStateName(state.toUpperCase());
  const title = `${stateName} Property Market | Suburbs, Schools & Data`;
  const description = `Explore the ${stateName} property market. Browse suburb profiles, median house prices, school data, and local insights across ${stateName}.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/states/${state.toLowerCase()}` },
    openGraph: { ...DEFAULT_OG,
      url: `${SITE_URL}/states/${state.toLowerCase()}`,
      // og titles don't get the root title.template — brand them explicitly.
      title: `${title} | ${SITE_NAME}`,
      description,
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function StatePage({ params }: StatePageProps) {
  const { state: stateParam } = await params;
  const stateSlug = stateParam.toLowerCase();

  if (!VALID_STATES.includes(stateSlug)) {
    notFound();
  }

  const upperState = stateSlug.toUpperCase();
  const stateName = getStateName(upperState);

  const [stats, regions, topSuburbs] = await Promise.all([
    getStateStats(upperState),
    getStateRegions(upperState),
    getTopSuburbsByState(upperState, 12),
  ]);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "States", url: "/states" },
          { name: stateName, url: `/states/${stateSlug}` },
        ]}
      />
      <PlaceJsonLd
        name={stateName}
        url={"/states/" + stateSlug}
        addressRegion={upperState}
      />
      <ItemListJsonLd
        name={"Top suburbs in " + stateName}
        url={"/states/" + stateSlug}
        items={topSuburbs.slice(0, 10).map((s) => ({ name: s.name, url: "/suburbs/" + s.slug }))}
      />

      {/* Hero: masthead, H1 and standfirst. The stats row follows directly
          under it on a light band, where a falling growth figure can keep
          its danger red. */}
      <PhotoHero
        photo="street"
        breadcrumbs={[
          { label: "States", href: "/states" },
          { label: stateName },
        ]}
      >
        {/* Masthead */}
        <div className="flex items-center gap-4 mb-5">
          <span className="text-sm font-semibold text-ink-muted leading-none">
            State profile
          </span>
          <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
          <span className="text-sm text-ink-muted leading-none">
            Australia&rsquo;s property reference
          </span>
        </div>

        <HeroTitle>
          {stateName}{" "}
          <span>property</span>,
          mapped
        </HeroTitle>
        <HeroLead>
          Suburb profiles, school data, and property market insights across{" "}
          {stateName}. Free, ungated, sourced and dated.
        </HeroLead>
      </PhotoHero>

      {/* Hairline-divided stats row */}
      <Band spacing="compact">
        <div className="border-y border-line grid grid-cols-2 sm:grid-cols-3">
          <div className="py-6 sm:py-7 pr-4 sm:pr-6">
            <p className="text-4xl sm:text-5xl font-bold text-ink leading-none mb-3 tracking-[-0.03em]">
              {stats.suburbCount.toLocaleString()}
            </p>
            <p className="text-sm text-ink-subtle font-medium inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              Suburbs covered
            </p>
          </div>
          {stats.avgMedianHousePrice && (
            <div className="py-6 sm:py-7 px-4 sm:px-6 border-l border-line">
              <p className="text-4xl sm:text-5xl font-bold text-ink leading-none mb-3 tracking-[-0.03em]">
                {formatPriceFull(stats.avgMedianHousePrice)}
              </p>
              <p className="text-sm text-ink-subtle font-medium inline-flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5" aria-hidden="true" />
                Avg median house
              </p>
            </div>
          )}
          {stats.avgAnnualGrowth != null && (
            <div className="py-6 sm:py-7 px-4 sm:px-6 border-l border-line border-t sm:border-t-0">
              <p
                className={`text-4xl sm:text-5xl font-bold leading-none mb-3 tracking-[-0.03em] ${
                  stats.avgAnnualGrowth >= 0 ? "text-ink" : "text-danger"
                }`}
              >
                {stats.avgAnnualGrowth >= 0 ? "+" : ""}
                {stats.avgAnnualGrowth}%
              </p>
              <p className="text-sm text-ink-subtle font-medium inline-flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                Avg annual growth
              </p>
            </div>
          )}
        </div>
        <p className="mt-6 max-w-3xl text-sm text-ink-subtle leading-relaxed">
          {stats.avgMedianHousePrice
            ? `The average is of the ${stats.pricedSuburbCount.toLocaleString("en-AU")} suburb medians we publish for ${stateName}. `
            : ""}
          {priceSourceLine(upperState)}
        </p>
      </Band>

      <Band tone="quiet" spacing="compact">
        <div className="space-y-14">
          {/* Most searched suburbs (fix item 5): the pages that carry the
              impressions, two clicks from the root so they are recrawled first. */}
          <MostSearchedSuburbs label={stateName} suburbs={topSuburbsForState(upperState, 24)} tone="ink" />

          {/* Top Regions */}
          {regions.length > 0 && (
            <section>
              <SectionHeading size="md" title={<>Regions in {stateName}</>} />
              <p className="mt-3 text-sm text-ink-muted mb-8">
                Explore property data across {regions.length} regions in {stateName}.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {regions.map((region) => (
                  <Link
                    key={region.slug}
                    href={`/regions/${region.slug}`}
                    className="group rounded-xl border border-line bg-surface-raised p-4 hover:border-ink transition-colors"
                  >
                    <h3 className="font-semibold text-ink group-hover:text-primary transition-colors text-sm leading-tight">
                      {region.region}
                    </h3>
                    <p className="text-xs text-ink-subtle mt-1">
                      {region.suburbCount} suburb{region.suburbCount !== 1 ? "s" : ""}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Top Suburbs by population */}
          {topSuburbs.length > 0 && (
            <section>
              <SectionHeading size="md" title={<>Top Suburbs in {stateName}</>} />
              <p className="mt-3 text-sm text-ink-muted mb-8">
                The largest suburbs by population across {stateName}.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topSuburbs.map((suburb) => (
                  <Link
                    key={suburb.slug}
                    href={`/suburbs/${suburb.slug}`}
                    className="group rounded-xl border border-line bg-surface-raised p-5 hover:border-ink transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-ink group-hover:text-primary transition-colors">
                          {suburb.name}
                        </h3>
                        <p className="text-xs text-ink-subtle mt-0.5">
                          {suburb.state} {suburb.postcode}
                        </p>
                      </div>
                      {suburb.annualGrowthHouse !== 0 && (
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-md ${
                            suburb.annualGrowthHouse >= 0
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {suburb.annualGrowthHouse >= 0 ? "+" : ""}
                          {suburb.annualGrowthHouse.toFixed(1)}%
                        </span>
                      )}
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                      <div>
                        <p className="text-xs text-ink-subtle">Median house</p>
                        <p className="text-sm font-bold text-ink">
                          {suburb.medianHousePrice > 0 ? formatPrice(suburb.medianHousePrice) : "–"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-ink-subtle">Population</p>
                        <p className="text-sm font-bold text-ink">
                          {suburb.population > 0 ? suburb.population.toLocaleString() : "–"}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </Band>

      {/* CTAs */}
      <Band tone="dark" spacing="compact">
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12">
          {/* Buy CTA: the buyer hub. The listings it once linked (/buy) were
              retired on 14 Oct 2026 (docs/portal-consolidation-2026-10-14.md). */}
          <div className="border-t-2 border-ink pt-6 flex flex-col gap-3">
            <Building2 className="w-7 h-7 text-primary mb-2" strokeWidth={1.75} aria-hidden="true" />
            <h2 className="text-2xl sm:text-3xl leading-tight tracking-[-0.02em] text-ink">
              Buying in {stateName}
            </h2>
            <p className="text-base text-ink-muted leading-relaxed">
              Budget, schemes, inspections and offers, step by step.
            </p>
            <Link
              href="/buying"
              className={`mt-auto w-fit ${BUTTON_SECONDARY}`}
            >
              Buying: where to start →
            </Link>
          </div>

          {/* Schools CTA */}
          <div className="border-t-2 border-ink pt-6 flex flex-col gap-3">
            <GraduationCap className="w-7 h-7 text-primary mb-2" strokeWidth={1.75} aria-hidden="true" />
            <h2 className="text-2xl sm:text-3xl leading-tight tracking-[-0.02em] text-ink">
              Schools in {stateName}
            </h2>
            <p className="text-base text-ink-muted leading-relaxed">
              Find and compare schools across {stateName} using ICSEA data.
            </p>
            <Link
              href={`/schools?state=${upperState}`}
              className={`mt-auto w-fit ${BUTTON_SECONDARY}`}
            >
              Find Schools in {upperState} →
            </Link>
          </div>
        </section>
      </Band>

      <Band spacing="compact">
        <div className="space-y-14">
          {/* Best suburbs cross-link */}
          <section>
            <SectionHeading size="md" title={<>Ranked Suburb Lists for {stateName}</>} />
            <p className="mt-3 text-sm text-ink-muted mb-6">
              Suburb rankings filtered to {stateName}.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Best for Families", slug: "for-families" },
                { label: "Highest Growth", slug: "highest-growth" },
                { label: "Most Affordable", slug: "most-affordable" },
                { label: "Most Walkable", slug: "most-walkable" },
                { label: "Lowest Flood Risk", slug: "lowest-flood-risk" },
                { label: "Best Rental Yield", slug: "best-rental-yield" },
              ].map(({ label, slug }) => (
                <Link
                  key={slug}
                  href={`/best-suburbs/${slug}?state=${upperState}`}
                  className="inline-flex items-center rounded-lg border border-line bg-surface-raised px-3 py-1.5 text-sm font-medium text-ink hover:border-ink transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </section>

          {/* Buyer / seller funnel entry. A whole state is too broad for a
              suburb deep-link, so no suburbSlug: the guides open with the
              suburb step unanswered. */}
          <GuidePairCTA placeName={stateName} />
        </div>
      </Band>
    </>
  );
}
