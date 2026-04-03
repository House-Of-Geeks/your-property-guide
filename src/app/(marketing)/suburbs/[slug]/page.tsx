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
import { getRentalFreshness, getCrimeFreshness } from "@/lib/services/data-freshness";
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

  const [properties, rentalFreshness, crimeFreshness] = await Promise.all([
    getPropertiesBySuburb(slug, 6),
    getRentalFreshness(suburb.state),
    getCrimeFreshness(suburb.state),
  ]);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Suburbs", url: "/suburbs" },
          { name: suburb.name, url: `/suburbs/${suburb.slug}` },
        ]}
      />

      <SuburbHero suburb={suburb} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumbs items={[{ label: "Suburbs", href: "/suburbs" }, { label: suburb.name }]} />

        {/* Description */}
        <div className="mt-6 max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{suburb.name} Real Estate</h1>
          <p className="text-gray-500 mb-4">{suburb.name}, {suburb.state} {suburb.postcode} · {suburb.region}</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">About {suburb.name}</h2>
          <p className="text-gray-600 leading-relaxed">{suburb.description}</p>
        </div>

        {/* Stats */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Market Data</h2>
          <SuburbStatsComponent suburb={suburb} />
        </div>

        {/* Rent stats */}
        <div className="mt-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-gray-200 bg-white">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Weekly Rent (House)</p>
              <p className="text-xl font-bold text-gray-900 mt-1">${suburb.stats.medianRentHouse}/wk</p>
            </div>
            <div className="p-4 rounded-xl border border-gray-200 bg-white">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Weekly Rent (Unit)</p>
              <p className="text-xl font-bold text-gray-900 mt-1">${suburb.stats.medianRentUnit}/wk</p>
            </div>
            <div className="p-4 rounded-xl border border-gray-200 bg-white">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Owner Occupied</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{suburb.stats.ownerOccupied}%</p>
            </div>
            <div className="p-4 rounded-xl border border-gray-200 bg-white">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Renter Occupied</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{suburb.stats.renterOccupied}%</p>
            </div>
          </div>
          <DataFreshnessNote
            label="Rental"
            asOf={rentalFreshness?.dataAsOf ?? null}
            source={rentalFreshness?.label}
          />
        </div>

        {/* Schools */}
        <div className="mt-8">
          <SuburbSchools schools={suburb.schools} />
          <DataFreshnessNote label="School" asOf={null} source="ACARA" />
        </div>

        {/* Amenities & Transport */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" /> Amenities
            </h2>
            <div className="flex flex-wrap gap-2">
              {suburb.amenities.map((a) => (
                <Badge key={a} variant="outline">{a}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Bus className="w-5 h-5 text-primary" /> Transport
            </h2>
            <div className="flex flex-wrap gap-2">
              {suburb.transportLinks.map((t) => (
                <Badge key={t} variant="outline">{t}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Nearby suburbs */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Nearby Suburbs</h2>
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
