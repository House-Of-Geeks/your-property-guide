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
