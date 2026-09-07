// Fix item 3: the opening snapshot (tiles, provenance line, lead sentence).
import { describe, expect, it } from "vitest";
import type { Suburb } from "@/types";
import { MIN_SNAPSHOT_TILES, buildLeadSentence, buildSnapshotProvenance, buildSnapshotStats, grossYieldPercent } from "@/lib/suburb-snapshot";

function makeSuburb(over: Partial<Suburb["stats"]> = {}, freshness: Partial<NonNullable<Suburb["dataFreshness"]>> = {}): Suburb {
  return {
    id: "t", slug: "bondi-nsw-2026", name: "Bondi", postcode: "2026", state: "NSW", region: "Waverley", description: "", heroImage: "",
    schools: [], amenities: [], transportLinks: [], nearbySuburbs: [],
    stats: { medianHousePrice: 4_300_000, medianUnitPrice: 0, medianRentHouse: 1800, medianRentUnit: 1100, annualGrowthHouse: 13.9, annualGrowthUnit: 0, daysOnMarket: 0, population: 10_411, medianAge: 34, ownerOccupied: 40, renterOccupied: 55, householdsFamily: 50, householdsLonePerson: 30, walkScore: 92, transitScore: null, bikeScore: null, ...over },
    dataFreshness: { rentalAsOf: new Date("2026-06-30T00:00:00Z"), rentalSource: "rental-nsw", crimeAsOf: null, crimeSource: null, salesAsOf: new Date("2026-09-05T00:00:00Z"), salesSource: "sales-nsw", salesCount: 35, salesPeriodEnd: new Date("2025-12-31T00:00:00Z"), censusAsOf: null, hazardAsOf: null, walkabilityAsOf: null, climateAsOf: null, ...freshness },
  };
}

describe("snapshot tiles", () => {
  it("shows price, rent, yield, population and walk score for a full-data suburb, capped at six", () => {
    const tiles = buildSnapshotStats(makeSuburb());
    expect(tiles.map((t) => t.key)).toEqual(["house", "rent", "yield", "population", "walk"]);
    expect(tiles[0].value).toBe("$4,300,000");
    expect(tiles[0].detail).toBe("+13.9% over 12 months");
    expect(tiles[2].value).toBe("2.2%");
  });
  it("drops price and yield tiles when the median is withheld, keeps rent and population", () => {
    const tiles = buildSnapshotStats(makeSuburb({ medianHousePrice: 0, annualGrowthHouse: 0 }));
    expect(tiles.map((t) => t.key)).toEqual(["rent", "population", "walk"]);
  });
  it("renders nothing below three tiles", () => {
    expect(MIN_SNAPSHOT_TILES).toBe(3);
    expect(buildSnapshotStats(makeSuburb({ medianHousePrice: 0, medianRentHouse: 0, medianRentUnit: 0, population: 0, walkScore: null }))).toEqual([]);
    expect(buildSnapshotStats(makeSuburb({ medianHousePrice: 0, medianRentHouse: 0, medianRentUnit: 0 }))).toEqual([]);
  });
  it("hides an implausible yield", () => {
    expect(grossYieldPercent(1800, 100_000)).toBeNull(); // 93.6%
    expect(grossYieldPercent(0, 4_300_000)).toBeNull();
    expect(grossYieldPercent(1800, 4_300_000)).toBeCloseTo(2.18, 2);
  });
});

describe("snapshot provenance line", () => {
  it("names each data family that is shown", () => {
    const s = makeSuburb();
    expect(buildSnapshotProvenance(s, buildSnapshotStats(s))).toEqual([
      "Prices: Median of 35 house sales · NSW Valuer General · calendar 2025",
      "Rent: NSW rental bond data, June 2026",
      "Population: 2021 Census",
    ]);
  });
  it("omits families that are not shown", () => {
    // rent + days on market + walk score: three tiles, no price, no population
    const s = makeSuburb({ medianHousePrice: 0, annualGrowthHouse: 0, population: 0, daysOnMarket: 30 });
    expect(buildSnapshotStats(s).map((t) => t.key)).toEqual(["rent", "dom", "walk"]);
    expect(buildSnapshotProvenance(s, buildSnapshotStats(s))).toEqual(["Rent: NSW rental bond data, June 2026"]);
  });
});

describe("lead sentence", () => {
  it("leads with the median and its provenance", () => {
    expect(buildLeadSentence(makeSuburb())).toBe("Bondi's median house price is $4,300,000 (median of 35 house sales recorded by the NSW Valuer General in calendar 2025).");
  });
  it("says what an ABS figure is", () => {
    const s = makeSuburb({ medianHousePrice: 1_095_000 }, { salesSource: "sales-abs", salesCount: null, salesPeriodEnd: new Date("2024-12-31T00:00:00Z") });
    s.name = "Morayfield";
    expect(buildLeadSentence(s)).toBe("Morayfield sits in an ABS statistical area (SA2) where the median house price is $1,095,000 (2024).");
  });
  it("is null when no median is published, so the page leads with the postcode", () => {
    expect(buildLeadSentence(makeSuburb({ medianHousePrice: 0 }))).toBeNull();
  });
});
