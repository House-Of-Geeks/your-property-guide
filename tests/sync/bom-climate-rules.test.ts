// The BoM climate sync takes temperature from the nearest station that has
// it, passing over rainfall-only stations, and never stores twelve zeros.
import { describe, expect, it } from "vitest";
import {
  type BomStation,
  type StationReadings,
  chooseStation,
  parseCdoMonthlyNormals,
  stationsWithin,
  toStoredClimate,
} from "../../scripts/sync/sources/bom-climate-rules";

const MAX = [30.2, 29.9, 28.9, 27.0, 24.6, 22.2, 21.9, 23.0, 25.2, 26.6, 28.0, 29.3];
const MIN = [21.4, 21.3, 20.1, 17.3, 13.9, 11.4, 10.5, 11.0, 13.6, 16.3, 18.6, 20.3];
const RAIN = [140, 172, 147, 63, 69, 56, 31, 34, 29, 87, 102, 138];
const ZEROS = Array(12).fill(0);

// A suburb centroid and three stations due north of it.
const HOME = { lat: -26.70, lng: 153.05 };
const STATIONS: BomStation[] = [
  { siteId: "000003", name: "Far Temp",      lat: -26.30, lon: 153.05 }, // ~44 km
  { siteId: "000001", name: "Rain Gauge",    lat: -26.68, lon: 153.05 }, // ~2 km
  { siteId: "000002", name: "Near Temp",     lat: -26.60, lon: 153.05 }, // ~11 km
  { siteId: "000004", name: "Out Of Range",  lat: -25.50, lon: 153.05 }, // ~133 km
];

function fetcher(table: Record<string, StationReadings | null>) {
  const calls: string[] = [];
  return {
    calls,
    readingsFor: async (siteId: string) => {
      calls.push(siteId);
      return table[siteId] ?? null;
    },
  };
}

describe("parseCdoMonthlyNormals", () => {
  const row = (name: string, values: string[]) => `var ${name} = new Array("Mean",${values.map((v) => `"${v}"`).join(",")});`;
  it("reads the 30-year normal, falling back to the all-years mean", () => {
    const months = MAX.map(String);
    expect(parseCdoMonthlyNormals(`${row("mean", [...MIN.map(String), "16.3"])}\n${row("mean_30", [...months, "26.4"])}`)).toEqual(MAX);
    expect(parseCdoMonthlyNormals(row("mean", [...months, "26.4"]))).toEqual(MAX);
  });
  it("rejects a series with a blank or non-numeric month instead of reading it as zero", () => {
    const blank = [...MAX.map(String)];
    blank[3] = "";
    expect(parseCdoMonthlyNormals(row("mean", [...blank, "26.4"]))).toBeNull();
    const dash = [...MAX.map(String)];
    dash[3] = "-";
    expect(parseCdoMonthlyNormals(row("mean", [...dash, "26.4"]))).toBeNull();
    // A blank 30-year normal falls back to a complete all-years mean.
    expect(parseCdoMonthlyNormals(`${row("mean_30", Array(13).fill(""))}\n${row("mean", [...MAX.map(String), "26.4"])}`)).toEqual(MAX);
  });
  it("returns null for a page with no averages", () => {
    expect(parseCdoMonthlyNormals("<html>No data</html>")).toBeNull();
  });
});

describe("stationsWithin", () => {
  it("ranks stations inside the cap, nearest first", () => {
    const ranked = stationsWithin(HOME.lat, HOME.lng, STATIONS, 100);
    expect(ranked.map((s) => s.name)).toEqual(["Rain Gauge", "Near Temp", "Far Temp"]);
    expect(ranked[1].distanceKm).toBeCloseTo(11.1, 1);
  });
});

describe("chooseStation", () => {
  const candidates = stationsWithin(HOME.lat, HOME.lng, STATIONS, 100);

  it("passes over a rainfall-only nearest station for the next one with temperature", async () => {
    const f = fetcher({
      "000001": { meanMaxTemp: null, meanMinTemp: null, meanRainfall: RAIN },
      "000002": { meanMaxTemp: MAX, meanMinTemp: MIN, meanRainfall: RAIN },
      "000003": { meanMaxTemp: MAX, meanMinTemp: MIN, meanRainfall: RAIN },
    });
    const choice = await chooseStation(candidates, f.readingsFor, 30);
    expect(choice?.station.name).toBe("Near Temp");
    expect(choice?.withTemperature).toBe(true);
    expect(f.calls).toEqual(["000001", "000002"]);
  });

  it("treats a stored all-zero temperature series as no temperature", async () => {
    const f = fetcher({
      "000001": { meanMaxTemp: ZEROS, meanMinTemp: ZEROS, meanRainfall: RAIN },
      "000002": { meanMaxTemp: MAX, meanMinTemp: ZEROS, meanRainfall: RAIN },
      "000003": { meanMaxTemp: MAX, meanMinTemp: MIN, meanRainfall: RAIN },
    });
    const choice = await chooseStation(candidates, f.readingsFor, 30);
    expect(choice?.station.name).toBe("Far Temp");
  });

  it("falls back to the nearest rainfall station when none has temperature", async () => {
    const f = fetcher({
      "000001": { meanMaxTemp: null, meanMinTemp: null, meanRainfall: RAIN },
      "000002": { meanMaxTemp: null, meanMinTemp: null, meanRainfall: RAIN },
    });
    const choice = await chooseStation(candidates, f.readingsFor, 30);
    expect(choice?.station.name).toBe("Rain Gauge");
    expect(choice?.withTemperature).toBe(false);
    expect(toStoredClimate(choice!)).toEqual({ meanMaxTemp: [], meanMinTemp: [], meanRainfall: RAIN, annualRainfallMm: 1068 });
  });

  it("stops after maxTries", async () => {
    const f = fetcher({
      "000001": { meanMaxTemp: null, meanMinTemp: null, meanRainfall: RAIN },
      "000002": { meanMaxTemp: MAX, meanMinTemp: MIN, meanRainfall: RAIN },
    });
    const choice = await chooseStation(candidates, f.readingsFor, 1);
    expect(choice?.station.name).toBe("Rain Gauge");
    expect(choice?.withTemperature).toBe(false);
    expect(f.calls).toEqual(["000001"]);
  });

  it("returns null when nothing within the cap is usable", async () => {
    const f = fetcher({});
    expect(await chooseStation(candidates, f.readingsFor, 30)).toBeNull();
    expect(await chooseStation([], f.readingsFor, 30)).toBeNull();
  });
});

describe("toStoredClimate", () => {
  it("stores empty arrays, never zeros, for a missing series", async () => {
    const [station] = stationsWithin(HOME.lat, HOME.lng, STATIONS, 100);
    const stored = toStoredClimate({ station, readings: { meanMaxTemp: MAX, meanMinTemp: MIN, meanRainfall: null }, withTemperature: true });
    expect(stored).toEqual({ meanMaxTemp: MAX, meanMinTemp: MIN, meanRainfall: [], annualRainfallMm: null });
  });
});
