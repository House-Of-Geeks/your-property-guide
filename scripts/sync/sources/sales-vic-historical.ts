/**
 * VIC Property Sales — Historical Time Series (Land Victoria / DTP)
 *
 * Pulls three CKAN datasets from discover.data.vic.gov.au:
 *   • Median House by Suburb Time Series   — annual ~2013-current
 *   • Median Unit by Suburb Time Series    — annual ~2014-current
 *   • Median Vacant Land by Suburb Time Series — annual ~2014-current
 *
 * Each XLSX is the same layout:
 *   Row 0: blank / "Change" / "Growth" labels
 *   Row 1: ["Locality", year1, year2, …, yearN, "Prelim", "Change", "Growth", …]
 *   Row 2: ["", "", …, prelimYear, "(%)", "(%)", …]
 *   Row 4+: data rows — locality (col 0), then yearly medians.
 *           "-" / "NA" / "" cells are missing data.
 *
 * Writes one SuburbSalesStat row per (suburb × year × dwelling type),
 * keyed on (suburbName, postcode, state, period, source). Source values
 * are namespaced so house/unit/land medians coexist for the same period.
 *
 * License: CC BY 4.0 (Department of Transport and Planning, Victoria)
 * Schedule: Annual — re-run after the latest annual report drops (~Sep).
 *
 * land.vic.gov.au sits behind a Cloudflare JS challenge to server-side
 * fetches; we fall back to the Wayback Machine snapshot like sales-vic.ts.
 */
import "dotenv/config";
import * as XLSX from "xlsx";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";

const SOURCE_ID = "sales-vic-historical";
const CKAN_BASE = "https://discover.data.vic.gov.au";

const PACKAGES = {
  house:  "victorian-property-sales-report-median-house-by-suburb-time-series",
  unit:   "victorian-property-sales-report-median-unit-by-suburb-time-series",
  vacant: "victorian-property-sales-report-median-vacant-land-by-suburb-time-series",
} as const;
type DwellingKey = keyof typeof PACKAGES;

interface CkanResource { url: string; format?: string; metadata_modified?: string }

async function getXlsxUrl(packageId: string): Promise<string> {
  const apiUrl = `${CKAN_BASE}/api/3/action/package_show?id=${packageId}`;
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error(`CKAN HTTP ${res.status}: ${apiUrl}`);
  const json = await res.json() as { success: boolean; result: { resources: CkanResource[] } };
  if (!json.success) throw new Error(`CKAN package not found: ${packageId}`);
  const xlsx = json.result.resources.find((r) => (r.format ?? "").toUpperCase() === "XLSX");
  if (!xlsx) throw new Error(`no XLSX resource on package ${packageId}`);
  return xlsx.url;
}

async function tryFetch(url: string): Promise<Buffer | null> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Referer":    "https://www.land.vic.gov.au/",
      "Accept":     "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,*/*",
    },
    redirect: "follow",
  });
  if (!res.ok) return null;
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("text/html")) return null;
  return Buffer.from(await res.arrayBuffer());
}

async function downloadXlsx(url: string): Promise<Buffer> {
  const direct = await tryFetch(url);
  if (direct) return direct;
  log(SOURCE_ID, `direct fetch blocked, falling back to web.archive.org for ${url}`);
  const wayback = await tryFetch(`https://web.archive.org/web/2025/${url}`);
  if (wayback) return wayback;
  throw new Error(`Both direct and Wayback fetches failed for ${url}`);
}

interface YearRow { name: string; medians: Map<number, number> }

