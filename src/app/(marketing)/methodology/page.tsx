import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { Band, HeroLead, HeroTitle, PhotoHero, RuleGrid, RuleItem, SectionHeading } from "@/components/premium";

export const metadata: Metadata = {
  // Title aligned with the education-led positioning. The methodology
  // page is where the brand promise (plain-English education backed
  // by named sources) gets shown rather than told. Root template
  // appends the brand.
  title: "How we source the data, and what we don't claim to know",
  description:
    "Every figure on Your Property Guide is sourced, dated, and replaceable when we get better data. Here's where each one comes from, how often it refreshes, and the gaps we're honest about.",
  alternates: { canonical: `${SITE_URL}/methodology` },
  openGraph: { ...DEFAULT_OG,
    url: `${SITE_URL}/methodology`,
    title: "How we source the data, and what we don't claim to know",
    description: "Every figure on Your Property Guide is sourced, dated, and replaceable when we get better data.",
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
    source: "NSW Valuer General, VIC Dept of Transport, SA Govt open data, ABS",
    cadence: "Quarterly (NSW/VIC/SA real sales); annual (ABS for other states)",
    description:
      "NSW medians come from every actual transaction recorded by the NSW Valuer General. VIC medians come from the Department of Transport's quarterly suburb-level publication. SA Metro Adelaide medians come from data.sa.gov.au. QLD and WA don't publish free bulk sale-price data, and the ABS annual SA2-level medians for those states are a year stale — so for many QLD/WA suburbs the page shows \"Verified median pending\" rather than publish a number we don't trust. We're working on a data partner; in the meantime, treat the state-level figures as the guide.",
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
    source: "SILO (Queensland Government), from Bureau of Meteorology observations",
    cadence: "Annually (1991–2020 averages)",
    description:
      "Mean monthly rainfall and temperatures are 1991–2020 averages for each suburb's own location, from SILO: the Queensland Government's database of Bureau of Meteorology observations, interpolated to a grid about 5 km apart. Each suburb takes the grid point nearest its centre, or the nearest point on land for a coastal or island suburb. A suburb not yet updated shows the long-term average from a named Bureau station and its distance instead, and we leave the figures out when that station is more than 50 km away. SILO data is licensed CC BY 4.0, © State of Queensland.",
    link: { label: "SILO climate data", href: "https://www.longpaddock.qld.gov.au/silo/" },
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

      {/* Hero, over the paperwork photo. */}
      <PhotoHero photo="paperwork" breadcrumbs={[{ label: "Methodology" }]}>
        <div className="flex items-center gap-4 mb-8">
          <span className="text-sm font-semibold text-ink-muted leading-none">
            Editorial methodology
          </span>
          <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
          <span className="text-sm text-ink-subtle font-medium">
            Sources, dated
          </span>
        </div>
        <HeroTitle>
          How we source the data, and what we{" "}
          <span>don&rsquo;t</span>{" "}
          claim to know
        </HeroTitle>
        <HeroLead>
          Every figure on the site carries a source and an as-of date.
          Where we don&rsquo;t have a source we trust, we say so rather than
          publish a guess. This page documents where each data type comes
          from, how often we refresh, and the gaps we&rsquo;re honest about.
        </HeroLead>
        <p className="mt-8">
          <Link
            href="/data"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
          >
            See live dataset counts →
          </Link>
        </p>
      </PhotoHero>

      {/* Editorial principles row */}
      <Band spacing="compact">
        <RuleGrid columns={3} className="">
          {[
            { title: "Sourced",   body: "Every figure cites the body that publishes it. No second-hand &lsquo;industry estimates&rsquo;." },
            { title: "Dated",     body: "Every figure carries the as-of date in a tooltip on the suburb page." },
            { title: "Corrected", body: "We log every correction in the footer of the page where the error appeared." },
          ].map((p) => (
            <RuleItem key={p.title} title={p.title}>
              <p dangerouslySetInnerHTML={{ __html: p.body }} />
            </RuleItem>
          ))}
        </RuleGrid>
      </Band>

      {/* Source-by-source */}
      <Band tone="quiet">
        <p className="text-sm font-semibold text-ink-muted mb-4">
          Data sources, line by line
        </p>
        <SectionHeading title={`${SOURCES.length} data types, ${SOURCES.length} named sources`} />

        <div className="mt-12 border-b border-line">
          {SOURCES.map((s) => (
            <article
              key={s.id}
              id={s.id}
              className="border-t border-line py-8 sm:py-10 scroll-mt-24"
            >
              <div className="grid lg:grid-cols-12 gap-5 lg:gap-10">
                <div className="lg:col-span-4">
                  <h3
                    className="text-xl font-bold text-ink leading-tight"
                    dangerouslySetInnerHTML={{ __html: s.label }}
                  />
                  <p className="text-sm text-ink-subtle mt-2">
                    {s.cadence}
                  </p>
                </div>
                <div className="lg:col-span-8">
                  <p className="text-base sm:text-lg text-ink leading-relaxed">
                    {s.description}
                  </p>
                  <p className="mt-4 text-sm text-ink-muted">
                    <span className="text-ink-subtle text-[13px] mr-2">
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
                        className="inline-flex items-center text-sm font-medium text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
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
      </Band>

      {/* Editorial process */}
      <Band>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-ink-muted mb-4">
            Editorial process
          </p>
          <SectionHeading title="Three checks before anything publishes" />
          <div className="mt-8 prose-ypg">
            <p>
              Every guide and every data refresh goes through the same three
              steps: a draft is prepared to a published outline with AI
              assistance, a domain reviewer
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
      </Band>

      {/* Corrections */}
      <Band tone="quiet">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-ink-muted mb-4">
            Corrections &amp; feedback
          </p>
          <SectionHeading title="Spotted something off? Tell us" />
          <p className="mt-6 text-lg text-ink-muted leading-relaxed mb-6">
            We&rsquo;ll investigate and respond within a week. Confirmed
            corrections are logged in the footer of the affected page.
          </p>
          <p>
            <a
              href="mailto:andy@theandylife.com"
              className="inline-flex items-center text-base font-medium text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
            >
              andy@theandylife.com →
            </a>
          </p>
          <p className="mt-8">
            <Link
              href="/about"
              className="inline-flex items-center text-sm text-ink-muted hover:text-primary transition-colors"
            >
              ← Back to about
            </Link>
          </p>
        </div>
      </Band>
    </>
  );
}
