import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { getProperties } from "@/lib/services/property-service";
import { SITE_URL } from "@/lib/constants";
import type { PropertyType } from "@/types";

export const metadata: Metadata = {
  title: "Rent Property in Australia",
  description: "Find houses, units, and apartments for rent across Australia. Browse rental listings by suburb, price, and bedrooms.",
  alternates: { canonical: `${SITE_URL}/rent` },
  openGraph: { url: `${SITE_URL}/rent`, title: "Rent Property in Australia", description: "Find houses, units, and apartments for rent across Australia.", type: "website" },
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
    <>
      <BreadcrumbJsonLd items={[{ name: "Rent", url: "/rent" }]} />

      {/* Editorial hero */}
      <section className="relative bg-surface-warm border-b border-line overflow-hidden">
        <Image
          src="/images/illustrations/contour.svg"
          alt=""
          width={1200}
          height={800}
          aria-hidden="true"
          className="absolute -right-40 -top-40 w-[1100px] max-w-none opacity-[0.10] pointer-events-none select-none"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pb-16">
          <div className="mb-8">
            <Breadcrumbs items={[{ label: "Rent" }]} />
          </div>

          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
            {properties.length.toLocaleString()} rental {properties.length === 1 ? "property" : "properties"}
          </p>
          <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
            Properties for rent, <span className="italic text-primary">around Australia</span>.
          </h1>
          <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-2xl">
            Houses, units and apartments. Filter by suburb, price, bedrooms.
            Suburb data and tenant rights guides alongside every listing.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <Suspense fallback={null}>
            <PropertyFilters listingType="rent" />
          </Suspense>
        </div>

        <PropertyGrid properties={properties} />
      </div>
    </>
  );
}
