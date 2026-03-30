import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Bed, Bath, Car, Ruler, Calendar, MapPin } from "lucide-react";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { AgentCardCompact } from "@/components/agent/AgentCard";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { Breadcrumbs } from "@/components/layout";
import { PropertyJsonLd, BreadcrumbJsonLd } from "@/components/seo";
import { Badge } from "@/components/ui";
import { getPropertyBySlug, getPropertiesBySuburb } from "@/lib/services/property-service";
import { getAgentById } from "@/lib/services/agent-service";
import { propertyTitle, propertyDescription, absoluteUrl } from "@/lib/utils/seo";
import { formatDate } from "@/lib/utils/format";
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

  const agent = await getAgentById(property.agentId);
  const relatedProperties = await getPropertiesBySuburb(property.suburbSlug, 3);
  const related = relatedProperties.filter((p) => p.id !== property.id).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <PropertyJsonLd property={property} />
      <BreadcrumbJsonLd
        items={[
          { name: "Buy", url: "/buy" },
          { name: property.address.suburb, url: `/suburbs/${property.suburbSlug}` },
          { name: property.address.street, url: `/buy/${property.slug}` },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Buy", href: "/buy" },
          { label: property.address.suburb, href: `/suburbs/${property.suburbSlug}` },
          { label: property.address.street },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <PropertyGallery images={property.images} address={property.address.full} />

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge>{property.propertyType}</Badge>
              {property.status === "under-contract" && (
                <Badge variant="warning">Under Contract</Badge>
              )}
              {property.isFeatured && <Badge variant="accent">Featured</Badge>}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {property.address.full}
            </h1>
            <p className="text-xl font-semibold text-gray-700 mt-1">
              {property.price.display}
            </p>
          </div>

          {/* Features */}
          <div className="flex items-center gap-6 py-4 border-y border-gray-200">
            <Feature icon={<Bed className="w-5 h-5" />} label={`${property.features.bedrooms} Beds`} />
            <Feature icon={<Bath className="w-5 h-5" />} label={`${property.features.bathrooms} Baths`} />
            <Feature icon={<Car className="w-5 h-5" />} label={`${property.features.carSpaces} Cars`} />
            {property.features.landSize && (
              <Feature icon={<Ruler className="w-5 h-5" />} label={`${property.features.landSize}m²`} />
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">About This Property</h2>
            <div className="text-gray-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </div>
          </div>

          {/* Inspection times */}
          {property.inspectionTimes && property.inspectionTimes.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Inspection Times</h2>
              <div className="space-y-2">
                {property.inspectionTimes.map((time, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-primary" />
                    {time}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-sm text-gray-400">
            Listed {formatDate(property.dateAdded)}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Agent card */}
          {agent && (
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Listing Agent
              </h3>
              <AgentCardCompact agent={agent} />
            </div>
          )}

          {/* Enquiry form */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
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
      </div>

      {/* Related listings */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            More Properties in {property.address.suburb}
          </h2>
          <PropertyGrid properties={related} />
        </div>
      )}
    </div>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-700">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
