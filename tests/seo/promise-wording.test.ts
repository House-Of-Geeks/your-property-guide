// No approval, borrowing, saving or match promises on the finance pages
// (commercial-intent review 10 Oct 2026, finance-tax F9; main report 0.2 item
// 11). The replacement wording: "an estimate of what a lender may lend" and
// "a broker compares many lenders' policies for your situation".
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PERSONA_HUB_CONTENT } from "@/lib/persona-hub-content";

const page = (p: string) => readFileSync(join(__dirname, "../../src/app/(marketing)", p, "page.tsx"), "utf8");

const PROMISES = [
  /will (actually )?approve/i,
  /actually approve/i,
  /saves you tens of thousands/i,
  /30\+ lenders/i,
  /We(&rsquo;|')ll match you/i,
  /\$30,000.\$120,000 in saved interest/i,
  /Usually yes, by 0\.10/i,
];

describe("promise wording", () => {
  for (const p of [
    "refinancing-calculator",
    "mortgage-calculator",
    "rba-cash-rate",
    "guides/how-to-choose-a-mortgage-broker",
    "guides/offset-accounts-explained-australia",
  ]) {
    it(`${p} makes no approval, saving or match promise`, () => {
      const src = page(p);
      for (const re of PROMISES) expect(src, `${p}: ${re}`).not.toMatch(re);
    });
  }

  it("the investing and upgrading hubs describe the borrowing calculator as an estimate", () => {
    for (const id of ["investing", "upgrading"] as const) {
      const card = PERSONA_HUB_CONTENT[id].calculators.find((c) => c.href === "/borrowing-power-calculator")!;
      expect(card.blurb).toBe("An estimate of what a lender may lend on your income and expenses, at the APRA buffer.");
      for (const c of PERSONA_HUB_CONTENT[id].calculators) for (const re of PROMISES) expect(c.blurb).not.toMatch(re);
    }
  });

  it("the upgrading hub's appraisal card discloses the fee, the #57 way", () => {
    const card = PERSONA_HUB_CONTENT.upgrading.calculators.find((c) => c.href === "/appraisal")!;
    expect(card.blurb).toContain("One agent receives your details and pays us a fee");
    expect(card.blurb).not.toMatch(/independent|vetted/i);
  });

  it("the broker guide describes our introduction with its fee, not as a vetted match", () => {
    const src = page("guides/how-to-choose-a-mortgage-broker");
    expect(src).not.toMatch(/vetted/i);
    expect(src).not.toContain("We run one");
    expect(src).toContain("one introduction to a mortgage broker, who receives your details and pays us a fee for the introduction");
  });

  it("the refinancing page prints no HTML entity inside a plain-text description", () => {
    expect(page("refinancing-calculator")).not.toMatch(/description: "[^"]*&[a-z]+;/);
  });
});
