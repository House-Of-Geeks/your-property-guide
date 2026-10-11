/**
 * VIC Property Sales Sync (Land Victoria / Department of Transport and Planning)
 *
 * Downloads the quarterly median house and unit price XLS files from
 * the Victorian Property Sales Report via CKAN on discover.data.vic.gov.au.
 *
 * XLS layout (houses and units are identical format):
 *   Rows 1–4: multi-row merged header (quarter labels + years)
 *   Row 5+:   data — Locality (col 0), 4 prior quarters (pairs col 1+2 … 7+8),
 *             current quarter median (col 9), flag (col 10),
 *             sales this quarter (col 11), sales YTD (col 12),
 *             YoY change % (col 13), QoQ change % (col 14)
 *   Last row: footnote legend — skip rows where col 0 starts with "^" or "*"
 *
 * No postcode column — suburbs matched by name+state.
 *
 * Sales count (10 Oct 2026, commercial intent review, suburbs-market 0.2a):
 * the house file's "sales this quarter" (col 11) is written to
 * Suburb.salesCountHouse, so the five-sale rule (MIN_SALES_FOR_MEDIAN,
 * src/lib/sales-provenance.ts), which applies "where the count is known",
 * applies in Victoria too. Until then the feed wrote no count, and house
 * medians of apartment precincts (Melbourne 3000 at $381,000, Southbank,
 * Docklands, Travancore) published on any number of sales. The count is
 * the current quarter's, so it is written only when the latest median
 * column is the current-quarter column (col 9) it sits beside.
 *
 * Data sources:
 *   https://discover.data.vic.gov.au/dataset/victorian-property-sales-report-median-house-by-suburb
 *   https://discover.data.vic.gov.au/dataset/victorian-property-sales-report-median-unit-by-suburb
 * License: CC BY 4.0
 * Schedule: Quarterly
 */
import "dotenv/config";
import * as XLSX from "xlsx";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";

const SOURCE_ID = "sales-vic";
const CKAN_BASE = "https://discover.data.vic.gov.au";

const PACKAGES = {
  house: "victorian-property-sales-report-median-house-by-suburb",
  unit:  "victorian-property-sales-report-median-unit-by-suburb",
};

const QUARTER_MAP: Record<string, string> = {
  "Jan-Mar": "Q1", "Apr-Jun": "Q2", "Jul-Sep": "Q3", "Oct-Dec": "Q4",
};
const MONTH_NUM: Record<string, number> = {
  "Jan-Mar": 3, "Apr-Jun": 6, "Jul-Sep": 9, "Oct-Dec": 12,
};

/** The current quarter's median column; "sales this quarter" (col 11) belongs to it. */
export const CURRENT_MEDIAN_COL = 9;
export const SALES_THIS_QUARTER_COL = 11;

/** Sales recorded in the quarter, from a "sales this quarter" cell. Null when the cell holds no count ("-", "NA", blank). */
export function parseSalesCount(cell: unknown): number | null {
  if (typeof cell === "number") return Number.isFinite(cell) && cell >= 0 ? Math.round(cell) : null;
  const text = String(cell ?? "").replace(/,/g, "").trim();
  if (!/^\d+$/.test(text)) return null;
  return parseInt(text, 10);
}

/**
 * The house sales count for each locality in a file whose latest median sits
 * in `latestCol`. Empty when that is not the current-quarter column: the
 * count would then describe a different quarter from the median written.
 */
export function salesCountsByLocality(raw: (string | number)[][], latestCol: number, dataStart = 4): Map<string, number> {
  const counts = new Map<string, number>();
  if (latestCol !== CURRENT_MEDIAN_COL) return counts;
  for (let i = dataStart; i < raw.length; i++) {
    const row = raw[i] ?? [];
    const locality = String(row[0] ?? "").trim();
    if (!locality || locality.startsWith("^") || locality.startsWith("*") || locality.startsWith("Source")) continue;
    const n = parseSalesCount(row[SALES_THIS_QUARTER_COL]);
    if (n !== null) counts.set(locality.toLowerCase(), n);
  }
  return counts;
}

