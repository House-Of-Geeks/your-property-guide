/**
 * BOM Climate Averages Sync (BOM CDO)
 *
 * For each suburb with a known centroid, finds the nearest BOM weather station
 * within 100 km using the Haversine formula, then fetches the climate normals
 * CSVs from BOM's CDO (Climate Data Online) service:
 *
 *   mean max temp     — p_nccObsCode=122
 *   mean min temp     — p_nccObsCode=123
 *   mean rainfall     — p_nccObsCode=139
 *   mean 9am humidity — p_nccObsCode=35
 *   mean sunshine hrs — p_nccObsCode=193
 *
 * The station list is fetched from:
 *   https://reg.bom.gov.au/climate/data/lists_of_climate_data/stations/stations_db.txt
 * If that request fails, a minimal hardcoded fallback list of major stations
 * is used so the script can still produce data for capital cities.
 *
 * BOM CDO CSV format:
 *   Several header lines starting with "Station"
 *   A header row with "Year", "Jan", "Feb", ..., "Dec", "Ann" columns
 *   Data rows with one year per row
 *   Monthly averages are computed from the last 10 available years.
 *   The "Ann" column (or last numeric column) is used for annualRainfallMm.
 *
 * Requests are paced at 200 ms between station fetches to respect BOM CDO.
 *
 * Data source: http://www.bom.gov.au/climate/data/
 * Schedule: Annual
 */
import "dotenv/config";
import Papa from "papaparse";
import { prisma } from "../db";
import { startSync, finishSync, failSync, log } from "../logger";

const SOURCE_ID = "bom-climate";

const STATION_LIST_URL =
  "https://reg.bom.gov.au/climate/data/lists_of_climate_data/stations/stations_db.txt";

const CDO_BASE = "http://www.bom.gov.au/jsp/ncc/cdio/weatherData/av";

const OBS_CODES = {
  meanMaxTemp:     "122",
  meanMinTemp:     "123",
  meanRainfall:    "139",
  meanHumidity9am: "35",
  meanSunshineHrs: "193",
} as const;

const MAX_STATION_DISTANCE_KM = 100;
const STATION_DELAY_MS = 200;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

// ── Types ────────────────────────────────────────────────────────────────────

interface BomStation {
  siteId: string;
  name:   string;
  lat:    number;
  lon:    number;
}

