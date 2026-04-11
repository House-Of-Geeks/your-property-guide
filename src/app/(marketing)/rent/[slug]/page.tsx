import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Bed, Bath, Car, Ruler, MapPin } from "lucide-react";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { AgentCardCompact } from "@/components/agent/AgentCard";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Breadcrumbs } from "@/components/layout";
import { PropertyJsonLd, BreadcrumbJsonLd } from "@/components/seo";
import { Badge } from "@/components/ui";
import { getPropertyBySlug } from "@/lib/services/property-service";
import { getAgentById } from "@/lib/services/agent-service";
import { propertyTitle, propertyDescription, absoluteUrl } from "@/lib/utils/seo";
import { SITE_URL } from "@/lib/constants";
import { auth } from "@/auth";
import { isPropertySaved } from "@/lib/actions/dashboard";
import { PropertyActions } from "@/components/property/PropertyActions";

interface RentDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: RentDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Property Not Found" };
  const title = propertyTitle(property);
  const description = propertyDescription(property);
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/rent/${property.slug}` },
    openGraph: {
      url: `${SITE_URL}/rent/${property.slug}`,
      title,
      description,
      images: [{ url: absoluteUrl(property.images[0]?.url ?? "") }],
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RentDetailPage({ params }: RentDetailPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const session = await auth();
  const [agent, initialSaved] = await Promise.all([
    getAgentById(property.agentId),
    isPropertySaved(property.id),
  ]);
  const isLoggedIn = !!session?.user?.email;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <PropertyJsonLd property={property} />
      <BreadcrumbJsonLd
        items={[
          { name: "Rent", url: "/rent" },
          { name: property.address.street, url: `/rent/${property.slug}` },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Rent", href: "/rent" },
          { label: property.address.street },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <div className="lg:col-span-2 space-y-6">
          <PropertyGallery images={property.images} address={property.address.full} />
          <div>
            <Badge variant="accent">For Rent</Badge>
            <div className="flex items-start justify-between gap-4 mt-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {property.address.full}
                </h1>
                <p className="text-xl font-semibold text-gray-700 mt-1">
                  {property.price.display}
                </p>
              </div>
              <PropertyActions
                propertyId={property.id}
                address={property.address.full}
                initialSaved={initialSaved}
                isLoggedIn={isLoggedIn}
              />
            </div>
          </div>
          <div className="flex items-center gap-6 py-4 border-y border-gray-200">
            <span className="flex items-center gap-2 text-gray-700"><Bed className="w-5 h-5" /><span className="text-sm font-medium">{property.features.bedrooms} Beds</span></span>
            <span className="flex items-center gap-2 text-gray-700"><Bath className="w-5 h-5" /><span className="text-sm font-medium">{property.features.bathrooms} Baths</span></span>
            <span className="flex items-center gap-2 text-gray-700"><Car className="w-5 h-5" /><span className="text-sm font-medium">{property.features.carSpaces} Cars</span></span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">About This Property</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
          </div>
        </div>
        <div className="space-y-6">
          {agent && (
            <div className="rounded-xl bg-white shadow-card border border-gray-100 p-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Property Manager</h3>
              <AgentCardCompact agent={agent} />
            </div>
          )}
          <div className="rounded-xl bg-white shadow-card border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Enquire About This Rental</h3>
            <EnquiryForm
              propertyId={property.id}
              agentId={property.agentId}
              agencyId={property.agencyId}
              defaultMessage={`Hi, I'm interested in renting ${property.address.full}.`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
