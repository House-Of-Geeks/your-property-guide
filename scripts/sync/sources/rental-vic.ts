/**
 * VIC Rental Data Sync
 *
 * Downloads median rental data from the Victorian Department of Families,
 * Fairness and Housing (DFFH) via the data.vic.gov.au CKAN API.
 *
 * Data source: https://discover.data.vic.gov.au/dataset/rental-report
 * Schedule: Quarterly (data released ~6 weeks after each quarter end)
 *
 * To find the resource ID:
 *   curl "https://discover.data.vic.gov.au/api/3/action/package_show?id=rental-report-quarterly-moving-annual-rents-by-suburb" | jq '.result.resources[] | {id, name, format}'
 */
import "dotenv/config";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import { resolveSlug } from "../slug-matcher";
import { fetchCkan, getCkanResourceId } from "../ckan";

const SOURCE_ID = "rental-vic";
const CKAN_BASE = "https://discover.data.vic.gov.au";
const PACKAGE_ID = "rental-report-quarterly-moving-annual-rents-by-suburb";

interface VicRentalRow {
  suburb:                  string;
  postcode:                string;
  moving_annual_quarter:   string; // e.g. "September 2024"
  median_rent_all:         string;
  median_rent_3br_house:   string;
  median_rent_2br_house:   string;
  median_rent_1br_flat:    string;
  count:                   string;
}

const MONTH_TO_QUARTER: Record<string, string> = {
  March: "Q1", June: "Q2", September: "Q3", December: "Q4",
};
const MONTH_NUM: Record<string, number> = {
  March: 3, June: 6, September: 9, December: 12,
};

function parsePeriod(q: string): { period: string; periodDate: Date } {
  const [month, year] = q.trim().split(" ");
  const quarter = MONTH_TO_QUARTER[month] ?? "Q4";
  const m = MONTH_NUM[month] ?? 12;
  return {
    period: `${year}-${quarter}`,
    periodDate: new Date(`${year}-${String(m).padStart(2, "0")}-01`),
  };
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    const resourceId = await getCkanResourceId(PACKAGE_ID, CKAN_BASE, "CSV");
    log(SOURCE_ID, `resource ID: ${resourceId}`);

    const rows = await fetchCkan<VicRentalRow>(resourceId, CKAN_BASE);
    log(SOURCE_ID, `fetched ${rows.length} rows`);

    let count = 0;
    let latestDate: Date | undefined;

    for (const row of rows) {
      if (!row.suburb || !row.postcode) continue;
      const suburbSlug = await resolveSlug(row.suburb, "VIC", row.postcode);
      const { period, periodDate } = parsePeriod(row.moving_annual_quarter);
      if (!latestDate || periodDate > latestDate) latestDate = periodDate;

      await prisma.suburbRentalStat.upsert({
        where: { suburbName_postcode_state_period: { suburbName: row.suburb, postcode: row.postcode, state: "VIC", period } },
        create: {
          suburbSlug,
          suburbName:     row.suburb,
          postcode:       row.postcode,
          state:          "VIC",
          period,
          periodDate,
          medianRentHouse: parseInt(row.median_rent_all) || null,
          medianRent3Bed:  parseInt(row.median_rent_3br_house) || null,
          medianRent2Bed:  parseInt(row.median_rent_2br_house) || null,
          medianRent1Bed:  parseInt(row.median_rent_1br_flat) || null,
          bondLodgements:  parseInt(row.count) || null,
          source: SOURCE_ID,
        },
        update: {
          suburbSlug,
          medianRentHouse: parseInt(row.median_rent_all) || null,
          medianRent3Bed:  parseInt(row.median_rent_3br_house) || null,
          medianRent2Bed:  parseInt(row.median_rent_2br_house) || null,
          medianRent1Bed:  parseInt(row.median_rent_1br_flat) || null,
          bondLodgements:  parseInt(row.count) || null,
        },
      });
      count++;
    }

    // Update matched VIC suburbs' statsUpdatedAt
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
