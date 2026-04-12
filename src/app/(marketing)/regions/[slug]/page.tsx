import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, TrendingUp, Home, Building2 } from "lucide-react";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, PlaceJsonLd, ItemListJsonLd } from "@/components/seo";
import {
  getRegionBySlug,
  getRegionSuburbs,
  getRegionStats,
  getAllRegionSlugs,
} from "@/lib/services/region-service";
import { getProperties } from "@/lib/services/property-service";
import { formatPriceFull } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";

interface RegionPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true; // allow slugs not in generateStaticParams to SSR

export async function generateStaticParams() {
  const slugs = await getAllRegionSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: RegionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const region = await getRegionBySlug(slug);
  if (!region) return { title: "Region Not Found" };

  const title = `${region.region} Real Estate - Houses for Sale & Rent`;
  const description = `Browse properties for sale and rent across ${region.region}, ${region.state}. View suburb profiles, median house prices, and market trends for all ${region.suburbCount} suburbs in the ${region.region} region.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/regions/${slug}` },
    openGraph: { url: `${SITE_URL}/regions/${slug}`, title, description, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RegionPage({ params }: RegionPageProps) {
  const { slug } = await params;
  const region = await getRegionBySlug(slug);
  if (!region) notFound();

  const [suburbs, stats] = await Promise.all([
    getRegionSuburbs(region.region),
    getRegionStats(region.region),
  ]);

  const suburbSlugs = suburbs.map((s) => s.slug);

  const allProperties = await getProperties({
    suburb: suburbSlugs.join(","),
    listingType: "buy",
  });
  const properties = allProperties.slice(0, 9);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Regions", url: "/regions" },
          { name: region.region, url: `/regions/${slug}` },
        ]}
      />
      <PlaceJsonLd
        name={region.region}
        url={"/regions/" + slug}
        addressRegion={region.state}
      />
      <ItemListJsonLd
        name={"Suburbs in " + region.region}
        url={"/regions/" + slug}
        items={suburbs.slice(0, 20).map((s) => ({ name: s.name, url: "/suburbs/" + s.slug }))}
      />

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 to-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <Breadcrumbs
            items={[
              { label: "Regions", href: "/regions" },
              { label: region.region },
            ]}
          />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4">
            {region.region} Real Estate &amp; Property Market
          </h1>
          <p className="text-lg text-gray-600 mt-3 max-w-2xl">
            Browse properties for sale and rent across {region.region}, {region.state}.
            Explore suburb profiles, median house prices, and local market data.
          </p>

          <div className="flex flex-wrap gap-6 mt-8">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-semibold text-gray-900">{stats.suburbCount}</span>
              <span className="text-gray-500">suburbs</span>
            </div>
            {stats.medianHousePrice && (
              <div className="flex items-center gap-2 text-sm">
                <Home className="w-4 h-4 text-primary" />
                <span className="font-semibold text-gray-900">{formatPriceFull(stats.medianHousePrice)}</span>
                <span className="text-gray-500">avg median house price</span>
              </div>
            )}
            {stats.avgAnnualGrowth !== null && (
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="font-semibold text-gray-900">
                  {stats.avgAnnualGrowth >= 0 ? "+" : ""}{stats.avgAnnualGrowth}%
                </span>
                <span className="text-gray-500">avg annual growth</span>
              </div>
            )}
            {properties.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4 text-primary" />
                <span className="font-semibold text-gray-900">{properties.length}+</span>
                <span className="text-gray-500">properties for sale</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-14">

        {/* Properties */}
        {properties.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Houses for Sale in {region.region}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Active listings across the {region.region} region
                </p>
              </div>
            </div>
            <PropertyGrid properties={properties} />
          </section>
        )}

        {/* Suburb grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Suburbs in {region.region}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Explore median house prices, growth rates, and market data across{" "}
            {stats.suburbCount} suburbs in the {region.region} region, {region.state}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suburbs.map((suburb) => (
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
                  {suburb.annualGrowthHouse != null && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      suburb.annualGrowthHouse >= 0
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}>
                      {suburb.annualGrowthHouse >= 0 ? "+" : ""}
                      {suburb.annualGrowthHouse.toFixed(1)}%
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Median house</p>
                    <p className="text-sm font-bold text-gray-900">
                      {suburb.medianHousePrice > 0 ? formatPriceFull(suburb.medianHousePrice) : "–"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Median unit</p>
                    <p className="text-sm font-bold text-gray-900">
                      {suburb.medianUnitPrice > 0 ? formatPriceFull(suburb.medianUnitPrice) : "–"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
