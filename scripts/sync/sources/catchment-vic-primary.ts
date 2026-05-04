/**
 * VIC Primary School Zone Ingest — Department of Education and Training (DET).
 *
 * Source: Victorian Government School Zones, published annually by DET as a
 * single ZIP containing per-level GeoJSON files. The dataset URL filename
 * embeds the year + release month — the constant below MUST be updated each
 * January when DET republishes.
 *
 * License: Department of Education and Training Victoria, CC BY 4.0.
 *
 * Catalog page: https://discover.data.vic.gov.au/dataset/victorian-government-school-zones-2026
 *
 * Field mapping:
 *   School_No   → overlay.code   (DET school number)
 *   School_Name → overlay.label
 */
import { runOverlayIngest } from "../lib/runner";
import { s } from "../lib/types";
import type { GeoJsonBulkConfig } from "../lib/types";

const config: GeoJsonBulkConfig = {
  adapter: "geojson-bulk",
  sourceId: "catchment-vic-primary",
  overlayKind: "catchment-primary",
  overlaySource: "vic-det-school-zones",
  state: "VIC",
  minAddressCount: 1_000_000,
  url: "https://www.education.vic.gov.au/Documents/about/research/datavic/dv418_DataVic_School_Zones_2026_MAR26.zip",
  geojsonInZipPath: ["Primary_Integrated_2026.geojson"],
  pickCode:  (p) => s(p.School_No) ?? s(p.school_no),
  pickLabel: (p) => s(p.School_Name) ?? s(p.school_name),
  pickAttrs: (p) => ({
    schoolName: s(p.School_Name) ?? s(p.school_name),
    schoolType: "Primary School",
    calendarYear: 2026,
  }),
};

export async function run(): Promise<void> {
  await runOverlayIngest(config);
}
