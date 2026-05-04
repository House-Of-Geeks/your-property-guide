/**
 * WA Bush Fire Prone Areas Ingest — Landgate OBRM Map of BFPA.
 *
 * License: Government of Western Australia, CC BY 4.0.
 *
 * Source endpoint:
 *   https://services.slip.wa.gov.au/arcgis/rest/services/Landgate_Public_Maps/Map_of_Bush_Fire_Prone_Areas_3/MapServer/8
 *
 * Field mapping:
 *   type           → overlay.code (defaults to "BPA")
 *   designation    → attrs.designation
 *   planningarea   → attrs.planningArea
 *   designationdate (epoch ms) → attrs.designationDate / effectiveAt
 *   lga            → attrs.lga
 */
import { runOverlayIngest } from "../lib/runner";
import { s, parseEpochMs } from "../lib/types";
import type { ArcGisPaginatedConfig } from "../lib/types";

const config: ArcGisPaginatedConfig = {
  adapter: "arcgis-paginated",
  sourceId: "bushfire-wa",
  overlayKind: "bushfire",
  overlaySource: "wa-obrm-bfpa",
  state: "WA",
  minAddressCount: 500_000,
  endpoint: "https://services.slip.wa.gov.au/arcgis/rest/services/Landgate_Public_Maps/Map_of_Bush_Fire_Prone_Areas_3/MapServer/8",
  outFields: "type,designation,planningarea,designationdate,lga",
  pickCode:  (p) => s(p.type) ?? "BPA",
  pickLabel: () => "Bush Fire Prone Area (designated)",
  pickAttrs: (p) => ({
    designation:     s(p.designation),
    planningArea:    s(p.planningarea),
    designationDate: parseEpochMs(p.designationdate)?.toISOString().slice(0, 10) ?? null,
    lga:             s(p.lga),
  }),
  pickEffectiveAt: (p) => parseEpochMs(p.designationdate),
};

export async function run(): Promise<void> {
  await runOverlayIngest(config);
}
