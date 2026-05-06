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
 * Throttling: 3s between requests, exponential backoff to 60s on HTTP 429.
 * Resumability: skips suburbs whose `walkabilityUpdatedAt` is set so a
 * killed run can be restarted without redoing finished work. Each suburb
 * commits as it succeeds (no big bulk write at the end).
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
const BASE_DELAY_MS = 3_000; // 3 s between requests — Overpass fair-use is "<1 req/s" but
                              // their public instance throttles aggressively at 1 req/s.
const MAX_DELAY_MS = 60_000;  // backoff ceiling on 429s
// Refresh suburbs whose walkability data is older than this. Set to 365 days
// so the annual cron re-scores everyone; resume keeps work below this age.
const STALE_AFTER_MS = 365 * 24 * 60 * 60 * 1_000;

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
  lng: number,
  retries = 4,
): Promise<{ walkScore: number; transitScore: number; bikeScore: number }> {
  const query = buildQuery(lat, lng);

  let lastErr: Error | undefined;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": USER_AGENT,
      },
      body: `data=${encodeURIComponent(query)}`,
      signal: AbortSignal.timeout(45_000),
    });

    // 429 / 504 — back off and retry. Anything else 4xx — surface immediately.
    if (res.status === 429 || res.status === 504 || res.status === 502 || res.status === 503) {
      lastErr = new Error(`HTTP ${res.status}`);
      const backoff = Math.min(MAX_DELAY_MS, BASE_DELAY_MS * Math.pow(2, attempt));
      await sleep(backoff);
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = (await res.json()) as OverpassResponse;
    const elements = data.elements ?? [];
    return computeScores(elements);
  }
  throw lastErr ?? new Error("retries exhausted");
}

function computeScores(elements: OverpassElement[]): {
  walkScore: number; transitScore: number; bikeScore: number;
} {

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
    // Resume support: only process suburbs that have never been scored OR
    // whose data is older than STALE_AFTER_MS. A killed-and-restarted run
    // picks up where it left off; the annual cron re-scores everyone.
    const staleThreshold = new Date(Date.now() - STALE_AFTER_MS);
    const suburbs = await prisma.suburb.findMany({
      where: {
        lat: { not: null },
        lng: { not: null },
        OR: [
          { walkabilityUpdatedAt: null },
          { walkabilityUpdatedAt: { lt: staleThreshold } },
        ],
      },
      select: { id: true, slug: true, lat: true, lng: true },
    });

    const totalSuburbs = await prisma.suburb.count({
      where: { lat: { not: null }, lng: { not: null } },
    });
    log(
      SOURCE_ID,
      `${suburbs.length} suburbs need scoring (${totalSuburbs - suburbs.length} already fresh, will skip)`,
    );

    let succeeded = 0;
    let failed = 0;
    let processed = 0;

    for (const suburb of suburbs) {
      const lat = suburb.lat as number;
      const lng = suburb.lng as number;

      try {
        const scores = await fetchScores(lat, lng);
        // Per-suburb commit so partial runs survive interruption.
        await prisma.suburb.update({
          where: { id: suburb.id },
          data: {
            walkScore: scores.walkScore,
            transitScore: scores.transitScore,
            bikeScore: scores.bikeScore,
            walkabilityUpdatedAt: new Date(),
          },
        });
        succeeded++;
      } catch (err) {
        log(SOURCE_ID, `warn: ${suburb.slug} overpass failed — ${(err as Error).message}`);
        failed++;
      }

      processed++;
      if (processed % 50 === 0) {
        log(SOURCE_ID, `progress: ${processed} / ${suburbs.length} (ok=${succeeded}, failed=${failed})`);
      }

      await sleep(BASE_DELAY_MS);
    }

    log(SOURCE_ID, `done: scored ${succeeded}, failed ${failed} of ${suburbs.length}`);
    await finishSync(SOURCE_ID, succeeded);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
