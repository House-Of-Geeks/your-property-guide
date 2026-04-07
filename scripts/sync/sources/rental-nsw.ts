/**
 * NSW Rental Data Sync (DCJ)
 *
 * Downloads postcode-level median weekly rent from the NSW Department of
 * Communities & Justice (DCJ). The XLSX has a "Postcode" sheet (data from
 * row 10, headers at row 9).
 *
 * Postcode sheet columns (0-indexed):
 *   0: Postcode
 *   1: Dwelling Types  ("Total" | "Flats/Units" | "Houses" | "Townhouses")
 *   2: Number of Bedrooms ("Total" | "1 Bedroom" | …)
 *   3: First Quartile Weekly Rent for New Bonds ($)
 *   4: Median Weekly Rent for New Bonds ($)  ← we use this
 *   5: Third Quartile…
 *   …
 *
 * Period is in row 2 as: "October to December 2025"
 *
 * Data is postcode-level (no suburb names). Stored with suburbName = postcode
 * so import-suburbs can later link records to suburb pages once NSW suburb
 * stubs (with postcodes) exist in the Suburb table.
 *
 * Data source: https://www.dcj.nsw.gov.au/about-us/families-and-communities-statistics/housing-rent-and-sales/rent-and-sales-report.html
 * Schedule: Quarterly
 */
import "dotenv/config";
import * as XLSX from "xlsx";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import { resolveSlug } from "../slug-matcher";

const SOURCE_ID = "rental-nsw";

// Quarter URL map: try the most recent known quarters in order
const DCJ_BASE = "https://www.dcj.nsw.gov.au/content/dam/dcj/dcj-website/documents/about-us/families-and-communities-statistics/housing-and-rent-sales";
const QUARTER_MONTHS = ["december", "september", "june", "march"];
const MONTH_QUARTER: Record<string, string> = {
  march: "Q1", june: "Q2", september: "Q3", december: "Q4",
  // Also handle the "ending month" phrasing "October to December 2025"
  january: "Q1", february: "Q1",     // Jan/Feb can end Q1 reports
  april: "Q2", may: "Q2",            // Apr/May can end Q2 reports
  july: "Q3", august: "Q3", october: "Q3", november: "Q3",
};
const MONTH_NUM: Record<string, number> = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
};

function parseReportingPeriod(label: string): { period: string; periodDate: Date; year: number } | null {
  // e.g. "October to December 2025" → 2025-Q4
  const m = label.match(/(\w+)\s+(\d{4})$/);
  if (!m) return null;
  const monthStr = m[1].toLowerCase();
  const year = parseInt(m[2]);
  const q = MONTH_QUARTER[monthStr];
  const mon = MONTH_NUM[monthStr];
  if (!q || !mon) return null;
  return {
    period:     `${year}-${q}`,
    periodDate: new Date(`${year}-${String(mon).padStart(2, "0")}-01`),
    year,
  };
}

async function tryDownload(year: number, monthName: string): Promise<Buffer | null> {
  const url = `${DCJ_BASE}/rent_tables_${monthName}_${year}_quarter.xlsx`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") ?? "";
    if (ct.includes("text/html")) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    // Try the last 4 quarters starting from the current year, working backwards
    const now = new Date();
    let buffer: Buffer | null = null;

    outer: for (let yearOffset = 0; yearOffset <= 1; yearOffset++) {
      const year = now.getFullYear() - yearOffset;
      for (const month of QUARTER_MONTHS) {
        log(SOURCE_ID, `trying ${month} ${year}...`);
        buffer = await tryDownload(year, month);
        if (buffer) {
          log(SOURCE_ID, `downloaded ${month} ${year} quarter`);
          break outer;
        }
      }
    }

    if (!buffer) throw new Error("Could not download any recent NSW DCJ rental XLSX");

    const wb = XLSX.read(buffer, { type: "buffer" });
    log(SOURCE_ID, `sheets: ${wb.SheetNames.join(", ")}`);

    const sheetName = wb.SheetNames.find((n) => n.toLowerCase().includes("postcode")) ?? wb.SheetNames[1];
    log(SOURCE_ID, `using sheet: ${sheetName}`);

    const ws = wb.Sheets[sheetName];
    const raw = XLSX.utils.sheet_to_json<(string | number)[]>(ws, { header: 1, defval: "" });

    // Row 1 (index 1) col 0: "Reporting period: October to December 2025"
    const periodLabel = String(raw[1]?.[0] ?? "").replace(/^Reporting period:\s*/i, "").trim();
    const parsed = parseReportingPeriod(periodLabel);
    if (!parsed) throw new Error(`Could not parse reporting period from: "${periodLabel}"`);
    log(SOURCE_ID, `period: ${parsed.period}`);

    // Headers at row 8 (index 8), data from row 9 (index 9)
    const HEADER_ROW = 8;
    const DATA_START  = 9;
    const headers = (raw[HEADER_ROW] as string[]).map((h) => String(h).trim());

    // Find column indices
    const colPostcode     = headers.findIndex((h) => /postcode/i.test(h));
    const colDwellingType = headers.findIndex((h) => /dwelling\s*type/i.test(h));
    const colBedrooms     = headers.findIndex((h) => /bedroom/i.test(h));
    const colMedian       = headers.findIndex((h) => /median.+rent/i.test(h));

    if (colPostcode < 0 || colMedian < 0) {
      throw new Error(`Could not find required columns. Headers: ${headers.join(", ")}`);
    }
    log(SOURCE_ID, `columns: postcode=${colPostcode} dwellingType=${colDwellingType} bedrooms=${colBedrooms} median=${colMedian}`);

    let count = 0;

    for (let i = DATA_START; i < raw.length; i++) {
      const row = raw[i] as (string | number)[];
      const postcode = String(row[colPostcode] ?? "").trim();
      if (!postcode || !/^\d{4}$/.test(postcode)) continue;

      // Only process "Total" dwelling type + "Total" bedrooms for the overall median
      if (colDwellingType >= 0) {
        const dwType = String(row[colDwellingType] ?? "").trim().toLowerCase();
        if (dwType !== "total") continue;
      }
      if (colBedrooms >= 0) {
        const beds = String(row[colBedrooms] ?? "").trim().toLowerCase();
        if (beds !== "total") continue;
      }

      const medianRaw = row[colMedian];
      const median = typeof medianRaw === "number"
        ? medianRaw
        : parseInt(String(medianRaw).replace(/[^0-9]/g, "")) || null;
      if (!median) continue;

      // Stored with suburbName = postcode (postcode-level data)
      // import-suburbs will link these to suburb pages when NSW stubs exist
      const suburbName = postcode;
      const suburbSlug = await resolveSlug(suburbName, "NSW", postcode);

      await prisma.suburbRentalStat.upsert({
        where: {
          suburbName_postcode_state_period: {
            suburbName,
            postcode,
            state:  "NSW",
            period: parsed.period,
          },
        },
        create: {
          suburbSlug,
          suburbName,
          postcode,
          state:           "NSW",
          period:          parsed.period,
          periodDate:      parsed.periodDate,
          medianRentHouse: median,
          source: SOURCE_ID,
        },
        update: {
          suburbSlug,
          medianRentHouse: median,
        },
      });
      count++;
    }

    await prisma.suburb.updateMany({
      where: { state: "NSW" },
      data:  { statsUpdatedAt: new Date(), statsSource: SOURCE_ID, rentalUpdatedAt: new Date() },
    });

    await finishSync(SOURCE_ID, count, parsed.periodDate);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
