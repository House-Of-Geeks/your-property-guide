/**
 * WA Land Zoning Ingest — DPLH Local Planning Scheme Zones and Reserves.
 *
 * License: Government of Western Australia (Department of Planning, Lands and
 * Heritage), CC BY 4.0.
 *   "Local Planning Scheme - Zones and Reserves data © Government of Western
 *    Australia (Department of Planning, Lands and Heritage), licensed under
 *    CC BY 4.0."
 *
 * Source endpoint (PUBLIC, no auth):
 *   https://public-services.slip.wa.gov.au/public/rest/services/SLIP_Public_Services/Property_and_Planning/MapServer/112
 *
 * Field mapping:
 *   label         (e.g. "R20")              → overlay.code
 *   label_desc    (description, often blank) → fallback
 *   zone          (e.g. "Residential")       → overlay.label
 *   scheme_nam    (planning scheme)          → attrs.scheme
 *   lga                                      → attrs.lga
 *   gazettal_d    (epoch ms)                 → attrs.gazettalDate / effectiveAt
 */
import { runOverlayIngest } from "../lib/runner";
import { s, parseEpochMs } from "../lib/types";
import type { ArcGisPaginatedConfig } from "../lib/types";

const config: ArcGisPaginatedConfig = {
  adapter: "arcgis-paginated",
  sourceId: "zoning-wa",
  overlayKind: "zoning",
  overlaySource: "wa-dplh-zones",
  state: "WA",
  minAddressCount: 500_000,
  endpoint: "https://public-services.slip.wa.gov.au/public/rest/services/SLIP_Public_Services/Property_and_Planning/MapServer/112",
  outFields: "label,label_desc,zone,scheme_nam,lga,gazettal_d",
  pickCode:  (p) => s(p.label) ?? s(p.label_desc) ?? s(p.zone),
  pickLabel: (p) => s(p.label_desc) ?? s(p.zone),
  pickAttrs: (p) => ({
    zone: s(p.zone),
    scheme: s(p.scheme_nam),
    lga: s(p.lga),
    gazettalDate: parseEpochMs(p.gazettal_d)?.toISOString().slice(0, 10) ?? null,
  }),
  pickEffectiveAt: (p) => parseEpochMs(p.gazettal_d),
};

export async function run(): Promise<void> {
  await runOverlayIngest(config);
}
