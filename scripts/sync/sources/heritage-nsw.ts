/**
 * NSW Heritage Register Ingest — Principal Planning Heritage layer.
 *
 * License: NSW Government Open Data, CC BY 4.0.
 *
 * Source endpoint:
 *   https://mapprod3.environment.nsw.gov.au/arcgis/rest/services/Planning/Principal_Planning_Layers/MapServer/8
 *
 * Field mapping:
 *   SIG     → overlay.code  (heritage significance level; defaults to "LISTED")
 *   H_NAME  → overlay.label
 *   H_ID                    → attrs.hId
 *   EPI_NAME                → attrs.epiName
 */
import { runOverlayIngest } from "../lib/runner";
import { s } from "../lib/types";
import type { ArcGisPaginatedConfig } from "../lib/types";

const config: ArcGisPaginatedConfig = {
  adapter: "arcgis-paginated",
  sourceId: "heritage-nsw",
  overlayKind: "heritage",
  overlaySource: "nsw-heritage-register",
  state: "NSW",
  minAddressCount: 1_000_000,
  endpoint: "https://mapprod3.environment.nsw.gov.au/arcgis/rest/services/Planning/Principal_Planning_Layers/MapServer/8",
  outFields: "H_NAME,SIG,LAY_CLASS,H_ID,EPI_NAME",
  pickCode:  (p) => s(p.SIG) ?? "LISTED",
  pickLabel: (p) => s(p.H_NAME),
  pickAttrs: (p) => ({
    name:          s(p.H_NAME),
    heritageLevel: s(p.SIG),
    hId:           s(p.H_ID),
    epiName:       s(p.EPI_NAME),
  }),
};

export async function run(): Promise<void> {
  await runOverlayIngest(config);
}
