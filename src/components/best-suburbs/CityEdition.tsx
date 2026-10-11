import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, FAQPageJsonLd, ItemListJsonLd } from "@/components/seo";
import { ExpertCTA } from "@/components/journey";
import { formatPriceFull, formatPercentage } from "@/lib/utils/format";
import { GROWTH_RANKED_STATES, WALK_SCORE_CAP, WALK_TIE_NOTE, isRanked, rankingNote, stateRankingLink, type RankingCategory } from "@/lib/ranking-notes";
import {
  CITY_EDITION_BUDGET,
  CITY_EDITION_LABEL,
  CITY_EDITION_SIZE,
  cityEditionFaqs,
  cityEditionH1,
  cityEditionLede,
  cityEditionLinkLabel,
  cityEditionMethod,
  cityEditionPath,
  hasCityEdition,
  isNumbered,
  metricSummary,
  more,
  showUnderBudget,
  suburbParagraph,
  tiedAtCap,
  top,
  underBudget,
  type CityEdition,
  type CityEditionSuburb,
} from "@/lib/city-editions";
import { cityEditionLinks, type IndexableCityEdition } from "@/lib/services/city-rankings-service";
import { getStateName } from "@/lib/services/suburb-rankings-service";
import { CATEGORY_CONFIG } from "@/components/best-suburbs/BestSuburbsListing";

// /best-suburbs/{category}/{city}: the shape the SERP rewards for "best
// suburbs to invest in brisbane" and "best suburbs in perth" (review of 30
// Sep 2026, section 3.6): a method, a date, one H2 per suburb with its
// figures, a comparison table, the People Also Ask answered from the data,
// ItemList and FAQPage JSON-LD. The copy is built in src/lib/city-editions.ts
// from the rows and nothing else.

const n = (v: number) => v.toLocaleString("en-AU");

const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "Australia/Sydney" });

function Dash() {
  return <span className="text-ink-subtle">–</span>;
}

function Median({ s }: { s: CityEditionSuburb }) {
  if (!(s.medianHousePrice > 0)) return <Dash />;
  return (
    <>
      {formatPriceFull(s.medianHousePrice)}
      {s.medianBasis === "area" && " "}
      {s.medianBasis === "area" && (
        <abbr
          title="ABS statistical-area (SA2) median: the area that carries the suburb's name, which can take in surrounding localities"
          className="ml-1 font-sans text-[10px] uppercase tracking-wide text-ink-subtle no-underline"
        >
          area
        </abbr>
      )}
    </>
  );
}

function Change({ s }: { s: CityEditionSuburb }) {
  if (s.annualGrowthHouse === 0) return <Dash />;
  return (
    <span className={s.annualGrowthHouse > 0 ? "text-emerald-700" : "text-red-700"}>
      {formatPercentage(s.annualGrowthHouse)}
    </span>
  );
}

interface Column {
  label: string;
  cell: (s: CityEditionSuburb) => ReactNode;
}

function columns(category: RankingCategory, state: string): Column[] {
  const median: Column = { label: "Median house price", cell: (s) => <Median s={s} /> };
  const change: Column = { label: "12-month change", cell: (s) => <Change s={s} /> };
  const km: Column = { label: "Km to CBD", cell: (s) => (s.kmToCbd != null ? n(s.kmToCbd) : <Dash />) };
  const withChange = GROWTH_RANKED_STATES.includes(state);
  switch (category) {
    case "best-rental-yield":
      return [
        median,
        { label: "Rent per week", cell: (s) => (s.medianRentHouse > 0 ? `$${n(s.medianRentHouse)}` : <Dash />) },
        { label: "Gross yield", cell: (s) => (s.grossRentalYield != null ? <span className="text-emerald-700">{s.grossRentalYield.toFixed(2)}%</span> : <Dash />) },
        ...(withChange ? [change] : []),
        km,
      ];
    case "highest-growth":
      return [change, median, km];
    case "for-families":
      return [
        { label: "Avg school ICSEA", cell: (s) => (s.avgSchoolIcsea != null ? String(s.avgSchoolIcsea) : <Dash />) },
        { label: "Family households", cell: (s) => (s.householdsFamily > 0 ? `${s.householdsFamily.toFixed(0)}%` : <Dash />) },
        median,
        ...(withChange ? [change] : []),
        km,
      ];
    case "most-affordable":
      return [median, ...(withChange ? [change] : []), km];
    case "most-walkable":
      return [
        { label: "Walk score", cell: (s) => (s.walkScore != null ? `${s.walkScore}/100` : <Dash />) },
        median,
        ...(withChange ? [change] : []),
        km,
      ];
    default:
      return [median, km];
  }
}

