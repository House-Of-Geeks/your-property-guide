// Commercial-intent review (10 Oct 2026), new homes F7 and section 3.2: the
// /renovating hub carries no cost or return figure of its own (the sourced
// figures live in src/lib/data/renovation-costs.ts and the guide), and no
// FAQ repeats one of the renovation guide's questions with a different answer.
import { describe, expect, it } from "vitest";
import { PERSONA_HUB_CONTENT } from "@/lib/persona-hub-content";
import { RENOVATION_FAQS } from "@/lib/data/renovation-costs";

const hub = PERSONA_HUB_CONTENT.renovating;
const allText = [
  hub.metaTitle,
  hub.metaDescription,
  hub.deepDive.heading,
  ...hub.deepDive.paragraphs,
  hub.calculatorsBlurb,
  ...hub.calculators.map((c) => `${c.label} ${c.blurb}`),
  ...hub.faqs.map((f) => `${f.question} ${f.answer}`),
].join("\n");

describe("/renovating hub content", () => {
  it("is retitled away from cost queries, inside the SERP budget", () => {
    expect(hub.metaTitle).toBe("Renovating Your Home: Finance, Builders and Approvals");
    expect(hub.metaTitle.length).toBeLessThanOrEqual(60);
    expect(hub.metaDescription.length).toBeLessThanOrEqual(160);
    expect(hub.metaTitle).not.toMatch(/cost|roi/i);
  });
  it("prints no dollar, percentage or per-square-metre figure", () => {
    expect(allText).not.toMatch(/\$\d/);
    expect(allText).not.toMatch(/\d\s?%/);
    expect(allText).not.toMatch(/per square metre/);
  });
  it("shares no FAQ question with the renovation guide", () => {
    const guideQuestions = new Set(RENOVATION_FAQS.map((f) => f.question.toLowerCase()));
    for (const f of hub.faqs) expect(guideQuestions.has(f.question.toLowerCase()), f.question).toBe(false);
    expect(hub.faqs.map((f) => f.question)).not.toContain("Do I need council approval to renovate?");
    expect(hub.faqs.map((f) => f.question)).not.toContain("How much does a kitchen renovation cost in Australia?");
  });
  it("links the cost guide, the builder guide and the granny flat guides, and names the approval instruments", () => {
    const hrefs = hub.calculators.map((c) => c.href);
    expect(hrefs).toContain("/guides/renovation-cost-australia-2026");
    expect(hrefs).toContain("/guides/how-to-find-a-builder-australia");
    expect(hrefs.some((h) => h.startsWith("/guides/granny-flat-guide-"))).toBe(true);
    expect(allText).toContain("State Environmental Planning Policy (Exempt and Complying Development Codes) 2008");
    expect(allText).toContain("Building Act 1993");
    expect(allText).toContain("Planning Act 2016");
  });
});
