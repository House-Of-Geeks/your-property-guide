import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Home, TrendingUp, GraduationCap, Building2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, PlaceJsonLd, ItemListJsonLd } from "@/components/seo";
import {
  getStateStats,
  getStateRegions,
  getTopSuburbsByState,
  getStateName,
} from "@/lib/services/suburb-rankings-service";
import { formatPrice, formatPriceFull, formatPercentage } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";

const VALID_STATES = ["qld", "nsw", "vic", "wa", "sa", "tas", "nt", "act"];

interface StatePageProps {
  params: Promise<{ state: string }>;
}

export async function generateStaticParams() {
  return VALID_STATES.map((state) => ({ state }));
}

export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
  const { state } = await params;
  if (!VALID_STATES.includes(state.toLowerCase())) return { title: "Not Found" };

  const stateName = getStateName(state.toUpperCase());
  const title = `${stateName} Property Market | Suburbs, Schools & Data | Your Property Guide`;
  const description = `Explore the ${stateName} property market. Browse suburb profiles, median house prices, school data, and local insights across ${stateName}.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/states/${state.toLowerCase()}` },
    openGraph: {
      url: `${SITE_URL}/states/${state.toLowerCase()}`,
      title,
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
    <div className="min-h-screen bg-gray-50">
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

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 to-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <Breadcrumbs
            items={[
              { label: "States", href: "/states" },
              { label: stateName },
            ]}
          />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4">
            {stateName} Property Market
          </h1>
          <p className="text-lg text-gray-600 mt-3 max-w-2xl">
            Explore suburb profiles, school data, and property market insights across {stateName}.
          </p>

          {/* Key stats */}
          <div className="flex flex-wrap gap-6 mt-8">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-semibold text-gray-900">{stats.suburbCount.toLocaleString()}</span>
              <span className="text-gray-500">suburbs</span>
            </div>
            {stats.avgMedianHousePrice && (
              <div className="flex items-center gap-2 text-sm">
                <Home className="w-4 h-4 text-primary" />
                <span className="font-semibold text-gray-900">
                  {formatPriceFull(stats.avgMedianHousePrice)}
                </span>
                <span className="text-gray-500">avg median house price</span>
              </div>
            )}
            {stats.avgAnnualGrowth != null && (
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span
                  className={`font-semibold ${
                    stats.avgAnnualGrowth >= 0 ? "text-green-700" : "text-red-600"
                  }`}
                >
                  {stats.avgAnnualGrowth >= 0 ? "+" : ""}
                  {stats.avgAnnualGrowth}%
                </span>
                <span className="text-gray-500">avg annual growth</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-14">

        {/* Top Regions */}
        {regions.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Regions in {stateName}</h2>
            <p className="text-sm text-gray-500 mb-6">
              Explore property data across {regions.length} regions in {stateName}.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {regions.map((region) => (
                <Link
                  key={region.slug}
                  href={`/regions/${region.slug}`}
                  className="group rounded-xl border border-gray-200 bg-white p-4 hover:border-primary hover:shadow-md transition-all"
                >
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors text-sm leading-tight">
                    {region.region}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Top Suburbs in {stateName}</h2>
            <p className="text-sm text-gray-500 mb-6">
              The largest suburbs by population across {stateName}.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topSuburbs.map((suburb) => (
                <Link
                  key={suburb.slug}
                  href={`/suburbs/${suburb.slug}`}
                  className="group rounded-xl border border-gray-200 bg-white p-5 hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                        {suburb.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {suburb.state} {suburb.postcode}
                      </p>
                    </div>
                    {suburb.annualGrowthHouse !== 0 && (
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
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
                      <p className="text-xs text-gray-400">Median house</p>
                      <p className="text-sm font-bold text-gray-900">
                        {suburb.medianHousePrice > 0 ? formatPrice(suburb.medianHousePrice) : "–"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Population</p>
                      <p className="text-sm font-bold text-gray-900">
                        {suburb.population > 0 ? suburb.population.toLocaleString() : "–"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTAs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Buy CTA */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-primary" />
              <h2 className="text-lg font-bold text-gray-900">
                Properties for Sale in {stateName}
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              Browse active property listings across {stateName}.
            </p>
            <Link
              href={`/buy?state=${upperState}`}
              className="mt-auto inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold rounded-lg px-5 py-2.5 hover:bg-primary/90 transition-colors w-fit"
            >
              Browse Properties for Sale →
            </Link>
          </div>

          {/* Schools CTA */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-primary" />
              <h2 className="text-lg font-bold text-gray-900">
                Schools in {stateName}
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              Find and compare schools across {stateName} using ICSEA data.
            </p>
            <Link
              href={`/schools?state=${upperState}`}
              className="mt-auto inline-flex items-center gap-2 bg-white border border-primary text-primary text-sm font-semibold rounded-lg px-5 py-2.5 hover:bg-primary/5 transition-colors w-fit"
            >
              Find Schools in {upperState} →
            </Link>
          </div>
        </section>

        {/* Best suburbs cross-link */}
        <section className="rounded-2xl border border-gray-100 bg-gradient-to-br from-primary/5 to-white p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Ranked Suburb Lists for {stateName}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Explore curated suburb rankings filtered to {stateName}.
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
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 font-medium hover:border-primary hover:text-primary transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
