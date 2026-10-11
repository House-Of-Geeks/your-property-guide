/**
 * Repair Suburb.statsSource where a rental feed overwrote the sales label.
 *
 * Usage:
 *   npx tsx scripts/sync/repair-stats-source.ts                 dry run: reads, prints, writes the plan CSV
 *   npx tsx scripts/sync/repair-stats-source.ts --apply         relabels the rows the plan decides
 *   flags: --state NSW        one state only
 *          --trusted-only     with --apply: write only the labels the gate trusts
 *                             (sales-nsw, sales-sa, sales-abs); leave the census rows as they are
 *          --sample <n>       sample rows printed per state and outcome (default 8)
 *          --out <csv>        plan / rollback record (default
 *                             docs/seo-baselines/<today>/data-audit/stats-source-repair.csv)
 *
 * Without --apply it writes nothing to the database. With --apply it changes
 * only statsSource (and updatedAt, so revalidate-paths and the IndexNow ping
 * see the pages), only on rows still carrying the rental label it read, and
 * writes the CSV first. It never changes a median, a count or a timestamp of
 * the sales feeds: those are the evidence.
 *
 * ── The fault (read-only production query, 10 Oct 2026) ─────────────────────
 * NSW 5,275 rows statsSource 'rental-nsw' (every NSW row); VIC 2,749
 * 'rental-vic' and 748 'sales-vic'; QLD 533 'rental-qld'. The trust gate
 * (src/lib/suburb-data-quality.ts) withholds every rental-labelled median, so
 * every NSW profile reads "Verified median pending" and every NSW agents page
 * answers noindex.
 *
 * ── What wrote the label (evidence in this repository) ──────────────────────
 * 1. The current code cannot. rental-nsw, rental-sa and rental-qld stopped
 *    writing statsSource on 3 Jul 2026 (be3def1), rental-vic on 5 May 2026
 *    (a418997); no other code in the repo writes a rental-* label (see
 *    tests/sync/sales-provenance-writers.test.ts). The current rental-nsw
 *    writes only the suburbs in postcodes DCJ publishes (4,072 on 7 Sep).
 * 2. The 1 Oct NSW pattern is exactly the old feed's. On 29 Sep production NSW
 *    rows carried sales-nsw (296 of the 374 NSW suburbs the lists printed,
 *    docs/seo-baselines/2026-09-29/lists/before.csv). On 10 Oct all 5,275
 *    carry rental-nsw. Only rental-nsw between 520c41d (3 Apr) and be3def1
 *    (3 Jul) writes the label to every NSW row:
 *    updateMany({ where: { state: "NSW" }, data: { statsSource: "rental-nsw", ... } }).
 * 3. The same run's sales-nsw did not put the label back. The current sales-nsw
 *    (c6820fd, 6 Sep) falls back to the captured rows when the Valuer General
 *    answers 403 and would have relabelled about 3,034 suburbs after
 *    rental-nsw; the code before it has no fallback and fails on the 403.
 * 4. QLD: rental-qld rows went from 293 priced (5 Sep audit) to 533, and QLD
 *    sales-abs from at least 126 suburbs (the ones the lists printed on
 *    29 Sep) to 61 rows: the old rental-qld's per-row stamp, removed in
 *    be3def1.
 * 5. The 1 Jul run did the same at 12:02 to 12:03 AEST (02:02 UTC, the
 *    "0 2 1 1,4,7,10 *" schedule), two days before be3def1. The GitHub
 *    schedule has been off since 6 May (16ddec9): the Railway cron services own
 *    the cadence, and their image (Dockerfile.sync-cron COPYs scripts/ at build
 *    time) runs the code of the commit it was built from until it is
 *    redeployed.
 * Most likely writer: the Railway quarterly cron service, running an image
 * built between 6 May (railway.cron.json, ced74ed) and 3 Jul 2026 that was
 * never redeployed. To confirm (read only): Railway, quarterly cron service,
 * Deployments: the active deployment's commit and date. In its 1 Oct log the
 * old rental-nsw prints "trying december 2026..." and "downloaded december
 * 2025 quarter" (the current one prints "plan: N quarters"), the old sales-nsw
 * fails with "HTTP 403 fetching", and there is no "::: indexnow-ping :::"
 * (added 8 Jul) or "::: revalidate-paths :::" (5 Sep). This script's dry run
 * prints the database side: the rental-nsw DataSource row (old code: dataAsOf
 * 2025-12-01 and a postcode-sized recordCount), legacy postcode-named NSW
 * rental rows written after 7 Sep (the current feed deletes them), and NSW
 * rows stamped rentalUpdatedAt on 1 Oct (old code: every row).
 * Until that service is redeployed from main, do not let it run: the next
 * quarterly run (1 Jan 2027) repeats this, and the post-sync guard in
 * scripts/cron/quarterly.sh only exists in a rebuilt image.
 *
 * ── Deciding the true source (repair-stats-source-rules.ts) ─────────────────
 * A rental stamp changed only the label, so the last sales writer's
 * fingerprint is still on the row: NSW rows whose median and sales count
 * equal sales-nsw's own aggregate of the captured Valuer General rows become
 * sales-nsw; SA rows equal to a stored SA Government quarter become sales-sa;
 * rows whose salesUpdatedAt is an ABS period end become sales-abs; rows with
 * the census seed's figures become abs-census-2021 (still withheld); QLD and
 * WA whole-thousand rows with a run-time sales stamp become sales-qld or
 * sales-wa (still withheld). Anything else is printed as undecided and left
 * alone.
 *
 * VIC: the 2,749 rental-vic rows are not a 1 Oct fault. Their label dates
 * from the 3 May run (statsUpdatedAt 2026-05-03 in the 5 Sep audit) and their
 * medians are the 2021 Census mortgage seed's, not Land Victoria's: all 2,732
 * priced rows were whole thousands, median $286,000, max $770,000, against
 * $933,000 for the sales-vic rows (docs/seo-baselines/2026-09-05/data-audit).
 * Relabelling them sales-vic would publish census proxies as verified
 * medians. The plan relabels them abs-census-2021 (still withheld). The only
 * way to a VIC median is a sales-vic run when Land Victoria answers.
 *
 * ── Relabel or rerun the feed? ───────────────────────────────────────────────
 * NSW: equivalent results. This script restores the label only where the
 * row's figures provably came from the feed and changes no figure.
 * `sales-nsw --from-rows` recomputes the same aggregate from the same captured
 * rows (no capture since the 403 on 6 Sep) and rewrites medians, counts,
 * growth, the label and the timestamps (salesUpdatedAt becomes the run date).
 * Either is sound; the relabel is the narrower write and covers the other
 * states. To cross-check the NSW numbers first (both read only):
 *   npx tsx scripts/sync/repair-stats-source.ts --state NSW
 *   npx tsx scripts/sync/run.ts sales-nsw --from-rows --dry-run
 * The rerun, if preferred for NSW:
 *   npx tsx scripts/sync/run.ts sales-nsw --from-rows
 * After either, from the project directory:
 *   npx tsx scripts/sync/revalidate-paths.ts 2
 *   npx tsx scripts/sync/indexnow-ping.ts 2
 */
