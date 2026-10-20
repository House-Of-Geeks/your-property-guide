import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, Building2 } from "lucide-react";
import { AgentJsonLd, BreadcrumbJsonLd } from "@/components/seo";
import { AgentListingsTabs } from "@/components/agent/AgentListingsTabs";
import { AgentContactSection } from "@/components/agent/AgentContactSection";
import { getAgentBySlug, getAgencyById } from "@/lib/services/agent-service";
import { getPropertiesByAgent } from "@/lib/services/property-service";
import { agentTitle, agentDescription, absoluteUrl } from "@/lib/utils/seo";
import { SITE_URL } from "@/lib/constants";
import { Band, HeroTitle, PhotoHero } from "@/components/premium";

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
    // Directory paused (placeholder profiles only) per Andy, 2026-07-03 —
    // pages stay reachable but out of the index until real agents load.
    robots: { index: false, follow: true },
    title,
    description,
    alternates: { canonical: `${SITE_URL}/agents/${slug}` },
    openGraph: { ...DEFAULT_OG, url: `${SITE_URL}/agents/${slug}`, title, description, images: [{ url: image }], type: "profile" },
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

      {/* ── Hero: the agency's own photo when it has one (else plain
          charcoal), with the agent's name and links ──── */}
      <PhotoHero
        image={heroBg ? { src: heroBg } : undefined}
        breadcrumbs={[
          { label: "Real Estate Agents", href: "/agents" },
          ...(agency ? [{ label: agency.name, href: `/real-estate-agencies/${agency.slug}` }] : []),
          { label: agent.fullName },
        ]}
        aside={
          /* Agency logo + address */
          <div className="flex flex-col items-start lg:items-end gap-3">
            {agency && (
              <Link href={`/real-estate-agencies/${agency.slug}`} className="rounded-lg bg-white p-3">
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
              <p className="text-sm text-ink-muted flex items-center gap-1 lg:text-right">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                {agency.address.full}
              </p>
            )}
          </div>
        }
      >
        {/* Circle photo */}
        <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border-4 border-line mb-6">
          <Image
            src={agent.image}
            alt={agent.imageAlt ?? `${agent.fullName} - ${agent.title}`}
            fill
            className="object-cover"
            sizes="96px"
            preload
          />
        </div>

        <p className="text-sm text-ink-muted mb-5">
          {agent.title}
        </p>
        <HeroTitle>
          {agent.fullName}
        </HeroTitle>

        {/* Call / Email */}
        <div className="flex flex-wrap items-center gap-3 mt-8">
          <a
            href={`tel:${agent.phone}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-line-strong text-sm font-medium text-ink hover:border-ink transition-colors"
          >
            <Phone className="w-4 h-4" aria-hidden="true" /> Call
          </a>
          <a
            href={`mailto:${agent.email}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-line-strong text-sm font-medium text-ink hover:border-ink transition-colors"
          >
            <Mail className="w-4 h-4" aria-hidden="true" /> Email
          </a>
        </div>
      </PhotoHero>

      <Band spacing="compact">
        <div className="space-y-12">

          {/* ── Properties count ──────────────────────────────────────── */}
          {activeListings.length > 0 && (
            <div className="border border-line rounded-xl p-5 max-w-sm">
              <p className="text-sm text-ink-muted mb-2">Properties</p>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-ink">{activeListings.length}</span>
                <span className="text-sm font-semibold text-ink-muted">For Sale</span>
              </div>
            </div>
          )}

          {/* ── About ─────────────────────────────────────────────────── */}
          {agent.bio && (
            <div className="max-w-3xl">
              <h2 className="text-2xl sm:text-3xl text-ink leading-tight tracking-[-0.02em] mb-4">About {agent.firstName}</h2>
              <p className="text-base text-ink-muted leading-relaxed whitespace-pre-line">{agent.bio}</p>
            </div>
          )}

          {/* ── Sales stats ────────────────────────────────────────────── */}
          <div>
            <h2 className="text-2xl sm:text-3xl text-ink leading-tight tracking-[-0.02em] mb-6">
              {agent.firstName}&apos;s statistics
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-xl bg-white border border-line p-5 text-center">
                <p className="text-3xl font-bold text-primary">{agent.propertiesSold}</p>
                <p className="text-sm text-ink-muted mt-1">Total Sales</p>
              </div>
              <div className="rounded-xl bg-white border border-line p-5 text-center">
                <p className="text-3xl font-bold text-primary">{agent.yearsExperience}</p>
                <p className="text-sm text-ink-muted mt-1">Years Experience</p>
              </div>
              {agent.reviewCount > 0 && (
                <div className="rounded-xl bg-white border border-line p-5 text-center">
                  <p className="text-3xl font-bold text-primary">{agent.averageRating}</p>
                  <p className="text-sm text-ink-muted mt-1">Average Rating</p>
                </div>
              )}
              {agent.suburbs.length > 0 && (
                <div className="rounded-xl bg-white border border-line p-5 text-center">
                  <p className="text-3xl font-bold text-primary">{agent.suburbs.length}</p>
                  <p className="text-sm text-ink-muted mt-1">Suburbs Covered</p>
                </div>
              )}
            </div>

            {/* Suburbs covered */}
            {agent.suburbs.length > 0 && (
              <div className="mt-6 rounded-xl bg-white border border-line p-5">
                <h3 className="text-base font-semibold text-ink mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" aria-hidden="true" /> Areas Covered
                </h3>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {agent.suburbs.map((s) => {
                    const name = s.split("-").slice(0, -2).map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
                    return (
                      <Link
                        key={s}
                        href={`/suburbs/${s}`}
                        className="text-sm text-ink hover:text-primary hover:underline"
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
          <div className="flex flex-col sm:flex-row items-center gap-4 rounded-xl bg-surface-warm border border-line p-6">
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
              <p className="font-semibold text-ink">Looking to sell with {agent.firstName}?</p>
              <p className="text-sm text-ink-muted">Start your selling journey with a free property appraisal</p>
            </div>
            <a
              href={`mailto:${agent.email}?subject=Free Property Appraisal Request`}
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-cta hover:bg-cta-hover text-cta-ink text-sm font-semibold transition-colors"
            >
              Get a free appraisal
            </a>
          </div>

          {/* ── Current Listings (FOR SALE / SOLD tabs) ───────────────── */}
          <div>
            <h2 className="text-2xl sm:text-3xl text-ink leading-tight tracking-[-0.02em] mb-4">
              Current Listings
            </h2>
            <p className="text-base text-ink-muted mb-6">
              {activeListings.length > 0
                ? `${agent.firstName} currently has ${activeListings.length} propert${activeListings.length === 1 ? "y" : "ies"} for sale.`
                : `${agent.firstName} has no current listings.`}
            </p>
            <AgentListingsTabs forSale={activeListings} sold={soldListings} />
          </div>
        </div>
      </Band>

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
