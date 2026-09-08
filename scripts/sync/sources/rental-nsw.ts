/**
 * NSW Rental Data Sync (DCJ Rent and Sales Report, postcode tables)
 *
 * Source: the NSW Department of Communities and Justice publishes Rental
 * Bond Board data quarterly. Each quarter's workbook has a "Postcode" sheet
 * with one row per postcode × dwelling type × bedroom count: the median
 * weekly rent for new bonds and the number of new bonds lodged.
 *   https://www.dcj.nsw.gov.au/about-us/families-and-communities-statistics/housing-rent-and-sales/rent-and-sales-report.html
 *   (previous quarters on the "previous rent and sales reports" page)
 *
 * What it writes (rules in rental-nsw-rules.ts, tested):
 *   - house rent  = the House / Total-bedrooms median
 *   - unit rent   = the Flat/Unit / Total-bedrooms median
 *   - 1, 2 and 3-bedroom rents = the all-dwellings rows by bedroom count
 *   - one SuburbRentalStat row per NSW suburb in each covered postcode, per
 *     quarter, for the newest --history quarters DCJ still serves (default
 *     8); bondLodgements = new house bonds when DCJ prints the count
 *   - Suburb.medianRentHouse / medianRentUnit from the newest quarter, 0
 *     where DCJ withholds the figure (10 or fewer bonds), rentalUpdatedAt and
 *     updatedAt stamped on the rows touched
 *   - legacy postcode-named rows (suburbName = postcode) deleted
 * Suburbs in postcodes DCJ does not publish keep whatever they had.
 *
 * Flags:
 *   --dry-run        parse, plan and print; no writes, no DataSource update
 *   --file <path>    use a downloaded workbook as the newest quarter
 *   --history <n>    quarters to load including the newest (default 8; 1 = newest only)
 *
 * Schedule: quarterly (scripts/cron/quarterly.sh)
 */
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import * as XLSX from "xlsx";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import {
  candidateRentTablesUrls,
  findHeaderRow,
  findRentTablesLinks,
  isCovered,
  parseReportingPeriod,
  quarterSequence,
  rentTablesUrlsForQuarter,
  selectPostcodeRents,
  type DcjRentRow,
  type PostcodeRents,
  type RentTablesLink,
} from "./rental-nsw-rules";

const SOURCE_ID = "rental-nsw";
const REPORT_PAGE = "https://www.dcj.nsw.gov.au/about-us/families-and-communities-statistics/housing-rent-and-sales/rent-and-sales-report.html";
const ARCHIVE_PAGE = "https://www.dcj.nsw.gov.au/about-us/families-and-communities-statistics/housing-rent-and-sales/previous-rent-and-sales-reports.html";
const DCJ_BASE = "https://www.dcj.nsw.gov.au/content/dam/dcj/dcj-website/documents/about-us/families-and-communities-statistics/housing-and-rent-sales";
const USER_AGENT = "Mozilla/5.0 (compatible; YourPropertyGuide data sync; +https://yourpropertyguide.com.au)";
const SAMPLE_SLUGS = ["bondi-nsw-2026", "sydney-nsw-2000", "double-bay-nsw-2028", "seaforth-nsw-2092", "dubbo-nsw-2830", "wagga-wagga-nsw-2650", "huskisson-nsw-2540"];
const DEFAULT_HISTORY = 8;
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

async function fetchPageLinks(page: string): Promise<RentTablesLink[]> {
  try {
    const res = await fetch(page, { headers: { "user-agent": USER_AGENT }, signal: AbortSignal.timeout(30_000) });
    if (!res.ok) return [];
    return findRentTablesLinks(await res.text(), page);
  } catch (err) {
    log(SOURCE_ID, `page unavailable: ${page} (${(err as Error).message})`);
    return [];
  }
}

interface ParsedWorkbook {
  period: string;
  periodDate: Date;
  rents: Map<string, PostcodeRents>;
}

