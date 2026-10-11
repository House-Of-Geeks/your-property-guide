// Fix items 10 and 12: the state cost tables and the People-also-ask FAQs on the commission guides.
import { readFileSync } from "node:fs";
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
    const r = STATE_RATES.NSW;
    const at = (rate: number) => Math.round((800_000 * rate) / 100);
    expect(t.price).toBe(800_000);
    expect(t.commission).toMatchObject({ lowAmount: at(r.low), typicalAmount: at(r.typical), highAmount: at(r.high) });
    expect(t.totalLow).toBe(at(r.low) + 2_000 + 800 + 300);
    expect(t.totalHigh).toBe(at(r.high) + 8_000 + 2_500 + 600 + 1_200 + 400);
    expect(t.totalLowPct).toBe(Math.round((t.totalLow / 800_000) * 1000) / 10);
    expect(t.totalHighPct).toBe(Math.round((t.totalHigh / 800_000) * 1000) / 10);
    expect(t.totalHighWithGst).toBe(t.totalHigh + Math.round(at(r.high) * 0.1));
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

describe("commission copy (review 10 Oct 2026, selling 0.4)", () => {
  const pages = ["real-estate-agent-fees-australia", ...STATES.map((s) => `real-estate-commission-${s.toLowerCase()}`)];
  it("no longer says a better agent 'earns back their commission many times over', and shows the arithmetic instead", () => {
    // $20,000 against the $1,600 gap between 1.8% and 2% on $800,000 is 12.5 times.
    expect(20_000 / ((800_000 * (2 - 1.8)) / 100)).toBeGreaterThan(12);
    for (const p of pages) {
      const src = readFileSync(`src/app/(marketing)/guides/${p}/page.tsx`, "utf8");
      expect(src).not.toMatch(/many times( over)?/);
    }
    const fees = readFileSync("src/app/(marketing)/guides/real-estate-agent-fees-australia/page.tsx", "utf8");
    expect(fees).toContain("covers the $1,600 gap between a 1.8% and a 2% quote on $800,000 more than twelve times");
  });
});

describe("valuation wording (review 10 Oct 2026, selling 0.9)", () => {
  it("promises no 'accurate value': the guides offer a realistic price range", () => {
    for (const s of STATES) {
      const src = readFileSync(`src/app/(marketing)/guides/real-estate-commission-${s.toLowerCase()}/page.tsx`, "utf8");
      expect(src).not.toMatch(/accurate (value|read)|you can trust/i);
      expect(src).toContain("realistic price range");
    }
  });
});
