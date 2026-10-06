// Help to Buy plan (7 Oct 2026): the scheme's rules and the calculator engine
// behind /help-to-buy-calculator and the guide's worked example.
import { describe, expect, it } from "vitest";
import {
  HTB_COMBINED_MIN_PCT,
  HTB_INCOME_LIMITS,
  HTB_LENDERS,
  HTB_PRICE_CAPS,
  HTB_SHARE,
  HTB_SOURCES,
  SHARED_EQUITY_SCHEMES,
  priceCap,
} from "@/lib/data/help-to-buy";
import { computeHelpToBuy, defaultHtbInput, type HtbInput } from "@/lib/help-to-buy-calc";
import { AUSTRALIAN_STATES } from "@/lib/utils/stamp-duty";

const input = (over: Partial<HtbInput>): HtbInput => ({ ...defaultHtbInput(), ...over });

describe("the scheme's rules", () => {
  it("holds the 2026–27 income limits and the launch price caps", () => {
    expect(HTB_INCOME_LIMITS).toEqual({ single: 103_000, joint: 165_000, singleParent: 165_000 });
    expect(HTB_PRICE_CAPS.NSW).toMatchObject({ capital: 1_300_000, rest: 800_000 });
    expect(HTB_PRICE_CAPS.VIC).toMatchObject({ capital: 950_000, rest: 650_000 });
    expect(HTB_PRICE_CAPS.QLD).toMatchObject({ capital: 1_000_000, rest: 700_000 });
    expect(HTB_PRICE_CAPS.WA).toMatchObject({ capital: 850_000, rest: 600_000 });
    expect(HTB_SHARE).toEqual({ existing: { min: 5, max: 30 }, new: { min: 5, max: 40 } });
  });
  it("has a cap for every state, and the ACT falls back to its single cap", () => {
    for (const s of AUSTRALIAN_STATES) expect(priceCap(s, "capital")).toBeGreaterThan(0);
    expect(priceCap("ACT", "rest")).toBe(1_000_000);
  });
  it("sources every lender and scheme from an official or lender page", () => {
    for (const l of HTB_LENDERS) expect(l.href).toMatch(/^https:\/\//);
    for (const s of SHARED_EQUITY_SCHEMES) expect(s.source.href).toMatch(/^https:\/\/www\.|^https:\/\/firsthomebuyers/);
    for (const s of Object.values(HTB_SOURCES)) expect(s.href).toMatch(/^https:\/\//);
  });
});

describe("the worked example", () => {
  const res = computeHelpToBuy(defaultHtbInput());
  it("takes 30% of a $700,000 existing home with a 2% deposit", () => {
    expect(res.governmentContribution).toBe(210_000);
    expect(res.loan).toBe(476_000);
    expect(res.monthlyRepayment).toBe(3_009);
    expect(res.eligible).toBe(true);
  });
  it("compares with a 5% deposit and no government share", () => {
    expect(res.fivePercent).toEqual({ deposit: 35_000, loan: 665_000, monthlyRepayment: 4_203 });
  });
  it("gives the government its share of the value at sale", () => {
    expect(res.governmentAtSale).toBe(Math.round(res.valueAtSale * 0.3));
    expect(computeHelpToBuy(input({ growthPct: 0, yearsToSale: 0 })).governmentAtSale).toBe(210_000);
  });
  it("prices first home buyer duty on an established home, and leaves it out for a new one", () => {
    expect(res.stampDuty).not.toBeNull();
    expect(computeHelpToBuy(input({ home: "new" })).stampDuty).toBeNull();
  });
});

describe("eligibility edges", () => {
  it("allows income exactly at the limit and fails a dollar over", () => {
    expect(computeHelpToBuy(input({ income: 103_000 })).checks.find((c) => c.key === "income")?.ok).toBe(true);
    expect(computeHelpToBuy(input({ income: 103_001 })).checks.find((c) => c.key === "income")?.ok).toBe(false);
    expect(computeHelpToBuy(input({ household: "joint", income: 165_000 })).eligible).toBe(true);
  });
  it("applies the rest-of-state cap outside the capital", () => {
    expect(computeHelpToBuy(input({ area: "rest", price: 700_000 })).checks.find((c) => c.key === "price")?.ok).toBe(false);
    expect(computeHelpToBuy(input({ area: "rest", price: 650_000, deposit: 13_000 })).eligible).toBe(true);
  });
  it("needs a 2% deposit and deposit plus share of at least 20%", () => {
    expect(computeHelpToBuy(input({ deposit: 10_000 })).checks.find((c) => c.key === "deposit")?.ok).toBe(false);
    const low = computeHelpToBuy(input({ sharePct: 10, deposit: 35_000 }));
    expect(low.depositPct + low.sharePct).toBeLessThan(HTB_COMBINED_MIN_PCT);
    expect(low.checks.find((c) => c.key === "combined")?.ok).toBe(false);
  });
  it("clamps the share to 5%–30% for existing homes and up to 40% for new", () => {
    expect(computeHelpToBuy(input({ sharePct: 40 })).sharePct).toBe(30);
    expect(computeHelpToBuy(input({ home: "new", sharePct: 40 })).sharePct).toBe(40);
    expect(computeHelpToBuy(input({ sharePct: 1 })).sharePct).toBe(5);
  });
  it("is invalid with no price", () => {
    expect(computeHelpToBuy(input({ price: 0 })).status).toBe("invalid");
  });
});
