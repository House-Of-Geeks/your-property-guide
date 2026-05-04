import "dotenv/config";
import { prisma } from "./db";

async function main() {
  // 1. PropertyOverlay coverage by kind × state
  const overlayBreakdown = await prisma.$queryRawUnsafe<Array<{
    kind: string; source: string; state: string; count: bigint; last_run: Date | null;
  }>>(`
    SELECT kind, source, state, COUNT(*)::bigint AS count, MAX("updatedAt") AS last_run
    FROM "PropertyOverlay"
    GROUP BY kind, source, state
    ORDER BY kind, state, source
  `);

  // 2. Total addresses by state (denominator for coverage %)
  const addressBaseline = await prisma.$queryRawUnsafe<Array<{
    state: string; total: bigint; with_geo: bigint;
  }>>(`
    SELECT state,
           COUNT(*)::bigint AS total,
           COUNT(*) FILTER (WHERE lat IS NOT NULL AND lng IS NOT NULL)::bigint AS with_geo
    FROM "PropertyAddress"
    GROUP BY state
    ORDER BY state
  `);

  // 3. DataSource registry — last fetched, status, record counts
  const dataSources = await prisma.dataSource.findMany({
    orderBy: [{ category: "asc" }, { id: "asc" }],
    select: { id: true, category: true, status: true, lastFetchedAt: true, recordCount: true, errorMsg: true },
  });

  // 4. Suburb-level data coverage
  const [suburbs, rentalStats, crimeStats, hazards, climate] = await Promise.all([
    prisma.suburb.count(),
    prisma.suburbRentalStat.count(),
    prisma.suburbCrimeStat.count(),
    prisma.suburbHazard.count(),
    prisma.suburbClimate.count(),
  ]);

  const rentalByState = await prisma.$queryRawUnsafe<Array<{ state: string; count: bigint; max_period: string | null }>>(`
    SELECT state, COUNT(*)::bigint AS count, MAX(period) AS max_period
    FROM "SuburbRentalStat" GROUP BY state ORDER BY state
  `);
  const crimeByState = await prisma.$queryRawUnsafe<Array<{ state: string; count: bigint; max_period: string | null }>>(`
    SELECT state, COUNT(*)::bigint AS count, MAX(period) AS max_period
    FROM "SuburbCrimeStat" GROUP BY state ORDER BY state
  `);
  const salesByState = await prisma.$queryRawUnsafe<Array<{ state: string; count: bigint; latest: Date | null; matched: bigint }>>(`
    SELECT state,
           COUNT(*)::bigint AS count,
           MAX("contractDate") AS latest,
           COUNT(*) FILTER (WHERE "addressId" IS NOT NULL)::bigint AS matched
    FROM "PropertySale" GROUP BY state ORDER BY state
  `);

  // ─── Print ─────────────────────────────────────────────────────────────
  console.log("═══════════════════════════════════════════════════════════");
  console.log("PARCEL-LEVEL OVERLAY COVERAGE (PropertyOverlay rows)");
  console.log("═══════════════════════════════════════════════════════════\n");

  const stateTotal = new Map(addressBaseline.map((r) => [r.state, Number(r.with_geo)]));

  // Pivot: kind × state with coverage %
  const states = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];
  const kinds = ["zoning", "flood", "bushfire", "heritage"];
  console.log("Coverage % by KIND × STATE (matched / addresses-with-geo):\n");
  console.log("kind     | " + states.map((s) => s.padStart(8)).join(" | "));
  console.log("---------|" + states.map(() => "----------").join("|"));
  for (const kind of kinds) {
    const row: string[] = [kind.padEnd(8)];
    for (const st of states) {
      const matchedRows = overlayBreakdown.filter((r) => r.kind === kind && r.state === st);
      const matched = matchedRows.reduce((sum, r) => sum + Number(r.count), 0);
      const denom = stateTotal.get(st) ?? 0;
      if (matched === 0) row.push(" — ".padStart(8));
      else if (denom === 0) row.push(`${matched}`.padStart(8));
      else {
        const pct = ((matched / denom) * 100).toFixed(1);
        row.push(`${pct}%`.padStart(8));
      }
    }
    console.log(row[0] + " | " + row.slice(1).join(" | "));
  }

  console.log("\nDetailed (kind / source / state / rows / last update):\n");
  for (const r of overlayBreakdown) {
    const denom = stateTotal.get(r.state) ?? 0;
    const pct = denom > 0 ? `${((Number(r.count) / denom) * 100).toFixed(1)}%` : "n/a";
    const last = r.last_run ? new Date(r.last_run).toISOString().slice(0, 10) : "n/a";
    console.log(`  ${r.kind.padEnd(9)} ${r.source.padEnd(22)} ${r.state.padEnd(4)} ${Number(r.count).toLocaleString().padStart(10)}  (${pct.padStart(6)})  ${last}`);
  }

  console.log("\nAddress baseline (G-NAF, with lat/lng):");
  for (const r of addressBaseline) {
    console.log(`  ${r.state.padEnd(4)} ${Number(r.with_geo).toLocaleString().padStart(11)} of ${Number(r.total).toLocaleString()}`);
  }

  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("SUBURB-LEVEL DATA");
  console.log("═══════════════════════════════════════════════════════════\n");
  console.log(`Suburbs:        ${suburbs.toLocaleString()}`);
  console.log(`SuburbRental:   ${rentalStats.toLocaleString()}`);
  console.log(`SuburbCrime:    ${crimeStats.toLocaleString()}`);
  console.log(`SuburbHazard:   ${hazards.toLocaleString()}`);
  console.log(`SuburbClimate:  ${climate.toLocaleString()}\n`);

  console.log("Rental by state:");
  for (const r of rentalByState) console.log(`  ${r.state.padEnd(4)} ${Number(r.count).toLocaleString().padStart(7)}  latest=${r.max_period ?? "—"}`);
  console.log("\nCrime by state:");
  for (const r of crimeByState) console.log(`  ${r.state.padEnd(4)} ${Number(r.count).toLocaleString().padStart(7)}  latest=${r.max_period ?? "—"}`);
  console.log("\nSales by state (PropertySale  total / matched-to-G-NAF):");
  for (const r of salesByState) {
    const total = Number(r.count);
    const matched = Number(r.matched);
    const pct = total > 0 ? `${((matched / total) * 100).toFixed(1)}%` : "—";
    console.log(`  ${r.state.padEnd(4)} ${total.toLocaleString().padStart(10)} / ${matched.toLocaleString().padStart(10)} (${pct})  latest=${r.latest ? new Date(r.latest).toISOString().slice(0, 10) : "—"}`);
  }

  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("DATA SOURCE REGISTRY (last sync per source)");
  console.log("═══════════════════════════════════════════════════════════\n");
  const byCat = new Map<string, typeof dataSources>();
  for (const ds of dataSources) {
    if (!byCat.has(ds.category)) byCat.set(ds.category, []);
    byCat.get(ds.category)!.push(ds);
  }
  for (const [cat, items] of byCat) {
    console.log(`-- ${cat} --`);
    for (const ds of items) {
      const last = ds.lastFetchedAt ? new Date(ds.lastFetchedAt).toISOString().slice(0, 10) : "never";
      const status = ds.status === "ok" ? "✓" : ds.status === "error" ? "✗" : ds.status === "running" ? "⟳" : "·";
      const rows = ds.recordCount?.toLocaleString() ?? "—";
      console.log(`  ${status} ${ds.id.padEnd(24)} last=${last.padEnd(11)} rows=${rows.padStart(10)}${ds.errorMsg ? "  err=" + ds.errorMsg.slice(0, 60) : ""}`);
    }
  }
  await prisma.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
