import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, TrendingDown, Clock, Info } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { db } from "@/lib/db";
import { formatPrice, formatPercentage } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd items={[{ name: "Price Guide", url: "/price-guide" }]} />
      <Breadcrumbs items={[{ label: "Price Guide" }]} />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Property Price Guide
        </h1>
        <p className="text-gray-500 mt-1">
          Median house and unit prices across Australian suburbs
        </p>
      </div>

      {/* Filters */}
      <form method="GET" action="/price-guide" className="mb-6 flex flex-wrap gap-3 items-center">
        {/* State filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="state-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">
            State
          </label>
          <select
            id="state-select"
            name="state"
            defaultValue={state ?? ""}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
          <label htmlFor="sort-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Sort by
          </label>
          <select
            id="sort-select"
            name="sort"
            defaultValue={sort}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="price-desc">Highest Price</option>
            <option value="price-asc">Lowest Price</option>
            <option value="growth-desc">Highest Growth</option>
          </select>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          Apply
        </button>
      </form>

      {/* Results summary */}
      <p className="text-sm text-gray-500 mb-4">
        Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of{" "}
        {total.toLocaleString()} suburbs
      </p>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto rounded-xl bg-white shadow-card border border-gray-100 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Suburb
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                State
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Postcode
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">
                Median House
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">
                Median Unit
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">
                Annual Growth
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">
                Days on Market
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {suburbs.map((suburb) => (
              <tr key={suburb.slug} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={`/suburbs/${suburb.slug}`}
                    className="text-primary hover:underline"
                  >
                    {suburb.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-600">{suburb.state}</td>
                <td className="px-4 py-3 text-gray-600">{suburb.postcode}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">
                  {formatPrice(suburb.medianHousePrice)}
                </td>
                <td className="px-4 py-3 text-right text-gray-700">
                  {suburb.medianUnitPrice > 0
                    ? formatPrice(suburb.medianUnitPrice)
                    : <span className="text-gray-400">—</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  {suburb.annualGrowthHouse !== 0 ? (
                    <span
                      className={`inline-flex items-center gap-1 font-medium ${
                        suburb.annualGrowthHouse >= 0
                          ? "text-green-600"
                          : "text-red-500"
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
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">
                  {suburb.daysOnMarket > 0 ? (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {suburb.daysOnMarket}d
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
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
            className="block rounded-xl bg-white shadow-card border border-gray-100 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-900">{suburb.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {suburb.state} {suburb.postcode}
                </p>
              </div>
              {suburb.annualGrowthHouse !== 0 && (
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    suburb.annualGrowthHouse >= 0
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {formatPercentage(suburb.annualGrowthHouse)}
                </span>
              )}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-xs text-gray-500">House</p>
                <p className="font-semibold text-gray-900">
                  {formatPrice(suburb.medianHousePrice)}
                </p>
              </div>
              {suburb.medianUnitPrice > 0 && (
                <div>
                  <p className="text-xs text-gray-500">Unit</p>
                  <p className="font-semibold text-gray-900">
                    {formatPrice(suburb.medianUnitPrice)}
                  </p>
                </div>
              )}
              {suburb.daysOnMarket > 0 && (
                <div>
                  <p className="text-xs text-gray-500">Days on Market</p>
                  <p className="font-semibold text-gray-900">
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
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg font-medium">No suburbs found</p>
          <p className="mt-1 text-sm">Try adjusting your filters.</p>
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
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Previous
            </Link>
          )}
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={buildUrl({ state, sort, page: page + 1 })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Next
            </Link>
          )}
        </nav>
      )}

      {/* Data source note */}
      <div className="mt-8 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
        <Info className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" />
        <p>
          Data sourced from state government Valuer-General offices. Updated quarterly.
        </p>
      </div>
    </div>
  );
}
