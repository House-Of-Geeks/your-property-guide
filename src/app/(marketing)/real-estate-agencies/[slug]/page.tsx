import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, Globe, MapPin, Building2 } from "lucide-react";
import { AgencyJsonLd, BreadcrumbJsonLd } from "@/components/seo";
import { PropertyCard } from "@/components/property/PropertyCard";
import { AgencyCard } from "@/components/agent/AgencyCard";
import { AgencyContactForm } from "@/components/agency/AgencyContactForm";
import { getAgencyBySlug, getAgentsByAgency, getAgenciesBySuburbSlug } from "@/lib/services/agent-service";
import { getPropertiesByAgency } from "@/lib/services/property-service";
import { agencyTitle, absoluteUrl } from "@/lib/utils/seo";
import { SITE_URL } from "@/lib/constants";
import type { Agent, Agency } from "@/types";
import { BUTTON_PRIMARY, BUTTON_SECONDARY, Band, HeroLead, HeroTitle, PhotoHero, SectionHeading } from "@/components/premium";

// suburb slugs end in "-[state2-3]-[postcode4]" e.g. "margate-qld-4019"
function isSuburbSlug(slug: string) {
  return /^[a-z][a-z-]+-[a-z]{2,3}-\d{4}$/.test(slug);
}

function parseSuburbSlug(slug: string) {
  const parts = slug.split("-");
  const postcode = parts[parts.length - 1];
  const state = parts[parts.length - 2].toUpperCase();
  const name = parts.slice(0, -2).map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
  return { name, state, postcode };
}

