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
  // Skip the DB at build (Railway proxy drops build-time connections); ISR
  // (revalidate above) fills real data on first request. Empty renders cleanly
  // — the grid below shows a "no agencies found" fallback.
  const agencies =
    process.env.NEXT_PHASE === "phase-production-build"
      ? ([] as Awaited<ReturnType<typeof getAgencies>>)
      : await getAgencies(suburb);
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

          <div className="flex items-center gap-4 mb-10">
            <span className="font-display italic text-primary text-base sm:text-lg leading-none">
              {agencies.length.toLocaleString()} {agencies.length !== 1 ? "agencies" : "agency"}
            </span>
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
              Local directory
            </span>
          </div>
          <h1 className="font-display text-ink leading-[0.98] tracking-tight text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-10 max-w-[18ch] font-medium">
            {suburbName ? (
              <>Agencies in{" "}<span className="italic font-light text-primary">{suburbName}</span>.</>
            ) : (
              <>Real estate{" "}<span className="italic font-light text-primary">agencies</span>.</>
            )}
          </h1>
          <p className="font-display font-light text-xl sm:text-2xl text-ink leading-[1.25] max-w-3xl">
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
