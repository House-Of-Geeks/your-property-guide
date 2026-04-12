import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, GraduationCap } from "lucide-react";
import { getSchoolBySlug } from "@/lib/services/school-service";
import { BreadcrumbJsonLd } from "@/components/seo";
import { formatPriceFull } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";

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

  const title = `${schoolA.name} vs ${schoolB.name} | School Comparison | Your Property Guide`;
  const description = `Compare ${schoolA.name} and ${schoolB.name} — ICSEA scores, enrolment, demographics, and nearby property prices.`;
  const canonical = `${SITE_URL}/schools/${slug}/vs/${compareSlug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { url: canonical, title, description, type: "website" },
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
    <tr className="border-b border-gray-100 last:border-0">
      <td className="py-3 px-4 text-sm text-gray-500 font-medium">{label}</td>
      <td
        className={`py-3 px-4 text-sm font-semibold text-center ${
          winner === "A" ? "text-green-700 bg-green-50" : "text-gray-900"
        }`}
      >
        {valueA}
      </td>
      <td
        className={`py-3 px-4 text-sm font-semibold text-center ${
          winner === "B" ? "text-green-700 bg-green-50" : "text-gray-900"
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

  // ICSEA score — higher is better
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

  // Student:teacher ratio — lower is better but we just display, no winner
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
    <div className="min-h-screen bg-gray-50">
      <BreadcrumbJsonLd
        items={[
          { name: "Schools", url: "/schools" },
          { name: schoolA.name, url: `/schools/${slug}` },
          { name: `vs ${schoolB.name}`, url: `/schools/${slug}/vs/${compareSlug}` },
        ]}
      />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/schools" className="hover:text-primary transition-colors">
                Schools
              </Link>
            </li>
            <li className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href={`/schools/${slug}`} className="hover:text-primary transition-colors">
                {schoolA.name}
              </Link>
            </li>
            <li className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gray-900 font-medium">vs {schoolB.name}</span>
            </li>
          </ol>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary uppercase tracking-wide">
              School Comparison
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            {schoolA.name}{" "}
            <span className="text-gray-400">vs</span>{" "}
            {schoolB.name}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Compare ICSEA scores, enrolment, demographics, and nearby property prices.
          </p>
        </div>

        {/* Comparison table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Column headers */}
          <div className="grid grid-cols-[180px_1fr_1fr] bg-gray-50 border-b border-gray-200">
            <div className="py-4 px-4" />
            <div className="py-4 px-4 text-center">
              <Link
                href={`/schools/${slug}`}
                className="text-base font-bold text-gray-900 hover:text-primary transition-colors leading-tight block"
              >
                {schoolA.name}
              </Link>
              <p className="text-xs text-gray-500 mt-0.5">
                {schoolA.suburb.name}, {schoolA.suburb.state}
              </p>
              {schoolA.icsea != null && (
                <span
                  className={`inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    icseaWinner === "A"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  ICSEA {schoolA.icsea.toLocaleString()}
                </span>
              )}
            </div>
            <div className="py-4 px-4 text-center border-l border-gray-200">
              <Link
                href={`/schools/${compareSlug}`}
                className="text-base font-bold text-gray-900 hover:text-primary transition-colors leading-tight block"
              >
                {schoolB.name}
              </Link>
              <p className="text-xs text-gray-500 mt-0.5">
                {schoolB.suburb.name}, {schoolB.suburb.state}
              </p>
              {schoolB.icsea != null && (
                <span
                  className={`inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    icseaWinner === "B"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
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

        {/* Property context */}
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Properties near {schoolA.name}
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Browse homes for sale and rent near {schoolA.suburb.name}.
            </p>
            <Link
              href={`/suburbs/${schoolA.suburb.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              See properties in {schoolA.suburb.name} →
            </Link>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Properties near {schoolB.name}
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Browse homes for sale and rent near {schoolB.suburb.name}.
            </p>
            <Link
              href={`/suburbs/${schoolB.suburb.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              See properties in {schoolB.suburb.name} →
            </Link>
          </div>
        </div>

        {/* Explore buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            href={`/schools/${slug}`}
            className="flex-1 text-center bg-primary text-white rounded-lg px-6 py-3 text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Explore {schoolA.name}
          </Link>
          <Link
            href={`/schools/${compareSlug}`}
            className="flex-1 text-center bg-white border border-gray-300 text-gray-700 rounded-lg px-6 py-3 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Explore {schoolB.name}
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-6 px-1">© ACARA, licensed under CC BY 4.0.</p>
      </div>
    </div>
  );
}
