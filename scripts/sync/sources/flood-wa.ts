/**
 * WA Flood Ingest — DWER 1-in-100 (1%) AEP Floodway and Flood Fringe.
 *
 * License: Government of Western Australia (DWER), CC BY 4.0.
 *   "Floodplain Mapping data © Government of Western Australia
 *    (Department of Water and Environmental Regulation), licensed under
 *    CC BY 4.0."
 *
 * Source endpoint (PUBLIC, no auth):
 *   https://public-services.slip.wa.gov.au/public/rest/services/SLIP_Public_Services/Water/MapServer/23
 *
 * Field mapping:
 *   ext_type    ("Floodway" / "Flood fringe")  → overlay.code
 *   location    (river/area description)        → overlay.label
 *   source                                      → attrs.source
 *   vert_datum                                  → attrs.vertDatum
 *   start_date  (epoch ms)                      → attrs.startDate / effectiveAt
 *
 * Note: ~1,543 polygons covering metro Perth + select regional rivers. Only
 * addresses within mapped floodplains will match — most WA addresses will not
 * match (genuine sparse coverage, not a bug).
 */
import { runOverlayIngest } from "../lib/runner";
import { s, parseEpochMs } from "../lib/types";
import type { ArcGisPaginatedConfig } from "../lib/types";

const config: ArcGisPaginatedConfig = {
  adapter: "arcgis-paginated",
  sourceId: "flood-wa",
  overlayKind: "flood",
  overlaySource: "wa-dwer-floodplain",
  state: "WA",
  minAddressCount: 500_000,
  endpoint: "https://public-services.slip.wa.gov.au/public/rest/services/SLIP_Public_Services/Water/MapServer/23",
  outFields: "ext_type,location,source,vert_datum,start_date",
  pickCode:  (p) => s(p.ext_type) ?? "Floodplain",
  pickLabel: (p) => s(p.location),
  pickAttrs: (p) => ({
    source:    s(p.source),
    vertDatum: s(p.vert_datum),
    startDate: parseEpochMs(p.start_date)?.toISOString().slice(0, 10) ?? null,
  }),
  pickEffectiveAt: (p) => parseEpochMs(p.start_date),
};

export async function run(): Promise<void> {
  await runOverlayIngest(config);
}