interface ClimateNormals {
  meanMaxTemp:      number[]; // 12 monthly values
  meanMinTemp:      number[];
  meanRainfall:     number[];
  meanHumidity9am:  number[];
  meanSunshineHrs:  number[];
  annualRainfallMm: number | null;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Haversine distance in km between two lat/lon pairs. */
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Fetch and parse the BOM station list text file. */
async function fetchStationList(): Promise<BomStation[]> {
  const res = await fetch(STATION_LIST_URL, {
    headers: { "User-Agent": "YourPropertyGuide/1.0 data-sync@yourpropertyguide.com.au" },
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

/** Find the nearest station within MAX_STATION_DISTANCE_KM; returns null if none. */
function nearestStation(
  lat: number,
  lng: number,
  stations: BomStation[]
): (BomStation & { distanceKm: number }) | null {
  let best: (BomStation & { distanceKm: number }) | null = null;
  for (const s of stations) {
    const d = haversineKm(lat, lng, s.lat, s.lon);
    if (d <= MAX_STATION_DISTANCE_KM && (!best || d < best.distanceKm)) {
      best = { ...s, distanceKm: d };
    }
  }
  return best;
}

/** Fetch one BOM CDO CSV and return 12-element monthly averages.
 *  Averages the last 10 available years to smooth interannual variability.
 */
async function fetchMonthlyNormals(
  stationId: string,
  obsCode: string
): Promise<number[] | null> {
  const url =
    `${CDO_BASE}?p_nccObsCode=${obsCode}&p_display_type=dataFile` +
    `&p_startYear=&p_c=&p_stn_num=${stationId}`;

  const res = await fetch(url, {
    headers: { "User-Agent": "YourPropertyGuide/1.0 data-sync@yourpropertyguide.com.au" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) {
    if (res.status === 404) return null; // station doesn't have this variable
    throw new Error(`HTTP ${res.status}`);
  }

  const text = await res.text();
  if (!text || text.trim().length === 0) return null;

  // Skip header lines that start with "Station"
  const lines = text.split("\n").filter((l) => !l.trim().startsWith("Station"));
  const csv = lines.join("\n");

  const parsed = Papa.parse<Record<string, string>>(csv, {
    header: true,
    skipEmptyLines: true,
  });

  if (!parsed.data.length) return null;

  // Find the column names: BOM uses "Jan", "Feb" ... "Dec", "Ann" or similar
  const headers = Object.keys(parsed.data[0] ?? {});
  const monthCols: string[] = MONTHS.map((m) => {
    return headers.find((h) => h.trim().toLowerCase() === m.toLowerCase()) ?? "";
  });
  const yearCol  = headers.find((h) => /^year$/i.test(h.trim())) ?? headers[0];

  // Collect rows with a valid year number, pick latest 10
  interface YearRow { year: number; values: (number | null)[] }
  const yearRows: YearRow[] = [];

  for (const row of parsed.data) {
    const yr = parseInt(String(row[yearCol] ?? "").replace(/\s/g, "")) || 0;
    if (yr < 1900 || yr > 2100) continue;

    const values = monthCols.map((col) => {
      if (!col) return null;
      const raw = String(row[col] ?? "").trim();
      const v = parseFloat(raw);
      return isNaN(v) ? null : v;
    });

    yearRows.push({ year: yr, values });
  }

  // Sort descending, take up to 10 most recent
  yearRows.sort((a, b) => b.year - a.year);
  const recent = yearRows.slice(0, 10);
  if (recent.length === 0) return null;

  // Average each month across available years
  const avg: number[] = MONTHS.map((_, mi) => {
    const vals = recent.map((r) => r.values[mi]).filter((v): v is number => v !== null);
    if (!vals.length) return 0;
    return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
  });

  return avg;
}

/** Fetch all climate variables for one station. Returns null if nothing could be fetched. */
async function fetchStationClimate(stationId: string): Promise<ClimateNormals | null> {
  const [maxTemp, minTemp, rainfall, humidity, sunshine] = await Promise.all([
    fetchMonthlyNormals(stationId, OBS_CODES.meanMaxTemp).catch(() => null),
    fetchMonthlyNormals(stationId, OBS_CODES.meanMinTemp).catch(() => null),
    fetchMonthlyNormals(stationId, OBS_CODES.meanRainfall).catch(() => null),
    fetchMonthlyNormals(stationId, OBS_CODES.meanHumidity9am).catch(() => null),
    fetchMonthlyNormals(stationId, OBS_CODES.meanSunshineHrs).catch(() => null),
  ]);

  // Need at least temperature and rainfall to be useful
  if (!maxTemp && !minTemp && !rainfall) return null;

  const annualRainfallMm =
    rainfall && rainfall.length === 12
      ? Math.round(rainfall.reduce((a, b) => a + b, 0) * 10) / 10
      : null;

  return {
    meanMaxTemp:      maxTemp      ?? Array(12).fill(0),
    meanMinTemp:      minTemp      ?? Array(12).fill(0),
    meanRainfall:     rainfall     ?? Array(12).fill(0),
    meanHumidity9am:  humidity     ?? Array(12).fill(0),
    meanSunshineHrs:  sunshine     ?? Array(12).fill(0),
    annualRainfallMm,
  };
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
    log(SOURCE_ID, `matching ${suburbs.length} suburbs to nearest BOM station`);

    // Group suburbs by nearest station
    type StationGroup = {
      station: BomStation & { distanceKm: number };
      suburbs: typeof suburbs;
    };
    const stationGroups = new Map<string, StationGroup>();

    for (const suburb of suburbs) {
      const nearest = nearestStation(suburb.lat as number, suburb.lng as number, stations);
      if (!nearest) continue; // > 100 km from any station

      const existing = stationGroups.get(nearest.siteId);
      if (existing) {
        existing.suburbs.push(suburb);
      } else {
        stationGroups.set(nearest.siteId, { station: nearest, suburbs: [suburb] });
      }
    }

    log(SOURCE_ID, `${stationGroups.size} unique BOM stations to fetch`);

    let totalUpserted = 0;
    const now = new Date();
    let stationsDone = 0;

    for (const { station, suburbs: stationSuburbs } of stationGroups.values()) {
      log(SOURCE_ID, `fetching station ${station.siteId} (${station.name}) — ${stationSuburbs.length} suburbs`);

      let climate: ClimateNormals | null = null;
      try {
        climate = await fetchStationClimate(station.siteId);
      } catch (err) {
        log(SOURCE_ID, `warn: station ${station.siteId} failed — ${(err as Error).message}`);
      }

      if (!climate) {
        log(SOURCE_ID, `station ${station.siteId}: no climate data — skipping ${stationSuburbs.length} suburbs`);
        stationsDone++;
        await sleep(STATION_DELAY_MS);
        continue;
      }

      // Upsert SuburbClimate for every suburb assigned to this station
      for (const suburb of stationSuburbs) {
        await prisma.suburbClimate.upsert({
          where: { suburbSlug: suburb.slug },
          create: {
            suburbSlug:       suburb.slug,
            bomStationId:     station.siteId,
            bomStationName:   station.name,
            distanceKm:       Math.round(station.distanceKm * 10) / 10,
            meanMaxTemp:      climate.meanMaxTemp,
            meanMinTemp:      climate.meanMinTemp,
            meanRainfall:     climate.meanRainfall,
            meanHumidity9am:  climate.meanHumidity9am,
            meanSunshineHrs:  climate.meanSunshineHrs,
            annualRainfallMm: climate.annualRainfallMm,
            assessedAt:       now,
          },
          update: {
            bomStationId:     station.siteId,
            bomStationName:   station.name,
            distanceKm:       Math.round(station.distanceKm * 10) / 10,
            meanMaxTemp:      climate.meanMaxTemp,
            meanMinTemp:      climate.meanMinTemp,
            meanRainfall:     climate.meanRainfall,
            meanHumidity9am:  climate.meanHumidity9am,
            meanSunshineHrs:  climate.meanSunshineHrs,
            annualRainfallMm: climate.annualRainfallMm,
            assessedAt:       now,
          },
        });

        await prisma.suburb.update({
          where: { id: suburb.id },
          data:  { climateUpdatedAt: now },
        });

        totalUpserted++;
      }

      stationsDone++;
      if (stationsDone % 10 === 0) {
        log(SOURCE_ID, `progress: ${stationsDone} / ${stationGroups.size} stations, ${totalUpserted} suburbs done`);
      }

      await sleep(STATION_DELAY_MS);
    }

    await finishSync(SOURCE_ID, totalUpserted);
  } catch (err) {
    await failSync(SOURCE_ID, err);
    throw err;
  }
}
