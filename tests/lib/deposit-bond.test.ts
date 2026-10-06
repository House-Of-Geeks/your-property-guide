// Bridging loans plan (6 Oct 2026): indicative deposit bond fees on
// /guides/deposit-bonds, from Deposit Power's calculator settings.
import { describe, expect, it } from "vitest";
import { DEPOSIT_BOND_FEE_SOURCE, depositBondFee } from "@/lib/deposit-bond";

describe("deposit bond fees", () => {
  it("charges 1.75% of the bond up to 6 months", () => {
    expect(depositBondFee(60_000, 6)).toBe(1_050);
    expect(depositBondFee(100_000, 3)).toBe(1_750);
  });
  it("charges 3.2% a year pro rata by month beyond 6 months", () => {
    expect(depositBondFee(60_000, 24)).toBe(3_840);
    expect(depositBondFee(100_000, 12)).toBe(3_200);
  });
  it("applies the minimum fees", () => {
    expect(depositBondFee(10_000, 6)).toBe(500);
    expect(depositBondFee(10_000, 12)).toBe(700);
  });
  it("is zero with no bond or no term, and cites a dated source", () => {
    expect(depositBondFee(0, 6)).toBe(0);
    expect(depositBondFee(50_000, 0)).toBe(0);
    expect(DEPOSIT_BOND_FEE_SOURCE.url).toMatch(/^https:\/\//);
    expect(DEPOSIT_BOND_FEE_SOURCE.readOn).toMatch(/2026/);
  });
});
