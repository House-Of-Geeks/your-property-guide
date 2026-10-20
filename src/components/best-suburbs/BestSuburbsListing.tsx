import Link from "next/link";
import { BreadcrumbJsonLd, ItemListJsonLd, FAQPageJsonLd } from "@/components/seo";
import { ExpertCTA } from "@/components/journey";
import { GUIDE_BOOKS } from "@/lib/guide-books";
import { cityEditionLinkLabel, cityEditionPath } from "@/lib/city-editions";
import type { CapitalCity } from "@/lib/utils/metro";
import {
  type RankingCategory,
  type RankedSuburb,
} from "@/lib/services/suburb-rankings-service";
import { formatPrice, formatPriceFull, formatPercentage } from "@/lib/utils/format";
import { CATEGORY_COMMENTARY } from "@/lib/data/category-commentary";
import type { RankingNote } from "@/lib/ranking-notes";
import { STATE_COMMENTARY } from "@/lib/data/state-commentary";
import {
  bestSuburbsHeadline,
  CATEGORY_HEADLINE,
  placeName,
  STATES,
  STATE_NAME,
} from "@/lib/best-suburbs-headlines";
import { Band, HeroLead, HeroTitle, PhotoHero, RuleGrid, RuleItem, SectionHeading } from "@/components/premium";

export interface CategoryConfig {
  title: string;
  description: string;
}

