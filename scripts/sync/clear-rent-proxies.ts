/**
 * Clear census rent proxies from suburbs no rental feed covers.
 *
 * In a state with a bond-data feed (see sources/rent-proxy-rules.ts) the
 * feed is the authority for rents. Suburbs the feed does not publish still
 * carry the 2021 Census all-dwellings rent (or a seed value) in
 * medianRentHouse / medianRentUnit, which renders as a house rent and a
 * yield. This sets both to 0 (unknown) and clears rentalUpdatedAt, which
 * the old NSW feed stamped on every suburb regardless.
 *
 * Usage:
 *   npx tsx scripts/sync/clear-rent-proxies.ts [--state NSW] [--apply] [--out <csv>]
 *
 * Dry run by default: prints the plan and writes a CSV of the rows with
 * their current values (the rollback record) under docs/seo-baselines/.
 * --apply performs the update and stamps updatedAt so revalidate-paths and
 * indexnow-ping pick the pages up.
 */
import "dotenv/config";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { prisma } from "./db";
import { RENTAL_FEED_STATES, hasRentalFeed } from "./sources/rent-proxy-rules";

const args = process.argv.slice(2);
const flag = (name: string) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const APPLY = args.includes("--apply");
const STATE = (flag("--state") ?? "NSW").toUpperCase();
const today = new Date().toISOString().slice(0, 10);
const OUT = flag("--out") ?? `docs/seo-baselines/${today}/data-audit/${STATE.toLowerCase()}-rent-proxies-cleared.csv`;

async function uncoveredWithRent(state: string) {
  const covered = new Set(
    (await prisma.suburbRentalStat.findMany({ where: { state, suburbSlug: { not: null } }, distinct: ["suburbSlug"], select: { suburbSlug: true } }))
      .map((r) => r.suburbSlug as string),
  );
  const rows = await prisma.suburb.findMany({
    where: { state, OR: [{ medianRentHouse: { gt: 0 } }, { medianRentUnit: { gt: 0 } }] },
    select: { id: true, slug: true, name: true, postcode: true, medianRentHouse: true, medianRentUnit: true, rentalUpdatedAt: true, statsSource: true },
    orderBy: { slug: "asc" },
  });
  return { covered: covered.size, targets: rows.filter((r) => !covered.has(r.slug)) };
}

async function main() {
  if (!hasRentalFeed(STATE)) {
    throw new Error(`${STATE} has no rental feed; the census proxy is the only rent there and stays. States with a feed: ${RENTAL_FEED_STATES.join(", ")}`);
  }
  const { covered, targets } = await uncoveredWithRent(STATE);
  console.log(`${STATE}: ${covered} suburbs covered by a rental feed; ${targets.length} uncovered suburbs still carry a rent (house ${targets.filter((r) => r.medianRentHouse > 0).length}, unit ${targets.filter((r) => r.medianRentUnit > 0).length})`);
  for (const r of targets.slice(0, 6)) console.log(`  ${r.slug}: house $${r.medianRentHouse}, unit $${r.medianRentUnit}, statsSource ${r.statsSource}`);

  const csv = ["slug,name,postcode,medianRentHouse,medianRentUnit,rentalUpdatedAt,statsSource",
    ...targets.map((r) => [r.slug, JSON.stringify(r.name), r.postcode, r.medianRentHouse, r.medianRentUnit, r.rentalUpdatedAt?.toISOString() ?? "", r.statsSource].join(","))].join("\n");
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, csv + "\n");
  console.log(`rollback record: ${OUT} (${targets.length} rows)`);

  for (const other of RENTAL_FEED_STATES.filter((s) => s !== STATE)) {
    const o = await uncoveredWithRent(other);
    console.log(`  for information, ${other}: ${o.targets.length} uncovered suburbs carry a rent (${o.covered} covered)`);
  }

  if (!APPLY) { console.log("dry run: no writes (add --apply)"); return; }
  if (targets.length === 0) { console.log("nothing to clear"); return; }

  const n = await prisma.$executeRaw`
    UPDATE "Suburb"
    SET "medianRentHouse" = 0, "medianRentUnit" = 0, "rentalUpdatedAt" = NULL, "updatedAt" = NOW()
    WHERE id = ANY(${targets.map((r) => r.id)}::text[])
  `;
  console.log(`cleared rents on ${n} ${STATE} suburbs`);
}

main().catch((err) => { console.error(err); process.exitCode = 1; }).finally(() => prisma.$disconnect());
