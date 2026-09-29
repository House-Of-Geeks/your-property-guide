// What a list may print of a suburb's sales figures: what the suburb's own
// page prints, and nothing else. Pure; tested in
// tests/lib/published-medians.test.ts.
//
// The suburb page withholds a median whose source is distrusted (a price
// back-calculated from 2021 census mortgage repayments, a seed placeholder)
// or which rests on fewer than five recorded sales: suburb-service.toSuburb.
// The lists did not go through it. On 29 Sep 2026, in production, 2,744 rows
// across the rankings, the price guide, the market reports and the state
// pages printed a dollar figure, and for 1,822 of them (66%) the suburb's own
// page withheld the median. 725 printed a 12-month change beyond 25%; the
// highest was +4,612.1%.
//
// One rule here, read by the suburb service and by every list, so they
// cannot disagree.
import {
  MAX_PLAUSIBLE_ANNUAL_GROWTH,
  RELIABLE_SALES_SOURCES,
  isPlausibleAnnualGrowth,
  isReliableSalesSource,
} from "@/lib/suburb-data-quality";
import { MIN_SALES_FOR_MEDIAN, hasEnoughSales } from "@/lib/sales-provenance";

/** The raw columns of a Suburb row that the rule reads. */
export interface RawSalesRow {
  medianHousePrice: number;
  medianUnitPrice?: number | null;
  annualGrowthHouse?: number | null;
  statsSource: string | null;
  salesCountHouse: number | null;
}

/**
 * How a median was measured: "suburb" is a median of sales inside the suburb,
 * "area" is the ABS statistical area (SA2) that contains it, which can take
 * in the neighbours. Suburbs in one SA2 share a figure.
 */
export type MedianBasis = "suburb" | "area";

export interface PublishedSales {
  /** 0 when the suburb page publishes no house median. */
  medianHousePrice: number;
  medianUnitPrice: number;
  /** 0 when there is no 12-month change to publish. */
  annualGrowthHouse: number;
  /** Null when nothing is published. */
  basis: MedianBasis | null;
}

/**
 * The feeds that work out a 12-month change. The ABS and Land Victoria feeds
 * publish a median and no change, and never write the growth column: a
 * figure there was left by an earlier import, not measured by the feed named
 * beside it (10 rows on 29 Sep 2026).
 */
export const GROWTH_SOURCES: readonly string[] = ["sales-nsw", "sales-sa"];

/** The suburb page publishes this row's medians: a trusted source, and five recorded sales where the count is known. */
export function publishesMedians(row: Pick<RawSalesRow, "statsSource" | "salesCountHouse">): boolean {
  return isReliableSalesSource(row.statsSource) && hasEnoughSales(row.salesCountHouse);
}

export function medianBasis(statsSource: string | null | undefined): MedianBasis | null {
  if (!isReliableSalesSource(statsSource)) return null;
  return statsSource === "sales-abs" ? "area" : "suburb";
}

/** A 12-month change worth printing: measured by the row's own feed, on a published median, inside the plausibility clamp, and not the 0 the feeds store for "no prior period". */
export function publishedGrowth(row: RawSalesRow): number {
  const g = row.annualGrowthHouse ?? 0;
  if (!publishesMedians(row) || !(row.medianHousePrice > 0)) return 0;
  if (!GROWTH_SOURCES.includes(row.statsSource ?? "")) return 0;
  return isPlausibleAnnualGrowth(g) ? g : 0;
}

/** The row's sales figures as the suburb page prints them. */
export function publishedSales(row: RawSalesRow): PublishedSales {
  if (!publishesMedians(row)) return { medianHousePrice: 0, medianUnitPrice: 0, annualGrowthHouse: 0, basis: null };
  const medianHousePrice = row.medianHousePrice > 0 ? row.medianHousePrice : 0;
  const medianUnitPrice = (row.medianUnitPrice ?? 0) > 0 ? (row.medianUnitPrice as number) : 0;
  return {
    medianHousePrice,
    medianUnitPrice,
    annualGrowthHouse: publishedGrowth(row),
    basis: medianHousePrice > 0 || medianUnitPrice > 0 ? medianBasis(row.statsSource) : null,
  };
}

/** The row with its sales figures replaced by the published ones. For lists that select the raw columns. */
export function withPublishedSales<T extends RawSalesRow>(row: T): T & PublishedSales {
  return { ...row, ...publishedSales(row) };
}

// ── The same rule as database filters ───────────────────────────────────────

/** Prisma `where`: rows whose house median the suburb page publishes. */
export const PUBLISHED_HOUSE_MEDIAN = {
  medianHousePrice: { gt: 0 },
  statsSource: { in: [...RELIABLE_SALES_SOURCES] },
  NOT: { salesCountHouse: { gte: 1, lt: MIN_SALES_FOR_MEDIAN } },
};

/** Prisma `where`: rows with a 12-month rise to rank. */
export const PUBLISHED_GROWTH = {
  ...PUBLISHED_HOUSE_MEDIAN,
  statsSource: { in: [...GROWTH_SOURCES] },
  annualGrowthHouse: { gt: 0, lte: MAX_PLAUSIBLE_ANNUAL_GROWTH },
};

/** Prisma `where`: rows with a published 12-month change, up or down. For lists sorted by it. */
export const PUBLISHED_CHANGE = {
  ...PUBLISHED_HOUSE_MEDIAN,
  statsSource: { in: [...GROWTH_SOURCES] },
  annualGrowthHouse: { gte: -MAX_PLAUSIBLE_ANNUAL_GROWTH, lte: MAX_PLAUSIBLE_ANNUAL_GROWTH, not: 0 },
};

const sqlList = (values: readonly string[]) => values.map((v) => `'${v.replace(/'/g, "''")}'`).join(", ");

/** The house-median rule for raw SQL over "Suburb" aliased `s`. */
export const PUBLISHED_HOUSE_MEDIAN_SQL =
  `s."medianHousePrice" > 0 AND s."statsSource" IN (${sqlList(RELIABLE_SALES_SOURCES)}) ` +
  `AND NOT (s."salesCountHouse" >= 1 AND s."salesCountHouse" < ${MIN_SALES_FOR_MEDIAN})`;
