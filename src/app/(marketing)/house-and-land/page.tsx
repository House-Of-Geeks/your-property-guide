import type { Metadata } from "next";
import { HouseLandCard } from "@/components/property/HouseLandCard";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { getHouseAndLandPackages } from "@/lib/services/house-and-land-service";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "House & Land Packages in Moreton Bay",
  description: "Browse house and land packages in the Moreton Bay region. New homes from top builders at competitive prices.",
  alternates: { canonical: `${SITE_URL}/house-and-land` },
  openGraph: { title: "House & Land Packages in Moreton Bay", description: "Browse house and land packages in the Moreton Bay region. New homes from top builders at competitive prices.", type: "website" },
  twitter: { card: "summary_large_image" },
};

export default async function HouseAndLandPage() {
  const packages = await getHouseAndLandPackages();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd items={[{ name: "House & Land", url: "/house-and-land" }]} />
      <Breadcrumbs items={[{ label: "House & Land" }]} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">House & Land Packages in Moreton Bay</h1>
        <p className="text-gray-500 mt-1">
          {packages.length} new home packages available in the Moreton Bay region
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <HouseLandCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </div>
  );
}
