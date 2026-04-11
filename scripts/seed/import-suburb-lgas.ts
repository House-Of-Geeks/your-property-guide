/**
 * Maps every suburb in the DB to its LGA (Local Government Area) using the
 * Matthew Proctor Australian postcode dataset (postcode → lgaregion).
 *
 * LGAs provide natural, user-friendly region names (e.g., "Moreton Bay",
 * "Gold Coast", "Greater Geelong") that map to how people actually search
 * for real estate — much more intuitive than SA3 statistical areas.
 *
 * This replaces the SA3-based region values written by import-suburb-regions.ts.
 * The `region` field on Suburb is repopulated with LGA names in-place — no
 * schema changes required and the /regions pages work unchanged.
 *
 * Run: npx tsx scripts/seed/import-suburb-lgas.ts
 */
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

const CSV_URL =
  "https://raw.githubusercontent.com/matthewproctor/australianpostcodes/master/australian_postcodes.csv";

// LGA values that are not real geographic areas — skip these
const SKIP_LGAS = new Set([
  "",
  "Unincorporated ACT",
  "Unincorporated SA",
  "Unincorporated NSW",
  "No usual address",
  "Migratory - Offshore - Shipping",
  "Not Applicable",
]);

// Strip state disambiguation suffixes added when an LGA name is not unique nationally.
// e.g. "Central Highlands (Qld)" → "Central Highlands"
//      "Bayside (Vic.)" → "Bayside"
function cleanLgaName(name: string): string {
  return name.replace(/\s*\([A-Za-z.]+\)\s*$/, "").trim();
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

async function main() {
  console.log("Fetching Australian postcode dataset...");
  const res = await fetch(CSV_URL);
  if (!res.ok) throw new Error(`Failed to fetch CSV: HTTP ${res.status}`);
  const csv = await res.text();
  const lines = csv.split("\n").filter((l) => l.trim());

  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ""));
  const postcodeIdx  = headers.indexOf("postcode");
  const stateIdx     = headers.indexOf("state");
  const lgaregionIdx = headers.findIndex((h) => h === "lgaregion");

  if (lgaregionIdx === -1) throw new Error(`lgaregion column not found. Headers: ${headers.join(", ")}`);
  console.log(`CSV columns: postcode[${postcodeIdx}] state[${stateIdx}] lgaregion[${lgaregionIdx}]`);

  // Build postcode+state → LGA vote map (a postcode can span multiple LGAs —
  // pick the one with the most rows as the representative LGA)
  const votes = new Map<string, Map<string, number>>();

  for (let i = 1; i < lines.length; i++) {
    const cols      = parseCSVLine(lines[i]);
    const postcode  = cols[postcodeIdx]?.trim();
    const state     = cols[stateIdx]?.trim().toUpperCase();
    const rawLga    = cols[lgaregionIdx]?.trim();
    const lga       = rawLga ? cleanLgaName(rawLga) : "";

    if (!postcode || !state || !lga || SKIP_LGAS.has(rawLga!) || SKIP_LGAS.has(lga)) continue;

    const key = `${postcode}-${state}`;
    if (!votes.has(key)) votes.set(key, new Map());
    const m = votes.get(key)!;
    m.set(lga, (m.get(lga) ?? 0) + 1);
  }

  // Resolve to winning LGA per postcode+state
  const lookup = new Map<string, string>();
  for (const [key, m] of votes) {
    const winner = [...m.entries()].sort((a, b) => b[1] - a[1])[0][0];
    lookup.set(key, winner);
  }
  console.log(`Built LGA lookup for ${lookup.size} postcode+state combinations\n`);

  // Load all suburbs
  const suburbs = await db.suburb.findMany({
    select: { slug: true, name: true, postcode: true, state: true },
  });
  console.log(`Processing ${suburbs.length} suburbs...`);

  // Group suburbs by target LGA for batch updates
  const byLga = new Map<string, string[]>(); // lga → slugs[]
  let noMatch = 0;

  for (const suburb of suburbs) {
    const key = `${suburb.postcode}-${suburb.state}`;
    const lga = lookup.get(key);
    if (!lga) { noMatch++; continue; }
    if (!byLga.has(lga)) byLga.set(lga, []);
    byLga.get(lga)!.push(suburb.slug);
  }

  // Batch update per LGA
  let totalUpdated = 0;
  for (const [lga, slugs] of byLga) {
    const result = await db.suburb.updateMany({
      where: { slug: { in: slugs } },
      data:  { region: lga },
    });
    totalUpdated += result.count;
  }

  console.log(`✅ Updated ${totalUpdated} suburbs across ${byLga.size} LGAs`);
  console.log(`   No match: ${noMatch} suburbs (postcode not in dataset)`);

  // Summary: top LGAs by suburb count
  const sorted = [...byLga.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 25);

  console.log("\nTop 25 LGAs by suburb count:");
  sorted.forEach(([name, slugs]) => console.log(`  ${name}: ${slugs.length}`));

  // Verify all updated suburbs have a non-empty region
  const emptyRegion = await db.suburb.count({ where: { region: "" } });
  if (emptyRegion > 0) {
    console.warn(`\n⚠  ${emptyRegion} suburbs still have an empty region`);
  } else {
    console.log("\n✅ All matched suburbs now have LGA-based regions");
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
