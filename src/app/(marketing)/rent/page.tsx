import type { Metadata } from "next";
import { Suspense } from "react";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { getProperties } from "@/lib/services/property-service";
import { SITE_URL } from "@/lib/constants";
import type { PropertyType } from "@/types";

export const metadata: Metadata = {
  title: "Rent Property in Moreton Bay",
  description: "Find houses, units, and apartments for rent in Moreton Bay. Browse rental listings by suburb, price, and bedrooms.",
  alternates: { canonical: `${SITE_URL}/rent` },
  openGraph: { title: "Rent Property in Moreton Bay", description: "Find houses, units, and apartments for rent in Moreton Bay. Browse rental listings by suburb, price, and bedrooms.", type: "website" },
  twitter: { card: "summary_large_image" },
};

interface RentPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function RentPage({ searchParams }: RentPageProps) {
  const params = await searchParams;
  const properties = await getProperties({
    listingType: "rent",
    suburb: params.suburb,
    propertyType: params.propertyType as PropertyType | undefined,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    minBeds: params.minBeds ? Number(params.minBeds) : undefined,
    sort: params.sort,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd items={[{ name: "Rent", url: "/rent" }]} />
      <Breadcrumbs items={[{ label: "Rent" }]} />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Properties for Rent in Moreton Bay</h1>
        <p className="text-gray-500 mt-1">
          {properties.length} rental {properties.length === 1 ? "property" : "properties"} in Moreton Bay
        </p>
      </div>

      <div className="mb-6">
        <Suspense fallback={null}>
          <PropertyFilters listingType="rent" />
        </Suspense>
      </div>

      <PropertyGrid properties={properties} />
    </div>
  );
}
