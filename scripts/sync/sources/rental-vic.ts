/**
 * VIC Rental Data Sync
 *
 * Downloads median rental data from DFFH via the data.vic.gov.au CKAN API.
 * The CKAN resource URL 307-redirects to the actual XLSX file.
 *
 * XLSX structure (sheet "All properties"):
 *   Row 0: Title + "Lease commenced in year ending"
 *   Row 1: "All properties" | "" | "Mar 2000" | "Mar 2000" | "Jun 2000" | ... (pairs)
 *   Row 2: "" | "" | "Count" | "Median" | "Count" | "Median" | ...
 *   Row 3+: Region | Suburb name | [Count, Median × quarter] ...
 *   Last row: "Group Total" (skip)
 *
 * No postcode column — suburb is matched by name only.
 * Other sheets: "1 bedroom flat", "2 bedroom flat", etc. (same layout per bed type)
 *
 * Data source: https://discover.data.vic.gov.au/dataset/rental-report
 * Schedule: Quarterly
 */
import "dotenv/config";
import * as XLSX from "xlsx";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import { resolveSlug } from "../slug-matcher";
import { getCkanDownloadUrl } from "../ckan";

const SOURCE_ID = "rental-vic";
const CKAN_BASE = "https://discover.data.vic.gov.au";
const PACKAGE_ID = "rental-report-quarterly-moving-annual-rents-by-suburb";

const QUARTER_MAP: Record<string, string> = {
  Mar: "Q1", Jun: "Q2", Sep: "Q3", Dec: "Q4",
};
const MONTH_NUM: Record<string, number> = {
  Mar: 3, Jun: 6, Sep: 9, Dec: 12,
};

function parseQuarterLabel(label: string): { period: string; periodDate: Date } | null {
  // e.g. "Sep 2025" → { period: "2025-Q3", periodDate: 2025-09-01 }
  const m = String(label).trim().match(/^(Mar|Jun|Sep|Dec)\s+(\d{4})$/);
  if (!m) return null;
  const [, mon, year] = m;
  return {
    period:     `${year}-${QUARTER_MAP[mon]}`,
    periodDate: new Date(`${year}-${String(MONTH_NUM[mon]).padStart(2, "0")}-01`),
  };
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    // CKAN resource URL 307-redirects to actual XLSX file
    const dffhUrl = await getCkanDownloadUrl(PACKAGE_ID, CKAN_BASE, "XLSX");
    log(SOURCE_ID, `downloading from ${dffhUrl}`);

    const res = await fetch(dffhUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status} downloading VIC rental XLSX`);

    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("text/html")) {
      throw new Error(`Got HTML response instead of XLSX — redirect may have failed`);
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    const wb = XLSX.read(buffer, { type: "buffer" });
    log(SOURCE_ID, `sheets: ${wb.SheetNames.join(", ")}`);

    // "All properties" sheet has the overall median across all bedroom types
    const sheetName = wb.SheetNames.find((n) => n.toLowerCase().includes("all")) ?? wb.SheetNames[0];
    log(SOURCE_ID, `using sheet: ${sheetName}`);

    const ws = wb.Sheets[sheetName];
    // Read as raw arrays to handle the multi-level header
    const raw = XLSX.utils.sheet_to_json<(string | number)[]>(ws, { header: 1, defval: "" });
    log(SOURCE_ID, `${raw.length} rows`);

    if (raw.length < 3) throw new Error("Unexpected XLSX structure");

    // Row 1: quarter labels — pairs of identical labels (Count, Median per quarter)
    // Data starts at column 2: [Count, Median, Count, Median, ...]
    const quarterRow = raw[1] as string[];

    // Find the most recent quarter by scanning row 1 backwards
    let latestPeriod: { period: string; periodDate: Date } | null = null;
    let medianColIdx = -1; // column index of the most recent quarter's Median

    for (let i = quarterRow.length - 1; i >= 2; i--) {
      const parsed = parseQuarterLabel(quarterRow[i]);
      if (parsed) {
        // The "Median" column is the ODD one in each pair (Count at even, Median at odd)
        // Find this quarter's pair: if row 2 shows "Median" at col i, use i; otherwise use i+1
        const countMedianRow = raw[2] as string[];
        const label = String(countMedianRow[i]).trim();
        if (label.toLowerCase() === "median") {
          latestPeriod = parsed;
          medianColIdx = i;
          break;
        }
        // Check adjacent column
        if (i + 1 < countMedianRow.length && String(countMedianRow[i + 1]).trim().toLowerCase() === "median") {
          latestPeriod = parsed;
          medianColIdx = i + 1;
          break;
        }
      }
    }

    if (!latestPeriod || medianColIdx < 0) throw new Error("Could not find most recent quarter in VIC rental XLSX");
    log(SOURCE_ID, `most recent quarter: ${latestPeriod.period} (column ${medianColIdx})`);

    let count = 0;

    for (let i = 3; i < raw.length; i++) {
      const row = raw[i];
      const suburb = String(row[1] ?? "").trim();
      if (!suburb || suburb.toLowerCase().startsWith("group total") || suburb === "") continue;

      const medianRaw = row[medianColIdx];
      const median = typeof medianRaw === "number" ? medianRaw : parseInt(String(medianRaw)) || null;
      if (!median) continue;

      const suburbSlug = await resolveSlug(suburb, "VIC", "");

      await prisma.suburbRentalStat.upsert({
        where: { suburbName_postcode_state_period: { suburbName: suburb, postcode: "", state: "VIC", period: latestPeriod.period } },
        create: {
          suburbSlug,
          suburbName:      suburb,
          postcode:        "",
          state:           "VIC",
          period:          latestPeriod.period,
          periodDate:      latestPeriod.periodDate,
          medianRentHouse: median, // "All properties" median
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
      where: { state: "VIC" },
      data: { statsUpdatedAt: new Date(), statsSource: SOURCE_ID },
    });

    await finishSync(SOURCE_ID, count, latestPeriod.periodDate);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
