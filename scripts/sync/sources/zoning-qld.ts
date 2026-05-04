/**
 * QLD Land Zoning Ingest — Multi-LGA aggregator.
 *
 * QLD has no aggregated statewide planning scheme zone layer. Each council
 * publishes its own. This source uses the multi-LGA adapter to union the
 * largest 9 council areas (~73% of QLD population) into a single statewide
 * R-tree before matching.
 *
 * Coverage:
 *   Brisbane (1.27M), Gold Coast (620k), Moreton Bay (480k), Sunshine Coast
 *   (350k), Ipswich (245k), Townsville (196k), Toowoomba (170k), Redland
 *   (160k), Bundaberg (97k).
 *
 * Confirmed unavailable (PDF-only or contact-required):
 *   Cairns (~166k), Mackay (~117k), Fraser Coast (~110k), Rockhampton (~84k).
 *   Logan (~358k) endpoint Zones_V9_2_WFL1 returns non-JSON / HTTP 400 on
 *   every paginated query as of May 2026 — disabled.
 *
 * Note: Brisbane and Moreton Bay follow the QLD QPP standard (LVL1_ZONE,
 * LVL2_ZONE, ZONE_CODE). Gold Coast partially follows. Sunshine Coast uses
 * non-standard names (LABEL/HEADING/DESCRIPT). Each LGA config maps fields
 * appropriately.
 */
import { runOverlayIngest } from "../lib/runner";
import { s } from "../lib/types";
import type { MultiLgaConfig } from "../lib/types";

const config: MultiLgaConfig = {
  adapter: "multi-lga",
  sourceId: "zoning-qld",
  overlayKind: "zoning",
  overlaySource: "qld-multi-lga",
  state: "QLD",
  minAddressCount: 1_000_000,
  lgas: [
    {
      id: "brisbane",
      name: "Brisbane City Council",
      endpoint: "https://services2.arcgis.com/dEKgZETqwmDAh1rP/arcgis/rest/services/Zoning_opendata/FeatureServer/0",
      outFields: "ZONE_CODE,LVL1_ZONE,LVL2_ZONE,ZONE_PREC",
      pickCode:  (p) => s(p.ZONE_CODE) ?? s(p.LVL2_ZONE) ?? s(p.LVL1_ZONE),
      pickLabel: (p) => s(p.LVL2_ZONE) ?? s(p.LVL1_ZONE),
    },
    {
      id: "gold-coast",
      name: "City of Gold Coast",
      endpoint: "https://services.arcgis.com/3vStCH7NDoBOZ5zn/arcgis/rest/services/Zone/FeatureServer/0",
      outFields: "LVL1_ZONE,ZONE_PRECINCT",
      pickCode:  (p) => s(p.LVL1_ZONE),
      pickLabel: (p) => s(p.LVL1_ZONE),
    },
    {
      id: "sunshine-coast",
      name: "Sunshine Coast Council",
      endpoint: "https://services-ap1.arcgis.com/YQyt7djuXN7rQyg4/arcgis/rest/services/PlanningScheme_Zoning_SCC/FeatureServer/5",
      outFields: "LABEL,HEADING,DESCRIPT",
      pickCode:  (p) => s(p.LABEL) ?? s(p.HEADING),
      pickLabel: (p) => s(p.HEADING) ?? s(p.DESCRIPT),
    },
    {
      id: "moreton-bay",
      name: "Moreton Bay Regional Council",
      endpoint: "https://services-ap1.arcgis.com/152ojN3Ts9H3cdtl/arcgis/rest/services/ZM_Zones_Dissolved_WebMercator_OpenData/FeatureServer/0",
      outFields: "LVL1_ZONE,ZONE_PREC,LP",
      pickCode:  (p) => s(p.ZONE_PREC) ?? s(p.LVL1_ZONE),
      pickLabel: (p) => s(p.LVL1_ZONE),
    },
    {
      id: "ipswich",
      name: "Ipswich City Council",
      endpoint: "https://services3.arcgis.com/bMcI7aKgIy0360Q8/arcgis/rest/services/ICC_Ipswich_Planning_Scheme_Zones_geojson/FeatureServer/0",
      outFields: "NAME,CODE,LABEL,DETAILS",
      pickCode:  (p) => s(p.CODE) ?? s(p.LABEL),
      pickLabel: (p) => s(p.NAME) ?? s(p.LABEL),
    },
    {
      id: "townsville",
      name: "Townsville City Council",
      endpoint: "https://services6.arcgis.com/3VCE6mezZtwKJeIR/arcgis/rest/services/TCC_City_Planning_Scheme_Zoning_GDA2020/FeatureServer/0",
      outFields: "TCC_CODE,LVL1_ZONE,LVL2_ZONE,ZONE_PREC,LP,LP_PREC",
      pickCode:  (p) => s(p.TCC_CODE) ?? s(p.ZONE_PREC) ?? s(p.LVL1_ZONE),
      pickLabel: (p) => s(p.LVL2_ZONE) ?? s(p.LVL1_ZONE),
    },
    {
      id: "toowoomba",
      name: "Toowoomba Regional Council",
      endpoint: "https://maps.tr.qld.gov.au/arcgis/rest/services/External/External_PlanningScheme/MapServer/170",
      outFields: "QPP_Zone,Precinct",
      pickCode:  (p) => s(p.QPP_Zone),
      pickLabel: (p) => s(p.QPP_Zone),
    },
    {
      id: "redland",
      name: "Redland City Council",
      endpoint: "https://gis.redland.qld.gov.au/arcgis/rest/services/planning/city_plan/MapServer/44",
      outFields: "QPP_Zone,QPP_Description,QPP_Precinct",
      pickCode:  (p) => s(p.QPP_Zone),
      pickLabel: (p) => s(p.QPP_Description) ?? s(p.QPP_Zone),
    },
    {
      id: "bundaberg",
      name: "Bundaberg Regional Council",
      endpoint: "https://mappingdata.bundaberg.qld.gov.au/arcgis/rest/services/2015_Adopted_Planning_Scheme_Zoning/MapServer/6",
      outFields: "ZONE,Zone_Precincts,CF_Label",
      pickCode:  (p) => s(p.ZONE),
      pickLabel: (p) => s(p.Zone_Precincts) ?? s(p.ZONE),
    },
    // Logan: endpoint Zones_V9_2_WFL1 returns non-JSON / HTTP 400 on every
    // paginated query as of May 2026. Re-enable when a working endpoint is found.
  ],
};

export async function run(): Promise<void> {
  await runOverlayIngest(config);
}
