// Commercial-intent review 10 Oct 2026, 0.2 item 11 and buying 0.1 rows 17
// and 20: the buying vertical's lead blocks promised "one vetted specialist"
// and a calculator told readers "You look eligible". Each block now carries
// the #57 disclosure (one specialist receives your details and pays us a fee)
// and no vetting, matching or eligibility promise.
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = path.resolve(__dirname, "../..");
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), "utf8");

const FILES = [
  "src/app/(marketing)/guides/first-home-super-saver-scheme/page.tsx",
  "src/app/(marketing)/guides/help-to-buy-scheme-australia/page.tsx",
  "src/app/(marketing)/guides/shared-equity-schemes-australia/page.tsx",
  "src/app/(marketing)/guides/use-super-to-buy-a-house/page.tsx",
  "src/components/guide/HelpToBuyStateGuide.tsx",
  "src/components/calculators/FhssCalculator.tsx",
  "src/components/calculators/HelpToBuyCalculator.tsx",
];

describe("buying lead blocks", () => {
  for (const f of FILES) {
    it(`${f}: no vetting promise, and the fee disclosure where a specialist is offered`, () => {
      const src = read(f);
      expect(src).not.toMatch(/vetted/i);
      expect(src).not.toMatch(/we(?:&rsquo;|')ll introduce one/);
      expect(src).toMatch(/pays us a fee/);
    });
  }

  it("/help-to-buy-calculator says who decides eligibility, and never 'You look eligible'", () => {
    const src = read("src/components/calculators/HelpToBuyCalculator.tsx");
    expect(src).not.toContain("You look eligible");
    expect(src).toContain("Housing Australia and the lender decide eligibility");
  });
});

describe("/guides/buyers-agent-cost-australia", () => {
  const src = read("src/app/(marketing)/guides/buyers-agent-cost-australia/page.tsx");
  it("names the NSW licence the regulator names, with its source, and no stock and station licence", () => {
    expect(src).not.toContain("Stock and Station");
    expect(src).toContain("a real estate agent's licence, or hold a certificate of registration");
    expect(src).toContain("using-a-real-estate-agent-to-buy-a-property");
  });
  it("offers one buyer introduction with the fee disclosure, not a vetted directory or the selling guide", () => {
    expect(src).not.toMatch(/vetted|Browse buyer/i);
    expect(src).toContain('"/find-an-expert?intent=buying"');
    expect(src).toContain("pays us a fee for the introduction");
    expect(src).not.toContain("<MatchCTA kind=\"buyers-agent\" />");
  });
  it("prints no unsourced market fee range", () => {
    for (const old of ["$8,000 to $25,000", "$10,000 to $18,000", "$500 to $1,500", "1.5% to 3%", "$15,000 to $25,000"]) expect(src, old).not.toContain(old);
  });
});
