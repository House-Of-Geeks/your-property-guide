/**
 * Flood Hazard Sync (GA AFRIP WFS)
 *
 * For each suburb with a known centroid (lat + lng), queries the Geoscience
 * Australia Australian Flood Risk Information Portal (AFRIP) WFS to retrieve
 * flood hazard zone polygons in a small bounding box around the centroid,
 * then uses point-in-polygon to determine the flood classification.
 *
 * FLOOD_CLASS mapping:
 *   "High Floodplain"   → "high"
 *   "Medium Floodplain" → "medium"
 *   "Low Floodplain"    → "low"
 *   "Floodway"          → "floodway"
 *   (no match)          → null
 *
 * Processed in batches of 20 suburbs with 500 ms delay between batches to
 * respect the WFS rate limits.
 *
 * Data source: https://www.ga.gov.au/geoserver/ows (AFRIP:FHZ_Level_1)
 * Schedule: Annual
 */
import "dotenv/config";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point, polygon, multiPolygon } from "@turf/helpers";
import type { Feature, Polygon, MultiPolygon, GeoJsonProperties } from "geojson";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";

const SOURCE_ID = "hazard-flood";

const WFS_BASE =
  "https://www.ga.gov.au/geoserver/ows?service=WFS&version=2.0.0&request=GetFeature" +
  "&typeName=AFRIP:FHZ_Level_1&outputFormat=application/json";

const FLOOD_CLASS_MAP: Record<string, string> = {
  "High Floodplain":   "high",
  "Medium Floodplain": "medium",
  "Low Floodplain":    "low",
  "Floodway":          "floodway",
};

const BATCH_SIZE = 20;
const BATCH_DELAY_MS = 500;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Query GA AFRIP WFS for a 0.05° bbox around the centroid and classify. */
async function classifyFlood(lat: number, lng: number): Promise<string | null> {
  const bbox = `${lng - 0.05},${lat - 0.05},${lng + 0.05},${lat + 0.05},EPSG:4326`;
  const url = `${WFS_BASE}&bbox=${bbox}`;

  const res = await fetch(url, {
    headers: { "User-Agent": "YourPropertyGuide/1.0 data-sync@yourpropertyguide.com.au" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const geojson = (await res.json()) as { features: any[] };
  if (!geojson?.features?.length) return null;

  const centroid = point([lng, lat]);

  for (const feature of geojson.features) {
    const classRaw: string = feature?.properties?.FLOOD_CLASS ?? feature?.properties?.flood_class ?? "";
    const floodClass = FLOOD_CLASS_MAP[classRaw.trim()] ?? null;
    if (!floodClass) continue;

    const geom = feature.geometry as Feature<Polygon | MultiPolygon, GeoJsonProperties>["geometry"];
    if (!geom) continue;

    let inside = false;
    if (geom.type === "Polygon") {
      inside = booleanPointInPolygon(centroid, polygon(geom.coordinates));
    } else if (geom.type === "MultiPolygon") {
      inside = booleanPointInPolygon(centroid, multiPolygon(geom.coordinates));
    }

    if (inside) return floodClass;
  }

  return null;
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    // Load all suburbs with known centroids
    const suburbs = await prisma.suburb.findMany({
      where: { lat: { not: null }, lng: { not: null } },
      select: { id: true, slug: true, lat: true, lng: true },
    });

    log(SOURCE_ID, `processing ${suburbs.length} suburbs with centroids`);

    let upserted = 0;
    const now = new Date();

    for (let i = 0; i < suburbs.length; i += BATCH_SIZE) {
      const batch = suburbs.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async (suburb) => {
          const lat = suburb.lat as number;
          const lng = suburb.lng as number;

          let floodClass: string | null = null;
          try {
            floodClass = await classifyFlood(lat, lng);
          } catch (err) {
            log(SOURCE_ID, `warn: ${suburb.slug} flood query failed — ${(err as Error).message}`);
            return; // skip this suburb, continue with others
          }

          await prisma.suburbHazard.upsert({
            where: { suburbSlug: suburb.slug },
            create: {
              suburbSlug: suburb.slug,
              floodClass:  floodClass ?? null,
              floodSource: "ga-afrip",
              assessedAt:  now,
            },
            update: {
              floodClass:  floodClass ?? null,
              floodSource: "ga-afrip",
              assessedAt:  now,
            },
          });

          await prisma.suburb.update({
            where: { id: suburb.id },
            data:  { hazardUpdatedAt: now },
          });

          upserted++;
        })
      );

      const batchEnd = Math.min(i + BATCH_SIZE, suburbs.length);
      log(SOURCE_ID, `batch ${Math.floor(i / BATCH_SIZE) + 1}: processed ${batchEnd} / ${suburbs.length}`);

      if (batchEnd < suburbs.length) {
        await sleep(BATCH_DELAY_MS);
      }
    }

    await finishSync(SOURCE_ID, upserted);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
