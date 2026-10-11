// Valuation plan item 4: the "real estate agents in {suburb}" page model.
import { describe, expect, it } from "vitest";
import type { Suburb } from "@/types";
import type { Agent, Agency } from "@/types/agent";
import fs from "node:fs";
import { AGENT_LISTINGS_ENABLED, COMMISSION_RULE_SOURCES, EXAMPLE_SALE_PRICES, buildSuburbAgentsModel, commissionOnMedian } from "@/lib/suburb-agents";
import { STATE_RATES } from "@/lib/data/commission-rates";

function makeSuburb(over: Partial<Suburb["stats"]> = {}, freshness: Partial<NonNullable<Suburb["dataFreshness"]>> = {}, state = "NSW"): Suburb {
  return {
    id: "t", slug: "bondi-nsw-2026", name: "Bondi", postcode: "2026", state, region: "Waverley", description: "", heroImage: "",
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
    expect([c.lowPct, c.typicalPct, c.highPct]).toEqual([1.8, 2.0, 2.5]);
    expect([c.lowAmount, c.typicalAmount, c.highAmount]).toEqual([18_000, 20_000, 25_000]);
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
    expect(m.commission?.lowAmount).toBe(77_400);
    expect(m.commission?.highAmount).toBe(107_500);
    expect(m.faqs[0].question).toBe("What do real estate agents charge in Bondi?");
    expect(m.faqs[0].answer).toContain("$77,400 to $107,500");
    expect(m.description).toContain("$4,300,000 median (NSW Valuer General, 1.8% to 2.5%)");
    expect(m.matchSource).toBe("suburb-agents-bondi-nsw-2026");
  });
  it("is not indexable without a reliable median, and works the state range on example prices instead", () => {
    const m = buildSuburbAgentsModel(makeSuburb({ medianHousePrice: 0 }), [], []);
    expect(m.indexable).toBe(false);
    expect(m.commission).toBeNull();
    expect(m.stateRange).toEqual({ lowPct: 1.8, highPct: 2.5, typicalPct: 2.0 });
    expect(m.examples.map((e) => e.price)).toEqual([...EXAMPLE_SALE_PRICES]);
    expect(m.examples[1]).toMatchObject({ price: 1_000_000, lowAmount: 18_000, highAmount: 25_000 });
    expect(m.faqs[0].question).toBe("What do real estate agents charge in Bondi?");
    expect(m.faqs[0].answer).toContain("1.8% to 2.5%");
    expect(m.faqs[0].answer).toContain("an example price rather than Bondi's own");
  });
  it("prints each state's own range from STATE_RATES, never a national string (F2, 10 Oct 2026)", () => {
    for (const state of Object.keys(STATE_RATES) as (keyof typeof STATE_RATES)[]) {
      const m = buildSuburbAgentsModel(makeSuburb({ medianHousePrice: 0 }, {}, state), [], []);
      expect(m.stateRange).toEqual({ lowPct: STATE_RATES[state].low, highPct: STATE_RATES[state].high, typicalPct: STATE_RATES[state].typical });
      expect(m.faqs[0].answer).toContain(`${STATE_RATES[state].low}% to ${STATE_RATES[state].high}%`);
    }
    const page = fs.readFileSync("src/app/(marketing)/suburbs/[slug]/agents/page.tsx", "utf8");
    expect(page).not.toMatch(/1\.6% and 3\.25%|between \d/);
  });
  it("works no examples when the median is published", () => {
    expect(buildSuburbAgentsModel(makeSuburb(), [], []).examples).toEqual([]);
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

describe("median provenance and commission sources (F3, 10 Oct 2026)", () => {
  it("names the feed and period of a suburb median", () => {
    const m = buildSuburbAgentsModel(makeSuburb({ medianHousePrice: 1_600_000 }, { salesSource: "sales-vic", salesCount: 120, salesAsOf: new Date("2026-05-15T00:00:00Z") }, "VIC"), [], []);
    expect(m.provenance?.sourceShort).toBe("Land Victoria");
    expect(m.provenance?.basis).toBe("suburb");
    expect(m.provenance?.sentence).toContain("Land Victoria's quarterly suburb median");
    expect(m.provenance?.sentence).toContain("May 2026");
    expect(m.medianPhrase).toBe("Bondi's median house price of $1,600,000");
    expect(m.faqs[0].answer).toContain("(Land Victoria, the latest published quarter, updated May 2026)");
    expect(m.description).toContain("(Land Victoria,");
  });
  it("calls an ABS figure the statistical area's, never the suburb's own median", () => {
    const m = buildSuburbAgentsModel(makeSuburb({ medianHousePrice: 473_000 }, { salesSource: "sales-abs", salesCount: null, salesPeriodEnd: new Date("2024-12-31T00:00:00Z") }, "TAS"), [], []);
    expect(m.provenance?.basis).toBe("area");
    expect(m.provenance?.caption).toBe("Median house price, ABS statistical area (SA2) for Bondi");
    expect(m.provenance?.sentence).toContain("can differ from sales in Bondi itself");
    expect(m.medianPhrase).toBe("the ABS statistical-area (SA2) median house price for Bondi, $473,000");
    expect(m.faqs[0].answer).not.toContain("Bondi's median");
    expect(m.description).toContain("ABS area median");
  });
  it("has no provenance when the median is withheld", () => {
    const m = buildSuburbAgentsModel(makeSuburb({ medianHousePrice: 0 }), [], []);
    expect(m.provenance).toBeNull();
    expect(m.medianPhrase).toBeNull();
  });
  it("cites the states' own pages only where they were read, and the page names the range's source", () => {
    for (const src of Object.values(COMMISSION_RULE_SOURCES)) {
      expect(src!.href).toMatch(/^https:\/\/www\.(nsw|consumer\.vic|qld)\.gov\.au\//);
      expect(src!.asAt).toMatch(/read \d{1,2} \w+ 2026/);
    }
    const page = fs.readFileSync("src/app/(marketing)/suburbs/[slug]/agents/page.tsx", "utf8");
    expect(page).not.toContain("published agent-comparison guides");
    expect(page).toContain("Your Property Guide&rsquo;s typical figure");
  });
});
