import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { SuburbSubrouteHeader, getSuburbListingTabs } from "@/components/suburb";
import { ExpertCTA } from "@/components/journey";
import { BreadcrumbJsonLd, PlaceJsonLd } from "@/components/seo";
import { getSuburbBySlug } from "@/lib/services/suburb-service";
import { getProperties } from "@/lib/services/property-service";
import { suburbRentTitle, suburbRentDescription } from "@/lib/utils/seo";
import { SITE_URL } from "@/lib/constants";
import type { PropertyType } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

// 7d ISR. See /suburbs/[slug]/page.tsx.
export const revalidate = 604800;
export const dynamicParams = true;
export function generateStaticParams() { return []; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const suburb = await getSuburbBySlug(slug);
  if (!suburb) return { title: "Suburb Not Found" };
  return {
    title: suburbRentTitle(suburb),
    description: suburbRentDescription(suburb),
    alternates: { canonical: `${SITE_URL}/suburbs/${slug}/rent` },
    openGraph: {
      url: `${SITE_URL}/suburbs/${slug}/rent`,
      title: suburbRentTitle(suburb),
      description: suburbRentDescription(suburb),
      type: "website",
    },
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
  const count = properties.length;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Suburbs", url: "/suburbs" },
          { name: suburb.name, url: `/suburbs/${slug}` },
          { name: "For rent", url: `/suburbs/${slug}/rent` },
        ]}
      />
      <PlaceJsonLd
        name={suburb.name}
        url={`/suburbs/${suburb.slug}`}
        addressLocality={suburb.name}
        addressRegion={suburb.state}
        postalCode={suburb.postcode}
      />

      <SuburbSubrouteHeader
        suburb={suburb}
        eyebrow="Listings in"
        title={<>Properties <span className="italic text-primary">for rent</span></>}
        subtitle={`${count} ${count === 1 ? "rental" : "rentals"} available in ${suburb.name}, ${suburb.state} ${suburb.postcode}.`}
        breadcrumbLeaf="For rent"
        tabs={getSuburbListingTabs(slug, "rent")}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <Suspense fallback={null}>
          <PropertyFilters listingType="rent" />
        </Suspense>
        <PropertyGrid
          properties={properties}
          emptyMessage={`No rentals listed in ${suburb.name} right now. Check back soon, or browse the rental-market data using the tabs above.`}
        />
      </div>
    </>
  );
}
