/**
 * Bushfire Hazard Sync (State GeoJSON sources)
 *
 * For each Australian state that provides a publicly downloadable bushfire
 * prone area / fire prone area GeoJSON or similar vector dataset, this script:
 *   1. Downloads the GeoJSON for that state.
 *   2. Loads all suburbs for that state with a known centroid.
 *   3. Uses point-in-polygon to determine whether the centroid falls within a
 *      bushfire prone area and, if so, the risk level.
 *   4. Upserts SuburbHazard.bushfireRisk + bushfireSource and updates
 *      Suburb.hazardUpdatedAt.
 *
 * STATE_SOURCES is a plain array so URLs and field mappings can be updated
 * easily as state portals change over time.
 *
 * Risk normalisation per state:
 *   NSW  — field "BFP_CATEGORY": "Vegetation Buffer" → "low",
 *           "Vegetation Category 3" → "low",
 *           "Vegetation Category 2" → "medium",
 *           "Vegetation Category 1" → "high"
 *   VIC  — field "CATEGORY": "FZ" (Fire Zone) → "high"; "BAL" → "medium"
 *   QLD  — field "BPA_CLASS": "High" → "high", "Medium" → "medium", "Low" → "low"
 *   SA   — field "RISK_LEVEL": "High" → "high", "Medium" → "medium", "Low" → "low"
 *   WA   — field "TYPE": "Bushfire Prone Area" → "medium" (WA publishes binary only)
 *
 * NOTE: Several of these portal URLs require periodic verification.  Each
 * STATE_SOURCES entry includes a `comment` field that documents the expected
 * risk field name so a maintainer can update it without reading the full code.
 *
 * Data sources:
 *   NSW: https://datasets.seed.nsw.gov.au/dataset/bush-fire-prone-land
 *   VIC: https://discover.data.vic.gov.au/dataset/fire-prone-area
 *   QLD: https://qldspatial.information.qld.gov.au
 *   SA:  https://data.sa.gov.au/data/dataset/bushfire-prone-areas
 *   WA:  https://catalogue.data.wa.gov.au
 * Schedule: Annual
 */
import "dotenv/config";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point, polygon, multiPolygon } from "@turf/helpers";
import type { Feature, Polygon, MultiPolygon, GeoJsonProperties } from "geojson";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";

const SOURCE_ID = "hazard-bushfire";

// ── State source definitions ────────────────────────────────────────────────

interface StateSource {
  state: string;
  /** Direct GeoJSON download URL (or WFS equivalent returning GeoJSON). */
  url: string;
  /** The GeoJSON feature property that carries the risk/category value. */
  riskField: string;
  /** Normalise raw property value → "high" | "medium" | "low" | null */
  normalise: (raw: string) => "high" | "medium" | "low" | null;
  /** Human note for maintainers — shown in logs. */
  comment: string;
}

