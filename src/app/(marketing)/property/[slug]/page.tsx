import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Bath,
  Bed,
  Car,
  ChevronRight,
  Droplets,
  ExternalLink,
  FileText,
  Flame,
  GraduationCap,
  HelpCircle,
  Home,
  Landmark,
  MapPin,
  Maximize2,
  TrendingUp,
  Users,
} from "lucide-react";

/** Title-case a G-NAF uppercase string: "MAIN STREET" → "Main Street" */
function toTitleCase(s: string | null): string | null {
  if (!s) return null;
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, PlaceJsonLd } from "@/components/seo";
import { PropertyCard } from "@/components/property/PropertyCard";
import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/constants";
import { streetSlug } from "@/lib/utils/slug";
import { makeSchoolSlug } from "@/lib/utils/school";
import { formatDate, formatPrice, formatPriceFull } from "@/lib/utils/format";
import { PropertyMap } from "@/components/property/PropertyMap";
import { PropertyInterestForm } from "@/components/property/PropertyInterestForm";
import { PropertyPriceChart } from "@/components/property/PropertyPriceChart";
import { PropertyMobileCTA } from "@/components/property/PropertyMobileCTA";

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

/**
 * Indicative price range from suburb median. Suburb median ± 15% gives a
 * conservative LOW/MID/HIGH band — clearly labelled "indicative" since we
 * don't run an AVM yet.
 */
function indicativePriceRange(median: number) {
  if (!median || median <= 0) return null;
  return {
    low: Math.round((median * 0.85) / 1000) * 1000,
    mid: Math.round(median / 1000) * 1000,
    high: Math.round((median * 1.15) / 1000) * 1000,
  };
}

