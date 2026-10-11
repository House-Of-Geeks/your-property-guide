import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, CollectionPageJsonLd, FAQPageJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { GROWTH_RANKED_STATES, YIELD_RANKED_STATES, isRanked, type RankingCategory } from "@/lib/ranking-notes";
import { cityEditionLinkLabel, cityEditionPath } from "@/lib/city-editions";
import { cityEditionLinks, indexableCityEditionsForLinks } from "@/lib/services/city-rankings-service";
import { CAPITAL_CITIES } from "@/lib/utils/metro";

// The national hub (review of 10 Oct 2026, suburbs-market 3.8): "best
// suburbs in australia" (90 a month, AI 193). Rivals print tables and a
// method; ours was 183 words. Every list it names states its measure.
// ISR: the city editions come from the database (cached for a day).
export const revalidate = 86400;

const TITLE = "Best Suburbs in Australia 2026: Rankings by City & Category";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "Australian suburbs ranked on one stated measure each: school ICSEA, measured price change, published median house price, walk score and gross rental yield.",
  alternates: { canonical: `${SITE_URL}/best-suburbs` },
  openGraph: {
    url: `${SITE_URL}/best-suburbs`,
    title: `${TITLE} | Your Property Guide`,
    description:
      "Australian suburbs ranked on one stated measure each: school ICSEA, measured price change, published median house price, walk score and gross rental yield.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const ALL_CATEGORIES: { slug: RankingCategory; title: string; description: string; icon: string }[] = [
  {
    slug: "for-families",
    title: "Best for Families",
    description:
      "Suburbs ranked by the average ICSEA of their schools, where family households are at least 40% of households.",
    icon: "/images/icons/people.svg",
  },
  {
    slug: "highest-growth",
    title: "Highest Growth",
    description:
      "Suburbs with the strongest annual house price growth, ideal for capital-gain focused buyers.",
    icon: "/images/icons/growth.svg",
  },
  {
    slug: "most-affordable",
    title: "Most Affordable",
    description:
      "Suburbs with the lowest median house prices, great entry points into the property market.",
    icon: "/images/icons/median.svg",
  },
  {
    slug: "most-walkable",
    title: "Most Walkable",
    description:
      "Suburbs by walk score, a count of the shops and services mapped within 1 km. Ties at the 100 cap are listed alphabetically.",
    icon: "/images/icons/walkability.svg",
  },
  {
    // Listed once a flood hazard feed loads (ranking-notes.FLOOD_HAZARD_FEED_LOADED).
    slug: "lowest-flood-risk",
    title: "Lowest Flood Risk",
    description: "Suburbs by flood hazard class.",
    icon: "/images/icons/hazard.svg",
  },
  {
    slug: "best-rental-yield",
    title: "Best Rental Yield",
    description:
      "Suburbs with the highest gross rental yields, top picks for investment property buyers.",
    icon: "/images/icons/yield.svg",
  },
];

/** Only the rankings there is data to rank on: no card links to an empty list. */
const CATEGORIES = ALL_CATEGORIES.filter((c) => isRanked(c.slug, null));
const COUNT_WORD = ["No", "One", "Two", "Three", "Four", "Five", "Six"];

const STATE_LIST = (states: readonly string[]) =>
  states.length <= 1 ? states.join("") : `${states.slice(0, -1).join(", ")} and ${states[states.length - 1]}`;

/** Each ranking's one measure and its source, in the order of the cards. */
const MEASURE: Record<RankingCategory, string> = {
  "for-families": "school ICSEA (ACARA), among suburbs where family households are at least 40% of households (2021 Census)",
  "most-affordable": "the median house price each suburb's own page publishes (state sales records and ABS area medians)",
  "highest-growth": `the 12-month change in the median house price (${STATE_LIST(GROWTH_RANKED_STATES)} sales, the states whose feeds measure one)`,
  "best-rental-yield": `gross rental yield (bond-data rents against the published median, ${STATE_LIST(YIELD_RANKED_STATES)})`,
  "most-walkable": "walk score (shops and services within 1 km, OpenStreetMap; ties at the 100 cap listed alphabetically)",
  "lowest-flood-risk": "flood hazard class",
};

const FAQS = [
  {
    question: "What are the best suburbs in Australia?",
    answer:
      "It depends on what you rank. We publish one list per measure, each from a public source: school ICSEA for families, the published median house price for the cheapest, the measured 12-month change for growth, gross rental yield for investors and walk score for walkability. Each list states its measure, its source and the suburbs it was drawn from, and the city lists rank Greater Sydney, Melbourne, Brisbane, Perth, Adelaide, Hobart, Canberra and Darwin separately.",
  },
  {
    question: "Which suburbs in Australia have the best capital growth?",
    answer: `We rank the measured 12-month change in the median house price, and only in ${STATE_LIST(GROWTH_RANKED_STATES)}, where the sales feeds measure one; the other states' medians come without a change. A rise over the last 12 months says what happened, not what will, and we do not forecast. A change beyond 25% in a year is left out as a small-sample artefact.`,
  },
  {
    question: "Why is my suburb not on a list?",
    answer:
      "A suburb is ranked only on a figure its own page publishes: a median from a verified source on at least five recorded sales where the count is known, a bond-data rent, or a school with an ICSEA we hold. Lists of ten also leave out suburbs of fewer than 1,000 residents. A suburb missing from a list may simply have no figure published yet.",
  },
];

