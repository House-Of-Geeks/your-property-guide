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
