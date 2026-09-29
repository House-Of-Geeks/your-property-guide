// Read-only: regenerate src/lib/data/non-localities.json, the list of Suburb
// rows that are postal delivery names, institutions or shopping-centre post
// offices rather than localities (rules in src/lib/locality-names.ts), each
// with the real suburb it belongs to when one shares its state and postcode.
//
//   DATABASE_URL=<production, connection_limit=1> npx tsx scripts/seo/non-localities.ts [--check]
//
// The site redirects every entry (next.config.ts): to its parent suburb, or
// to its postcode page when no suburb of that name shares the postcode. Run
// after a sync that creates suburb rows (import-suburbs) and commit the diff.
// --check prints the summary without writing.
import "dotenv/config";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { baseLocalityName, displayLocalityName, nonLocalityKind } from "../../src/lib/locality-names";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
const OUT = path.join(__dirname, "../../src/lib/data/non-localities.json");
const key = (name: string, state: string, postcode: string) => `${name.trim().toLowerCase()}|${state}|${postcode}`;

async function main() {
  const rows = await prisma.suburb.findMany({ select: { slug: true, name: true, state: true, postcode: true, population: true } });
  const kinds = new Map(rows.map((r) => [r.slug, nonLocalityKind(r.name, r.population)]));
  const localities = new Map(rows.filter((r) => !kinds.get(r.slug)).map((r) => [key(r.name, r.state, r.postcode), r.slug]));

  const entries = rows
    .filter((r) => kinds.get(r.slug))
    .map((r) => {
      const base = baseLocalityName(r.name);
      const parent = base ? localities.get(key(base, r.state, r.postcode)) ?? null : null;
      return { slug: r.slug, name: displayLocalityName(r.name), state: r.state, postcode: r.postcode, kind: kinds.get(r.slug)!, parent };
    })
    .sort((a, b) => a.state.localeCompare(b.state) || a.name.localeCompare(b.name) || a.postcode.localeCompare(b.postcode));

  const bad = entries.filter((e) => !/^[a-z0-9-]+$/.test(e.slug) || (e.parent && !/^[a-z0-9-]+$/.test(e.parent)));
  if (bad.length) throw new Error(`slugs that are not [a-z0-9-]: ${bad.map((e) => e.slug).join(", ")}`);

  const by = (k: string) => entries.filter((e) => e.kind === k);
  console.log(`suburb rows ${rows.length}; non-localities ${entries.length} (postal ${by("postal").length}, institution ${by("institution").length}, shopping-centre ${by("shopping-centre").length})`);
  console.log(`  redirect to the parent suburb: ${entries.filter((e) => e.parent).length}; to the postcode page: ${entries.filter((e) => !e.parent).length}`);
  if (process.argv.includes("--check")) return;
  writeFileSync(OUT, JSON.stringify({ generatedAt: new Date().toISOString().slice(0, 10), entries }, null, 1) + "\n");
  console.log("wrote", path.relative(process.cwd(), OUT));
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
