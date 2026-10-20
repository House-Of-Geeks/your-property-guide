import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BreadcrumbJsonLd, PlaceJsonLd, FAQPageJsonLd } from "@/components/seo";
import { SubpageNextSteps, type NextStepGroup } from "@/components/suburb";
import { guideFunnelHref } from "@/lib/guide-funnel";
import { STATE_NAMES, type StateCode } from "@/lib/data/commission-rates";
import { makeSchoolSlug } from "@/lib/utils/school";
import {
  getSuburbsByPostcode,
  getAllPostcodes,
  getPostcodeStats,
  getPostalNamesByPostcode,
} from "@/lib/services/postcode-service";
import { nonLocalityLabel } from "@/lib/locality-names";
import { postcodeDescription, postcodeFaqs as buildPostcodeFaqs, postcodeTitle } from "@/lib/postcode-copy";
import { formatPriceFull } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";
import { Band, HeroLead, HeroTitle, PhotoHero, SectionHeading } from "@/components/premium";

interface PostcodePageProps {
  params: Promise<{ postcode: string }>;
}

export const dynamicParams = true;
export const revalidate = 86400; // cache as ISR for 24h, regen on demand

export async function generateStaticParams() {
  // Skip prerender at build time, DB isn't reachable during `next build`.
  // Pages render on-demand via dynamicParams=true.
  if (process.env.NEXT_PHASE === "phase-production-build") return [];
  const postcodes = await getAllPostcodes();
  return postcodes.map((postcode) => ({ postcode }));
}

