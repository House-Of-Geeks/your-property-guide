/**
 * VIC Bushfire Management Overlay Ingest — Vicmap Planning (BMO).
 *
 * License: Government of Victoria, CC BY 4.0.
 *
 * Source endpoint (Vicmap Planning Overlay layer; filtered by zone_code):
 *   https://services-ap1.arcgis.com/P744lA0wf4LlBZ84/ArcGIS/rest/services/Vicmap_Planning/FeatureServer/2
 *
 * Filter: `zone_code = 'BMO'` (Bushfire Management Overlay).
 */
import { runOverlayIngest } from "../lib/runner";
import { s } from "../lib/types";
import type { ArcGisPaginatedConfig } from "../lib/types";

const config: ArcGisPaginatedConfig = {
  adapter: "arcgis-paginated",
  sourceId: "bushfire-vic",
  overlayKind: "bushfire",
  overlaySource: "vic-vicmap-bushfire",
  state: "VIC",
  minAddressCount: 1_000_000,
  endpoint: "https://services-ap1.arcgis.com/P744lA0wf4LlBZ84/ArcGIS/rest/services/Vicmap_Planning/FeatureServer/2",
  where: "zone_code = 'BMO'",
  outFields: "zone_code,zone_description,scheme_code,lga",
  pickCode:  (p) => s(p.zone_code),
  pickLabel: (p) => s(p.zone_description),
  pickAttrs: (p) => ({ schemeCode: s(p.scheme_code), lga: s(p.lga) }),
};

export async function run(): Promise<void> {
  await runOverlayIngest(config);
}
