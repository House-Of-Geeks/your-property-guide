/**
 * VIC Rental Data Sync (DFFH "Rental Report — Quarterly: Moving Annual Rents by Suburb")
 *
 * The XLSX has one sheet per dwelling type:
 *   "1 bedroom flat", "2 bedroom flat", "3 bedroom flat",
 *   "2 bedroom house", "3 bedroom house", "4 bedroom house",
 *   "All properties"
 *
 * Each sheet is identical structure:
 *   Row 0: title
 *   Row 1: quarter labels (pairs — Count, Median per quarter)
 *   Row 2: "Count" / "Median" labels
 *   Row 3+: Region | Suburb name | [Count, Median × quarter] ...
 *
 * DFFH groups suburbs into multi-suburb regions for sample-size reasons,
 * e.g. "Werribee-Hoppers Crossing", "Albert Park-Middle Park-West St Kilda".
 * We split on "-" and write a row per component suburb, all sharing the
 * group's medians (mirroring how Domain treats this data).
 *
 * Source: https://discover.data.vic.gov.au/dataset/rental-report
 * Schedule: Quarterly
 */
import "dotenv/config";
import * as XLSX from "xlsx";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import { getCkanDownloadUrl } from "../ckan";

const SOURCE_ID = "rental-vic";
const CKAN_BASE = "https://discover.data.vic.gov.au";
const PACKAGE_ID = "rental-report-quarterly-moving-annual-rents-by-suburb";

const QUARTER_MAP: Record<string, string> = {
  Mar: "Q1", Jun: "Q2", Sep: "Q3", Dec: "Q4",
};
const MONTH_NUM: Record<string, number> = {
  Mar: 3, Jun: 6, Sep: 9, Dec: 12,
};

const SHEETS = {
  "1 bedroom flat":  "1bed_flat",
  "2 bedroom flat":  "2bed_flat",
  "3 bedroom flat":  "3bed_flat",
  "2 bedroom house": "2bed_house",
  "3 bedroom house": "3bed_house",
  "4 bedroom house": "4bed_house",
  "All properties":  "all",
} as const;

type DwellingKey = (typeof SHEETS)[keyof typeof SHEETS];

interface QuarterInfo { period: string; periodDate: Date; col: number }

function parseQuarterLabel(label: string): { period: string; periodDate: Date } | null {
  const m = String(label).trim().match(/^(Mar|Jun|Sep|Dec)\s+(\d{4})$/);
  if (!m) return null;
  const [, mon, year] = m;
  return {
    period:     `${year}-${QUARTER_MAP[mon]}`,
    periodDate: new Date(`${year}-${String(MONTH_NUM[mon]).padStart(2, "0")}-01`),
  };
}

/** Find the most recent quarter that has actual data (not the empty future-quarter columns). */
function findLatestPopulatedQuarter(raw: (string | number)[][]): QuarterInfo | null {
  const quarterRow = raw[1] as (string | number)[];
  const labelRow   = raw[2] as (string | number)[];

  for (let c = quarterRow.length - 1; c >= 2; c--) {
    const parsed = parseQuarterLabel(String(quarterRow[c]));
    if (!parsed) continue;
    const lbl = String(labelRow[c]).trim().toLowerCase();
    const medianCol = lbl === "median" ? c : (lbl === "count" && String(labelRow[c + 1]).trim().toLowerCase() === "median" ? c + 1 : -1);
    if (medianCol < 0) continue;

    // Verify at least one row in this column has a value.
    let hasData = false;
    for (let i = 3; i < raw.length; i++) {
      if (raw[i]?.[medianCol] !== "" && raw[i]?.[medianCol] != null) { hasData = true; break; }
    }
    if (!hasData) continue;
    return { ...parsed, col: medianCol };
  }
  return null;
}

function parseSheet(ws: XLSX.WorkSheet): Map<string, number> {
  const raw = XLSX.utils.sheet_to_json<(string | number)[]>(ws, { header: 1, defval: "" });
  const found = findLatestPopulatedQuarter(raw);
  if (!found) return new Map();
  const out = new Map<string, number>();
  for (let i = 3; i < raw.length; i++) {
    const name = String(raw[i][1] ?? "").trim();
    if (!name || name.toLowerCase().startsWith("group total")) continue;
    const v = raw[i][found.col];
    const median = typeof v === "number" ? v : parseInt(String(v).replace(/,/g, "")) || 0;
    if (median > 0) out.set(name, median);
  }
  return out;
}

/** Load (name → {slug, postcode}) for VIC suburbs. */
async function loadVicSuburbIndex(): Promise<Map<string, { slug: string; postcode: string }>> {
  const rows = await prisma.suburb.findMany({
    where: { state: "VIC" },
    select: { slug: true, name: true, postcode: true },
  });
  const m = new Map<string, { slug: string; postcode: string }>();
  for (const r of rows) m.set(r.name.trim().toLowerCase(), { slug: r.slug, postcode: r.postcode });
  return m;
}

/** Split DFFH group name into component suburbs. "Werribee-Hoppers Crossing" → ["Werribee", "Hoppers Crossing"]. */
function splitGroupName(raw: string): string[] {
  const trimmed = raw.trim();
  // Some entries use "/" or " - " etc; normalise to single delimiter then split.
  const parts = trimmed.split(/\s*-\s*|\s*\/\s*/).map((s) => s.trim()).filter(Boolean);
  return parts.length > 0 ? parts : [trimmed];
}

