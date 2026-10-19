import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { LOCALITIES_ONLY, NOT_PLACES_VERSION } from "@/lib/non-localities";
import { GLOSSARY_TERMS } from "@/lib/data/glossary";
import { SITE_URL } from "@/lib/constants";
import { Band, HeroLead, HeroTitle, PhotoHero, RuleGrid, RuleItem, SectionHeading } from "@/components/premium";

// The counts come from the DB. As a static ISR page this served its
// build-time render (the build is DB-free, so every count read 0) for the
// first hour after every deploy, under "Every number, sourced and live".
// Render on request instead and cache the counts for an hour, the pattern
// /regions uses.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Data, Sources & Live Numbers",
  description:
    "How much data sits behind every page on Your Property Guide, live counts of suburbs, schools, properties, hazards, and the named source behind each.",
  alternates: { canonical: `${SITE_URL}/data` },
  openGraph: { ...DEFAULT_OG,
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
      href: "/suburbs",
    },
  ];

  const datasets: { heading: string; rows: StatBlock[] }[] = [
    {
      heading: "Listings",
      rows: [
        { value: formatCount(c.propertiesActive), label: "Active listings",   source: "Real estate agencies + manual partner uploads", context: "Properties currently for sale or rent." },
        { value: formatCount(c.propertiesSold),   label: "Recently sold",     source: "State Valuer-General + agency reports",          context: "Sales completed in the last 12 to 24 months." },
        { value: formatCount(c.houseAndLand),     label: "House & land packages", source: "Builder partners",                          context: "New build packages from participating builders." },
      ],
    },
    {
      heading: "Suburb data",
      rows: [
        { value: formatCount(c.suburbs),  label: "Suburbs",       source: "ABS Statistical Areas + Australia Post", context: "Every Australian suburb with median, growth, and demographic data." },
        { value: formatCount(c.hazards),  label: "Hazard records", source: "Geoscience Australia + state hazard mapping",  context: "Flood class and bushfire risk classification per suburb." },
        { value: formatCount(c.climates), label: "Climate records", source: "SILO (Queensland Government)",                context: "1991–2020 monthly rainfall and temperature averages for each suburb's location, from Bureau of Meteorology observations." },
      ],
    },
    {
      heading: "People",
      rows: [
        { value: formatCount(c.agents),   label: "Real estate agents", source: "State licensing registers",       context: "Active agents with listing and sales history.", href: "/find-an-expert" },
        { value: formatCount(c.agencies), label: "Real estate agencies", source: "State licensing registers",     context: "Agencies operating across Australia." },
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

      <PhotoHero photo="paperwork" breadcrumbs={[{ label: "Our data" }]}>
        <p className="text-sm text-ink-muted mb-5">
          Live counts &middot; Refreshed hourly
        </p>
        <HeroTitle>
          Every number,{" "}
          <span>sourced and live</span>
        </HeroTitle>
        <HeroLead>
          Here&rsquo;s the data behind every page on Your Property Guide,
          counted live from our database. Each row names the body that
          publishes it.
        </HeroLead>
      </PhotoHero>

      {/* Hero stat grid */}
      <Band tone="quiet" spacing="compact">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {heroStats.map((s) => {
            const inner = (
              <>
                <p className="text-4xl sm:text-5xl font-bold text-ink leading-none tracking-[-0.03em] mb-4">
                  {s.value}
                </p>
                <p className="text-base font-semibold text-ink mb-3">
                  {s.label}
                </p>
                <p className="text-sm text-ink-muted leading-relaxed mb-3">
                  {s.context}
                </p>
                <p className="mt-auto text-sm text-ink-subtle">
                  Source: {s.source}
                </p>
              </>
            );
            return s.href ? (
              <Link
                key={s.label}
                href={s.href}
                className="group flex flex-col rounded-xl border border-line bg-surface-raised p-6 hover:border-ink transition-colors"
              >
                {inner}
              </Link>
            ) : (
              <div
                key={s.label}
                className="flex flex-col rounded-xl border border-line bg-surface-raised p-6"
              >
                {inner}
              </div>
            );
          })}
        </div>
      </Band>

      {/* Detailed dataset breakdown */}
      <Band spacing="compact">
        <div className="space-y-14">
        {datasets.map((d) => (
          <section key={d.heading}>
            <div className="mb-6">
              <p className="text-sm text-ink-muted mb-2">
                Dataset
              </p>
              <SectionHeading size="md" title={d.heading} />
            </div>
            <div className="overflow-x-auto rounded-xl border border-line bg-surface-raised">
              <table className="w-full text-sm">
                <thead className="bg-surface-warm border-b border-line">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-ink w-32">Count</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-ink w-48">Dataset</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-ink">What it covers</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-ink w-72">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {d.rows.map((r) => (
                    <tr key={r.label} className="hover:bg-surface-warm/60 transition-colors">
                      <td className="py-4 px-4 text-xl font-bold text-ink whitespace-nowrap">{r.value}</td>
                      <td className="py-4 px-4">
                        {r.href ? (
                          <Link
                            href={r.href}
                            className="font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink"
                          >
                            {r.label}
                          </Link>
                        ) : (
                          <span className="font-semibold text-ink">{r.label}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-ink-muted leading-relaxed">{r.context}</td>
                      <td className="py-4 px-4 text-sm text-ink-subtle leading-relaxed">{r.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
        </div>
      </Band>

      {/* Editorial commitments */}
      <Band tone="quiet" spacing="compact">
        <p className="text-sm text-ink-muted mb-3">
          Editorial commitments
        </p>
        <SectionHeading size="md" title="Sourced. Dated. Free" />
        <RuleGrid columns={3} className="mt-10">
          {[
            { title: "Sourced",   body: "Every figure on the site cites the body that publishes it." },
            { title: "Dated",     body: "Every figure carries the as-of date, surface it and we'll show you in a tooltip on the suburb page." },
            { title: "Free",      body: "No paywall, no email gate. The data is the product, and it stays free." },
          ].map((c) => (
            <RuleItem key={c.title} title={c.title}>
              {c.body}
            </RuleItem>
          ))}
        </RuleGrid>
        <p className="mt-10">
          <Link
            href="/methodology"
            className="inline-flex items-center gap-1.5 text-base font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink"
          >
            Read the full methodology →
          </Link>
        </p>
      </Band>
    </>
  );
}
