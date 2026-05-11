import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { SuburbSubrouteHeader, getSuburbListingTabs } from "@/components/suburb";
import { ExpertCTA, StickyMatchCTA } from "@/components/journey";
import { BreadcrumbJsonLd, PlaceJsonLd } from "@/components/seo";
import { getSuburbBySlug } from "@/lib/services/suburb-service";
import { getProperties } from "@/lib/services/property-service";
import { suburbBuyTitle, suburbBuyDescription } from "@/lib/utils/seo";
import { SITE_URL } from "@/lib/constants";
import type { PropertyType } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

// ISR — listings refresh once a day via the sync worker. Pages that take
// `searchParams` (filters / pagination) are still cached by Next per
// unique URL variant; the no-filter SEO crawl path is the one that gets
// hammered, and now lands as a CDN hit.
export const revalidate = 86400;
export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const suburb = await getSuburbBySlug(slug);
  if (!suburb) return { title: "Suburb Not Found" };
  return {
    title: suburbBuyTitle(suburb),
    description: suburbBuyDescription(suburb),
    alternates: { canonical: `${SITE_URL}/suburbs/${slug}/buy` },
    openGraph: {
      url: `${SITE_URL}/suburbs/${slug}/buy`,
      title: suburbBuyTitle(suburb),
      description: suburbBuyDescription(suburb),
      type: "website",
    },
    twitter: { card: "summary_large_image" },
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
  const count = properties.length;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Suburbs", url: "/suburbs" },
          { name: suburb.name, url: `/suburbs/${slug}` },
          { name: "For sale", url: `/suburbs/${slug}/buy` },
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
        title={<>Properties <span className="italic text-primary">for sale</span></>}
        subtitle={`${count} ${count === 1 ? "property" : "properties"} on the market in ${suburb.name}, ${suburb.state} ${suburb.postcode}.`}
        breadcrumbLeaf="For sale"
        tabs={getSuburbListingTabs(slug, "buy")}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <Suspense fallback={null}>
          <PropertyFilters listingType="buy" />
        </Suspense>
        <PropertyGrid
          properties={properties}
          emptyMessage={`No properties for sale in ${suburb.name} right now. Check back soon, or browse rentals or recently sold listings using the tabs above.`}
        />
      </div>

      <ExpertCTA
        headline={`Looking at ${suburb.name}? We'll find the right person.`}
        body={`Whether it's a buyer's agent for inspections and negotiation, a broker for finance, or someone else entirely &mdash; we'll connect you with the right specialist for your situation in ${suburb.name}. Free for buyers, no commitment.`}
        ctaLabel="Get connected"
        href={`/?suburb=${slug}&intent=buying#match`}
      />

      <StickyMatchCTA
        suburb={slug}
        intent="buying"
        label={`${suburb.name} — get connected`}
        dismissKey={`suburb:${slug}`}
      />
    </>
  );
}
