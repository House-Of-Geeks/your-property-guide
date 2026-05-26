import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GraduationCap, ArrowRight } from "lucide-react";
import { SuburbSubrouteHeader } from "@/components/suburb";
import { BreadcrumbJsonLd, PlaceJsonLd, ItemListJsonLd } from "@/components/seo";
import { getSuburbBySlug } from "@/lib/services/suburb-service";
import { makeSchoolSlug } from "@/lib/utils/school";
import { formatPriceFull } from "@/lib/utils/format";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import type { School } from "@/types";

interface SuburbSchoolsPageProps {
  params: Promise<{ slug: string }>;
}

// 7d ISR. See /suburbs/[slug]/page.tsx.
export const revalidate = 604800;
export const dynamicParams = true;
export function generateStaticParams() { return []; }

function icseaColour(icsea: number | null): string {
  if (icsea == null) return "text-ink-subtle";
  if (icsea >= 1100) return "text-success font-semibold";
  if (icsea >= 1000) return "text-ink";
  return "text-warning font-semibold";
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
  const title = `Schools in ${suburb.name}, ${suburb.state} | Ranked by ICSEA | ${SITE_NAME}`;
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

  const schools = [...suburb.schools].sort((a, b) => {
    if (a.icsea == null && b.icsea == null) return 0;
    if (a.icsea == null) return 1;
    if (b.icsea == null) return -1;
    return b.icsea - a.icsea;
  });

  const icseaValues = schools.map((s) => s.icsea).filter((v): v is number => v != null);
  const lowestIcsea = icseaValues.length > 0 ? Math.min(...icseaValues) : null;
  const highestIcsea = icseaValues.length > 0 ? Math.max(...icseaValues) : null;

  const subtitle = schools.length > 0 ? (
    <>
      There {schools.length === 1 ? "is" : "are"}{" "}
      <strong className="text-ink">{schools.length}</strong>{" "}
      school{schools.length !== 1 ? "s" : ""} in {suburb.name}
      {lowestIcsea != null && highestIcsea != null && lowestIcsea !== highestIcsea && (
        <>, ranging from ICSEA {lowestIcsea.toLocaleString()} to {highestIcsea.toLocaleString()}</>
      )}
      {lowestIcsea != null && highestIcsea != null && lowestIcsea === highestIcsea && (
        <> with an ICSEA score of {highestIcsea.toLocaleString()}</>
      )}
      .
    </>
  ) : (
    `No schools found near ${suburb.name}.`
  );

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Suburbs", url: "/suburbs" },
          { name: suburb.name, url: `/suburbs/${slug}` },
          { name: "Schools", url: `/suburbs/${slug}/schools` },
        ]}
      />
      <PlaceJsonLd
        name={suburb.name}
        url={`/suburbs/${suburb.slug}`}
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
            url: school.acaraId
              ? `/schools/${makeSchoolSlug(school.name, school.acaraId)}`
              : `/suburbs/${slug}/schools`,
          }))}
        />
      )}

      <SuburbSubrouteHeader
        suburb={suburb}
        eyebrow="Schools in"
        title={
          <>
            <span className="italic text-primary">{schools.length}</span>{" "}
            school{schools.length !== 1 ? "s" : ""} in {suburb.name}.
          </>
        }
        subtitle={subtitle}
        breadcrumbLeaf="Schools"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {schools.length > 0 ? (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block rounded-2xl border border-line bg-surface-raised overflow-hidden shadow-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-warm border-b border-line-warm">
                    <th className="py-4 px-5 text-left text-xs font-sans font-semibold text-ink-subtle uppercase tracking-wider w-10">#</th>
                    <th className="py-4 px-5 text-left text-xs font-sans font-semibold text-ink-subtle uppercase tracking-wider">School</th>
                    <th className="py-4 px-5 text-left text-xs font-sans font-semibold text-ink-subtle uppercase tracking-wider">Type</th>
                    <th className="py-4 px-5 text-left text-xs font-sans font-semibold text-ink-subtle uppercase tracking-wider">Sector</th>
                    <th className="py-4 px-5 text-left text-xs font-sans font-semibold text-ink-subtle uppercase tracking-wider">Years</th>
                    <th className="py-4 px-5 text-right text-xs font-sans font-semibold text-ink-subtle uppercase tracking-wider">ICSEA</th>
                    <th className="py-4 px-5 text-right text-xs font-sans font-semibold text-ink-subtle uppercase tracking-wider">Enrolment</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.map((school, i) => {
                    const schoolSlug = school.acaraId
                      ? makeSchoolSlug(school.name, school.acaraId)
                      : null;
                    return (
                      <tr
                        key={school.name}
                        className="border-b border-line last:border-0 hover:bg-surface-sunken transition-colors"
                      >
                        <td className="py-4 px-5 text-ink-subtle tabular-nums font-display italic">
                          {i + 1}
                        </td>
                        <td className="py-4 px-5">
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
                        <td className="py-4 px-5 text-ink-muted">{typeLabel(school.type)}</td>
                        <td className="py-4 px-5 text-ink-muted">{sectorLabel(school.sector)}</td>
                        <td className="py-4 px-5 text-ink-subtle">{school.yearRange ?? "–"}</td>
                        <td className={`py-4 px-5 text-right tabular-nums ${icseaColour(school.icsea)}`}>
                          {school.icsea?.toLocaleString() ?? "–"}
                        </td>
                        <td className="py-4 px-5 text-right tabular-nums text-ink-muted">
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
                const schoolSlug = school.acaraId
                  ? makeSchoolSlug(school.name, school.acaraId)
                  : null;
                return (
                  <div
                    key={school.name}
                    className="rounded-xl border border-line bg-surface-raised p-5 shadow-card"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-display italic text-cta tabular-nums mb-1">#{i + 1}</p>
                        {schoolSlug ? (
                          <Link
                            href={`/schools/${schoolSlug}`}
                            className="font-medium text-ink hover:text-primary transition-colors block"
                          >
                            {school.name}
                          </Link>
                        ) : (
                          <span className="font-medium text-ink block">{school.name}</span>
                        )}
                        <p className="text-xs text-ink-muted mt-1">
                          {typeLabel(school.type)} · {sectorLabel(school.sector)}
                          {school.yearRange ? ` · ${school.yearRange}` : ""}
                        </p>
                      </div>
                      {school.icsea != null && (
                        <div className="text-right shrink-0">
                          <p className="text-xs text-ink-subtle">ICSEA</p>
                          <p className={`font-display text-2xl tabular-nums leading-none ${icseaColour(school.icsea)}`}>
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
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink-muted font-sans">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-success inline-block" />
                ICSEA ≥ 1100 (above average)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-ink-subtle inline-block" />
                ICSEA 1000 to 1099 (average)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-warning inline-block" />
                ICSEA below 1000 (below average)
              </span>
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-line bg-surface-raised p-12 text-center">
            <GraduationCap className="w-10 h-10 text-ink-subtle mx-auto mb-3" />
            <p className="text-ink-muted">No school data available for {suburb.name} yet.</p>
          </div>
        )}

        {/* Property CTA, soft */}
        <div className="mt-12 rounded-2xl border border-line-warm bg-surface-warm p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mb-2">
              Nearby properties
            </p>
            <h2 className="font-display text-xl sm:text-2xl text-ink leading-tight">
              Family-friendly homes in {suburb.name}.
            </h2>
            <p className="font-sans text-sm text-ink-muted mt-2">
              {suburb.stats.medianHousePrice > 0
                ? `Median house price ${formatPriceFull(suburb.stats.medianHousePrice)}.`
                : "Browse current listings."}
            </p>
          </div>
          <Link
            href={`/suburbs/${slug}/buy`}
            className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-line-strong bg-surface-raised text-ink hover:border-ink hover:bg-surface-raised font-medium px-5 py-2.5 transition-colors"
          >
            View properties <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="text-xs text-ink-subtle mt-6 px-1">
          School data licensed from ACARA under CC BY 4.0.
        </p>
      </div>
    </>
  );
}
