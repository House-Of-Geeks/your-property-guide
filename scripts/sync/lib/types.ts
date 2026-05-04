/**
 * Shared types for the overlay ingestion pipeline.
 *
 * Every overlay source (zoning, flood, bushfire, heritage) follows the same
 * shape: download polygons → R-tree → match against PropertyAddress → COPY
 * into PropertyOverlay. This module declares the contracts the adapters and
 * runner share so each source file becomes ~30 lines of config.
 */

export interface OverlayPolygon {
  /** [minLng, minLat, maxLng, maxLat] in WGS84 degrees. */
  bbox: [number, number, number, number];
  /** All rings of this polygon (outer + holes). First ring is the outer ring. */
  rings: number[][][];
  /** Bbox area in degrees² — used as the "smallest wins on overlap" tiebreaker. */
  area: number;
  /** Source attributes mapped through pickCode/pickLabel/pickAttrs. */
  code: string;
  label: string | null;
  attrs: Record<string, unknown>;
  effectiveAt: Date | null;
}

export type FieldMapper = (props: Record<string, unknown>) => string | null;
export type AttrsMapper = (props: Record<string, unknown>) => Record<string, unknown>;
export type DateMapper  = (props: Record<string, unknown>) => Date | null;

export interface CommonConfig {
  /** Source ID — must match a row in DataSource (e.g. "zoning-wa"). */
  sourceId: string;
  /** Overlay kind for the PropertyOverlay row. */
  overlayKind: "zoning" | "flood" | "bushfire" | "heritage";
  /** Overlay source short string (e.g. "wa-dplh-zones"). */
  overlaySource: string;
  /** Two-letter state code (NSW, VIC, QLD, WA, SA, TAS, ACT, NT). */
  state: string;
  /** Pre-flight: refuse to run if state has fewer geocoded G-NAF rows than this. */
  minAddressCount: number;
  /** Override the default smallest-area tiebreaker. */
  resolveOnOverlap?: "smallest" | "largest";
}

export interface ArcGisPaginatedConfig extends CommonConfig {
  adapter: "arcgis-paginated";
  /** ArcGIS REST FeatureServer/N or MapServer/N URL (ending in the layer ID). */
  endpoint: string;
  /** Comma-separated outFields list. Avoid "*" — overflows some endpoints. */
  outFields: string;
  /** Optional WHERE clause. Defaults to "1=1". Used when one endpoint contains
   *  multiple overlay kinds and we filter by code (e.g. Vicmap Planning has
   *  zoning, flood, bushfire, heritage all in one layer keyed by zone_code). */
  where?: string;
  pickCode:  FieldMapper;
  pickLabel: FieldMapper;
  pickAttrs?: AttrsMapper;
  pickEffectiveAt?: DateMapper;
}

export interface GeoJsonBulkConfig extends CommonConfig {
  adapter: "geojson-bulk";
  /** URL to the GeoJSON file or a ZIP containing one. */
  url: string;
  /** If the URL returns a ZIP, the entry name(s) to look for. */
  geojsonInZipPath?: string | string[];
  pickCode:  FieldMapper;
  pickLabel: FieldMapper;
  pickAttrs?: AttrsMapper;
  pickEffectiveAt?: DateMapper;
}

export interface MultiLgaConfig extends CommonConfig {
  adapter: "multi-lga";
  /** Per-LGA endpoints, all aggregated into one R-tree before matching. */
  lgas: Array<{
    id: string;
    name: string;
    endpoint: string;
    outFields: string;
    pickCode:  FieldMapper;
    pickLabel: FieldMapper;
  }>;
}

export type OverlayConfig = ArcGisPaginatedConfig | GeoJsonBulkConfig | MultiLgaConfig;

export interface CliOptions {
  dryRun:   boolean;
  /** When set, only this many addresses are processed. Used by --smoke too. */
  limit:    number | null;
  offset:   number;
  postcode: string | null;
  useCache: boolean;
  /** When true, use a smaller in-memory matching threshold for fast validation. */
  smoke:    boolean;
}

/** Helper used everywhere: trim + null-empty. */
export function s(v: unknown): string | null {
  if (v == null) return null;
  const t = String(v).trim();
  return t === "" ? null : t;
}

/** Parse an epoch-ms value (number or numeric string) into an ISO date. */
export function parseEpochMs(v: unknown): Date | null {
  if (typeof v === "number") return new Date(v);
  if (typeof v === "string" && /^-?\d+$/.test(v)) return new Date(Number(v));
  return null;
}
