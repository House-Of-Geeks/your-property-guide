/**
 * QLD Junior Secondary State School Catchment Ingest (years 7–10).
 *
 * Same QSpatial service as catchment-qld-primary, layer 2.
 * Senior secondary (years 11–12, layer 3) is rarely a hard zoning constraint —
 * we ingest junior as the canonical "secondary catchment".
 */
import { runOverlayIngest } from "../lib/runner";
import { s } from "../lib/types";
import type { ArcGisPaginatedConfig } from "../lib/types";

const config: ArcGisPaginatedConfig = {
  adapter: "arcgis-paginated",
  sourceId: "catchment-qld-secondary",
  overlayKind: "catchment-secondary",
  overlaySource: "qld-doe-catchments",
  state: "QLD",
  minAddressCount: 1_000_000,
  endpoint: "https://spatial-gis.information.qld.gov.au/arcgis/rest/services/Society/SchoolsAndSchoolCatchments/MapServer/2",
  outFields: "centre_code,centre_name,data_currency",
  pickCode:  (p) => s(p.centre_code),
  pickLabel: (p) => s(p.centre_name),
  pickAttrs: (p) => ({
    schoolName:  s(p.centre_name),
    schoolType:  "Secondary State School (Years 7–10)",
    dataCurrency: s(p.data_currency),
  }),
};

export async function run(): Promise<void> {
  await runOverlayIngest(config);
}
