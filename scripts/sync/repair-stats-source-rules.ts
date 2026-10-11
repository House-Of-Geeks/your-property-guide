// Which sales source wrote the median on a Suburb row that a rental feed
// relabelled. Pure; tested in tests/sync/repair-stats-source-rules.test.ts.
// Used by scripts/sync/repair-stats-source.ts.
//
// A rental feed that stamped statsSource changed only the label: the median,
// the sales count and salesUpdatedAt are what the last sales writer left.
// Each writer leaves a different fingerprint, so the label can be decided
// from the row and from the rows the feeds stored, not guessed:
//
//   sales-nsw   the median and the sales count equal the feed's own aggregate
//               of the captured Valuer General rows (PropertySale, vg-nsw;
//               nature R with no unit number) for the calendar year before
//               the row's salesUpdatedAt, which is the year the feed used.
//   sales-sa    the median and the sales count equal a stored SA Government
//               quarter for the suburb (SuburbSalesStat, sales-sa-historical).
//   sales-abs   salesUpdatedAt is a period end (31 December, 00:00 UTC): the
//               ABS feed is the only writer that stamps one; every other
//               sales feed stamps its run time.
//   census      a whole-thousand house price with the unit price at 72% of
//               it: the retired 2021 Census mortgage seed (abs-census-2021).
//   proxy       QLD or WA, a whole-thousand house price and a run-time sales
//               stamp: the census-mortgage proxy feeds (sales-qld, sales-wa).
//
// Only the first three are trusted by the gate. A row that matches none stays
// as it is: the gate keeps withholding it, which is the safe default.

/** The labels a rental feed stamped (rental-nsw, rental-vic, rental-qld, rental-sa, rental-wa). */
export function isRentalLabel(statsSource: string | null | undefined): boolean {
  return /^rental-/.test((statsSource ?? "").trim());
}

/** The states the ABS feed (sales-abs) writes: TARGET_STATES in sources/sales-abs.ts. */
export const ABS_STATES: readonly string[] = ["NSW", "QLD", "WA", "NT", "TAS", "ACT"];

/** The retired census seed's unit price: 72% of the house price, rounded (scripts/seed/sync-suburb-stats-abs.ts). */
export const CENSUS_UNIT_RATIO = 0.72;

export interface RepairRow {
  state: string;
  statsSource: string | null;
  medianHousePrice: number;
  medianUnitPrice: number | null;
  salesCountHouse: number | null;
  salesUpdatedAt: Date | null;
}

/** sales-nsw's own aggregate for the row's suburb and postcode, null when no captured rows name it. */
export interface NswAggregate {
  year: number;
  median: number;
  count: number;
}

export interface RepairEvidence {
  /** Undefined when the state is not NSW or the row has no salesUpdatedAt to pick the year. */
  nsw?: NswAggregate | null;
  /** The newest sales-sa-historical quarter whose median and count equal the row's, if any. */
  saQuarter?: string | null;
}

export type RepairCode =
  | "nsw-rows-match"
  | "sa-quarter-match"
  | "abs-period-end"
  | "census-seed"
  | "census-proxy"
  | "no-median"
  | "nsw-no-stamp"
  | "nsw-no-rows"
  | "nsw-rows-differ"
  | "vic-unverifiable"
  | "sa-no-quarter"
  | "no-fingerprint";

export type RepairDecision =
  | { kind: "relabel"; to: string; trusted: boolean; code: RepairCode; detail: string }
  | { kind: "undecided"; code: RepairCode; detail: string };

const money = (n: number) => `$${n.toLocaleString("en-AU")}`;
const day = (d: Date) => d.toISOString().slice(0, 10);

/** sales-abs stamps salesUpdatedAt with the period end, new Date("YYYY-12-31"). */
export function isPeriodEnd(d: Date | null | undefined): boolean {
  if (!d) return false;
  return d.getUTCMonth() === 11 && d.getUTCDate() === 31 && d.getUTCHours() === 0 && d.getUTCMinutes() === 0 && d.getUTCSeconds() === 0 && d.getUTCMilliseconds() === 0;
}

