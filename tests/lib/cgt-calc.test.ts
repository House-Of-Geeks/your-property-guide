// The CGT calculator's engine (src/lib/cgt-calc.ts). Until 10 Oct 2026 the
// widget used the retired 2023-24 rates (19% and 32.5%), gave companies the
// 50% discount, missed a sale at exactly 12 months and left out the Medicare
// levy (commercial-intent review, finance-tax F4). Figures below are worked by
// hand from the ATO's 2026-27 resident rates (last updated 13 August 2026).
import { describe, expect, it } from "vitest";
import { computeCgt, defaultCgtInput, heldAtLeast12Months, type CgtInput } from "@/lib/cgt-calc";
import { RESIDENT_BRACKETS_2026_27 } from "@/lib/utils/income-tax";

const base = defaultCgtInput();
const run = (over: Partial<CgtInput>) => computeCgt({ ...base, ...over });

describe("tax rates", () => {
  it("are the ATO's 2026-27 resident brackets, not the 2023-24 ones", () => {
    expect(RESIDENT_BRACKETS_2026_27.map((b) => b.rate)).toEqual([0, 15, 30, 37, 45]);
  });
});

describe("computeCgt", () => {
  it("individual: half of a $200,000 gain on $100,000 of other income", () => {
    const r = run({});
    expect(r.grossGain).toBe(200_000);
    expect(r.heldAtLeast12Months).toBe(true);
    expect(r.taxableGain).toBe(100_000);
    // $55,870 on $200,000 less $20,520 on $100,000
    expect(r.incomeTax).toBe(35_350);
    expect(r.medicareLevy).toBe(2_000);
    expect(r.totalTax).toBe(37_350);
    expect(r.marginalRateBefore).toBe(30);
  });

  it("answers 'how much CGT on $300,000?' as the page's FAQ does", () => {
    const r = run({ salePrice: 800_000 });
    expect(r.taxableGain).toBe(150_000);
    // $78,370 on $250,000 less $20,520 on $100,000
    expect(r.incomeTax).toBe(57_850);
    expect(r.medicareLevy).toBe(3_000);
  });

  it("company: no discount, taxed at the company rate", () => {
    const r30 = run({ owner: "company" });
    expect(r30.discount).toBe(0);
    expect(r30.taxableGain).toBe(200_000);
    expect(r30.totalTax).toBe(60_000);
    expect(r30.medicareLevy).toBe(0);
    expect(run({ owner: "company", companyRate: 25 }).totalTax).toBe(50_000);
  });

  it("SMSF: one-third discount and 15%", () => {
    const r = run({ owner: "smsf" });
    expect(r.taxableGain).toBe(133_333);
    expect(r.totalTax).toBe(20_000);
  });

  it("joint: each owner adds half the taxable gain to their own income", () => {
    const r = run({ owner: "joint" });
    expect(r.taxableGainPerOwner).toBe(50_000);
    // ($36,570 on $150,000 less $20,520) x 2, plus 2% of $100,000
    expect(r.incomeTax).toBe(32_100);
    expect(r.totalTax).toBe(34_100);
  });

  it("main residence: full and partial exemption; not for companies", () => {
    expect(run({ mainResidence: "always" }).totalTax).toBe(0);
    const part = run({ mainResidence: "part", mainResidenceDays: 913 });
    expect(part.daysOwned).toBe(1826);
    expect(part.exemptShare).toBeCloseTo(0.5, 3);
    expect(part.assessableGain).toBe(100_000);
    expect(run({ owner: "company", mainResidence: "always" }).totalTax).toBe(60_000);
  });

  it("a capital loss carries no tax", () => {
    const r = run({ salePrice: 450_000 });
    expect(r.grossGain).toBe(-50_000);
    expect(r.totalTax).toBe(0);
  });
});

describe("the 12-month test", () => {
  it("follows the ATO's example: acquired 2 Feb 2021, discount from 3 Feb 2022", () => {
    expect(heldAtLeast12Months("2021-02-02", "2022-02-02")).toBe(false);
    expect(heldAtLeast12Months("2021-02-02", "2022-02-03")).toBe(true);
  });

  it("handles 29 February", () => {
    expect(heldAtLeast12Months("2024-02-29", "2025-02-28")).toBe(false);
    expect(heldAtLeast12Months("2024-02-29", "2025-03-01")).toBe(true);
  });

  it("drops the discount on a sale inside 12 months", () => {
    const r = run({ purchaseDate: "2026-01-15", saleDate: "2026-11-01" });
    expect(r.heldAtLeast12Months).toBe(false);
    expect(r.taxableGain).toBe(200_000);
  });
});
