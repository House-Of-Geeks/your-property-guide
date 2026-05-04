/**
 * ArcGIS REST FeatureServer/MapServer paginated downloader.
 *
 * Pulls polygons via the standard ArcGIS REST `/query` endpoint with
 * `f=geojson` and `resultOffset`/`resultRecordCount` pagination. Handles:
 *
 *   - retry with exponential backoff (3 attempts per page)
 *   - page-size shrink when a page consistently fails (often a single
 *     malformed row in the source DB)
 *   - skip-forward 100 rows when even the smallest page size fails (e.g. NSW
 *     Planning Portal's chronically bad rows in the BFPL layer)
 *   - the `exceededTransferLimit` flag sometimes appears top-level, sometimes
 *     under `properties` — checks both
 *   - cache to a local JSONL file (under tmpdir) to make re-runs cheap
 *
 * See docs/spatial-etl-research.md §2 for the pitfalls this guards against.
 */
import { existsSync, mkdirSync, createReadStream, createWriteStream } from "node:fs";
import { createInterface } from "node:readline";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { once } from "node:events";
import { flattenGeometry } from "../spatial-index";
import { s } from "../types";
import type { OverlayPolygon, ArcGisPaginatedConfig } from "../types";

const ARC_PAGE_SIZE = 1000;

interface ArcFeature {
  properties: Record<string, unknown>;
  geometry: { type: "Polygon" | "MultiPolygon"; coordinates: number[][][] | number[][][][] } | null;
}
interface ArcResp {
  features: ArcFeature[];
  exceededTransferLimit?: boolean;
  properties?: { exceededTransferLimit?: boolean };
}

export async function downloadArcGisPaginated(
  cfg: ArcGisPaginatedConfig,
  log: (msg: string) => void,
  useCache: boolean,
): Promise<OverlayPolygon[]> {
  const cacheDir  = join(tmpdir(), `ypg-${cfg.sourceId}`);
  const cacheFile = join(cacheDir, "polygons.jsonl");
  if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });

  if (useCache && existsSync(cacheFile)) {
    log(`using cached polygons from ${cacheFile}`);
    const cached: OverlayPolygon[] = [];
    const rl = createInterface({ input: createReadStream(cacheFile), crlfDelay: Infinity });
    for await (const line of rl) if (line) cached.push(JSON.parse(line) as OverlayPolygon);
    log(`loaded ${cached.length.toLocaleString()} polygons from cache`);
    return cached;
  }

  log(`fetching from ${cfg.endpoint}`);
  const features: OverlayPolygon[] = [];
  let offset = 0;
  let exceeded = true;

  async function fetchPage(offset: number, pageSize: number): Promise<{ json: any; sizeUsed: number }> {
    const url = `${cfg.endpoint}/query?` + new URLSearchParams({
      where: cfg.where ?? "1=1",
      outFields: cfg.outFields,
      returnGeometry: "true",
      outSR: "4326",
      f: "geojson",
      resultOffset: String(offset),
      resultRecordCount: String(pageSize),
    }).toString();

    let lastErr = "";
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
        if (res.ok) return { json: await res.json(), sizeUsed: pageSize };
        lastErr = `HTTP ${res.status}`;
      } catch (e) {
        lastErr = e instanceof Error ? e.message : String(e);
      }
      await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
    }
    if (pageSize > 50) {
      const smaller = Math.floor(pageSize / 2);
      log(`  page failed at offset ${offset} pageSize ${pageSize} (${lastErr}); shrinking to ${smaller}`);
      return await fetchPage(offset, smaller);
    }
    log(`  page failed at offset ${offset} (${lastErr}); skipping forward 100 rows`);
    return { json: { features: [], exceededTransferLimit: true }, sizeUsed: 100 };
  }

  while (exceeded) {
    const { json, sizeUsed } = await fetchPage(offset, ARC_PAGE_SIZE);
    const resp = json as ArcResp;
    if (!Array.isArray(resp.features)) {
      throw new Error(`unexpected response at offset ${offset}: ${JSON.stringify(resp).slice(0, 200)}`);
    }

    for (const f of resp.features) {
      const props = f.properties ?? {};
      const code = cfg.pickCode(props);
      if (!code) continue;
      const label = cfg.pickLabel(props);
      const attrs = cfg.pickAttrs ? cfg.pickAttrs(props) : {};
      const effectiveAt = cfg.pickEffectiveAt ? cfg.pickEffectiveAt(props) : null;

      for (const geom of flattenGeometry(f.geometry)) {
        features.push({
          bbox: geom.bbox,
          rings: geom.rings,
          area: geom.area,
          code,
          label,
          attrs,
          effectiveAt,
        });
      }
    }

    exceeded = !!(resp.exceededTransferLimit ?? resp.properties?.exceededTransferLimit);
    offset += sizeUsed;
    if (offset % 5000 === 0 || !exceeded) {
      log(`  fetched ${features.length.toLocaleString()} polygons (offset=${offset})`);
    }
  }

  log(`downloaded ${features.length.toLocaleString()} polygons total`);
  // Best-effort cache write — never crash the run if the FS rejects it.
  try {
    const ws = createWriteStream(cacheFile);
    for (const f of features) {
      if (!ws.write(JSON.stringify(f) + "\n")) await once(ws, "drain");
    }
    ws.end();
    await once(ws, "finish");
    log(`cached to ${cacheFile}`);
  } catch (e) {
    log(`cache write failed (continuing): ${e instanceof Error ? e.message : String(e)}`);
  }
  return features;
}

/** Pre-flight: probe the endpoint with a count query (filtered by `where` if provided). */
export async function arcgisPreflight(endpoint: string, where: string = "1=1"): Promise<number | null> {
  const params = new URLSearchParams({ where, returnCountOnly: "true", f: "json" });
  const url = `${endpoint}/query?${params.toString()}`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
    if (!res.ok) return null;
    const json = await res.json() as { count?: number };
    return json.count ?? null;
  } catch {
    return null;
  }
}

/** Re-export so configs can use the helper without importing from types. */
export { s };
