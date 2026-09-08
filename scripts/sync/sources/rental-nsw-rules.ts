// Pure rules for the NSW DCJ rental feed, kept free of I/O so they can be
// unit-tested (tests/sync/rental-nsw-rules.test.ts).
//
// The DCJ Rent and Sales Report "Postcode" table has one row per postcode ×
// dwelling type × bedroom count. Dwelling types are "Total", "House",
// "Flat/Unit", "Townhouse" and "Other". Until September 2026 the feed kept
// only the Total/Total row (every dwelling type together) and stored it as
// the suburb's HOUSE rent, so Double Bay showed $1,200 and Bondi's row never
// linked at all. A suburb's house rent is the House/Total row and its unit
// rent the Flat/Unit/Total row; nothing else is a house or unit rent.
//
// DCJ's own markers in the count and rent cells: "s" = 30 or fewer bonds
// lodged in the quarter (the median is still published), "-" = 10 or fewer
// (the median is withheld). We accept what DCJ publishes and keep the count
// where it is printed.

export type DwellingClass = "house" | "unit" | "townhouse" | "other" | "all";

export function normaliseDwellingType(v: unknown): DwellingClass | null {
  const s = String(v ?? "").trim().toLowerCase();
  if (!s) return null;
  if (s === "total" || s === "all" || s === "all dwellings") return "all";
  if (s === "house" || s === "houses") return "house";
  if (/^flats?\s*\/\s*units?$/.test(s) || s === "unit" || s === "units" || s === "flat" || s === "flats") return "unit";
  if (s === "townhouse" || s === "townhouses") return "townhouse";
  if (s === "other") return "other";
  return null;
}

export function isTotalBedrooms(v: unknown): boolean {
  return String(v ?? "").trim().toLowerCase() === "total";
}

/** "Total" | 0 (bedsitter) | 1 | 2 | 3 | 4 ("4 or more") | null ("Not Specified", blank). */
export function normaliseBedrooms(v: unknown): "total" | 0 | 1 | 2 | 3 | 4 | null {
  const s = String(v ?? "").trim().toLowerCase();
  if (s === "total") return "total";
  if (s.startsWith("bedsit")) return 0;
  const m = /^(\d)\s*(?:or more\s*)?bedrooms?/.exec(s);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return n >= 4 ? 4 : (n as 1 | 2 | 3);
}

