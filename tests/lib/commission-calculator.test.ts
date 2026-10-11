// Commercial-intent review, 10 Oct 2026, 0.6: the commission calculator left
// GST out of its total and net while the selling costs calculator added it,
// so the same sale gave two different net figures.
import { describe, expect, it } from "vitest";
import { createElement, type FC } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CommissionCalculator, commissionCalculatorResult, type CommissionCalculatorProps } from "@/components/calculators/CommissionCalculator";
import { computeSellingCosts, defaultSellingCostsInput } from "@/lib/selling-costs-calc";
import { STATE_RATES } from "@/lib/data/commission-rates";

describe("commission calculator GST", () => {
  const sale = { price: 800_000, rate: 2, includesGst: false, marketing: 4_000, conveyancing: 1_400, other: 0 };

  it("adds 10% GST to the commission by default and carries it into the total and the net", () => {
    const r = commissionCalculatorResult(sale);
    expect(r.commission).toBe(16_000);
    expect(r.commissionGst).toBe(1_600);
    expect(r.totalCosts).toBe(16_000 + 1_600 + 4_000 + 1_400);
    expect(r.netBeforeLoan).toBe(800_000 - r.totalCosts);
  });

  it("adds nothing when the quoted rate already includes GST", () => {
    const r = commissionCalculatorResult({ ...sale, includesGst: true });
    expect(r.commissionGst).toBe(0);
    expect(r.totalCosts).toBe(16_000 + 4_000 + 1_400);
  });

  it("gives the same total and net as the selling costs calculator for the same sale", () => {
    for (const includesGst of [false, true]) {
      const ours = commissionCalculatorResult({ ...sale, includesGst });
      const theirs = computeSellingCosts({
        ...defaultSellingCostsInput("NSW", 800_000),
        commissionRate: 2,
        commissionIncludesGst: includesGst,
        marketing: 4_000,
        conveyancing: 1_400,
        documents: 0,
      });
      expect(ours.totalCosts).toBe(theirs.totalCosts);
      expect(ours.netBeforeLoan).toBe(theirs.netBeforeLoan);
    }
  });

  it("renders the GST question with 'add 10%' selected and a GST line in the result", () => {
    const html = renderToStaticMarkup(createElement(CommissionCalculator as FC<CommissionCalculatorProps>, { initialState: "NSW", initialPrice: 800_000 }));
    expect(html).toContain("Does the quoted rate include GST?");
    expect(html).toMatch(/<option value="no" selected="">No, add 10% GST<\/option>|<option selected="" value="no">No, add 10% GST<\/option>/);
    expect(html).toContain("GST on commission (10%)");
    const gst = Math.round(Math.round((800_000 * STATE_RATES.NSW.typical) / 100) * 0.1);
    expect(html).toContain(`$${gst.toLocaleString("en-AU")}`);
  });
});
