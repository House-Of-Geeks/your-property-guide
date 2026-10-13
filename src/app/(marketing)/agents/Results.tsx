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
            className="flex items-center gap-5 p-6 rounded-xl bg-surface-raised border border-line hover:border-ink transition-colors group"
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
              <p className="text-sm text-ink-subtle mb-1">
                Looking to sell?
              </p>
              <p className="text-lg font-semibold text-ink group-hover:text-primary transition-colors leading-tight">
                Get a free property appraisal
              </p>
            </div>
          </Link>
          <Link
            href="/sold"
            className="flex items-center gap-5 p-6 rounded-xl bg-surface-raised border border-line hover:border-ink transition-colors group"
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
              <p className="text-sm text-ink-subtle mb-1">
                Market activity
              </p>
              <p className="text-lg font-semibold text-ink group-hover:text-primary transition-colors leading-tight">
                See recently sold properties
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* Section header */}
      <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-line pb-4">
        <h2 className="text-2xl sm:text-3xl text-ink leading-tight tracking-[-0.02em]">
          {suburbName ? `Agents serving ${suburbName}` : "All agents"}
        </h2>
        <p className="text-sm text-ink-muted shrink-0">
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
          <p className="text-lg text-ink-muted">
            No agents found{suburbName ? ` in ${suburbName}` : ""}.
          </p>
          <p className="text-sm text-ink-subtle mt-2">
            Try searching for a nearby suburb or browse all agents.
          </p>
          <Link
            href="/agents"
            className="mt-4 inline-block text-sm font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink"
          >
            Browse all agents →
          </Link>
        </div>
      )}
    </>
  );
}
