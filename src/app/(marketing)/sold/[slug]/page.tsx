import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Bed, Bath, Car, Calendar } from "lucide-react";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { AgentSidebarCard } from "@/components/property/AgentSidebarCard";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, PropertyJsonLd } from "@/components/seo";
import { Badge } from "@/components/ui";
import { getPropertyBySlug } from "@/lib/services/property-service";
import { getAgentById, getAgencyById } from "@/lib/services/agent-service";
import { formatPriceFull, formatDate } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";
import { PropertyActions } from "@/components/property/PropertyActions";

interface SoldDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Sold listings never change after sale, could revalidate weekly, but
// 24h matches the rest of the property pages for operational consistency.
export const revalidate = 86400;
export const dynamicParams = true;
export function generateStaticParams() { return []; }

export async function generateMetadata({ params }: SoldDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Property Not Found" };
  const description = `${property.address.full} sold for ${property.soldPrice ? formatPriceFull(property.soldPrice) : "undisclosed price"}.`;
  return {
    title: `Sold - ${property.address.full}`,
    description,
    alternates: { canonical: `${SITE_URL}/sold/${slug}` },
    openGraph: {
      title: `Sold - ${property.address.full}`,
      description,
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function SoldDetailPage({ params }: SoldDetailPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  // No auth() / isPropertySaved() here, kept off-server to keep this page
  // CDN-cacheable. PropertyActions fetches saved status client-side.
  const [agent, agency] = await Promise.all([
    property.agentId ? getAgentById(property.agentId) : Promise.resolve(null),
    property.agencyId ? getAgencyById(property.agencyId) : Promise.resolve(null),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Sold", url: "/sold" },
          { name: property.address.street, url: `/sold/${property.slug}` },
        ]}
      />
      <PropertyJsonLd property={property} />
      <Breadcrumbs
        items={[
          { label: "Sold", href: "/sold" },
          { label: property.address.street },
        ]}
      />

      <div className="mt-4">
        <PropertyGallery images={property.images} address={property.address.full} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <Badge variant="success">Sold</Badge>
              <div className="flex items-start justify-between gap-4 mt-3">
                <h1 className="font-display text-2xl sm:text-3xl text-ink leading-tight">
                  {property.address.full}
                </h1>
                <PropertyActions
                  propertyId={property.id}
                  address={property.address.full}
                />
              </div>
              {property.soldPrice && (
                <p className="font-display text-xl text-primary mt-2">
                  {formatPriceFull(property.soldPrice)}
                </p>
              )}
              {property.dateSold && (
                <p className="text-sm font-sans text-ink-subtle flex items-center gap-1.5 mt-2">
                  <Calendar className="w-4 h-4" aria-hidden="true" /> Sold {formatDate(property.dateSold)}
                </p>
              )}
            </div>

            <div className="flex items-center gap-6 py-4 border-y border-line">
              <span className="flex items-center gap-2 text-ink-muted">
                <Bed className="w-5 h-5 text-ink-subtle" aria-hidden="true" />
                <span className="text-sm font-sans"><strong className="font-semibold text-ink">{property.features.bedrooms}</strong> Beds</span>
              </span>
              <span className="flex items-center gap-2 text-ink-muted">
                <Bath className="w-5 h-5 text-ink-subtle" aria-hidden="true" />
                <span className="text-sm font-sans"><strong className="font-semibold text-ink">{property.features.bathrooms}</strong> Baths</span>
              </span>
              <span className="flex items-center gap-2 text-ink-muted">
                <Car className="w-5 h-5 text-ink-subtle" aria-hidden="true" />
                <span className="text-sm font-sans"><strong className="font-semibold text-ink">{property.features.carSpaces}</strong> Cars</span>
              </span>
            </div>

            <div>
              <h2 className="font-display text-xl text-ink leading-tight mb-3">About this property</h2>
              <p className="font-sans text-base text-ink-muted leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>

            {/* Mobile agent card */}
            {agent && (
              <div className="lg:hidden">
                <AgentSidebarCard
                  agents={[agent]}
                  agency={agency}
                  propertyId={property.id}
                  agencyId={property.agencyId}
                  propertyAddress={property.address.full}
                  inspectionTimes={[]}
                  landSize={property.features.landSize}
                  priceDisplay={property.soldPrice ? formatPriceFull(property.soldPrice) : "Sold"}
                />
              </div>
            )}
          </div>

          {/* Right: sticky sidebar */}
          {agent && (
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <AgentSidebarCard
                  agents={[agent]}
                  agency={agency}
                  propertyId={property.id}
                  agencyId={property.agencyId}
                  propertyAddress={property.address.full}
                  inspectionTimes={[]}
                  landSize={property.features.landSize}
                  priceDisplay={property.soldPrice ? formatPriceFull(property.soldPrice) : "Sold"}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
