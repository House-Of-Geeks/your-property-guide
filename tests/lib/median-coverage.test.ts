// The cheapest lists' house-median screens and the coverage floor (review of
// 10 Oct 2026, suburbs-market 0.2 and 0.3).
import { describe, expect, it } from "vitest";
import {
  APARTMENT_SKEW_YIELD,
  COVERAGE_MIN_SHARE,
  COVERAGE_MIN_SUBURBS,
  HOUSE_SCREEN_NOTE,
  REGION_COVERAGE_MIN_SUBURBS,
  coverageShortfall,
  isCbdCore,
  isNamedApartmentMarket,
  looksApartmentSkewed,
  meetsCoverageFloor,
  passesHouseScreens,
} from "@/lib/median-coverage";

describe("the July 2026 screens", () => {
  it("leaves out the CBD-core postcodes the winter report screened", () => {
    // Melbourne 3000 ($381,000), Southbank 3006, Docklands 3008 led the 10 Oct cheapest list
    for (const pc of ["3000", "3006", "3008", "3010"]) expect(isCbdCore("VIC", pc), pc).toBe(true);
    expect(isCbdCore("VIC", "3011")).toBe(false);
    expect(isCbdCore("NSW", "2000")).toBe(true);
    expect(isCbdCore("QLD", "4006")).toBe(true);
    expect(isCbdCore("QLD", "4007")).toBe(false);
    expect(isCbdCore("NT", "0800")).toBe(true);
    expect(isCbdCore("NT", "0821")).toBe(false);
    expect(isCbdCore("ACT", "2600")).toBe(false);
    // the ranges are per state: 3000 is not a CBD core in another state's numbering
    expect(isCbdCore("NSW", "3000")).toBe(false);
  });
  it("leaves out a median whose bond-data house rent yields more than 5.5% a year", () => {
    expect(APARTMENT_SKEW_YIELD).toBe(5.5);
    // Travancore-like: $477,000 median, $600 a week is 6.5%
    expect(looksApartmentSkewed(477_000, 600)).toBe(true);
    // Melton South-like: $525,500, $480 a week is 4.7%
    expect(looksApartmentSkewed(525_500, 480)).toBe(false);
    // no rent, no screen
    expect(looksApartmentSkewed(381_000, null)).toBe(false);
    expect(looksApartmentSkewed(381_000, 0)).toBe(false);
  });
  it("and the four areas the July report named", () => {
    expect(isNamedApartmentMarket("Travancore", "VIC")).toBe(true);
    expect(isNamedApartmentMarket("Belconnen", "ACT")).toBe(true);
    expect(isNamedApartmentMarket("Lawson", "ACT")).toBe(true);
    expect(isNamedApartmentMarket("Lawson", "NSW")).toBe(false);
    expect(isNamedApartmentMarket("Barton", "ACT")).toBe(true);
  });
  it("passes a house market and says what it left out", () => {
    expect(passesHouseScreens({ name: "Melton South", state: "VIC", postcode: "3338", medianHousePrice: 525_500 }, 480)).toBe(true);
    expect(passesHouseScreens({ name: "Melbourne", state: "VIC", postcode: "3000", medianHousePrice: 381_000 }, null)).toBe(false);
    expect(passesHouseScreens({ name: "Travancore", state: "VIC", postcode: "3032", medianHousePrice: 477_000 }, null)).toBe(false);
    expect(HOUSE_SCREEN_NOTE).toContain("5.5%");
    expect(HOUSE_SCREEN_NOTE).toContain("July 2026");
    expect(HOUSE_SCREEN_NOTE).not.toMatch(/\u2014/);
  });
});

describe("the coverage floor", () => {
  it("needs 30 suburbs and a fifth of the place's suburbs of 1,000 or more residents", () => {
    expect(COVERAGE_MIN_SUBURBS).toBe(30);
    expect(COVERAGE_MIN_SHARE).toBe(0.2);
    expect(meetsCoverageFloor({ pool: 23, suburbs: 196 })).toBe(false); // Brisbane's city median, 10 Oct
    expect(meetsCoverageFloor({ pool: 10, suburbs: 40 })).toBe(false); // Hobart
    expect(meetsCoverageFloor({ pool: 0, suburbs: 0 })).toBe(false); // Sydney, NSW withheld
    expect(meetsCoverageFloor({ pool: 30, suburbs: 150 })).toBe(true);
    expect(meetsCoverageFloor({ pool: 30, suburbs: 151 })).toBe(false);
    expect(meetsCoverageFloor({ pool: 267, suburbs: 300 })).toBe(true); // Adelaide
  });
  it("a region needs ten", () => {
    expect(REGION_COVERAGE_MIN_SUBURBS).toBe(10);
    expect(meetsCoverageFloor({ pool: 5, suburbs: 40 }, REGION_COVERAGE_MIN_SUBURBS)).toBe(false); // Moreton Bay, 10 Oct
    expect(meetsCoverageFloor({ pool: 12, suburbs: 30 }, REGION_COVERAGE_MIN_SUBURBS)).toBe(true);
  });
  it("says why a figure is withheld", () => {
    expect(coverageShortfall({ pool: 5, suburbs: 40 }, "Moreton Bay", REGION_COVERAGE_MIN_SUBURBS)).toBe(
      "We publish a figure drawn from many suburbs only when at least 10 suburbs and a fifth of Moreton Bay's 40 suburbs of 1,000 or more residents have a published median; only 5 do.",
    );
    expect(coverageShortfall({ pool: 0, suburbs: 600 }, "Greater Sydney")).toContain("; none do.");
    expect(coverageShortfall({ pool: 1, suburbs: 60 }, "Greater Darwin")).toContain("; only one does.");
  });
});
