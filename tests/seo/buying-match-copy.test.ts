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
