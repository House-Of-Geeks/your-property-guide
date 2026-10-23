import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Faq } from "@/components/guide";
import { SuburbSubrouteHeader, SubrouteActionCard, SubpageNextSteps, type NextStepGroup } from "@/components/suburb";
import { BUTTON_PRIMARY, Band } from "@/components/premium";
import { BreadcrumbJsonLd, PlaceJsonLd } from "@/components/seo";
import { getSuburbBySlug } from "@/lib/services/suburb-service";
import { getNearbySubpages } from "@/lib/services/nearby-subpages";
import { nonLocalityBySlug } from "@/lib/non-localities";
import { canonicalComparePath } from "@/lib/suburb-indexability";
import { POPULAR_COMPARE_PAIRS, isAllowedComparePair } from "@/lib/compare-pairs";
import { publishedGrowthFor } from "@/lib/published-medians";
import { hasReliablePrice } from "@/lib/suburb-data-quality";
import { januaryMeanMax } from "@/lib/climate";
import { guideFunnelHref } from "@/lib/guide-funnel";
import { formatPriceFull } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";
import { suburbPlaceProps } from "@/lib/utils/lga";
import {
  buildCompareNarrative,
  buildCompareMetaDescription,
} from "@/lib/compare-narrative";
import type { Suburb } from "@/types";

interface ComparePageProps {
  params: Promise<{ slug: string; compareSlug: string }>;
}

export const dynamicParams = true;
// 7d ISR — the comparison narrative is generated from suburb data
// that refreshes weekly via the sync worker. 24h was overkill and
// burned function invocations on a ~50,000-URL compare surface.
export const revalidate = 604800;

const POPULAR_COMPARISONS = POPULAR_COMPARE_PAIRS.map((p) => ({ slug: p.aSlug, compareSlug: p.bSlug }));

export async function generateStaticParams() {
  // On-demand at build (the page queries the DB per comparison; prerendering
  // these during the build burst is unreliable against the Railway proxy).
  // dynamicParams + revalidate above render + cache each on first request.
  if (process.env.NEXT_PHASE === "phase-production-build") return [];
  return POPULAR_COMPARISONS;
}

// Only the published pairs render (lib/compare-pairs.ts: the popular list plus
// the sitemap pairs, about 650 in total, too many to prerender at build, so
// dynamicParams stays on). Any other pair is a 404 before the first database
// query. A postal-name slug is let through: the page redirects it to the real
// suburb, and the redirect target is checked on its own request.
async function requirePublishedPair(slug: string, compareSlug: string): Promise<void> {
  if (nonLocalityBySlug(compareSlug)) return;
  if (!(await isAllowedComparePair(slug, compareSlug))) notFound();
}

export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const { slug, compareSlug } = await params;
  await requirePublishedPair(slug, compareSlug);
  const [suburbA, suburbB] = await Promise.all([
    getSuburbBySlug(slug),
    getSuburbBySlug(compareSlug),
  ]);
  if (!suburbA || !suburbB) return { title: "Suburb Not Found" };

  // Title: front-load the suburb names (what people search) and the
  // year for freshness. Root layout template appends the brand, so we
  // don't suffix it here (avoids the "| YPG | YPG" duplication).
  const title = `${suburbA.name} vs ${suburbB.name}: Property Prices, Schools & Market Data 2026`;
  // Description built from the actual data, so each pair's description
  // is unique and informative — much better than a static template.
  const description = buildCompareMetaDescription(suburbA, suburbB);

  // Build a custom OG via the guide handler, it accepts arbitrary title/desc
  const ogTitle = `${suburbA.name} vs ${suburbB.name}`;
  const ogDesc = `Median, growth, schools, walkability and risk side by side.`;
  const ogParams = new URLSearchParams({
    title: ogTitle,
    desc: ogDesc,
    persona: "Compare suburbs",
  });
  const ogImage = `${SITE_URL}/api/og/guide/${slug}-vs-${compareSlug}?${ogParams.toString()}`;

  // /A/vs/B and /B/vs/A render the same comparison, so both directions
  // canonicalise to the lexicographic ordering of the pair — the same
  // `.sort()` rule the compare sitemap dedupes with — instead of each
  // direction self-canonicalising and splitting the pair's signals.
  const [pairA, pairB] = [slug, compareSlug].sort();
  const canonicalUrl = `${SITE_URL}/suburbs/${pairA}/vs/${pairB}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { ...DEFAULT_OG,
      url: canonicalUrl,
      title,
      description,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${suburbA.name} vs ${suburbB.name}` }],
    },
    twitter: { card: "summary_large_image" },
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

