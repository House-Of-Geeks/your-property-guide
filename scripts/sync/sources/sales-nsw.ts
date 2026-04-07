/**
 * NSW Property Sales Sync (NSW Valuer General PSI)
 *
 * Downloads yearly bulk Property Sales Information (PSI) ZIP files from
 * the NSW Valuer General, parses the semicolon-delimited DAT records,
 * and computes per-suburb median house and unit prices with YoY growth.
 *
 * DAT record format (semicolon-delimited, skip lines not starting with "B"):
 *   [0]  "B"           – record identifier
 *   [9]  locality      – suburb name (ALL CAPS)
 *   [10] postcode
 *   [13] contract date (YYYYMMDD)
 *   [15] purchase price
 *   [17] property type  R = house/residence, U = unit/strata
 *
 * Strategy:
 *   - Download two full-year ZIPs (currentYear and prevYear) in parallel
 *   - Parse all DAT files in each ZIP; group sales by suburb+postcode
 *   - Compute median price for R (house) and U (unit) types per year
 *   - YoY growth = (current − prev) / prev × 100, rounded to 1 d.p.
 *   - Bulk UPDATE via UNNEST — one SQL round trip for all matched suburbs
 *
 * Source: https://valuergeneral.nsw.gov.au/__psi/yearly/{YEAR}.zip
 * License: NSW Government Open Data (CC BY 4.0)
 * Schedule: Quarterly (new year file fully settled by ~Feb each year)
 */
import "dotenv/config";
import AdmZip from "adm-zip";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";

const SOURCE_ID = "sales-nsw";
const BASE_URL   = "https://www.valuergeneral.nsw.gov.au/__psi/yearly";

// Column indices in the semicolon-delimited DAT records (0-based)
const COL_SUBURB     = 9;
const COL_POSTCODE   = 10;
const COL_DATE       = 13;   // contract date YYYYMMDD
const COL_SETTLE     = 14;   // settlement date YYYYMMDD
const COL_PRICE      = 15;
const COL_TYPE       = 17;   // R = house (non-strata only in NNME files)

const MIN_PRICE = 50_000;   // ignore suspiciously low sales

interface YearSales {
  prices: number[];   // house prices
  days:   number[];   // contract-to-settlement days (proxy for settlement period)
}

function median(prices: number[]): number | null {
  if (prices.length === 0) return null;
  const sorted = [...prices].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid];
}

function parseDate(s: string): Date | null {
  if (!s || s.length < 8) return null;
  const y = parseInt(s.slice(0, 4), 10);
  const m = parseInt(s.slice(4, 6), 10) - 1;
  const d = parseInt(s.slice(6, 8), 10);
  const dt = new Date(y, m, d);
  return isNaN(dt.getTime()) ? null : dt;
}

/** Parse DAT text lines and accumulate into the sales map */
function parseDat(text: string, year: number, sales: Map<string, YearSales>): number {
  let count = 0;
  for (const line of text.split(/\r?\n/)) {
    if (!line.startsWith("B;")) continue;

    const cols = line.split(";");
    if (cols.length < 18) continue;

    // NNME files = non-strata residential only; type "R" = house/residence
    const type = cols[COL_TYPE]?.trim().toUpperCase();
    if (type !== "R") continue;

    const price = parseInt(cols[COL_PRICE]?.replace(/,/g, "") ?? "", 10);
    if (!price || price < MIN_PRICE) continue;

    // Filter by contract date year
    const contractDate = parseDate(cols[COL_DATE]?.trim() ?? "");
    if (!contractDate || contractDate.getFullYear() !== year) continue;

    const suburb   = cols[COL_SUBURB]?.trim();
    const postcode = cols[COL_POSTCODE]?.trim();
    if (!suburb || !postcode) continue;

    // Compute contract→settlement days as proxy for settlement period
    const settleDate = parseDate(cols[COL_SETTLE]?.trim() ?? "");
    const daysDiff = settleDate
      ? Math.round((settleDate.getTime() - contractDate.getTime()) / 86_400_000)
      : null;

    const key = `${suburb}|${postcode}`;
    let entry = sales.get(key);
    if (!entry) { entry = { prices: [], days: [] }; sales.set(key, entry); }
    entry.prices.push(price);
    if (daysDiff !== null && daysDiff >= 1 && daysDiff <= 365) entry.days.push(daysDiff);
    count++;
  }
  return count;
}

/**
 * Download a yearly ZIP (which itself contains weekly ZIPs containing DAT files)
 * and return sales grouped by "SUBURB|POSTCODE".
 * Structure: {year}.zip → {YYYYMMDD}.zip → {district}_SALES_DATA_*.DAT
 */
