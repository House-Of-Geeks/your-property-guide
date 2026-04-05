import type { Metadata } from "next";
import { AgentCard } from "@/components/agent/AgentCard";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { getAgents } from "@/lib/services/agent-service";
import { SITE_URL } from "@/lib/constants";

interface AgentsPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export async function generateMetadata({ searchParams }: AgentsPageProps): Promise<Metadata> {
  const { suburb } = await searchParams;
  const suburbName = suburb
    ? suburb.replace(/-[a-z]{2,3}-\d{4}$/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : null;
  const title = suburbName ? `Real Estate Agents in ${suburbName}` : "Find a Real Estate Agent";
  const description = suburbName
    ? `Find experienced real estate agents in ${suburbName}.`
    : "Browse experienced local real estate agents across Australia.";
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/agents${suburb ? `?suburb=${suburb}` : ""}` },
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function AgentsPage({ searchParams }: AgentsPageProps) {
  const { suburb } = await searchParams;
  const agents = await getAgents(suburb);

  const suburbName = suburb
    ? suburb.replace(/-[a-z]{2,3}-\d{4}$/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd items={[{ name: "Agents", url: "/agents" }]} />
      <Breadcrumbs items={[{ label: "Agents" }]} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {suburbName ? `Real Estate Agents in ${suburbName}` : "Find a Real Estate Agent"}
        </h1>
        <p className="text-gray-500 mt-1">
          {agents.length} agent{agents.length !== 1 ? "s" : ""}{suburbName ? ` serving ${suburbName}` : " across Australia"}
        </p>
      </div>

      {agents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No agents found{suburbName ? ` for ${suburbName}` : ""}.</p>
      )}
    </div>
  );
}
