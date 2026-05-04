/**
 * VIC Land Zoning Ingest — Vicmap Planning Scheme Zone Polygon.
 *
 * License: Government of Victoria (Department of Transport and Planning),
 * CC BY 4.0.
 *   "Vicmap Planning - Planning Scheme Zone, licensed under CC BY 4.0."
 *
 * Source endpoint:
 *   https://services-ap1.arcgis.com/P744lA0wf4LlBZ84/ArcGIS/rest/services/Vicmap_Planning/FeatureServer/3
 *
 * Field mapping:
 *   zone_code         → overlay.code         (e.g. "GRZ1", "C1Z")
 *   zone_description  → overlay.label        (friendly text)
 *   scheme_code       → attrs.schemeCode
 *   lga               → attrs.lga
 */
import { runOverlayIngest } from "../lib/runner";
import { s } from "../lib/types";
import type { ArcGisPaginatedConfig } from "../lib/types";

const config: ArcGisPaginatedConfig = {
  adapter: "arcgis-paginated",
  sourceId: "zoning-vic",
  overlayKind: "zoning",
  overlaySource: "vic-vicmap-zoning",
  state: "VIC",
  minAddressCount: 1_000_000,
  endpoint: "https://services-ap1.arcgis.com/P744lA0wf4LlBZ84/ArcGIS/rest/services/Vicmap_Planning/FeatureServer/3",
  outFields: "zone_code,zone_description,scheme_code,lga",
  pickCode:  (p) => s(p.zone_code),
  pickLabel: (p) => s(p.zone_description),
  pickAttrs: (p) => ({
    schemeCode: s(p.scheme_code),
    lga:        s(p.lga),
  }),
};

export async function run(): Promise<void> {
  await runOverlayIngest(config);
}
