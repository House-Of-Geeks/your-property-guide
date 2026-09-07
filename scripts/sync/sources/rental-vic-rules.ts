// Pure rules for the Victorian rental feed (DFFH Rental Report, moving annual
// rents by suburb), kept free of I/O so they can be unit-tested
// (tests/sync/rental-vic-rules.test.ts).
//
// The workbook has one sheet per dwelling type. A suburb's house rent is the
// 3-bedroom-house median (then 4-bedroom, then 2-bedroom); its unit rent is
// the 2-bedroom-flat median (then 1-bedroom, then 3-bedroom flat). Nothing
// falls back to the "All properties" sheet: that is every dwelling type
// together, and stored as a house rent it under-reads house-and-flat suburbs
// by half (Toorak, Sep 2025: all properties $688, 3-bedroom houses $1,250).
// The feed's 3 April 2026 version did exactly that; its rows are the legacy
// the feed now deletes.

export type SheetKey = "1bed_flat" | "2bed_flat" | "3bed_flat" | "2bed_house" | "3bed_house" | "4bed_house" | "all";

export const SHEETS: Record<string, SheetKey> = {
  "1 bedroom flat":  "1bed_flat",
  "2 bedroom flat":  "2bed_flat",
  "3 bedroom flat":  "3bed_flat",
  "2 bedroom house": "2bed_house",
  "3 bedroom house": "3bed_house",
  "4 bedroom house": "4bed_house",
  "All properties":  "all",
};

export type GroupMedians = Partial<Record<SheetKey, number>>;

export function pickHouseRent(m: GroupMedians): number | null {
  return m["3bed_house"] ?? m["4bed_house"] ?? m["2bed_house"] ?? null;
}

export function pickUnitRent(m: GroupMedians): number | null {
  return m["2bed_flat"] ?? m["1bed_flat"] ?? m["3bed_flat"] ?? null;
}

const QUARTER: Record<string, { q: string; month: number }> = {
  Mar: { q: "Q1", month: 3 }, Jun: { q: "Q2", month: 6 }, Sep: { q: "Q3", month: 9 }, Dec: { q: "Q4", month: 12 },
};

/** "Sep 2025" → 2025-Q3, dated the first day of the quarter's last month (UTC). */
export function parseQuarterLabel(label: unknown): { period: string; periodDate: Date } | null {
  const m = String(label ?? "").trim().match(/^(Mar|Jun|Sep|Dec)\s+(\d{4})$/);
  if (!m) return null;
  const { q, month } = QUARTER[m[1]];
  const year = parseInt(m[2], 10);
  return { period: `${year}-${q}`, periodDate: new Date(Date.UTC(year, month - 1, 1)) };
}

export interface QuarterColumn { period: string; periodDate: Date; col: number }

/**
 * The newest quarter column that holds data. Row 1 carries quarter labels in
 * Count/Median pairs, row 2 the "Count"/"Median" captions, data from row 3.
 * Later quarters can be present as empty columns.
 */
export function findLatestPopulatedQuarter(raw: unknown[][]): QuarterColumn | null {
  const quarterRow = raw[1] ?? [];
  const captionRow = raw[2] ?? [];
  for (let c = quarterRow.length - 1; c >= 2; c--) {
    const parsed = parseQuarterLabel(quarterRow[c]);
    if (!parsed) continue;
    const caption = String(captionRow[c] ?? "").trim().toLowerCase();
    const next = String(captionRow[c + 1] ?? "").trim().toLowerCase();
    const medianCol = caption === "median" ? c : caption === "count" && next === "median" ? c + 1 : -1;
    if (medianCol < 0) continue;
    const hasData = raw.slice(3).some((r) => r?.[medianCol] !== "" && r?.[medianCol] != null);
    if (hasData) return { ...parsed, col: medianCol };
  }
  return null;
}

/** DFFH cell → median; blank, "-" or non-numeric → null. */
export function parseMedian(v: unknown): number | null {
  if (typeof v === "number") return v > 0 ? Math.round(v) : null;
  const n = parseInt(String(v ?? "").replace(/,/g, ""), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** "Werribee-Hoppers Crossing" → ["Werribee", "Hoppers Crossing"]; a plain name stays whole. */
export function splitGroupName(raw: string): string[] {
  const parts = raw.trim().split(/\s*-\s*|\s*\/\s*/).map((s) => s.trim()).filter(Boolean);
  return parts.length > 0 ? parts : [raw.trim()];
}

/** Direct DFFH workbook URLs for the last eight quarters, newest first, in the spellings the site has used. */
export function candidateVicUrls(now: Date): string[] {
  const months = ["march", "june", "september", "december"];
  const out: string[] = [];
  let year = now.getUTCFullYear();
  let q = Math.floor(now.getUTCMonth() / 3);
  for (let i = 0; i < 8; i++) {
    q -= 1;
    if (q < 0) { q = 3; year -= 1; }
    out.push(`https://www.dffh.vic.gov.au/moving-annual-rent-suburb-${months[q]}-quarter-${year}-excel`);
    out.push(`https://www.dffh.vic.gov.au/moving-annual-rents-suburb-${months[q]}-quarter-${year}-excel`);
  }
  return out;
}
