// Content gap item 6: the region (LGA) house-prices template. The rollup
// is the city rollup over the region's suburbs; these tests cover the pure
// helpers around it and the narrative's region wording.
import { describe, expect, it } from "vitest";
import { buildCityMarket, type CityMarketRow } from "@/lib/services/city-market-service";
import { buildCityNarrative } from "@/lib/city-narrative";
import {
  buildRegionFaqs,
  regionDescription,
  regionDisplayName,
  regionEyebrow,
  regionHasPrices,
  regionTitle,
  rollupCovers,
} from "@/lib/region-market";
import { topSuburbsAmong, TOP_SUBURBS } from "@/lib/data/top-suburbs";

function row(over: Partial<CityMarketRow>): CityMarketRow {
  return {
    slug: "x", name: "X", postcode: "3220", medianHousePrice: 700_000, medianUnitPrice: 450_000, medianRentHouse: 520,
    annualGrowthHouse: 4, population: 6000, salesCountHouse: 40, statsSource: "sales-vic", salesUpdatedAt: new Date("2026-08-01T00:00:00Z"), ...over,
  };
}
/** The aggregate rules on a handful of rows: a floor of one suburb (tests/lib/city-market.test.ts covers the floor). */
const ANY = { minSuburbs: 1 };
const geelongRows: CityMarketRow[] = [
  row({ slug: "belmont-vic-3216", name: "Belmont", postcode: "3216", salesCountHouse: 210, medianHousePrice: 720_000, annualGrowthHouse: 2.5 }),
  row({ slug: "newtown-vic-3220", name: "Newtown", salesCountHouse: 150, medianHousePrice: 1_150_000, annualGrowthHouse: 1.2 }),
  row({ slug: "corio-vic-3214", name: "Corio", postcode: "3214", salesCountHouse: 190, medianHousePrice: 480_000, annualGrowthHouse: 6.1 }),
  row({ slug: "lara-vic-3212", name: "Lara", postcode: "3212", salesCountHouse: 120, medianHousePrice: 690_000, annualGrowthHouse: 3.0 }),
  row({ slug: "anakie-vic-3213", name: "Anakie", postcode: "3213", population: 300, salesCountHouse: 3, medianHousePrice: 1_000_000 }), // three sales: no median is published
  row({ slug: "seed-vic-3200", name: "Seeded", statsSource: "seed", medianHousePrice: 2_000_000 }),                                    // untrusted
];

describe("regionDisplayName", () => {
  it("drops 'Greater' only for the councils searchers drop it from", () => {
    expect(regionDisplayName("Greater Geelong")).toBe("Geelong");
    expect(regionDisplayName("Greater Bendigo")).toBe("Bendigo");
    expect(regionDisplayName("Greater Hume")).toBe("Greater Hume"); // would collide with Melbourne's Hume
    expect(regionDisplayName("Newcastle")).toBe("Newcastle");
  });
  it("puts the council name in the eyebrow when it differs", () => {
    expect(regionEyebrow("Greater Geelong", "VIC", 58)).toBe("Greater Geelong (Geelong) · VIC · 58 suburbs tracked");
    expect(regionEyebrow("Newcastle", "NSW", 41)).toBe("Newcastle · NSW · 41 suburbs tracked");
  });
});

describe("titles and descriptions", () => {
  const priced = buildCityMarket(geelongRows, ANY);
  const unpriced = buildCityMarket([row({ statsSource: "seed" }), row({ slug: "y", medianHousePrice: 0 })], ANY);
  it("leads with house prices only where the rollup has a verified median", () => {
    expect(regionHasPrices(priced)).toBe(true);
    expect(regionHasPrices(unpriced)).toBe(false);
    expect(regionTitle("Geelong", true)).toBe("Geelong House Prices & Property Market 2026: Median, Growth, Suburbs");
    expect(regionTitle("Anakie", false)).toBe("Anakie Property Market 2026: Suburbs, Prices & Schools");
  });
  it("never puts a dollar figure in a title, and prints one in the description only behind the gate", () => {
    expect(regionTitle("Geelong", true)).not.toMatch(/\$/);
    expect(regionDescription("Geelong", "VIC", priced, 58)).toContain("typical suburb median $705,000 across 4 suburbs");
    expect(regionDescription("Geelong", "VIC", priced, 58)).not.toMatch(/the median house price in/);
    expect(regionDescription("Geelong", "VIC", priced, 58).length).toBeLessThanOrEqual(160);
    expect(regionDescription("Anakie", "VIC", unpriced, 2)).not.toMatch(/\$/);
  });
  it("promises growth in a description only where the rollup holds one", () => {
    // Land Victoria's medians come without a 12-month change (fix item 47).
    expect(priced.medianAnnualGrowth).toBeNull();
    expect(rollupCovers(priced)).toBe("the most affordable and the highest-priced");
    expect(regionDescription("Geelong", "VIC", priced, 58)).not.toMatch(/growth|fastest/);
    const nsw = buildCityMarket(geelongRows.map((r) => ({ ...r, statsSource: r.statsSource === "seed" ? "seed" : "sales-nsw" })), ANY);
    expect(nsw.medianAnnualGrowth).toBe(2.8);
    // growth is named only where held; a long description drops the list rather than pass 160 characters
    expect(rollupCovers(nsw)).toBe("twelve-month growth, the fastest-rising and most affordable");
    expect(regionDescription("Newcastle", "NSW", nsw, 41)).toBe("Newcastle house prices 2026: typical suburb median $705,000 across 4 suburbs, and house prices by suburb.");
    expect(regionDescription("Bega Valley", "NSW", nsw, 41).length).toBeLessThanOrEqual(160);
  });
});

