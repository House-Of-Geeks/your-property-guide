import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { db } from "@/lib/db";
import { withPublishedSales } from "@/lib/published-medians";
import { describeSalesProvenance } from "@/lib/sales-provenance";
import { ALL_DWELLINGS_ONLY_SOURCES, monthYear, rentalSourceLabel } from "@/lib/rental-labels";
import { LOCALITIES_ONLY, NOT_PLACES_VERSION } from "@/lib/non-localities";
import { TOP_SUBURBS } from "@/lib/data/top-suburbs";
import { isSecondaryLocality } from "@/lib/duplicate-localities";
import { formatPriceFull } from "@/lib/utils/format";
import { SuburbsResults, STATES } from "./Results";

// ISR, page shell caches as static. searchParams reads are isolated to
// the SuburbsResults Suspense child below so the parent stays in the CDN
// cache while only the dynamic results chunk re-renders per state/query.
export const revalidate = 86400;

// Commercial intent review 10 Oct 2026, suburbs-market 3.11 ("suburb
// profile", 1,900 searches a month): the page answers what a suburb profile
// is, lets you search one, and lists the most searched with the figures
// their profiles publish. Rivals' median is 248 words with a table; this
// page had 56 words.
const TITLE = "Suburb Profiles: House Prices, Rents & Schools by Suburb";
const DESCRIPTION =
  "Suburb profiles for every Australian suburb: the median house price where a state agency or the ABS publishes one, weekly rent, schools and population.";
