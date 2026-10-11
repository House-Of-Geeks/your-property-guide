// Valuation plan item 4: the "real estate agents in {suburb}" page model.
import { describe, expect, it } from "vitest";
import type { Suburb } from "@/types";
import type { Agent, Agency } from "@/types/agent";
import fs from "node:fs";
import {
  AGENT_LISTINGS_ENABLED,
  AGENTS_TITLE_BUDGET,
  COMMISSION_RULE_SOURCES,
  EXAMPLE_SALE_PRICES,
  agentsPageTitle,
  buildSuburbAgentsModel,
  commissionOnMedian,
  parentLocalityName,
  pickNearbyAgentLinks,
} from "@/lib/suburb-agents";
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
    expect(m.title).toBe("Real Estate Agents in Bondi, NSW: Fees & Free Appraisal");
    expect(m.indexable).toBe(true);
    expect(m.commission?.lowAmount).toBe(77_400);
    expect(m.commission?.highAmount).toBe(107_500);
    expect(m.faqs[0].question).toBe("What do real estate agents charge in Bondi?");
    expect(m.faqs[0].answer).toContain("$77,400 to $107,500");
    expect(m.description).toBe("Real estate agents in Bondi: 1.8% to 2.5% commission on the $4,300,000 median (NSW Valuer General), how to choose one, and a free appraisal.");
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
    expect(m.description).toContain("median (Land Victoria)");
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

describe("the real reason a median is withheld (F7, 10 Oct 2026)", () => {
  it("gives the recorded sales count and period when a trusted feed has too few sales", () => {
    // The service zeroes a median resting on fewer than five sales; the count stays in freshness.
    const m = buildSuburbAgentsModel(makeSuburb({ medianHousePrice: 0 }, { salesSource: "sales-nsw", salesCount: 3 }), [], []);
    expect(m.withheldNote).toBe("Only 3 house sales were recorded in calendar 2025, too few for a reliable median. We publish one from 5 sales or more.");
  });
  it("gives the profile's own reason: a rental label being re-checked, no trusted feed, or an inverted pair", () => {
    const label = buildSuburbAgentsModel(makeSuburb({ medianHousePrice: 0 }, { salesSource: "rental-nsw" }), [], []);
    expect(label.withheldNote).toBe("The sales figure on file for Bondi carries a rental feed's label, so we can't confirm it came from the NSW Valuer General. We don't show it until it has been checked against the NSW Valuer General's figures.");
    const noFeed = buildSuburbAgentsModel(makeSuburb({ medianHousePrice: 0 }, { salesSource: null }, "QLD"), [], []);
    expect(noFeed.withheldNote).toBe("No trusted sales feed has a house median for Bondi yet, so we don't show one.");
    // Kew East: the gate withholds both medians when the unit median is above the house median.
    const inverted = buildSuburbAgentsModel(
      makeSuburb({ medianHousePrice: 0, medianUnitPrice: 0 }, { salesSource: "sales-vic", salesCount: null }, "VIC"),
      [], [], false, { rawMedians: { house: 660_000, unit: 1_396_000 } },
    );
    expect(inverted.withheldNote).toContain("put the unit median above the house median");
  });
  it("is null when the median is published, and the page prints the note, not a bare 'not yet'", () => {
    expect(buildSuburbAgentsModel(makeSuburb(), [], []).withheldNote).toBeNull();
    const page = fs.readFileSync("src/app/(marketing)/suburbs/[slug]/agents/page.tsx", "utf8");
    expect(page).toContain("{model.withheldNote}");
    expect(page).not.toMatch(/We don&rsquo;t publish a median for \{sn\} yet/);
  });
  it("shows a published unit median where only the house median is missing", () => {
    const m = buildSuburbAgentsModel(makeSuburb({ medianHousePrice: 0, medianUnitPrice: 610_000 }, { salesSource: "sales-vic", salesCount: null }, "VIC"), [], []);
    expect(m.unitMedian?.price).toBe(610_000);
    expect(m.unitMedian?.provenance).toContain("Land Victoria's quarterly suburb median unit price");
    // NSW writes no unit series, so a unit figure beside it is never printed.
    expect(buildSuburbAgentsModel(makeSuburb({ medianHousePrice: 0, medianUnitPrice: 538_560 }), [], []).unitMedian).toBeNull();
  });
});