type Winner = "a" | "b" | "tie" | "none";

function floodRiskScore(cls: string | null | undefined): number {
  if (!cls) return 0;
  const map: Record<string, number> = { floodway: 0, high: 1, medium: 2, low: 3 };
  return map[cls.toLowerCase()] ?? 0;
}

function bushfireRiskScore(risk: string | null | undefined): number {
  if (!risk) return 0;
  const map: Record<string, number> = { high: 0, medium: 1, low: 2 };
  return map[risk.toLowerCase()] ?? 0;
}

function avgIcsea(schools: Suburb["schools"]): number | null {
  const withIcsea = schools.filter((s) => s.icsea !== null);
  if (withIcsea.length === 0) return null;
  return Math.round(
    withIcsea.reduce((sum, s) => sum + (s.icsea ?? 0), 0) / withIcsea.length
  );
}

function fmtScore(val: number | null): string {
  return val !== null ? String(val) : "–";
}

function fmtFloat(val: number | null | undefined, decimals = 1): string {
  if (val == null) return "–";
  return val.toFixed(decimals);
}

function capitalise(v: string | null | undefined): string {
  if (!v) return "–";
  return v.charAt(0).toUpperCase() + v.slice(1);
}

const fmtGrowth = (g: number) => (g ? `${g > 0 ? "+" : ""}${g.toFixed(1)}%` : "–");

// ─── Table ───────────────────────────────────────────────────────────────────

interface Row {
  label: string;
  a: React.ReactNode;
  b: React.ReactNode;
  /** True when neither side has a figure: the row is left out. */
  empty: boolean;
  winner: Winner;
}

function row(label: string, a: string, b: string, winner: Winner = "none"): Row {
  return { label, a, b, empty: a === "–" && b === "–", winner };
}

