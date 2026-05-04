/**
 * TAS Bushfire-Prone Areas Ingest — LIST consolidated planning overlays.
 *
 * License: Tasmanian Government, CC BY 3.0 Australia (LIST OpenData).
 *
 * Source endpoint:
 *   https://services.thelist.tas.gov.au/arcgis/rest/services/Public/OpenDataWFS/MapServer/2
 *
 * Bushfire is one overlay class within the consolidated planning-overlay
 * layer; we filter by `O_NAME='Bushfire Prone Areas'`. Coverage is sparse
 * statewide because most LGAs publish bushfire overlays via separate
 * (non-public) datasets.
 */
import { runOverlayIngest } from "../lib/runner";
import { s } from "../lib/types";
import type { ArcGisPaginatedConfig } from "../lib/types";

const config: ArcGisPaginatedConfig = {
  adapter: "arcgis-paginated",
  sourceId: "bushfire-tas",
  overlayKind: "bushfire",
  overlaySource: "tas-bushfire-overlay",
  state: "TAS",
  minAddressCount: 100_000,
  endpoint: "https://services.thelist.tas.gov.au/arcgis/rest/services/Public/OpenDataWFS/MapServer/2",
  where: "O_NAME='Bushfire Prone Areas'",
  outFields: "O_CODE,O_NAME,PLANSCHEME",
  pickCode:  () => "BPA",
  pickLabel: (p) => s(p.O_NAME),
  pickAttrs: (p) => ({ overlayCode: s(p.O_CODE), scheme: s(p.PLANSCHEME) }),
};

export async function run(): Promise<void> {
  await runOverlayIngest(config);
}
