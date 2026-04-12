import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { searchSchools } from "@/lib/services/school-service";
import { makeSchoolSlug } from "@/lib/utils/school";
import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

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

function typeBadgeClass(type: string): string {
  if (type === "primary") return "bg-blue-100 text-blue-700";
  if (type === "secondary") return "bg-purple-100 text-purple-700";
  if (type === "combined") return "bg-teal-100 text-teal-700";
  return "bg-gray-100 text-gray-600";
}

function sectorBadgeClass(sector: string): string {
  if (sector === "government") return "bg-green-100 text-green-700";
  if (sector === "catholic") return "bg-amber-100 text-amber-700";
  return "bg-orange-100 text-orange-700";
}

function buildPageUrl(
  base: Record<string, string>,
  page: number,
): string {
  const params = new URLSearchParams(base);
  if (page > 1) params.set("page", String(page));
  else params.delete("page");
  const qs = params.toString();
  return `/schools${qs ? `?${qs}` : ""}`;
}

interface SchoolsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: SchoolsPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const state = typeof sp.state === "string" ? sp.state : undefined;
  const type = typeof sp.type === "string" ? sp.type : undefined;
  const sector = typeof sp.sector === "string" ? sp.sector : undefined;

  const parts: string[] = [];
  if (q) parts.push(`"${q}"`);
  if (type) parts.push(typeLabel(type));
  if (sector) parts.push(sectorLabel(sector));
  if (state) parts.push(state);

  const title = parts.length
    ? `${parts.join(" ")} Schools | Your Property Guide`
    : "Find a School | Browse 9,600+ Australian Schools | Your Property Guide";

  const description = parts.length
    ? `Browse ${parts.join(", ")} schools across Australia. View catchment locations and nearby properties.`
    : "Browse 9,600+ schools across Australia. Filter by type, sector, and state. Click any school to view its catchment area and nearby properties.";

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/schools` },
    openGraph: { url: `${SITE_URL}/schools`, title, description, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function SchoolsPage({ searchParams }: SchoolsPageProps) {
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

  // Build a base params map (without page) for pagination links
  const baseParams: Record<string, string> = {};
  if (q) baseParams.q = q;
  if (type) baseParams.type = type;
  if (sector) baseParams.sector = sector;
  if (state) baseParams.state = state;

  const hasFilters = !!(q || type || sector || state);

  return (
    <div className="min-h-screen bg-gray-50">
      <CollectionPageJsonLd
        name="Australian Schools"
        description="Search and explore Australian schools with enrolment data and catchment information."
        url="/schools"
      />
      <BreadcrumbJsonLd items={[{ name: "Schools", url: "/schools" }]} />
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">Find a School</h1>
          </div>
          <p className="text-gray-500 text-base max-w-2xl">
            Browse 9,600+ schools across Australia. Click any school to view its catchment location
            and nearby properties.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter bar */}
        <form method="GET" action="/schools" className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Name search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search school name…"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>

            {/* Type */}
            <select
              name="type"
              defaultValue={type}
              className="py-2.5 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white min-w-[140px]"
            >
              <option value="">All Types</option>
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="combined">Combined</option>
              <option value="special">Special</option>
            </select>

            {/* Sector */}
            <select
              name="sector"
              defaultValue={sector}
              className="py-2.5 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white min-w-[150px]"
            >
              <option value="">All Sectors</option>
              <option value="government">Government</option>
              <option value="catholic">Catholic</option>
              <option value="independent">Independent</option>
            </select>

            {/* State */}
            <select
              name="state"
              defaultValue={state}
              className="py-2.5 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white min-w-[130px]"
            >
              <option value="">All States</option>
              {STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <button
              type="submit"
              className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              Search
            </button>

            {hasFilters && (
              <Link
                href="/schools"
                className="px-4 py-2.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap flex items-center"
              >
                Clear
              </Link>
            )}
          </div>
        </form>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4">
          {total === 0
            ? "No schools found"
            : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} of ${total.toLocaleString()} school${total !== 1 ? "s" : ""}`}
        </p>

        {/* Results grid */}
        {schools.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {schools.map((school) => {
                const slug = school.acaraId ? makeSchoolSlug(school.name, school.acaraId) : null;
                const card = (
                  <div className="bg-white rounded-xl border border-gray-200 p-4 h-full flex flex-col gap-3 hover:shadow-md hover:border-gray-300 transition-all">
                    <div className="flex items-start gap-2">
                      <GraduationCap className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                        {school.name}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500">
                      {school.suburb.name}, {school.suburb.state} {school.suburb.postcode}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${typeBadgeClass(school.type)}`}>
                        {typeLabel(school.type)}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${sectorBadgeClass(school.sector)}`}>
                        {sectorLabel(school.sector)}
                      </span>
                    </div>

                    {school.yearRange && (
                      <p className="text-xs text-gray-500">
                        <span className="text-gray-400">Years:</span> {school.yearRange}
                      </p>
                    )}

                    {school.icsea != null && (
                      <p className="text-xs text-gray-500">
                        <span className="text-gray-400">ICSEA:</span>{" "}
                        <span className="font-medium text-gray-700">{school.icsea}</span>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3">
                {page > 1 ? (
                  <Link
                    href={buildPageUrl(baseParams, page - 1)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Link>
                ) : (
                  <span className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-300 bg-white border border-gray-200 rounded-lg cursor-not-allowed">
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </span>
                )}

                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages.toLocaleString()}
                </span>

                {page < totalPages ? (
                  <Link
                    href={buildPageUrl(baseParams, page + 1)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <span className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-300 bg-white border border-gray-200 rounded-lg cursor-not-allowed">
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </span>
                )}
              </div>
            )}
          </>
        ) : (
          /* Empty state */
          <div className="bg-white rounded-xl border border-gray-200 py-16 flex flex-col items-center text-center px-6">
            <GraduationCap className="w-12 h-12 text-gray-300 mb-4" />
            <h2 className="text-lg font-semibold text-gray-700 mb-1">No schools found</h2>
            <p className="text-sm text-gray-500 max-w-xs mb-5">
              Try adjusting your search filters or clearing them to browse all schools.
            </p>
            <Link
              href="/schools"
              className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
            >
              Clear filters
            </Link>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-10 text-center">
          School data sourced from ACARA, licensed under CC BY 4.0.
        </p>
      </div>
    </div>
  );
}