const H1 = "Suburb profiles for every Australian suburb";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/suburbs` },
  openGraph: { url: `${SITE_URL}/suburbs`, title: TITLE, description: DESCRIPTION, type: "website" },
  twitter: { card: "summary_large_image" },
};

// What each section of a profile shows and where it comes from: the feeds
// in scripts/sync/sources, named as the profile names them
// (profileSourceLine in src/lib/suburb-data-quality.ts).
const PROFILE_SECTIONS: { section: string; shows: string; source: string }[] = [
  {
    section: "House prices",
    shows: "The median house price (and unit median where the feed has one), with its period and, where the feed counts them, the number of sales. Withheld, with the reason, where we can't vouch for it or fewer than five sales were recorded.",
    source: "NSW Valuer General; Land Victoria; the SA Government; the ABS (statistical-area medians) for Queensland, WA, Tasmania, the ACT and the NT",
  },
  {
    section: "12-month change",
    shows: "Only where the feed measures one; otherwise a dash.",
    source: "NSW Valuer General; the SA Government",
  },
  {
    section: "Weekly rent",
    shows: "Median weekly rent for houses and units (all dwellings in WA), and a gross yield where a house median is published.",
    source: "Bond data: NSW DCJ, Homes Victoria, the Queensland RTA, the SA Government, the WA Government; the 2021 Census elsewhere",
  },
  {
    section: "Schools",
    shows: "Nearby primary and secondary schools, with sector and ICSEA where published.",
    source: "ACARA",
  },
  {
    section: "Who lives here",
    shows: "Population, median age, household types, owners and renters.",
    source: "ABS 2021 Census",
  },
  {
    section: "Crime, hazards, climate",
    shows: "Recorded offences, flood and bushfire classes, and temperature and rainfall, where the feeds cover the suburb.",
    source: "State police open data; state and national hazard maps; the Bureau of Meteorology",
  },
  {
    section: "Getting around",
    shows: "Walk, transit and bike scores.",
    source: "OpenStreetMap",
  },
];

interface MostSearchedRow {
  slug: string;
  name: string;
  state: string;
  postcode: string;
  /** 0 when the profile withholds it. */
  medianHousePrice: number;
  priceSource: string | null;
  rentHouse: number;
  rentSource: string | null;
  rentPeriod: Date | null;
}

const MOST_SEARCHED_COUNT = 20;

// The most searched profiles (Search Console impressions, the warm-up list
// in src/lib/data/prebuild-suburbs.json), with the median and rent each
// profile publishes: withPublishedSales is the profile's own rule, so the
// table never prints a median the profile withholds. Cached for a day.
const getMostSearched = unstable_cache(
  async (): Promise<MostSearchedRow[]> => {
    if (process.env.NEXT_PHASE === "phase-production-build") return [];
    const top = TOP_SUBURBS.filter((s) => !isSecondaryLocality(s.slug)).slice(0, MOST_SEARCHED_COUNT);
    const slugs = top.map((s) => s.slug);
    const rows = await db.suburb.findMany({
      where: { AND: [{ slug: { in: slugs } }, LOCALITIES_ONLY] },
      select: { slug: true, name: true, state: true, postcode: true, medianHousePrice: true, medianUnitPrice: true, annualGrowthHouse: true, statsSource: true, salesCountHouse: true },
    });
    const rents = await db.suburbRentalStat.findMany({
      where: { suburbSlug: { in: slugs } },
      orderBy: [{ suburbSlug: "asc" }, { periodDate: "desc" }, { updatedAt: "desc" }],
      distinct: ["suburbSlug"],
      select: { suburbSlug: true, source: true, medianRentHouse: true, periodDate: true },
    });
    const bySlug = new Map(rows.map((r) => [r.slug, withPublishedSales(r)]));
    const rentBySlug = new Map(rents.map((r) => [r.suburbSlug, r]));
    return top.flatMap((t) => {
      const r = bySlug.get(t.slug);
      if (!r) return [];
      const rent = rentBySlug.get(t.slug);
      const rentHouse = rent && !ALL_DWELLINGS_ONLY_SOURCES.includes(rent.source) ? rent.medianRentHouse ?? 0 : 0;
      return [{
        slug: r.slug,
        name: r.name,
        state: r.state,
        postcode: r.postcode,
        medianHousePrice: r.medianHousePrice,
        priceSource: r.medianHousePrice > 0 ? describeSalesProvenance({ source: r.statsSource, periodEnd: null, salesCount: null, suburbName: r.name })?.sourceShort ?? null : null,
        rentHouse: rentHouse > 0 ? rentHouse : 0,
        rentSource: rentHouse > 0 ? rentalSourceLabel(rent?.source, r.postcode) : null,
        rentPeriod: rentHouse > 0 ? rent?.periodDate ?? null : null,
      }];
    });
  },
  ["suburbs-index-most-searched:v1", NOT_PLACES_VERSION],
  { revalidate: 86400, tags: ["sitemap-suburbs"] },
);

interface PageProps {
  searchParams: Promise<{ state?: string; q?: string; count?: string }>;
}

export default function SuburbsPage({ searchParams }: PageProps) {
  return (
    <>
      <CollectionPageJsonLd name={H1} description={DESCRIPTION} url="/suburbs" />
      <BreadcrumbJsonLd items={[{ name: "Suburbs", url: "/suburbs" }]} />

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
            <Breadcrumbs items={[{ label: "Suburbs" }]} />
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
                Suburb profiles
              </p>
              <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6">
                {H1}
              </h1>
              <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-xl">
                A suburb profile puts a suburb&rsquo;s median house price, weekly
                rent, schools, population, crime and walkability on one page, each
                figure with its source, and its date where the feed gives one.
                Where we can&rsquo;t vouch for a median, the profile says why
                instead of printing one. No paywall, no sign-up.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-line-warm bg-surface-raised shadow-card overflow-hidden">
                <Image
                  src="/images/illustrations/suburb-data.svg"
                  alt=""
                  aria-hidden="true"
                  width={320}
                  height={220}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-x-10 gap-y-6">
            <div className="flex items-start gap-3">
              <img src="/images/icons/median.svg" alt="" width={28} height={28} className="w-7 h-7 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-display text-2xl text-ink leading-none mb-1">Median</p>
                <p className="font-sans text-xs uppercase tracking-wider text-ink-subtle">house &amp; unit prices</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <img src="/images/icons/growth.svg" alt="" width={28} height={28} className="w-7 h-7 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-display text-2xl text-ink leading-none mb-1">Rent</p>
                <p className="font-sans text-xs uppercase tracking-wider text-ink-subtle">weekly, houses &amp; units</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <img src="/images/icons/schools.svg" alt="" width={28} height={28} className="w-7 h-7 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-display text-2xl text-ink leading-none mb-1">Schools</p>
                <p className="font-sans text-xs uppercase tracking-wider text-ink-subtle">primary &amp; secondary</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <img src="/images/icons/walkability.svg" alt="" width={28} height={28} className="w-7 h-7 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-display text-2xl text-ink leading-none mb-1">Walk</p>
                <p className="font-sans text-xs uppercase tracking-wider text-ink-subtle">score &amp; transit</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <img src="/images/icons/hazard.svg" alt="" width={28} height={28} className="w-7 h-7 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-display text-2xl text-ink leading-none mb-1">Risk</p>
                <p className="font-sans text-xs uppercase tracking-wider text-ink-subtle">flood, bushfire, crime</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <img src="/images/icons/climate.svg" alt="" width={28} height={28} className="w-7 h-7 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-display text-2xl text-ink leading-none mb-1">Climate</p>
                <p className="font-sans text-xs uppercase tracking-wider text-ink-subtle">temp, rain, sun</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        <section aria-labelledby="search-a-suburb">
          <h2 id="search-a-suburb" className="font-display text-2xl sm:text-3xl text-ink leading-tight mb-2 max-w-3xl mx-auto">
            Search a suburb
          </h2>
          <p className="font-sans text-sm text-ink-muted mb-5 max-w-3xl mx-auto">
            Type a suburb name or a postcode and pick from the list, or press
            Search to see every match. A four-digit postcode also opens its
            postcode page, which lists every suburb that shares it.
          </p>
          <Suspense fallback={null}>
            <SuburbsResults searchParams={searchParams} />
          </Suspense>
        </section>

        <MostSearched />

        <section aria-labelledby="whats-in-a-profile">
          <h2 id="whats-in-a-profile" className="font-display text-2xl sm:text-3xl text-ink leading-tight mb-2">
            What&rsquo;s in a suburb profile
          </h2>
          <p className="font-sans text-sm sm:text-base text-ink-muted leading-relaxed mb-6 max-w-3xl">
            Each profile has the sections below, filled from public feeds. A
            section with no data for the suburb is left off rather than shown
            empty, and a profile links to its rental market, school and
            nearby-suburb comparison pages where those have data.
          </p>
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full text-left font-sans text-sm">
              <caption className="sr-only">What a suburb profile shows and where each figure comes from</caption>
              <thead className="bg-surface-warm text-ink">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Section</th>
                  <th scope="col" className="px-4 py-3 font-medium">What it shows</th>
                  <th scope="col" className="px-4 py-3 font-medium">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-surface-raised">
                {PROFILE_SECTIONS.map((r) => (
                  <tr key={r.section} className="align-top">
                    <th scope="row" className="px-4 py-3 font-medium text-ink whitespace-nowrap">{r.section}</th>
                    <td className="px-4 py-3 text-ink-muted leading-relaxed">{r.shows}</td>
                    <td className="px-4 py-3 text-ink-muted leading-relaxed">{r.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 font-sans text-xs text-ink-subtle">
            How each feed is read, and when a figure is withheld:{" "}
            <Link href="/methodology" className="text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors">
              methodology
            </Link>
            .
          </p>
        </section>

        <section aria-labelledby="browse-by-state" className="border-t border-line pt-10">
          <h2 id="browse-by-state" className="font-display text-2xl text-ink mb-5">Browse by state</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATES.map((st) => (
              <Link
                key={st.code}
                href={`/suburbs?state=${st.code}`}
                className="flex items-center gap-3 p-4 border border-line rounded-xl hover:border-ink hover:bg-surface-warm transition-colors group"
              >
                <span className={`text-xs font-bold px-2 py-1 rounded ${st.bg} ${st.text} shrink-0`}>
                  {st.code}
                </span>
                <span className="text-sm font-medium text-ink-muted group-hover:text-ink">{st.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

/** The most searched profiles with the median and rent each publishes, each with its source. */
async function MostSearched() {
  const rows = await getMostSearched();
  if (rows.length < 5) return null;
  return (
    <section aria-labelledby="most-searched">
      <h2 id="most-searched" className="font-display text-2xl sm:text-3xl text-ink leading-tight mb-2">
        Most searched suburbs
      </h2>
      <p className="font-sans text-sm sm:text-base text-ink-muted leading-relaxed mb-6 max-w-3xl">
        The profiles people look up most on Your Property Guide, by Google
        search impressions over three months, with the median and weekly house
        rent each profile publishes. A dash means the profile withholds the
        figure; open it to see why.
      </p>
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full text-left font-sans text-sm">
          <caption className="sr-only">Most searched suburb profiles: median house price and weekly house rent, with sources</caption>
          <thead className="bg-surface-warm text-ink">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Suburb</th>
              <th scope="col" className="px-4 py-3 font-medium">Median house price</th>
              <th scope="col" className="px-4 py-3 font-medium">Weekly house rent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-surface-raised">
            {rows.map((r) => (
              <tr key={r.slug} className="align-top">
                <th scope="row" className="px-4 py-3 font-medium">
                  <Link href={`/suburbs/${r.slug}`} className="text-ink hover:text-primary transition-colors">
                    {`${r.name} ${r.state} ${r.postcode}`}
                  </Link>
                </th>
                <td className="px-4 py-3 text-ink tabular-nums">
                  {r.medianHousePrice > 0 ? formatPriceFull(r.medianHousePrice) : "–"}
                  {r.priceSource && <span className="block text-xs text-ink-subtle">{r.priceSource}</span>}
                </td>
                <td className="px-4 py-3 text-ink tabular-nums">
                  {r.rentHouse > 0 ? `$${r.rentHouse.toLocaleString("en-AU")}` : "–"}
                  {r.rentSource && (
                    <span className="block text-xs text-ink-subtle">
                      {r.rentSource}
                      {r.rentPeriod ? `, ${monthYear(new Date(r.rentPeriod))}` : ""}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
