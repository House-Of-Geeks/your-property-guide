// /selling-costs-calculator (commercial-intent review, 10 Oct 2026, selling 0.3, 0.6d, P6).
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const src = readFileSync("src/app/(marketing)/selling-costs-calculator/page.tsx", "utf8");

describe("selling costs calculator page", () => {
  it("server-renders the state table at $800,000 and a sources block", () => {
    expect(src).toContain('<h2 id="by-state">What it costs to sell an $800,000 house, by state</h2>');
    expect(src).toContain("{STATE_TABLES.map((t) => (");
    expect(src).toContain("<Sources");
    expect(src).toContain('question: "How do I calculate the cost of selling a house?"');
  });
  it("takes its totals from the data, keeps the title in budget, and drops the unsourced GST claim", () => {
    expect(src).not.toMatch(/2% to 4%|\$17,000 to \$36,000|1\.6% to 3\.25%|most quote their rate excluding GST|all-in/);
    const title = /const META_TITLE = "([^"]+)";/.exec(src)![1];
    expect(title.length).toBeLessThanOrEqual(60);
  });
});