/** A DCJ number cell: 1150, "1,142", "-" (withheld) or "s" (small sample). */
export function parseDcjNumber(v: unknown): number | null {
  if (typeof v === "number") return Number.isFinite(v) && v > 0 ? Math.round(v) : null;
  const s = String(v ?? "").trim();
  if (!s || s === "-" || s.toLowerCase() === "s") return null;
  const n = parseInt(s.replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export type BondFlag = "published" | "small" | "suppressed";

export function classifyBondCount(v: unknown): { count: number | null; flag: BondFlag } {
  if (String(v ?? "").trim().toLowerCase() === "s") return { count: null, flag: "small" };
  const n = parseDcjNumber(v);
  return n === null ? { count: null, flag: "suppressed" } : { count: n, flag: "published" };
}

export interface DcjRentRow {
  postcode: unknown;
  dwellingType: unknown;
  bedrooms: unknown;
  median: unknown;
  newBonds: unknown;
}

export interface RentFigure {
  median: number;
  /** New bonds lodged in the quarter; null when DCJ prints "s" (30 or fewer). */
  newBonds: number | null;
  smallSample: boolean;
}

export interface PostcodeRents {
  postcode: string;
  house: RentFigure | null;
  unit: RentFigure | null;
  all: RentFigure | null;
  /** All dwelling types of that bedroom count (the "Total" dwelling-type rows). */
  bed1: RentFigure | null;
  bed2: RentFigure | null;
  bed3: RentFigure | null;
}

function figure(median: unknown, newBonds: unknown): RentFigure | null {
  const m = parseDcjNumber(median);
  if (m === null) return null;
  const b = classifyBondCount(newBonds);
  if (b.flag === "suppressed") return null;
  return { median: m, newBonds: b.count, smallSample: b.flag === "small" };
}

/**
 * Per postcode: house, unit and all-dwellings medians from the Total-bedrooms
 * rows, and one/two/three-bedroom medians from the all-dwellings rows by
 * bedroom count.
 */
export function selectPostcodeRents(rows: DcjRentRow[]): Map<string, PostcodeRents> {
  const out = new Map<string, PostcodeRents>();
  for (const r of rows) {
    const pc = String(r.postcode ?? "").trim();
    if (!/^\d{4}$/.test(pc)) continue;
    const cls = normaliseDwellingType(r.dwellingType);
    const beds = normaliseBedrooms(r.bedrooms);
    const entry = out.get(pc) ?? { postcode: pc, house: null, unit: null, all: null, bed1: null, bed2: null, bed3: null };
    if (beds === "total" && (cls === "house" || cls === "unit" || cls === "all")) {
      entry[cls] = figure(r.median, r.newBonds);
    } else if (cls === "all" && (beds === 1 || beds === 2 || beds === 3)) {
      entry[`bed${beds}`] = figure(r.median, r.newBonds);
    } else {
      continue;
    }
    out.set(pc, entry);
  }
  return out;
}

/**
 * A postcode with a published house or unit median is covered: the feed
 * becomes the authority for every suburb in it, and a figure DCJ withholds
 * is written as 0 (unknown) rather than left to a census or seed value.
 */
export function isCovered(p: PostcodeRents): boolean {
  return p.house !== null || p.unit !== null;
}

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const QUARTER_END_MONTHS = ["march", "june", "september", "december"];

/** "Reporting period: April to June 2026" → 2026-Q2, dated the first day of the quarter's last month. */
export function parseReportingPeriod(label: string): { period: string; periodDate: Date; year: number } | null {
  const m = label.replace(/^reporting period:\s*/i, "").trim().match(/([A-Za-z]+)\s+(\d{4})$/);
  if (!m) return null;
  const month = MONTHS.indexOf(m[1].toLowerCase());
  if (month < 0) return null;
  const year = parseInt(m[2], 10);
  const quarter = Math.floor(month / 3) + 1;
  return { period: `${year}-Q${quarter}`, periodDate: new Date(Date.UTC(year, month, 1)), year };
}

/** Row index of the header row (first cell "Postcode"); -1 when absent. */
export function findHeaderRow(raw: unknown[][]): number {
  return raw.findIndex((r) => String(r?.[0] ?? "").trim().toLowerCase() === "postcode");
}

export interface RentTablesLink { url: string; month: string; year: number }

const MONTH_ALIASES: Record<string, string> = { mar: "march", jun: "june", sep: "september", sept: "september", dec: "december" };

/**
 * Every rent-tables workbook linked from a DCJ page, newest first, one per
 * quarter. DCJ has used "rent_tables_december_2025_quarter.xlsx",
 * "rent-tables-june-2026-quarter.xlsx", "issue-151-rent-tables-mar-2025.xlsx"
 * and "issue-121-rent-tables-september-2017.xlsx"; all four parse.
 */
export function findRentTablesLinks(html: string, base: string): RentTablesLink[] {
  const re = /href="([^"]*rent[-_]tables[-_]([a-z]+)[-_](\d{4})[^"]*\.xlsx[^"]*)"/gi;
  const found = new Map<string, RentTablesLink>();
  for (const m of html.matchAll(re)) {
    const raw = m[2].toLowerCase();
    const month = MONTH_ALIASES[raw] ?? raw;
    if (!QUARTER_END_MONTHS.includes(month)) continue;
    const key = `${m[3]}-${month}`;
    if (!found.has(key)) found.set(key, { url: new URL(m[1], base).toString(), month, year: parseInt(m[3], 10) });
  }
  return [...found.values()].sort((a, b) => b.year - a.year || QUARTER_END_MONTHS.indexOf(b.month) - QUARTER_END_MONTHS.indexOf(a.month));
}

/** The newest rent-tables workbook linked from the DCJ report page. */
export function findLatestRentTablesUrl(html: string, base: string): RentTablesLink | null {
  return findRentTablesLinks(html, base)[0] ?? null;
}

/** Quarter label pairs walking back from a period: "2026-Q2", 3 → [2026 june, 2026 march, 2025 december]. */
export function quarterSequence(period: string, count: number): { year: number; month: string; period: string }[] {
  const m = /^(\d{4})-Q([1-4])$/.exec(period);
  if (!m) return [];
  let year = parseInt(m[1], 10);
  let q = parseInt(m[2], 10) - 1;
  const out: { year: number; month: string; period: string }[] = [];
  for (let i = 0; i < count; i++) {
    out.push({ year, month: QUARTER_END_MONTHS[q], period: `${year}-Q${q + 1}` });
    q -= 1;
    if (q < 0) { q = 3; year -= 1; }
  }
  return out;
}

/** Direct URLs for one quarter in both spellings DCJ has used. */
export function rentTablesUrlsForQuarter(year: number, month: string, base: string): string[] {
  return [`${base}/rent-tables-${month}-${year}-quarter.xlsx`, `${base}/rent_tables_${month}_${year}_quarter.xlsx`];
}

/** Fallback URLs for the last eight quarters, newest first, in both spellings DCJ has used. */
export function candidateRentTablesUrls(now: Date, base: string): string[] {
  const out: string[] = [];
  let year = now.getUTCFullYear();
  let q = Math.floor(now.getUTCMonth() / 3); // the quarter now in progress cannot be published yet
  for (let i = 0; i < 8; i++) {
    q -= 1;
    if (q < 0) { q = 3; year -= 1; }
    const month = QUARTER_END_MONTHS[q];
    out.push(`${base}/rent-tables-${month}-${year}-quarter.xlsx`);
    out.push(`${base}/rent_tables_${month}_${year}_quarter.xlsx`);
  }
  return out;
}
