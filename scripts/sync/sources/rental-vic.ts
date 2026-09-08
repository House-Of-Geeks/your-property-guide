/**
 * VIC Rental Data Sync (DFFH Rental Report: moving annual rents by suburb)
 *
 * The workbook has one sheet per dwelling type ("1 bedroom flat" …
 * "4 bedroom house", "All properties"); each sheet lists DFFH suburb groups
 * with a Count/Median pair per quarter. Medians are moving annual (the
 * twelve months to the quarter). DFFH groups small suburbs for sample size
 * ("Albert Park-Middle Park-West St Kilda"); the feed splits a group into
 * its component suburbs, all sharing the group's medians.
 *
 * What it writes (rules in rental-vic-rules.ts, tested):
 *   - house rent = 3-bedroom house (then 4, then 2); unit rent = 2-bedroom
 *     flat (then 1, then 3-bedroom flat); never the all-properties median
 *   - one SuburbRentalStat row per matched suburb per quarter for the last
 *     twenty quarters in the workbook (--quarters N to change), with the
 *     bedroom medians alongside; medians are moving annual, so each row is
 *     the twelve months to that quarter
 *   - Suburb.medianRentHouse / medianRentUnit for those suburbs (0 where the
 *     group has no figure), rentalUpdatedAt and updatedAt stamped
 *   - legacy rows from the single-sheet version of this feed (no postcode,
 *     source rental-vic) deleted: they held the all-properties median as the
 *     house rent and won ties on the page for 77 suburbs (7 Sep 2026)
 *
 * Download: the data.vic.gov.au CKAN package first, then the DFFH direct
 * URLs for recent quarters (the CKAN call failed on the 1 July 2026 cron).
 *
 * Flags:  --dry-run  parse, plan and print; no writes
 *         --file <path>  use a downloaded workbook instead of fetching
 *         --quarters <n>  quarters of history to write (default 20)
 * Source: https://discover.data.vic.gov.au/dataset/rental-report
 * Schedule: Quarterly
 */
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import * as XLSX from "xlsx";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import { getCkanDownloadUrl } from "../ckan";
import {
  SHEETS,
  candidateVicUrls,
  findPopulatedQuarters,
  parseMedian,
  pickHouseRent,
  pickUnitRent,
  splitGroupName,
  type GroupMedians,
  type SheetKey,
} from "./rental-vic-rules";

const SOURCE_ID = "rental-vic";
const CKAN_BASE = "https://discover.data.vic.gov.au";
const PACKAGE_ID = "rental-report-quarterly-moving-annual-rents-by-suburb";
const USER_AGENT = "Mozilla/5.0 (compatible; YourPropertyGuide data sync; +https://yourpropertyguide.com.au)";
const SAMPLE_SLUGS = ["toorak-vic-3142", "brighton-vic-3186", "kew-vic-3101", "south-yarra-vic-3141", "armadale-vic-3143", "werribee-vic-3030", "ballarat-central-vic-3350"];
const DEFAULT_QUARTERS = 20;
const UPSERT_CHUNK = 1000;

async function fetchWorkbook(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, { headers: { "user-agent": USER_AGENT }, signal: AbortSignal.timeout(120_000) });
    if (!res.ok) return null;
    if ((res.headers.get("content-type") ?? "").includes("text/html")) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

async function locateWorkbook(): Promise<{ buffer: Buffer; url: string }> {
  try {
    const url = await getCkanDownloadUrl(PACKAGE_ID, CKAN_BASE, "XLSX");
    const buffer = await fetchWorkbook(url);
    if (buffer) return { buffer, url };
    log(SOURCE_ID, `CKAN resource did not yield a workbook: ${url}`);
  } catch (err) {
    log(SOURCE_ID, `CKAN lookup failed: ${(err as Error).message}`);
  }
  for (const url of candidateVicUrls(new Date())) {
    const buffer = await fetchWorkbook(url);
    if (buffer) return { buffer, url };
  }
  throw new Error("Could not download the DFFH moving-annual-rents workbook");
}

interface Quarter { period: string; periodDate: Date }

/** Per quarter (newest first), the group → median map for one sheet. */
function parseSheet(ws: XLSX.WorkSheet, quarters: number): { quarters: Quarter[]; medians: Map<string, Map<string, number>> } {
  const raw = XLSX.utils.sheet_to_json<(string | number)[]>(ws, { header: 1, defval: "" });
  const cols = findPopulatedQuarters(raw, quarters);
  const medians = new Map<string, Map<string, number>>();
  for (const q of cols) {
    const m = new Map<string, number>();
    for (let i = 3; i < raw.length; i++) {
      const name = String(raw[i][1] ?? "").trim();
      if (!name || name.toLowerCase().startsWith("group total")) continue;
      const median = parseMedian(raw[i][q.col]);
      if (median !== null) m.set(name, median);
    }
    medians.set(q.period, m);
  }
  return { quarters: cols.map((q) => ({ period: q.period, periodDate: q.periodDate })), medians };
}

