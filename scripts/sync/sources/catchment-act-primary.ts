/**
 * ACT Priority Enrolment Area (Primary) Ingest.
 *
 * Source: ACT Government, Priority Enrolment Areas service on ArcGIS Online.
 * The dataset combines primary, college, and high-school PEAs in one layer
 * keyed by YEAR_LEVEL — primary catchments are filtered with where-clause.
 *
 * License: ACT Government, CC BY 4.0.
 *
 * NOTE: service name is year-versioned ("…_2026"). Update this URL each year.
 *
 * Field mapping:
 *   SCHOOL_NAME  → overlay.label  (no separate school code field)
 *   YEAR_LEVEL                    → attrs.yearLevel
 *   TYPE                          → attrs.schoolType
 */
import { runOverlayIngest } from "../lib/runner";
import { s } from "../lib/types";
import type { ArcGisPaginatedConfig } from "../lib/types";

const config: ArcGisPaginatedConfig = {
  adapter: "arcgis-paginated",
  sourceId: "catchment-act-primary",
  overlayKind: "catchment-primary",
  overlaySource: "act-doe-pea",
  state: "ACT",
  minAddressCount: 100_000,
  endpoint: "https://services1.arcgis.com/E5n4f1VY84i0xSjy/arcgis/rest/services/ACTGOV_Priority_Enrolment_Areas_2026/FeatureServer/2",
  outFields: "SCHOOL_NAME,YEAR_LEVEL,TYPE,DESCRIPTION,WEBSITE,LAST_UPDATE",
  // Filter by TYPE — much cleaner than year-level patterns. ACT data shows
  // 60+ primary polygons across mixed YEAR_LEVEL formats (P-6, K-6, 3-6, P-2).
  where: "TYPE = 'Primary'",
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