const pill =
  "inline-flex items-center rounded-lg border border-line bg-surface-raised px-3 py-1.5 text-sm font-sans font-medium text-ink hover:border-primary/40 hover:text-primary transition-colors";

interface Props {
  edition: CityEdition;
  /** The city editions with ten suburbs to show, for the link blocks. */
  indexable: IndexableCityEdition[];
  /** When this version of the page was generated (ISR, daily). */
  updatedAt: Date;
}

export function CityEditionPage({ edition, indexable, updatedAt }: Props) {
  const { category, city } = edition;
  const config = CATEGORY_CONFIG[category];
  const stateName = getStateName(city.state);
  const path = cityEditionPath(category, city.slug);
  const stateHref = `/best-suburbs/${category}/${city.state.toLowerCase()}`;
  const h1 = cityEditionH1(category, city);
  const ten = top(edition);
  const full = hasCityEdition(category, city.state, ten.length);
  // A category the state's figures cannot rank (growth outside NSW and SA, yield outside VIC and QLD).
  const ranked = isRanked(category, city.state);
  const note = rankingNote(category, city.state, 0, 0);
  const cols = columns(category, city.state);
  const faqs = full ? cityEditionFaqs(edition) : [];
  const method = cityEditionMethod(edition);
  const five = more(edition);
  const cheap = showUnderBudget(edition) ? underBudget(edition) : [];
  // Walkable: suburbs tied at the capped score carry no rank (ranking-notes).
  const tied = tiedAtCap(edition);
  const allTied = tied.length > 0 && tied.length === ten.length;
  const fiveTied = five.length > 0 && five.every((s) => !isNumbered(category, s));

  const otherCities = cityEditionLinks(indexable, { category }).filter((e) => e.city.slug !== city.slug);
  const otherLists = cityEditionLinks(indexable, { citySlug: city.slug }).filter((e) => e.category !== category);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Best Suburbs", url: "/best-suburbs" },
          { name: config.title, url: `/best-suburbs/${category}` },
          { name: city.name, url: path },
        ]}
      />
      {full && tied.length === 0 && (
        <ItemListJsonLd
          name={h1}
          url={path}
          items={ten.map((s) => ({ name: s.name, url: `/suburbs/${s.slug}`, description: metricSummary(category, s) }))}
        />
      )}
      {faqs.length > 0 && <FAQPageJsonLd faqs={faqs} />}

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
                { label: config.title, href: `/best-suburbs/${category}` },
                { label: city.name },
              ]}
            />
          </div>
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
            {config.eyebrow} · Greater {city.name}
          </p>
          <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
            {h1}
          </h1>
          {full ? (
            <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-3xl">{cityEditionLede(edition)}</p>
          ) : (
            <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-3xl">
              {config.description} Greater {city.name} only.
            </p>
          )}
          <p className="mt-5 font-sans text-sm text-ink-subtle">
            <span className="text-ink">Updated {fmtDate(updatedAt)}.</span>
            {edition.salesPeriod ? ` Medians for ${edition.salesPeriod}.` : ""}
            {full ? ` ${tied.length > 0 ? "Drawn" : "Ranked"} from ${n(edition.eligible)} Greater ${city.name} suburbs.` : ""}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-14">
        {!full && (
          <section className="rounded-2xl border border-line bg-surface-raised p-8 sm:p-10 max-w-3xl">
            <p className="font-display text-xl text-ink mb-2">No {city.name} edition yet.</p>
            <p className="font-sans text-ink-muted leading-relaxed">
              {!ranked
                ? note.text
                : `A city edition needs ${CITY_EDITION_SIZE} suburbs to show, and ${ten.length === 0 ? "none" : ten.length === 1 ? "only one" : `only ${ten.length}`} in Greater ${city.name} ${ten.length === 1 ? "qualifies" : "qualify"} on the rules below. The ${stateName} ranking has the full list.`}
            </p>
            <p className="mt-4">
              <Link href={ranked ? stateHref : `/best-suburbs/${category}`} className={pill}>
                {config.title} in {ranked ? stateName : "Australia"}
              </Link>
            </p>
          </section>
        )}

        {/* How we ranked them: not on a category the state's figures cannot rank */}
        {ranked && (
          <section className="max-w-3xl">
            <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight mb-5">How we ranked them.</h2>
            <ul className="space-y-3 font-sans text-base text-ink-muted leading-relaxed list-disc pl-5">
              {method.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="mt-4 font-sans text-sm text-ink-subtle">
              <Link href="/methodology#median-prices" className="text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors">
                Full methodology →
              </Link>
            </p>
          </section>
        )}

        {full && (
          <>
            {/* One section per suburb */}
            <section>
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-6">
                {allTied ? `Ten that score ${WALK_SCORE_CAP}, alphabetically` : "The ten, in order"}
              </p>
              {tied.length > 0 && (
                <p className="max-w-3xl -mt-3 mb-6 font-sans text-sm text-ink-muted leading-relaxed">{WALK_TIE_NOTE}</p>
              )}
              <div className="space-y-10">
                {ten.map((s, i) => (
                  <article key={s.slug} className="max-w-3xl border-t border-line pt-8" id={s.slug}>
                    <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight mb-3">
                      {isNumbered(category, s) && <span className="text-ink-subtle tabular-nums mr-2">{`${i + 1}.`}</span>}
                      {`${isNumbered(category, s) ? " " : ""}${s.name}, ${s.postcode}`}
                    </h2>
                    <p className="font-sans text-base sm:text-lg text-ink-muted leading-[1.7]">{suburbParagraph(edition, s, i + 1)}</p>
                    <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-sans text-sm">
                      {cols.map((c) => (
                        <div key={c.label} className="flex items-baseline gap-2">
                          <dt className="text-ink-subtle">{c.label}</dt>
                          <dd className="text-ink tabular-nums">{c.cell(s)}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-4">
                      <Link
                        href={`/suburbs/${s.slug}`}
                        className="font-sans text-sm font-medium text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
                      >
                        {s.name} suburb profile →
                      </Link>
                    </p>
                  </article>
                ))}
              </div>
            </section>

            {/* Comparison table */}
            <section>
              <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight mb-5">The ten compared.</h2>
              <div className="overflow-x-auto rounded-2xl bg-surface-raised border border-line">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface-warm border-b border-line">
                      <th className="py-3 px-4 text-left text-xs font-sans font-medium text-ink uppercase tracking-wide w-10">#</th>
                      <th className="py-3 px-4 text-left text-xs font-sans font-medium text-ink uppercase tracking-wide">Suburb</th>
                      {cols.map((c) => (
                        <th key={c.label} className="py-3 px-4 text-right text-xs font-sans font-medium text-ink uppercase tracking-wide whitespace-nowrap">
                          {c.label}
                        </th>
                      ))}
                      <th className="py-3 px-4 text-right text-xs font-sans font-medium text-ink uppercase tracking-wide">Profile</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {ten.map((s, i) => (
                      <tr key={s.slug} className="hover:bg-surface-warm/60 transition-colors">
                        <td className="py-3 px-4 text-ink-subtle tabular-nums font-sans">{isNumbered(category, s) ? i + 1 : ""}</td>
                        <td className="py-3 px-4">
                          <a href={`#${s.slug}`} className="font-sans font-medium text-ink hover:text-primary transition-colors">
                            {s.name}
                          </a>{" "}
                          <p className="text-xs font-sans text-ink-subtle mt-0.5">{s.postcode}</p>
                        </td>
                        {cols.map((c) => (
                          <td key={c.label} className="py-3 px-4 text-right tabular-nums font-sans text-ink">
                            {c.cell(s)}
                          </td>
                        ))}
                        <td className="py-3 px-4 text-right">
                          <Link
                            href={`/suburbs/${s.slug}`}
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
              <p className="mt-3 font-sans text-sm text-ink-subtle max-w-3xl">
                A dash means the suburb&rsquo;s own page publishes no figure. &ldquo;Area&rdquo; marks an ABS statistical-area median.
                {tied.length > 0 && ` No rank number means the suburb is tied at the capped walk score of ${WALK_SCORE_CAP}.`}
              </p>
            </section>

            {/* Ranks 11 to 15 */}
            {five.length > 0 && (
              <section className="max-w-3xl">
                <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight mb-3">
                  {five.length === 5 ? "Five" : n(five.length)} more worth a look.
                </h2>
                <p className="font-sans text-base text-ink-muted leading-relaxed mb-5">
                  {fiveTied
                    ? `${five.length === 1 ? "One more suburb that scores" : "More suburbs that also score"} ${WALK_SCORE_CAP}, listed alphabetically, for a shortlist that runs past the ten.`
                    : `Ranks ${CITY_EDITION_SIZE + 1} to ${CITY_EDITION_SIZE + five.length} on the same rule, for a shortlist that runs past the ten.`}
                </p>
                <ol className={`space-y-2 font-sans text-base text-ink-muted${fiveTied ? " list-none" : ""}`} start={CITY_EDITION_SIZE + 1}>
                  {five.map((s) => (
                    <li key={s.slug} className="flex flex-wrap items-baseline gap-x-3">
                      <Link href={`/suburbs/${s.slug}`} className="font-medium text-ink hover:text-primary transition-colors">
                        {`${s.name}, ${s.postcode}`}
                      </Link>
                      {metricSummary(category, s) && <span className="text-sm text-ink-subtle">{`: ${metricSummary(category, s)}`}</span>}
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Under the budget */}
            {cheap.length > 0 && (
              <section className="max-w-3xl">
                <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight mb-3">
                  Under {formatPriceFull(CITY_EDITION_BUDGET)}.
                </h2>
                <p className="font-sans text-base text-ink-muted leading-relaxed mb-5">
                  The suburbs among the {n(edition.suburbs.length)} above whose published median house price is under {formatPriceFull(CITY_EDITION_BUDGET)}, in ranking order.
                </p>
                <ul className="space-y-2 font-sans text-base text-ink-muted">
                  {cheap.map((s) => (
                    <li key={s.slug} className="flex flex-wrap items-baseline gap-x-3">
                      <Link href={`/suburbs/${s.slug}`} className="font-medium text-ink hover:text-primary transition-colors">
                        {`${s.name}, ${s.postcode}`}
                      </Link>
                      <span className="text-sm text-ink-subtle">
                        {": "}
                        {formatPriceFull(s.medianHousePrice)}
                        {s.grossRentalYield != null ? `, gross yield ${s.grossRentalYield.toFixed(1)}%` : ""}
                        {s.annualGrowthHouse !== 0 ? `, ${formatPercentage(s.annualGrowthHouse)} in 12 months` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* FAQ */}
            <section className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4">
                <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">Common questions</p>
                <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight">
                  {CITY_EDITION_LABEL[category]} in {city.name}: what people ask.
                </h2>
              </div>
              <div className="lg:col-span-8 space-y-4">
                {faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="group rounded-2xl border border-line bg-surface-raised p-5 sm:p-6 [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex cursor-pointer items-start justify-between gap-4 list-none">
                      <span className="font-display text-lg text-ink leading-tight">{faq.question}</span>
                      <span
                        className="shrink-0 mt-1 w-6 h-6 rounded-full border border-line-strong text-ink-subtle group-open:bg-ink group-open:text-white group-open:border-ink flex items-center justify-center transition-colors text-sm font-display"
                        aria-hidden="true"
                      >
                        <span className="group-open:hidden">+</span>
                        <span className="hidden group-open:inline">−</span>
                      </span>
                    </summary>
                    <p className="mt-3 font-sans text-base text-ink-muted leading-relaxed">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Where next */}
        <section className="rounded-2xl border border-line bg-surface-warm p-6">
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">Keep exploring</p>
          <div className="flex flex-wrap gap-2">
            {ranked && (
              <Link href={stateHref} className={pill}>
                {config.title} in {stateName}
              </Link>
            )}
            <Link href={`/best-suburbs/${category}`} className={pill}>
              {config.title} in Australia
            </Link>
            {stateRankingLink(city.state).href !== stateHref && (
              <Link href={stateRankingLink(city.state).href} className={pill}>
                {stateRankingLink(city.state).label}
              </Link>
            )}
            <Link href={`/property-market/${city.slug}`} className={pill}>
              {city.name} house prices and property market
            </Link>
            {category === "best-rental-yield" && (
              <Link href="/rental-yield-calculator" className={pill}>
                Rental yield calculator
              </Link>
            )}
          </div>
          {otherLists.length > 0 && (
            <>
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mt-6 mb-3">More {city.name} lists</p>
              <div className="flex flex-wrap gap-2">
                {otherLists.map((e) => (
                  <Link key={e.category} href={cityEditionPath(e.category, e.city.slug)} className={pill}>
                    {cityEditionLinkLabel(e.category, e.city)}
                  </Link>
                ))}
              </div>
            </>
          )}
          {otherCities.length > 0 && (
            <>
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mt-6 mb-3">Other cities</p>
              <div className="flex flex-wrap gap-2">
                {otherCities.map((e) => (
                  <Link key={e.city.slug} href={cityEditionPath(e.category, e.city.slug)} className={pill}>
                    {cityEditionLinkLabel(e.category, e.city)}
                  </Link>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      <ExpertCTA
        headline="Shortlisted a suburb? Buy it well."
        body="The complete buying guide: what you can actually spend, the 2026 schemes for your state, how the selling side plays you, and a 12-week plan from pre-approval to keys. Free PDF, in your inbox in 60 seconds."
        ctaLabel="Get the free buying guide"
        href="/buying-guide"
      />
    </>
  );
}
