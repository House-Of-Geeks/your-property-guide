// Fix items 10 and 12: the state cost tables and the People-also-ask FAQs on the commission guides.
import { describe, expect, it } from "vitest";
import { STATE_RATES, type StateCode } from "../../src/lib/data/commission-rates";
import { COMMISSION_PAA_FAQ } from "../../src/lib/data/commission-faqs";
import { EXAMPLE_PRICE, STATE_DOCUMENTS, sellingCostTable } from "../../src/lib/data/selling-costs";

const STATES = Object.keys(STATE_RATES) as StateCode[];

describe("commission rates", () => {
  it("cover the eight states with a typical rate inside the range", () => {
    expect(STATES).toHaveLength(8);
    for (const s of STATES) {
      const r = STATE_RATES[s];
      expect(r.low).toBeLessThan(r.high);
      expect(r.typical).toBeGreaterThanOrEqual(r.low);
      expect(r.typical).toBeLessThanOrEqual(r.high);
    }
  });
});

describe("selling-cost table", () => {
  it("works NSW through at $800,000: commission plus the always-payable lines at the low end, everything at the high end", () => {
    const t = sellingCostTable("NSW");
    expect(t.price).toBe(800_000);
    expect(t.commission).toMatchObject({ lowAmount: 14_400, typicalAmount: 16_000, highAmount: 20_000 });
    expect(t.totalLow).toBe(14_400 + 2_000 + 800 + 300);
    expect(t.totalHigh).toBe(20_000 + 8_000 + 2_500 + 600 + 1_200 + 400);
    expect(t.totalLowPct).toBe(2.2);
    expect(t.totalHighPct).toBe(4.1);
  });
  it("keeps every state near the national guide's 2 to 4 per cent before tax (the $600,000 states run higher at the top end)", () => {
    for (const s of STATES) {
      const t = sellingCostTable(s);
      expect(t.totalLowPct).toBeGreaterThanOrEqual(2);
      expect(t.totalHighPct).toBeLessThanOrEqual(6);
      expect(t.totalLow).toBeLessThan(t.totalHigh);
      expect(t.price).toBe(EXAMPLE_PRICE[s]);
    }
  });
  it("names a government source for every state's documents line", () => {
    for (const s of STATES) {
      const d = STATE_DOCUMENTS[s];
      expect(d.source.href).toMatch(/^https:\/\/[a-z0-9.-]+\.(gov|vic|nsw|qld|sa|wa|tas|nt|act)\.au\//i);
      expect(d.source.label.length).toBeGreaterThan(10);
      expect(d.low).toBeLessThan(d.high);
    }
  });
});

describe("People-also-ask FAQs", () => {
  it("one per state, each at least 40 words with a figure and a source, so the page stays at six questions", () => {
    for (const s of STATES) {
      const f = COMMISSION_PAA_FAQ[s];
      expect(f.question.endsWith("?")).toBe(true);
      expect(f.answer.split(/\s+/).length).toBeGreaterThanOrEqual(40);
      expect(f.answer).toMatch(/\$[0-9,]+|[0-9.]+%/);
      expect(f.answer).toMatch(/ATO|Consumer Affairs Victoria|Queensland Government|Consumer and Business Services|RevenueWA|State Revenue Office|Access Canberra|NT Government/);
    }
  });
  it("uses the same numbers as the cost table (Victoria's total)", () => {
    const t = sellingCostTable("VIC");
    expect(COMMISSION_PAA_FAQ.VIC.answer).toContain(`$${t.totalLow.toLocaleString("en-AU")} to $${t.totalHigh.toLocaleString("en-AU")}`);
  });
});
