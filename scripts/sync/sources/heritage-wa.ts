/**
 * WA State Heritage Register Ingest — DPLH inHerit.
 *
 * License: Government of Western Australia (DPLH), CC BY 4.0.
 *   "State Heritage Register data © Government of Western Australia
 *    (Department of Planning, Lands and Heritage), licensed under CC BY 4.0."
 *
 * Source endpoint (PUBLIC, no auth):
 *   https://public-services.slip.wa.gov.au/public/rest/services/SLIP_Public_Services/People_and_Society/MapServer/7
 *
 * Field mapping:
 *   her_record  (e.g. "State Register Place")  → overlay.code
 *   place_name                                  → overlay.label
 *   place_no                                    → attrs.placeNo
 *   location, lga, more_info                    → attrs
 *
 * Note: ~2,310 places — only state-listed sites; LGA-listed sites are not
 * included. Most WA addresses will not match (heritage listings are rare).
 */
import { runOverlayIngest } from "../lib/runner";
import { s } from "../lib/types";
import type { ArcGisPaginatedConfig } from "../lib/types";

const config: ArcGisPaginatedConfig = {
  adapter: "arcgis-paginated",
  sourceId: "heritage-wa",
  overlayKind: "heritage",
  overlaySource: "wa-heritage-register",
  state: "WA",
  minAddressCount: 500_000,
  endpoint: "https://public-services.slip.wa.gov.au/public/rest/services/SLIP_Public_Services/People_and_Society/MapServer/7",
  outFields: "place_no,place_name,location,lga,her_record,more_info",
  pickCode:  (p) => s(p.her_record) ?? "Heritage Place",
  pickLabel: (p) => s(p.place_name),
  pickAttrs: (p) => ({
    placeNo:  s(p.place_no),
    location: s(p.location),
    lga:      s(p.lga),
    moreInfo: s(p.more_info),
  }),
};

export async function run(): Promise<void> {
  await runOverlayIngest(config);
}