describe("house-worth guide wording (F7)", () => {
  it("promises a figure you can rely on, not an accurate one, and carries no unsourced valuation gap", () => {
    const src = fs.readFileSync("src/app/(marketing)/guides/how-much-is-my-house-worth-australia/page.tsx", "utf8");
    expect(src).not.toMatch(/How to get an accurate figure|The accurate way/);
    expect(src).toContain("How to get a figure you can rely on");
    expect(src).not.toContain("5 to 10% below");
  });
});

describe("agents page title, intro and description (section 3.1, 10 Oct 2026)", () => {
  it("carries 'Appraisal' inside 60 characters, keeping the postcode only for a shared name", () => {
    expect(agentsPageTitle("Lane Cove", "NSW", "2066")).toBe("Real Estate Agents in Lane Cove, NSW: Fees & Free Appraisal");
    expect(agentsPageTitle("North Batemans Bay", "NSW", "2536")).toBe("North Batemans Bay Real Estate Agents: Fees & Free Appraisal");
    expect(agentsPageTitle("Lilli Pilli", "NSW", "2536", true)).toBe("Lilli Pilli 2536 Real Estate Agents: Fees & Free Appraisal");
    for (const name of ["Bondi", "Williamstown", "Glenelg North", "Port Macquarie", "Mount Martha", "Bannockburn", "Wollongong", "Castle Hill", "Mount Lofty Ranges", "Kangaroo Island Coast"]) {
      for (const keep of [false, true]) {
        const t = agentsPageTitle(name, "NSW", "2000", keep);
        expect(t.length, t).toBeLessThanOrEqual(AGENTS_TITLE_BUDGET);
        expect(t, t).toMatch(/Appraisal/);
        expect(t).not.toMatch(/House Prices|Suburb Profile/);
      }
    }
  });
  it("passes the shared-name flag through to the title", () => {
    expect(buildSuburbAgentsModel(makeSuburb(), [], [], false, { nameShared: true }).title).toBe("Real Estate Agents in Bondi 2026: Fees & Free Appraisal");
  });
  it("opens with the fee range worked on the median, or on an example price when it is withheld", () => {
    const pub = buildSuburbAgentsModel(makeSuburb(), [], []);
    expect(pub.intro).toBe("Agents in Bondi typically charge 1.8% to 2.5% of the sale price, about $77,400 to $107,500 on Bondi's median house price of $4,300,000 (NSW Valuer General, calendar 2025). Here is how to choose one and how to get a free appraisal.");
    const wh = buildSuburbAgentsModel(makeSuburb({ medianHousePrice: 0 }), [], []);
    expect(wh.intro).toBe("Agents in New South Wales typically charge 1.8% to 2.5% of the sale price, $18,000 to $25,000 on a $1,000,000 sale. Here is how to choose one in Bondi and how to get a free appraisal.");
  });
  it("keeps every description inside 160 characters and says 'appraisal'", () => {
    for (const name of ["Bondi", "North Batemans Bay", "Kangaroo Island Coastal Strip"]) {
      for (const [over, fr, st] of [[{}, {}, "NSW"], [{ medianHousePrice: 0 }, {}, "QLD"], [{ medianHousePrice: 1_234_567 }, { salesSource: "sales-abs", salesCount: null }, "TAS"]] as const) {
        const sub = { ...makeSuburb(over, fr, st), name };
        const d = buildSuburbAgentsModel(sub, [], []).description;
        expect(d.length, d).toBeLessThanOrEqual(160);
        expect(d, d).toMatch(/appraisal/);
      }
    }
  });
  it("adds the appraisal and 'paid if it doesn't sell' FAQs with sourced state rules", () => {
    const nsw = buildSuburbAgentsModel(makeSuburb(), [], []);
    const q = nsw.faqs.map((f) => f.question);
    expect(q).toContain("Is a property appraisal in Bondi free?");
    expect(q).toContain("Do real estate agents in Bondi get paid if the house doesn't sell?");
    const free = nsw.faqs.find((f) => f.question.startsWith("Is a property appraisal"))!.answer;
    expect(free).toContain("$300 to $600 (ANZ, read 11 October 2026)");
    const paid = nsw.faqs.find((f) => f.question.startsWith("Do real estate agents"))!.answer;
    expect(paid).toContain("NSW Government, Agency agreements, updated 8 July 2026");
    const good = nsw.faqs.find((f) => f.question.startsWith("How do I find"))!.answer;
    expect(good).toContain("more than 10% above the bottom");
    const vic = buildSuburbAgentsModel(makeSuburb({}, { salesSource: "sales-vic" }, "VIC"), [], []);
    expect(vic.faqs.find((f) => f.question.startsWith("How do I find"))!.answer).toContain("Property Price Statement");
    const wa = buildSuburbAgentsModel(makeSuburb({}, { salesSource: "sales-abs" }, "WA"), [], []);
    expect(wa.faqs.find((f) => f.question.startsWith("Do real estate agents"))!.answer).not.toMatch(/NSW|Queensland/);
  });
});

