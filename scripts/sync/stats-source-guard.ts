/**
 * Post-sync guard: rows with a trusted sales label, per state, before and
 * after a sync. Rule in stats-source-guard-rules.ts.
 *
 * Usage (scripts/cron/quarterly.sh runs both around the whole run):
 *   npx tsx scripts/sync/stats-source-guard.ts snapshot --out <file.json>
 *   npx tsx scripts/sync/stats-source-guard.ts check --before <file.json> [--states NSW,VIC] [--max-drop 0.1]
 *
 * `check` exits 1 and prints a line starting "!!! STATS-SOURCE GUARD FAILED"
 * when a guarded state lost more than the limit, and exits 2 when it has no
 * snapshot to compare with. Read only: it never writes the database.
 * scripts/sync/run.ts also checks around every source it runs, so the log
 * names the feed that did it.
 */
import "dotenv/config";
import { readFileSync, writeFileSync } from "node:fs";
import { prisma } from "./db";
import { RELIABLE_SALES_SOURCES } from "../../src/lib/suburb-data-quality";
import { GUARDED_STATES, MAX_TRUSTED_DROP, breachLine, describeCounts, guardBreaches, type TrustedCounts } from "./stats-source-guard-rules";

/** Suburb rows whose statsSource the trust gate accepts, per state. */
export async function trustedCountsByState(): Promise<TrustedCounts> {
  const rows = await prisma.$queryRaw<{ state: string; n: bigint }[]>`
    SELECT state, COUNT(*) FILTER (WHERE "statsSource" = ANY(${[...RELIABLE_SALES_SOURCES]}::text[]))::bigint AS n
    FROM "Suburb" GROUP BY state ORDER BY state`;
  return Object.fromEntries(rows.map((r) => [r.state, Number(r.n)]));
}

async function cli(): Promise<number> {
  const args = process.argv.slice(2);
  const flag = (name: string) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
  const cmd = args[0];
  if (cmd === "snapshot") {
    const out = flag("--out");
    if (!out) { console.error("stats-source-guard snapshot: --out <file> is required"); return 2; }
    const counts = await trustedCountsByState();
    writeFileSync(out, JSON.stringify({ takenAt: new Date().toISOString(), counts }, null, 2));
    console.log(`stats-source-guard: rows with a trusted sales label (${RELIABLE_SALES_SOURCES.join(", ")}) by state, before the run:`);
    for (const line of describeCounts(counts, counts)) console.log(line);
    return 0;
  }
  if (cmd === "check") {
    const states = flag("--states")?.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean) ?? [...GUARDED_STATES];
    const maxDrop = flag("--max-drop") ? Number(flag("--max-drop")) : MAX_TRUSTED_DROP;
    const file = flag("--before");
    let before: TrustedCounts;
    try {
      before = (JSON.parse(readFileSync(file ?? "", "utf8")) as { counts: TrustedCounts }).counts;
    } catch (err) {
      console.error(`!!! STATS-SOURCE GUARD FAILED (quarterly run): no snapshot to compare with (${file ?? "no --before"}: ${(err as Error).message}). Check the labels by hand: npx tsx scripts/sync/repair-stats-source.ts`);
      return 2;
    }
    const after = await trustedCountsByState();
    console.log("stats-source-guard: rows with a trusted sales label by state, before -> after:");
    for (const line of describeCounts(before, after, states)) console.log(line);
    const breaches = guardBreaches(before, after, states, maxDrop);
    for (const b of breaches) console.error(breachLine("quarterly run", b, maxDrop));
    if (breaches.length === 0) console.log(`stats-source-guard: ok (${states.join(", ")} within ${(maxDrop * 100).toFixed(0)}%)`);
    return breaches.length ? 1 : 0;
  }
  console.error("Usage: stats-source-guard.ts snapshot --out <file> | check --before <file> [--states NSW,VIC] [--max-drop 0.1]");
  return 2;
}

if (/stats-source-guard\.ts$/.test(process.argv[1] ?? "")) {
  cli()
    .then((code) => { process.exitCode = code; })
    .catch((err) => { console.error(`!!! STATS-SOURCE GUARD FAILED: ${(err as Error).message}`); process.exitCode = 2; })
    .finally(() => prisma.$disconnect());
}
