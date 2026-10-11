// /real-estate-commission-calculator (commercial-intent review, 10 Oct 2026, selling 0.11 and P4).
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const src = readFileSync("src/app/(marketing)/real-estate-commission-calculator/page.tsx", "utf8");

describe("commission calculator FAQ", () => {
  it("answers how to calculate a commission instead of quoting competitors' referral fees", () => {
    expect(src).not.toMatch(/comparison websites|referral fee|refuse to pay/i);
    expect(src).toContain('question: "How do you calculate a commission?"');
    // The worked sums in the answer.
    expect((800_000 * 2) / 100).toBe(16_000);
    expect(16_000 * 1.1).toBe(17_600);
    expect(16_000 + 0.1 * (850_000 - 800_000)).toBe(21_000);
    expect(src).toContain("$800,000 at 2% is $16,000, plus $1,600 GST, $17,600 in total");
  });
});
