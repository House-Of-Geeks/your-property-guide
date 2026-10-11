// Valuation plan item 3: the city rollup's "busiest suburbs" table and the
// narrative built from it. Fix item 47: the rollup counts what each suburb's
// own page publishes, so the rows below carry a feed that measures a
// 12-month change (sales-nsw) where a change is expected.
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { BOND_RENT_SOURCES, bondRentMap, buildCityMarket, cityRent, mainSalesSource, type BondRent, type CityMarketRow } from "@/lib/services/city-market-service";
import { buildCityNarrative, cityMarketDescription, cityMarketHeading, cityMarketLede, cityMarketTitle, cityMedianFaq, rentCard, typicalMedianLabel } from "@/lib/city-narrative";
import { OFFICIAL_CITY_MEDIANS, officialCityMedian, officialMedianSentence } from "@/lib/data/official-city-medians";
import { coverageShortfall } from "@/lib/median-coverage";
import { CAPITAL_CITIES } from "@/lib/utils/metro";

function row(over: Partial<CityMarketRow>): CityMarketRow {
  return {
    slug: "x", name: "X", postcode: "6000", medianHousePrice: 800_000, medianUnitPrice: 450_000, medianRentHouse: 600,
    annualGrowthHouse: 5, population: 5000, salesCountHouse: 50, statsSource: "sales-nsw", salesUpdatedAt: new Date("2026-08-01T00:00:00Z"), ...over,
  };
}
const rows: CityMarketRow[] = [
  row({ slug: "a", name: "Alpha", salesCountHouse: 300, medianHousePrice: 900_000, annualGrowthHouse: 12 }),
  row({ slug: "b", name: "Bravo", salesCountHouse: 120, medianHousePrice: 600_000, annualGrowthHouse: 3 }),
  row({ slug: "c", name: "Charlie", salesCountHouse: 0, population: 40_000, medianHousePrice: 1_500_000, annualGrowthHouse: 8 }),
  row({ slug: "d", name: "Delta", salesCountHouse: 0, population: 900, medianHousePrice: 400_000 }),           // micro-locality, excluded from lists
  row({ slug: "e", name: "Echo", statsSource: "seed", medianHousePrice: 2_000_000 }),                            // untrusted source, excluded from prices
  row({ slug: "f", name: "Foxtrot", salesCountHouse: 20, annualGrowthHouse: 90 }),                              // implausible growth → null
  row({ slug: "g", name: "Golf", salesCountHouse: 10, annualGrowthHouse: 0 }),                                   // 0 = no prior period → null
];
const perth = CAPITAL_CITIES.find((c) => c.slug === "perth")!;
/** The aggregate rules on a handful of rows: a floor of one suburb (the floor has its own tests below). */
const ANY = { minSuburbs: 1 };

describe("buildCityMarket", () => {
  const m = buildCityMarket(rows, ANY);
  it("orders the busiest table by sales count, then population, and skips micro-localities and untrusted sources", () => {
    expect(m.busiest.map((s) => s.name)).toEqual(["Alpha", "Bravo", "Foxtrot", "Golf", "Charlie"]);
    expect(m.busiest[0].salesCountHouse).toBe(300);
    expect(m.totalSalesHouse).toBe(450); // Delta and Charlie report no count; Echo is untrusted
  });
  it("keeps the existing rollup honest: median of medians over priced rows only", () => {
    expect(m.pricedSuburbCount).toBe(6);
    expect(m.medianHousePrice).toBe(800_000);
    expect(m.busiest.find((s) => s.name === "Foxtrot")?.annualGrowthHouse).toBeNull();
  });
  it("treats a growth figure of exactly 0 as unknown, the way the suburb snapshot does", () => {
    expect(m.busiest.find((s) => s.name === "Golf")?.annualGrowthHouse).toBeNull();
    expect(m.medianAnnualGrowth).toBe(6.5); // median of 12, 3, 8, 5 (Golf's 0 and Foxtrot's 90 excluded)
    expect(buildCityMarket([row({ annualGrowthHouse: 0 })], ANY).medianAnnualGrowth).toBeNull();
  });
});

