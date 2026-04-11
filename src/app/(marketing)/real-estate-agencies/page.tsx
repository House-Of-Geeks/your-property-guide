import type { Metadata } from "next";
import { AgencyCard } from "@/components/agent/AgencyCard";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { getAgencies } from "@/lib/services/agent-service";
import { SITE_URL } from "@/lib/constants";

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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd items={[{ name: "Agencies", url: "/real-estate-agencies" }]} />
      <Breadcrumbs items={[{ label: "Agencies" }]} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {suburbName ? `Real Estate Agencies in ${suburbName}` : "Real Estate Agencies"}
        </h1>
        <p className="text-gray-500 mt-1">
          {suburbName ? `Agencies serving ${suburbName}` : "Local agencies across Australia"}
        </p>
      </div>

      {agencies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agencies.map((agency) => (
            <AgencyCard key={agency.id} agency={agency} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No agencies found{suburbName ? ` for ${suburbName}` : ""}.</p>
      )}
    </div>
  );
}
