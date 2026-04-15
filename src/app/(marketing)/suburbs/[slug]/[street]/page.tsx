import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Home, ChevronRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, PlaceJsonLd } from "@/components/seo";
import { PropertyCard } from "@/components/property/PropertyCard";
import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/constants";
import { streetSlug } from "@/lib/utils/slug";
import { getSuburbBySlug } from "@/lib/services/suburb-service";

interface PageProps {
  params: Promise<{ slug: string; street: string }>;
}

function toTitleCase(s: string | null | undefined): string {
  if (!s) return "";
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

async function resolveStreet(suburbSlug: string, streetParam: string) {
  const groups = await db.propertyAddress.groupBy({
    by: ["streetName", "streetType", "streetSuffix"],
    where: { suburbSlug },
    _count: { id: true },
  });
  return groups.find(
    (g) => streetSlug(g.streetName, g.streetType, g.streetSuffix) === streetParam,
  ) ?? null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, street: streetParam } = await params;
  const [suburb, match] = await Promise.all([
    getSuburbBySlug(slug),
    resolveStreet(slug, streetParam),
  ]);
  if (!suburb || !match) return { title: "Street Not Found" };

  const streetDisplay = toTitleCase(
    [match.streetName, match.streetType, match.streetSuffix].filter(Boolean).join(" "),
  );
  const title = `${streetDisplay}, ${suburb.name} ${suburb.postcode} — Properties`;
  const description = `Browse all ${match._count.id} properties on ${streetDisplay} in ${suburb.name}, ${suburb.state} ${suburb.postcode}. View addresses, active listings, and suburb stats.`;
  const url = `${SITE_URL}/suburbs/${slug}/${streetParam}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { url, title, description, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function StreetPage({ params }: PageProps) {
  const { slug: suburbSlug, street: streetParam } = await params;

  const [suburb, match] = await Promise.all([
    getSuburbBySlug(suburbSlug),
    resolveStreet(suburbSlug, streetParam),
  ]);

  if (!suburb || !match) notFound();

  // All G-NAF addresses on this street
  const addresses = await db.propertyAddress.findMany({
    where: {
      suburbSlug,
      streetName: match.streetName,
      streetType: match.streetType,
      streetSuffix: match.streetSuffix,
    },
    orderBy: { numberFirst: "asc" },
    take: 500,
  });

  // Active listings on this street
  const listings = await db.property.findMany({
    where: {
      addressStreet: { contains: match.streetName, mode: "insensitive" },
      addressPostcode: suburb.postcode,
      addressState: suburb.state,
    },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    orderBy: { dateAdded: "desc" },
    take: 6,
  });

  const streetDisplay = toTitleCase(
    [match.streetName, match.streetType, match.streetSuffix].filter(Boolean).join(" "),
  );
  const pageUrl = `/suburbs/${suburbSlug}/${streetParam}`;

  return (
    <>
      <PlaceJsonLd
        name={`${streetDisplay}, ${suburb.name} ${suburb.state} ${suburb.postcode}`}
        url={pageUrl}
        streetAddress={streetDisplay}
        addressLocality={suburb.name}
        addressRegion={suburb.state}
        postalCode={suburb.postcode}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Buy", url: "/buy" },
          { name: suburb.name, url: `/suburbs/${suburbSlug}` },
          { name: streetDisplay, url: pageUrl },
        ]}
      />

      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs
            items={[
              { label: "Buy", href: "/buy" },
              { label: suburb.name, href: `/suburbs/${suburbSlug}` },
              { label: streetDisplay, href: pageUrl },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start gap-3 mb-2">
            <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{streetDisplay}</h1>
              <p className="text-lg text-gray-600 mt-1">
                {suburb.name}, {suburb.state} {suburb.postcode}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 text-sm text-gray-500">
            <span className="bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
              {match._count.id} registered address{match._count.id !== 1 ? "es" : ""}
            </span>
            <Link
              href={`/suburbs/${suburbSlug}`}
              className="bg-primary/5 border border-primary/20 text-primary rounded-full px-3 py-1 hover:bg-primary/10 transition-colors"
            >
              View {suburb.name} suburb profile →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Active listings */}
            {listings.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Active listings on {streetDisplay}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {listings.map((p) => {
                    const prop = {
                      id: p.id,
                      slug: p.slug,
                      listingType: p.listingType as "buy" | "rent" | "sold",
                      propertyType: p.propertyType as "house" | "unit" | "townhouse" | "land" | "apartment" | "acreage" | "villa",
                      status: p.status as "active" | "under-contract" | "sold" | "off-market",
                      title: p.title,
                      address: {
                        street: p.addressStreet,
                        suburb: p.addressSuburb,
                        state: p.addressState,
                        postcode: p.addressPostcode,
                        full: p.addressFull,
                      },
                      price: {
                        display: p.priceDisplay,
                        value: p.priceValue,
                        isRange: p.priceIsRange,
                        min: p.priceMin ?? undefined,
                        max: p.priceMax ?? undefined,
                        rentPerWeek: p.priceRentPerWeek ?? undefined,
                      },
                      features: {
                        bedrooms: p.bedrooms,
                        bathrooms: p.bathrooms,
                        carSpaces: p.carSpaces,
                        landSize: p.landSize ?? undefined,
                        buildingSize: p.buildingSize ?? undefined,
                      },
                      description: p.description,
                      images: p.images.map((img) => ({ url: img.url, alt: img.alt, width: img.width, height: img.height })),
                      agentId: p.agentId,
                      agencyId: p.agencyId,
                      suburbSlug: p.suburbSlug,
                      inspectionTimes: p.inspectionTimes,
                      dateAdded: p.dateAdded.toISOString(),
                      isOffMarket: p.isOffMarket,
                      isFeatured: p.isFeatured,
                    };
                    return <PropertyCard key={p.id} property={prop} />;
                  })}
                </div>
              </section>
            )}

            {/* Address list */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                All addresses on {streetDisplay}
              </h2>
              {addresses.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {addresses.map((addr) => {
                    const streetNo = addr.numberLast
                      ? `${addr.numberFirst}–${addr.numberLast}`
                      : (addr.numberFirst ?? "");
                    const flatPrefix = addr.flatNumber
                      ? `${addr.flatNumber ? addr.flatNumber + "/" : ""}`
                      : "";
                    const display = `${flatPrefix}${streetNo} ${streetDisplay}`;
                    return (
                      <Link
                        key={addr.id}
                        href={`/property/${addr.slug}`}
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary rounded-lg px-3 py-2 hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/20"
                      >
                        <Home className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                        {display}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No registered addresses found.</p>
              )}
              {addresses.length === 500 && (
                <p className="text-xs text-gray-400 mt-3">Showing first 500 addresses.</p>
              )}
            </section>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Suburb stats */}
            <div className="rounded-2xl border border-gray-200 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{suburb.name} snapshot</h3>
                <Link href={`/suburbs/${suburbSlug}`} className="text-xs text-primary hover:underline">
                  Full profile →
                </Link>
              </div>
              <dl className="space-y-2 text-sm">
                {suburb.stats.medianHousePrice > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Median house price</dt>
                    <dd className="text-gray-900 font-medium">
                      ${(suburb.stats.medianHousePrice / 1000).toFixed(0)}k
                    </dd>
                  </div>
                )}
                {suburb.stats.medianRentHouse > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Median rent / wk</dt>
                    <dd className="text-gray-900 font-medium">${suburb.stats.medianRentHouse}</dd>
                  </div>
                )}
                {suburb.stats.annualGrowthHouse !== 0 && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Annual growth</dt>
                    <dd className={`font-medium ${suburb.stats.annualGrowthHouse >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {suburb.stats.annualGrowthHouse > 0 ? "+" : ""}{suburb.stats.annualGrowthHouse.toFixed(1)}%
                    </dd>
                  </div>
                )}
                {suburb.stats.population > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Population</dt>
                    <dd className="text-gray-900">{suburb.stats.population.toLocaleString()}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Browse suburb */}
            <div className="rounded-2xl border border-gray-200 p-5 space-y-2">
              <h3 className="font-semibold text-gray-900">Browse {suburb.name}</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link href={`/suburbs/${suburbSlug}`} className="flex items-center gap-1 text-primary hover:underline">
                    <ChevronRight className="h-3.5 w-3.5" /> Suburb profile
                  </Link>
                </li>
                <li>
                  <Link href={`/suburbs/${suburbSlug}/buy`} className="flex items-center gap-1 text-primary hover:underline">
                    <ChevronRight className="h-3.5 w-3.5" /> Properties for sale
                  </Link>
                </li>
                <li>
                  <Link href={`/suburbs/${suburbSlug}/rent`} className="flex items-center gap-1 text-primary hover:underline">
                    <ChevronRight className="h-3.5 w-3.5" /> Properties for rent
                  </Link>
                </li>
                <li>
                  <Link href={`/buy?suburb=${suburb.name}`} className="flex items-center gap-1 text-primary hover:underline">
                    <ChevronRight className="h-3.5 w-3.5" /> Search all listings
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
