/**
 * WA Rental Data Sync (WA rental bond lodgements, Government of Western Australia)
 *
 * Source: "WA Rental Bonds Data 2023 - Current" on the National Housing Data
 * Exchange (CKAN package west-australia-rental-bonds-data-2023-current),
 * released monthly by the Government of Western Australia under CC BY 4.0.
 * Attribution, as the dataset gives it: "© Government of Western Australia
 * (Department of Mines, Industry Regulation and Safety) 2023".
 *   https://housing-data-exchange.ahdap.org/dataset/west-australia-rental-bonds-data-2023-current
 * The ZIP's file name changes with each release (wa-rental-bond-sep2026.zip),
 * so it is resolved through package_show every run.
 *
 * The data is one row per bond lodged, with no dwelling type and no bedrooms,
 * so every median is ALL DWELLINGS. It is written to medianRentAll and never
 * to the house or unit columns (rental-nsw-rules.ts says why: an
 * all-dwellings median printed as a house rent, and a yield on it).
 *
 * What it writes (rules in rental-wa-rules.ts, tested):
 *   - one SuburbRentalStat row per WA suburb and quarter for the newest
 *     --history complete quarters (default 12, three years): medianRentAll =
 *     the median weekly rent of the bonds lodged, bondLodgements = their
 *     number; house, unit and bedroom columns NULL. Published only with 11+
 *     bonds and fewer than half of them at one identical rent, and only for
 *     suburbs with a published median in the four newest quarters.
 *   - for every suburb that gets a row: Suburb.medianRentHouse and
 *     medianRentUnit set to 0 (unknown: the feed is the authority for WA rent
 *     there and publishes no house or unit figure, so a 2021 Census proxy
 *     must not stand in), rentalUpdatedAt and updatedAt stamped. Never
 *     statsSource, which belongs to the sales feeds.
 *   - the DataSource row rental-wa (created on the first real run).
 * Suburbs are matched on name and postcode exactly, among WA localities only
 * (LOCALITIES_ONLY, src/lib/non-localities.ts).
 *
 * Flags:
 *   --dry-run        download, parse and plan; reads the database, writes nothing
 *   --file <path>    use a downloaded ZIP instead of resolving it through CKAN
 *   --history <n>    complete quarters to write, newest first (default 12)
 *   --out <path>     rollback record of the Suburb rents a real run replaces
 *                    (default docs/seo-baselines/<today>/data-audit/wa-rents-replaced.csv)
 *
 * Gate: registered in run.ts with schedule "manual", so no group run
 * (all / quarterly / annual) and no cron starts it; it runs only by name.
 * A real run also stops before any write until the medianRentAll column
 * exists (scripts/sql/2026-10-01-suburb-rental-stat-median-rent-all.sql).
 * To schedule it once the first import is approved: add `run rental-wa` to
 * scripts/cron/quarterly.sh and set its schedule here in run.ts.
 */
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import AdmZip from "adm-zip";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import { getCkanDownloadUrl } from "../ckan";
import { LOCALITIES_ONLY } from "../../../src/lib/non-localities";
import { publishesMedians } from "../../../src/lib/published-medians";
import {
  DEFAULT_HISTORY_QUARTERS,
  MIN_BONDS,
  RECENT_QUARTERS,
  SMALL_SAMPLE_MAX,
  aggregateQuarterly,
  buildSuburbIndex,
  cellKey,
  completeQuarters,
  emptyTally,
  isLodgementEntry,
  normaliseLocality,
  parseLodgementCsv,
  planRows,
  resolveLocality,
  type Lodgement,
  type QuarterCell,
} from "./rental-wa-rules";

const SOURCE_ID = "rental-wa";
const CKAN_BASE = "https://housing-data-exchange.ahdap.org";
const PACKAGE_ID = "west-australia-rental-bonds-data-2023-current";
const DATASET_PAGE = `${CKAN_BASE}/dataset/${PACKAGE_ID}`;
const USER_AGENT = "Mozilla/5.0 (compatible; YourPropertyGuide data sync; +https://yourpropertyguide.com.au)";
const UPSERT_CHUNK = 1000;
const SAMPLE_SLUGS = [
  "nedlands-wa-6009", "innaloo-wa-6018", "joondalup-wa-6027", "floreat-wa-6014", "churchlands-wa-6018",
  "darch-wa-6065", "landsdale-wa-6065", "ocean-reef-wa-6027", "port-hedland-wa-6721", "karratha-wa-6714",
];