import "dotenv/config";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { prisma } from "./db";
import { loadYearFromRows, median } from "./sources/sales-nsw";
import {
  decideStatsSource,
  isRentalLabel,
  nswAggregateYear,
  type NswAggregate,
  type RepairDecision,
  type RepairRow,
} from "./repair-stats-source-rules";
import { publishesMedians } from "../../src/lib/published-medians";
import { MIN_SALES_FOR_MEDIAN } from "../../src/lib/sales-provenance";
import { RELIABLE_SALES_SOURCES } from "../../src/lib/suburb-data-quality";

const args = process.argv.slice(2);
const flag = (name: string) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const APPLY = args.includes("--apply");
const TRUSTED_ONLY = args.includes("--trusted-only");
const STATE = flag("--state")?.toUpperCase() ?? null;
const SAMPLE = Math.max(0, parseInt(flag("--sample") ?? "8", 10) || 8);
const today = new Date().toISOString().slice(0, 10);
const OUT = flag("--out") ?? `docs/seo-baselines/${today}/data-audit/stats-source-repair.csv`;
const WRITE_CHUNK = 2000;
/** The suburbs the 10 Oct review quoted, printed whatever the sample. */
const SENTINELS = ["mosman-nsw-2088", "castle-hill-nsw-2154", "lane-cove-nsw-2066", "bondi-nsw-2026", "dubbo-nsw-2830", "toorak-vic-3142", "carindale-qld-4152"];

interface Candidate extends RepairRow {
  id: string;
  slug: string;
  name: string;
  postcode: string;
  statsSource: string;
}
interface Planned { row: Candidate; decision: RepairDecision }