function parseWorkbook(buffer: Buffer, label: string): ParsedWorkbook {
  const wb = XLSX.read(buffer, { type: "buffer" });
  const sheetName = wb.SheetNames.find((n) => n.toLowerCase().includes("postcode"));
  if (!sheetName) throw new Error(`${label}: no postcode sheet; sheets: ${wb.SheetNames.join(", ")}`);
  const raw = XLSX.utils.sheet_to_json<(string | number)[]>(wb.Sheets[sheetName], { header: 1, defval: "" });

  const periodCell = raw.find((r) => /reporting period/i.test(String(r?.[0] ?? "")))?.[0];
  const parsed = parseReportingPeriod(String(periodCell ?? ""));
  if (!parsed) throw new Error(`${label}: could not parse reporting period from "${String(periodCell ?? "")}"`);

  const headerRow = findHeaderRow(raw);
  if (headerRow < 0) throw new Error(`${label}: could not find the header row (first cell 'Postcode')`);
  const headers = raw[headerRow].map((h) => String(h).replace(/\s+/g, " ").trim());
  const col = (re: RegExp) => headers.findIndex((h) => re.test(h));
  const cPostcode = col(/^postcode/i);
  const cDwelling = col(/dwelling\s*type/i);
  const cBedrooms = col(/bedroom/i);
  const cMedian   = col(/median.*rent/i);
  const cNewBonds = col(/new bonds lodged/i);
  if (cPostcode < 0 || cDwelling < 0 || cBedrooms < 0 || cMedian < 0) {
    throw new Error(`${label}: missing columns. Headers: ${headers.join(" | ")}`);
  }
  const rows: DcjRentRow[] = raw.slice(headerRow + 1).map((r) => ({
    postcode:     r[cPostcode],
    dwellingType: r[cDwelling],
    bedrooms:     r[cBedrooms],
    median:       r[cMedian],
    newBonds:     cNewBonds >= 0 ? r[cNewBonds] : "",
  }));
  return { period: parsed.period, periodDate: parsed.periodDate, rents: selectPostcodeRents(rows) };
}

/** The newest workbook, then the earlier quarters DCJ still serves, newest first. */
async function locateWorkbooks(history: number, newestFile: string | null): Promise<{ buffer: Buffer; url: string }[]> {
  const links = [...(await fetchPageLinks(REPORT_PAGE)), ...(await fetchPageLinks(ARCHIVE_PAGE))];
  const byQuarter = new Map<string, RentTablesLink>();
  for (const l of links) if (!byQuarter.has(`${l.year}-${l.month}`)) byQuarter.set(`${l.year}-${l.month}`, l);
  const out: { buffer: Buffer; url: string }[] = [];

  let newest: { buffer: Buffer; url: string; period: string } | null = null;
  if (newestFile) {
    const buffer = readFileSync(newestFile);
    newest = { buffer, url: newestFile, period: parseWorkbook(buffer, newestFile).period };
  } else {
    const sorted = [...byQuarter.values()];
    for (const l of sorted.length ? sorted : []) {
      const buffer = await fetchWorkbook(l.url);
      if (buffer) { newest = { buffer, url: l.url, period: parseWorkbook(buffer, l.url).period }; break; }
    }
    if (!newest) {
      for (const url of candidateRentTablesUrls(new Date(), DCJ_BASE)) {
        const buffer = await fetchWorkbook(url);
        if (buffer) { newest = { buffer, url, period: parseWorkbook(buffer, url).period }; break; }
      }
    }
  }
  if (!newest) throw new Error("Could not download any DCJ rent-tables workbook");
  out.push({ buffer: newest.buffer, url: newest.url });

  for (const q of quarterSequence(newest.period, history).slice(1)) {
    const link = byQuarter.get(`${q.year}-${q.month}`);
    const urls = [...(link ? [link.url] : []), ...rentTablesUrlsForQuarter(q.year, q.month, DCJ_BASE)];
    let got: Buffer | null = null;
    for (const url of urls) { got = await fetchWorkbook(url); if (got) { out.push({ buffer: got, url }); break; } }
    if (!got) log(SOURCE_ID, `  ${q.period}: no workbook found (${urls.length} URLs tried)`);
  }
  return out;
}

