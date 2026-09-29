// Read-only: regenerate src/lib/data/non-localities.json, the list of Suburb
// rows that are not places.
//
//   entries  rows whose URLs redirect (next.config.ts):
//            - postal delivery names, institutions and shopping-centre post
//              offices (rules in src/lib/locality-names.ts), each to the real
//              suburb of that name in its state and postcode, or to its
//              postcode page when there is none;
//            - misfiled rows, filed under a state their postcode does not
//              belong to ("Sydney, SA 2000"), each to the real suburb beside
//              it (findTwin).
//   hidden   misfiled rows with nowhere to go ("Not Disclosed", "North Pole,
//            VIC 9999"): left out of every list, and their pages answer 404.
//
//   DATABASE_URL=<production, connection_limit=1> npx tsx scripts/seo/non-localities.ts [--check]
//
// Run after a sync that creates suburb rows (import-suburbs) and commit the
// diff. --check prints the summary without writing.
import "dotenv/config";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { baseLocalityName, displayLocalityName, findTwin, nonLocalityKind } from "../../src/lib/locality-names";
import { stateMatchesPostcode } from "../../src/lib/postcode-states";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
const OUT = path.join(__dirname, "../../src/lib/data/non-localities.json");
const key = (name: string, state: string, postcode: string) => `${name.trim().toLowerCase()}|${state}|${postcode}`;
const SLUG = /^[a-z0-9-]+$/;

async function main() {
  const rows = await prisma.suburb.findMany({ select: { slug: true, name: true, state: true, postcode: true, population: true } });
  const byName = new Map(rows.map((r) => [r.slug, nonLocalityKind(r.name, r.population)]));
  const misfiled = new Set(rows.filter((r) => !byName.get(r.slug) && !stateMatchesPostcode(r)).map((r) => r.slug));
  // Real places: not a delivery name, and filed under a state the postcode belongs to.
  const places = rows.filter((r) => !byName.get(r.slug) && !misfiled.has(r.slug));
  const localities = new Map(places.map((r) => [key(r.name, r.state, r.postcode), r.slug]));

  const named = rows
    .filter((r) => byName.get(r.slug))
    .map((r) => {
      const base = baseLocalityName(r.name);
      const parent = base ? localities.get(key(base, r.state, r.postcode)) ?? null : null;
      return { slug: r.slug, name: displayLocalityName(r.name), state: r.state, postcode: r.postcode, kind: byName.get(r.slug)! as string, parent };
    });

  const twins = rows
    .filter((r) => misfiled.has(r.slug))
    .map((r) => ({ row: r, twin: findTwin(r, places) }));
  const redirected = twins
    .filter(({ row, twin }) => twin && SLUG.test(row.slug))
    .map(({ row, twin }) => ({ slug: row.slug, name: row.name, state: row.state, postcode: row.postcode, kind: "misfiled", parent: twin!.slug }));
  const hidden = twins
    .filter(({ row, twin }) => !twin || !SLUG.test(row.slug))
    .map(({ row, twin }) => ({
      slug: row.slug,
      name: row.name,
      state: row.state,
      postcode: row.postcode,
      reason: twin ? "slug cannot be a redirect source" : "no real suburb of that name in the postcode",
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const entries = [...named, ...redirected]
    .sort((a, b) => a.state.localeCompare(b.state) || a.name.localeCompare(b.name) || a.postcode.localeCompare(b.postcode));

  const bad = entries.filter((e) => !SLUG.test(e.slug) || (e.parent && !SLUG.test(e.parent)));
  if (bad.length) throw new Error(`slugs that are not [a-z0-9-]: ${bad.map((e) => e.slug).join(", ")}`);

  const by = (k: string) => entries.filter((e) => e.kind === k);
  console.log(`suburb rows ${rows.length}; not places ${entries.length + hidden.length}`);
  console.log(`  by name: postal ${by("postal").length}, institution ${by("institution").length}, shopping-centre ${by("shopping-centre").length}`);
  console.log(`    redirect to the parent suburb: ${named.filter((e) => e.parent).length}; to the postcode page: ${named.filter((e) => !e.parent).length}`);
  console.log(`  misfiled ${misfiled.size}: redirect to the real suburb ${redirected.length}; hidden ${hidden.length}`);
  for (const e of redirected) console.log(`    ${e.name}, ${e.state} ${e.postcode} -> ${e.parent}`);
  for (const h of hidden) console.log(`    hidden: ${h.name}, ${h.state} ${h.postcode} (${h.reason})`);
  if (process.argv.includes("--check")) return;
  writeFileSync(OUT, JSON.stringify({ generatedAt: new Date().toISOString().slice(0, 10), entries, hidden }, null, 1) + "\n");
  console.log("wrote", path.relative(process.cwd(), OUT));
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
