// A rainfall-only Bureau of Meteorology station has no temperature series.
// Older syncs stored twelve zeros for it, and the suburb page then showed
// 0.0°C and the narrative said summer days were "around 0°C". Those series
// count as unavailable everywhere they are shown.
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SuburbClimate } from "@/components/suburb/SuburbClimate";
import {
  TEMPERATURE_UNAVAILABLE,
  climateSourceNote,
  formatStationDistance,
  hasRealRainfallSeries,
  hasRealTemperatureSeries,
  januaryMeanMax,
  realAnnualRainfallMm,
  stationDistanceCaveat,
} from "@/lib/climate";
import { buildClimateSentence, buildLifestyleSummary } from "@/lib/suburb-narrative";
import type { Suburb } from "@/types";

type Climate = NonNullable<Suburb["climate"]>;

// Test fixtures, shaped like a coastal Queensland station.
const MAX = [30.2, 29.9, 28.9, 27.0, 24.6, 22.2, 21.9, 23.0, 25.2, 26.6, 28.0, 29.3];
const MIN = [21.4, 21.3, 20.1, 17.3, 13.9, 11.4, 10.5, 11.0, 13.6, 16.3, 18.6, 20.3];
const RAIN = [140, 172, 147, 63, 69, 56, 31, 34, 29, 87, 102, 138];
const ZEROS = Array(12).fill(0);

function climate(over: Partial<Climate> = {}): Climate {
  return {
    bomStationId: "040000",
    bomStationName: "Test Station",
    distanceKm: 10.9,
    meanMaxTemp: MAX,
    meanMinTemp: MIN,
    meanRainfall: RAIN,
    meanHumidity9am: [],
    meanSunshineHrs: [],
    annualRainfallMm: 1068,
    ...over,
  };
}

function suburb(c: Suburb["climate"]): Suburb {
  return {
    id: "t", slug: "buderim-qld-4556", name: "Buderim", postcode: "4556", state: "QLD", region: "Sunshine Coast", description: "", heroImage: "",
    schools: [], amenities: [], transportLinks: [], nearbySuburbs: [],
    stats: { medianHousePrice: 0, medianUnitPrice: 0, medianRentHouse: 0, medianRentUnit: 0, annualGrowthHouse: 0, annualGrowthUnit: 0, daysOnMarket: 0, population: 0, medianAge: 0, ownerOccupied: 0, renterOccupied: 0, householdsFamily: 0, householdsLonePerson: 0, walkScore: null, transitScore: null, bikeScore: null },
    climate: c,
  };
}

const render = (c: Suburb["climate"]) => renderToStaticMarkup(React.createElement(SuburbClimate, { climate: c }));

describe("hasRealTemperatureSeries", () => {
  it("accepts twelve real monthly means, including sub-zero alpine minimums", () => {
    expect(hasRealTemperatureSeries(MAX)).toBe(true);
    expect(hasRealTemperatureSeries(MIN)).toBe(true);
    expect(hasRealTemperatureSeries([-4.1, -3.9, -2.0, 0, 1.2, 2.5, 3.1, 2.4, 0.5, -1.0, -2.8, -3.6])).toBe(true);
  });
  it("rejects all-zero, null-filled, missing, empty and wrong-length series", () => {
    expect(hasRealTemperatureSeries(ZEROS)).toBe(false);
    expect(hasRealTemperatureSeries(Array(12).fill(null))).toBe(false);
    expect(hasRealTemperatureSeries([...MAX.slice(0, 11), null])).toBe(false);
    expect(hasRealTemperatureSeries([...MAX.slice(0, 11), Number.NaN])).toBe(false);
    expect(hasRealTemperatureSeries(null)).toBe(false);
    expect(hasRealTemperatureSeries(undefined)).toBe(false);
    expect(hasRealTemperatureSeries([])).toBe(false);
    expect(hasRealTemperatureSeries(MAX.slice(0, 11))).toBe(false);
    expect(hasRealTemperatureSeries([...MAX, 25])).toBe(false);
  });
  it("rejects values no Australian monthly mean could take", () => {
    expect(hasRealTemperatureSeries([...MAX.slice(0, 11), 1068])).toBe(false);
  });
});

describe("rainfall and formatting helpers", () => {
  it("treats a zero-filled rainfall series as missing", () => {
    expect(hasRealRainfallSeries(RAIN)).toBe(true);
    expect(hasRealRainfallSeries(ZEROS)).toBe(false);
    expect(hasRealRainfallSeries([])).toBe(false);
    expect(realAnnualRainfallMm({ annualRainfallMm: null, meanRainfall: ZEROS })).toBeNull();
    expect(realAnnualRainfallMm({ annualRainfallMm: 0, meanRainfall: [] })).toBeNull();
    expect(realAnnualRainfallMm({ annualRainfallMm: null, meanRainfall: RAIN })).toBe(1068);
  });
  it("gives January's mean max only when the series is real", () => {
    expect(januaryMeanMax(climate())).toBe(30.2);
    expect(januaryMeanMax(climate({ meanMaxTemp: ZEROS }))).toBeNull();
    expect(januaryMeanMax(null)).toBeNull();
  });
  it("names the station and its distance, and flags a far one", () => {
    expect(formatStationDistance(10.9)).toBe("11 km");
    expect(formatStationDistance(4.24)).toBe("4.2 km");
    expect(climateSourceNote(climate())).toBe("Bureau of Meteorology station Test Station, 11 km away; long-term averages.");
    expect(stationDistanceCaveat(25)).toBeNull();
    expect(stationDistanceCaveat(25.1)).toBe("The station is more than 25 km away, so conditions here may differ.");
  });
});

