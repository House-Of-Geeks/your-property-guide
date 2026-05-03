import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  Droplets,
  ExternalLink,
  FileText,
  Flame,
  HelpCircle,
  Home,
  Landmark,
  MapPin,
  TrendingUp,
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
import { formatDate, formatPrice, formatPriceFull } from "@/lib/utils/format";
import { PropertyMap } from "@/components/property/PropertyMap";
import { PropertyInterestForm } from "@/components/property/PropertyInterestForm";

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
          rentalUpdatedAt: true,
          salesUpdatedAt: true,
          hazardUpdatedAt: true,
        },
      })
    : null;

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
  const propertyTypeLabel = (featured ? toTitleCase(featured.propertyType) : null) ?? "House";

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

      {/* HERO — interactive map with floating CTA */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
          {mapLat && mapLng ? (
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <PropertyMap lat={mapLat} lng={mapLng} address={addressFullDisplay} />
              <Link
                href={appraisalHref}
                className="absolute left-4 bottom-4 z-[400] inline-flex items-center gap-2 bg-white/95 backdrop-blur px-3.5 py-2 rounded-full border border-gray-200 shadow-md text-sm font-medium text-gray-800 hover:bg-white transition-colors"
              >
                <FileText className="h-4 w-4 text-primary" />
                Send the free property report
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl bg-gray-50 border border-gray-200 h-72 flex items-center justify-center text-gray-400">
              <MapPin className="h-8 w-8 mr-2 opacity-30" />
              <span>Location not available</span>
            </div>
          )}
        </div>
      </div>

      {/* TITLE BAR */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              {buildingDisplay && (
                <p className="text-sm text-gray-500 mb-1">{buildingDisplay}</p>
              )}
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                {streetAddress},
              </h1>
              <p className="text-lg text-gray-700 mt-1">
                {localityDisplay} {address.state} {address.postcode}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-600">
                <span className="inline-flex items-center gap-1.5">
                  <Home className="h-4 w-4 text-gray-400" /> {propertyTypeLabel}
                </span>
                {featured && (
                  <>
                    <span aria-hidden className="text-gray-300">•</span>
                    <span>{featured.bedrooms} bed</span>
                    <span aria-hidden className="text-gray-300">•</span>
                    <span>{featured.bathrooms} bath</span>
                    <span aria-hidden className="text-gray-300">•</span>
                    <span>{featured.carSpaces} car</span>
                    {featured.landSize && (
                      <>
                        <span aria-hidden className="text-gray-300">•</span>
                        <span>{featured.landSize} m²</span>
                      </>
                    )}
                  </>
                )}
                {!featured && address.legalParcelId && (
                  <>
                    <span aria-hidden className="text-gray-300">•</span>
                    <span>Parcel {address.legalParcelId}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 lg:items-end">
              <a
                href="#track"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm"
              >
                Is this your property? Track its value
              </a>
              <Link
                href={appraisalHref}
                className="inline-flex items-center justify-center text-primary text-sm font-semibold hover:underline"
              >
                Looking to sell? Get a free appraisal →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* MAIN COLUMN */}
          <div className="lg:col-span-2 space-y-12">

            {/* PROPERTY VALUE + RENTAL ESTIMATE */}
            {(valueRange || rentPerWeek) && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Property value</h2>
                <p className="text-sm text-gray-500 mb-5">
                  Indicative estimate based on {suburb?.name ?? "this suburb"}&apos;s median —
                  not a formal valuation.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Value card */}
                  {valueRange && (
                    <div className="rounded-2xl border border-gray-200 p-5 bg-white">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-700">Property value</p>
                          <p className="text-xs text-gray-400 mt-0.5">Updated {valuationUpdated ? formatDate(valuationUpdated.toISOString()) : "recently"}</p>
                        </div>
                        <HelpCircle className="h-4 w-4 text-gray-300" aria-hidden />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">Low</p>
                          <p className="text-lg font-semibold text-gray-700">{formatPrice(valueRange.low)}</p>
                        </div>
                        <div className="border-x border-gray-100 px-2">
                          <p className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">Mid</p>
                          <p className="text-2xl font-bold text-gray-900">{formatPrice(valueRange.mid)}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">High</p>
                          <p className="text-lg font-semibold text-gray-700">{formatPrice(valueRange.high)}</p>
                        </div>
                      </div>
                      <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        Indicative accuracy
                      </div>
                    </div>
                  )}

                  {/* Rental card */}
                  {rentPerWeek && (
                    <div className="rounded-2xl border border-gray-200 p-5 bg-white">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-700">Rental estimate</p>
                          <p className="text-xs text-gray-400 mt-0.5">Updated {rentalUpdated ? formatDate(rentalUpdated.toISOString()) : "recently"}</p>
                        </div>
                        <HelpCircle className="h-4 w-4 text-gray-300" aria-hidden />
                      </div>
                      <div className="flex items-baseline gap-3">
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">Per week</p>
                          <p className="text-3xl font-bold text-gray-900">${rentPerWeek}</p>
                        </div>
                        {rentalYield && (
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">
                            <TrendingUp className="h-3.5 w-3.5" />
                            {rentalYield.toFixed(1)}% rental yield
                          </span>
                        )}
                      </div>
                      <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        Indicative accuracy
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-400 mt-3">
                  These are estimates derived from suburb-level medians and should not be relied upon
                  for any financial decisions. For a property-specific valuation, request a{" "}
                  <Link href={appraisalHref} className="text-primary hover:underline">
                    free appraisal
                  </Link>
                  .
                </p>
              </section>
            )}

            {/* ABOUT */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">About the property</h2>
              <div className="prose prose-sm max-w-none text-gray-700 space-y-3">
                <p>
                  {addressFullDisplay} is a {propertyTypeLabel.toLowerCase()} in {localityDisplay},{" "}
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
                    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        <span className="font-medium text-gray-900">Flood risk</span>
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
                    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Flame className="h-5 w-5 text-orange-500 flex-shrink-0" />
                        <span className="font-medium text-gray-900">Bushfire risk</span>
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
                    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Landmark className="h-5 w-5 text-stone-500 flex-shrink-0" />
                        <span className="font-medium text-gray-900">Heritage zone</span>
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

              {mapLat && mapLng && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(addressFullDisplay)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline pt-2 border-t border-gray-100"
                >
                  Open in Google Maps <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            {suburb && (
              <div className="rounded-2xl border border-gray-200 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{suburb.name} snapshot</h3>
                  <Link href={`/suburbs/${suburb.slug}`} className="text-xs text-primary hover:underline">
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
