/**
 * QLD Primary State School Catchment Ingest.
 *
 * Source: Queensland Department of Education, published via QSpatial ArcGIS.
 * License: Queensland Government Open Data, CC BY 4.0.
 *
 * Endpoint: SchoolsAndSchoolCatchments/MapServer/1 (primary catchments).
 * Layer 2 = junior secondary (catchment-qld-secondary), layer 3 = senior secondary.
 *
 * Field mapping:
 *   centre_code → overlay.code  (QLD MOE school number)
 *   centre_name → overlay.label
 */
import { runOverlayIngest } from "../lib/runner";
import { s } from "../lib/types";
import type { ArcGisPaginatedConfig } from "../lib/types";

const config: ArcGisPaginatedConfig = {
  adapter: "arcgis-paginated",
  sourceId: "catchment-qld-primary",
  overlayKind: "catchment-primary",
  overlaySource: "qld-doe-catchments",
  state: "QLD",
  minAddressCount: 1_000_000,
  endpoint: "https://spatial-gis.information.qld.gov.au/arcgis/rest/services/Society/SchoolsAndSchoolCatchments/MapServer/1",
  outFields: "centre_code,centre_name,data_currency",
  pickCode:  (p) => s(p.centre_code),
  pickLabel: (p) => s(p.centre_name),
  pickAttrs: (p) => ({
    schoolName:  s(p.centre_name),
    schoolType:  "Primary State School",
    dataCurrency: s(p.data_currency),
  }),
};

export async function run(): Promise<void> {
  await runOverlayIngest(config);
}
