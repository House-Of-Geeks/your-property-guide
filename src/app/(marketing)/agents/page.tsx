import type { Metadata } from "next";
import { AgentCard } from "@/components/agent/AgentCard";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { getAgents } from "@/lib/services/agent-service";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Real Estate Agents in Moreton Bay",
  description: "Browse our team of experienced local real estate agents across the Moreton Bay region.",
  alternates: { canonical: `${SITE_URL}/agents` },
  openGraph: { title: "Real Estate Agents in Moreton Bay", description: "Browse our team of experienced local real estate agents across the Moreton Bay region.", type: "website" },
  twitter: { card: "summary_large_image" },
};

export default async function AgentsPage() {
  const agents = await getAgents();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd items={[{ name: "Agents", url: "/agents" }]} />
      <Breadcrumbs items={[{ label: "Agents" }]} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Real Estate Agents in Moreton Bay</h1>
        <p className="text-gray-500 mt-1">
          {agents.length} agents serving the Moreton Bay region
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}
