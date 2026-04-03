/**
 * SA Rental Data Sync
 *
 * Downloads median rental data from SA Housing Authority via data.sa.gov.au.
 * The XLSX has a multi-level header format with metadata rows at the top.
 *
 * Sheet "Suburb" layout (0-indexed):
 *   Rows 0–14: metadata + multi-level headers (skip)
 *   Row 15+:   data rows — col 0 = suburb, col 10 = flats/units median,
 *              col 20 = houses median, col 25 = total count, col 26 = total median
 *
 * Data source: https://data.sa.gov.au/data/dataset/private-rent-report
 * Schedule: Quarterly
 */
import "dotenv/config";
import * as XLSX from "xlsx";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import { resolveSlug } from "../slug-matcher";
import { getCkanDownloadUrl } from "../ckan";

const SOURCE_ID = "rental-sa";
const CKAN_BASE = "https://data.sa.gov.au/data";
const PACKAGE_ID = "private-rent-report";

// First data row in the "Suburb" sheet (0-indexed), after metadata + headers
const DATA_START_ROW = 15;
// Column indices in the data rows
const COL_SUBURB      = 0;
const COL_FLAT_MEDIAN = 10;   // Flats/Units overall median (weekly rent)
const COL_HOUSE_MEDIAN = 20;  // Houses overall median (weekly rent)
const COL_TOTAL_COUNT  = 25;
// COL_TOTAL_MEDIAN = 26; (unused for now, we store house/flat separately)

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    const xlsxUrl = await getCkanDownloadUrl(PACKAGE_ID, CKAN_BASE, "XLSX");
    log(SOURCE_ID, `downloading from ${xlsxUrl}`);

    const res = await fetch(xlsxUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status} downloading SA rental XLSX`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const wb = XLSX.read(buffer, { type: "buffer" });

    const ws = wb.Sheets["Suburb"] ?? wb.Sheets[wb.SheetNames[0]];
    // Read as raw array-of-arrays to handle multi-level headers
    const raw = XLSX.utils.sheet_to_json<(string | number)[]>(ws, { header: 1, defval: "" });
    log(SOURCE_ID, `sheet has ${raw.length} rows`);

    // Derive period from URL filename: private-rental-report-YYYY-MM.xlsx
    const urlPeriodMatch = xlsxUrl.match(/(\d{4})-(\d{2})\.xlsx/i);
    const year  = urlPeriodMatch?.[1] ?? String(new Date().getFullYear());
    const month = parseInt(urlPeriodMatch?.[2] ?? "12");
    const quarter = month <= 3 ? "Q1" : month <= 6 ? "Q2" : month <= 9 ? "Q3" : "Q4";
    const period    = `${year}-${quarter}`;
    const periodDate = new Date(`${year}-${String(month).padStart(2, "0")}-01`);
    log(SOURCE_ID, `period: ${period}`);

    let count = 0;

    for (let i = DATA_START_ROW; i < raw.length; i++) {
      const row = raw[i];
      const suburb = String(row[COL_SUBURB] ?? "").trim();
      if (!suburb || suburb.startsWith("Source:") || suburb.startsWith("Note")) continue;

      const flatMedian  = typeof row[COL_FLAT_MEDIAN]  === "number" ? row[COL_FLAT_MEDIAN]  : null;
      const houseMedian = typeof row[COL_HOUSE_MEDIAN] === "number" ? row[COL_HOUSE_MEDIAN] : null;
      const totalCount  = typeof row[COL_TOTAL_COUNT]  === "number" ? Math.round(Number(row[COL_TOTAL_COUNT])) : null;

      if (flatMedian === null && houseMedian === null) continue;

      const suburbSlug = await resolveSlug(suburb, "SA", "");

      await prisma.suburbRentalStat.upsert({
        where: { suburbName_postcode_state_period: { suburbName: suburb, postcode: "", state: "SA", period } },
        create: {
          suburbSlug,
          suburbName:      suburb,
          postcode:        "",
          state:           "SA",
          period,
          periodDate,
          medianRentHouse: houseMedian,
          medianRentUnit:  flatMedian,
          bondLodgements:  totalCount,
          source: SOURCE_ID,
        },
        update: {
          suburbSlug,
          medianRentHouse: houseMedian,
          medianRentUnit:  flatMedian,
          bondLodgements:  totalCount,
        },
      });
      count++;
    }

    await prisma.suburb.updateMany({
      where: { state: "SA" },
      data: { statsUpdatedAt: new Date(), statsSource: SOURCE_ID },
    });

    await finishSync(SOURCE_ID, count, periodDate);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
