// Data-quality classifier for suburb price data.
//
// The site sources suburb medians from a mix of feeds, and their
// quality varies sharply:
//
//   - NSW Valuer General (sales-nsw): every actual transaction, current
//   - VIC Dept of Transport (sales-vic): quarterly suburb medians, current
//   - SA Govt (sales-sa): quarterly Metro Adelaide medians, current
//   - ABS SA2 (sales-abs): real medians but ANNUAL, prior calendar year,
//     covers QLD/WA/NT/TAS/ACT
//   - QLD/WA fallback (sales-qld, sales-wa): a back-calculation from the
//     2021 Census median monthly mortgage repayment, assuming 5.5%
//     interest over 30 years at 80% LVR. This is HUGELY off in practice
//     because most of those 2021 mortgages were at 2-3% rates, so the
//     formula understates the price by hundreds of thousands. Pure
//     fiction at the suburb level. Used as last-resort fallback only.
//   - "seed" (default): initial seed value, may be a placeholder.
//
// Rule: if we don't have a high-confidence price for a suburb, we don't
// SHOW it as if it were a verified median. We say "pending verified
// data partner" and link to /methodology. Better to admit a gap than
// to publish wrong numbers.

import type { Suburb, SuburbDataFreshness } from "@/types";
import { MIN_SALES_FOR_MEDIAN, thinSalesNote } from "@/lib/sales-provenance";

/** Sources we trust to publish as a verified median. */
const RELIABLE_SOURCES = new Set<string>([
  "sales-nsw",   // NSW Valuer General — every actual transaction
  "sales-vic",   // VIC Department of Transport — quarterly suburb medians
  "sales-sa",    // data.sa.gov.au — quarterly Metro Adelaide
  "sales-abs",   // ABS SA2 — annual but real
]);

// Everything else is distrusted, notably: "sales-qld" / "sales-wa"
// (census-mortgage proxy, wildly wrong), "seed" (placeholder), and any
// unknown source string.

export type PriceConfidence = "reliable" | "unreliable";

/**
 * Raw-source variant of the gate for callers that read `statsSource`
 * straight off the Suburb row (aggregations like postcode stats) instead
 * of going through the Suburb type. Unknown sources are unreliable —
 * the safer default.
 */
/** The same list, for DB `in` filters (sitemap gates). */
export const RELIABLE_SALES_SOURCES: readonly string[] = [...RELIABLE_SOURCES];

export function isReliableSalesSource(source: string | null | undefined): boolean {
  return RELIABLE_SOURCES.has(source ?? "");
}

/**
 * Classify a suburb's price confidence based on the salesSource on its
 * data-freshness record. Unknown / missing sources are treated as
 * unreliable — the safer default.
 */
export function classifyPriceConfidence(
  freshness: SuburbDataFreshness | null | undefined,
): PriceConfidence {
  return isReliableSalesSource(freshness?.salesSource) ? "reliable" : "unreliable";
}

/**
 * Boolean convenience: should we show this suburb's medianHousePrice
 * as if it were a real median? Returns false if confidence is
 * unreliable OR the price is missing/zero.
 */
export function hasReliablePrice(suburb: Pick<Suburb, "stats" | "dataFreshness">): boolean {
  if (!suburb.stats.medianHousePrice || suburb.stats.medianHousePrice <= 0) return false;
  return classifyPriceConfidence(suburb.dataFreshness) === "reliable";
}

/**
 * Reliable median or null. Use this anywhere we'd otherwise interpolate
 * stats.medianHousePrice into copy.
 */
export function reliableMedianHousePrice(
  suburb: Pick<Suburb, "stats" | "dataFreshness">,
): number | null {
  return hasReliablePrice(suburb) ? suburb.stats.medianHousePrice : null;
}

/**
 * Suburb-level annual growth beyond this magnitude is almost always a
 * small-sample or house/unit-mix artifact (e.g. "-41.8%" printed on a
 * suburb with a handful of sales), not a real market move. Treat such
 * figures as unknown rather than publishing them into answer text and
 * FAQPage JSON-LD.
 */
