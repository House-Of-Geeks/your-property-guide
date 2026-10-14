/**
 * Climate averages sync (SILO DataDrill), replacing the BoM CDO scraper (Oct 2026).
 *
 * Writes one SuburbClimate row per suburb with a known centroid: 1991–2020
 * monthly normals of mean max and min temperature and rainfall for the
 * suburb's own point on SILO's ~5 km grid. The rules are in
 * silo-climate-rules.ts (and why SILO, not BoM's site, at the top of it).
 *
 * How:
 *   - Suburbs are grouped by grid cell; each cell is one DataDrill request
 *     (format=monthly, 1991-01-01 to 2020-12-31), so ~18k suburbs need ~12k
 *     requests. A request takes ~2.5 s, so WORKERS run side by side while
 *     request starts stay START_GAP_MS apart: about one a second overall
 *     (~3.5 hours), the same load as one at a time with a pause.
 *   - A cell without temperatures (sea, for a coastal or island suburb; SILO
 *     returns zeros there) falls back to the nearest neighbouring cell that
 *     has the full set.
 *   - Resumable: suburbs whose row came from SILO in the last FRESH_DAYS are
 *     skipped, so a run cut off by the Actions time limit continues where it
 *     stopped when run again.
 *   - It stops (and keeps the existing data) after MAX_CONSECUTIVE_FAILURES
 *     failed cells in a row, rather than writing gaps for every suburb.
 *     Database writes retry through a dropped connection (withDbRetry); for
 *     a run from outside Railway set SYNC_QUERY_TIMEOUT_MS (see ../db.ts) so a
 *     silently dropped connection errors instead of hanging.
 *
 * Rows keep the BoM-era column names: bomStationId = "silo:<lat>,<lon>",
 * bomStationName = "SILO grid point <lat>, <lon>", distanceKm = suburb
 * centroid to the grid point. src/lib/climate.ts reads the "silo:" prefix
 * for the source line.
 *
 * Needs SILO_API_EMAIL: SILO identifies API users by an email address
 * (no sign-up). Licence: CC BY 4.0, © State of Queensland; the pages credit
 * SILO and the Bureau of Meteorology observations it is built from.
 *
 * Data source: https://www.longpaddock.qld.gov.au/silo/
 * Schedule: Annual (the normals only change when the period does)
 */
import "dotenv/config";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import {
  type GridCell,
  type Normals,
  NORMAL_FROM,
  NORMAL_TO,
  cellOf,
  hasClimate,
  haversineKm,
  isComplete,
  monthlyNormals,
  neighbourCells,
  parseSiloMonthly,
  siloStationId,
  siloStationName,
  toStoredClimate,
} from "./silo-climate-rules";

const SOURCE_ID = "silo-climate";
const ENDPOINT = "https://www.longpaddock.qld.gov.au/cgi-bin/silo/DataDrillDataset.php";
const WORKERS = 3;
const START_GAP_MS = 1000;
const RETRY_DELAYS_MS = [5_000, 20_000, 60_000];
const FRESH_DAYS = 30;
const MAX_CONSECUTIVE_FAILURES = 25;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// The production database sits behind Railway's TCP proxy, which drops a
// connection now and then over a multi-hour run ("Server has closed the
// connection"). Prisma reconnects on the next query, so a dropped
// connection is retried rather than ending the run.
const DB_RETRY_DELAYS_MS = [2_000, 10_000, 30_000];
const isConnectionError = (err: unknown) =>
  /closed the connection|connection terminated|ECONNRESET|ETIMEDOUT|timeout|P1001|P1017|Can't reach database/i.test(String((err as Error)?.message ?? err));

async function withDbRetry<T>(fn: () => Promise<T>): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= DB_RETRY_DELAYS_MS.length || !isConnectionError(err)) throw err;
      await sleep(DB_RETRY_DELAYS_MS[attempt]);
    }
  }
}

/** One DataDrill request, retried on network errors and 5xx/429. Null when SILO has no data there. */
async function fetchCell(c: GridCell, email: string): Promise<Normals | null> {
  const qs = new URLSearchParams({
    lat: c.lat.toFixed(2),
    lon: c.lon.toFixed(2),
    start: `${NORMAL_FROM}0101`,
    finish: `${NORMAL_TO}1231`,
    format: "monthly",
    username: email,
    password: "apirequest",
  });
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(`${ENDPOINT}?${qs}`, {
        headers: { "User-Agent": "YourPropertyGuide-climate-sync/1.0 (+https://www.yourpropertyguide.com.au)" },
        signal: AbortSignal.timeout(60_000),
      });
      if (res.status === 429 || res.status >= 500) throw new Error(`HTTP ${res.status}`);
      if (!res.ok) return null;
      const normals = monthlyNormals(parseSiloMonthly(await res.text()));
      return hasClimate(normals) ? normals : null;
    } catch (err) {
      if (attempt >= RETRY_DELAYS_MS.length) throw err;
      await sleep(RETRY_DELAYS_MS[attempt]);
    }
  }
}

/** Keep the DataSource row (read by /data and the sync logger) in place. */
async function ensureSource(): Promise<void> {
  await prisma.dataSource.upsert({
    where: { id: SOURCE_ID },
    create: {
      id: SOURCE_ID,
      label: "Climate averages (SILO, Queensland Government)",
      category: "climate",
      schedule: "annual",
      sourceUrl: "https://www.longpaddock.qld.gov.au/silo/",
    },
    update: {},
  });
}