const STATE_SOURCES: StateSource[] = [
  {
    state: "NSW",
    // SEED NSW — Bush Fire Prone Land WFS GeoJSON endpoint.
    // If this URL is inaccessible, obtain the updated URL from:
    // https://datasets.seed.nsw.gov.au/dataset/bush-fire-prone-land
    // riskField: "BFP_CATEGORY" — values: "Vegetation Category 1/2/3", "Vegetation Buffer"
    url: "https://mapprod3.environment.nsw.gov.au/arcgis/rest/services/ePlanning/Planning_Portal_Hazard/MapServer/229/query?where=1%3D1&outFields=BFP_CATEGORY&f=geojson&resultRecordCount=50000",
    riskField: "BFP_CATEGORY",
    normalise: (raw) => {
      const v = raw.trim().toLowerCase();
      if (v.includes("category 1")) return "high";
      if (v.includes("category 2")) return "medium";
      if (v.includes("category 3") || v.includes("buffer")) return "low";
      return null;
    },
    comment: "NSW Planning Portal — BFP_CATEGORY field",
  },
  {
    state: "VIC",
    // data.vic.gov.au — Fire Prone Areas (DEECA).
    // riskField: "CATEGORY" — values: "FZ" (Fire Zone), "BAL" (Bushfire Attack Level)
    url: "https://opendata.maps.vic.gov.au/geoserver/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=open-data-platform:fire_prone_area&outputFormat=application/json&count=50000",
    riskField: "CATEGORY",
    normalise: (raw) => {
      const v = raw.trim().toUpperCase();
      if (v === "FZ") return "high";
      if (v.startsWith("BAL")) return "medium";
      return "low";
    },
    comment: "VIC DEECA — CATEGORY field: FZ=high, BAL*=medium, others=low",
  },
  {
    state: "QLD",
    // QLD Spatial — Bushfire Prone Area.
    // riskField: "BPA_CLASS" — values typically "High", "Medium", "Low"
    url: "https://spatial-gis.information.qld.gov.au/arcgis/rest/services/Boundaries/QldBushfireProneArea/MapServer/0/query?where=1%3D1&outFields=BPA_CLASS&f=geojson&resultRecordCount=50000",
    riskField: "BPA_CLASS",
    normalise: (raw) => {
      const v = raw.trim().toLowerCase();
      if (v === "high")   return "high";
      if (v === "medium") return "medium";
      if (v === "low")    return "low";
      return "medium"; // conservative fallback for unknown QLD classes
    },
    comment: "QLD Spatial — BPA_CLASS field",
  },
  {
    state: "SA",
    // data.sa.gov.au — Bushfire Prone Areas.
    // riskField: "RISK_LEVEL" — values: "High", "Medium", "Low"
    url: "https://data.sa.gov.au/data/dataset/6ae57e3a-0de0-40c9-9a1c-e32f99e1c5a7/resource/fd4dfd4e-4f59-4bd7-b2de-9e1c5c3c1d56/download/bushfire_prone_areas.geojson",
    riskField: "RISK_LEVEL",
    normalise: (raw) => {
      const v = raw.trim().toLowerCase();
      if (v === "high")   return "high";
      if (v === "medium") return "medium";
      if (v === "low")    return "low";
      return null;
    },
    comment: "SA data.gov.au — RISK_LEVEL field",
  },
  {
    state: "WA",
    // WA DFES — Bushfire Prone Area (binary; WA does not publish risk tiers).
    // riskField: "TYPE" — value: "Bushfire Prone Area"
    url: "https://catalogue.data.wa.gov.au/dataset/bushfire-prone-area/resource/91a30d82-6a31-4932-aacc-3ace51987c71/download/bushfire_prone_area.geojson",
    riskField: "TYPE",
    normalise: (raw) => {
      // WA only distinguishes "in" vs "not in" — treat all as "medium"
      return raw.trim().length > 0 ? "medium" : null;
    },
    comment: "WA DFES — TYPE field (binary, no risk tiers — defaults to medium)",
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type GeoJSONGeometry = Polygon | MultiPolygon;

function pointInFeature(
  lat: number,
  lng: number,
  feature: Feature<GeoJSONGeometry, GeoJsonProperties>
): boolean {
  const pt = point([lng, lat]);
  const geom = feature.geometry;
  if (!geom) return false;
  try {
    if (geom.type === "Polygon") {
      return booleanPointInPolygon(pt, polygon(geom.coordinates));
    } else if (geom.type === "MultiPolygon") {
      return booleanPointInPolygon(pt, multiPolygon(geom.coordinates));
    }
  } catch {
    // malformed geometry — skip
  }
  return false;
}

// ── Main ────────────────────────────────────────────────────────────────────

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    let totalUpserted = 0;
    const now = new Date();

    for (const source of STATE_SOURCES) {
      log(SOURCE_ID, `${source.state}: downloading from ${source.url}`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let geojson: { features: any[] } | null = null;
      try {
        const res = await fetch(source.url, {
          headers: { "User-Agent": "YourPropertyGuide/1.0 data-sync@yourpropertyguide.com.au" },
          signal: AbortSignal.timeout(120_000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        geojson = await res.json();
      } catch (err) {
        log(SOURCE_ID, `${source.state}: download failed — ${(err as Error).message} — skipping`);
        continue;
      }

      if (!geojson?.features?.length) {
        log(SOURCE_ID, `${source.state}: no features returned — skipping`);
        continue;
      }
      log(SOURCE_ID, `${source.state}: ${geojson.features.length} polygons loaded`);

      // Load suburbs for this state with known centroids
      const suburbs = await prisma.suburb.findMany({
        where: { state: source.state, lat: { not: null }, lng: { not: null } },
        select: { id: true, slug: true, lat: true, lng: true },
      });
      log(SOURCE_ID, `${source.state}: testing ${suburbs.length} suburb centroids`);

      let stateCount = 0;

      for (const suburb of suburbs) {
        const lat = suburb.lat as number;
        const lng = suburb.lng as number;

        let bushfireRisk: "high" | "medium" | "low" | null = null;

        for (const feature of geojson.features) {
          const rawVal: string =
            feature?.properties?.[source.riskField] ??
            feature?.properties?.[source.riskField.toLowerCase()] ??
            "";

          const normalised = source.normalise(String(rawVal));
          if (!normalised) continue;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (pointInFeature(lat, lng, feature as Feature<GeoJSONGeometry, any>)) {
            // Promote to higher risk if multiple polygons match
            const rankMap: Record<string, number> = { low: 1, medium: 2, high: 3 };
            if (!bushfireRisk || rankMap[normalised] > rankMap[bushfireRisk]) {
              bushfireRisk = normalised;
            }
          }
        }

        await prisma.suburbHazard.upsert({
          where: { suburbSlug: suburb.slug },
          create: {
            suburbSlug:     suburb.slug,
            bushfireRisk:   bushfireRisk,
            bushfireSource: `state-${source.state.toLowerCase()}`,
            assessedAt:     now,
          },
          update: {
            bushfireRisk:   bushfireRisk,
            bushfireSource: `state-${source.state.toLowerCase()}`,
            assessedAt:     now,
          },
        });

        await prisma.suburb.update({
          where: { id: suburb.id },
          data:  { hazardUpdatedAt: now },
        });

        stateCount++;
      }

      log(SOURCE_ID, `${source.state}: upserted ${stateCount} SuburbHazard records`);
      totalUpserted += stateCount;

      // Brief pause between states to avoid hammering portals back-to-back
      await sleep(1000);
    }

    await finishSync(SOURCE_ID, totalUpserted);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