interface PlannedRow {
  id: string;
  slug: string;
  name: string;
  postcode: string;
  group: string;
  period: string;
  periodDate: Date;
  house: number; // 0 = the group has no house figure
  unit: number;
  bed3: number | null;
  bed2: number | null;
  bed1: number | null;
}

export async function run(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const fileArg = args.indexOf("--file") >= 0 ? args[args.indexOf("--file") + 1] : null;
  const quarters = args.indexOf("--quarters") >= 0 ? Math.max(1, parseInt(args[args.indexOf("--quarters") + 1], 10) || DEFAULT_QUARTERS) : DEFAULT_QUARTERS;

  if (!dryRun) await startSync(SOURCE_ID);
  try {
    const { buffer, url } = fileArg ? { buffer: readFileSync(fileArg), url: fileArg } : await locateWorkbook();
    log(SOURCE_ID, `workbook: ${url}`);
    const wb = XLSX.read(buffer, { type: "buffer" });

    // perSheet[key] = period → (group → median); allQuarters = every period seen, newest first
    const perSheet = {} as Record<SheetKey, Map<string, Map<string, number>>>;
    const quarterByPeriod = new Map<string, Quarter>();
    for (const [sheetName, key] of Object.entries(SHEETS)) {
      const ws = wb.Sheets[sheetName];
      if (!ws) { log(SOURCE_ID, `sheet "${sheetName}" missing`); perSheet[key] = new Map(); continue; }
      const parsed = parseSheet(ws, quarters);
      perSheet[key] = parsed.medians;
      for (const q of parsed.quarters) quarterByPeriod.set(q.period, q);
      log(SOURCE_ID, `sheet "${sheetName}": ${parsed.quarters.length} quarters, latest ${parsed.quarters[0]?.period ?? "none"} (${parsed.medians.get(parsed.quarters[0]?.period ?? "")?.size ?? 0} groups)`);
    }
    const allQuarters = [...quarterByPeriod.values()].sort((a, b) => b.periodDate.getTime() - a.periodDate.getTime());
    const latest = allQuarters[0];
    if (!latest) throw new Error("No quarter data found in any sheet");

    const suburbs = await prisma.suburb.findMany({ where: { state: "VIC" }, select: { id: true, slug: true, name: true, postcode: true } });
    const byName = new Map(suburbs.map((s) => [s.name.trim().toLowerCase(), s]));

    const groups = new Set<string>();
    for (const m of Object.values(perSheet)) for (const byPeriod of m.values()) for (const g of byPeriod.keys()) groups.add(g);

    // One row per (suburb, quarter). The suburb's group is fixed by the
    // newest quarter it appears in ("first group wins" for a suburb that
    // sits in two groups), then every quarter with a house or unit figure
    // for that group becomes a row.
    const plan: PlannedRow[] = [];
    const seen = new Set<string>();
    let unmatchedGroups = 0;
    for (const group of groups) {
      const direct = byName.get(group.trim().toLowerCase());
      const members = direct ? [direct] : splitGroupName(group).map((n) => byName.get(n.toLowerCase())).filter((s): s is typeof suburbs[number] => Boolean(s));
      if (members.length === 0) { unmatchedGroups++; continue; }
      const rowsForGroup: Omit<PlannedRow, "id" | "slug" | "name" | "postcode">[] = [];
      for (const q of allQuarters) {
        const m: GroupMedians = {};
        for (const key of Object.keys(perSheet) as SheetKey[]) { const v = perSheet[key].get(q.period)?.get(group); if (v !== undefined) m[key] = v; }
        const house = pickHouseRent(m), unit = pickUnitRent(m);
        if (house === null && unit === null) continue;
        rowsForGroup.push({ group, period: q.period, periodDate: q.periodDate, house: house ?? 0, unit: unit ?? 0, bed3: m["3bed_house"] ?? m["3bed_flat"] ?? null, bed2: m["2bed_flat"] ?? m["2bed_house"] ?? null, bed1: m["1bed_flat"] ?? null });
      }
      if (rowsForGroup.length === 0) continue;
      for (const s of members) {
        if (seen.has(s.slug)) continue;
        seen.add(s.slug);
        for (const r of rowsForGroup) plan.push({ id: s.id, slug: s.slug, name: s.name, postcode: s.postcode, ...r });
      }
    }
    const latestRows = plan.filter((r) => r.period === latest.period);
    const legacy = await prisma.suburbRentalStat.count({ where: { state: "VIC", source: SOURCE_ID, postcode: "" } });
    log(SOURCE_ID, `plan: ${allQuarters.length} quarters ${allQuarters[allQuarters.length - 1]?.period} to ${latest.period}; ${groups.size} groups, ${unmatchedGroups} with no suburb match; ${seen.size} suburbs, ${plan.length} rows (latest quarter: ${latestRows.length} suburbs, house unknown for ${latestRows.filter((r) => r.house === 0).length}, unit unknown for ${latestRows.filter((r) => r.unit === 0).length}); ${legacy} legacy single-sheet rows to delete`);
    for (const slug of SAMPLE_SLUGS) {
      const rs = plan.filter((x) => x.slug === slug);
      const r = rs[0];
      log(SOURCE_ID, `  ${slug}: ${r ? `${rs.length} quarters; ${latest.period} house $${r.house || "unknown"}, unit $${r.unit || "unknown"} (group "${r.group}"); oldest ${rs[rs.length - 1].period} house $${rs[rs.length - 1].house || "unknown"}` : "not covered"}`);
    }
    if (dryRun) { log(SOURCE_ID, "dry run: no writes"); return; }

    // One bulk upsert per chunk (UNNEST + ON CONFLICT), as the NSW feed does:
    // Prisma transactions of many upserts time out over the Railway proxy.
    for (let i = 0; i < plan.length; i += UPSERT_CHUNK) {
      const chunk = plan.slice(i, i + UPSERT_CHUNK);
      await prisma.$executeRaw`
        INSERT INTO "SuburbRentalStat"
          (id, "suburbSlug", "suburbName", postcode, state, period, "periodDate",
           "medianRentHouse", "medianRentUnit", "medianRent3Bed", "medianRent2Bed", "medianRent1Bed", source, "createdAt", "updatedAt")
        SELECT u.id, u.slug, u.name, u.postcode, 'VIC', u.period, u.period_date,
               NULLIF(u.house, 0), NULLIF(u.unit, 0), u.bed3, u.bed2, u.bed1, ${SOURCE_ID}, NOW(), NOW()
        FROM UNNEST(
          ${chunk.map(() => randomUUID())}::text[],
          ${chunk.map((r) => r.slug)}::text[],
          ${chunk.map((r) => r.name)}::text[],
          ${chunk.map((r) => r.postcode)}::text[],
          ${chunk.map((r) => r.period)}::text[],
          ${chunk.map((r) => r.periodDate)}::timestamptz[],
          ${chunk.map((r) => r.house)}::int[],
          ${chunk.map((r) => r.unit)}::int[],
          ${chunk.map((r) => r.bed3)}::int[],
          ${chunk.map((r) => r.bed2)}::int[],
          ${chunk.map((r) => r.bed1)}::int[]
        ) AS u(id, slug, name, postcode, period, period_date, house, unit, bed3, bed2, bed1)
        ON CONFLICT ("suburbName", postcode, state, period) DO UPDATE SET
          "suburbSlug"      = EXCLUDED."suburbSlug",
          "periodDate"      = EXCLUDED."periodDate",
          "medianRentHouse" = EXCLUDED."medianRentHouse",
          "medianRentUnit"  = EXCLUDED."medianRentUnit",
          "medianRent3Bed"  = EXCLUDED."medianRent3Bed",
          "medianRent2Bed"  = EXCLUDED."medianRent2Bed",
          "medianRent1Bed"  = EXCLUDED."medianRent1Bed",
          source            = EXCLUDED.source,
          "updatedAt"       = NOW()
      `;
      log(SOURCE_ID, `  rental rows ${Math.min(i + UPSERT_CHUNK, plan.length)}/${plan.length}`);
    }

    if (latestRows.length > 0) {
      // Rent has its own timestamp; statsUpdatedAt belongs to the sales feeds.
      // Prisma's @updatedAt is not touched by raw SQL, and the suburbs sitemap
      // lastmod, revalidate-paths and the IndexNow ping key on it.
      await prisma.$executeRaw`
        UPDATE "Suburb" AS s
        SET "medianRentHouse" = u.rent_house,
            "medianRentUnit"  = u.rent_unit,
            "rentalUpdatedAt" = NOW(),
            "updatedAt"       = NOW()
        FROM UNNEST(${latestRows.map((r) => r.id)}::text[], ${latestRows.map((r) => r.house)}::int[], ${latestRows.map((r) => r.unit)}::int[]) AS u(id, rent_house, rent_unit)
        WHERE s.id = u.id
      `;
      log(SOURCE_ID, `updated ${latestRows.length} Suburb rows from ${latest.period}`);
    }

    if (legacy > 0) {
      const deleted = await prisma.suburbRentalStat.deleteMany({ where: { state: "VIC", source: SOURCE_ID, postcode: "" } });
      log(SOURCE_ID, `deleted ${deleted.count} legacy single-sheet rows`);
    }

    await finishSync(SOURCE_ID, latestRows.length, latest.periodDate);
  } catch (err) {
    if (!dryRun) await failSync(SOURCE_ID, err);
    throw err;
  }
}
