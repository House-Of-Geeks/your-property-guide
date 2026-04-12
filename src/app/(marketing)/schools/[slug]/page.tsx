import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ChevronRight, GraduationCap, ExternalLink } from "lucide-react";
import { getSchoolBySlug, getSchoolsInSuburb, makeSchoolSlug } from "@/lib/services/school-service";
import { getProperties } from "@/lib/services/property-service";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { SchoolListingControls } from "@/components/school/SchoolListingControls";
import { SchoolSearchBar } from "@/components/school/SchoolSearchBar";
import { SITE_URL } from "@/lib/constants";

interface SchoolPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

const GMAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";

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

export async function generateMetadata({ params }: SchoolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const school = await getSchoolBySlug(slug);
  if (!school) return { title: "School Not Found" };

  const title = `${school.name} | School Catchment & Nearby Properties`;
  const description = `${school.name} is a ${sectorLabel(school.sector).toLowerCase()} ${typeLabel(school.type).toLowerCase()} school in ${school.suburb.name}, ${school.suburb.state}. View enrolment stats and nearby properties for sale.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/schools/${slug}` },
    openGraph: { url: `${SITE_URL}/schools/${slug}`, title, description, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function SchoolPage({ params, searchParams }: SchoolPageProps) {
  const { slug } = await params;
  const { sort, mode, minPrice, maxPrice, minBeds, minBaths, minCars, propertyType } = await searchParams;
  const school = await getSchoolBySlug(slug);
  if (!school) notFound();

  // Nearby schools in the same suburb for compare links
  const nearbySchools = await getSchoolsInSuburb(school.suburbId, school.acaraId ?? undefined);

  const listingType = (mode === "rent" ? "rent" : mode === "sold" ? "sold" : "buy") as "buy" | "rent" | "sold";
  let properties = await getProperties({
    listingType,
    suburb: school.suburb.slug,
    propertyType: propertyType as any,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    minBeds: minBeds ? Number(minBeds) : undefined,
    minBaths: minBaths ? Number(minBaths) : undefined,
    minCars: minCars ? Number(minCars) : undefined,
  });

  // Sort in-memory
  if (sort === "newest") {
    properties = [...properties].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
  } else if (sort === "price-asc") {
    properties = [...properties].sort((a, b) => (a.price.value ?? 0) - (b.price.value ?? 0));
  } else if (sort === "price-desc") {
    properties = [...properties].sort((a, b) => (b.price.value ?? 0) - (a.price.value ?? 0));
  }

  // Street map (roadmap) — not satellite
  const mapSrc = school.lat && school.lng && GMAPS_KEY
    ? `https://www.google.com/maps/embed/v1/place?key=${GMAPS_KEY}&q=${encodeURIComponent(school.name)}&center=${school.lat},${school.lng}&zoom=13&maptype=roadmap`
    : null;

  const tags = [
    sectorLabel(school.sector),
    typeLabel(school.type),
    school.yearRange,
    genderLabel(school.gender),
  ].filter(Boolean) as string[];

  const staffRows: { label: string; value: string }[] = [
    { label: "Total student enrolments",                value: school.enrolment?.toLocaleString() ?? "–" },
    { label: "Boys",                                    value: school.boysEnrolment?.toLocaleString() ?? "–" },
    { label: "Girls",                                   value: school.girlsEnrolment?.toLocaleString() ?? "–" },
    { label: "Indigenous students",                     value: school.indigenousPct != null ? `${school.indigenousPct}%` : "–" },
    { label: "Language other than English",             value: school.lbotePct != null ? `${school.lbotePct}%` : "–" },
    { label: "Teaching staff",                          value: school.teachingStaff?.toLocaleString() ?? "–" },
    { label: "Full-time equivalent teaching staff",     value: school.teachingStaffFte?.toLocaleString() ?? "–" },
    { label: "Non-teaching staff",                      value: school.nonTeachingStaff?.toLocaleString() ?? "–" },
    { label: "Full-time equivalent non-teaching staff", value: school.nonTeachingStaffFte?.toLocaleString() ?? "–" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky search/filter bar */}
      <Suspense fallback={null}>
        <SchoolSearchBar schoolName={school.name} currentMode={listingType} />
      </Suspense>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
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
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Left: property listings ───────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <Suspense fallback={null}>
              <SchoolListingControls
                count={properties.length}
                schoolName={school.name}
                currentSort={sort ?? ""}
              />
            </Suspense>

            {properties.length > 0 ? (
              <PropertyGrid properties={properties} />
            ) : (
              <div className="rounded-xl bg-white border border-gray-200 p-10 text-center">
                <GraduationCap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No active listings near {school.suburb.name} right now.</p>
                <Link href={`/suburbs/${school.suburb.slug}`}
                  className="mt-3 inline-block text-sm font-medium text-primary hover:text-primary/80">
                  Explore {school.suburb.name} →
                </Link>
              </div>
            )}
          </div>

          {/* ── Right: map + school info ──────────────────────────────── */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0 space-y-4">

            {/* Map */}
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-100" style={{ height: 300 }}>
              {mapSrc ? (
                <iframe
                  src={mapSrc}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${school.name}`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <GraduationCap className="w-10 h-10" />
                </div>
              )}
            </div>

            {/* School info card */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              {/* Header row */}
              <div className="flex items-start justify-between">
                <GraduationCap className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
                {school.updatedFromAcara && (
                  <span className="text-xs text-gray-400">
                    Updated: {school.updatedFromAcara.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                )}
              </div>

              <h2 className="text-base font-bold text-gray-900 mt-2 leading-snug">{school.name}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{school.suburb.name}, {school.suburb.state}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {tags.map((tag) => (
                  <span key={tag} className="text-xs font-medium px-2.5 py-0.5 rounded-full border border-gray-300 text-gray-600 bg-white">
                    {tag}
                  </span>
                ))}
              </div>

              <hr className="my-4 border-gray-100" />

              {/* Stats */}
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Students and school staff</h3>
              <dl className="divide-y divide-gray-100">
                {staffRows.map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-3 py-2 text-sm">
                    <dt className="text-gray-500 leading-snug">{label}</dt>
                    <dd className="font-medium text-gray-900 shrink-0 tabular-nums">{value}</dd>
                  </div>
                ))}
              </dl>

              {/* Disclaimer */}
              <p className="text-[11px] text-gray-400 mt-3 leading-snug">
                Disclaimer: Always check directly with the local school to verify school catchment data.
              </p>

              {/* External links */}
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2.5">
                {school.website && (
                  <a href={school.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" /> School website
                  </a>
                )}
                {school.acaraId && (
                  <>
                    <a href={`https://www.myschool.edu.au/school/${school.acaraId}/naplan`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" /> School NAPLAN results
                    </a>
                    <a href={`https://www.myschool.edu.au/school/${school.acaraId}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" /> School ICSEA value
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Compare this school */}
            {school.acaraId && nearbySchools.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Compare {school.name}</h3>
                <ul className="space-y-2">
                  {nearbySchools.map((other) => {
                    if (!other.acaraId) return null;
                    const otherSlug = makeSchoolSlug(other.name, other.acaraId);
                    return (
                      <li key={other.acaraId}>
                        <Link
                          href={`/schools/${slug}/vs/${otherSlug}`}
                          className="flex items-center justify-between gap-2 text-sm text-gray-700 hover:text-primary transition-colors group"
                        >
                          <span className="truncate group-hover:underline">{other.name}</span>
                          {other.icsea != null && (
                            <span className="shrink-0 text-xs text-gray-400 tabular-nums">
                              ICSEA {other.icsea}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <p className="text-xs text-gray-400 px-1">© ACARA, licensed under CC BY 4.0.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
