/**
 * ACT Heritage Register Ingest.
 *
 * License: ACT Government Open Data, CC BY 4.0.
 *
 * Source endpoint:
 *   https://services1.arcgis.com/E5n4f1VY84i0xSjy/arcgis/rest/services/ACTGOV_Heritage_Register/FeatureServer/1
 */
import { runOverlayIngest } from "../lib/runner";
import { s } from "../lib/types";
import type { ArcGisPaginatedConfig } from "../lib/types";

const config: ArcGisPaginatedConfig = {
  adapter: "arcgis-paginated",
  sourceId: "heritage-act",
  overlayKind: "heritage",
  overlaySource: "act-heritage-register",
  state: "ACT",
  minAddressCount: 100_000,
  endpoint: "https://services1.arcgis.com/E5n4f1VY84i0xSjy/arcgis/rest/services/ACTGOV_Heritage_Register/FeatureServer/1",
  outFields: "NAME,HRcategory",
  pickCode:  () => "LISTED",
  pickLabel: (p) => s(p.NAME) ?? "Heritage listed",
  pickAttrs: (p) => ({ name: s(p.NAME), heritageType: s(p.HRcategory) }),
};

export async function run(): Promise<void> {
  await runOverlayIngest(config);
}
