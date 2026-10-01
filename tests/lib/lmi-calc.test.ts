// Commercial intent review 3.3 (30 Sep 2026): the LMI calculator's engine.
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  HELIA_READINGS,
  LMI_DUTY,
  LMI_RATES,
  LMI_RATE_SOURCE,
  LOAN_BANDS,
  computeLmi,
  lookupLmiRate,
  lvrPct,
  premiumAt,
  type LmiInput,
} from "@/lib/lmi-calc";

const input = (over: Partial<LmiInput>): LmiInput => ({
  price: 600_000,
  mode: "deposit",
  deposit: 60_000,
  loan: 0,
  state: "NSW",
  firstHomeBuyer: false,
  ...over,
});

describe("the published rate table", () => {
  it("covers 80.01% to 95% in contiguous one-point bands, five loan bands each, with a dated source", () => {
    expect(LMI_RATES).toHaveLength(15);
    LMI_RATES.forEach((row, i) => {
      expect(row.lvrMin).toBe(80 + i);
      expect(row.lvrMax).toBe(81 + i);
      expect(row.rates).toHaveLength(LOAN_BANDS.length);
    });
    expect(LOAN_BANDS.map((b) => b.max)).toEqual([300_000, 500_000, 600_000, 750_000, 1_000_000]);
    expect(LMI_RATE_SOURCE.url).toMatch(/^https:\/\//);
    expect(LMI_RATE_SOURCE.dated).toMatch(/2026/);
  });

  it("never gets cheaper as the LVR rises within a loan band", () => {
    for (let col = 0; col < LOAN_BANDS.length; col++) {
      for (let i = 1; i < LMI_RATES.length; i++) {
        expect(LMI_RATES[i].rates[col]).toBeGreaterThanOrEqual(LMI_RATES[i - 1].rates[col]);
      }
    }
  });
});

describe("band edges", () => {
  it("charges nothing at 80% and prices from 80.01%", () => {
    expect(computeLmi(input({ deposit: 120_000 })).status).toBe("no-lmi");
    expect(lookupLmiRate(480_000, 80)).toBeNull();
    expect(lookupLmiRate(480_000, 80.01)?.ratePct).toBe(0.568);
  });
  it("puts exactly 90% in the 89.01% to 90% band and 90.01% in the next", () => {
    expect(lookupLmiRate(540_000, 90)?.ratePct).toBe(2.18);
    expect(lookupLmiRate(540_000, 90.01)?.ratePct).toBe(3.513);
  });
  it("stops at 95% LVR and at a $1,000,000 loan", () => {
    expect(lookupLmiRate(570_000, 95)?.ratePct).toBe(3.998);
    expect(computeLmi(input({ deposit: 29_000 })).status).toBe("lvr-above-table");
    expect(computeLmi(input({ price: 1_200_000, deposit: 180_000 })).status).toBe("loan-above-table");
    expect(computeLmi(input({ price: 1_200_000, deposit: 200_000 })).status).toBe("priced");
  });
  it("switches loan band after $300,000, $500,000, $600,000 and $750,000", () => {
    const at90 = (loan: number) => lookupLmiRate(loan, 90)?.ratePct;
    expect([at90(300_000), at90(300_001)]).toEqual([1.463, 1.873]);
    expect([at90(500_000), at90(500_001)]).toEqual([1.873, 2.18]);
    expect([at90(600_000), at90(600_001)]).toEqual([2.18, 2.367]);
    expect([at90(750_000), at90(750_001)]).toEqual([2.367, 2.516]);
  });
  it("rounds LVR to two decimals", () => {
    expect(lvrPct(540_000, 600_000)).toBe(90);
    expect(lvrPct(500_000, 624_000)).toBe(80.13);
  });
});

describe("computeLmi", () => {
  it("gives the FAQ's 10% deposit examples: $600,000 in Victoria and $800,000 in Queensland", () => {
    const vic = computeLmi(input({ state: "VIC" }));
    expect(vic).toMatchObject({ status: "priced", loan: 540_000, lvr: 90, ratePct: 2.18, premium: 11_772, duty: 1_177, total: 12_949 });
    const qld = computeLmi(input({ price: 800_000, deposit: 80_000, state: "QLD" }));
    expect(qld).toMatchObject({ status: "priced", loan: 720_000, lvr: 90, ratePct: 2.367, premium: 17_042, duty: 1_534, total: 18_576 });
  });
  it("adds no duty in NSW or the ACT", () => {
    for (const state of ["NSW", "ACT"] as const) {
      const r = computeLmi(input({ state }));
      expect(r.duty).toBe(0);
      expect(r.total).toBe(r.premium);
    }
  });
  it("gives the same answer from a loan amount as from a deposit", () => {
    const byDeposit = computeLmi(input({ deposit: 45_000 }));
    const byLoan = computeLmi(input({ mode: "loan", loan: 555_000, deposit: 0 }));
    expect(byLoan).toEqual(byDeposit);
  });
  it("reports the deposit needed for 80% LVR and the gap to it", () => {
    const r = computeLmi(input({}));
    expect(r.depositFor80).toBe(120_000);
    expect(r.depositGapTo80).toBe(60_000);
    expect(computeLmi(input({ deposit: 150_000 })).depositGapTo80).toBe(0);
  });
  it("refuses a loan bigger than the price or a zero price", () => {
    expect(computeLmi(input({ mode: "loan", loan: 700_000 })).status).toBe("invalid");
    expect(computeLmi(input({ price: 0 })).status).toBe("invalid");
  });
  it("feeds the page's price-by-deposit table", () => {
    expect(premiumAt(500_000, 5)).toBe(15_889); // $475,000 at 3.345%
    expect(premiumAt(600_000, 10)).toBe(11_772);
    expect(premiumAt(600_000, 20)).toBeNull();
  });
});

describe("stamp duty on the premium", () => {
  it("matches each revenue office as read on 30 Sep 2026", () => {
    expect(Object.fromEntries(Object.entries(LMI_DUTY).map(([s, d]) => [s, d.rate]))).toEqual({
      NSW: 0, VIC: 0.1, QLD: 0.09, WA: 0.1, SA: 0.11, TAS: 0.1, NT: 0.1, ACT: 0,
    });
    for (const d of Object.values(LMI_DUTY)) {
      expect(d.source.length).toBeGreaterThan(10);
      expect(d.url).toMatch(/^https:\/\//);
    }
  });
  it("is described the same way in the page's FAQ", () => {
    const page = readFileSync(join(__dirname, "../../src/app/(marketing)/lmi-calculator/page.tsx"), "utf8");
    expect(page).toContain("charge 9% in Queensland, 10% in Victoria, Western Australia, Tasmania and the Northern Territory, and 11% in South Australia");
    expect(page).toContain("New South Wales has exempted LMI premiums paid since 1 July 2017, and the ACT abolished insurance duty on 1 July 2016");
  });
});

describe("Helia readings quoted on the page", () => {
  it("hold the four 10% deposit readings of 30 Sep 2026, first home buyers lower", () => {
    expect(HELIA_READINGS).toHaveLength(4);
    for (const price of [600_000, 800_000]) {
      const [std, fhb] = [false, true].map((f) => HELIA_READINGS.find((h) => h.price === price && h.firstHomeBuyer === f)!);
      expect(std.deposit).toBe(price * 0.1);
      expect(fhb.premium).toBeLessThan(std.premium);
    }
  });
});
