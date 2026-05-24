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

// Only tiles with a real underlying value are returned. Missing data
// produces no tile rather than a "Sales data pending" or "–" placeholder.
// Trust on the largest traffic surface dies when visitors see five empty
// boxes; a shorter complete-looking band is the better outcome.
function buildStats(suburb: Suburb): SnapshotStat[] {
  const stats = suburb.stats;
  const out: SnapshotStat[] = [];

  if (stats.medianHousePrice) {
    out.push({
      label: "Median house",
      value: formatPriceFull(stats.medianHousePrice),
      detail: stats.annualGrowthHouse ? `${formatPercentage(stats.annualGrowthHouse)} year on year` : undefined,
      icon: "/images/icons/median.svg",
    });
  }
  if (stats.medianUnitPrice) {
    out.push({
      label: "Median unit",
      value: formatPriceFull(stats.medianUnitPrice),
      detail: stats.annualGrowthUnit ? `${formatPercentage(stats.annualGrowthUnit)} year on year` : undefined,
      icon: "/images/icons/yield.svg",
    });
  }
  if (stats.daysOnMarket) {
    out.push({
      label: "Days on market",
      value: String(stats.daysOnMarket),
      detail: "Average to sell",
      icon: "/images/icons/growth.svg",
    });
  }
  if (stats.walkScore !== null && stats.walkScore !== undefined) {
    out.push({
      label: "Walk score",
      value: String(stats.walkScore),
      detail: walkLabel(stats.walkScore),
      icon: "/images/icons/walkability.svg",
    });
  }
  if (stats.population) {
    out.push({
      label: "Population",
      value: abbrevPopulation(stats.population),
      detail: stats.medianAge ? `Median age ${stats.medianAge}` : undefined,
      icon: "/images/icons/people.svg",
    });
  }
  return out;
}

// Map of tile count → grid column class. Tailwind needs explicit class
// strings at build time so we can't `grid-cols-${n}` dynamically.
const GRID_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
};

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
  if (stats.length === 0) return null;
  const colsClass = GRID_COLS[stats.length] ?? GRID_COLS[5];
  return (
    <section
      aria-label={`${suburb.name} snapshot`}
      className="bg-surface-warm border-b border-line-warm"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-6">
          {suburb.name} at a glance
        </p>
        <div className={`grid ${colsClass} gap-y-6 lg:gap-y-0`}>
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
