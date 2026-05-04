/**
 * Golden-address smoke runner.
 *
 * Re-checks every fixture in golden-addresses.json against the current
 * PropertyOverlay table. Fails loudly if a known-good address stops
 * matching, or if its code/label changes unexpectedly — catches the
 * "source silently changed schema" failure mode that otherwise only shows
 * up in production user reports.
 *
 * Exit codes:
 *   0 — all fixtures pass
 *   2 — any fixture failed (regression)
 *   3 — fixtures file missing or empty (run bootstrap.ts first)
 *
 * Usage:
 *   npx tsx scripts/sync/smoke/run-smoke.ts                    # all kinds
 *   npx tsx scripts/sync/smoke/run-smoke.ts --kind=zoning     # one kind
 *   npx tsx scripts/sync/smoke/run-smoke.ts --source=vic-vicmap-zoning
 */
import "dotenv/config";
import { existsSync, readFileSync } from "node:fs";
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
  const filterKind   = argv.find((a) => a.startsWith("--kind="))?.split("=")[1];
  const filterSource = argv.find((a) => a.startsWith("--source="))?.split("=")[1];

  const fixturesPath = join(__dirname, "golden-addresses.json");
  if (!existsSync(fixturesPath)) {
    console.error(`No fixtures at ${fixturesPath}. Run bootstrap.ts first.`);
    process.exit(3);
  }
  const { fixtures } = JSON.parse(readFileSync(fixturesPath, "utf8")) as { fixtures: Fixture[] };
  if (!fixtures.length) {
    console.error("Fixtures file is empty.");
    process.exit(3);
  }

  let active = fixtures;
  if (filterKind)   active = active.filter((f) => f.kind   === filterKind);
  if (filterSource) active = active.filter((f) => f.source === filterSource);
  console.log(`running ${active.length} fixtures` + (filterKind ? ` (kind=${filterKind})` : "") + (filterSource ? ` (source=${filterSource})` : ""));

  let pass = 0;
  let fail = 0;
  const failures: string[] = [];

  for (const f of active) {
    const row = await prisma.$queryRawUnsafe<Array<{ code: string; label: string | null }>>(`
      SELECT po.code, po.label
      FROM "PropertyOverlay" po
      JOIN "PropertyAddress" pa ON pa.id = po."addressId"
      WHERE pa.slug = $1 AND po.kind = $2 AND po.source = $3
      LIMIT 1
    `, f.addressSlug, f.kind, f.source);

    const got = row[0];
    if (!got) {
      fail++;
      failures.push(`MISSING ${f.kind}/${f.source} on ${f.addressSlug} (expected code=${f.expectedCode})`);
      continue;
    }
    if (got.code !== f.expectedCode) {
      fail++;
      failures.push(`CODE_DRIFT ${f.kind}/${f.source} on ${f.addressSlug}: got=${got.code}, expected=${f.expectedCode}`);
      continue;
    }
    if (f.expectedLabelStartsWith && (!got.label || !got.label.startsWith(f.expectedLabelStartsWith))) {
      fail++;
      failures.push(`LABEL_DRIFT ${f.kind}/${f.source} on ${f.addressSlug}: got=${got.label?.slice(0, 30) ?? "null"}, expected starts with ${f.expectedLabelStartsWith}`);
      continue;
    }
    pass++;
  }

  console.log(`\n${pass}/${active.length} pass · ${fail} fail`);
  for (const msg of failures.slice(0, 20)) console.log(`  ✗ ${msg}`);
  if (failures.length > 20) console.log(`  … and ${failures.length - 20} more`);

  await prisma.$disconnect();
  process.exit(fail > 0 ? 2 : 0);
}

main().catch((err) => { console.error(err); process.exit(1); });