describe("buildCityMarket counts what the suburb pages publish (fix item 47)", () => {
  it("leaves out a median of fewer than five sales, and keeps one whose count is not reported", () => {
    const m = buildCityMarket([
      row({ slug: "two", name: "Two Sales", salesCountHouse: 2, medianHousePrice: 3_000_000 }),
      row({ slug: "four", name: "Four Sales", salesCountHouse: 4, medianHousePrice: 2_500_000 }),
      row({ slug: "five", name: "Five Sales", salesCountHouse: 5, medianHousePrice: 700_000 }),
      row({ slug: "none", name: "No Count", salesCountHouse: 0, medianHousePrice: 900_000, statsSource: "sales-vic" }),
    ], ANY);
    expect(m.suburbCount).toBe(4);
    expect(m.pricedSuburbCount).toBe(2);
    expect(m.medianHousePrice).toBe(800_000);
    expect(m.premium.map((s) => s.name)).toEqual(["No Count", "Five Sales"]);
    expect(m.totalSalesHouse).toBe(5);
  });
  it("takes a 12-month change only from a feed that measures one", () => {
    const abs = buildCityMarket([
      row({ slug: "a", name: "Alpha", statsSource: "sales-abs", salesCountHouse: 0, annualGrowthHouse: 6 }),
      row({ slug: "b", name: "Bravo", statsSource: "sales-vic", salesCountHouse: 0, annualGrowthHouse: 7.2 }),
    ], ANY);
    expect(abs.pricedSuburbCount).toBe(2);
    expect(abs.medianAnnualGrowth).toBeNull();
    expect(abs.topGrowth).toEqual([]);
    expect(abs.busiest.map((s) => s.annualGrowthHouse)).toEqual([null, null]);
    const sa = buildCityMarket([row({ statsSource: "sales-sa", annualGrowthHouse: 4.4 })], ANY);
    expect(sa.medianAnnualGrowth).toBe(4.4);
  });
});

describe("buildCityNarrative", () => {
  const m = buildCityMarket(rows, ANY);
  const paras = buildCityNarrative(perth, m, new Date("2026-09-17T00:00:00Z"));
  it("writes four sourced paragraphs from the rollup", () => {
    expect(paras).toHaveLength(4);
    expect(paras[0]).toContain("The typical suburb median house price across Greater Perth is $800,000: the median of 6 suburb medians");
    expect(paras[0]).not.toMatch(/The median house price/);
    expect(paras[1]).toMatch(/typical Perth suburb rose by/);
    expect(paras[1]).toContain("Alpha recorded +12.0%");
    expect(paras[2]).toContain("most affordable is Bravo at $600,000");
    expect(paras[2]).toContain("Alpha (300), Bravo (120), Foxtrot (20)");
    expect(paras[3]).toMatch(/^Source: Prices for Western Australia are ABS statistical-area \(SA2\) medians/);
    expect(paras[3]).not.toMatch(/valuer-general or state sales records/);
    expect(paras[3]).toContain("last refreshed August 2026");
    expect(paras[3]).toContain("page generated 17 September 2026");
    expect(paras[3]).toContain("Only the 6 of 7 tracked suburbs whose own page publishes a median contribute to price figures");
  });
  it("says nothing about growth where none is measured", () => {
    const flat = buildCityNarrative(perth, buildCityMarket(rows.map((r) => ({ ...r, statsSource: r.statsSource === "seed" ? "seed" : "sales-abs", salesCountHouse: 0 })), ANY), new Date("2026-09-17T00:00:00Z"));
    expect(flat).toHaveLength(3);
    expect(flat.join(" ")).not.toMatch(/twelve months|rose|fell|fastest/);
  });
  it("never recommends", () => {
    for (const p of paras) expect(p).not.toMatch(/should buy|should sell|good time|recommend/i);
  });
  it("returns nothing for a city with no priced suburbs", () => {
    expect(buildCityNarrative(perth, buildCityMarket([row({ statsSource: "seed" })], ANY))).toEqual([]);
  });
});

// ── Review of 10 Oct 2026, suburbs-market 0.3; renting-landlords 0.7 ──────────

