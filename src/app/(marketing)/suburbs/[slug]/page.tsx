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
} from "@/components/suburb";
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
import { db } from "@/lib/db";
import { streetSlug } from "@/lib/utils/slug";
import { suburbTitle, suburbDescription } from "@/lib/utils/seo";
import { formatPriceFull, formatPercentage } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";
import { buildSuburbOgImageUrl } from "@/lib/og/helpers";

interface SuburbDetailPageProps {
  params: Promise<{ slug: string }>;
}

// ISR — suburb profiles aggregate several services (suburb + properties +
// crime + climate + walkability). Was rendering full SSR per request,
// burning function-GB-hours under crawl traffic. Suburb data only changes
// when the sync worker refreshes (monthly-ish), so 24h revalidate is
// extremely generous and still cuts function compute by ~99%.
// See /property/[slug]/page.tsx for why generateStaticParams returning []
// is required to actually enable ISR on Next 16 dynamic routes.
export const revalidate = 86400;
export const dynamicParams = true;
export function generateStaticParams() { return []; }

export async function generateMetadata({ params }: SuburbDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const suburb = await getSuburbBySlug(slug);
  if (!suburb) return { title: "Suburb Not Found" };
  return {
    title: suburbTitle(suburb),
    description: suburbDescription(suburb),
    alternates: { canonical: `${SITE_URL}/suburbs/${slug}` },
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

  const [properties, crimeStat, streets] = await Promise.all([
    getPropertiesBySuburb(slug, 6),
    getSuburbCrimeWithLgaFallback(slug, suburb.state, suburb.region),
    db.propertyAddress.groupBy({
      by: ["streetName", "streetType", "streetSuffix"],
      where: { suburbSlug: slug },
      _count: { id: true },
      orderBy: { streetName: "asc" },
    }),
  ]);

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

        {/* About — editorial lead with decorative contour */}
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
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
                About
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight">
                Welcome to <span className="italic text-primary">{suburb.name}</span>.
              </h2>
            </div>
            <div className="lg:col-span-8 lg:col-start-5">
              <p className="font-sans text-lg sm:text-xl text-ink leading-[1.65] max-w-[60ch]">
                {suburb.description}
              </p>
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

        {/* Market — asymmetric lead-stat + supporting grid */}
        <section id="market" className="scroll-mt-16">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Lead stat */}
            <div className="lg:col-span-5">
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
                Market
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-6">
                The price of a home here.
              </h2>
              <div className="rounded-2xl border border-line-warm bg-surface-warm p-6 sm:p-8">
                <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-3 inline-flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-cta" /> Median house price
                </p>
                <p className="font-display text-5xl sm:text-6xl text-ink leading-none tracking-tight">
                  {suburb.stats.medianHousePrice
                    ? formatPriceFull(suburb.stats.medianHousePrice)
                    : "Pending"}
                </p>
                {suburb.stats.annualGrowthHouse !== null && suburb.stats.annualGrowthHouse !== undefined && (
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

        {/* Suburb alerts band, decorative warm tile */}
        <section className="relative rounded-2xl border border-line-warm bg-surface-warm overflow-hidden">
          <Image
            src="/images/illustrations/contour.svg"
            alt=""
            width={1200}
            height={800}
            aria-hidden="true"
            className="absolute -right-32 -top-32 w-[900px] max-w-none opacity-[0.10] pointer-events-none select-none"
          />
          <div className="relative px-6 sm:px-8 py-8 sm:py-10">
            <SuburbAlertWidget suburbName={suburb.name} suburbSlug={suburb.slug} />
          </div>
        </section>

        {/* Investment Overview */}
        {(suburb.stats.medianHousePrice > 0 || suburb.stats.medianUnitPrice > 0) && (
          <section id="investment" className="scroll-mt-16">
            <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
              For investors
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-6">
              Investment overview.
            </h2>
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
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
            Who lives here
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-6">
            Demographics.
          </h2>
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

        <SectionDivider />

        {/* Crime */}
        <section id="crime" className="scroll-mt-16">
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
            Safety
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-6">
            Crime and safety.
          </h2>
          <SuburbCrime
            crimeStat={
              crimeStat
                ? {
                    totalOffences: crimeStat.totalOffences,
                    offenceBreakdown: crimeStat.offenceBreakdown,
                    period: crimeStat.period,
                    state: crimeStat.state,
                    geoLevel: crimeStat.geoLevel,
                    lgaName: crimeStat.lgaName,
                  }
                : null
            }
          />
          <DataFreshnessNote
            label="Crime"
            asOf={suburb.dataFreshness?.crimeAsOf ?? null}
            source={crimeStat?.geoLevel === "lga"
              ? `State Police Open Data — ${crimeStat.lgaName} (LGA-wide)`
              : "State Police Open Data"}
          />
        </section>

        {/* Walkability */}
        {suburb.stats.walkScore !== null && (
          <section id="walkability" className="scroll-mt-16">
            <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
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
            <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
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
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
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
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
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

        {/* Climate */}
        <section id="climate" className="scroll-mt-16">
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
            Climate
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-6">
            Weather year-round.
          </h2>
          <SuburbClimate climate={suburb.climate ?? null} />
          <DataFreshnessNote
            label="Climate"
            asOf={suburb.dataFreshness?.climateAsOf ?? null}
            source="Bureau of Meteorology"
          />
        </section>

        {/* Streets, with alphabet jump-bar */}
        {streets.length > 0 && (
          <section id="streets" className="scroll-mt-16">
            <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
              Browse
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-6">
              Streets in {suburb.name}.
            </h2>
            <StreetsList suburbSlug={suburb.slug} streets={streets} />
          </section>
        )}

        {/* Properties */}
        {properties.length > 0 && (
          <section className="scroll-mt-16">
            <div className="grid lg:grid-cols-12 gap-6 mb-8 items-end">
              <div className="lg:col-span-7">
                <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
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

      {/* Soft expert CTA at the very bottom — deep-links to homepage #match
          with the suburb pre-filled, so visitors land directly in the lead
          engine with one less click. */}
      <ExpertCTA
        headline={`Want a real human to help with ${suburb.name}?`}
        body="If you&rsquo;ve looked at the numbers and want someone to talk it through &mdash; an agent, broker, accountant, conveyancer, whoever fits your situation &mdash; we&rsquo;ll find the right person. Free, no commitment."
        ctaLabel="Get connected"
        href={`/?suburb=${slug}#match`}
      />

      {/* Floating "Get connected" pill — slides up once the user scrolls
          past 30% of the page. Pre-fills the suburb on click. Dismissible
          per session. Sits above the mobile bottom nav. */}
      <StickyMatchCTA
        suburb={slug}
        label={`${suburb.name} — get connected`}
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

interface StreetGroup {
  streetName: string;
  streetType: string | null;
  streetSuffix: string | null;
}

function StreetsList({ suburbSlug, streets }: { suburbSlug: string; streets: StreetGroup[] }) {
  // Group streets alphabetically by first letter so users can scan
  const grouped = new Map<string, { name: string; sSlug: string }[]>();
  for (const s of streets) {
    const display = [s.streetName, s.streetType, s.streetSuffix]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const letter = (s.streetName?.[0] ?? "#").toUpperCase();
    const sSlug = streetSlug(s.streetName, s.streetType, s.streetSuffix);
    const arr = grouped.get(letter) ?? [];
    arr.push({ name: display, sSlug });
    grouped.set(letter, arr);
  }
  const letters = Array.from(grouped.keys()).sort();

  return (
    <>
      {/* Alphabet jump bar */}
      <div className="flex flex-wrap items-center gap-1 mb-6 pb-4 border-b border-line">
        <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mr-3">
          Jump to
        </p>
        {letters.map((l) => (
          <a
            key={l}
            href={`#streets-${l}`}
            className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-display text-ink hover:bg-surface-warm hover:text-primary transition-colors"
          >
            {l}
          </a>
        ))}
      </div>
      <div className="space-y-6">
        {letters.map((l) => {
          const items = grouped.get(l)!;
          return (
            <div key={l} id={`streets-${l}`} className="grid lg:grid-cols-12 gap-4 scroll-mt-16">
              <p className="lg:col-span-1 font-display italic text-cta text-3xl leading-none">{l}</p>
              <div className="lg:col-span-11 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-1.5">
                {items.map((item) => (
                  <Link
                    key={item.sSlug}
                    href={`/suburbs/${suburbSlug}/${item.sSlug}`}
                    className="text-sm text-ink-muted hover:text-ink truncate py-1"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
