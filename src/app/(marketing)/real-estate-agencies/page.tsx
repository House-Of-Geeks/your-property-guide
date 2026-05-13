import type { Metadata } from "next";
import Image from "next/image";
import { AgencyCard } from "@/components/agent/AgencyCard";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { getAgencies } from "@/lib/services/agent-service";
import { SITE_URL } from "@/lib/constants";

// ISR, DB-querying services have build-phase guards, so we cache for 24h
// instead of running a function on every visit.
export const revalidate = 86400;

interface AgenciesPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

function suburbDisplayName(slug: string): string {
  return slug.replace(/-[a-z]{2,3}-\d{4}$/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ searchParams }: AgenciesPageProps): Promise<Metadata> {
  const { suburb } = await searchParams;
  const suburbName = suburb ? suburbDisplayName(suburb) : null;
  const title = suburbName ? `Real Estate Agencies in ${suburbName}` : "Find a Real Estate Agency";
  const description = suburbName
    ? `Find real estate agencies in ${suburbName}.`
    : "Find local real estate agencies across Australia. Compare agencies, view agent teams, and explore listings.";
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/real-estate-agencies` },
    openGraph: { url: `${SITE_URL}/real-estate-agencies`, title, description, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function AgenciesPage({ searchParams }: AgenciesPageProps) {
  const { suburb } = await searchParams;
  const agencies = await getAgencies(suburb);
  const suburbName = suburb ? suburbDisplayName(suburb) : null;

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Agencies", url: "/real-estate-agencies" }]} />

      {/* Editorial hero */}
      <section className="relative bg-surface-warm border-b border-line overflow-hidden">
        <Image
          src="/images/illustrations/contour.svg"
          alt=""
          width={1200}
          height={800}
          aria-hidden="true"
          className="absolute -right-40 -top-40 w-[1100px] max-w-none opacity-[0.10] pointer-events-none select-none"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pb-16">
          <div className="mb-8">
            <Breadcrumbs items={[{ label: "Agencies" }]} />
          </div>

          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
            {agencies.length.toLocaleString()} {agencies.length !== 1 ? "agencies" : "agency"}
          </p>
          <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
            {suburbName ? (
              <>Agencies in <span className="italic text-primary">{suburbName}</span>.</>
            ) : (
              <>Real estate <span className="italic text-primary">agencies</span>.</>
            )}
          </h1>
          <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-2xl">
            {suburbName
              ? `Local agencies and their teams covering ${suburbName} and surrounding suburbs.`
              : "Browse local agencies across Australia. Compare teams, listings, and the suburbs they cover."}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {agencies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {agencies.map((agency) => (
              <AgencyCard key={agency.id} agency={agency} />
            ))}
          </div>
        ) : (
          <p className="font-sans text-ink-muted">
            No agencies found{suburbName ? ` for ${suburbName}` : ""}.
          </p>
        )}
      </div>
    </>
  );
}
