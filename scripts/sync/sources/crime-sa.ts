/**
 * SA Crime Stats Sync (SA Police)
 *
 * Downloads suburb-level crime data via the data.sa.gov.au CKAN API.
 * The dataset contains suburb-based statistics for crimes against the person
 * and crimes against property.
 *
 * Data source: https://data.sa.gov.au/data/dataset/860126f7-eeb5-4fbc-be44-069aa0467d11
 * Schedule: Quarterly
 */
import "dotenv/config";
import Papa from "papaparse";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import { resolveSlug } from "../slug-matcher";
import { getCkanDownloadUrl } from "../ckan";

const SOURCE_ID = "crime-sa";
const CKAN_BASE = "https://data.sa.gov.au/data";
// SA Police crime statistics — suburb-based CSV data
const PACKAGE_ID = "860126f7-eeb5-4fbc-be44-069aa0467d11";

interface SaCrimeRow {
  [key: string]: string;
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    const csvUrl = await getCkanDownloadUrl(PACKAGE_ID, CKAN_BASE, "CSV");
    log(SOURCE_ID, `downloading from ${csvUrl}`);

    const res = await fetch(csvUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status} downloading SA crime CSV`);
    const text = await res.text();
    const { data } = Papa.parse<SaCrimeRow>(text, { header: true, skipEmptyLines: true });
    log(SOURCE_ID, `parsed ${data.length} rows`);

    // Infer year from URL (e.g. data_sa_crime_q2_2025-26.csv → 2025)
    const urlYearMatch = csvUrl.match(/(\d{4})-(\d{2})/);
    const urlYear = urlYearMatch?.[1] ?? String(new Date().getFullYear() - 1);

    const grouped = new Map<string, { total: number; breakdown: Record<string, number>; postcode?: string; date: Date; period: string }>();

    for (const row of data) {
      // Column name variants across SA crime CSV releases
      const suburb = String(
        row["Suburb"] ?? row["suburb"] ?? row["Location"] ?? row["location"] ?? ""
      ).trim();
      const postcode = String(row["Postcode"] ?? row["postcode"] ?? "").trim();
      const rawYear = String(
        row["Year"] ?? row["year"] ?? row["Financial_Year"] ?? row["financial_year"] ?? urlYear
      ).trim();
      if (!suburb || !rawYear) continue;

      // Normalise year — SA uses financial years like "2025-26", grab first year
      const yearMatch = rawYear.match(/(\d{4})/);
      const year = yearMatch?.[1] ?? rawYear;
      const period = year;

      const key = `${suburb}|${postcode}|${period}`;
      const existing = grouped.get(key) ?? { total: 0, breakdown: {}, postcode: postcode || undefined, date: new Date(`${year}-01-01`), period };

      const offence = String(
        row["Offence_Level_1"] ?? row["offence_level_1"] ?? row["Offence"] ?? row["offence"] ?? "Other"
      ).trim();
      const n = parseInt(String(row["Offence_Count"] ?? row["offence_count"] ?? row["Count"] ?? row["count"] ?? "0")) || 0;
      existing.total += n;
      if (offence) existing.breakdown[offence] = (existing.breakdown[offence] ?? 0) + n;
      grouped.set(key, existing);
    }

    let count = 0;
    let latestDate: Date | undefined;

    for (const [key, data] of grouped) {
      const [suburbName, postcode, period] = key.split("|");
      const suburbSlug = await resolveSlug(suburbName, "SA", postcode);
      if (!latestDate || data.date > latestDate) latestDate = data.date;

      await prisma.suburbCrimeStat.upsert({
        where: { suburbName_state_period_source: { suburbName, state: "SA", period, source: SOURCE_ID } },
        create: {
          suburbSlug,
          suburbName,
          postcode:         postcode || null,
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
