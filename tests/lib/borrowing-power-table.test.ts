// Commercial intent review (30 Sep 2026), section 3.3: the "Borrowing power
// by income" table and the "$100,000 salary" FAQ on /borrowing-power-calculator
// are worked by the widget's engine, state their assumptions, and never print 0.
import { describe, expect, it } from "vitest";
import { BORROWING_TABLE, borrowingPowerByIncome, borrowingPowerFaqs, maxLoanFor, percentLowerAtRate } from "@/lib/borrowing-power-table";
import { APRA_SERVICEABILITY_BUFFER, DEFAULT_ASSESSMENT_RATE, REFERENCE_LOAN_RATE, computeBorrowingPower, getHEM } from "@/lib/utils/borrowing-power";

describe("borrowing power by income", () => {
  it("prints one row per income from $60,000 to $200,000, each the engine's figure rounded to $1,000", () => {
    const rows = borrowingPowerByIncome();
    expect(rows.map((r) => r.income)).toEqual([...BORROWING_TABLE.incomes]);
    expect(rows[0].income).toBe(60_000);
    expect(rows[rows.length - 1].income).toBe(200_000);
    for (const r of rows) {
      const single = computeBorrowingPower(r.income, 0, getHEM(0), 0, 0, DEFAULT_ASSESSMENT_RATE, 30)!;
      const couple = computeBorrowingPower(r.income, r.income, getHEM(0), 0, 0, DEFAULT_ASSESSMENT_RATE, 30)!;
      expect(r.single).toBe(Math.round(single.maxLoan / 1_000) * 1_000);
      expect(r.couple).toBe(Math.round(couple.maxLoan / 1_000) * 1_000);
      expect(r.coupleIncome).toBe(r.income * 2);
      expect(r.single).toBeGreaterThan(0);
      expect(r.couple).toBeGreaterThan(r.single);
      expect(r.single % 1_000).toBe(0);
    }
    // Every row stays under six times income, the multiple above which APRA caps new lending (Feb 2026).
    for (const r of rows) {
      expect(r.single / r.income).toBeLessThan(6);
      expect(r.couple / r.coupleIncome).toBeLessThan(6);
    }
    // More income, more loan: the table reads as a ladder.
    for (let i = 1; i < rows.length; i++) expect(rows[i].single).toBeGreaterThan(rows[i - 1].single);
  });
  it("states the assumptions it prints: the calculator's default rate, the expense floor, no debts, 30 years", () => {
    expect(BORROWING_TABLE.assessmentRate).toBe(DEFAULT_ASSESSMENT_RATE);
    // RBA F6 new owner-occupier variable rate (July 2026) plus APRA's 3 point buffer (28 May 2026).
    expect(REFERENCE_LOAN_RATE).toBe(6.2);
    expect(APRA_SERVICEABILITY_BUFFER).toBe(3);
    expect(DEFAULT_ASSESSMENT_RATE).toBe(9.2);
    expect(BORROWING_TABLE.loanRatePeriod).toMatch(/^[A-Z][a-z]+ \d{4}$/);
    expect(BORROWING_TABLE.monthlyExpenses).toBe(getHEM(0));
    expect(BORROWING_TABLE.existingDebts).toBe(0);
    expect(BORROWING_TABLE.dependants).toBe(0);
    expect(BORROWING_TABLE.termYears).toBe(30);
    expect(BORROWING_TABLE.asAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
  it("gives null, never 0, where the engine has no surplus", () => {
    expect(maxLoanFor(20_000)).toBeNull();
    expect(maxLoanFor(100_000)).toBeGreaterThan(0);
  });
  it("measures how much lower the figures are at a higher assessment rate", () => {
    const at1 = percentLowerAtRate(DEFAULT_ASSESSMENT_RATE + 1);
    const at2 = percentLowerAtRate(DEFAULT_ASSESSMENT_RATE + 2);
    expect(at1).toBeGreaterThanOrEqual(5);
    expect(at1).toBeLessThanOrEqual(12);
    expect(at2).toBeGreaterThan(at1);
    expect(percentLowerAtRate(DEFAULT_ASSESSMENT_RATE)).toBe(0);
  });
  it("answers the $100,000 salary question with the table's own figure, 40+ words and the assumptions", () => {
    const faqs = borrowingPowerFaqs();
    expect(faqs).toHaveLength(1);
    const [faq] = faqs;
    expect(faq.question).toBe("How much can I borrow on a $100,000 salary?");
    expect(faq.answer.split(/\s+/).length).toBeGreaterThanOrEqual(40);
    const single = borrowingPowerByIncome().find((r) => r.income === 100_000)!;
    expect(faq.answer).toContain(`$${single.single.toLocaleString("en-AU")}`);
    expect(faq.answer).toContain(`$${single.couple.toLocaleString("en-AU")}`);
    expect(faq.answer).toContain(`${DEFAULT_ASSESSMENT_RATE}% assessment rate`);
    expect(faq.answer).toContain("RBA table F6");
    expect(faq.answer).toContain("28 May 2026");
    expect(faq.answer).toContain("30 September 2026");
    expect(faq.answer).not.toMatch(/\$0\b/);
  });
});