interface LatestResource { url: string; periodEnd: string }

async function getLatestResource(packageId: string): Promise<LatestResource> {
  const apiUrl = `${CKAN_BASE}/api/3/action/package_show?id=${packageId}`;
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error(`CKAN HTTP ${res.status}: ${apiUrl}`);
  const json = await res.json() as { success: boolean; result: { resources: Array<{ url: string; period_end?: string; metadata_modified?: string }> } };
  if (!json.success) throw new Error(`CKAN error: ${packageId}`);

  const resources = [...json.result.resources];
  // Sort by period_end desc (most recent first)
  resources.sort((a, b) => (b.period_end ?? b.metadata_modified ?? "").localeCompare(a.period_end ?? a.metadata_modified ?? ""));

  const latest = resources[0];
  if (!latest?.url) throw new Error(`No resource URL found for ${packageId}`);
  return { url: latest.url, periodEnd: latest.period_end ?? "" };
}

async function tryFetch(url: string): Promise<Buffer | null> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Referer":    "https://www.land.vic.gov.au/",
      "Accept":     "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,*/*",
    },
    redirect: "follow",
  });
  if (!res.ok) return null;
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("text/html")) return null;
  return Buffer.from(await res.arrayBuffer());
}

async function downloadXls(url: string): Promise<Buffer> {
  // land.vic.gov.au is behind Cloudflare which now serves a JS challenge to
  // server-side fetches. Fall back to the latest Wayback Machine snapshot,
  // which mirrors the file as a real XLS.
  const direct = await tryFetch(url);
  if (direct) return direct;
  log(SOURCE_ID, `direct fetch blocked, falling back to web.archive.org`);

  const wayback = await tryFetch(`https://web.archive.org/web/2025/${url}`);
  if (wayback) return wayback;

  throw new Error(`Both direct and Wayback Machine fetches failed for ${url}`);
}

/** Parse the multi-row header to find the most recent quarter column index and period string. */
function findLatestQuarterCol(raw: (string | number)[][]): { col: number; period: string; periodDate: Date } | null {
  // Row 1 (index 0): quarter labels ("Apr-Jun", "", "Jul-Sep", "", ...)
  // Row 2 (index 1): years (2024, "", 2024, "", 2025, ...)
  const labelRow = (raw[0] ?? []) as (string | number)[];
  const yearRow  = (raw[1] ?? []) as (string | number)[];

  let latestCol = -1;
  let latestPeriod = "";
  let latestPeriodDate: Date | null = null;
  let latestYear = -1;
  let latestQIdx = -1;

  const QUARTER_ORDER = ["Jan-Mar", "Apr-Jun", "Jul-Sep", "Oct-Dec"];

  // Data columns start at index 1, in pairs (median, flag)
  // Columns 1,3,5,7,9 are the median columns for each quarter
  for (let c = 1; c <= 9; c += 2) {
    const label = String(labelRow[c] ?? "").trim();
    const year  = parseInt(String(yearRow[c] ?? ""));
    if (!QUARTER_MAP[label] || !year) continue;

    const qIdx = QUARTER_ORDER.indexOf(label);
    if (year > latestYear || (year === latestYear && qIdx > latestQIdx)) {
      latestYear = year;
      latestQIdx = qIdx;
      latestCol = c;
      latestPeriod = `${year}-${QUARTER_MAP[label]}`;
      const mon = MONTH_NUM[label];
      latestPeriodDate = new Date(`${year}-${String(mon).padStart(2, "0")}-01`);
    }
  }

  if (latestCol < 0 || !latestPeriodDate) return null;
  return { col: latestCol, period: latestPeriod, periodDate: latestPeriodDate };
}

