/**
 * NSW Crime Stats Sync (BOCSAR)
 *
 * Downloads suburb-level crime data from the NSW Bureau of Crime Statistics
 * and Research (BOCSAR). Data is published as a ZIP containing a CSV.
 *
 * Data source: https://bocsar.nsw.gov.au/statistics-dashboards/open-datasets/criminal-offences-data.html
 * Direct download: https://bocsarblob.blob.core.windows.net/bocsar-open-data/SuburbData.zip
 * Schedule: Quarterly (data updated to March 2026, next update June 2026)
 *
 * If the URL changes, update BOCSAR_NSW_ZIP_URL in GitHub secrets.
 */
import "dotenv/config";
import AdmZip from "adm-zip";
import Papa from "papaparse";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import { resolveSlug } from "../slug-matcher";

const SOURCE_ID = "crime-nsw";
const ZIP_URL =
  process.env.BOCSAR_NSW_ZIP_URL ??
  "https://bocsarblob.blob.core.windows.net/bocsar-open-data/SuburbData.zip";

interface BocRow {
  Suburb:    string;
  LGA:       string;
  Postcode?: string;
  [key: string]: string | undefined;
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    log(SOURCE_ID, `downloading from ${ZIP_URL}`);
    const res = await fetch(ZIP_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching BOCSAR ZIP`);

    const buffer = Buffer.from(await res.arrayBuffer());
    const zip = new AdmZip(buffer);

    // Find the suburb-level CSV inside the ZIP
    const entry =
      zip.getEntries().find((e) => e.name.toLowerCase().includes("suburb") && e.name.endsWith(".csv")) ??
      zip.getEntries().find((e) => e.name.endsWith(".csv"));
    if (!entry) throw new Error("No CSV found in BOCSAR ZIP");
    log(SOURCE_ID, `parsing ${entry.name}`);

    const csv = zip.readAsText(entry);
    const { data } = Papa.parse<BocRow>(csv, { header: true, skipEmptyLines: true });
    log(SOURCE_ID, `parsed ${data.length} rows`);

    // BOCSAR data is monthly. Aggregate by suburb+year for annual summaries.
    // Columns: Suburb, LGA, Postcode, [OffenceType_YYYY-MM ...]
    // Detect if it's monthly columns or already annual
    const firstRow = data[0];
    if (!firstRow) throw new Error("Empty BOCSAR dataset");

    const offenceCols = Object.keys(firstRow).filter(
      (k) => !["Suburb", "LGA", "Postcode", "suburb", "lga", "postcode"].includes(k)
    );

    // Determine years from column names (e.g., "Theft 2023-04" → year 2023)
    const yearSet = new Set<string>();
    for (const col of offenceCols) {
      const m = col.match(/(\d{4})/);
      if (m) yearSet.add(m[1]);
    }
    const years = [...yearSet].sort();

    // Use the most recent year only (to avoid re-processing all history each run)
    const latestYear = years[years.length - 1];
    if (!latestYear) throw new Error("Could not determine year from BOCSAR columns");
    log(SOURCE_ID, `processing year ${latestYear} (${offenceCols.length} offence columns)`);

    let count = 0;

    for (const row of data) {
      const suburb = String(row.Suburb ?? row.suburb ?? "").trim();
      const lga    = String(row.LGA    ?? row.lga    ?? "").trim();
      const pc     = String(row.Postcode ?? row.postcode ?? "").trim();
      if (!suburb) continue;

      const suburbSlug = await resolveSlug(suburb, "NSW", pc);

      // Sum offence counts for latest year across all months
      let total = 0;
      const breakdown: Record<string, number> = {};
      for (const col of offenceCols) {
        if (!col.includes(latestYear)) continue;
        const n = parseInt(String((row as Record<string, string | undefined>)[col] ?? "0")) || 0;
        if (n <= 0) continue;
        // Extract offence type from column name (everything before the date)
        const offType = col.replace(/\s*\d{4}-\d{2}$/, "").trim() || "Other";
        total += n;
        breakdown[offType] = (breakdown[offType] ?? 0) + n;
      }

      const period     = latestYear;
      const periodDate = new Date(`${latestYear}-01-01`);

      await prisma.suburbCrimeStat.upsert({
        where: { suburbName_state_period_source: { suburbName: suburb, state: "NSW", period, source: SOURCE_ID } },
        create: {
          suburbSlug,
          suburbName: suburb,
          postcode:   pc || null,
          lga:        lga || null,
          state:      "NSW",
          period,
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
      where: { state: "NSW" },
      data: { statsUpdatedAt: new Date() },
    });

    await finishSync(SOURCE_ID, count, new Date(`${latestYear}-01-01`));
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
