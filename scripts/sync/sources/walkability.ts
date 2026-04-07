/**
 * Walkability Score Sync (OpenStreetMap Overpass API)
 *
 * For each suburb with a known centroid, queries the Overpass API with a
 * combined query to count:
 *   - amenityCount: nodes tagged amenity=* or shop=* within 1 000 m
 *   - cyclewayCount: ways tagged highway=cycleway within 2 000 m
 *   - transitCount: nodes tagged public_transport=stop_position within 500 m
 *
 * Scores (0–100):
 *   walkScore   = min(100, amenityCount × 2)
 *   transitScore = min(100, transitCount × 10)
 *   bikeScore    = min(100, cyclewayCount × 5)
 *
 * Requests are throttled to ≤ 1 per second (Overpass fair-use policy).
 * Results are bulk-written to Suburb via a single SQL UNNEST statement.
 *
 * Data source: https://overpass-api.de/api/interpreter
 * Schedule: Annual
 */
import "dotenv/config";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";

const SOURCE_ID = "walkability";
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const USER_AGENT = "YourPropertyGuide/1.0 data-sync@yourpropertyguide.com.au";
const REQUEST_DELAY_MS = 1_000; // 1 req/s

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Build the Overpass QL query combining all three count dimensions. */
function buildQuery(lat: number, lng: number): string {
  return (
    `[out:json][timeout:30];\n` +
    `(\n` +
    `  node["amenity"~"cafe|restaurant|supermarket|pharmacy|bank|hospital|gym|library"](around:1000,${lat},${lng});\n` +
    `  node["shop"](around:1000,${lat},${lng});\n` +
    `  way["highway"="cycleway"](around:2000,${lat},${lng});\n` +
    `  node["public_transport"="stop_position"](around:500,${lat},${lng});\n` +
    `);\n` +
    `out body;`
  );
}

interface OverpassElement {
  type: "node" | "way" | "relation";
  id: number;
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements: OverpassElement[];
}

interface ScoreRow {
  id: string;
  walkScore: number;
  transitScore: number;
  bikeScore: number;
}

async function fetchScores(
  lat: number,
  lng: number
): Promise<{ walkScore: number; transitScore: number; bikeScore: number }> {
  const query = buildQuery(lat, lng);

  const res = await fetch(OVERPASS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": USER_AGENT,
    },
    body: `data=${encodeURIComponent(query)}`,
    signal: AbortSignal.timeout(45_000),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = (await res.json()) as OverpassResponse;
  const elements = data.elements ?? [];

  let amenityCount = 0;
  let cyclewayCount = 0;
  let transitCount = 0;

  for (const el of elements) {
    if (el.type === "node") {
      const tags = el.tags ?? {};
      if (tags.amenity || tags.shop) amenityCount++;
      if (tags.public_transport === "stop_position") transitCount++;
    } else if (el.type === "way") {
      const tags = el.tags ?? {};
      if (tags.highway === "cycleway") cyclewayCount++;
    }
  }

  return {
    walkScore:   Math.min(100, Math.round(amenityCount * 2)),
    transitScore: Math.min(100, transitCount * 10),
    bikeScore:   Math.min(100, cyclewayCount * 5),
  };
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    const suburbs = await prisma.suburb.findMany({
      where: { lat: { not: null }, lng: { not: null } },
      select: { id: true, slug: true, lat: true, lng: true },
    });

    log(SOURCE_ID, `processing ${suburbs.length} suburbs`);

    const rows: ScoreRow[] = [];
    let processed = 0;

    for (const suburb of suburbs) {
      const lat = suburb.lat as number;
      const lng = suburb.lng as number;

      try {
        const scores = await fetchScores(lat, lng);
        rows.push({ id: suburb.id, ...scores });
      } catch (err) {
        log(SOURCE_ID, `warn: ${suburb.slug} overpass failed — ${(err as Error).message}`);
      }

      processed++;
      if (processed % 50 === 0) {
        log(SOURCE_ID, `progress: ${processed} / ${suburbs.length}`);
      }

      // Throttle: 1 request per second
      await sleep(REQUEST_DELAY_MS);
    }

    // Bulk write via UNNEST — single round-trip
    if (rows.length > 0) {
      const now = new Date();
      await prisma.$executeRaw`
        UPDATE "Suburb" AS s
        SET
          "walkScore"            = u.walk_score::int,
          "transitScore"         = u.transit_score::int,
          "bikeScore"            = u.bike_score::int,
          "walkabilityUpdatedAt" = ${now}
        FROM UNNEST(
          ${rows.map((r) => r.id)}::text[],
          ${rows.map((r) => r.walkScore)}::int[],
          ${rows.map((r) => r.transitScore)}::int[],
          ${rows.map((r) => r.bikeScore)}::int[]
        ) AS u(id, walk_score, transit_score, bike_score)
        WHERE s.id = u.id
      `;
      log(SOURCE_ID, `bulk-updated ${rows.length} suburbs`);
    }

    await finishSync(SOURCE_ID, rows.length);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
