import Link from "next/link";
import Image from "next/image";
import { AgentCard } from "@/components/agent/AgentCard";
import { getAgents } from "@/lib/services/agent-service";

interface AgentsResultsProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

function suburbDisplayName(slug: string): string {
  return slug
    .replace(/-[a-z]{2,3}-\d{4}$/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function AgentsResults({ searchParams }: AgentsResultsProps) {
  const { suburb } = await searchParams;
  const agents = await getAgents(suburb);
  const suburbName = suburb ? suburbDisplayName(suburb) : null;

  return (
    <>
      {/* Cross-link cards, only when not filtered */}
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
    </>
  );
}
