/**
 * Generic overlay-ingest orchestrator.
 *
 * Every overlay source (zoning, flood, bushfire, heritage) flows through
 * this single function. The adapter (arcgis-paginated / geojson-bulk /
 * multi-lga) is chosen by `cfg.adapter`; the orchestrator handles:
 *
 *   - sync logging (startSync / finishSync / failSync)
 *   - pre-flight: refuse to run if state has too few geocoded G-NAF rows
 *   - dedicated pg.Pool (does not share the website's connection budget)
 *   - streaming address scan in `ADDRESS_BATCH` chunks
 *   - R-tree match → buffer → COPY in `COPY_BATCH` chunks
 *   - per-source runId (every row tagged → run undoable in one DELETE)
 *   - summary log incl. coverage % and undo SQL
 *
 * Successor candidate: when we move to PostGIS-native joins, `runOverlayIngest`
 * collapses into a single SQL statement plus the existing logging/pre-flight
 * scaffolding. The adapter contract stays the same.
 */
import "dotenv/config";
import { Pool } from "pg";
import { randomUUID } from "node:crypto";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log as logRaw } from "../logger";
import { parseCli } from "./cli";
import { downloadArcGisPaginated } from "./adapters/arcgis-paginated";
import { downloadGeoJsonBulk } from "./adapters/geojson-bulk";
import { downloadMultiLga } from "./adapters/multi-lga";
import { SpatialIndex } from "./spatial-index";
import { writeOverlayBatch, type OverlayRow } from "./csv-copy";
import type { OverlayConfig, OverlayPolygon } from "./types";

const ADDRESS_BATCH = 25_000;
const COPY_BATCH    = 10_000;

async function downloadFor(cfg: OverlayConfig, log: (m: string) => void, useCache: boolean): Promise<OverlayPolygon[]> {
  switch (cfg.adapter) {
    case "arcgis-paginated": return downloadArcGisPaginated(cfg, log, useCache);
    case "geojson-bulk":     return downloadGeoJsonBulk(cfg, log, useCache);
    case "multi-lga":        return downloadMultiLga(cfg, log, useCache);
  }
}

export async function runOverlayIngest(cfg: OverlayConfig): Promise<void> {
  const opts = parseCli();
  const log = (msg: string) => logRaw(cfg.sourceId, msg);
  await startSync(cfg.sourceId);
  log(`options: ${JSON.stringify(opts)}`);
  if (opts.smoke) log(`SMOKE MODE: limit=1000, dryRun=true — no DB writes`);

  const runId = randomUUID();
  log(`runId=${runId}`);
  const pool = new Pool({ connectionString: process.env.DATABASE_URL!, max: 1 });

  try {
    // ── Pre-flight ────────────────────────────────────────────────────────
    const gnaf = await prisma.propertyAddress.count({ where: { state: cfg.state, lat: { not: null } } });
    if (gnaf < cfg.minAddressCount) {
      throw new Error(`Pre-flight failed: only ${gnaf} ${cfg.state} G-NAF rows with lat/lng (expected ≥ ${cfg.minAddressCount}).`);
    }
    log(`pre-flight: ${gnaf.toLocaleString()} ${cfg.state} G-NAF rows with coordinates ✓`);

    // ── Download polygons via the configured adapter ──────────────────────
    const features = await downloadFor(cfg, log, opts.useCache);
    if (features.length === 0) throw new Error("No polygons downloaded — aborting.");

    // ── Build R-tree ──────────────────────────────────────────────────────
    const tree = new SpatialIndex(features, cfg.resolveOnOverlap ?? "smallest");
    log(`R-tree built · ${features.length.toLocaleString()} polygons indexed`);

    // ── Stream addresses → match → write ─────────────────────────────────
    let processed = 0; let matched = 0; let unmatched = 0;
    let writeBuffer: OverlayRow[] = [];
    const ctx = { kind: cfg.overlayKind, source: cfg.overlaySource, state: cfg.state, runId };

    const client = await pool.connect();
    try {
      let cursor = opts.offset;
      while (true) {
        if (opts.limit != null && processed >= opts.limit) break;
        const remaining = opts.limit != null ? opts.limit - processed : ADDRESS_BATCH;
        const take = Math.min(ADDRESS_BATCH, remaining);
        const batch = await prisma.propertyAddress.findMany({
          where: {
            state: cfg.state,
            lat: { not: null },
            lng: { not: null },
            ...(opts.postcode ? { postcode: opts.postcode } : {}),
          },
          select: { id: true, lat: true, lng: true },
          orderBy: { id: "asc" },
          skip: cursor,
          take,
        });
        if (batch.length === 0) break;
        for (const a of batch) {
          if (a.lat == null || a.lng == null) continue;
          const m = tree.match(a.lng, a.lat);
          processed++;
          if (m) {
            matched++;
            writeBuffer.push({
              addressId: a.id,
              code:      m.code,
              label:     m.label,
              attrs:     JSON.stringify(m.attrs),
              effectiveAt: m.effectiveAt,
            });
            if (writeBuffer.length >= COPY_BATCH) {
              await writeOverlayBatch(client, writeBuffer, ctx, opts.dryRun);
              writeBuffer = [];
            }
          } else {
            unmatched++;
          }
        }
        cursor += batch.length;
        log(`  processed ${processed.toLocaleString()} · matched ${matched.toLocaleString()} · unmatched ${unmatched.toLocaleString()}`);
        if (batch.length < take) break;
      }
      if (writeBuffer.length > 0) await writeOverlayBatch(client, writeBuffer, ctx, opts.dryRun);
    } finally {
      client.release();
    }

    const matchPct = processed > 0 ? Math.round((matched / processed) * 1000) / 10 : 0;
    log(`summary: ${processed.toLocaleString()} addresses · ${matched.toLocaleString()} matched (${matchPct}%) · ${unmatched.toLocaleString()} unmatched`);
    log(`to undo this run: DELETE FROM "PropertyOverlay" WHERE "runId" = '${runId}'`);
    await finishSync(cfg.sourceId, matched, new Date());
  } catch (err) {
    await failSync(cfg.sourceId, err);
    throw err;
  } finally {
    await pool.end();
  }
}
