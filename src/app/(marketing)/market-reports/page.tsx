import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Australian Property Market Reports | ${SITE_NAME}`,
  description:
    "State-by-state Australian property market reports with median prices, growth trends, and suburb rankings. Updated quarterly.",
  alternates: { canonical: `${SITE_URL}/market-reports` },
  openGraph: {
    url: `${SITE_URL}/market-reports`,
    title: `Australian Property Market Reports | ${SITE_NAME}`,
    description:
      "State-by-state Australian property market reports with median prices, growth trends, and suburb rankings.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const STATES = [
  {
    slug: "qld",
    name: "Queensland",
    abbr: "QLD",
    description: "Brisbane, Gold Coast, Sunshine Coast and regional Queensland property market data.",
  },
  {
    slug: "nsw",
    name: "New South Wales",
    abbr: "NSW",
    description: "Sydney, Newcastle, Wollongong and regional NSW property market data.",
  },
  {
    slug: "vic",
    name: "Victoria",
    abbr: "VIC",
    description: "Melbourne, Geelong, Ballarat and regional Victoria property market data.",
  },
  {
    slug: "wa",
    name: "Western Australia",
    abbr: "WA",
    description: "Perth, Fremantle and regional Western Australia property market data.",
  },
  {
    slug: "sa",
    name: "South Australia",
    abbr: "SA",
    description: "Adelaide, Glenelg and regional South Australia property market data.",
  },
  {
    slug: "tas",
    name: "Tasmania",
    abbr: "TAS",
    description: "Hobart, Launceston and regional Tasmania property market data.",
  },
  {
    slug: "nt",
    name: "Northern Territory",
    abbr: "NT",
    description: "Darwin and regional Northern Territory property market data.",
  },
  {
    slug: "act",
    name: "Australian Capital Territory",
    abbr: "ACT",
    description: "Canberra and ACT property market data.",
  },
];

export default function MarketReportsHubPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <CollectionPageJsonLd
        name="Property Market Reports"
        description="Australian state property market reports with median prices and suburb rankings."
        url="/market-reports"
      />
      <BreadcrumbJsonLd items={[{ name: "Market Reports", url: "/market-reports" }]} />
      <Breadcrumbs items={[{ label: "Market Reports" }]} />

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Australian Property Market Reports
        </h1>
        <p className="text-gray-500 mt-2 max-w-2xl">
          State-by-state property market data including median prices, annual growth, top performing
          suburbs, and affordability rankings. Updated quarterly from state revenue office and sales data.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {STATES.map((state) => (
          <Link
            key={state.slug}
            href={`/market-reports/${state.slug}`}
            className="group flex flex-col gap-3 rounded-xl bg-white shadow-card border border-gray-100 p-5 hover:shadow-lg hover:border-primary/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors flex-shrink-0">
                <BarChart2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-primary">{state.abbr}</span>
                <h2 className="font-semibold text-gray-900 group-hover:text-primary transition-colors leading-tight">
                  {state.name}
                </h2>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">{state.description}</p>
            <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              View report <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-10 text-xs text-gray-400 flex items-center gap-1.5">
        <BarChart2 className="w-3.5 h-3.5" />
        Market data sourced from state revenue offices and property sales data. Updated quarterly.
      </div>
    </div>
  );
}
