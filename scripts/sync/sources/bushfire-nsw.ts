/**
 * NSW Bush Fire Prone Land Ingest (Parcel-level BFPL).
 *
 * License: NSW Government Open Data, CC BY 4.0.
 *   "Bush Fire Prone Land data © State of New South Wales (Department of
 *    Planning, Housing and Infrastructure / NSW Rural Fire Service),
 *    licensed under CC BY 4.0."
 *
 * Source endpoint:
 *   https://mapprod3.environment.nsw.gov.au/arcgis/rest/services/ePlanning/Planning_Portal_Hazard/MapServer/229
 *
 * Field mapping (Category integer → BFPL short code):
 *   0 → "VB"   (Vegetation Buffer)
 *   1 → "VC1"  (Vegetation Category 1 — highest risk)
 *   2 → "VC2"
 *   3 → "VC3"
 *
 *   d_Category → overlay.label   (canonical descriptive label)
 *   Category   → attrs.categoryNum (preserved for downstream filters)
 *
 * Note: ~265k polygons, ~80k of which are in NSW Planning Portal's
 * "chronically bad rows" region (offset 150k-180k) that returns HTTP 500
 * regardless of page size. The arcgis-paginated adapter handles these via
 * skip-forward.
 */
import { runOverlayIngest } from "../lib/runner";
import { s } from "../lib/types";
import type { ArcGisPaginatedConfig } from "../lib/types";

function classifyBfpl(catNum: number | null, catDesc: string | null): { code: string; label: string | null } {
  switch (catNum) {
    case 0: return { code: "VB",  label: catDesc ?? "Vegetation Buffer" };
    case 1: return { code: "VC1", label: catDesc ?? "Vegetation Category 1" };
    case 2: return { code: "VC2", label: catDesc ?? "Vegetation Category 2" };
    case 3: return { code: "VC3", label: catDesc ?? "Vegetation Category 3" };
    default: {
      const v = (catDesc ?? "").toLowerCase();
      if (v.includes("category 1")) return { code: "VC1", label: catDesc };
      if (v.includes("category 2")) return { code: "VC2", label: catDesc };
      if (v.includes("category 3")) return { code: "VC3", label: catDesc };
      if (v.includes("buffer"))     return { code: "VB",  label: catDesc };
      return { code: "UNK", label: catDesc };
    }
  }
}

function categoryNum(p: Record<string, unknown>): number | null {
  const raw = p.Category;
  if (typeof raw === "number") return raw;
  if (raw != null) {
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

const config: ArcGisPaginatedConfig = {
  adapter: "arcgis-paginated",
  sourceId: "bushfire-nsw",
  overlayKind: "bushfire",
  overlaySource: "nsw-bfpl",
  state: "NSW",
  minAddressCount: 1_000_000,
  endpoint: "https://mapprod3.environment.nsw.gov.au/arcgis/rest/services/ePlanning/Planning_Portal_Hazard/MapServer/229",
  outFields: "Category,d_Category",
  pickCode:  (p) => classifyBfpl(categoryNum(p), s(p.d_Category)).code,
  pickLabel: (p) => classifyBfpl(categoryNum(p), s(p.d_Category)).label,
  pickAttrs: (p) => ({ categoryNum: categoryNum(p) }),
};

export async function run(): Promise<void> {
  await runOverlayIngest(config);
}
