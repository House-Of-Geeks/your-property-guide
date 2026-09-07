/**
 * NSW Rental Data Sync (DCJ Rent and Sales Report, postcode tables)
 *
 * Source: the NSW Department of Communities and Justice publishes Rental
 * Bond Board data quarterly. The workbook's "Postcode" sheet has one row per
 * postcode × dwelling type × bedroom count with the median weekly rent for
 * new bonds and the number of new bonds lodged.
 *   https://www.dcj.nsw.gov.au/about-us/families-and-communities-statistics/housing-rent-and-sales/rent-and-sales-report.html
 *
 * What it writes (rules in rental-nsw-rules.ts, tested):
 *   - house rent  = the House / Total-bedrooms median
 *   - unit rent   = the Flat/Unit / Total-bedrooms median
 *   - one SuburbRentalStat row per NSW suburb in each covered postcode
 *     (suburbName = the suburb, so the page's freshness lookup finds it),
 *     with bondLodgements = new house bonds when DCJ prints the count
 *   - Suburb.medianRentHouse / medianRentUnit for those suburbs, 0 where DCJ
 *     withholds the figure (10 or fewer bonds) so a census proxy cannot stand
 *     in for it; rentalUpdatedAt and updatedAt stamped on the rows touched
 *   - legacy postcode-named rows (suburbName = postcode) from the earlier
 *     definition are deleted; they held the all-dwellings total as the house rent
 * Suburbs in postcodes DCJ does not publish keep whatever they had.
 *
 * Flags:
 *   --dry-run       parse, plan and print; no writes, no DataSource update
 *   --file <path>   use a downloaded workbook instead of fetching
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
  findLatestRentTablesUrl,
  isCovered,
  parseReportingPeriod,
  selectPostcodeRents,
  type DcjRentRow,
} from "./rental-nsw-rules";

const SOURCE_ID = "rental-nsw";
const REPORT_PAGE = "https://www.dcj.nsw.gov.au/about-us/families-and-communities-statistics/housing-rent-and-sales/rent-and-sales-report.html";
const DCJ_BASE = "https://www.dcj.nsw.gov.au/content/dam/dcj/dcj-website/documents/about-us/families-and-communities-statistics/housing-and-rent-sales";
const USER_AGENT = "Mozilla/5.0 (compatible; YourPropertyGuide data sync; +https://yourpropertyguide.com.au)";
const SAMPLE_SLUGS = ["bondi-nsw-2026", "sydney-nsw-2000", "double-bay-nsw-2028", "seaforth-nsw-2092", "dubbo-nsw-2830", "wagga-wagga-nsw-2650", "huskisson-nsw-2540"];
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

/** The newest workbook: the report page's link first, then known file-name patterns. */
async function locateWorkbook(): Promise<{ buffer: Buffer; url: string }> {
  try {
    const res = await fetch(REPORT_PAGE, { headers: { "user-agent": USER_AGENT }, signal: AbortSignal.timeout(30_000) });
    if (res.ok) {
      const link = findLatestRentTablesUrl(await res.text(), REPORT_PAGE);
      if (link) {
        log(SOURCE_ID, `report page links ${link.month} ${link.year} quarter`);
        const buffer = await fetchWorkbook(link.url);
        if (buffer) return { buffer, url: link.url };
      }
    }
  } catch (err) {
    log(SOURCE_ID, `report page unavailable: ${(err as Error).message}`);
  }
  for (const url of candidateRentTablesUrls(new Date(), DCJ_BASE)) {
    const buffer = await fetchWorkbook(url);
    if (buffer) return { buffer, url };
  }
  throw new Error("Could not download any recent DCJ rent-tables workbook");
}

interface PlannedRow {
  id: string;
  slug: string;
  name: string;
  postcode: string;
  house: number; // 0 = DCJ withholds it
  unit: number;
  bonds: number | null;
}

