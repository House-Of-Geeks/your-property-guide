import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Home, TrendingUp } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { Badge, Button } from "@/components/ui";
import { getSuburbBySlug } from "@/lib/services/suburb-service";
import { formatPriceFull } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";
import type { Suburb } from "@/types";

interface ComparePageProps {
  params: Promise<{ slug: string; compareSlug: string }>;
}

export const dynamicParams = true;

export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const { slug, compareSlug } = await params;
  const [suburbA, suburbB] = await Promise.all([
    getSuburbBySlug(slug),
    getSuburbBySlug(compareSlug),
  ]);
  if (!suburbA || !suburbB) return { title: "Suburb Not Found" };

  const title = `${suburbA.name} vs ${suburbB.name}: Which is Better? | Your Property Guide`;
  const description = `Compare ${suburbA.name} and ${suburbB.name} side by side. Median house prices: ${suburbA.stats.medianHousePrice > 0 ? formatPriceFull(suburbA.stats.medianHousePrice) : "–"} vs ${suburbB.stats.medianHousePrice > 0 ? formatPriceFull(suburbB.stats.medianHousePrice) : "–"}. See schools, walkability, flood risk, climate and more.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/suburbs/${slug}/vs/${compareSlug}` },
    openGraph: {
      url: `${SITE_URL}/suburbs/${slug}/vs/${compareSlug}`,
      title,
      description,
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

type Winner = "a" | "b" | "tie" | "none";

function winnerClass(side: "a" | "b", winner: Winner) {
  if (winner === "none" || winner === "tie") return "";
  return winner === side ? "bg-green-50 text-green-800 font-semibold" : "";
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
  const with_icsea = schools.filter((s) => s.icsea !== null);
  if (with_icsea.length === 0) return null;
  return Math.round(
    with_icsea.reduce((sum, s) => sum + (s.icsea ?? 0), 0) / with_icsea.length
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
    <div className="grid grid-cols-3 gap-2 py-3 border-b border-gray-100 last:border-b-0 items-center text-sm">
      <div
        className={`rounded-lg px-3 py-2 text-center ${winnerClass("a", winner)}`}
      >
        {valA}
      </div>
      <div className="text-center text-xs text-gray-500 font-medium uppercase tracking-wide px-1">
        {label}
      </div>
      <div
        className={`rounded-lg px-3 py-2 text-center ${winnerClass("b", winner)}`}
      >
        {valB}
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="grid grid-cols-3 gap-2 pt-2">
      <div className="col-span-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mt-4 mb-1 pl-1">
          {title}
        </p>
      </div>
    </div>
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

  function cmp(vA: number | null | undefined, vB: number | null | undefined, higherIsBetter = true): Winner {
    if (vA == null || vB == null) return "none";
    if (vA === vB) return "tie";
    return higherIsBetter ? (vA > vB ? "a" : "b") : (vA < vB ? "a" : "b");
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Suburbs", url: "/suburbs" },
          { name: suburbAName, url: `/suburbs/${slug}` },
          { name: `vs ${suburbBName}`, url: `/suburbs/${slug}/vs/${compareSlug}` },
        ]}
      />

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 to-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <Breadcrumbs
            items={[
              { label: "Suburbs", href: "/suburbs" },
              { label: suburbAName, href: `/suburbs/${slug}` },
              { label: `vs ${suburbBName}` },
            ]}
          />

          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mt-4">
            {suburbAName} vs {suburbBName}
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Side-by-side suburb comparison</p>

          {/* Two-column suburb headers */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-card">
              <div className="flex items-center gap-2 mb-1">
                <Home className="w-4 h-4 text-primary" />
                <span className="font-bold text-gray-900 text-lg">{suburbAName}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{suburbA.state}</Badge>
                <Badge variant="outline">Postcode {suburbA.postcode}</Badge>
              </div>
              {a.medianHousePrice > 0 && (
                <p className="mt-3 text-sm text-gray-600">
                  Median house:{" "}
                  <span className="font-semibold text-gray-900">
                    {formatPriceFull(a.medianHousePrice)}
                  </span>
                </p>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-card">
              <div className="flex items-center gap-2 mb-1">
                <Home className="w-4 h-4 text-primary" />
                <span className="font-bold text-gray-900 text-lg">{suburbBName}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{suburbB.state}</Badge>
                <Badge variant="outline">Postcode {suburbB.postcode}</Badge>
              </div>
              {b.medianHousePrice > 0 && (
                <p className="mt-3 text-sm text-gray-600">
                  Median house:{" "}
                  <span className="font-semibold text-gray-900">
                    {formatPriceFull(b.medianHousePrice)}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main comparison */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* Column labels */}
        <div className="grid grid-cols-3 gap-2 text-center text-sm font-bold text-gray-900 border-b border-gray-200 pb-3 sticky top-0 bg-white z-10 pt-2">
          <div>{suburbAName}</div>
          <div className="text-xs text-gray-400 uppercase tracking-widest font-medium self-center">Metric</div>
          <div>{suburbBName}</div>
        </div>

        {/* Price & Market */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-card">
          <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> Price &amp; Market
          </h2>
          <SectionHeader title="" />
          <CompareRow
            label="Median house price"
            valA={a.medianHousePrice > 0 ? formatPriceFull(a.medianHousePrice) : "–"}
            valB={b.medianHousePrice > 0 ? formatPriceFull(b.medianHousePrice) : "–"}
            winner={cmp(a.medianHousePrice || null, b.medianHousePrice || null, true)}
          />
          <CompareRow
            label="Median unit price"
            valA={a.medianUnitPrice > 0 ? formatPriceFull(a.medianUnitPrice) : "–"}
            valB={b.medianUnitPrice > 0 ? formatPriceFull(b.medianUnitPrice) : "–"}
            winner={cmp(a.medianUnitPrice || null, b.medianUnitPrice || null, true)}
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
        </div>

        {/* Rental */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-card">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Rental</h2>
          <CompareRow
            label="Rent (house/wk)"
            valA={a.medianRentHouse > 0 ? `$${a.medianRentHouse}/wk` : "–"}
            valB={b.medianRentHouse > 0 ? `$${b.medianRentHouse}/wk` : "–"}
            winner="none"
          />
          <CompareRow
            label="Rent (unit/wk)"
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
        </div>

        {/* Lifestyle */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-card">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Lifestyle</h2>
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
        </div>

        {/* Risk */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-card">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Risk</h2>
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
        </div>

        {/* Schools */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-card">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Schools</h2>
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
        </div>

        {/* Climate */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-card">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Climate</h2>
          <CompareRow
            label="Annual rainfall (mm)"
            valA={suburbA.climate?.annualRainfallMm != null ? `${Math.round(suburbA.climate.annualRainfallMm)} mm` : "–"}
            valB={suburbB.climate?.annualRainfallMm != null ? `${Math.round(suburbB.climate.annualRainfallMm)} mm` : "–"}
            winner="none"
          />
          <CompareRow
            label="Mean max temp (Jan)"
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
        </div>

        {/* Legend */}
        <p className="text-xs text-gray-400 text-center">
          Green highlight = better value for that metric. Higher growth, lower risk, higher walkability = better.
        </p>

        {/* CTA buttons */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <Link href={`/suburbs/${slug}`}>
            <Button variant="outline" size="lg" className="w-full">
              Explore {suburbAName} <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href={`/suburbs/${compareSlug}`}>
            <Button variant="outline" size="lg" className="w-full">
              Explore {suburbBName} <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Compare with more */}
        {suburbA.nearbySuburbs.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-card">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Compare {suburbAName} with another suburb:
            </p>
            <div className="flex flex-wrap gap-2">
              {suburbA.nearbySuburbs
                .filter((s) => s !== compareSlug)
                .slice(0, 8)
                .map((s) => {
                  const label = s
                    .split("-")
                    .slice(0, -2)
                    .join(" ")
                    .replace(/\b\w/g, (c) => c.toUpperCase());
                  return (
                    <Link key={s} href={`/suburbs/${slug}/vs/${s}`}>
                      <Badge variant="outline" className="cursor-pointer hover:border-primary hover:text-primary">
                        {label}
                      </Badge>
                    </Link>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
