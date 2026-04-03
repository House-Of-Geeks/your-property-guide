/**
 * QLD Crime Stats Sync (Queensland Police Service)
 *
 * Downloads LGA-level crime data from the QLD Police open data S3 bucket.
 * CSV is wide-format: one row per LGA per month, each offence type is a column.
 *
 * Actual CSV columns: "LGA Name", "Month Year" (values like "JAN01"=Jan 2001,
 * "DEC24"=Dec 2024), then ~90 offence type columns.
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

// Parse QLD month-year codes: "JAN01" → {year: 2001, month: 1}
// 2-digit year: 00–30 = 2000–2030, 31–99 = 1931–1999
const MONTH_ABBR: Record<string, number> = {
  JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
  JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12,
};

function parseMonthYear(code: string): { year: string; month: number } | null {
  const m = code.match(/^([A-Z]{3})(\d{2})$/);
  if (!m) return null;
  const monthNum = MONTH_ABBR[m[1]];
  if (!monthNum) return null;
  const yy = parseInt(m[2]);
  const year = yy <= 30 ? 2000 + yy : 1900 + yy;
  return { year: String(year), month: monthNum };
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    log(SOURCE_ID, `downloading from ${CSV_URL}`);
    const res = await fetch(CSV_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status} downloading QLD crime CSV`);
    const text = await res.text();
    const { data, meta } = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });
    log(SOURCE_ID, `parsed ${data.length} rows, columns: ${meta.fields?.slice(0, 5).join(", ")}...`);

    const lgaCol      = meta.fields?.find((f) => f.toLowerCase().includes("lga")) ?? "LGA Name";
    const monthYearCol = meta.fields?.find((f) => f.toLowerCase().includes("month")) ?? "Month Year";

    // Offence columns = everything except LGA and Month Year
    const offenceCols = (meta.fields ?? []).filter(
      (f) => f !== lgaCol && f !== monthYearCol
    );

    // Aggregate by LGA + year across all months (sum all offences)
    const grouped = new Map<string, { total: number; breakdown: Record<string, number>; latestMonth: number }>();

    for (const row of data) {
      const lga       = String(row[lgaCol] ?? "").trim();
      const monthYear = String(row[monthYearCol] ?? "").trim();
      if (!lga || !monthYear) continue;

      const parsed = parseMonthYear(monthYear);
      if (!parsed) continue;
      const { year, month } = parsed;

      const key = `${lga}|${year}`;
      const existing = grouped.get(key) ?? { total: 0, breakdown: {}, latestMonth: 0 };

      for (const col of offenceCols) {
        const n = parseInt(row[col] ?? "0") || 0;
        if (n > 0) {
          existing.total += n;
          existing.breakdown[col] = (existing.breakdown[col] ?? 0) + n;
        }
      }
      if (month > existing.latestMonth) existing.latestMonth = month;
      grouped.set(key, existing);
    }

    // Only process the most recent year to avoid bloating DB on first run
    const allYears = [...new Set([...grouped.keys()].map((k) => k.split("|")[1]))].sort();
    const latestYear = allYears[allYears.length - 1];
    if (!latestYear) throw new Error("No year data found in QLD crime CSV");
    log(SOURCE_ID, `processing year ${latestYear} (${allYears.length} years in dataset)`);

    let count = 0;
    let latestDate: Date | undefined;

    for (const [key, data] of grouped) {
      const [lga, year] = key.split("|");
      if (year !== latestYear) continue;

      const periodDate = new Date(`${year}-12-01`);
      if (!latestDate || periodDate > latestDate) latestDate = periodDate;

      await prisma.suburbCrimeStat.upsert({
        where: { suburbName_state_period_source: { suburbName: lga, state: "QLD", period: year, source: SOURCE_ID } },
        create: {
          suburbSlug:       null,
          suburbName:       lga,
          lga,
          state:            "QLD",
          period:           year,
          periodDate,
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
