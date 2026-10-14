/**
 * Pure rules for the SILO climate sync (silo-climate.ts): snapping a suburb
 * to SILO's 0.05° grid, reading a DataDrill "monthly" file, and turning
 * 1991–2020 monthly figures into twelve monthly normals. No network or
 * database here, so it is tested directly (tests/sync/silo-climate-rules.test.ts).
 *
 * Why SILO (Oct 2026): the old sync read Bureau of Meteorology Climate Data
 * Online pages one station at a time. BoM now blocks automated access to
 * those pages and asks scrapers to stop, and its station-list URL had moved,
 * so every run fell back to 20 capital-city stations. SILO (Queensland
 * Government, CC BY 4.0) publishes the same Bureau observations interpolated
 * to a ~5 km grid through an API built for this, so every suburb gets the
 * figures for its own location rather than a station up to 100 km away.
 */
import { hasRealRainfallSeries, hasRealTemperatureSeries } from "../../../src/lib/climate";

/** SILO's grid spacing in degrees (about 5 km). DataDrill only accepts points on it. */
export const GRID_STEP = 0.05;

/** The climate normal period: the current WMO standard 30 years. */
export const NORMAL_FROM = 1991;
export const NORMAL_TO = 2020;

/** A month needs at least this many of the 30 years to count. */
export const MIN_YEARS = 25;

export interface GridCell {
  lat: number;
  lon: number;
  /** "-26.70,153.05": the cell's id in SuburbClimate (as "silo:<key>"). */
  key: string;
}

const round2 = (v: number) => Math.round(v * 100) / 100;

/** The nearest grid value to a coordinate, to two decimals. */
export function snapToGrid(v: number): number {
  return round2(Math.round(v / GRID_STEP) * GRID_STEP);
}

function cell(lat: number, lon: number): GridCell {
  return { lat, lon, key: `${lat.toFixed(2)},${lon.toFixed(2)}` };
}

/** The grid cell a point falls in. */
export function cellOf(lat: number, lon: number): GridCell {
  return cell(snapToGrid(lat), snapToGrid(lon));
}

/**
 * The eight cells around a point's own cell, nearest first. A coastal or
 * island suburb's own cell can be sea, where SILO has no data; the sync then
 * tries these in order.
 */
export function neighbourCells(lat: number, lon: number): GridCell[] {
  const home = cellOf(lat, lon);
  const out: GridCell[] = [];
  for (const dy of [-1, 0, 1]) {
    for (const dx of [-1, 0, 1]) {
      if (dx !== 0 || dy !== 0) out.push(cell(round2(home.lat + dy * GRID_STEP), round2(home.lon + dx * GRID_STEP)));
    }
  }
  const dist = (c: GridCell) => haversineKm(lat, lon, c.lat, c.lon);
  return out.sort((a, b) => dist(a) - dist(b));
}

/** Haversine distance in km between two lat/lon pairs. */
export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface SiloMonth {
  year: number;
  month: number;
  /** Mean daily maximum for the month, °C. */
  tmax: number | null;
  /** Mean daily minimum for the month, °C. */
  tmin: number | null;
  /** Total rainfall for the month, mm. */
  rain: number | null;
}

const num = (s: string): number | null => {
  const v = Number(s);
  return Number.isFinite(v) ? v : null;
};

/**
 * Rows of a DataDrill file in the "monthly" format: quoted notes, three
 * header lines, then one line a month,
 *   19910100  28.8  21.7   71.3 176.5  22.9  24.9
 * (the month as YYYYMM00; SILO's published sample shows YYYYMM, so both are
 * read), then TMax, TMin, Rain, Evap, Rad and VP, space-separated. The dummy
 * first line SILO adds for spreadsheets is quoted, so it never matches.
 */
export function parseSiloMonthly(text: string): SiloMonth[] {
  const rows: SiloMonth[] = [];
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*(\d{4})(\d{2})(?:\d{2})?\s+(\S+)\s+(\S+)\s+(\S+)/);
    if (!m) continue;
    const year = Number(m[1]);
    const month = Number(m[2]);
    if (year < 1889 || month < 1 || month > 12) continue;
    rows.push({ year, month, tmax: num(m[3]), tmin: num(m[4]), rain: num(m[5]) });
  }
  return rows;
}

export interface Normals {
  meanMaxTemp: number[] | null;
  meanMinTemp: number[] | null;
  meanRainfall: number[] | null;
}

/**
 * Twelve monthly normals (index 0 = January) for each series over
 * NORMAL_FROM–NORMAL_TO: the mean of that month across the years, to one
 * decimal. A series is null when any month has fewer than MIN_YEARS values,
 * or when the result isn't a plausible climate (see src/lib/climate.ts).
 */
export function monthlyNormals(rows: SiloMonth[], from = NORMAL_FROM, to = NORMAL_TO, minYears = MIN_YEARS): Normals {
  const series = (pick: (r: SiloMonth) => number | null, real: (s: number[]) => boolean): number[] | null => {
    const out: number[] = [];
    for (let month = 1; month <= 12; month++) {
      const values = rows
        .filter((r) => r.month === month && r.year >= from && r.year <= to)
        .map(pick)
        .filter((v): v is number => v !== null);
      if (values.length < minYears) return null;
      out.push(Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10);
    }
    return real(out) ? out : null;
  };
  return {
    meanMaxTemp: series((r) => r.tmax, hasRealTemperatureSeries),
    meanMinTemp: series((r) => r.tmin, hasRealTemperatureSeries),
    meanRainfall: series((r) => r.rain, hasRealRainfallSeries),
  };
}

/** True when a cell has all three series (a land point with full records). */
export function isComplete(n: Normals): boolean {
  return !!(n.meanMaxTemp && n.meanMinTemp && n.meanRainfall);
}

/** True when a cell gave us anything worth storing. */
export function hasClimate(n: Normals): boolean {
  return !!(n.meanMaxTemp || n.meanMinTemp || n.meanRainfall);
}

export interface StoredClimate {
  meanMaxTemp: number[];
  meanMinTemp: number[];
  meanRainfall: number[];
  annualRainfallMm: number | null;
}

/** The series written to SuburbClimate: anything missing is [] (never twelve zeros). */
export function toStoredClimate(n: Normals): StoredClimate {
  return {
    meanMaxTemp: n.meanMaxTemp ?? [],
    meanMinTemp: n.meanMinTemp ?? [],
    meanRainfall: n.meanRainfall ?? [],
    annualRainfallMm: n.meanRainfall ? Math.round(n.meanRainfall.reduce((a, b) => a + b, 0) * 10) / 10 : null,
  };
}

/** SuburbClimate.bomStationId for a SILO row; pages tell SILO rows by the prefix. */
export const siloStationId = (c: GridCell) => `silo:${c.key}`;
export const siloStationName = (c: GridCell) => `SILO grid point ${c.key.replace(",", ", ")}`;
