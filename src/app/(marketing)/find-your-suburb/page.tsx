import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import {
  findMatchingSuburbs,
  priorityLabel,
  type Priority,
  type BudgetTier,
  type LifestyleStage,
  type QuizAnswers,
} from "@/lib/services/suburb-finder-service";
import { formatPrice } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Find Your Suburb: A 30-Second Australian Property Quiz | Your Property Guide",
  description:
    "Answer four questions and we'll match you with five Australian suburbs that fit your budget, priorities, and lifestyle. Free, free of sign-up, instant results.",
  alternates: { canonical: `${SITE_URL}/find-your-suburb` },
  openGraph: {
    url: `${SITE_URL}/find-your-suburb`,
    title: "Find Your Suburb: 30-Second Australian Property Quiz",
    description:
      "Answer four questions, get five suburb matches scored against your priorities.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

interface FindPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

const PRIORITIES: { value: Priority; label: string; tagline: string }[] = [
  { value: "growth",        label: "Capital growth",       tagline: "Suburbs where prices have run hardest" },
  { value: "yield",         label: "Rental yield",         tagline: "Higher rent return per dollar invested" },
  { value: "schools",       label: "School quality",       tagline: "Top-rated catchments and family suburbs" },
  { value: "walkability",   label: "Walkability",          tagline: "Cafes, transport, parks at your doorstep" },
  { value: "affordability", label: "Affordability",        tagline: "Most house for your budget" },
  { value: "low-risk",      label: "Low natural-hazard risk", tagline: "Out of flood and bushfire zones" },
];

const BUDGETS: { value: BudgetTier; label: string }[] = [
  { value: "under-500k", label: "Under $500K" },
  { value: "500k-800k",  label: "$500K – $800K" },
  { value: "800k-1.2m",  label: "$800K – $1.2M" },
  { value: "1.2m-2m",    label: "$1.2M – $2M" },
  { value: "over-2m",    label: "Over $2M" },
];

const STAGES: { value: LifestyleStage; label: string }[] = [
  { value: "first-home",         label: "First home buyer" },
  { value: "young-family",       label: "Young family" },
  { value: "established-family", label: "Established family" },
  { value: "downsizer",          label: "Downsizing" },
  { value: "investor",           label: "Investing" },
];

const STATES = [
  { value: "any", label: "Any state" },
  { value: "NSW", label: "New South Wales" },
  { value: "VIC", label: "Victoria" },
  { value: "QLD", label: "Queensland" },
  { value: "WA",  label: "Western Australia" },
  { value: "SA",  label: "South Australia" },
  { value: "TAS", label: "Tasmania" },
  { value: "ACT", label: "Australian Capital Territory" },
  { value: "NT",  label: "Northern Territory" },
];

function isValidPriority(v: string | undefined): v is Priority {
  return PRIORITIES.some((p) => p.value === v);
}
function isValidBudget(v: string | undefined): v is BudgetTier {
  return BUDGETS.some((b) => b.value === v);
}
function isValidStage(v: string | undefined): v is LifestyleStage {
  return STAGES.some((s) => s.value === v);
}
function isValidState(v: string | undefined): boolean {
  return STATES.some((s) => s.value === v);
}

export default async function FindYourSuburbPage({ searchParams }: FindPageProps) {
  const sp = await searchParams;

  // Parse & validate. If all four are present and valid, we have answers.
  const priority  = isValidPriority(sp.priority) ? sp.priority : null;
  const budget    = isValidBudget(sp.budget)     ? sp.budget   : null;
  const stage     = isValidStage(sp.stage)       ? sp.stage    : null;
  const state     = isValidState(sp.state)       ? sp.state    : "any";

  const haveAnswers = priority && budget && stage && state;
  const answers: QuizAnswers | null = haveAnswers
    ? { priority, budget, stage, state }
    : null;

  const matches = answers ? await findMatchingSuburbs(answers, 6) : [];

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Find your suburb", url: "/find-your-suburb" }]} />

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
            <Breadcrumbs items={[{ label: "Find your suburb" }]} />
          </div>

          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5 inline-flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            30-second match quiz
          </p>
          <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
            Find your <span className="italic text-primary">suburb</span> in 4 questions.
          </h1>
          <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-2xl">
            Tell us what matters most, your budget, and your lifestyle stage.
            We&rsquo;ll score every Australian suburb against your priorities
            and surface the top six matches.
          </p>
        </div>
      </section>

      {/* Quiz form, GET so the result URL is shareable + crawlable */}
      <section className="bg-surface-raised border-b border-line">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <form method="GET" action="/find-your-suburb" className="space-y-10">
            {/* Q1, Priority */}
            <fieldset>
              <legend className="block font-display text-xl text-ink mb-1">
                1. What matters most?
              </legend>
              <p className="font-sans text-sm text-ink-muted mb-4">
                Pick the single dimension you weight most heavily.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {PRIORITIES.map((p) => (
                  <label
                    key={p.value}
                    className={`relative flex flex-col rounded-xl border p-4 cursor-pointer transition-colors ${
                      priority === p.value
                        ? "border-primary bg-primary/5"
                        : "border-line bg-surface-warm hover:border-primary/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={p.value}
                      defaultChecked={priority === p.value}
                      className="sr-only"
                    />
                    <span className="font-display text-base text-ink leading-tight mb-1">
                      {p.label}
                    </span>
                    <span className="font-sans text-xs text-ink-muted leading-relaxed">
                      {p.tagline}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Q2, Budget */}
            <fieldset>
              <legend className="block font-display text-xl text-ink mb-1">
                2. What&rsquo;s your budget for the median home?
              </legend>
              <p className="font-sans text-sm text-ink-muted mb-4">
                Approximate is fine, we&rsquo;ll give partial credit on either side.
              </p>
              <div className="flex flex-wrap gap-2">
                {BUDGETS.map((b) => (
                  <label
                    key={b.value}
                    className={`px-4 py-2 rounded-lg border cursor-pointer text-sm font-sans font-medium transition-colors ${
                      budget === b.value
                        ? "bg-ink text-white border-ink"
                        : "bg-surface-warm border-line text-ink hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    <input
                      type="radio"
                      name="budget"
                      value={b.value}
                      defaultChecked={budget === b.value}
                      className="sr-only"
                    />
                    {b.label}
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Q3, Stage */}
            <fieldset>
              <legend className="block font-display text-xl text-ink mb-1">
                3. What stage are you at?
              </legend>
              <p className="font-sans text-sm text-ink-muted mb-4">
                Tweaks the secondary weights (e.g. families get a school bump).
              </p>
              <div className="flex flex-wrap gap-2">
                {STAGES.map((s) => (
                  <label
                    key={s.value}
                    className={`px-4 py-2 rounded-lg border cursor-pointer text-sm font-sans font-medium transition-colors ${
                      stage === s.value
                        ? "bg-ink text-white border-ink"
                        : "bg-surface-warm border-line text-ink hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    <input
                      type="radio"
                      name="stage"
                      value={s.value}
                      defaultChecked={stage === s.value}
                      className="sr-only"
                    />
                    {s.label}
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Q4, State */}
            <fieldset>
              <legend className="block font-display text-xl text-ink mb-1">
                4. Which state?
              </legend>
              <p className="font-sans text-sm text-ink-muted mb-4">
                Pick a state if you&rsquo;re committed, or &ldquo;any&rdquo; for
                national matches.
              </p>
              <select
                name="state"
                defaultValue={state}
                className="rounded-lg border border-line bg-surface-warm px-4 py-2.5 font-sans text-base text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary min-w-[280px]"
              >
                {STATES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </fieldset>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cta px-6 py-3 font-sans font-medium text-white hover:bg-cta-hover transition-colors"
              >
                Find my matches
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Results */}
      {answers && (
        <section className="bg-surface-warm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
            <div className="mb-8 max-w-3xl">
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
                Your matches
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight mb-3">
                {matches.length === 0 ? (
                  <>No strong matches found.</>
                ) : (
                  <>Top {matches.length} suburbs for <span className="italic text-primary">{priorityLabel(answers.priority).toLowerCase()}</span>.</>
                )}
              </h2>
              <p className="font-sans text-base text-ink-muted leading-relaxed">
                Scored across budget, your priority, and your stage. Click any
                suburb to see the full profile, comparable sales, schools and
                hazard data.
              </p>
            </div>

            {matches.length === 0 ? (
              <div className="rounded-2xl border border-line bg-surface-raised p-8 text-center">
                <p className="font-sans text-ink-muted">
                  No suburbs matched. Try widening your budget or selecting
                  &ldquo;any state&rdquo;.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {matches.map((m, i) => (
                  <Link
                    key={m.slug}
                    href={`/suburbs/${m.slug}`}
                    className="group rounded-2xl border border-line bg-surface-raised p-6 hover:border-primary/40 hover:shadow-md transition-all"
                  >
                    <div className="flex items-baseline justify-between mb-3">
                      <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle">
                        Match #{i + 1}
                      </p>
                      <p className="font-display text-2xl text-primary leading-none">
                        {m.score}
                      </p>
                    </div>
                    <h3 className="font-display text-2xl text-ink group-hover:text-primary transition-colors leading-tight">
                      {m.name}
                    </h3>
                    <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mt-1">
                      {m.state} {m.postcode}
                    </p>

                    {m.reasons.length > 0 && (
                      <ul className="mt-5 space-y-2">
                        {m.reasons.map((r, ri) => (
                          <li
                            key={ri}
                            className="font-sans text-sm text-ink-muted flex gap-2 items-start"
                          >
                            <span className="inline-block w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-5 pt-5 border-t border-line grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-[10px] font-sans uppercase tracking-wider text-ink-subtle">Median</p>
                        <p className="font-display text-sm text-ink">
                          {m.medianHousePrice > 0 ? formatPrice(m.medianHousePrice) : "–"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-sans uppercase tracking-wider text-ink-subtle">Growth</p>
                        <p className={`font-display text-sm ${m.annualGrowthHouse >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                          {m.annualGrowthHouse >= 0 ? "+" : ""}
                          {m.annualGrowthHouse.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-sans uppercase tracking-wider text-ink-subtle">Yield</p>
                        <p className="font-display text-sm text-ink">
                          {m.grossYield != null ? `${m.grossYield.toFixed(1)}%` : "–"}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 font-sans text-xs uppercase tracking-wider text-ink group-hover:text-primary transition-colors">
                      See profile →
                    </p>
                  </Link>
                ))}
              </div>
            )}

            {matches.length >= 2 && (
              <div className="mt-10 rounded-2xl border border-line bg-surface-raised p-6">
                <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-2">
                  Compare your top two
                </p>
                <p className="font-display text-xl text-ink leading-tight mb-3">
                  {matches[0].name} <span className="italic text-primary">vs</span> {matches[1].name}
                </p>
                <Link
                  href={`/suburbs/${matches[0].slug}/vs/${matches[1].slug}`}
                  className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
                >
                  See them side by side
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* How it works (only if no answers yet, so the page is useful with no params) */}
      {!answers && (
        <section className="bg-surface-warm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
            <div className="mb-8">
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
                How it works
              </p>
              <h2 className="font-display text-3xl text-ink leading-tight">
                Real data, weighted to what matters to you.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                {
                  num: "01",
                  title: "Score every suburb",
                  body: "We pull median price, annual growth, ICSEA school scores, walk score, gross yield and hazard data for thousands of Australian suburbs.",
                },
                {
                  num: "02",
                  title: "Weight to your priority",
                  body: "Your top priority gets 40% of the weight; budget always gets at least 20%; safety is baked in. Stage tweaks the secondary mix.",
                },
                {
                  num: "03",
                  title: "Surface the top six",
                  body: "We rank, dedupe by population (so we don't surface tiny localities), and show why each suburb scored where it did.",
                },
              ].map((s) => (
                <div
                  key={s.num}
                  className="rounded-2xl border border-line bg-surface-raised p-7"
                >
                  <p className="font-display italic text-primary text-3xl leading-none mb-3">
                    {s.num}
                  </p>
                  <h3 className="font-display text-lg text-ink leading-tight mb-2">
                    {s.title}
                  </h3>
                  <p className="font-sans text-sm text-ink-muted leading-relaxed">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
