/**
 * QLD Crime Stats Sync (Queensland Police Service)
 *
 * Downloads suburb-level crime data via the data.qld.gov.au CKAN API.
 *
 * Data source: https://www.data.qld.gov.au/dataset/reported-offences-qld
 * Schedule: Quarterly
 *
 * To find the resource ID:
 *   curl "https://www.data.qld.gov.au/api/3/action/package_show?id=reported-offences-qld" | jq '.result.resources[] | {id, name, format}'
 */
import "dotenv/config";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import { resolveSlug } from "../slug-matcher";
import { fetchCkan, getCkanResourceId } from "../ckan";

const SOURCE_ID = "crime-qld";
const CKAN_BASE = "https://www.data.qld.gov.au";
const PACKAGE_ID = "reported-offences-qld";

interface QldCrimeRow {
  suburb:       string;
  postcode?:    string;
  lga:          string;
  year:         string;
  offence_type: string;
  offence_count: string;
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    const resourceId = await getCkanResourceId(PACKAGE_ID, CKAN_BASE, "CSV");
    log(SOURCE_ID, `resource ID: ${resourceId}`);

    const rows = await fetchCkan<QldCrimeRow>(resourceId, CKAN_BASE);
    log(SOURCE_ID, `fetched ${rows.length} rows`);

    // Group by suburb + year
    const grouped = new Map<string, { total: number; breakdown: Record<string, number>; postcode?: string; lga: string; date: Date }>();

    for (const row of rows) {
      if (!row.suburb || !row.year) continue;
      const key = `${row.suburb}|${row.year}`;
      const existing = grouped.get(key) ?? { total: 0, breakdown: {}, lga: row.lga, postcode: row.postcode, date: new Date(`${row.year}-01-01`) };
      const count = parseInt(row.offence_count) || 0;
      existing.total += count;
      if (row.offence_type) existing.breakdown[row.offence_type] = (existing.breakdown[row.offence_type] ?? 0) + count;
      grouped.set(key, existing);
    }

    let count = 0;
    let latestDate: Date | undefined;

    for (const [key, data] of grouped) {
      const [suburbName, period] = key.split("|");
      const suburbSlug = await resolveSlug(suburbName, "QLD", data.postcode ?? "");
      if (!latestDate || data.date > latestDate) latestDate = data.date;

      await prisma.suburbCrimeStat.upsert({
        where: { suburbName_state_period_source: { suburbName, state: "QLD", period, source: SOURCE_ID } },
        create: {
          suburbSlug,
          suburbName,
          postcode:         data.postcode ?? null,
          lga:              data.lga,
          state:            "QLD",
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

    await prisma.suburb.updateMany({
      where: { state: "QLD" },
      data: { statsUpdatedAt: new Date() },
    });

    await finishSync(SOURCE_ID, count, latestDate);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
