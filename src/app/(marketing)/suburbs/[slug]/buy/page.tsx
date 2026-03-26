import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { getSuburbBySlug } from "@/lib/services/suburb-service";
import { getProperties } from "@/lib/services/property-service";
import { suburbBuyTitle, suburbBuyDescription } from "@/lib/utils/seo";
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
    title: suburbBuyTitle(suburb),
    description: suburbBuyDescription(suburb),
  };
}

export default async function SuburbBuyPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const suburb = await getSuburbBySlug(slug);
  if (!suburb) notFound();

  const properties = await getProperties({
    listingType: "buy",
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
          { name: "Buy", url: `/suburbs/${slug}/buy` },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Suburbs", href: "/suburbs" },
          { label: suburb.name, href: `/suburbs/${slug}` },
          { label: "Buy" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Houses for Sale in {suburb.name}
        </h1>
        <p className="text-gray-500 mt-1">
          {properties.length} {properties.length === 1 ? "property" : "properties"} for sale in {suburb.name}, {suburb.state} {suburb.postcode}
        </p>
      </div>

      <div className="mb-6">
        <Suspense fallback={null}>
          <PropertyFilters listingType="buy" />
        </Suspense>
      </div>

      <PropertyGrid
        properties={properties}
        emptyMessage={`No properties for sale in ${suburb.name} at the moment. Check back soon.`}
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
