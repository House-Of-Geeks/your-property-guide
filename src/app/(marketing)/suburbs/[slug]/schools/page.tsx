import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SuburbSubrouteHeader, SubrouteActionCard, SubpageNextSteps, type NextStepGroup } from "@/components/suburb";
import { BUTTON_PRIMARY, Band } from "@/components/premium";
import { BreadcrumbJsonLd, PlaceJsonLd, ItemListJsonLd } from "@/components/seo";
import { getSuburbBySlug } from "@/lib/services/suburb-service";
import { getSuburbSubpageAvailability } from "@/lib/services/subpage-availability";
import { getNearbySubpages } from "@/lib/services/nearby-subpages";
import { guideFunnelHref } from "@/lib/guide-funnel";
import { hasReliablePrice } from "@/lib/suburb-data-quality";
import { makeSchoolSlug } from "@/lib/utils/school";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
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

/** "12 primary, 5 secondary and 3 combined", largest first. */
function typeBreakdown(schools: readonly School[]): string {
  const counts = new Map<string, number>();
  for (const s of schools) counts.set(typeLabel(s.type).toLowerCase(), (counts.get(typeLabel(s.type).toLowerCase()) ?? 0) + 1);
  const parts = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t, n]) => `${n} ${t}`);
  if (parts.length <= 1) return parts[0] ?? "";
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

