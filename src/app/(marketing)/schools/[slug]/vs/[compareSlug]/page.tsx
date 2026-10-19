import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { getSchoolBySlug } from "@/lib/services/school-service";
import { BreadcrumbJsonLd, EducationalOrganizationJsonLd } from "@/components/seo";
import { ExpertCTA, BUYING_GUIDE_CTA } from "@/components/journey";
import { formatPriceFull } from "@/lib/utils/format";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { BUTTON_PRIMARY, BUTTON_SECONDARY, Band, HeroLead, HeroTitle, PhotoHero } from "@/components/premium";

interface SchoolVsPageProps {
  params: Promise<{ slug: string; compareSlug: string }>;
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

function genderLabel(gender: string | null) {
  if (!gender || gender === "coed") return "Co-ed";
  if (gender === "girls") return "Girls";
  return "Boys";
}

export async function generateMetadata({ params }: SchoolVsPageProps): Promise<Metadata> {
  const { slug, compareSlug } = await params;
  const [schoolA, schoolB] = await Promise.all([
    getSchoolBySlug(slug),
    getSchoolBySlug(compareSlug),
  ]);
  if (!schoolA || !schoolB) return { title: "School Not Found" };

  const title = `${schoolA.name} vs ${schoolB.name} | School Comparison`;
  const description = `Compare ${schoolA.name} and ${schoolB.name}, ICSEA scores, enrolment, demographics, and nearby property prices.`;
  const canonical = `${SITE_URL}/schools/${slug}/vs/${compareSlug}`;

  return {
    title,
    description,
    alternates: { canonical },
    // og titles don't get the root title.template — brand them explicitly
    openGraph: { ...DEFAULT_OG, url: canonical, title: `${title} | ${SITE_NAME}`, description, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

type School = NonNullable<Awaited<ReturnType<typeof getSchoolBySlug>>>;

interface CompareRowProps {
  label: string;
  valueA: string;
  valueB: string;
  winner?: "A" | "B" | null;
}

function CompareRow({ label, valueA, valueB, winner }: CompareRowProps) {
  return (
    <tr className="border-b border-line last:border-0">
      <td className="py-3 px-4 text-sm text-ink-muted font-medium">{label}</td>
      <td
        className={`py-3 px-4 text-sm font-semibold text-center ${
          winner === "A" ? "text-green-700 bg-green-50" : "text-ink"
        }`}
      >
        {valueA}
      </td>
      <td
        className={`py-3 px-4 text-sm font-semibold text-center ${
          winner === "B" ? "text-green-700 bg-green-50" : "text-ink"
        }`}
      >
        {valueB}
      </td>
    </tr>
  );
}

function buildRows(schoolA: School, schoolB: School): CompareRowProps[] {
  const rows: CompareRowProps[] = [];

  rows.push({
    label: "Location",
    valueA: `${schoolA.suburb.name}, ${schoolA.suburb.state}`,
    valueB: `${schoolB.suburb.name}, ${schoolB.suburb.state}`,
    winner: null,
  });

  rows.push({
    label: "Type",
    valueA: typeLabel(schoolA.type),
    valueB: typeLabel(schoolB.type),
    winner: null,
  });

  rows.push({
    label: "Sector",
    valueA: sectorLabel(schoolA.sector),
    valueB: sectorLabel(schoolB.sector),
    winner: null,
  });

  rows.push({
    label: "Year Range",
    valueA: schoolA.yearRange ?? "–",
    valueB: schoolB.yearRange ?? "–",
    winner: null,
  });

  rows.push({
    label: "Gender",
    valueA: genderLabel(schoolA.gender),
    valueB: genderLabel(schoolB.gender),
    winner: null,
  });

  // ICSEA score, higher is better
  let icseaWinner: "A" | "B" | null = null;
  if (schoolA.icsea != null && schoolB.icsea != null) {
    if (schoolA.icsea > schoolB.icsea) icseaWinner = "A";
    else if (schoolB.icsea > schoolA.icsea) icseaWinner = "B";
  }
  rows.push({
    label: "ICSEA Score",
    valueA: schoolA.icsea?.toLocaleString() ?? "–",
    valueB: schoolB.icsea?.toLocaleString() ?? "–",
    winner: icseaWinner,
  });

  rows.push({
    label: "Total Enrolment",
    valueA: schoolA.enrolment?.toLocaleString() ?? "–",
    valueB: schoolB.enrolment?.toLocaleString() ?? "–",
    winner: null,
  });

  rows.push({
    label: "Boys Enrolment",
    valueA: schoolA.boysEnrolment?.toLocaleString() ?? "–",
    valueB: schoolB.boysEnrolment?.toLocaleString() ?? "–",
    winner: null,
  });

  rows.push({
    label: "Girls Enrolment",
    valueA: schoolA.girlsEnrolment?.toLocaleString() ?? "–",
    valueB: schoolB.girlsEnrolment?.toLocaleString() ?? "–",
    winner: null,
  });

  rows.push({
    label: "Indigenous Students",
    valueA: schoolA.indigenousPct != null ? `${schoolA.indigenousPct}%` : "–",
    valueB: schoolB.indigenousPct != null ? `${schoolB.indigenousPct}%` : "–",
    winner: null,
  });

  rows.push({
    label: "Language Background Other Than English",
    valueA: schoolA.lbotePct != null ? `${schoolA.lbotePct}%` : "–",
    valueB: schoolB.lbotePct != null ? `${schoolB.lbotePct}%` : "–",
    winner: null,
  });

  rows.push({
    label: "Teaching Staff",
    valueA: schoolA.teachingStaff?.toLocaleString() ?? "–",
    valueB: schoolB.teachingStaff?.toLocaleString() ?? "–",
    winner: null,
  });

  // Student:teacher ratio, lower is better but we just display, no winner
  const ratioA =
    schoolA.enrolment != null && schoolA.teachingStaff != null && schoolA.teachingStaff > 0
      ? (schoolA.enrolment / schoolA.teachingStaff).toFixed(1)
      : null;
  const ratioB =
    schoolB.enrolment != null && schoolB.teachingStaff != null && schoolB.teachingStaff > 0
      ? (schoolB.enrolment / schoolB.teachingStaff).toFixed(1)
      : null;
  rows.push({
    label: "Student:Teacher Ratio",
    valueA: ratioA ? `${ratioA}:1` : "–",
    valueB: ratioB ? `${ratioB}:1` : "–",
    winner: null,
  });

  // Suburb median house price
  rows.push({
    label: "Suburb Median House Price",
    valueA:
      schoolA.suburb.medianHousePrice > 0
        ? formatPriceFull(schoolA.suburb.medianHousePrice)
        : "–",
    valueB:
      schoolB.suburb.medianHousePrice > 0
        ? formatPriceFull(schoolB.suburb.medianHousePrice)
        : "–",
    winner: null,
  });

  return rows;
}

export default async function SchoolVsPage({ params }: SchoolVsPageProps) {
  const { slug, compareSlug } = await params;

  const [schoolA, schoolB] = await Promise.all([
    getSchoolBySlug(slug),
    getSchoolBySlug(compareSlug),
  ]);

  if (!schoolA || !schoolB) notFound();

  const rows = buildRows(schoolA, schoolB);

  const icseaWinner =
    schoolA.icsea != null && schoolB.icsea != null
      ? schoolA.icsea > schoolB.icsea
        ? "A"
        : schoolB.icsea > schoolA.icsea
          ? "B"
          : null
      : null;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Schools", url: "/schools" },
          { name: schoolA.name, url: `/schools/${slug}` },
          { name: `vs ${schoolB.name}`, url: `/schools/${slug}/vs/${compareSlug}` },
        ]}
      />
      {/* EducationalOrganization nodes for both schools, pointing at each
          school's own profile URL so this comparison joins to the same
          entities Google already knows from /schools/[slug]. */}
      <EducationalOrganizationJsonLd
        name={schoolA.name}
        url={"/schools/" + slug}
        address={{ suburb: schoolA.suburb.name, state: schoolA.suburb.state, postcode: schoolA.suburb.postcode }}
        educationalLevel={typeLabel(schoolA.type)}
        website={schoolA.website ?? undefined}
      />
      <EducationalOrganizationJsonLd
        name={schoolB.name}
        url={"/schools/" + compareSlug}
        address={{ suburb: schoolB.suburb.name, state: schoolB.suburb.state, postcode: schoolB.suburb.postcode }}
        educationalLevel={typeLabel(schoolB.type)}
        website={schoolB.website ?? undefined}
      />

      {/* Hero: a reference page, so plain charcoal. */}
      <PhotoHero
        breadcrumbs={[
          { label: "Schools", href: "/schools" },
          { label: schoolA.name, href: `/schools/${slug}` },
          { label: `vs ${schoolB.name}` },
        ]}
      >
        <p className="flex items-center gap-2 text-sm text-ink-muted mb-5">
          <GraduationCap className="w-4 h-4" aria-hidden="true" />
          School Comparison
        </p>
        <HeroTitle>
          {schoolA.name}{" "}
          <span className="text-ink-subtle">vs</span>{" "}
          {schoolB.name}
        </HeroTitle>
        <HeroLead>
          Compare ICSEA scores, enrolment, demographics, and nearby property prices.
        </HeroLead>
      </PhotoHero>

      <Band tone="quiet" spacing="compact">
        {/* Comparison table */}
        <div className="bg-white rounded-xl border border-line overflow-hidden">
          {/* Column headers */}
          <div className="grid grid-cols-[180px_1fr_1fr] bg-surface-warm border-b border-line">
            <div className="py-4 px-4" />
            <div className="py-4 px-4 text-center">
              <Link
                href={`/schools/${slug}`}
                className="text-base font-bold text-ink hover:text-primary transition-colors leading-tight block"
              >
                {schoolA.name}
              </Link>
              <p className="text-xs text-ink-muted mt-0.5">
                {schoolA.suburb.name}, {schoolA.suburb.state}
              </p>
              {schoolA.icsea != null && (
                <span
                  className={`inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-md ${
                    icseaWinner === "A"
                      ? "bg-green-100 text-green-700"
                      : "bg-white text-ink-muted"
                  }`}
                >
                  ICSEA {schoolA.icsea.toLocaleString()}
                </span>
              )}
            </div>
            <div className="py-4 px-4 text-center border-l border-line">
              <Link
                href={`/schools/${compareSlug}`}
                className="text-base font-bold text-ink hover:text-primary transition-colors leading-tight block"
              >
                {schoolB.name}
              </Link>
              <p className="text-xs text-ink-muted mt-0.5">
                {schoolB.suburb.name}, {schoolB.suburb.state}
              </p>
              {schoolB.icsea != null && (
                <span
                  className={`inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-md ${
                    icseaWinner === "B"
                      ? "bg-green-100 text-green-700"
                      : "bg-white text-ink-muted"
                  }`}
                >
                  ICSEA {schoolB.icsea.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Rows */}
          <table className="w-full">
            <tbody>
              {rows.map((row) => (
                <CompareRow key={row.label} {...row} />
              ))}
            </tbody>
          </table>
        </div>
      </Band>

      <Band spacing="compact">
        {/* Property context */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-line p-6">
            <h3 className="text-lg text-ink mb-2">
              Properties near {schoolA.name}
            </h3>
            <p className="text-sm text-ink-muted mb-4">
              Browse homes for sale and rent near {schoolA.suburb.name}.
            </p>
            <Link
              href={`/suburbs/${schoolA.suburb.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink"
            >
              See properties in {schoolA.suburb.name} →
            </Link>
          </div>
          <div className="bg-white rounded-xl border border-line p-6">
            <h3 className="text-lg text-ink mb-2">
              Properties near {schoolB.name}
            </h3>
            <p className="text-sm text-ink-muted mb-4">
              Browse homes for sale and rent near {schoolB.suburb.name}.
            </p>
            <Link
              href={`/suburbs/${schoolB.suburb.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink"
            >
              See properties in {schoolB.suburb.name} →
            </Link>
          </div>
        </div>

        {/* Explore buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href={`/schools/${slug}`}
            className={`${BUTTON_PRIMARY} flex-1 justify-center text-center`}
          >
            Explore {schoolA.name}
          </Link>
          <Link
            href={`/schools/${compareSlug}`}
            className={`${BUTTON_SECONDARY} flex-1 justify-center text-center`}
          >
            Explore {schoolB.name}
          </Link>
        </div>

        <p className="text-xs text-ink-subtle mt-8">© ACARA, licensed under CC BY 4.0.</p>
      </Band>

      {/* Funnel exit: school comparisons are high buyer intent (families
          shortlisting where to move) but had no path to a lead form. */}
      <ExpertCTA {...BUYING_GUIDE_CTA} />
    </>
  );
}
