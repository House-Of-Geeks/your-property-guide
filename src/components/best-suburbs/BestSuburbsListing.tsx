import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, ItemListJsonLd, FAQPageJsonLd } from "@/components/seo";
import { ExpertCTA } from "@/components/journey";
import {
  type RankingCategory,
  type RankedSuburb,
} from "@/lib/services/suburb-rankings-service";
import { formatPrice, formatPriceFull, formatPercentage } from "@/lib/utils/format";
import { CATEGORY_COMMENTARY } from "@/lib/data/category-commentary";
import { STATE_COMMENTARY } from "@/lib/data/state-commentary";

const STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"] as const;

export interface CategoryConfig {
  title: string;
  description: string;
}

const CATEGORY_CONFIG: Record<RankingCategory, CategoryConfig & { eyebrow: string; italicTitle: string }> = {
  "for-families": {
    title: "Best Suburbs for Families",
    italicTitle: "for families",
    eyebrow: "Family-friendly ranking",
    description: "Suburbs ranked by average school ICSEA score and family-household percentage.",
  },
  "highest-growth": {
    title: "Highest Growth Suburbs",
    italicTitle: "highest growth",
    eyebrow: "Capital-growth ranking",
    description: "Suburbs with the strongest annual house price growth over the past 12 months.",
  },
  "most-affordable": {
    title: "Most Affordable Suburbs",
    italicTitle: "most affordable",
    eyebrow: "Affordability ranking",
    description: "Suburbs with the lowest median house prices, great entry points into the property market.",
  },
  "most-walkable": {
    title: "Most Walkable Suburbs",
    italicTitle: "most walkable",
    eyebrow: "Walkability ranking",
    description: "Suburbs with the highest walk scores, perfect for car-free or car-light lifestyles.",
  },
  "lowest-flood-risk": {
    title: "Lowest Flood Risk Suburbs",
    italicTitle: "lowest flood risk",
    eyebrow: "Hazard-safe ranking",
    description: "Suburbs assessed as low flood risk or with no flood hazard record from Geoscience Australia.",
  },
  "best-rental-yield": {
    title: "Best Rental Yield Suburbs",
    italicTitle: "best rental yield",
    eyebrow: "Investor ranking",
    description: "Suburbs with the highest gross rental yields, calculated from median price and weekly rent.",
  },
};

const PRIMARY_LABEL: Record<RankingCategory, string> = {
  "for-families":      "Avg ICSEA",
  "highest-growth":    "Annual growth",
  "most-affordable":   "Median price",
  "most-walkable":     "Walk score",
  "lowest-flood-risk": "Flood risk",
  "best-rental-yield": "Gross yield",
};

const SECONDARY_LABEL: Record<RankingCategory, string> = {
  "for-families":      "Family HH %",
  "highest-growth":    "Median price",
  "most-affordable":   "Annual growth",
  "most-walkable":     "Median price",
  "lowest-flood-risk": "Median price",
  "best-rental-yield": "Weekly rent",
};

const STATE_NAME: Record<string, string> = {
  NSW: "New South Wales",
  VIC: "Victoria",
  QLD: "Queensland",
  WA:  "Western Australia",
  SA:  "South Australia",
  TAS: "Tasmania",
  NT:  "Northern Territory",
  ACT: "Australian Capital Territory",
};

