/**
 * VIC Crime Stats Sync (Crime Statistics Agency)
 *
 * Downloads suburb-level crime data from the Victorian Crime Statistics Agency.
 * Uses the LGA Criminal Incidents XLSX (Table 03 — Suburb/Town level with postcode).
 *
 * NOTE: The CKAN package contains two XLSX files:
 *   1. Data_Tables_Criminal_Incidents_Visualisation_*.xlsx  ← wrong, no geography
 *   2. Data_Tables_LGA_Criminal_Incidents_*.xlsx            ← correct, suburb-level
 * We filter by URL to avoid accidentally downloading the Visualisation file.
 *
 * Table 03 columns: Year, Year ending, Local Government Area, Postcode,
 *   Suburb/Town Name, Offence Division, Offence Subdivision, Offence Subgroup,
 *   Incidents Recorded
 *
 * Data source: https://discover.data.vic.gov.au/dataset/92d47891-3cf8-45eb-9d39-aa7e1db2f478
 * Schedule: Quarterly
 */
import "dotenv/config";
import * as XLSX from "xlsx";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import { resolveSlug } from "../slug-matcher";
import { getCkanPackage } from "../ckan";
import { batchUpsertCrime, type CrimeRecord } from "../crime-batch";

const SOURCE_ID = "crime-vic";
const CKAN_BASE = "https://discover.data.vic.gov.au";
const PACKAGE_ID = "92d47891-3cf8-45eb-9d39-aa7e1db2f478";

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    // Get all XLSX resources and pick the LGA Criminal Incidents file,
    // explicitly excluding the Visualisation file which has no suburb geography.
    const resources = await getCkanPackage(PACKAGE_ID, CKAN_BASE);
    const xlsxResource = resources
      .filter(
        (r) =>
          r.format.toUpperCase() === "XLSX" &&
          (r.url.toLowerCase().includes("lga_criminal") ||
            r.url.toLowerCase().includes("lga criminal") ||
            (r.url.toLowerCase().includes("lga") && !r.url.toLowerCase().includes("visualisation"))) &&
          !r.url.toLowerCase().includes("visualisation"),
      )
      .sort((a, b) => b.created.localeCompare(a.created))[0];

    if (!xlsxResource) throw new Error("Could not find LGA Criminal Incidents XLSX in VIC crime package");
    const xlsxUrl = xlsxResource.url;
    log(SOURCE_ID, `downloading from ${xlsxUrl}`);

    const res = await fetch(xlsxUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status} downloading VIC crime XLSX`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const wb = XLSX.read(buffer, { type: "buffer" });
    log(SOURCE_ID, `sheets: ${wb.SheetNames.join(", ")}`);

    // Use Table 03 — suburb/town level with postcode
    const sheetName =
      wb.SheetNames.find((n) => n === "Table 03") ??
      wb.SheetNames.find((n) => n.toLowerCase().includes("suburb")) ??
      wb.SheetNames.find((n) => /table\s*0?3/i.test(n)) ??
      wb.SheetNames.find((n) => !/contents|footnote/i.test(n) && n !== "Table 01" && n !== "Table 02");
    if (!sheetName) throw new Error("Could not find suburb-level sheet in VIC crime XLSX");
    log(SOURCE_ID, `using sheet: ${sheetName}`);

    const ws = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, string | number>>(ws, { defval: "" });
    log(SOURCE_ID, `parsed ${rows.length} rows`);
    if (rows.length > 0) {
      log(SOURCE_ID, `sample columns: ${Object.keys(rows[0]).slice(0, 10).join(", ")}`);
    }

    // Find the most recent year in the data
    const yearSet = new Set<string>();
    for (const row of rows) {
      const y = String(row["Year"] ?? row["year"] ?? "").trim();
      if (/^\d{4}$/.test(y)) yearSet.add(y);
    }
    const latestYear = [...yearSet].sort().at(-1);
    if (!latestYear) throw new Error("No year found in VIC crime data");
    log(SOURCE_ID, `processing year ${latestYear}`);

    // Group by suburb + postcode (latest year only)
    const grouped = new Map<string, { total: number; breakdown: Record<string, number>; lga: string }>();

    for (const row of rows) {
      const year = String(row["Year"] ?? row["year"] ?? "").trim();
      if (year !== latestYear) continue;

      const suburb   = String(row["Suburb/Town Name"] ?? row["Suburb"] ?? row["suburb"] ?? "").trim();
      const postcode = String(row["Postcode"] ?? row["postcode"] ?? "").trim();
      const lga      = String(row["Local Government Area"] ?? row["LGA"] ?? "").trim();
      if (!suburb) continue;

      // Handle both "Incidents Recorded" and "Offence Count" (format varies by file)
      const incidents =
        parseInt(String(row["Incidents Recorded"] ?? row["Offence Count"] ?? row["incidents_recorded"] ?? "0")) || 0;
      const division = String(row["Offence Division"] ?? row["Offence"] ?? "Other").trim();

      const key = `${suburb}|${postcode}`;
      const existing = grouped.get(key) ?? { total: 0, breakdown: {}, lga };
      existing.total += incidents;
      if (division && incidents > 0) {
        existing.breakdown[division] = (existing.breakdown[division] ?? 0) + incidents;
      }
      grouped.set(key, existing);
    }

    log(SOURCE_ID, `grouped ${grouped.size} suburb entries`);

    const periodDate = new Date(`${latestYear}-12-01`);
    const records: CrimeRecord[] = [];

    for (const [key, data] of grouped) {
      const [suburbName, postcode] = key.split("|");
      const suburbSlug = await resolveSlug(suburbName, "VIC", postcode);
      records.push({
        suburbName,
        suburbSlug,
        postcode:        postcode || null,
        lga:             data.lga || null,
        state:           "VIC",
        period:          latestYear,
        periodDate,
        totalOffences:   data.total,
        offenceBreakdown: data.breakdown,
        source:          SOURCE_ID,
      });
    }

    const count = await batchUpsertCrime(records);

    await prisma.suburb.updateMany({
      where: { state: "VIC" },
      data:  { crimeUpdatedAt: new Date() },
    });

    await finishSync(SOURCE_ID, count, periodDate);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
