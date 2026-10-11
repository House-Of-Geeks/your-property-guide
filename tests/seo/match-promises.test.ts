// F4 and section 0.2 item 11 of the commercial-intent review (10 Oct 2026):
// the match and appraisal forms and the pages around them promise no agent
// "who sells in {suburb}", no reply time and no "right person"; each form
// carries the coverage caveat; the #57 fee disclosure stays.
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { COVERAGE_CAVEAT, MATCH_COVERAGE_CAVEAT, PROMISE_PATTERNS } from "@/lib/match-coverage";

const FILES = [
  "src/app/(marketing)/suburbs/[slug]/agents/page.tsx",
  "src/lib/suburb-agents.ts",
  "src/components/suburb/SuburbAppraisalCTA.tsx",
  "src/components/journey/MatchAgent.tsx",
  "src/app/(marketing)/appraisal/page.tsx",
  "src/app/(marketing)/appraisal/thanks/page.tsx",
  "src/app/(marketing)/property-valuation/page.tsx",
  "src/app/(marketing)/find-an-expert/page.tsx",
  "src/app/(marketing)/guides/how-much-is-my-house-worth-australia/page.tsx",
  "src/app/(marketing)/guides/how-to-choose-a-selling-agent/page.tsx",
  "src/app/(marketing)/guides/questions-to-ask-a-real-estate-agent/page.tsx",
  "src/app/(marketing)/guides/how-to-prepare-for-a-property-appraisal/page.tsx",
];

// Code comments may quote the old wording to explain the change.
const withoutComments = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

describe("no match or speed promises in the agents and appraisal vertical", () => {
  for (const f of FILES) {
    it(f, () => {
      const src = withoutComments(fs.readFileSync(f, "utf8"));
      for (const re of PROMISE_PATTERNS) expect(src, `${f} matches ${re}`).not.toMatch(re);
    });
  }
});

describe("every match and appraisal form carries the coverage caveat and the fee disclosure", () => {
  it("the caveats say what happens where there is no agent", () => {
    expect(COVERAGE_CAVEAT).toContain("we tell you rather than pass your details on");
    expect(MATCH_COVERAGE_CAVEAT).toContain("we tell you rather than pass your details on");
    expect(COVERAGE_CAVEAT).not.toMatch(/vetted/i);
  });
  it("the appraisal CTA prints the caveat beside the #57 disclosure", () => {
    const src = fs.readFileSync("src/components/suburb/SuburbAppraisalCTA.tsx", "utf8");
    expect(src).toContain("{COVERAGE_CAVEAT}");
    expect(src).toMatch(/one local agent we match you with, who\s+pays us for the introduction/);
  });
  it("the match form prints the caveat beside the #57 disclosure", () => {
    const src = fs.readFileSync("src/components/journey/MatchAgent.tsx", "utf8");
    expect(src).toContain("{MATCH_COVERAGE_CAVEAT}");
    expect(src).toMatch(/pays us a fee for the introduction/);
  });
  it("pages that embed the shared appraisal form print the caveat beside it", () => {
    for (const f of ["src/app/(marketing)/appraisal/page.tsx", "src/app/(marketing)/property-valuation/page.tsx"]) {
      const src = fs.readFileSync(f, "utf8");
      expect(src, f).toMatch(/<AppraisalForm \/>[\s\S]{0,200}\{COVERAGE_CAVEAT\}/);
    }
  });
  it("the agents page prints the caveat beside the match form", () => {
    const src = fs.readFileSync("src/app/(marketing)/suburbs/[slug]/agents/page.tsx", "utf8");
    expect(src).toContain("{COVERAGE_CAVEAT}");
  });
});
