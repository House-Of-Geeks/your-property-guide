import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Bed, Bath, Car } from "lucide-react";
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

  // No auth() / isPropertySaved() here, kept off-server to keep this page
  // CDN-cacheable. PropertyActions fetches saved status client-side.
  const agent = await getAgentById(property.agentId);

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
            <div className="flex items-start justify-between gap-4 mt-3">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl text-ink leading-tight">
                  {property.address.full}
                </h1>
                <p className="font-display text-xl text-primary mt-2">
                  {property.price.display}
                </p>
              </div>
              <PropertyActions
                propertyId={property.id}
                address={property.address.full}
              />
            </div>
          </div>

          <div className="flex items-center gap-6 py-4 border-y border-line">
            <span className="flex items-center gap-2 text-ink-muted">
              <Bed className="w-5 h-5 text-ink-subtle" aria-hidden="true" />
              <span className="text-sm font-sans font-medium text-ink">{property.features.bedrooms} Beds</span>
            </span>
            <span className="flex items-center gap-2 text-ink-muted">
              <Bath className="w-5 h-5 text-ink-subtle" aria-hidden="true" />
              <span className="text-sm font-sans font-medium text-ink">{property.features.bathrooms} Baths</span>
            </span>
            <span className="flex items-center gap-2 text-ink-muted">
              <Car className="w-5 h-5 text-ink-subtle" aria-hidden="true" />
              <span className="text-sm font-sans font-medium text-ink">{property.features.carSpaces} Cars</span>
            </span>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink leading-tight mb-3">About this property</h2>
            <p className="font-sans text-base text-ink-muted leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {agent && (
            <div className="rounded-2xl bg-surface-raised border border-line p-5">
              <h3 className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-3">Property manager</h3>
              <AgentCardCompact agent={agent} />
            </div>
          )}
          <div className="rounded-2xl bg-surface-raised border border-line shadow-card p-6">
            <h3 className="font-display text-xl text-ink leading-tight mb-4">Enquire about this rental</h3>
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
