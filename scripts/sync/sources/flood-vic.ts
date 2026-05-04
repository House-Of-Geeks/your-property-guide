/**
 * VIC Flood Overlays Ingest — Vicmap Planning Overlay (LSIO/FO/SBO).
 *
 * License: Government of Victoria, CC BY 4.0.
 *
 * Source endpoint (same Vicmap layer as bushfire-vic and heritage-vic;
 * filtered by zone_code):
 *   https://services-ap1.arcgis.com/P744lA0wf4LlBZ84/ArcGIS/rest/services/Vicmap_Planning/FeatureServer/2
 *
 * Filter: `zone_code IN ('LSIO','FO','SBO')`
 *   - LSIO  Land Subject to Inundation Overlay
 *   - FO    Floodway Overlay
 *   - SBO   Special Building Overlay
 */
import { runOverlayIngest } from "../lib/runner";
import { s } from "../lib/types";
import type { ArcGisPaginatedConfig } from "../lib/types";

const config: ArcGisPaginatedConfig = {
  adapter: "arcgis-paginated",
  sourceId: "flood-vic",
  overlayKind: "flood",
  overlaySource: "vic-vicmap-flood",
  state: "VIC",
  minAddressCount: 1_000_000,
  endpoint: "https://services-ap1.arcgis.com/P744lA0wf4LlBZ84/ArcGIS/rest/services/Vicmap_Planning/FeatureServer/2",
  where: "zone_code IN ('LSIO','FO','SBO')",
  outFields: "zone_code,zone_description,scheme_code,lga",
  pickCode:  (p) => s(p.zone_code),
  pickLabel: (p) => s(p.zone_description),
  pickAttrs: (p) => ({ schemeCode: s(p.scheme_code), lga: s(p.lga) }),
};

export async function run(): Promise<void> {
  await runOverlayIngest(config);
}
