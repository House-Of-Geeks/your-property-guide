import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { SuburbSubrouteHeader, getSuburbListingTabs } from "@/components/suburb";
import { StickyMatchCTA } from "@/components/journey";
import { BreadcrumbJsonLd, PlaceJsonLd } from "@/components/seo";
import { getSuburbBySlug } from "@/lib/services/suburb-service";
import { getProperties } from "@/lib/services/property-service";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const suburb = await getSuburbBySlug(slug);
  if (!suburb) return { title: "Suburb Not Found" };
  const title = `Townhouses for Sale in ${suburb.name}, ${suburb.state} | ${SITE_NAME}`;
  const description = `Browse townhouses for sale in ${suburb.name} ${suburb.postcode}. View all townhouse listings, prices, and features.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/suburbs/${slug}/townhouses` },
    openGraph: { url: `${SITE_URL}/suburbs/${slug}/townhouses`, title, description, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function SuburbTownhousesPage({ params }: Props) {
  const { slug } = await params;
  const suburb = await getSuburbBySlug(slug);
  if (!suburb) notFound();

  const properties = await getProperties({
    listingType: "buy",
    suburb: slug,
    propertyType: "townhouse",
  });
  const count = properties.length;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Suburbs", url: "/suburbs" },
          { name: suburb.name, url: `/suburbs/${slug}` },
          { name: "Townhouses", url: `/suburbs/${slug}/townhouses` },
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
        title={<><span className="italic text-primary">Townhouses</span> for sale</>}
        subtitle={`${count} ${count === 1 ? "townhouse" : "townhouses"} on the market in ${suburb.name}, ${suburb.state} ${suburb.postcode}.`}
        breadcrumbLeaf="Townhouses"
        tabs={getSuburbListingTabs(slug, "townhouses")}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <PropertyGrid
          properties={properties}
          emptyMessage={`No townhouse listings in ${suburb.name} right now. Try the other listing types above.`}
        />
      </div>

      <StickyMatchCTA
        suburb={slug}
        intent="buying"
        label={`${suburb.name} — get connected`}
        dismissKey={`suburb:${slug}`}
      />
    </>
  );
}
