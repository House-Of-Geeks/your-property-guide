import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Car, Ruler, Calendar, MapPin, ChevronRight, Building2 } from "lucide-react";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyDescriptionExpand } from "@/components/property/PropertyDescriptionExpand";
import { PropertyFAQs } from "@/components/property/PropertyFAQs";
import { PropertySchoolTabs } from "@/components/property/PropertySchoolTabs";
import { PropertyCard } from "@/components/property/PropertyCard";
import { AgentSidebarCard } from "@/components/property/AgentSidebarCard";
import { Breadcrumbs } from "@/components/layout";
import { PropertyJsonLd, BreadcrumbJsonLd } from "@/components/seo";
import { Badge } from "@/components/ui";
import { getPropertyBySlug, getPropertiesByAgency } from "@/lib/services/property-service";
import { getAgentById, getAgencyById } from "@/lib/services/agent-service";
import { propertyTitle, propertyDescription, absoluteUrl } from "@/lib/utils/seo";
import { formatDate, formatPriceFull } from "@/lib/utils/format";
import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/constants";
import { auth } from "@/auth";
import { isPropertySaved } from "@/lib/actions/dashboard";
import { PropertyActions } from "@/components/property/PropertyActions";
import dynamic from "next/dynamic";

const PropertyMap = dynamic(
  () => import("@/components/property/PropertyMap").then((m) => m.PropertyMap),
  { ssr: false }
);

