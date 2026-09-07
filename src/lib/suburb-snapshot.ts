// The opening snapshot of a suburb page (fix item 3): the tiles under the
// hero, the provenance line beneath them, and the lead sentence that
// carries the key figure and the postcode for readers, snippets and answer
// engines. Every number here has already passed the gates in
// suburb-service (price reliability, minimum sales, growth clamp), so the
// sentence and the tiles cannot disagree. Pure; tested in
// tests/lib/suburb-snapshot.test.ts.
import type { Suburb } from "@/types";
import { formatPriceFull, formatPercentage } from "@/lib/utils/format";
import { describeSalesProvenance, type SalesProvenance } from "@/lib/sales-provenance";

export interface SnapshotStat {
  key: "house" | "unit" | "rent" | "yield" | "dom" | "population" | "walk";
  label: string;
  value: string;
  detail?: string;
  icon: string;
}

/** Fewer tiles than this and the band does not render; the lead sentence still carries what exists. */
export const MIN_SNAPSHOT_TILES = 3;
export const MAX_SNAPSHOT_TILES = 6;

// Suburb-level gross yields above this are a small-sample or house/unit-mix
// artefact, not a market. (The same bound lives in the unpushed 4 Sep work
// as isPlausibleGrossYield; kept local here to avoid a rebase conflict.)
export const MAX_PLAUSIBLE_GROSS_YIELD = 20;

export function grossYieldPercent(rentPerWeek: number, price: number): number | null {
  if (!rentPerWeek || !price) return null;
  const y = ((rentPerWeek * 52) / price) * 100;
  return y > 0 && y <= MAX_PLAUSIBLE_GROSS_YIELD ? y : null;
}

function abbrevPopulation(n: number): string {
  if (n >= 100000) return `${(n / 1000).toFixed(0)}k`;
  if (n >= 10000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString("en-AU");
}

export function walkLabel(score: number): string {
  if (score >= 90) return "Walker's paradise";
  if (score >= 70) return "Very walkable";
  if (score >= 50) return "Somewhat walkable";
  if (score >= 25) return "Car dependent";
  return "Very car dependent";
}

export function buildSnapshotStats(suburb: Suburb): SnapshotStat[] {
  const s = suburb.stats;
  const out: SnapshotStat[] = [];
  if (s.medianHousePrice > 0) {
    out.push({ key: "house", label: "Median house", value: formatPriceFull(s.medianHousePrice), detail: s.annualGrowthHouse ? `${formatPercentage(s.annualGrowthHouse)} over 12 months` : undefined, icon: "/images/icons/median.svg" });
  }
  if (s.medianUnitPrice > 0) {
    out.push({ key: "unit", label: "Median unit", value: formatPriceFull(s.medianUnitPrice), detail: s.annualGrowthUnit ? `${formatPercentage(s.annualGrowthUnit)} over 12 months` : undefined, icon: "/images/icons/median.svg" });
  }
  // Rent and yield only when the rent's source is known. NSW rents arrive
  // postcode-level as an all-dwellings median (DCJ "Total" rows) with no
  // per-suburb source row, so they are not house rents and stay out of the
  // band until the feed is fixed (tracker follow-up); the rental section
  // lower on the page is unchanged.
  const rentSourced = Boolean(suburb.dataFreshness?.rentalSource);
  if (rentSourced && s.medianRentHouse > 0) {
    out.push({ key: "rent", label: "Weekly rent", value: `$${s.medianRentHouse.toLocaleString("en-AU")}`, detail: s.medianRentUnit > 0 ? `Houses · units $${s.medianRentUnit.toLocaleString("en-AU")}` : "Houses", icon: "/images/icons/yield.svg" });
  }
  const y = rentSourced ? grossYieldPercent(s.medianRentHouse, s.medianHousePrice) : null;
  if (y !== null) {
    out.push({ key: "yield", label: "Gross yield", value: `${y.toFixed(1)}%`, detail: "Houses, on the median", icon: "/images/icons/yield.svg" });
  }
  if (s.daysOnMarket > 0) {
    out.push({ key: "dom", label: "Days on market", value: String(s.daysOnMarket), detail: "Typical time to sell", icon: "/images/icons/growth.svg" });
  }
  if (s.population > 0) {
    out.push({ key: "population", label: "Population", value: abbrevPopulation(s.population), detail: s.medianAge ? `Median age ${s.medianAge}` : "2021 Census", icon: "/images/icons/people.svg" });
  }
  if (s.walkScore !== null && s.walkScore !== undefined) {
    out.push({ key: "walk", label: "Walk score", value: String(s.walkScore), detail: walkLabel(s.walkScore), icon: "/images/icons/walkability.svg" });
  }
  if (out.length < MIN_SNAPSHOT_TILES) return [];
  return out.slice(0, MAX_SNAPSHOT_TILES);
}

const RENTAL_LABELS: Record<string, string> = {
  "rental-nsw": "NSW rental bond data",
  "rental-vic": "Victorian rental report",
  "rental-sa": "SA rental bond data",
  "rental-qld": "Queensland RTA bond data",
  "abs-census": "2021 Census rent (proxy)",
  "abs-census-2021": "2021 Census rent (proxy)",
};

const monthYear = (d: Date) => d.toLocaleDateString("en-AU", { month: "long", year: "numeric", timeZone: "UTC" });

/** The provenance line under the tiles: one fragment per data family that is shown. */
export function buildSnapshotProvenance(suburb: Suburb, stats: SnapshotStat[]): string[] {
  const keys = new Set(stats.map((t) => t.key));
  const f = suburb.dataFreshness;
  const parts: string[] = [];
  if (keys.has("house") || keys.has("unit")) {
    const p = salesProvenanceFor(suburb);
    if (p) parts.push(p.geography === "area" ? `Prices: ${p.short}` : `Prices: ${p.short}`);
  }
  if (keys.has("rent") || keys.has("yield")) {
    const label = f?.rentalSource ? RENTAL_LABELS[f.rentalSource] ?? null : null;
    if (label) parts.push(`Rent: ${label}${f?.rentalAsOf ? `, ${monthYear(new Date(f.rentalAsOf))}` : ""}`);
  }
  if (keys.has("population")) parts.push("Population: 2021 Census");
  return parts;
}

export function salesProvenanceFor(suburb: Suburb): SalesProvenance | null {
  return describeSalesProvenance({
    source: suburb.dataFreshness?.salesSource,
    periodEnd: suburb.dataFreshness?.salesPeriodEnd,
    updatedAt: suburb.dataFreshness?.salesAsOf,
    salesCount: suburb.dataFreshness?.salesCount,
    suburbName: suburb.name,
  });
}

/**
 * The first sentence of the page. Leads with the median and its provenance
 * when there is a published median, so the snippet and answer engines pick
 * up a number with a source rather than "The postcode for X is". Null when
 * no median is published; the page then leads with the postcode sentence.
 */
export function buildLeadSentence(suburb: Suburb): string | null {
  const s = suburb.stats;
  if (s.medianHousePrice <= 0) return null;
  const p = salesProvenanceFor(suburb);
  const price = formatPriceFull(s.medianHousePrice);
  if (p?.geography === "area") {
    return `${suburb.name} sits in an ABS statistical area (SA2) where the median house price is ${price} (${p.period}).`;
  }
  const prov = p ? ` (${p.sentence.replace(/\.$/, "").replace(/^Median of /, "median of ")})` : "";
  return `${suburb.name}'s median house price is ${price}${prov}.`;
}