describe("nearby agents links (section 3.1)", () => {
  const row = (slug: string, name: string, indexable = true, state = "VIC", postcode = "3000") => ({ slug, name, state, postcode, indexable });
  it("puts the parent locality first on a directional name and links only indexable pages", () => {
    const links = pickNearbyAgentLinks(
      { slug: "kew-east-vic-3102", name: "Kew East", state: "VIC" },
      ["balwyn-vic-3103", "kew-vic-3101", "deepdene-vic-3103", "box-hill-vic-3128"],
      [row("balwyn-vic-3103", "Balwyn"), row("kew-vic-3101", "Kew"), row("deepdene-vic-3103", "Deepdene", false), row("box-hill-vic-3128", "Box Hill"), row("kew-east-vic-3102", "Kew East")],
    );
    expect(links.map((l) => l.label)).toEqual(["Real estate agents in Kew", "Real estate agents in Balwyn", "Real estate agents in Box Hill"]);
    expect(links[0].href).toBe("/suburbs/kew-vic-3101/agents");
  });
  it("links a parent to its directional variants, skips duplicate rows of its own name, and caps at eight", () => {
    const nearby = Array.from({ length: 12 }, (_, i) => `n${i}-vic-3000`);
    const rows = [row("kew-east-vic-3102", "Kew East"), row("kew-vic-3999", "Kew"), ...nearby.map((sl, i) => row(sl, `Near ${i}`))];
    const links = pickNearbyAgentLinks({ slug: "kew-vic-3101", name: "Kew", state: "VIC" }, nearby, rows);
    expect(links[0].label).toBe("Real estate agents in Kew East");
    expect(links.some((l) => l.href.includes("kew-vic-3999"))).toBe(false);
    expect(links).toHaveLength(8);
  });
  it("adds the postcode where two links share a name, and never crosses the state line", () => {
    const links = pickNearbyAgentLinks(
      { slug: "x-nsw-2000", name: "X", state: "NSW" },
      ["kingswood-nsw-2747", "kingswood-nsw-2340", "albury-nsw-2640", "wodonga-vic-3690"],
      [row("kingswood-nsw-2747", "Kingswood", true, "NSW", "2747"), row("kingswood-nsw-2340", "Kingswood", true, "NSW", "2340"), row("albury-nsw-2640", "Albury", true, "NSW", "2640"), row("wodonga-vic-3690", "Wodonga", true, "VIC", "3690")],
    );
    expect(links.map((l) => l.label)).toEqual(["Real estate agents in Kingswood 2747", "Real estate agents in Kingswood 2340", "Real estate agents in Albury"]);
  });
  it("finds the parent of a directional name", () => {
    expect(parentLocalityName("Kew East")).toBe("Kew");
    expect(parentLocalityName("North Batemans Bay")).toBe("Batemans Bay");
    expect(parentLocalityName("Westmead")).toBeNull();
    expect(parentLocalityName("East")).toBeNull();
  });
});
