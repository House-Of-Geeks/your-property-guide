// HEM research (8 Oct 2026): the indicative living-expense floor the
// calculators apply scales by household, dependants, income band and region,
// and is labelled as an estimate wherever it prints.
import { describe, expect, it } from "vitest";
import { HEM_AS_AT, HEM_BASE_MONTHLY, HEM_INCOME_BANDS, HEM_METHOD_NOTE, hemIncomeBand, hemTableRows, indicativeHem } from "@/lib/data/hem";
import { computeBorrowingPower, getHEM } from "@/lib/utils/borrowing-power";

describe("indicativeHem", () => {
  it("rises with dependants, household size, income band, and falls for regional households", () => {
    const single = indicativeHem({ household: "single", dependants: 0, grossIncome: 100_000 });
    expect(single).toBe(HEM_BASE_MONTHLY.single);
    expect(indicativeHem({ household: "single", dependants: 1, grossIncome: 100_000 })).toBeGreaterThan(single);
    expect(indicativeHem({ household: "couple", dependants: 0, grossIncome: 100_000 })).toBeGreaterThan(single);
    expect(indicativeHem({ household: "single", dependants: 0, grossIncome: 200_000 })).toBeGreaterThan(single);
    expect(indicativeHem({ household: "single", dependants: 0, grossIncome: 60_000 })).toBeLessThan(single);
    expect(indicativeHem({ household: "single", dependants: 0, grossIncome: 100_000, region: "regional" })).toBeLessThan(single);
    // dependants cap: the sixth child adds nothing
    expect(indicativeHem({ household: "couple", dependants: 6, grossIncome: 100_000 })).toBe(indicativeHem({ household: "couple", dependants: 5, grossIncome: 100_000 }));
    // rounded to $10
    expect(indicativeHem({ household: "couple", dependants: 3, grossIncome: 200_000, region: "regional" }) % 10).toBe(0);
  });
  it("places incomes in the stated bands, boundaries going up", () => {
    expect(hemIncomeBand(79_999).label).toBe("under $80,000");
    expect(hemIncomeBand(80_000).label).toBe("$80,000 to $150,000");
    expect(hemIncomeBand(150_000).label).toBe("$150,000 to $250,000");
    expect(hemIncomeBand(1_000_000).label).toBe("over $250,000");
    expect(HEM_INCOME_BANDS[HEM_INCOME_BANDS.length - 1].max).toBe(Infinity);
  });
  it("stays inside the ranges the comparison sites publish for mid incomes", () => {
    expect(indicativeHem({ household: "single", dependants: 0, grossIncome: 100_000 })).toBeGreaterThanOrEqual(1_800);
    expect(indicativeHem({ household: "single", dependants: 0, grossIncome: 100_000 })).toBeLessThanOrEqual(2_200);
    expect(indicativeHem({ household: "couple", dependants: 0, grossIncome: 100_000 })).toBeGreaterThanOrEqual(2_400);
    expect(indicativeHem({ household: "couple", dependants: 0, grossIncome: 100_000 })).toBeLessThanOrEqual(3_000);
    expect(indicativeHem({ household: "couple", dependants: 2, grossIncome: 120_000 })).toBeGreaterThanOrEqual(2_900);
    expect(indicativeHem({ household: "couple", dependants: 2, grossIncome: 120_000 })).toBeLessThanOrEqual(3_600);
  });
  it("prints a dated method note and a seven-row table across the four bands", () => {
    expect(HEM_AS_AT).toMatch(/^[A-Z][a-z]+ 20\d\d$/);
    expect(HEM_METHOD_NOTE).toContain(HEM_AS_AT);
    expect(HEM_METHOD_NOTE).toMatch(/not published/);
    const rows = hemTableRows();
    expect(rows).toHaveLength(7);
    for (const r of rows) {
      expect(r.monthly).toHaveLength(HEM_INCOME_BANDS.length);
      for (let i = 1; i < r.monthly.length; i++) expect(r.monthly[i]).toBeGreaterThan(r.monthly[i - 1]);
    }
  });
});

describe("the borrowing engine with the scaled HEM", () => {
  it("floors expenses at the household's HEM and reports which figure it used", () => {
    const low = computeBorrowingPower(100_000, 0, 500, 0, 0, 9.2, 30)!;
    expect(low.expensesSource).toBe("hem");
    expect(low.hemUsed).toBe(getHEM(0, { grossIncome: 100_000 }));
    expect(low.hemBenchmark).toBe(low.hemUsed);
    const high = computeBorrowingPower(100_000, 0, 4_000, 0, 0, 9.2, 30)!;
    expect(high.expensesSource).toBe("declared");
    expect(high.hemUsed).toBe(4_000);
  });
  it("treats a second income as a couple unless told otherwise, and a family borrows less than the same couple", () => {
    const couple = computeBorrowingPower(75_000, 75_000, 0, 0, 0, 9.2, 30)!;
    expect(couple.hemBenchmark).toBe(getHEM(0, { household: "couple", grossIncome: 150_000 }));
    const asSingle = computeBorrowingPower(75_000, 75_000, 0, 0, 0, 9.2, 30, { household: "single" })!;
    expect(asSingle.hemBenchmark).toBeLessThan(couple.hemBenchmark);
    const family = computeBorrowingPower(75_000, 75_000, 0, 2, 0, 9.2, 30)!;
    expect(family.maxLoan).toBeLessThan(couple.maxLoan);
    const regional = computeBorrowingPower(75_000, 75_000, 0, 2, 0, 9.2, 30, { region: "regional" })!;
    expect(regional.maxLoan).toBeGreaterThan(family.maxLoan);
  });
});
