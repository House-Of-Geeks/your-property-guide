// One dated F6 rate feeds every lending calculator's default (commercial-intent
// review 10 Oct 2026, finance-tax F10). Until then the mortgage and
// refinancing calculators opened at an unsourced 6.5% and 5.9% ("Updated
// April 2026") and the bridging end debt at 6.5%, while borrowing power used
// RBA table F6.
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  AVERAGE_NEW_INVESTOR_VARIABLE_RATE,
  AVERAGE_NEW_VARIABLE_RATE,
  AVERAGE_OUTSTANDING_VARIABLE_RATE,
  F6_SOURCE,
  REFINANCE_EXAMPLE_CURRENT_RATE,
  describeF6,
} from "@/lib/data/rba-lending-rates";
import { REFERENCE_LOAN_RATE, REFERENCE_LOAN_RATE_PERIOD } from "@/lib/utils/borrowing-power";
import { EXAMPLE_ONGOING_RATE } from "@/lib/bridging-calc";
import { PERSONA_HUB_CONTENT } from "@/lib/persona-hub-content";

const SRC = join(__dirname, "../../src");
const read = (p: string) => readFileSync(join(SRC, p), "utf8");

describe("RBA table F6 rates", () => {
  it("are dated, sourced and from table F6 (August 2026, published 8 October 2026)", () => {
    for (const r of [AVERAGE_NEW_VARIABLE_RATE, AVERAGE_OUTSTANDING_VARIABLE_RATE, AVERAGE_NEW_INVESTOR_VARIABLE_RATE]) {
      expect(r.period).toMatch(/^[A-Z][a-z]+ \d{4}$/);
      expect(r.series).toMatch(/^FLRH[OI][OF]VA$/);
      expect(r.rate).toBeGreaterThan(3);
      expect(r.rate).toBeLessThan(12);
    }
    expect(AVERAGE_NEW_VARIABLE_RATE).toMatchObject({ rate: 6.2, period: "August 2026", series: "FLRHOFVA" });
    expect(F6_SOURCE.url).toMatch(/^https:\/\/www\.rba\.gov\.au\//);
    expect(describeF6(AVERAGE_NEW_VARIABLE_RATE)).toBe(
      "6.2%, the average rate on new owner-occupier variable-rate loans in August 2026 (RBA table F6)",
    );
  });

  it("feed the borrowing, affordability and bridging engines", () => {
    expect(REFERENCE_LOAN_RATE).toBe(AVERAGE_NEW_VARIABLE_RATE.rate);
    expect(REFERENCE_LOAN_RATE_PERIOD).toBe(AVERAGE_NEW_VARIABLE_RATE.period);
    expect(EXAMPLE_ONGOING_RATE).toBe(AVERAGE_NEW_VARIABLE_RATE.rate);
    expect(REFINANCE_EXAMPLE_CURRENT_RATE).toBeCloseTo(AVERAGE_NEW_VARIABLE_RATE.rate + 0.5, 5);
  });

  it("feed the mortgage and refinancing widgets, with no typed-in rate left", () => {
    const mortgage = read("components/calculators/MortgageCalculator.tsx");
    expect(mortgage).toContain("useState(AVERAGE_NEW_VARIABLE_RATE.rate)");
    expect(mortgage).not.toMatch(/useState\(\d+\.\d+\)/);
    const refi = read("components/calculators/RefinancingCalculator.tsx");
    expect(refi).toContain("useState(AVERAGE_NEW_VARIABLE_RATE.rate)");
    expect(refi).toContain("useState(REFINANCE_EXAMPLE_CURRENT_RATE)");
    expect(refi).not.toMatch(/useState\(\d+\.\d+\)/);
  });

  it("are cited, with the caveat, on the pages that print them", () => {
    for (const page of ["mortgage-calculator", "refinancing-calculator", "bridging-loan-calculator"]) {
      const src = read(`app/(marketing)/${page}/page.tsx`);
      expect(src, page).toContain("rba-lending-rates");
      expect(src, page).toContain("F6_RATE_CAVEAT");
      expect(src, page).not.toContain('updatedAt: "2026-04-15"');
    }
  });

  it("match the investor rate quoted on /investing", () => {
    const faq = PERSONA_HUB_CONTENT.investing.faqs.find((f) => f.question.startsWith("How much does it cost to hold"))!;
    expect(faq.answer).toContain(
      `${AVERAGE_NEW_INVESTOR_VARIABLE_RATE.rate}% was the average rate on new investor variable loans in ${AVERAGE_NEW_INVESTOR_VARIABLE_RATE.period}, RBA table F6`,
    );
  });
});
