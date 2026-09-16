// Valuation plan item 2: the house-worth guide shows the suburb's figures
// (never an estimate for the visitor's home) beside the appraisal form, and
// only when the median clears the reliable-price gate.
import { describe, expect, it } from "vitest";
import type { Suburb } from "@/types";
import { buildHomeValueSummary, homeValueSource } from "@/lib/home-value";

function makeSuburb(over: Partial<Suburb["stats"]> = {}, freshness: Partial<NonNullable<Suburb["dataFreshness"]>> = {}): Suburb {
  return {
    id: "t", slug: "bondi-nsw-2026", name: "Bondi", postcode: "2026", state: "NSW", region: "Waverley", description: "", heroImage: "",
    schools: [], amenities: [], transportLinks: [], nearbySuburbs: [],
    stats: { medianHousePrice: 4_300_000, medianUnitPrice: 538_560, medianRentHouse: 1800, medianRentUnit: 1100, annualGrowthHouse: 13.9, annualGrowthUnit: 0, daysOnMarket: 0, population: 10_411, medianAge: 34, ownerOccupied: 40, renterOccupied: 55, householdsFamily: 50, householdsLonePerson: 30, walkScore: 92, transitScore: null, bikeScore: null, ...over },
    dataFreshness: { rentalAsOf: new Date("2026-06-30T00:00:00Z"), rentalSource: "rental-nsw", crimeAsOf: null, crimeSource: null, salesAsOf: new Date("2026-09-05T00:00:00Z"), salesSource: "sales-nsw", salesCount: 35, salesPeriodEnd: new Date("2025-12-31T00:00:00Z"), censusAsOf: null, hazardAsOf: null, walkabilityAsOf: null, climateAsOf: null, ...freshness },
  };
}

describe("buildHomeValueSummary", () => {
  it("returns the suburb's median, unit median, growth, count and source when reliable", () => {
    const s = buildHomeValueSummary(makeSuburb());
    expect(s.reliable).toBe(true);
    expect(s.medianHousePrice).toBe(4_300_000);
    expect(s.medianUnitPrice).toBe(538_560);
    expect(s.annualGrowthHouse).toBe(13.9);
    expect(s.salesCount).toBe(35);
    expect(s.provenance).toMatch(/35 house sales/);
    expect(s.provenance).toMatch(/Valuer General/);
  });
  it("withholds every figure when the median is missing or the source is not trusted", () => {
    for (const s of [
      buildHomeValueSummary(makeSuburb({ medianHousePrice: 0 })),
      buildHomeValueSummary(makeSuburb({}, { salesSource: null as unknown as string, salesCount: null as unknown as number })),
    ]) {
      expect(s.reliable).toBe(false);
      expect(s.medianHousePrice).toBeNull();
      expect(s.medianUnitPrice).toBeNull();
      expect(s.annualGrowthHouse).toBeNull();
      expect(s.provenance).toBeNull();
    }
  });
  it("treats zero growth and zero unit median as unknown, not as figures", () => {
    const s = buildHomeValueSummary(makeSuburb({ annualGrowthHouse: 0, medianUnitPrice: 0 }));
    expect(s.reliable).toBe(true);
    expect(s.annualGrowthHouse).toBeNull();
    expect(s.medianUnitPrice).toBeNull();
  });
  it("attributes leads to the guide and the suburb", () => {
    expect(homeValueSource("bondi-nsw-2026")).toBe("home-value-guide-bondi-nsw-2026");
  });
});
