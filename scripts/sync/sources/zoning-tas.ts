/**
 * TAS Land Zoning Ingest — Tasmanian Planning Scheme zones.
 *
 * License: Tasmanian Government, CC BY 3.0 Australia.
 *
 * Source endpoint:
 *   https://data.stategrowth.tas.gov.au/ags/rest/services/PROJECTS/PLANNINGSCHEMEZONES_TPC/FeatureServer/0
 *
 * Field mapping:
 *   ZONE      → overlay.code  + overlay.label
 *   LPS       → attrs.scheme  (Local Provisions Schedule)
 *   ZONE_ABB  → attrs.zoneAbb (zone abbreviation)
 */
import { runOverlayIngest } from "../lib/runner";
import { s } from "../lib/types";
import type { ArcGisPaginatedConfig } from "../lib/types";

const config: ArcGisPaginatedConfig = {
  adapter: "arcgis-paginated",
  sourceId: "zoning-tas",
  overlayKind: "zoning",
  overlaySource: "tas-tps-zoning",
  state: "TAS",
  minAddressCount: 100_000,
  endpoint: "https://data.stategrowth.tas.gov.au/ags/rest/services/PROJECTS/PLANNINGSCHEMEZONES_TPC/FeatureServer/0",
  outFields: "ZONE,LPS,ZONE_ABB",
  pickCode:  (p) => s(p.ZONE),
  pickLabel: (p) => s(p.ZONE),
  pickAttrs: (p) => ({ scheme: s(p.LPS), zoneAbb: s(p.ZONE_ABB) }),
};

export async function run(): Promise<void> {
  await runOverlayIngest(config);
}
