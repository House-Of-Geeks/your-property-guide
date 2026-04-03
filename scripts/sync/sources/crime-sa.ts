/**
 * SA Crime Stats Sync (SA Police)
 *
 * Downloads suburb-level crime data via the data.sa.gov.au CKAN API.
 *
 * Data source: https://data.sa.gov.au/data/dataset/crime-statistics
 * Schedule: Quarterly
 */
import "dotenv/config";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import { resolveSlug } from "../slug-matcher";
import { fetchCkan, getCkanResourceId } from "../ckan";

const SOURCE_ID = "crime-sa";
const CKAN_BASE = "https://data.sa.gov.au";
const PACKAGE_ID = "crime-statistics";

interface SaCrimeRow {
  suburb:        string;
  postcode?:     string;
  year:          string;
  offence_level1: string;
  offence_level2: string;
  offence_count: string;
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    const resourceId = await getCkanResourceId(PACKAGE_ID, CKAN_BASE, "CSV");
    log(SOURCE_ID, `resource ID: ${resourceId}`);

    const rows = await fetchCkan<SaCrimeRow>(resourceId, CKAN_BASE);
    log(SOURCE_ID, `fetched ${rows.length} rows`);

    const grouped = new Map<string, { total: number; breakdown: Record<string, number>; postcode?: string; date: Date }>();

    for (const row of rows) {
      if (!row.suburb || !row.year) continue;
      const key = `${row.suburb}|${row.year}`;
      const existing = grouped.get(key) ?? { total: 0, breakdown: {}, postcode: row.postcode, date: new Date(`${row.year}-01-01`) };
      const n = parseInt(row.offence_count) || 0;
      existing.total += n;
      if (row.offence_level1) existing.breakdown[row.offence_level1] = (existing.breakdown[row.offence_level1] ?? 0) + n;
      grouped.set(key, existing);
    }

    let count = 0;
    let latestDate: Date | undefined;

    for (const [key, data] of grouped) {
      const [suburbName, period] = key.split("|");
      const suburbSlug = await resolveSlug(suburbName, "SA", data.postcode ?? "");
      if (!latestDate || data.date > latestDate) latestDate = data.date;

      await prisma.suburbCrimeStat.upsert({
        where: { suburbName_state_period_source: { suburbName, state: "SA", period, source: SOURCE_ID } },
        create: {
          suburbSlug,
          suburbName,
          postcode:         data.postcode ?? null,
          state:            "SA",
          period,
          periodDate:       data.date,
          totalOffences:    data.total,
          offenceBreakdown: data.breakdown,
          source: SOURCE_ID,
        },
        update: {
          suburbSlug,
          totalOffences:    data.total,
          offenceBreakdown: data.breakdown,
        },
      });
      count++;
    }

    await finishSync(SOURCE_ID, count, latestDate);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
