// Bureau of Meteorology climate figures, as stored per suburb (SuburbClimate)
// and shown on suburb pages, the suburb narrative and the compare pages.
//
// A BoM station that records rainfall only has no temperature series. Older
// syncs stored twelve zeros in its place, which the page then showed as
// 0.0°C. A series only counts as real when it has twelve plausible numbers
// and is not all zero; everything else is "not available", never 0°C.

/** What we say when the station behind a suburb has no usable temperatures. */
export const TEMPERATURE_UNAVAILABLE = "Temperature data isn't available from the nearest station.";

/** Beyond this distance we add a note that conditions in the suburb may differ. */
export const FAR_STATION_KM = 25;

type Series = ReadonlyArray<number | null | undefined> | null | undefined;

function isCompleteSeries(series: Series): series is number[] {
  return (
    Array.isArray(series) &&
    series.length === 12 &&
    series.every((v) => typeof v === "number" && Number.isFinite(v))
  );
}

/**
 * True when a monthly mean temperature series (max or min, °C, index 0 =
 * January) is usable: twelve finite numbers within a plausible Australian
 * range, and not all zero. Missing, empty, short, null-filled and all-zero
 * series are unavailable.
 */
export function hasRealTemperatureSeries(series: Series): series is number[] {
  if (!isCompleteSeries(series)) return false;
  if (!series.some((v) => v !== 0)) return false;
  // Monthly means sit well inside this range anywhere in Australia, alpine
  // stations included. Anything outside it is a parsing fault, not weather.
  return series.every((v) => v >= -30 && v <= 55);
}

/**
 * True when a monthly mean rainfall series (mm) is usable: twelve finite,
 * non-negative numbers that are not all zero (a zero-filled placeholder).
 */
export function hasRealRainfallSeries(series: Series): series is number[] {
  if (!isCompleteSeries(series)) return false;
  return series.every((v) => v >= 0) && series.some((v) => v > 0);
}

interface StationClimate {
  bomStationName: string;
  distanceKm: number;
  meanMaxTemp: number[];
  meanMinTemp: number[];
  meanRainfall: number[];
  annualRainfallMm: number | null;
}

/** Annual rainfall in mm when the stored figure is real, else null. */
export function realAnnualRainfallMm(c: Pick<StationClimate, "annualRainfallMm" | "meanRainfall">): number | null {
  if (c.annualRainfallMm != null && Number.isFinite(c.annualRainfallMm) && c.annualRainfallMm > 0) {
    return c.annualRainfallMm;
  }
  if (hasRealRainfallSeries(c.meanRainfall)) {
    return Math.round(c.meanRainfall.reduce((a, b) => a + b, 0) * 10) / 10;
  }
  return null;
}

/** January mean maximum (°C) when the max series is real, else null. */
export function januaryMeanMax(c: Pick<StationClimate, "meanMaxTemp"> | null | undefined): number | null {
  return c && hasRealTemperatureSeries(c.meanMaxTemp) ? c.meanMaxTemp[0] : null;
}

/** "11 km" for 10 km and over, "4.2 km" under 10 km. */
export function formatStationDistance(km: number): string {
  if (km >= 10) return `${Math.round(km)} km`;
  return `${(Math.round(km * 10) / 10).toFixed(1)} km`;
}

/** The source line under the climate figures. */
export function climateSourceNote(c: Pick<StationClimate, "bomStationName" | "distanceKm">): string {
  return `Bureau of Meteorology station ${c.bomStationName}, ${formatStationDistance(c.distanceKm)} away; long-term averages.`;
}

/** A caveat for a distant station, or null when the station is close. */
export function stationDistanceCaveat(distanceKm: number): string | null {
  return distanceKm > FAR_STATION_KM
    ? `The station is more than ${FAR_STATION_KM} km away, so conditions here may differ.`
    : null;
}

