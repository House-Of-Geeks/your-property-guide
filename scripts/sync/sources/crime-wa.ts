/**
 * WA Crime Stats Sync (WA Police Force)
 *
 * Downloads suburb-level crime data from the WA Police crime statistics Excel.
 * Filters to the most recent year in the data before upserting.
 *
 * Data source: https://www.police.wa.gov.au/Crime/CrimeStatistics
 * Schedule: Annual
 *
 * Update WA_CRIME_EXCEL_URL in GitHub secrets when a new release is published.
 */
import "dotenv/config";
import * as XLSX from "xlsx";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import { resolveSlug } from "../slug-matcher";
import { batchUpsertCrime, type CrimeRecord } from "../crime-batch";

const SOURCE_ID = "crime-wa";
// NOTE: WA Police migrated to wa.gov.au in Oct 2024 and have not republished
// the suburb-level XLSX. Set WA_CRIME_EXCEL_URL when they do.
// Check: https://www.wa.gov.au/organisation/western-australia-police-force/crime-statistics
const EXCEL_URL = process.env.WA_CRIME_EXCEL_URL ?? "";

interface WaCrimeRow {
  Suburb:     string;
  Year:       string;
  [key: string]: string | number;
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    if (!EXCEL_URL) {
      // WA suburb-level data was removed in Oct 2024 when police.wa.gov.au migrated.
      // Set WA_CRIME_EXCEL_URL env var when a new URL is found.
      log(SOURCE_ID, "WA_CRIME_EXCEL_URL not set — WA suburb crime data unavailable (see script for details)");
      await finishSync(SOURCE_ID, 0);
      return;
    }
    log(SOURCE_ID, `downloading from ${EXCEL_URL}`);
    const res = await fetch(EXCEL_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching WA crime Excel`);
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("spreadsheet") && !contentType.includes("octet-stream") && !contentType.includes("openxmlformats")) {
      throw new Error(`Unexpected content-type "${contentType}" — URL may have moved. Update WA_CRIME_EXCEL_URL.`);
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    const wb = XLSX.read(buffer, { type: "buffer" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<WaCrimeRow>(ws, { defval: "" });
    log(SOURCE_ID, `parsed ${rows.length} rows`);

    // Find the most recent year in the data
    const yearSet = new Set<string>();
    for (const row of rows) {
      const y = String(row.Year ?? "").trim();
      if (/^\d{4}$/.test(y)) yearSet.add(y);
    }
    const latestYear = [...yearSet].sort().at(-1);
    if (!latestYear) throw new Error("No year found in WA crime data");
    log(SOURCE_ID, `processing year ${latestYear}`);

    const periodDate = new Date(`${latestYear}-01-01`);
    const records: CrimeRecord[] = [];

    for (const row of rows) {
      const suburbName = String(row.Suburb ?? "").trim();
      const year = String(row.Year ?? "").trim();
      if (!suburbName || year !== latestYear) continue;

      const suburbSlug = await resolveSlug(suburbName, "WA", "");

      // Sum all numeric columns as total
      let total = 0;
      const breakdown: Record<string, number> = {};
      for (const [k, v] of Object.entries(row)) {
        if (["Suburb", "Year"].includes(k)) continue;
        const n = parseInt(String(v));
        if (!isNaN(n) && n > 0) {
          total += n;
          breakdown[k] = n;
        }
      }

      records.push({
        suburbSlug,
        suburbName,
        state:           "WA",
        period:          latestYear,
        periodDate,
        totalOffences:   total,
        offenceBreakdown: breakdown,
        source:          SOURCE_ID,
      });
    }

    const count = await batchUpsertCrime(records);

    await prisma.suburb.updateMany({
      where: { state: "WA" },
      data: { crimeUpdatedAt: new Date() },
    });

    await finishSync(SOURCE_ID, count, periodDate);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
