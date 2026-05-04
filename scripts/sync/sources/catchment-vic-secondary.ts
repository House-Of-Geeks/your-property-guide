/**
 * VIC Secondary School Zone Ingest — Year 7 zone.
 *
 * Same DET ZIP as catchment-vic-primary; ingests the Year 7 secondary file.
 * VIC publishes per-year files (Year7..Year12) but Year 7 is the canonical
 * "your secondary catchment" since that's the entry year.
 */
import { runOverlayIngest } from "../lib/runner";
import { s } from "../lib/types";
import type { GeoJsonBulkConfig } from "../lib/types";

const config: GeoJsonBulkConfig = {
  adapter: "geojson-bulk",
  sourceId: "catchment-vic-secondary",
  overlayKind: "catchment-secondary",
  overlaySource: "vic-det-school-zones",
  state: "VIC",
  minAddressCount: 1_000_000,
  url: "https://www.education.vic.gov.au/Documents/about/research/datavic/dv418_DataVic_School_Zones_2026_MAR26.zip",
  geojsonInZipPath: ["Secondary_Integrated_Year7_2026.geojson"],
  pickCode:  (p) => s(p.School_No) ?? s(p.school_no),
  pickLabel: (p) => s(p.School_Name) ?? s(p.school_name),
  pickAttrs: (p) => ({
    schoolName: s(p.School_Name) ?? s(p.school_name),
    schoolType: "Secondary School",
    calendarYear: 2026,
  }),
};

export async function run(): Promise<void> {
  await runOverlayIngest(config);
}
