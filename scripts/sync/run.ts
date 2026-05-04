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
import { run as syncRentalQld }   from "./sources/rental-qld";
import { run as syncCrimeNsw }    from "./sources/crime-nsw";
import { run as syncCrimeVic }    from "./sources/crime-vic";
import { run as syncCrimeQld }    from "./sources/crime-qld";
import { run as syncCrimeSa }     from "./sources/crime-sa";
import { run as syncCrimeWa }       from "./sources/crime-wa";
import { run as syncCrimeAct }      from "./sources/crime-act";
import { run as syncSalesAbs }      from "./sources/sales-abs";
import { run as syncHousingRai }    from "./sources/housing-rai";
import { run as importSuburbs }     from "./sources/import-suburbs";
import { run as importSuburbsAll }  from "./sources/import-suburbs-all";
import { run as absCensus }         from "./sources/abs-census";
import { run as syncSalesVic }      from "./sources/sales-vic";
import { run as syncSalesSa }       from "./sources/sales-sa";
import { run as syncSalesNsw }      from "./sources/sales-nsw";
import { run as syncSalesQld }      from "./sources/sales-qld";
import { run as syncSalesWa }       from "./sources/sales-wa";
import { run as nearbySuburbs }     from "./sources/nearby-suburbs";
import { run as hazardFlood }       from "./sources/hazard-flood";
import { run as hazardBushfire }    from "./sources/hazard-bushfire";
import { run as walkability }       from "./sources/walkability";
import { run as bomClimate }        from "./sources/bom-climate";
import { run as zoningNsw }         from "./sources/zoning-nsw";
import { run as zoningVic }         from "./sources/zoning-vic";
import { run as zoningAct }         from "./sources/zoning-act";
import { run as zoningTas }         from "./sources/zoning-tas";
import { run as zoningSa }          from "./sources/zoning-sa";
import { run as zoningQld }         from "./sources/zoning-qld";
import { run as zoningWa }          from "./sources/zoning-wa";
import { run as heritageWa }        from "./sources/heritage-wa";
import { run as floodWa }           from "./sources/flood-wa";
import { run as floodVic }          from "./sources/flood-vic";
import { run as bushfireVic }       from "./sources/bushfire-vic";
import { run as heritageVic }       from "./sources/heritage-vic";
import { run as floodAct }          from "./sources/flood-act";
import { run as bushfireAct }       from "./sources/bushfire-act";
import { run as heritageAct }       from "./sources/heritage-act";
import { run as heritageNsw }       from "./sources/heritage-nsw";
import { run as heritageTas }       from "./sources/heritage-tas";
import { run as floodNsw }          from "./sources/flood-nsw";
import { run as bushfireNsw }       from "./sources/bushfire-nsw";
import { run as heritageQld }       from "./sources/heritage-qld";
import { run as floodQld }          from "./sources/flood-qld";
import { run as bushfireWa }        from "./sources/bushfire-wa";
import { run as bushfireTas }       from "./sources/bushfire-tas";

const SOURCES: Record<string, { run: () => Promise<void>; schedule: "quarterly" | "annual" }> = {
  "import-suburbs":     { run: importSuburbs,    schedule: "quarterly" },
  "import-suburbs-all": { run: importSuburbsAll, schedule: "annual"    },
  "abs-census":     { run: absCensus,        schedule: "annual"    },
  "acara-schools":  { run: syncAcaraSchools, schedule: "annual"    },
  "rental-vic":     { run: syncRentalVic,    schedule: "quarterly" },
  "rental-nsw":     { run: syncRentalNsw,    schedule: "quarterly" },
  "rental-sa":      { run: syncRentalSa,     schedule: "quarterly" },
  "rental-qld":     { run: syncRentalQld,    schedule: "quarterly" },
  "crime-nsw":      { run: syncCrimeNsw,     schedule: "quarterly" },
  "crime-vic":      { run: syncCrimeVic,     schedule: "quarterly" },
  "crime-qld":      { run: syncCrimeQld,     schedule: "quarterly" },
  "crime-sa":       { run: syncCrimeSa,      schedule: "quarterly" },
  "crime-wa":       { run: syncCrimeWa,      schedule: "annual"    },
  "crime-act":      { run: syncCrimeAct,     schedule: "quarterly" },
  "sales-abs":      { run: syncSalesAbs,     schedule: "annual"    },
  "housing-rai":    { run: syncHousingRai,   schedule: "annual"    },
  "sales-vic":      { run: syncSalesVic,     schedule: "quarterly" },
  "sales-sa":       { run: syncSalesSa,      schedule: "quarterly" },
  "sales-nsw":      { run: syncSalesNsw,     schedule: "quarterly" },
  "sales-qld":      { run: syncSalesQld,     schedule: "annual"    },
  "sales-wa":       { run: syncSalesWa,      schedule: "annual"    },
  "nearby-suburbs": { run: nearbySuburbs,    schedule: "annual"    },
  "hazard-flood":   { run: hazardFlood,     schedule: "annual"    },
  "hazard-bushfire":{ run: hazardBushfire,  schedule: "annual"    },
  "walkability":    { run: walkability,     schedule: "annual"    },
  "bom-climate":    { run: bomClimate,      schedule: "annual"    },
  "zoning-nsw":     { run: zoningNsw,       schedule: "quarterly" },
  "zoning-vic":     { run: zoningVic,       schedule: "quarterly" },
  "zoning-act":     { run: zoningAct,       schedule: "quarterly" },
  "zoning-tas":     { run: zoningTas,       schedule: "quarterly" },
  "zoning-sa":      { run: zoningSa,        schedule: "quarterly" },
  "zoning-qld":     { run: zoningQld,       schedule: "quarterly" },
  "zoning-wa":      { run: zoningWa,        schedule: "quarterly" },
  "heritage-wa":    { run: heritageWa,      schedule: "quarterly" },
  "flood-wa":       { run: floodWa,         schedule: "quarterly" },
  "flood-vic":      { run: floodVic,        schedule: "quarterly" },
  "bushfire-vic":   { run: bushfireVic,     schedule: "quarterly" },
  "heritage-vic":   { run: heritageVic,     schedule: "quarterly" },
  "flood-act":      { run: floodAct,        schedule: "quarterly" },
  "bushfire-act":   { run: bushfireAct,     schedule: "quarterly" },
  "heritage-act":   { run: heritageAct,     schedule: "quarterly" },
  "heritage-nsw":   { run: heritageNsw,     schedule: "quarterly" },
  "heritage-tas":   { run: heritageTas,     schedule: "quarterly" },
  "flood-nsw":      { run: floodNsw,        schedule: "quarterly" },
  "bushfire-nsw":   { run: bushfireNsw,     schedule: "quarterly" },
  "heritage-qld":   { run: heritageQld,     schedule: "quarterly" },
  "flood-qld":      { run: floodQld,        schedule: "annual"    },
  "bushfire-wa":    { run: bushfireWa,      schedule: "annual"    },
  "bushfire-tas":   { run: bushfireTas,     schedule: "quarterly" },
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
