import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo";
import { ExpertCTA } from "@/components/journey";
import { db } from "@/lib/db";
import { LOCALITIES_ONLY } from "@/lib/non-localities";
import { PUBLISHED_CHANGE, PUBLISHED_HOUSE_MEDIAN, withPublishedSales } from "@/lib/published-medians";
import { priceSourceLine } from "@/lib/ranking-notes";
import { formatPrice, formatPercentage } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";
import { BUTTON_PRIMARY, Band, HeroLead, HeroTitle, PhotoHero } from "@/components/premium";

// ISR, DB-querying services have build-phase guards, so we cache for 24h
// instead of running a function on every visit.
export const revalidate = 604800;

export const metadata: Metadata = {
  title: "Property Price Guide | Australian Suburb Median Prices",
  description:
    "Compare median house and unit prices across Australian suburbs. Updated quarterly from official government data.",
  alternates: { canonical: `${SITE_URL}/price-guide` },
  openGraph: { ...DEFAULT_OG,
    url: `${SITE_URL}/price-guide`,
    title: "Property Price Guide | Australian Suburb Median Prices",
    description:
      "Compare median house and unit prices across Australian suburbs. Updated quarterly from official government data.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const STATES = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"];
const PAGE_SIZE = 30;

type SortOption = "price-desc" | "price-asc" | "growth-desc";

function buildOrderBy(sort: SortOption) {
  if (sort === "price-asc") return { medianHousePrice: "asc" as const };
  if (sort === "growth-desc") return { annualGrowthHouse: "desc" as const };
  return { medianHousePrice: "desc" as const };
}

function buildUrl(
  params: Record<string, string | number | undefined>
): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "" && v !== 1) {
      sp.set(k, String(v));
    }
  }
  const qs = sp.toString();
  return qs ? `/price-guide?${qs}` : "/price-guide";
}