export const MAX_PLAUSIBLE_ANNUAL_GROWTH = 25;

export function isPlausibleAnnualGrowth(growth: number | null | undefined): boolean {
  if (growth == null) return false;
  return Math.abs(growth) <= MAX_PLAUSIBLE_ANNUAL_GROWTH;
}

/**
 * Human-facing label for the missing price, where no more specific reason
 * applies (withheldPriceNote below gives one for every case it can tell).
 */
export const PENDING_PRICE_LABEL = "Verified median pending";

/**
 * The fallback explainer. Until 10 Oct 2026 it said "We're working on a data
 * partner; in the meantime, treat the state-level figures as a guide only",
 * on pages that show no state-level figure and for states whose sources
 * exist (the commercial intent review, suburbs-market 0.5).
 */
export const PENDING_PRICE_NOTE =
  "No trusted sales feed has a house median for this suburb yet, so we don't show one.";

// ── Why a median is withheld (suburbs-market 0.5 and 3.1, 10 Oct 2026) ────
//
// The price card says why, in words that stay true until the reason goes:
// a repaired label, a fifth sale or a corrected row publishes the median
// and the card stops rendering this at all. Pure; tested in
// tests/lib/suburb-data-quality.test.ts.

/** The sales feed each state's suburb medians come from when they are published. */
export const STATE_SALES_AGENCY: Record<string, string> = {
  NSW: "the NSW Valuer General",
  VIC: "Land Victoria",
  SA: "the SA Government",
  QLD: "the ABS",
  WA: "the ABS",
  TAS: "the ABS",
  ACT: "the ABS",
  NT: "the ABS",
};

const FEED_AGENCY: Record<string, string> = {
  "sales-nsw": "the NSW Valuer General",
  "sales-vic": "Land Victoria",
  "sales-sa": "the SA Government",
  "sales-abs": "the ABS",
};

/** Labels the census-mortgage estimate carries: a back-calculation, not sales. */
const CENSUS_ESTIMATE_SOURCES = new Set<string>(["sales-qld", "sales-wa"]);

export type WithheldKind = "label" | "estimate" | "no-feed" | "thin-sales" | "no-median" | "inverted";

export interface WithheldPriceNote {
  kind: WithheldKind;
  /** The large line on the price card. */
  label: string;
  /** The sentence under it. */
  note: string;
}

export interface WithheldPriceInput {
  name: string;
  state: string;
  /** Suburb.statsSource (dataFreshness.salesSource). */
  statsSource: string | null | undefined;
  /** Recorded house sales, when the feed reports a count. */
  salesCount: number | null | undefined;
  /** The period the feed's medians describe ("calendar 2025", "the latest published quarter"). */
  period?: string | null;
  /** The row's own columns, before the gate. Needed only to tell a missing median from an inverted pair. */
  rawHouse?: number | null;
  rawUnit?: number | null;
}

/**
 * Why the page shows no house median, as the card's label and note. Returns
 * the reason in this order: a rental feed's label on the sales columns (the
 * 1 Oct 2026 NSW and VIC fault), the census-mortgage estimate, no trusted
 * feed, fewer than five recorded sales (with the count and period), a unit
 * median above the house median, and a trusted feed with no house median.
 */