export default async function BestSuburbsHubPage() {
  // The city lists with ten suburbs to show (the city sitemap's list).
  // Build stays DB-free: ISR fills the links on the first request.
  const cityEditions =
    process.env.NEXT_PHASE === "phase-production-build" ? [] : await indexableCityEditionsForLinks();
  const byCity = CAPITAL_CITIES.map((city) => ({ city, lists: cityEditionLinks(cityEditions, { citySlug: city.slug }) })).filter(
    (c) => c.lists.length > 0,
  );

  return (
    <>
      <CollectionPageJsonLd
        name="Best suburbs in Australia"
        description="Australian suburbs ranked on one stated measure each, nationally, by state and by capital city."
        url="/best-suburbs"
      />
      <BreadcrumbJsonLd items={[{ name: "Best Suburbs", url: "/best-suburbs" }]} />
      <FAQPageJsonLd faqs={FAQS} />

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
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-20 sm:pb-24">
          <div className="mb-10">
            <Breadcrumbs items={[{ label: "Best Suburbs" }]} />
          </div>

          {/* Magazine masthead */}
          <div className="flex items-center gap-4 mb-10">
            <span className="font-display italic text-primary text-base sm:text-lg leading-none">
              {COUNT_WORD[CATEGORIES.length]} ranked lists
            </span>
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
              Best suburbs
            </span>
          </div>

          <h1 className="font-display text-ink leading-[0.98] tracking-tight text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-10 max-w-[18ch] font-medium">
            The best suburbs in Australia,{" "}
            <span className="italic font-light text-primary">ranked on what you can measure</span>.
          </h1>
          <p className="font-display font-light text-xl sm:text-2xl text-ink leading-[1.25] max-w-3xl">
            {COUNT_WORD[CATEGORIES.length]} rankings, each on one stated measure from a public source:{" "}
            {CATEGORIES.map((c) => MEASURE[c.slug]).join("; ")}.
          </p>
        </div>
      </section>

      {/* Category cards */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map(({ slug, title, description, icon }) => (
            <Link
              key={slug}
              href={`/best-suburbs/${slug}`}
              className="group rounded-2xl border border-line bg-surface-raised p-6 hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-surface-warm border border-line mb-4">
                <Image src={icon} alt="" width={32} height={32} aria-hidden="true" />
              </div>
              <h2 className="font-display text-xl text-ink group-hover:text-primary transition-colors mb-2 leading-tight">
                {title}
              </h2>
              <p className="font-sans text-sm text-ink-muted leading-relaxed mb-5">{description}</p>
              <span className="font-sans text-sm font-medium text-ink border-b border-line-strong group-hover:border-primary group-hover:text-primary pb-0.5 transition-colors">
                Browse rankings →
              </span>
            </Link>
          ))}
        </div>

        {/* Best suburbs by city */}
        {byCity.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight mb-2">Best suburbs by city</h2>
            <p className="font-sans text-base text-ink-muted leading-relaxed mb-6 max-w-3xl">
              The same rankings over each greater capital city, ten suburbs with a section each. A city appears
              under a ranking only where ten suburbs qualify and, for a price ranking, enough of the city&rsquo;s
              suburbs publish a median for the ten to stand for it.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {byCity.map(({ city, lists }) => (
                <div key={city.slug} className="rounded-2xl border border-line bg-surface-raised p-5">
                  <h3 className="font-display text-lg text-ink mb-3">{city.name}</h3>
                  <ul className="space-y-2 font-sans text-sm">
                    {lists.map((e) => (
                      <li key={e.category}>
                        <Link href={cityEditionPath(e.category, city.slug)} className="text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors">
                          {cityEditionLinkLabel(e.category, city)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 font-sans text-xs text-ink-subtle">
                    <Link href={`/property-market/${city.slug}`} className="hover:text-primary transition-colors">
                      {city.name} house prices by suburb
                    </Link>
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* How to use these rankings */}
        <section className="mt-14 max-w-3xl">
          <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight mb-4">How to use these rankings</h2>
          <ul className="space-y-3 font-sans text-base text-ink-muted leading-relaxed list-disc pl-5">
            <li>Each list ranks one measure. A suburb high on one can be low on another, so read two or three lists for the place you are looking at.</li>
            <li>A figure is printed only where the suburb&rsquo;s own page publishes it; a dash means none is published, not a low one.</li>
            <li>None of the lists forecasts. A past rise says what happened; a high yield says rent is high against price.</li>
            <li>Check the address, not only the suburb: school catchments and flood risk change from street to street.</li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="mt-14 max-w-3xl">
          <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight mb-4">Common questions</h2>
          <dl className="divide-y divide-line border-y border-line">
            {FAQS.map((f) => (
              <div key={f.question} className="py-5">
                <dt className="font-display text-lg text-ink leading-snug mb-2">{f.question}</dt>
                <dd className="font-sans text-base text-ink-muted leading-relaxed">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Methodology note */}
        <div className="mt-12 rounded-2xl border border-line bg-surface-warm p-6 text-sm font-sans text-ink-muted leading-relaxed">
          <p className="text-xs uppercase tracking-[0.25em] text-ink-subtle mb-2">Methodology</p>
          <p>
            Rankings are built from public data: ACARA school ICSEA, 2021 Census household
            figures, the median each suburb&rsquo;s own page publishes, bond-data rents and
            OpenStreetMap amenity counts.
            {!isRanked("lowest-flood-risk", null) &&
              " There is no flood risk ranking: we hold no flood hazard class for each suburb, and a suburb with no flood record is not a suburb with no flood risk."}
          </p>
        </div>
      </div>
    </>
  );
}
