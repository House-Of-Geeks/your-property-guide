// /investing's FAQs described the 50% CGT discount and negative gearing with
// no mention of 1 July 2027 (commercial-intent review 10 Oct 2026, finance-tax
// F8). They render as FAQPage JSON-LD, so the law has to be in the answer text.
import { describe, expect, it } from "vitest";
import { PERSONA_HUB_CONTENT } from "@/lib/persona-hub-content";

const faq = (q: string) => {
  const f = PERSONA_HUB_CONTENT.investing.faqs.find((x) => x.question === q);
  if (!f) throw new Error(`no FAQ "${q}"`);
  return f.answer;
};

describe("/investing FAQs carry the 1 July 2027 law", () => {
  it("negative gearing: the cut-off, the quarantine and who keeps it, dated", () => {
    const a = faq("How does negative gearing work in Australia?");
    expect(a).toContain("From 1 July 2027");
    expect(a).toContain("7:30pm AEST on 12 May 2026");
    expect(a).toContain("new builds keep negative gearing");
    expect(a).toContain("ATO, last updated 29 June 2026");
  });

  it("CGT discount: before 1 July 2027 only, then indexation and the minimum, dated", () => {
    const a = faq("What is the 50% capital gains tax discount?");
    expect(a).toContain("On a sale before 1 July 2027");
    expect(a).toContain("at least 12 months");
    expect(a).toContain("cost base indexation and a 30% minimum tax");
    expect(a).toContain("including on property you already own");
    expect(a).toContain("ATO, last updated 29 June 2026");
  });

  it("uses no em dash in the investing and upgrading sections' FAQs", () => {
    for (const id of ["investing", "upgrading"] as const) {
      for (const f of PERSONA_HUB_CONTENT[id].faqs.filter((x) => /gearing|capital gains|company, trust/i.test(x.question))) {
        expect(f.answer, f.question).not.toContain("\u2014");
      }
    }
  });
});
