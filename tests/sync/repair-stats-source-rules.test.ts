// The stats-source repair puts back the label of the feed that wrote the median, and only on evidence.
import { describe, expect, it } from "vitest";
import {
  decideStatsSource,
  hasCensusSeedFingerprint,
  isPeriodEnd,
  isRentalLabel,
  nswAggregateYear,
  type RepairRow,
} from "../../scripts/sync/repair-stats-source-rules";
import { isReliableSalesSource } from "../../src/lib/suburb-data-quality";

const SEP6 = new Date("2026-09-05T14:52:00Z"); // the 6 Sep 2026 sales-nsw --from-rows run, AEST
const row = (over: Partial<RepairRow> = {}): RepairRow => ({
  state: "NSW", statsSource: "rental-nsw", medianHousePrice: 5_535_000, medianUnitPrice: 0, salesCountHouse: 228, salesUpdatedAt: SEP6, ...over,
});

describe("fingerprints", () => {
  it("knows a rental label", () => {
    for (const s of ["rental-nsw", "rental-vic", "rental-qld", "rental-sa", "rental-wa", " rental-nsw"]) expect(isRentalLabel(s), s).toBe(true);
    for (const s of ["sales-nsw", "seed", "", null, undefined]) expect(isRentalLabel(s), String(s)).toBe(false);
  });
  it("reads the ABS period end, and only that, as sales-abs's stamp", () => {
    expect(isPeriodEnd(new Date("2024-12-31"))).toBe(true);
    expect(isPeriodEnd(new Date("2024-12-31T00:00:01Z"))).toBe(false);
    expect(isPeriodEnd(new Date("2026-09-06T00:00:00Z"))).toBe(false);
    expect(isPeriodEnd(null)).toBe(false);
  });
  it("reads the census seed's 72% unit price on a whole-thousand house price", () => {
    expect(hasCensusSeedFingerprint(286_000, 205_920)).toBe(true);
    expect(hasCensusSeedFingerprint(286_000, 0)).toBe(false);
    expect(hasCensusSeedFingerprint(286_500, Math.round(286_500 * 0.72))).toBe(false);
  });
  it("uses the year sales-nsw aggregated on that run", () => {
    expect(nswAggregateYear(SEP6)).toBe(2025);
  });
});

describe("decideStatsSource", () => {
  it("NSW: sales-nsw when the median and the count equal the captured rows' aggregate", () => {
    const d = decideStatsSource(row(), { nsw: { year: 2025, median: 5_535_000, count: 228 } });
    expect(d).toMatchObject({ kind: "relabel", to: "sales-nsw", trusted: true, code: "nsw-rows-match" });
  });
  it("NSW: undecided when either figure differs, or there are no rows or no stamp", () => {
    expect(decideStatsSource(row(), { nsw: { year: 2025, median: 5_535_000, count: 227 } })).toMatchObject({ kind: "undecided", code: "nsw-rows-differ" });
    expect(decideStatsSource(row(), { nsw: { year: 2025, median: 3_000_000, count: 228 } })).toMatchObject({ kind: "undecided", code: "nsw-rows-differ" });
    expect(decideStatsSource(row(), { nsw: null })).toMatchObject({ kind: "undecided", code: "nsw-no-rows" });
    expect(decideStatsSource(row({ salesUpdatedAt: null }))).toMatchObject({ kind: "undecided", code: "nsw-no-stamp" });
  });
  it("SA: sales-sa only when a stored quarter has the same median and count", () => {
    const sa = row({ state: "SA", statsSource: "rental-sa", medianHousePrice: 905_000, salesCountHouse: 31 });
    expect(decideStatsSource(sa, { saQuarter: "2026-Q2" })).toMatchObject({ kind: "relabel", to: "sales-sa", trusted: true });
    expect(decideStatsSource(sa, { saQuarter: null })).toMatchObject({ kind: "undecided", code: "sa-no-quarter" });
  });
  it("sales-abs on an ABS period end, in the states the ABS feed writes", () => {
    const qld = row({ state: "QLD", statsSource: "rental-qld", medianHousePrice: 1_095_000, medianUnitPrice: 640_000, salesCountHouse: 0, salesUpdatedAt: new Date("2024-12-31") });
    expect(decideStatsSource(qld)).toMatchObject({ kind: "relabel", to: "sales-abs", trusted: true, code: "abs-period-end" });
    expect(decideStatsSource({ ...qld, state: "VIC", statsSource: "rental-vic" })).toMatchObject({ kind: "undecided", code: "vic-unverifiable" });
  });
  it("the census seed's figures are relabelled, and stay withheld", () => {
    const vic = row({ state: "VIC", statsSource: "rental-vic", medianHousePrice: 286_000, medianUnitPrice: 205_920, salesCountHouse: 0, salesUpdatedAt: new Date("2026-04-05T02:00:00Z") });
    const d = decideStatsSource(vic);
    expect(d).toMatchObject({ kind: "relabel", to: "abs-census-2021", trusted: false, code: "census-seed" });
    expect(isReliableSalesSource(d.kind === "relabel" ? d.to : "")).toBe(false);
    // even on an ABS period end: the seed's figures are on the row, not the ABS median
    expect(decideStatsSource({ ...vic, state: "QLD", salesUpdatedAt: new Date("2024-12-31") })).toMatchObject({ code: "census-seed" });
  });
  it("QLD and WA whole-thousand prices with a run-time stamp are the census-mortgage proxy, still withheld", () => {
    const qld = row({ state: "QLD", statsSource: "rental-qld", medianHousePrice: 369_000, medianUnitPrice: 0, salesCountHouse: 0, salesUpdatedAt: new Date("2026-05-07T00:00:00Z") });
    expect(decideStatsSource(qld)).toMatchObject({ kind: "relabel", to: "sales-qld", trusted: false });
    expect(decideStatsSource({ ...qld, state: "WA", statsSource: "rental-wa" })).toMatchObject({ kind: "relabel", to: "sales-wa", trusted: false });
    expect(decideStatsSource({ ...qld, salesUpdatedAt: null })).toMatchObject({ kind: "undecided", code: "no-fingerprint" });
  });
  it("never decides a row with no median", () => {
    expect(decideStatsSource(row({ medianHousePrice: 0 }), { nsw: { year: 2025, median: 0, count: 0 } })).toMatchObject({ kind: "undecided", code: "no-median" });
  });
  it("only ever hands a trusted label to a row the feed's own evidence names", () => {
    const trustedOut = [
      decideStatsSource(row(), { nsw: { year: 2025, median: 5_535_000, count: 228 } }),
      decideStatsSource(row({ state: "SA" }), { saQuarter: "2026-Q2" }),
      decideStatsSource(row({ state: "WA", medianUnitPrice: 1, salesUpdatedAt: new Date("2024-12-31") })),
    ];
    for (const d of trustedOut) expect(d.kind === "relabel" && d.trusted && isReliableSalesSource(d.to)).toBe(true);
    for (const d of [decideStatsSource(row({ state: "VIC" })), decideStatsSource(row({ state: "SA" })), decideStatsSource(row())]) {
      expect(d.kind === "relabel" && d.trusted).toBe(false);
    }
  });
});
