/**
 * SA Property Sales — Historical Time Series (Land Services Group SA)
 *
 * Pulls every "Metropolitan Median House Sales QN YYYY" XLSX from the
 * data.sa.gov.au CKAN package "metro-median-house-sales" — covers
 * metropolitan Adelaide only, ~45 quarterly files going back to 2015-Q1.
 *
 * Each XLSX (single sheet "Sheet1"):
 *   Row 0: ["City", "Suburb", "Sales NQ YYYY-1", "Median NQ YYYY-1",
 *           "Sales NQ YYYY",   "Median NQ YYYY",   "Median Change"]
 *   Row 1+: data — city, suburb (CAPS, often space-padded), then sales/median
 *           pairs. Empty cells mean no sales recorded that quarter.
 *
 * For each file we read the *current* quarter (cols 4 + 5) and write one
 * SuburbSalesStat row per matched suburb. The previous-year same-quarter
 * cell (cols 2 + 3) gets covered when we process that file's own release.
 *
 * Limitations:
 *   • Metropolitan Adelaide only — no regional/country SA suburbs.
 *   • Houses only — no unit/apartment time series in this dataset.
 *
 * License: CC BY 4.0 (Land Services Group, Department for Housing and Urban
 *          Development, South Australia)
 * Schedule: Quarterly (re-run after each new release lands on data.sa)
 */
import "dotenv/config";
import * as XLSX from "xlsx";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";

const SOURCE_ID = "sales-sa-historical";
const PACKAGE_ID = "metro-median-house-sales";
const CKAN_BASE = "https://data.sa.gov.au";

interface CkanResource { url: string; format?: string; name?: string }

async function listResources(): Promise<CkanResource[]> {
  const apiUrl = `${CKAN_BASE}/data/api/3/action/package_show?id=${PACKAGE_ID}`;
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error(`CKAN HTTP ${res.status}: ${apiUrl}`);
  const json = await res.json() as { success: boolean; result: { resources: CkanResource[] } };
  if (!json.success) throw new Error(`CKAN error: ${PACKAGE_ID}`);
  return json.result.resources.filter((r) => (r.format ?? "").toUpperCase() === "XLSX");
}

/** Parse a quarter+year from filename or resource name. Returns "YYYY-QN" or null. */
function parseQuarter(resource: CkanResource): { period: string; periodDate: Date } | null {
  // Try filename: lsg_stats_2025_q4.xlsx | lsgstats-2016q1.xlsx | metromediumhousesales20152q.xlsx
  const url = resource.url ?? "";
  const fileMatch = url.match(/(\d{4})[_\-]?q?(\d)/i) ?? url.match(/q(\d)[_\-]?(\d{4})/i);
  // Try resource title: "Metropolitan Median House Sales Q4 2025"
  const nameMatch = (resource.name ?? "").match(/Q(\d)\s+(\d{4})/i);
  let year = 0, q = 0;
  if (nameMatch) { q = parseInt(nameMatch[1], 10); year = parseInt(nameMatch[2], 10); }
  else if (fileMatch) {
    const a = parseInt(fileMatch[1], 10);
    const b = parseInt(fileMatch[2], 10);
    if (a > 1900) { year = a; q = b; } else { q = a; year = b; }
  }
  if (q < 1 || q > 4 || year < 2000 || year > 2100) return null;
  const month = q * 3; // Q1→3 (end of March), Q2→6, Q3→9, Q4→12
  return { period: `${year}-Q${q}`, periodDate: new Date(Date.UTC(year, month - 1, 1)) };
}

interface SuburbReading { name: string; sales: number | null; median: number }

