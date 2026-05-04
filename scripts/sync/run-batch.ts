/**
 * Batch wrapper — runs a fixed list of sources sequentially.
 *
 * Per-source try/catch isolates failures: one source crashing does not abort
 * the rest. Each source's own failSync() records its error in DataSource.
 *
 * Usage:
 *   npx tsx scripts/sync/run-batch.ts                  # all configured sources
 *   npx tsx scripts/sync/run-batch.ts zoning-wa flood-wa  # specific sources
 *
 * Designed for unattended Railway execution under setsid+nohup; logs every
 * step and prints a final summary table.
 */
import "dotenv/config";
import { prisma } from "./db";

interface SourceModule { run: () => Promise<void>; }

const SOURCES: Record<string, () => Promise<SourceModule>> = {
  "zoning-wa":   () => import("./sources/zoning-wa"),
  "heritage-wa": () => import("./sources/heritage-wa"),
  "flood-wa":    () => import("./sources/flood-wa"),
};

interface Result { id: string; status: "ok" | "error"; error?: string; durationMs: number; }

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const requested = argv.length > 0 ? argv : Object.keys(SOURCES);
  const unknown = requested.filter((s) => !SOURCES[s]);
  if (unknown.length > 0) {
    console.error(`Unknown sources: ${unknown.join(", ")}`);
    console.error(`Valid: ${Object.keys(SOURCES).join(", ")}`);
    process.exit(1);
  }

  console.log(`\nRunning ${requested.length} source(s) in batch: ${requested.join(", ")}\n`);

  const results: Result[] = [];
  for (const id of requested) {
    const startedAt = Date.now();
    console.log(`\n──── ${id} ────────────────────────────────`);
    try {
      const mod = await SOURCES[id]();
      await mod.run();
      const durationMs = Date.now() - startedAt;
      console.log(`──── ${id} ✓ done in ${(durationMs / 1000 / 60).toFixed(1)}m`);
      results.push({ id, status: "ok", durationMs });
    } catch (err) {
      const durationMs = Date.now() - startedAt;
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`──── ${id} ✗ failed in ${(durationMs / 1000 / 60).toFixed(1)}m: ${msg}`);
      results.push({ id, status: "error", error: msg, durationMs });
      // Continue to next source — do not abort the batch.
    }
  }

  console.log("\n══════════════════════════════════════════");
  console.log("BATCH SUMMARY");
  console.log("══════════════════════════════════════════");
  for (const r of results) {
    const icon = r.status === "ok" ? "✓" : "✗";
    const dur = `${(r.durationMs / 1000 / 60).toFixed(1)}m`;
    console.log(`  ${icon} ${r.id.padEnd(15)} ${dur.padStart(6)}${r.error ? "  err: " + r.error.slice(0, 80) : ""}`);
  }
  const failed = results.filter((r) => r.status === "error");
  console.log(`\n${results.length - failed.length} ok · ${failed.length} failed`);
  await prisma.$disconnect();
  if (failed.length > 0) process.exit(2);
}

main().catch((err) => { console.error("FATAL:", err); process.exit(1); });
