// /guides/property-depreciation-guide (commercial-intent review 10 Oct 2026,
// finance-tax P13): "schedule" in the title and H1, the PAA answers, and the
// effective lives and dates checked against the ATO and LI 2025/20 (carpet 8
// years, not 10; dishwashers 8, not 10; ceiling fans 5, not 15; construction
// started after 15 September 1987; 40 years from completion).
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const src = readFileSync(join(__dirname, "../../src/app/(marketing)/guides/property-depreciation-guide/page.tsx"), "utf8");

describe("/guides/property-depreciation-guide", () => {
  it("targets 'depreciation schedule' in a title of 60 characters or fewer", () => {
    const title = src.match(/title: "([^"]+)",\n  h1:/)![1];
    expect(title).toBe("Property Depreciation Schedule: What Investors Claim (2026)");
    expect(title.length).toBeLessThanOrEqual(60);
    expect(src).toContain('h1: "Property depreciation and tax depreciation schedules: what investors can claim (2026)"');
    const desc = src.match(/description:\n    "([^"]+)"/)![1];
    expect(desc.length).toBeLessThanOrEqual(160);
  });

  it("answers the PAA questions", () => {
    for (const id of ['id="own-schedule"', 'id="how-long"', 'id="ato-tables"']) expect(src).toContain(id);
  });

  it("uses the ATO's dates and the Commissioner's effective lives", () => {
    expect(src).not.toMatch(/after 16 September 1987/);
    expect(src).toContain("after 15 September 1987");
    expect(src).toContain("<td>Carpet</td><td>8 years</td>");
    expect(src).toContain("<td>Dishwasher</td><td>8 years</td>");
    expect(src).toContain("<td>Ceiling fans</td><td>5 years</td>");
    expect(src).not.toContain("ATO-recognised");
    expect(src).toContain("<Sources items={[ATO_CAPITAL_WORKS, EFFECTIVE_LIFE, ATO_COST_BASE]} />");
  });
});
