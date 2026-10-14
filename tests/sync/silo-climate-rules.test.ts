// The SILO climate sync: each suburb's figures are 1991–2020 normals for its
// own point on SILO's 0.05° grid, never twelve zeros, never a far station.
import { describe, expect, it } from "vitest";
import {
  type SiloMonth,
  cellOf,
  hasClimate,
  monthlyNormals,
  neighbourCells,
  parseSiloMonthly,
  siloStationId,
  siloStationName,
  snapToGrid,
  toStoredClimate,
} from "../../scripts/sync/sources/silo-climate-rules";

const MAX = [30.2, 29.9, 28.9, 27.0, 24.6, 22.2, 21.9, 23.0, 25.2, 26.6, 28.0, 29.3];
const MIN = [21.4, 21.3, 20.1, 17.3, 13.9, 11.4, 10.5, 11.0, 13.6, 16.3, 18.6, 20.3];
const RAIN = [140, 172, 147, 63, 69, 56, 31, 34, 29, 87, 102, 138];

/** 1991–2020, every month, with each year's values nudged so the mean is exact. */
function years(from = 1991, to = 2020, over: (y: number, m: number) => Partial<SiloMonth> = () => ({})): SiloMonth[] {
  const rows: SiloMonth[] = [];
  for (let y = from; y <= to; y++) {
    const wobble = y % 2 === 0 ? 0.5 : -0.5;
    for (let m = 1; m <= 12; m++) {
      rows.push({ year: y, month: m, tmax: MAX[m - 1] + wobble, tmin: MIN[m - 1] + wobble, rain: RAIN[m - 1] + wobble * 10, ...over(y, m) });
    }
  }
  return rows;
}

describe("the grid", () => {
  it("snaps a centroid to the nearest 0.05° point", () => {
    expect(snapToGrid(-26.7012)).toBe(-26.7);
    expect(snapToGrid(153.0533)).toBe(153.05);
    expect(snapToGrid(153.076)).toBe(153.1);
    expect(cellOf(-26.7012, 153.0533)).toEqual({ lat: -26.7, lon: 153.05, key: "-26.70,153.05" });
    expect(siloStationId(cellOf(-26.7012, 153.0533))).toBe("silo:-26.70,153.05");
    expect(siloStationName(cellOf(-26.7012, 153.0533))).toBe("SILO grid point -26.70, 153.05");
  });
  it("offers the eight neighbouring cells, nearest first, for a suburb whose own cell is sea", () => {
    const n = neighbourCells(-26.7012, 153.0533);
    expect(n).toHaveLength(8);
    expect(new Set(n.map((c) => c.key)).size).toBe(8);
    expect(n.map((c) => c.key)).not.toContain("-26.70,153.05");
    // The point sits just north-east of its cell's centre: the cells to the east and north come first.
    expect(["-26.70,153.10", "-26.65,153.05"]).toContain(n[0].key);
  });
});

describe("parseSiloMonthly", () => {
  it("reads the monthly format as SILO serves it, skipping the notes, headers and the quoted dummy row", () => {
    // Trimmed from a real DataDrill response (Buderim's grid point, 14 Oct 2026).
    const text = [
      '"199705"  -9.9  -9.9 9999.9 999.9  99.9  99.9"',
      '""',
      '" * Data Drill for Lat, Long: -26.70 153.05 (DECIMAL DEGREES), 26 42\'S 153  3\'E "" * Elevation: 67 m "',
      '"===================================================================================================="',
      'Yr.Mth Avg   Avg   Tot   Tot    Avg   Avg',
      'YYYYMM TMax  TMin  Rain  Evap   Rad    VP',
      '()     (oC)  (oC)  (mm)  (mm) (MJ/m2) (hPa)',
      '19910100  28.8  21.7   71.3 176.5  22.9  24.9',
      '19910200  28.2  21.2  193.6 138.2  22.2  24.8',
    ].join("\n");
    expect(parseSiloMonthly(text)).toEqual([
      { year: 1991, month: 1, tmax: 28.8, tmin: 21.7, rain: 71.3 },
      { year: 1991, month: 2, tmax: 28.2, tmin: 21.2, rain: 193.6 },
    ]);
  });
  it("also reads the six-digit months of SILO's published sample", () => {
    expect(parseSiloMonthly(" 199101  30.4  21.0  212.5 160.2  21.9  26.1")).toEqual([
      { year: 1991, month: 1, tmax: 30.4, tmin: 21.0, rain: 212.5 },
    ]);
    expect(parseSiloMonthly("Sorry, the requested location is not on land")).toEqual([]);
  });
});

describe("monthlyNormals", () => {
  it("averages each calendar month over 1991–2020", () => {
    const n = monthlyNormals(years());
    expect(n.meanMaxTemp).toEqual(MAX);
    expect(n.meanMinTemp).toEqual(MIN);
    expect(n.meanRainfall).toEqual(RAIN);
    expect(hasClimate(n)).toBe(true);
  });
  it("ignores years outside the period", () => {
    const n = monthlyNormals([...years(), ...years(1960, 1990, () => ({ tmax: 50 }))]);
    expect(n.meanMaxTemp).toEqual(MAX);
  });
  it("drops a series with too few years, rather than averaging a handful", () => {
    const n = monthlyNormals(years(1991, 2020, (y, m) => (m === 7 && y > 1995 ? { tmin: null } : {})));
    expect(n.meanMinTemp).toBeNull();
    expect(n.meanMaxTemp).toEqual(MAX);
  });
  it("never stores twelve zeros", () => {
    const n = monthlyNormals(years(1991, 2020, () => ({ tmax: 0, tmin: 0, rain: 0 })));
    expect(n).toEqual({ meanMaxTemp: null, meanMinTemp: null, meanRainfall: null });
    expect(hasClimate(n)).toBe(false);
    expect(toStoredClimate(n)).toEqual({ meanMaxTemp: [], meanMinTemp: [], meanRainfall: [], annualRainfallMm: null });
  });
  it("stores the series and the annual rainfall", () => {
    expect(toStoredClimate(monthlyNormals(years()))).toEqual({
      meanMaxTemp: MAX,
      meanMinTemp: MIN,
      meanRainfall: RAIN,
      annualRainfallMm: 1068,
    });
  });
});
