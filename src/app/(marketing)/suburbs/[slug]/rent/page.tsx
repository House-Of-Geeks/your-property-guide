import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { SuburbSubrouteHeader, getSuburbListingTabs } from "@/components/suburb";
import { ExpertCTA } from "@/components/journey";
import { BreadcrumbJsonLd, PlaceJsonLd } from "@/components/seo";
import { getSuburbBySlug } from "@/lib/services/suburb-service";
import { getProperties, countProperties } from "@/lib/services/property-service";
import { suburbRentTitle, suburbRentDescription } from "@/lib/utils/seo";
import { SITE_URL } from "@/lib/constants";
import { buildSuburbOgImageUrl } from "@/lib/og/helpers";
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
  // Zero-stock shells stay reachable but are noindexed until inventory
  // lands — same reasoning as the isThinSuburb gate on the profile page.
  const listingCount = await countProperties({ listingType: "rent", suburb: slug });
  return {
    title: suburbRentTitle(suburb),
    description: suburbRentDescription(suburb),
    alternates: { canonical: `${SITE_URL}/suburbs/${slug}/rent` },
    robots: listingCount === 0 ? { index: false, follow: true } : undefined,
    openGraph: {
      url: `${SITE_URL}/suburbs/${slug}/rent`,
      title: suburbRentTitle(suburb),
      description: suburbRentDescription(suburb),
      type: "website",
      // Page-level openGraph replaces the root default wholesale, so the
      // suburb OG card has to be re-attached or shares render imageless.
      images: [
        {
          url: buildSuburbOgImageUrl(slug),
          width: 1200,
          height: 630,
          alt: `${suburb.name}, ${suburb.state} ${suburb.postcode} suburb profile`,
        },
      ],
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

      {/* Renters here are often next year's buyers. Deep-links the
          buying-guide funnel with the suburb pre-answered. */}
      <ExpertCTA
        headline={`Renting in ${suburb.name} for now, buying later?`}
        body={`The complete buying guide, personalised to ${suburb.name}: what you can really spend, 2026 schemes state by state, and how not to overpay. Free PDF, 60 seconds.`}
        ctaLabel="Get the free buying guide"
        href={`/buying-guide?suburb=${slug}`}
      />

      {/* Landlord fallback for the bottom CTA, which is renter-framed.
          Owners research their suburb's rent listings too. */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 -mt-6 text-center">
        <Link
          href="/appraisal"
          className="font-sans text-sm text-ink-muted border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
        >
          Own a rental here? Get a free appraisal.
        </Link>
      </div>
    </>
  );
}
