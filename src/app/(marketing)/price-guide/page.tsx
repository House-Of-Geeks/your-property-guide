import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { db } from "@/lib/db";
import { formatPrice, formatPercentage } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";

// ISR, DB-querying services have build-phase guards, so we cache for 24h
// instead of running a function on every visit.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Property Price Guide | Australian Suburb Median Prices",
  description:
    "Compare median house and unit prices across Australian suburbs. Updated quarterly from official government data.",
  alternates: { canonical: `${SITE_URL}/price-guide` },
  openGraph: {
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

  const where = {
    medianHousePrice: { gt: 0 },
    ...(state ? { state } : {}),
  };

  const [suburbs, total] = await Promise.all([
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
        daysOnMarket: true,
      },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.suburb.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Price Guide", url: "/price-guide" }]} />

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
            <Breadcrumbs items={[{ label: "Price Guide" }]} />
          </div>

          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
            {total.toLocaleString()} suburbs &middot; updated quarterly
          </p>
          <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
            Median prices, <span className="italic text-primary">side by side</span>.
          </h1>
          <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-2xl">
            Filter and compare median house and unit prices across every Australian suburb,
            with annual growth and days on market.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Filters */}
      <form method="GET" action="/price-guide" className="mb-6 flex flex-wrap gap-3 items-center">
        {/* State filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="state-select" className="text-sm font-sans font-medium text-ink whitespace-nowrap">
            State
          </label>
          <select
            id="state-select"
            name="state"
            defaultValue={state ?? ""}
            className="rounded-lg border border-line bg-surface-raised px-3 py-2 text-sm font-sans text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
          <label htmlFor="sort-select" className="text-sm font-sans font-medium text-ink whitespace-nowrap">
            Sort by
          </label>
          <select
            id="sort-select"
            name="sort"
            defaultValue={sort}
            className="rounded-lg border border-line bg-surface-raised px-3 py-2 text-sm font-sans text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="price-desc">Highest Price</option>
            <option value="price-asc">Lowest Price</option>
            <option value="growth-desc">Highest Growth</option>
          </select>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-cta px-4 py-2 text-sm font-sans font-medium text-white hover:bg-cta/90 transition-colors"
        >
          Apply
        </button>
      </form>

      {/* Results summary */}
      <p className="text-sm font-sans text-ink-muted mb-4">
        Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of{" "}
        {total.toLocaleString()} suburbs
      </p>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto rounded-2xl bg-surface-raised border border-line">
        <table className="min-w-full divide-y divide-line text-sm">
          <thead className="bg-surface-warm">
            <tr>
              <th className="px-4 py-3 text-left font-sans font-medium text-ink uppercase tracking-wider text-xs">
                Suburb
              </th>
              <th className="px-4 py-3 text-left font-sans font-medium text-ink uppercase tracking-wider text-xs">
                State
              </th>
              <th className="px-4 py-3 text-left font-sans font-medium text-ink uppercase tracking-wider text-xs">
                Postcode
              </th>
              <th className="px-4 py-3 text-right font-sans font-medium text-ink uppercase tracking-wider text-xs">
                Median House
              </th>
              <th className="px-4 py-3 text-right font-sans font-medium text-ink uppercase tracking-wider text-xs">
                Median Unit
              </th>
              <th className="px-4 py-3 text-right font-sans font-medium text-ink uppercase tracking-wider text-xs">
                Annual Growth
              </th>
              <th className="px-4 py-3 text-right font-sans font-medium text-ink uppercase tracking-wider text-xs">
                Days on Market
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {suburbs.map((suburb) => (
              <tr key={suburb.slug} className="hover:bg-surface-warm/50 transition-colors">
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={`/suburbs/${suburb.slug}`}
                    className="font-sans text-ink border-b border-line-strong hover:border-primary hover:text-primary transition-colors pb-0.5"
                  >
                    {suburb.name}
                  </Link>
                </td>
                <td className="px-4 py-3 font-sans text-ink-muted">{suburb.state}</td>
                <td className="px-4 py-3 font-sans text-ink-muted">{suburb.postcode}</td>
                <td className="px-4 py-3 text-right font-display text-ink">
                  {formatPrice(suburb.medianHousePrice)}
                </td>
                <td className="px-4 py-3 text-right font-sans text-ink-muted">
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
                <td className="px-4 py-3 text-right font-sans text-ink-muted">
                  {suburb.daysOnMarket > 0 ? (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-ink-subtle" />
                      {suburb.daysOnMarket}d
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
            className="block rounded-2xl bg-surface-raised border border-line p-4 hover:border-primary/40 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-lg text-ink leading-tight">{suburb.name}</p>
                <p className="text-xs font-sans text-ink-subtle mt-0.5">
                  {suburb.state} {suburb.postcode}
                </p>
              </div>
              {suburb.annualGrowthHouse !== 0 && (
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full font-sans ${
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
                <p className="text-xs font-sans text-ink-subtle">House</p>
                <p className="font-display text-base text-ink">
                  {formatPrice(suburb.medianHousePrice)}
                </p>
              </div>
              {suburb.medianUnitPrice > 0 && (
                <div>
                  <p className="text-xs font-sans text-ink-subtle">Unit</p>
                  <p className="font-display text-base text-ink">
                    {formatPrice(suburb.medianUnitPrice)}
                  </p>
                </div>
              )}
              {suburb.daysOnMarket > 0 && (
                <div>
                  <p className="text-xs font-sans text-ink-subtle">Days on Market</p>
                  <p className="font-display text-base text-ink">
                    {suburb.daysOnMarket}d
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
          <p className="font-display text-xl text-ink">No suburbs found</p>
          <p className="mt-1 text-sm font-sans text-ink-muted">Try adjusting your filters.</p>
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
              className="rounded-lg border border-line px-3 py-2 text-sm font-sans text-ink-muted hover:bg-surface-warm transition-colors"
            >
              Previous
            </Link>
          )}
          <span className="text-sm font-sans text-ink-muted">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={buildUrl({ state, sort, page: page + 1 })}
              className="rounded-lg border border-line px-3 py-2 text-sm font-sans text-ink-muted hover:bg-surface-warm transition-colors"
            >
              Next
            </Link>
          )}
        </nav>
      )}

      {/* Data source note */}
      <div className="mt-8 rounded-2xl border border-line bg-surface-warm p-5 text-sm font-sans text-ink-muted">
        <p className="text-xs uppercase tracking-[0.25em] text-ink-subtle mb-1.5">Data source</p>
        <p>Data sourced from state government Valuer-General offices. Updated quarterly.</p>
      </div>
      </div>
    </>
  );
}
