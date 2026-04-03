/**
 * SA Rental Data Sync
 *
 * Downloads median rental data from SA Consumer and Business Services
 * via the data.sa.gov.au CKAN API.
 *
 * Data source: https://data.sa.gov.au/data/dataset/private-rent-report
 * Schedule: Quarterly
 *
 * To find the resource ID:
 *   curl "https://data.sa.gov.au/data/api/3/action/package_show?id=private-rent-report" | jq '.result.resources[] | {id, name, format}'
 */
import "dotenv/config";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import { resolveSlug } from "../slug-matcher";
import { fetchCkan, getCkanResourceId } from "../ckan";

const SOURCE_ID = "rental-sa";
const CKAN_BASE = "https://data.sa.gov.au";
const PACKAGE_ID = "private-rent-report";

interface SaRentalRow {
  suburb:               string;
  postcode:             string;
  quarter:              string;
  dwelling_type:        string;
  median_weekly_rent:   string;
  number_of_bonds:      string;
}

function parsePeriod(q: string): { period: string; periodDate: Date } {
  // SA format is typically "YYYY-QN" or "Quarter N YYYY"
  if (/^\d{4}-Q\d$/.test(q)) {
    const [year, quarter] = q.split("-");
    const monthMap: Record<string, number> = { Q1: 3, Q2: 6, Q3: 9, Q4: 12 };
    return {
      period: q,
      periodDate: new Date(`${year}-${String(monthMap[quarter] ?? 12).padStart(2, "0")}-01`),
    };
  }
  return { period: q, periodDate: new Date() };
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    const resourceId = await getCkanResourceId(PACKAGE_ID, CKAN_BASE, "CSV");
    log(SOURCE_ID, `resource ID: ${resourceId}`);

    const rows = await fetchCkan<SaRentalRow>(resourceId, CKAN_BASE);
    log(SOURCE_ID, `fetched ${rows.length} rows`);

    const grouped = new Map<string, { house?: number; unit?: number; bonds: number; periodDate: Date }>();

    for (const row of rows) {
      if (!row.suburb || !row.postcode) continue;
      const { period, periodDate } = parsePeriod(row.quarter);
      const key = `${row.suburb}|${row.postcode}|${period}`;
      const existing = grouped.get(key) ?? { bonds: 0, periodDate };
      const rent = parseInt(row.median_weekly_rent) || undefined;
      const bonds = parseInt(row.number_of_bonds) || 0;

      if (row.dwelling_type?.toLowerCase().includes("house")) {
        existing.house = rent;
      } else {
        existing.unit = rent;
      }
      existing.bonds += bonds;
      grouped.set(key, existing);
    }

    let count = 0;
    let latestDate: Date | undefined;

    for (const [key, data] of grouped) {
      const [suburbName, postcode, period] = key.split("|");
      const suburbSlug = await resolveSlug(suburbName, "SA", postcode);
      if (!latestDate || data.periodDate > latestDate) latestDate = data.periodDate;

      await prisma.suburbRentalStat.upsert({
        where: { suburbName_postcode_state_period: { suburbName, postcode, state: "SA", period } },
        create: {
          suburbSlug,
          suburbName,
          postcode,
          state: "SA",
          period,
          periodDate: data.periodDate,
          medianRentHouse: data.house ?? null,
          medianRentUnit:  data.unit ?? null,
          bondLodgements:  data.bonds,
          source: SOURCE_ID,
        },
        update: {
          suburbSlug,
          medianRentHouse: data.house ?? null,
          medianRentUnit:  data.unit ?? null,
          bondLodgements:  data.bonds,
        },
      });
      count++;
    }

    await prisma.suburb.updateMany({
      where: { state: "SA" },
      data: { statsUpdatedAt: new Date(), statsSource: SOURCE_ID },
    });

    await finishSync(SOURCE_ID, count, latestDate);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
