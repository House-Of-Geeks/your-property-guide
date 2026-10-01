// Valuation plan item 2: the house-worth guide shows the suburb's figures
// (never an estimate for the visitor's home) beside the appraisal form, and
// only when the median clears the reliable-price gate. Commercial intent
// review 3.4 (30 Sep 2026) added the unit-median source rule and the
// provenance fields the instant range prints.
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
  it("returns the suburb's median, growth, count, source and period when reliable", () => {
    const s = buildHomeValueSummary(makeSuburb());
    expect(s.reliable).toBe(true);
    expect(s.medianHousePrice).toBe(4_300_000);
    expect(s.annualGrowthHouse).toBe(13.9);
    expect(s.salesCount).toBe(35);
    expect(s.sourceLabel).toBe("NSW Valuer General");
    expect(s.period).toBe("calendar 2025");
    expect(s.basis).toBe("suburb");
    expect(s.provenance).toMatch(/35 house sales/);
    expect(s.provenance).toMatch(/Valuer General/);
  });
  it("withholds the NSW unit median: sales-nsw produces none, so the $538,560 on file predates the feed", () => {
    expect(buildHomeValueSummary(makeSuburb()).medianUnitPrice).toBeNull();
    expect(buildHomeValueSummary(makeSuburb({}, { salesSource: "sales-sa" })).medianUnitPrice).toBeNull();
  });
  it("publishes a unit median from the feeds that produce one, with the unit series as its source", () => {
    const vic = buildHomeValueSummary(makeSuburb({ medianUnitPrice: 700_000 }, { salesSource: "sales-vic", salesCount: null }));
    expect(vic.medianUnitPrice).toBe(700_000);
    expect(vic.sourceLabel).toBe("Land Victoria quarterly medians");
    expect(vic.unitProvenance).toBe("Land Victoria's quarterly suburb median unit price, the latest published quarter (updated September 2026).");
    const abs = buildHomeValueSummary(makeSuburb({ medianUnitPrice: 450_000 }, { salesSource: "sales-abs", salesCount: null, salesPeriodEnd: new Date("2024-12-31T00:00:00Z") }));
    expect(abs.medianUnitPrice).toBe(450_000);
    expect(abs.basis).toBe("area");
    expect(abs.period).toBe("2024");
    expect(abs.unitProvenance).toMatch(/^Median price of attached dwelling transfers .* ABS statistical area \(SA2\) that takes in Bondi, 2024\. An SA2 can take in surrounding localities/);
    expect(abs.provenance).toMatch(/house transfer price/);
  });
  it("has no unit source line where no unit median is published", () => {
    expect(buildHomeValueSummary(makeSuburb()).unitProvenance).toBeNull();
  });
  it("is reliable on a unit median alone, so a units-only suburb still gets its figure", () => {
    const s = buildHomeValueSummary(makeSuburb({ medianHousePrice: 0, medianUnitPrice: 700_000, annualGrowthHouse: 4 }, { salesSource: "sales-vic", salesCount: null }));
    expect(s.reliable).toBe(true);
    expect(s.medianHousePrice).toBeNull();
    expect(s.medianUnitPrice).toBe(700_000);
    expect(s.annualGrowthHouse).toBeNull();
    // The house line would describe a median that is not shown.
    expect(s.provenance).toBeNull();
    expect(s.unitProvenance).toMatch(/Land Victoria/);
  });
  it("withholds every figure when the median is missing or the source is not trusted", () => {
    for (const s of [
      buildHomeValueSummary(makeSuburb({ medianHousePrice: 0 })),
      buildHomeValueSummary(makeSuburb({}, { salesSource: null as unknown as string, salesCount: null as unknown as number })),
      buildHomeValueSummary(makeSuburb({}, { salesSource: "sales-qld" })),
    ]) {
      expect(s.reliable).toBe(false);
      expect(s.medianHousePrice).toBeNull();
      expect(s.medianUnitPrice).toBeNull();
      expect(s.annualGrowthHouse).toBeNull();
      expect(s.provenance).toBeNull();
      expect(s.unitProvenance).toBeNull();
    }
  });
  it("keeps the count and period of a median withheld for too few sales, so the block can say why", () => {
    const s = buildHomeValueSummary(makeSuburb({ medianHousePrice: 0 }, { salesCount: 3 }));
    expect(s.reliable).toBe(false);
    expect(s.salesCount).toBe(3);
    expect(s.period).toBe("calendar 2025");
    expect(s.sourceLabel).toBe("NSW Valuer General");
  });
  it("carries no count, source or period from a distrusted feed", () => {
    const s = buildHomeValueSummary(makeSuburb({}, { salesSource: "seed", salesCount: 12 }));
    expect(s.salesCount).toBeNull();
    expect(s.sourceLabel).toBeNull();
    expect(s.period).toBeNull();
    expect(s.basis).toBeNull();
  });
  it("treats zero growth and zero unit median as unknown, not as figures", () => {
    const s = buildHomeValueSummary(makeSuburb({ annualGrowthHouse: 0, medianUnitPrice: 0 }, { salesSource: "sales-vic" }));
    expect(s.reliable).toBe(true);
    expect(s.annualGrowthHouse).toBeNull();
    expect(s.medianUnitPrice).toBeNull();
  });
  it("attributes leads to the guide and the suburb", () => {
    expect(homeValueSource("bondi-nsw-2026")).toBe("home-value-guide-bondi-nsw-2026");
  });
});
