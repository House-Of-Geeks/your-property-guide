// FHSS plan (7 Oct 2026): the scheme's rules, the 2026–27 tax helper and the
// calculator engine behind /fhss-calculator and the guide's worked example.
import { describe, expect, it } from "vitest";
import {
  CONCESSIONAL_CAP,
  CURRENT_SIC,
  FHSS_ANNUAL_LIMIT,
  FHSS_SOURCES,
  FHSS_TOTAL_LIMIT,
} from "@/lib/data/fhss";
import { computeFhss, defaultFhssInput, type FhssInput } from "@/lib/fhss-calc";
import { incomeTax, marginalRate } from "@/lib/utils/income-tax";

const input = (over: Partial<FhssInput>): FhssInput => ({ ...defaultFhssInput(), ...over });

describe("the rules", () => {
  it("holds the scheme limits, the 2026–27 concessional cap and the current SIC rate", () => {
    expect([FHSS_ANNUAL_LIMIT, FHSS_TOTAL_LIMIT]).toEqual([15_000, 50_000]);
    expect(CONCESSIONAL_CAP.amount).toBe(32_500);
    expect(CURRENT_SIC).toEqual({ quarter: "October–December 2026", rate: 7.51 });
  });
  it("sources every rule from an official page", () => {
    for (const s of Object.values(FHSS_SOURCES)) expect(s.href).toMatch(/^https:\/\/(www\.ato|www\.legislation|firsthomebuyers|moneysmart)\.gov\.au\//);
  });
});

describe("2026–27 resident income tax", () => {
  it("matches the ATO's published amounts at each threshold", () => {
    expect(incomeTax(18_200)).toBe(0);
    expect(incomeTax(45_000)).toBe(4_020);
    expect(incomeTax(135_000)).toBe(31_020);
    expect(incomeTax(190_000)).toBe(51_370);
    expect(incomeTax(200_000)).toBe(55_870);
  });
  it("gives the rate on the next dollar", () => {
    expect([marginalRate(18_200), marginalRate(45_000), marginalRate(45_001), marginalRate(250_000)]).toEqual([0, 15, 30, 45]);
  });
});

describe("the worked example: $10,000 a year salary sacrificed for 3 years on $90,000", () => {
  const r = computeFhss(defaultFhssInput());
  it("counts all $30,000 and releases 85% of it plus deemed earnings", () => {
    expect(r.counted).toBe(30_000);
    expect(r.releasableContributions).toBe(25_500);
    expect(r.earnings).toBe(3_171);
    expect(r.maxRelease).toBe(28_671);
  });
  it("taxes the release at 30% plus Medicare less the 30% offset, leaving the 2% levy", () => {
    expect(r.assessable).toBe(28_671);
    expect(r.releaseTax).toBe(573);
    expect(r.inHand).toBe(28_098);
  });
  it("compares with the same pay saved in a bank at 4.5%", () => {
    expect(r.bank).toEqual({ taxGoingIn: 9_600, saved: 20_400, interest: 992, total: 21_392 });
    expect(r.advantage).toBe(6_706);
  });
});

describe("limits and edges", () => {
  it("counts no more than $15,000 a year and $50,000 in total", () => {
    const over = computeFhss(input({ salary: 150_000, perYear: 25_000 }));
    expect([over.counted, over.notCounted, over.overAnnualLimit]).toEqual([45_000, 30_000, true]);
    const total = computeFhss(input({ perYear: 15_000, years: 4 }));
    expect([total.counted, total.notCounted, total.overTotalLimit]).toEqual([50_000, 10_000, true]);
  });
  it("flags salary sacrifice that takes concessional contributions past the cap with the super guarantee", () => {
    expect(computeFhss(input({ salary: 150_000, perYear: 15_000 })).overConcessionalCap).toBe(true);
    expect(computeFhss(input({ salary: 90_000, perYear: 15_000 })).overConcessionalCap).toBe(false);
  });
  it("releases after-tax contributions in full and taxes only the earnings", () => {
    const r = computeFhss(input({ type: "after-tax" }));
    expect(r.releasableContributions).toBe(30_000);
    expect(r.assessable).toBe(r.earnings);
    expect(r.contributionsTax).toBe(0);
    expect(r.bank.taxGoingIn).toBe(0);
  });
  it("never charges less than the Medicare levy when the 30% offset exceeds the income tax", () => {
    const low = computeFhss(input({ salary: 40_000 }));
    expect(low.releaseTax).toBe(Math.round(low.assessable * 0.02));
  });
  it("is invalid without a salary, an amount or a year", () => {
    expect(computeFhss(input({ salary: 0 })).status).toBe("invalid");
    expect(computeFhss(input({ perYear: 0 })).status).toBe("invalid");
    expect(computeFhss(input({ years: 0 })).status).toBe("invalid");
  });
});
