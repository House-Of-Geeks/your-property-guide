// Commercial intent review (30 Sep 2026), section 3.3: the rental yield
// engine is shared by the widget and the page's worked example; the "good
// yield" table and PAA answers come from the gated data file and say what
// they leave out.
import { describe, expect, it } from "vitest";
import { WORKED_EXAMPLE, computeRentalYield, workedExample } from "@/lib/rental-yield-calc";
import { YIELD_AREAS, YIELD_BENCHMARKS_AS_OF, YIELD_SALES_SOURCES, YIELD_WITHHELD } from "@/lib/data/yield-benchmarks";
import { netYieldAtGross, pct, yieldArea, yieldFaqs, yieldFeedDates } from "@/lib/yield-benchmarks";
import { calculateStampDuty } from "@/lib/utils/stamp-duty";
import { YIELD_RANKED_STATES } from "@/lib/ranking-notes";

describe("computeRentalYield", () => {
  it("works gross on the price and net on the cost base, matching the widget's former inline maths", () => {
    const r = computeRentalYield({
      purchasePrice: 600_000, weeklyRent: 500, stampDuty: 0, legalFees: 2_000, buildingInspection: 600,
      councilRates: 2_000, waterRates: 800, insurance: 2_500, managementPct: 8, maintenancePct: 0.5,
      loanAmount: 0, loanRate: 6.5, loanTermYears: 30,
    })!;
    expect(r.annualRentalIncome).toBe(26_000);
    expect(r.grossYield).toBe(4.33);
    expect(r.managementCost).toBe(2_080);
    expect(r.maintenanceCost).toBe(3_000);
    expect(r.totalAnnualCosts).toBe(2_000 + 800 + 2_500 + 2_080 + 3_000);
    expect(r.totalPurchaseCosts).toBe(2_600);
    expect(r.totalCostBase).toBe(602_600);
    expect(r.annualNetIncome).toBe(26_000 - 10_380);
    expect(r.netYield).toBe(Math.round(((26_000 - 10_380) / 602_600) * 10_000) / 100);
    expect(r.annualLoanRepayments).toBe(0);
    expect(r.weeklyCashFlow).toBe(Math.round((26_000 - 10_380) / 52));
  });
  it("adds loan repayments to the cash flow only when a loan and a rate are given", () => {
    const base = { ...WORKED_EXAMPLE, loanAmount: 480_000, loanRate: 6.5, loanTermYears: 30 };
    const r = computeRentalYield(base)!;
    expect(r.annualLoanRepayments).toBeGreaterThan(36_000);
    expect(r.annualLoanRepayments).toBeLessThan(37_000);
    expect(r.weeklyCashFlow).toBeLessThan(0);
    expect(computeRentalYield({ ...base, loanRate: 0 })!.annualLoanRepayments).toBe(0);
  });
  it("returns null, not zeros, without a price and a rent", () => {
    expect(computeRentalYield({ ...WORKED_EXAMPLE, purchasePrice: 0 })).toBeNull();
    expect(computeRentalYield({ ...WORKED_EXAMPLE, weeklyRent: 0 })).toBeNull();
  });
});

describe("the worked example", () => {
  it("is a $600,000 Queensland house at $550 a week with the investor's transfer duty from the stamp duty engine", () => {
    const { input, result } = workedExample();
    expect(input.purchasePrice).toBe(600_000);
    expect(input.weeklyRent).toBe(550);
    expect(input.stampDuty).toBe(Math.round(calculateStampDuty(600_000, "QLD", false, false, true).total));
    expect(input.stampDuty).toBe(20_025);
    expect(input.loanAmount).toBe(0);
    expect(result.annualRentalIncome).toBe(28_600);
    expect(result.grossYield).toBe(4.77);
    expect(result.netYield).toBeGreaterThan(2.5);
    expect(result.netYield).toBeLessThan(result.grossYield);
  });
});

