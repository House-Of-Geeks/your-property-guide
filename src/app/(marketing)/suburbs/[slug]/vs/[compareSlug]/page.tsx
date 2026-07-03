import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { Faq } from "@/components/guide";
import { MatchAgent, StickyMatchCTA } from "@/components/journey";
import { BreadcrumbJsonLd, PlaceJsonLd } from "@/components/seo";
import { getSuburbBySlug } from "@/lib/services/suburb-service";
import { formatPriceFull } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";
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

// Pre-render hand-curated popular comparisons at build time so the most-searched
// suburb-vs-suburb queries ship as static HTML. Other combinations are
// rendered on-demand and cached.
const POPULAR_COMPARISONS: { slug: string; compareSlug: string }[] = [
  // NSW
  { slug: "bondi-nsw-2026",         compareSlug: "coogee-nsw-2034" },
  { slug: "newtown-nsw-2042",       compareSlug: "surry-hills-nsw-2010" },
  { slug: "manly-nsw-2095",         compareSlug: "mosman-nsw-2088" },
  // VIC
  { slug: "richmond-vic-3121",      compareSlug: "fitzroy-vic-3065" },
  { slug: "toorak-vic-3142",        compareSlug: "brighton-vic-3186" },
  { slug: "carlton-vic-3053",       compareSlug: "south-yarra-vic-3141" },
  // QLD
  { slug: "new-farm-qld-4005",      compareSlug: "teneriffe-qld-4005" },
  { slug: "paddington-qld-4064",    compareSlug: "ashgrove-qld-4060" },
  { slug: "bulimba-qld-4171",       compareSlug: "hawthorne-qld-4171" },
];

export async function generateStaticParams() {
  // On-demand at build (the page queries the DB per comparison; prerendering
  // these during the build burst is unreliable against the Railway proxy).
  // dynamicParams + revalidate above render + cache each on first request.
  if (process.env.NEXT_PHASE === "phase-production-build") return [];
  return POPULAR_COMPARISONS;
}