/** `count` established suburbs, the first `priced` of them with a published median. */
function city(count: number, priced: number, over: (i: number) => Partial<CityMarketRow> = () => ({})): CityMarketRow[] {
  return Array.from({ length: count }, (_, i) =>
    row({ slug: `s${i}`, name: `Suburb ${i + 1}`, postcode: String(6100 + i), statsSource: i < priced ? "sales-abs" : "seed", salesCountHouse: 0, medianHousePrice: 600_000 + i * 10_000, annualGrowthHouse: 0, ...over(i) }),
  );
}
const adelaide = CAPITAL_CITIES.find((c) => c.slug === "adelaide")!;
const brisbane = CAPITAL_CITIES.find((c) => c.slug === "brisbane")!;

describe("the coverage floor on city and region figures", () => {
  it("prints no typical median, unit median, change or ranked list from a thin pool (Brisbane's 23)", () => {
    const thin = buildCityMarket(city(200, 23));
    expect(thin.coverage).toEqual({ pool: 23, suburbs: 200 });
    expect(thin.medianHousePrice).toBeNull();
    expect(thin.medianUnitPrice).toBeNull();
    expect(thin.mostAffordable).toEqual([]);
    expect(thin.premium).toEqual([]);
    expect(thin.topGrowth).toEqual([]);
    // the suburbs' own published medians are still listed
    expect(thin.busiest).toHaveLength(20);
    expect(buildCityNarrative(brisbane, thin)).toEqual([]);
  });
  it("prints them above the floor", () => {
    const wide = buildCityMarket(city(200, 60));
    expect(wide.medianHousePrice).toBe(895_000);
    expect(wide.mostAffordable).toHaveLength(8);
    // a region needs ten: Moreton Bay's 5 stay out
    expect(buildCityMarket(city(40, 5), { minSuburbs: 10 }).medianHousePrice).toBeNull();
    expect(buildCityMarket(city(40, 12), { minSuburbs: 10 }).medianHousePrice).not.toBeNull();
  });
  it("leaves the CBD cores and apartment markets out of the cheapest", () => {
    const rows = city(100, 40, (i) =>
      i === 0 ? { name: "Melbourne", state: "VIC", postcode: "3000", medianHousePrice: 381_000, statsSource: "sales-vic" }
      : i === 1 ? { name: "Travancore", state: "VIC", postcode: "3032", medianHousePrice: 477_000, statsSource: "sales-vic" }
      : i === 2 ? { name: "Flats", state: "VIC", postcode: "3031", medianHousePrice: 450_000, statsSource: "sales-vic" }
      : { state: "VIC", statsSource: i < 40 ? "sales-vic" : "seed" },
    );
    const rents = new Map<string, BondRent>([["s2", { slug: "s2", source: "rental-vic", period: "2025-Q3", periodDate: new Date("2025-09-30T00:00:00Z"), house: 600, all: null }]]);
    const m = buildCityMarket(rows, { rents });
    expect(m.mostAffordable.map((s) => s.name)).not.toContain("Melbourne");
    expect(m.mostAffordable.map((s) => s.name)).not.toContain("Travancore");
    expect(m.mostAffordable.map((s) => s.name)).not.toContain("Flats"); // $600 a week on $450,000 is 6.9%
    expect(m.mostAffordable[0].name).toBe("Suburb 4");
  });
  it("the region page and the city page read the gated rollup", () => {
    const region = fs.readFileSync("src/app/(marketing)/regions/[slug]/page.tsx", "utf8");
    expect(region).toContain("getRegionRollup(region.region)");
    expect(region).not.toContain("getRegionMarket");
    expect(region).not.toMatch(/The median house price in|label="Median house"|weekly, across tracked suburbs/);
    expect(region).toContain("typical suburb median of {formatPriceFull(market.medianHousePrice)}");
    const page = fs.readFileSync("src/app/(marketing)/property-market/[city]/page.tsx", "utf8");
    expect(page).not.toMatch(/The median house price in|label="Median house"|weekly, across tracked suburbs|state valuers-general/);
    expect(page).toContain("{priceSourceLine(city.state)}");
    expect(fs.readFileSync("src/app/(marketing)/property-market/page.tsx", "utf8")).not.toMatch(/Updated July 2026|\u2014 City/);
  });
});

