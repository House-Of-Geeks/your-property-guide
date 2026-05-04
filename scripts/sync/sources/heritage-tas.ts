/**
 * TAS Heritage Register Ingest — Tasmanian Heritage Council.
 *
 * License: Tasmanian Government, CC BY 3.0 Australia.
 *
 * Source endpoint:
 *   https://services.thelist.tas.gov.au/arcgis/rest/services/HT/HT_Public/MapServer/0
 */
import { runOverlayIngest } from "../lib/runner";
import { s } from "../lib/types";
import type { ArcGisPaginatedConfig } from "../lib/types";

const config: ArcGisPaginatedConfig = {
  adapter: "arcgis-paginated",
  sourceId: "heritage-tas",
  overlayKind: "heritage",
  overlaySource: "tas-heritage-register",
  state: "TAS",
  minAddressCount: 100_000,
  endpoint: "https://services.thelist.tas.gov.au/arcgis/rest/services/HT/HT_Public/MapServer/0",
  outFields: "THR_ID,THR_NAME,REG_STATUS",
  pickCode:  () => "LISTED",
  pickLabel: (p) => s(p.THR_NAME),
  pickAttrs: (p) => ({
    name:         s(p.THR_NAME),
    placeId:      s(p.THR_ID),
    heritageType: s(p.REG_STATUS),
  }),
};

export async function run(): Promise<void> {
  await runOverlayIngest(config);
}