export default async function PriceGuidePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;

  const state =
    typeof sp.state === "string" && STATES.includes(sp.state)
      ? sp.state
      : undefined;

  const sort: SortOption =
    sp.sort === "price-asc" || sp.sort === "growth-desc"
      ? (sp.sort as SortOption)
      : "price-desc";

  const page = Math.max(1, parseInt(typeof sp.page === "string" ? sp.page : "1", 10) || 1);

  // Only the medians each suburb's own page publishes (fix item 47). Sorted
  // by growth, only the suburbs with a published 12-month change: the rest
  // have none to sort on.
  const where = {
    ...(sort === "growth-desc" ? PUBLISHED_CHANGE : PUBLISHED_HOUSE_MEDIAN),
    ...(state ? { state } : {}),
    ...LOCALITIES_ONLY,
  };

  // Skip the DB at build (Railway proxy drops build-time connections); ISR
  // (revalidate above) fills real data on first request. Empty renders cleanly
  // — pagination math clamps and the "No suburbs found" empty state covers it.
  const findManyQuery = () =>
    db.suburb.findMany({
      where,
      orderBy: buildOrderBy(sort),
      select: {
        slug: true,
        name: true,
        state: true,
        postcode: true,
        medianHousePrice: true,
        medianUnitPrice: true,
        annualGrowthHouse: true,
        statsSource: true,
        salesCountHouse: true,
      },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    });

  const [rows, total] =
    process.env.NEXT_PHASE === "phase-production-build"
      ? ([[], 0] as [Awaited<ReturnType<typeof findManyQuery>>, number])
      : await Promise.all([findManyQuery(), db.suburb.count({ where })]);
  const suburbs = rows.map(withPublishedSales);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Price Guide", url: "/price-guide" }]} />

      <PhotoHero photo="market" breadcrumbs={[{ label: "Price Guide" }]}>
        <p className="text-sm text-ink-muted mb-5">
          {total.toLocaleString()}{" "}suburbs &middot; Updated quarterly
        </p>
        <HeroTitle>
          Median prices,{" "}
          <span>side by side</span>
        </HeroTitle>
        <HeroLead>
          Filter and compare the median house and unit prices we publish,
          suburb by suburb, with the 12-month change where it is measured.
        </HeroLead>
      </PhotoHero>

      <Band tone="quiet" spacing="compact">
      {/* Filters */}
      <form method="GET" action="/price-guide" className="mb-8 flex flex-wrap gap-4 items-center">
        {/* State filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="state-select" className="text-sm font-semibold text-ink whitespace-nowrap">
            State
          </label>
          <select
            id="state-select"
            name="state"
            defaultValue={state ?? ""}
            className="rounded-lg border border-line-strong bg-surface-raised px-3 py-3 text-base text-ink focus:border-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All States</option>
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Sort filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-sm font-semibold text-ink whitespace-nowrap">
            Sort by
          </label>
          <select
            id="sort-select"
            name="sort"
            defaultValue={sort}
            className="rounded-lg border border-line-strong bg-surface-raised px-3 py-3 text-base text-ink focus:border-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="price-desc">Highest Price</option>
            <option value="price-asc">Lowest Price</option>
            <option value="growth-desc">Highest Growth</option>
          </select>
        </div>

        <button
          type="submit"
          className={`${BUTTON_PRIMARY} cursor-pointer`}
        >
          Apply
        </button>
      </form>

      {/* Results summary */}
      <p className="text-sm text-ink-muted mb-4">
        Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of{" "}
        {total.toLocaleString()} suburbs
      </p>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto rounded-xl bg-surface-raised border border-line">
        <table className="min-w-full divide-y divide-line text-sm">
          <thead className="bg-surface-warm">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-ink text-sm">
                Suburb
              </th>
              <th className="px-4 py-3 text-left font-semibold text-ink text-sm">
                State
              </th>
              <th className="px-4 py-3 text-left font-semibold text-ink text-sm">
                Postcode
              </th>
              <th className="px-4 py-3 text-right font-semibold text-ink text-sm">
                Median House
              </th>
              <th className="px-4 py-3 text-right font-semibold text-ink text-sm">
                Median Unit
              </th>
              <th className="px-4 py-3 text-right font-semibold text-ink text-sm">
                Annual Growth
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {suburbs.map((suburb) => (
              <tr key={suburb.slug} className="hover:bg-surface-warm/50 transition-colors">
                <td className="px-4 py-3 font-semibold">
                  <Link
                    href={`/suburbs/${suburb.slug}`}
                    className="text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink hover:text-primary transition-colors"
                  >
                    {suburb.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-muted">{suburb.state}</td>
                <td className="px-4 py-3 text-ink-muted">{suburb.postcode}</td>
                <td className="px-4 py-3 text-right font-semibold text-ink">
                  {formatPrice(suburb.medianHousePrice)}
                </td>
                <td className="px-4 py-3 text-right text-ink-muted">
                  {suburb.medianUnitPrice > 0
                    ? formatPrice(suburb.medianUnitPrice)
                    : <span className="text-ink-subtle">-</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  {suburb.annualGrowthHouse !== 0 ? (
                    <span
                      className={`inline-flex items-center gap-1 font-medium ${
                        suburb.annualGrowthHouse >= 0
                          ? "text-emerald-700"
                          : "text-red-700"
                      }`}
                    >
                      {suburb.annualGrowthHouse >= 0 ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5" />
                      )}
                      {formatPercentage(suburb.annualGrowthHouse)}
                    </span>
                  ) : (
                    <span className="text-ink-subtle">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden space-y-3">
        {suburbs.map((suburb) => (
          <Link
            key={suburb.slug}
            href={`/suburbs/${suburb.slug}`}
            className="block rounded-xl bg-surface-raised border border-line p-4 hover:border-ink transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-semibold text-ink leading-tight">{suburb.name}</p>
                <p className="text-xs text-ink-subtle mt-0.5">
                  {suburb.state} {suburb.postcode}
                </p>
              </div>
              {suburb.annualGrowthHouse !== 0 && (
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                    suburb.annualGrowthHouse >= 0
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {formatPercentage(suburb.annualGrowthHouse)}
                </span>
              )}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-xs text-ink-subtle">House</p>
                <p className="text-base font-semibold text-ink">
                  {formatPrice(suburb.medianHousePrice)}
                </p>
              </div>
              {suburb.medianUnitPrice > 0 && (
                <div>
                  <p className="text-xs text-ink-subtle">Unit</p>
                  <p className="text-base font-semibold text-ink">
                    {formatPrice(suburb.medianUnitPrice)}
                  </p>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {suburbs.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl font-semibold text-ink">Nothing to list here yet</p>
          <p className="mt-1 text-sm text-ink-muted max-w-xl mx-auto">
            {sort === "growth-desc"
              ? "A 12-month change is measured in New South Wales and South Australia only. Sort by price to see the other states."
              : "No suburb matches that filter with a published median."}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="mt-8 flex items-center justify-center gap-2"
        >
          {page > 1 && (
            <Link
              href={buildUrl({ state, sort, page: page - 1 })}
              className="rounded-lg border border-line bg-surface-raised px-3 py-2 text-sm font-semibold text-ink hover:border-ink transition-colors"
            >
              Previous
            </Link>
          )}
          <span className="text-sm text-ink-muted">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={buildUrl({ state, sort, page: page + 1 })}
              className="rounded-lg border border-line bg-surface-raised px-3 py-2 text-sm font-semibold text-ink hover:border-ink transition-colors"
            >
              Next
            </Link>
          )}
        </nav>
      )}

      {/* Data source note */}
      <div className="mt-10 max-w-3xl border-t border-line pt-6 text-sm text-ink-muted">
        <p className="text-sm font-semibold text-ink mb-1.5">Data source</p>
        <p className="leading-relaxed">
          {priceSourceLine(state ?? null)} A suburb is listed only when its own
          page publishes the median.
        </p>
      </div>
      </Band>

      {/* Seller-valuation funnel exit. Price-guide readers are asking "what
          are homes worth" — the appraisal answers it for their own place,
          with the selling guide as the softer fallback below. */}
      <ExpertCTA
        headline="Wondering what your own place is worth?"
        body="Medians tell you the suburb; an appraisal tells you your home. Ask us to introduce one participating local agent for a free, no-obligation appraisal based on recent sales near you. Only with your permission."
        ctaLabel="Get a free property appraisal"
        href="/appraisal"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 -mt-6 text-center">
        <Link
          href="/selling-guide"
          className="text-sm text-ink-muted underline underline-offset-4 decoration-line-strong hover:text-ink hover:decoration-ink"
        >
          Not ready for an agent yet? Get the free selling guide.
        </Link>
      </div>
    </>
  );
}
