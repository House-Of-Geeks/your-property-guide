/**
 * NSW Land Zoning Ingest — EPI Primary Planning Layers Land Zoning Map.
 *
 * License: NSW Government Open Data, CC BY 4.0.
 *   "Land Zoning Map data © State of New South Wales (Department of Planning,
 *    Housing and Infrastructure), licensed under CC BY 4.0."
 *
 * Source endpoint:
 *   https://mapprod3.environment.nsw.gov.au/arcgis/rest/services/Planning/EPI_Primary_Planning_Layers/MapServer/2
 *
 * Field mapping:
 *   SYM_CODE   → overlay.code   (e.g. "R2")
 *   LAY_CLASS  → overlay.label  (e.g. "Low Density Residential")
 *   EPI_NAME                    → attrs.epiName
 */
import { runOverlayIngest } from "../lib/runner";
import { s } from "../lib/types";
import type { ArcGisPaginatedConfig } from "../lib/types";

const config: ArcGisPaginatedConfig = {
  adapter: "arcgis-paginated",
  sourceId: "zoning-nsw",
  overlayKind: "zoning",
  overlaySource: "nsw-epi-zoning",
  state: "NSW",
  minAddressCount: 1_000_000,
  endpoint: "https://mapprod3.environment.nsw.gov.au/arcgis/rest/services/Planning/EPI_Primary_Planning_Layers/MapServer/2",
  outFields: "SYM_CODE,LAY_CLASS,EPI_NAME,LGA_NAME",
  pickCode:  (p) => s(p.SYM_CODE),
  pickLabel: (p) => s(p.LAY_CLASS),
  pickAttrs: (p) => ({ epiName: s(p.EPI_NAME) }),
};

export async function run(): Promise<void> {
  await runOverlayIngest(config);
}
