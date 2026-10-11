// /guides/cost-of-selling-a-house-australia (commercial-intent review, 10 Oct 2026, selling P2 and 0.3).
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { nationalSellingCost } from "@/lib/data/selling-costs";

const src = readFileSync("src/app/(marketing)/guides/cost-of-selling-a-house-australia/page.tsx", "utf8");

describe("national cost of selling guide", () => {
  it("leads with the dollar range from the state tables and puts a figure in each cost heading", () => {
    expect(src).toContain('title: "Cost of Selling a House in Australia (2026): Fees by State",');
    expect(src).toContain("const COST = nationalSellingCost(PRICE);");
    for (const line of ["MARKETING", "CONVEYANCING", "AUCTIONEER", "DISCHARGE"]) expect(src).toContain(`{lineRange(${line})}</h2>`);
    expect(src).toContain('<h2 id="clearance">The ATO clearance certificate</h2>');
    expect(src).toContain("{STATE_TABLES.map((t) => (");
    const c = nationalSellingCost(800_000);
    expect(c.low).toBeLessThan(c.high);
  });
  it("types no national total, has no figure-free worked example, and cites deep links", () => {
    expect(src).not.toMatch(/2 to 4 per cent|2–4%|A few thousand dollars|href: "https:\/\/moneysmart\.gov\.au\/"|href: "https:\/\/www\.ato\.gov\.au" ,|"https:\/\/www\.ato\.gov\.au", note/);
    expect(src).toContain('question: "Who pays the most closing costs?"');
    expect(src).toContain('question: "How do I calculate the cost of selling a house?"');
    expect(src).toContain('<Link href="/guides/what-to-fix-before-selling-a-house">what to fix before selling a house</Link>');
  });
});
