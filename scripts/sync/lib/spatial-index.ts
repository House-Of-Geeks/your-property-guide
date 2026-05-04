/**
 * Generic R-tree + point-in-polygon helpers.
 *
 * Extracts the spatial-match logic that was duplicated across every overlay
 * source. The runner builds the index once per ingest, then queries it for
 * every PropertyAddress.
 *
 * Successor candidate: when we migrate to PostGIS-native ST_Contains joins,
 * this module's responsibilities collapse into a single SQL statement and the
 * R-tree disappears from the hot path entirely. See
 * docs/spatial-etl-research.md §1.
 */
import RBush from "rbush";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point as turfPoint } from "@turf/helpers";
import type { OverlayPolygon } from "./types";

interface RbushEntry {
  minX: number; minY: number; maxX: number; maxY: number;
  feature: OverlayPolygon;
}

export class SpatialIndex {
  private tree: RBush<RbushEntry>;
  private resolveOnOverlap: "smallest" | "largest";

  constructor(features: OverlayPolygon[], resolveOnOverlap: "smallest" | "largest" = "smallest") {
    this.tree = new RBush<RbushEntry>();
    this.tree.load(features.map((f) => ({
      minX: f.bbox[0], minY: f.bbox[1], maxX: f.bbox[2], maxY: f.bbox[3], feature: f,
    })));
    this.resolveOnOverlap = resolveOnOverlap;
  }

  /**
   * Find the polygon containing the (lng, lat) point. Returns null if none.
   * Tie-break: smallest-area polygon wins (most specific zoning/hazard
   * designation), unless `resolveOnOverlap: "largest"` was set in config.
   */
  match(lng: number, lat: number): OverlayPolygon | null {
    const candidates = this.tree.search({ minX: lng, minY: lat, maxX: lng, maxY: lat });
    if (candidates.length === 0) return null;
    const pt = turfPoint([lng, lat]);
    const sorted = this.resolveOnOverlap === "smallest"
      ? candidates.sort((a, b) => a.feature.area - b.feature.area)
      : candidates.sort((a, b) => b.feature.area - a.feature.area);
    for (const c of sorted) {
      const polygon = { type: "Polygon" as const, coordinates: c.feature.rings };
      if (booleanPointInPolygon(pt, polygon)) return c.feature;
    }
    return null;
  }
}

/**
 * Compute bbox + area + flatten Polygon/MultiPolygon into individual outer
 * rings. Each output entry has a single outer ring and is treated as a
 * standalone polygon by the spatial index. Holes are not preserved (rare in
 * practice and would slow the index).
 */
export function flattenGeometry(
  geometry: { type: "Polygon" | "MultiPolygon"; coordinates: number[][][] | number[][][][] } | null,
): Array<{ ring: number[][]; rings: number[][][]; bbox: [number, number, number, number]; area: number }> {
  if (!geometry || !geometry.type) return [];
  const polys: number[][][][] = geometry.type === "Polygon"
    ? [geometry.coordinates as number[][][]]
    : (geometry.coordinates as number[][][][]);
  const out: Array<{ ring: number[][]; rings: number[][][]; bbox: [number, number, number, number]; area: number }> = [];
  for (const poly of polys) {
    const ring = poly[0];
    if (!ring || ring.length < 4) continue;
    let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
    for (const [lng, lat] of ring) {
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }
    out.push({
      ring,
      rings: poly,
      bbox: [minLng, minLat, maxLng, maxLat],
      area: (maxLng - minLng) * (maxLat - minLat),
    });
  }
  return out;
}