describe("rents come from bond data only", () => {
  const rows = city(100, 40);
  const bond = (slug: string, over: Partial<BondRent>): [string, BondRent] => [slug, { slug, source: "rental-wa", period: "2026-Q3", periodDate: new Date("2026-09-30T00:00:00Z"), house: null, all: 640, ...over }];
  it("reads no census proxy and no NSW postcode rent", () => {
    expect([...BOND_RENT_SOURCES]).toEqual(["rental-vic", "rental-sa", "rental-qld", "rental-wa"]);
    const m = bondRentMap([
      { slug: "a", source: "abs-census-2021", period: "2021", periodDate: new Date("2021-08-10T00:00:00Z"), house: 350, unit: null, all: null },
      { slug: "b", source: "rental-nsw", period: "2026-Q2", periodDate: new Date("2026-06-30T00:00:00Z"), house: 850, unit: null, all: null },
      { slug: "c", source: "rental-wa", period: "2026-Q3", periodDate: new Date("2026-09-30T00:00:00Z"), house: null, unit: null, all: 900 },
      { slug: "d", source: "rental-qld", period: "2026-Q2", periodDate: new Date("2026-06-30T00:00:00Z"), house: 620, unit: 480, all: null },
    ]);
    expect([...m.keys()]).toEqual(["c", "d"]);
    expect(m.get("c")).toMatchObject({ house: null, all: 900 });
    expect(m.get("d")).toMatchObject({ house: 620, all: null });
  });
  it("is a typical rent across all dwellings for WA, labelled so, for the newest quarter", () => {
    const rents = new Map(rows.slice(0, 30).map((r, i) => bond(r.slug, { all: 600 + i * 10 })));
    rents.set(...bond("s30", { period: "2026-Q2", periodDate: new Date("2026-06-30T00:00:00Z"), all: 5000 }));
    const rent = cityRent(rows, rents, 100, 30)!;
    expect(rent).toEqual({ kind: "all", weekly: 745, suburbs: 30, source: "rental-wa", period: "2026-Q3" });
    expect(rentCard(rent)).toEqual({ label: "Typical rent, all dwellings", value: "$745/wk", sub: "WA rental bond data, July to September 2026, 30 suburbs" });
  });
  it("is withheld below the floor and without a feed", () => {
    const few = new Map(rows.slice(0, 10).map((r) => bond(r.slug, {})));
    expect(cityRent(rows, few, 100, 30)).toBeNull();
    expect(cityRent(rows, undefined, 100, 30)).toBeNull();
    expect(buildCityMarket(rows).rent).toBeNull();
  });
  it("prints a house rent with its feed and quarter in the narrative", () => {
    const rents = new Map(rows.slice(0, 40).map((r) => bond(r.slug, { source: "rental-qld", house: 700, all: null, period: "2026-Q2", periodDate: new Date("2026-06-30T00:00:00Z") })));
    const m = buildCityMarket(rows, { rents });
    expect(m.rent).toMatchObject({ kind: "house", weekly: 700, suburbs: 40 });
    const paras = buildCityNarrative(brisbane, m, new Date("2026-10-11T00:00:00Z"));
    expect(paras[0]).toContain("The typical suburb weekly house rent is $700: the median of 40 suburbs' latest bond-data medians (Queensland RTA bond data, April to June 2026).");
    expect(paras[paras.length - 1]).toContain("Rents: Queensland RTA bond data, April to June 2026.");
  });
});

