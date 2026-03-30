import type { Metadata } from "next";
import { AgencyCard } from "@/components/agent/AgencyCard";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { getAgencies } from "@/lib/services/agent-service";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Real Estate Agencies in Moreton Bay",
  description: "Find local real estate agencies in the Moreton Bay region. Compare agencies, view agent teams, and explore listings.",
  alternates: { canonical: `${SITE_URL}/agencies` },
  openGraph: { title: "Real Estate Agencies in Moreton Bay", description: "Find local real estate agencies in the Moreton Bay region. Compare agencies, view agent teams, and explore listings.", type: "website" },
  twitter: { card: "summary_large_image" },
};

export default async function AgenciesPage() {
  const agencies = await getAgencies();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd items={[{ name: "Agencies", url: "/agencies" }]} />
      <Breadcrumbs items={[{ label: "Agencies" }]} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Real Estate Agencies</h1>
        <p className="text-gray-500 mt-1">
          Local agencies serving the Moreton Bay region
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {agencies.map((agency) => (
          <AgencyCard key={agency.id} agency={agency} />
        ))}
      </div>
    </div>
  );
}
