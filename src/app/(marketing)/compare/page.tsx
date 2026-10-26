import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo";
import { ExpertCTA, BUYING_GUIDE_CTA } from "@/components/journey";
import { unstable_cache } from "next/cache";
import {
  getTopSuburbsByState,
  getTopComparisonPairsByState,
  getStateName,
  type ComparisonPair,
} from "@/lib/services/suburb-rankings-service";
import { NOT_PLACES_VERSION } from "@/lib/non-localities";
import { SITE_URL } from "@/lib/constants";
import { POPULAR_COMPARE_PAIRS, allowedComparePairKeys } from "@/lib/compare-pairs";
import { CompareForm } from "./CompareForm";
import { Band, HeroLead, HeroTitle, PhotoHero, RuleGrid, RuleItem, SectionHeading } from "@/components/premium";

// The two rails below the curated pairs query the DB. As a static ISR page
// this served its build-time render (the build is DB-free) for up to a day
// after every deploy: "Top comparisons in every state" and "Top suburbs by
// state" were headings over empty lists, 88 internal links short. Render on
// request instead and cache both rails behind the comparison sitemap's tag,
// the pattern /regions uses.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Compare Suburbs Side by Side",
  description:
    "Compare any two Australian suburbs head to head, median prices, growth, schools, walkability, and risk. Free, fast, no sign-up.",
  alternates: { canonical: `${SITE_URL}/compare` },
  openGraph: { ...DEFAULT_OG,
    url: `${SITE_URL}/compare`,
    title: "Compare Suburbs Side by Side",
    description:
      "Compare any two Australian suburbs head to head, median prices, growth, schools, walkability and risk.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const ALL_STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"];

// One query at a time. At runtime the pool holds one connection (lib/db.ts)
// and a query waiting for it gives up after 5s; the 19 below, started at
// once, took 3.6 to 4.2s from outside Vercel, the last of them close to that
// limit. Run in turn they take as long and none waits.
async function getCompareRails() {
  // Pull a small set of popular suburbs from each big state for the
  // "popular suburbs" rail at the bottom. Each one becomes a sortable starting
  // point for a fresh comparison.
  const topNSW = await getTopSuburbsByState("NSW", 8);
  const topVIC = await getTopSuburbsByState("VIC", 8);
  const topQLD = await getTopSuburbsByState("QLD", 8);

  // Top auto-generated comparison pairs per state, fills the SEO gap
  // for WA / SA / TAS / NT / ACT that the hand-curated POPULAR_PAIRS
  // doesn't cover, and gives Google many more pages to crawl.
  const pairsByState: { state: string; stateName: string; pairs: ComparisonPair[] }[] = [];
  for (const state of ALL_STATES) {
    pairsByState.push({ state, stateName: getStateName(state), pairs: await getTopComparisonPairsByState(state, 8) });
  }
  return { topNSW, topVIC, topQLD, pairsByState };
}

// The data cache outlives a deploy, so the deployment is part of the key.
const getCachedRails = unstable_cache(
  getCompareRails,
  ["compare-hub:v1", NOT_PLACES_VERSION, process.env.VERCEL_DEPLOYMENT_ID ?? "local"],
  { revalidate: 86400, tags: ["sitemap-compare"] },
);

export default async function ComparePage() {
  const { topNSW, topVIC, topQLD, pairsByState } = await getCachedRails();
  const allowedPairKeys = await allowedComparePairKeys();
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
          <CompareForm allowedPairKeys={allowedPairKeys} />
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
          {POPULAR_COMPARE_PAIRS.map(({ aSlug, bSlug, aName, bName, subtitle }) => (
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
            { title: "Climate",            body: "Annual rainfall and average summer max temp (SILO, from Bureau of Meteorology observations)." },
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