function Cell({ side, r }: { side: "a" | "b"; r: Row }) {
  const better = r.winner === side;
  return (
    <td className={`py-3 px-3 sm:px-4 text-right whitespace-nowrap ${better ? "font-semibold text-ink" : "text-ink-muted"}`}>
      {better && <span className="inline-block w-1.5 h-1.5 rounded-full bg-success mr-1.5 align-middle" aria-label="Better on this measure" />}
      {side === "a" ? r.a : r.b}
    </td>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function SuburbVsPage({ params }: ComparePageProps) {
  const { slug, compareSlug } = await params;
  await requirePublishedPair(slug, compareSlug);

  // "Morayfield vs Caboolture BC" compared a suburb with a mail centre. The
  // comparison moves to the real suburb, or back to the profile when there is
  // none (or when it would compare the suburb with itself).
  const postalName = nonLocalityBySlug(compareSlug);
  if (postalName) {
    permanentRedirect(
      postalName.parent && postalName.parent !== slug
        ? `/suburbs/${slug}/vs/${postalName.parent}`
        : `/suburbs/${slug}`,
    );
  }

  const [suburbA, suburbB] = await Promise.all([
    getSuburbBySlug(slug),
    getSuburbBySlug(compareSlug),
  ]);

  if (!suburbA || !suburbB) notFound();

  const a = suburbA.stats;
  const b = suburbB.stats;

  const schoolCountA = suburbA.schools.length;
  const schoolCountB = suburbB.schools.length;
  const icseaA = avgIcsea(suburbA.schools);
  const icseaB = avgIcsea(suburbB.schools);

  const floodA = floodRiskScore(suburbA.hazard?.floodClass);
  const floodB = floodRiskScore(suburbB.hazard?.floodClass);
  const bushfireA = bushfireRiskScore(suburbA.hazard?.bushfireRisk);
  const bushfireB = bushfireRiskScore(suburbB.hazard?.bushfireRisk);

  // A 12-month change only where the feed measures one: 0 is "not
  // measured", never "+0.0%" (review 10 Oct 2026, suburbs 0.4).
  const growthA = publishedGrowthFor(suburbA);
  const growthB = publishedGrowthFor(suburbB);

  const suburbAName = suburbA.name;
  const suburbBName = suburbB.name;

  // Algorithmic narrative: the answer sentence (price and growth), a
  // paragraph on schools and walkability, three persona verdicts and the
  // per-pair FAQs. Deterministic, caches cleanly under the ISR.
  const narrative = buildCompareNarrative(suburbA, suburbB);
  const nearbyA = (await getNearbySubpages(suburbA.nearbySuburbs.filter((s) => s !== compareSlug))).slice(0, 6);
  const nearbyB = (await getNearbySubpages(suburbB.nearbySuburbs.filter((s) => s !== slug))).slice(0, 6);

  function cmp(
    vA: number | null | undefined,
    vB: number | null | undefined,
    higherIsBetter = true,
  ): Winner {
    if (vA == null || vB == null) return "none";
    if (vA === vB) return "tie";
    return higherIsBetter ? (vA > vB ? "a" : "b") : (vA < vB ? "a" : "b");
  }

  // The median cell links to the suburb's own price section, anchored
  // "{Suburb} median house price" (review 10 Oct 2026, suburbs 3.1).
  const medianCell = (s: Suburb, slugFor: string) =>
    s.stats.medianHousePrice > 0 ? (
      <Link
        href={`/suburbs/${slugFor}#market`}
        className="underline decoration-line-strong underline-offset-4 hover:text-primary hover:decoration-primary"
        aria-label={`${s.name} median house price`}
      >
        {formatPriceFull(s.stats.medianHousePrice)}
      </Link>
    ) : "–";

  const sections: { title: string; rows: Row[] }[] = [
    {
      title: "Price and market",
      rows: [
        {
          label: "Median house",
          a: medianCell(suburbA, slug),
          b: medianCell(suburbB, compareSlug),
          empty: !(a.medianHousePrice > 0) && !(b.medianHousePrice > 0),
          winner: cmp(a.medianHousePrice || null, b.medianHousePrice || null, false),
        },
        row("Median unit", a.medianUnitPrice > 0 ? formatPriceFull(a.medianUnitPrice) : "–", b.medianUnitPrice > 0 ? formatPriceFull(b.medianUnitPrice) : "–", cmp(a.medianUnitPrice || null, b.medianUnitPrice || null, false)),
        row("House price change, 12 months", fmtGrowth(growthA), fmtGrowth(growthB), cmp(growthA || null, growthB || null, true)),
        row("Days on market", a.daysOnMarket > 0 ? `${a.daysOnMarket} days` : "–", b.daysOnMarket > 0 ? `${b.daysOnMarket} days` : "–", cmp(a.daysOnMarket || null, b.daysOnMarket || null, false)),
      ],
    },
    {
      title: "Renting",
      rows: [
        row("House rent", a.medianRentHouse > 0 ? `$${a.medianRentHouse}/wk` : "–", b.medianRentHouse > 0 ? `$${b.medianRentHouse}/wk` : "–"),
        row("Unit rent", a.medianRentUnit > 0 ? `$${a.medianRentUnit}/wk` : "–", b.medianRentUnit > 0 ? `$${b.medianRentUnit}/wk` : "–"),
        row("Owner occupied", a.ownerOccupied > 0 ? `${a.ownerOccupied.toFixed(1)}%` : "–", b.ownerOccupied > 0 ? `${b.ownerOccupied.toFixed(1)}%` : "–", cmp(a.ownerOccupied || null, b.ownerOccupied || null, true)),
        row("Renter occupied", a.renterOccupied > 0 ? `${a.renterOccupied.toFixed(1)}%` : "–", b.renterOccupied > 0 ? `${b.renterOccupied.toFixed(1)}%` : "–"),
      ],
    },
    {
      title: "Schools",
      rows: [
        row("Schools nearby", String(schoolCountA), String(schoolCountB), cmp(schoolCountA, schoolCountB, true)),
        row("Average ICSEA", icseaA !== null ? String(icseaA) : "–", icseaB !== null ? String(icseaB) : "–", cmp(icseaA, icseaB, true)),
      ],
    },
    {
      title: "Lifestyle and people",
      rows: [
        row("Walk score", fmtScore(a.walkScore), fmtScore(b.walkScore), cmp(a.walkScore, b.walkScore, true)),
        row("Transit score", fmtScore(a.transitScore), fmtScore(b.transitScore), cmp(a.transitScore, b.transitScore, true)),
        row("Bike score", fmtScore(a.bikeScore), fmtScore(b.bikeScore), cmp(a.bikeScore, b.bikeScore, true)),
        row("Population", a.population > 0 ? a.population.toLocaleString("en-AU") : "–", b.population > 0 ? b.population.toLocaleString("en-AU") : "–"),
        row("Median age", a.medianAge > 0 ? String(a.medianAge) : "–", b.medianAge > 0 ? String(b.medianAge) : "–"),
      ],
    },
    {
      title: "Risk",
      rows: [
        row("Flood class", capitalise(suburbA.hazard?.floodClass), capitalise(suburbB.hazard?.floodClass),
          suburbA.hazard?.floodClass && suburbB.hazard?.floodClass ? cmp(floodA, floodB, true) : "none"),
        row("Bushfire risk", capitalise(suburbA.hazard?.bushfireRisk), capitalise(suburbB.hazard?.bushfireRisk),
          suburbA.hazard?.bushfireRisk && suburbB.hazard?.bushfireRisk ? cmp(bushfireA, bushfireB, true) : "none"),
      ],
    },
    {
      title: "Climate",
      rows: [
        row("Annual rainfall",
          suburbA.climate?.annualRainfallMm != null ? `${Math.round(suburbA.climate.annualRainfallMm)} mm` : "–",
          suburbB.climate?.annualRainfallMm != null ? `${Math.round(suburbB.climate.annualRainfallMm)} mm` : "–"),
        row("Mean max, January",
          januaryMeanMax(suburbA.climate) != null ? `${fmtFloat(januaryMeanMax(suburbA.climate))}°C` : "–",
          januaryMeanMax(suburbB.climate) != null ? `${fmtFloat(januaryMeanMax(suburbB.climate))}°C` : "–"),
      ],
    },
  ]
    .map((sec) => ({ ...sec, rows: sec.rows.filter((r) => !r.empty) }))
    .filter((sec) => sec.rows.length > 0);

  // The answer: the price and growth sentence when both medians are
  // published, else what the page compares.
  const answer = narrative.intro[0] ?? `${suburbAName} and ${suburbBName} side by side: prices, rents, schools, walkability and risk, from each suburb's published data.`;
  const lifestyle = narrative.intro.length > 1 ? narrative.intro[1] : null;

  const buyHref = guideFunnelHref("buying", { suburb: slug, from: "suburb-vs" });
  const nextSteps: NextStepGroup[] = [
    {
      title: "The two suburbs",
      links: [
        { href: `/suburbs/${slug}`, label: `${suburbAName} suburb profile` },
        { href: `/suburbs/${compareSlug}`, label: `${suburbBName} suburb profile` },
        ...(hasReliablePrice(suburbA) ? [{ href: `/suburbs/${slug}#market`, label: `${suburbAName} house prices` }] : []),
        ...(hasReliablePrice(suburbB) ? [{ href: `/suburbs/${compareSlug}#market`, label: `${suburbBName} house prices` }] : []),
      ],
    },
    {
      title: `Compare ${suburbAName} with`,
      links: nearbyA.map((n) => ({ href: canonicalComparePath(slug, n.slug), label: `${suburbAName} vs ${n.name}` })),
    },
    {
      title: `Compare ${suburbBName} with`,
      links: [
        ...nearbyB.map((n) => ({ href: canonicalComparePath(compareSlug, n.slug), label: `${suburbBName} vs ${n.name}` })),
        { href: "/compare", label: "Compare any two suburbs" },
      ],
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Suburbs", url: "/suburbs" },
          { name: suburbAName, url: `/suburbs/${slug}` },
          { name: `vs ${suburbBName}`, url: `/suburbs/${slug}/vs/${compareSlug}` },
        ]}
      />
      {/* Place nodes for both suburbs, matching the entities emitted on
          each suburb's own profile page so Google can connect this
          comparison to both suburb records. FAQPage schema is already
          emitted by the <Faq> block below. */}
      <PlaceJsonLd
        name={suburbA.name}
        url={"/suburbs/" + slug}
        addressLocality={suburbA.name}
        addressRegion={suburbA.state}
        postalCode={suburbA.postcode}
        {...suburbPlaceProps(suburbA)}
      />
      <PlaceJsonLd
        name={suburbB.name}
        url={"/suburbs/" + compareSlug}
        addressLocality={suburbB.name}
        addressRegion={suburbB.state}
        postalCode={suburbB.postcode}
        {...suburbPlaceProps(suburbB)}
      />

      <SuburbSubrouteHeader
        suburb={suburbA}
        title={`${suburbAName} vs ${suburbBName}`}
        subtitle={<p>{answer}</p>}
        breadcrumbLeaf={`vs ${suburbBName}`}
        action={
          // Comparison traffic is mostly buyers choosing between two
          // suburbs: the buying guide. (The match form that sat at the end
          // offered buyers an agent introduction we do not provide.)
          <SubrouteActionCard
            heading={`Buying in ${suburbAName} or ${suburbBName}?`}
            body="The free buying guide: what you can really spend, the schemes and stamp duty in your state, inspecting, and making the offer."
            href={buyHref}
            cta="Get the free buying guide"
          >
            <p>
              {`Selling in ${suburbAName}? `}
              <Link
                href={guideFunnelHref("selling", { suburb: slug, from: "suburb-vs" })}
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
          {/* The numbers, side by side. Rows with no figure on either side
              are left out. */}
          <section id="side-by-side" className="scroll-mt-20 max-w-4xl">
            <h2 className="font-display text-2xl sm:text-3xl font-normal text-ink tracking-[-0.03em] mb-5">
              {`${suburbAName} and ${suburbBName} side by side`}
            </h2>
            <div className="overflow-x-auto rounded-xl border border-line">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="py-3 px-3 sm:px-4 text-left font-normal text-ink-muted w-[40%]"><span className="sr-only">Measure</span></th>
                    <th scope="col" className="py-3 px-3 sm:px-4 text-right font-semibold text-ink">
                      <Link href={`/suburbs/${slug}`} className="hover:text-primary">{suburbAName}</Link>
                    </th>
                    <th scope="col" className="py-3 px-3 sm:px-4 text-right font-semibold text-ink">
                      <Link href={`/suburbs/${compareSlug}`} className="hover:text-primary">{suburbBName}</Link>
                    </th>
                  </tr>
                </thead>
                {sections.map((sec) => (
                  <tbody key={sec.title}>
                    <tr className="bg-surface-warm border-b border-line">
                      <th scope="colgroup" colSpan={3} className="py-2 px-3 sm:px-4 text-left text-[13px] font-semibold text-ink">{sec.title}</th>
                    </tr>
                    {sec.rows.map((r) => (
                      <tr key={r.label} className="border-b border-line last:border-0">
                        <th scope="row" className="py-3 px-3 sm:px-4 text-left font-normal text-ink-muted">{r.label}</th>
                        <Cell side="a" r={r} />
                        <Cell side="b" r={r} />
                      </tr>
                    ))}
                  </tbody>
                ))}
              </table>
            </div>
            <p className="mt-3 font-sans text-xs text-ink-subtle leading-relaxed">
              Green dot: better on that measure (lower price, higher growth, higher walkability, lower risk). Each suburb&rsquo;s profile gives the source and period of its figures.
            </p>
          </section>

          {/* Which suburb suits which buyer. */}
          <section id="verdicts" className="scroll-mt-20">
            <h2 className="font-display text-2xl sm:text-3xl font-normal text-ink tracking-[-0.03em] mb-4">Which suits whom</h2>
            {lifestyle && <p className="font-sans text-base text-ink leading-relaxed max-w-3xl mb-6">{lifestyle}</p>}
            <dl className="grid gap-x-10 md:grid-cols-3 border-t border-line">
              {[
                { k: "For buyers", v: narrative.verdicts.forBuyers },
                { k: "For investors", v: narrative.verdicts.forInvestors },
                { k: "For families", v: narrative.verdicts.forFamilies },
              ].map(({ k, v }) => (
                <div key={k} className="border-b border-line md:border-b-0 py-4">
                  <dt className="font-sans text-sm font-semibold text-ink mb-1.5">{k}</dt>
                  <dd className="font-sans text-[15px] text-ink-muted leading-relaxed">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Dynamic per-pair questions; <Faq> emits the FAQPage schema. */}
          {narrative.faqs.length > 0 && (
            <div className="max-w-3xl [&>section]:my-0">
              <Faq items={narrative.faqs} title={`${suburbAName} vs ${suburbBName}: common questions`} />
            </div>
          )}
        </div>
      </Band>

      <Band tone="quiet" spacing="compact">
        <div className="space-y-12 sm:space-y-16">
          <SubpageNextSteps id="next" title="Keep comparing" groups={nextSteps} />

          {/* The same one action, once more where the page ends. */}
          <section className="tone-dark rounded-xl bg-surface-inverse p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-normal text-ink tracking-[-0.03em]">Choosing between {suburbAName} and {suburbBName}?</h2>
              <p className="font-sans text-sm text-ink-muted mt-1.5 max-w-xl">The free buying guide: budget, schemes, inspections and how not to overpay.</p>
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
