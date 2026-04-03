/**
 * QLD Crime Stats Sync (Queensland Police Service)
 *
 * Downloads LGA-level crime data from the QLD Police open data S3 bucket.
 * Data is at LGA level (not suburb level) — stored with lga field for future
 * matching against suburbs.
 *
 * Data source: https://www.data.qld.gov.au/dataset/9b4436a7-e445-42f1-975b-1d516706fb2a
 * Direct CSV: https://open-crime-data.s3-ap-southeast-2.amazonaws.com/Crime%20Statistics/LGA_Reported_Offences_Number.csv
 * Schedule: Quarterly
 */
import "dotenv/config";
import Papa from "papaparse";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";

const SOURCE_ID = "crime-qld";
const CSV_URL = "https://open-crime-data.s3-ap-southeast-2.amazonaws.com/Crime%20Statistics/LGA_Reported_Offences_Number.csv";

interface QldCrimeRow {
  LGA:           string;
  "Month Year":  string;
  "Offence Type": string;
  Count:         string;
  [key: string]: string;
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    log(SOURCE_ID, `downloading from ${CSV_URL}`);
    const res = await fetch(CSV_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status} downloading QLD crime CSV`);
    const text = await res.text();
    const { data } = Papa.parse<QldCrimeRow>(text, { header: true, skipEmptyLines: true });
    log(SOURCE_ID, `parsed ${data.length} rows`);

    // Aggregate by LGA + year (CSV has monthly data)
    const grouped = new Map<string, { total: number; breakdown: Record<string, number>; date: Date }>();

    for (const row of data) {
      const lga = String(row["LGA"] ?? row["lga"] ?? "").trim();
      const monthYear = String(row["Month Year"] ?? row["month_year"] ?? "").trim();
      if (!lga || !monthYear) continue;

      // "Month Year" format: "January 2024" or "Jan-2024"
      const yearMatch = monthYear.match(/(\d{4})/);
      if (!yearMatch) continue;
      const year = yearMatch[1];

      const key = `${lga}|${year}`;
      const existing = grouped.get(key) ?? { total: 0, breakdown: {}, date: new Date(`${year}-01-01`) };

      const count = parseInt(row["Count"] ?? row["count"] ?? "0") || 0;
      const offenceType = String(row["Offence Type"] ?? row["offence_type"] ?? "Other").trim();

      existing.total += count;
      existing.breakdown[offenceType] = (existing.breakdown[offenceType] ?? 0) + count;
      grouped.set(key, existing);
    }

    let count = 0;
    let latestDate: Date | undefined;

    // Use only the most recent year to avoid bloating DB with all history
    const allYears = [...new Set([...grouped.keys()].map((k) => k.split("|")[1]))].sort();
    const latestYear = allYears[allYears.length - 1];
    if (!latestYear) throw new Error("No year data found in QLD crime CSV");
    log(SOURCE_ID, `processing year ${latestYear}`);

    for (const [key, data] of grouped) {
      const [lga, year] = key.split("|");
      if (year !== latestYear) continue; // Only upsert latest year
      if (!latestDate || data.date > latestDate) latestDate = data.date;

      await prisma.suburbCrimeStat.upsert({
        where: { suburbName_state_period_source: { suburbName: lga, state: "QLD", period: year, source: SOURCE_ID } },
        create: {
          suburbSlug:       null,
          suburbName:       lga,
          lga,
          state:            "QLD",
          period:           year,
          periodDate:       data.date,
          totalOffences:    data.total,
          offenceBreakdown: data.breakdown,
          source: SOURCE_ID,
        },
        update: {
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
