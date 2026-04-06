import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Car, Ruler, Calendar, MapPin, Phone, Mail, ChevronRight, Building2 } from "lucide-react";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyDescriptionExpand } from "@/components/property/PropertyDescriptionExpand";
import { PropertyFAQs } from "@/components/property/PropertyFAQs";
import { PropertySchoolTabs } from "@/components/property/PropertySchoolTabs";
import { PropertyCard } from "@/components/property/PropertyCard";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Breadcrumbs } from "@/components/layout";
import { PropertyJsonLd, BreadcrumbJsonLd } from "@/components/seo";
import { Badge } from "@/components/ui";
import { getPropertyBySlug, getPropertiesByAgency } from "@/lib/services/property-service";
import { getAgentById, getAgencyById } from "@/lib/services/agent-service";
import { propertyTitle, propertyDescription, absoluteUrl } from "@/lib/utils/seo";
import { formatDate, formatPriceFull } from "@/lib/utils/format";
import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/constants";

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

  const [agent, agency, suburbData, agencyListings] = await Promise.all([
    getAgentById(property.agentId),
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
    getPropertiesByAgency(property.agencyId, 4),
  ]);

  const otherListings = agencyListings.filter((p) => p.id !== property.id).slice(0, 3);

  const mapAddress = encodeURIComponent(property.address.full);
  const mapKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  const mapUrl = mapKey
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${mapAddress}&zoom=15&size=640x320&maptype=roadmap&markers=color:red%7C${mapAddress}&key=${mapKey}`
    : null;

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
        <PropertyGallery images={property.images} address={property.address.full} />
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
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {property.price.display}
              </p>
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
                {property.isFeatured && <Badge variant="accent">Featured</Badge>}
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
              {mapUrl ? (
                <a
                  href={`https://maps.google.com/?q=${mapAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl overflow-hidden border border-gray-200 hover:opacity-90 transition-opacity"
                >
                  <Image
                    src={mapUrl}
                    alt={`Map of ${property.address.full}`}
                    width={640}
                    height={320}
                    className="w-full"
                  />
                </a>
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
                <Link
                  href={`/suburbs/${property.suburbSlug}`}
                  className="inline-flex items-center gap-1 mt-4 text-sm text-primary hover:underline font-medium"
                >
                  View suburb profile <ChevronRight className="w-4 h-4" />
                </Link>
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

          {/* ── RIGHT: sticky sidebar ─────────────────────────────── */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-4">

              {/* Agent card */}
              {agent && (
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={agent.image}
                        alt={agent.fullName}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="min-w-0">
                      <Link href={`/agents/${agent.slug}`} className="text-sm font-semibold text-gray-900 hover:text-primary">
                        {agent.fullName}
                      </Link>
                      <p className="text-xs text-gray-500 truncate">{agent.title}</p>
                      {agency && (
                        <Link href={`/real-estate-agencies/${agency.slug}`} className="text-xs text-primary hover:underline truncate block">
                          {agency.name}
                        </Link>
                      )}
                    </div>
                    {agency && (
                      <Link href={`/real-estate-agencies/${agency.slug}`} className="flex-shrink-0 ml-auto">
                        <Image
                          src={agency.logo}
                          alt={agency.name}
                          width={64}
                          height={32}
                          className="object-contain max-h-8"
                        />
                      </Link>
                    )}
                  </div>

                  {/* Inspection times */}
                  {(property.inspectionTimes ?? []).length > 0 && (
                    <div className="mb-4 pb-4 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Inspection Times
                      </p>
                      {(property.inspectionTimes ?? []).map((t, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-gray-700 mb-1">
                          <Calendar className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          {t}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Enquire button */}
                  <a
                    href="#enquire"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors mb-2"
                  >
                    <Mail className="w-4 h-4" />
                    Enquire
                  </a>
                  <a
                    href={`tel:${agent.phone}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {agent.phone}
                  </a>

                  {/* Property info */}
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Property type</span>
                      <span className="font-medium text-gray-700 capitalize">{property.propertyType}</span>
                    </div>
                    {property.features.landSize && (
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Land size</span>
                        <span className="font-medium text-gray-700">{property.features.landSize.toLocaleString()} m²</span>
                      </div>
                    )}
                    {property.features.buildingSize && (
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>House size</span>
                        <span className="font-medium text-gray-700">{property.features.buildingSize.toLocaleString()} m²</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Listed</span>
                      <span className="font-medium text-gray-700">{formatDate(property.dateAdded)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Enquiry form */}
              <div id="enquire" className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="text-base font-bold text-gray-900 mb-4">Send Enquiry</h3>
                <EnquiryForm
                  propertyId={property.id}
                  agentId={property.agentId}
                  agencyId={property.agencyId}
                  defaultMessage={`Hi, I'm interested in ${property.address.full}.`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile enquiry form */}
        <div id="enquire" className="lg:hidden mt-10 rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="text-base font-bold text-gray-900 mb-4">
            Enquire About This Property
          </h3>
          <EnquiryForm
            propertyId={property.id}
            agentId={property.agentId}
            agencyId={property.agencyId}
            defaultMessage={`Hi, I'm interested in ${property.address.full}.`}
          />
        </div>
      </div>
    </>
  );
}

function InsightStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
      <p className="text-lg font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}
