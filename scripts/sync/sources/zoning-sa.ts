/**
 * SA Land Zoning Ingest — Planning and Design Code Zones (DPLH).
 *
 * License: Government of South Australia (Department for Housing and Urban
 * Development), CC BY 4.0.
 *   "Planning and Design Code Zones data © Government of South Australia
 *    (Department for Housing and Urban Development), licensed under CC BY 4.0."
 *
 * Source: https://data.sa.gov.au/data/dataset/planning-and-design-code-zones
 * Updated: fortnightly.
 *
 * Field mapping (per the GeoJSON schema as of May 2026):
 *   value           — short zone code, e.g. "APL"        → overlay.code
 *   name            — full zone name                     → overlay.label
 *   id              — internal zone class id (e.g. Z0302) → attrs.zoneId
 *   legalstartdate  — epoch ms                            → attrs.legalStartDate / effectiveAt
 *   status                                                → attrs.status
 *
 * Notes: the GDA94 (EPSG:4283) variant is preferred — it matches G-NAF's
 * datum exactly, avoiding the ~1.8 m WGS84/GDA94 misalignment that bites
 * parcel-edge addresses (see docs/spatial-etl-research.md §2).
 */
import { runOverlayIngest } from "../lib/runner";
import { s, parseEpochMs } from "../lib/types";
import type { GeoJsonBulkConfig } from "../lib/types";

const config: GeoJsonBulkConfig = {
  adapter: "geojson-bulk",
  sourceId: "zoning-sa",
  overlayKind: "zoning",
  overlaySource: "sa-pdcode-zones",
  state: "SA",
  minAddressCount: 500_000,
  url: "https://www.dptiapps.com.au/dataportal/PDCodeZones_geojson.zip",
  geojsonInZipPath: ["PDCodeZones_GDA94.geojson", "PDCodeZones_GDA2020.geojson"],
  pickCode:  (p) => s(p.value),
  pickLabel: (p) => s(p.name),
  pickAttrs: (p) => ({
    zoneId: s(p.id),
    legalStartDate: parseEpochMs(p.legalstartdate)?.toISOString().slice(0, 10) ?? null,
    status: typeof p.status === "number" ? p.status : null,
  }),
  pickEffectiveAt: (p) => parseEpochMs(p.legalstartdate),
};

export async function run(): Promise<void> {
  await runOverlayIngest(config);
}
