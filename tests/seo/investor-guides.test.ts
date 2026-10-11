// Investor guides still used the retired 32.5% rate and described negative
// gearing with no 1 July 2027 change (found while fixing finance-tax F2 to F8,
// 11 Oct 2026).
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const page = (slug: string) => readFileSync(join(__dirname, "../../src/app/(marketing)/guides", slug, "page.tsx"), "utf8");

describe("investor guides", () => {
  it("capital growth vs cash flow: 2026-27 rates and the 2027 change", () => {
    const src = page("capital-growth-vs-cash-flow-australia");
    expect(src).not.toMatch(/32\.5 per cent/);
    expect(src).toContain("1 July 2027");
    expect(src).toContain('updatedAt: "2026-10-11"');
  });

  it("offset accounts: negative gearing qualified for 2027", () => {
    const src = page("offset-accounts-explained-australia");
    expect(src).toContain("from 1 July 2027 not for an established home");
    expect(src).toContain('updatedAt: "2026-10-11"');
  });
});
