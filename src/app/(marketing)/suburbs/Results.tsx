import Link from "next/link";
import Image from "next/image";
import { getSuburbs } from "@/lib/services/suburb-service";
import { SuburbsSearchBar } from "./SuburbsSearchBar";

const PAGE_SIZE = 60;

const STATES = [
  { code: "NSW", label: "New South Wales",    bg: "bg-black",     text: "text-white" },
  { code: "VIC", label: "Victoria",           bg: "bg-[#5c2d5e]", text: "text-white" },
  { code: "QLD", label: "Queensland",         bg: "bg-[#DD3C70]", text: "text-white" },
  { code: "WA",  label: "Western Australia",  bg: "bg-black",     text: "text-white" },
  { code: "SA",  label: "South Australia",    bg: "bg-[#5c2d5e]", text: "text-white" },
  { code: "TAS", label: "Tasmania",           bg: "bg-[#DD3C70]", text: "text-white" },
  { code: "NT",  label: "Northern Territory", bg: "bg-black",     text: "text-white" },
  { code: "ACT", label: "ACT",                bg: "bg-[#5c2d5e]", text: "text-white" },
];

const STATE_MAP = Object.fromEntries(STATES.map((s) => [s.code, s]));

interface SuburbsResultsProps {
  searchParams: Promise<{ state?: string; q?: string; count?: string }>;
}

export async function SuburbsResults({ searchParams }: SuburbsResultsProps) {
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
      <SuburbsSearchBar defaultQ={q} defaultState={state} />

      <p className="text-sm text-ink-muted mb-5 max-w-3xl mx-auto">
        Showing {suburbs.length.toLocaleString()} of {total.toLocaleString()} suburbs
        {state && ` in ${STATE_MAP[state]?.label ?? state}`}
        {q && ` matching "${q}"`}
      </p>

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
    </>
  );
}
