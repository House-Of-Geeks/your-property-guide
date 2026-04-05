import type { Metadata } from "next";
import { Suspense } from "react";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { PropertyCardSkeleton } from "@/components/ui";
import { getProperties } from "@/lib/services/property-service";
import { SITE_URL } from "@/lib/constants";
import type { PropertyType } from "@/types";

export const metadata: Metadata = {
  title: "Buy Property in Australia",
  description: "Browse houses, units, townhouses, and land for sale across Australia. Search by suburb, price, bedrooms, and more.",
  alternates: { canonical: `${SITE_URL}/buy` },
  openGraph: { title: "Buy Property in Australia", description: "Browse houses, units, townhouses, and land for sale across Australia. Search by suburb, price, bedrooms, and more.", type: "website" },
  twitter: { card: "summary_large_image" },
};

interface BuyPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function BuyPage({ searchParams }: BuyPageProps) {
  const params = await searchParams;
  const properties = await getProperties({
    listingType: "buy",
    suburb: params.suburb,
    propertyType: params.propertyType as PropertyType | undefined,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    minBeds: params.minBeds ? Number(params.minBeds) : undefined,
    sort: params.sort,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd items={[{ name: "Buy", url: "/buy" }]} />
      <Breadcrumbs items={[{ label: "Buy" }]} />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Properties for Sale</h1>
        <p className="text-gray-500 mt-1">
          {properties.length} {properties.length === 1 ? "property" : "properties"} found
        </p>
      </div>

      <div className="mb-6">
        <Suspense fallback={null}>
          <PropertyFilters listingType="buy" />
        </Suspense>
      </div>

      <PropertyGrid properties={properties} />
    </div>
  );
}
