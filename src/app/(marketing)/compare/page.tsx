import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo";
import { ExpertCTA, BUYING_GUIDE_CTA } from "@/components/journey";
import {
  getTopSuburbsByState,
  getTopComparisonPairsByState,
  getStateName,
  type ComparisonPair,
} from "@/lib/services/suburb-rankings-service";
import { SITE_URL } from "@/lib/constants";
import { CompareForm } from "./CompareForm";
import { Band, HeroLead, HeroTitle, PhotoHero, RuleGrid, RuleItem, SectionHeading } from "@/components/premium";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Compare Suburbs Side by Side",
  description:
    "Compare any two Australian suburbs head to head, median prices, growth, schools, walkability, and risk. Free, fast, no sign-up.",
  alternates: { canonical: `${SITE_URL}/compare` },
  openGraph: {
    url: `${SITE_URL}/compare`,
    title: "Compare Suburbs Side by Side",
    description:
      "Compare any two Australian suburbs head to head, median prices, growth, schools, walkability and risk.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

// Hand-curated city-vs-city pairings. We seed these because they're the queries
// most users type ("Bondi vs Coogee", "Toorak vs Brighton") and they give the
// page real internal-link density before users supply their own pairs.
const POPULAR_PAIRS: { aSlug: string; bSlug: string; aName: string; bName: string; subtitle: string }[] = [
  // NSW
  { aSlug: "bondi-nsw-2026",         bSlug: "coogee-nsw-2034",        aName: "Bondi",       bName: "Coogee",        subtitle: "Eastern beaches" },
  { aSlug: "newtown-nsw-2042",       bSlug: "surry-hills-nsw-2010",   aName: "Newtown",     bName: "Surry Hills",   subtitle: "Inner west vs inner east" },
  { aSlug: "manly-nsw-2095",         bSlug: "mosman-nsw-2088",        aName: "Manly",       bName: "Mosman",        subtitle: "Northern beaches" },
  // VIC
  { aSlug: "richmond-vic-3121",      bSlug: "fitzroy-vic-3065",       aName: "Richmond",    bName: "Fitzroy",       subtitle: "Inner Melbourne" },
  { aSlug: "toorak-vic-3142",        bSlug: "brighton-vic-3186",      aName: "Toorak",      bName: "Brighton",      subtitle: "Prestige" },
  { aSlug: "carlton-vic-3053",       bSlug: "south-yarra-vic-3141",   aName: "Carlton",     bName: "South Yarra",   subtitle: "Inner-city living" },
  // QLD
  { aSlug: "new-farm-qld-4005",      bSlug: "teneriffe-qld-4005",     aName: "New Farm",    bName: "Teneriffe",     subtitle: "Inner Brisbane" },
  { aSlug: "paddington-qld-4064",    bSlug: "ashgrove-qld-4060",      aName: "Paddington",  bName: "Ashgrove",      subtitle: "Inner-west character" },
  { aSlug: "bulimba-qld-4171",       bSlug: "hawthorne-qld-4171",     aName: "Bulimba",     bName: "Hawthorne",     subtitle: "Brisbane riverside" },
];

const ALL_STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"];

export default async function ComparePage() {
  // Pull a small set of popular suburbs from each big state for the
  // "popular suburbs" rail at the bottom. Each one becomes a sortable starting
  // point for a fresh comparison.
  // Skip the DB at build (Railway proxy drops build-time connections); ISR
  // (revalidate above) fills real data on first request. Empty renders cleanly
  // — every rail below maps over arrays and the by-state list drops empties.
  const isBuild = process.env.NEXT_PHASE === "phase-production-build";

  const [topNSW, topVIC, topQLD] = isBuild
    ? ([[], [], []] as Awaited<ReturnType<typeof getTopSuburbsByState>>[])
    : await Promise.all([
        getTopSuburbsByState("NSW", 8),
        getTopSuburbsByState("VIC", 8),
        getTopSuburbsByState("QLD", 8),
      ]);

  // Top auto-generated comparison pairs per state, fills the SEO gap
  // for WA / SA / TAS / NT / ACT that the hand-curated POPULAR_PAIRS
  // doesn't cover, and gives Google many more pages to crawl.
  const pairsByState = await Promise.all(
    ALL_STATES.map(async (state) => ({
      state,
      stateName: getStateName(state),
      pairs: isBuild
        ? ([] as Awaited<ReturnType<typeof getTopComparisonPairsByState>>)
        : await getTopComparisonPairsByState(state, 8),
    })),
  );
  const pairsWithData = pairsByState.filter((s) => s.pairs.length > 0);

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Compare Suburbs", url: "/compare" }]} />

      <PhotoHero photo="street" breadcrumbs={[{ label: "Compare suburbs" }]}>
        <p className="text-sm text-ink-muted mb-5">
          Compare suburbs head to head
        </p>
        <HeroTitle>
          Two suburbs, <span>one verdict</span>
        </HeroTitle>
        <HeroLead>
          Pick any two Australian suburbs and we&rsquo;ll line them up
          side by side, median prices, growth, schools, walkability,
          and risk in one view.
        </HeroLead>
        <p className="mt-6 text-base text-ink-muted">
          Not sure where to start?{" "}
          <Link
            href="/find-your-suburb"
            className="font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink"
          >
            Take the 4-question suburb quiz →
          </Link>
        </p>
      </PhotoHero>

      {/* Picker: the page's job, directly under the hero */}
      <Band tone="quiet" spacing="compact">
        <div className="rounded-xl border border-line bg-surface-raised p-6 sm:p-8 max-w-4xl">
          <CompareForm />
        </div>
      </Band>

      {/* Popular pairings */}
      <Band spacing="compact">
        <div className="mb-10">
          <p className="text-sm text-ink-muted mb-3">
            Popular comparisons
          </p>
          <SectionHeading size="md" title="Suburb pairings people search the most" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {POPULAR_PAIRS.map(({ aSlug, bSlug, aName, bName, subtitle }) => (
            <Link
              key={`${aSlug}-${bSlug}`}
              href={`/suburbs/${aSlug}/vs/${bSlug}`}
              className="group flex flex-col rounded-xl border border-line bg-surface-warm p-6 hover:border-ink transition-colors"
            >
              <p className="text-sm text-ink-muted mb-3">
                {subtitle}
              </p>
              <p className="text-2xl font-bold text-ink group-hover:text-primary transition-colors leading-tight tracking-[-0.02em]">
                {aName} <span>vs</span> {bName}
              </p>
              <p className="mt-auto pt-5 text-base font-semibold text-ink">
                Compare →
              </p>
            </Link>
          ))}
        </div>
      </Band>

      {/* Top comparisons by state, auto-generated from data so every
          state (incl. WA / SA / TAS / NT / ACT) gets coverage, not just
          the hand-curated pairs above. Each link goes to a real
          comparison page rendered by /suburbs/[slug]/vs/[compareSlug]. */}
      <Band tone="quiet" spacing="compact">
        <div className="mb-10">
          <p className="text-sm text-ink-muted mb-3">
            By state
          </p>
          <SectionHeading
            size="md"
            title="Top comparisons in every state"
            intro={
              <>
                Sourced from the most populous suburbs in each state and the
                neighbours people compare them with, see how they line up on
                price, growth, schools, walkability and risk.
              </>
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10">
          {pairsWithData.map(({ state, stateName, pairs }) => (
            <div key={state}>
              <h3 className="text-xl text-ink mb-4 pb-3 border-b-2 border-ink">
                {stateName}
              </h3>
              <ul className="space-y-2">
                {pairs.map((p: ComparisonPair) => (
                  <li key={`${p.aSlug}-${p.bSlug}`}>
                    <Link
                      href={`/suburbs/${p.aSlug}/vs/${p.bSlug}`}
                      className="group inline-flex items-center gap-2 text-base text-ink-muted hover:text-primary transition-colors"
                    >
                      <span className="text-ink font-semibold group-hover:text-primary transition-colors">{p.aName}</span>
                      <span className="text-ink-subtle">vs</span>
                      <span className="text-ink font-semibold group-hover:text-primary transition-colors">{p.bName}</span>
                      <span className="text-ink-subtle text-sm">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Band>

      {/* By state, populous suburbs as starting points */}
      <Band spacing="compact">
        <div className="mb-10">
          <p className="text-sm text-ink-muted mb-3">
            Or start from a popular suburb
          </p>
          <SectionHeading
            size="md"
            title="Top suburbs by state"
            intro={
              <>
                Click any suburb to view its profile, then pick a comparison from
                the &ldquo;vs nearby&rdquo; rail at the bottom.
              </>
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-16 gap-y-10">
          {[
            { label: "New South Wales", suburbs: topNSW },
            { label: "Victoria",         suburbs: topVIC },
            { label: "Queensland",       suburbs: topQLD },
          ].map(({ label, suburbs }) => (
            <div key={label}>
              <h3 className="text-xl text-ink mb-4 pb-3 border-b-2 border-ink">
                {label}
              </h3>
              <ul className="space-y-2">
                {suburbs.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/suburbs/${s.slug}`}
                      className="text-base text-ink hover:text-primary transition-colors"
                    >
                      {s.name}{" "}
                      <span className="text-ink-subtle">
                        ({s.state} {s.postcode})
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Band>

      {/* What we compare */}
      <Band tone="dark" spacing="compact">
        <p className="text-sm text-ink-muted mb-3">
          What we compare
        </p>
        <SectionHeading size="md" title="Six dimensions, one verdict" />

        <RuleGrid columns={3} className="mt-12">
          {[
            { title: "Price &amp; market",  body: "Median house and unit prices, annual growth, days on market." },
            { title: "Rental",             body: "Weekly rents, owner-occupied vs rented, demographic context." },
            { title: "Lifestyle",          body: "Walk, transit, and bike scores. Population and median age." },
            { title: "Risk",               body: "Flood class and bushfire rating from Geoscience Australia." },
            { title: "Schools",            body: "Schools nearby and average ICSEA from ACARA data." },
            { title: "Climate",            body: "Annual rainfall and average summer max temp from BoM." },
          ].map((d) => (
            <RuleItem
              key={d.title}
              title={<span dangerouslySetInnerHTML={{ __html: d.title }} />}
            >
              {d.body}
            </RuleItem>
          ))}
        </RuleGrid>
      </Band>

      {/* Funnel exit: comparison shoppers are deep-research buyers — the
          tool previously dead-ended with no path to a lead form. */}
      <ExpertCTA {...BUYING_GUIDE_CTA} />
    </>
  );
}
