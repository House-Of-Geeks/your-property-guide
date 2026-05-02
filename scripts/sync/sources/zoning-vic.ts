/**
 * VIC Land Zoning Ingest (Vicmap Planning — Planning Scheme Zone Polygon)
 *
 * Same architecture as zoning-nsw.ts; only endpoint and field mapping differ.
 *
 * License: CC BY 4.0 — © State of Victoria (Department of Transport and Planning)
 *   "Vicmap Planning — Planning Scheme Zone, licensed under CC BY 4.0."
 *
 * Source endpoint:
 *   https://services-ap1.arcgis.com/P744lA0wf4LlBZ84/ArcGIS/rest/services/Vicmap_Planning/FeatureServer/3
 *
 * Field mapping:
 *   zone_code        → overlay.code         (e.g. "GRZ1", "C1Z")
 *   zone_description → overlay.label        (friendly text)
 *   lga              → attrs.lga
 *   scheme_code      → attrs.schemeCode
 *
 * CLI flags:
 *   --dry-run            — fetch + index but skip DB writes
 *   --limit=N            — process only first N addresses (smoke test)
 *   --offset=N           — start from address row N (resume after crash)
 *   --postcode=2000      — process only this postcode (debug)
 *   --no-cache           — re-fetch zoning polygons from network
 */
import "dotenv/config";
import { Pool, type PoolClient } from "pg";
import { from as copyFrom } from "pg-copy-streams";
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, createReadStream, createWriteStream } from "node:fs";
import { createInterface } from "node:readline";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import RBush from "rbush";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point as turfPoint } from "@turf/helpers";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";

const SOURCE_ID = "zoning-vic";
const OVERLAY_KIND = "zoning";
const OVERLAY_SOURCE = "vic-vicmap-zoning";
const STATE = "VIC";
const ARC_BASE = "https://services-ap1.arcgis.com/P744lA0wf4LlBZ84/ArcGIS/rest/services/Vicmap_Planning/FeatureServer/3";
const CACHE_DIR = join(process.cwd(), ".cache", "zoning-vic");
const CACHE_FILE = join(CACHE_DIR, "polygons.jsonl");

const ARC_PAGE_SIZE = 1000;          // ArcGIS maxRecordCount
const ADDRESS_BATCH = 25_000;        // streamed in batches
const COPY_BATCH    = 10_000;        // COPY chunk size

// ─── CLI ────────────────────────────────────────────────────────────────────

interface CliOptions {
  dryRun:   boolean;
  limit:    number | null;
  offset:   number;
  postcode: string | null;
  useCache: boolean;
}

function parseCli(): CliOptions {
  const args = process.argv.slice(2);
  const get = (n: string): string | null => {
    const a = args.find((s) => s.startsWith(`--${n}=`));
    return a ? a.split("=").slice(1).join("=") : null;
  };
  const has = (n: string): boolean => args.includes(`--${n}`);
  return {
    dryRun:   has("dry-run"),
    limit:    get("limit") ? parseInt(get("limit")!, 10) : null,
    offset:   get("offset") ? parseInt(get("offset")!, 10) : 0,
    postcode: get("postcode"),
    useCache: !has("no-cache"),
  };
}

// ─── Polygon download (paginated ArcGIS REST → GeoJSON) ─────────────────────

interface ZoningFeature {
  bbox: [number, number, number, number];  // [minLng, minLat, maxLng, maxLat]
  ring: number[][];                         // outer ring as [lng, lat] pairs
  rings: number[][][];                      // all rings (for multipolygons)
  area: number;                             // approximate bbox area (selectivity tiebreaker)
  zoneCode: string;
  zoneLabel: string | null;
  schemeCode: string | null;
  lga: string | null;
}