export default async function PropertyAddressPage({ params }: PageProps) {
  const { slug } = await params;

  const address = await db.propertyAddress.findUnique({ where: { slug } });
  if (!address) notFound();

  const suburb = address.suburbSlug
    ? await db.suburb.findUnique({
        where: { slug: address.suburbSlug },
        select: {
          id: true,
          slug: true,
          name: true,
          state: true,
          postcode: true,
          medianHousePrice: true,
          medianUnitPrice: true,
          medianRentHouse: true,
          medianRentUnit: true,
          annualGrowthHouse: true,
          annualGrowthUnit: true,
          daysOnMarket: true,
          population: true,
          medianAge: true,
          ownerOccupied: true,
          renterOccupied: true,
          householdsFamily: true,
          householdsLonePerson: true,
          walkScore: true,
          transitScore: true,
          bikeScore: true,
          lat: true,
          lng: true,
          rentalUpdatedAt: true,
          salesUpdatedAt: true,
          hazardUpdatedAt: true,
        },
      })
    : null;

  // Schools in this suburb (top 6 — government first by sector convention)
  const schools = suburb
    ? await db.school.findMany({
        where: { suburbId: suburb.id },
        select: {
          id: true,
          name: true,
          type: true,
          sector: true,
          distance: true,
          yearRange: true,
          gender: true,
          icsea: true,
          enrolment: true,
          acaraId: true,
        },
        orderBy: [{ sector: "asc" }, { distance: "asc" }],
        take: 6,
      })
    : [];

  // Recent nearby sales (same suburb, exclude this address, last 24 months)
  const nearbySales = address.suburbSlug
    ? await db.propertySale.findMany({
        where: {
          matchConfidence: "exact",
          address: { suburbSlug: address.suburbSlug },
          addressId: { not: address.id },
          // eslint-disable-next-line react-hooks/purity -- server component, runs once per request
          contractDate: { gt: new Date(Date.now() - 24 * 30 * 24 * 3600 * 1000) },
        },
        select: {
          id: true,
          price: true,
          contractDate: true,
          source: true,
          natureCode: true,
          address: { select: { addressFull: true, slug: true } },
        },
        orderBy: { contractDate: "desc" },
        take: 6,
      })
    : [];

  const hazard = address.suburbSlug
    ? await db.suburbHazard.findUnique({ where: { suburbSlug: address.suburbSlug } })
    : null;

  // Active listings at this address (loose match — same street + postcode + state)
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

  // Sold history at this address (any listingType, has dateSold)
  const soldHistory = await db.property.findMany({
    where: {
      addressStreet: { contains: address.streetName ?? "", mode: "insensitive" },
      addressPostcode: address.postcode,
      addressState: address.state,
      dateSold: { not: null },
    },
    select: {
      id: true,
      slug: true,
      dateSold: true,
      soldPrice: true,
      priceDisplay: true,
      listingType: true,
      addressFull: true,
    },
    orderBy: { dateSold: "desc" },
    take: 8,
  });

  // Parcel-level overlay layers (zoning, flood, bushfire, heritage, etc.)
  const overlays = await db.propertyOverlay.findMany({
    where: { addressId: address.id },
    select: { kind: true, source: true, code: true, label: true, attrs: true },
  });
  const zoningOverlay   = overlays.find((o) => o.kind === "zoning");
  const floodOverlay    = overlays.find((o) => o.kind === "flood");
  const bushfireOverlay = overlays.find((o) => o.kind === "bushfire");
  const heritageOverlay = overlays.find((o) => o.kind === "heritage");
  const primaryCatchmentOverlay   = overlays.find((o) => o.kind === "catchment-primary");
  const secondaryCatchmentOverlay = overlays.find((o) => o.kind === "catchment-secondary");

  // Resolve overlay's school_code / school_name to a row in the School table
  // so we can link straight to the school detail page when available.
  const catchmentSchoolNames = [primaryCatchmentOverlay, secondaryCatchmentOverlay]
    .map((o) => (o?.attrs as { schoolName?: string } | null)?.schoolName ?? o?.label)
    .filter((n): n is string => !!n);
  const catchmentSchools = catchmentSchoolNames.length > 0
    ? await db.school.findMany({
        where: {
          name: { in: catchmentSchoolNames, mode: "insensitive" },
          suburb: { state: "NSW" },
        },
        select: { id: true, name: true, acaraId: true, type: true, sector: true, distance: true, yearRange: true, icsea: true },
      })
    : [];

  // Authoritative sale history from state Valuer-General feeds (VG NSW etc.)
  // Only "exact" matches — street-fallback rows aren't this address specifically.
  const vgSales = await db.propertySale.findMany({
    where: { addressId: address.id, matchConfidence: "exact" },
    select: {
      id: true,
      contractDate: true,
      settlementDate: true,
      price: true,
      source: true,
      natureCode: true,
      primaryPurpose: true,
    },
    orderBy: { contractDate: "desc" },
    take: 12,
  });

  // Heuristic: addresses with many recorded sales are unit blocks where the
  // "last sale price" represents one unit and isn't useful as a property value.
  const isLikelyAptBlock = (address.saleCount ?? 0) > 20 && !address.flatNumber;
  const hasRealSaleHistory = !!address.lastSaleDate && !isLikelyAptBlock;

  const mapLat = address.lat ?? suburb?.lat ?? null;
  const mapLng = address.lng ?? suburb?.lng ?? null;

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

  const localityDisplay = toTitleCase(address.locality) ?? address.locality;
  const buildingDisplay = toTitleCase(address.buildingName);
  const addressFullDisplay = toTitleCase(address.addressFull) ?? address.addressFull;

  // Pick a representative listing to enrich the header (beds/baths/type)
  const featured = listings[0];

  // Derive a dwelling type label from the most authoritative signal we have.
  // Order: active listing > G-NAF flatType > VG natureCode/primaryPurpose >
  // apt-block heuristic. Returns null when we genuinely don't know — caller
  // hides the chip rather than guessing.
  const propertyTypeLabel: string | null = (() => {
    if (featured?.propertyType) return toTitleCase(featured.propertyType);

    const flatType = address.flatType?.toUpperCase().trim();
    if (flatType) {
      // G-NAF flat type codes — map common ones to readable labels
      if (flatType === "UNIT" || flatType === "U") return "Unit";
      if (flatType === "APARTMENT" || flatType === "APT") return "Apartment";
      if (flatType === "FLAT") return "Flat";
      if (flatType === "TOWNHOUSE" || flatType === "TNHS") return "Townhouse";
      if (flatType === "VILLA") return "Villa";
      if (flatType === "DUPLEX") return "Duplex";
      if (flatType === "STUDIO") return "Studio";
      if (flatType === "PENTHOUSE") return "Penthouse";
      if (flatType === "SHOP") return "Shop";
      if (flatType === "OFFICE") return "Office";
      return toTitleCase(flatType);
    }

    const latestSale = vgSales[0];
    if (latestSale?.natureCode === "V") return "Vacant land";
    if (latestSale?.primaryPurpose?.toUpperCase().includes("VACANT")) return "Vacant land";
    if (latestSale?.natureCode === "3") return "Strata unit";
    if (latestSale?.natureCode === "R") return "House";

    const isLikelyAptBlockEarly = (address.saleCount ?? 0) > 20 && !address.flatNumber;
    if (isLikelyAptBlockEarly) return "Apartment block";

    return null;
  })();

  // Indicative valuation from suburb median
  const valueRange = suburb ? indicativePriceRange(suburb.medianHousePrice) : null;
  const rentPerWeek = suburb?.medianRentHouse && suburb.medianRentHouse > 0 ? suburb.medianRentHouse : null;
  const rentalYield =
    rentPerWeek && valueRange?.mid
      ? ((rentPerWeek * 52) / valueRange.mid) * 100
      : null;

  const valuationUpdated = suburb?.salesUpdatedAt ?? null;
  const rentalUpdated = suburb?.rentalUpdatedAt ?? null;

  const appraisalHref = `/appraisal?address=${encodeURIComponent(addressFullDisplay)}`;

  return (
    <>
      <PlaceJsonLd
        name={addressFullDisplay}
        url={`/property/${slug}`}
        streetAddress={streetAddress}
        addressLocality={localityDisplay}
        addressRegion={address.state}
        postalCode={address.postcode}
        {...(mapLat && mapLng ? { latitude: mapLat, longitude: mapLng } : {})}
      />
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

      {/* HERO — taller map with floating value badge + CTA */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
          {mapLat && mapLng ? (
            <div className="relative rounded-3xl overflow-hidden border border-gray-200 shadow-sm">
              <div className="hidden lg:block">
                <PropertyMap lat={mapLat} lng={mapLng} address={addressFullDisplay} height={520} className="w-full h-full" />
              </div>
              <div className="lg:hidden">
                <PropertyMap lat={mapLat} lng={mapLng} address={addressFullDisplay} height={340} className="w-full h-full" />
              </div>

              {/* subtle gradient overlays for legibility */}
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/20 via-black/5 to-transparent z-[300] pointer-events-none" />

              {/* top-left chip — building or parcel */}
              {(buildingDisplay || address.legalParcelId) && (
                <div className="absolute left-4 top-4 z-[400] inline-flex items-center gap-1.5 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full border border-gray-200 shadow-sm text-xs font-medium text-gray-700">
                  <Landmark className="h-3.5 w-3.5 text-primary" />
                  {buildingDisplay ?? `Parcel ${address.legalParcelId}`}
                </div>
              )}

              {/* bottom-right floating value badge */}
              {valueRange && (
                <a
                  href="#value"
                  className="absolute right-4 bottom-4 z-[400] hidden sm:flex flex-col items-end bg-white/97 backdrop-blur px-4 py-3 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow group"
                >
                  <span className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">Estimated value</span>
                  <span className="text-2xl font-bold text-gray-900 leading-none mt-0.5">{formatPrice(valueRange.mid)}</span>
                  <span className="text-xs text-gray-500 mt-1">
                    {formatPrice(valueRange.low)} – {formatPrice(valueRange.high)} <span className="text-primary group-hover:translate-x-0.5 inline-block transition-transform">→</span>
                  </span>
                </a>
              )}

              {/* bottom-left CTA */}
              <Link
                href={appraisalHref}
                className="absolute left-4 bottom-4 z-[400] inline-flex items-center gap-2 bg-white/97 backdrop-blur px-3.5 py-2 rounded-full border border-gray-200 shadow-md text-sm font-medium text-gray-800 hover:bg-white transition-colors"
              >
                <FileText className="h-4 w-4 text-primary" />
                Free property report
              </Link>
            </div>
          ) : (
            <div className="rounded-3xl bg-gray-50 border border-gray-200 h-72 flex items-center justify-center text-gray-400">
              <MapPin className="h-8 w-8 mr-2 opacity-30" />
              <span>Location not available</span>
            </div>
          )}
        </div>
      </div>

      {/* TITLE STRIP */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-7 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="min-w-0">
              {buildingDisplay && (
                <p className="text-sm text-gray-500 mb-1.5 font-medium uppercase tracking-wide">{buildingDisplay}</p>
              )}
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-gray-900 tracking-tight leading-[1.1]">
                {streetAddress}
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                {localityDisplay}, {address.state} {address.postcode}
              </p>

              {/* property snapshot — pills with circular icon backgrounds */}
              <div className="flex flex-wrap items-center gap-2 mt-5">
                {propertyTypeLabel && (
                  <span className="inline-flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-sm text-gray-800">
                    <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Home className="h-3.5 w-3.5 text-primary" />
                    </span>
                    <span className="font-medium">{propertyTypeLabel}</span>
                  </span>
                )}
                {featured && (
                  <>
                    <span className="inline-flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-sm text-gray-800">
                      <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bed className="h-3.5 w-3.5 text-primary" />
                      </span>
                      <span className="font-medium">{featured.bedrooms} <span className="text-gray-500 font-normal">bed</span></span>
                    </span>
                    <span className="inline-flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-sm text-gray-800">
                      <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bath className="h-3.5 w-3.5 text-primary" />
                      </span>
                      <span className="font-medium">{featured.bathrooms} <span className="text-gray-500 font-normal">bath</span></span>
                    </span>
                    <span className="inline-flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-sm text-gray-800">
                      <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Car className="h-3.5 w-3.5 text-primary" />
                      </span>
                      <span className="font-medium">{featured.carSpaces} <span className="text-gray-500 font-normal">car</span></span>
                    </span>
                    {featured.landSize && (
                      <span className="inline-flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-sm text-gray-800">
                        <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <Maximize2 className="h-3.5 w-3.5 text-primary" />
                        </span>
                        <span className="font-medium">{featured.landSize} <span className="text-gray-500 font-normal">m²</span></span>
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* last sold pill — VG sale takes priority */}
              {(vgSales[0] || (hasRealSaleHistory && address.lastSalePrice)) && (
                <div className="mt-3 inline-flex items-center gap-2 text-xs text-gray-600">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Last sold{" "}
                  <strong className="text-gray-900 font-semibold">
                    {vgSales[0]
                      ? formatPriceFull(vgSales[0].price)
                      : formatPriceFull(address.lastSalePrice!)}
                  </strong>
                  <span className="text-gray-400">·</span>
                  <span>
                    {vgSales[0]
                      ? formatDate(vgSales[0].contractDate.toISOString())
                      : new Date(address.lastSaleDate!).toLocaleDateString("en-AU", { month: "long", year: "numeric" })}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-stretch flex-shrink-0">
              <a
                href="#track"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm whitespace-nowrap"
              >
                Track this property&apos;s value
              </a>
              <Link
                href={appraisalHref}
                className="inline-flex items-center justify-center gap-1 px-5 py-3 rounded-full border-2 border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition-colors whitespace-nowrap"
              >
                Get a free appraisal <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* MAIN COLUMN */}
          <div className="lg:col-span-2 space-y-12">

            {/* PROPERTY VALUE + RENTAL ESTIMATE — bold full-width panel */}
            {(valueRange || rentPerWeek) && (
              <section id="value" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Property value</h2>
                <p className="text-sm text-gray-500 mb-5">
                  Indicative estimate based on {suburb?.name ?? "this suburb"}&apos;s median —
                  not a formal valuation.
                </p>

                <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-white via-white to-primary/[0.03] overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                    {/* Big value column */}
                    {valueRange && (
                      <div className="lg:col-span-3 p-6 lg:p-7">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs uppercase tracking-wide font-semibold text-gray-500">Estimated value</p>
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            Indicative
                          </span>
                        </div>
                        <p className="text-5xl lg:text-6xl font-bold text-gray-900 leading-none tracking-tight">
                          {formatPrice(valueRange.mid)}
                        </p>

                        {/* low / high range visualization */}
                        <div className="mt-5">
                          <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="absolute inset-y-0 left-[15%] right-[15%] bg-gradient-to-r from-primary/40 via-primary to-primary/40 rounded-full" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-white border-2 border-primary shadow-sm" />
                          </div>
                          <div className="flex justify-between mt-2 text-xs">
                            <div>
                              <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">Low</p>
                              <p className="text-sm font-semibold text-gray-700">{formatPrice(valueRange.low)}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">High</p>
                              <p className="text-sm font-semibold text-gray-700">{formatPrice(valueRange.high)}</p>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-gray-400 mt-4">
                          Updated {valuationUpdated ? formatDate(valuationUpdated.toISOString()) : "recently"}
                        </p>
                      </div>
                    )}

                    {/* Rental column */}
                    {rentPerWeek && (
                      <div className="lg:col-span-2 p-6 lg:p-7 bg-gray-50/40">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs uppercase tracking-wide font-semibold text-gray-500">Rental estimate</p>
                          <HelpCircle className="h-4 w-4 text-gray-300" aria-hidden />
                        </div>
                        <p className="text-4xl lg:text-5xl font-bold text-gray-900 leading-none tracking-tight">
                          ${rentPerWeek}
                          <span className="text-base font-normal text-gray-500 ml-1">/wk</span>
                        </p>
                        {rentalYield && (
                          <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                            <TrendingUp className="h-4 w-4" />
                            {rentalYield.toFixed(1)}% gross yield
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-4">
                          Updated {rentalUpdated ? formatDate(rentalUpdated.toISOString()) : "recently"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer row */}
                  <div className="border-t border-gray-100 bg-white/60 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
                    <span>
                      Estimate based on {suburb?.name ?? "suburb"} medians — not a formal valuation.
                    </span>
                    <Link
                      href={appraisalHref}
                      className="inline-flex items-center gap-1 text-primary font-semibold hover:underline"
                    >
                      Get a property-specific appraisal <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </section>
            )}

            {/* SALE PRICE CHART */}
            {vgSales.length >= 2 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Sale price growth</h2>
                <p className="text-sm text-gray-500 mb-5">
                  How this property&apos;s sale price has changed over time.
                </p>
                <PropertyPriceChart
                  points={vgSales.map((s) => ({ date: s.contractDate, price: s.price }))}
                  suburbMedian={suburb?.medianHousePrice ?? null}
                />
              </section>
            )}

            {/* ABOUT */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">About the property</h2>
              <div className="prose prose-sm max-w-none text-gray-700 space-y-3">
                <p>
                  {addressFullDisplay} is{propertyTypeLabel ? ` a ${propertyTypeLabel.toLowerCase()}` : " a property"} in {localityDisplay},{" "}
                  {address.state} {address.postcode}
                  {hasRealSaleHistory && address.lastSalePrice ? (
                    <>
                      {" "}— last sold for{" "}
                      <strong>{formatPriceFull(address.lastSalePrice)}</strong>
                      {" "}in {new Date(address.lastSaleDate!).toLocaleDateString("en-AU", { month: "long", year: "numeric" })}.
                    </>
                  ) : valueRange ? (
                    <>
                      {" "}— estimated to be worth around{" "}
                      <strong>{formatPrice(valueRange.mid)}</strong>, with an indicative range of{" "}
                      {formatPrice(valueRange.low)}–{formatPrice(valueRange.high)} based on suburb medians.
                    </>
                  ) : (
                    <>.</>
                  )}
                </p>
                {isLikelyAptBlock && (
                  <p className="text-gray-600">
                    This address is part of a residential complex with{" "}
                    <strong>{address.saleCount}+ recorded sales</strong> across multiple units.
                    Individual unit prices vary — see history below for the full record.
                  </p>
                )}
                {!hasRealSaleHistory && soldHistory[0]?.dateSold && (
                  <p>
                    {addressFullDisplay} last listed as sold in{" "}
                    {new Date(soldHistory[0].dateSold).getFullYear()}
                    {soldHistory[0].soldPrice ? (
                      <> for <strong>{formatPriceFull(soldHistory[0].soldPrice)}</strong>.</>
                    ) : (
                      <>.</>
                    )}
                  </p>
                )}
                {address.streetName && (
                  <p>
                    Explore the Street Profile for{" "}
                    <Link
                      href={`/suburbs/${address.suburbSlug}/${streetSlug(address.streetName, address.streetType, address.streetSuffix)}`}
                      className="text-primary hover:underline"
                    >
                      {toTitleCase(address.streetName)} {toTitleCase(address.streetType)}
                    </Link>
                    {suburb && (
                      <>
                        {" "}in{" "}
                        <Link href={`/suburbs/${suburb.slug}`} className="text-primary hover:underline">
                          {suburb.name}
                        </Link>
                      </>
                    )}
                    .
                  </p>
                )}
              </div>
            </section>

            {/* PROPERTY HISTORY */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Property history</h2>
              <p className="text-sm text-gray-500 mb-5">
                {vgSales.length > 0
                  ? `${vgSales.length} sale${vgSales.length === 1 ? "" : "s"} recorded for this address.`
                  : "Listing and sale events recorded at this address."}
              </p>
              {vgSales.length > 0 || soldHistory.length > 0 || listings.length > 0 ? (
                <ol className="relative border-l-2 border-gray-100 ml-2 space-y-6">
                  {/* Authoritative VG sales first */}
                  {vgSales.map((s) => (
                    <li key={s.id} className="ml-6">
                      <span className="absolute -left-[9px] flex items-center justify-center w-4 h-4 rounded-full bg-primary ring-4 ring-white" />
                      <div className="rounded-xl border border-gray-200 p-4 bg-white">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="inline-block text-[11px] font-semibold uppercase tracking-wide bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            Sold
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {formatPriceFull(s.price)}
                          </span>
                          <span className="text-xs text-gray-500">
                            · {formatDate(s.contractDate.toISOString())}
                          </span>
                          {s.natureCode === "V" && (
                            <span className="text-[11px] uppercase tracking-wide bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              Vacant land
                            </span>
                          )}
                          {s.natureCode === "3" && (
                            <span className="text-[11px] uppercase tracking-wide bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              Strata
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          Source: {s.source === "vg-nsw" ? "NSW Valuer General" : s.source}
                        </p>
                      </div>
                    </li>
                  ))}
                  {/* Internal sold listings (not in VG, e.g. agency-uploaded sold) */}
                  {soldHistory.map((p) => (
                    <li key={p.id} className="ml-6">
                      <span className="absolute -left-[9px] flex items-center justify-center w-4 h-4 rounded-full bg-primary/60 ring-4 ring-white" />
                      <div className="rounded-xl border border-gray-200 p-4 bg-white">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="inline-block text-[11px] font-semibold uppercase tracking-wide bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            Sold (listing)
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {p.soldPrice ? formatPriceFull(p.soldPrice) : (p.priceDisplay ?? "Price undisclosed")}
                          </span>
                          {p.dateSold && (
                            <span className="text-xs text-gray-500">
                              · {formatDate(p.dateSold.toISOString())}
                            </span>
                          )}
                        </div>
                        <Link
                          href={`/sold/${p.slug}`}
                          className="text-xs text-primary hover:underline"
                        >
                          View sale details →
                        </Link>
                      </div>
                    </li>
                  ))}
                  {/* Active/recent listings */}
                  {listings
                    .filter((p) => !soldHistory.some((s) => s.id === p.id))
                    .map((p) => (
                      <li key={p.id} className="ml-6">
                        <span className="absolute -left-[9px] flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white" />
                        <div className="rounded-xl border border-gray-200 p-4 bg-white">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="inline-block text-[11px] font-semibold uppercase tracking-wide bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                              Listed for {p.listingType}
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {p.priceDisplay ?? "—"}
                            </span>
                            <span className="text-xs text-gray-500">
                              · {formatDate(p.dateAdded.toISOString())}
                            </span>
                          </div>
                          <Link
                            href={`/${p.listingType === "rent" ? "rent" : "buy"}/${p.slug}`}
                            className="text-xs text-primary hover:underline"
                          >
                            View listing →
                          </Link>
                        </div>
                      </li>
                    ))}
                </ol>
              ) : (
                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-6 text-sm text-gray-500">
                  No public listing or sale history is recorded for this address.
                </div>
              )}

              {/* NSW VG attribution — required by licence when displaying VG sales */}
              {vgSales.some((s) => s.source === "vg-nsw") && (
                <p className="text-xs text-gray-400 mt-4">
                  Contains property sales information provided under licence from the NSW Valuer
                  General, sourced directly from{" "}
                  <a href="https://valuergeneral.nsw.gov.au/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    valuergeneral.nsw.gov.au
                  </a>
                  {" "}and licensed under{" "}
                  <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    CC BY 4.0
                  </a>
                  .
                </p>
              )}
            </section>

            {/* LAND ZONING */}
            {zoningOverlay && (() => {
              const ATTRIBUTIONS: Record<string, string> = {
                "nsw-epi-zoning":    "NSW Department of Planning, Housing and Infrastructure (CC BY 4.0)",
                "vic-vicmap-zoning": "State of Victoria, Department of Transport and Planning — Vicmap Planning (CC BY 4.0)",
                "act-tp-zoning":     "ACT Government Geospatial Data Catalogue, ACTmapi (CC BY 4.0)",
                "tas-tps-zoning":    "Tasmanian Government — LIST OpenData (CC BY 3.0 AU)",
              };
              const attribution = ATTRIBUTIONS[zoningOverlay.source] ?? `${zoningOverlay.source} (CC BY)`;
              const a = zoningOverlay.attrs as {
                epiName?: string; schemeCode?: string; lga?: string;
                division?: string; scheme?: string; zoneAbb?: string;
              } | null;
              const scheme = a?.epiName ?? a?.scheme ?? (a?.schemeCode ? `${a.schemeCode} planning scheme` : null);
              const locality = a?.lga ?? a?.division;
              return (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Land zoning</h2>
                  <p className="text-sm text-gray-500 mb-5">Statutory zone classification at this address.</p>
                  <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <p className="text-sm font-semibold text-gray-700">Land zoning</p>
                      <p className="text-xs text-gray-400">Source: {attribution}</p>
                    </div>
                    <div className="flex flex-wrap items-baseline gap-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">
                        {zoningOverlay.code}
                      </span>
                      {zoningOverlay.label && (
                        <span className="text-base text-gray-900 font-semibold">{zoningOverlay.label}</span>
                      )}
                    </div>
                    {scheme && (
                      <p className="text-xs text-gray-500 mt-2">Under {scheme}{locality ? ` (${locality})` : ""}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-3">
                      Indicative — confirm permitted uses with local council before relying on this.
                    </p>
                  </div>
                </section>
              );
            })()}

            {/* PERILS AND ZONES — 3-card row */}
            {(() => {
              const floodLevel    = hazard?.floodClass?.toLowerCase().trim() ?? null;
              const bushfireLevel = hazard?.bushfireRisk?.toLowerCase().trim() ?? null;
              const floodDetected    = floodLevel === "high" || floodLevel === "medium" || floodLevel === "floodway";
              const bushfireDetected = bushfireLevel === "high" || bushfireLevel === "medium";

              // States where each layer's ingest has run. Used to distinguish
              // "ingested but address didn't match" (Not detected) from "no
              // ingest yet for this state" (No data).
              const FLOOD_INGESTED    = new Set(["NSW", "VIC", "QLD", "ACT"]);
              const BUSHFIRE_INGESTED = new Set(["NSW", "VIC", "WA", "TAS", "ACT"]);
              const HERITAGE_INGESTED = new Set(["NSW", "VIC", "QLD", "ACT", "TAS"]);
              const stateHasFloodIngest    = FLOOD_INGESTED.has(address.state);
              const stateHasBushfireIngest = BUSHFIRE_INGESTED.has(address.state);
              const stateHasHeritageIngest = HERITAGE_INGESTED.has(address.state);

              const PORTAL: Record<string, { name: string; url: string }> = {
                NSW: { name: "planningportal.nsw.gov.au",   url: "https://www.planningportal.nsw.gov.au" },
                VIC: { name: "mapshare.vic.gov.au/vicplan", url: "https://mapshare.vic.gov.au/vicplan/" },
                QLD: { name: "planning.statedevelopment.qld.gov.au", url: "https://planning.statedevelopment.qld.gov.au" },
                ACT: { name: "actmapi.act.gov.au",          url: "https://www.actmapi.act.gov.au" },
                TAS: { name: "thelist.tas.gov.au",          url: "https://www.thelist.tas.gov.au" },
                SA:  { name: "saplanningportal.sa.gov.au",  url: "https://saplanningportal.sa.gov.au" },
                WA:  { name: "planning.wa.gov.au",          url: "https://www.planning.wa.gov.au" },
                NT:  { name: "nt.gov.au",                   url: "https://nt.gov.au" },
              };
              const portal = PORTAL[address.state];

              const PillDetected = () => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  Detected
                </span>
              );
              const PillNotDetected = () => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
                  Not detected
                </span>
              );
              const PillNoData = () => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-400 border border-gray-200">
                  No data
                </span>
              );

              return (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Perils and zones</h2>
                  <p className="text-sm text-gray-500 mb-5">Local area overlays that may impact this property.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Flood — prefer parcel-level overlay over suburb-level */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                          <Droplets className="h-5 w-5 text-blue-500" />
                        </span>
                        <span className="font-semibold text-gray-900">Flood risk</span>
                      </div>
                      {floodOverlay
                        ? <PillDetected />
                        : hazard?.floodClass != null
                          ? (floodDetected ? <PillDetected /> : <PillNotDetected />)
                          : stateHasFloodIngest
                            ? <PillNotDetected />
                            : <PillNoData />}
                    </div>

                    {/* Bushfire — prefer parcel-level overlay over suburb-level */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center">
                          <Flame className="h-5 w-5 text-orange-500" />
                        </span>
                        <span className="font-semibold text-gray-900">Bushfire risk</span>
                      </div>
                      {bushfireOverlay
                        ? <PillDetected />
                        : hazard?.bushfireRisk != null
                          ? (bushfireDetected ? <PillDetected /> : <PillNotDetected />)
                          : stateHasBushfireIngest
                            ? <PillNotDetected />
                            : <PillNoData />}
                    </div>

                    {/* Heritage — parcel-level overlay only */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="h-10 w-10 rounded-full bg-stone-50 flex items-center justify-center">
                          <Landmark className="h-5 w-5 text-stone-500" />
                        </span>
                        <span className="font-semibold text-gray-900">Heritage zone</span>
                      </div>
                      {heritageOverlay
                        ? <PillDetected />
                        : stateHasHeritageIngest
                          ? <PillNotDetected />
                          : <PillNoData />}
                    </div>
                  </div>

                  {portal && (
                    <p className="text-sm text-gray-500 mt-4">
                      Visit{" "}
                      <a href={portal.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {portal.name}
                      </a>
                      {" "}for more information.
                    </p>
                  )}
                </section>
              );
            })()}

            {/* SUBURB SNAPSHOT — stats + demographics */}
            {suburb && (suburb.medianHousePrice > 0 || suburb.population > 0) && (
              <section>
                <div className="flex items-end justify-between mb-1">
                  <h2 className="text-2xl font-bold text-gray-900">About {suburb.name}</h2>
                  <Link href={`/suburbs/${suburb.slug}`} className="text-sm text-primary font-semibold hover:underline whitespace-nowrap">
                    Full suburb profile →
                  </Link>
                </div>
                <p className="text-sm text-gray-500 mb-5">
                  Market and demographic snapshot for {suburb.name} {suburb.postcode}.
                </p>

                {/* 4-stat grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  {suburb.medianHousePrice > 0 && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-4">
                      <p className="text-[11px] uppercase tracking-wide font-semibold text-gray-500">Median price</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1 leading-none">
                        {formatPrice(suburb.medianHousePrice)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1.5">Houses</p>
                    </div>
                  )}
                  {suburb.annualGrowthHouse !== 0 && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-4">
                      <p className="text-[11px] uppercase tracking-wide font-semibold text-gray-500">Annual growth</p>
                      <p className={`text-2xl font-bold mt-1 leading-none ${suburb.annualGrowthHouse >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {suburb.annualGrowthHouse > 0 ? "+" : ""}{suburb.annualGrowthHouse.toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-500 mt-1.5">12 months · houses</p>
                    </div>
                  )}
                  {suburb.medianRentHouse > 0 && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-4">
                      <p className="text-[11px] uppercase tracking-wide font-semibold text-gray-500">Median rent</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1 leading-none">
                        ${suburb.medianRentHouse}<span className="text-sm font-normal text-gray-500">/wk</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1.5">Houses</p>
                    </div>
                  )}
                  {suburb.daysOnMarket > 0 && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-4">
                      <p className="text-[11px] uppercase tracking-wide font-semibold text-gray-500">Days on market</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1 leading-none">
                        {suburb.daysOnMarket}
                      </p>
                      <p className="text-xs text-gray-500 mt-1.5">Suburb avg</p>
                    </div>
                  )}
                </div>

                {/* Demographics */}
                {(suburb.population > 0 || suburb.ownerOccupied > 0) && (
                  <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      Who lives here
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left: pop / age */}
                      <div className="space-y-4">
                        {suburb.population > 0 && (
                          <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-gray-900 leading-none">{suburb.population.toLocaleString()}</span>
                            <span className="text-sm text-gray-500">residents</span>
                          </div>
                        )}
                        {suburb.medianAge > 0 && (
                          <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-gray-900 leading-none">{suburb.medianAge}</span>
                            <span className="text-sm text-gray-500">median age</span>
                          </div>
                        )}
                      </div>

                      {/* Right: tenure + household bars */}
                      <div className="space-y-4">
                        {(suburb.ownerOccupied > 0 || suburb.renterOccupied > 0) && (
                          <div>
                            <div className="flex justify-between text-xs font-medium text-gray-600 mb-1.5">
                              <span>Owner-occupied <strong className="text-gray-900">{Math.round(suburb.ownerOccupied)}%</strong></span>
                              <span>Renters <strong className="text-gray-900">{Math.round(suburb.renterOccupied)}%</strong></span>
                            </div>
                            <div className="flex h-2.5 rounded-full overflow-hidden bg-gray-100">
                              <div className="bg-primary" style={{ width: `${suburb.ownerOccupied}%` }} />
                              <div className="bg-primary-lighter" style={{ width: `${suburb.renterOccupied}%` }} />
                            </div>
                          </div>
                        )}
                        {(suburb.householdsFamily > 0 || suburb.householdsLonePerson > 0) && (
                          <div>
                            <div className="flex justify-between text-xs font-medium text-gray-600 mb-1.5">
                              <span>Family <strong className="text-gray-900">{Math.round(suburb.householdsFamily)}%</strong></span>
                              <span>Lone-person <strong className="text-gray-900">{Math.round(suburb.householdsLonePerson)}%</strong></span>
                            </div>
                            <div className="flex h-2.5 rounded-full overflow-hidden bg-gray-100">
                              <div className="bg-emerald-500" style={{ width: `${suburb.householdsFamily}%` }} />
                              <div className="bg-emerald-300" style={{ width: `${suburb.householdsLonePerson}%` }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Walkability scores */}
                    {(suburb.walkScore || suburb.transitScore || suburb.bikeScore) && (
                      <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-gray-100">
                        {[
                          { label: "Walk", score: suburb.walkScore },
                          { label: "Transit", score: suburb.transitScore },
                          { label: "Bike", score: suburb.bikeScore },
                        ].map(({ label, score }) =>
                          score ? (
                            <div key={label} className="text-center">
                              <p className="text-2xl font-bold text-gray-900 leading-none">{score}</p>
                              <p className="text-[11px] text-gray-500 mt-1 uppercase tracking-wide font-medium">{label} score</p>
                            </div>
                          ) : null
                        )}
                      </div>
                    )}

                    <p className="text-xs text-gray-400 mt-4">
                      Source: <a href="https://www.abs.gov.au/census" target="_blank" rel="noopener noreferrer" className="hover:underline">ABS Census 2021</a>
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* GOVERNMENT SCHOOL CATCHMENT (NSW only for now) */}
            {(primaryCatchmentOverlay || secondaryCatchmentOverlay) && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Government school catchment</h2>
                <p className="text-sm text-gray-500 mb-5">
                  Public schools this address is zoned for. Always confirm directly with the
                  school before relying on this — boundaries can change year to year.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { overlay: primaryCatchmentOverlay,   level: "Primary"   },
                    { overlay: secondaryCatchmentOverlay, level: "Secondary" },
                  ].map(({ overlay, level }) => {
                    if (!overlay) return null;
                    const attrs = overlay.attrs as {
                      schoolName?: string;
                      schoolType?: string;
                      calendarYear?: number;
                    } | null;
                    const schoolName = attrs?.schoolName ?? overlay.label ?? "Unknown school";
                    const matched = catchmentSchools.find(
                      (s) => s.name.toLowerCase() === schoolName.toLowerCase(),
                    );
                    const schoolHref = matched?.acaraId
                      ? `/schools/${makeSchoolSlug(matched.name, matched.acaraId)}`
                      : null;

                    const inner = (
                      <div className="rounded-2xl border border-gray-200 bg-white p-5 h-full transition-colors hover:border-primary/40 hover:shadow-sm">
                        <div className="flex items-start gap-3">
                          <span className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <GraduationCap className="h-5 w-5 text-primary" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">
                              {level} catchment
                            </p>
                            <p className="font-semibold text-gray-900 mt-0.5 leading-snug">
                              {schoolName}
                            </p>
                            <div className="flex flex-wrap items-center gap-1.5 mt-2 text-xs text-gray-500">
                              {attrs?.schoolType && (
                                <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700">{attrs.schoolType}</span>
                              )}
                              {matched?.icsea && <span>ICSEA {matched.icsea}</span>}
                              {matched?.yearRange && <span>· {matched.yearRange}</span>}
                            </div>
                            {schoolHref && (
                              <p className="text-xs text-primary font-semibold mt-3">
                                View school details →
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                    return schoolHref ? (
                      <Link key={level} href={schoolHref} className="block">
                        {inner}
                      </Link>
                    ) : (
                      <div key={level}>{inner}</div>
                    );
                  })}
                </div>

                <p className="text-xs text-gray-400 mt-4">
                  Catchment polygons sourced from{" "}
                  <a
                    href="https://schoolfinder.education.nsw.gov.au/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    NSW Department of Education School Finder
                  </a>
                  {" "}(Centre for Education Statistics and Evaluation).
                </p>
              </section>
            )}

            {/* SCHOOLS NEARBY */}
            {schools.length > 0 && (
              <section>
                <div className="flex items-end justify-between mb-1">
                  <h2 className="text-2xl font-bold text-gray-900">Schools nearby</h2>
                  {suburb && (
                    <Link
                      href={`/suburbs/${suburb.slug}/schools`}
                      className="text-sm text-primary font-semibold hover:underline whitespace-nowrap"
                    >
                      View all schools →
                    </Link>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-5">
                  Local schools serving {localityDisplay}.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {schools.map((s) => {
                    const typeLabel =
                      s.type === "primary" ? "Primary" :
                      s.type === "secondary" ? "Secondary" :
                      s.type === "combined" ? "Combined" : "Special";
                    const sectorLabel =
                      s.sector === "government" ? "Government" :
                      s.sector === "catholic" ? "Catholic" : "Independent";
                    return (
                      <div key={s.id} className="rounded-2xl border border-gray-200 bg-white p-4 flex items-start gap-3">
                        <span className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="h-5 w-5 text-primary" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{s.name}</p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-900 text-white">{typeLabel}</span>
                            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700">{sectorLabel}</span>
                            {s.yearRange && (
                              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700">{s.yearRange}</span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                            <span>{s.distance.toFixed(1)} km away</span>
                            {s.icsea && <span>· ICSEA {s.icsea}</span>}
                            {s.enrolment && <span>· {s.enrolment.toLocaleString()} students</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-400 mt-4">© ACARA, licensed under CC BY 4.0.</p>
              </section>
            )}

            {/* ACTIVE LISTINGS AT THIS ADDRESS */}
            {listings.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Listings at this address</h2>
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

            {/* RECENT NEARBY SALES */}
            {nearbySales.length > 0 && (
              <section>
                <div className="flex items-end justify-between mb-1">
                  <h2 className="text-2xl font-bold text-gray-900">Recent nearby sales</h2>
                  {suburb && (
                    <Link
                      href={`/suburbs/${suburb.slug}/sold`}
                      className="text-sm text-primary font-semibold hover:underline whitespace-nowrap"
                    >
                      View all sales →
                    </Link>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-5">
                  Recent verified sales in {localityDisplay} (last 24 months).
                </p>
                <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                  <ul className="divide-y divide-gray-100">
                    {nearbySales.map((s) => (
                      <li key={s.id} className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5">
                        <div className="min-w-0">
                          <Link
                            href={`/property/${s.address?.slug ?? ""}`}
                            className="font-medium text-gray-900 hover:text-primary transition-colors truncate block"
                          >
                            {toTitleCase(s.address?.addressFull ?? "") ?? "—"}
                          </Link>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Sold {formatDate(s.contractDate.toISOString())}
                            {s.natureCode === "V" && <span className="ml-2 px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 text-[10px] uppercase tracking-wide">Vacant land</span>}
                            {s.natureCode === "3" && <span className="ml-2 px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 text-[10px] uppercase tracking-wide">Strata</span>}
                          </p>
                        </div>
                        <span className="text-base font-semibold text-gray-900 whitespace-nowrap">
                          {formatPriceFull(s.price)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                {nearbySales.some((s) => s.source === "vg-nsw") && (
                  <p className="text-xs text-gray-400 mt-3">
                    Contains NSW Valuer General property sales information, licensed under{" "}
                    <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="hover:underline">CC BY 4.0</a>.
                  </p>
                )}
              </section>
            )}

            {/* TRACK FORM */}
            <section id="track" className="scroll-mt-24">
              {listings.length === 0 && (
                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 mb-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Home className="h-5 w-5 text-gray-300 flex-shrink-0" />
                    <p className="text-sm text-gray-500">
                      This property is not currently listed for sale or rent.
                    </p>
                  </div>
                  <Link
                    href={`/buy?suburb=${localityDisplay}`}
                    className="flex-shrink-0 inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline whitespace-nowrap"
                  >
                    Browse {localityDisplay} <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
              <PropertyInterestForm
                address={addressFullDisplay}
                suburbName={localityDisplay}
                suburbSlug={address.suburbSlug ?? undefined}
              />
            </section>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Sell-side CTA — primary brand colour */}
              <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-sm">
                <h3 className="font-bold text-lg leading-tight">Looking to sell?</h3>
                <p className="text-sm text-white/85 mt-2 leading-relaxed">
                  Get a free, no-obligation appraisal from a local agent who knows the {localityDisplay} market.
                </p>
                <Link
                  href={appraisalHref}
                  className="mt-4 inline-flex items-center justify-center gap-1 w-full px-4 py-2.5 rounded-full bg-white text-primary text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Request a free appraisal <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Property details */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3">
                <h3 className="font-semibold text-gray-900">Property details</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between gap-3">
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
                  {propertyTypeLabel && (
                    <div className="flex justify-between pt-2 border-t border-gray-100">
                      <dt className="text-gray-500">Property type</dt>
                      <dd className="text-gray-900">{propertyTypeLabel}</dd>
                    </div>
                  )}
                  {featured && (
                    <>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Bed / Bath / Car</dt>
                        <dd className="text-gray-900">{featured.bedrooms} / {featured.bathrooms} / {featured.carSpaces}</dd>
                      </div>
                      {featured.landSize && (
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Land size</dt>
                          <dd className="text-gray-900">{featured.landSize} m²</dd>
                        </div>
                      )}
                    </>
                  )}
                </dl>

                {mapLat && mapLng && (
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(addressFullDisplay)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline pt-3 border-t border-gray-100"
                  >
                    Open in Google Maps <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              {/* Address source attribution */}
              <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 text-xs text-gray-500 space-y-1">
                <p className="font-medium text-gray-600">Address data source</p>
                <p>
                  This address is sourced from G-NAF (Geocoded National Address File), Australia&apos;s
                  authoritative geocoded address dataset, published by{" "}
                  <a href="https://data.gov.au" target="_blank" rel="noopener noreferrer" className="hover:underline">data.gov.au</a>
                  {" "}under Creative Commons Attribution 4.0.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PropertyMobileCTA appraisalHref={appraisalHref} />
    </>
  );
}
