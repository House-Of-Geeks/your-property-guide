// Commercial intent review 3.3 (30 Sep 2026): the negative gearing calculator's engine.
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  TAX_RATES_2026_27,
  TAX_RATES_SOURCE,
  computeNegativeGearing,
  defaultNegativeGearingInput,
  type NegativeGearingInput,
} from "@/lib/negative-gearing-calc";

const base = defaultNegativeGearingInput();
const run = (over: Partial<NegativeGearingInput> = {}) => computeNegativeGearing({ ...base, ...over });

describe("tax rates", () => {
  it("are the ATO's 2026–27 resident rates", () => {
    expect(TAX_RATES_2026_27.map((t) => t.rate)).toEqual([0, 15, 30, 37, 45]);
    expect(TAX_RATES_2026_27.map((t) => t.label).join(" ")).toContain("$135,001 to $190,000");
    expect(TAX_RATES_SOURCE.url).toMatch(/^https:\/\/www\.ato\.gov\.au\//);
    expect(TAX_RATES_SOURCE.dated).toMatch(/2026/);
  });
});

describe("computeNegativeGearing", () => {
  it("opens on the negative gearing guide's worked example and reaches the guide's figures", () => {
    const r = run();
    expect(r).toMatchObject({
      rentalIncome: 32_500,
      managementFee: 2_763,
      cashExpenses: 7_263,
      interest: 36_400,
      cashFlowBeforeTax: -11_163,
      netRentalResult: -11_163,
      gearing: "negative",
      taxEffect: 4_130,
      cashFlowAfterTax: -7_033,
      weeklyCostAfterTax: 135,
      grossYieldPct: 4.6,
    });
    const guide = readFileSync(join(__dirname, "../../src/app/(marketing)/guides/negative-gearing-australia/page.tsx"), "utf8");
    for (const figure of ["$11,163", "$7,033", "about $135 a week", "$560,000 at 6.5%"]) expect(guide).toContain(figure);
  });

  it("loses rent for vacant weeks and charges management only on rent collected", () => {
    const r = run({ vacancyWeeks: 2 });
    expect(r.weeksLet).toBe(50);
    expect(r.rentalIncome).toBe(31_250);
    expect(r.managementFee).toBe(Math.round(31_250 * 0.085));
  });

  it("counts depreciation as a deduction but not as cash", () => {
    const r = run({ depreciation: 8_000 });
    expect(r.cashFlowBeforeTax).toBe(-11_163);
    expect(r.netRentalResult).toBe(-19_163);
    expect(r.taxEffect).toBe(Math.round(19_163 * 0.37));
    expect(r.cashFlowAfterTax).toBe(-11_163 + r.taxEffect);
  });

  it("taxes a profit at the marginal rate and reports a weekly surplus", () => {
    const r = run({ weeklyRent: 1_000, marginalRate: 30 });
    expect(r.gearing).toBe("positive");
    expect(r.netRentalResult).toBeGreaterThan(0);
    expect(r.taxEffect).toBe(-Math.round(r.netRentalResult * 0.3));
    expect(r.weeklyCostAfterTax).toBeLessThan(0);
  });

  it("prints 0 rather than -0 at break-even", () => {
    const r = run({ weeklyRent: 0, loan: 0, councilRates: 0, insurance: 0, maintenance: 0, managementPct: 0 });
    expect(Object.is(r.taxEffect, 0)).toBe(true);
    expect(Object.is(r.weeklyCostAfterTax, 0)).toBe(true);
    expect(r.gearing).toBe("neutral");
  });
});

describe("the 1 July 2027 change", () => {
  it("keeps the tax saving for a property held on budget night and for a new build", () => {
    for (const timing of ["held-before-cutoff", "new-build"] as const) {
      const r = run({ timing });
      expect(r.lossOffsetsOtherIncomeFrom2027).toBe(true);
      expect(r.weeklyCostFrom2027).toBe(r.weeklyCostAfterTax);
    }
  });
  it("drops the saving against wages for an established home bought after the cut-off", () => {
    const r = run({ timing: "established-after-cutoff" });
    expect(r.lossOffsetsOtherIncomeFrom2027).toBe(false);
    expect(r.weeklyCostAfterTax).toBe(135); // 2026–27 is unchanged
    expect(r.weeklyCostFrom2027).toBe(Math.round(11_163 / 52));
  });
  it("still taxes a profit on a property the change applies to", () => {
    const r = run({ timing: "established-after-cutoff", weeklyRent: 1_000 });
    expect(r.weeklyCostFrom2027).toBe(r.weeklyCostAfterTax);
  });
});