async function downloadYear(year: number): Promise<Map<string, YearSales>> {
  const url = `${BASE_URL}/${year}.zip`;
  log(SOURCE_ID, `downloading ${year} ZIP from ${url}`);

  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; YourPropertyGuide/1.0)" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);

  const outerBuf = Buffer.from(await res.arrayBuffer());
  const outerZip = new AdmZip(outerBuf);
  const outerEntries = outerZip.getEntries();

  log(SOURCE_ID, `${year}: ${outerEntries.length} weekly ZIPs in outer archive`);

  const sales = new Map<string, YearSales>();
  let recordCount = 0;
  let weekCount   = 0;

  for (const outerEntry of outerEntries) {
    if (!outerEntry.entryName.toLowerCase().endsWith(".zip")) continue;

    const innerBuf = outerZip.readFile(outerEntry);
    if (!innerBuf) continue;

    const innerZip = new AdmZip(innerBuf);
    for (const innerEntry of innerZip.getEntries()) {
      if (!innerEntry.entryName.toUpperCase().endsWith(".DAT")) continue;
      const text = innerZip.readAsText(innerEntry, "utf8");
      recordCount += parseDat(text, year, sales);
    }
    weekCount++;
    if (weekCount % 10 === 0) log(SOURCE_ID, `  ${year}: processed ${weekCount}/${outerEntries.length} weeks, ${recordCount} sales so far`);
  }

  log(SOURCE_ID, `${year}: ${recordCount} valid sales across ${sales.size} suburb/postcode combos`);
  return sales;
}

function titleCase(s: string): string {
  return s.toLowerCase().replace(/(?:^|\s|-|')\S/g, (c) => c.toUpperCase());
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    // Use last full calendar year as "current" and the one before for YoY
    const now = new Date();
    const currentYear = now.getFullYear() - 1;   // e.g. 2025 when running in 2026
    const prevYear    = currentYear - 1;          // e.g. 2024

    log(SOURCE_ID, `comparing ${prevYear} → ${currentYear}`);

    // Download both years in parallel
    const [currentSales, prevSales] = await Promise.all([
      downloadYear(currentYear),
      downloadYear(prevYear),
    ]);

    // ── Build aggregated suburb stats ────────────────────────────────────────
    interface SuburbStats {
      medianHousePrice:  number | null;
      medianUnitPrice:   number | null;
      annualGrowthHouse: number | null;
      annualGrowthUnit:  number | null;
      salesCountHouse:   number;
      daysOnMarket:      number | null;
      suburbName:        string;
      postcode:          string;
    }
    const statsMap = new Map<string, SuburbStats>(); // key = "suburb|postcode"

    for (const [key, curr] of currentSales) {
      const prev        = prevSales.get(key);
      const medianHouse = median(curr.prices);
      const prevHouse   = prev ? median(prev.prices) : null;

      const yoyHouse = (medianHouse && prevHouse)
        ? Math.round(((medianHouse - prevHouse) / prevHouse) * 1000) / 10
        : null;

      const [rawSuburb, postcode] = key.split("|");
      statsMap.set(key, {
        medianHousePrice:  medianHouse,
        medianUnitPrice:   null,   // NNME files = non-strata only; no unit data
        annualGrowthHouse: yoyHouse,
        annualGrowthUnit:  null,
        salesCountHouse:   curr.prices.length,
        daysOnMarket:      median(curr.days),
        suburbName:        titleCase(rawSuburb),
        postcode,
      });
    }

    log(SOURCE_ID, `computed stats for ${statsMap.size} NSW suburb/postcode combos`);

    // ── Match to DB suburbs ──────────────────────────────────────────────────
    const suburbs = await prisma.suburb.findMany({
      where: { state: "NSW" },
      select: { id: true, name: true, postcode: true },
    });
    log(SOURCE_ID, `matching against ${suburbs.length} NSW DB suburbs`);

    interface UpdateRow {
      id:                string;
      medianHousePrice:  number;
      annualGrowthHouse: number | null;
      salesCountHouse:   number;
      daysOnMarket:      number | null;
    }
    const updates: UpdateRow[] = [];

    for (const suburb of suburbs) {
      const key = `${suburb.name.toUpperCase()}|${suburb.postcode}`;
      const stats = statsMap.get(key);
      if (!stats?.medianHousePrice) continue;

      updates.push({
        id:                suburb.id,
        medianHousePrice:  stats.medianHousePrice,
        annualGrowthHouse: stats.annualGrowthHouse,
        salesCountHouse:   stats.salesCountHouse,
        daysOnMarket:      stats.daysOnMarket,
      });
    }

    log(SOURCE_ID, `updating ${updates.length} NSW suburbs`);

    if (updates.length > 0) {
      await prisma.$executeRaw`
        UPDATE "Suburb" AS s
        SET
          "medianHousePrice"  = u.median_house,
          "annualGrowthHouse" = CASE WHEN u.yoy_house    IS NOT NULL THEN u.yoy_house    ELSE s."annualGrowthHouse" END,
          "salesCountHouse"   = u.sales_count,
          "daysOnMarket"      = CASE WHEN u.days_on_mkt  IS NOT NULL THEN u.days_on_mkt  ELSE s."daysOnMarket"      END,
          "statsSource"       = 'sales-nsw',
          "statsUpdatedAt"    = NOW(),
          "salesUpdatedAt"    = NOW()
        FROM UNNEST(
          ${updates.map((u) => u.id)}::text[],
          ${updates.map((u) => u.medianHousePrice)}::int[],
          ${updates.map((u) => u.annualGrowthHouse)}::float8[],
          ${updates.map((u) => u.salesCountHouse)}::int[],
          ${updates.map((u) => u.daysOnMarket)}::int[]
        ) AS u(id, median_house, yoy_house, sales_count, days_on_mkt)
        WHERE s.id = u.id
      `;
    }

    await finishSync(SOURCE_ID, updates.length, new Date(`${currentYear}-12-31`));
    log(SOURCE_ID, `done — ${updates.length} suburbs updated from ${currentYear} sales data`);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
