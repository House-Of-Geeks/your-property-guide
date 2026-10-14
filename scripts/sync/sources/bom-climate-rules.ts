/**
 * Pure rules for the BoM climate sync (bom-climate.ts): parsing a Climate
 * Data Online page, ranking stations by distance, and choosing which station
 * a suburb's figures come from. No network or database here, so it is tested
 * directly (tests/sync/bom-climate-rules.test.ts).
 */
import { hasRealRainfallSeries, hasRealTemperatureSeries } from "../../../src/lib/climate";

export interface BomStation {
  siteId: string;
  name:   string;
  lat:    number;
  lon:    number;
}

export type RankedStation = BomStation & { distanceKm: number };

/** Monthly normals for one station; null where BoM has no usable series. */
export interface StationReadings {
  meanMaxTemp:  number[] | null;
  meanMinTemp:  number[] | null;
  meanRainfall: number[] | null;
}

/** Haversine distance in km between two lat/lon pairs. */
export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

/** Stations within maxKm of a point, nearest first. */
export function stationsWithin(
  lat: number,
  lng: number,
  stations: BomStation[],
  maxKm: number,
): RankedStation[] {
  const ranked: RankedStation[] = [];
  for (const s of stations) {
    const d = haversineKm(lat, lng, s.lat, s.lon);
    if (d <= maxKm) ranked.push({ ...s, distanceKm: d });
  }
  return ranked.sort((a, b) => a.distanceKm - b.distanceKm || a.siteId.localeCompare(b.siteId));
}

/**
 * Twelve monthly values from a BoM CDO averages page, or null.
 *
 * The page embeds the normals as JavaScript array literals, e.g.
 *   var mean_30 = new Array("Mean","29.4","29.1", ... ,"25.6");
 * holding Jan..Dec then the annual figure. We prefer `mean_30` (the most
 * recent 30-year normal) and fall back to `mean` (all years). An array with
 * a blank or non-numeric month is rejected rather than read as zero: a
 * missing month is missing, not 0°C or 0 mm.
 */
export function parseCdoMonthlyNormals(html: string): number[] | null {
  function extract(varName: string): number[] | null {
    const re = new RegExp(`var\\s+${varName}\\s*=\\s*new\\s+Array\\(([^)]*)\\)`);
    const m = html.match(re);
    if (!m) return null;
    const values = [...m[1].matchAll(/"([^"]*)"/g)].map((x) => x[1].trim());
    // values[0] is the row label ("Mean"); then Jan..Dec (and the annual).
    const months = values.slice(1, 13);
    if (months.length < 12) return null;
    const monthly: number[] = [];
    for (const raw of months) {
      if (!/^-?\d+(\.\d+)?$/.test(raw)) return null;
      monthly.push(Math.round(parseFloat(raw) * 10) / 10);
    }
    return monthly;
  }
  return extract("mean_30") ?? extract("mean");
}

/** A station counts as having temperature when both its max and min series are real. */
export function hasTemperature(r: StationReadings | null): boolean {
  return !!r && hasRealTemperatureSeries(r.meanMaxTemp) && hasRealTemperatureSeries(r.meanMinTemp);
}

export function hasRainfall(r: StationReadings | null): boolean {
  return !!r && hasRealRainfallSeries(r.meanRainfall);
}

export interface StationChoice<R extends StationReadings> {
  station: RankedStation;
  readings: R;
  /** False when no candidate had temperature and this is a rainfall-only fallback. */
  withTemperature: boolean;
}

/**
 * Walk the candidates nearest first and take the first station with real
 * max and min temperatures; rainfall-only stations are skipped. If none of
 * the first `maxTries` candidates has temperature, fall back to the nearest
 * one that has real rainfall (its temperature is then stored as missing).
 * Returns null when no candidate has anything usable.
 */
export async function chooseStation<R extends StationReadings>(
  candidates: RankedStation[],
  readingsFor: (siteId: string) => Promise<R | null>,
  maxTries: number,
): Promise<StationChoice<R> | null> {
  let rainfallOnly: StationChoice<R> | null = null;
  for (const station of candidates.slice(0, maxTries)) {
    const readings = await readingsFor(station.siteId);
    if (!readings) continue;
    if (hasTemperature(readings)) return { station, readings, withTemperature: true };
    if (!rainfallOnly && hasRainfall(readings)) {
      rainfallOnly = { station, readings, withTemperature: false };
    }
  }
  return rainfallOnly;
}

export interface StoredClimate {
  meanMaxTemp:      number[];
  meanMinTemp:      number[];
  meanRainfall:     number[];
  annualRainfallMm: number | null;
}

/**
 * The series written to SuburbClimate for a chosen station. Anything not
 * real is stored as an empty array (never twelve zeros), so pages can tell
 * "not available" from a measurement.
 */
export function toStoredClimate(choice: StationChoice<StationReadings>): StoredClimate {
  const r = choice.readings;
  const temperature = choice.withTemperature && hasTemperature(r);
  const rainfall = hasRealRainfallSeries(r.meanRainfall) ? r.meanRainfall : null;
  return {
    meanMaxTemp:  temperature ? (r.meanMaxTemp as number[]) : [],
    meanMinTemp:  temperature ? (r.meanMinTemp as number[]) : [],
    meanRainfall: rainfall ?? [],
    annualRainfallMm: rainfall ? Math.round(rainfall.reduce((a, b) => a + b, 0) * 10) / 10 : null,
  };
}
