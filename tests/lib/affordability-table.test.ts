// "How much house can I afford?" by income and household on
// /affordability-calculator, worked by the borrowing engine with the
// indicative HEM for each household (HEM research, 8 Oct 2026).
import { describe, expect, it } from "vitest";
import { AFFORDABILITY_TABLE, affordabilityByIncome, affordabilityFaqs } from "@/lib/affordability-table";
import { indicativeHem } from "@/lib/data/hem";
import { computeBorrowingPower } from "@/lib/utils/borrowing-power";

describe("affordability by income and household", () => {
  it("prints one row per household income with the engine's price at a 20% deposit, rounded to $5,000", () => {
    const rows = affordabilityByIncome();
    expect(rows.map((r) => r.income)).toEqual([...AFFORDABILITY_TABLE.incomes]);
    for (const r of rows) {
      const s = computeBorrowingPower(r.income, 0, 0, 0, 0, AFFORDABILITY_TABLE.assessmentRate, 30)!;
      expect(r.single.price).toBe(Math.round(s.maxLoan / 0.8 / 5_000) * 5_000);
      expect(r.single.hem).toBe(indicativeHem({ household: "single", dependants: 0, grossIncome: r.income }));
      expect(r.couple.hem).toBe(indicativeHem({ household: "couple", dependants: 0, grossIncome: r.income }));
      expect(r.coupleTwoChildren.hem).toBeGreaterThan(r.couple.hem);
      expect(r.single.price! % 5_000).toBe(0);
      // Children raise the floor, so a family affords less than the same couple. (Since
      // 11 Oct 2026 net income is worked at the 2026-27 tax rates per applicant, so a
      // couple splitting an income pays less tax than one earner and can afford more
      // than a single person on the same total at higher incomes.)
      expect(r.coupleTwoChildren.price!).toBeLessThan(r.couple.price!);
      expect(r.couple.hem).toBeGreaterThan(r.single.hem);
    }
    for (let i = 1; i < rows.length; i++) expect(rows[i].single.price!).toBeGreaterThan(rows[i - 1].single.price!);
  });
  it("answers the $100,000 and family questions from the table's own figures", () => {
    const faqs = affordabilityFaqs();
    expect(faqs).toHaveLength(2);
    const r100 = affordabilityByIncome().find((r) => r.income === 100_000)!;
    expect(faqs[0].answer).toContain(`$${r100.single.price!.toLocaleString("en-AU")}`);
    expect(faqs[0].answer).toContain(`$${r100.single.hem.toLocaleString("en-AU")}`);
    expect(faqs[1].question).toMatch(/couple with two children/);
    expect(faqs[1].answer).not.toMatch(/\$0\b/);
    expect(faqs[0].answer.split(/\s+/).length).toBeGreaterThanOrEqual(40);
  });
});
