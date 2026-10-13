// Valuation plan item 3: the city rollup's "busiest suburbs" table and the
// narrative built from it. Fix item 47: the rollup counts what each suburb's
// own page publishes, so the rows below carry a feed that measures a
// 12-month change (sales-nsw) where a change is expected.
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  buildCityMarket,
  cityCardFigure,
  summarizeCityMarket,
  type CityMarketRow,
} from "@/lib/services/city-market-service";
import { buildCityNarrative } from "@/lib/city-narrative";
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

describe("buildCityMarket", () => {
  const m = buildCityMarket(rows);
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
    expect(buildCityMarket([row({ annualGrowthHouse: 0 })]).medianAnnualGrowth).toBeNull();
  });
});

describe("buildCityMarket counts what the suburb pages publish (fix item 47)", () => {
  it("leaves out a median of fewer than five sales, and keeps one whose count is not reported", () => {
    const m = buildCityMarket([
      row({ slug: "two", name: "Two Sales", salesCountHouse: 2, medianHousePrice: 3_000_000 }),
      row({ slug: "four", name: "Four Sales", salesCountHouse: 4, medianHousePrice: 2_500_000 }),
      row({ slug: "five", name: "Five Sales", salesCountHouse: 5, medianHousePrice: 700_000 }),
      row({ slug: "none", name: "No Count", salesCountHouse: 0, medianHousePrice: 900_000, statsSource: "sales-vic" }),
    ]);
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
    ]);
    expect(abs.pricedSuburbCount).toBe(2);
    expect(abs.medianAnnualGrowth).toBeNull();
    expect(abs.topGrowth).toEqual([]);
    expect(abs.busiest.map((s) => s.annualGrowthHouse)).toEqual([null, null]);
    const sa = buildCityMarket([row({ statsSource: "sales-sa", annualGrowthHouse: 4.4 })]);
    expect(sa.medianAnnualGrowth).toBe(4.4);
  });
});

describe("buildCityNarrative", () => {
  const m = buildCityMarket(rows);
  const paras = buildCityNarrative(perth, m, new Date("2026-09-17T00:00:00Z"));
  it("writes four sourced paragraphs from the rollup", () => {
    expect(paras).toHaveLength(4);
    expect(paras[0]).toContain("median house price across Greater Perth is $800,000");
    expect(paras[0]).toContain("6 suburb medians");
    expect(paras[1]).toMatch(/typical Perth suburb rose by/);
    expect(paras[1]).toContain("Alpha recorded +12.0%");
    expect(paras[2]).toContain("most affordable is Bravo at $600,000");
    expect(paras[2]).toContain("Alpha (300), Bravo (120), Foxtrot (20)");
    expect(paras[3]).toMatch(/^Source: suburb medians from the WA valuer-general/);
    expect(paras[3]).toContain("last refreshed August 2026");
    expect(paras[3]).toContain("page generated 17 September 2026");
    expect(paras[3]).toContain("Only the 6 of 7 tracked suburbs whose own page publishes a median contribute to price figures");
  });
  it("says nothing about growth where none is measured", () => {
    const flat = buildCityNarrative(perth, buildCityMarket(rows.map((r) => ({ ...r, statsSource: r.statsSource === "seed" ? "seed" : "sales-abs", salesCountHouse: 0 }))), new Date("2026-09-17T00:00:00Z"));
    expect(flat).toHaveLength(3);
    expect(flat.join(" ")).not.toMatch(/twelve months|rose|fell|fastest/);
  });
  it("never recommends", () => {
    for (const p of paras) expect(p).not.toMatch(/should buy|should sell|good time|recommend/i);
  });
  it("returns nothing for a city with no priced suburbs", () => {
    expect(buildCityNarrative(perth, buildCityMarket([row({ statsSource: "seed" })]))).toEqual([]);
  });
});

describe("the /property-market hub cards", () => {
  // 13 Oct 2026: every card printed "—" while each city page printed its
  // median. The hub was a static ISR page whose DB-free build render (no
  // figures) was served for a day after every deploy.
  it("print the city median and growth from the same rollup as the city page", () => {
    const summary = summarizeCityMarket(buildCityMarket(rows));
    expect(summary).toEqual({ pricedSuburbCount: 6, medianHousePrice: 800_000, medianAnnualGrowth: 6.5 });
    expect(cityCardFigure(summary)).toEqual({ kind: "median", price: "$800K", growth: 6.5 });
    // A summary survives unstable_cache's JSON round trip unchanged.
    expect(JSON.parse(JSON.stringify(summary))).toEqual(summary);
  });
  it("say plainly that a city has no verified median, and never print a figure the suburb pages withhold", () => {
    const withheld = buildCityMarket([
      row({ slug: "seed", statsSource: "seed", medianHousePrice: 2_000_000 }),
      row({ slug: "thin", salesCountHouse: 2, medianHousePrice: 3_000_000 }),
    ]);
    expect(withheld.suburbCount).toBe(2);
    const figure = cityCardFigure(summarizeCityMarket(withheld));
    expect(figure).toEqual({
      kind: "none",
      label: "No verified median yet",
      note: "Too few verified sales to publish a city figure",
    });
    expect(JSON.stringify(figure)).not.toMatch(/\$|—/);
    expect(cityCardFigure(summarizeCityMarket(buildCityMarket([]))).kind).toBe("none");
  });
  it("render on request from cached summaries, not from a build-time placeholder", () => {
    const page = fs.readFileSync("src/app/(marketing)/property-market/page.tsx", "utf8");
    expect(page).toContain('export const dynamic = "force-dynamic";');
    expect(page).not.toMatch(/export const revalidate/);
    expect(page).not.toContain("phase-production-build");
    expect(page).toContain("cityCardFigure(summary)");
    // The data cache outlives a deploy; the key moves with each one.
    expect(page).toContain('["property-market-hub:v1", NOT_PLACES_VERSION, process.env.VERCEL_DEPLOYMENT_ID ?? "local"]');
    expect(page).not.toMatch(/:\s*"—"/);
  });
});
