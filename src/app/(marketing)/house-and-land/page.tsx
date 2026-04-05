import type { Metadata } from "next";
import { HouseLandCard } from "@/components/property/HouseLandCard";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { getHouseAndLandPackages } from "@/lib/services/house-and-land-service";
import { SITE_URL } from "@/lib/constants";

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

function suburbDisplayName(slug: string): string {
  return slug.replace(/-[a-z]{2,3}-\d{4}$/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { suburb } = await searchParams;
  const suburbName = suburb ? suburbDisplayName(suburb) : null;
  const title = suburbName ? `House & Land Packages in ${suburbName}` : "House & Land Packages";
  const description = suburbName
    ? `Browse new house and land packages in ${suburbName}.`
    : "Browse house and land packages across Australia. New homes from top builders at competitive prices.";
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/house-and-land${suburb ? `?suburb=${suburb}` : ""}` },
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function HouseAndLandPage({ searchParams }: PageProps) {
  const { suburb } = await searchParams;
  const packages = await getHouseAndLandPackages(suburb);
  const suburbName = suburb ? suburbDisplayName(suburb) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd items={[{ name: "House & Land", url: "/house-and-land" }]} />
      <Breadcrumbs items={[{ label: "House & Land" }]} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {suburbName ? `House & Land Packages in ${suburbName}` : "House & Land Packages"}
        </h1>
        <p className="text-gray-500 mt-1">
          {packages.length} new home package{packages.length !== 1 ? "s" : ""} available
          {suburbName ? ` in ${suburbName}` : ""}
        </p>
      </div>

      {packages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <HouseLandCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No packages found{suburbName ? ` in ${suburbName}` : ""}.</p>
      )}
    </div>
  );
}