async function downloadPolygons(useCache: boolean): Promise<ZoningFeature[]> {
  if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });

  if (useCache && existsSync(CACHE_FILE)) {
    log(SOURCE_ID, `using cached polygons from ${CACHE_FILE}`);
    const cached: ZoningFeature[] = [];
    const rl = createInterface({ input: createReadStream(CACHE_FILE), crlfDelay: Infinity });
    for await (const line of rl) {
      if (line) cached.push(JSON.parse(line) as ZoningFeature);
    }
    log(SOURCE_ID, `loaded ${cached.length} polygons from cache`);
    return cached;
  }

  log(SOURCE_ID, `fetching zoning polygons from ${ARC_BASE}`);
  const features: ZoningFeature[] = [];
  let offset = 0;
  let exceeded = true;

  // Fetch a single page with retry + page-shrink fallback. Returns the parsed
  // JSON or throws. If a particular row breaks the server, halve the page
  // size and retry within the same offset range.
  async function fetchPage(offset: number, pageSize: number): Promise<{ json: any; sizeUsed: number }> {
    const url = `${ARC_BASE}/query?` + new URLSearchParams({
      where: "1=1",
      outFields: "zone_code,zone_description,scheme_code,lga",
      returnGeometry: "true",
      outSR: "4326",
      f: "geojson",
      resultOffset: String(offset),
      resultRecordCount: String(pageSize),
    }).toString();

    let lastErr = "";
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetch(url);
        if (res.ok) return { json: await res.json(), sizeUsed: pageSize };
        lastErr = `HTTP ${res.status}`;
      } catch (e) {
        lastErr = e instanceof Error ? e.message : String(e);
      }
      await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
    }
    if (pageSize > 50) {
      const smaller = Math.floor(pageSize / 2);
      log(SOURCE_ID, `  page failed at offset ${offset} pageSize ${pageSize} (${lastErr}); shrinking to ${smaller}`);
      return await fetchPage(offset, smaller);
    }
    throw new Error(`fetch failed at offset ${offset} even at minimum page size: ${lastErr}`);
  }

  while (exceeded) {
    const { json, sizeUsed } = await fetchPage(offset, ARC_PAGE_SIZE);
    type ArcFeature = {
      properties: Record<string, string | null>;
      geometry: { type: "Polygon" | "MultiPolygon"; coordinates: number[][][] | number[][][][] };
    };
    type ArcResp = {
      features: ArcFeature[];
      exceededTransferLimit?: boolean;
      properties?: { exceededTransferLimit?: boolean };
    };
    const resp = json as ArcResp;
    if (!Array.isArray(resp.features)) {
      throw new Error(`unexpected response at offset ${offset}: ${JSON.stringify(resp).slice(0, 200)}`);
    }

    for (const f of resp.features) {
      const polys: number[][][][] = f.geometry.type === "Polygon"
        ? [f.geometry.coordinates as number[][][]]
        : (f.geometry.coordinates as number[][][][]);

      for (const poly of polys) {
        const ring = poly[0];   // outer ring
        if (!ring || ring.length < 4) continue;

        let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
        for (const [lng, lat] of ring) {
          if (lng < minLng) minLng = lng;
          if (lng > maxLng) maxLng = lng;
          if (lat < minLat) minLat = lat;
          if (lat > maxLat) maxLat = lat;
        }
        features.push({
          bbox: [minLng, minLat, maxLng, maxLat],
          ring,
          rings: poly,
          area: (maxLng - minLng) * (maxLat - minLat),
          zoneCode:   String(f.properties.zone_code ?? "").trim(),
          zoneLabel:  f.properties.zone_description ? String(f.properties.zone_description).trim() : null,
          schemeCode: f.properties.scheme_code ? String(f.properties.scheme_code).trim() : null,
          lga:        f.properties.lga         ? String(f.properties.lga).trim()         : null,
        });
      }
    }

    exceeded = !!(resp.exceededTransferLimit ?? resp.properties?.exceededTransferLimit);
    offset += sizeUsed;
    if (offset % 5000 === 0 || !exceeded) {
      log(SOURCE_ID, `  fetched ${features.length} polygons (offset=${offset})`);
    }
  }

  log(SOURCE_ID, `downloaded ${features.length} zoning polygons total`);
  // Stream-write JSONL (V8's string length cap blows up on JSON.stringify of 70k+ polygons)
  const ws = createWriteStream(CACHE_FILE);
  await new Promise<void>((resolve, reject) => {
    ws.on("error", reject);
    ws.on("finish", resolve);
    for (const f of features) ws.write(JSON.stringify(f) + "\n");
    ws.end();
  });
  log(SOURCE_ID, `cached to ${CACHE_FILE}`);
  return features;
}