export async function generateMetadata({ params }: PostcodePageProps): Promise<Metadata> {
  const { postcode } = await params;
  const suburbs = await getSuburbsByPostcode(postcode);
  // Delivery names ("Hervey Bay DC") are named as such, not as suburbs.
  const postalNames = getPostalNamesByPostcode(postcode);
  if (suburbs.length === 0 && postalNames.length === 0) return { title: "Postcode Not Found" };

  const state = suburbs[0]?.state ?? postalNames[0].state;
  const stats = await getPostcodeStats(postcode);
  const copy = {
    postcode,
    state,
    suburbNames: suburbs.map((s) => s.name),
    postalNames: postalNames.map((p) => p.name),
    avgMedianHousePrice: stats.avgMedianHousePrice ? formatPriceFull(stats.avgMedianHousePrice) : null,
  };

  // Reverse-lookup intent: Search Console shows "{number} postcode" queries
  // (e.g. "2761 postcode") ranking ~pos 9 with no clicks, and ranking data
  // shows these pages only surface when the query also names a suburb
  // ("postcode hallam victoria") — so the suburb names must be in the
  // title, not just a count. Three names when they fit the ~60-char SERP
  // budget, otherwise two. The brand suffix is appended once by the root
  // title template (%s | Your Property Guide), so it must NOT be repeated
  // here — the old hard-coded suffix produced a double brand.
  const title = postcodeTitle(copy);
  const description = postcodeDescription(copy);

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/postcodes/${postcode}` },
    openGraph: { ...DEFAULT_OG,
      url: `${SITE_URL}/postcodes/${postcode}`,
      title,
      description,
      type: "website",
      // Page-level openGraph replaces the root default wholesale, so the
      // image must be restated or the page ships with no og:image at all.
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image" },
  };
}

/** "A, B and C" with each name linked to its profile. */
function LinkedList({ items }: { items: { slug: string; name: string }[] }) {
  return (
    <>
      {items.map((s, i) => (
        <span key={s.slug}>
          {i > 0 && (i === items.length - 1 ? " and " : ", ")}
          <Link href={`/suburbs/${s.slug}`} className="font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:text-primary hover:decoration-primary">
            {s.name}
          </Link>
        </span>
      ))}
    </>
  );
}

const plainList = (names: string[]) =>
  names.length <= 1 ? names[0] ?? "" : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;

export default async function PostcodePage({ params }: PostcodePageProps) {
  const { postcode } = await params;

  const suburbs = await getSuburbsByPostcode(postcode);

  const postalNames = getPostalNamesByPostcode(postcode);
  if (suburbs.length === 0 && postalNames.length === 0) notFound();

  const state = suburbs[0]?.state ?? postalNames[0].state;
  const stateName = STATE_NAMES[state as StateCode] ?? state;
  const stateLower = state.toLowerCase();
  const copy = {
    postcode,
    state,
    suburbNames: suburbs.map((s) => s.name),
    postalNames: postalNames.map((p) => p.name),
  };

  // Names string + reverse-lookup FAQ. "{number} postcode" / "what suburb is
  // postcode X" are high-intent queries the postcode pages already rank for
  // (~pos 9); a direct answer block plus FAQPage schema gives Google a clean
  // snippet to lift them onto page one.
  const postcodeFaqs = buildPostcodeFaqs(copy);

  // Flatten all schools across suburbs in this postcode
  const allSchools = suburbs.flatMap((suburb) =>
    suburb.schools.map((school) => ({
      ...school,
      suburbName: suburb.name,
      suburbSlug: suburb.slug,
    }))
  );

  // Price columns only where at least one suburb publishes a median.
  const anyHouse = suburbs.some((s) => s.medianHousePrice > 0);
  const anyUnit = suburbs.some((s) => s.medianUnitPrice > 0);
  const anySchools = suburbs.some((s) => s.schools.length > 0);

  const from = `postcode-${postcode}`;
  const nextSteps: NextStepGroup[] = [
    {
      title: `Selling in ${state}`,
      links: [
        { href: guideFunnelHref("selling", { from }), label: "The free selling guide" },
        { href: `/guides/real-estate-commission-${stateLower}`, label: `Agent commission in ${state}` },
        { href: `/guides/cost-of-selling-a-house-${stateLower}`, label: `Cost of selling in ${state}` },
        { href: "/real-estate-commission-calculator", label: "Commission calculator" },
      ],
    },
    {
      title: `Buying in ${state}`,
      links: [
        { href: guideFunnelHref("buying", { from }), label: "The free buying guide" },
        { href: `/guides/stamp-duty-${stateLower}`, label: `Stamp duty in ${state}` },
        { href: `/guides/first-home-buyer-${stateLower}`, label: `First home buyers in ${state}` },
      ],
    },
    {
      title: "More postcodes",
      links: [
        { href: `/postcodes#${stateLower}`, label: `${stateName} postcodes` },
        { href: "/postcodes", label: "Every postcode, by state" },
      ],
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Postcodes", url: "/postcodes" },
          { name: `Postcode ${postcode}`, url: `/postcodes/${postcode}` },
        ]}
      />
      <PlaceJsonLd
        name={`Postcode ${postcode}`}
        url={`/postcodes/${postcode}`}
        addressRegion={state}
        postalCode={postcode}
      />
      <FAQPageJsonLd faqs={postcodeFaqs} />

      {/* Answer first: which suburbs the postcode covers, every one named
          and linked, then the one action (the selling guide, with the
          reader's own suburb picked rather than the first in the list). */}
      <PhotoHero
        photo="street"
        breadcrumbs={[
          { label: "Postcodes", href: "/postcodes" },
          { label: `Postcode ${postcode}` },
        ]}
        aside={
          <div className="tone-light rounded-xl border border-line bg-white p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl text-ink leading-snug tracking-tight">
              Selling in {postcode}?
            </h2>
            <p className="mt-1.5 text-sm sm:text-[15px] text-ink-muted leading-relaxed">
              The free selling guide: pricing, real agent fees in {state}, choosing an agent and getting to settlement, personalised to your suburb.
            </p>
            {suburbs.length > 1 ? (
              // A plain GET form: picking a suburb opens the funnel with
              // it answered (?suburb=), no script needed.
              <form action="/selling-guide#guide-funnel" method="get" className="mt-4 flex flex-col sm:flex-row gap-3">
                <input type="hidden" name="from" value={from} />
                <label htmlFor="postcode-suburb" className="sr-only">Your suburb</label>
                <select
                  id="postcode-suburb"
                  name="suburb"
                  required
                  defaultValue=""
                  className="flex-1 min-w-0 rounded-lg border border-line-strong bg-white px-3 py-3 text-[15px] text-ink focus:border-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="" disabled>Your suburb</option>
                  {[...suburbs].sort((x, y) => x.name.localeCompare(y.name)).map((s) => (
                    <option key={s.slug} value={s.slug}>{s.name}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="shrink-0 inline-flex items-center justify-center gap-2 rounded-md bg-cta hover:bg-cta-hover text-cta-ink px-5 py-3 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Get the free guide <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </form>
            ) : (
              <Link
                href={guideFunnelHref("selling", { suburb: suburbs[0]?.slug, from, toForm: true })}
                className="mt-4 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-cta hover:bg-cta-hover text-cta-ink px-5 py-3 text-sm font-semibold transition-colors"
              >
                Get the free selling guide <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            )}
            <p className="mt-4 text-sm text-ink-muted">
              {"Buying here? "}
              <Link href={guideFunnelHref("buying", { from })} className="text-ink underline decoration-line-strong underline-offset-4 hover:text-primary hover:decoration-primary">
                The free buying guide
              </Link>
            </p>
          </div>
        }
      >
        <HeroTitle>
          Postcode {postcode}
        </HeroTitle>
        {suburbs.length > 0 ? (
          <HeroLead>
            {suburbs.length === 1 ? `Postcode ${postcode} is ` : `Postcode ${postcode} covers ${suburbs.length} suburbs in ${stateName}: `}
            <LinkedList items={suburbs} />
            {suburbs.length === 1 ? `, ${stateName}.` : "."}
          </HeroLead>
        ) : (
          <HeroLead>{`Postcode ${postcode} is in ${stateName}. Australia Post uses it for ${plainList(postalNames.map((p) => p.name))}; it has no residential suburbs of its own.`}</HeroLead>
        )}
        {suburbs.length > 0 && postalNames.length > 0 && (
          <p className="mt-4 text-base text-ink-muted leading-relaxed max-w-2xl">
            {`Australia Post also uses ${postcode} for ${plainList(postalNames.map((p) => p.name))}, ${postalNames.length === 1 ? "a delivery name rather than a suburb" : "delivery names rather than suburbs"}.`}
          </p>
        )}
      </PhotoHero>

      <Band spacing="compact">
        <div className="space-y-14">
        {/* The suburbs, one line each: the profile link and the published
            figures only. */}
        {suburbs.length > 0 && (
          <section id="suburbs" className="scroll-mt-20">
            <SectionHeading size="md" title={<>Suburbs in postcode {postcode}</>} />
            {anyHouse || anyUnit ? (
              <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-surface-raised max-w-4xl">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface-warm border-b border-line text-left">
                      <th scope="col" className="py-3 px-4 font-semibold text-ink">Suburb</th>
                      {anyHouse && <th scope="col" className="py-3 px-4 font-semibold text-ink text-right">Median house</th>}
                      {anyUnit && <th scope="col" className="py-3 px-4 font-semibold text-ink text-right hidden sm:table-cell">Median unit</th>}
                      {anySchools && <th scope="col" className="py-3 px-4 font-semibold text-ink text-right hidden sm:table-cell">Schools nearby</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {suburbs.map((suburb) => (
                      <tr key={suburb.slug} className="border-b border-line last:border-0">
                        <th scope="row" className="py-3 px-4 text-left font-medium">
                          <Link href={`/suburbs/${suburb.slug}`} className="text-ink underline decoration-line-strong underline-offset-4 hover:text-primary hover:decoration-primary">
                            {suburb.name}
                          </Link>
                        </th>
                        {anyHouse && (
                          <td className="py-3 px-4 text-right text-ink">
                            {suburb.medianHousePrice > 0 ? (
                              <Link href={`/suburbs/${suburb.slug}#market`} className="hover:text-primary" aria-label={`${suburb.name} house prices`}>
                                {formatPriceFull(suburb.medianHousePrice)}
                              </Link>
                            ) : "–"}
                          </td>
                        )}
                        {anyUnit && <td className="py-3 px-4 text-right text-ink-muted hidden sm:table-cell">{suburb.medianUnitPrice > 0 ? formatPriceFull(suburb.medianUnitPrice) : "–"}</td>}
                        {anySchools && <td className="py-3 px-4 text-right text-ink-muted hidden sm:table-cell">{suburb.schools.length || "–"}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <ul className="mt-6 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3 border-t border-line sm:border-t-0">
                {suburbs.map((suburb, i) => (
                  <li key={suburb.slug} className={`border-b border-line ${i < 2 ? "sm:border-t" : ""} ${i === 2 ? "lg:border-t" : ""}`}>
                    <Link href={`/suburbs/${suburb.slug}`} className="flex items-baseline justify-between gap-4 py-3 text-[15px] text-ink hover:text-primary transition-colors">
                      <span className="font-medium">{suburb.name}</span>
                      {suburb.schools.length > 0 && (
                        <span className="text-sm text-ink-muted">{`${suburb.schools.length} school${suburb.schools.length === 1 ? "" : "s"}`}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {(anyHouse || anyUnit) && (
              <p className="mt-3 text-sm text-ink-subtle max-w-3xl">
                Medians are shown only where the state or the ABS publishes one for the suburb; each profile gives the source and period.
              </p>
            )}
          </section>
        )}

        {/* Delivery names: what Australia Post calls its delivery centres,
            business centres and post offices in this postcode. Text, not
            profile links: they are not places people live, and their old
            profile URLs redirect here or to the suburb they sit in. */}
        {postalNames.length > 0 && (
          <section id="delivery-names" className="scroll-mt-20 max-w-4xl">
            <h2 className="text-2xl sm:text-3xl text-ink tracking-[-0.02em] mb-3">
              Postal delivery names in {postcode}
            </h2>
            <p className="text-base text-ink-muted mb-5 max-w-2xl">
              Australia Post uses {postalNames.length === 1 ? "this name" : "these names"} for mail
              in postcode {postcode}. {postalNames.length === 1 ? "It is not a suburb" : "They are not suburbs"},
              so there is no suburb profile to show.
            </p>
            <ul className="border-t border-line">
              {postalNames.map((p) => {
                const parent = p.parent ? suburbs.find((s) => s.slug === p.parent) : undefined;
                return (
                  <li key={p.slug} className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-line py-2.5 text-[15px]">
                    <span className="font-medium text-ink">{p.name}</span>
                    <span className="text-sm text-ink-muted">
                      {nonLocalityLabel(p.kind)}
                      {parent && (
                        <>
                          {" in "}
                          <Link href={`/suburbs/${parent.slug}`} className="underline decoration-line-strong underline-offset-4 hover:text-primary">
                            {parent.name}
                          </Link>
                        </>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
        </div>
      </Band>

      {/* Schools */}
      {allSchools.length > 0 && (
        <Band tone="quiet" spacing="compact">
          <section id="schools" className="scroll-mt-20 max-w-4xl">
            <SectionHeading size="md" title={<>Schools in postcode {postcode}</>} />
            <p className="mt-3 text-base text-ink-muted mb-6">
              Schools listed against the suburbs in this postcode, with their ICSEA (ACARA).
            </p>
            <div className="overflow-x-auto rounded-xl border border-line bg-surface-raised">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-warm border-b border-line text-left">
                    <th scope="col" className="py-3 px-4 font-semibold text-ink">School</th>
                    <th scope="col" className="py-3 px-4 font-semibold text-ink hidden sm:table-cell">Type</th>
                    <th scope="col" className="py-3 px-4 font-semibold text-ink hidden sm:table-cell">Sector</th>
                    <th scope="col" className="py-3 px-4 font-semibold text-ink text-right">ICSEA</th>
                    <th scope="col" className="py-3 px-4 font-semibold text-ink hidden md:table-cell">Suburb</th>
                  </tr>
                </thead>
                <tbody>
                  {allSchools.map((school, i) => {
                    const schoolSlug = school.acaraId ? makeSchoolSlug(school.name, school.acaraId) : null;
                    return (
                      <tr key={i} className="border-b border-line last:border-b-0">
                        <td className="py-3 px-4">
                          {schoolSlug ? (
                            <Link href={`/schools/${schoolSlug}`} className="font-medium text-ink hover:text-primary transition-colors">
                              {school.name}
                            </Link>
                          ) : (
                            <span className="font-medium text-ink">{school.name}</span>
                          )}
                          {school.yearRange && <span className="text-xs text-ink-subtle ml-2">{school.yearRange}</span>}
                        </td>
                        <td className="py-3 px-4 text-ink-muted capitalize hidden sm:table-cell">{school.type}</td>
                        <td className="py-3 px-4 text-ink-muted capitalize hidden sm:table-cell">{school.sector}</td>
                        <td className="py-3 px-4 text-right text-ink">{school.icsea ?? "–"}</td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <Link href={`/suburbs/${school.suburbSlug}/schools`} className="text-ink-muted hover:text-primary transition-colors">
                            {school.suburbName}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </Band>
      )}

      <Band tone={allSchools.length > 0 ? "light" : "quiet"} spacing="compact">
        <div className="space-y-14 sm:space-y-16">
        {/* Reverse-lookup FAQ. Visible Q&A backs the FAQPage schema above so
            Google can surface a direct answer for "what suburb is postcode X"
            and "what state is postcode X in". */}
        <section id="questions" className="scroll-mt-20 max-w-3xl">
          <SectionHeading size="md" title={<>Postcode {postcode} questions</>} />
          <dl className="mt-6 divide-y divide-line border-y border-line">
            {postcodeFaqs.map((faq) => (
              <div key={faq.question} className="py-4">
                <dt className="text-base font-semibold text-ink mb-1.5">{faq.question}</dt>
                <dd className="text-[15px] text-ink-muted leading-relaxed">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <SubpageNextSteps id="next" title={`Buying or selling in ${stateName}`} groups={nextSteps} />
        </div>
      </Band>
    </>
  );
}