describe("yield benchmarks data", () => {
  it("is dated, covers the ranked states' capitals, regions and states, and prints no zero", () => {
    expect(YIELD_BENCHMARKS_AS_OF).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    for (const st of YIELD_RANKED_STATES) {
      expect(YIELD_AREAS.filter((a) => a.state === st).map((a) => a.kind).sort()).toEqual(["city", "regional", "state"]);
      expect(YIELD_SALES_SOURCES[st]?.length).toBeGreaterThan(0);
    }
    for (const a of YIELD_AREAS) {
      expect(a.houseSuburbs).toBeGreaterThanOrEqual(20);
      expect(a.houseMedian as number).toBeGreaterThan(1.5);
      expect(a.houseMedian as number).toBeLessThan(8);
      expect(a.houseLowerQuartile as number).toBeLessThanOrEqual(a.houseMedian as number);
      expect(a.houseUpperQuartile as number).toBeGreaterThanOrEqual(a.houseMedian as number);
      if (a.unitMedian !== null) { expect(a.unitMedian).toBeGreaterThan(2); expect(a.unitMedian).toBeLessThan(9); expect(a.unitSuburbs).toBeGreaterThan(0); }
      expect(a.rentPeriod).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
    // The state median sits between its capital and its regional remainder.
    for (const st of YIELD_RANKED_STATES) {
      const [city, regional, state] = ["city", "regional", "state"].map((k) => YIELD_AREAS.find((a) => a.state === st && a.kind === k)!);
      expect(state.houseSuburbs).toBe(city.houseSuburbs + regional.houseSuburbs);
      expect(state.houseMedian as number).toBeGreaterThanOrEqual(Math.min(city.houseMedian as number, regional.houseMedian as number));
      expect(state.houseMedian as number).toBeLessThanOrEqual(Math.max(city.houseMedian as number, regional.houseMedian as number));
    }
  });
  it("names every other state with the reason it is left out, and never a figure for it", () => {
    const withheld = YIELD_WITHHELD.map((w) => w.state).sort();
    expect(withheld).toEqual(["ACT", "NSW", "NT", "SA", "TAS", "WA"]);
    for (const w of YIELD_WITHHELD) {
      expect(w.reason.length).toBeGreaterThan(20);
      expect(YIELD_AREAS.some((a) => a.state === w.state)).toBe(false);
    }
    expect(YIELD_WITHHELD.find((w) => w.state === "NSW")!.reason).toMatch(/postcode/);
  });
  it("formats a figure only when there is one", () => {
    expect(pct(2.9)).toBe("2.9%");
    expect(pct(5)).toBe("5.0%");
    expect(pct(0)).toBeNull();
    expect(pct(null)).toBeNull();
    expect(yieldArea("melbourne")?.kind).toBe("city");
    const feeds = yieldFeedDates();
    expect(feeds.vicRent).toMatch(/\d{4}$/);
    expect(feeds.qldRent).toMatch(/\d{4}$/);
  });
});

describe("yield FAQ", () => {
  it("answers the PAA questions with the table's figures, 40+ words each, and a net figure from the engine", () => {
    const f = yieldFaqs();
    expect(f.map((q) => q.question)).toEqual(["What is a good rental yield in Australia?", "Is 4.5% rental yield good?", "Is 3.5% a good rental yield?"]);
    const mel = yieldArea("melbourne")!, bne = yieldArea("brisbane")!;
    for (const q of f) {
      expect(q.answer.split(/\s+/).length).toBeGreaterThanOrEqual(40);
      expect(q.answer).toContain(`Melbourne`);
      expect(q.answer).toContain(pct(mel.houseMedian)!);
      expect(q.answer).toContain(pct(bne.houseMedian)!);
      expect(q.answer).toContain("30 September 2026");
      expect(q.answer).not.toMatch(/\b0\.0%/);
    }
    expect(f[1].answer).toContain(pct(netYieldAtGross(4.5))!);
    expect(f[2].answer).toContain(pct(netYieldAtGross(3.5))!);
    expect(netYieldAtGross(4.5) as number).toBeLessThan(4.5);
    expect(netYieldAtGross(3.5) as number).toBeLessThan(netYieldAtGross(4.5) as number);
  });
  it("still says what the figures say: rerun this after regenerating the data file, and reword the answers if it fails", () => {
    const h = (k: string) => yieldArea(k)!.houseMedian as number;
    const units = YIELD_AREAS.map((a) => a.unitMedian).filter((u): u is number => u !== null);
    // "Is 4.5% good?": above both capital-city house medians and Melbourne's upper quartile; about the regional going rate.
    expect(h("melbourne")).toBeLessThan(4.5);
    expect(h("brisbane")).toBeLessThan(4.5);
    expect(yieldArea("melbourne")!.houseUpperQuartile as number).toBeLessThan(4.5);
    expect(Math.abs(h("regional-vic") - 4.5)).toBeLessThanOrEqual(0.6);
    expect(Math.abs(h("regional-qld") - 4.5)).toBeLessThanOrEqual(0.6);
    // "Is 3.5% good?": above Melbourne's house median, just below Brisbane's, below both regional medians and every unit median.
    expect(h("melbourne")).toBeLessThan(3.5);
    expect(h("brisbane")).toBeGreaterThan(3.5);
    expect(h("brisbane") - 3.5).toBeLessThanOrEqual(0.3);
    expect(h("regional-vic")).toBeGreaterThan(3.5);
    expect(h("regional-qld")).toBeGreaterThan(3.5);
    expect(Math.min(...units)).toBeGreaterThan(3.5);
  });
});
