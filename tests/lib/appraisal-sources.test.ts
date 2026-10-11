// The sourced figures the appraisal and valuation pages repeat
// (src/lib/data/appraisal-sources.ts). Fails when a figure drifts from what
// the source said on the date read, or when a page types it by hand.
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  API_INDICATIVE_FEES_2026,
  AUSSIE_GUIDE,
  VALUATION_COST,
  cite,
  valuationCostCited,
  valuationCostRange,
} from "@/lib/data/appraisal-sources";

describe("valuation cost", () => {
  it("is ANZ's $300 to $600, read 11 October 2026", () => {
    expect([VALUATION_COST.low, VALUATION_COST.high]).toEqual([300, 600]);
    expect(VALUATION_COST.quote).toContain("$300 to $600");
    expect(valuationCostRange()).toBe("$300 to $600");
    expect(valuationCostCited()).toBe("$300 to $600 (ANZ, read 11 October 2026)");
  });
  it("carries the API 2026 indicative fees as Aussie reports them (updated 1 October 2026)", () => {
    expect(API_INDICATIVE_FEES_2026.map((f) => [f.low, f.high])).toEqual([[220, 385], [330, 495], [440, 880]]);
    expect(cite(AUSSIE_GUIDE, "Aussie")).toBe("Aussie, updated 1 October 2026");
  });
});

describe("no page in the vertical types the valuation cost by hand", () => {
  const files = [
    "src/lib/suburb-agents.ts",
    "src/app/(marketing)/suburbs/[slug]/agents/page.tsx",
  ];
  for (const f of files) {
    it(f, () => {
      const src = fs.readFileSync(f, "utf8").replace(/^\s*\/\/.*$/gm, "");
      expect(src, f).not.toMatch(/\$300 (to|and) \$[0-9]{3}/);
    });
  }
});
