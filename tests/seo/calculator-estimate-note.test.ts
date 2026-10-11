// The sidebar's lender-policy line ("income shading, HEM tables, and existing
// debts") showed on every calculator until 11 Oct 2026, the CGT, rental
// yield, negative gearing and LMI pages included (finance-tax F4). Only the
// lending calculators pass it now.
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { LENDER_POLICY_NOTE } from "@/lib/utils/borrowing-power";

const page = (slug: string) => readFileSync(join(__dirname, "../../src/app/(marketing)", slug, "page.tsx"), "utf8");

describe("estimateNote", () => {
  it("is the lender-policy wording on the lending calculators", () => {
    expect(LENDER_POLICY_NOTE).toBe("Real lender policies vary widely, especially around income shading, HEM tables, and existing debts.");
    for (const slug of ["borrowing-power-calculator", "affordability-calculator", "refinancing-calculator", "bridging-loan-calculator"]) {
      expect(page(slug), slug).toContain("estimateNote={LENDER_POLICY_NOTE}");
    }
  });

  it("is the layout's general line on the others", () => {
    for (const slug of ["cgt-calculator", "negative-gearing-calculator", "lmi-calculator", "rental-yield-calculator", "mortgage-calculator"]) {
      expect(page(slug), slug).not.toContain("estimateNote");
      expect(page(slug), slug).not.toContain("income shading");
    }
  });
});
