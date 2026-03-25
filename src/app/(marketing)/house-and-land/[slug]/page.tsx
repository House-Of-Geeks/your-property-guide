import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Bed, Bath, Car, Ruler, Package, CheckCircle } from "lucide-react";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Breadcrumbs } from "@/components/layout";
import { Badge } from "@/components/ui";
import { getHouseAndLandBySlug } from "@/lib/services/house-and-land-service";
import { getAgentById } from "@/lib/services/agent-service";
import { AgentCardCompact } from "@/components/agent/AgentCard";
import { SITE_NAME } from "@/lib/constants";

interface HouseAndLandDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: HouseAndLandDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getHouseAndLandBySlug(slug);
  if (!pkg) return { title: "Package Not Found" };
  return {
    title: `${pkg.title} - House & Land | ${SITE_NAME}`,
    description: `${pkg.title} in ${pkg.estate}, ${pkg.suburb}. ${pkg.features.bedrooms} bed, ${pkg.features.bathrooms} bath. ${pkg.price.display}.`,
  };
}

export default async function HouseAndLandDetailPage({ params }: HouseAndLandDetailPageProps) {
  const { slug } = await params;
  const pkg = await getHouseAndLandBySlug(slug);
  if (!pkg) notFound();

  const agent = await getAgentById(pkg.agentId);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumbs
        items={[
          { label: "House & Land", href: "/house-and-land" },
          { label: pkg.title },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pkg.images.map((img, i) => (
              <div key={i} className={`relative aspect-[4/3] rounded-xl overflow-hidden ${i === 0 ? "sm:col-span-2" : ""}`}>
                <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" />
              </div>
            ))}
          </div>

          <div>
            <div className="flex gap-2 mb-2">
              <Badge variant="primary">House & Land</Badge>
              {pkg.isNew && <Badge variant="accent">New</Badge>}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{pkg.price.display}</h1>
            <h2 className="text-lg text-gray-700 mt-1">{pkg.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {pkg.builder} &middot; {pkg.estate}, {pkg.suburb}
            </p>
          </div>

          <div className="flex items-center gap-6 py-4 border-y border-gray-200">
            <span className="flex items-center gap-2 text-gray-700"><Bed className="w-5 h-5" /> {pkg.features.bedrooms} Beds</span>
            <span className="flex items-center gap-2 text-gray-700"><Bath className="w-5 h-5" /> {pkg.features.bathrooms} Baths</span>
            <span className="flex items-center gap-2 text-gray-700"><Car className="w-5 h-5" /> {pkg.features.carSpaces} Cars</span>
            <span className="flex items-center gap-2 text-gray-700"><Ruler className="w-5 h-5" /> {pkg.features.landSize}m² land</span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">About This Package</h3>
            <p className="text-gray-600 leading-relaxed">{pkg.description}</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Inclusions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {pkg.inclusions.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {pkg.floorPlanImage && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Floor Plan</h3>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-200">
                <Image src={pkg.floorPlanImage} alt="Floor plan" fill className="object-contain bg-white" sizes="(max-width: 1024px) 100vw, 66vw" />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {agent && (
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Sales Agent</h3>
              <AgentCardCompact agent={agent} />
            </div>
          )}
          <div className="rounded-xl border border-gray-200 bg-white p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Enquire About This Package</h3>
            <EnquiryForm
              agentId={pkg.agentId}
              agencyId={pkg.agencyId}
              type="house-and-land-enquiry"
              defaultMessage={`Hi, I'm interested in the ${pkg.title} package in ${pkg.estate}.`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
