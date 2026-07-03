import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { SuburbSubrouteHeader, getSuburbListingTabs } from "@/components/suburb";
import { StickyMatchCTA } from "@/components/journey";
import { BreadcrumbJsonLd, PlaceJsonLd } from "@/components/seo";
import { getSuburbBySlug } from "@/lib/services/suburb-service";
import { getProperties, countProperties } from "@/lib/services/property-service";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { buildSuburbOgImageUrl } from "@/lib/og/helpers";

interface Props {
  params: Promise<{ slug: string }>;
}

// 7d ISR. See /suburbs/[slug]/page.tsx.
export const revalidate = 604800;
export const dynamicParams = true;
export function generateStaticParams() { return []; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const suburb = await getSuburbBySlug(slug);
  if (!suburb) return { title: "Suburb Not Found" };
  const title = `Units for Sale in ${suburb.name}, ${suburb.state}`;
  const description = `Browse units for sale in ${suburb.name} ${suburb.postcode}. View all unit listings, prices, and features.`;
  // Zero-stock shells stay reachable but are noindexed until inventory
  // lands — same reasoning as the isThinSuburb gate on the profile page.
  const listingCount = await countProperties({ listingType: "buy", suburb: slug, propertyType: "unit" });
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/suburbs/${slug}/units` },
    robots: listingCount === 0 ? { index: false, follow: true } : undefined,
    openGraph: {
      url: `${SITE_URL}/suburbs/${slug}/units`,
      // og titles don't get the root title.template — brand them explicitly
      title: `${title} | ${SITE_NAME}`,
      description,
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

export default async function SuburbUnitsPage({ params }: Props) {
  const { slug } = await params;
  const suburb = await getSuburbBySlug(slug);
  if (!suburb) notFound();

  const properties = await getProperties({
    listingType: "buy",
    suburb: slug,
    propertyType: "unit",
  });
  const count = properties.length;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Suburbs", url: "/suburbs" },
          { name: suburb.name, url: `/suburbs/${slug}` },
          { name: "Units", url: `/suburbs/${slug}/units` },
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
        title={<><span className="italic text-primary">Units</span> for sale</>}
        subtitle={`${count} ${count === 1 ? "unit" : "units"} on the market in ${suburb.name}, ${suburb.state} ${suburb.postcode}.`}
        breadcrumbLeaf="Units"
        tabs={getSuburbListingTabs(slug, "units")}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <PropertyGrid
          properties={properties}
          emptyMessage={`No unit listings in ${suburb.name} right now. Try the other listing types above.`}
        />
      </div>

      <StickyMatchCTA
        suburb={slug}
        intent="buying"
        label={`Selling in ${suburb.name}? Free guide`}
        dismissKey={`suburb:${slug}`}
      />
    </>
  );
}
