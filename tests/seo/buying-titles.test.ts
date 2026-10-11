// Commercial-intent review 10 Oct 2026, buying section 3: the <title> each
// buying guide should carry (the query first, within 60 characters before
// the " | Your Property Guide" suffix), read from the page's metadata.
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const TITLES: Array<[string, string]> = [
  ["help-to-buy-scheme-australia", "Help to Buy Scheme 2026: Income Limits, Price Caps & Rules"],
  ["first-home-owner-grant-australia", "First Home Owner Grant 2026: Amounts and Caps by State"],
  ["lenders-mortgage-insurance-guide", "Lenders Mortgage Insurance 2026: What It Costs, How to Avoid"],
  ["how-much-deposit-to-buy-a-house", "How Much Deposit Do You Need for a House? 2026 Guide"],
  ["first-home-guarantee", "5% Deposit Scheme 2026: Price Caps, Eligibility, No LMI"],
  ["first-home-super-saver-scheme", "First Home Super Saver Scheme 2026: Limits, Tax, How to Use"],
  ["buying-property-australia", "How to Buy a House in Australia: 10 Steps (2026)"],
];

describe("buying guide titles", () => {
  for (const [slug, title] of TITLES) {
    it(`${slug}: "${title}"`, async () => {
      const mod = await import(`../../src/app/(marketing)/guides/${slug}/page`);
      expect(mod.metadata.title).toBe(title);
      expect(title.length).toBeLessThanOrEqual(60);
    }, 30_000);
  }
});

describe("/guides/buying-property-australia upfront costs (buying 3.12)", () => {
  // The page renders a router-bound search box, so this reads its source.
  it("computes the lead's NSW duty and the by-state table from the engines, and drops the old figures", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const src = fs.readFileSync(path.resolve(__dirname, "../../src/app/(marketing)/guides/buying-property-australia/page.tsx"), "utf8");
    expect(src).toContain('const NSW_750K = fmt(dutyFor("NSW", 750_000, "owner").total);');
    expect(src).toContain("stamp duty alone");
    expect(src).toContain('<ScrollTable label="Upfront costs of buying a $750,000 house by state">');
    for (const old of ["$14,175", "$26,857", "$400 to $800", "$10,000 to $18,000", "3% to 5%", "$1,000 to $3,000"]) expect(src, old).not.toContain(old);
  });
});
