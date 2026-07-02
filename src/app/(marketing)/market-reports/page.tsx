import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

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

      {/* Editorial hero */}
      <section className="relative bg-surface-warm border-b border-line overflow-hidden">
        <Image
          src="/images/illustrations/contour.svg"
          alt=""
          width={1200}
          height={800}
          aria-hidden="true"
          className="absolute -right-40 -top-40 w-[1100px] max-w-none opacity-[0.10] pointer-events-none select-none"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pb-16">
          <div className="mb-8">
            <Breadcrumbs items={[{ label: "Market Reports" }]} />
          </div>

          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
            Updated quarterly
          </p>
          <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
            Property markets, <span className="italic text-primary">state by state</span>.
          </h1>
          <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-2xl">
            Median prices, annual growth, top performing suburbs, and affordability rankings,
            sourced from state revenue offices and sales data.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {STATES.map((state) => (
            <Link
              key={state.slug}
              href={`/market-reports/${state.slug}`}
              className="group flex flex-col gap-3 rounded-2xl bg-surface-raised border border-line p-6 hover:border-primary/40 hover:shadow-md transition-all"
            >
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle">
                {state.abbr}
              </p>
              <h2 className="font-display text-xl text-ink group-hover:text-primary transition-colors leading-tight">
                {state.name}
              </h2>
              <p className="font-sans text-sm text-ink-muted leading-relaxed">{state.description}</p>
              <span className="mt-auto font-sans text-sm font-medium text-ink border-b border-line-strong group-hover:border-primary group-hover:text-primary pb-0.5 transition-colors self-start">
                View report →
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-xs font-sans text-ink-subtle">
          Market data sourced from state revenue offices and property sales data. Updated quarterly.
        </p>
      </div>
    </>
  );
}
