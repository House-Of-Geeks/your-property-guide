import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, MapPin, Bus, ShoppingBag } from "lucide-react";
import { SuburbHero, SuburbStats as SuburbStatsComponent, DataFreshnessNote } from "@/components/suburb";
import { SuburbSchools } from "@/components/suburb/SuburbSchools";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { Badge, Button } from "@/components/ui";
import { getSuburbBySlug } from "@/lib/services/suburb-service";
import { getPropertiesBySuburb } from "@/lib/services/property-service";
import { suburbTitle, suburbDescription } from "@/lib/utils/seo";
import { formatPriceFull } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";

interface SuburbDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SuburbDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const suburb = await getSuburbBySlug(slug);
  if (!suburb) return { title: "Suburb Not Found" };
  return {
    title: suburbTitle(suburb),
    description: suburbDescription(suburb),
    alternates: { canonical: `${SITE_URL}/suburbs/${slug}` },
    openGraph: { title: suburbTitle(suburb), description: suburbDescription(suburb), type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function SuburbDetailPage({ params }: SuburbDetailPageProps) {
  const { slug } = await params;
  const suburb = await getSuburbBySlug(slug);
  if (!suburb) notFound();

  const properties = await getPropertiesBySuburb(slug, 6);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Suburbs", url: "/suburbs" },
          { name: suburb.name, url: `/suburbs/${suburb.slug}` },
        ]}
      />

      <SuburbHero suburb={suburb} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-12">

        {/* About */}
        <section id="about" className="scroll-mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Welcome to {suburb.name}</h2>
          <p className="text-gray-600 leading-relaxed">{suburb.description}</p>
        </section>

        {/* Market */}
        <section id="market" className="scroll-mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Market Data</h2>
          <SuburbStatsComponent suburb={suburb} />

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-gray-200 bg-white">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Weekly Rent (House)</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {suburb.stats.medianRentHouse ? `$${suburb.stats.medianRentHouse}/wk` : "–"}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-gray-200 bg-white">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Weekly Rent (Unit)</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {suburb.stats.medianRentUnit ? `$${suburb.stats.medianRentUnit}/wk` : "–"}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-gray-200 bg-white">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Owner Occupied</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {suburb.stats.ownerOccupied ? `${suburb.stats.ownerOccupied}%` : "–"}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-gray-200 bg-white">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Renter Occupied</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {suburb.stats.renterOccupied ? `${suburb.stats.renterOccupied}%` : "–"}
              </p>
            </div>
          </div>
          <DataFreshnessNote
            label="Rental"
            asOf={suburb.dataFreshness?.rentalAsOf ?? null}
            source={suburb.dataFreshness?.rentalSource ?? undefined}
          />
        </section>

        {/* Demographics */}
        <section id="demographics" className="scroll-mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Demographics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-gray-200 bg-white">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Population</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {suburb.stats.population ? suburb.stats.population.toLocaleString() : "–"}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-gray-200 bg-white">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Median Age</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {suburb.stats.medianAge ? suburb.stats.medianAge : "–"}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-gray-200 bg-white">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Family Households</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {suburb.stats.householdsFamily ? `${suburb.stats.householdsFamily}%` : "–"}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-gray-200 bg-white">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Lone Person</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {suburb.stats.householdsLonePerson ? `${suburb.stats.householdsLonePerson}%` : "–"}
              </p>
            </div>
          </div>
        </section>

        {/* Location */}
        <section id="location" className="scroll-mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" /> Amenities
              </h3>
              <div className="flex flex-wrap gap-2">
                {suburb.amenities.map((a) => (
                  <Badge key={a} variant="outline">{a}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Bus className="w-5 h-5 text-primary" /> Transport
              </h3>
              <div className="flex flex-wrap gap-2">
                {suburb.transportLinks.map((t) => (
                  <Badge key={t} variant="outline">{t}</Badge>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Nearby Suburbs
            </h3>
            <div className="flex flex-wrap gap-2">
              {suburb.nearbySuburbs.map((s) => (
                <Link key={s} href={`/suburbs/${s}`}>
                  <Badge variant="primary" className="cursor-pointer hover:bg-primary/20">
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
          <SuburbSchools suburbName={suburb.name} schools={suburb.schools} />
          <DataFreshnessNote label="School" asOf={null} source="ACARA" />
        </section>

        {/* Properties in this suburb */}
        {properties.length > 0 && (
          <div className="mt-12">
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Properties in {suburb.name}
              </h2>
              <div className="flex gap-2">
                <Link href={`/suburbs/${suburb.slug}/buy`}>
                  <Button variant="outline" size="sm">
                    For Sale <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href={`/suburbs/${suburb.slug}/rent`}>
                  <Button variant="outline" size="sm">
                    For Rent <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <PropertyGrid properties={properties} />
          </div>
        )}
      </div>
    </>
  );
}