export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const { slug, compareSlug } = await params;
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
    openGraph: {
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

function rowSideClass(side: "a" | "b", winner: Winner): string {
  if (winner === "none" || winner === "tie") return "text-ink";
  if (winner === side) return "text-emerald-700 font-semibold";
  return "text-ink-muted";
}

function rowDot(side: "a" | "b", winner: Winner): React.ReactNode {
  if (winner === "none" || winner === "tie") return null;
  if (winner !== side) return null;
  return (
    <span
      className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5 align-middle"
      aria-label="Better on this metric"
    />
  );
}

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

function fmtFlood(cls: string | null | undefined): string {
  if (!cls) return "–";
  return cls.charAt(0).toUpperCase() + cls.slice(1);
}

function fmtBushfire(risk: string | null | undefined): string {
  if (!risk) return "–";
  return risk.charAt(0).toUpperCase() + risk.slice(1);
}

// ─── Row component ───────────────────────────────────────────────────────────

function CompareRow({
  label,
  valA,
  valB,
  winner,
}: {
  label: string;
  valA: string;
  valB: string;
  winner: Winner;
}) {
  return (
    <div className="grid grid-cols-12 gap-4 py-3 border-b border-line last:border-b-0 items-baseline text-sm font-sans">
      <div className={`col-span-4 sm:col-span-4 text-right tabular-nums ${rowSideClass("a", winner)}`}>
        {rowDot("a", winner)}
        {valA}
      </div>
      <div className="col-span-4 sm:col-span-4 text-center text-xs uppercase tracking-[0.2em] text-ink-subtle">
        {label}
      </div>
      <div className={`col-span-4 sm:col-span-4 text-left tabular-nums ${rowSideClass("b", winner)}`}>
        {rowDot("b", winner)}
        {valB}
      </div>
    </div>
  );
}

function CompareSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-surface-raised p-6 sm:p-8">
      <h2 className="font-display text-xl text-ink mb-2">{title}</h2>
      <div className="border-t border-line">{children}</div>
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function SuburbVsPage({ params }: ComparePageProps) {
  const { slug, compareSlug } = await params;

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

  const suburbAName = suburbA.name;
  const suburbBName = suburbB.name;

  // Algorithmic narrative. Generates 2-paragraph intro, three persona
  // verdicts (buyers/investors/families), and 5-7 dynamic FAQs based
  // on the data gaps between the two suburbs. Deterministic, caches
  // cleanly under the 24h ISR.
  const narrative = buildCompareNarrative(suburbA, suburbB);

  function cmp(
    vA: number | null | undefined,
    vB: number | null | undefined,
    higherIsBetter = true,
  ): Winner {
    if (vA == null || vB == null) return "none";
    if (vA === vB) return "tie";
    return higherIsBetter ? (vA > vB ? "a" : "b") : (vA < vB ? "a" : "b");
  }

  // High-level synopsis. We score each suburb on 4 broad categories so the
  // article-style intro tells a story, not just numbers.
  const aWins =
    Number(cmp(a.medianHousePrice || null, b.medianHousePrice || null, false) === "a") +
    Number(cmp(a.annualGrowthHouse, b.annualGrowthHouse, true) === "a") +
    Number(cmp(a.walkScore, b.walkScore, true) === "a") +
    Number(cmp(icseaA, icseaB, true) === "a");
  const bWins =
    Number(cmp(a.medianHousePrice || null, b.medianHousePrice || null, false) === "b") +
    Number(cmp(a.annualGrowthHouse, b.annualGrowthHouse, true) === "b") +
    Number(cmp(a.walkScore, b.walkScore, true) === "b") +
    Number(cmp(icseaA, icseaB, true) === "b");

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
      />
      <PlaceJsonLd
        name={suburbB.name}
        url={"/suburbs/" + compareSlug}
        addressLocality={suburbB.name}
        addressRegion={suburbB.state}
        postalCode={suburbB.postcode}
      />

      {/* Editorial hero */}
      <section className="relative bg-surface-warm border-b border-line overflow-hidden">
        <Image
          src="/images/illustrations/contour.svg"
          alt=""
          width={1200}
          height={800}
          aria-hidden="true"
          className="absolute -right-40 -top-40 w-[1100px] max-w-none opacity-[0.10] pointer-events-none select-none"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pb-16">
          <div className="mb-8">
            <Breadcrumbs
              items={[
                { label: "Suburbs", href: "/suburbs" },
                { label: suburbAName, href: `/suburbs/${slug}` },
                { label: `vs ${suburbBName}` },
              ]}
            />
          </div>

          <div className="flex items-center gap-4 mb-10">
            <span className="font-display italic text-primary text-base sm:text-lg leading-none">
              Side by side
            </span>
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
              Suburb comparison
            </span>
          </div>
          <h1 className="font-display text-ink leading-[0.98] tracking-tight text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-10 max-w-[20ch] font-medium">
            {suburbAName}{" "}
            <span className="italic font-light text-primary">vs</span>{" "}
            {suburbBName}.
          </h1>
          <p className="font-display font-light text-xl sm:text-2xl text-ink leading-[1.25] max-w-3xl">
            {a.medianHousePrice > 0 && b.medianHousePrice > 0 ? (
              <>
                Comparing two suburbs with median house prices of{" "}
                <strong className="text-ink font-medium">{formatPriceFull(a.medianHousePrice)}</strong>{" "}
                and{" "}
                <strong className="text-ink font-medium">{formatPriceFull(b.medianHousePrice)}</strong>.
              </>
            ) : (
              <>Suburb-to-suburb comparison across price, growth, lifestyle, schools and risk.</>
            )}
            {aWins > bWins && (
              <> {suburbAName} edges out on more headline metrics in this comparison.</>
            )}
            {bWins > aWins && (
              <> {suburbBName} edges out on more headline metrics in this comparison.</>
            )}
          </p>

          {/* Algorithmic comparative narrative. Two paragraphs that
              read like a property column lede — anchored to the actual
              gaps in the data, not generic "compare two suburbs" copy. */}
          {narrative.intro.length > 0 && (
            <div className="mt-8 space-y-4 max-w-3xl">
              {narrative.intro.map((para, i) => (
                <p key={i} className="font-sans text-base sm:text-lg text-ink-muted leading-[1.7]">
                  {para}
                </p>
              ))}
            </div>
          )}

          {/* Two suburb header cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
            {[
              { suburb: suburbA, slug: slug, stats: a },
              { suburb: suburbB, slug: compareSlug, stats: b },
            ].map(({ suburb, slug: s, stats }) => (
              <Link
                key={s}
                href={`/suburbs/${s}`}
                className="rounded-2xl border border-line bg-surface-raised p-5 hover:border-primary/40 hover:shadow-md transition-all group"
              >
                <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-1">
                  {suburb.state} &middot; {suburb.postcode}
                </p>
                <h2 className="font-display text-2xl text-ink group-hover:text-primary transition-colors leading-tight">
                  {suburb.name}
                </h2>
                {stats.medianHousePrice > 0 && (
                  <p className="mt-3 font-sans text-sm text-ink-muted">
                    Median house{" "}
                    <span className="font-display text-base text-ink">
                      {formatPriceFull(stats.medianHousePrice)}
                    </span>
                  </p>
                )}
                {stats.annualGrowthHouse != null && (
                  <p className="mt-1 font-sans text-sm text-ink-muted">
                    Growth{" "}
                    <span
                      className={`font-display text-base ${stats.annualGrowthHouse >= 0 ? "text-emerald-700" : "text-red-700"}`}
                    >
                      {stats.annualGrowthHouse >= 0 ? "+" : ""}
                      {stats.annualGrowthHouse.toFixed(1)}%
                    </span>
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Persona verdicts — moved ABOVE the stat tables in the
            2026-05 education-led reposition. The page now leads with
            "which suburb suits which buyer" (interpretation) and
            "common questions" (FAQ) before getting into the data
            tables. Education first, data as supporting evidence. */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <span className="font-display italic text-primary text-base sm:text-lg leading-none">
              The take
            </span>
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
              Which suburb suits which buyer
            </span>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-line bg-surface-raised p-6">
              <p className="text-[11px] font-sans uppercase tracking-[0.22em] text-cta mb-3">
                For buyers
              </p>
              <p className="font-sans text-sm sm:text-base text-ink leading-relaxed">
                {narrative.verdicts.forBuyers}
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-surface-raised p-6">
              <p className="text-[11px] font-sans uppercase tracking-[0.22em] text-cta mb-3">
                For investors
              </p>
              <p className="font-sans text-sm sm:text-base text-ink leading-relaxed">
                {narrative.verdicts.forInvestors}
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-surface-raised p-6">
              <p className="text-[11px] font-sans uppercase tracking-[0.22em] text-cta mb-3">
                For families
              </p>
              <p className="font-sans text-sm sm:text-base text-ink leading-relaxed">
                {narrative.verdicts.forFamilies}
              </p>
            </div>
          </div>
        </section>

        {/* FAQ also moved up. Dynamic per-pair questions, FAQPage
            schema attached for rich-snippet eligibility on the
            "X vs Y" SERPs. */}
        {narrative.faqs.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-6">
              <span className="font-display italic text-primary text-base sm:text-lg leading-none">
                Common questions
              </span>
              <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
              <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
                {suburbAName} vs {suburbBName}
              </span>
            </div>
            <div className="max-w-3xl">
              <Faq items={narrative.faqs} />
            </div>
          </section>
        )}

        {/* Stat tables. Now framed as supporting evidence for the
            verdict above, not the headline. Eyebrow makes that clear. */}
        <div className="pt-4 border-t border-line">
          <p className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium mb-3">
            The numbers behind the take
          </p>
        </div>

        {/* Sticky column legend */}
        <div className="grid grid-cols-12 gap-4 text-center text-sm font-sans border-b border-line pb-3 sticky top-0 bg-surface-warm/95 backdrop-blur z-10 pt-3 -mx-4 px-4">
          <div className="col-span-4 text-right font-display text-base text-ink truncate">
            {suburbAName}
          </div>
          <div className="col-span-4 text-xs text-ink-subtle uppercase tracking-[0.2em] self-center">
            Metric
          </div>
          <div className="col-span-4 text-left font-display text-base text-ink truncate">
            {suburbBName}
          </div>
        </div>

        <CompareSection title="Price &amp; Market">
          <CompareRow
            label="Median house"
            valA={a.medianHousePrice > 0 ? formatPriceFull(a.medianHousePrice) : "–"}
            valB={b.medianHousePrice > 0 ? formatPriceFull(b.medianHousePrice) : "–"}
            winner={cmp(a.medianHousePrice || null, b.medianHousePrice || null, false)}
          />
          <CompareRow
            label="Median unit"
            valA={a.medianUnitPrice > 0 ? formatPriceFull(a.medianUnitPrice) : "–"}
            valB={b.medianUnitPrice > 0 ? formatPriceFull(b.medianUnitPrice) : "–"}
            winner={cmp(a.medianUnitPrice || null, b.medianUnitPrice || null, false)}
          />
          <CompareRow
            label="Annual growth (house)"
            valA={a.annualGrowthHouse != null ? `${a.annualGrowthHouse >= 0 ? "+" : ""}${a.annualGrowthHouse.toFixed(1)}%` : "–"}
            valB={b.annualGrowthHouse != null ? `${b.annualGrowthHouse >= 0 ? "+" : ""}${b.annualGrowthHouse.toFixed(1)}%` : "–"}
            winner={cmp(a.annualGrowthHouse, b.annualGrowthHouse, true)}
          />
          <CompareRow
            label="Days on market"
            valA={a.daysOnMarket > 0 ? `${a.daysOnMarket} days` : "–"}
            valB={b.daysOnMarket > 0 ? `${b.daysOnMarket} days` : "–"}
            winner={cmp(a.daysOnMarket || null, b.daysOnMarket || null, false)}
          />
        </CompareSection>

        <CompareSection title="Rental">
          <CompareRow
            label="Rent (house / wk)"
            valA={a.medianRentHouse > 0 ? `$${a.medianRentHouse}/wk` : "–"}
            valB={b.medianRentHouse > 0 ? `$${b.medianRentHouse}/wk` : "–"}
            winner="none"
          />
          <CompareRow
            label="Rent (unit / wk)"
            valA={a.medianRentUnit > 0 ? `$${a.medianRentUnit}/wk` : "–"}
            valB={b.medianRentUnit > 0 ? `$${b.medianRentUnit}/wk` : "–"}
            winner="none"
          />
          <CompareRow
            label="Owner occupied"
            valA={a.ownerOccupied > 0 ? `${a.ownerOccupied.toFixed(1)}%` : "–"}
            valB={b.ownerOccupied > 0 ? `${b.ownerOccupied.toFixed(1)}%` : "–"}
            winner={cmp(a.ownerOccupied || null, b.ownerOccupied || null, true)}
          />
          <CompareRow
            label="Renter occupied"
            valA={a.renterOccupied > 0 ? `${a.renterOccupied.toFixed(1)}%` : "–"}
            valB={b.renterOccupied > 0 ? `${b.renterOccupied.toFixed(1)}%` : "–"}
            winner="none"
          />
        </CompareSection>

        <CompareSection title="Lifestyle &amp; Demographics">
          <CompareRow
            label="Walk score"
            valA={fmtScore(a.walkScore)}
            valB={fmtScore(b.walkScore)}
            winner={cmp(a.walkScore, b.walkScore, true)}
          />
          <CompareRow
            label="Transit score"
            valA={fmtScore(a.transitScore)}
            valB={fmtScore(b.transitScore)}
            winner={cmp(a.transitScore, b.transitScore, true)}
          />
          <CompareRow
            label="Bike score"
            valA={fmtScore(a.bikeScore)}
            valB={fmtScore(b.bikeScore)}
            winner={cmp(a.bikeScore, b.bikeScore, true)}
          />
          <CompareRow
            label="Population"
            valA={a.population > 0 ? a.population.toLocaleString() : "–"}
            valB={b.population > 0 ? b.population.toLocaleString() : "–"}
            winner="none"
          />
          <CompareRow
            label="Median age"
            valA={a.medianAge > 0 ? String(a.medianAge) : "–"}
            valB={b.medianAge > 0 ? String(b.medianAge) : "–"}
            winner="none"
          />
        </CompareSection>

        <CompareSection title="Risk &amp; Hazard">
          <CompareRow
            label="Flood class"
            valA={fmtFlood(suburbA.hazard?.floodClass)}
            valB={fmtFlood(suburbB.hazard?.floodClass)}
            winner={
              suburbA.hazard?.floodClass && suburbB.hazard?.floodClass
                ? cmp(floodA, floodB, true)
                : "none"
            }
          />
          <CompareRow
            label="Bushfire risk"
            valA={fmtBushfire(suburbA.hazard?.bushfireRisk)}
            valB={fmtBushfire(suburbB.hazard?.bushfireRisk)}
            winner={
              suburbA.hazard?.bushfireRisk && suburbB.hazard?.bushfireRisk
                ? cmp(bushfireA, bushfireB, true)
                : "none"
            }
          />
        </CompareSection>

        <CompareSection title="Schools">
          <CompareRow
            label="Schools nearby"
            valA={String(schoolCountA)}
            valB={String(schoolCountB)}
            winner={cmp(schoolCountA, schoolCountB, true)}
          />
          <CompareRow
            label="Avg ICSEA"
            valA={icseaA !== null ? String(icseaA) : "–"}
            valB={icseaB !== null ? String(icseaB) : "–"}
            winner={cmp(icseaA, icseaB, true)}
          />
        </CompareSection>

        <CompareSection title="Climate">
          <CompareRow
            label="Annual rainfall"
            valA={suburbA.climate?.annualRainfallMm != null ? `${Math.round(suburbA.climate.annualRainfallMm)} mm` : "–"}
            valB={suburbB.climate?.annualRainfallMm != null ? `${Math.round(suburbB.climate.annualRainfallMm)} mm` : "–"}
            winner="none"
          />
          <CompareRow
            label="Mean max (Jan)"
            valA={
              suburbA.climate?.meanMaxTemp?.[0] != null
                ? `${fmtFloat(suburbA.climate.meanMaxTemp[0])}°C`
                : "–"
            }
            valB={
              suburbB.climate?.meanMaxTemp?.[0] != null
                ? `${fmtFloat(suburbB.climate.meanMaxTemp[0])}°C`
                : "–"
            }
            winner="none"
          />
        </CompareSection>

        {/* Legend */}
        <p className="text-xs font-sans text-ink-subtle text-center">
          Green dot = better on that metric (lower price, higher growth, higher walkability,
          lower risk).
        </p>

        {/* CTA buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <Link
            href={`/suburbs/${slug}`}
            className="group flex items-center justify-between rounded-2xl border border-line bg-surface-raised px-6 py-4 hover:border-primary/40 hover:shadow-md transition-all"
          >
            <span className="font-display text-lg text-ink group-hover:text-primary transition-colors">
              Full {suburbAName} profile
            </span>
            <ArrowRight className="w-4 h-4 text-ink-subtle group-hover:text-primary transition-colors" />
          </Link>
          <Link
            href={`/suburbs/${compareSlug}`}
            className="group flex items-center justify-between rounded-2xl border border-line bg-surface-raised px-6 py-4 hover:border-primary/40 hover:shadow-md transition-all"
          >
            <span className="font-display text-lg text-ink group-hover:text-primary transition-colors">
              Full {suburbBName} profile
            </span>
            <ArrowRight className="w-4 h-4 text-ink-subtle group-hover:text-primary transition-colors" />
          </Link>
        </div>

        {/* Compare with more */}
        {suburbA.nearbySuburbs.length > 0 && (
          <div className="rounded-2xl border border-line bg-surface-warm p-6">
            <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-4">
              Compare {suburbAName} against another suburb
            </p>
            <div className="flex flex-wrap gap-2">
              {suburbA.nearbySuburbs
                .filter((s) => s !== compareSlug)
                .slice(0, 12)
                .map((s) => {
                  const label = s
                    .split("-")
                    .slice(0, -2)
                    .join(" ")
                    .replace(/\b\w/g, (c) => c.toUpperCase());
                  return (
                    <Link
                      key={s}
                      href={`/suburbs/${slug}/vs/${s}`}
                      className="inline-flex items-center rounded-lg border border-line bg-surface-raised px-3 py-1.5 text-sm font-sans font-medium text-ink hover:border-primary/40 hover:text-primary transition-colors"
                    >
                      vs {label}
                    </Link>
                  );
                })}
            </div>
            <p className="mt-5 text-sm font-sans text-ink-muted">
              Or{" "}
              <Link
                href="/compare"
                className="font-medium text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
              >
                compare any two suburbs nationally →
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* MatchAgent — visitors who got this far are evaluating two
          options and likely high-intent. Drop the lead form right
          where the decision is being made. Intent defaults to buying
          since most comparison traffic is purchase-led. */}
      <Suspense fallback={null}>
        <MatchAgent initialIntent="buying" />
      </Suspense>

      {/* Persistent sticky CTA — slides in once the visitor has
          scrolled past 30% of the comparison. Suburb-aware label
          uses the first suburb so the bar feels contextual. */}
      <StickyMatchCTA
        suburb={slug}
        intent="buying"
        dismissKey={`compare:${slug}-vs-${compareSlug}`}
      />
    </>
  );
}
