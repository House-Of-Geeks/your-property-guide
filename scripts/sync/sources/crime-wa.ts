/**
 * WA Crime Stats Sync (WA Police Force)
 *
 * Downloads suburb-level crime data from the WA Police crime statistics Excel.
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

const SOURCE_ID = "crime-wa";
const EXCEL_URL =
  process.env.WA_CRIME_EXCEL_URL ??
  "https://www.police.wa.gov.au/sites/default/files/2024-03/crime-statistics-by-suburb-2023.xlsx";

interface WaCrimeRow {
  Suburb:     string;
  Year:       string;
  [key: string]: string | number;
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    log(SOURCE_ID, `downloading from ${EXCEL_URL}`);
    const res = await fetch(EXCEL_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching WA crime Excel`);

    const buffer = Buffer.from(await res.arrayBuffer());
    const wb = XLSX.read(buffer, { type: "buffer" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<WaCrimeRow>(ws, { defval: "" });
    log(SOURCE_ID, `parsed ${rows.length} rows`);

    let count = 0;
    let latestDate: Date | undefined;

    for (const row of rows) {
      const suburbName = String(row.Suburb ?? "").trim();
      const year = String(row.Year ?? "").trim();
      if (!suburbName || !year || !/^\d{4}$/.test(year)) continue;

      const suburbSlug = await resolveSlug(suburbName, "WA", "");
      const periodDate = new Date(`${year}-01-01`);
      if (!latestDate || periodDate > latestDate) latestDate = periodDate;

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

      await prisma.suburbCrimeStat.upsert({
        where: { suburbName_state_period_source: { suburbName, state: "WA", period: year, source: SOURCE_ID } },
        create: {
          suburbSlug,
          suburbName,
          state:            "WA",
          period:           year,
          periodDate,
          totalOffences:    total,
          offenceBreakdown: breakdown,
          source: SOURCE_ID,
        },
        update: {
          suburbSlug,
          totalOffences:    total,
          offenceBreakdown: breakdown,
        },
      });
      count++;
    }

    await prisma.suburb.updateMany({
      where: { state: "WA" },
      data: { crimeUpdatedAt: new Date() },
    });

    await finishSync(SOURCE_ID, count, latestDate);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
