import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { SuburbSubrouteHeader, getSuburbListingTabs } from "@/components/suburb";
import { StickyMatchCTA } from "@/components/journey";
import { BreadcrumbJsonLd, PlaceJsonLd } from "@/components/seo";
import { getSuburbBySlug } from "@/lib/services/suburb-service";
import { getProperties } from "@/lib/services/property-service";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

// 7d ISR — suburb data refreshes weekly via the sync worker. See
// /suburbs/[slug]/page.tsx for cost rationale.
export const revalidate = 604800;
export const dynamicParams = true;
export function generateStaticParams() { return []; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const suburb = await getSuburbBySlug(slug);
  if (!suburb) return { title: "Suburb Not Found" };
  const title = `Houses for Sale in ${suburb.name}, ${suburb.state}`;
  const description = `Browse houses for sale in ${suburb.name} ${suburb.postcode}. View all house listings, prices, and features.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/suburbs/${slug}/houses` },
    // og titles don't get the root title.template — brand them explicitly
    openGraph: { url: `${SITE_URL}/suburbs/${slug}/houses`, title: `${title} | ${SITE_NAME}`, description, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function SuburbHousesPage({ params }: Props) {
  const { slug } = await params;
  const suburb = await getSuburbBySlug(slug);
  if (!suburb) notFound();

  const properties = await getProperties({
    listingType: "buy",
    suburb: slug,
    propertyType: "house",
  });
  const count = properties.length;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Suburbs", url: "/suburbs" },
          { name: suburb.name, url: `/suburbs/${slug}` },
          { name: "Houses", url: `/suburbs/${slug}/houses` },
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
        title={<><span className="italic text-primary">Houses</span> for sale</>}
        subtitle={`${count} ${count === 1 ? "house" : "houses"} on the market in ${suburb.name}, ${suburb.state} ${suburb.postcode}.`}
        breadcrumbLeaf="Houses"
        tabs={getSuburbListingTabs(slug, "houses")}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <PropertyGrid
          properties={properties}
          emptyMessage={`No house listings in ${suburb.name} right now. Try the other listing types above.`}
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