async function processFile(
  label: "house" | "unit",
  packageId: string
): Promise<{ medians: Map<string, number>; counts: Map<string, number>; period: string; periodDate: Date; yoyCol: number }> {
  const { url } = await getLatestResource(packageId);
  log(SOURCE_ID, `${label}: downloading from ${url}`);

  const buffer = await downloadXls(url);
  const wb = XLSX.read(buffer, { type: "buffer" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json<(string | number)[]>(ws, { header: 1, defval: "" });

  const found = findLatestQuarterCol(raw);
  if (!found) throw new Error(`Could not find latest quarter column in VIC ${label} XLS`);
  log(SOURCE_ID, `${label}: most recent quarter ${found.period} (column ${found.col})`);

  // YoY change % is at col 13 (fixed position in file)
  const YOY_COL = 13;

  const medians = new Map<string, number>(); // normName → { median, yoy }
  const DATA_START = 4; // row index 4 = row 5

  for (let i = DATA_START; i < raw.length; i++) {
    const row = raw[i];
    const locality = String(row[0] ?? "").trim();
    if (!locality || locality.startsWith("^") || locality.startsWith("*") || locality.startsWith("Source")) continue;

    const medianRaw = row[found.col];
    const median = typeof medianRaw === "number" ? medianRaw : parseInt(String(medianRaw).replace(/,/g, "")) || 0;
    if (!median) continue;

    medians.set(locality.toLowerCase(), median);
  }

  const counts = salesCountsByLocality(raw, found.col, DATA_START);
  if (found.col !== CURRENT_MEDIAN_COL) {
    log(SOURCE_ID, `${label}: latest median is in column ${found.col}, not ${CURRENT_MEDIAN_COL}; sales counts not read (they describe the current quarter)`);
  } else {
    log(SOURCE_ID, `${label}: sales counts for ${counts.size} localities`);
  }

  return { medians, counts, period: found.period, periodDate: found.periodDate, yoyCol: YOY_COL };
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    // Download house and unit files
    const [houseData, unitData] = await Promise.allSettled([
      processFile("house", PACKAGES.house),
      processFile("unit",  PACKAGES.unit),
    ]);

    const house = houseData.status === "fulfilled" ? houseData.value : null;
    const unit  = unitData.status  === "fulfilled" ? unitData.value  : null;

    if (!house && !unit) {
      throw new Error("Both VIC house and unit downloads failed");
    }

    const period     = house?.period     ?? unit?.period     ?? "";
    const periodDate = house?.periodDate ?? unit?.periodDate ?? new Date();

    log(SOURCE_ID, `period: ${period}`);

    // Load VIC suburbs from DB
    const suburbs = await prisma.suburb.findMany({
      where: { state: "VIC" },
      select: { id: true, name: true },
    });
    log(SOURCE_ID, `matching against ${suburbs.length} VIC suburbs`);

    let count = 0;
    let countsOnly = 0;

    for (const suburb of suburbs) {
      const key = suburb.name.toLowerCase();
      const medianHouse = house?.medians.get(key) ?? null;
      const medianUnit  = unit?.medians.get(key)  ?? null;
      // House sales this quarter, from the house file (null when not read).
      const salesHouse  = house?.counts.get(key) ?? null;

      if (!medianHouse && !medianUnit) {
        // No median this quarter but a count on file (too few sales for
        // Land Victoria to publish one): record the count, so a median left
        // by an earlier quarter on fewer than five sales is withheld. The
        // label is left as it is.
        if (salesHouse !== null) {
          await prisma.suburb.update({ where: { id: suburb.id }, data: { salesCountHouse: salesHouse } });
          countsOnly++;
        }
        continue;
      }

      await prisma.suburb.update({
        where: { id: suburb.id },
        data: {
          ...(medianHouse ? { medianHousePrice: medianHouse } : {}),
          ...(medianUnit  ? { medianUnitPrice:  medianUnit  } : {}),
          ...(salesHouse !== null ? { salesCountHouse: salesHouse } : {}),
          statsSource:    SOURCE_ID,
          statsUpdatedAt: new Date(),
          salesUpdatedAt: new Date(),
        },
      });
      count++;
    }

    log(SOURCE_ID, `updated ${count} VIC suburbs; sales count only on ${countsOnly} more`);
    await finishSync(SOURCE_ID, count, periodDate);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
