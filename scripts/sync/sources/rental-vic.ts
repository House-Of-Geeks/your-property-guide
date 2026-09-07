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
 *   - one SuburbRentalStat row per matched suburb for the latest quarter,
 *     with the bedroom medians alongside
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
 * Source: https://discover.data.vic.gov.au/dataset/rental-report
 * Schedule: Quarterly
 */
import "dotenv/config";
import { readFileSync } from "node:fs";
import * as XLSX from "xlsx";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import { getCkanDownloadUrl } from "../ckan";
import {
  SHEETS,
  candidateVicUrls,
  findLatestPopulatedQuarter,
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

function parseSheet(ws: XLSX.WorkSheet): { quarter: { period: string; periodDate: Date } | null; medians: Map<string, number> } {
  const raw = XLSX.utils.sheet_to_json<(string | number)[]>(ws, { header: 1, defval: "" });
  const found = findLatestPopulatedQuarter(raw);
  const medians = new Map<string, number>();
  if (!found) return { quarter: null, medians };
  for (let i = 3; i < raw.length; i++) {
    const name = String(raw[i][1] ?? "").trim();
    if (!name || name.toLowerCase().startsWith("group total")) continue;
    const median = parseMedian(raw[i][found.col]);
    if (median !== null) medians.set(name, median);
  }
  return { quarter: { period: found.period, periodDate: found.periodDate }, medians };
}

interface PlannedRow {
  id: string;
  slug: string;
  name: string;
  postcode: string;
  group: string;
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

  if (!dryRun) await startSync(SOURCE_ID);
  try {
    const { buffer, url } = fileArg ? { buffer: readFileSync(fileArg), url: fileArg } : await locateWorkbook();
    log(SOURCE_ID, `workbook: ${url}`);
    const wb = XLSX.read(buffer, { type: "buffer" });

    const perSheet = {} as Record<SheetKey, Map<string, number>>;
    let latest: { period: string; periodDate: Date } | null = null;
    for (const [sheetName, key] of Object.entries(SHEETS)) {
      const ws = wb.Sheets[sheetName];
      if (!ws) { log(SOURCE_ID, `sheet "${sheetName}" missing`); perSheet[key] = new Map(); continue; }
      const { quarter, medians } = parseSheet(ws);
      perSheet[key] = medians;
      if (quarter && (!latest || quarter.periodDate > latest.periodDate)) latest = quarter;
      log(SOURCE_ID, `sheet "${sheetName}": ${medians.size} groups, latest ${quarter?.period ?? "none"}`);
    }
    if (!latest) throw new Error("No quarter data found in any sheet");

    const suburbs = await prisma.suburb.findMany({ where: { state: "VIC" }, select: { id: true, slug: true, name: true, postcode: true } });
    const byName = new Map(suburbs.map((s) => [s.name.trim().toLowerCase(), s]));

    const groups = new Set<string>();
    for (const m of Object.values(perSheet)) for (const g of m.keys()) groups.add(g);

    const plan: PlannedRow[] = [];
    const seen = new Set<string>();
    let unmatchedGroups = 0;
    for (const group of groups) {
      const direct = byName.get(group.trim().toLowerCase());
      const members = direct ? [direct] : splitGroupName(group).map((n) => byName.get(n.toLowerCase())).filter((s): s is typeof suburbs[number] => Boolean(s));
      if (members.length === 0) { unmatchedGroups++; continue; }
      const m: GroupMedians = {};
      for (const key of Object.keys(perSheet) as SheetKey[]) { const v = perSheet[key].get(group); if (v !== undefined) m[key] = v; }
      const house = pickHouseRent(m), unit = pickUnitRent(m);
      if (house === null && unit === null) continue;
      for (const s of members) {
        if (seen.has(s.slug)) continue; // first group wins for a suburb that appears in two groups
        seen.add(s.slug);
        plan.push({ id: s.id, slug: s.slug, name: s.name, postcode: s.postcode, group, house: house ?? 0, unit: unit ?? 0, bed3: m["3bed_house"] ?? m["3bed_flat"] ?? null, bed2: m["2bed_flat"] ?? m["2bed_house"] ?? null, bed1: m["1bed_flat"] ?? null });
      }
    }
    const legacy = await prisma.suburbRentalStat.count({ where: { state: "VIC", source: SOURCE_ID, postcode: "" } });
    log(SOURCE_ID, `plan: ${latest.period}; ${groups.size} groups, ${unmatchedGroups} with no suburb match; ${plan.length} suburbs (house unknown for ${plan.filter((r) => r.house === 0).length}, unit unknown for ${plan.filter((r) => r.unit === 0).length}); ${legacy} legacy single-sheet rows to delete`);
    for (const slug of SAMPLE_SLUGS) {
      const r = plan.find((x) => x.slug === slug);
      log(SOURCE_ID, `  ${slug}: ${r ? `house $${r.house || "unknown"}, unit $${r.unit || "unknown"} (group "${r.group}")` : "not covered"}`);
    }
    if (dryRun) { log(SOURCE_ID, "dry run: no writes"); return; }

    for (const r of plan) {
      await prisma.suburbRentalStat.upsert({
        where: { suburbName_postcode_state_period: { suburbName: r.name, postcode: r.postcode, state: "VIC", period: latest.period } },
        create: { suburbSlug: r.slug, suburbName: r.name, postcode: r.postcode, state: "VIC", period: latest.period, periodDate: latest.periodDate, medianRentHouse: r.house || null, medianRentUnit: r.unit || null, medianRent3Bed: r.bed3, medianRent2Bed: r.bed2, medianRent1Bed: r.bed1, source: SOURCE_ID },
        update: { suburbSlug: r.slug, periodDate: latest.periodDate, medianRentHouse: r.house || null, medianRentUnit: r.unit || null, medianRent3Bed: r.bed3, medianRent2Bed: r.bed2, medianRent1Bed: r.bed1, source: SOURCE_ID },
      });
    }
    log(SOURCE_ID, `wrote ${plan.length} SuburbRentalStat rows`);

    if (plan.length > 0) {
      // Rent has its own timestamp; statsUpdatedAt belongs to the sales feeds.
      // Prisma's @updatedAt is not touched by raw SQL, and the suburbs sitemap
      // lastmod, revalidate-paths and the IndexNow ping key on it.
      await prisma.$executeRaw`
        UPDATE "Suburb" AS s
        SET "medianRentHouse" = u.rent_house,
            "medianRentUnit"  = u.rent_unit,
            "rentalUpdatedAt" = NOW(),
            "updatedAt"       = NOW()
        FROM UNNEST(${plan.map((r) => r.id)}::text[], ${plan.map((r) => r.house)}::int[], ${plan.map((r) => r.unit)}::int[]) AS u(id, rent_house, rent_unit)
        WHERE s.id = u.id
      `;
      log(SOURCE_ID, `updated ${plan.length} Suburb rows`);
    }

    if (legacy > 0) {
      const deleted = await prisma.suburbRentalStat.deleteMany({ where: { state: "VIC", source: SOURCE_ID, postcode: "" } });
      log(SOURCE_ID, `deleted ${deleted.count} legacy single-sheet rows`);
    }

    await finishSync(SOURCE_ID, plan.length, latest.periodDate);
  } catch (err) {
    if (!dryRun) await failSync(SOURCE_ID, err);
    throw err;
  }
}
