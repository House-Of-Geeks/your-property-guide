/**
 * NSW Crime Stats Sync (BOCSAR)
 *
 * Downloads suburb-level crime data from BOCSAR (Azure Blob).
 * ZIP contains ~432 MB CSV with 375 columns (suburb × offence × monthly counts 1995–now).
 * We stream-parse to avoid OOM — Buffer stays outside V8 heap, step callback
 * processes one row at a time accumulating per-suburb totals.
 *
 * CSV format: Suburb, Offence category, Subcategory, Jan 1995, Feb 1995, ..., Dec 2025
 *
 * Data source: https://bocsar.nsw.gov.au/statistics-dashboards/open-datasets/
 * Direct download: https://bocsarblob.blob.core.windows.net/bocsar-open-data/SuburbData.zip
 * Schedule: Quarterly
 */
import "dotenv/config";
import { Readable } from "stream";
import AdmZip from "adm-zip";
import Papa from "papaparse";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import { resolveSlug } from "../slug-matcher";
import { batchUpsertCrime, type CrimeRecord } from "../crime-batch";

const SOURCE_ID = "crime-nsw";
const ZIP_URL =
  process.env.BOCSAR_NSW_ZIP_URL ||
  "https://bocsarblob.blob.core.windows.net/bocsar-open-data/SuburbData.zip";

// Month column name patterns: "Jan 1995", "Dec 2025"
const MONTH_ABBR: Record<string, number> = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};

function parseColMonth(colName: string): { year: string; month: number } | null {
  // Format: "Mon YYYY" e.g. "Dec 2025"
  const m = colName.trim().match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})$/);
  if (!m) return null;
  return { year: m[2], month: MONTH_ABBR[m[1]] ?? 1 };
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    log(SOURCE_ID, `downloading from ${ZIP_URL}`);
    const res = await fetch(ZIP_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching BOCSAR ZIP`);

    // Keep as Buffer (native memory, outside V8 heap) to avoid OOM
    const zipBuffer = Buffer.from(await res.arrayBuffer());
    const zip = new AdmZip(zipBuffer);

    const entry =
      zip.getEntries().find((e) => e.name.toLowerCase().includes("suburb") && e.name.endsWith(".csv")) ??
      zip.getEntries().find((e) => e.name.endsWith(".csv"));
    if (!entry) throw new Error("No CSV found in BOCSAR ZIP");
    log(SOURCE_ID, `streaming ${entry.name} (${Math.round(entry.header.size / 1e6)} MB uncompressed)`);

    // Read entry as Buffer (not string) — stays outside V8 heap
    const csvBuffer = zip.readFile(entry);
    if (!csvBuffer) throw new Error("Could not read CSV entry from ZIP");

    // Create a Node.js readable stream from the buffer
    const csvStream = new Readable();
    csvStream.push(csvBuffer);
    csvStream.push(null);

    let latestYear: string | null = null;
    let monthCols: string[] = []; // column names matching the latest year
    let headerProcessed = false;

    // Accumulator: suburb → { total, breakdown }
    const grouped = new Map<string, { total: number; breakdown: Record<string, number> }>();

    await new Promise<void>((resolve, reject) => {
      Papa.parse(csvStream as unknown as File, {
        header: true,
        skipEmptyLines: true,
        step: (result: Papa.ParseStepResult<Record<string, string>>) => {
          const row = result.data;
          if (!row) return;

          // On first row, discover column names and determine latest year
          if (!headerProcessed) {
            const allCols = Object.keys(row);
            const years = new Set<string>();
            for (const col of allCols) {
              const parsed = parseColMonth(col);
              if (parsed) years.add(parsed.year);
            }
            const sortedYears = [...years].sort();
            latestYear = sortedYears[sortedYears.length - 1] ?? null;
            if (latestYear) {
              monthCols = allCols.filter((c) => {
                const p = parseColMonth(c);
                return p?.year === latestYear;
              });
            }
            headerProcessed = true;
          }

          if (!latestYear || monthCols.length === 0) return;

          const suburb  = String(row["Suburb"]  ?? row["suburb"]  ?? "").trim();
          const offence = String(row["Offence category"] ?? row["Offence_category"] ?? "").trim();
          if (!suburb) return;

          // Sum monthly counts for the latest year
          let rowTotal = 0;
          for (const col of monthCols) {
            rowTotal += parseInt(row[col] ?? "0") || 0;
          }
          if (rowTotal === 0) return;

          const existing = grouped.get(suburb) ?? { total: 0, breakdown: {} };
          existing.total += rowTotal;
          if (offence) {
            existing.breakdown[offence] = (existing.breakdown[offence] ?? 0) + rowTotal;
          }
          grouped.set(suburb, existing);
        },
        complete: () => resolve(),
        error: (err: Error) => reject(err),
      });
    });

    if (!latestYear) throw new Error("Could not determine latest year from BOCSAR CSV");
    log(SOURCE_ID, `processing year ${latestYear}, ${grouped.size} suburbs`);

    const periodDate = new Date(`${latestYear}-01-01`);
    const records: CrimeRecord[] = [];

    for (const [suburbName, data] of grouped) {
      const suburbSlug = await resolveSlug(suburbName, "NSW", "");
      records.push({
        suburbSlug,
        suburbName,
        state:           "NSW",
        period:          latestYear,
        periodDate,
        totalOffences:   data.total,
        offenceBreakdown: data.breakdown,
        source:          SOURCE_ID,
      });
    }

    const count = await batchUpsertCrime(records);

    await prisma.suburb.updateMany({
      where: { state: "NSW" },
      data: { statsUpdatedAt: new Date(), crimeUpdatedAt: new Date() },
    });

    await finishSync(SOURCE_ID, count, periodDate);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
