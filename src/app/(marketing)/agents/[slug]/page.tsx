import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Phone, Mail, Star, MapPin, Award } from "lucide-react";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Breadcrumbs } from "@/components/layout";
import { AgentJsonLd, BreadcrumbJsonLd } from "@/components/seo";
import { Badge, Button } from "@/components/ui";
import { getAgentBySlug, getAgencyById } from "@/lib/services/agent-service";
import { getPropertiesByAgent } from "@/lib/services/property-service";
import { agentTitle, agentDescription, absoluteUrl } from "@/lib/utils/seo";
import { SITE_URL } from "@/lib/constants";

interface AgentProfilePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AgentProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const agent = await getAgentBySlug(slug);
  if (!agent) return { title: "Agent Not Found" };
  return {
    title: agentTitle(agent),
    description: agentDescription(agent),
    alternates: { canonical: `${SITE_URL}/agents/${slug}` },
    openGraph: {
      title: agentTitle(agent),
      description: agentDescription(agent),
      images: [{ url: absoluteUrl(agent.image) }],
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function AgentProfilePage({ params }: AgentProfilePageProps) {
  const { slug } = await params;
  const agent = await getAgentBySlug(slug);
  if (!agent) notFound();

  const [agency, properties] = await Promise.all([
    getAgencyById(agent.agencyId),
    getPropertiesByAgent(agent.id),
  ]);

  const activeListings = properties.filter((p) => p.status === "active");
  const soldListings = properties.filter((p) => p.status === "sold");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <AgentJsonLd agent={agent} />
      <BreadcrumbJsonLd
        items={[
          { name: "Agents", url: "/agents" },
          { name: agent.fullName, url: `/agents/${agent.slug}` },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Agents", href: "/agents" },
          { label: agent.fullName },
        ]}
      />

      {/* Profile header */}
      <div className="mt-6 flex flex-col sm:flex-row gap-6 items-start">
        <div className="relative w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
          <Image src={agent.image} alt={agent.fullName} fill className="object-cover" sizes="128px" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{agent.fullName}</h1>
          <p className="text-gray-500">{agent.title}</p>
          {agency && <p className="text-sm text-primary font-medium mt-1">{agency.name}</p>}
          <div className="flex items-center gap-1 mt-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-medium">{agent.averageRating}</span>
            <span className="text-sm text-gray-500">({agent.reviewCount} reviews)</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {agent.specialties.map((s) => (
              <Badge key={s} variant="primary">{s}</Badge>
            ))}
          </div>
          <div className="flex gap-4 mt-4">
            <a href={`tel:${agent.phone}`} className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary">
              <Phone className="w-4 h-4" /> {agent.phone}
            </a>
            <a href={`mailto:${agent.email}`} className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary">
              <Mail className="w-4 h-4" /> Email
            </a>
          </div>
        </div>
        <div className="flex gap-4 text-center">
          <div className="p-4 rounded-xl bg-gray-50">
            <p className="text-2xl font-bold text-gray-900">{agent.propertiesSold}</p>
            <p className="text-xs text-gray-500">Properties Sold</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50">
            <p className="text-2xl font-bold text-gray-900">{agent.yearsExperience}</p>
            <p className="text-xs text-gray-500">Years Experience</p>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-3">About {agent.firstName}</h2>
          <p className="text-gray-600 leading-relaxed">{agent.bio}</p>

          {/* Suburbs */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Areas Covered
            </h3>
            <div className="flex flex-wrap gap-2">
              {agent.suburbs.map((s) => (
                <Badge key={s} variant="outline">{s.split("-").slice(0, -2).join(" ").replace(/\b\w/g, (c) => c.toUpperCase())}</Badge>
              ))}
            </div>
          </div>

          {/* Active listings */}
          {activeListings.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Current Listings ({activeListings.length})
              </h2>
              <PropertyGrid properties={activeListings} />
            </div>
          )}

          {/* Sold listings */}
          {soldListings.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Recently Sold ({soldListings.length})
              </h2>
              <PropertyGrid properties={soldListings} />
            </div>
          )}
        </div>

        {/* Enquiry sidebar */}
        <div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Contact {agent.firstName}
            </h3>
            <EnquiryForm
              agentId={agent.id}
              agencyId={agent.agencyId}
              type="general-contact"
              defaultMessage={`Hi ${agent.firstName}, I'd like to discuss property in the Moreton Bay area.`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