function floodBadge(floodClass: string | null): React.ReactElement {
  if (!floodClass) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-sans font-medium bg-surface-warm border border-line text-ink-muted">
        No data
      </span>
    );
  }
  const classes: Record<string, string> = {
    low:      "bg-emerald-50 text-emerald-700 border-emerald-200",
    medium:   "bg-amber-50 text-amber-800 border-amber-200",
    high:     "bg-red-50 text-red-700 border-red-200",
    floodway: "bg-red-100 text-red-800 border-red-300",
  };
  const cls = classes[floodClass] ?? "bg-surface-warm border-line text-ink-muted";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-sans font-medium capitalize border ${cls}`}>
      {floodClass}
    </span>
  );
}

function PrimaryMetric({ category, suburb }: { category: RankingCategory; suburb: RankedSuburb }) {
  switch (category) {
    case "for-families":
      return <span className="font-display text-base text-ink">{suburb.avgSchoolIcsea != null ? suburb.avgSchoolIcsea.toLocaleString() : "–"}</span>;
    case "highest-growth":
      return (
        <span className={`font-display text-base ${suburb.annualGrowthHouse >= 0 ? "text-emerald-700" : "text-red-700"}`}>
          {suburb.annualGrowthHouse !== 0 ? formatPercentage(suburb.annualGrowthHouse) : "–"}
        </span>
      );
    case "most-affordable":
      return <span className="font-display text-base text-ink">{suburb.medianHousePrice > 0 ? formatPriceFull(suburb.medianHousePrice) : "–"}</span>;
    case "most-walkable":
      return (
        <span className="font-display text-base text-ink">
          {suburb.walkScore != null ? suburb.walkScore : "–"}
          <span className="text-ink-subtle font-sans text-xs ml-0.5">/100</span>
        </span>
      );
    case "lowest-flood-risk":
      return floodBadge(suburb.hazard?.floodClass ?? null);
    case "best-rental-yield":
      return (
        <span className="font-display text-base text-emerald-700">
          {suburb.grossRentalYield != null ? `${suburb.grossRentalYield.toFixed(2)}%` : "–"}
        </span>
      );
  }
}

function SecondaryMetric({ category, suburb }: { category: RankingCategory; suburb: RankedSuburb }) {
  switch (category) {
    case "for-families":
      return <span className="font-sans text-sm text-ink-muted">{suburb.householdsFamily > 0 ? `${suburb.householdsFamily.toFixed(0)}%` : "–"}</span>;
    case "highest-growth":
      return <span className="font-sans text-sm text-ink-muted">{suburb.medianHousePrice > 0 ? formatPrice(suburb.medianHousePrice) : "–"}</span>;
    case "most-affordable":
      return (
        <span className={`font-sans text-sm ${suburb.annualGrowthHouse !== 0 ? (suburb.annualGrowthHouse >= 0 ? "text-emerald-700" : "text-red-700") : "text-ink-subtle"}`}>
          {suburb.annualGrowthHouse !== 0 ? formatPercentage(suburb.annualGrowthHouse) : "–"}
        </span>
      );
    case "most-walkable":
    case "lowest-flood-risk":
      return <span className="font-sans text-sm text-ink-muted">{suburb.medianHousePrice > 0 ? formatPrice(suburb.medianHousePrice) : "–"}</span>;
    case "best-rental-yield":
      return <span className="font-sans text-sm text-ink-muted">{suburb.medianRentHouse > 0 ? `$${suburb.medianRentHouse}/wk` : "–"}</span>;
  }
}

interface BestSuburbsListingProps {
  category: RankingCategory;
  state: string | null; // upper-case state code or null for national
  suburbs: RankedSuburb[];
  /**
   * If true, state filter chips link to /best-suburbs/[category]/[state] (the
   * permutation route). If false, they link to /best-suburbs/[category]?state=NSW.
   */
  useStaticStateRoutes?: boolean;
}

export function BestSuburbsListing({
  category,
  state,
  suburbs,
  useStaticStateRoutes = false,
}: BestSuburbsListingProps) {
  const config = CATEGORY_CONFIG[category];
  const stateName = state ? STATE_NAME[state] ?? state : null;
  const categoryCommentary = CATEGORY_COMMENTARY[category];
  const stateCommentary = state ? STATE_COMMENTARY[state] : null;

  // Headline + canonical
  const headline = stateName
    ? `${config.title.replace(" Suburbs", "")} suburbs in ${stateName}`
    : config.title;
  const eyebrow = stateName
    ? `${config.eyebrow} · ${state}`
    : config.eyebrow;

  // URLs
  const baseUrl = `/best-suburbs/${category}`;
  const allHref = baseUrl;
  const stateHref = (s: string) =>
    useStaticStateRoutes ? `${baseUrl}/${s.toLowerCase()}` : `${baseUrl}?state=${s}`;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Best Suburbs", url: "/best-suburbs" },
          { name: config.title, url: baseUrl },
          ...(stateName ? [{ name: state ?? "", url: `${baseUrl}/${state?.toLowerCase()}` }] : []),
        ]}
      />
      <ItemListJsonLd
        name={headline}
        url={state ? `${baseUrl}/${state.toLowerCase()}` : baseUrl}
        items={suburbs.slice(0, 20).map((s) => ({
          name: s.name,
          url: `/suburbs/${s.slug}`,
          description: s.medianHousePrice ? formatPrice(s.medianHousePrice) : undefined,
        }))}
      />

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
            <Breadcrumbs
              items={[
                { label: "Best Suburbs", href: "/best-suburbs" },
                ...(stateName
                  ? [
                      { label: config.title, href: baseUrl },
                      { label: state ?? "" },
                    ]
                  : [{ label: config.title }]),
              ]}
            />
          </div>

          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
            {eyebrow}
          </p>
          <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
            {stateName ? (
              <>
                The <span className="italic text-primary">{config.italicTitle}</span> suburbs in {stateName}.
              </>
            ) : (
              <>
                The <span className="italic text-primary">{config.italicTitle}</span> suburbs in Australia.
              </>
            )}
          </h1>
          <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-2xl">
            {config.description}
            {stateName && ` Filtered to ${stateName} suburbs only.`}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Editorial commentary band, what this ranking is and how to use it */}
        <section className="mb-10 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
              About this ranking
            </p>
            <div className="prose-ypg prose-ypg-tight">
              <p>{categoryCommentary.intro}</p>
              {stateCommentary && (
                <>
                  <h3 className="font-display text-xl text-ink mt-6 mb-3">
                    {stateName} property market in 2026
                  </h3>
                  <p>{stateCommentary.marketContext}</p>
                </>
              )}
            </div>
          </div>

          <aside className="lg:col-span-5 space-y-4">
            {stateCommentary && (
              <>
                <div className="rounded-2xl border border-line bg-surface-warm p-5">
                  <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mb-2">
                    Buyer tip, {state}
                  </p>
                  <p className="font-sans text-sm text-ink leading-relaxed">
                    {stateCommentary.buyerTip}
                  </p>
                </div>
                <div className="rounded-2xl border border-line bg-surface-warm p-5">
                  <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mb-2">
                    Watch out, {state}
                  </p>
                  <p className="font-sans text-sm text-ink leading-relaxed">
                    {stateCommentary.watchOut}
                  </p>
                </div>
              </>
            )}
            <div className="rounded-2xl border border-line bg-surface-warm p-5">
              <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mb-2">
                Methodology
              </p>
              <p className="font-sans text-sm text-ink-muted leading-relaxed">
                {categoryCommentary.methodology}
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-surface-warm p-5">
              <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mb-2">
                Best for
              </p>
              <p className="font-sans text-sm text-ink-muted leading-relaxed">
                {categoryCommentary.bestFor}
              </p>
            </div>
          </aside>
        </section>

        {/* State filter pills */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mr-2">
            By state
          </span>
          <Link
            href={allHref}
            className={`px-3 py-1.5 rounded-lg text-sm font-sans font-medium transition-colors ${
              !state
                ? "bg-ink text-white"
                : "bg-surface-raised border border-line text-ink hover:border-primary/40 hover:text-primary"
            }`}
          >
            All Australia
          </Link>
          {STATES.map((s) => (
            <Link
              key={s}
              href={stateHref(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-sans font-medium transition-colors ${
                state === s
                  ? "bg-ink text-white"
                  : "bg-surface-raised border border-line text-ink hover:border-primary/40 hover:text-primary"
              }`}
            >
              {s}
            </Link>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm font-sans text-ink-muted mb-4">
          Showing top {suburbs.length} suburbs
          {stateName ? ` in ${stateName}` : " across Australia"}
        </p>

        {suburbs.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface-raised p-10 text-center">
            <p className="font-sans text-ink-muted">
              No suburbs found for this filter. Try a different state.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto rounded-2xl bg-surface-raised border border-line">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-warm border-b border-line">
                    <th className="py-3 px-4 text-left text-xs font-sans font-medium text-ink uppercase tracking-wide w-10">#</th>
                    <th className="py-3 px-4 text-left text-xs font-sans font-medium text-ink uppercase tracking-wide">Suburb</th>
                    <th className="py-3 px-4 text-left text-xs font-sans font-medium text-ink uppercase tracking-wide">State</th>
                    <th className="py-3 px-4 text-right text-xs font-sans font-medium text-ink uppercase tracking-wide">
                      {PRIMARY_LABEL[category]}
                    </th>
                    <th className="py-3 px-4 text-right text-xs font-sans font-medium text-ink uppercase tracking-wide">
                      {SECONDARY_LABEL[category]}
                    </th>
                    <th className="py-3 px-4 text-right text-xs font-sans font-medium text-ink uppercase tracking-wide">Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {suburbs.map((suburb, i) => (
                    <tr
                      key={suburb.slug}
                      className="hover:bg-surface-warm/60 transition-colors"
                    >
                      <td className="py-3 px-4 text-ink-subtle tabular-nums font-sans">{i + 1}</td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/suburbs/${suburb.slug}`}
                          className="font-sans font-medium text-ink hover:text-primary transition-colors"
                        >
                          {suburb.name}
                        </Link>
                        <p className="text-xs font-sans text-ink-subtle mt-0.5">{suburb.postcode}</p>
                      </td>
                      <td className="py-3 px-4 font-sans text-ink-muted">{suburb.state}</td>
                      <td className="py-3 px-4 text-right tabular-nums">
                        <PrimaryMetric category={category} suburb={suburb} />
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums">
                        <SecondaryMetric category={category} suburb={suburb} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/suburbs/${suburb.slug}`}
                          className="font-sans text-xs font-medium text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors whitespace-nowrap"
                        >
                          View profile →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden space-y-3">
              {suburbs.map((suburb, i) => (
                <Link
                  key={suburb.slug}
                  href={`/suburbs/${suburb.slug}`}
                  className="block rounded-2xl border border-line bg-surface-raised p-4 hover:border-primary/40 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-sans text-ink-subtle tabular-nums">#{i + 1}</span>
                        <span className="font-display text-base text-ink truncate">{suburb.name}</span>
                      </div>
                      <p className="text-xs font-sans text-ink-subtle mt-0.5">
                        {suburb.state} {suburb.postcode}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-sans text-ink-subtle">{PRIMARY_LABEL[category]}</p>
                      <p className="mt-0.5">
                        <PrimaryMetric category={category} suburb={suburb} />
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-sans text-ink-subtle">{SECONDARY_LABEL[category]}</p>
                      <p className="mt-0.5">
                        <SecondaryMetric category={category} suburb={suburb} />
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs font-sans uppercase tracking-wider text-ink">
                    View profile →
                  </p>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* FAQ section, emits FAQPage schema for rich-results */}
        <section className="mt-14 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
              Common questions
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight">
              About this ranking.
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-4">
            {categoryCommentary.faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-line bg-surface-raised p-5 sm:p-6 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-4 list-none">
                  <span className="font-display text-lg text-ink leading-tight">
                    {faq.question}
                  </span>
                  <span
                    className="shrink-0 mt-1 w-6 h-6 rounded-full border border-line-strong text-ink-subtle group-open:bg-ink group-open:text-white group-open:border-ink flex items-center justify-center transition-colors text-sm font-display"
                    aria-hidden="true"
                  >
                    <span className="group-open:hidden">+</span>
                    <span className="hidden group-open:inline">−</span>
                  </span>
                </summary>
                <p className="mt-3 font-sans text-base text-ink-muted leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
        <FAQPageJsonLd faqs={categoryCommentary.faqs} />

        {/* Cross-link to other categories */}
        <div className="mt-12 rounded-2xl border border-line bg-surface-warm p-6">
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
            Other rankings
          </p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(CATEGORY_CONFIG) as RankingCategory[])
              .filter((c) => c !== category)
              .map((c) => (
                <Link
                  key={c}
                  href={state ? (useStaticStateRoutes ? `/best-suburbs/${c}/${state.toLowerCase()}` : `/best-suburbs/${c}?state=${state}`) : `/best-suburbs/${c}`}
                  className="inline-flex items-center rounded-lg border border-line bg-surface-raised px-3 py-1.5 text-sm font-sans font-medium text-ink hover:border-primary/40 hover:text-primary transition-colors"
                >
                  {CATEGORY_CONFIG[c].title}
                </Link>
              ))}
          </div>
        </div>
      </div>

      {/* Buyer funnel exit, shared by the national and per-state ranking
          routes. Readers here are shortlisting where to buy next. */}
      <ExpertCTA
        headline="Shortlisted a suburb? Buy it well."
        body="The complete buying guide: what you can actually spend, the 2026 schemes for your state, how the selling side plays you, and a 12-week plan from pre-approval to keys. Free PDF, in your inbox in 60 seconds."
        ctaLabel="Get the free buying guide"
        href="/buying-guide"
      />
    </>
  );
}

export { CATEGORY_CONFIG, STATES, STATE_NAME };
