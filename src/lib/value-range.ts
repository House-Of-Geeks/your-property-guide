// The instant range on /appraisal, /property-valuation and the house-worth
// guide: the suburb's published median for the chosen dwelling type and a
// band of 15% either side of it. No feed publishes quartiles (SuburbSalesStat
// holds medians and counts only), so the band is arithmetic, labelled as
// such, and describes the suburb, never the visitor's property. Every figure
// comes from HomeValueSummary, which the suburb service has already put
// through the published-medians rule: a withheld median arrives as null and
// nothing here turns it into a number. Pure; tested in
// tests/lib/value-range.test.ts.
import type { HomeValueSummary } from "@/lib/home-value";
import { MIN_SALES_FOR_MEDIAN, thinSalesNote } from "@/lib/sales-provenance";

export type Dwelling = "house" | "unit";

/** Half-width of the band, as a fraction of the median. */
export const RANGE_BAND = 0.15;

/** Band ends are rounded to this, so they do not read as more precise than the median behind them. */
export const RANGE_STEP = 1_000;

export interface ValueRange {
  median: number;
  low: number;
  high: number;
}

/** The band around a published median, or null for anything that is not a positive number. */
export function rangeAroundMedian(median: number | null | undefined, band = RANGE_BAND): ValueRange | null {
  if (typeof median !== "number" || !Number.isFinite(median) || median <= 0) return null;
  const low = Math.round((median * (1 - band)) / RANGE_STEP) * RANGE_STEP;
  const high = Math.round((median * (1 + band)) / RANGE_STEP) * RANGE_STEP;
  if (low <= 0 || high <= low) return null;
  return { median, low, high };
}

type SummaryFigures = Pick<HomeValueSummary, "medianHousePrice" | "medianUnitPrice" | "provenance" | "unitProvenance">;

/**
 * The published median for the dwelling type, or null where the rule
 * withholds it. A figure prints only with its source line: that also keeps a
 * summary cached before the unit rule shipped (which carried NSW unit figures
 * and no unit source line) from printing one.
 */
export function publishedMedian(summary: SummaryFigures, dwelling: Dwelling): number | null {
  const m = dwelling === "house" ? summary.medianHousePrice : summary.medianUnitPrice;
  if (!sourceLine(summary, dwelling)) return null;
  return typeof m === "number" && m > 0 ? m : null;
}

/** The range for the dwelling type, or null where there is no published median. */
export function publishedRange(summary: SummaryFigures, dwelling: Dwelling): ValueRange | null {
  return rangeAroundMedian(publishedMedian(summary, dwelling));
}

/** Which dwelling types have a published median, house first. */
export function availableDwellings(summary: SummaryFigures): Dwelling[] {
  return (["house", "unit"] as const).filter((d) => publishedMedian(summary, d) !== null);
}

type SummaryForLabel = Pick<HomeValueSummary, "name" | "basis">;

/** The caption above the median: an ABS figure is the statistical area's, and says so (item 1, step iv). */
export function medianCaption(summary: SummaryForLabel, dwelling: Dwelling): string {
  return summary.basis === "area"
    ? `Median ${dwelling} price, ABS statistical area (SA2) for ${summary.name}`
    : `Median ${dwelling} price in ${summary.name}`;
}

/** The caption above the band: what it is arithmetically. */
export function rangeCaption(): string {
  return `Range around the median (\u00b1${Math.round(RANGE_BAND * 100)}%)`;
}

/** The line printed under every range: what the band is and what it is not. */
export function rangeLabel(summary: SummaryForLabel, dwelling: Dwelling): string {
  const pct = Math.round(RANGE_BAND * 100);
  const median = summary.basis === "area"
    ? `the ABS statistical-area median ${dwelling} price for ${summary.name}`
    : `the ${summary.name} median ${dwelling} price`;
  const what = summary.basis === "area" ? "the area" : "the suburb";
  return `The range is ${median} less and plus ${pct}%. It describes ${what}, not your property: what yours would sell for depends on the land, the condition and what comparable homes sold for recently.`;
}

type SummaryForSource = Pick<HomeValueSummary, "provenance" | "unitProvenance">;

/** The source line for the figure on screen: the house and unit series are separate tables. */
export function sourceLine(summary: SummaryForSource, dwelling: Dwelling): string | null {
  return dwelling === "house" ? summary.provenance : summary.unitProvenance;
}

type SummaryForNote = Pick<HomeValueSummary, "name" | "medianHousePrice" | "salesCount" | "period" | "sourceLabel">;

/** Why no figure is shown for the dwelling type. */
export function withheldNote(summary: SummaryForNote, dwelling: Dwelling): string {
  const count = summary.salesCount;
  if (dwelling === "house" && count != null && count >= 1 && count < MIN_SALES_FOR_MEDIAN) {
    return thinSalesNote(count, summary.period ?? "the latest period");
  }
  if (dwelling === "unit" && summary.sourceLabel) {
    return `The ${summary.sourceLabel} feed has no unit median for ${summary.name}.`;
  }
  return `We don't publish a ${dwelling} median for ${summary.name} yet: no trusted sales feed covers it.`;
}
