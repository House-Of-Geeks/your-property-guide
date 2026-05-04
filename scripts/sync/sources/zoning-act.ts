/**
 * ACT Land Zoning Ingest — Territory Plan Land Use Zones.
 *
 * License: ACT Government Open Data, CC BY 4.0.
 *
 * Source endpoint:
 *   https://services1.arcgis.com/E5n4f1VY84i0xSjy/arcgis/rest/services/ACTGOV_TP_LAND_USE_ZONE/FeatureServer/1
 *
 * Field mapping:
 *   LAND_USE_ZONE_CODE_ID → overlay.code   (e.g. "RZ1")
 *   LAND_USE_POLICY_DESC  → overlay.label
 *   DIVISION_NAME         → attrs.division
 */
import { runOverlayIngest } from "../lib/runner";
import { s } from "../lib/types";
import type { ArcGisPaginatedConfig } from "../lib/types";

const config: ArcGisPaginatedConfig = {
  adapter: "arcgis-paginated",
  sourceId: "zoning-act",
  overlayKind: "zoning",
  overlaySource: "act-tp-zoning",
  state: "ACT",
  minAddressCount: 100_000,
  endpoint: "https://services1.arcgis.com/E5n4f1VY84i0xSjy/arcgis/rest/services/ACTGOV_TP_LAND_USE_ZONE/FeatureServer/1",
  outFields: "LAND_USE_ZONE_CODE_ID,LAND_USE_POLICY_DESC,DIVISION_NAME",
  pickCode:  (p) => s(p.LAND_USE_ZONE_CODE_ID),
  pickLabel: (p) => s(p.LAND_USE_POLICY_DESC),
  pickAttrs: (p) => ({ division: s(p.DIVISION_NAME) }),
};

export async function run(): Promise<void> {
  await runOverlayIngest(config);
}
