// Read-only data-quality audit for the suburb stats (fix item 1, "report
// mode" before any gate is enforced). Never writes to the database.
//
//   DATABASE_URL=<prod, with connection_limit=1> npx tsx scripts/seo/audit-data-quality.ts [outDir]
//
// Prints a summary and writes CSVs of gate candidates to outDir
// (default docs/seo-baselines/<today>/data-audit/):
//   region-deviation.csv   suburbs whose median is >25% off the median of their state+region
//   suspect-provenance.csv suburbs showing a price whose statsSource is not a sales feed
//   shared-population.csv  population values shared by many suburbs (wrong-geography matches)
//   growth-outliers.csv    |annual growth| > 25% (clamped at render, but the feed is wrong)
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { prisma } from "../sync/db";
import { RELIABLE_SALES_SOURCES } from "../../src/lib/suburb-data-quality";

const RELIABLE = new Set<string>(RELIABLE_SALES_SOURCES);
const outDir = process.argv[2] ?? path.join("docs", "seo-baselines", new Date().toISOString().slice(0, 10), "data-audit");
const median = (xs: number[]) => { const s = [...xs].sort((a, b) => a - b); return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : 0; };
const csv = (rows: Record<string, unknown>[], cols: string[]) => [cols.join(","), ...rows.map((r) => cols.map((c) => { const v = String(r[c] ?? ""); return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v; }).join(","))].join("\n") + "\n";

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const all = await prisma.suburb.findMany({ select: { slug: true, name: true, state: true, region: true, postcode: true, medianHousePrice: true, medianUnitPrice: true, annualGrowthHouse: true, daysOnMarket: true, population: true, statsSource: true, statsUpdatedAt: true } });
  console.log(`suburbs: ${all.length}`);

  // 1. provenance
  const bySource = new Map<string, number>();
  for (const s of all) bySource.set(s.statsSource, (bySource.get(s.statsSource) ?? 0) + 1);
  console.log("\n== statsSource distribution (reliable = " + [...RELIABLE].join(", ") + ") ==");
  for (const [k, v] of [...bySource].sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(22)} ${String(v).padStart(6)} ${RELIABLE.has(k) ? "reliable" : "unreliable → price suppressed at render"}`);
  const suspect = all.filter((s) => s.medianHousePrice > 0 && !RELIABLE.has(s.statsSource));
  console.log(`  prices stored but suppressed (unreliable source): ${suspect.length}`);
  fs.writeFileSync(path.join(outDir, "suspect-provenance.csv"), csv(suspect, ["slug", "state", "region", "statsSource", "medianHousePrice", "statsUpdatedAt"]));

  // 2. freshness
  const dates = new Map<string, { min: string; max: string }>();
  for (const s of all) { if (!s.statsUpdatedAt) continue; const d = s.statsUpdatedAt.toISOString().slice(0, 10); const e = dates.get(s.statsSource) ?? { min: d, max: d }; e.min = d < e.min ? d : e.min; e.max = d > e.max ? d : e.max; dates.set(s.statsSource, e); }
  console.log("\n== statsUpdatedAt range per source =="); for (const [k, v] of dates) console.log(`  ${k.padEnd(22)} ${v.min} → ${v.max}`);

  // 3. region-relative plausibility (reliable, priced suburbs only)
  const priced = all.filter((s) => s.medianHousePrice > 0 && RELIABLE.has(s.statsSource));
  const groups = new Map<string, number[]>();
  for (const s of priced) { const k = `${s.state}|${s.region}`; groups.set(k, [...(groups.get(k) ?? []), s.medianHousePrice]); }
  const dev = priced.map((s) => { const g = groups.get(`${s.state}|${s.region}`) ?? []; const m = median(g); return { ...s, regionMedian: m, regionN: g.length, deviationPct: m ? Math.round(((s.medianHousePrice - m) / m) * 100) : 0 }; })
    .filter((s) => s.regionN >= 5 && Math.abs(s.deviationPct) > 25).sort((a, b) => Math.abs(b.deviationPct) - Math.abs(a.deviationPct));
  console.log(`\n== region-relative gate, report mode: ${dev.length} of ${priced.length} priced suburbs are >25% off their region median (regions with ≥5 priced suburbs) ==`);
  const over = dev.filter((s) => s.deviationPct > 0).length; console.log(`  above region: ${over}, below region: ${dev.length - over}`);
  for (const s of dev.slice(0, 12)) console.log(`  ${s.slug.padEnd(34)} $${s.medianHousePrice.toLocaleString().padStart(11)} vs region $${s.regionMedian.toLocaleString().padStart(11)} (${s.region}, n=${s.regionN})  ${s.deviationPct > 0 ? "+" : ""}${s.deviationPct}%  ${s.statsSource}`);
  fs.writeFileSync(path.join(outDir, "region-deviation.csv"), csv(dev, ["slug", "state", "region", "statsSource", "medianHousePrice", "regionMedian", "regionN", "deviationPct", "population"]));

  // 4. shared population values (wrong-geography matches)
  const pop = new Map<number, string[]>();
  for (const s of all) if (s.population >= 5000) pop.set(s.population, [...(pop.get(s.population) ?? []), s.slug]);
  const shared = [...pop].filter(([, v]) => v.length >= 3).sort((a, b) => b[1].length - a[1].length);
  console.log(`\n== population values shared by ≥3 suburbs (≥5,000 people): ${shared.length} values, ${shared.reduce((a, [, v]) => a + v.length, 0)} suburbs ==`);
  for (const [p, v] of shared.slice(0, 8)) console.log(`  ${p.toLocaleString().padStart(8)} shared by ${v.length}: ${v.slice(0, 4).join(", ")}${v.length > 4 ? ", …" : ""}`);
  fs.writeFileSync(path.join(outDir, "shared-population.csv"), csv(shared.flatMap(([p, v]) => v.map((slug) => ({ population: p, sharedBy: v.length, slug }))), ["population", "sharedBy", "slug"]));

  // 5. growth outliers
  const growth = all.filter((s) => Math.abs(s.annualGrowthHouse) > 25).sort((a, b) => Math.abs(b.annualGrowthHouse) - Math.abs(a.annualGrowthHouse));
  console.log(`\n== growth outliers |annualGrowthHouse| > 25%: ${growth.length} (clamped to unknown at render) ==`);
  fs.writeFileSync(path.join(outDir, "growth-outliers.csv"), csv(growth, ["slug", "state", "statsSource", "annualGrowthHouse", "medianHousePrice"]));

  // 6. the flagged suburbs, in full
  console.log("\n== flagged suburbs ==");
  for (const slug of ["morayfield-qld-4506", "bondi-nsw-2026", "badagarang-nsw-2540", "surfers-paradise-qld-4217", "toorak-vic-3142", "cronulla-nsw-2230"]) {
    const s = all.find((x) => x.slug === slug); if (!s) { console.log(`  ${slug}: not found`); continue; }
    const g = groups.get(`${s.state}|${s.region}`) ?? [];
    console.log(`  ${slug.padEnd(28)} house=$${s.medianHousePrice.toLocaleString()} unit=$${s.medianUnitPrice.toLocaleString()} growth=${s.annualGrowthHouse}% dom=${s.daysOnMarket} pop=${s.population.toLocaleString()} region="${s.region}" (region median $${median(g).toLocaleString()}, n=${g.length}) source=${s.statsSource} updated=${s.statsUpdatedAt?.toISOString().slice(0, 10)}`);
  }
  console.log("\n== sales-stat rows for Morayfield / Bondi / Badagarang ==");
  for (const [name, state] of [["Morayfield", "QLD"], ["Bondi", "NSW"], ["Badagarang", "NSW"]] as const) {
    const rows = await prisma.suburbSalesStat.findMany({ where: { suburbName: name, state }, orderBy: { period: "desc" }, take: 5 });
    console.log(`  ${name}: ${rows.length} rows`); for (const r of rows) console.log(`     ${r.period.padEnd(8)} house=$${String(r.medianHouse).padStart(9)} (n=${r.saleCountHouse}) unit=$${String(r.medianUnit).padStart(9)} (n=${r.saleCountUnit}) source=${r.source} slug=${r.suburbSlug}`);
  }
  const ds = await prisma.dataSource.findMany();
  console.log("\n== DataSource ==");
  for (const d of ds as Array<Record<string, unknown>>) console.log(`  ${JSON.stringify(Object.fromEntries(Object.entries(d).filter(([k]) => !/config|url/i.test(k)))).slice(0, 200)}`);
  console.log(`\nCSVs written to ${outDir}`);
}
main().catch((e) => { console.error("audit failed:", e.message); process.exit(1); }).finally(() => prisma.$disconnect());
