/**
 * BOM Climate Averages Sync (BOM CDO)
 *
 * Writes one SuburbClimate row per suburb with a known centroid: monthly mean
 * max and min temperature and mean rainfall from a single Bureau of
 * Meteorology station, with that station's name and its distance from the
 * suburb centroid.
 *
 * Which station:
 *   1. Rank every station within MAX_STATION_DISTANCE_KM (100 km) of the
 *      centroid by Haversine distance, nearest first.
 *   2. Walk that list (at most MAX_STATIONS_TRIED) and take the first station
 *      whose max AND min temperature series are real (12 numbers, not all
 *      zero). Rainfall-only stations are skipped for temperature.
 *   3. If none of them has temperature, fall back to the nearest one with
 *      real rainfall and store its temperature series as empty arrays. The
 *      page then says temperature isn't available from the nearest station.
 *   4. Rainfall always comes from the same station as temperature, so the
 *      stored station name and distance describe every figure on the page.
 *   Missing series are stored as [] (never twelve zeros); humidity and
 *   sunshine are always [] (see OBS_CODES).
 *
 * Climate normals come from BOM's CDO averages page for each obsCode in
 * OBS_CODES. The page embeds the normals as JavaScript arrays; we take the
 * 30-year normal (`mean_30`) where BoM publishes one, else the all-years
 * mean (`mean`). See parseCdoMonthlyNormals in bom-climate-rules.ts.
 * annualRainfallMm is the sum of the 12 monthly rainfall means.
 *
 * The station list is fetched from STATION_LIST_URL. If that request fails,
 * the hardcoded FALLBACK_STATIONS (20 major stations) are used, so the script
 * still produces data near capital and large regional cities. Note: STATION_LIST_URL returned HTTP 404 on 14 Oct 2026, so until
 * it is replaced every run uses the fallback list.
 *
 * Each station is fetched at most once per run (cached) and fetches are
 * paced STATION_DELAY_MS apart to respect BOM CDO.
 *
 * Data source: http://www.bom.gov.au/climate/data/
 * Schedule: Annual
 */
import "dotenv/config";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";
import {
  type BomStation,
  type StationReadings,
  chooseStation,
  parseCdoMonthlyNormals,
  stationsWithin,
  toStoredClimate,
} from "./bom-climate-rules";

const SOURCE_ID = "bom-climate";

const STATION_LIST_URL =
  "https://reg.bom.gov.au/climate/data/lists_of_climate_data/stations/stations_db.txt";

const CDO_BASE = "http://www.bom.gov.au/jsp/ncc/cdio/weatherData/av";

// BOM CDO obsCodes verified May 2026:
//   36  → Mean Maximum Temperature
//   38  → Mean Minimum Temperature
//   139 → Mean monthly rainfall
// Humidity (was 35) and sunshine hours (was 193) no longer return data on
// the public CDO endpoint — left null and stored as empty arrays.
const OBS_CODES = {
  meanMaxTemp:     "36",
  meanMinTemp:     "38",
  meanRainfall:    "139",
  meanHumidity9am: null,
  meanSunshineHrs: null,
} as const;

const MAX_STATION_DISTANCE_KM = 100;
// Upper bound on stations checked per suburb before falling back to rainfall
// only. The full BoM list is mostly rainfall-only stations, so this bounds
// the requests made for a suburb in a dense rain-gauge area.
const MAX_STATIONS_TRIED = 30;
const STATION_DELAY_MS = 200;

