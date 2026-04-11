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
  title: "Sold Properties in Australia",
  description: "View recently sold properties across Australia. Research sale prices and market trends across suburbs.",
  alternates: { canonical: `${SITE_URL}/sold` },
  openGraph: { url: `${SITE_URL}/sold`, title: "Sold Properties in Australia", description: "View recently sold properties across Australia. Research sale prices and market trends across suburbs.", type: "website" },
  twitter: { card: "summary_large_image" },
};

interface SoldPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function SoldPage({ searchParams }: SoldPageProps) {
  const params = await searchParams;
  const properties = await getProperties({
    listingType: "sold",
    suburb: params.suburb,
    propertyType: params.propertyType as PropertyType | undefined,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    minBeds: params.minBeds ? Number(params.minBeds) : undefined,
    sort: params.sort,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd items={[{ name: "Sold", url: "/sold" }]} />
      <Breadcrumbs items={[{ label: "Sold" }]} />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Recently Sold</h1>
        <p className="text-gray-500 mt-1">
          {properties.length} sold {properties.length === 1 ? "property" : "properties"}
        </p>
      </div>

      <div className="mb-6">
        <Suspense fallback={null}>
          <PropertyFilters listingType="sold" />
        </Suspense>
      </div>

      <PropertyGrid properties={properties} emptyMessage="No sold results found matching your criteria." />
    </div>
  );
}