/** Locate the year-header row and return the data rows + year→column map. */
function parseTimeSeries(buf: Buffer): YearRow[] {
  const wb = XLSX.read(buf, { type: "buffer" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json<(string | number)[]>(ws, { header: 1, defval: "" });

  // Find the row whose first cell is "Locality" and whose subsequent cells are year ints.
  let headerIdx = -1;
  for (let i = 0; i < Math.min(8, raw.length); i++) {
    if (String(raw[i]?.[0] ?? "").trim().toLowerCase() === "locality") { headerIdx = i; break; }
  }
  if (headerIdx < 0) throw new Error("could not find 'Locality' header row");
  const header = raw[headerIdx];
  const yearByCol = new Map<number, number>();
  for (let c = 1; c < header.length; c++) {
    const v = header[c];
    const n = typeof v === "number" ? v : parseInt(String(v).trim(), 10);
    if (Number.isFinite(n) && n >= 1990 && n <= 2099) yearByCol.set(c, n);
  }
  // Some sheets have a "Prelim" column whose actual year sits in row headerIdx+1.
  const prelimCol = header.findIndex((v) => String(v).trim().toLowerCase().startsWith("prelim"));
  if (prelimCol > 0 && !yearByCol.has(prelimCol)) {
    const below = raw[headerIdx + 1]?.[prelimCol];
    const yr = typeof below === "number" ? below : parseInt(String(below).trim(), 10);
    if (Number.isFinite(yr) && yr >= 1990 && yr <= 2099) yearByCol.set(prelimCol, yr);
  }

  const out: YearRow[] = [];
  for (let i = headerIdx + 1; i < raw.length; i++) {
    const name = String(raw[i]?.[0] ?? "").trim();
    if (!name || name.startsWith("^") || name.startsWith("*") || name.toLowerCase().startsWith("source")) continue;
    const medians = new Map<number, number>();
    for (const [col, yr] of yearByCol) {
      const cell = raw[i]?.[col];
      if (cell === "-" || cell === "" || cell == null) continue;
      const num = typeof cell === "number" ? cell : parseInt(String(cell).replace(/,/g, ""), 10);
      if (Number.isFinite(num) && num > 0) medians.set(yr, num);
    }
    if (medians.size > 0) out.push({ name, medians });
  }
  return out;
}

async function loadVicSuburbIndex(): Promise<Map<string, { slug: string; postcode: string }>> {
  const rows = await prisma.suburb.findMany({
    where: { state: "VIC" },
    select: { slug: true, name: true, postcode: true },
  });
  const m = new Map<string, { slug: string; postcode: string }>();
  for (const r of rows) m.set(r.name.trim().toLowerCase(), { slug: r.slug, postcode: r.postcode });
  return m;
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    const index = await loadVicSuburbIndex();
    log(SOURCE_ID, `loaded ${index.size} VIC suburbs from DB`);

    type Bucket = { house?: number; unit?: number; vacant?: number };
    // key = `${slug}|${period}` → medians
    const acc = new Map<string, { slug: string; name: string; postcode: string; period: string; periodDate: Date; medians: Bucket }>();

    let unmatchedNames = 0;
    const unmatchedSamples = new Set<string>();

    for (const [dwelling, packageId] of Object.entries(PACKAGES) as Array<[DwellingKey, string]>) {
      const url = await getXlsxUrl(packageId);
      log(SOURCE_ID, `${dwelling}: ${url}`);
      const buf = await downloadXlsx(url);
      const rows = parseTimeSeries(buf);
      log(SOURCE_ID, `${dwelling}: parsed ${rows.length} suburb rows`);

      for (const row of rows) {
        const hit = index.get(row.name.toLowerCase());
        if (!hit) {
          unmatchedNames++;
          if (unmatchedSamples.size < 10) unmatchedSamples.add(row.name);
          continue;
        }
        for (const [year, median] of row.medians) {
          const period = String(year);
          const key = `${hit.slug}|${period}`;
          let bucket = acc.get(key);
          if (!bucket) {
            bucket = {
              slug: hit.slug, name: row.name, postcode: hit.postcode, period,
              periodDate: new Date(Date.UTC(year, 11, 31)),
              medians: {},
            };
            acc.set(key, bucket);
          }
          bucket.medians[dwelling] = median;
        }
      }
    }

    if (unmatchedNames > 0) {
      log(SOURCE_ID, `${unmatchedNames} unmatched names (samples: ${[...unmatchedSamples].slice(0, 10).join(", ")})`);
    }

    log(SOURCE_ID, `writing ${acc.size} SuburbSalesStat rows`);
    let written = 0;
    const CONCURRENCY = 8;
    const buckets = [...acc.values()];
    for (let i = 0; i < buckets.length; i += CONCURRENCY) {
      const chunk = buckets.slice(i, i + CONCURRENCY);
      await Promise.all(chunk.map(async (b) => {
        await prisma.suburbSalesStat.upsert({
          where: {
            suburbName_postcode_state_period_source: {
              suburbName: b.name, postcode: b.postcode, state: "VIC", period: b.period, source: SOURCE_ID,
            },
          },
          create: {
            suburbSlug:   b.slug,
            suburbName:   b.name,
            postcode:     b.postcode,
            state:        "VIC",
            period:       b.period,
            periodDate:   b.periodDate,
            medianHouse:  b.medians.house  ?? null,
            medianUnit:   b.medians.unit   ?? null,
            medianVacant: b.medians.vacant ?? null,
            source:       SOURCE_ID,
          },
          update: {
            suburbSlug:   b.slug,
            medianHouse:  b.medians.house  ?? null,
            medianUnit:   b.medians.unit   ?? null,
            medianVacant: b.medians.vacant ?? null,
          },
        });
        written++;
      }));
      if (i % (CONCURRENCY * 50) === 0 && i > 0) log(SOURCE_ID, `  ${written}/${acc.size} rows written`);
    }

    log(SOURCE_ID, `wrote ${written} SuburbSalesStat rows`);
    await finishSync(SOURCE_ID, written);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  } finally {
    await prisma.$disconnect();
  }
}
