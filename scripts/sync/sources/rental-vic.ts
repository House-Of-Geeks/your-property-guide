/**
 * VIC Rental Data Sync
 *
 * Downloads median rental data from the Victorian DFFH via the data.vic.gov.au
 * CKAN API. The CKAN resource URL is a DFFH page that 307-redirects to the
 * actual XLSX file — fetch() follows the redirect automatically.
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

// Normalize XLSX header keys to lowercase_underscore
function norm(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

const MONTH_TO_QUARTER: Record<string, string> = {
  march: "Q1", june: "Q2", september: "Q3", december: "Q4",
};
const MONTH_NUM: Record<string, number> = {
  march: 3, june: 6, september: 9, december: 12,
};

function parsePeriod(q: string): { period: string; periodDate: Date } {
  const parts = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const month = parts.find((p) => MONTH_NUM[p]);
  const year  = parts.find((p) => /^\d{4}$/.test(p));
  if (!month || !year) return { period: q, periodDate: new Date() };
  return {
    period: `${year}-${MONTH_TO_QUARTER[month] ?? "Q4"}`,
    periodDate: new Date(`${year}-${String(MONTH_NUM[month]).padStart(2, "0")}-01`),
  };
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    // CKAN returns a DFFH page URL that 307-redirects to the actual XLSX file
    const dffhUrl = await getCkanDownloadUrl(PACKAGE_ID, CKAN_BASE, "XLSX");
    log(SOURCE_ID, `downloading from ${dffhUrl} (follows 307 redirect to XLSX)`);

    // fetch() follows the redirect automatically
    const res = await fetch(dffhUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status} downloading VIC rental XLSX`);

    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("text/html")) {
      throw new Error(`Got HTML instead of XLSX from ${dffhUrl} — redirect may have failed`);
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    const wb = XLSX.read(buffer, { type: "buffer" });

    // Find suburb-level sheet (prefer one with "suburb" in the name)
    const sheetName =
      wb.SheetNames.find((n) => n.toLowerCase().includes("suburb")) ??
      wb.SheetNames[0];
    log(SOURCE_ID, `sheets: ${wb.SheetNames.join(", ")} → using: ${sheetName}`);

    const ws = wb.Sheets[sheetName];
    const rawRows = XLSX.utils.sheet_to_json<Record<string, string>>(ws, { defval: "" });
    log(SOURCE_ID, `parsed ${rawRows.length} rows`);

    // Normalize column keys to lowercase_underscore
    const rows = rawRows.map((r) =>
      Object.fromEntries(Object.entries(r).map(([k, v]) => [norm(k), String(v)]))
    );

    let count = 0;
    let latestDate: Date | undefined;

    for (const row of rows) {
      const suburb   = row["suburb"] ?? row["suburb_name"] ?? row["suburb_town"] ?? "";
      const postcode = row["postcode"] ?? row["post_code"] ?? "";
      const quarter  = row["moving_annual_quarter"] ?? row["quarter"] ?? row["period"] ?? row["moving_annual_quarter_ended"] ?? "";
      if (!suburb || !postcode || !quarter) continue;

      const suburbSlug = await resolveSlug(suburb, "VIC", postcode);
      const { period, periodDate } = parsePeriod(quarter);
      if (!latestDate || periodDate > latestDate) latestDate = periodDate;

      const rentAll = parseInt(row["median_rent_all_dwellings"] ?? row["median_rent_all"] ?? row["median_weekly_rent"] ?? row["median_rent"] ?? "") || null;
      const rent3br = parseInt(row["median_rent_3br_house"] ?? row["median_rent_3_bedroom_house"] ?? row["3_bedroom_house"] ?? "") || null;
      const rent2br = parseInt(row["median_rent_2br_house"] ?? row["median_rent_2_bedroom_house"] ?? row["2_bedroom_house"] ?? "") || null;
      const rent1br = parseInt(row["median_rent_1br_flat"] ?? row["median_rent_1_bedroom_flat"] ?? row["median_rent_1_bedroom_unit"] ?? row["1_bedroom_flat"] ?? "") || null;
      const bonds   = parseInt(row["count"] ?? row["number_of_bonds"] ?? row["bond_lodgements"] ?? row["observations"] ?? "") || null;

      await prisma.suburbRentalStat.upsert({
        where: { suburbName_postcode_state_period: { suburbName: suburb, postcode, state: "VIC", period } },
        create: {
          suburbSlug,
          suburbName:      suburb,
          postcode,
          state:           "VIC",
          period,
          periodDate,
          medianRentHouse: rentAll,
          medianRent3Bed:  rent3br,
          medianRent2Bed:  rent2br,
          medianRent1Bed:  rent1br,
          bondLodgements:  bonds,
          source: SOURCE_ID,
        },
        update: {
          suburbSlug,
          medianRentHouse: rentAll,
          medianRent3Bed:  rent3br,
          medianRent2Bed:  rent2br,
          medianRent1Bed:  rent1br,
          bondLodgements:  bonds,
        },
      });
      count++;
    }

    await prisma.suburb.updateMany({
      where: { state: "VIC" },
      data: { statsUpdatedAt: new Date(), statsSource: SOURCE_ID },
    });

    await finishSync(SOURCE_ID, count, latestDate);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
