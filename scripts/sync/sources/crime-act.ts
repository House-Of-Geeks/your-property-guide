/**
 * ACT Crime Stats Sync (ACT Policing)
 *
 * Downloads suburb-level crime data from data.act.gov.au.
 * XLSX format: one sheet per district (Belconnen, Gungahlin, etc.)
 *
 * Sheet structure (repeating sections per offence category):
 *   Row 0: title "District - Offences and other activities by Suburb"
 *   Row 1: "PROMIS as at DATE"
 *   Row 2: blank
 *   Row 3: offence category name in col[0], rest empty
 *   Row 4: quarter headers — col[0] empty, col[1..] = "YYYY Qn Mon-Mon"
 *   Row 5+: suburb data — col[0] = suburb name, col[1..] = integer counts
 *   (next offence section follows after blank rows or directly)
 *
 * Processes only the most recent calendar year in the dataset.
 *
 * Data source: https://www.data.act.gov.au/download/2egm-dieb/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
 * Schedule: Quarterly
 */
import "dotenv/config";
import * as XLSX from "xlsx";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import { resolveSlug } from "../slug-matcher";
import { batchUpsertCrime, type CrimeRecord } from "../crime-batch";

const SOURCE_ID = "crime-act";
const XLSX_URL =
  process.env.ACT_CRIME_XLSX_URL ??
  "https://www.data.act.gov.au/download/2egm-dieb/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

type RawRow = (string | number | null | undefined)[];

/** Extract the calendar year from a quarter label like "2024 Q3 Jul-Sep" → 2024. */
function quarterYear(label: string): number | null {
  const m = String(label).match(/^(\d{4})\s+Q/);
  return m ? parseInt(m[1]) : null;
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    log(SOURCE_ID, `downloading from ${XLSX_URL}`);
    const res = await fetch(XLSX_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status} downloading ACT crime XLSX`);

    const buffer = Buffer.from(await res.arrayBuffer());
    const wb = XLSX.read(buffer, { type: "buffer" });
    log(SOURCE_ID, `sheets: ${wb.SheetNames.join(", ")}`);

    // ── Pass 1: find the latest year across all sheets ──────────────────────
    let latestYear = 0;

    for (const sheetName of wb.SheetNames) {
      const ws = wb.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<RawRow>(ws, { header: 1, defval: "" });
      for (const row of rows) {
        // Quarter header row: col[0] is empty, col[1] looks like "YYYY Qn ..."
        if (!row[0] && row[1]) {
          for (let i = 1; i < row.length; i++) {
            const yr = quarterYear(String(row[i] ?? ""));
            if (yr && yr > latestYear) latestYear = yr;
          }
        }
      }
    }

    if (!latestYear) throw new Error("Could not find year in ACT crime XLSX");
    log(SOURCE_ID, `latest year in dataset: ${latestYear}`);

    // ── Pass 2: collect suburb totals for latestYear ─────────────────────────
    // suburb → { total, breakdown }
    const grouped = new Map<string, { total: number; breakdown: Record<string, number> }>();

    for (const sheetName of wb.SheetNames) {
      const ws = wb.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<RawRow>(ws, { header: 1, defval: "" });

      let currentOffence = "Other";
      // Indices into the row array that correspond to latestYear quarters
      let yearColIndices: number[] = [];

      for (const row of rows) {
        const col0 = String(row[0] ?? "").trim();
        const col1 = row[1];

        // Quarter header row: col[0] is empty, col[1] is a "YYYY Qn ..." string
        if (!col0 && typeof col1 === "string" && quarterYear(col1) !== null) {
          yearColIndices = [];
          for (let i = 1; i < row.length; i++) {
            const yr = quarterYear(String(row[i] ?? ""));
            if (yr === latestYear) yearColIndices.push(i);
          }
          continue;
        }

        // Offence category header: col[0] is non-empty string, col[1] is empty/falsy
        // Exclude title rows that contain "Offences and other activities" or "PROMIS"
        if (
          col0 &&
          !col1 &&
          !col0.includes("Offences and other activities") &&
          !col0.startsWith("PROMIS")
        ) {
          currentOffence = col0;
          continue;
        }

        // Data row: col[0] is a suburb name (all caps string), yearColIndices set
        if (col0 && /^[A-Z\s'/-]+$/.test(col0) && yearColIndices.length > 0) {
          let rowTotal = 0;
          for (const idx of yearColIndices) {
            rowTotal += (typeof row[idx] === "number" ? row[idx] : parseInt(String(row[idx] ?? "0"))) || 0;
          }
          if (rowTotal === 0) continue;

          const suburb = col0;
          const existing = grouped.get(suburb) ?? { total: 0, breakdown: {} };
          existing.total += rowTotal;
          existing.breakdown[currentOffence] = (existing.breakdown[currentOffence] ?? 0) + rowTotal;
          grouped.set(suburb, existing);
        }
      }
    }

    log(SOURCE_ID, `grouped ${grouped.size} suburbs`);

    const period = String(latestYear);
    const periodDate = new Date(`${latestYear}-12-31`);
    const records: CrimeRecord[] = [];

    for (const [suburbName, data] of grouped) {
      const suburbSlug = await resolveSlug(suburbName, "ACT", "");
      records.push({
        suburbSlug,
        suburbName,
        state:           "ACT",
        period,
        periodDate,
        totalOffences:   data.total,
        offenceBreakdown: data.breakdown,
        source:          SOURCE_ID,
      });
    }

    const count = await batchUpsertCrime(records);

    await prisma.suburb.updateMany({
      where: { state: "ACT" },
      data: { crimeUpdatedAt: new Date() },
    });

    await finishSync(SOURCE_ID, count, periodDate);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
