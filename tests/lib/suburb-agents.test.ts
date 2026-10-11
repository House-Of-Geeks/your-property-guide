// Valuation plan item 4: the "real estate agents in {suburb}" page model.
import { describe, expect, it } from "vitest";
import type { Suburb } from "@/types";
import type { Agent, Agency } from "@/types/agent";
import { AGENT_LISTINGS_ENABLED, buildSuburbAgentsModel, commissionOnMedian } from "@/lib/suburb-agents";
import { STATE_RATES } from "@/lib/data/commission-rates";

// The NSW range comes from the sourced table in commission-rates.ts (review 10 Oct 2026, selling 0.1).
const NSW = STATE_RATES.NSW;
const on = (median: number, rate: number) => Math.round((median * rate) / 100);
const aud = (n: number) => `$${n.toLocaleString("en-AU")}`;

function makeSuburb(over: Partial<Suburb["stats"]> = {}, freshness: Partial<NonNullable<Suburb["dataFreshness"]>> = {}): Suburb {
  return {
    id: "t", slug: "bondi-nsw-2026", name: "Bondi", postcode: "2026", state: "NSW", region: "Waverley", description: "", heroImage: "",
    schools: [], amenities: [], transportLinks: [], nearbySuburbs: [],
    stats: { medianHousePrice: 4_300_000, medianUnitPrice: 538_560, medianRentHouse: 1800, medianRentUnit: 1100, annualGrowthHouse: 13.9, annualGrowthUnit: 0, daysOnMarket: 0, population: 10_411, medianAge: 34, ownerOccupied: 40, renterOccupied: 55, householdsFamily: 50, householdsLonePerson: 30, walkScore: 92, transitScore: null, bikeScore: null, ...over },
    dataFreshness: { rentalAsOf: null, rentalSource: null, crimeAsOf: null, crimeSource: null, salesAsOf: new Date("2026-09-05T00:00:00Z"), salesSource: "sales-nsw", salesCount: 35, salesPeriodEnd: new Date("2025-12-31T00:00:00Z"), censusAsOf: null, hazardAsOf: null, walkabilityAsOf: null, climateAsOf: null, ...freshness },
  };
}
const agent = { id: "a1", slug: "jane-smith", firstName: "Jane", lastName: "Smith", fullName: "Jane Smith", title: "Agent", phone: "", email: "", bio: "", image: "", agencyId: "ag1", suburbs: ["bondi-nsw-2026"], specialties: [], yearsExperience: 5, propertiesSold: 10, reviewCount: 0, averageRating: 0 } as Agent;
const agency = { id: "ag1", slug: "smith-realty", name: "Smith Realty" } as Agency;

describe("commissionOnMedian", () => {
  it("works the state range on the suburb median", () => {
    const c = commissionOnMedian("NSW", 1_000_000)!;
    expect([c.lowPct, c.typicalPct, c.highPct]).toEqual([NSW.low, NSW.typical, NSW.high]);
    expect([c.lowAmount, c.typicalAmount, c.highAmount]).toEqual([on(1_000_000, NSW.low), on(1_000_000, NSW.typical), on(1_000_000, NSW.high)]);
  });
  it("returns null for an unknown state or no median", () => {
    expect(commissionOnMedian("XX", 1_000_000)).toBeNull();
    expect(commissionOnMedian("NSW", 0)).toBeNull();
  });
});

describe("buildSuburbAgentsModel", () => {
  it("is indexable with a reliable median, titles for the search phrase, and works the commission on the median", () => {
    const m = buildSuburbAgentsModel(makeSuburb(), [agent], [agency]);
    expect(m.title).toBe("Real Estate Agents in Bondi NSW 2026");
    expect(m.indexable).toBe(true);
    expect(m.commission?.lowAmount).toBe(on(4_300_000, NSW.low));
    expect(m.commission?.highAmount).toBe(on(4_300_000, NSW.high));
    expect(m.faqs[0].question).toBe("What do real estate agents charge in Bondi?");
    expect(m.faqs[0].answer).toContain(`${aud(on(4_300_000, NSW.low))} to ${aud(on(4_300_000, NSW.high))}`);
    expect(m.description).toContain(`$4,300,000 median (${NSW.low}% to ${NSW.high}%)`);
    expect(m.matchSource).toBe("suburb-agents-bondi-nsw-2026");
  });
  it("is not indexable without a reliable median, and drops the commission FAQ but keeps the page useful", () => {
    const m = buildSuburbAgentsModel(makeSuburb({ medianHousePrice: 0 }), [], []);
    expect(m.indexable).toBe(false);
    expect(m.commission).toBeNull();
    expect(m.faqs.map((f) => f.question)).toEqual([
      "How do I find a good real estate agent in Bondi?",
      "Do I have to pay to be matched with an agent in Bondi?",
    ]);
  });
  it("hides agent listings while the directory is paused, and shows them when enabled", () => {
    expect(AGENT_LISTINGS_ENABLED).toBe(false);
    expect(buildSuburbAgentsModel(makeSuburb(), [agent], [agency]).agents).toEqual([]);
    const on = buildSuburbAgentsModel(makeSuburb(), [agent], [agency], true);
    expect(on.agents.map((a) => a.fullName)).toEqual(["Jane Smith"]);
    expect(on.agencies.map((a) => a.name)).toEqual(["Smith Realty"]);
  });
  it("never makes a ratings or 'best' claim", () => {
    const m = buildSuburbAgentsModel(makeSuburb(), [agent], [agency], true);
    const text = [m.title, m.description, ...m.faqs.map((f) => f.answer)].join(" ");
    expect(text).not.toMatch(/\bbest\b|top-rated|\bratings?\b|stars/i);
  });
});
