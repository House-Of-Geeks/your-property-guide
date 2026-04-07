/**
 * VIC Crime Stats Sync (Crime Statistics Agency)
 *
 * Downloads suburb-level crime data from the Victorian Crime Statistics Agency
 * via the data.vic.gov.au CKAN API. Data files are direct XLSX downloads.
 *
 * The XLSX workbook sheets:
 *   Contents, Footnotes — skip
 *   Table 01 — LGA total incidents (Year, Year ending, LGA, Incidents Recorded, Rate)
 *   Table 02 — LGA by offence division/subdivision (50k+ rows)
 *   Table 03 — Suburb/Town level with postcode (340k+ rows) ← we use this
 *   Table 04, 05 — other breakdowns
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
import { getCkanDownloadUrl } from "../ckan";

const SOURCE_ID = "crime-vic";
const CKAN_BASE = "https://discover.data.vic.gov.au";
const PACKAGE_ID = "92d47891-3cf8-45eb-9d39-aa7e1db2f478";

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    // Get the most recent LGA-labelled XLSX resource (sorted by created date DESC)
    const xlsxUrl = await getCkanDownloadUrl(PACKAGE_ID, CKAN_BASE, "XLSX", "LGA");
    log(SOURCE_ID, `downloading from ${xlsxUrl}`);

    const res = await fetch(xlsxUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status} downloading VIC crime XLSX`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const wb = XLSX.read(buffer, { type: "buffer" });
    log(SOURCE_ID, `sheets: ${wb.SheetNames.join(", ")}`);

    // Use Table 03 — suburb/town level with postcode
    const sheetName = wb.SheetNames.find((n) => n === "Table 03")
      ?? wb.SheetNames.find((n) => n.toLowerCase().includes("suburb"))
      ?? wb.SheetNames.find((n) => /table\s*0?3/i.test(n))
      ?? wb.SheetNames.find((n) => !/contents|footnote/i.test(n) && n !== "Table 01" && n !== "Table 02");
    if (!sheetName) throw new Error("Could not find suburb-level sheet in VIC crime XLSX");
    log(SOURCE_ID, `using sheet: ${sheetName}`);

    const ws = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, string | number>>(ws, { defval: "" });
    log(SOURCE_ID, `parsed ${rows.length} rows`);

    // Group by suburb + postcode + year (most recent year only)
    // Find the most recent year in the data first
    const yearSet = new Set<string>();
    for (const row of rows) {
      const y = String(row["Year"] ?? row["year"] ?? "").trim();
      if (/^\d{4}$/.test(y)) yearSet.add(y);
    }
    const allYears = [...yearSet].sort();
    const latestYear = allYears[allYears.length - 1];
    if (!latestYear) throw new Error("No year found in VIC crime data");
    log(SOURCE_ID, `processing year ${latestYear}`);

    const grouped = new Map<string, {
      total: number;
      breakdown: Record<string, number>;
      lga: string;
    }>();

    for (const row of rows) {
      const year = String(row["Year"] ?? row["year"] ?? "").trim();
      if (year !== latestYear) continue;

      const suburb   = String(row["Suburb/Town Name"] ?? row["Suburb"] ?? row["suburb"] ?? "").trim();
      const postcode = String(row["Postcode"] ?? row["postcode"] ?? "").trim();
      const lga      = String(row["Local Government Area"] ?? row["LGA"] ?? "").trim();
      if (!suburb) continue;

      const division  = String(row["Offence Division"] ?? row["Offence"] ?? "Other").trim();
      const incidents = parseInt(String(row["Incidents Recorded"] ?? row["incidents_recorded"] ?? "0")) || 0;

      const key = `${suburb}|${postcode}`;
      const existing = grouped.get(key) ?? { total: 0, breakdown: {}, lga };
      existing.total += incidents;
      existing.breakdown[division] = (existing.breakdown[division] ?? 0) + incidents;
      grouped.set(key, existing);
    }

    let count = 0;
    const periodDate = new Date(`${latestYear}-12-01`);
    const latestDate = periodDate;

    for (const [key, data] of grouped) {
      const [suburbName, postcode] = key.split("|");
      const suburbSlug = await resolveSlug(suburbName, "VIC", postcode);

      await prisma.suburbCrimeStat.upsert({
        where: { suburbName_state_period_source: { suburbName, state: "VIC", period: latestYear, source: SOURCE_ID } },
        create: {
          suburbSlug,
          suburbName,
          postcode:         postcode || null,
          lga:              data.lga || null,
          state:            "VIC",
          period:           latestYear,
          periodDate,
          totalOffences:    data.total,
          offenceBreakdown: data.breakdown,
          source: SOURCE_ID,
        },
        update: {
          suburbSlug,
          totalOffences:    data.total,
          offenceBreakdown: data.breakdown,
        },
      });
      count++;
    }

    await prisma.suburb.updateMany({
      where: { state: "VIC" },
      data: { crimeUpdatedAt: new Date() },
    });

    await finishSync(SOURCE_ID, count, latestDate);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
