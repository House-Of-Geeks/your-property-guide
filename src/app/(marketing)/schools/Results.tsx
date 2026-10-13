import Link from "next/link";
import { GraduationCap, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { searchSchools } from "@/lib/services/school-service";
import { makeSchoolSlug } from "@/lib/utils/school";
import { BUTTON_PRIMARY, BUTTON_SECONDARY } from "@/components/premium";

const PAGE_SIZE = 20;

const STATES = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"];

function typeLabel(type: string): string {
  if (type === "primary") return "Primary";
  if (type === "secondary") return "Secondary";
  if (type === "combined") return "Combined";
  if (type === "special") return "Special";
  return type;
}

function sectorLabel(sector: string): string {
  if (sector === "government") return "Government";
  if (sector === "catholic") return "Catholic";
  if (sector === "independent") return "Independent";
  return sector;
}

// Type and sector tags: neutral, the words carry the meaning (BRAND.md §3,
// colour is for actions and state).
const TAG = "inline-flex items-center px-2 py-0.5 rounded-md border border-line bg-surface-warm text-xs font-medium text-ink-muted";

// Form fields share one look; the row stretches them to the button's height.
const FIELD = "py-3 text-base text-ink border border-line-strong rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

function buildPageUrl(base: Record<string, string>, page: number): string {
  const params = new URLSearchParams(base);
  if (page > 1) params.set("page", String(page));
  else params.delete("page");
  const qs = params.toString();
  return `/schools${qs ? `?${qs}` : ""}`;
}

interface SchoolsResultsProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function SchoolsResults({ searchParams }: SchoolsResultsProps) {
  const sp = await searchParams;

  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const type = typeof sp.type === "string" ? sp.type : "";
  const sector = typeof sp.sector === "string" ? sp.sector : "";
  const state = typeof sp.state === "string" ? sp.state : "";
  const page = typeof sp.page === "string" ? Math.max(1, parseInt(sp.page, 10) || 1) : 1;

  const { schools, total } = await searchSchools({
    q: q || undefined,
    type: type || undefined,
    sector: sector || undefined,
    state: state || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const baseParams: Record<string, string> = {};
  if (q) baseParams.q = q;
  if (type) baseParams.type = type;
  if (sector) baseParams.sector = sector;
  if (state) baseParams.state = state;

  const hasFilters = !!(q || type || sector || state);

  return (
    <>
      {/* Filter bar */}
      <form method="GET" action="/schools" className="bg-surface-raised rounded-xl border border-line p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle pointer-events-none" aria-hidden="true" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search school name…"
              className={`w-full h-full pl-9 pr-3 ${FIELD} placeholder:text-ink-subtle`}
            />
          </div>

          <select
            name="type"
            defaultValue={type}
            className={`${FIELD} px-3 min-w-[140px]`}
          >
            <option value="">All Types</option>
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="combined">Combined</option>
            <option value="special">Special</option>
          </select>

          <select
            name="sector"
            defaultValue={sector}
            className={`${FIELD} px-3 min-w-[150px]`}
          >
            <option value="">All Sectors</option>
            <option value="government">Government</option>
            <option value="catholic">Catholic</option>
            <option value="independent">Independent</option>
          </select>

          <select
            name="state"
            defaultValue={state}
            className={`${FIELD} px-3 min-w-[130px]`}
          >
            <option value="">All States</option>
            {STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button
            type="submit"
            className={`${BUTTON_PRIMARY} justify-center whitespace-nowrap`}
          >
            Search
          </button>

          {hasFilters && (
            <Link
              href="/schools"
              className={`${BUTTON_SECONDARY} justify-center whitespace-nowrap`}
            >
              Clear
            </Link>
          )}
        </div>
      </form>

      <p className="text-sm text-ink-muted mb-4">
        {total === 0
          ? "No schools found"
          : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} of ${total.toLocaleString()} school${total !== 1 ? "s" : ""}`}
      </p>

      {schools.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {schools.map((school) => {
              const slug = school.acaraId ? makeSchoolSlug(school.name, school.acaraId) : null;
              const card = (
                <div className="bg-white rounded-xl border border-line p-4 h-full flex flex-col gap-3 hover:border-ink transition-colors">
                  <div className="flex items-start gap-2">
                    <GraduationCap className="w-4 h-4 text-ink-subtle mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span className="text-base font-semibold text-ink leading-snug line-clamp-2">
                      {school.name}
                    </span>
                  </div>

                  <p className="text-sm text-ink-muted">
                    {school.suburb.name}, {school.suburb.state} {school.suburb.postcode}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    <span className={TAG}>
                      {typeLabel(school.type)}
                    </span>
                    <span className={TAG}>
                      {sectorLabel(school.sector)}
                    </span>
                  </div>

                  {school.yearRange && (
                    <p className="text-sm text-ink-muted">
                      <span className="text-ink-subtle">Years:</span> {school.yearRange}
                    </p>
                  )}

                  {school.icsea != null && (
                    <p className="text-sm text-ink-muted">
                      <span className="text-ink-subtle">ICSEA:</span>{" "}
                      <span className="font-semibold text-ink">{school.icsea}</span>
                    </p>
                  )}
                </div>
              );

              return slug ? (
                <Link key={school.id} href={`/schools/${slug}`} className="block h-full">
                  {card}
                </Link>
              ) : (
                <div key={school.id} className="h-full">
                  {card}
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              {page > 1 ? (
                <Link
                  href={buildPageUrl(baseParams, page - 1)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-ink bg-white border border-line-strong rounded-lg hover:border-ink transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Link>
              ) : (
                <span className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-ink-subtle/60 bg-white border border-line rounded-lg cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </span>
              )}

              <span className="text-sm text-ink-muted">
                Page {page} of {totalPages.toLocaleString()}
              </span>

              {page < totalPages ? (
                <Link
                  href={buildPageUrl(baseParams, page + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-ink bg-white border border-line-strong rounded-lg hover:border-ink transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-ink-subtle/60 bg-white border border-line rounded-lg cursor-not-allowed">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-xl border border-line py-16 flex flex-col items-center text-center px-6">
          <GraduationCap className="w-12 h-12 text-ink-subtle mb-4" aria-hidden="true" />
          <h2 className="text-xl text-ink mb-2">No schools found</h2>
          <p className="text-base text-ink-muted max-w-xs mb-6">
            Try adjusting your search filters or clearing them to browse all schools.
          </p>
          <Link
            href="/schools"
            className={BUTTON_SECONDARY}
          >
            Clear filters
          </Link>
        </div>
      )}
    </>
  );
}
