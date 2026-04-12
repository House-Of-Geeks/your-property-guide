import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, PlaceJsonLd } from "@/components/seo";
import { getSuburbBySlug } from "@/lib/services/suburb-service";
import { getProperties } from "@/lib/services/property-service";
import { suburbRentTitle, suburbRentDescription } from "@/lib/utils/seo";
import { SITE_URL } from "@/lib/constants";
import type { PropertyType } from "@/types";
import { Suspense } from "react";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const suburb = await getSuburbBySlug(slug);
  if (!suburb) return { title: "Suburb Not Found" };
  return {
    title: suburbRentTitle(suburb),
    description: suburbRentDescription(suburb),
    alternates: { canonical: `${SITE_URL}/suburbs/${slug}/rent` },
    openGraph: { url: `${SITE_URL}/suburbs/${slug}/rent`, title: suburbRentTitle(suburb), description: suburbRentDescription(suburb), type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function SuburbRentPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const suburb = await getSuburbBySlug(slug);
  if (!suburb) notFound();

  const properties = await getProperties({
    listingType: "rent",
    suburb: slug,
    propertyType: sp.propertyType as PropertyType | undefined,
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    minBeds: sp.minBeds ? Number(sp.minBeds) : undefined,
    sort: sp.sort,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Suburbs", url: "/suburbs" },
          { name: suburb.name, url: `/suburbs/${slug}` },
          { name: "Rent", url: `/suburbs/${slug}/rent` },
        ]}
      />
      <PlaceJsonLd
        name={suburb.name}
        url={"/suburbs/" + suburb.slug}
        addressLocality={suburb.name}
        addressRegion={suburb.state}
        postalCode={suburb.postcode}

      />
      <Breadcrumbs
        items={[
          { label: "Suburbs", href: "/suburbs" },
          { label: suburb.name, href: `/suburbs/${slug}` },
          { label: "Rent" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Houses for Rent in {suburb.name}
        </h1>
        <p className="text-gray-500 mt-1">
          {properties.length} rental {properties.length === 1 ? "property" : "properties"} in {suburb.name}, {suburb.state} {suburb.postcode}
        </p>
      </div>

      <div className="mb-6">
        <Suspense fallback={null}>
          <PropertyFilters listingType="rent" />
        </Suspense>
      </div>

      <PropertyGrid
        properties={properties}
        emptyMessage={`No rental properties in ${suburb.name} at the moment. Check back soon.`}
      />

      <div className="mt-8">
        <Link
          href={`/suburbs/${slug}`}
          className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {suburb.name} suburb profile
        </Link>
      </div>
    </div>
  );
}
