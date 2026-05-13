import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Methodology &amp; Data Sources | ${SITE_NAME}`,
  description:
    "How Your Property Guide sources, validates, and updates suburb data, school catchments, climate records, hazard maps, and crime statistics. Every source named and dated.",
  alternates: { canonical: `${SITE_URL}/methodology` },
  openGraph: {
    url: `${SITE_URL}/methodology`,
    title: `Methodology &amp; Data Sources | ${SITE_NAME}`,
    description: "Sources, refresh cadence, and editorial process behind every figure on the site.",
    type: "article",
  },
  twitter: { card: "summary_large_image" },
};

interface DataSource {
  id: string;
  label: string;
  source: string;
  cadence: string;
  description: string;
  link?: { label: string; href: string };
}

const SOURCES: DataSource[] = [
  {
    id: "median-prices",
    label: "Median house & unit prices",
    source: "State Valuer-General offices, Australian Bureau of Statistics",
    cadence: "Quarterly",
    description:
      "Headline median prices and annual growth come from each state's Valuer-General office. Where multiple sources disagree, we cite the most recent one. ABS is used as cross-validation.",
    link: { label: "ABS property statistics", href: "https://www.abs.gov.au/statistics/economy/price-indexes-and-inflation" },
  },
  {
    id: "rents",
    label: "Median rent and rental yield",
    source: "ABS Census 2021, REIA quarterly indicators",
    cadence: "Annually for census-derived; quarterly for REIA indicators",
    description:
      "Weekly rent figures come from the most recent census plus REIA's published medians. Gross yield is calculated as (annual rent ÷ median price) × 100.",
  },
  {
    id: "demographics",
    label: "Demographics & household composition",
    source: "Australian Bureau of Statistics, Census 2021",
    cadence: "Census refresh (5-yearly)",
    description:
      "Population, median age, ownership rate, household composition, and language data are all sourced from the most recent ABS Census. We re-import on each Census release.",
    link: { label: "ABS 2021 Census", href: "https://www.abs.gov.au/census/find-census-data" },
  },
  {
    id: "schools",
    label: "Schools & ICSEA",
    source: "Australian Curriculum, Assessment and Reporting Authority (ACARA)",
    cadence: "Annually",
    description:
      "School name, location, sector, year range, enrolment and ICSEA scores are pulled from ACARA's annual school data publication, licensed under CC BY 4.0. We don't publish individual NAPLAN results.",
    link: { label: "My School (ACARA)", href: "https://www.myschool.edu.au/" },
  },
  {
    id: "walkability",
    label: "Walkability, transit, and bike scores",
    source: "OpenStreetMap-derived metrics",
    cadence: "Re-computed quarterly",
    description:
      "Walk, transit, and bike scores are computed from OpenStreetMap network data, counts of nearby amenities, transit stops, and bike infrastructure within walking distance of the suburb centroid.",
    link: { label: "OpenStreetMap", href: "https://www.openstreetmap.org/" },
  },
  {
    id: "hazard",
    label: "Flood &amp; bushfire risk",
    source: "Geoscience Australia, state hazard mapping authorities",
    cadence: "Annually, plus immediately after major events",
    description:
      "Flood class and bushfire risk derived from Geoscience Australia's national flood hazard mapping and state bushfire prone land overlays. Suburb-level rating reflects the dominant exposure across the suburb polygon.",
    link: { label: "Geoscience Australia", href: "https://www.ga.gov.au/" },
  },
  {
    id: "climate",
    label: "Climate, rainfall &amp; temperature",
    source: "Bureau of Meteorology (BoM)",
    cadence: "Annually (BoM long-term averages)",
    description:
      "Mean monthly rainfall and temperature are sourced from BoM's long-term station averages. Each suburb is matched to its nearest active BoM station.",
    link: { label: "Bureau of Meteorology", href: "http://www.bom.gov.au/" },
  },
  {
    id: "crime",
    label: "Crime statistics",
    source: "State and territory police open data portals",
    cadence: "Updated as published (varies by jurisdiction)",
    description:
      "Crime data is sourced from each state's official open-data portal. Categories and reporting periods vary by jurisdiction, so we display the source-as-provided figures rather than re-categorising across states.",
  },
  {
    id: "boundaries",
    label: "Suburb &amp; postcode boundaries",
    source: "ABS, Australia Post",
    cadence: "Re-imported on each official release",
    description:
      "Suburb and postcode geometry uses ABS Statistical Areas and Australia Post's locality file. Where these disagree (which they sometimes do at the edge), we follow the ABS boundary.",
  },
  {
    id: "interest-rates",
    label: "RBA cash rate",
    source: "Reserve Bank of Australia",
    cadence: "Monthly (after each RBA decision)",
    description:
      "Cash rate history is sourced directly from RBA published decisions. Updated within 24 hours of each decision.",
    link: { label: "RBA media releases", href: "https://www.rba.gov.au/media-releases/" },
  },
];

export default function MethodologyPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Methodology", url: "/methodology" }]} />

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
            <Breadcrumbs items={[{ label: "Methodology" }]} />
          </div>

          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
            Sources &amp; methodology
          </p>
          <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
            How we source, <span className="italic text-primary">verify</span>, and update.
          </h1>
          <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-2xl">
            Every figure on the site carries a source and an as-of date. This
            page documents where each data type comes from, how often we
            refresh, and how to flag anything that looks off.
          </p>
          <p className="mt-6">
            <Link
              href="/data"
              className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
            >
              See live dataset counts →
            </Link>
          </p>
        </div>
      </section>

      {/* Editorial principles row */}
      <section className="bg-surface-raised border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Sourced",   body: "Every figure cites the body that publishes it. No second-hand &lsquo;industry estimates&rsquo;." },
              { title: "Dated",     body: "Every figure carries the as-of date in a tooltip on the suburb page." },
              { title: "Corrected", body: "We log every correction in the footer of the page where the error appeared." },
            ].map((p) => (
              <div key={p.title} className="rounded-2xl border border-line bg-surface-warm p-6">
                <p className="font-display text-2xl text-ink leading-tight mb-2">{p.title}</p>
                <p className="font-sans text-sm text-ink-muted leading-relaxed" dangerouslySetInnerHTML={{ __html: p.body }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Source-by-source */}
      <section className="bg-surface-warm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="mb-10">
            <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
              Data sources, line by line
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight">
              {SOURCES.length} data types, {SOURCES.length} named sources.
            </h2>
          </div>

          <div className="space-y-5">
            {SOURCES.map((s) => (
              <article
                key={s.id}
                id={s.id}
                className="rounded-2xl border border-line bg-surface-raised p-6 sm:p-7 scroll-mt-24"
              >
                <div className="grid lg:grid-cols-12 gap-5">
                  <div className="lg:col-span-4">
                    <h3
                      className="font-display text-xl text-ink leading-tight"
                      dangerouslySetInnerHTML={{ __html: s.label }}
                    />
                    <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mt-2">
                      {s.cadence}
                    </p>
                  </div>
                  <div className="lg:col-span-8">
                    <p className="font-sans text-base text-ink leading-relaxed">
                      {s.description}
                    </p>
                    <p className="mt-4 font-sans text-sm text-ink-muted">
                      <span className="text-ink-subtle uppercase tracking-wider text-xs mr-2">
                        Source
                      </span>
                      {s.source}
                    </p>
                    {s.link && (
                      <p className="mt-2">
                        <a
                          href={s.link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center font-sans text-sm font-medium text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
                        >
                          {s.link.label} →
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial process */}
      <section className="bg-surface-raised border-t border-line">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
            Editorial process
          </p>
          <h2 className="font-display text-ink leading-tight tracking-tight text-3xl mb-6">
            Three checks before anything publishes.
          </h2>
          <div className="prose-ypg">
            <p>
              Every guide and every data refresh goes through the same three
              steps: a writer drafts to a published outline, a domain reviewer
              (broker, agent, accountant, or planner depending on the topic)
              sanity-checks the technical claims, and the editor signs off
              for plain-English clarity.
            </p>
            <p>
              For data, we run a structural validation pass on every refresh
              (no negative medians, growth bounded to ±50%, ICSEA in valid
              range) and a freshness check (any field older than its
              expected cadence is flagged for re-source).
            </p>
          </div>
        </div>
      </section>

      {/* Corrections */}
      <section className="bg-surface-warm border-y border-line-warm">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
            Corrections &amp; feedback
          </p>
          <h2 className="font-display text-ink leading-tight tracking-tight text-3xl mb-6">
            Spotted something off? Tell us.
          </h2>
          <p className="font-sans text-lg text-ink-muted leading-relaxed mb-6">
            We&rsquo;ll investigate and respond within a week. Confirmed
            corrections are logged in the footer of the affected page.
          </p>
          <p>
            <a
              href="mailto:andy@theandylife.com"
              className="inline-flex items-center font-sans text-base font-medium text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
            >
              andy@theandylife.com →
            </a>
          </p>
          <p className="mt-8">
            <Link
              href="/about"
              className="inline-flex items-center font-sans text-sm text-ink-muted hover:text-primary transition-colors"
            >
              ← Back to about
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
