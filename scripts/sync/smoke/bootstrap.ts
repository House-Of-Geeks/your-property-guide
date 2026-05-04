/**
 * Golden-address fixture bootstrap.
 *
 * Picks N random already-matched addresses per (overlay kind × source) pair
 * from the current PropertyOverlay table and writes them to the fixtures
 * file. The intent: capture a known-good snapshot of the matching behavior
 * so future runs can be validated against it.
 *
 * Run this AFTER an ingest you trust, then commit the fixtures file. From
 * then on, `run-smoke.ts` re-checks every fixture after each ingest and
 * fails loudly if a previously-matching address stops matching, or if its
 * code/label changes unexpectedly.
 *
 * Usage:
 *   npx tsx scripts/sync/smoke/bootstrap.ts                   # default: 10 per source
 *   npx tsx scripts/sync/smoke/bootstrap.ts --per-source=20   # custom N
 */
import "dotenv/config";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { prisma } from "../db";

interface Fixture {
  addressSlug: string;
  kind: string;
  source: string;
  expectedCode: string;
  expectedLabelStartsWith: string | null;
  capturedAt: string;
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const perArg = argv.find((a) => a.startsWith("--per-source="));
  const perSource = perArg ? parseInt(perArg.split("=")[1], 10) : 10;

  const pairs = await prisma.$queryRawUnsafe<Array<{ kind: string; source: string }>>(`
    SELECT DISTINCT kind, source FROM "PropertyOverlay" ORDER BY kind, source
  `);
  console.log(`bootstrapping fixtures for ${pairs.length} (kind, source) pairs · ${perSource} each`);

  const fixtures: Fixture[] = [];
  for (const p of pairs) {
    const rows = await prisma.$queryRawUnsafe<Array<{
      slug: string; code: string; label: string | null;
    }>>(`
      SELECT pa.slug, po.code, po.label
      FROM "PropertyOverlay" po
      JOIN "PropertyAddress" pa ON pa.id = po."addressId"
      WHERE po.kind = $1 AND po.source = $2
      ORDER BY random()
      LIMIT $3
    `, p.kind, p.source, perSource);
    for (const r of rows) {
      fixtures.push({
        addressSlug: r.slug,
        kind: p.kind,
        source: p.source,
        expectedCode: r.code,
        expectedLabelStartsWith: r.label ? r.label.slice(0, 30) : null,
        capturedAt: new Date().toISOString(),
      });
    }
    console.log(`  ${p.kind}/${p.source}: ${rows.length} fixtures`);
  }

  const out = join(__dirname, "golden-addresses.json");
  writeFileSync(out, JSON.stringify({ fixtures }, null, 2) + "\n");
  console.log(`\nwrote ${fixtures.length} fixtures to ${out}`);
  await prisma.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
