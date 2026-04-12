import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, PlaceJsonLd, ItemListJsonLd } from "@/components/seo";
import { getSuburbBySlug } from "@/lib/services/suburb-service";
import { makeSchoolSlug } from "@/lib/utils/school";
import { formatPriceFull } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";
import type { School } from "@/types";

interface SuburbSchoolsPageProps {
  params: Promise<{ slug: string }>;
}

function icseaColour(icsea: number | null): string {
  if (icsea == null) return "text-gray-500";
  if (icsea >= 1100) return "text-green-700 font-semibold";
  if (icsea >= 1000) return "text-gray-900";
  return "text-amber-600 font-semibold";
}

function typeLabel(type: School["type"]) {
  if (type === "primary") return "Primary";
  if (type === "secondary") return "Secondary";
  if (type === "combined") return "Combined";
  return "Special";
}

function sectorLabel(sector: School["sector"]) {
  if (sector === "government") return "Government";
  if (sector === "catholic") return "Catholic";
  return "Independent";
}

export async function generateMetadata({ params }: SuburbSchoolsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const suburb = await getSuburbBySlug(slug);
  if (!suburb) return { title: "Suburb Not Found" };

  const schools = suburb.schools;
  const title = `Schools in ${suburb.name}, ${suburb.state} | Ranked by ICSEA | Your Property Guide`;
  const description = `Browse all ${schools.length} schools in ${suburb.name}. Compare ICSEA scores, school types, and nearby property prices.`;
  const canonical = `${SITE_URL}/suburbs/${slug}/schools`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { url: canonical, title, description, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function SuburbSchoolsPage({ params }: SuburbSchoolsPageProps) {
  const { slug } = await params;
  const suburb = await getSuburbBySlug(slug);
  if (!suburb) notFound();

  // Sort by ICSEA descending, nulls last
  const schools = [...suburb.schools].sort((a, b) => {
    if (a.icsea == null && b.icsea == null) return 0;
    if (a.icsea == null) return 1;
    if (b.icsea == null) return -1;
    return b.icsea - a.icsea;
  });

  const icseaValues = schools.map((s) => s.icsea).filter((v): v is number => v != null);
  const lowestIcsea = icseaValues.length > 0 ? Math.min(...icseaValues) : null;
  const highestIcsea = icseaValues.length > 0 ? Math.max(...icseaValues) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <BreadcrumbJsonLd
        items={[
          { name: "Suburbs", url: "/suburbs" },
          { name: suburb.name, url: `/suburbs/${slug}` },
          { name: "Schools", url: `/suburbs/${slug}/schools` },
        ]}
      />
      <PlaceJsonLd
        name={suburb.name}
        url={"/suburbs/" + suburb.slug}
        addressLocality={suburb.name}
        addressRegion={suburb.state}
        postalCode={suburb.postcode}

      />
      {schools.length > 0 && (
        <ItemListJsonLd
          name={`Schools in ${suburb.name}, ${suburb.state}`}
          description={`${schools.length} school${schools.length !== 1 ? "s" : ""} in ${suburb.name}`}
          url={`/suburbs/${slug}/schools`}
          items={schools.map((school) => ({
            name: school.name,
            url: school.acaraId ? `/schools/${makeSchoolSlug(school.name, school.acaraId)}` : `/suburbs/${slug}/schools`,
          }))}
        />
      )}

      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs
            items={[
              { label: "Suburbs", href: "/suburbs" },
              { label: suburb.name, href: `/suburbs/${slug}` },
              { label: "Schools" },
            ]}
          />
          <div className="flex items-center gap-3 mt-2">
            <GraduationCap className="w-6 h-6 text-primary shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Schools in {suburb.name}, {suburb.state}
            </h1>
          </div>

          {schools.length > 0 ? (
            <p className="text-gray-500 mt-2 text-sm">
              There {schools.length === 1 ? "is" : "are"}{" "}
              <strong className="text-gray-700">{schools.length}</strong>{" "}
              school{schools.length !== 1 ? "s" : ""} in {suburb.name}
              {lowestIcsea != null && highestIcsea != null && lowestIcsea !== highestIcsea && (
                <> ranging from ICSEA&nbsp;{lowestIcsea.toLocaleString()} to {highestIcsea.toLocaleString()}</>
              )}
              {lowestIcsea != null && highestIcsea != null && lowestIcsea === highestIcsea && (
                <> with an ICSEA score of {highestIcsea.toLocaleString()}</>
              )}
              .
            </p>
          ) : (
            <p className="text-gray-500 mt-2 text-sm">No schools found near {suburb.name}.</p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        {schools.length > 0 ? (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-10">
                      #
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      School
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Type
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Sector
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Years
                    </th>
                    <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      ICSEA
                    </th>
                    <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Enrolment
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {schools.map((school, i) => {
                    const schoolSlug =
                      school.acaraId ? makeSchoolSlug(school.name, school.acaraId) : null;
                    return (
                      <tr
                        key={school.name}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4 text-gray-400 tabular-nums">{i + 1}</td>
                        <td className="py-3 px-4">
                          {schoolSlug ? (
                            <Link
                              href={`/schools/${schoolSlug}`}
                              className="font-medium text-gray-900 hover:text-primary transition-colors"
                            >
                              {school.name}
                            </Link>
                          ) : (
                            <span className="font-medium text-gray-900">{school.name}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-600">{typeLabel(school.type)}</td>
                        <td className="py-3 px-4 text-gray-600">{sectorLabel(school.sector)}</td>
                        <td className="py-3 px-4 text-gray-500">{school.yearRange ?? "–"}</td>
                        <td className={`py-3 px-4 text-right tabular-nums ${icseaColour(school.icsea)}`}>
                          {school.icsea?.toLocaleString() ?? "–"}
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums text-gray-700">
                          {school.enrolment?.toLocaleString() ?? "–"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden space-y-3">
              {schools.map((school, i) => {
                const schoolSlug =
                  school.acaraId ? makeSchoolSlug(school.name, school.acaraId) : null;
                return (
                  <div
                    key={school.name}
                    className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-xs text-gray-400 tabular-nums">#{i + 1}</span>
                        </div>
                        {schoolSlug ? (
                          <Link
                            href={`/schools/${schoolSlug}`}
                            className="font-semibold text-gray-900 hover:text-primary transition-colors block"
                          >
                            {school.name}
                          </Link>
                        ) : (
                          <span className="font-semibold text-gray-900 block">{school.name}</span>
                        )}
                        <p className="text-xs text-gray-500 mt-0.5">
                          {typeLabel(school.type)} · {sectorLabel(school.sector)}
                          {school.yearRange ? ` · ${school.yearRange}` : ""}
                        </p>
                      </div>
                      {school.icsea != null && (
                        <div className="text-right shrink-0">
                          <p className="text-xs text-gray-400">ICSEA</p>
                          <p className={`text-base tabular-nums ${icseaColour(school.icsea)}`}>
                            {school.icsea.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ICSEA legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-green-100 border border-green-300 inline-block" />
                ICSEA ≥ 1100 (above average)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-gray-100 border border-gray-300 inline-block" />
                ICSEA 1000–1099 (average)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-100 border border-amber-300 inline-block" />
                ICSEA &lt; 1000 (below average)
              </span>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <GraduationCap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No school data available for {suburb.name} yet.</p>
          </div>
        )}

        {/* Property CTA */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Nearby Properties for Families
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Browse homes for sale in {suburb.name}
              {suburb.stats.medianHousePrice > 0
                ? ` — median house price ${formatPriceFull(suburb.stats.medianHousePrice)}`
                : ""}
              .
            </p>
          </div>
          <Link
            href={`/suburbs/${slug}/buy`}
            className="shrink-0 inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold rounded-lg px-5 py-2.5 hover:bg-primary/90 transition-colors"
          >
            View Properties →
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-6 px-1">© ACARA, licensed under CC BY 4.0.</p>
      </div>
    </div>
  );
}