// ---------------------------------------------------------------------------
// Station distance, checked against the suburb's own coordinates (Oct 2026)
// ---------------------------------------------------------------------------
//
// Syncs before October 2026 grouped suburbs by station and stamped every
// suburb in a group with the first suburb's distance, so all ~970 suburbs
// mapped to "Brisbane" read "11 km away" (Buderim is about 89 km from that
// station). And while BoM's station list URL fails, the sync falls back to
// the 20 stations below, so many suburbs sit a long way from theirs. Until
// the data is re-synced, pages recompute the distance from the suburb's
// coordinates for these stations, and stop presenting a station's weather
// as the suburb's when it is too far away to describe it.

/** The sync's fallback stations (scripts/sync/sources/bom-climate.ts), by BoM site id. */
export const REFERENCE_STATIONS: Readonly<Record<string, { name: string; lat: number; lon: number }>> = {
  "066062": { name: "Sydney (Observatory Hill)", lat: -33.8607, lon: 151.2050 },
  "086071": { name: "Melbourne (Olympic Park)", lat: -37.8255, lon: 144.9816 },
  "040913": { name: "Brisbane", lat: -27.4808, lon: 153.0389 },
  "023034": { name: "Adelaide (Kent Town)", lat: -34.9211, lon: 138.6216 },
  "009021": { name: "Perth Airport", lat: -31.9275, lon: 115.9764 },
  "014015": { name: "Darwin Airport", lat: -12.4239, lon: 130.8925 },
  "070351": { name: "Canberra Airport", lat: -35.3088, lon: 149.2008 },
  "094029": { name: "Hobart (Ellerslie Road)", lat: -42.8897, lon: 147.3278 },
  "031011": { name: "Cairns Aero", lat: -16.8736, lon: 145.7458 },
  "015590": { name: "Alice Springs Airport", lat: -23.7951, lon: 133.8890 },
  "048027": { name: "Dubbo Airport AWS", lat: -32.2167, lon: 148.5750 },
  "072150": { name: "Wagga Wagga AMO", lat: -35.1583, lon: 147.4575 },
  "061055": { name: "Newcastle Nobbys Signal", lat: -32.9167, lon: 151.8000 },
  "040764": { name: "Gold Coast Seaway", lat: -27.9397, lon: 153.4283 },
  "032040": { name: "Townsville Aero", lat: -19.2483, lon: 146.7653 },
  "090180": { name: "Ballarat Aerodrome", lat: -37.5124, lon: 143.7913 },
  "085072": { name: "Geelong Racecourse", lat: -38.1475, lon: 144.3511 },
  "078031": { name: "Bendigo Airport", lat: -36.7394, lon: 144.3300 },
  "059151": { name: "Wollongong (Bellambi AWS)", lat: -34.3817, lon: 150.9239 },
  "009225": { name: "Mandurah", lat: -32.5275, lon: 115.7239 },
};

/** Beyond this, a station's long-term averages aren't shown as the suburb's climate. */
export const MAX_REPRESENTATIVE_KM = 50;

function haversineKm(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

/**
 * The distance from the suburb to its station: recomputed from coordinates
 * when we know where the station is, otherwise the stored figure.
 */
export function stationDistanceFor(
  stationId: string,
  storedKm: number,
  suburb: { lat?: number | null; lng?: number | null },
): number {
  const st = REFERENCE_STATIONS[stationId];
  if (!st || suburb.lat == null || suburb.lng == null) return storedKm;
  return Math.round(haversineKm(suburb.lat, suburb.lng, st.lat, st.lon) * 10) / 10;
}

/** What a page says instead of the figures when the only station is too far away. */
export function climateWithheldNote(suburbName: string, stationName: string, distanceKm: number): string {
  return `The nearest weather station in our data is ${stationName}, about ${formatStationDistance(distanceKm)} away. That's too far to describe ${suburbName}'s climate, so we've left the figures out rather than show another place's weather.`;
}
