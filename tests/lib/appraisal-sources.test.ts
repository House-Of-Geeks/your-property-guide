// The sourced figures the appraisal and valuation pages repeat
// (src/lib/data/appraisal-sources.ts). Fails when a figure drifts from what
// the source said on the date read, or when a page types it by hand.
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  API_INDICATIVE_FEES_2026,
  FREE_ESTIMATORS,
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
    "src/app/(marketing)/property-valuation/page.tsx",
    "src/app/(marketing)/guides/how-much-is-my-house-worth-australia/page.tsx",
    "src/app/(marketing)/appraisal/page.tsx",
    "src/app/(marketing)/guides/how-to-prepare-for-a-property-appraisal/page.tsx",
  ];
  for (const f of files) {
    it(f, () => {
      const src = fs.readFileSync(f, "utf8").replace(/^\s*\/\/.*$/gm, "");
      expect(src, f).not.toMatch(/\$300 (to|and) \$[0-9]{3}/);
    });
  }
});

describe("free estimators table (section 3.3)", () => {
  it("lists six tools alphabetically, each with its own page and the date read", () => {
    const names = FREE_ESTIMATORS.map((t) => t.name);
    expect(names).toHaveLength(6);
    expect([...names].sort((a, b) => a.localeCompare(b))).toEqual(names);
    for (const t of FREE_ESTIMATORS) {
      expect(t.href).toMatch(/^https:\/\//);
      expect(t.read).toBe("11 October 2026");
      expect(`${t.name} ${t.says}`).not.toMatch(/\bbest\b|most accurate|top/i);
    }
  });
  it("the valuation page renders the table from the data file and says it is not a ranking", () => {
    const src = fs.readFileSync("src/app/(marketing)/property-valuation/page.tsx", "utf8");
    expect(src).toContain("FREE_ESTIMATORS.map(");
    expect(src).toContain("listed alphabetically, not ranked");
    const description = (src.match(/const DESCRIPTION =\s*`([^`]+)`/)?.[1] ?? "").replace("${valuationCostRange()}", valuationCostRange());
    expect(description.length).toBeGreaterThan(100);
    expect(description.length).toBeLessThanOrEqual(160);
  });
});

describe("house-worth guide (section 3.6)", () => {
  const src = fs.readFileSync("src/app/(marketing)/guides/how-much-is-my-house-worth-australia/page.tsx", "utf8");
  it("answers the free report and valuation cost questions as FAQs", () => {
    expect(src).toContain('question: "Where can I get a free property valuation report?"');
    expect(src).toContain('question: "How much do property valuations cost?"');
  });
  it("keeps the three-numbers comparison on /property-valuation instead of repeating it", () => {
    expect(src).not.toContain('id="why-they-differ"');
    expect(src).not.toMatch(/<h3>\d\. The (agent appraisal|bank valuation|online estimate)<\/h3>/);
    expect(src).toMatch(/<Link href="\/property-valuation">/);
  });
  it("cites pages that state what the guide relies on, not home pages", () => {
    expect(src).not.toMatch(/href: "https:\/\/(www\.)?(corelogic\.com\.au|api\.org\.au|moneysmart\.gov\.au)\/"/);
  });
});

describe("/appraisal FAQs (section 3.7)", () => {
  const src = fs.readFileSync("src/app/(marketing)/appraisal/page.tsx", "utf8");
  it("answers the market value and red flag questions with the state rules, dated", () => {
    expect(src).toContain('question: "How do I find the market value of a property?"');
    expect(src).toContain('question: "What is a red flag on an appraisal?"');
    expect(src).toContain("cite(CAV_PROPERTY_PRICES");
    expect(src).toContain("cite(NSW_AGENCY_AGREEMENTS");
    expect(src).not.toContain("$300 to $800");
  });
});
