/**
 * Repair for fix item 1, step 3: clear the postcode-level census figures that
 * scripts/seed/sync-suburb-stats-abs.ts copied onto every suburb in a
 * postcode (population + median age), and fix the Jervis Bay postcode
 * collision that labelled 67 Shoalhaven localities "Unincorp. Other
 * Territories". Rules and rationale: scripts/seed/census-rules.ts.
 *
 * Pages treat population 0 as unknown and omit the sentence, the FAQ entry
 * and the hero stat, so a cleared suburb shows nothing rather than a wrong
 * number. The suburb-level sync (abs-census) refills any suburb it can match.
 *
 *   DATABASE_URL=<prod> npx tsx scripts/seed/repair-postcode-level-census.ts            # dry run, writes a CSV
 *   DATABASE_URL=<prod> npx tsx scripts/seed/repair-postcode-level-census.ts --apply    # write
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { prisma } from "../sync/db";
import { correctedRegion, isPostcodeLevelCensusRow } from "./census-rules";

const apply = process.argv.includes("--apply");
const outDir = path.join("docs", "seo-baselines", new Date().toISOString().slice(0, 10), "data-audit");

async function main() {
  const all = await prisma.suburb.findMany({ select: { id: true, slug: true, state: true, postcode: true, region: true, population: true, medianAge: true, ownerOccupied: true, householdsFamily: true } });
  const counts = new Map<string, number>();
  for (const s of all) { const k = `${s.state}|${s.postcode}|${s.population}`; counts.set(k, (counts.get(k) ?? 0) + 1); }
  const flagged = all.filter((s) => isPostcodeLevelCensusRow({ population: s.population, ownerOccupied: s.ownerOccupied, householdsFamily: s.householdsFamily, sharedInPostcode: counts.get(`${s.state}|${s.postcode}|${s.population}`) ?? 1 }));
  const regionFixes = all.map((s) => ({ s, region: correctedRegion(s) })).filter((x) => x.region);

  const byState: Record<string, number> = {};
  for (const s of flagged) byState[s.state] = (byState[s.state] ?? 0) + 1;
  console.log(`suburbs: ${all.length}`);
  console.log(`postcode-level census copies to clear (population + medianAge → 0): ${flagged.length}  by state ${JSON.stringify(byState)}`);
  console.log(`  examples: ${flagged.slice(0, 6).map((s) => `${s.slug}:${s.population}`).join(", ")}`);
  console.log(`region fixes (NSW 2540 → Shoalhaven): ${regionFixes.length}`);

  fs.mkdirSync(outDir, { recursive: true });
  const csvPath = path.join(outDir, "postcode-level-census-cleared.csv");
  fs.writeFileSync(csvPath, ["slug,state,postcode,population,medianAge,sharedInPostcode", ...flagged.map((s) => `${s.slug},${s.state},${s.postcode},${s.population},${s.medianAge},${counts.get(`${s.state}|${s.postcode}|${s.population}`) ?? 1}`)].join("\n") + "\n");
  console.log(`wrote ${csvPath}`);

  if (!apply) { console.log("dry run: no writes (pass --apply)"); return; }

  const now = new Date();
  let cleared = 0;
  for (let i = 0; i < flagged.length; i += 500) {
    const ids = flagged.slice(i, i + 500).map((s) => s.id);
    const r = await prisma.suburb.updateMany({ where: { id: { in: ids } }, data: { population: 0, medianAge: 0, updatedAt: now } });
    cleared += r.count;
  }
  let regioned = 0;
  for (const { s, region } of regionFixes) {
    await prisma.suburb.update({ where: { id: s.id }, data: { region: region!, updatedAt: now } });
    regioned++;
  }
  console.log(`applied: cleared ${cleared} suburbs, fixed ${regioned} regions (updatedAt stamped for revalidate-paths / IndexNow)`);
}

main().catch((e) => { console.error("repair failed:", e.message); process.exit(1); }).finally(() => prisma.$disconnect());