// ─── Spatial index ──────────────────────────────────────────────────────────

interface RbushEntry {
  minX: number; minY: number; maxX: number; maxY: number;
  feature: ZoningFeature;
}

function buildIndex(features: ZoningFeature[]): RBush<RbushEntry> {
  const tree = new RBush<RbushEntry>();
  const items: RbushEntry[] = features.map((f) => ({
    minX: f.bbox[0], minY: f.bbox[1], maxX: f.bbox[2], maxY: f.bbox[3], feature: f,
  }));
  tree.load(items);
  return tree;
}

interface MatchResult {
  zoneCode:   string;
  zoneLabel:  string | null;
  schemeCode: string | null;
  lga:        string | null;
}

function matchPoint(tree: RBush<RbushEntry>, lng: number, lat: number): MatchResult | null {
  const candidates = tree.search({ minX: lng, minY: lat, maxX: lng, maxY: lat });
  if (candidates.length === 0) return null;
  const pt = turfPoint([lng, lat]);

  // Prefer the smallest-area polygon when multiple match (most specific zone).
  const sorted = candidates.sort((a, b) => a.feature.area - b.feature.area);
  for (const c of sorted) {
    const polygon = { type: "Polygon" as const, coordinates: c.feature.rings };
    if (booleanPointInPolygon(pt, polygon)) {
      return {
        zoneCode:   c.feature.zoneCode,
        zoneLabel:  c.feature.zoneLabel,
        schemeCode: c.feature.schemeCode,
        lga:        c.feature.lga,
      };
    }
  }
  return null;
}

// ─── COPY writer ────────────────────────────────────────────────────────────

interface OverlayRow {
  addressId: string;
  code:      string;
  label:     string | null;
  attrs:     string;            // JSON-stringified
  effectiveAt: Date | null;
}