export async function run(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const fileArg = args.indexOf("--file") >= 0 ? args[args.indexOf("--file") + 1] : null;

  if (!dryRun) await startSync(SOURCE_ID);
  try {
    const { buffer, url } = fileArg
      ? { buffer: readFileSync(fileArg), url: fileArg }
      : await locateWorkbook();
    log(SOURCE_ID, `workbook: ${url}`);

    const wb = XLSX.read(buffer, { type: "buffer" });
    const sheetName = wb.SheetNames.find((n) => n.toLowerCase().includes("postcode"));
    if (!sheetName) throw new Error(`No postcode sheet; sheets: ${wb.SheetNames.join(", ")}`);
    const raw = XLSX.utils.sheet_to_json<(string | number)[]>(wb.Sheets[sheetName], { header: 1, defval: "" });

    const periodCell = raw.find((r) => /reporting period/i.test(String(r?.[0] ?? "")))?.[0];
    const parsed = parseReportingPeriod(String(periodCell ?? ""));
    if (!parsed) throw new Error(`Could not parse reporting period from "${String(periodCell ?? "")}"`);
    log(SOURCE_ID, `period: ${parsed.period}`);

    const headerRow = findHeaderRow(raw);
    if (headerRow < 0) throw new Error("Could not find the header row (first cell 'Postcode')");
    const headers = raw[headerRow].map((h) => String(h).replace(/\s+/g, " ").trim());
    const col = (re: RegExp) => headers.findIndex((h) => re.test(h));
    const cPostcode = col(/^postcode/i);
    const cDwelling = col(/dwelling\s*type/i);
    const cBedrooms = col(/bedroom/i);
    const cMedian   = col(/median.*rent/i);
    const cNewBonds = col(/new bonds lodged/i);
    if (cPostcode < 0 || cDwelling < 0 || cBedrooms < 0 || cMedian < 0) {
      throw new Error(`Missing columns. Headers: ${headers.join(" | ")}`);
    }

    const rows: DcjRentRow[] = raw.slice(headerRow + 1).map((r) => ({
      postcode:     r[cPostcode],
      dwellingType: r[cDwelling],
      bedrooms:     r[cBedrooms],
      median:       r[cMedian],
      newBonds:     cNewBonds >= 0 ? r[cNewBonds] : "",
    }));
    const rents = selectPostcodeRents(rows);
    const covered = [...rents.values()].filter(isCovered);
    const houseCount = covered.filter((p) => p.house).length;
    const unitCount  = covered.filter((p) => p.unit).length;
    const smallHouse = covered.filter((p) => p.house?.smallSample).length;
    log(SOURCE_ID, `postcodes: ${rents.size} in file, ${covered.length} with a published house or unit median (house ${houseCount}, of which ${smallHouse} on 30 or fewer bonds; unit ${unitCount})`);

    const suburbs = await prisma.suburb.findMany({ where: { state: "NSW" }, select: { id: true, slug: true, name: true, postcode: true } });
    const byPostcode = new Map<string, typeof suburbs>();
    for (const s of suburbs) byPostcode.set(s.postcode, [...(byPostcode.get(s.postcode) ?? []), s]);

    const plan: PlannedRow[] = [];
    let postcodesWithoutSuburbs = 0;
    for (const p of covered) {
      const members = byPostcode.get(p.postcode) ?? [];
      if (members.length === 0) { postcodesWithoutSuburbs++; continue; }
      for (const s of members) {
        plan.push({ id: s.id, slug: s.slug, name: s.name, postcode: s.postcode, house: p.house?.median ?? 0, unit: p.unit?.median ?? 0, bonds: p.house?.newBonds ?? null });
      }
    }
    const legacy = await prisma.$queryRaw<{ n: bigint }[]>`SELECT COUNT(*)::bigint AS n FROM "SuburbRentalStat" WHERE state = 'NSW' AND source = ${SOURCE_ID} AND "suburbName" = postcode`;
    const legacyRows = Number(legacy[0]?.n ?? 0);

    log(SOURCE_ID, `plan: ${plan.length} suburbs across ${covered.length - postcodesWithoutSuburbs} postcodes (${postcodesWithoutSuburbs} covered postcodes have no suburb rows); house rent unknown for ${plan.filter((r) => r.house === 0).length}, unit rent unknown for ${plan.filter((r) => r.unit === 0).length}; ${legacyRows} legacy postcode-named rows to delete; ${suburbs.length - plan.length} NSW suburbs untouched`);
    for (const slug of SAMPLE_SLUGS) {
      const r = plan.find((x) => x.slug === slug);
      const bonds = r?.house ? ` (${r.bonds ?? "30 or fewer"} new house bonds)` : "";
      log(SOURCE_ID, `  ${slug}: ${r ? `house $${r.house || "unknown"}, unit $${r.unit || "unknown"}${bonds}` : "not covered"}`);
    }

    if (dryRun) {
      log(SOURCE_ID, "dry run: no writes");
      return;
    }

    // One bulk upsert per chunk. A Prisma $transaction of 50 upserts exceeded
    // the 5 s interactive-transaction limit over the Railway proxy (7 Sep 2026
    // run); UNNEST + ON CONFLICT is a single round trip per chunk.
    for (let i = 0; i < plan.length; i += UPSERT_CHUNK) {
      const chunk = plan.slice(i, i + UPSERT_CHUNK);
      await prisma.$executeRaw`
        INSERT INTO "SuburbRentalStat"
          (id, "suburbSlug", "suburbName", postcode, state, period, "periodDate",
           "medianRentHouse", "medianRentUnit", "bondLodgements", source, "createdAt", "updatedAt")
        SELECT u.id, u.slug, u.name, u.postcode, 'NSW', ${parsed.period}, ${parsed.periodDate},
               NULLIF(u.house, 0), NULLIF(u.unit, 0), u.bonds, ${SOURCE_ID}, NOW(), NOW()
        FROM UNNEST(
          ${chunk.map(() => randomUUID())}::text[],
          ${chunk.map((r) => r.slug)}::text[],
          ${chunk.map((r) => r.name)}::text[],
          ${chunk.map((r) => r.postcode)}::text[],
          ${chunk.map((r) => r.house)}::int[],
          ${chunk.map((r) => r.unit)}::int[],
          ${chunk.map((r) => r.bonds)}::int[]
        ) AS u(id, slug, name, postcode, house, unit, bonds)
        ON CONFLICT ("suburbName", postcode, state, period) DO UPDATE SET
          "suburbSlug"      = EXCLUDED."suburbSlug",
          "periodDate"      = EXCLUDED."periodDate",
          "medianRentHouse" = EXCLUDED."medianRentHouse",
          "medianRentUnit"  = EXCLUDED."medianRentUnit",
          "bondLodgements"  = EXCLUDED."bondLodgements",
          source            = EXCLUDED.source,
          "updatedAt"       = NOW()
      `;
      log(SOURCE_ID, `  rental rows ${Math.min(i + UPSERT_CHUNK, plan.length)}/${plan.length}`);
    }

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
        FROM UNNEST(
          ${plan.map((r) => r.id)}::text[],
          ${plan.map((r) => r.house)}::int[],
          ${plan.map((r) => r.unit)}::int[]
        ) AS u(id, rent_house, rent_unit)
        WHERE s.id = u.id
      `;
      log(SOURCE_ID, `updated ${plan.length} Suburb rows`);
    }

    if (legacyRows > 0) {
      const deleted = await prisma.$executeRaw`DELETE FROM "SuburbRentalStat" WHERE state = 'NSW' AND source = ${SOURCE_ID} AND "suburbName" = postcode`;
      log(SOURCE_ID, `deleted ${deleted} legacy postcode-named rows`);
    }

    await finishSync(SOURCE_ID, plan.length, parsed.periodDate);
  } catch (err) {
    if (!dryRun) await failSync(SOURCE_ID, err);
    throw err;
  }
}
