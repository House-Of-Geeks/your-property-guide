/**
 * Per-source smoke validator.
 *
 * Runs each refactored overlay source with `--smoke` (dry-run, 1000
 * addresses) and reports pass/fail. Used to validate the lib refactor
 * preserved behavior — if a source's match rate is wildly different from
 * the legacy baseline, smoke fails loudly.
 *
 * Sequential: prevents network/DB contention. Each smoke is ~30-90s.
 *
 * Usage:
 *   npx tsx scripts/sync/smoke/smoke-all-sources.ts                    # all overlay sources
 *   npx tsx scripts/sync/smoke/smoke-all-sources.ts zoning-wa flood-wa # specific
 */
import "dotenv/config";

const ALL = [
  "zoning-nsw", "zoning-vic", "zoning-qld", "zoning-wa", "zoning-sa", "zoning-tas", "zoning-act",
  "flood-nsw", "flood-vic", "flood-qld", "flood-wa", "flood-act",
  "bushfire-nsw", "bushfire-vic", "bushfire-wa", "bushfire-tas", "bushfire-act",
  "heritage-nsw", "heritage-vic", "heritage-qld", "heritage-wa", "heritage-tas", "heritage-act",
];

interface Result { id: string; ok: boolean; matched: number | null; total: number | null; durationMs: number; error: string | null; }

async function smokeOne(id: string): Promise<Result> {
  const startedAt = Date.now();
  const { spawn } = await import("node:child_process");
  return new Promise<Result>((resolve) => {
    const child = spawn("npx", ["tsx", "scripts/sync/run.ts", id, "--", "--smoke"], {
      cwd: process.cwd(),
      env: process.env,
    });
    let buf = "";
    let err = "";
    child.stdout.on("data", (d) => { buf += d.toString(); });
    child.stderr.on("data", (d) => { err += d.toString(); });
    child.on("close", (code) => {
      const m = buf.match(/summary:\s+([\d,]+)\s+addresses\s+·\s+([\d,]+)\s+matched/);
      const total   = m ? parseInt(m[1].replace(/,/g, ""), 10) : null;
      const matched = m ? parseInt(m[2].replace(/,/g, ""), 10) : null;
      const ok = code === 0 && total != null;
      resolve({
        id, ok, matched, total,
        durationMs: Date.now() - startedAt,
        error: ok ? null : (err || buf.slice(-300) || `exit code ${code}`).trim(),
      });
    });
  });
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const ids = argv.length > 0 ? argv : ALL;
  console.log(`smoke-testing ${ids.length} sources sequentially…\n`);

  const results: Result[] = [];
  for (const id of ids) {
    process.stdout.write(`  ${id.padEnd(15)} … `);
    const r = await smokeOne(id);
    results.push(r);
    const dur = `${(r.durationMs / 1000).toFixed(0)}s`;
    if (r.ok) {
      const pct = r.total && r.matched != null ? ` (${(r.matched / r.total * 100).toFixed(1)}%)` : "";
      console.log(`✓  ${r.matched ?? "?"}/${r.total ?? "?"}${pct}  ${dur}`);
    } else {
      console.log(`✗  ${dur} — ${r.error?.split("\n")[0].slice(0, 80)}`);
    }
  }

  console.log("\n══════════════════════════════════════════");
  console.log("SMOKE SUMMARY");
  console.log("══════════════════════════════════════════");
  const ok = results.filter((r) => r.ok).length;
  const fail = results.length - ok;
  console.log(`${ok}/${results.length} passed · ${fail} failed`);
  if (fail > 0) {
    console.log("\nFailures:");
    for (const r of results.filter((r) => !r.ok)) {
      console.log(`  ✗ ${r.id}: ${r.error?.split("\n")[0].slice(0, 120)}`);
    }
    process.exit(2);
  }
}

main().catch((err) => { console.error("FATAL:", err); process.exit(1); });