async function downloadZip(): Promise<{ buffer: Buffer; url: string }> {
  const url = await getCkanDownloadUrl(PACKAGE_ID, CKAN_BASE, "ZIP");
  const res = await fetch(url, { headers: { "user-agent": USER_AGENT }, signal: AbortSignal.timeout(180_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} downloading ${url}`);
  if ((res.headers.get("content-type") ?? "").includes("text/html")) throw new Error(`got an HTML page, not a ZIP: ${url}`);
  return { buffer: Buffer.from(await res.arrayBuffer()), url };
}

function readLodgements(buffer: Buffer): { rows: Lodgement[]; files: number; tally: ReturnType<typeof emptyTally> } {
  const zip = new AdmZip(buffer);
  const entries = zip.getEntries().filter((e) => !e.isDirectory && isLodgementEntry(e.entryName));
  if (entries.length === 0) throw new Error("no Monthly Bond Lodgement Summary CSV in the ZIP");
  const tally = emptyTally();
  const rows: Lodgement[] = [];
  for (const e of entries) rows.push(...parseLodgementCsv(e.getData().toString("utf8"), tally));
  return { rows, files: entries.length, tally };
}

async function columnExists(): Promise<boolean> {
  const r = await prisma.$queryRaw<{ ok: boolean }[]>`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'SuburbRentalStat' AND column_name = 'medianRentAll'
    ) AS ok`;
  return Boolean(r[0]?.ok);
}

const money = (n: number) => `$${n.toLocaleString("en-AU")}`;

function describeCell(c: QuarterCell | undefined, period: string): string {
  if (!c) return `${period} no bonds`;
  if (c.status === "too-few-bonds") return `${period} withheld (${c.bonds} bonds, needs ${MIN_BONDS})`;
  if (c.status === "single-rent") return `${period} withheld (${c.bonds} bonds, ${Math.round(c.singleRent.share * c.bonds)} at ${money(c.singleRent.rent)})`;
  return `${period} ${money(c.median)} (${c.bonds} bonds${c.smallSample ? ", small sample" : ""})`;
}

export async function run(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const fileArg = args.indexOf("--file") >= 0 ? args[args.indexOf("--file") + 1] : null;
  const outArg = args.indexOf("--out") >= 0 ? args[args.indexOf("--out") + 1] : null;
  const history = args.indexOf("--history") >= 0
    ? Math.max(1, parseInt(args[args.indexOf("--history") + 1], 10) || DEFAULT_HISTORY_QUARTERS)
    : DEFAULT_HISTORY_QUARTERS;

  if (!dryRun) {
    // Before any write, including the DataSource status: the rows need the column.
    if (!(await columnExists())) {
      throw new Error(`SuburbRentalStat."medianRentAll" does not exist: apply scripts/sql/2026-10-01-suburb-rental-stat-median-rent-all.sql first. Nothing was written.`);
    }
    await prisma.dataSource.upsert({
      where: { id: SOURCE_ID },
      create: { id: SOURCE_ID, label: "WA Rental Bonds Data (Government of Western Australia)", category: "rental", schedule: "quarterly", sourceUrl: DATASET_PAGE },
      update: {},
    });
    await startSync(SOURCE_ID);
  }
  try {
    const { buffer, url } = fileArg ? { buffer: readFileSync(fileArg), url: fileArg } : await downloadZip();
    const { rows, files, tally } = readLodgements(buffer);
    const quarters = completeQuarters(rows);
    if (quarters.length === 0) throw new Error("no complete quarter in the data");
    const window = quarters.slice(0, history);
    const newest = window[0];
    log(SOURCE_ID, `zip: ${url.split("/").pop()} · ${files} lodgement files · ${tally.rows} bonds, ${tally.kept} kept (${tally.outlier} rents under $50 or over $5,000, ${tally.badDate} bad dates, ${tally.badRent} bad rents, ${tally.noPlace} without a locality or postcode)`);
    log(SOURCE_ID, `complete quarters ${quarters[quarters.length - 1].period} to ${newest.period}; loading ${window.length}: ${window[window.length - 1].period} to ${newest.period}`);

    const cells = aggregateQuarterly(rows, window);
    for (const q of window) {
      const qc = cells.filter((c) => c.period === q.period);
      const pub = qc.filter((c) => c.status === "published");
      log(SOURCE_ID, `  ${q.period}: ${qc.length} localities, ${pub.length} published (${pub.filter((c) => c.smallSample).length} small samples of ${SMALL_SAMPLE_MAX} or fewer), ${qc.filter((c) => c.status === "too-few-bonds").length} under ${MIN_BONDS} bonds, ${qc.filter((c) => c.status === "single-rent").length} withheld for one repeated rent`);
    }

    // Read only: WA localities, their current rents and the columns the
    // sitemap and the thin-profile rule read, and the rows already on file.
    const suburbs = await prisma.suburb.findMany({
      where: { state: "WA", ...LOCALITIES_ONLY },
      select: { id: true, slug: true, name: true, postcode: true, state: true, medianRentHouse: true, medianRentUnit: true, rentalUpdatedAt: true, medianHousePrice: true, medianUnitPrice: true, population: true, statsSource: true, salesCountHouse: true },
    });
    const index = buildSuburbIndex(suburbs);
    const plan = planRows(cells, index, new Set(window.slice(0, RECENT_QUARTERS).map((q) => q.period)));
    const bySlug = new Map(suburbs.map((s) => [s.slug, s]));
    const covered = new Map<string, (typeof suburbs)[number]>();
    for (const r of plan.rows) covered.set(r.slug, bySlug.get(r.slug) as (typeof suburbs)[number]);
    const newestSlugs = new Set(plan.rows.filter((r) => r.period === newest.period).map((r) => r.slug));

    const existing = await prisma.suburbRentalStat.groupBy({ by: ["suburbSlug"], where: { state: "WA", suburbSlug: { not: null } } });
    const withRowToday = new Set(existing.map((e) => e.suburbSlug as string));
    const existingWa = await prisma.suburbRentalStat.count({ where: { state: "WA" } });

    const publishedPairs = new Set(cells.filter((c) => c.status === "published").map((c) => cellKey(c.locality, c.postcode)));
    const proxies = [...covered.values()].filter((s) => s.medianRentHouse > 0 || s.medianRentUnit > 0);
    const newlyIndexable = [...covered.keys()].filter((slug) => !withRowToday.has(slug));
    // The rental-market sitemap lists a page when its suburb is in the
    // indexable set (getIndexableSuburbSlugsWithDates: a price or a
    // population, localities only) and it has a rental row.
    const inSitemap = newlyIndexable.filter((slug) => {
      const s = covered.get(slug)!;
      return s.medianHousePrice > 0 || s.medianUnitPrice > 0 || s.population > 0;
    });
    // A profile with no published price and no population counts a rental
    // row as data of its own (isThinProfile); these could change from noindex.
    const thinCandidates = [...covered.values()].filter((s) => s.population <= 0 && !(publishesMedians(s) && (s.medianHousePrice > 0 || s.medianUnitPrice > 0)));
    const houseMedians = [...covered.values()].filter((s) => publishesMedians(s) && s.medianHousePrice > 0).length;

    log(SOURCE_ID, `matching: ${publishedPairs.size} locality+postcode pairs with a published quarter; ${plan.stale.length} have none in the ${RECENT_QUARTERS} newest quarters and are not written; of the other ${publishedPairs.size - plan.stale.length}, ${publishedPairs.size - plan.stale.length - plan.unmatched.length} matched a WA suburb and ${plan.unmatched.length} did not`);
    for (const u of plan.stale.slice(0, 8)) log(SOURCE_ID, `  not recent: ${u.locality} ${u.postcode}, newest published ${u.period} ${money(u.median)} (${u.bonds} bonds)`);
    for (const u of plan.unmatched.slice(0, 15)) log(SOURCE_ID, `  unmatched: ${u.locality} ${u.postcode} (${u.quarters} published quarters, ${u.bonds} bonds)`);
    // Every locality on the bond forms in the window, published or not: how
    // much of the data names no WA suburb at all (typos, addresses, other states).
    const pairs = new Map<string, { locality: string; postcode: string; bonds: number }>();
    for (const c of cells) {
      const k = cellKey(c.locality, c.postcode);
      const p = pairs.get(k) ?? { locality: c.locality, postcode: c.postcode, bonds: 0 };
      p.bonds += c.bonds;
      pairs.set(k, p);
    }
    const noSuburb = [...pairs.values()].filter((p) => !resolveLocality(index, p.locality, p.postcode)).sort((a, b) => b.bonds - a.bonds);
    const allBonds = [...pairs.values()].reduce((n, p) => n + p.bonds, 0);
    const lostBonds = noSuburb.reduce((n, p) => n + p.bonds, 0);
    log(SOURCE_ID, `  all bond-form localities in the window: ${pairs.size} locality+postcode pairs, ${noSuburb.length} name no WA suburb (${lostBonds} of ${allBonds} bonds, ${((lostBonds / allBonds) * 100).toFixed(1)}%); largest: ${noSuburb.slice(0, 8).map((p) => `${p.locality} ${p.postcode} (${p.bonds})`).join(", ")}`);
    log(SOURCE_ID, `plan: ${plan.rows.length} SuburbRentalStat rows for ${covered.size} suburbs (${newestSlugs.size} with a ${newest.period} median); ${suburbs.length} WA localities on file, ${suburbs.length - covered.size} get no row`);
    log(SOURCE_ID, `  Suburb rows to stamp: ${covered.size}; ${proxies.length} of them carry a rent today (census proxy or seed) that becomes 0 (unknown): house ${proxies.filter((s) => s.medianRentHouse > 0).length}, unit ${proxies.filter((s) => s.medianRentUnit > 0).length}`);
    log(SOURCE_ID, `  WA rental rows on file today: ${existingWa} (${withRowToday.size} suburbs)`);
    log(SOURCE_ID, `indexability: ${newlyIndexable.length} WA rental-market pages gain their first rental row and lose their noindex; ${inSitemap.length} of them enter the rental-market sitemap (the rest have no published price and no population, so the sub-page sitemaps leave them out as they do in every state)`);
    log(SOURCE_ID, `  covered suburbs with a published house median: ${houseMedians} (no yield is shown for any: the rent is all dwellings); profiles that could leave noindex through the rental row: ${thinCandidates.length}${thinCandidates.length ? ` (${thinCandidates.slice(0, 5).map((s) => s.slug).join(", ")})` : ""}`);

    const cellsByPair = new Map<string, QuarterCell[]>();
    for (const c of cells) cellsByPair.set(cellKey(c.locality, c.postcode), [...(cellsByPair.get(cellKey(c.locality, c.postcode)) ?? []), c]);
    const recent = window.slice(0, 4).map((q) => q.period);
    for (const slug of SAMPLE_SLUGS) {
      const s = bySlug.get(slug);
      if (!s) { log(SOURCE_ID, `  ${slug}: no such WA locality on file`); continue; }
      const pair = cellsByPair.get(cellKey(normaliseLocality(s.name), s.postcode)) ?? [];
      const rs = plan.rows.filter((r) => r.slug === slug);
      log(SOURCE_ID, `  ${slug}: ${rs.length} published quarters; ${recent.map((p) => describeCell(pair.find((c) => c.period === p), p)).join("; ")}`);
    }

    if (dryRun) {
      const colOk = await columnExists();
      log(SOURCE_ID, `column SuburbRentalStat."medianRentAll" ${colOk ? "exists" : "does not exist yet: a real run stops before writing until the DDL is applied"}`);
      log(SOURCE_ID, "dry run: no writes");
      return;
    }

    // The rollback record first: the Suburb rents this run replaces with 0
    // (2021 Census proxies today), as clear-rent-proxies keeps one.
    const out = outArg ?? `docs/seo-baselines/${new Date().toISOString().slice(0, 10)}/data-audit/wa-rents-replaced.csv`;
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, ["slug,name,postcode,medianRentHouse,medianRentUnit,rentalUpdatedAt",
      ...[...covered.values()].map((s) => [s.slug, JSON.stringify(s.name), s.postcode, s.medianRentHouse, s.medianRentUnit, s.rentalUpdatedAt?.toISOString() ?? ""].join(","))].join("\n") + "\n");
    log(SOURCE_ID, `rollback record: ${out} (${covered.size} rows)`);

    // One bulk upsert per chunk (UNNEST + ON CONFLICT): Prisma transactions
    // of many upserts exceed the 5 s limit over the Railway proxy.
    for (let i = 0; i < plan.rows.length; i += UPSERT_CHUNK) {
      const chunk = plan.rows.slice(i, i + UPSERT_CHUNK);
      await prisma.$executeRaw`
        INSERT INTO "SuburbRentalStat"
          (id, "suburbSlug", "suburbName", postcode, state, period, "periodDate",
           "medianRentHouse", "medianRentUnit", "medianRentAll", "medianRent3Bed", "medianRent2Bed", "medianRent1Bed",
           "bondLodgements", source, "createdAt", "updatedAt")
        SELECT u.id, u.slug, u.name, u.postcode, 'WA', u.period, u.period_date,
               NULL, NULL, u.median, NULL, NULL, NULL,
               u.bonds, ${SOURCE_ID}, NOW(), NOW()
        FROM UNNEST(
          ${chunk.map(() => randomUUID())}::text[],
          ${chunk.map((r) => r.slug)}::text[],
          ${chunk.map((r) => r.name)}::text[],
          ${chunk.map((r) => r.postcode)}::text[],
          ${chunk.map((r) => r.period)}::text[],
          ${chunk.map((r) => r.periodDate)}::timestamptz[],
          ${chunk.map((r) => r.median)}::int[],
          ${chunk.map((r) => r.bonds)}::int[]
        ) AS u(id, slug, name, postcode, period, period_date, median, bonds)
        ON CONFLICT ("suburbName", postcode, state, period) DO UPDATE SET
          "suburbSlug"      = EXCLUDED."suburbSlug",
          "periodDate"      = EXCLUDED."periodDate",
          "medianRentHouse" = NULL,
          "medianRentUnit"  = NULL,
          "medianRentAll"   = EXCLUDED."medianRentAll",
          "medianRent3Bed"  = NULL,
          "medianRent2Bed"  = NULL,
          "medianRent1Bed"  = NULL,
          "bondLodgements"  = EXCLUDED."bondLodgements",
          source            = EXCLUDED.source,
          "updatedAt"       = NOW()
      `;
      log(SOURCE_ID, `  rental rows ${Math.min(i + UPSERT_CHUNK, plan.rows.length)}/${plan.rows.length}`);
    }

    if (covered.size > 0) {
      // Rent has its own timestamp; statsUpdatedAt and statsSource belong to
      // the sales feeds. Prisma's @updatedAt is not touched by raw SQL, and
      // the suburbs sitemap lastmod, revalidate-paths and the IndexNow ping
      // key on it.
      await prisma.$executeRaw`
        UPDATE "Suburb"
        SET "medianRentHouse" = 0,
            "medianRentUnit"  = 0,
            "rentalUpdatedAt" = NOW(),
            "updatedAt"       = NOW()
        WHERE id = ANY(${[...covered.values()].map((s) => s.id)}::text[])
      `;
      log(SOURCE_ID, `stamped ${covered.size} Suburb rows`);
    }

    await finishSync(SOURCE_ID, plan.rows.length, newest.periodDate);
  } catch (err) {
    if (!dryRun) await failSync(SOURCE_ID, err);
    throw err;
  }
}
