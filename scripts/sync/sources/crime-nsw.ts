/**
 * NSW Crime Stats Sync (BOCSAR)
 *
 * Downloads suburb-level crime data from the NSW Bureau of Crime Statistics
 * and Research (BOCSAR). Data is published as a ZIP containing a CSV.
 *
 * Data source: https://bocsar.nsw.gov.au/statistics-dashboards/open-datasets/criminal-offences-data.html
 * Schedule: Quarterly
 *
 * The ZIP URL changes each release — update BOCSAR_NSW_ZIP_URL in GitHub secrets
 * or the constant below when a new release is published.
 */
import "dotenv/config";
import AdmZip from "adm-zip";
import Papa from "papaparse";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import { resolveSlug } from "../slug-matcher";

const SOURCE_ID = "crime-nsw";
// Update this URL each quarter from:
// https://bocsar.nsw.gov.au/statistics-dashboards/open-datasets/criminal-offences-data.html
const ZIP_URL =
  process.env.BOCSAR_NSW_ZIP_URL ??
  "https://bocsar.nsw.gov.au/Documents/RCS-Annual/SuburbDataCSV.zip";

interface BocRow {
  Suburb:    string;
  LGA:       string;
  Postcode?: string;
  Year:      string;
  [offence: string]: string | undefined;
}

const TOTAL_FIELD = "Total"; // BOCSAR uses "Total" column for all offences

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

    let count = 0;
    const years = new Set<string>();

    for (const row of data) {
      if (!row.Suburb || !row.Year) continue;
      years.add(row.Year);

      const suburbSlug = await resolveSlug(row.Suburb, "NSW", row.Postcode ?? "");
      const periodDate = new Date(`${row.Year}-01-01`);
      const total = parseInt(row[TOTAL_FIELD] ?? "0") || 0;

      // Build offence breakdown from remaining columns
      const breakdown: Record<string, number> = {};
      for (const [k, v] of Object.entries(row)) {
        if (["Suburb", "LGA", "Postcode", "Year"].includes(k)) continue;
        const n = parseInt(v ?? "0");
        if (!isNaN(n) && n > 0) breakdown[k] = n;
      }

      await prisma.suburbCrimeStat.upsert({
        where: { suburbName_state_period_source: { suburbName: row.Suburb, state: "NSW", period: row.Year, source: SOURCE_ID } },
        create: {
          suburbSlug,
          suburbName: row.Suburb,
          postcode:   row.Postcode ?? null,
          lga:        row.LGA ?? null,
          state:      "NSW",
          period:     row.Year,
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

    const latestYear = Math.max(...[...years].map(Number));
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
