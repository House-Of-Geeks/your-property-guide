/**
 * Bulk GeoJSON downloader (single URL → optionally unzip → parse).
 *
 * Many AU government data portals publish full state-wide datasets as a
 * single GeoJSON file (sometimes wrapped in a ZIP). For these sources
 * pagination is irrelevant — we just download once and parse.
 *
 * Notes:
 *   - JSON.parse holds the whole file in memory. For very large files
 *     (>500MB unzipped) consider stream-json or moving to PostGIS via ogr2ogr.
 *   - Cache key is the URL's last-modified header (ETag fallback). When the
 *     source republishes, we redownload.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import AdmZip from "adm-zip";
import { flattenGeometry } from "../spatial-index";
import { s } from "../types";
import type { OverlayPolygon, GeoJsonBulkConfig } from "../types";

interface GeoFeature {
  properties: Record<string, unknown>;
  geometry: { type: "Polygon" | "MultiPolygon"; coordinates: number[][][] | number[][][][] } | null;
}
interface GeoCollection { type: "FeatureCollection"; features: GeoFeature[]; }

export async function downloadGeoJsonBulk(
  cfg: GeoJsonBulkConfig,
  log: (msg: string) => void,
  useCache: boolean,
): Promise<OverlayPolygon[]> {
  const cacheDir  = join(tmpdir(), `ypg-${cfg.sourceId}`);
  const cacheFile = join(cacheDir, "data.geojson");
  if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });

  let geojsonText: string;
  if (useCache && existsSync(cacheFile)) {
    log(`using cached GeoJSON at ${cacheFile}`);
    geojsonText = readFileSync(cacheFile, "utf8");
  } else {
    log(`downloading from ${cfg.url}`);
    const res = await fetch(cfg.url, {
      headers: { "User-Agent": "Mozilla/5.0 YourPropertyGuide/1.0" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} downloading ${cfg.url}`);
    const ct = res.headers.get("content-type") ?? "";
    const buf = Buffer.from(await res.arrayBuffer());
    log(`downloaded ${(buf.length / 1_048_576).toFixed(1)} MB`);

    // Detect ZIP vs raw GeoJSON. ZIP magic bytes start with 0x50 0x4B ("PK").
    const isZip = buf.length > 2 && buf[0] === 0x50 && buf[1] === 0x4B;
    if (isZip || ct.includes("zip")) {
      const zip = new AdmZip(buf);
      const wanted = Array.isArray(cfg.geojsonInZipPath) ? cfg.geojsonInZipPath : (cfg.geojsonInZipPath ? [cfg.geojsonInZipPath] : []);
      let entry = null;
      for (const name of wanted) {
        entry = zip.getEntry(name);
        if (entry) break;
      }
      if (!entry) {
        // Fall back: first .geojson in the archive.
        entry = zip.getEntries().find((e) => /\.geojson$/i.test(e.entryName)) ?? null;
      }
      if (!entry) {
        const names = zip.getEntries().map((e) => e.entryName).join(", ");
        throw new Error(`No GeoJSON entry found in ZIP. Entries: ${names}`);
      }
      log(`extracting ${entry.entryName} (${(entry.header.size / 1_048_576).toFixed(1)} MB)`);
      geojsonText = entry.getData().toString("utf8");
    } else if (ct.includes("text/html")) {
      throw new Error("Got HTML instead of GeoJSON/ZIP — endpoint may have moved or requires auth");
    } else {
      geojsonText = buf.toString("utf8");
    }

    writeFileSync(cacheFile, geojsonText);
    log(`cached to ${cacheFile}`);
  }

  log("parsing GeoJSON…");
  const fc = JSON.parse(geojsonText) as GeoCollection;
  if (!Array.isArray(fc.features)) throw new Error("Not a FeatureCollection");
  log(`read ${fc.features.length.toLocaleString()} raw features`);

  const features: OverlayPolygon[] = [];
  for (const f of fc.features) {
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
        code, label, attrs, effectiveAt,
      });
    }
  }
  log(`parsed ${features.length.toLocaleString()} polygon rings`);
  return features;
}

export { s };
