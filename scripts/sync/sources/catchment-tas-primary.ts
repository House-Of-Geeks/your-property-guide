/**
 * TAS Primary School Intake Area Ingest.
 *
 * Source: Tasmanian Government Department for Education, Children and Young
 * People (DECYP), published via theLIST.
 * License: Tasmanian Government Open Data, CC BY 3.0 AU.
 *
 * Layer: Public/Education/MapServer/13 — "DoE School Intake Areas".
 * Combined primary + combined-school layer. TAS does NOT publish secondary
 * catchments (their high schools aren't strictly zoned), so there's no
 * `catchment-tas-secondary.ts` sibling.
 *
 * Field mapping:
 *   SCHOOL_NAME      → overlay.label and overlay.code (no school code field)
 *   LEARNING_SERVICE → attrs.region (South / North / North-West)
 */
import { runOverlayIngest } from "../lib/runner";
import { s } from "../lib/types";
import type { ArcGisPaginatedConfig } from "../lib/types";

const config: ArcGisPaginatedConfig = {
  adapter: "arcgis-paginated",
  sourceId: "catchment-tas-primary",
  overlayKind: "catchment-primary",
  overlaySource: "tas-decyp-intake",
  state: "TAS",
  minAddressCount: 100_000,
  endpoint: "https://services.thelist.tas.gov.au/arcgis/rest/services/Public/Education/MapServer/13",
  outFields: "SCHOOL_NAME,LEARNING_SERVICE,LABEL",
  pickCode:  (p) => s(p.SCHOOL_NAME),
  pickLabel: (p) => s(p.SCHOOL_NAME),
  pickAttrs: (p) => ({
    schoolName: s(p.SCHOOL_NAME),
    schoolType: "Primary School",
    region:     s(p.LEARNING_SERVICE),
  }),
};

export async function run(): Promise<void> {
  await runOverlayIngest(config);
}
