/**
 * Maps every suburb in the DB to its SA3 region using the Matthew Proctor
 * Australian postcode dataset (postcode → SA3 name).
 *
 * SA3 areas (~340 across Australia) are a good proxy for colloquial regions
 * (Gold Coast, Sunshine Coast, Northern Beaches, Inner West, etc.) and map
 * cleanly to how people search for real estate.
 *
 * Run: npx tsx scripts/seed/import-suburb-regions.ts
 */
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

const CSV_URL =
  "https://raw.githubusercontent.com/matthewproctor/australianpostcodes/master/australian_postcodes.csv";

// SA3 names that are not real geographic regions — skip these
const SKIP_REGIONS = new Set([
  "No usual address",
  "Migratory - Offshore - Shipping",
  "Not Applicable",
  "",
]);

// State name values already in the DB that we want to overwrite
const STATE_NAMES = new Set([
  "Queensland",
  "New South Wales",
  "Victoria",
  "Western Australia",
  "South Australia",
  "Tasmania",
  "Northern Territory",
  "Australian Capital Territory",
]);

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
  const postcodeIdx = headers.indexOf("postcode");
  const stateIdx    = headers.indexOf("state");
  const sa3nameIdx  = headers.findIndex((h) => h === "sa3name");

  if (sa3nameIdx === -1) throw new Error(`sa3name column not found. Headers: ${headers.join(", ")}`);
  console.log(`CSV columns found: postcode[${postcodeIdx}] state[${stateIdx}] sa3name[${sa3nameIdx}]`);

  // Build postcode+state → SA3 vote map (handle postcodes spanning multiple SA3s)
  const votes = new Map<string, Map<string, number>>();

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    const postcode = cols[postcodeIdx]?.trim();
    const state    = cols[stateIdx]?.trim().toUpperCase();
    const sa3name  = cols[sa3nameIdx]?.trim();

    if (!postcode || !state || !sa3name || SKIP_REGIONS.has(sa3name)) continue;

    const key = `${postcode}-${state}`;
    if (!votes.has(key)) votes.set(key, new Map());
    const m = votes.get(key)!;
    m.set(sa3name, (m.get(sa3name) ?? 0) + 1);
  }

  // Resolve to winning SA3 per postcode+state
  const lookup = new Map<string, string>();
  for (const [key, m] of votes) {
    const winner = [...m.entries()].sort((a, b) => b[1] - a[1])[0][0];
    lookup.set(key, winner);
  }
  console.log(`Built SA3 lookup for ${lookup.size} postcode+state combinations\n`);

  // Load all suburbs
  const suburbs = await db.suburb.findMany({
    select: { slug: true, name: true, postcode: true, state: true, region: true },
  });
  console.log(`Processing ${suburbs.length} suburbs...`);

  // Group suburbs by target SA3 for batch updates
  const byRegion = new Map<string, string[]>(); // sa3name → slugs[]
  let noMatch = 0;

  for (const suburb of suburbs) {
    const key = `${suburb.postcode}-${suburb.state}`;
    const sa3 = lookup.get(key);
    if (!sa3) { noMatch++; continue; }
    if (!byRegion.has(sa3)) byRegion.set(sa3, []);
    byRegion.get(sa3)!.push(suburb.slug);
  }

  // Batch update per region
  let totalUpdated = 0;
  for (const [sa3, slugs] of byRegion) {
    const result = await db.suburb.updateMany({
      where: { slug: { in: slugs } },
      data:  { region: sa3 },
    });
    totalUpdated += result.count;
  }

  console.log(`✅ Updated ${totalUpdated} suburbs across ${byRegion.size} SA3 regions`);
  console.log(`   No match: ${noMatch} suburbs`);

  // Summary: top regions
  const sorted = [...byRegion.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 25);

  console.log("\nTop 25 regions by suburb count:");
  sorted.forEach(([name, slugs]) => console.log(`  ${name}: ${slugs.length}`));

  // Verify no state-name regions remain
  const remaining = await db.suburb.count({
    where: { region: { in: [...STATE_NAMES] } },
  });
  if (remaining > 0) {
    console.warn(`\n⚠  ${remaining} suburbs still have state-level region (no postcode match)`);
  } else {
    console.log("\n✅ All suburbs now have SA3-level regions");
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