describe("climate narrative", () => {
  it("never says 0°C for a rainfall-only station", () => {
    const text = buildClimateSentence(climate({ meanMaxTemp: ZEROS, meanMinTemp: ZEROS }));
    expect(text).not.toMatch(/0°C/);
    expect(text).not.toMatch(/Summer days/);
    expect(text).toContain(TEMPERATURE_UNAVAILABLE);
    expect(text).toContain("Annual rainfall lands at about 1,068 mm.");
    expect(text).toContain("Bureau of Meteorology's Test Station station, 11 km away.");
  });
  it("treats empty and null-filled temperature series the same way", () => {
    for (const bad of [[], Array(12).fill(null) as number[]]) {
      const text = buildClimateSentence(climate({ meanMaxTemp: bad, meanMinTemp: bad }));
      expect(text).not.toMatch(/°C/);
      expect(text).toContain(TEMPERATURE_UNAVAILABLE);
    }
  });
  it("describes summer and winter when both series are real", () => {
    const text = buildClimateSentence(climate());
    expect(text).toContain("Summer days here average around 30°C (warm), winter mornings around 11°C (mild).");
    expect(text).not.toContain(TEMPERATURE_UNAVAILABLE);
  });
  it("adds a caveat for a station more than 25 km away", () => {
    expect(buildClimateSentence(climate({ distanceKm: 42.3 }))).toContain("conditions here may differ");
    expect(buildClimateSentence(climate())).not.toContain("conditions here may differ");
  });
  it("says nothing when the station gave us nothing real", () => {
    expect(buildClimateSentence(climate({ meanMaxTemp: ZEROS, meanMinTemp: ZEROS, meanRainfall: ZEROS, annualRainfallMm: null }))).toBe("");
    expect(buildLifestyleSummary(suburb(climate({ meanMaxTemp: ZEROS, meanMinTemp: ZEROS, meanRainfall: ZEROS, annualRainfallMm: null })))).toEqual([]);
  });
  it("flows through the lifestyle summary", () => {
    const paras = buildLifestyleSummary(suburb(climate({ meanMaxTemp: ZEROS, meanMinTemp: ZEROS })));
    expect(paras.join(" ")).not.toMatch(/0°C/);
    expect(paras.join(" ")).toContain(TEMPERATURE_UNAVAILABLE);
  });
});

describe("the climate block on the suburb page", () => {
  it("shows no 0.0°C for an all-zero temperature series, and keeps real rainfall", () => {
    const html = render(climate({ meanMaxTemp: ZEROS, meanMinTemp: ZEROS }));
    expect(html).not.toContain("0.0°C");
    expect(html).not.toContain("°C");
    expect(html).toContain(TEMPERATURE_UNAVAILABLE.replace("'", "&#x27;"));
    expect(html).toContain("1,068 mm");
    expect(html).toContain("Rainfall by month");
    expect(html).toContain("Bureau of Meteorology station Test Station, 11 km away; long-term averages.");
  });
  it("shows the hottest and coldest months when the series are real", () => {
    const html = render(climate());
    expect(html).toContain("30.2°C");
    expect(html).toContain("10.5°C");
    expect(html).not.toContain("Temperature data isn");
  });
  it("leaves out a missing min series without inventing a figure", () => {
    const html = render(climate({ meanMinTemp: ZEROS }));
    expect(html).toContain("30.2°C");
    expect(html).not.toContain("Coldest month");
    expect(html).toContain("Minimum temperatures aren");
  });
  it("hides the rainfall chart for a zero-filled rainfall series", () => {
    const html = render(climate({ meanRainfall: ZEROS, annualRainfallMm: null }));
    expect(html).not.toContain("Rainfall by month");
    expect(html).not.toContain("Annual rainfall");
  });
  it("adds the distance caveat for a far station", () => {
    expect(render(climate({ distanceKm: 87.6 }))).toContain("88 km away; long-term averages. The station is more than 25 km away, so conditions here may differ.");
  });
  it("falls back to the not-yet message when nothing is real", () => {
    const html = render(climate({ meanMaxTemp: ZEROS, meanMinTemp: ZEROS, meanRainfall: ZEROS, annualRainfallMm: null }));
    expect(html).toContain("Climate data not yet available for this suburb.");
    expect(html).not.toContain("°C");
  });
});
