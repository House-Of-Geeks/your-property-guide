/**
 * VIC Rental Data Sync
 *
 * Downloads median rental data from the Victorian DFFH via the data.vic.gov.au
 * CKAN API. The CKAN package provides DFFH webpage URLs (not direct file downloads),
 * so we fetch the page HTML and extract the actual XLSX download link.
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
const DFFH_BASE = "https://www.dffh.vic.gov.au";

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

/**
 * Try to resolve a DFFH page URL to an actual XLSX download URL.
 * Strategy 1: fetch the HTML page and regex-extract the .xlsx href.
 * Strategy 2: if the resource URL already looks like a file, use it directly.
 */
async function resolveXlsxUrl(dffhPageUrl: string): Promise<string> {
  // If URL already ends in .xlsx, use it directly
  if (dffhPageUrl.endsWith(".xlsx") || dffhPageUrl.endsWith(".xls")) {
    return dffhPageUrl;
  }

  // Fetch the DFFH page and extract the XLSX link
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  try {
    const pageRes = await fetch(dffhPageUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; YourPropertyGuide/1.0; data-sync)",
        "Accept": "text/html,application/xhtml+xml",
      },
    });
    clearTimeout(timer);
    if (!pageRes.ok) throw new Error(`HTTP ${pageRes.status} fetching DFFH page`);
    const html = await pageRes.text();

    const xlsxMatch = html.match(/href="([^"]*\.xlsx)"/i)
      ?? html.match(/href='([^']*\.xlsx)'/i);
    if (!xlsxMatch) throw new Error(`No XLSX link found on DFFH page: ${dffhPageUrl}`);
    const href = xlsxMatch[1];
    return href.startsWith("http") ? href : `${DFFH_BASE}${href}`;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    // Get DFFH page URL from CKAN (most recent XLSX resource)
    const dffhPageUrl = await getCkanDownloadUrl(PACKAGE_ID, CKAN_BASE, "XLSX");
    log(SOURCE_ID, `DFFH resource URL: ${dffhPageUrl}`);

    const xlsxUrl = await resolveXlsxUrl(dffhPageUrl);
    log(SOURCE_ID, `downloading XLSX from ${xlsxUrl}`);

    const fileRes = await fetch(xlsxUrl);
    if (!fileRes.ok) throw new Error(`HTTP ${fileRes.status} downloading VIC rental XLSX`);
    const buffer = Buffer.from(await fileRes.arrayBuffer());
    const wb = XLSX.read(buffer, { type: "buffer" });

    // Find the suburb-level sheet (not LGA)
    const sheetName =
      wb.SheetNames.find((n) => n.toLowerCase().includes("suburb")) ??
      wb.SheetNames[0];
    log(SOURCE_ID, `using sheet: ${sheetName}`);

    const ws = wb.Sheets[sheetName];
    const rawRows = XLSX.utils.sheet_to_json<Record<string, string>>(ws, { defval: "" });
    log(SOURCE_ID, `parsed ${rawRows.length} rows`);

    // Normalize column keys
    const rows = rawRows.map((r) =>
      Object.fromEntries(Object.entries(r).map(([k, v]) => [norm(k), String(v)]))
    );

    let count = 0;
    let latestDate: Date | undefined;

    for (const row of rows) {
      const suburb   = row["suburb"] ?? row["suburb_name"] ?? "";
      const postcode = row["postcode"] ?? row["post_code"] ?? "";
      const quarter  = row["moving_annual_quarter"] ?? row["quarter"] ?? row["period"] ?? "";
      if (!suburb || !postcode || !quarter) continue;

      const suburbSlug = await resolveSlug(suburb, "VIC", postcode);
      const { period, periodDate } = parsePeriod(quarter);
      if (!latestDate || periodDate > latestDate) latestDate = periodDate;

      const rentAll = parseInt(row["median_rent_all_dwellings"] ?? row["median_rent_all"] ?? row["median_weekly_rent"] ?? "") || null;
      const rent3br = parseInt(row["median_rent_3br_house"] ?? row["median_rent_3_bedroom_house"] ?? "") || null;
      const rent2br = parseInt(row["median_rent_2br_house"] ?? row["median_rent_2_bedroom_house"] ?? "") || null;
      const rent1br = parseInt(row["median_rent_1br_flat"] ?? row["median_rent_1_bedroom_flat"] ?? row["median_rent_1_bedroom_unit"] ?? "") || null;
      const bonds   = parseInt(row["count"] ?? row["number_of_bonds"] ?? row["bond_lodgements"] ?? "") || null;

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
