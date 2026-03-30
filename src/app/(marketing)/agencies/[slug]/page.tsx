import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Phone, Mail, Globe, MapPin } from "lucide-react";
import { AgentCard } from "@/components/agent/AgentCard";
import { Breadcrumbs } from "@/components/layout";
import { AgencyJsonLd, BreadcrumbJsonLd } from "@/components/seo";
import { getAgencyBySlug, getAgentsByAgency } from "@/lib/services/agent-service";
import { agencyTitle, absoluteUrl } from "@/lib/utils/seo";
import { SITE_URL } from "@/lib/constants";

interface AgencyDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AgencyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const agency = await getAgencyBySlug(slug);
  if (!agency) return { title: "Agency Not Found" };
  return {
    title: agencyTitle(agency),
    description: agency.description,
    alternates: { canonical: `${SITE_URL}/agencies/${slug}` },
    openGraph: {
      title: agencyTitle(agency),
      description: agency.description,
      images: [{ url: absoluteUrl(agency.logo) }],
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function AgencyDetailPage({ params }: AgencyDetailPageProps) {
  const { slug } = await params;
  const agency = await getAgencyBySlug(slug);
  if (!agency) notFound();

  const agents = await getAgentsByAgency(agency.id);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <AgencyJsonLd agency={agency} />
      <BreadcrumbJsonLd
        items={[
          { name: "Agencies", url: "/agencies" },
          { name: agency.name, url: `/agencies/${agency.slug}` },
        ]}
      />
      <Breadcrumbs items={[{ label: "Agencies", href: "/agencies" }, { label: agency.name }]} />

      <div className="mt-6 flex flex-col sm:flex-row gap-6 items-start">
        <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
          <Image src={agency.logo} alt={agency.name} fill className="object-contain p-2" sizes="96px" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{agency.name}</h1>
          <p className="text-gray-600 mt-2 max-w-2xl">{agency.description}</p>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {agency.address.full}</span>
            <a href={`tel:${agency.phone}`} className="flex items-center gap-1 hover:text-primary"><Phone className="w-4 h-4" /> {agency.phone}</a>
            <a href={`mailto:${agency.email}`} className="flex items-center gap-1 hover:text-primary"><Mail className="w-4 h-4" /> {agency.email}</a>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Team ({agents.length} agents)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </div>
  );
}