// ── Minimal fallback station list (major Australian stations) ────────────────
// Columns: siteId, name, lat, lon
const FALLBACK_STATIONS: Array<{ siteId: string; name: string; lat: number; lon: number }> = [
  { siteId: "066062", name: "Sydney (Observatory Hill)", lat: -33.8607, lon: 151.2050 },
  { siteId: "086071", name: "Melbourne (Olympic Park)",  lat: -37.8255, lon: 144.9816 },
  { siteId: "040913", name: "Brisbane",                  lat: -27.4808, lon: 153.0389 },
  { siteId: "023034", name: "Adelaide (Kent Town)",      lat: -34.9211, lon: 138.6216 },
  { siteId: "009021", name: "Perth Airport",             lat: -31.9275, lon: 115.9764 },
  { siteId: "014015", name: "Darwin Airport",            lat: -12.4239, lon: 130.8925 },
  { siteId: "070351", name: "Canberra Airport",          lat: -35.3088, lon: 149.2008 },
  { siteId: "094029", name: "Hobart (Ellerslie Road)",   lat: -42.8897, lon: 147.3278 },
  { siteId: "031011", name: "Cairns Aero",               lat: -16.8736, lon: 145.7458 },
  { siteId: "015590", name: "Alice Springs Airport",     lat: -23.7951, lon: 133.8890 },
  { siteId: "048027", name: "Dubbo Airport AWS",         lat: -32.2167, lon: 148.5750 },
  { siteId: "072150", name: "Wagga Wagga AMO",           lat: -35.1583, lon: 147.4575 },
  { siteId: "061055", name: "Newcastle Nobbys Signal",   lat: -32.9167, lon: 151.8000 },
  { siteId: "040764", name: "Gold Coast Seaway",         lat: -27.9397, lon: 153.4283 },
  { siteId: "032040", name: "Townsville Aero",           lat: -19.2483, lon: 146.7653 },
  { siteId: "090180", name: "Ballarat Aerodrome",        lat: -37.5124, lon: 143.7913 },
  { siteId: "085072", name: "Geelong Racecourse",        lat: -38.1475, lon: 144.3511 },
  { siteId: "078031", name: "Bendigo Airport",           lat: -36.7394, lon: 144.3300 },
  { siteId: "059151", name: "Wollongong (Bellambi AWS)", lat: -34.3817, lon: 150.9239 },
  { siteId: "009225", name: "Mandurah",                  lat: -32.5275, lon: 115.7239 },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fetch and parse the BOM station list text file. */
async function fetchStationList(): Promise<BomStation[]> {
  const res = await fetch(STATION_LIST_URL, {
    headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();

  const stations: BomStation[] = [];
  for (const line of text.split("\n")) {
    // Fixed-width / tab-delimited; skip comment/header lines
    if (!line || line.startsWith("st") || line.startsWith("#") || line.trim() === "") continue;
    // Columns (approximate): site, dist, name, start, end, lat, lon, source, STA, %complete, AWS
    const parts = line.split(/\s{2,}|\t/);
    if (parts.length < 7) continue;

    const siteId = parts[0]?.trim().padStart(6, "0");
    const name   = parts[2]?.trim();
    const lat    = parseFloat(parts[5] ?? "");
    const lon    = parseFloat(parts[6] ?? "");

    if (siteId && name && !isNaN(lat) && !isNaN(lon)) {
      stations.push({ siteId, name, lat, lon });
    }
  }
  return stations;
}

/** Fetch one BOM CDO averages page and return its 12 monthly normals, or null
 *  when the station has no usable series for this variable. */
async function fetchMonthlyNormals(
  stationId: string,
  obsCode: string
): Promise<number[] | null> {
  const url =
    `${CDO_BASE}?p_nccObsCode=${obsCode}&p_display_type=dataFile` +
    `&p_startYear=&p_c=&p_stn_num=${stationId}`;

  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) {
    if (res.status === 404) return null; // station doesn't have this variable
    throw new Error(`HTTP ${res.status}`);
  }

  const html = await res.text();
  if (!html || html.trim().length === 0) return null;
  return parseCdoMonthlyNormals(html);
}

/** Fetch temperature and rainfall normals for one station. Null when nothing came back. */
async function fetchStationReadings(stationId: string): Promise<StationReadings | null> {
  const tryFetch = (code: string | null) =>
    code ? fetchMonthlyNormals(stationId, code).catch(() => null) : Promise.resolve(null);
  const [maxTemp, minTemp, rainfall] = await Promise.all([
    tryFetch(OBS_CODES.meanMaxTemp),
    tryFetch(OBS_CODES.meanMinTemp),
    tryFetch(OBS_CODES.meanRainfall),
  ]);
  if (!maxTemp && !minTemp && !rainfall) return null;
  return { meanMaxTemp: maxTemp, meanMinTemp: minTemp, meanRainfall: rainfall };
}

// ── Main ─────────────────────────────────────────────────────────────────────

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  try {
    // Load BOM station list; fall back to hardcoded list on failure
    let stations: BomStation[];
    try {
      stations = await fetchStationList();
      log(SOURCE_ID, `loaded ${stations.length} BOM stations from station list`);
    } catch (err) {
      log(SOURCE_ID, `station list fetch failed (${(err as Error).message}) — using hardcoded fallback`);
      stations = FALLBACK_STATIONS;
    }

    // Load all suburbs with known centroids
    const suburbs = await prisma.suburb.findMany({
      where: { lat: { not: null }, lng: { not: null } },
      select: { id: true, slug: true, lat: true, lng: true },
    });
    log(SOURCE_ID, `matching ${suburbs.length} suburbs to the nearest BOM station with temperature`);

    // Each station is fetched at most once per run, paced for BOM CDO.
    const readingsCache = new Map<string, StationReadings | null>();
    let stationsFetched = 0;
    const readingsFor = async (siteId: string): Promise<StationReadings | null> => {
      if (readingsCache.has(siteId)) return readingsCache.get(siteId) ?? null;
      let readings: StationReadings | null = null;
      try {
        readings = await fetchStationReadings(siteId);
      } catch (err) {
        log(SOURCE_ID, `warn: station ${siteId} failed — ${(err as Error).message}`);
      }
      readingsCache.set(siteId, readings);
      stationsFetched++;
      await sleep(STATION_DELAY_MS);
      return readings;
    };

    let totalUpserted = 0;
    let rainfallOnly = 0;
    let skipped = 0;
    const now = new Date();

    for (const suburb of suburbs) {
      const candidates = stationsWithin(
        suburb.lat as number,
        suburb.lng as number,
        stations,
        MAX_STATION_DISTANCE_KM,
      );
      const choice = await chooseStation(candidates, readingsFor, MAX_STATIONS_TRIED);
      if (!choice) {
        skipped++; // no station within 100 km with usable temperature or rainfall
        continue;
      }
      if (!choice.withTemperature) rainfallOnly++;

      const { station } = choice;
      const stored = toStoredClimate(choice);
      const row = {
        bomStationId:     station.siteId,
        bomStationName:   station.name,
        distanceKm:       Math.round(station.distanceKm * 10) / 10,
        meanMaxTemp:      stored.meanMaxTemp,
        meanMinTemp:      stored.meanMinTemp,
        meanRainfall:     stored.meanRainfall,
        meanHumidity9am:  [] as number[],
        meanSunshineHrs:  [] as number[],
        annualRainfallMm: stored.annualRainfallMm,
        assessedAt:       now,
      };
      await prisma.suburbClimate.upsert({
        where:  { suburbSlug: suburb.slug },
        create: { suburbSlug: suburb.slug, ...row },
        update: row,
      });

      await prisma.suburb.update({
        where: { id: suburb.id },
        data:  { climateUpdatedAt: now },
      });

      totalUpserted++;
      if (totalUpserted % 500 === 0) {
        log(SOURCE_ID, `progress: ${totalUpserted} suburbs written, ${stationsFetched} stations fetched`);
      }
    }

    log(
      SOURCE_ID,
      `${totalUpserted} suburbs written (${rainfallOnly} rainfall only, no temperature station within ` +
        `${MAX_STATION_DISTANCE_KM} km), ${skipped} skipped, ${stationsFetched} stations fetched`,
    );
    await finishSync(SOURCE_ID, totalUpserted);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