export async function generateMetadata({ params }: SuburbSchoolsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const suburb = await getSuburbBySlug(slug);
  if (!suburb) return { title: "Suburb Not Found" };

  const schools = suburb.schools;
  const title = `Schools in ${suburb.name}, ${suburb.state} | Ranked by ICSEA`;
  const description = `Browse all ${schools.length} schools in ${suburb.name}. Compare ICSEA scores, school types, and nearby property prices.`;
  const canonical = `${SITE_URL}/suburbs/${slug}/schools`;

  return {
    title,
    description,
    alternates: { canonical },
    // og titles don't get the root title.template — brand them explicitly
    openGraph: { ...DEFAULT_OG, url: canonical, title: `${title} | ${SITE_NAME}`, description, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function SuburbSchoolsPage({ params }: SuburbSchoolsPageProps) {
  const { slug } = await params;
  const suburb = await getSuburbBySlug(slug);
  if (!suburb) notFound();

  const availability = await getSuburbSubpageAvailability(suburb);
  const nearby = await getNearbySubpages(suburb.nearbySuburbs);

  const schools = [...suburb.schools].sort((a, b) => {
    if (a.icsea == null && b.icsea == null) return 0;
    if (a.icsea == null) return 1;
    if (b.icsea == null) return -1;
    return b.icsea - a.icsea;
  });

  const name = suburb.name;
  const icseaValues = schools.map((s) => s.icsea).filter((v): v is number => v != null);
  const lowestIcsea = icseaValues.length > 0 ? Math.min(...icseaValues) : null;
  const highestIcsea = icseaValues.length > 0 ? Math.max(...icseaValues) : null;

  // The answer. The list is the schools in and around the suburb (the
  // nearest within 10 km, wider for rural suburbs), so the copy says so.
  const subtitle = schools.length > 0 ? (
    <p>
      {`There ${schools.length === 1 ? "is" : "are"} `}
      <strong className="font-semibold">{`${schools.length} school${schools.length !== 1 ? "s" : ""} in and around ${name}`}</strong>
      {schools.length > 1 ? `: ${typeBreakdown(schools)}.` : "."}
      {lowestIcsea != null && highestIcsea != null && lowestIcsea !== highestIcsea &&
        ` Their ICSEA scores run from ${lowestIcsea} to ${highestIcsea} (ACARA).`}
      {lowestIcsea != null && highestIcsea != null && lowestIcsea === highestIcsea &&
        ` ICSEA score ${highestIcsea} (ACARA).`}
    </p>
  ) : (
    <p>{`We have no school data for ${name} yet. The ${name} profile has prices, rents and who lives there.`}</p>
  );

  const buyHref = guideFunnelHref("buying", { suburb: slug, from: "suburb-schools", toForm: true });
  const stateLower = suburb.state.toLowerCase();
  const nextSteps: NextStepGroup[] = [
    {
      title: `More on ${name}`,
      links: [
        { href: `/suburbs/${slug}`, label: `${name} suburb profile` },
        ...(hasReliablePrice(suburb) ? [{ href: `/suburbs/${slug}#market`, label: `${name} house prices` }] : []),
        ...(availability["rental-market"] ? [{ href: `/suburbs/${slug}/rental-market`, label: `${name} rental market` }] : []),
      ],
    },
    {
      title: `Schools near ${name}`,
      links: nearby
        .filter((n) => n.schoolCount > 0)
        .slice(0, 6)
        .map((n) => ({ href: `/suburbs/${n.slug}/schools`, label: `Schools in ${n.name}` })),
    },
    {
      title: `Buying in ${suburb.state}`,
      links: [
        { href: `/guides/stamp-duty-${stateLower}`, label: `Stamp duty in ${suburb.state}` },
        { href: `/guides/first-home-buyer-${stateLower}`, label: `First home buyers in ${suburb.state}` },
        { href: "/guides/due-diligence-checklist-buying-a-house", label: "Due diligence checklist" },
        { href: "/schools", label: "Find a school by name" },
      ],
    },
  ];

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
        title={`Schools in ${name}`}
        subtitle={subtitle}
        breadcrumbLeaf="Schools"
        action={
          // Families researching schools are buyers: the buying guide, not
          // "Selling in {suburb}?".
          <SubrouteActionCard
            heading={`Moving to ${name} for the schools?`}
            body={`The free buying guide, personalised to ${name}: what you can really spend, the ${suburb.state} schemes and stamp duty, and how not to overpay.`}
            href={buyHref}
            cta="Get the free buying guide"
          >
            <p>
              {"Selling first? "}
              <Link
                href={guideFunnelHref("selling", { suburb: slug, from: "suburb-schools" })}
                className="text-ink underline decoration-line-strong underline-offset-4 hover:text-primary hover:decoration-primary"
              >
                The free selling guide
              </Link>
            </p>
          </SubrouteActionCard>
        }
      />

      <Band spacing="compact">
        <div className="space-y-12 sm:space-y-16">
          {schools.length > 0 ? (
            <section id="schools" className="scroll-mt-20">
              <h2 className="font-display text-2xl sm:text-3xl font-normal text-ink tracking-[-0.03em] mb-2">
                {`${name} schools by ICSEA`}
              </h2>
              <p className="font-sans text-sm text-ink-muted mb-5 max-w-3xl leading-relaxed">
                ICSEA describes the socio-educational background of a school&rsquo;s students (the national average is 1000). It is not a measure of teaching quality, so visit, and read each school&rsquo;s results on My School.
              </p>

              {/* Desktop table */}
              <div className="hidden sm:block overflow-hidden rounded-xl border border-line">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface-warm border-b border-line text-left">
                      <th scope="col" className="py-3 px-4 font-semibold text-ink">School</th>
                      <th scope="col" className="py-3 px-4 font-semibold text-ink">Type</th>
                      <th scope="col" className="py-3 px-4 font-semibold text-ink">Sector</th>
                      <th scope="col" className="py-3 px-4 font-semibold text-ink">Years</th>
                      <th scope="col" className="py-3 px-4 font-semibold text-ink text-right">ICSEA</th>
                      <th scope="col" className="py-3 px-4 font-semibold text-ink text-right">Enrolment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schools.map((school) => {
                      const schoolSlug = school.acaraId ? makeSchoolSlug(school.name, school.acaraId) : null;
                      return (
                        <tr key={school.name} className="border-b border-line last:border-0">
                          <th scope="row" className="py-3 px-4 text-left font-medium">
                            {schoolSlug ? (
                              <Link href={`/schools/${schoolSlug}`} className="text-ink hover:text-primary transition-colors">
                                {school.name}
                              </Link>
                            ) : (
                              <span className="text-ink">{school.name}</span>
                            )}
                          </th>
                          <td className="py-3 px-4 text-ink-muted">{typeLabel(school.type)}</td>
                          <td className="py-3 px-4 text-ink-muted">{sectorLabel(school.sector)}</td>
                          <td className="py-3 px-4 text-ink-muted">{school.yearRange ?? "–"}</td>
                          <td className={`py-3 px-4 text-right ${icseaColour(school.icsea)}`}>
                            {school.icsea ?? "–"}
                          </td>
                          <td className="py-3 px-4 text-right text-ink-muted">
                            {school.enrolment?.toLocaleString("en-AU") ?? "–"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Phone: one line per school */}
              <p className="sm:hidden flex justify-between border-b border-line pb-2 text-[13px] font-semibold text-ink" aria-hidden="true">
                <span>School</span>
                <span>ICSEA</span>
              </p>
              <ul className="sm:hidden">
                {schools.map((school) => {
                  const schoolSlug = school.acaraId ? makeSchoolSlug(school.name, school.acaraId) : null;
                  return (
                    <li key={school.name} className="flex items-start justify-between gap-4 border-b border-line py-3">
                      <div className="min-w-0">
                        {schoolSlug ? (
                          <Link href={`/schools/${schoolSlug}`} className="font-medium text-ink hover:text-primary transition-colors">
                            {school.name}
                          </Link>
                        ) : (
                          <span className="font-medium text-ink">{school.name}</span>
                        )}
                        <p className="text-[13px] text-ink-muted mt-0.5">
                          {typeLabel(school.type)} · {sectorLabel(school.sector)}
                          {school.yearRange ? ` · ${school.yearRange}` : ""}
                        </p>
                      </div>
                      <p className={`shrink-0 text-right ${icseaColour(school.icsea)}`}>{school.icsea ?? "–"}</p>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-ink-muted font-sans">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-success inline-block" aria-hidden="true" />
                  1100 and above
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-ink inline-block" aria-hidden="true" />
                  1000 to 1099
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-warning inline-block" aria-hidden="true" />
                  Below 1000
                </span>
                <span>School data licensed from ACARA under CC BY 4.0.</span>
              </div>
            </section>
          ) : (
            <div className="rounded-xl border border-line bg-surface-warm p-6">
              <p className="font-sans text-base text-ink">No school data available for {name} yet.</p>
            </div>
          )}

          {/* Before you buy for a school: zones are by address. */}
          <section className="rounded-xl border border-line p-5 sm:p-6 max-w-3xl">
            <h2 className="font-display text-lg sm:text-xl font-normal text-ink">School zones go by address, not suburb</h2>
            <p className="mt-2 font-sans text-[15px] text-ink-muted leading-relaxed">
              {`A government school's catchment can split a suburb, so two streets in ${name} can belong to different schools. Check the exact address with the ${suburb.state} education department's school finder before you make an offer, and ask the agent for it in writing.`}
            </p>
            <p className="mt-3 font-sans text-[15px]">
              <Link
                href={`/suburbs/${slug}`}
                className="inline-flex items-center gap-2 font-medium text-ink underline decoration-line-strong underline-offset-4 hover:text-primary hover:decoration-primary"
              >
                {`Living in ${name}: prices, rents and who lives there`}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </p>
          </section>
        </div>
      </Band>

      <Band tone="quiet" spacing="compact">
        <div className="space-y-12 sm:space-y-16">
          <SubpageNextSteps id="next" title={`Next steps for ${name} buyers`} groups={nextSteps} />

          {/* The same one action, once more where the page ends. */}
          <section className="tone-dark rounded-xl bg-surface-inverse p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-normal text-ink tracking-[-0.03em]">Buying in {name}?</h2>
              <p className="font-sans text-sm text-ink-muted mt-1.5 max-w-xl">The free buying guide, personalised to {name}: budget, schemes, inspections and the offer.</p>
            </div>
            <Link
              href={buyHref}
              className={`shrink-0 justify-center ${BUTTON_PRIMARY}`}
            >
              Get the free buying guide <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </section>
        </div>
      </Band>
    </>
  );
}
