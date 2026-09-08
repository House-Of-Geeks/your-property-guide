// Fix item 13: the rental-market model builds only from data that exists.
import { describe, expect, it } from "vitest";
import type { Suburb } from "../../src/types/suburb";
import type { SuburbRentalHistory } from "../../src/lib/services/rental-service";
import { buildRentalMarket, pctChange, previousYearPeriod, rentalMarketTitle } from "../../src/lib/rental-market";
import { RENTAL_MARKET_PILOT_SLUGS, isRentalMarketPilot } from "../../src/lib/data/rental-market-pilot";

function suburb(over: Partial<Suburb["stats"]> = {}, name = "Werribee", state = "VIC", postcode = "3030"): Suburb {
  return {
    id: "t", slug: `${name.toLowerCase().replace(/ /g, "-")}-${state.toLowerCase()}-${postcode}`, name, postcode, state, region: "Wyndham", description: "", heroImage: "",
    schools: [], amenities: [], transportLinks: [], nearbySuburbs: [],
    stats: { medianHousePrice: 650_000, medianUnitPrice: 420_000, medianRentHouse: 460, medianRentUnit: 405, annualGrowthHouse: 0, annualGrowthUnit: 0, daysOnMarket: 0, population: 50_000, medianAge: 33, ownerOccupied: 60, renterOccupied: 35, householdsFamily: 70, householdsLonePerson: 20, walkScore: 55, transitScore: null, bikeScore: null, ...over },
    dataFreshness: { rentalAsOf: new Date("2025-09-01T00:00:00Z"), rentalSource: "rental-vic", crimeAsOf: null, crimeSource: null, salesAsOf: new Date("2026-05-01T00:00:00Z"), salesSource: "sales-vic", salesCount: null, salesPeriodEnd: new Date("2026-06-01T00:00:00Z"), censusAsOf: null, hazardAsOf: null, walkabilityAsOf: null, climateAsOf: null },
  };
}
function row(over: Partial<SuburbRentalHistory>): SuburbRentalHistory {
  return { id: over.period ?? "r", suburbSlug: "werribee-vic-3030", suburbName: "Werribee", postcode: "3030", state: "VIC", period: "2025-Q3", periodDate: new Date("2025-09-01T00:00:00Z"), medianRentHouse: 460, medianRentUnit: 405, medianRent3Bed: 480, medianRent2Bed: 410, medianRent1Bed: 330, bondLodgements: null, source: "rental-vic", ...over };
}

describe("helpers", () => {
  it("finds the same quarter a year earlier and computes change to one decimal", () => {
    expect(previousYearPeriod("2025-Q3")).toBe("2024-Q3");
    expect(previousYearPeriod("June 2026")).toBeNull();
    expect(pctChange(400, 460)).toBe(15);
    expect(pctChange(450, 460)).toBe(2.2);
    expect(pctChange(null, 460)).toBeNull();
    expect(pctChange(0, 460)).toBeNull();
  });
  it("keeps the title inside 60 characters, naming yield only when it renders", () => {
    expect(rentalMarketTitle("Werribee", true)).toBe("Werribee Rental Market 2026: Median Rent & Yield");
    expect(rentalMarketTitle("Werribee", false)).toBe("Werribee Rental Market 2026: Median Rent");
    for (const name of ["Sunshine Coast Hinterland", "Hoppers Crossing", "Mount Eliza Beachside", "Upper Ferntree Gully"]) {
      for (const y of [true, false]) expect(rentalMarketTitle(name, y).length, `${name} ${y}`).toBeLessThanOrEqual(60);
    }
    expect(rentalMarketTitle("Sunshine Coast Hinterland", true)).toBe("Sunshine Coast Hinterland Rental Market 2026: Rent & Yield");
  });
});

