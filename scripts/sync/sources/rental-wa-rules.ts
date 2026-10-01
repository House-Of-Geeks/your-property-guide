// Pure rules for the WA rental bond feed (rental-wa.ts), kept free of I/O so
// they can be unit-tested (tests/sync/rental-wa-rules.test.ts).
//
// Source: "WA Rental Bonds Data 2023 - Current", National Housing Data
// Exchange, Government of Western Australia, CC BY 4.0. A monthly ZIP holds
// one "Monthly Bond Lodgement Summary" CSV per month since March 2023: one
// row per bond lodged, with the lodgement date ("01-JUN-26"), the locality
// (a delivery-area name, mostly uppercase), the postcode and the weekly rent.
// No dwelling type and no bedrooms: every median here covers ALL DWELLINGS
// and is never a house or unit rent.
//
// The rules, per locality, postcode and calendar quarter:
//   - rents under $50 or over $5,000 a week are dropped (218 of 266,492 bonds
//     to August 2026: $0 placeholders, and a few five-figure entries);
//   - the median is published only with more than 10 bonds (11+), the line
//     the NSW Rental Bond Board data draws: DCJ prints "-" and withholds the
//     median where 10 or fewer bonds were lodged. 30 or fewer is a small
//     sample (DCJ's "s"), published and labelled as such on the page;
//   - and only when fewer than half the bonds share one identical rent. A
//     block lodged by one landlord or housing program at a single rent sets
//     the median on its own: Karratha 6714, July to September 2026, 10 of 15
//     bonds at $280 a week against market lettings of $750 to $1,300;
//     Wickham 6720, January to March 2025, 13 of 21 at $93.21.
//   - a quarter counts only when the data holds all three of its months;
//   - a suburb is written only when it has a published median in one of the
//     four newest quarters, so its page never opens on a rent more than a
//     year old (Karratha 6714's only published quarter in three years is
//     April to June 2024, $540 on 16 bonds); its earlier published quarters
//     come with it as history.

import Papa from "papaparse";
import { stateMatchesPostcode } from "../../../src/lib/postcode-states";

export const MIN_RENT = 50;
export const MAX_RENT = 5000;
/** DCJ withholds a median on 10 or fewer bonds; WA follows the same line. */
export const MIN_BONDS = 11;
/** DCJ flags 30 or fewer bonds as a small sample ("s"). */
export const SMALL_SAMPLE_MAX = 30;
/** Half or more of a quarter's bonds at one identical rent: withheld. */
export const MAX_SINGLE_RENT_SHARE = 0.5;
/** Three years of complete quarters. */
export const DEFAULT_HISTORY_QUARTERS = 12;
/** A suburb needs a published median in this many newest quarters to be written at all. */
export const RECENT_QUARTERS = 4;

const MONTHS: Record<string, number> = { JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6, JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12 };

export interface YearMonth { year: number; month: number }

/** "01-JUN-26" → { year: 2026, month: 6 }; null for anything else. */
export function parseLodgementDate(v: unknown): YearMonth | null {
  const m = /^(\d{1,2})-([A-Za-z]{3})-(\d{2}|\d{4})$/.exec(String(v ?? "").trim());
  if (!m) return null;
  const month = MONTHS[m[2].toUpperCase()];
  const day = parseInt(m[1], 10);
  if (!month || day < 1 || day > 31) return null;
  const year = m[3].length === 2 ? 2000 + parseInt(m[3], 10) : parseInt(m[3], 10);
  return { year, month };
}