describe("buildRegionFaqs", () => {
  it("answers median, growth, fastest and cheapest from the gated rollup", () => {
    const nswRows = geelongRows.map((r) => ({ ...r, statsSource: r.statsSource === "seed" ? "seed" : "sales-nsw" }));
    const faqs = buildRegionFaqs("Geelong", "VIC", buildCityMarket(nswRows, ANY));
    expect(faqs.map((f) => f.question)).toEqual([
      "What is the median house price in Geelong?",
      "Are Geelong house prices rising?",
      "Which Geelong suburbs are growing fastest?",
      "What are the cheapest suburbs in Geelong?",
    ]);
    expect(faqs[0].answer).toContain("$705,000");
    expect(faqs[0].answer).toContain("the median of 4 suburb medians"); // Anakie's three sales are not a median
    expect(faqs[0].answer).toContain("The typical suburb median house price across the Geelong region");
    // the source line is the state's (priceSourceLine), never "state valuers-general"
    expect(faqs[0].answer).toContain("Prices are Land Victoria's quarterly suburb medians.");
    expect(faqs[3].answer).toContain("Corio");
  });
  it("asks nothing about growth where the feed measures none", () => {
    const faqs = buildRegionFaqs("Geelong", "VIC", buildCityMarket(geelongRows, ANY));
    expect(faqs.map((f) => f.question)).toEqual([
      "What is the median house price in Geelong?",
      "What are the cheapest suburbs in Geelong?",
    ]);
  });
  it("is empty when nothing clears the gate", () => {
    expect(buildRegionFaqs("Anakie", "VIC", buildCityMarket([row({ statsSource: "seed" })], ANY))).toEqual([]);
  });
});

describe("buildCityNarrative for a region", () => {
  const m = buildCityMarket(geelongRows, ANY);
  const paras = buildCityNarrative({ name: "Geelong", state: "VIC" }, m, new Date("2026-09-20T00:00:00Z"), {
    area: "the Geelong region",
    unit: "region",
  });
  it("names the region, not a Greater capital, and counts the busiest table honestly", () => {
    expect(paras[0]).toContain("typical suburb median house price across the Geelong region is $705,000");
    expect(paras[0]).not.toContain("Greater");
    // Victoria's feed measures no 12-month change, so there is no growth paragraph.
    expect(paras).toHaveLength(3);
    expect(paras[1]).toContain("gap across the one region");
    expect(paras[1]).toContain("the table below lists the 4 busiest with their medians");
    expect(paras[2]).toMatch(/^Source: Prices are Land Victoria's quarterly suburb medians\./);
  });
  it("leaves the capital-city wording unchanged when no options are passed", () => {
    const city = buildCityNarrative({ name: "Melbourne", state: "VIC" }, m, new Date("2026-09-20T00:00:00Z"));
    expect(city[0]).toContain("across Greater Melbourne");
    expect(city[1]).toContain("across the one city");
  });
});

describe("topSuburbsAmong", () => {
  it("returns only suburbs in the given set, in impressions order", () => {
    const sample = TOP_SUBURBS.slice(0, 30);
    const picked = new Set(sample.filter((_, i) => i % 3 === 0).map((s) => s.slug));
    const out = topSuburbsAmong(picked, 5);
    expect(out.length).toBeLessThanOrEqual(5);
    expect(out.every((s) => picked.has(s.slug))).toBe(true);
    expect(out.map((s) => s.slug)).toEqual(sample.filter((s) => picked.has(s.slug)).slice(0, 5).map((s) => s.slug));
  });
  it("returns nothing for an empty set", () => {
    expect(topSuburbsAmong([])).toEqual([]);
  });
});
