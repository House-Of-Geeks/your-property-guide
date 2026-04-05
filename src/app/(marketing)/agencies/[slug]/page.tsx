import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, Globe, MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { AgencyJsonLd, BreadcrumbJsonLd } from "@/components/seo";
import { PropertyCard } from "@/components/property/PropertyCard";
import { AgencyContactForm } from "@/components/agency/AgencyContactForm";
import { getAgencyBySlug, getAgentsByAgency } from "@/lib/services/agent-service";
import { getPropertiesByAgency } from "@/lib/services/property-service";
import { agencyTitle, absoluteUrl } from "@/lib/utils/seo";
import { SITE_URL } from "@/lib/constants";
import type { Agent, Agency } from "@/types";

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

function AgencyTeamCard({ agent, agency }: { agent: Agent; agency: Agency }) {
  const totalActivity = agent.propertiesSold;
  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border border-gray-100">
            <Image src={agent.image} alt={agent.fullName} fill className="object-cover" sizes="56px" />
          </div>
          <div>
            <Link href={`/agents/${agent.slug}`} className="font-bold text-gray-900 hover:text-primary transition-colors">
              {agent.fullName}
            </Link>
            <p className="text-sm text-gray-500 uppercase tracking-wide">{agent.title}</p>
          </div>
        </div>
        <div className="relative h-8 w-20 flex-shrink-0">
          <Image src={agency.logo} alt={agency.name} fill className="object-contain object-right" sizes="80px" />
        </div>
      </div>

      {totalActivity > 0 ? (
        <div className="text-sm text-gray-700">
          <span className="font-semibold text-gray-900 text-base">{totalActivity}</span>{" "}
          <span className="text-gray-500">Sold</span>
        </div>
      ) : (
        <p className="text-sm text-gray-400 italic">* Sales statistics unavailable</p>
      )}

      <div className="flex gap-3 mt-auto">
        <a
          href={`mailto:${agent.email}`}
          className="flex-1 flex items-center justify-center gap-1.5 border border-gray-300 rounded-lg py-2 text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors"
        >
          <Mail className="w-4 h-4" />
          Email
        </a>
        <a
          href={`tel:${agent.phone}`}
          className="flex-1 flex items-center justify-center gap-1.5 border border-gray-300 rounded-lg py-2 text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors"
        >
          <Phone className="w-4 h-4" />
          Call
        </a>
      </div>
    </div>
  );
}

export default async function AgencyDetailPage({ params }: AgencyDetailPageProps) {
  const { slug } = await params;
  const agency = await getAgencyBySlug(slug);
  if (!agency) notFound();

  const [agents, listings] = await Promise.all([
    getAgentsByAgency(agency.id),
    getPropertiesByAgency(agency.id, 6),
  ]);
  const totalSold = agents.reduce((sum, a) => sum + (a.propertiesSold ?? 0), 0);
  const today = new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div>
      <AgencyJsonLd agency={agency} />
      <BreadcrumbJsonLd
        items={[
          { name: "Agencies", url: "/agencies" },
          { name: agency.name, url: `/agencies/${agency.slug}` },
        ]}
      />

      {/* Hero */}
      <div className="relative h-72 sm:h-96 overflow-hidden bg-gray-900">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: agency.primaryColor
              ? `linear-gradient(135deg, ${agency.primaryColor} 0%, #111 100%)`
              : "linear-gradient(135deg, #1B3A5C 0%, #111 100%)",
          }}
        />
        {/* Interior room texture overlay */}
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-3xl sm:text-4xl font-bold drop-shadow">{agency.name}</h1>
          <p className="mt-3 flex items-center gap-1.5 text-gray-300 text-sm">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            {agency.address.full}
          </p>
          <div className="flex items-center gap-5 mt-4 text-gray-300">
            {agency.website && (
              <a href={agency.website} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Website">
                <Globe className="w-5 h-5" />
              </a>
            )}
            <a href={`mailto:${agency.email}`} className="hover:text-white transition-colors" aria-label="Email">
              <Mail className="w-5 h-5" />
            </a>
            <a href={`tel:${agency.phone}`} className="hover:text-white transition-colors" aria-label="Phone">
              <Phone className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Logo + CTA bar */}
      <div className="bg-gray-900 border-b border-gray-700">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
          <div className="relative h-12 w-36 bg-white rounded p-1">
            <Image src={agency.logo} alt={agency.name} fill className="object-contain p-1" sizes="144px" />
          </div>
          <div className="flex gap-3">
            <a
              href={`tel:${agency.phone}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white text-white text-sm font-medium hover:bg-white hover:text-gray-900 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call
            </a>
            <a
              href={`mailto:${agency.email}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Email
            </a>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: "Agencies", href: "/agencies" }, { label: agency.name }]} />

        {/* Properties stats */}
        {totalSold > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900">Properties</h2>
            <p className="text-sm text-gray-500 mt-0.5">12 month period to {today}</p>
            <div className="mt-4 flex gap-8">
              <div>
                <p className="text-4xl font-bold text-gray-900">{totalSold}</p>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-0.5">Sold</p>
              </div>
            </div>
          </div>
        )}

        <hr className="my-8 border-gray-200" />

        {/* About */}
        <div>
          <h2 className="text-xl font-bold text-gray-900">About {agency.name}</h2>
          <p className="mt-4 text-gray-700 leading-relaxed whitespace-pre-line line-clamp-[8]">
            {agency.description}
          </p>
          {agency.website && (
            <a
              href={agency.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-primary text-sm font-medium hover:underline"
            >
              Visit website
              <Globe className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        <hr className="my-8 border-gray-200" />

        {/* Our Team */}
        <div>
          <h2 className="text-xl font-bold text-gray-900">Our Team</h2>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <AgencyTeamCard key={agent.id} agent={agent} agency={agency} />
            ))}
          </div>
        </div>

        {/* Current Listings */}
        {listings.length > 0 && (
          <>
            <hr className="my-8 border-gray-200" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Current Listings</h2>
              <p className="text-sm text-gray-500 mt-1">
                Active properties listed by {agency.name}
              </p>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.map((property) => (
                  <PropertyCard key={property.id} property={property} variant="grid" />
                ))}
              </div>
              <div className="mt-6">
                <Link
                  href={`/buy?agency=${agency.slug}`}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  View all listings by {agency.name} →
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Contact form */}
        <hr className="my-8 border-gray-200" />
        <div>
          <h2 className="text-xl font-bold text-gray-900">Contact {agency.name}</h2>
          <div className="mt-6">
            <AgencyContactForm agencyId={agency.id} agencyName={agency.name} />
          </div>
        </div>

        {/* YouTube embed */}
        {agency.youtubeVideoId && (
          <>
            <hr className="my-8 border-gray-200" />
            <div className="aspect-video w-full rounded-xl overflow-hidden">
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
      </div>
    </div>
  );
}
