import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { getRegionBySlug, getRegionSuburbs } from "@/lib/services/region-service";
import { getSchoolsByRegion, makeSchoolSlug } from "@/lib/services/school-service";
import { SITE_URL } from "@/lib/constants";

interface RegionSchoolsPageProps {
  params: Promise<{ slug: string }>;
}

function icseaColour(icsea: number | null): string {
  if (icsea == null) return "text-gray-500";
  if (icsea >= 1100) return "text-green-700 font-semibold";
  if (icsea >= 1000) return "text-gray-900";
  return "text-amber-600 font-semibold";
}

function typeLabel(type: string) {
  if (type === "primary") return "Primary";
  if (type === "secondary") return "Secondary";
  if (type === "combined") return "Combined";
  return "Special";
}

function sectorLabel(sector: string) {
  if (sector === "government") return "Government";
  if (sector === "catholic") return "Catholic";
  return "Independent";
}

export async function generateMetadata({ params }: RegionSchoolsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const region = await getRegionBySlug(slug);
  if (!region) return { title: "Region Not Found" };

  const title = `Schools in ${region.region}, ${region.state} | Ranked by ICSEA | Your Property Guide`;
  const description = `Browse the top schools in ${region.region}, ${region.state}. Compare ICSEA scores, school types, and nearby property prices across all suburbs.`;
  const canonical = `${SITE_URL}/regions/${slug}/schools`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { url: canonical, title, description, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RegionSchoolsPage({ params }: RegionSchoolsPageProps) {
  const { slug } = await params;

  const region = await getRegionBySlug(slug);
  if (!region) notFound();

  const suburbs = await getRegionSuburbs(region.region);
  const suburbSlugs = suburbs.map((s) => s.slug);

  const allSchools = await getSchoolsByRegion(suburbSlugs);

  // Top 50 by ICSEA (already sorted desc by service)
  const schools = allSchools.slice(0, 50);

  const totalCount = allSchools.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <BreadcrumbJsonLd
        items={[
          { name: "Regions", url: "/regions" },
          { name: region.region, url: `/regions/${slug}` },
          { name: "Schools", url: `/regions/${slug}/schools` },
        ]}
      />

      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs
            items={[
              { label: "Regions", href: "/regions" },
              { label: region.region, href: `/regions/${slug}` },
              { label: "Schools" },
            ]}
          />
          <div className="flex items-center gap-3 mt-2">
            <GraduationCap className="w-6 h-6 text-primary shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Schools in {region.region}, {region.state}
            </h1>
          </div>
          <p className="text-gray-500 mt-2 text-sm">
            {totalCount > 0 ? (
              <>
                Showing the top {schools.length} of{" "}
                <strong className="text-gray-700">{totalCount}</strong> schools in the{" "}
                {region.region} region, ranked by ICSEA score.
              </>
            ) : (
              <>No schools found in the {region.region} region yet.</>
            )}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
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
                      Suburb
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
                        key={school.id}
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
                        <td className="py-3 px-4">
                          <Link
                            href={`/suburbs/${school.suburb.slug}`}
                            className="text-gray-600 hover:text-primary transition-colors"
                          >
                            {school.suburb.name}
                          </Link>
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
                    key={school.id}
                    className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-gray-400 tabular-nums">#{i + 1}</span>
                        {schoolSlug ? (
                          <Link
                            href={`/schools/${schoolSlug}`}
                            className="font-semibold text-gray-900 hover:text-primary transition-colors block mt-0.5"
                          >
                            {school.name}
                          </Link>
                        ) : (
                          <span className="font-semibold text-gray-900 block mt-0.5">
                            {school.name}
                          </span>
                        )}
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <Link
                            href={`/suburbs/${school.suburb.slug}`}
                            className="text-xs text-primary hover:underline"
                          >
                            {school.suburb.name}
                          </Link>
                          <span className="text-xs text-gray-300">·</span>
                          <span className="text-xs text-gray-500">
                            {typeLabel(school.type)} · {sectorLabel(school.sector)}
                            {school.yearRange ? ` · ${school.yearRange}` : ""}
                          </span>
                        </div>
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
            <p className="text-gray-500">No school data available for {region.region} yet.</p>
          </div>
        )}

        {/* Suburb list CTA */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            Explore Suburbs in {region.region}
          </h2>
          <div className="flex flex-wrap gap-2">
            {suburbs.slice(0, 12).map((suburb) => (
              <Link
                key={suburb.slug}
                href={`/suburbs/${suburb.slug}/schools`}
                className="text-sm text-primary hover:underline border border-primary/20 bg-primary/5 rounded-lg px-3 py-1.5"
              >
                {suburb.name}
              </Link>
            ))}
            {suburbs.length > 12 && (
              <Link
                href={`/regions/${slug}`}
                className="text-sm text-gray-500 hover:text-primary border border-gray-200 bg-gray-50 rounded-lg px-3 py-1.5"
              >
                +{suburbs.length - 12} more →
              </Link>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-6 px-1">© ACARA, licensed under CC BY 4.0.</p>
      </div>
    </div>
  );
}
