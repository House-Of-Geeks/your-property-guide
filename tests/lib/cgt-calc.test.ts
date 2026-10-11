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

// The Budget 2026-27 Tax Explainer's cameos (12 May 2026), worked by the
// engine's 1 July 2027 mode. They use 2.5% inflation and a 47% rate (45% plus
// the Medicare levy).
describe("gains from 1 July 2027: the Budget explainer's cameos", () => {
  const person = (over: Partial<CgtInput>) => computeCgt({ ...base, owner: "individual", ...over });

  it("Jane: owned before 1 July 2027, the gain split at that date", () => {
    const r = person({ purchasePrice: 800_000, salePrice: 1_600_000, purchaseDate: "2022-07-01", saleDate: "2032-07-01" });
    expect(r.rules).toBe("split");
    expect(r.valueAt2027Estimated).toBe(true);
    expect(r.valueAt2027).toBe(1_131_371);
    expect(r.gainBefore2027).toBe(331_371);
    expect(Math.abs(r.indexedGainAfter2027 - 319_958)).toBeLessThanOrEqual(1);
    expect(Math.abs(r.taxableGain - 485_643)).toBeLessThanOrEqual(1);
  });

  it("David, Ben and Kate: bought in July 2027, held 10 years", () => {
    const sale = (growth: number) => Math.round(500_000 * Math.pow(1 + growth, 10));
    const at = (growth: number) => person({ purchasePrice: 500_000, salePrice: sale(growth), purchaseDate: "2027-07-01", saleDate: "2037-07-01" });
    const david = at(0.05);
    expect(david.rules).toBe("indexation");
    expect(Math.abs(david.taxableGain - 174_405)).toBeLessThanOrEqual(1);
    expect(at(0.025).taxableGain).toBe(0);
    expect(Math.abs(at(0.075).taxableGain - 390_474)).toBeLessThanOrEqual(1);
    // David pays $8,075 more than under the 50% discount ($157,224 taxable).
    const asNewBuild = person({ purchasePrice: 500_000, salePrice: sale(0.05), purchaseDate: "2027-07-01", saleDate: "2037-07-01", newBuild: true });
    expect(asNewBuild.newBuildChoice?.chosen).toBe("discount");
    expect(Math.abs(asNewBuild.taxableGain - 157_224)).toBeLessThanOrEqual(1);
    expect(Math.abs(asNewBuild.newBuildChoice!.alternativeTax - asNewBuild.totalTax - 8_075)).toBeLessThanOrEqual(2);
  });

  it("Jack: $10,000 gain on $25,000 of income pays the 30% minimum", () => {
    const r = person({ purchasePrice: 100_000, salePrice: 110_000, purchaseDate: "2027-07-01", saleDate: "2029-08-01", otherIncome: 25_000, inflationPct: 0 });
    expect(r.taxYear).toBe("2027–28");
    expect(r.incomeTax).toBe(1_400);
    expect(r.minimumTaxTopUp).toBe(1_600);
    expect(person({ purchasePrice: 100_000, salePrice: 110_000, purchaseDate: "2027-07-01", saleDate: "2029-08-01", otherIncome: 25_000, inflationPct: 0, exemptPayment: true }).minimumTaxTopUp).toBe(0);
  });

  it("companies and super funds are outside the change", () => {
    const co = computeCgt({ ...base, owner: "company", purchaseDate: "2022-07-01", saleDate: "2032-07-01" });
    expect(co.rules).toBe("discount");
    expect(co.taxableGain).toBe(200_000);
    const fund = computeCgt({ ...base, owner: "smsf", purchaseDate: "2022-07-01", saleDate: "2032-07-01" });
    expect(fund.rules).toBe("discount");
    expect(fund.taxableGain).toBe(133_333);
  });

  it("a user's own 1 July 2027 value replaces the estimate", () => {
    const r = person({ purchasePrice: 800_000, salePrice: 1_600_000, purchaseDate: "2022-07-01", saleDate: "2032-07-01", valueAt2027: 1_000_000 });
    expect(r.valueAt2027Estimated).toBe(false);
    expect(r.gainBefore2027).toBe(200_000);
  });
});