function parseSheet(buf: Buffer): SuburbReading[] {
  const wb = XLSX.read(buf, { type: "buffer" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json<(string | number)[]>(ws, { header: 1, defval: "" });
  if (raw.length < 2) return [];

  // Identify the *current* quarter columns (cols 4 + 5 in canonical layout, but
  // some old files have an extra blank column — locate "Median" headers fresh).
  const header = raw[0].map((v) => String(v ?? "").replace(/\s+/g, " ").trim().toLowerCase());
  const medianCols: number[] = [];
  const salesCols: number[] = [];
  for (let c = 0; c < header.length; c++) {
    if (header[c].startsWith("median ")) medianCols.push(c);
    else if (header[c].startsWith("sales ")) salesCols.push(c);
  }
  // The *latest* quarter is the last "Median NQ YYYY" column (rightmost, before "Median Change").
  if (medianCols.length === 0) return [];
  const medianCol = medianCols[medianCols.length - 1];
  const salesCol  = salesCols.length > 0 ? salesCols[salesCols.length - 1] : -1;

  const out: SuburbReading[] = [];
  for (let i = 1; i < raw.length; i++) {
    const name = String(raw[i]?.[1] ?? "").trim();
    if (!name) continue;
    const medRaw = raw[i]?.[medianCol];
    if (medRaw === "" || medRaw == null) continue;
    const median = typeof medRaw === "number" ? medRaw : parseInt(String(medRaw).replace(/,/g, ""), 10);
    if (!Number.isFinite(median) || median <= 0) continue;
    const salRaw = salesCol >= 0 ? raw[i]?.[salesCol] : "";
    const sales = (salRaw === "" || salRaw == null) ? null : (typeof salRaw === "number" ? salRaw : parseInt(String(salRaw), 10));
    out.push({ name, sales: Number.isFinite(sales as number) ? (sales as number) : null, median });
  }
  return out;
}

async function loadSaSuburbIndex(): Promise<Map<string, { slug: string; postcode: string }>> {
  const rows = await prisma.suburb.findMany({
    where: { state: "SA" },
    select: { slug: true, name: true, postcode: true },
  });
  const m = new Map<string, { slug: string; postcode: string }>();
  for (const r of rows) m.set(r.name.trim().toLowerCase(), { slug: r.slug, postcode: r.postcode });
  return m;
}

async function tryFetch(url: string): Promise<Buffer | null> {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) return null;
  return Buffer.from(await res.arrayBuffer());
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    const resources = await listResources();
    log(SOURCE_ID, `${resources.length} XLSX resources found`);

    const index = await loadSaSuburbIndex();
    log(SOURCE_ID, `loaded ${index.size} SA suburbs from DB`);

    let written = 0;
    let skippedQuarter = 0;
    let unmatched = 0;
    const unmatchedSamples = new Set<string>();

    for (const res of resources) {
      const q = parseQuarter(res);
      if (!q) { skippedQuarter++; continue; }

      const buf = await tryFetch(res.url);
      if (!buf) { log(SOURCE_ID, `${q.period}: fetch failed, skipping`); continue; }

      const readings = parseSheet(buf);
      if (readings.length === 0) { log(SOURCE_ID, `${q.period}: no rows parsed`); continue; }

      const ops: Array<Promise<unknown>> = [];
      for (const r of readings) {
        const hit = index.get(r.name.toLowerCase());
        if (!hit) {
          unmatched++;
          if (unmatchedSamples.size < 10) unmatchedSamples.add(r.name);
          continue;
        }
        ops.push(prisma.suburbSalesStat.upsert({
          where: {
            suburbName_postcode_state_period_source: {
              suburbName: r.name, postcode: hit.postcode, state: "SA", period: q.period, source: SOURCE_ID,
            },
          },
          create: {
            suburbSlug:      hit.slug,
            suburbName:      r.name,
            postcode:        hit.postcode,
            state:           "SA",
            period:          q.period,
            periodDate:      q.periodDate,
            medianHouse:     r.median,
            saleCountHouse:  r.sales,
            source:          SOURCE_ID,
          },
          update: {
            suburbSlug:      hit.slug,
            medianHouse:     r.median,
            saleCountHouse:  r.sales,
          },
        }));
      }
      // Run in chunks so we don't open thousands of in-flight prisma calls at once.
      const CHUNK = 16;
      for (let i = 0; i < ops.length; i += CHUNK) {
        await Promise.all(ops.slice(i, i + CHUNK));
      }
      written += ops.length;
      log(SOURCE_ID, `${q.period}: ${ops.length} suburbs written`);
    }

    if (unmatched > 0) log(SOURCE_ID, `${unmatched} unmatched suburb names (samples: ${[...unmatchedSamples].slice(0, 10).join(", ")})`);
    if (skippedQuarter > 0) log(SOURCE_ID, `${skippedQuarter} resources skipped (no quarter parsed)`);

    log(SOURCE_ID, `wrote ${written} SuburbSalesStat rows total`);
    await finishSync(SOURCE_ID, written);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  } finally {
    await prisma.$disconnect();
  }
}
