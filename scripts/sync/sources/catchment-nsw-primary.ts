/**
 * NSW School Catchment Ingest — Primary.
 *
 * Source: NSW Department of Education School Finder, hosted on Carto under
 * the `cesensw` (Centre for Education Statistics and Evaluation) account.
 * Same dataset that powers https://schoolfinder.education.nsw.gov.au/.
 *
 * License: Available under the NSW Open Data terms — DEC publishes this for
 * public use via the School Finder. CC BY 4.0.
 *
 * Data flow:
 *   1. Carto SQL API returns full primary-catchment polygons as GeoJSON
 *   2. R-tree → point-in-polygon match against every NSW G-NAF address
 *   3. PropertyOverlay row tagged kind = "catchment-primary"
 *      with code = school_code, label = school_name, attrs = { schoolType }.
 *
 * Field mapping:
 *   school_code      → overlay.code   (e.g. "4218")  — NSW DEC code
 *   school_name      → overlay.label  (e.g. "Gosford East Public School")
 *   school_type      → attrs.schoolType
 *   calendar_year    → attrs.calendarYear
 *   priority         → attrs.priority
 *
 * Resolution: schools' catchments don't overlap (one address → one school
 * for primary), so the smallest-area tiebreaker is moot but harmless.
 */
import { runOverlayIngest } from "../lib/runner";
import { s } from "../lib/types";
import type { GeoJsonBulkConfig } from "../lib/types";

const CARTO_SQL =
  "https://cesensw.carto.com/api/v2/sql" +
  "?q=" + encodeURIComponent("SELECT * FROM catchments_2020 WHERE catchment_level = 'primary'") +
  "&format=geojson";

const config: GeoJsonBulkConfig = {
  adapter: "geojson-bulk",
  sourceId: "catchment-nsw-primary",
  overlayKind: "catchment-primary",
  overlaySource: "nsw-doe-catchments",
  state: "NSW",
  minAddressCount: 1_000_000,
  url: CARTO_SQL,
  pickCode:  (p) => s(p.school_code),
  pickLabel: (p) => s(p.school_name),
  pickAttrs: (p) => ({
    schoolName:   s(p.school_name),
    schoolType:   s(p.school_type),
    calendarYear: typeof p.calendar_year === "number" ? p.calendar_year : null,
    priority:     s(p.priority),
  }),
};

export async function run(): Promise<void> {
  await runOverlayIngest(config);
}
