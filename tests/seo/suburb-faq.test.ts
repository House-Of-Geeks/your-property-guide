// Valuation plan item 1: the suburb FAQ answers "how much is my house worth
// in {suburb}" alongside the median question, and only when the median is
// reliable (the list feeds FAQPage JSON-LD, so a wrong figure would surface
// in SERP snippets).
import { describe, expect, it } from "vitest";
import type { Suburb } from "@/types";
import { buildSuburbFaqs } from "@/lib/suburb-faq";

function makeSuburb(over: Partial<Suburb["stats"]> = {}, freshness: Partial<NonNullable<Suburb["dataFreshness"]>> = {}): Suburb {
  return {
    id: "t", slug: "bondi-nsw-2026", name: "Bondi", postcode: "2026", state: "NSW", region: "Waverley", description: "", heroImage: "",
    schools: [], amenities: [], transportLinks: [], nearbySuburbs: [],
    stats: { medianHousePrice: 4_300_000, medianUnitPrice: 538_560, medianRentHouse: 1800, medianRentUnit: 1100, annualGrowthHouse: 13.9, annualGrowthUnit: 0, daysOnMarket: 0, population: 10_411, medianAge: 34, ownerOccupied: 40, renterOccupied: 55, householdsFamily: 50, householdsLonePerson: 30, walkScore: 92, transitScore: null, bikeScore: null, ...over },
    dataFreshness: { rentalAsOf: new Date("2026-06-30T00:00:00Z"), rentalSource: "rental-nsw", crimeAsOf: null, crimeSource: null, salesAsOf: new Date("2026-09-05T00:00:00Z"), salesSource: "sales-nsw", salesCount: 35, salesPeriodEnd: new Date("2025-12-31T00:00:00Z"), censusAsOf: null, hazardAsOf: null, walkabilityAsOf: null, climateAsOf: null, ...freshness },
  };
}
const questions = (s: Suburb) => buildSuburbFaqs(s).map((f) => f.question);
const answerTo = (s: Suburb, q: string) => buildSuburbFaqs(s).find((f) => f.question === q)?.answer ?? "";

describe("suburb FAQ valuation questions", () => {
  it("asks the median question and the 'how much is my house worth' question when the median is reliable", () => {
    const qs = questions(makeSuburb());
    expect(qs[0]).toBe("What is the median house price in Bondi?");
    expect(qs[1]).toBe("How much is my house worth in Bondi?");
  });
  it("answers with the median as a starting range, the unit median, and the appraisal next step", () => {
    const a = answerTo(makeSuburb(), "How much is my house worth in Bondi?");
    expect(a).toContain("Bondi median house price of $4,300,000");
    expect(a).toContain("(units $538,560)");
    expect(a).toContain("free property appraisal");
  });
  it("omits both valuation questions when the median is withheld or the source is not trusted", () => {
    expect(questions(makeSuburb({ medianHousePrice: 0 }))).not.toContain("How much is my house worth in Bondi?");
    expect(questions(makeSuburb({ medianHousePrice: 0 }))).not.toContain("What is the median house price in Bondi?");
    const proxy = questions(makeSuburb({}, { salesSource: null as unknown as string, salesCount: null as unknown as number }));
    expect(proxy).not.toContain("How much is my house worth in Bondi?");
  });
  it("skips the unit figure when there is no unit median", () => {
    expect(answerTo(makeSuburb({ medianUnitPrice: 0 }), "How much is my house worth in Bondi?")).not.toContain("(units");
  });
  it("still asks the postcode and location questions for every suburb", () => {
    const qs = questions(makeSuburb({ medianHousePrice: 0 }));
    expect(qs).toContain("What is the Bondi postcode?");
    expect(qs).toContain("Where is Bondi?");
  });
});