/** Resolve a name (single suburb or group) to a list of {slug, name, postcode}. Skips components we can't match. */
function resolveComponents(
  rawName: string,
  index: Map<string, { slug: string; postcode: string }>
): Array<{ slug: string; name: string; postcode: string }> {
  // Try the full name first (handles "Hoppers Crossing", "Albert Park" etc.)
  const direct = index.get(rawName.trim().toLowerCase());
  if (direct) return [{ slug: direct.slug, name: rawName.trim(), postcode: direct.postcode }];

  // Fall back to splitting groups.
  const components = splitGroupName(rawName);
  const out: Array<{ slug: string; name: string; postcode: string }> = [];
  for (const c of components) {
    const hit = index.get(c.toLowerCase());
    if (hit) out.push({ slug: hit.slug, name: c, postcode: hit.postcode });
  }
  return out;
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    const dffhUrl = await getCkanDownloadUrl(PACKAGE_ID, CKAN_BASE, "XLSX");
    log(SOURCE_ID, `downloading from ${dffhUrl}`);

    const res = await fetch(dffhUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status} downloading VIC rental XLSX`);
    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("text/html")) throw new Error(`Got HTML instead of XLSX — redirect failed`);

    const buffer = Buffer.from(await res.arrayBuffer());
    const wb = XLSX.read(buffer, { type: "buffer" });
    log(SOURCE_ID, `sheets: ${wb.SheetNames.join(", ")}`);

    // Per-sheet medians keyed by raw DFFH group name
    const perSheet: Record<DwellingKey, Map<string, number>> = {} as Record<DwellingKey, Map<string, number>>;
    let latestPeriod: { period: string; periodDate: Date } | null = null;

    for (const [sheetName, key] of Object.entries(SHEETS) as Array<[string, DwellingKey]>) {
      const ws = wb.Sheets[sheetName];
      if (!ws) {
        log(SOURCE_ID, `sheet "${sheetName}" missing — skipping`);
        perSheet[key] = new Map();
        continue;
      }
      const raw = XLSX.utils.sheet_to_json<(string | number)[]>(ws, { header: 1, defval: "" });
      const found = findLatestPopulatedQuarter(raw);
      if (!found) {
        log(SOURCE_ID, `sheet "${sheetName}" — no populated quarter found`);
        perSheet[key] = new Map();
        continue;
      }
      if (!latestPeriod) latestPeriod = { period: found.period, periodDate: found.periodDate };
      perSheet[key] = parseSheet(ws);
      log(SOURCE_ID, `sheet "${sheetName}" — latest ${found.period}, ${perSheet[key].size} groups`);
    }

    if (!latestPeriod) throw new Error("No quarter data found in any sheet");

    const index = await loadVicSuburbIndex();
    log(SOURCE_ID, `loaded ${index.size} VIC suburb names from DB`);

    // Aggregate group-level data into per-suburb rows.
    const allGroupNames = new Set<string>();
    for (const m of Object.values(perSheet)) for (const k of m.keys()) allGroupNames.add(k);

    let statsRows = 0;
    let suburbsUpdated = 0;
    const visitedSlugs = new Set<string>();

    for (const groupName of allGroupNames) {
      const components = resolveComponents(groupName, index);
      if (components.length === 0) continue;

      const m1Bed = perSheet["1bed_flat"].get(groupName)  ?? null;
      const m2Bed = perSheet["2bed_flat"].get(groupName)  ?? perSheet["2bed_house"].get(groupName) ?? null;
      const m3Bed = perSheet["3bed_house"].get(groupName) ?? perSheet["3bed_flat"].get(groupName) ?? null;
      const mHouse = perSheet["3bed_house"].get(groupName) ?? perSheet["4bed_house"].get(groupName) ?? perSheet["2bed_house"].get(groupName) ?? perSheet["all"].get(groupName) ?? null;
      const mUnit  = perSheet["2bed_flat"].get(groupName)  ?? perSheet["1bed_flat"].get(groupName)  ?? perSheet["3bed_flat"].get(groupName) ?? perSheet["all"].get(groupName) ?? null;

      for (const comp of components) {
        if (visitedSlugs.has(comp.slug)) continue; // first group wins for shared-suburb cases
        visitedSlugs.add(comp.slug);

        await prisma.suburbRentalStat.upsert({
          where: {
            suburbName_postcode_state_period: {
              suburbName: comp.name,
              postcode:   comp.postcode,
              state:      "VIC",
              period:     latestPeriod.period,
            },
          },
          create: {
            suburbSlug:      comp.slug,
            suburbName:      comp.name,
            postcode:        comp.postcode,
            state:           "VIC",
            period:          latestPeriod.period,
            periodDate:      latestPeriod.periodDate,
            medianRentHouse: mHouse,
            medianRentUnit:  mUnit,
            medianRent3Bed:  m3Bed,
            medianRent2Bed:  m2Bed,
            medianRent1Bed:  m1Bed,
            source:          SOURCE_ID,
          },
          update: {
            suburbSlug:      comp.slug,
            medianRentHouse: mHouse,
            medianRentUnit:  mUnit,
            medianRent3Bed:  m3Bed,
            medianRent2Bed:  m2Bed,
            medianRent1Bed:  m1Bed,
          },
        });
        statsRows++;

        // Write through to canonical Suburb row so the property page (which reads it directly) sees fresh values.
        if (mHouse || mUnit) {
          await prisma.suburb.update({
            where: { slug: comp.slug },
            data: {
              ...(mHouse ? { medianRentHouse: mHouse } : {}),
              ...(mUnit  ? { medianRentUnit:  mUnit  } : {}),
              rentalUpdatedAt: new Date(),
            },
          });
          suburbsUpdated++;
        }
      }
    }

    log(SOURCE_ID, `wrote ${statsRows} SuburbRentalStat rows · ${suburbsUpdated} Suburb rows updated`);
    await finishSync(SOURCE_ID, statsRows, latestPeriod.periodDate);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
