import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { LOCALITIES_ONLY, NOT_PLACES_VERSION } from "@/lib/non-localities";
import { GLOSSARY_TERMS } from "@/lib/data/glossary";
import { SITE_URL } from "@/lib/constants";

// The counts come from the DB. As a static ISR page this served its
// build-time render (the build is DB-free, so every count read 0) for the
// first hour after every deploy, under "Every number, sourced and live".
// Render on request instead and cache the counts for an hour, the pattern
// /regions uses.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Data, Sources &amp; Live Numbers",
  description:
    "How much data sits behind every page on Your Property Guide, live counts of suburbs, schools, properties, hazards, and the named source behind each.",
  alternates: { canonical: `${SITE_URL}/data` },
  openGraph: {
    url: `${SITE_URL}/data`,
    title: "Our Data, Sources & Live Numbers",
    description:
      "Live counts of every dataset behind Your Property Guide, sourced and dated.",
    type: "article",
  },
  twitter: { card: "summary_large_image" },
};

interface StatBlock {
  value: string;
  label: string;
  source: string;
  context: string;
  href?: string;
  sourceLink?: string;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`;
  if (n >= 10_000) return `${(n / 1000).toFixed(1)}K+`;
  if (n >= 1000) return n.toLocaleString();
  return String(n);
}

async function getCounts() {
  // One count at a time. At runtime the pool holds one connection (lib/db.ts)
  // and a query waiting for it gives up after 5s. The address and sales
  // counts take most of a second each, so twelve started at once left the
  // last ones waiting too long: rendered against the Railway proxy from
  // outside Vercel, the page failed with "timeout exceeded when trying to
  // connect".
  const suburbs = await db.suburb.count({ where: LOCALITIES_ONLY });
  const schools = await db.school.count();
  const propertiesActive = await db.property.count({ where: { status: "active" } });
  const propertiesSold = await db.property.count({ where: { status: "sold" } });
  const propertyAddresses = await db.propertyAddress.count();
  const propertySales = await db.propertySale.count();
  const hazards = await db.suburbHazard.count();
  const climates = await db.suburbClimate.count();
  const agents = await db.agent.count();
  const agencies = await db.agency.count();
  const blogPosts = await db.blogPost.count();
  const houseAndLand = await db.houseAndLandPackage.count();
  return {
    suburbs,
    schools,
    propertiesActive,
    propertiesSold,
    propertyAddresses,
    propertySales,
    hazards,
    climates,
    agents,
    agencies,
    blogPosts,
    houseAndLand,
  };
}

// The data cache outlives a deploy, so the deployment is part of the key:
// a count added to getCounts reaches the page with the deploy that adds it.
const getCachedCounts = unstable_cache(
  getCounts,
  ["data-counts:v1", NOT_PLACES_VERSION, process.env.VERCEL_DEPLOYMENT_ID ?? "local"],
  { revalidate: 3600, tags: ["data-counts"] },
);

export default async function DataPage() {
  const c = await getCachedCounts();
  const totalGuides = 50; // hand-tracked; matches the guides hub
  const totalGlossary = GLOSSARY_TERMS.length;

  const heroStats: StatBlock[] = [
    {
      value: formatCount(c.suburbs),
      label: "Suburbs profiled",
      source: "ABS, state Valuer-General offices",
      context: "Every suburb in Australia with median, growth, demographics, schools, walk score and hazard data.",
      href: "/suburbs",
    },
    {
      value: formatCount(c.schools),
      label: "Schools tracked",
      source: "ACARA",
      context: "Government, Catholic, and independent schools with year range, sector, ICSEA and catchment data.",
      href: "/schools",
    },
    {
      value: formatCount(c.propertyAddresses),
      label: "Property addresses",
      source: "GNAF, state revenue offices",
      context: "Individual property records with sales history and street-level granularity.",
    },
    {
      value: formatCount(c.propertySales),
      label: "Sales records",
      source: "State Valuer-General offices",
      context: "Historical sales used to calculate medians, growth, and recent comparables.",
      href: "/sold",
    },
  ];

  const datasets: { heading: string; rows: StatBlock[] }[] = [
    {
      heading: "Listings",
      rows: [
        { value: formatCount(c.propertiesActive), label: "Active listings",   source: "Real estate agencies + manual partner uploads", context: "Properties currently for sale or rent.", href: "/buy" },
        { value: formatCount(c.propertiesSold),   label: "Recently sold",     source: "State Valuer-General + agency reports",          context: "Sales completed in the last 12 to 24 months." },
        { value: formatCount(c.houseAndLand),     label: "House & land packages", source: "Builder partners",                          context: "New build packages from participating builders.", href: "/house-and-land" },
      ],
    },
    {
      heading: "Suburb data",
      rows: [
        { value: formatCount(c.suburbs),  label: "Suburbs",       source: "ABS Statistical Areas + Australia Post", context: "Every Australian suburb with median, growth, and demographic data." },
        { value: formatCount(c.hazards),  label: "Hazard records", source: "Geoscience Australia + state hazard mapping",  context: "Flood class and bushfire risk classification per suburb." },
        { value: formatCount(c.climates), label: "Climate records", source: "Bureau of Meteorology",                       context: "Mean monthly rainfall and temperature, matched to nearest BoM station." },
      ],
    },
    {
      heading: "People",
      rows: [
        { value: formatCount(c.agents),   label: "Real estate agents", source: "State licensing registers",       context: "Active agents with listing and sales history.", href: "/find-an-expert" },
        { value: formatCount(c.agencies), label: "Real estate agencies", source: "State licensing registers",     context: "Agencies operating across Australia.", href: "/real-estate-agencies" },
      ],
    },
    {
      heading: "Editorial",
      rows: [
        { value: String(totalGuides),    label: "Guides",          source: "Editorial team",  context: "In-depth, sourced, dated guides for buyers, sellers, movers, investors, renters.", href: "/guides" },
        { value: String(totalGlossary),  label: "Glossary terms",  source: "Editorial team",  context: "Plain-English definitions of every property term you'll meet.", href: "/glossary" },
        { value: String(c.blogPosts),    label: "Articles",        source: "Editorial team",  context: "Capital city outlooks, market updates, and topical analysis.", href: "/guides" },
      ],
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Our data", url: "/data" }]} />

      {/* Editorial hero */}
      <section className="relative bg-surface-warm border-b border-line overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pb-16">
          <div className="mb-8">
            <Breadcrumbs items={[{ label: "Our data" }]} />
          </div>

          <div className="flex items-center gap-4 mb-10">
            <span className="text-sm font-semibold text-ink-muted leading-none">
              Live counts
            </span>
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[13px] text-ink-subtle font-sans font-medium">
              Refreshed hourly
            </span>
          </div>
          <h1 className="font-display text-ink leading-[0.98] tracking-tight text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-10 max-w-[18ch] font-bold">
            Every number,{" "}
            <span>sourced and live</span>
          </h1>
          <p className="font-display font-normal text-xl sm:text-2xl text-ink leading-[1.25] max-w-3xl">
            Here&rsquo;s the data behind every page on Your Property Guide,
            counted live from our database. Each row names the body that
            publishes it.
          </p>
        </div>
      </section>

      {/* Hero stat grid */}
      <section className="bg-surface-raised border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {heroStats.map((s) => {
              const inner = (
                <>
                  <p className="font-display text-5xl text-ink leading-none mb-3">
                    {s.value}
                  </p>
                  <p className="text-[13px] font-sans text-ink-subtle mb-3">
                    {s.label}
                  </p>
                  <p className="font-sans text-sm text-ink-muted leading-relaxed mb-3">
                    {s.context}
                  </p>
                  <p className="font-sans text-xs text-ink-subtle">
                    Source: {s.source}
                  </p>
                </>
              );
              return s.href ? (
                <Link
                  key={s.label}
                  href={s.href}
                  className="group rounded-2xl border border-line bg-surface-warm p-6 hover:border-primary/40 hover:shadow-md transition-all"
                >
                  {inner}
                </Link>
              ) : (
                <div
                  key={s.label}
                  className="rounded-2xl border border-line bg-surface-warm p-6"
                >
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detailed dataset breakdown */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {datasets.map((d) => (
          <section key={d.heading}>
            <div className="mb-5 pb-3 border-b border-line">
              <p className="text-[13px] font-sans text-ink-subtle mb-2">
                Dataset
              </p>
              <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight">
                {d.heading}
              </h2>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-line bg-surface-raised">
              <table className="w-full text-sm">
                <thead className="bg-surface-warm border-b border-line">
                  <tr>
                    <th className="py-3 px-4 text-left text-[13px] font-sans font-medium text-ink w-32">Count</th>
                    <th className="py-3 px-4 text-left text-[13px] font-sans font-medium text-ink w-48">Dataset</th>
                    <th className="py-3 px-4 text-left text-[13px] font-sans font-medium text-ink">What it covers</th>
                    <th className="py-3 px-4 text-left text-[13px] font-sans font-medium text-ink w-72">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {d.rows.map((r) => (
                    <tr key={r.label} className="hover:bg-surface-warm/60 transition-colors">
                      <td className="py-4 px-4 font-display text-xl text-ink whitespace-nowrap">{r.value}</td>
                      <td className="py-4 px-4 font-sans">
                        {r.href ? (
                          <Link
                            href={r.href}
                            className="font-medium text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
                          >
                            {r.label}
                          </Link>
                        ) : (
                          <span className="font-medium text-ink">{r.label}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 font-sans text-ink-muted leading-relaxed">{r.context}</td>
                      <td className="py-4 px-4 font-sans text-xs text-ink-subtle leading-relaxed">{r.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        {/* Editorial commitments */}
        <section className="rounded-2xl border border-line bg-surface-warm p-6 sm:p-8">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <p className="text-[13px] font-sans text-ink-subtle mb-3">
                Editorial commitments
              </p>
              <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight">
                Sourced. Dated. Free
              </h2>
            </div>
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  { title: "Sourced",   body: "Every figure on the site cites the body that publishes it." },
                  { title: "Dated",     body: "Every figure carries the as-of date, surface it and we'll show you in a tooltip on the suburb page." },
                  { title: "Free",      body: "No paywall, no email gate. The data is the product, and it stays free." },
                ].map((c) => (
                  <div key={c.title}>
                    <p className="font-display text-xl text-ink leading-tight mb-2">{c.title}</p>
                    <p className="font-sans text-sm text-ink-muted leading-relaxed">{c.body}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6">
                <Link
                  href="/methodology"
                  className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
                >
                  Read the full methodology →
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
