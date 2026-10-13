import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Band, HeroLead, HeroTitle, PhotoHero } from "@/components/premium";

export const metadata: Metadata = {
  title: "Australian Property Market Reports",
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
    description: "Brisbane, Gold Coast, Sunshine Coast and regional Queensland market data.",
  },
  {
    slug: "nsw",
    name: "New South Wales",
    abbr: "NSW",
    description: "Sydney, Newcastle, Wollongong and regional NSW market data.",
  },
  {
    slug: "vic",
    name: "Victoria",
    abbr: "VIC",
    description: "Melbourne, Geelong, Ballarat and regional Victoria market data.",
  },
  {
    slug: "wa",
    name: "Western Australia",
    abbr: "WA",
    description: "Perth, Fremantle and regional Western Australia market data.",
  },
  {
    slug: "sa",
    name: "South Australia",
    abbr: "SA",
    description: "Adelaide, Glenelg and regional South Australia market data.",
  },
  {
    slug: "tas",
    name: "Tasmania",
    abbr: "TAS",
    description: "Hobart, Launceston and regional Tasmania market data.",
  },
  {
    slug: "nt",
    name: "Northern Territory",
    abbr: "NT",
    description: "Darwin and regional Northern Territory market data.",
  },
  {
    slug: "act",
    name: "Australian Capital Territory",
    abbr: "ACT",
    description: "Canberra and ACT market data.",
  },
];

export default function MarketReportsHubPage() {
  return (
    <>
      <CollectionPageJsonLd
        name="Property Market Reports"
        description="Australian state property market reports with median prices and suburb rankings."
        url="/market-reports"
      />
      <BreadcrumbJsonLd items={[{ name: "Market Reports", url: "/market-reports" }]} />

      <PhotoHero photo="market" breadcrumbs={[{ label: "Market Reports" }]}>
        <p className="text-sm text-ink-muted mb-5">
          Updated quarterly
        </p>
        <HeroTitle>
          Property markets, <span>state by state</span>
        </HeroTitle>
        <HeroLead>
          Median prices, annual growth, top performing suburbs, and affordability rankings,
          sourced from state revenue offices and sales data.
        </HeroLead>
      </PhotoHero>

      <Band tone="quiet" spacing="compact">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {STATES.map((state) => (
            <Link
              key={state.slug}
              href={`/market-reports/${state.slug}`}
              className="group flex flex-col rounded-xl bg-surface-raised border border-line p-6 hover:border-ink transition-colors"
            >
              <p className="text-sm text-ink-subtle mb-2">
                {state.abbr}
              </p>
              <h2 className="text-2xl text-ink leading-tight tracking-[-0.02em] group-hover:text-primary transition-colors">
                {state.name}
              </h2>
              <p className="mt-3 text-sm text-ink-muted leading-relaxed">{state.description}</p>
              <span className="mt-auto pt-6 inline-flex items-center gap-1.5 text-base font-semibold text-ink group-hover:text-primary transition-colors">
                View report →
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-10 max-w-3xl border-t border-line pt-6 text-sm text-ink-muted leading-relaxed">
          Market data sourced from state revenue offices and property sales data. Updated quarterly.
        </p>
      </Band>
    </>
  );
}
