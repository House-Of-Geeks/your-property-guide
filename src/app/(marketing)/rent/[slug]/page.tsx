import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Bed, Bath, Car } from "lucide-react";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { AgentCardCompact } from "@/components/agent/AgentCard";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { PropertyJsonLd, BreadcrumbJsonLd } from "@/components/seo";
import { Badge } from "@/components/ui";
import { getPropertyBySlug } from "@/lib/services/property-service";
import { getAgentById } from "@/lib/services/agent-service";
import { propertyTitle, propertyDescription, absoluteUrl } from "@/lib/utils/seo";
import { SITE_URL } from "@/lib/constants";
import { PropertyActions } from "@/components/property/PropertyActions";
import { Band, HeroTitle, PhotoHero } from "@/components/premium";

interface RentDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 86400;
export const dynamicParams = true;
export function generateStaticParams() { return []; }

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
    <>
      <PropertyJsonLd property={property} />
      <BreadcrumbJsonLd
        items={[
          { name: "Rent", url: "/rent" },
          { name: property.address.street, url: `/rent/${property.slug}` },
        ]}
      />

      {/* Hero: plain charcoal (never the listing's own photo), carrying the
          address, the rent and the key features. */}
      <PhotoHero
        breadcrumbs={[
          { label: "Rent", href: "/rent" },
          { label: property.address.street },
        ]}
      >
        <div className="mb-5">
          <Badge variant="outline">For Rent</Badge>
        </div>
        <HeroTitle>
          {property.address.full}
        </HeroTitle>
        <p className="mt-6 text-3xl sm:text-4xl font-bold text-ink leading-none tracking-[-0.03em]">
          {property.price.display}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line pt-6">
          <span className="flex items-center gap-2 text-ink-muted">
            <Bed className="w-5 h-5 text-ink-subtle" aria-hidden="true" />
            <span className="text-base font-medium text-ink">{property.features.bedrooms} Beds</span>
          </span>
          <span className="flex items-center gap-2 text-ink-muted">
            <Bath className="w-5 h-5 text-ink-subtle" aria-hidden="true" />
            <span className="text-base font-medium text-ink">{property.features.bathrooms} Baths</span>
          </span>
          <span className="flex items-center gap-2 text-ink-muted">
            <Car className="w-5 h-5 text-ink-subtle" aria-hidden="true" />
            <span className="text-base font-medium text-ink">{property.features.carSpaces} Cars</span>
          </span>
        </div>
      </PhotoHero>

      {/* The listing's gallery and description beside the property manager and
          the enquiry form. PropertyActions sits here, not in the hero: the hero
          is its own stacking context, so its share modal would open under this
          band. */}
      <Band spacing="compact">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-xl overflow-hidden">
              <PropertyGallery images={property.images} address={property.address.full} />
            </div>

            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h2 className="text-2xl sm:text-3xl text-ink leading-tight tracking-[-0.02em]">About this property</h2>
                <PropertyActions
                  propertyId={property.id}
                  address={property.address.full}
                />
              </div>
              <p className="text-base sm:text-lg text-ink-muted leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {agent && (
              <div className="rounded-xl bg-surface-raised border border-line p-5">
                <h3 className="text-sm text-ink-subtle mb-3">Property manager</h3>
                <AgentCardCompact agent={agent} />
              </div>
            )}
            <div className="rounded-xl bg-surface-raised border border-line p-6">
              <h3 className="text-xl text-ink leading-tight mb-4">Enquire about this rental</h3>
              <EnquiryForm
                propertyId={property.id}
                agentId={property.agentId}
                agencyId={property.agencyId}
                defaultMessage={`Hi, I'm interested in renting ${property.address.full}.`}
              />
            </div>
          </div>
        </div>
      </Band>
    </>
  );
}
