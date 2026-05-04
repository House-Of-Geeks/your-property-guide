/**
 * QLD Heritage Register Ingest.
 *
 * License: State of Queensland, CC BY 4.0.
 *
 * Source endpoint:
 *   https://spatial-gis.information.qld.gov.au/arcgis/rest/services/Boundaries/AdminBoundariesFramework/MapServer/78
 */
import { runOverlayIngest } from "../lib/runner";
import { s } from "../lib/types";
import type { ArcGisPaginatedConfig } from "../lib/types";

const config: ArcGisPaginatedConfig = {
  adapter: "arcgis-paginated",
  sourceId: "heritage-qld",
  overlayKind: "heritage",
  overlaySource: "qld-heritage-register",
  state: "QLD",
  minAddressCount: 1_000_000,
  endpoint: "https://spatial-gis.information.qld.gov.au/arcgis/rest/services/Boundaries/AdminBoundariesFramework/MapServer/78",
  outFields: "placename,place_id,status",
  pickCode:  () => "LISTED",
  pickLabel: (p) => s(p.placename),
  pickAttrs: (p) => ({
    name:         s(p.placename),
    placeId:      s(p.place_id),
    heritageType: s(p.status),
  }),
};

export async function run(): Promise<void> {
  await runOverlayIngest(config);
}
