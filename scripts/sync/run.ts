/**
 * Data Sync Orchestrator
 *
 * Usage:
 *   npm run sync <source-id>   — run one source
 *   npm run sync all           — run all sources
 *   npm run sync quarterly     — run all quarterly sources
 *   npm run sync annual        — run all annual sources
 *
 * Add DATABASE_URL to your environment (or .env file).
 */
import "dotenv/config";
import { prisma } from "./db";
import { run as syncAcaraSchools } from "./sources/acara-schools";
import { run as syncRentalVic }   from "./sources/rental-vic";
import { run as syncRentalNsw }   from "./sources/rental-nsw";
import { run as syncRentalSa }    from "./sources/rental-sa";
import { run as syncCrimeNsw }    from "./sources/crime-nsw";
import { run as syncCrimeVic }    from "./sources/crime-vic";
import { run as syncCrimeQld }    from "./sources/crime-qld";
import { run as syncCrimeSa }     from "./sources/crime-sa";
import { run as syncCrimeWa }       from "./sources/crime-wa";
import { run as importSuburbs }     from "./sources/import-suburbs";
import { run as absCensus }         from "./sources/abs-census";
import { run as syncSalesVic }      from "./sources/sales-vic";
import { run as syncSalesSa }       from "./sources/sales-sa";

const SOURCES: Record<string, { run: () => Promise<void>; schedule: "quarterly" | "annual" }> = {
  "import-suburbs": { run: importSuburbs,    schedule: "quarterly" },
  "abs-census":     { run: absCensus,        schedule: "annual"    },
  "acara-schools":  { run: syncAcaraSchools, schedule: "annual"    },
  "rental-vic":     { run: syncRentalVic,    schedule: "quarterly" },
  "rental-nsw":     { run: syncRentalNsw,    schedule: "quarterly" },
  "rental-sa":      { run: syncRentalSa,     schedule: "quarterly" },
  "crime-nsw":      { run: syncCrimeNsw,     schedule: "quarterly" },
  "crime-vic":      { run: syncCrimeVic,     schedule: "quarterly" },
  "crime-qld":      { run: syncCrimeQld,     schedule: "quarterly" },
  "crime-sa":       { run: syncCrimeSa,      schedule: "quarterly" },
  "crime-wa":       { run: syncCrimeWa,      schedule: "annual"    },
  "sales-vic":      { run: syncSalesVic,     schedule: "quarterly" },
  "sales-sa":       { run: syncSalesSa,      schedule: "quarterly" },
};

async function main(): Promise<void> {
  const arg = process.argv[2];

  if (!arg) {
    console.log("Usage: npm run sync <source-id|all|quarterly|annual>");
    console.log("Sources:", Object.keys(SOURCES).join(", "));
    process.exit(1);
  }

  let toRun: string[];

  if (arg === "all") {
    toRun = Object.keys(SOURCES);
  } else if (arg === "quarterly") {
    toRun = Object.entries(SOURCES).filter(([, v]) => v.schedule === "quarterly").map(([k]) => k);
  } else if (arg === "annual") {
    toRun = Object.entries(SOURCES).filter(([, v]) => v.schedule === "annual").map(([k]) => k);
  } else {
    if (!SOURCES[arg]) {
      console.error(`Unknown source: ${arg}`);
      console.log("Valid sources:", Object.keys(SOURCES).join(", "));
      process.exit(1);
    }
    toRun = [arg];
  }

  console.log(`\nRunning ${toRun.length} source(s): ${toRun.join(", ")}\n`);

  const results: { id: string; status: "ok" | "error"; error?: string }[] = [];

  for (const id of toRun) {
    try {
      await SOURCES[id].run();
      results.push({ id, status: "ok" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      results.push({ id, status: "error", error: msg });
    }
  }

  console.log("\n── Summary ────────────────────────────");
  for (const r of results) {
    const icon = r.status === "ok" ? "✓" : "✗";
    console.log(`  ${icon} ${r.id}${r.error ? `: ${r.error}` : ""}`);
  }

  const failed = results.filter((r) => r.status === "error");
  if (failed.length > 0) process.exit(1);
}

main()
  .catch((err) => { console.error(err); process.exit(1); })
  .finally(() => prisma.$disconnect());
