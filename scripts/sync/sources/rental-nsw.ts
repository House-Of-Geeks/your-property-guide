/**
 * NSW Rental Data Sync
 *
 * Downloads pre-aggregated median rental data from the NSW Rent and Sales Report
 * via the data.nsw.gov.au CKAN API.
 *
 * Data source: https://data.nsw.gov.au/data/dataset/rent-and-sales-report
 * Schedule: Quarterly
 *
 * To find the resource ID:
 *   curl "https://data.nsw.gov.au/data/api/3/action/package_show?id=rent-and-sales-report" | jq '.result.resources[] | {id, name, format}'
 */
import "dotenv/config";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import { resolveSlug } from "../slug-matcher";
import { fetchCkan, getCkanResourceId } from "../ckan";

const SOURCE_ID = "rental-nsw";
const CKAN_BASE = "https://data.nsw.gov.au";
const PACKAGE_ID = "rent-and-sales-report";

interface NswRentalRow {
  suburb:           string;
  postcode:         string;
  quarter:          string; // e.g. "Sep-2024" or "2024-Q3"
  dwelling_type:    string; // "Houses" | "Units/Other"
  median_weekly_asking_rent: string;
  count_of_new_bonds: string;
}

function parsePeriod(q: string): { period: string; periodDate: Date } {
  // Handle multiple formats: "Sep-2024", "September 2024", "2024-Q3"
  if (/^\d{4}-Q\d$/.test(q)) {
    const [year, quarter] = q.split("-");
    const monthMap: Record<string, number> = { Q1: 3, Q2: 6, Q3: 9, Q4: 12 };
    return {
      period: q,
      periodDate: new Date(`${year}-${String(monthMap[quarter] ?? 12).padStart(2, "0")}-01`),
    };
  }
  const monthAbbrev: Record<string, { num: number; quarter: string }> = {
    Jan: { num: 1, quarter: "Q1" }, Feb: { num: 2, quarter: "Q1" }, Mar: { num: 3, quarter: "Q1" },
    Apr: { num: 4, quarter: "Q2" }, May: { num: 5, quarter: "Q2" }, Jun: { num: 6, quarter: "Q2" },
    Jul: { num: 7, quarter: "Q3" }, Aug: { num: 8, quarter: "Q3" }, Sep: { num: 9, quarter: "Q3" },
    Oct: { num: 10, quarter: "Q4" }, Nov: { num: 11, quarter: "Q4" }, Dec: { num: 12, quarter: "Q4" },
  };
  const [mon, year] = q.split("-");
  const info = monthAbbrev[mon] ?? { num: 12, quarter: "Q4" };
  return {
    period: `${year}-${info.quarter}`,
    periodDate: new Date(`${year}-${String(info.num).padStart(2, "0")}-01`),
  };
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    const resourceId = await getCkanResourceId(PACKAGE_ID, CKAN_BASE, "CSV");
    log(SOURCE_ID, `resource ID: ${resourceId}`);

    const rows = await fetchCkan<NswRentalRow>(resourceId, CKAN_BASE);
    log(SOURCE_ID, `fetched ${rows.length} rows`);

    // Group by suburb+postcode+period — separate houses vs units
    const grouped = new Map<string, { house?: number; unit?: number; bonds: number; periodDate: Date }>();

    for (const row of rows) {
      if (!row.suburb || !row.postcode) continue;
      const { period, periodDate } = parsePeriod(row.quarter);
      const key = `${row.suburb}|${row.postcode}|${period}`;
      const existing = grouped.get(key) ?? { bonds: 0, periodDate };
      const rent = parseInt(row.median_weekly_asking_rent) || undefined;
      const bonds = parseInt(row.count_of_new_bonds) || 0;

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
      const suburbSlug = await resolveSlug(suburbName, "NSW", postcode);
      if (!latestDate || data.periodDate > latestDate) latestDate = data.periodDate;

      await prisma.suburbRentalStat.upsert({
        where: { suburbName_postcode_state_period: { suburbName, postcode, state: "NSW", period } },
        create: {
          suburbSlug,
          suburbName,
          postcode,
          state: "NSW",
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
      where: { state: "NSW" },
      data: { statsUpdatedAt: new Date(), statsSource: SOURCE_ID },
    });

    await finishSync(SOURCE_ID, count, latestDate);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
