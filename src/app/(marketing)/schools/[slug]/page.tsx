import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, GraduationCap, ExternalLink } from "lucide-react";
import { getSchoolBySlug } from "@/lib/services/school-service";
import { getPropertiesBySuburb } from "@/lib/services/property-service";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { SITE_URL } from "@/lib/constants";

interface SchoolPageProps {
  params: Promise<{ slug: string }>;
}

const GMAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";

function typeLabel(type: string) {
  if (type === "primary") return "Primary School";
  if (type === "secondary") return "Secondary School";
  if (type === "combined") return "Combined School";
  if (type === "special") return "Special School";
  return type;
}

function sectorLabel(sector: string) {
  if (sector === "government") return "Government";
  if (sector === "catholic") return "Catholic";
  return "Independent";
}

function genderLabel(gender: string | null) {
  if (!gender || gender === "coed") return "Co-educational";
  if (gender === "girls") return "Girls";
  return "Boys";
}

export async function generateMetadata({ params }: SchoolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const school = await getSchoolBySlug(slug);
  if (!school) return { title: "School Not Found" };

  const title = `${school.name} | School Catchment`;
  const description = `${school.name} is a ${sectorLabel(school.sector).toLowerCase()} ${typeLabel(school.type).toLowerCase()} in ${school.suburb.name}, ${school.suburb.state} ${school.suburb.postcode}. View school details and nearby properties.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/schools/${slug}` },
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function SchoolPage({ params }: SchoolPageProps) {
  const { slug } = await params;
  const school = await getSchoolBySlug(slug);
  if (!school) notFound();

  const properties = await getPropertiesBySuburb(school.suburb.slug, 6);

  const mapSrc = school.lat && school.lng && GMAPS_KEY
    ? `https://www.google.com/maps/embed/v1/place?key=${GMAPS_KEY}&q=${encodeURIComponent(school.name)}&center=${school.lat},${school.lng}&zoom=14&maptype=satellite`
    : null;

  const tags = [
    sectorLabel(school.sector),
    typeLabel(school.type).replace(" School", "").replace(" College", ""),
    school.yearRange,
    genderLabel(school.gender) === "Co-educational" ? "Co-ed" : genderLabel(school.gender),
  ].filter(Boolean) as string[];

  const staffRows: { label: string; value: string }[] = [
    { label: "Total student enrolments",               value: school.enrolment?.toLocaleString() ?? "–" },
    { label: "Boys",                                   value: school.boysEnrolment?.toLocaleString() ?? "–" },
    { label: "Girls",                                  value: school.girlsEnrolment?.toLocaleString() ?? "–" },
    { label: "Indigenous students",                    value: school.indigenousPct != null ? `${school.indigenousPct}%` : "–" },
    { label: "Language other than English",            value: school.lbotePct != null ? `${school.lbotePct}%` : "–" },
    { label: "Teaching staff",                         value: school.teachingStaff?.toLocaleString() ?? "–" },
    { label: "Full-time equivalent teaching staff",    value: school.teachingStaffFte?.toLocaleString() ?? "–" },
    { label: "Non-teaching staff",                     value: school.nonTeachingStaff?.toLocaleString() ?? "–" },
    { label: "Full-time equivalent non-teaching staff",value: school.nonTeachingStaffFte?.toLocaleString() ?? "–" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li className="flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5" />
                <Link href={`/suburbs/${school.suburb.slug}`} className="hover:text-primary transition-colors">
                  {school.suburb.name}
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-gray-900 font-medium">{school.name}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Satellite map hero */}
      <div className="relative h-64 sm:h-80 bg-gray-900 overflow-hidden">
        {mapSrc ? (
          <iframe
            src={mapSrc}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map of ${school.name}`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <GraduationCap className="w-16 h-16 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 text-center">
          <GraduationCap className="w-10 h-10 text-white/90 mb-2 drop-shadow" />
          <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">{school.name}</h1>
          <p className="text-white/90 mt-1.5 drop-shadow">
            {school.suburb.name}, {school.suburb.state} {school.suburb.postcode}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* School info card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-1">
                <GraduationCap className="w-6 h-6 text-primary mt-0.5" />
                {school.updatedFromAcara && (
                  <span className="text-xs text-gray-400">
                    Updated: {school.updatedFromAcara.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold text-gray-900 mt-2">{school.name}</h2>
              <p className="text-sm text-gray-500">{school.suburb.name}, {school.suburb.state}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {tags.map((tag) => (
                  <span key={tag} className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{tag}</span>
                ))}
              </div>

              <hr className="my-4 border-gray-100" />

              {/* Staff & enrolment stats */}
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Students and school staff</h3>
              <dl className="space-y-2.5">
                {staffRows.map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-3 text-sm">
                    <dt className="text-gray-500 leading-snug">{label}</dt>
                    <dd className="font-medium text-gray-900 shrink-0">{value}</dd>
                  </div>
                ))}
              </dl>

              {/* ICSEA */}
              {school.icsea && (
                <>
                  <hr className="my-4 border-gray-100" />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">ICSEA</span>
                    <span className="font-medium text-gray-900">{school.icsea}</span>
                  </div>
                </>
              )}

              {/* External links */}
              <div className="mt-5 space-y-2">
                {school.website && (
                  <a href={school.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80">
                    <ExternalLink className="w-3.5 h-3.5" /> School website
                  </a>
                )}
                {school.acaraId && (
                  <>
                    <a href={`https://www.myschool.edu.au/school/${school.acaraId}/naplan`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80">
                      <ExternalLink className="w-3.5 h-3.5" /> School NAPLAN results
                    </a>
                    <a href={`https://www.myschool.edu.au/school/${school.acaraId}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80">
                      <ExternalLink className="w-3.5 h-3.5" /> School ICSEA value
                    </a>
                  </>
                )}
              </div>

              <p className="text-[11px] text-gray-400 mt-4 leading-snug">
                Disclaimer: Always check directly with the local school to verify school catchment data.
              </p>
            </div>
          </div>

          {/* Properties */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">
                Properties near {school.name}
              </h2>
              <Link
                href={`/suburbs/${school.suburb.slug}`}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                View {school.suburb.name} profile →
              </Link>
            </div>

            {properties.length > 0 ? (
              <PropertyGrid properties={properties} />
            ) : (
              <div className="rounded-xl bg-white shadow-card border border-gray-100 p-8 text-center">
                <p className="text-gray-500 text-sm">No active listings in this area right now.</p>
                <Link
                  href={`/suburbs/${school.suburb.slug}`}
                  className="mt-3 inline-block text-sm font-medium text-primary hover:text-primary/80"
                >
                  Explore {school.suburb.name} →
                </Link>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-10">© ACARA, licensed under CC BY 4.0.</p>
      </div>
    </div>
  );
}
