// /mortgage-calculator: repayments by loan size and the long-tail questions
// ("How much is a $600000 mortgage monthly?", AI search volume 1,133),
// worked at the RBA F6 average rate (commercial-intent review 10 Oct 2026,
// finance-tax section 5 build 3 and section 6 answer 3).
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { monthlyRepayment } from "@/lib/utils/repayment";
import { AVERAGE_NEW_VARIABLE_RATE } from "@/lib/data/rba-lending-rates";

const src = readFileSync(join(__dirname, "../../src/app/(marketing)/mortgage-calculator/page.tsx"), "utf8");

describe("/mortgage-calculator", () => {
  it("prints repayments by loan size from the shared function at the F6 rate", () => {
    expect(src).toContain('id="by-loan-size"');
    expect(src).toContain("monthlyRepayment(loan, RATE, 30)");
    expect(src).toContain("const RATE = AVERAGE_NEW_VARIABLE_RATE.rate;");
  });

  it("answers the $600,000 question with the spec's figures", () => {
    expect(src).toContain('sizeFaq(600_000, "How much is a $600,000 mortgage a month?")');
    expect(AVERAGE_NEW_VARIABLE_RATE.rate).toBe(6.2);
    expect(monthlyRepayment(600_000, 6.2, 30)).toBe(3_675);
    expect(monthlyRepayment(600_000, 6.45, 30) - monthlyRepayment(600_000, 6.2, 30)).toBe(98);
  });
});