const day = (d: Date | null | undefined) => (d ? d.toISOString().slice(0, 10) : "none");
const csvCell = (v: unknown) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };

async function printWriterEvidence(): Promise<void> {
  console.log("\n== Writer evidence (read only) ==");
  const sources = await prisma.dataSource.findMany({
    where: { id: { in: ["rental-nsw", "rental-vic", "rental-sa", "rental-qld", "sales-nsw", "sales-vic", "sales-sa", "crime-nsw", "import-suburbs"] } },
    select: { id: true, status: true, lastFetchedAt: true, dataAsOf: true, recordCount: true, errorMsg: true },
    orderBy: { id: "asc" },
  });
  for (const s of sources) {
    console.log(`  DataSource ${s.id.padEnd(15)} ${s.status.padEnd(7)} lastFetchedAt ${s.lastFetchedAt?.toISOString() ?? "none"}  dataAsOf ${day(s.dataAsOf)}  records ${s.recordCount ?? "-"}${s.errorMsg ? `  error: ${s.errorMsg.slice(0, 120)}` : ""}`);
  }
  console.log("  (rental-nsw: the code before 7 Sep reads the December 2025 workbook, so dataAsOf 2025-12-01 and a recordCount near the number of postcodes; the current feed: 2026-06-01 or later and about 4,000)");

  const legacy = await prisma.$queryRaw<{ d: string; n: bigint }[]>`
    SELECT to_char("updatedAt", 'YYYY-MM-DD') AS d, COUNT(*)::bigint AS n
    FROM "SuburbRentalStat"
    WHERE state = 'NSW' AND source = 'rental-nsw' AND "suburbName" = postcode
    GROUP BY 1 ORDER BY 1 DESC LIMIT 6`;
  console.log(`  NSW postcode-named rental rows (the old feed writes them; the current one deleted 441 on 7 Sep): ${legacy.length ? legacy.map((r) => `${r.d} ${r.n}`).join(", ") : "none"}`);

  const stamps = await prisma.$queryRaw<{ state: string; label: string; n: bigint; rental_1oct: bigint; no_sales_stamp: bigint; rental_min: string | null; rental_max: string | null }[]>`
    SELECT state, "statsSource" AS label, COUNT(*)::bigint AS n,
           COUNT(*) FILTER (WHERE "rentalUpdatedAt" >= '2026-09-30 12:00:00' AND "rentalUpdatedAt" < '2026-10-02 12:00:00')::bigint AS rental_1oct,
           COUNT(*) FILTER (WHERE "salesUpdatedAt" IS NULL)::bigint AS no_sales_stamp,
           to_char(MIN("rentalUpdatedAt"), 'YYYY-MM-DD') AS rental_min,
           to_char(MAX("rentalUpdatedAt"), 'YYYY-MM-DD') AS rental_max
    FROM "Suburb" WHERE "statsSource" LIKE 'rental-%'
    GROUP BY 1, 2 ORDER BY 1, 2`;
  const totals = new Map((await prisma.$queryRaw<{ state: string; n: bigint }[]>`SELECT state, COUNT(*)::bigint AS n FROM "Suburb" GROUP BY 1`).map((r) => [r.state, Number(r.n)]));
  for (const r of stamps) {
    console.log(`  ${r.state} ${r.label}: ${r.n} of ${totals.get(r.state) ?? "?"} rows; rentalUpdatedAt on 1 Oct ${r.rental_1oct}; rentalUpdatedAt ${r.rental_min ?? "none"} to ${r.rental_max ?? "none"}; no salesUpdatedAt ${r.no_sales_stamp}`);
  }
  console.log("  (NSW: the old rental-nsw stamps rentalUpdatedAt on every NSW row; the current feed only on suburbs in the postcodes DCJ publishes)");
}

async function trustedByState(): Promise<Map<string, { trusted: number; published: number }>> {
  const rows = await prisma.$queryRaw<{ state: string; trusted: bigint; published: bigint }[]>`
    SELECT state,
           COUNT(*) FILTER (WHERE "statsSource" = ANY(${[...RELIABLE_SALES_SOURCES]}::text[]))::bigint AS trusted,
           COUNT(*) FILTER (WHERE "statsSource" = ANY(${[...RELIABLE_SALES_SOURCES]}::text[]) AND "medianHousePrice" > 0
                              AND NOT ("salesCountHouse" >= 1 AND "salesCountHouse" < ${MIN_SALES_FOR_MEDIAN}))::bigint AS published
    FROM "Suburb" GROUP BY state ORDER BY state`;
  return new Map(rows.map((r) => [r.state, { trusted: Number(r.trusted), published: Number(r.published) }]));
}

