import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Bed, Bath, Car, Ruler, CheckCircle } from "lucide-react";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { BreadcrumbJsonLd, HouseAndLandJsonLd } from "@/components/seo";
import { Badge } from "@/components/ui";
import { getHouseAndLandBySlug, getLiveHouseAndLandPackageCount } from "@/lib/services/house-and-land-service";
import { houseAndLandRobots } from "@/lib/house-and-land-indexability";
import { getAgentById } from "@/lib/services/agent-service";
import { AgentCardCompact } from "@/components/agent/AgentCard";
import { SITE_URL } from "@/lib/constants";
import { Band, HeroTitle, PhotoHero } from "@/components/premium";

interface HouseAndLandDetailPageProps {
  params: Promise<{ slug: string }>;
}

// A package page exists only for a live package (404 otherwise), so it is
// indexable whenever it renders, except in the window before the cached
// stock count sees a new package: then it follows the hub and the sitemap,
// which read the same count (src/lib/house-and-land-indexability.ts).
export async function generateMetadata({ params }: HouseAndLandDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getHouseAndLandBySlug(slug);
  if (!pkg) return { title: "Package Not Found" };
  const robots = houseAndLandRobots(await getLiveHouseAndLandPackageCount());
  const description = `${pkg.title} in ${pkg.estate}, ${pkg.suburb}. ${pkg.features.bedrooms} bed, ${pkg.features.bathrooms} bath. ${pkg.price.display}.`;
  return {
    title: `${pkg.title} - House & Land`,
    description,
    alternates: { canonical: `${SITE_URL}/house-and-land/${slug}` },
    ...(robots ? { robots } : {}),
    openGraph: {
      url: `${SITE_URL}/house-and-land/${slug}`,
      title: `${pkg.title} - House & Land`,
      description,
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function HouseAndLandDetailPage({ params }: HouseAndLandDetailPageProps) {
  const { slug } = await params;
  const pkg = await getHouseAndLandBySlug(slug);
  if (!pkg) notFound();

  const agent = await getAgentById(pkg.agentId);

  return (
    <>
      <HouseAndLandJsonLd pkg={pkg} />
      <BreadcrumbJsonLd
        items={[
          { name: "House & Land", url: "/house-and-land" },
          { name: pkg.title, url: `/house-and-land/${slug}` },
        ]}
      />

      {/* Hero: plain charcoal (never the package's own photo), carrying the
          title, the price, the builder and estate, and the key features. */}
      <PhotoHero
        breadcrumbs={[
          { label: "House & Land", href: "/house-and-land" },
          { label: pkg.title },
        ]}
      >
        <div className="flex gap-2 mb-5">
          <Badge variant="outline">House & Land</Badge>
          {pkg.isNew && <Badge variant="outline">New</Badge>}
        </div>
        <HeroTitle>{pkg.title}</HeroTitle>
        <p className="mt-6 text-3xl sm:text-4xl font-bold text-ink leading-tight tracking-[-0.03em]">{pkg.price.display}</p>
        <p className="text-base text-ink-muted mt-3">
          {pkg.builder} &middot; {pkg.estate}, {pkg.suburb}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line pt-6">
          <span className="flex items-center gap-2 text-ink-muted"><Bed className="w-5 h-5 text-ink-subtle" /> {pkg.features.bedrooms} Beds</span>
          <span className="flex items-center gap-2 text-ink-muted"><Bath className="w-5 h-5 text-ink-subtle" /> {pkg.features.bathrooms} Baths</span>
          <span className="flex items-center gap-2 text-ink-muted"><Car className="w-5 h-5 text-ink-subtle" /> {pkg.features.carSpaces} Cars</span>
          <span className="flex items-center gap-2 text-ink-muted"><Ruler className="w-5 h-5 text-ink-subtle" /> {pkg.features.landSize}m² land</span>
        </div>
      </PhotoHero>

      {/* The package's own photos and details beside the agent and the
          enquiry form. */}
      <Band spacing="compact">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-10">
            {/* Gallery */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pkg.images.map((img, i) => (
                <div key={i} className={`relative aspect-[4/3] rounded-xl overflow-hidden ${i === 0 ? "sm:col-span-2" : ""}`}>
                  <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" />
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-2xl text-ink leading-tight mb-3">About This Package</h3>
              <p className="text-base sm:text-lg text-ink-muted leading-relaxed">{pkg.description}</p>
            </div>

            <div>
              <h3 className="text-2xl text-ink leading-tight mb-4">Inclusions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                {pkg.inclusions.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-base text-ink-muted">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {pkg.floorPlanImage && (
              <div>
                <h3 className="text-2xl text-ink leading-tight mb-4">Floor Plan</h3>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-line">
                  <Image src={pkg.floorPlanImage} alt="Floor plan" fill className="object-contain bg-white" sizes="(max-width: 1024px) 100vw, 66vw" />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {agent && (
              <div className="rounded-xl bg-surface-raised border border-line p-5">
                <h3 className="text-sm font-semibold text-ink-subtle mb-3">Sales Agent</h3>
                <AgentCardCompact agent={agent} />
              </div>
            )}
            <div className="rounded-xl bg-surface-raised border border-line p-6 sticky top-24">
              <h3 className="text-xl text-ink leading-tight mb-4">Enquire About This Package</h3>
              <EnquiryForm
                agentId={pkg.agentId}
                agencyId={pkg.agencyId}
                type="house-and-land-enquiry"
                defaultMessage={`Hi, I'm interested in the ${pkg.title} package in ${pkg.estate}.`}
              />
            </div>
          </div>
        </div>
      </Band>
    </>
  );
}
