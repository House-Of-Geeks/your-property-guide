/**
 * NSW Flood Planning Layers Ingest — EPI Hazard Planning Portal.
 *
 * License: NSW Government Open Data, CC BY 4.0.
 *
 * Source endpoint:
 *   https://mapprod3.environment.nsw.gov.au/arcgis/rest/services/ePlanning/Planning_Portal_Hazard/MapServer/230
 */
import { runOverlayIngest } from "../lib/runner";
import { s } from "../lib/types";
import type { ArcGisPaginatedConfig } from "../lib/types";

function classToCode(layClass: string): string {
  const c = layClass.trim();
  switch (c) {
    case "Flood Planning Area":               return "FPA";
    case "Flood Prone and Major Creeks Land": return "FPMC";
    case "1 in 100 AEP Flood Extent":         return "1IN100";
    case "Probable Maximum Flood Line":       return "PMFL";
    case "Level of Probable Maximum Flood":   return "LPMF";
    case "Land Identified in Section 3.27":   return "S327";
    case "Area 1":                            return "AREA1";
    case "Transitional Land":                 return "TRANSITIONAL";
    case "Cultural Heritage Landscape Area":  return "CHLA";
    default:
      return c.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "") || "FLOOD";
  }
}

const config: ArcGisPaginatedConfig = {
  adapter: "arcgis-paginated",
  sourceId: "flood-nsw",
  overlayKind: "flood",
  overlaySource: "nsw-flood-planning",
  state: "NSW",
  minAddressCount: 1_000_000,
  endpoint: "https://mapprod3.environment.nsw.gov.au/arcgis/rest/services/ePlanning/Planning_Portal_Hazard/MapServer/230",
  outFields: "LAY_CLASS,EPI_NAME,EPI_TYPE,LGA_NAME",
  pickCode:  (p) => {
    const c = s(p.LAY_CLASS);
    return c ? classToCode(c) : null;
  },
  pickLabel: (p) => s(p.LAY_CLASS),
  pickAttrs: (p) => ({
    layClass: s(p.LAY_CLASS),
    epiName:  s(p.EPI_NAME),
    epiType:  s(p.EPI_TYPE),
    lgaName:  s(p.LGA_NAME),
  }),
};

export async function run(): Promise<void> {
  await runOverlayIngest(config);
}
