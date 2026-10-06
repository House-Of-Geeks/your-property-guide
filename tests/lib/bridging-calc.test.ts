// Bridging loans plan (6 Oct 2026): the bridging calculator's engine, which
// also prints the cost table and worked example on /guides/bridging-loans-guide.
import { describe, expect, it } from "vitest";
import { BRIDGING_LENDERS, PUBLISHED_CAPITALISED_RATES } from "@/lib/data/bridging-lenders";
import {
  BRIDGING_CALCULATOR_SOURCE,
  bridgingCalculatorSource,
  EXAMPLE_BRIDGING_RATE,
  PEAK_LVR_CAP,
  capitalisedInterest,
  computeBridging,
  defaultBridgingInput,
  monthlyRepayment,
  purchaseStampDuty,
  type BridgingInput,
} from "@/lib/bridging-calc";

const input = (over: Partial<BridgingInput>): BridgingInput => ({ ...defaultBridgingInput("NSW"), ...over });

describe("capitalised interest", () => {
  it("compounds monthly on the amount bridged", () => {
    // $500,000 at 7.5% for 6 months: 500,000 × (1.00625^6 − 1)
    expect(capitalisedInterest(500_000, 7.5, 6)).toBe(19_045);
    expect(capitalisedInterest(100_000, 7.5, 3)).toBe(1_887);
    expect(capitalisedInterest(100_000, 7.5, 6)).toBe(3_809);
    expect(capitalisedInterest(100_000, 7.5, 12)).toBe(7_763);
  });
  it("is the full rate on the amount, far more than the 1-point margin alone", () => {
    const marginOnly = 500_000 * 0.01 * 0.5;
    expect(capitalisedInterest(500_000, 7.5, 6)).toBeGreaterThan(marginOnly * 7);
  });
  it("is zero with nothing bridged, no rate or no months", () => {
    expect(capitalisedInterest(0, 7.5, 6)).toBe(0);
    expect(capitalisedInterest(500_000, 0, 6)).toBe(0);
    expect(capitalisedInterest(500_000, 7.5, 0)).toBe(0);
  });
});

describe("the worked example", () => {
  const i = defaultBridgingInput("NSW");
  const res = computeBridging(i);

  it("adds stamp duty, buying costs and fees to the starting debt", () => {
    expect(res.stampDuty).toBe(purchaseStampDuty(1_500_000, "NSW"));
    expect(res.startingDebt).toBe(400_000 + 1_500_000 + res.stampDuty + i.buyingCosts + i.loanFees);
  });
  it("bridges exactly the net sale proceeds and capitalises interest on that part", () => {
    expect(res.netSaleProceeds).toBe(1_100_000 - i.sellingCosts);
    expect(res.bridgingLoan).toBe(res.netSaleProceeds);
    expect(res.capitalisedInterest).toBe(capitalisedInterest(res.netSaleProceeds, EXAMPLE_BRIDGING_RATE, 6));
    expect(res.bridgingInterest).toBe(res.capitalisedInterest);
  });
  it("leaves end debt equal to peak debt less the net sale proceeds", () => {
    expect(res.peakDebt).toBe(res.startingDebt + res.capitalisedInterest);
    expect(res.endDebt).toBe(res.peakDebt - res.netSaleProceeds);
    expect(res.peakLvr).toBeLessThanOrEqual(PEAK_LVR_CAP);
    expect(res.withinCap).toBe(true);
  });
  it("prices bridging as interest plus fees", () => {
    expect(res.bridgingCost).toBe(res.capitalisedInterest + i.loanFees);
  });
});

describe("interest paid monthly (CBA, ANZ)", () => {
  const capitalised = computeBridging(input({ interestMode: "capitalised" }));
  const monthly = computeBridging(input({ interestMode: "monthly" }));

  it("adds nothing to peak debt and charges simple interest each month", () => {
    expect(monthly.capitalisedInterest).toBe(0);
    expect(monthly.peakDebt).toBe(monthly.startingDebt);
    expect(monthly.monthlyBridgingInterest).toBe(Math.round((monthly.bridgingLoan * EXAMPLE_BRIDGING_RATE) / 100 / 12));
    expect(monthly.bridgingInterest).toBe(monthly.monthlyBridgingInterest * 6);
  });
  it("costs a little less than capitalising, because there is no interest on interest", () => {
    expect(monthly.bridgingInterest).toBeLessThan(capitalised.bridgingInterest);
    expect(monthly.endDebt).toBeLessThan(capitalised.endDebt);
  });
});

describe("the example rate and the lender table", () => {
  it("keeps the example bridging rate inside the published capitalised rates", () => {
    expect(EXAMPLE_BRIDGING_RATE).toBeGreaterThanOrEqual(PUBLISHED_CAPITALISED_RATES.low);
    expect(EXAMPLE_BRIDGING_RATE).toBeLessThanOrEqual(PUBLISHED_CAPITALISED_RATES.high);
  });
  it("sources every lender row from an Australian lender domain", () => {
    for (const l of BRIDGING_LENDERS) {
      expect(l.sources.length, l.lender).toBeGreaterThan(0);
      for (const src of l.sources) expect(src.href, l.lender).toMatch(/^https:\/\/[a-z.]+\.com\.au\//);
    }
  });
});

describe("edges", () => {
  it("never bridges more than is borrowed, and reports a surplus when the sale clears the debt", () => {
    const res = computeBridging(input({ salePrice: 3_000_000, mortgageOwing: 0, purchasePrice: 500_000 }));
    expect(res.bridgingLoan).toBe(res.startingDebt);
    expect(res.endDebt).toBe(0);
    expect(res.surplus).toBeGreaterThan(0);
    expect(res.monthlyRepayment).toBe(0);
  });
  it("flags a peak debt above the 80% cap", () => {
    const res = computeBridging(input({ salePrice: 800_000, mortgageOwing: 700_000, purchasePrice: 1_200_000 }));
    expect(res.peakLvr).toBeGreaterThan(PEAK_LVR_CAP);
    expect(res.withinCap).toBe(false);
  });
  it("reduces the debt by savings put in", () => {
    const a = computeBridging(input({ savings: 0 }));
    const b = computeBridging(input({ savings: 100_000 }));
    expect(a.startingDebt - b.startingDebt).toBe(100_000);
  });
  it("is invalid without a sale price or a purchase price", () => {
    expect(computeBridging(input({ salePrice: 0 })).status).toBe("invalid");
    expect(computeBridging(input({ purchasePrice: 0 })).status).toBe("invalid");
  });
  it("costs the sell-first route as rent for the same months plus the second move", () => {
    const res = computeBridging(input({ weeklyRent: 600, months: 6, extraMoveCost: 3_000 }));
    expect(res.sellFirstCost).toBe(Math.round(600 * (52 / 12) * 6 + 3_000));
  });
});

describe("monthly repayment", () => {
  it("matches the standard principal-and-interest formula", () => {
    // $600,000 at 6% over 30 years is $3,597 a month.
    expect(monthlyRepayment(600_000, 6, 30)).toBe(3_597);
    expect(monthlyRepayment(0, 6, 30)).toBe(0);
  });
});

describe("lead source", () => {
  it("tags every appraisal request from the calculator, with or without a suburb", () => {
    expect(bridgingCalculatorSource("bondi-nsw-2026")).toBe("bridging-calculator-bondi-nsw-2026");
    expect(bridgingCalculatorSource()).toBe(BRIDGING_CALCULATOR_SOURCE);
    expect(bridgingCalculatorSource().startsWith("bridging-calculator")).toBe(true);
  });
});
