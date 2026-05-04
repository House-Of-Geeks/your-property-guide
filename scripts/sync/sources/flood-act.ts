/**
 * ACT 1% AEP Flood Extent Ingest — modelled flood extents.
 *
 * License: ACT Government Open Data, CC BY 4.0.
 *
 * Source endpoint:
 *   https://services1.arcgis.com/E5n4f1VY84i0xSjy/arcgis/rest/services/ACTGOV_FLOOD_EXTENT/FeatureServer/0
 *
 * Presence-only layer: every matched address gets the same code/label.
 */
import { runOverlayIngest } from "../lib/runner";
import type { ArcGisPaginatedConfig } from "../lib/types";

const config: ArcGisPaginatedConfig = {
  adapter: "arcgis-paginated",
  sourceId: "flood-act",
  overlayKind: "flood",
  overlaySource: "act-flood-extent",
  state: "ACT",
  minAddressCount: 100_000,
  endpoint: "https://services1.arcgis.com/E5n4f1VY84i0xSjy/arcgis/rest/services/ACTGOV_FLOOD_EXTENT/FeatureServer/0",
  outFields: "OBJECTID",
  pickCode:  () => "1% AEP",
  pickLabel: () => "Modelled flood extent (1% AEP)",
  pickAttrs: () => ({ modelled: true }),
};

export async function run(): Promise<void> {
  await runOverlayIngest(config);
}
