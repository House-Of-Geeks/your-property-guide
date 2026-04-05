/**
 * Nearby Suburbs
 *
 * Computes the 6 nearest suburbs (by straight-line distance) for every suburb
 * that has lat/lng coordinates. Uses in-memory Haversine within each state
 * to avoid N² cross-state comparisons, then bulk-updates via UNNEST.
 *
 * Schedule: annual (run after import-suburbs-all to pick up new suburbs)
 */
import "dotenv/config";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";

const SOURCE_ID    = "nearby-suburbs";
const MAX_NEARBY   = 6;
const MAX_RADIUS_KM = 75; // ignore suburbs more than 75 km away
const CHUNK        = 500;

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R    = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a    =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    log(SOURCE_ID, "loading all suburbs with coordinates...");
    const all = await prisma.suburb.findMany({
      select: { id: true, slug: true, state: true, lat: true, lng: true },
    });
    log(SOURCE_ID, `${all.length} suburbs loaded`);

    // Group by state — no need to compare QLD suburbs to WA suburbs
    const byState = new Map<string, typeof all>();
    for (const s of all) {
      if (!byState.has(s.state)) byState.set(s.state, []);
      byState.get(s.state)!.push(s);
    }

    const updates: { id: string; nearby: string }[] = [];

    for (const [state, stateSuburbs] of byState) {
      const withCoords = stateSuburbs.filter((s) => s.lat !== null && s.lng !== null);
      log(SOURCE_ID, `${state}: ${withCoords.length}/${stateSuburbs.length} suburbs have coordinates`);

      for (const s of withCoords) {
        const lat1 = s.lat!;
        const lng1 = s.lng!;

        const nearest = stateSuburbs
          .filter((t) => t.id !== s.id && t.lat !== null && t.lng !== null)
          .map((t) => ({ slug: t.slug, dist: haversineKm(lat1, lng1, t.lat!, t.lng!) }))
          .filter((t) => t.dist <= MAX_RADIUS_KM)
          .sort((a, b) => a.dist - b.dist)
          .slice(0, MAX_NEARBY)
          .map((t) => t.slug);

        updates.push({ id: s.id, nearby: JSON.stringify(nearest) });
      }
    }

    log(SOURCE_ID, `updating ${updates.length} suburbs...`);

    let updated = 0;
    for (let i = 0; i < updates.length; i += CHUNK) {
      const chunk = updates.slice(i, i + CHUNK);
      const ids    = chunk.map((u) => u.id);
      const jsons  = chunk.map((u) => u.nearby);

      // UNNEST the two parallel arrays, then parse the JSON slug arrays
      await prisma.$executeRaw`
        UPDATE "Suburb" s
        SET "nearbySuburbs" = ARRAY(SELECT jsonb_array_elements_text(v.nearby::jsonb))
        FROM (SELECT unnest(${ids}::text[]) AS id, unnest(${jsons}::text[]) AS nearby) v
        WHERE s.id = v.id
      `;

      updated += chunk.length;
      if (updated % 5000 === 0 || updated === updates.length) {
        log(SOURCE_ID, `  ${updated}/${updates.length} updated`);
      }
    }

    log(SOURCE_ID, `done — ${updated} suburbs updated`);
    await finishSync(SOURCE_ID, updated);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