export function hasCensusSeedFingerprint(house: number, unit: number | null | undefined): boolean {
  return house > 0 && house % 1000 === 0 && (unit ?? 0) === Math.round(house * CENSUS_UNIT_RATIO);
}

/** The calendar year sales-nsw aggregated on a run at this time (currentYear = run year - 1). */
export function nswAggregateYear(salesUpdatedAt: Date): number {
  return salesUpdatedAt.getUTCFullYear() - 1;
}

export function decideStatsSource(row: RepairRow, ev: RepairEvidence = {}): RepairDecision {
  const house = row.medianHousePrice ?? 0;
  const count = row.salesCountHouse ?? 0;
  if (!(house > 0)) return { kind: "undecided", code: "no-median", detail: "no median on the row: there is no sales figure to attribute" };

  if (row.state === "NSW" && ev.nsw && ev.nsw.median === house && ev.nsw.count === count) {
    return { kind: "relabel", to: "sales-nsw", trusted: true, code: "nsw-rows-match", detail: `${money(house)} on ${count} sales equals the Valuer General rows for calendar ${ev.nsw.year} (vg-nsw, nature R, no unit number)` };
  }
  if (row.state === "SA" && ev.saQuarter) {
    return { kind: "relabel", to: "sales-sa", trusted: true, code: "sa-quarter-match", detail: `${money(house)} on ${count} sales equals the SA Government quarter ${ev.saQuarter} (sales-sa-historical)` };
  }
  if (ABS_STATES.includes(row.state) && isPeriodEnd(row.salesUpdatedAt) && !hasCensusSeedFingerprint(house, row.medianUnitPrice)) {
    return { kind: "relabel", to: "sales-abs", trusted: true, code: "abs-period-end", detail: `salesUpdatedAt ${day(row.salesUpdatedAt!)} is an ABS period end; no later sales feed wrote the row` };
  }
  if (hasCensusSeedFingerprint(house, row.medianUnitPrice)) {
    return { kind: "relabel", to: "abs-census-2021", trusted: false, code: "census-seed", detail: `house ${money(house)}, unit ${money(row.medianUnitPrice ?? 0)} (72%): the 2021 Census mortgage seed` };
  }
  if ((row.state === "QLD" || row.state === "WA") && house % 1000 === 0 && row.salesUpdatedAt && !isPeriodEnd(row.salesUpdatedAt)) {
    const to = row.state === "QLD" ? "sales-qld" : "sales-wa";
    return { kind: "relabel", to, trusted: false, code: "census-proxy", detail: `whole-thousand ${money(house)} stamped ${day(row.salesUpdatedAt)}: the census-mortgage proxy (${to})` };
  }

  if (row.state === "NSW") {
    if (!row.salesUpdatedAt) return { kind: "undecided", code: "nsw-no-stamp", detail: "no salesUpdatedAt: no sales feed run to attribute the median to" };
    if (!ev.nsw) return { kind: "undecided", code: "nsw-no-rows", detail: `no captured Valuer General house sales for this suburb and postcode in calendar ${nswAggregateYear(row.salesUpdatedAt)}` };
    return { kind: "undecided", code: "nsw-rows-differ", detail: `captured rows give ${money(ev.nsw.median)} on ${ev.nsw.count} sales for ${ev.nsw.year}; the row holds ${money(house)} on ${count} (salesUpdatedAt ${day(row.salesUpdatedAt)})` };
  }
  if (row.state === "VIC") {
    return { kind: "undecided", code: "vic-unverifiable", detail: `no stored series verifies a Land Victoria quarterly median (salesUpdatedAt ${row.salesUpdatedAt ? day(row.salesUpdatedAt) : "none"}); rerun sales-vic` };
  }
  if (row.state === "SA") return { kind: "undecided", code: "sa-no-quarter", detail: "no stored SA Government quarter has this median and sales count" };
  return { kind: "undecided", code: "no-fingerprint", detail: `no sales feed fingerprint (salesUpdatedAt ${row.salesUpdatedAt ? day(row.salesUpdatedAt) : "none"})` };
}