describe("buildRentalMarket", () => {
  it("renders current rent, yield and the FAQ from one Victorian row; no history from a single period", () => {
    const m = buildRentalMarket(suburb(), [row({})], 0);
    expect(m.sections).toEqual(["current", "yield", "faq"]);
    expect(m.current?.bed3).toBe(480);
    expect(m.yieldHouse).toBe(3.7);
    expect(m.yieldUnit).toBe(5);
    expect(m.history).toEqual([]);
    expect(m.change).toBeNull();
    expect(m.title).toBe("Werribee Rental Market 2026: Median Rent & Yield");
    expect(m.description.length).toBeLessThanOrEqual(160);
    expect(m.description).toContain("$460 houses, $405 units (Victorian rental report, September 2025)");
    expect(m.provenance).toBe("Victorian rental report, September 2025");
    expect(m.faqs.map((f) => f.question)).toEqual(["What is the median rent in Werribee?", "What is the gross rental yield in Werribee?", "What does a one, two or three-bedroom rental cost in Werribee?"]);
    expect(m.faqs[1].answer).toContain("About 3.7% for houses: $460 a week is $23,920 a year against a median house price of $650,000");
  });
  it("adds history, the 12-month change and a listings section when the data exists", () => {
    const m = buildRentalMarket(suburb(), [row({}), row({ period: "2024-Q3", periodDate: new Date("2024-09-01T00:00:00Z"), medianRentHouse: 420, medianRentUnit: 380 })], 12);
    expect(m.sections).toEqual(["current", "yield", "history", "listings", "faq"]);
    expect(m.change).toMatchObject({ house: 9.5, unit: 6.6, fromPeriod: "2024-Q3", toPeriod: "2025-Q3" });
    expect(m.history).toHaveLength(2);
    expect(m.columns).toEqual({ bed3: true, bed2: true, bed1: true, bonds: false });
    expect(m.faqs.map((f) => f.question)).toContain("How have rents in Werribee changed over the past year?");
    expect(m.faqs.find((f) => f.question.startsWith("Are there"))?.answer).toContain("12 properties are listed");
  });
  it("leaves yield out of the title and the page when the price is withheld (NSW postcode-level row, no bedroom split)", () => {
    const nsw = suburb({ medianHousePrice: 0, medianUnitPrice: 0 }, "Bondi", "NSW", "2026");
    nsw.dataFreshness!.rentalSource = "rental-nsw";
    const m = buildRentalMarket(nsw, [row({ suburbSlug: "bondi-nsw-2026", state: "NSW", postcode: "2026", period: "2026-Q2", periodDate: new Date("2026-06-01T00:00:00Z"), medianRentHouse: 1800, medianRentUnit: 1000, medianRent3Bed: null, medianRent2Bed: null, medianRent1Bed: null, bondLodgements: 65, source: "rental-nsw" })], 0);
    expect(m.sections).toEqual(["current"]);
    expect(m.title).toBe("Bondi Rental Market 2026: Median Rent");
    expect(m.provenance).toBe("NSW rental bond data (postcode 2026), median of 65 new house bonds, June 2026");
    expect(m.faqs).toEqual([]);
    expect(m.yieldHouse).toBeNull();
  });
  it("has nothing to render without a rental row", () => {
    const m = buildRentalMarket(suburb(), [], 5);
    expect(m.current).toBeNull();
    expect(m.sections).toEqual([]);
    expect(m.title).toBe("Werribee Rental Market | Rent Prices & Trends");
  });
  it("never prints a $0", () => {
    const m = buildRentalMarket(suburb({ medianUnitPrice: 0 }), [row({ medianRentUnit: 0, medianRent1Bed: 0 })], 0);
    expect(m.current?.unit).toBeNull();
    expect(JSON.stringify(m)).not.toMatch(/\$0[^,.\d]/);
  });
});

describe("pilot cohort", () => {
  it("is 50 distinct Victorian suburbs", () => {
    expect(RENTAL_MARKET_PILOT_SLUGS).toHaveLength(50);
    expect(new Set(RENTAL_MARKET_PILOT_SLUGS).size).toBe(50);
    for (const s of RENTAL_MARKET_PILOT_SLUGS) expect(s).toMatch(/-vic-\d{4}$/);
    expect(isRentalMarketPilot("werribee-vic-3030")).toBe(true);
    expect(isRentalMarketPilot("bondi-nsw-2026")).toBe(false);
  });
});
