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
 * Human-facing label for the missing price.
 */
export const PENDING_PRICE_LABEL = "Verified median pending";

/**
 * Human-facing explainer one-liner for the data note.
 */
export const PENDING_PRICE_NOTE =
  "We don't yet have a verified suburb-level median for this market. We're working on a data partner; in the meantime, treat the state-level figures as a guide only.";
