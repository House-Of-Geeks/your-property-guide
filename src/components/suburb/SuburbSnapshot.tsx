import Image from "next/image";
import type { Suburb } from "@/types";
import { formatPriceFull, formatPercentage } from "@/lib/utils/format";

interface SuburbSnapshotProps {
  suburb: Suburb;
}

// Magazine-style stat band that sits directly below the satellite hero.
// Five editorial stats in a row, with Playfair display numerals and a thin
// vertical rule between each. Replaces the dry quick-facts strip with
// something that signals "this is a real publication" on first scroll.

interface SnapshotStat {
  label: string;
  value: string;
  detail?: string;
  icon: string;
}

function buildStats(suburb: Suburb): SnapshotStat[] {
  const stats = suburb.stats;
  const dash = "–";

  return [
    {
      label: "Median house",
      value: stats.medianHousePrice ? formatPriceFull(stats.medianHousePrice) : dash,
      detail: stats.annualGrowthHouse
        ? `${formatPercentage(stats.annualGrowthHouse)} year on year`
        : "Sales data pending",
      icon: "/images/icons/median.svg",
    },
    {
      label: "Median unit",
      value: stats.medianUnitPrice ? formatPriceFull(stats.medianUnitPrice) : dash,
      detail: stats.annualGrowthUnit
        ? `${formatPercentage(stats.annualGrowthUnit)} year on year`
        : "Sales data pending",
      icon: "/images/icons/yield.svg",
    },
    {
      label: "Days on market",
      value: stats.daysOnMarket ? String(stats.daysOnMarket) : dash,
      detail: "Average to sell",
      icon: "/images/icons/growth.svg",
    },
    {
      label: "Walk score",
      value: stats.walkScore !== null && stats.walkScore !== undefined
        ? String(stats.walkScore)
        : dash,
      detail: stats.walkScore !== null && stats.walkScore !== undefined
        ? walkLabel(stats.walkScore)
        : "Not yet scored",
      icon: "/images/icons/walkability.svg",
    },
    {
      label: "Population",
      value: stats.population ? abbrevPopulation(stats.population) : dash,
      detail: stats.medianAge ? `Median age ${stats.medianAge}` : "Census data pending",
      icon: "/images/icons/people.svg",
    },
  ];
}

function abbrevPopulation(n: number): string {
  if (n >= 100000) return `${(n / 1000).toFixed(0)}k`;
  if (n >= 10000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString();
}

function walkLabel(score: number): string {
  if (score >= 90) return "Walker's paradise";
  if (score >= 70) return "Very walkable";
  if (score >= 50) return "Somewhat walkable";
  if (score >= 25) return "Car dependent";
  return "Very car dependent";
}

export function SuburbSnapshot({ suburb }: SuburbSnapshotProps) {
  const stats = buildStats(suburb);
  return (
    <section
      aria-label={`${suburb.name} snapshot`}
      className="bg-surface-warm border-b border-line-warm"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-6">
          {suburb.name} at a glance
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-6 lg:gap-y-0">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`px-4 sm:px-6 ${
                i > 0 ? "lg:border-l lg:border-line-warm" : ""
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Image src={s.icon} alt="" width={18} height={18} className="w-[18px] h-[18px]" aria-hidden="true" />
                <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle">
                  {s.label}
                </p>
              </div>
              <p className="font-display text-3xl sm:text-4xl text-ink leading-none tracking-tight">
                {s.value}
              </p>
              {s.detail && (
                <p className="text-xs font-sans text-ink-muted mt-2 leading-snug">
                  {s.detail}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
