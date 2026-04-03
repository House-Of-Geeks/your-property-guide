/**
 * VIC Crime Stats Sync (Crime Statistics Agency)
 *
 * Downloads LGA/suburb-level crime data from the Victorian Crime Statistics Agency.
 * Published as an Excel workbook.
 *
 * Data source: https://www.crimestatistics.vic.gov.au/crime-statistics/latest-victorian-crime-data/download-data
 * Schedule: Quarterly
 *
 * Update VIC_CRIME_EXCEL_URL in GitHub secrets when a new release is published.
 * Note: VIC data is at LGA level, not always suburb level.
 */
import "dotenv/config";
import * as XLSX from "xlsx";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";

const SOURCE_ID = "crime-vic";
const EXCEL_URL =
  process.env.VIC_CRIME_EXCEL_URL ??
  "https://www.crimestatistics.vic.gov.au/sites/default/files/2024-03/01%20LGA%20Criminal%20Incidents%202023.xlsx";

interface VicCrimeRow {
  "Local Government Area": string;
  "Year ending":           string;
  "Offence Division":      string;
  "Offence Subdivision":   string;
  "Incidents Recorded":    string | number;
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    log(SOURCE_ID, `downloading from ${EXCEL_URL}`);
    const res = await fetch(EXCEL_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching VIC crime Excel`);

    const buffer = Buffer.from(await res.arrayBuffer());
    const wb = XLSX.read(buffer, { type: "buffer" });

    // Find LGA-level sheet
    const sheetName =
      wb.SheetNames.find((n) => n.toLowerCase().includes("lga")) ??
      wb.SheetNames[0];
    log(SOURCE_ID, `using sheet: ${sheetName}`);

    const ws = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<VicCrimeRow>(ws, { defval: "" });
    log(SOURCE_ID, `parsed ${rows.length} rows`);

    // Group by LGA + period — sum all offence divisions
    const grouped = new Map<string, { total: number; breakdown: Record<string, number>; date: Date }>();

    for (const row of rows) {
      const lga = String(row["Local Government Area"] ?? "").trim();
      const yearStr = String(row["Year ending"] ?? "").trim();
      if (!lga || !yearStr) continue;

      // "Year ending" is often "December 2023" — extract year
      const yearMatch = yearStr.match(/\d{4}/);
      if (!yearMatch) continue;
      const year = yearMatch[0];
      const period = year;

      const key = `${lga}|${year}`;
      const existing = grouped.get(key) ?? { total: 0, breakdown: {}, date: new Date(`${year}-12-01`) };
      const incidents = parseInt(String(row["Incidents Recorded"])) || 0;
      const division = String(row["Offence Division"] ?? "Other").trim();

      existing.total += incidents;
      existing.breakdown[division] = (existing.breakdown[division] ?? 0) + incidents;
      grouped.set(key, existing);
    }

    let count = 0;
    let latestDate: Date | undefined;

    for (const [key, data] of grouped) {
      const [lga, period] = key.split("|");
      if (!latestDate || data.date > latestDate) latestDate = data.date;

      await prisma.suburbCrimeStat.upsert({
        where: { suburbName_state_period_source: { suburbName: lga, state: "VIC", period, source: SOURCE_ID } },
        create: {
          suburbSlug:       null,
          suburbName:       lga,
          lga,
          state:            "VIC",
          period,
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

    await finishSync(SOURCE_ID, count, latestDate);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
