/**
 * QLD Flood Ingest — FloodCheck 1% AEP Riverine Basin Extents.
 *
 * License: State of Queensland, CC BY 4.0.
 *
 * Source endpoint:
 *   https://spatial-gis.information.qld.gov.au/arcgis/rest/services/FloodCheck/BasinOnePercentAEP/MapServer/1
 *
 * Note: QLD FloodCheck coverage is study-by-study, not statewide. Unmatched
 * addresses do NOT mean "no flood risk" — they mean "no flood study has
 * been conducted for that area".
 */
import { runOverlayIngest } from "../lib/runner";
import { s } from "../lib/types";
import type { ArcGisPaginatedConfig } from "../lib/types";

const config: ArcGisPaginatedConfig = {
  adapter: "arcgis-paginated",
  sourceId: "flood-qld",
  overlayKind: "flood",
  overlaySource: "qld-floodcheck",
  state: "QLD",
  minAddressCount: 1_000_000,
  endpoint: "https://spatial-gis.information.qld.gov.au/arcgis/rest/services/FloodCheck/BasinOnePercentAEP/MapServer/1",
  outFields: "TOWN,STATUS,RIVER_GAUGE,RIVER_GAUGE_TYPE,Bundle",
  pickCode:  () => "1% AEP",
  pickLabel: () => "Modelled 1% AEP riverine flood",
  pickAttrs: (p) => ({
    town:           s(p.TOWN),
    status:         s(p.STATUS),
    riverGauge:     s(p.RIVER_GAUGE),
    riverGaugeType: s(p.RIVER_GAUGE_TYPE),
    bundle:         s(p.Bundle),
  }),
};

export async function run(): Promise<void> {
  await runOverlayIngest(config);
}