/** sales-nsw's aggregate per "SUBURB|POSTCODE" for each year the candidates need. */
async function nswAggregates(rows: Candidate[]): Promise<Map<number, Map<string, NswAggregate>>> {
  const years = [...new Set(rows.filter((r) => r.state === "NSW" && r.salesUpdatedAt).map((r) => nswAggregateYear(r.salesUpdatedAt!)))].sort();
  const out = new Map<number, Map<string, NswAggregate>>();
  for (const year of years) {
    const parsed = await loadYearFromRows(year);
    const byKey = new Map<string, NswAggregate>();
    for (const [key, entry] of parsed.aggregate.prices) {
      const m = median(entry.prices);
      if (m) byKey.set(key, { year, median: m, count: entry.prices.length });
    }
    out.set(year, byKey);
  }
  return out;
}

/** The newest sales-sa-historical quarter whose median and count equal the row's, per slug. */
async function saQuarterMatches(rows: Candidate[]): Promise<Map<string, string>> {
  const sa = rows.filter((r) => r.state === "SA" && r.medianHousePrice > 0);
  if (sa.length === 0) return new Map();
  const stats = await prisma.suburbSalesStat.findMany({
    where: { state: "SA", source: "sales-sa-historical", suburbSlug: { in: sa.map((r) => r.slug) } },
    select: { suburbSlug: true, period: true, periodDate: true, medianHouse: true, saleCountHouse: true },
    orderBy: { periodDate: "desc" },
  });
  const bySlug = new Map(sa.map((r) => [r.slug, r]));
  const out = new Map<string, string>();
  for (const s of stats) {
    const r = s.suburbSlug ? bySlug.get(s.suburbSlug) : undefined;
    if (!r || out.has(r.slug)) continue;
    if (s.medianHouse === r.medianHousePrice && (s.saleCountHouse ?? 0) === (r.salesCountHouse ?? 0)) out.set(r.slug, s.period);
  }
  return out;
}

function printPlan(plan: Planned[]): void {
  const states = [...new Set(plan.map((p) => p.row.state))].sort();
  console.log("\n== Plan by state ==");
  for (const state of states) {
    const rows = plan.filter((p) => p.row.state === state);
    const labels = [...new Set(rows.map((p) => p.row.statsSource))].join(", ");
    console.log(`\n${state}: ${rows.length} rows labelled ${labels}`);
    const groups = new Map<string, Planned[]>();
    for (const p of rows) {
      const key = p.decision.kind === "relabel" ? `relabel ${p.decision.to}${p.decision.trusted ? " (trusted)" : " (stays withheld)"} [${p.decision.code}]` : `undecided [${p.decision.code}]`;
      groups.set(key, [...(groups.get(key) ?? []), p]);
    }
    for (const [key, ps] of [...groups.entries()].sort((a, b) => b[1].length - a[1].length)) {
      const d = ps[0].decision;
      const publishes = d.kind === "relabel" && d.trusted ? ps.filter((p) => publishesMedians({ statsSource: d.to, salesCountHouse: p.row.salesCountHouse })).length : 0;
      console.log(`  ${String(ps.length).padStart(6)}  ${key}${d.kind === "relabel" && d.trusted ? `: ${publishes} publish a median after the repair (5+ sales or count unknown)` : ""}`);
      for (const p of ps.slice(0, SAMPLE)) console.log(`            ${p.row.slug}: ${p.decision.detail}`);
    }
  }
  const sentinels = plan.filter((p) => SENTINELS.includes(p.row.slug));
  if (sentinels.length) {
    console.log("\n== Suburbs quoted in the review ==");
    for (const p of sentinels) console.log(`  ${p.row.slug} (${p.row.statsSource}): ${p.decision.kind === "relabel" ? `-> ${p.decision.to}` : "undecided"}; ${p.decision.detail}`);
  }
}

