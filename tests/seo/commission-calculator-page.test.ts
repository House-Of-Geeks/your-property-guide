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

describe("commission calculator page body (review 10 Oct 2026, selling 0.3, 0.8, P4)", () => {
  it("server-renders the sourced state table and the formula, and links every selling cost", () => {
    expect(src).toContain("<NationalCommissionTable price={800_000} />");
    expect(src).toContain('<h2 id="how-to-calculate">How to calculate real estate commission</h2>');
    expect(src).toContain('<Link href="/selling-costs-calculator">every selling cost, with net proceeds</Link>');
    expect(src).toContain('question: "Is 2% a good commission?"');
  });
  it("makes no unsourced rank or result claims and types no national range", () => {
    expect(src).not.toMatch(/cheapest market in the country|highest typical rates|routinely\s+ten times|3% to 5%|1\.6% and 3\.25%|\$2,000 to \$10,000/);
  });
});