interface PropertyDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Property Not Found" };

  const title = propertyTitle(property);
  const description = propertyDescription(property);
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/buy/${property.slug}` },
    openGraph: {
      url: `${SITE_URL}/buy/${property.slug}`,
      title,
      description,
      images: [{ url: absoluteUrl(property.images[0]?.url ?? "") }],
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const session = await auth();
  const isLoggedIn = !!session?.user?.email;

  const [agent, coAgent, agency, suburbData, suburbHazard, agencyListings, initialSaved] = await Promise.all([
    getAgentById(property.agentId),
    property.coAgentId ? getAgentById(property.coAgentId) : Promise.resolve(null),
    getAgencyById(property.agencyId),
    db.suburb.findUnique({
      where: { slug: property.suburbSlug },
      include: {
        schools: {
          orderBy: { distance: "asc" },
          take: 8,
        },
      },
    }),
    db.suburbHazard.findUnique({ where: { suburbSlug: property.suburbSlug } }),
    getPropertiesByAgency(property.agencyId, 4),
    isPropertySaved(property.id),
  ]);

  const otherListings = agencyListings.filter((p) => p.id !== property.id).slice(0, 3);

  const mapAddress = encodeURIComponent(property.address.full);
  const mapLat = suburbData?.lat ?? null;
  const mapLng = suburbData?.lng ?? null;

  const schools = (suburbData?.schools ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    type: s.type,
    sector: s.sector,
    distance: s.distance,
    yearRange: s.yearRange,
    icsea: s.icsea,
  }));

  // Build FAQ data from property
  const faqs = [
    {
      question: `How many bedrooms does ${property.address.street}, ${property.address.suburb} ${property.address.state} ${property.address.postcode} have?`,
      answer: `${property.address.street} has ${property.features.bedrooms} bedroom${property.features.bedrooms !== 1 ? "s" : ""}, ${property.features.bathrooms} bathroom${property.features.bathrooms !== 1 ? "s" : ""} and ${property.features.carSpaces} car space${property.features.carSpaces !== 1 ? "s" : ""}.`,
    },
    ...(property.features.landSize ? [{
      question: `What is the land size of ${property.address.street}, ${property.address.suburb}?`,
      answer: `The land area of ${property.address.street} is ${property.features.landSize.toLocaleString()} m².${property.features.buildingSize ? ` The house size is ${property.features.buildingSize.toLocaleString()} m².` : ""}`,
    }] : []),
    {
      question: `What is the listing price for ${property.address.street}, ${property.address.suburb}?`,
      answer: `${property.address.street} is listed at ${property.price.display}. Contact the listing agent ${agent?.fullName ?? ""} at ${agency?.name ?? ""} for more information.`,
    },
    {
      question: `Who is the agent for ${property.address.street}, ${property.address.suburb}?`,
      answer: `The listing agent is ${agent?.fullName ?? "the agency"} from ${agency?.name ?? "the listed agency"}. You can enquire via the contact form on this page or call ${agent?.phone ?? ""}.`,
    },
    ...(suburbData ? [{
      question: `What is the median house price in ${property.address.suburb}?`,
      answer: `The median house price in ${property.address.suburb} is ${formatPriceFull(suburbData.medianHousePrice)}. The suburb has seen ${suburbData.annualGrowthHouse >= 0 ? "+" : ""}${suburbData.annualGrowthHouse.toFixed(1)}% annual growth.`,
    }] : []),
  ];

  return (
    <>
      <PropertyJsonLd property={property} />
      <BreadcrumbJsonLd
        items={[
          { name: "Buy", url: "/buy" },
          { name: property.address.suburb, url: `/suburbs/${property.suburbSlug}` },
          { name: property.address.street, url: `/buy/${property.slug}` },
        ]}
      />

      {/* ── Full-width gallery ─────────────────────────────────── */}
      <div className="-mx-0">
        <PropertyGallery
          images={property.images}
          address={property.address.full}
          inspectionTime={(property.inspectionTimes ?? [])[0]}
          agentPhone={agent?.phone}
          enquireHref="#enquire"
        />
      </div>

      {/* ── Breadcrumbs ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 border-b border-gray-100">
        <Breadcrumbs
          items={[
            { label: "Buy", href: "/buy" },
            { label: property.address.suburb, href: `/suburbs/${property.suburbSlug}` },
            { label: property.address.street },
          ]}
        />
      </div>

      {/* ── Main layout ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── LEFT column ──────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-10">

            {/* Price + address + stats */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {property.price.display}
                </p>
                <PropertyActions
                  propertyId={property.id}
                  address={property.address.full}
                  initialSaved={initialSaved}
                  isLoggedIn={isLoggedIn}
                />
              </div>
              <h1 className="text-lg text-gray-700 mt-1">
                {property.address.street},{" "}
                <Link href={`/suburbs/${property.suburbSlug}`} className="hover:text-primary hover:underline">
                  {property.address.suburb}
                </Link>{" "}
                {property.address.state} {property.address.postcode}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-gray-700">
                <span className="flex items-center gap-1.5 text-sm">
                  <Bed className="w-4 h-4 text-gray-400" />
                  <strong>{property.features.bedrooms}</strong>
                </span>
                <span className="flex items-center gap-1.5 text-sm">
                  <Bath className="w-4 h-4 text-gray-400" />
                  <strong>{property.features.bathrooms}</strong>
                </span>
                <span className="flex items-center gap-1.5 text-sm">
                  <Car className="w-4 h-4 text-gray-400" />
                  <strong>{property.features.carSpaces}</strong>
                </span>
                {property.features.landSize && (
                  <span className="flex items-center gap-1.5 text-sm">
                    <Ruler className="w-4 h-4 text-gray-400" />
                    <strong>{property.features.landSize.toLocaleString()} m²</strong>
                  </span>
                )}
                <Badge>{property.propertyType}</Badge>
                {property.status === "under-contract" && <Badge variant="warning">Under Contract</Badge>}
              </div>
            </div>

            {/* ── Property Description ─────────────────────────── */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Property Description</h2>
              <p className="text-xs text-gray-400 mb-3">
                {agency?.name ?? ""} &nbsp;·&nbsp; Listed {formatDate(property.dateAdded)}
              </p>
              <PropertyDescriptionExpand description={property.description} />
            </div>

            {/* ── Inspection Times (mobile only) ───────────────── */}
            {(property.inspectionTimes ?? []).length > 0 && (
              <div className="lg:hidden">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Inspection Times</h2>
                <div className="space-y-2">
                  {(property.inspectionTimes ?? []).map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700 border border-gray-200 rounded-lg px-4 py-3">
                      <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Map ──────────────────────────────────────────── */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Location</h2>
              <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                <MapPin className="w-3.5 h-3.5" />
                {property.address.full}
              </p>
              {mapLat && mapLng ? (
                <div>
                  <PropertyMap lat={mapLat} lng={mapLng} address={property.address.full} />
                  <a
                    href={`https://maps.google.com/?q=${mapAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-xs text-gray-500 hover:text-primary"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              ) : (
                <a
                  href={`https://maps.google.com/?q=${mapAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-32 rounded-xl border border-gray-200 bg-gray-50 text-sm text-primary hover:bg-gray-100"
                >
                  View on Google Maps →
                </a>
              )}
            </div>

            {/* ── School Catchment ─────────────────────────────── */}
            {schools.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  School Catchment Zones for {property.address.suburb}
                </h2>
                <p className="text-xs text-gray-400 mb-4">Schools near this property</p>
                <PropertySchoolTabs schools={schools} />
              </div>
            )}

            {/* ── Suburb Insights ───────────────────────────────── */}
            {suburbData && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Insights for {property.features.bedrooms}-bedroom homes in {property.address.suburb}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <InsightStat label="Median price" value={formatPriceFull(suburbData.medianHousePrice)} />
                  <InsightStat label="Annual growth" value={`${suburbData.annualGrowthHouse >= 0 ? "+" : ""}${suburbData.annualGrowthHouse.toFixed(1)}%`} />
                  <InsightStat label="Days on market" value={String(suburbData.daysOnMarket)} />
                  <InsightStat label="Median rent/wk" value={`$${suburbData.medianRentHouse}`} />
                </div>

                {/* Walkability + hazard badges */}
                {(suburbData.walkScore != null || suburbHazard) && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {suburbData.walkScore != null && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-medium text-blue-700">
                        Walk score: {suburbData.walkScore}
                      </span>
                    )}
                    {suburbHazard?.floodClass && suburbHazard.floodClass !== "low" && (
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${suburbHazard.floodClass === "high" || suburbHazard.floodClass === "floodway" ? "bg-red-50 border-red-200 text-red-700" : "bg-amber-50 border-amber-200 text-amber-700"}`}>
                        Flood: {suburbHazard.floodClass}
                      </span>
                    )}
                    {suburbHazard?.bushfireRisk && suburbHazard.bushfireRisk !== "low" && (
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${suburbHazard.bushfireRisk === "high" ? "bg-red-50 border-red-200 text-red-700" : "bg-amber-50 border-amber-200 text-amber-700"}`}>
                        Bushfire: {suburbHazard.bushfireRisk}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
                  <Link
                    href={`/suburbs/${property.suburbSlug}`}
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
                  >
                    View suburb profile <ChevronRight className="w-4 h-4" />
                  </Link>
                  <p className="text-xs text-gray-400">
                    Source:{" "}
                    <a
                      href="https://www.abs.gov.au/census"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      ABS Census {suburbData.statsSource?.includes("2021") ? "2021" : ""}
                    </a>
                    {suburbData.statsUpdatedAt
                      ? ` · updated ${new Date(suburbData.statsUpdatedAt).getFullYear()}`
                      : ""}
                  </p>
                </div>
              </div>
            )}

            {/* ── Other properties from this agency ─────────────── */}
            {otherListings.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  Other properties for sale from {agency?.name}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  {agency?.name} is currently selling {agencyListings.length} properties.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {otherListings.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>
              </div>
            )}

            {/* ── Property FAQs ─────────────────────────────────── */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Property FAQs
              </h2>
              <PropertyFAQs faqs={faqs} />
            </div>
          </div>

          {/* ── RIGHT: sticky sidebar (overlaps gallery) ────────────── */}
          <div className="hidden lg:block">
            <div className="sticky top-24 lg:-mt-48 relative z-10 px-2">
              {agent && (
                <AgentSidebarCard
                  agents={[agent, ...(coAgent ? [coAgent] : [])]}
                  agency={agency}
                  propertyId={property.id}
                  agencyId={property.agencyId}
                  propertyAddress={property.address.full}
                  inspectionTimes={property.inspectionTimes ?? []}
                  landSize={property.features.landSize}
                  buildingSize={property.features.buildingSize}
                  priceDisplay={property.price.display}
                />
              )}
            </div>
          </div>
        </div>

        {/* Mobile agent card */}
        {agent && (
          <div className="lg:hidden mt-8">
            <AgentSidebarCard
              agents={[agent, ...(coAgent ? [coAgent] : [])]}
              agency={agency}
              propertyId={property.id}
              agencyId={property.agencyId}
              propertyAddress={property.address.full}
              inspectionTimes={property.inspectionTimes ?? []}
              landSize={property.features.landSize}
              buildingSize={property.features.buildingSize}
              priceDisplay={property.price.display}
            />
          </div>
        )}
      </div>
    </>
  );
}

function InsightStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white shadow-card border border-gray-100 p-4 text-center">
      <p className="text-lg font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}
