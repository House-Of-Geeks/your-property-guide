import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Home, ChevronRight, ExternalLink } from "lucide-react";

/** Title-case a G-NAF uppercase string: "MAIN STREET" → "Main Street" */
function toTitleCase(s: string | null): string | null {
  if (!s) return null;
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { PropertyCard } from "@/components/property/PropertyCard";
import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/constants";
import { PropertyMap } from "@/components/property/PropertyMap";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const address = await db.propertyAddress.findUnique({ where: { slug } });
  if (!address) return { title: "Property Not Found" };

  const addressDisplay = address.addressFull.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  const title = `${addressDisplay} — Property Profile`;
  const description = `View property details, listing history, suburb stats, and nearby properties for ${addressDisplay}.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/property/${slug}` },
    openGraph: { url: `${SITE_URL}/property/${slug}`, title, description, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function PropertyAddressPage({ params }: PageProps) {
  const { slug } = await params;

  const address = await db.propertyAddress.findUnique({ where: { slug } });
  if (!address) notFound();

  // Load suburb stats if linked
  const suburb = address.suburbSlug
    ? await db.suburb.findUnique({
        where: { slug: address.suburbSlug },
        select: {
          slug: true,
          name: true,
          state: true,
          postcode: true,
          medianHousePrice: true,
          medianUnitPrice: true,
          medianRentHouse: true,
          medianRentUnit: true,
          annualGrowthHouse: true,
          population: true,
          medianAge: true,
          lat: true,
          lng: true,
        },
      })
    : null;

  // Load any active listings for this address (match on street + suburb + postcode)
  const listings = await db.property.findMany({
    where: {
      addressStreet: { contains: address.streetName ?? "", mode: "insensitive" },
      addressPostcode: address.postcode,
      addressState: address.state,
    },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    orderBy: { dateAdded: "desc" },
    take: 6,
  });

  // Map lat/lng — prefer exact geocode from G-NAF, fall back to suburb centroid
  const mapLat = address.lat ?? suburb?.lat ?? null;
  const mapLng = address.lng ?? suburb?.lng ?? null;

  // Format address parts for display (title-case G-NAF uppercase strings)
  const streetAddress = (() => {
    const parts: string[] = [];
    if (address.flatType && address.flatNumber) {
      parts.push(`${toTitleCase(address.flatType)} ${address.flatNumber}`);
    } else if (address.flatNumber) {
      parts.push(address.flatNumber);
    }
    const streetNo = address.numberLast
      ? `${address.numberFirst}–${address.numberLast}`
      : (address.numberFirst ?? "");
    const street = [streetNo, toTitleCase(address.streetName), toTitleCase(address.streetType), toTitleCase(address.streetSuffix)]
      .filter(Boolean).join(" ");
    parts.push(street);
    return parts.join("/");
  })();

  const localityDisplay  = toTitleCase(address.locality)  ?? address.locality;
  const buildingDisplay  = toTitleCase(address.buildingName);
  const addressFullDisplay = toTitleCase(address.addressFull) ?? address.addressFull;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Property Search", url: "/buy" },
          { name: localityDisplay, url: suburb ? `/suburbs/${suburb.slug}` : `/buy?suburb=${localityDisplay}` },
          { name: addressFullDisplay, url: `/property/${slug}` },
        ]}
      />

      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs
            items={[
              { label: "Buy", href: "/buy" },
              ...(suburb ? [{ label: suburb.name, href: `/suburbs/${suburb.slug}` }] : []),
              { label: streetAddress || localityDisplay, href: `/property/${slug}` },
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {buildingDisplay ? (
                  <span className="text-gray-600 font-normal block text-lg">{buildingDisplay}</span>
                ) : null}
                {streetAddress}
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                {localityDisplay}, {address.state} {address.postcode}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-4 text-sm text-gray-500">
            {address.legalParcelId && (
              <span className="bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
                Parcel: {address.legalParcelId}
              </span>
            )}
            {suburb && (
              <Link
                href={`/suburbs/${suburb.slug}`}
                className="bg-primary/5 border border-primary/20 text-primary rounded-full px-3 py-1 hover:bg-primary/10 transition-colors"
              >
                View {suburb.name} suburb profile →
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Map */}
            {mapLat && mapLng ? (
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <PropertyMap lat={mapLat} lng={mapLng} address={addressFullDisplay} />
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {address.lat ? "Exact geocode from G-NAF" : "Approximate location (suburb centroid)"}
                  </span>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(addressFullDisplay)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    Open in Google Maps <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-gray-50 border border-gray-200 h-60 flex items-center justify-center text-gray-400">
                <MapPin className="h-8 w-8 mr-2 opacity-30" />
                <span>Location not available</span>
              </div>
            )}

            {/* Active listings */}
            {listings.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Listings at this address</h2>
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

            {listings.length === 0 && (
              <section className="rounded-2xl bg-gray-50 border border-gray-100 p-6 text-center">
                <Home className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <h2 className="text-base font-semibold text-gray-700 mb-1">No active listings</h2>
                <p className="text-sm text-gray-500 mb-4">
                  This property is not currently for sale or rent.
                </p>
                <Link
                  href={`/buy?suburb=${localityDisplay}`}
                  className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline"
                >
                  View properties in {localityDisplay} <ChevronRight className="h-4 w-4" />
                </Link>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Address details */}
            <div className="rounded-2xl border border-gray-200 p-5 space-y-3">
              <h3 className="font-semibold text-gray-900">Property details</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Address</dt>
                  <dd className="text-gray-900 text-right max-w-[180px]">{addressFullDisplay}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Suburb</dt>
                  <dd className="text-gray-900">{localityDisplay}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">State</dt>
                  <dd className="text-gray-900">{address.state}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Postcode</dt>
                  <dd className="text-gray-900">{address.postcode}</dd>
                </div>
                {address.legalParcelId && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Legal parcel</dt>
                    <dd className="text-gray-900 font-mono text-xs">{address.legalParcelId}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Suburb stats */}
            {suburb && (
              <div className="rounded-2xl border border-gray-200 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{suburb.name} snapshot</h3>
                  <Link
                    href={`/suburbs/${suburb.slug}`}
                    className="text-xs text-primary hover:underline"
                  >
                    Full profile →
                  </Link>
                </div>
                <dl className="space-y-2 text-sm">
                  {suburb.medianHousePrice > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Median house price</dt>
                      <dd className="text-gray-900 font-medium">
                        ${(suburb.medianHousePrice / 1000).toFixed(0)}k
                      </dd>
                    </div>
                  )}
                  {suburb.medianRentHouse > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Median rent / wk</dt>
                      <dd className="text-gray-900 font-medium">${suburb.medianRentHouse}</dd>
                    </div>
                  )}
                  {suburb.annualGrowthHouse !== 0 && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Annual growth</dt>
                      <dd className={`font-medium ${suburb.annualGrowthHouse >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {suburb.annualGrowthHouse > 0 ? "+" : ""}{suburb.annualGrowthHouse.toFixed(1)}%
                      </dd>
                    </div>
                  )}
                  {suburb.population > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Population</dt>
                      <dd className="text-gray-900">{suburb.population.toLocaleString()}</dd>
                    </div>
                  )}
                </dl>
                <p className="text-xs text-gray-400 pt-1">
                  Source: <a href="https://www.abs.gov.au/census" target="_blank" rel="noopener noreferrer" className="hover:underline">ABS Census 2021</a>
                </p>
              </div>
            )}

            {/* Data source */}
            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 text-xs text-gray-500 space-y-1">
              <p className="font-medium text-gray-600">Address data source</p>
              <p>
                This address is sourced from G-NAF (Geocoded National Address File), Australia&apos;s
                authoritative geocoded address dataset.
              </p>
              <p>
                Published by{" "}
                <a href="https://data.gov.au" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  data.gov.au
                </a>{" "}
                under Creative Commons Attribution 4.0.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
