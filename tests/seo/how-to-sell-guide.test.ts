// /guides/how-to-sell-a-house-australia (commercial-intent review, 10 Oct 2026, selling 0.12).
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const src = readFileSync("src/app/(marketing)/guides/how-to-sell-a-house-australia/page.tsx", "utf8");

describe("how to sell a house: capital gains tax", () => {
  it("dates the 50% discount to sales before 1 July 2027, links the CGT guide and cites the ATO", () => {
    expect(src).toContain("For a sale before 1 July 2027");
    expect(src).toContain("From 1 July 2027 the 50% discount is replaced by cost base indexation and a 30% minimum tax");
    expect(src).toContain('href="/guides/cgt-changes-2026-budget"');
    expect(src).toContain("ATO_REFORM_SOURCE,");
    expect(src).not.toMatch(/with a 50% discount if held for over twelve months/);
  });
});

describe("how to sell a house: costs (review 10 Oct 2026, selling 0.3 and P8)", () => {
  it("takes its cost figures from the shared data and links the national cost guide", () => {
    expect(src).toContain("nationalSellingCost(800_000)");
    expect(src).not.toMatch(/2\.5% to 4%|1\.5% to 3%|\$3,000 to \$10,000|\$300 to \$700|\$25k/);
    expect(src).toContain('<Link href="/guides/cost-of-selling-a-house-australia">what it costs to sell a house</Link>');
  });
});

describe("how to sell a house: steps (review 10 Oct 2026, selling P8)", () => {
  it("leads with the five steps, tables each state's documents from the sourced data, and makes no unsourced return claims", () => {
    expect(src).toContain('title: "How to Sell a House in Australia (2026): Steps and Costs",');
    expect(src).toContain("Selling a house in Australia runs in five steps");
    expect(src).toContain('<h2 id="contracts">Before you advertise: what each state requires</h2>');
    expect(src).toContain("const d = STATE_DOCUMENTS[st];");
    expect(src).toContain('<Link href="/guides/reserve-price-auction">reserve price guide</Link>');
    expect(src).not.toMatch(/3 to 10×|5× to 15×|5 to 15% higher|\$40,000 on a pre-sale/);
  });
});