interface AgencyDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AgencyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (isSuburbSlug(slug)) {
    const { name, state, postcode } = parseSuburbSlug(slug);
    const title = `Real Estate Agencies in ${name}, ${state} ${postcode}`;
    const description = `Find local real estate agencies serving ${name}, ${state} ${postcode}. Compare agencies and meet the team.`;
    // When there are no agencies for this suburb the page still renders an empty
    // "No agencies listed yet" state. Keep that thin variant out of the index
    // (but let it pass equity through its links), mirroring the suburb detail
    // page's isThinSuburb guard.
    const agencies = await getAgenciesBySuburbSlug(slug);
    return {
      title,
      description,
      alternates: { canonical: `${SITE_URL}/real-estate-agencies/${slug}` },
      openGraph: { ...DEFAULT_OG, url: `${SITE_URL}/real-estate-agencies/${slug}`, title, description, type: "website" },
      ...(agencies.length === 0 ? { robots: { index: false, follow: true } } : {}),
    };
  }

  const agency = await getAgencyBySlug(slug);
  if (!agency) return { title: "Agency Not Found" };
  const title       = agency.metaTitle       ?? agencyTitle(agency);
  const description = agency.metaDescription ?? agency.description.slice(0, 155);
  const image       = agency.ogImage         ?? absoluteUrl(agency.logo);
  return {
    // Directory paused (placeholder profiles only) per Andy, 2026-07-03 —
    // pages stay reachable but out of the index until real agents load.
    robots: { index: false, follow: true },
    title,
    description,
    alternates: { canonical: `${SITE_URL}/real-estate-agencies/${slug}` },
    openGraph: { ...DEFAULT_OG, url: `${SITE_URL}/real-estate-agencies/${slug}`, title, description, images: [{ url: image }], type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

// Social brand icons as inline SVGs
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden>
      <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function AgencyTeamCard({ agent, agency }: { agent: Agent; agency: Agency }) {
  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border border-gray-100">
            <Image src={agent.image} alt={agent.fullName} fill className="object-cover" sizes="56px" />
          </div>
          <div>
            <Link href={`/agents/${agent.slug}`} className="font-bold text-gray-900 hover:text-primary transition-colors text-sm">
              {agent.fullName}
            </Link>
            <p className="text-[13px] text-gray-500 mt-0.5">{agent.title}</p>
          </div>
        </div>
        <div className="relative h-7 w-20 flex-shrink-0">
          <Image src={agency.logo} alt={agency.name} fill className="object-contain object-right" sizes="80px" />
        </div>
      </div>

      {agent.propertiesSold > 0 ? (
        <div className="text-sm">
          <span className="font-semibold text-gray-900 text-lg">{agent.propertiesSold}</span>{" "}
          <span className="text-gray-500 text-[13px]">Sold</span>
        </div>
      ) : (
        <p className="text-xs text-gray-400">* Sales statistics unavailable</p>
      )}

      <div className="flex gap-2 mt-auto">
        <a
          href={`mailto:${agent.email}`}
          className="flex-1 flex items-center justify-center gap-1.5 border border-gray-300 rounded-lg py-2 text-xs font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors"
        >
          <Mail className="w-3.5 h-3.5" />
          Email
        </a>
        <a
          href={`tel:${agent.phone}`}
          className="flex-1 flex items-center justify-center gap-1.5 border border-gray-300 rounded-lg py-2 text-xs font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          Call
        </a>
      </div>
    </div>
  );
}

export default async function AgencyDetailPage({ params }: AgencyDetailPageProps) {
  const { slug } = await params;

  // ── Suburb listing page ──────────────────────────────────────────────────
  if (isSuburbSlug(slug)) {
    const { name, state, postcode } = parseSuburbSlug(slug);
    const displayName = `${name}, ${state} ${postcode}`;
    const agencies = await getAgenciesBySuburbSlug(slug);

    return (
      <div>
        <BreadcrumbJsonLd
          items={[
            { name: "Real Estate Agencies", url: "/real-estate-agencies" },
            { name: displayName, url: `/real-estate-agencies/${slug}` },
          ]}
        />

        {/* Hero: the H1 and the agency count. */}
        <PhotoHero
          breadcrumbs={[
            { label: "Real Estate Agencies", href: "/real-estate-agencies" },
            { label: displayName },
          ]}
        >
          <HeroTitle>
            Real Estate Agencies in {name}
          </HeroTitle>
          <HeroLead>
            {agencies.length > 0
              ? `${agencies.length} agenc${agencies.length === 1 ? "y" : "ies"} serving ${displayName}`
              : `No agencies found in ${displayName}`}
          </HeroLead>
        </PhotoHero>

        <Band spacing="compact">
          {agencies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {agencies.map((agency) => (
                <AgencyCard key={agency.id} agency={agency} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-ink-subtle">
              <Building2 className="w-12 h-12 mx-auto mb-4 opacity-30" aria-hidden="true" />
              <p className="text-lg text-ink-muted">No agencies listed in {displayName} yet.</p>
              <Link href="/real-estate-agencies" className="mt-4 inline-block text-sm font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink">
                Browse all agencies →
              </Link>
            </div>
          )}
        </Band>
      </div>
    );
  }

  // ── Agency profile page ──────────────────────────────────────────────────
  const agency = await getAgencyBySlug(slug);
  if (!agency) notFound();

  const [agents, listings] = await Promise.all([
    getAgentsByAgency(agency.id),
    getPropertiesByAgency(agency.id, 6),
  ]);

  const totalSold = agents.reduce((sum, a) => sum + (a.propertiesSold ?? 0), 0);
  const today = new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

  const socialLinks = [
    agency.website    && { href: agency.website,     icon: <Globe className="w-5 h-5" />,  label: "Website" },
    agency.facebookUrl && { href: agency.facebookUrl, icon: <FacebookIcon />,               label: "Facebook" },
    agency.instagramUrl && { href: agency.instagramUrl, icon: <InstagramIcon />,            label: "Instagram" },
    agency.youtubeUrl  && { href: agency.youtubeUrl,  icon: <YoutubeIcon />,               label: "YouTube" },
    agency.linkedinUrl && { href: agency.linkedinUrl, icon: <LinkedinIcon />,              label: "LinkedIn" },
  ].filter(Boolean) as { href: string; icon: React.ReactNode; label: string }[];

  return (
    <div>
      <AgencyJsonLd agency={agency} />
      <BreadcrumbJsonLd
        items={[
          { name: "Real Estate Agencies", url: "/real-estate-agencies" },
          {
            name: agency.address.suburb,
            url: `/real-estate-agencies/${agency.address.suburb.toLowerCase().replace(/\s+/g, "-")}-${agency.address.state.toLowerCase()}-${agency.address.postcode}`,
          },
          { name: agency.name, url: `/real-estate-agencies/${agency.slug}` },
        ]}
      />

      {/* Hero: the agency's own photo when it has one (else plain
          charcoal), carrying the H1, the address and the agency's links. */}
      <PhotoHero
        image={agency.heroBg ? { src: agency.heroBg } : undefined}
        breadcrumbs={[
          { label: "Real Estate Agencies", href: "/real-estate-agencies" },
          {
            label: agency.address.suburb,
            href: `/real-estate-agencies/${agency.address.suburb.toLowerCase().replace(/\s+/g, "-")}-${agency.address.state.toLowerCase()}-${agency.address.postcode}`,
          },
          { label: agency.name },
        ]}
      >
        <p className="text-sm text-ink-muted mb-5">
          Local agency
        </p>
        <HeroTitle>
          {agency.name}
        </HeroTitle>
        <HeroLead className="flex items-start gap-2">
          <MapPin className="w-5 h-5 mt-1 flex-shrink-0" aria-hidden="true" />
          {agency.address.full}
        </HeroLead>
        {socialLinks.length > 0 && (
          <div className="flex items-center gap-4 mt-6 text-ink-muted">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="hover:text-ink transition-colors"
              >
                {link.icon}
              </a>
            ))}
          </div>
        )}
      </PhotoHero>

      {/* Logo + CTA bar */}
      <div className="bg-white border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="relative h-10 w-40">
            <Image src={agency.logo} alt={agency.name} fill className="object-contain object-left" sizes="160px" />
          </div>
          <div className="flex gap-3">
            <a
              href={`tel:${agency.phone}`}
              className={BUTTON_SECONDARY}
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              Call
            </a>
            <a
              href={`mailto:${agency.email}`}
              className={BUTTON_PRIMARY}
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
              Email
            </a>
          </div>
        </div>
      </div>

      {/* Properties stats and About */}
      <Band spacing="compact">
        <div className="space-y-10">

          {/* Properties stats */}
          {totalSold > 0 && (
            <div>
              <SectionHeading size="md" title="Properties" />
              <p className="text-sm text-ink-muted mt-2">12 month period to {today}</p>
              <div className="mt-6">
                <p className="text-5xl font-bold text-ink leading-none tracking-[-0.03em]">{totalSold}</p>
                <p className="text-sm font-semibold text-ink-muted mt-2">Sold</p>
              </div>
              <hr className="mt-10 border-line" />
            </div>
          )}

          {/* About */}
          <div>
            <SectionHeading size="md" title={<>About {agency.name}</>} />
            <p className="mt-6 max-w-3xl text-lg text-ink-muted leading-relaxed whitespace-pre-line line-clamp-[10]">
              {agency.description}
            </p>
            {agency.website && (
              <a
                href={agency.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-6 text-base font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink"
              >
                Visit website <Globe className="w-4 h-4" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </Band>

      {/* Our Team */}
      <Band tone="quiet" spacing="compact">
        <SectionHeading size="md" title="Our Team" />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <AgencyTeamCard key={agent.id} agent={agent} agency={agency} />
          ))}
        </div>
      </Band>

      {/* Current Listings */}
      {listings.length > 0 && (
        <Band spacing="compact">
          <SectionHeading size="md" title="Current Listings" />
          <p className="text-base text-ink-muted mt-3">Active properties listed by {agency.name}</p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((property) => (
              <PropertyCard key={property.id} property={property} variant="grid" />
            ))}
          </div>
          {/* No "view all listings" link: the /buy listings were retired on
              14 Oct 2026 (docs/portal-consolidation-2026-10-14.md). */}
        </Band>
      )}

      {/* Contact form; the bands alternate whether or not listings show. */}
      <Band tone={listings.length > 0 ? "quiet" : "light"} spacing="compact">
        <div className="max-w-3xl">
          <SectionHeading size="md" title={<>Contact {agency.name}</>} />
          <div className="mt-8">
            <AgencyContactForm agencyId={agency.id} agencyName={agency.name} />
          </div>
        </div>

        {/* YouTube embed */}
        {agency.youtubeVideoId && (
          <>
            <hr className="my-12 border-line" />
            <div className="aspect-video w-full max-w-5xl rounded-xl overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${agency.youtubeVideoId}`}
                title={`${agency.name} video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </>
        )}
      </Band>
    </div>
  );
}
