// Fix item 15: the yield tables and FAQ come from gated data and say what they leave out.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CITY_YIELDS, TOP_YIELD_BY_STATE, YIELD_BENCHMARKS_AS_OF } from "../../src/lib/data/yield-benchmarks";
import { yieldFaqs } from "../../src/lib/data/yield-faqs";

describe("yield benchmarks data", () => {
  it("publishes plausible capital-city medians and withholds the rest with a reason", () => {
    expect(YIELD_BENCHMARKS_AS_OF).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    for (const c of CITY_YIELDS) {
      if (c.withheld) { expect(c.houseYield).toBeNull(); expect(c.unitYield).toBeNull(); expect(c.withheld.length).toBeGreaterThan(10); continue; }
      expect(c.houseYield).not.toBeNull();
      expect(c.houseYield as number).toBeGreaterThan(1.5);
      expect(c.houseYield as number).toBeLessThan(7);
      expect(c.houseSuburbs).toBeGreaterThanOrEqual(50);
      if (c.unitYield !== null) { expect(c.unitYield).toBeGreaterThan(2); expect(c.unitYield).toBeLessThan(8); }
    }
    expect(CITY_YIELDS.filter((c) => !c.withheld).map((c) => c.slug)).toEqual(["sydney", "melbourne", "brisbane"]);
  });
  it("ranks only states whose rents are published for the suburb itself, five per state, no duplicates", () => {
    expect(TOP_YIELD_BY_STATE.map((s) => s.state)).toEqual(["VIC", "QLD"]);
    for (const st of TOP_YIELD_BY_STATE) {
      expect(st.top).toHaveLength(5);
      expect(new Set(st.top.map((t) => t.name)).size).toBe(5);
      for (const t of st.top) { expect(t.houseYield).toBeLessThanOrEqual(12); expect(t.rent).toBeGreaterThan(200); expect(t.price).toBeGreaterThan(150_000); }
    }
  });
});

describe("yield FAQ", () => {
  it("answers the four People-also-ask questions with the table's figures", () => {
    const f = yieldFaqs();
    expect(f.map((q) => q.question)).toEqual(["What is a good rental yield in Australia?", "Is 4.5% rental yield good?", "Is 3% rental yield bad?", "What does a 7% rental yield mean?"]);
    for (const q of f) { expect(q.answer).toMatch(/\d(\.\d)?%/); expect(q.answer.split(/\s+/).length).toBeGreaterThanOrEqual(40); }
    expect(f[0].answer).toContain("Sydney");
  });
  it("leaves the calculator page's URL, title and schema name unchanged", () => {
    const src = readFileSync("src/app/(marketing)/rental-yield-calculator/page.tsx", "utf8");
    expect(src).toContain('title: "Rental Yield Calculator"');
    expect(src).toContain('schemaName: "Rental Yield Calculator"');
    expect(src).toContain('slug: "rental-yield-calculator"');
    // the lookup and the tables sit below the calculator, inside the explainer
    expect(src.indexOf("calculator={<RentalYieldCalculator />}")).toBeLessThan(src.indexOf("<GuideSuburbSearch"));
  });
});
