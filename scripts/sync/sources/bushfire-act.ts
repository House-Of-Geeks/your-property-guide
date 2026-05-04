/**
 * ACT Bushfire Prone Area Ingest — Strategic Bushfire Management Plan.
 *
 * License: ACT Government Open Data, CC BY 4.0.
 *
 * Source endpoint:
 *   https://services1.arcgis.com/E5n4f1VY84i0xSjy/arcgis/rest/services/SBMP_BPA_current/FeatureServer/0
 *
 * Presence-only layer: every matched address is in the BPA.
 */
import { runOverlayIngest } from "../lib/runner";
import type { ArcGisPaginatedConfig } from "../lib/types";

const config: ArcGisPaginatedConfig = {
  adapter: "arcgis-paginated",
  sourceId: "bushfire-act",
  overlayKind: "bushfire",
  overlaySource: "act-sbmp-bpa",
  state: "ACT",
  minAddressCount: 100_000,
  endpoint: "https://services1.arcgis.com/E5n4f1VY84i0xSjy/arcgis/rest/services/SBMP_BPA_current/FeatureServer/0",
  outFields: "OBJECTID",
  pickCode:  () => "BPA",
  pickLabel: () => "Bushfire Prone Area (SBMP 2025)",
  pickAttrs: () => ({ source: "SBMP 2025" }),
};

export async function run(): Promise<void> {
  await runOverlayIngest(config);
}
