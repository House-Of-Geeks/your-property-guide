import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, Building2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { AgentJsonLd, BreadcrumbJsonLd } from "@/components/seo";
import { AgentListingsTabs } from "@/components/agent/AgentListingsTabs";
import { AgentContactSection } from "@/components/agent/AgentContactSection";
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
  const title       = agent.metaTitle       ?? agentTitle(agent);
  const description = agent.metaDescription ?? agentDescription(agent);
  const image       = agent.ogImage         ?? absoluteUrl(agent.image);
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/agents/${slug}` },
    openGraph: { url: `${SITE_URL}/agents/${slug}`, title, description, images: [{ url: image }], type: "profile" },
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
  const soldListings   = properties.filter((p) => p.status === "sold");

  const heroBg = agency?.heroBg ?? null;

  return (
    <>
      <AgentJsonLd agent={agent} />
      <BreadcrumbJsonLd
        items={[
          { name: "Agents", url: "/agents" },
          { name: agent.fullName, url: `/agents/${agent.slug}` },
        ]}
      />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <div className="relative h-56 sm:h-64 bg-gray-800 overflow-hidden">
        {heroBg ? (
          <Image
            src={heroBg}
            alt={`${agency?.name ?? agent.agencyName} office`}
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-600" />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* ── Agent header ──────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end gap-5 -mt-12 pb-5">
            {/* Circle photo overlapping hero */}
            <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border-4 border-white shadow-lg z-10">
              <Image
                src={agent.image}
                alt={agent.imageAlt ?? `${agent.fullName} - ${agent.title}`}
                fill
                className="object-cover"
                sizes="96px"
                priority
              />
            </div>

            {/* Name / title / address */}
            <div className="flex-1 min-w-0 pt-14">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                    {agent.fullName}
                  </h1>
                  <p className="text-gray-500 text-sm mt-0.5">{agent.title}</p>

                  {/* Call / Email */}
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <a
                      href={`tel:${agent.phone}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors"
                    >
                      <Phone className="w-4 h-4" /> Call
                    </a>
                    <a
                      href={`mailto:${agent.email}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors"
                    >
                      <Mail className="w-4 h-4" /> Email
                    </a>
                  </div>
                </div>

                {/* Agency logo + address */}
                <div className="flex flex-col items-end gap-2 mt-2">
                  {agency && (
                    <Link href={`/real-estate-agencies/${agency.slug}`}>
                      <Image
                        src={agency.logo}
                        alt={agency.name}
                        width={120}
                        height={48}
                        className="object-contain max-h-12"
                      />
                    </Link>
                  )}
                  {agency && (
                    <p className="text-xs text-gray-500 flex items-center gap-1 text-right">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      {agency.address.full}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Breadcrumbs ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <Breadcrumbs
          items={[
            { label: "Real Estate Agents", href: "/agents" },
            ...(agency ? [{ label: agency.name, href: `/real-estate-agencies/${agency.slug}` }] : []),
            { label: agent.fullName },
          ]}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-10">

        {/* ── Properties count ──────────────────────────────────────── */}
        {activeListings.length > 0 && (
          <div className="border border-gray-200 rounded-xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Properties</p>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-gray-900">{activeListings.length}</span>
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">For Sale</span>
            </div>
          </div>
        )}

        {/* ── About ─────────────────────────────────────────────────── */}
        {agent.bio && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">About {agent.firstName}</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{agent.bio}</p>
          </div>
        )}

        {/* ── Sales stats ────────────────────────────────────────────── */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {agent.firstName}&apos;s statistics
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl bg-white shadow-card border border-gray-100 p-5 text-center">
              <p className="text-3xl font-bold text-primary">{agent.propertiesSold}</p>
              <p className="text-xs text-gray-500 mt-1">Total Sales</p>
            </div>
            <div className="rounded-xl bg-white shadow-card border border-gray-100 p-5 text-center">
              <p className="text-3xl font-bold text-primary">{agent.yearsExperience}</p>
              <p className="text-xs text-gray-500 mt-1">Years Experience</p>
            </div>
            {agent.reviewCount > 0 && (
              <div className="rounded-xl bg-white shadow-card border border-gray-100 p-5 text-center">
                <p className="text-3xl font-bold text-primary">{agent.averageRating}</p>
                <p className="text-xs text-gray-500 mt-1">Average Rating</p>
              </div>
            )}
            {agent.suburbs.length > 0 && (
              <div className="rounded-xl bg-white shadow-card border border-gray-100 p-5 text-center">
                <p className="text-3xl font-bold text-primary">{agent.suburbs.length}</p>
                <p className="text-xs text-gray-500 mt-1">Suburbs Covered</p>
              </div>
            )}
          </div>

          {/* Suburbs covered */}
          {agent.suburbs.length > 0 && (
            <div className="mt-6 rounded-xl bg-white shadow-card border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" /> Areas Covered
              </h3>
              <div className="flex flex-wrap gap-2">
                {agent.suburbs.map((s) => {
                  const name = s.split("-").slice(0, -2).map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
                  return (
                    <Link
                      key={s}
                      href={`/real-estate-agencies/${s}`}
                      className="text-sm text-gray-700 hover:text-primary hover:underline"
                    >
                      {name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Sell CTA banner ────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center gap-4 rounded-xl bg-primary/5 border border-primary/20 p-6">
          <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={agent.image}
              alt={agent.fullName}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="font-semibold text-gray-900">Looking to sell with {agent.firstName}?</p>
            <p className="text-sm text-gray-500">Start your selling journey with a free property appraisal</p>
          </div>
          <a
            href={`mailto:${agent.email}?subject=Free Property Appraisal Request`}
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Get a free appraisal
          </a>
        </div>

        {/* ── Current Listings (FOR SALE / SOLD tabs) ───────────────── */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Current Listings
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {activeListings.length > 0
              ? `${agent.firstName} currently has ${activeListings.length} propert${activeListings.length === 1 ? "y" : "ies"} for sale.`
              : `${agent.firstName} has no current listings.`}
          </p>
          <AgentListingsTabs forSale={activeListings} sold={soldListings} />
        </div>
      </div>

      {/* ── Contact section ────────────────────────────────────────── */}
      <AgentContactSection
        agentId={agent.id}
        agencyId={agent.agencyId}
        agentFirstName={agent.firstName}
        agentFullName={agent.fullName}
        agentImage={agent.image}
        agentImageAlt={agent.imageAlt}
        agentTitle={agent.title}
      />
    </>
  );
}