interface PlannedRow {
  id: string;
  slug: string;
  name: string;
  postcode: string;
  period: string;
  periodDate: Date;
  house: number; // 0 = DCJ withholds it
  unit: number;
  bed1: number | null;
  bed2: number | null;
  bed3: number | null;
  bonds: number | null;
}

export async function run(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const fileArg = args.indexOf("--file") >= 0 ? args[args.indexOf("--file") + 1] : null;
  const history = args.indexOf("--history") >= 0 ? Math.max(1, parseInt(args[args.indexOf("--history") + 1], 10) || DEFAULT_HISTORY) : DEFAULT_HISTORY;

  if (!dryRun) await startSync(SOURCE_ID);
  try {
    const workbooks = await locateWorkbooks(history, fileArg);
    const parsed: ParsedWorkbook[] = [];
    for (const w of workbooks) {
      const p = parseWorkbook(w.buffer, w.url);
      parsed.push(p);
      const covered = [...p.rents.values()].filter(isCovered).length;
      log(SOURCE_ID, `${p.period}: ${w.url.split("/").pop()} · ${p.rents.size} postcodes, ${covered} with a published house or unit median, ${[...p.rents.values()].filter((r) => r.bed2).length} with a 2-bedroom median`);
    }
    parsed.sort((a, b) => b.periodDate.getTime() - a.periodDate.getTime());
    const newest = parsed[0];

    const suburbs = await prisma.suburb.findMany({ where: { state: "NSW" }, select: { id: true, slug: true, name: true, postcode: true } });
    const byPostcode = new Map<string, typeof suburbs>();
    for (const s of suburbs) byPostcode.set(s.postcode, [...(byPostcode.get(s.postcode) ?? []), s]);

    const plan: PlannedRow[] = [];
    let postcodesWithoutSuburbs = 0;
    for (const p of parsed) {
      for (const r of p.rents.values()) {
        if (!isCovered(r)) continue;
        const members = byPostcode.get(r.postcode) ?? [];
        if (members.length === 0) { if (p === newest) postcodesWithoutSuburbs++; continue; }
        for (const s of members) {
          plan.push({ id: s.id, slug: s.slug, name: s.name, postcode: s.postcode, period: p.period, periodDate: p.periodDate, house: r.house?.median ?? 0, unit: r.unit?.median ?? 0, bed1: r.bed1?.median ?? null, bed2: r.bed2?.median ?? null, bed3: r.bed3?.median ?? null, bonds: r.house?.newBonds ?? null });
        }
      }
    }
    const latestRows = plan.filter((r) => r.period === newest.period);
    const legacy = await prisma.$queryRaw<{ n: bigint }[]>`SELECT COUNT(*)::bigint AS n FROM "SuburbRentalStat" WHERE state = 'NSW' AND source = ${SOURCE_ID} AND "suburbName" = postcode`;
    const legacyRows = Number(legacy[0]?.n ?? 0);

    log(SOURCE_ID, `plan: ${parsed.length} quarters ${parsed[parsed.length - 1].period} to ${newest.period}; ${plan.length} rows; newest quarter ${latestRows.length} suburbs (${postcodesWithoutSuburbs} covered postcodes have no suburb rows; house unknown for ${latestRows.filter((r) => r.house === 0).length}, unit unknown for ${latestRows.filter((r) => r.unit === 0).length}, 2-bedroom median for ${latestRows.filter((r) => r.bed2).length}); ${legacyRows} legacy postcode-named rows to delete; ${suburbs.length - latestRows.length} NSW suburbs untouched`);
    for (const slug of SAMPLE_SLUGS) {
      const rs = plan.filter((x) => x.slug === slug);
      const r = rs.find((x) => x.period === newest.period);
      log(SOURCE_ID, `  ${slug}: ${r ? `${rs.length} quarters; ${newest.period} house $${r.house || "unknown"}, unit $${r.unit || "unknown"}, 1/2/3 bed $${r.bed1 ?? "-"}/$${r.bed2 ?? "-"}/$${r.bed3 ?? "-"}${r.house ? ` (${r.bonds ?? "30 or fewer"} new house bonds)` : ""}; oldest ${rs[rs.length - 1].period} house $${rs[rs.length - 1].house || "unknown"}` : "not covered"}`);
    }

    if (dryRun) {
      log(SOURCE_ID, "dry run: no writes");
      return;
    }

    // One bulk upsert per chunk (UNNEST + ON CONFLICT): Prisma transactions
    // of many upserts exceed the 5 s limit over the Railway proxy.
    for (let i = 0; i < plan.length; i += UPSERT_CHUNK) {
      const chunk = plan.slice(i, i + UPSERT_CHUNK);
      await prisma.$executeRaw`
        INSERT INTO "SuburbRentalStat"
          (id, "suburbSlug", "suburbName", postcode, state, period, "periodDate",
           "medianRentHouse", "medianRentUnit", "medianRent1Bed", "medianRent2Bed", "medianRent3Bed", "bondLodgements", source, "createdAt", "updatedAt")
        SELECT u.id, u.slug, u.name, u.postcode, 'NSW', u.period, u.period_date,
               NULLIF(u.house, 0), NULLIF(u.unit, 0), u.bed1, u.bed2, u.bed3, u.bonds, ${SOURCE_ID}, NOW(), NOW()
        FROM UNNEST(
          ${chunk.map(() => randomUUID())}::text[],
          ${chunk.map((r) => r.slug)}::text[],
          ${chunk.map((r) => r.name)}::text[],
          ${chunk.map((r) => r.postcode)}::text[],
          ${chunk.map((r) => r.period)}::text[],
          ${chunk.map((r) => r.periodDate)}::timestamptz[],
          ${chunk.map((r) => r.house)}::int[],
          ${chunk.map((r) => r.unit)}::int[],
          ${chunk.map((r) => r.bed1)}::int[],
          ${chunk.map((r) => r.bed2)}::int[],
          ${chunk.map((r) => r.bed3)}::int[],
          ${chunk.map((r) => r.bonds)}::int[]
        ) AS u(id, slug, name, postcode, period, period_date, house, unit, bed1, bed2, bed3, bonds)
        ON CONFLICT ("suburbName", postcode, state, period) DO UPDATE SET
          "suburbSlug"      = EXCLUDED."suburbSlug",
          "periodDate"      = EXCLUDED."periodDate",
          "medianRentHouse" = EXCLUDED."medianRentHouse",
          "medianRentUnit"  = EXCLUDED."medianRentUnit",
          "medianRent1Bed"  = EXCLUDED."medianRent1Bed",
          "medianRent2Bed"  = EXCLUDED."medianRent2Bed",
          "medianRent3Bed"  = EXCLUDED."medianRent3Bed",
          "bondLodgements"  = EXCLUDED."bondLodgements",
          source            = EXCLUDED.source,
          "updatedAt"       = NOW()
      `;
      if (((i / UPSERT_CHUNK) + 1) % 5 === 0 || i + UPSERT_CHUNK >= plan.length) log(SOURCE_ID, `  rental rows ${Math.min(i + UPSERT_CHUNK, plan.length)}/${plan.length}`);
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
        FROM UNNEST(
          ${latestRows.map((r) => r.id)}::text[],
          ${latestRows.map((r) => r.house)}::int[],
          ${latestRows.map((r) => r.unit)}::int[]
        ) AS u(id, rent_house, rent_unit)
        WHERE s.id = u.id
      `;
      log(SOURCE_ID, `updated ${latestRows.length} Suburb rows from ${newest.period}`);
    }

    if (legacyRows > 0) {
      const deleted = await prisma.$executeRaw`DELETE FROM "SuburbRentalStat" WHERE state = 'NSW' AND source = ${SOURCE_ID} AND "suburbName" = postcode`;
      log(SOURCE_ID, `deleted ${deleted} legacy postcode-named rows`);
    }

    await finishSync(SOURCE_ID, latestRows.length, newest.periodDate);
  } catch (err) {
    if (!dryRun) await failSync(SOURCE_ID, err);
    throw err;
  }
}
