import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, PlaceJsonLd } from "@/components/seo";
import { getSuburbBySlug } from "@/lib/services/suburb-service";
import { getProperties } from "@/lib/services/property-service";
import { SITE_URL } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const suburb = await getSuburbBySlug(slug);
  if (!suburb) return { title: "Suburb Not Found" };
  const title = `Land for Sale in ${suburb.name}, ${suburb.state} | Your Property Guide`;
  const description = `Browse land for sale in ${suburb.name} ${suburb.postcode}. View all land listings, sizes, and prices.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/suburbs/${slug}/land` },
    openGraph: { url: `${SITE_URL}/suburbs/${slug}/land`, title, description, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function SuburbLandPage({ params }: Props) {
  const { slug } = await params;
  const suburb = await getSuburbBySlug(slug);
  if (!suburb) notFound();

  const properties = await getProperties({
    listingType: "buy",
    suburb: slug,
    propertyType: "land",
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Suburbs", url: "/suburbs" },
          { name: suburb.name, url: `/suburbs/${slug}` },
          { name: "Land for Sale", url: `/suburbs/${slug}/land` },
        ]}
      />
      <PlaceJsonLd
        name={suburb.name}
        url={"/suburbs/" + suburb.slug}
        addressLocality={suburb.name}
        addressRegion={suburb.state}
        postalCode={suburb.postcode}

      />
      <Breadcrumbs
        items={[
          { label: "Suburbs", href: "/suburbs" },
          { label: suburb.name, href: `/suburbs/${slug}` },
          { label: "Land for Sale" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Land for Sale in {suburb.name}
        </h1>
        <p className="text-gray-500 mt-1">
          {properties.length} land {properties.length === 1 ? "listing" : "listings"} in {suburb.name}, {suburb.state} {suburb.postcode}
        </p>
      </div>

      {properties.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-500 mb-4">No land listings in {suburb.name} right now.</p>
          <Link
            href={`/suburbs/${slug}/buy`}
            className="text-primary hover:underline font-medium"
          >
            Browse all properties →
          </Link>
        </div>
      ) : (
        <PropertyGrid
          properties={properties}
          emptyMessage={`No land listings in ${suburb.name} right now.`}
        />
      )}

      <div className="mt-8">
        <Link
          href={`/suburbs/${slug}`}
          className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {suburb.name} suburb profile
        </Link>
      </div>
    </div>
  );
}