describe("what the city page says about its median", () => {
  const wide = { ...buildCityMarket(city(300, 267, (i) => ({ state: "SA", statsSource: i < 267 ? "sales-sa" : "seed" }))), salesPeriod: "the latest published quarter (updated July 2026)" };
  const thin = buildCityMarket(city(200, 23));
  const off = officialCityMedian("adelaide")!;
  it("holds only verified official figures, each with its source, period and date read", () => {
    expect(Object.keys(OFFICIAL_CITY_MEDIANS)).toEqual(["adelaide"]);
    expect(off).toMatchObject({ area: "Metropolitan Adelaide", medianHousePrice: 975_000, period: "the June 2026 quarter", source: "SA Valuer-General", readOn: "2026-10-11" });
    expect(off.url).toMatch(/^https:\/\/valuergeneral\.sa\.gov\.au\//);
    expect(officialMedianSentence(off)).toBe("Metropolitan Adelaide's median house sale price was $975,000 in the June 2026 quarter (SA Valuer-General)");
    expect(officialCityMedian("melbourne")).toBeNull();
  });
  it("calls our figure the typical suburb median, never the median house price in the city", () => {
    expect(typicalMedianLabel(wide)).toBe("typical suburb median (267 suburbs)");
    expect(cityMarketLede(adelaide, wide, off, "")).toBe(
      "Metropolitan Adelaide's median house sale price was $975,000 in the June 2026 quarter (SA Valuer-General); the typical suburb median we publish across 267 Greater Adelaide suburbs is $1,930,000, for the latest published quarter (updated July 2026).",
    );
    const melb = cityMarketLede({ name: "Melbourne" }, wide, null, "");
    expect(melb).toMatch(/^The typical suburb median house price across Greater Melbourne is \$1,930,000: the median of 267 suburb medians/);
    const shortfall = coverageShortfall(thin.coverage, "Greater Brisbane");
    expect(cityMarketLede(brisbane, thin, null, shortfall)).toBe(`We do not publish a typical median for Greater Brisbane yet. ${shortfall}`);
    for (const t of [cityMarketLede(adelaide, wide, off, ""), melb, cityMedianFaq(adelaide, wide, off, "").answer, cityMedianFaq(brisbane, thin, null, shortfall).answer]) {
      expect(t).not.toMatch(/The median house price in|\u2014/);
    }
    expect(cityMedianFaq(brisbane, thin, null, shortfall).answer).toContain("We do not publish a typical suburb median for Greater Brisbane yet.");
    expect(cityMedianFaq(brisbane, thin, null, shortfall).answer).not.toMatch(/\$/);
  });
  it("descriptions fit 160 characters and print a figure only behind the floor", () => {
    for (const [m, o] of [[wide, off], [wide, null], [thin, null], [thin, off]] as const) {
      for (const c of CAPITAL_CITIES) {
        const d = cityMarketDescription(c, m, o, 2026);
        expect(d.length, d).toBeLessThanOrEqual(160);
        if (!m.medianHousePrice) expect(d, d).not.toMatch(/\$/);
      }
    }
    expect(cityMarketDescription(adelaide, wide, off, 2026)).toBe("Adelaide house prices 2026: Metropolitan Adelaide median $975,000 (SA Valuer-General, June 2026 quarter); typical suburb median $1,930,000 across 267 suburbs.");
  });
  it("names the feed behind the medians", () => {
    expect(mainSalesSource(city(10, 6, (i) => ({ statsSource: i < 4 ? "sales-sa" : i < 6 ? "sales-abs" : "seed" })))).toBe("sales-sa");
    expect(mainSalesSource(city(3, 0))).toBeNull();
  });
});

describe("the city title switches when there is no median (review of 10 Oct 2026, 0.7)", () => {
  it("leads with house prices only over a printed median, in 60 characters or fewer", () => {
    for (const c of CAPITAL_CITIES) {
      for (const m of [{ medianHousePrice: 1_000_000 }, { medianHousePrice: null }]) {
        const t = cityMarketTitle(c, m, 2026);
        expect(t.length, t).toBeLessThanOrEqual(60);
        expect(t).not.toMatch(/\u2014|\$/);
      }
    }
    expect(cityMarketTitle({ name: "Melbourne" }, { medianHousePrice: 1_000_000 }, 2026)).toBe("Melbourne House Prices 2026: Medians by Suburb & Market Data");
    expect(cityMarketTitle({ name: "Sydney" }, { medianHousePrice: null }, 2026)).toBe("Sydney Property Market 2026: Suburbs & Market Data");
    expect(cityMarketHeading({ name: "Sydney" }, { medianHousePrice: null })).toBe("Sydney property market");
    const page = fs.readFileSync("src/app/(marketing)/property-market/[city]/page.tsx", "utf8");
    expect(page).toContain("const title = cityMarketTitle(city, market, CURRENT_YEAR);");
    expect(page).not.toContain("Median, Growth, Suburbs");
  });
});
