import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import { AgencyCard } from "@/components/agent/AgencyCard";
import { BreadcrumbJsonLd } from "@/components/seo";
import { getAgencies } from "@/lib/services/agent-service";
import { SITE_URL } from "@/lib/constants";
import { Band, HeroLead, HeroTitle, PhotoHero } from "@/components/premium";

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
    // Directory paused (placeholder profiles only) per Andy, 2026-07-03 —
    // pages stay reachable but out of the index until real agents load.
    robots: { index: false, follow: true },
    title,
    description,
    alternates: { canonical: `${SITE_URL}/real-estate-agencies` },
    openGraph: { ...DEFAULT_OG, url: `${SITE_URL}/real-estate-agencies`, title, description, type: "website" },
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

      <PhotoHero photo="street" breadcrumbs={[{ label: "Agencies" }]}>
        <p className="flex items-center gap-4 text-sm text-ink-muted mb-5">
          <span className="font-semibold">
            {agencies.length.toLocaleString()} {agencies.length !== 1 ? "agencies" : "agency"}
          </span>
          <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
          <span>
            Local directory
          </span>
        </p>
        <HeroTitle>
          {suburbName ? (
            <>Agencies in{" "}<span>{suburbName}</span>.</>
          ) : (
            <>Real estate{" "}<span>agencies</span>.</>
          )}
        </HeroTitle>
        <HeroLead>
          {suburbName
            ? `Local agencies and their teams covering ${suburbName} and surrounding suburbs.`
            : "Browse local agencies across Australia. Compare teams, listings, and the suburbs they cover."}
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
          <p className="text-lg text-ink-muted">
            No agencies found{suburbName ? ` for ${suburbName}` : ""}.
          </p>
        )}
      </Band>
    </>
  );
}
