/**
 * WA Crime Stats Sync (WA Police Force)
 *
 * Downloads the time-series XLSX from wa.gov.au and aggregates by Police
 * District for the most recent financial year. WA Police migrated their
 * publication in Oct 2024 — the new XLSX no longer carries suburb-level
 * data; only district + region levels are published.
 *
 * Records are stored with suburbSlug=null + lga="<District> District"
 * so they can be picked up by the LGA-fallback rendering on suburb pages
 * once a WA-LGA → WA-Police-District mapping is added (open follow-up).
 *
 * Data source page: https://www.wa.gov.au/organisation/western-australia-police-force/crime-statistics
 * XLSX direct URL:  https://www.wa.gov.au/media/48429/download?inline (15 MB)
 * Schedule:         Annual
 */
import "dotenv/config";
import * as XLSX from "xlsx";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import { batchUpsertCrime, type CrimeRecord } from "../crime-batch";

const SOURCE_ID = "crime-wa";
// Allow override via env var if WA Police migrate again.
const XLSX_URL =
  process.env.WA_CRIME_EXCEL_URL ??
  "https://www.wa.gov.au/media/48429/download?inline";

interface WaDataRow {
  "Website Region":         string; // e.g. "ARMADALE DISTRICT"
  WAPOL_Hierarchy_Lvl1:     string; // e.g. "Murder"
  WAPOL_Hierarchy_Lvl2:     string; // e.g. "Homicide"
  Year:                     string; // e.g. "2024-25"
  Count:                    number | string;
  [key: string]: string | number;
}

/** "ARMADALE DISTRICT" → "Armadale" (drop the trailing word, title-case) */
function normaliseDistrictLabel(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+district$|\s+region$/i, "")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    log(SOURCE_ID, `downloading from ${XLSX_URL}`);
    const res = await fetch(XLSX_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching WA crime XLSX`);

    const buffer = Buffer.from(await res.arrayBuffer());
    const wb = XLSX.read(buffer, { type: "buffer" });
    const ws = wb.Sheets["Data"];
    if (!ws) throw new Error(`"Data" sheet missing in WA crime XLSX. Sheets: ${wb.SheetNames.join(", ")}`);
    const rows = XLSX.utils.sheet_to_json<WaDataRow>(ws, { defval: "" });
    log(SOURCE_ID, `parsed ${rows.length} rows`);

    // Latest financial-year string in the data, e.g. "2024-25". Sort by start year.
    const yearSet = new Set<string>();
    for (const row of rows) {
      const y = String(row.Year ?? "").trim();
      if (/^\d{4}-\d{2}$/.test(y)) yearSet.add(y);
    }
    const sortedYears = [...yearSet].sort((a, b) => parseInt(a.slice(0, 4)) - parseInt(b.slice(0, 4)));
    const latestYear = sortedYears.at(-1);
    if (!latestYear) throw new Error("No FY year found in WA crime data");
    log(SOURCE_ID, `processing year ${latestYear} (${sortedYears.length} years in dataset)`);

    // Group by (district + year), sum counts, breakdown by Lvl1 offence.
    const grouped = new Map<string, { total: number; breakdown: Record<string, number> }>();
    for (const row of rows) {
      const district = String(row["Website Region"] ?? "").trim();
      const year = String(row.Year ?? "").trim();
      if (year !== latestYear || !district) continue;
      // Skip aggregate rows ("Western Australia", "Metropolitan Region",
      // "Regional WA Region") — keep the District-level granularity only.
      if (!/district$/i.test(district)) continue;

      const lvl1 = String(row.WAPOL_Hierarchy_Lvl1 ?? "").trim() || "Other";
      const count = typeof row.Count === "number" ? row.Count : parseInt(String(row.Count ?? "0"), 10) || 0;
      if (count <= 0) continue;

      const existing = grouped.get(district) ?? { total: 0, breakdown: {} };
      existing.total += count;
      existing.breakdown[lvl1] = (existing.breakdown[lvl1] ?? 0) + count;
      grouped.set(district, existing);
    }

    // FY-end date: "2024-25" → 2025-06-30
    const fyEndYear = parseInt(latestYear.slice(0, 4)) + 1;
    const periodDate = new Date(`${fyEndYear}-06-30`);

    const records: CrimeRecord[] = [];
    for (const [district, agg] of grouped) {
      const label = normaliseDistrictLabel(district);
      records.push({
        suburbSlug:       null,
        suburbName:       label,
        lga:              label,
        state:            "WA",
        period:           latestYear,
        periodDate,
        totalOffences:    agg.total,
        offenceBreakdown: agg.breakdown,
        source:           SOURCE_ID,
      });
    }

    const count = await batchUpsertCrime(records);

    await prisma.suburb.updateMany({
      where: { state: "WA" },
      data: { statsUpdatedAt: new Date(), crimeUpdatedAt: new Date() },
    });

    log(SOURCE_ID, `wrote ${count} district-level rows for FY ${latestYear}`);
    await finishSync(SOURCE_ID, count, periodDate);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
