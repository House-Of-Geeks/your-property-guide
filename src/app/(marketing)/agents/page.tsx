import type { Metadata } from "next";
import Link from "next/link";
import { AgentCard } from "@/components/agent/AgentCard";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { AgentSearch } from "@/components/search/AgentSearch";
import { getAgents } from "@/lib/services/agent-service";
import { SITE_URL } from "@/lib/constants";
import { Home, TrendingUp } from "lucide-react";

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
    <div>
      <BreadcrumbJsonLd items={[{ name: "Find Agents", url: "/agents" }]} />

      {/* Hero */}
      <div className="relative gradient-brand">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Find your local<br />Real Estate Agent
          </h1>
          <p className="mt-3 text-lg text-white/90">
            {agents.length > 0
              ? `Choose from ${agents.length} agent${agents.length !== 1 ? "s" : ""} across Australia`
              : "Connect with trusted local agents across Australia"}
          </p>
          <div className="mt-8">
            <AgentSearch />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: suburbName ? `Agents in ${suburbName}` : "Find Agents" }]} />

        {/* Feature cards */}
        {!suburbName && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 mb-10">
            <Link
              href="/appraisal"
              className="flex items-center gap-5 p-6 rounded-xl bg-white shadow-card border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-xl gradient-brand text-white flex items-center justify-center shrink-0">
                <Home className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Looking to sell?</p>
                <p className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  Get a free appraisal
                </p>
              </div>
            </Link>
            <Link
              href="/sold"
              className="flex items-center gap-5 p-6 rounded-xl bg-white shadow-card border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-xl gradient-brand text-white flex items-center justify-center shrink-0">
                <TrendingUp className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Market activity</p>
                <p className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  See recently sold properties
                </p>
              </div>
            </Link>
          </div>
        )}

        {/* Agent results */}
        {suburbName && (
          <div className="mb-6 mt-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Real Estate Agents in {suburbName}
            </h2>
            <p className="text-gray-500 mt-1">
              {agents.length} agent{agents.length !== 1 ? "s" : ""} serving {suburbName}
            </p>
          </div>
        )}

        {!suburbName && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Agents</h2>
            <p className="text-gray-500 mt-1">
              {agents.length} agent{agents.length !== 1 ? "s" : ""} across Australia
            </p>
          </div>
        )}

        {agents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No agents found{suburbName ? ` in ${suburbName}` : ""}.</p>
            <p className="text-sm mt-2">Try searching for a nearby suburb or browse all agents.</p>
            <Link href="/agents" className="mt-4 inline-block text-primary hover:underline text-sm">
              Browse all agents →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