function csvField(v: string | number | Date | null | undefined): string {
  if (v == null) return "\\N";
  if (v instanceof Date) return v.toISOString();
  const s = String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

async function writeBatch(
  client: PoolClient,
  rows: OverlayRow[],
  runId: string,
  dryRun: boolean,
): Promise<{ inserted: number; updated: number }> {
  if (rows.length === 0) return { inserted: 0, updated: 0 };
  if (dryRun) return { inserted: rows.length, updated: 0 };

  const COPY_COLS = ["id", "addressId", "kind", "source", "code", "label", "attrs", "state", "runId", "effectiveAt", "createdAt", "updatedAt"];
  const colsQuoted = COPY_COLS.map((c) => `"${c}"`).join(",");

  await client.query("BEGIN");
  try {
    await client.query(`CREATE TEMP TABLE _overlay_load (LIKE "PropertyOverlay" INCLUDING DEFAULTS) ON COMMIT DROP`);

    const stream = client.query(copyFrom(`COPY _overlay_load (${colsQuoted}) FROM STDIN WITH (FORMAT csv, NULL '\\N')`));
    const now = new Date();
    const csvLines = rows.map((r) => {
      const id = `pov_${randomUUID().replace(/-/g, "").slice(0, 24)}`;
      return [
        csvField(id),
        csvField(r.addressId),
        csvField(OVERLAY_KIND),
        csvField(OVERLAY_SOURCE),
        csvField(r.code),
        csvField(r.label),
        csvField(r.attrs),
        csvField(STATE),
        csvField(runId),
        csvField(r.effectiveAt),
        csvField(now),
        csvField(now),
      ].join(",");
    });
    await pipeline(Readable.from(csvLines.map((l) => l + "\n")), stream);

    // Upsert: zone changes flow through, runId always reflects latest pass
    const result = await client.query(`
      INSERT INTO "PropertyOverlay" (${colsQuoted})
      SELECT ${colsQuoted} FROM _overlay_load
      ON CONFLICT ("addressId", kind, source) DO UPDATE
        SET code        = EXCLUDED.code,
            label       = EXCLUDED.label,
            attrs       = EXCLUDED.attrs,
            "runId"     = EXCLUDED."runId",
            "updatedAt" = EXCLUDED."updatedAt"
    `);
    await client.query("COMMIT");
    return { inserted: result.rowCount ?? 0, updated: 0 };
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    throw err;
  }
}

// ─── Pre-flight ─────────────────────────────────────────────────────────────

async function preflight(): Promise<void> {
  const gnaf = await prisma.propertyAddress.count({ where: { state: STATE, lat: { not: null } } });
  if (gnaf < 1_000_000) {
    throw new Error(`Pre-flight failed: only ${gnaf} VIC G-NAF rows with lat/lng (expected ≥ 1M).`);
  }
  log(SOURCE_ID, `pre-flight: ${gnaf.toLocaleString()} VIC G-NAF rows with coordinates ✓`);

  // Probe ArcGIS endpoint (HEAD-equivalent — count query is the cheapest)
  const url = `${ARC_BASE}/query?where=1=1&returnCountOnly=true&f=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`ArcGIS endpoint unreachable: HTTP ${res.status}`);
  const json = await res.json() as { count: number };
  log(SOURCE_ID, `pre-flight: ArcGIS reports ${json.count?.toLocaleString() ?? "?"} zoning polygons available ✓`);
}

// ─── Orchestrator ───────────────────────────────────────────────────────────

export async function run(): Promise<void> {
  const opts = parseCli();
  await startSync(SOURCE_ID);
  log(SOURCE_ID, `options: ${JSON.stringify(opts)}`);

  const runId = randomUUID();
  log(SOURCE_ID, `runId=${runId}`);

  const pool = new Pool({ connectionString: process.env.DATABASE_URL!, max: 1 });

  try {
    await preflight();
    const features = await downloadPolygons(opts.useCache);
    if (features.length === 0) throw new Error("No zoning polygons downloaded — aborting.");
    const tree = buildIndex(features);
    log(SOURCE_ID, `R-tree built · ${features.length} polygons indexed`);

    // Stream addresses
    let processed = 0;
    let matched   = 0;
    let unmatched = 0;
    let writeBuffer: OverlayRow[] = [];

    const client = await pool.connect();
    try {
      let cursor = opts.offset;
      while (true) {
        if (opts.limit != null && processed >= opts.limit) break;

        const remaining = opts.limit != null ? opts.limit - processed : ADDRESS_BATCH;
        const take = Math.min(ADDRESS_BATCH, remaining);

        const batch = await prisma.propertyAddress.findMany({
          where: {
            state: STATE,
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
          const m = matchPoint(tree, a.lng, a.lat);
          processed++;
          if (m) {
            matched++;
            writeBuffer.push({
              addressId: a.id,
              code:      m.zoneCode,
              label:     m.zoneLabel,
              attrs:     JSON.stringify({ schemeCode: m.schemeCode, lga: m.lga }),
              effectiveAt: null,
            });
            if (writeBuffer.length >= COPY_BATCH) {
              await writeBatch(client, writeBuffer, runId, opts.dryRun);
              writeBuffer = [];
            }
          } else {
            unmatched++;
          }
        }
        cursor += batch.length;
        log(SOURCE_ID, `  processed ${processed.toLocaleString()} · matched ${matched.toLocaleString()} · unmatched ${unmatched.toLocaleString()}`);
        if (batch.length < take) break;
      }

      if (writeBuffer.length > 0) {
        await writeBatch(client, writeBuffer, runId, opts.dryRun);
      }
    } finally {
      client.release();
    }

    const matchPct = processed > 0 ? Math.round((matched / processed) * 1000) / 10 : 0;
    log(SOURCE_ID, `summary: ${processed.toLocaleString()} addresses · ${matched.toLocaleString()} matched (${matchPct}%) · ${unmatched.toLocaleString()} unmatched`);
    log(SOURCE_ID, `to undo this run: DELETE FROM "PropertyOverlay" WHERE "runId" = '${runId}'`);

    await finishSync(SOURCE_ID, matched, new Date());
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  } finally {
    await pool.end();
  }
}