/** "457.50", "$1,200" → a number; null when it is not one. */
export function parseWeeklyRent(v: unknown): number | null {
  const s = String(v ?? "").trim().replace(/[$,\s]/g, "");
  if (!/^\d+(\.\d+)?$/.test(s)) return null;
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

export function isPlausibleRent(n: number): boolean {
  return n >= MIN_RENT && n <= MAX_RENT;
}

/**
 * The locality as the bond form carries it, reduced to one spelling:
 * " Ashby, WA", "ASHBY WA" and "Ashby" are the same place. Uppercase,
 * one apostrophe, single spaces, no leading punctuation, no trailing state.
 */
export function normaliseLocality(v: unknown): string {
  return String(v ?? "")
    .toUpperCase()
    .replace(/[\u2018\u2019`]/g, "'") // O’CONNOR and O'CONNOR are one place
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[^A-Z0-9]+/, "")
    .replace(/[\s,]+(WA|W\.A\.?|WESTERN AUSTRALIA)$/, "")
    .replace(/[\s,.]+$/, "")
    .trim();
}

export function normalisePostcode4(v: unknown): string | null {
  const s = String(v ?? "").trim();
  return /^\d{4}$/.test(s) ? s : null;
}

/** 2026, 6 → 2026-Q2, dated the first day of the quarter's last month (the NSW feed's convention). */
export function quarterOf(year: number, month: number): { period: string; periodDate: Date } {
  const q = Math.floor((month - 1) / 3) + 1;
  return { period: `${year}-Q${q}`, periodDate: new Date(Date.UTC(year, q * 3 - 1, 1)) };
}

/** A lodgement CSV inside the ZIP; the macOS resource forks beside them are not. */
export function isLodgementEntry(entryName: string): boolean {
  if (/(^|\/)__MACOSX\//.test(entryName)) return false;
  const base = entryName.split("/").pop() ?? "";
  if (base.startsWith("._")) return false;
  return /^Monthly Bond Lodgement Summary.*\.csv$/i.test(base);
}

export interface Lodgement {
  locality: string;
  postcode: string;
  year: number;
  month: number;
  rent: number;
}

export interface ParseTally {
  rows: number;
  kept: number;
  badDate: number;
  badRent: number;
  outlier: number;
  noPlace: number;
}

export function emptyTally(): ParseTally {
  return { rows: 0, kept: 0, badDate: 0, badRent: 0, outlier: 0, noPlace: 0 };
}

/** One lodgement CSV. Header: "LODGEMENT DATE","LOCALITY NAME","POSTCODE","WEEKLY RENT AMOUNT". */
export function parseLodgementCsv(text: string, tally: ParseTally = emptyTally()): Lodgement[] {
  const { data } = Papa.parse<Record<string, string>>(text.replace(/^﻿/, ""), {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toUpperCase(),
  });
  const out: Lodgement[] = [];
  for (const r of data) {
    tally.rows++;
    const ym = parseLodgementDate(r["LODGEMENT DATE"]);
    if (!ym) { tally.badDate++; continue; }
    const rent = parseWeeklyRent(r["WEEKLY RENT AMOUNT"]);
    if (rent === null) { tally.badRent++; continue; }
    if (!isPlausibleRent(rent)) { tally.outlier++; continue; }
    const locality = normaliseLocality(r["LOCALITY NAME"]);
    const postcode = normalisePostcode4(r["POSTCODE"]);
    if (!locality || !postcode) { tally.noPlace++; continue; }
    tally.kept++;
    out.push({ locality, postcode, year: ym.year, month: ym.month, rent });
  }
  return out;
}

/**
 * Quarters with all three months in the data, newest first. The release on
 * the 1st to 3rd of a month carries the month before, so a quarter is
 * complete from the release after its last month.
 */
export function completeQuarters(months: Iterable<YearMonth>): { period: string; periodDate: Date }[] {
  const seen = new Set<string>();
  for (const { year, month } of months) seen.add(`${year}-${month}`);
  const byQuarter = new Map<string, { period: string; periodDate: Date; n: number }>();
  for (const key of seen) {
    const [y, m] = key.split("-").map((x) => parseInt(x, 10));
    const q = quarterOf(y, m);
    const e = byQuarter.get(q.period) ?? { ...q, n: 0 };
    e.n++;
    byQuarter.set(q.period, e);
  }
  return [...byQuarter.values()]
    .filter((q) => q.n === 3)
    .sort((a, b) => b.periodDate.getTime() - a.periodDate.getTime())
    .map(({ period, periodDate }) => ({ period, periodDate }));
}

/** The middle value; the mean of the middle two for an even count. Whole dollars. */
export function medianRent(values: readonly number[]): number {
  if (values.length === 0) throw new Error("median of nothing");
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  const m = s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
  return Math.round(m);
}

/** Share of the values taken by the most common one, and that value. */
export function singleRentShare(values: readonly number[]): { share: number; rent: number } {
  const counts = new Map<number, number>();
  let best = 0;
  let rent = 0;
  for (const v of values) {
    const c = (counts.get(v) ?? 0) + 1;
    counts.set(v, c);
    if (c > best) { best = c; rent = v; }
  }
  return { share: values.length ? best / values.length : 0, rent };
}

export type CellStatus = "published" | "too-few-bonds" | "single-rent";

export interface QuarterCell {
  locality: string;
  postcode: string;
  period: string;
  periodDate: Date;
  bonds: number;
  median: number;
  singleRent: { share: number; rent: number };
  status: CellStatus;
  smallSample: boolean;
}

export function classifyCell(bonds: number, singleShare: number): CellStatus {
  if (bonds < MIN_BONDS) return "too-few-bonds";
  if (singleShare >= MAX_SINGLE_RENT_SHARE) return "single-rent";
  return "published";
}

export const cellKey = (locality: string, postcode: string) => `${locality}|${postcode}`;

/**
 * Every locality, postcode and quarter in `periods` (the complete quarters
 * to load), with its median, its bond count and whether it is published.
 */
export function aggregateQuarterly(rows: readonly Lodgement[], periods: readonly { period: string; periodDate: Date }[]): QuarterCell[] {
  const wanted = new Map(periods.map((p) => [p.period, p.periodDate]));
  const groups = new Map<string, { locality: string; postcode: string; period: string; rents: number[] }>();
  for (const r of rows) {
    const { period } = quarterOf(r.year, r.month);
    if (!wanted.has(period)) continue;
    const key = `${cellKey(r.locality, r.postcode)}|${period}`;
    const g = groups.get(key) ?? { locality: r.locality, postcode: r.postcode, period, rents: [] };
    g.rents.push(r.rent);
    groups.set(key, g);
  }
  const out: QuarterCell[] = [];
  for (const g of groups.values()) {
    const single = singleRentShare(g.rents);
    const status = classifyCell(g.rents.length, single.share);
    out.push({
      locality: g.locality,
      postcode: g.postcode,
      period: g.period,
      periodDate: wanted.get(g.period) as Date,
      bonds: g.rents.length,
      median: medianRent(g.rents),
      singleRent: single,
      status,
      smallSample: g.rents.length <= SMALL_SAMPLE_MAX,
    });
  }
  return out;
}

// ── Matching to Suburb rows ─────────────────────────────────────────────────

export interface SuburbRef {
  id: string;
  slug: string;
  name: string;
  postcode: string;
  state: string;
}

const nameKey = (name: string, postcode: string) => `${normaliseLocality(name)}|${postcode.trim()}`;

/**
 * WA suburbs by name and postcode. The caller has already left out the rows
 * that are not places (LOCALITIES_ONLY); a row filed under a state its
 * postcode does not belong to is skipped here, as the slug matcher does, and
 * a name and postcode shared by two rows matches neither.
 */
export function buildSuburbIndex(suburbs: readonly SuburbRef[]): Map<string, SuburbRef | null> {
  const index = new Map<string, SuburbRef | null>();
  for (const s of suburbs) {
    if (s.state.trim().toUpperCase() !== "WA") continue;
    if (!stateMatchesPostcode(s)) continue;
    const key = nameKey(s.name, s.postcode);
    index.set(key, index.has(key) ? null : s);
  }
  return index;
}

/** Exact name and postcode, nothing looser: a wrong postcode on a bond form attaches nothing. */
export function resolveLocality(index: Map<string, SuburbRef | null>, locality: string, postcode: string): SuburbRef | null {
  return index.get(nameKey(locality, postcode)) ?? null;
}

export interface PlannedRow {
  id: string;
  slug: string;
  name: string;
  postcode: string;
  period: string;
  periodDate: Date;
  median: number;
  bonds: number;
}

export interface Plan {
  rows: PlannedRow[];
  /** Locality+postcode pairs with a recent published quarter and no suburb, with their bonds in the published quarters. */
  unmatched: { locality: string; postcode: string; bonds: number; quarters: number }[];
  /** Pairs whose newest published quarter is older than the recent ones: not written. */
  stale: { locality: string; postcode: string; period: string; median: number; bonds: number }[];
}

/**
 * One row per suburb and published quarter, for the suburbs with a published
 * median in `recentPeriods` (the RECENT_QUARTERS newest; every period when
 * omitted).
 */
export function planRows(cells: readonly QuarterCell[], index: Map<string, SuburbRef | null>, recentPeriods?: ReadonlySet<string>): Plan {
  const published = cells.filter((c) => c.status === "published");
  const recent = new Set(published.filter((c) => !recentPeriods || recentPeriods.has(c.period)).map((c) => cellKey(c.locality, c.postcode)));
  const staleByPair = new Map<string, QuarterCell>();
  for (const c of published) {
    const k = cellKey(c.locality, c.postcode);
    if (recent.has(k)) continue;
    const prev = staleByPair.get(k);
    if (!prev || c.periodDate > prev.periodDate) staleByPair.set(k, c);
  }
  const rows: PlannedRow[] = [];
  const unmatched = new Map<string, { locality: string; postcode: string; bonds: number; quarters: number }>();
  for (const c of published) {
    if (!recent.has(cellKey(c.locality, c.postcode))) continue;
    const s = resolveLocality(index, c.locality, c.postcode);
    if (!s) {
      const k = cellKey(c.locality, c.postcode);
      const u = unmatched.get(k) ?? { locality: c.locality, postcode: c.postcode, bonds: 0, quarters: 0 };
      u.bonds += c.bonds;
      u.quarters++;
      unmatched.set(k, u);
      continue;
    }
    rows.push({ id: s.id, slug: s.slug, name: s.name, postcode: s.postcode, period: c.period, periodDate: c.periodDate, median: c.median, bonds: c.bonds });
  }
  rows.sort((a, b) => a.slug.localeCompare(b.slug) || b.periodDate.getTime() - a.periodDate.getTime());
  const stale = [...staleByPair.values()]
    .map((c) => ({ locality: c.locality, postcode: c.postcode, period: c.period, median: c.median, bonds: c.bonds }))
    .sort((a, b) => b.period.localeCompare(a.period) || a.locality.localeCompare(b.locality));
  return { rows, unmatched: [...unmatched.values()].sort((a, b) => b.bonds - a.bonds), stale };
}
