// Section 3.5 of the 10 Oct 2026 review: the how-to-choose guide targets
// "how to choose a real estate agent", compares agents in a table, states
// the NSW, VIC and QLD rules with dated sources, and types no commission or
// marketing range by hand.
import fs from "node:fs";
import { describe, expect, it } from "vitest";

const src = fs.readFileSync("src/app/(marketing)/guides/how-to-choose-a-selling-agent/page.tsx", "utf8");

describe("/guides/how-to-choose-a-selling-agent", () => {
  it("titles for the query inside 60 characters, with a description inside 160", () => {
    const title = src.match(/title: "([^"]+)",/)?.[1] ?? "";
    const description = src.match(/description:\s*"([^"]+)",/)?.[1] ?? "";
    expect(title).toBe("How to Choose a Real Estate Agent to Sell Your Home (2026)");
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeLessThanOrEqual(160);
  });
  it("adds the comparison table and the law section", () => {
    expect(src).toContain('<h2 id="compare">How to compare real estate agents side by side</h2>');
    expect(src).toContain('<h2 id="law">What the law makes an agent tell you</h2>');
    expect(src).toContain("cite(NSW_AGENCY_AGREEMENTS");
    expect(src).toContain("cite(CAV_PROPERTY_PRICES");
    expect(src).toContain("cite(QLD_COMMISSION");
  });
  it("derives commission from STATE_RATES and drops the unsourced cost and period figures", () => {
    expect(src).toContain("STATE_RATES[st].low");
    expect(src).not.toMatch(/1\.5(%)? to 3%|1\.5% to 2\.2%|2% to 2\.8%|2\.5% to 3%/);
    expect(src).not.toMatch(/\$3K|\$3,000 to \$10,000|\$5,000 to \$15,000|\$400 to \$800|\$1,500 to \$4,000/);
    expect(src).not.toMatch(/60 to 180 days|180\+ day|60 days is typical/);
    expect(src).toContain("<Sources items={CHOOSE_AGENT_SOURCES} />");
  });
});
