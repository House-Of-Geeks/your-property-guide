/**
 * ACT Priority Enrolment Area (Secondary / High School) Ingest.
 *
 * Same combined PEA service as catchment-act-primary, filtered to high-school
 * year levels (7–10). Colleges (11–12) are usually open enrolment and are
 * therefore not surfaced as a "secondary catchment" here.
 */
import { runOverlayIngest } from "../lib/runner";
import { s } from "../lib/types";
import type { ArcGisPaginatedConfig } from "../lib/types";

const config: ArcGisPaginatedConfig = {
  adapter: "arcgis-paginated",
  sourceId: "catchment-act-secondary",
  overlayKind: "catchment-secondary",
  overlaySource: "act-doe-pea",
  state: "ACT",
  minAddressCount: 100_000,
  endpoint: "https://services1.arcgis.com/E5n4f1VY84i0xSjy/arcgis/rest/services/ACTGOV_Priority_Enrolment_Areas_2026/FeatureServer/2",
  outFields: "SCHOOL_NAME,YEAR_LEVEL,TYPE,DESCRIPTION,WEBSITE,LAST_UPDATE",
  // High schools (years 7–10). Colleges (11–12) are open enrolment, skip.
  where: "TYPE = 'High'",
  pickCode:  (p) => s(p.SCHOOL_NAME),
  pickLabel: (p) => s(p.SCHOOL_NAME),
  pickAttrs: (p) => ({
    schoolName:  s(p.SCHOOL_NAME),
    schoolType:  s(p.TYPE),
    yearLevel:   s(p.YEAR_LEVEL),
    description: s(p.DESCRIPTION),
  }),
};

export async function run(): Promise<void> {
  await runOverlayIngest(config);
}
