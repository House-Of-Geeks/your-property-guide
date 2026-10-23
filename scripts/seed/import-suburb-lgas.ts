/**
 * Maps every suburb in the DB to its LGA (Local Government Area) using its own
 * locality, never its postcode.
 *
 * LGAs provide natural, user-friendly region names (e.g., "Moreton Bay",
 * "Gold Coast", "Greater Geelong") that map to how people actually search
 * for real estate - much more intuitive than SA3 statistical areas.
 *
 * Source: scripts/seed/data/locality-lga.json, built from the ABS ASGS
 * Edition 3 Suburbs and Localities (SAL 2021) and LGA (2025) allocation files
 * by build-locality-lga.ts. A postcode can span several councils (QLD 4305 and
 * 4306 cover Ipswich, Somerset, Scenic Rim, Toowoomba and South Burnett), so a
 * per-postcode majority is wrong for many suburbs.
 *
 * Rules:
 *   - A locality split across councils goes to the council with the largest
 *     share of its area. Every split is logged.
 *   - A suburb with no locality match keeps its existing region and is logged.
 *     There is no fallback to the postcode.
 *
 * The `region` field on Suburb is repopulated with LGA names in-place - no
 * schema changes required and the /regions pages work unchanged.
 *
 * Run: npx tsx scripts/seed/import-suburb-lgas.ts [--dry-run]
 *   --dry-run  print the diff (current -> new region) without writing
 */
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
import * as fs from "node:fs";
import * as path from "node:path";
import { planRegions, type LocalityLgaData } from "./lib/locality-lga";
dotenv.config({ path: ".env" });

const DRY_RUN = process.argv.includes("--dry-run");

async function main() {
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "data", "locality-lga.json"), "utf8"),
  ) as LocalityLgaData;

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const db = new PrismaClient({ adapter });

  try {
    console.log(DRY_RUN ? "DRY RUN - nothing will be written\n" : "");
    console.log(`Locality data: ${data.source}`);

    const suburbs = await db.suburb.findMany({
      select: { slug: true, name: true, postcode: true, state: true, region: true },
    });
    console.log(`Processing ${suburbs.length} suburbs...\n`);

    const plan = planRegions(data, suburbs);

    if (plan.splitLogged.length) {
      console.log(`Split localities (largest share wins): ${plan.splitLogged.length}`);
      for (const s of plan.splitLogged) {
        const parts = s.split!.map(([l, km2]) => `${l} ${km2} km2`).join("; ");
        console.log(`  ${s.slug} -> ${s.to}  [${parts}]`);
      }
      console.log("");
    }

    if (plan.unmatched.length || plan.ambiguous.length) {
      console.log(
        `No locality-level match, existing region kept: ${plan.unmatched.length} unmatched, ` +
          `${plan.ambiguous.length} ambiguous same-name`,
      );
      for (const s of [...plan.unmatched, ...plan.ambiguous]) {
        console.log(`  ${s.slug} (kept "${s.region}")`);
      }
      console.log("");
    }

    console.log(`Changes: ${plan.changes.length} (unchanged: ${plan.unchanged})`);
    for (const c of plan.changes) console.log(`  ${c.slug}: "${c.from}" -> "${c.to}"`);

    if (DRY_RUN) {
      console.log("\nDry run complete, no rows written.");
      return;
    }

    // Batch update per target LGA
    const byLga = new Map<string, string[]>();
    for (const c of plan.changes) {
      if (!byLga.has(c.to)) byLga.set(c.to, []);
      byLga.get(c.to)!.push(c.slug);
    }
    let totalUpdated = 0;
    for (const [lga, slugs] of byLga) {
      const result = await db.suburb.updateMany({
        where: { slug: { in: slugs } },
        data: { region: lga },
      });
      totalUpdated += result.count;
    }
    console.log(`\nUpdated ${totalUpdated} suburbs across ${byLga.size} LGAs`);

    const emptyRegion = await db.suburb.count({ where: { region: "" } });
    if (emptyRegion > 0) console.warn(`\nWarning: ${emptyRegion} suburbs still have an empty region`);
  } finally {
    await db.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
