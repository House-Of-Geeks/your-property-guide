import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { getAllRegions } from "@/lib/services/region-service";
import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Property Regions Across Australia",
  description:
    "Browse real estate market data, median house prices, and properties for sale across every region in Australia.",
  alternates: { canonical: `${SITE_URL}/regions` },
  openGraph: {
    title: "Property Regions Across Australia",
    description: "Browse real estate and suburb profiles across every Australian region.",
    type: "website",
  },
};

const STATE_ORDER = ["QLD", "NSW", "VIC", "WA", "SA", "TAS", "ACT", "NT"];
const STATE_NAMES: Record<string, string> = {
  QLD: "Queensland",
  NSW: "New South Wales",
  VIC: "Victoria",
  WA:  "Western Australia",
  SA:  "South Australia",
  TAS: "Tasmania",
  ACT: "Australian Capital Territory",
  NT:  "Northern Territory",
};

export default async function RegionsPage() {
  const regions = await getAllRegions();

  // Group by state
  const byState = STATE_ORDER.reduce<Record<string, typeof regions>>((acc, state) => {
    acc[state] = regions.filter((r) => r.state === state);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={[{ label: "Regions" }]} />

      <div className="mt-6 mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Australian Property Regions</h1>
        <p className="text-gray-500 mt-2">
          Browse median house prices, market trends, and suburb profiles across{" "}
          {regions.length} regions nationwide.
        </p>
      </div>

      <div className="space-y-12">
        {STATE_ORDER.map((state) => {
          const stateRegions = byState[state];
          if (!stateRegions?.length) return null;
          return (
            <section key={state}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {STATE_NAMES[state]}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {stateRegions.map((region) => (
                  <Link
                    key={region.slug}
                    href={`/regions/${region.slug}`}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 hover:border-primary hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium text-gray-800 group-hover:text-primary transition-colors truncate">
                        {region.region}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                      {region.suburbCount}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
