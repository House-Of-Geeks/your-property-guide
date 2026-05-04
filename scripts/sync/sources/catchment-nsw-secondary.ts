/**
 * NSW School Catchment Ingest — Secondary.
 *
 * Same Carto-hosted dataset as catchment-nsw-primary, filtered to
 * catchment_level = 'secondary'. See that file for full documentation.
 */
import { runOverlayIngest } from "../lib/runner";
import { s } from "../lib/types";
import type { GeoJsonBulkConfig } from "../lib/types";

const CARTO_SQL =
  "https://cesensw.carto.com/api/v2/sql" +
  "?q=" + encodeURIComponent("SELECT * FROM catchments_2020 WHERE catchment_level = 'secondary'") +
  "&format=geojson";

const config: GeoJsonBulkConfig = {
  adapter: "geojson-bulk",
  sourceId: "catchment-nsw-secondary",
  overlayKind: "catchment-secondary",
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
