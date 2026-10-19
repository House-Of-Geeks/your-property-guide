import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GraduationCap, ExternalLink } from "lucide-react";
import { getSchoolBySlug, getSchoolsInSuburb, makeSchoolSlug } from "@/lib/services/school-service";
import { SITE_URL } from "@/lib/constants";
import { BreadcrumbJsonLd, EducationalOrganizationJsonLd } from "@/components/seo";
import { BUTTON_PRIMARY, Band, HeroLead, HeroTitle, PhotoHero, SectionHeading } from "@/components/premium";

interface SchoolPageProps {
  params: Promise<{ slug: string }>;
}

// 24h ISR (fix item 4a, part two). The annual schools sync and the
// quarterly sync revalidate these paths on demand
// (scripts/sync/revalidate-paths.ts). The listing search that used to fill
// the left column (legacy demo listings, buy/rent/sold filters) went with the
// portal on 14 Oct 2026; the column now points to the suburb and the next
// steps for buying or selling near the school.
export const revalidate = 86400;
export const dynamicParams = true;
export function generateStaticParams() { return []; }

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
    openGraph: { ...DEFAULT_OG, url: `${SITE_URL}/schools/${slug}`, title, description, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function SchoolPage({ params }: SchoolPageProps) {
  const { slug } = await params;
  const school = await getSchoolBySlug(slug);
  if (!school) notFound();

  const suburbSlug = school.suburb.slug;
  const nearbySchools = await getSchoolsInSuburb(school.suburbId, school.acaraId ?? undefined);

  // Street map (roadmap), not satellite
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
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Schools", url: "/schools" },
          { name: school.name, url: `/schools/${slug}` },
        ]}
      />
      <EducationalOrganizationJsonLd
        name={school.name}
        url={"/schools/" + slug}
        address={{ suburb: school.suburb.name, state: school.suburb.state, postcode: school.suburb.postcode }}
        educationalLevel={typeLabel(school.type)}
        website={school.website ?? undefined}
      />
      {/* Hero: a reference page, so plain charcoal. The page had no H1; the
          school's name is it, with the type tags and suburb from the card
          below (which sits under the listings on phones). */}
      <PhotoHero
        breadcrumbs={[
          { label: school.suburb.name, href: `/suburbs/${school.suburb.slug}` },
          { label: school.name },
        ]}
      >
        <p className="text-sm text-ink-muted mb-5">{tags.join(" · ")}</p>
        <HeroTitle>{school.name}</HeroTitle>
        <HeroLead>{school.suburb.name}, {school.suburb.state}</HeroLead>
      </PhotoHero>

      <Band tone="quiet" spacing="compact">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Left: living near the school ──────────────────────────── */}
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl text-ink">Living near {school.name}</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                {
                  href: `/suburbs/${suburbSlug}`,
                  label: `${school.suburb.name} suburb profile`,
                  note: "House and unit prices, rents, the other schools and who lives there.",
                },
                {
                  href: "/buying",
                  label: "Buying near this school",
                  note: "Your budget, the schemes you qualify for, stamp duty and every step to the keys.",
                },
                {
                  href: "/selling",
                  label: "Selling near this school",
                  note: "What it will cost to sell, what it’s worth and how to choose your agent.",
                },
                {
                  href: "/plan",
                  label: "Your next-step plan for the move",
                  note: "Three questions, then your next steps, the right tools and a checklist.",
                },
              ].map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="group flex h-full flex-col rounded-xl border border-line bg-white p-6 transition-colors hover:border-ink">
                    <span className="text-lg font-bold text-ink">{c.label}</span>
                    <span className="mt-2 text-base leading-relaxed text-ink-muted">{c.note}</span>
                    <span className="mt-auto pt-4 text-sm font-semibold text-ink group-hover:underline underline-offset-4">Open</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Right: map + school info ──────────────────────────────── */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0 space-y-4">

            {/* Map */}
            <div className="rounded-xl overflow-hidden border border-line bg-white" style={{ height: 300 }}>
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
                <div className="w-full h-full flex items-center justify-center text-ink-subtle">
                  <GraduationCap className="w-10 h-10" aria-hidden="true" />
                </div>
              )}
            </div>

            {/* School info card */}
            <div className="bg-white rounded-xl border border-line p-5">
              {/* Header row */}
              <div className="flex items-start justify-between">
                <GraduationCap className="w-5 h-5 text-ink-subtle mt-0.5 shrink-0" aria-hidden="true" />
                {school.updatedFromAcara && (
                  <span className="text-xs text-ink-subtle">
                    Updated: {school.updatedFromAcara.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                )}
              </div>

              <h2 className="text-lg text-ink mt-2 leading-snug">{school.name}</h2>
              <p className="text-sm text-ink-muted mt-0.5">{school.suburb.name}, {school.suburb.state}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {tags.map((tag) => (
                  <span key={tag} className="text-xs font-medium px-2.5 py-0.5 rounded-md border border-line-strong text-ink-muted bg-white">
                    {tag}
                  </span>
                ))}
              </div>

              <hr className="my-4 border-line" />

              {/* Stats */}
              <h3 className="text-base text-ink mb-3">Students and school staff</h3>
              <dl className="divide-y divide-line">
                {staffRows.map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-3 py-2 text-sm">
                    <dt className="text-ink-muted leading-snug">{label}</dt>
                    <dd className="font-semibold text-ink shrink-0">{value}</dd>
                  </div>
                ))}
              </dl>

              {/* Disclaimer */}
              <p className="text-xs text-ink-subtle mt-3 leading-snug">
                Disclaimer: Always check directly with the local school to verify school catchment data.
              </p>

              {/* External links */}
              <div className="mt-4 pt-4 border-t border-line space-y-2.5">
                {school.website && (
                  <a href={school.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-ink transition-colors">
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" /> School website
                  </a>
                )}
                {school.acaraId && (
                  <>
                    <a href={`https://www.myschool.edu.au/school/${school.acaraId}/naplan`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-ink transition-colors">
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" /> School NAPLAN results
                    </a>
                    <a href={`https://www.myschool.edu.au/school/${school.acaraId}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-ink transition-colors">
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" /> School ICSEA value
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Compare this school */}
            {school.acaraId && nearbySchools.length > 0 && (
              <div className="bg-white rounded-xl border border-line p-5">
                <h3 className="text-base text-ink mb-3">Compare {school.name}</h3>
                <ul className="space-y-2">
                  {nearbySchools.map((other) => {
                    if (!other.acaraId) return null;
                    const otherSlug = makeSchoolSlug(other.name, other.acaraId);
                    return (
                      <li key={other.acaraId}>
                        <Link
                          href={`/schools/${slug}/vs/${otherSlug}`}
                          className="flex items-center justify-between gap-2 text-sm text-ink hover:text-primary transition-colors group"
                        >
                          <span className="truncate group-hover:underline">{other.name}</span>
                          {other.icsea != null && (
                            <span className="shrink-0 text-xs text-ink-subtle">
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

            <p className="text-xs text-ink-subtle px-1">© ACARA, licensed under CC BY 4.0.</p>
          </div>
        </div>
      </Band>

      {/* Buyer funnel exit. School-profile visitors are researching a
          catchment to buy into — deep-link the guide to this suburb. */}
      <Band spacing="compact">
        <div className="max-w-3xl">
          <SectionHeading size="md" title={<>Buying near {school.name}?</>} />
          <p className="mt-4 text-lg text-ink-muted leading-relaxed max-w-2xl">
            The free buying guide, personalised to {school.suburb.name}: how school
            catchments affect prices, what you can actually spend, and how not to
            overpay. In your inbox in 60 seconds.
          </p>
          <Link
            href={`/buying-guide?suburb=${school.suburb.slug}`}
            className={`mt-8 ${BUTTON_PRIMARY}`}
          >
            Get the free buying guide
          </Link>
        </div>
      </Band>
    </>
  );
}