export function withheldPriceNote(i: WithheldPriceInput): WithheldPriceNote {
  const source = i.statsSource ?? "";
  const agency = STATE_SALES_AGENCY[i.state.trim().toUpperCase()] ?? "the state's sales feed";
  if (source.startsWith("rental-")) {
    return {
      kind: "label",
      label: "Median being re-checked",
      note: `The sales figure on file for ${i.name} carries a rental feed's label, so we can't confirm it came from ${agency}. We don't show it until it has been checked against ${agency}'s figures.`,
    };
  }
  if (CENSUS_ESTIMATE_SOURCES.has(source)) {
    return {
      kind: "estimate",
      label: PENDING_PRICE_LABEL,
      note: `No trusted sales feed has a house median for ${i.name} yet. The only figure on file is an estimate worked back from 2021 Census mortgage repayments, not a record of sales, so we don't show it.`,
    };
  }
  if (!isReliableSalesSource(source)) {
    return { kind: "no-feed", label: PENDING_PRICE_LABEL, note: `No trusted sales feed has a house median for ${i.name} yet, so we don't show one.` };
  }
  const feed = FEED_AGENCY[source] ?? agency;
  const period = i.period ? ` in ${i.period}` : "";
  const count = i.salesCount ?? 0;
  if (count >= 1 && count < MIN_SALES_FOR_MEDIAN) {
    return { kind: "thin-sales", label: "Too few sales for a median", note: thinSalesNote(count, i.period || "the latest period") };
  }
  const house = i.rawHouse ?? 0;
  const unit = i.rawUnit ?? 0;
  if (house > 0 && unit > house) {
    return {
      kind: "inverted",
      label: "Median being re-checked",
      note: `${capitalise(feed)}'s figures for ${i.name} put the unit median above the house median, which points to an error in the data, so we have withheld both while we check them.`,
    };
  }
  return { kind: "no-median", label: "No published house median", note: `${capitalise(feed)} gives no house median for ${i.name}${period}.` };
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── Where the profile's figures come from (the footer's source line) ──────
//
// Until 10 Oct 2026 the footer said "Median, growth and rental data from
// state revenue offices and ABS": no revenue office supplies a median. The
// agencies below are the feeds in scripts/sync/sources, checked against
// their publishers on 10 Oct 2026 (NSW DCJ Rent and Sales Report; Homes
// Victoria Rental Report, "the major source ... is the Residential
// Tenancies Bond Authority"; SA Private Rent Report, "bonds lodged with
// Consumer and Business Services"; Queensland RTA; WA rental bonds data;
// the Victorian Property Sales Report, Valuer-General Victoria, published
// by the Department of Transport and Planning).

/** Sales medians, by state. */
export const STATE_SALES_SOURCE_LINE: Record<string, string> = {
  NSW: "House medians and 12-month changes from the NSW Valuer General's property sales records",
  VIC: "House and unit medians from Land Victoria (the Valuer-General Victoria's quarterly property sales report)",
  SA: "House medians and 12-month changes from the SA Government's quarterly suburb medians (data.sa.gov.au)",
  QLD: "House and unit medians from the ABS, for the statistical area (SA2) that carries the suburb's name",
  WA: "House and unit medians from the ABS, for the statistical area (SA2) that carries the suburb's name",
  TAS: "House and unit medians from the ABS, for the statistical area (SA2) that carries the suburb's name",
  ACT: "House and unit medians from the ABS, for the statistical area (SA2) that carries the suburb's name",
  NT: "House and unit medians from the ABS, for the statistical area (SA2) that carries the suburb's name",
};

/** Weekly rents, by state: the bond authorities' figures where a feed is loaded, the 2021 Census otherwise. */
export const STATE_RENT_SOURCE_LINE: Record<string, string> = {
  NSW: "rents from the NSW Department of Communities and Justice's Rent and Sales Report (rental bonds)",
  VIC: "rents from Homes Victoria's Rental Report (bonds lodged with the Residential Tenancies Bond Authority)",
  QLD: "rents from the Residential Tenancies Authority's bond data",
  SA: "rents from the SA Government's Private Rent Report (bonds lodged with Consumer and Business Services)",
  WA: "rents from the WA Government's rental bonds data",
  TAS: "rents from the 2021 Census (no bond-data feed is loaded for Tasmania yet)",
  ACT: "rents from the 2021 Census (no bond-data feed is loaded for the ACT yet)",
  NT: "rents from the 2021 Census (no bond-data feed is loaded for the NT yet)",
};

/** The footer's line for a suburb in this state: "{sales}; {rents}." */
export function profileSourceLine(state: string): string {
  const st = state.trim().toUpperCase();
  const sales = STATE_SALES_SOURCE_LINE[st] ?? "House medians from the state's sales records and the ABS";
  const rent = STATE_RENT_SOURCE_LINE[st] ?? "rents from the state's rental bond data";
  return `${sales}; ${rent}.`;
}