const CATEGORY_CONFIG: Record<RankingCategory, CategoryConfig & { eyebrow: string }> = {
  "for-families": {
    title: "Best Suburbs for Families",
    eyebrow: "Family-friendly ranking",
    description: "Suburbs ranked by average school ICSEA score and family-household percentage.",
  },
  "highest-growth": {
    title: "Highest Growth Suburbs",
    eyebrow: "Capital-growth ranking",
    description: "Suburbs with the strongest annual house price growth over the past 12 months.",
  },
  "most-affordable": {
    title: "Most Affordable Suburbs",
    eyebrow: "Affordability ranking",
    description: "Suburbs with the lowest median house prices, great entry points into the property market.",
  },
  "most-walkable": {
    title: "Most Walkable Suburbs",
    eyebrow: "Walkability ranking",
    description: "Suburbs with the highest walk scores, perfect for car-free or car-light lifestyles.",
  },
  "lowest-flood-risk": {
    title: "Lowest Flood Risk Suburbs",
    eyebrow: "Hazard-safe ranking",
    description: "Suburbs assessed as low flood risk or with no flood hazard record from Geoscience Australia.",
  },
  "best-rental-yield": {
    title: "Best Rental Yield Suburbs",
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

function floodBadge(floodClass: string | null): React.ReactElement {
  if (!floodClass) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-surface-warm border border-line text-ink-muted">
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
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium capitalize border ${cls}`}>
      {floodClass}
    </span>
  );
}

// On a national list the ABS figures sit beside suburb medians, so they are
// marked; a state list is all one kind and the note above it says which.
function AreaMark({ suburb, show }: { suburb: RankedSuburb; show: boolean }) {
  if (!show || suburb.medianBasis !== "area" || !(suburb.medianHousePrice > 0)) return null;
  return (
    <abbr
      title="ABS statistical-area (SA2) median: the area that carries the suburb's name, which can take in surrounding localities"
      className="ml-1 text-sm text-ink-subtle no-underline"
    >
      area
    </abbr>
  );
}

function PrimaryMetric({ category, suburb, markArea }: { category: RankingCategory; suburb: RankedSuburb; markArea: boolean }) {
  switch (category) {
    case "for-families":
      return <span className="text-base font-semibold text-ink">{suburb.avgSchoolIcsea != null ? suburb.avgSchoolIcsea.toLocaleString() : "–"}</span>;
    case "highest-growth":
      return (
        <span className={`text-base font-semibold ${suburb.annualGrowthHouse >= 0 ? "text-emerald-700" : "text-red-700"}`}>
          {suburb.annualGrowthHouse !== 0 ? formatPercentage(suburb.annualGrowthHouse) : "–"}
        </span>
      );
    case "most-affordable":
      return (
        <span className="text-base font-semibold text-ink">
          {suburb.medianHousePrice > 0 ? formatPriceFull(suburb.medianHousePrice) : "–"}
          <AreaMark suburb={suburb} show={markArea} />
        </span>
      );
    case "most-walkable":
      return (
        <span className="text-base font-semibold text-ink">
          {suburb.walkScore != null ? suburb.walkScore : "–"}
          <span className="text-ink-subtle text-xs ml-0.5">/100</span>
        </span>
      );
    case "lowest-flood-risk":
      return floodBadge(suburb.hazard?.floodClass ?? null);
    case "best-rental-yield":
      return (
        <span className="text-base font-semibold text-emerald-700">
          {suburb.grossRentalYield != null ? `${suburb.grossRentalYield.toFixed(2)}%` : "–"}
        </span>
      );
  }
}

function SecondaryMetric({ category, suburb, markArea }: { category: RankingCategory; suburb: RankedSuburb; markArea: boolean }) {
  switch (category) {
    case "for-families":
      return <span className="text-sm text-ink-muted">{suburb.householdsFamily > 0 ? `${suburb.householdsFamily.toFixed(0)}%` : "–"}</span>;
    case "highest-growth":
      return (
        <span className="text-sm text-ink-muted">
          {suburb.medianHousePrice > 0 ? formatPrice(suburb.medianHousePrice) : "–"}
          <AreaMark suburb={suburb} show={markArea} />
        </span>
      );
    case "most-affordable":
      return (
        <span className={`text-sm ${suburb.annualGrowthHouse !== 0 ? (suburb.annualGrowthHouse >= 0 ? "text-emerald-700" : "text-red-700") : "text-ink-subtle"}`}>
          {suburb.annualGrowthHouse !== 0 ? formatPercentage(suburb.annualGrowthHouse) : "–"}
        </span>
      );
    case "most-walkable":
    case "lowest-flood-risk":
      return (
        <span className="text-sm text-ink-muted">
          {suburb.medianHousePrice > 0 ? formatPrice(suburb.medianHousePrice) : "–"}
          <AreaMark suburb={suburb} show={markArea} />
        </span>
      );
    case "best-rental-yield":
      return <span className="text-sm text-ink-muted">{suburb.medianRentHouse > 0 ? `$${suburb.medianRentHouse}/wk` : "–"}</span>;
  }
}

interface BestSuburbsListingProps {
  category: RankingCategory;
  state: string | null; // upper-case state code or null for national
  suburbs: RankedSuburb[];
  /**
   * Where the figures come from, or why there is nothing to rank
   * (src/lib/ranking-notes.ts). Printed above the table, or in its place.
   */
  note: RankingNote;
  /**
   * If true, state filter chips link to /best-suburbs/[category]/[state] (the
   * permutation route). If false, they link to /best-suburbs/[category]?state=NSW.
   */
  useStaticStateRoutes?: boolean;
  /**
   * The capital-city editions of this ranking with ten suburbs to show
   * (/best-suburbs/[category]/[city]); the page passes the state's, or all
   * of them on the national list. Empty when none qualifies.
   */
  cityEditions?: { category: RankingCategory; city: CapitalCity }[];
}

export function BestSuburbsListing({
  category,
  state,
  suburbs,
  note,
  useStaticStateRoutes = false,
  cityEditions = [],
}: BestSuburbsListingProps) {
  const config = CATEGORY_CONFIG[category];
  // A national list mixes suburb medians with ABS area medians.
  const markArea = state === null;
  const stateName = state ? STATE_NAME[state] ?? state : null;
  const categoryCommentary = CATEGORY_COMMENTARY[category];
  const stateCommentary = state ? STATE_COMMENTARY[state] : null;

  // The sentence the H1 prints, also the ItemList name (fix item 45).
  const headline = bestSuburbsHeadline(category, state);
  const h1 = CATEGORY_HEADLINE[category];
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

      {/* Hero: the ranking's headline sentence and what it ranks on. */}
      <PhotoHero
        photo="street"
        breadcrumbs={[
          { label: "Best Suburbs", href: "/best-suburbs" },
          ...(stateName
            ? [
                { label: config.title, href: baseUrl },
                { label: state ?? "" },
              ]
            : [{ label: config.title }]),
        ]}
      >
        <p className="text-sm text-ink-muted mb-5">
          {eyebrow}
        </p>
        {/* Fix item 45: one string after the italic span, so React writes a
            single text node and no <!-- --> boundary before the full stop. */}
        <HeroTitle>
          The <span>{h1.lead}</span>
          {` ${h1.noun} in ${placeName(state)}.`}
        </HeroTitle>
        <HeroLead>
          {config.description}
          {stateName && ` Filtered to ${stateName} suburbs only.`}
        </HeroLead>
      </PhotoHero>

      {/* Editorial commentary band, what this ranking is and how to use it */}
      <Band spacing="compact">
        <section className="max-w-3xl">
          <p className="text-sm font-semibold text-ink mb-3">
            About this ranking
          </p>
          <div className="prose-ypg prose-ypg-tight">
            <p>{categoryCommentary.intro}</p>
            {stateCommentary && (
              <>
                <h3 className="text-xl text-ink mt-6 mb-3">
                  {stateName} property market in 2026
                </h3>
                <p>{stateCommentary.marketContext}</p>
              </>
            )}
          </div>
        </section>

        <RuleGrid columns={stateCommentary ? 4 : 2} className="mt-12">
          {stateCommentary && (
            <>
              <RuleItem title={<>Buyer tip, {state}</>}>
                {stateCommentary.buyerTip}
              </RuleItem>
              <RuleItem title={<>Watch out, {state}</>}>
                {stateCommentary.watchOut}
              </RuleItem>
            </>
          )}
          <RuleItem title="Methodology">
            {categoryCommentary.methodology}
          </RuleItem>
          <RuleItem title="Best for">
            {categoryCommentary.bestFor}
          </RuleItem>
        </RuleGrid>
      </Band>

      <Band tone="quiet" spacing="compact">
        {/* State filter chips */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm font-semibold text-ink mr-2">
            By state
          </span>
          <Link
            href={allHref}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              !state
                ? "bg-ink text-ink-inverse border border-ink"
                : "bg-surface-raised border border-line text-ink hover:border-ink"
            }`}
          >
            All Australia
          </Link>
          {STATES.map((s) => (
            <Link
              key={s}
              href={stateHref(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                state === s
                  ? "bg-ink text-ink-inverse border border-ink"
                  : "bg-surface-raised border border-line text-ink hover:border-ink"
              }`}
            >
              {s}
            </Link>
          ))}
        </div>

        {/* The city editions: the same ranking over a greater capital city, one section per suburb */}
        {cityEditions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm font-semibold text-ink mr-2">
              By city
            </span>
            {cityEditions.map((e) => (
              <Link
                key={e.city.slug}
                href={cityEditionPath(e.category, e.city.slug)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-surface-raised border border-line text-ink hover:border-ink transition-colors"
              >
                {cityEditionLinkLabel(e.category, e.city)}
              </Link>
            ))}
          </div>
        )}

        {/* Results count, and where the figures come from */}
        {suburbs.length > 0 && (
          <div className="mt-8 mb-5 max-w-3xl">
            <p className="text-base font-semibold text-ink">
              Showing top {suburbs.length} suburbs
              {stateName ? ` in ${stateName}` : " across Australia"}
            </p>
            {note.text && (
              <p className="mt-1 text-sm text-ink-muted leading-relaxed">{note.text}</p>
            )}
          </div>
        )}

        {suburbs.length === 0 ? (
          <div className="mt-8 rounded-xl border border-line bg-surface-raised p-8 sm:p-10">
            <p className="text-xl font-semibold text-ink mb-2">Nothing to rank here yet.</p>
            <p className="text-ink-muted leading-relaxed max-w-2xl">{note.text}</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto rounded-xl bg-surface-raised border border-line">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-warm border-b border-line">
                    <th className="py-3 px-4 text-left text-sm font-semibold text-ink w-10">#</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-ink">Suburb</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-ink">State</th>
                    <th className="py-3 px-4 text-right text-sm font-semibold text-ink">
                      {PRIMARY_LABEL[category]}
                    </th>
                    <th className="py-3 px-4 text-right text-sm font-semibold text-ink">
                      {SECONDARY_LABEL[category]}
                    </th>
                    <th className="py-3 px-4 text-right text-sm font-semibold text-ink">Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {suburbs.map((suburb, i) => (
                    <tr
                      key={suburb.slug}
                      className="hover:bg-surface-warm/60 transition-colors"
                    >
                      <td className="py-3 px-4 text-ink-subtle">{i + 1}</td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/suburbs/${suburb.slug}`}
                          className="font-semibold text-ink hover:text-primary transition-colors"
                        >
                          {suburb.name}
                        </Link>
                        <p className="text-xs text-ink-subtle mt-0.5">{suburb.postcode}</p>
                      </td>
                      <td className="py-3 px-4 text-ink-muted">{suburb.state}</td>
                      <td className="py-3 px-4 text-right">
                        <PrimaryMetric category={category} suburb={suburb} markArea={markArea} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <SecondaryMetric category={category} suburb={suburb} markArea={markArea} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/suburbs/${suburb.slug}`}
                          className="text-sm font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink whitespace-nowrap"
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
                  className="block rounded-xl border border-line bg-surface-raised p-4 hover:border-ink transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-ink-subtle">#{i + 1}</span>
                        <span className="text-base font-semibold text-ink truncate">{suburb.name}</span>
                      </div>
                      <p className="text-xs text-ink-subtle mt-0.5">
                        {suburb.state} {suburb.postcode}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-ink-subtle">{PRIMARY_LABEL[category]}</p>
                      <p className="mt-0.5">
                        <PrimaryMetric category={category} suburb={suburb} markArea={markArea} />
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-ink-subtle">{SECONDARY_LABEL[category]}</p>
                      <p className="mt-0.5">
                        <SecondaryMetric category={category} suburb={suburb} markArea={markArea} />
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-ink">
                    View profile →
                  </p>
                </Link>
              ))}
            </div>
          </>
        )}
      </Band>

      {/* FAQ section, emits FAQPage schema for rich-results */}
      <Band spacing="compact">
        <section className="grid lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="text-sm text-ink-muted mb-3">
              Common questions
            </p>
            <SectionHeading size="md" title="About this ranking" />
          </div>
          <div className="lg:col-span-8 space-y-4">
            {categoryCommentary.faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-line bg-surface-raised p-5 sm:p-6 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-4 list-none">
                  <span className="text-lg font-semibold text-ink leading-tight">
                    {faq.question}
                  </span>
                  <span
                    className="shrink-0 mt-0.5 w-6 h-6 rounded-md border border-line-strong text-ink-subtle group-open:bg-ink group-open:text-ink-inverse group-open:border-ink flex items-center justify-center transition-colors text-sm"
                    aria-hidden="true"
                  >
                    <span className="group-open:hidden">+</span>
                    <span className="hidden group-open:inline">−</span>
                  </span>
                </summary>
                <p className="mt-3 text-base text-ink-muted leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
        <FAQPageJsonLd faqs={categoryCommentary.faqs} />
      </Band>

      {/* Cross-link to other categories */}
      <Band tone="quiet" spacing="compact">
        <p className="text-sm font-semibold text-ink mb-3">
          Other rankings
        </p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CATEGORY_CONFIG) as RankingCategory[])
            .filter((c) => c !== category)
            .map((c) => (
              <Link
                key={c}
                href={state ? (useStaticStateRoutes ? `/best-suburbs/${c}/${state.toLowerCase()}` : `/best-suburbs/${c}?state=${state}`) : `/best-suburbs/${c}`}
                className="inline-flex items-center rounded-lg border border-line bg-surface-raised px-3 py-1.5 text-sm font-medium text-ink hover:border-ink transition-colors"
              >
                {CATEGORY_CONFIG[c].title}
              </Link>
            ))}
        </div>
      </Band>

      {/* Buyer funnel exit, shared by the national and per-state ranking
          routes. Readers here are shortlisting where to buy next. */}
      <ExpertCTA
        headline="Shortlisted a suburb? Buy it well."
        body={`${GUIDE_BOOKS.buying.name}, the free guide: what you can actually spend, the 2026 schemes for your state, how homes are marketed and sold, and a 12-week plan from pre-approval to keys. Free PDF, in your inbox in 60 seconds.`}
        ctaLabel="Get the free buying guide"
        href="/buying-guide"
      />
    </>
  );
}

export { CATEGORY_CONFIG, STATES, STATE_NAME };
