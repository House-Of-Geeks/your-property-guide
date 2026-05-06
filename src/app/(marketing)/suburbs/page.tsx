import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { getSuburbs } from "@/lib/services/suburb-service";
import { SITE_URL } from "@/lib/constants";
import { SuburbsSearchBar } from "./SuburbsSearchBar";

// ISR — DB-querying services have build-phase guards, so we cache for 24h
// instead of running a function on every visit. Filter pages with
// searchParams will still dynamically render per-request.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Browse All Australian Suburbs | Property Data & Profiles",
  description: "Search every Australian suburb for property market data, median prices, school catchments, climate, walkability, and local insights.",
  alternates: { canonical: `${SITE_URL}/suburbs` },
  openGraph: { url: `${SITE_URL}/suburbs`, title: "Browse All Australian Suburbs", description: "Search every Australian suburb for property market data.", type: "website" },
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
    <>
      <CollectionPageJsonLd
        name="Browse All Australian Suburbs"
        description="Search every Australian suburb for property market data, median prices, school catchments, and local insights."
        url="/suburbs"
      />
      <BreadcrumbJsonLd items={[{ name: "Suburbs", url: "/suburbs" }]} />

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
            <Breadcrumbs items={[{ label: "Suburbs" }]} />
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
                {total.toLocaleString()} suburbs covered
              </p>
              <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6">
                Australian suburbs, <span className="italic text-primary">data and all</span>.
              </h1>
              <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-xl">
                Median prices, growth, schools, walk score, climate, hazard and
                crime. Sourced and dated. No paywall, no sign-up, no email gate.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-line-warm bg-surface-raised shadow-card overflow-hidden">
                <Image
                  src="/images/illustrations/suburb-data.svg"
                  alt=""
                  width={320}
                  height={220}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Stat anchor row, the headline data categories */}
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
                <p className="font-display text-2xl text-ink leading-none mb-1">12mo</p>
                <p className="font-sans text-xs uppercase tracking-wider text-ink-subtle">growth &amp; trend</p>
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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Search + state filter */}
        <SuburbsSearchBar defaultQ={q} defaultState={state} />

        {/* Count */}
        <p className="text-sm text-ink-muted mb-5 max-w-3xl mx-auto">
          Showing {suburbs.length.toLocaleString()} of {total.toLocaleString()} suburbs
          {state && ` in ${STATE_MAP[state]?.label ?? state}`}
          {q && ` matching "${q}"`}
        </p>

        {/* Suburb grid */}
        {suburbs.length === 0 ? (
          <div className="rounded-2xl border border-line-warm bg-surface-warm p-12 text-center max-w-2xl mx-auto">
            <Image
              src="/images/illustrations/data-empty.svg"
              alt=""
              width={320}
              height={220}
              className="w-56 h-auto mx-auto mb-4"
            />
            <p className="font-display text-xl text-ink mb-2">No suburbs found</p>
            <p className="font-sans text-sm text-ink-muted mb-4">
              Try a different state or clear your search to see everything.
            </p>
            <Link
              href="/suburbs"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-cta hover:text-cta-hover"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-px bg-line border border-line rounded-xl overflow-hidden mb-6">
            {suburbs.map((suburb) => {
              const stateInfo = STATE_MAP[suburb.state];
              return (
                <Link
                  key={suburb.slug}
                  href={`/suburbs/${suburb.slug}`}
                  className="bg-surface-raised hover:bg-surface-warm transition-colors px-3 py-3 group"
                >
                  <div className="flex items-start justify-between gap-1 mb-0.5">
                    <span className="text-sm font-medium text-ink group-hover:text-primary leading-tight line-clamp-2">
                      {suburb.name}
                    </span>
                    {stateInfo && (
                      <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${stateInfo.bg} ${stateInfo.text}`}>
                        {suburb.state}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-subtle">{suburb.postcode}</p>
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
              className="inline-flex items-center gap-2 px-6 py-3 border border-line-strong rounded-lg text-sm font-medium text-ink hover:border-ink hover:bg-surface-warm transition-colors"
            >
              Load More ↓
            </Link>
          </div>
        )}

        {/* Browse by State */}
        <div className="border-t border-line pt-10">
          <h2 className="font-display text-2xl text-ink mb-5">Browse by State</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATES.map((s) => (
              <Link
                key={s.code}
                href={filterUrl(s.code)}
                className="flex items-center gap-3 p-4 border border-line rounded-xl hover:border-ink hover:bg-surface-warm transition-colors group"
              >
                <span className={`text-xs font-bold px-2 py-1 rounded ${s.bg} ${s.text} shrink-0`}>
                  {s.code}
                </span>
                <span className="text-sm font-medium text-ink-muted group-hover:text-ink">{s.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
