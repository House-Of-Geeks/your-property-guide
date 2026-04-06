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

  const infoRows: { label: string; value: string }[] = [
    { label: "Type",         value: typeLabel(school.type) },
    { label: "Sector",       value: sectorLabel(school.sector) },
    { label: "Year Range",   value: school.yearRange ?? "–" },
    { label: "Gender",       value: genderLabel(school.gender) },
    { label: "Enrolment",    value: school.enrolment ? school.enrolment.toLocaleString() : "–" },
    { label: "ICSEA",        value: school.icsea ? school.icsea.toString() : "–" },
    { label: "Suburb",       value: `${school.suburb.name}, ${school.suburb.state} ${school.suburb.postcode}` },
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
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">School Details</h2>
              <dl className="space-y-3">
                {infoRows.map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-4 text-sm">
                    <dt className="text-gray-500 flex-shrink-0">{label}</dt>
                    <dd className="font-medium text-gray-900 text-right">{value}</dd>
                  </div>
                ))}
              </dl>

              {school.website && (
                <a
                  href={school.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  School Website
                </a>
              )}

              {school.acaraId && (
                <a
                  href={`https://www.myschool.edu.au/school/${school.acaraId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <GraduationCap className="w-4 h-4" />
                  View Catchment on MySchool
                </a>
              )}
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
