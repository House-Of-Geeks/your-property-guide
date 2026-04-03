/**
 * VIC Crime Stats Sync (Crime Statistics Agency)
 *
 * Downloads LGA-level crime data from the Victorian Crime Statistics Agency
 * via the data.vic.gov.au CKAN API. Data files are direct XLSX downloads.
 *
 * Data source: https://discover.data.vic.gov.au/dataset/92d47891-3cf8-45eb-9d39-aa7e1db2f478
 * Schedule: Quarterly
 */
import "dotenv/config";
import * as XLSX from "xlsx";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import { getCkanDownloadUrl } from "../ckan";

const SOURCE_ID = "crime-vic";
const CKAN_BASE = "https://discover.data.vic.gov.au";
// Crime Statistics Agency - Criminal Incidents dataset
const PACKAGE_ID = "92d47891-3cf8-45eb-9d39-aa7e1db2f478";

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    // Get latest LGA-level XLSX — filter by "LGA" in resource name
    const xlsxUrl = await getCkanDownloadUrl(PACKAGE_ID, CKAN_BASE, "XLSX", "LGA");
    log(SOURCE_ID, `downloading from ${xlsxUrl}`);

    const res = await fetch(xlsxUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status} downloading VIC crime XLSX`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const wb = XLSX.read(buffer, { type: "buffer" });

    // Find LGA-level sheet
    const sheetName =
      wb.SheetNames.find((n) => n.toLowerCase().includes("lga")) ??
      wb.SheetNames[0];
    log(SOURCE_ID, `using sheet: ${sheetName}`);

    const ws = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, string | number>>(ws, { defval: "" });
    log(SOURCE_ID, `parsed ${rows.length} rows`);

    // Group by LGA + period — sum all offence divisions
    const grouped = new Map<string, { total: number; breakdown: Record<string, number>; date: Date }>();

    for (const row of rows) {
      const lga = String(
        row["Local Government Area"] ?? row["LGA"] ?? row["lga"] ?? ""
      ).trim();
      const yearStr = String(
        row["Year ending"] ?? row["Year Ending"] ?? row["year_ending"] ?? row["Year"] ?? ""
      ).trim();
      if (!lga || !yearStr) continue;

      // "Year ending" is often "December 2023" — extract 4-digit year
      const yearMatch = yearStr.match(/\d{4}/);
      if (!yearMatch) continue;
      const year = yearMatch[0];

      const key = `${lga}|${year}`;
      const existing = grouped.get(key) ?? { total: 0, breakdown: {}, date: new Date(`${year}-12-01`) };

      const incidents = parseInt(String(
        row["Incidents Recorded"] ?? row["incidents_recorded"] ?? row["Count"] ?? "0"
      )) || 0;
      const division = String(
        row["Offence Division"] ?? row["offence_division"] ?? row["Offence"] ?? "Other"
      ).trim();

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
