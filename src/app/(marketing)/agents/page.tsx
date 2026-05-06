import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { AgentCard } from "@/components/agent/AgentCard";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { AgentSearch } from "@/components/search/AgentSearch";
import { getAgents } from "@/lib/services/agent-service";
import { SITE_URL } from "@/lib/constants";

// Page body queries the DB; render on every request (no build-time prerender,
// no stale cache). Add HTTP caching at the edge later if traffic warrants it.
export const dynamic = "force-dynamic";

interface AgentsPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

function suburbDisplayName(slug: string): string {
  return slug
    .replace(/-[a-z]{2,3}-\d{4}$/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ searchParams }: AgentsPageProps): Promise<Metadata> {
  const { suburb } = await searchParams;
  const suburbName = suburb ? suburbDisplayName(suburb) : null;
  const title = suburbName ? `Real Estate Agents in ${suburbName}` : "Find a Real Estate Agent";
  const description = suburbName
    ? `Find experienced real estate agents in ${suburbName}.`
    : "Browse experienced local real estate agents across Australia.";
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/agents` },
    openGraph: { url: `${SITE_URL}/agents`, title, description, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function AgentsPage({ searchParams }: AgentsPageProps) {
  const { suburb } = await searchParams;
  const agents = await getAgents(suburb);
  const suburbName = suburb ? suburbDisplayName(suburb) : null;

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Find Agents", url: "/agents" }]} />

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
            <Breadcrumbs items={[{ label: suburbName ? `Agents in ${suburbName}` : "Find Agents" }]} />
          </div>

          <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-end">
            <div>
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
                {agents.length > 0
                  ? `${agents.length.toLocaleString()} ${agents.length !== 1 ? "agents" : "agent"} listed`
                  : "Local agent network"}
              </p>
              <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
                {suburbName ? (
                  <>Agents in <span className="italic text-primary">{suburbName}</span>.</>
                ) : (
                  <>Find your <span className="italic text-primary">local agent</span>.</>
                )}
              </h1>
              <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-2xl mb-6">
                {suburbName
                  ? `Experienced real estate agents serving ${suburbName} and nearby suburbs.`
                  : "Browse trusted local real estate agents across Australia. Search by suburb to see who knows your area."}
              </p>
              <div className="max-w-xl">
                <AgentSearch />
              </div>
            </div>
            <Image
              src="/images/illustrations/expert-match.svg"
              alt=""
              width={320}
              height={220}
              aria-hidden="true"
              className="hidden lg:block w-[280px] h-auto opacity-90"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Cross-link cards */}
        {!suburbName && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            <Link
              href="/appraisal"
              className="flex items-center gap-5 p-6 rounded-2xl bg-surface-raised border border-line hover:border-primary/40 hover:shadow-md transition-all group"
            >
              <Image
                src="/images/icons/calculator.svg"
                alt=""
                width={48}
                height={48}
                aria-hidden="true"
                className="shrink-0 opacity-90"
              />
              <div>
                <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-1">
                  Looking to sell?
                </p>
                <p className="font-display text-lg text-ink group-hover:text-primary transition-colors leading-tight">
                  Get a free property appraisal
                </p>
              </div>
            </Link>
            <Link
              href="/sold"
              className="flex items-center gap-5 p-6 rounded-2xl bg-surface-raised border border-line hover:border-primary/40 hover:shadow-md transition-all group"
            >
              <Image
                src="/images/icons/growth.svg"
                alt=""
                width={48}
                height={48}
                aria-hidden="true"
                className="shrink-0 opacity-90"
              />
              <div>
                <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-1">
                  Market activity
                </p>
                <p className="font-display text-lg text-ink group-hover:text-primary transition-colors leading-tight">
                  See recently sold properties
                </p>
              </div>
            </Link>
          </div>
        )}

        {/* Section header */}
        <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-line pb-4">
          <h2 className="font-display text-2xl text-ink">
            {suburbName ? `Agents serving ${suburbName}` : "All agents"}
          </h2>
          <p className="font-sans text-sm text-ink-muted shrink-0">
            {agents.length.toLocaleString()} {agents.length !== 1 ? "agents" : "agent"}
          </p>
        </div>

        {agents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-sans text-lg text-ink-muted">
              No agents found{suburbName ? ` in ${suburbName}` : ""}.
            </p>
            <p className="font-sans text-sm text-ink-subtle mt-2">
              Try searching for a nearby suburb or browse all agents.
            </p>
            <Link
              href="/agents"
              className="mt-4 inline-block font-sans text-sm font-medium text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
            >
              Browse all agents →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
