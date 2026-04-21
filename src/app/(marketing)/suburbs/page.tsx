import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { getSuburbs } from "@/lib/services/suburb-service";
import { SITE_URL } from "@/lib/constants";
import { SuburbsSearchBar } from "./SuburbsSearchBar";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Browse All Australian Suburbs | Property Data & Profiles",
  description: "Search every Australian suburb for property market data, median prices, school catchments, and local insights.",
  alternates: { canonical: `${SITE_URL}/suburbs` },
  openGraph: { url: `${SITE_URL}/suburbs`, title: "Browse All Australian Suburbs", description: "Search every Australian suburb for property market data, median prices, school catchments, and local insights.", type: "website" },
  twitter: { card: "summary_large_image" },
};

// Brand palette: black, primary purple (#5c2d5e), accent pink (#DD3C70), neutral gray
const STATES = [
  { code: "NSW", label: "New South Wales",    bg: "bg-black",           text: "text-white" },
  { code: "VIC", label: "Victoria",           bg: "bg-[#5c2d5e]",       text: "text-white" },
  { code: "QLD", label: "Queensland",         bg: "bg-[#DD3C70]",       text: "text-white" },
  { code: "WA",  label: "Western Australia",  bg: "bg-black",           text: "text-white" },
  { code: "SA",  label: "South Australia",    bg: "bg-[#5c2d5e]",       text: "text-white" },
  { code: "TAS", label: "Tasmania",           bg: "bg-[#DD3C70]",       text: "text-white" },
  { code: "NT",  label: "Northern Territory", bg: "bg-black",           text: "text-white" },
  { code: "ACT", label: "ACT",                bg: "bg-[#5c2d5e]",       text: "text-white" },
];

const STATE_MAP = Object.fromEntries(STATES.map((s) => [s.code, s]));

const PAGE_SIZE = 60;

interface PageProps {
  searchParams: Promise<{ state?: string; q?: string; count?: string }>;
}

export default async function SuburbsPage({ searchParams }: PageProps) {
  const { state, q, count: countStr } = await searchParams;
  const limit = Math.max(PAGE_SIZE, Math.min(600, parseInt(countStr ?? String(PAGE_SIZE), 10)));

  const { suburbs, total } = await getSuburbs({
    state: state || undefined,
    search: q || undefined,
    limit,
    offset: 0,
  });

  const hasMore = suburbs.length < total;

  function loadMoreUrl() {
    const params = new URLSearchParams();
    if (state) params.set("state", state);
    if (q) params.set("q", q);
    params.set("count", String(limit + PAGE_SIZE));
    return `/suburbs?${params.toString()}`;
  }

  function filterUrl(newState?: string, newQ?: string) {
    const params = new URLSearchParams();
    if (newState) params.set("state", newState);
    if (newQ) params.set("q", newQ);
    const qs = params.toString();
    return `/suburbs${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <CollectionPageJsonLd
        name="Browse All Australian Suburbs"
        description="Search every Australian suburb for property market data, median prices, school catchments, and local insights."
        url="/suburbs"
      />
      <BreadcrumbJsonLd items={[{ name: "Suburbs", url: "/suburbs" }]} />
      <Breadcrumbs items={[{ label: "Suburbs" }]} />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse All Suburbs</h1>
        <p className="text-gray-500 mt-2">Search Australian suburbs for property data, school catchments, and local insights.</p>
      </div>

      {/* Search + state filter */}
      <SuburbsSearchBar defaultQ={q} defaultState={state} />

      {/* Count */}
      <p className="text-sm text-gray-500 mb-5 max-w-3xl mx-auto">
        Showing {suburbs.length.toLocaleString()} of {total.toLocaleString()} suburbs
        {state && ` in ${STATE_MAP[state]?.label ?? state}`}
        {q && ` matching "${q}"`}
      </p>

      {/* Suburb grid */}
      {suburbs.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium">No suburbs found</p>
          <Link href="/suburbs" className="mt-2 inline-block text-sm text-black underline">Clear filters</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-px bg-gray-100 border border-gray-100 rounded-xl overflow-hidden mb-6">
          {suburbs.map((suburb) => {
            const stateInfo = STATE_MAP[suburb.state];
            return (
              <Link
                key={suburb.slug}
                href={`/suburbs/${suburb.slug}`}
                className="bg-white hover:bg-gray-50 transition-colors px-3 py-3 group"
              >
                <div className="flex items-start justify-between gap-1 mb-0.5">
                  <span className="text-sm font-medium text-gray-900 group-hover:text-black leading-tight line-clamp-2">
                    {suburb.name}
                  </span>
                  {stateInfo && (
                    <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${stateInfo.bg} ${stateInfo.text}`}>
                      {suburb.state}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">{suburb.postcode}</p>
              </Link>
            );
          })}
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="text-center mb-12">
          <Link
            href={loadMoreUrl()}
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-black hover:text-black transition-colors"
          >
            Load More ↓
          </Link>
        </div>
      )}

      {/* Browse by State */}
      <div className="border-t border-gray-100 pt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Browse by State</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STATES.map((s) => (
            <Link
              key={s.code}
              href={filterUrl(s.code)}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-black transition-colors group"
            >
              <span className={`text-xs font-bold px-2 py-1 rounded ${s.bg} ${s.text} shrink-0`}>
                {s.code}
              </span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-black">{s.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
