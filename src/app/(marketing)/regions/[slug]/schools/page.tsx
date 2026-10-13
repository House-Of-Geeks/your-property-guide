import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo";
import { ExpertCTA, BUYING_GUIDE_CTA } from "@/components/journey";
import { getRegionBySlug, getRegionSuburbs } from "@/lib/services/region-service";
import { getSchoolsByRegion, makeSchoolSlug } from "@/lib/services/school-service";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Band, HeroLead, HeroTitle, PhotoHero, SectionHeading } from "@/components/premium";

interface RegionSchoolsPageProps {
  params: Promise<{ slug: string }>;
}

function icseaColour(icsea: number | null): string {
  if (icsea == null) return "text-ink-muted";
  if (icsea >= 1100) return "text-green-700 font-semibold";
  if (icsea >= 1000) return "text-ink";
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

  const title = `Schools in ${region.region}, ${region.state} | Ranked by ICSEA`;
  const description = `Browse the top schools in ${region.region}, ${region.state}. Compare ICSEA scores, school types, and nearby property prices across all suburbs.`;
  const canonical = `${SITE_URL}/regions/${slug}/schools`;

  return {
    title,
    description,
    alternates: { canonical },
    // og titles don't get the root title.template — brand them explicitly
    openGraph: { url: canonical, title: `${title} | ${SITE_NAME}`, description, type: "website" },
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
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Regions", url: "/regions" },
          { name: region.region, url: `/regions/${slug}` },
          { name: "Schools", url: `/regions/${slug}/schools` },
        ]}
      />

      {/* Hero: a reference list, so plain charcoal. */}
      <PhotoHero
        breadcrumbs={[
          { label: "Regions", href: "/regions" },
          { label: region.region, href: `/regions/${slug}` },
          { label: "Schools" },
        ]}
      >
        <GraduationCap className="w-8 h-8 text-primary mb-5" strokeWidth={1.75} aria-hidden="true" />
        <HeroTitle>
          Schools in {region.region}, {region.state}
        </HeroTitle>
        <HeroLead>
          {totalCount > 0 ? (
            <>
              Showing the top {schools.length} of{" "}
              <strong className="font-semibold text-ink">{totalCount}</strong> schools in the{" "}
              {region.region} region, ranked by ICSEA score.
            </>
          ) : (
            <>No schools found in the {region.region} region yet.</>
          )}
        </HeroLead>
      </PhotoHero>

      <Band spacing="compact">
        {schools.length > 0 ? (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block bg-surface-raised rounded-xl border border-line overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-warm border-b border-line">
                    <th className="py-3 px-4 text-left text-[13px] font-semibold text-ink-muted w-10">
                      #
                    </th>
                    <th className="py-3 px-4 text-left text-[13px] font-semibold text-ink-muted">
                      School
                    </th>
                    <th className="py-3 px-4 text-left text-[13px] font-semibold text-ink-muted">
                      Suburb
                    </th>
                    <th className="py-3 px-4 text-left text-[13px] font-semibold text-ink-muted">
                      Type
                    </th>
                    <th className="py-3 px-4 text-left text-[13px] font-semibold text-ink-muted">
                      Sector
                    </th>
                    <th className="py-3 px-4 text-left text-[13px] font-semibold text-ink-muted">
                      Years
                    </th>
                    <th className="py-3 px-4 text-right text-[13px] font-semibold text-ink-muted">
                      ICSEA
                    </th>
                    <th className="py-3 px-4 text-right text-[13px] font-semibold text-ink-muted">
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
                        className="border-b border-line last:border-0 hover:bg-surface-warm transition-colors"
                      >
                        <td className="py-3 px-4 text-ink-subtle">{i + 1}</td>
                        <td className="py-3 px-4">
                          {schoolSlug ? (
                            <Link
                              href={`/schools/${schoolSlug}`}
                              className="font-medium text-ink hover:text-primary transition-colors"
                            >
                              {school.name}
                            </Link>
                          ) : (
                            <span className="font-medium text-ink">{school.name}</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Link
                            href={`/suburbs/${school.suburb.slug}`}
                            className="text-ink-muted hover:text-primary transition-colors"
                          >
                            {school.suburb.name}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-ink-muted">{typeLabel(school.type)}</td>
                        <td className="py-3 px-4 text-ink-muted">{sectorLabel(school.sector)}</td>
                        <td className="py-3 px-4 text-ink-muted">{school.yearRange ?? "–"}</td>
                        <td className={`py-3 px-4 text-right ${icseaColour(school.icsea)}`}>
                          {school.icsea?.toLocaleString() ?? "–"}
                        </td>
                        <td className="py-3 px-4 text-right text-ink-muted">
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
                    className="bg-surface-raised rounded-xl border border-line p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-ink-subtle">#{i + 1}</span>
                        {schoolSlug ? (
                          <Link
                            href={`/schools/${schoolSlug}`}
                            className="font-semibold text-ink hover:text-primary transition-colors block mt-0.5"
                          >
                            {school.name}
                          </Link>
                        ) : (
                          <span className="font-semibold text-ink block mt-0.5">
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
                          <span className="text-xs text-ink-subtle">·</span>
                          <span className="text-xs text-ink-muted">
                            {typeLabel(school.type)} · {sectorLabel(school.sector)}
                            {school.yearRange ? ` · ${school.yearRange}` : ""}
                          </span>
                        </div>
                      </div>
                      {school.icsea != null && (
                        <div className="text-right shrink-0">
                          <p className="text-xs text-ink-subtle">ICSEA</p>
                          <p className={`text-base ${icseaColour(school.icsea)}`}>
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
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-ink-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-green-100 border border-green-300 inline-block" />
                ICSEA ≥ 1100 (above average)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-gray-100 border border-gray-300 inline-block" />
                ICSEA 1000–1099 (average)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-100 border border-amber-300 inline-block" />
                ICSEA &lt; 1000 (below average)
              </span>
            </div>
          </>
        ) : (
          <div className="bg-surface-raised rounded-xl border border-line p-10 text-center">
            <GraduationCap className="w-10 h-10 text-ink-subtle mx-auto mb-3" />
            <p className="text-ink-muted">No school data available for {region.region} yet.</p>
          </div>
        )}
      </Band>

      {/* Suburb list CTA */}
      <Band tone="quiet" spacing="compact">
        <SectionHeading size="md" title={<>Explore Suburbs in {region.region}</>} />
        <div className="mt-8 flex flex-wrap gap-2">
          {suburbs.slice(0, 12).map((suburb) => (
            <Link
              key={suburb.slug}
              href={`/suburbs/${suburb.slug}/schools`}
              className="inline-flex items-center rounded-lg border border-line bg-surface-raised px-3 py-1.5 text-sm font-medium text-ink hover:border-ink transition-colors"
            >
              {suburb.name}
            </Link>
          ))}
          {suburbs.length > 12 && (
            <Link
              href={`/regions/${slug}`}
              className="inline-flex items-center rounded-lg border border-line bg-surface-raised px-3 py-1.5 text-sm text-ink-muted hover:border-ink hover:text-ink transition-colors"
            >
              +{suburbs.length - 12} more →
            </Link>
          )}
        </div>

        <p className="text-xs text-ink-subtle mt-10">© ACARA, licensed under CC BY 4.0.</p>
      </Band>

      {/* Funnel exit: families researching schools by region are buyers
          mid-shortlist — this template had no path to a lead form. */}
      <ExpertCTA {...BUYING_GUIDE_CTA} />
    </>
  );
}