async function main(): Promise<void> {
  console.log(`repair-stats-source: ${APPLY ? `APPLY${TRUSTED_ONLY ? " (trusted labels only)" : ""}` : "dry run (no database writes)"}${STATE ? `, state ${STATE}` : ""}`);
  await printWriterEvidence();

  const before = await trustedByState();
  const raw = await prisma.suburb.findMany({
    where: { statsSource: { startsWith: "rental-" }, ...(STATE ? { state: STATE } : {}) },
    select: { id: true, slug: true, name: true, postcode: true, state: true, statsSource: true, medianHousePrice: true, medianUnitPrice: true, salesCountHouse: true, salesUpdatedAt: true },
    orderBy: [{ state: "asc" }, { slug: "asc" }],
  });
  const rows: Candidate[] = raw.filter((r) => isRentalLabel(r.statsSource));
  console.log(`\n${rows.length} rows carry a rental label${STATE ? ` in ${STATE}` : ""}`);

  const nsw = await nswAggregates(rows);
  const sa = await saQuarterMatches(rows);
  const plan: Planned[] = rows.map((row) => {
    const nswYear = row.state === "NSW" && row.salesUpdatedAt ? nswAggregateYear(row.salesUpdatedAt) : null;
    const evidence = {
      nsw: nswYear === null ? undefined : (nsw.get(nswYear)?.get(`${row.name.toUpperCase()}|${row.postcode}`) ?? null),
      saQuarter: sa.get(row.slug) ?? null,
    };
    return { row, decision: decideStatsSource(row, evidence) };
  });
  printPlan(plan);

  const relabels = plan.filter((p): p is Planned & { decision: Extract<RepairDecision, { kind: "relabel" }> } => p.decision.kind === "relabel");
  const toWrite = relabels.filter((p) => !TRUSTED_ONLY || p.decision.trusted);
  const gain = new Map<string, number>();
  for (const p of relabels) if (p.decision.trusted) gain.set(p.row.state, (gain.get(p.row.state) ?? 0) + 1);
  console.log("\n== Rows with a trusted label, by state: now -> after the repair ==");
  for (const [state, b] of before) {
    if (STATE && state !== STATE) continue;
    console.log(`  ${state.padEnd(4)} ${String(b.trusted).padStart(6)} -> ${String(b.trusted + (gain.get(state) ?? 0)).padStart(6)}   (published medians now ${b.published})`);
  }
  console.log(`\nrelabel ${relabels.length} rows (${relabels.filter((p) => p.decision.trusted).length} to a trusted label, ${relabels.filter((p) => !p.decision.trusted).length} to a withheld one); undecided ${plan.length - relabels.length}`);

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, ["id,slug,state,from,to,trusted,code,medianHousePrice,salesCountHouse,salesUpdatedAt,detail",
    ...plan.map((p) => [p.row.id, p.row.slug, p.row.state, p.row.statsSource, p.decision.kind === "relabel" ? p.decision.to : "", p.decision.kind === "relabel" ? p.decision.trusted : "", p.decision.code, p.row.medianHousePrice, p.row.salesCountHouse, p.row.salesUpdatedAt?.toISOString() ?? "", p.decision.detail].map(csvCell).join(","))].join("\n") + "\n");
  console.log(`plan and rollback record: ${OUT} (${plan.length} rows; the "from" column restores the old labels)`);

  if (!APPLY) {
    console.log("\ndry run: no database writes. To apply: npx tsx scripts/sync/repair-stats-source.ts --apply" + (STATE ? ` --state ${STATE}` : "") + " [--trusted-only]");
    return;
  }

  let written = 0;
  for (let i = 0; i < toWrite.length; i += WRITE_CHUNK) {
    const chunk = toWrite.slice(i, i + WRITE_CHUNK);
    written += await prisma.$executeRaw`
      UPDATE "Suburb" AS s
      SET "statsSource" = u.to_source,
          "updatedAt"   = NOW()
      FROM UNNEST(
        ${chunk.map((p) => p.row.id)}::text[],
        ${chunk.map((p) => p.row.statsSource)}::text[],
        ${chunk.map((p) => p.decision.to)}::text[]
      ) AS u(id, from_source, to_source)
      WHERE s.id = u.id AND s."statsSource" = u.from_source
    `;
  }
  console.log(`\nwrote ${written} of ${toWrite.length} planned labels${written < toWrite.length ? " (the rest changed since they were read; rerun the dry run)" : ""}`);
  const after = await trustedByState();
  for (const [state, a] of after) {
    if (STATE && state !== STATE) continue;
    console.log(`  ${state.padEnd(4)} trusted ${before.get(state)?.trusted ?? 0} -> ${a.trusted}; published medians ${before.get(state)?.published ?? 0} -> ${a.published}`);
  }
  console.log("next: npx tsx scripts/sync/revalidate-paths.ts 2 && npx tsx scripts/sync/indexnow-ping.ts 2");
}

main()
  .catch((err) => { console.error(err); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
