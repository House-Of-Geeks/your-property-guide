// Content gap 10: the selling costs calculator and the eight state guides.
import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { computeSellingCosts, defaultSellingCostsInput } from "@/lib/selling-costs-calc";
import { COST_OF_SELLING_STATE, COST_OF_SELLING_STATES } from "@/lib/data/cost-of-selling-state";
import { STATE_RATES } from "@/lib/data/commission-rates";
import { sellingCostTable } from "@/lib/data/selling-costs";

describe("computeSellingCosts", () => {
  it("adds GST to commission unless the quote includes it, and only counts conditional lines when they apply", () => {
    const base = { ...defaultSellingCostsInput("NSW", 800_000), marketing: 4_000, conveyancing: 1_400, documents: 450 };
    const r = computeSellingCosts(base);
    expect(r.commission).toBe(16_000);           // 2.0% of $800,000
    expect(r.commissionGst).toBe(1_600);
    expect(r.lines.map((l) => l.key)).toEqual(["commission", "gst", "marketing", "conveyancing", "documents"]);
    expect(r.totalCosts).toBe(16_000 + 1_600 + 4_000 + 1_400 + 450);
    expect(r.netBeforeLoan).toBe(800_000 - r.totalCosts);
    expect(r.netAfterLoan).toBe(r.netBeforeLoan);

    const incl = computeSellingCosts({ ...base, commissionIncludesGst: true });
    expect(incl.commissionGst).toBe(0);
    expect(incl.lines.find((l) => l.key === "gst")).toBeUndefined();

    const full = computeSellingCosts({ ...base, auction: true, auctioneer: 900, loanBalance: 300_000, discharge: 300, presentation: 3_000, other: 250 });
    expect(full.lines.map((l) => l.key)).toContain("auctioneer");
    expect(full.lines.map((l) => l.key)).toContain("discharge");
    expect(full.totalCosts).toBe(r.totalCosts + 900 + 300 + 3_000 + 250);
    expect(full.netAfterLoan).toBe(800_000 - full.totalCosts - 300_000);
    expect(full.costPct).toBe(Math.round((full.totalCosts / 800_000) * 1000) / 10);
  });
  it("ignores the discharge fee when there is no loan and the auctioneer when there is no auction", () => {
    const r = computeSellingCosts({ ...defaultSellingCostsInput("VIC", 700_000), auction: false, auctioneer: 900, loanBalance: 0, discharge: 300 });
    expect(r.lines.map((l) => l.key)).not.toContain("auctioneer");
    expect(r.lines.map((l) => l.key)).not.toContain("discharge");
  });
  it("starts each state at its typical rate and the mid-point of its documents range", () => {
    for (const s of COST_OF_SELLING_STATES) {
      const d = defaultSellingCostsInput(s, 800_000);
      const t = sellingCostTable(s);
      expect(d.commissionRate).toBe(STATE_RATES[s].typical);
      expect(d.documents).toBe(Math.round((t.documents.low + t.documents.high) / 2));
    }
  });
  it("clamps negative inputs to zero and reports no percentage at a zero price", () => {
    const r = computeSellingCosts({ ...defaultSellingCostsInput("QLD", 0), marketing: -5, conveyancing: 0, documents: 0 });
    expect(r.commission).toBe(0);
    expect(r.lines.find((l) => l.key === "marketing")?.amount).toBe(0);
    expect(r.totalCosts).toBe(0);
    expect(r.costPct).toBe(0);
  });
});

describe("state cost guides", () => {
  it("cover all eight states with a route, a distinct slug, intro, differences, FAQs and sources", () => {
    const slugs = new Set<string>();
    for (const s of COST_OF_SELLING_STATES) {
      const g = COST_OF_SELLING_STATE[s];
      expect(g.state).toBe(s);
      expect(g.slug).toBe(`cost-of-selling-a-house-${s.toLowerCase()}`);
      slugs.add(g.slug);
      expect(existsSync(join(__dirname, "../../src/app/(marketing)/guides", g.slug, "page.tsx"))).toBe(true);
      expect(g.intro.length).toBeGreaterThanOrEqual(2);
      expect(g.differences.length).toBeGreaterThanOrEqual(4);
      expect(g.faqs.length).toBe(5);
      expect(g.sources.length).toBeGreaterThanOrEqual(5);
      expect(g.capitalMedian).toBeGreaterThan(500_000);
    }
    expect(slugs.size).toBe(8);
  });
  it("keeps the FAQ dollar figures consistent with the cost table at the example price", () => {
    // The first FAQ quotes the commission range at the state's example price.
    for (const s of COST_OF_SELLING_STATES) {
      const t = sellingCostTable(s);
      const a = COST_OF_SELLING_STATE[s].faqs[0].answer;
      expect(a).toContain(t.commission.lowAmount.toLocaleString("en-AU"));
      expect(a).toContain(t.commission.highAmount.toLocaleString("en-AU"));
    }
  });
});
