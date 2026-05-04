/**
 * Multi-LGA aggregator — used by `zoning-qld` where each council publishes
 * its own ArcGIS endpoint and we union them into a single statewide R-tree.
 *
 * Each LGA is fetched independently using the arcgis-paginated adapter; one
 * LGA failing does not abort the rest. Polygons are tagged with the source
 * LGA in `attrs.lga`.
 */
import { downloadArcGisPaginated, arcgisPreflight } from "./arcgis-paginated";
import type { OverlayPolygon, MultiLgaConfig, ArcGisPaginatedConfig } from "../types";

export async function downloadMultiLga(
  cfg: MultiLgaConfig,
  log: (msg: string) => void,
  useCache: boolean,
): Promise<OverlayPolygon[]> {
  log(`active LGAs: ${cfg.lgas.map((l) => l.id).join(", ")}`);

  // Pre-flight every LGA endpoint; warn but don't abort on failures.
  for (const lga of cfg.lgas) {
    const count = await arcgisPreflight(lga.endpoint);
    if (count == null) {
      log(`pre-flight: ${lga.id} unreachable — will skip`);
    } else {
      log(`pre-flight: ${lga.id} reports ${count.toLocaleString()} polygons available ✓`);
    }
  }

  const allFeatures: OverlayPolygon[] = [];
  for (const lga of cfg.lgas) {
    const subCfg: ArcGisPaginatedConfig = {
      adapter: "arcgis-paginated",
      sourceId: `${cfg.sourceId}-${lga.id}`,  // unique cache key per LGA
      overlayKind: cfg.overlayKind,
      overlaySource: cfg.overlaySource,
      state: cfg.state,
      minAddressCount: cfg.minAddressCount,
      endpoint: lga.endpoint,
      outFields: lga.outFields,
      pickCode:  lga.pickCode,
      pickLabel: lga.pickLabel,
      pickAttrs: () => ({ lga: lga.name, lgaId: lga.id }),
    };
    try {
      const lgaFeatures = await downloadArcGisPaginated(subCfg, (m) => log(`[${lga.id}] ${m}`), useCache);
      allFeatures.push(...lgaFeatures);
    } catch (e) {
      log(`[${lga.id}] FAILED: ${e instanceof Error ? e.message : String(e)} — continuing with remaining LGAs`);
    }
  }
  log(`downloaded ${allFeatures.length.toLocaleString()} polygons across ${cfg.lgas.length} LGAs`);
  return allFeatures;
}
