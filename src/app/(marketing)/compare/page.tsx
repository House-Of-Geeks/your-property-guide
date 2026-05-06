import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { getTopSuburbsByState } from "@/lib/services/suburb-rankings-service";
import { SITE_URL } from "@/lib/constants";
import { CompareForm } from "./CompareForm";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Compare Suburbs Side by Side | Your Property Guide",
  description:
    "Compare any two Australian suburbs head to head — median prices, growth, schools, walkability, and risk. Free, fast, no sign-up.",
  alternates: { canonical: `${SITE_URL}/compare` },
  openGraph: {
    url: `${SITE_URL}/compare`,
    title: "Compare Suburbs Side by Side",
    description:
      "Compare any two Australian suburbs head to head — median prices, growth, schools, walkability and risk.",
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

export default async function ComparePage() {
  // Pull a small set of popular suburbs from each big state for the
  // "popular suburbs" rail at the bottom. Each one becomes a sortable starting
  // point for a fresh comparison.
  const [topNSW, topVIC, topQLD] = await Promise.all([
    getTopSuburbsByState("NSW", 8),
    getTopSuburbsByState("VIC", 8),
    getTopSuburbsByState("QLD", 8),
  ]);

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Compare Suburbs", url: "/compare" }]} />

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
            <Breadcrumbs items={[{ label: "Compare suburbs" }]} />
          </div>

          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
            Compare suburbs head to head
          </p>
          <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
            Two suburbs, <span className="italic text-primary">one verdict</span>.
          </h1>
          <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-2xl mb-3">
            Pick any two Australian suburbs and we&rsquo;ll line them up
            side by side, median prices, growth, schools, walkability,
            and risk in one view.
          </p>
          <p className="font-sans text-sm text-ink-muted mb-10">
            Not sure where to start?{" "}
            <Link
              href="/find-your-suburb"
              className="font-medium text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
            >
              Take the 4-question suburb quiz →
            </Link>
          </p>

          {/* Picker */}
          <div className="rounded-2xl border border-line bg-surface-raised p-6 sm:p-8 max-w-4xl shadow-card">
            <CompareForm />
          </div>
        </div>
      </section>

      {/* Popular pairings */}
      <section className="bg-surface-raised border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="mb-8">
            <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
              Popular comparisons
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight">
              Suburb pairings people search the most.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {POPULAR_PAIRS.map(({ aSlug, bSlug, aName, bName, subtitle }) => (
              <Link
                key={`${aSlug}-${bSlug}`}
                href={`/suburbs/${aSlug}/vs/${bSlug}`}
                className="group rounded-2xl border border-line bg-surface-warm p-6 hover:border-primary/40 hover:shadow-md transition-all"
              >
                <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
                  {subtitle}
                </p>
                <p className="font-display text-xl text-ink group-hover:text-primary transition-colors leading-tight">
                  {aName} <span className="italic text-primary">vs</span> {bName}
                </p>
                <p className="mt-3 font-sans text-xs text-ink-subtle uppercase tracking-wider">
                  Compare →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* By state — populous suburbs as starting points */}
      <section className="bg-surface-warm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="mb-8">
            <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
              Or start from a popular suburb
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight">
              Top suburbs by state.
            </h2>
            <p className="mt-2 font-sans text-sm text-ink-muted">
              Click any suburb to view its profile, then pick a comparison from
              the &ldquo;vs nearby&rdquo; rail at the bottom.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { label: "New South Wales", suburbs: topNSW },
              { label: "Victoria",         suburbs: topVIC },
              { label: "Queensland",       suburbs: topQLD },
            ].map(({ label, suburbs }) => (
              <div key={label}>
                <h3 className="font-display text-lg text-ink mb-3 pb-2 border-b border-line">
                  {label}
                </h3>
                <ul className="space-y-1.5">
                  {suburbs.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/suburbs/${s.slug}`}
                        className="font-sans text-sm text-ink-muted hover:text-primary transition-colors"
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
        </div>
      </section>

      {/* What we compare */}
      <section className="bg-surface-raised border-t border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="mb-8">
            <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
              What we compare
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight">
              Six dimensions, one verdict.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Price &amp; market",  body: "Median house and unit prices, annual growth, days on market." },
              { title: "Rental",             body: "Weekly rents, owner-occupied vs rented, demographic context." },
              { title: "Lifestyle",          body: "Walk, transit, and bike scores. Population and median age." },
              { title: "Risk",               body: "Flood class and bushfire rating from Geoscience Australia." },
              { title: "Schools",            body: "Schools nearby and average ICSEA from ACARA data." },
              { title: "Climate",            body: "Annual rainfall and average summer max temp from BoM." },
            ].map((d) => (
              <div
                key={d.title}
                className="rounded-2xl border border-line bg-surface-warm p-6"
              >
                <h3
                  className="font-display text-lg text-ink leading-tight"
                  dangerouslySetInnerHTML={{ __html: d.title }}
                />
                <p className="mt-2 font-sans text-sm text-ink-muted leading-relaxed">
                  {d.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