export async function run(): Promise<void> {
  const email = process.env.SILO_API_EMAIL?.trim();
  if (!email) throw new Error("SILO_API_EMAIL is not set: SILO identifies API users by an email address");

  await ensureSource();
  await startSync(SOURCE_ID);
  try {
    const suburbs = await prisma.suburb.findMany({
      where: { lat: { not: null }, lng: { not: null } },
      select: { id: true, slug: true, lat: true, lng: true },
    });
    const since = new Date(Date.now() - FRESH_DAYS * 24 * 3600 * 1000);
    const fresh = new Set(
      (
        await prisma.suburbClimate.findMany({
          where: { bomStationId: { startsWith: "silo:" }, assessedAt: { gte: since } },
          select: { suburbSlug: true },
        })
      ).map((r) => r.suburbSlug),
    );

    // Group the suburbs still to do by grid cell.
    const byCell = new Map<string, { cell: GridCell; suburbs: typeof suburbs }>();
    for (const s of suburbs) {
      if (fresh.has(s.slug)) continue;
      const c = cellOf(s.lat as number, s.lng as number);
      const group = byCell.get(c.key) ?? { cell: c, suburbs: [] };
      group.suburbs.push(s);
      byCell.set(c.key, group);
    }
    log(SOURCE_ID, `${suburbs.length} suburbs, ${fresh.size} already done, ${byCell.size} grid cells to fetch`);

    // Each cell fetched at most once per run (in-flight requests shared),
    // and request starts paced START_GAP_MS apart across all workers.
    const cache = new Map<string, Promise<Normals | null>>();
    let nextStart = 0;
    const paced = async () => {
      const at = Math.max(Date.now(), nextStart);
      nextStart = at + START_GAP_MS;
      if (at > Date.now()) await sleep(at - Date.now());
    };
    const normalsFor = (c: GridCell): Promise<Normals | null> => {
      let p = cache.get(c.key);
      if (!p) {
        p = paced().then(() => fetchCell(c, email));
        cache.set(c.key, p);
      }
      return p;
    };

    let written = 0;
    let noData = 0;
    let usedNeighbour = 0;
    let failedInARow = 0;
    let cellsDone = 0;
    let fatal: Error | null = null;
    const now = new Date();

    const processCell = async (home: GridCell, group: typeof suburbs): Promise<void> => {
      let source: GridCell | null = null;
      let normals: Normals | null = null;
      try {
        // Prefer the suburb's own cell; when it lacks temperatures (sea, for a
        // coastal or island suburb), the nearest neighbour with the full set,
        // and only then whatever partial data is nearest.
        const first = group[0];
        const candidates = [home, ...neighbourCells(first.lat as number, first.lng as number)];
        let partial: { cell: GridCell; normals: Normals } | null = null;
        for (const c of candidates) {
          const n = await normalsFor(c);
          if (!n) continue;
          if (isComplete(n)) {
            source = c;
            normals = n;
            break;
          }
          partial ??= { cell: c, normals: n };
        }
        if (!source && partial) {
          source = partial.cell;
          normals = partial.normals;
        }
        if (source && source !== home) usedNeighbour++;
        failedInARow = 0;
      } catch (err) {
        failedInARow++;
        log(SOURCE_ID, `warn: cell ${home.key} failed: ${(err as Error).message}`);
        if (failedInARow >= MAX_CONSECUTIVE_FAILURES) {
          fatal ??= new Error(`${failedInARow} cells failed in a row (last: ${(err as Error).message}); stopped, existing data kept`);
        }
        return;
      }
      if (!normals || !source) {
        noData += group.length;
        return;
      }

      const stored = toStoredClimate(normals);
      for (const s of group) {
        const row = {
          bomStationId: siloStationId(source),
          bomStationName: siloStationName(source),
          distanceKm: Math.round(haversineKm(s.lat as number, s.lng as number, source.lat, source.lon) * 10) / 10,
          meanMaxTemp: stored.meanMaxTemp,
          meanMinTemp: stored.meanMinTemp,
          meanRainfall: stored.meanRainfall,
          meanHumidity9am: [] as number[],
          meanSunshineHrs: [] as number[],
          annualRainfallMm: stored.annualRainfallMm,
          assessedAt: now,
        };
        await withDbRetry(() =>
          prisma.suburbClimate.upsert({
            where: { suburbSlug: s.slug },
            create: { suburbSlug: s.slug, ...row },
            update: row,
          }),
        );
        await withDbRetry(() => prisma.suburb.update({ where: { id: s.id }, data: { climateUpdatedAt: now } }));
        written++;
      }
      if (++cellsDone % 250 === 0) log(SOURCE_ID, `progress: ${cellsDone} of ${byCell.size} cells, ${written} suburbs written`);
    };

    const queue = [...byCell.values()];
    await Promise.all(
      Array.from({ length: WORKERS }, async () => {
        for (let next = queue.shift(); next && !fatal; next = queue.shift()) {
          await processCell(next.cell, next.suburbs);
        }
      }),
    );
    if (fatal) throw fatal;

    log(
      SOURCE_ID,
      `${written} suburbs written (${usedNeighbour} from a neighbouring cell), ${noData} with no SILO data, ${cache.size} cells fetched`,
    );
    await finishSync(SOURCE_ID, written + fresh.size, new Date(`${NORMAL_TO}-12-31T00:00:00Z`));
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
