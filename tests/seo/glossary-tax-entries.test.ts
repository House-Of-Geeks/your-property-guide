// The CGT and negative gearing glossary entries gave the pre-2027 rules with
// no date (commercial-intent review 10 Oct 2026, finance-tax F5). The CGT
// entry ranks on its own ("cgt on property", 178 Google impressions in 90
// days) and the negative gearing entry is auto-linked from articles.
import { describe, expect, it } from "vitest";
import { GLOSSARY_TERMS } from "@/lib/data/glossary";

const entry = (slug: string) => {
  const t = GLOSSARY_TERMS.find((g) => g.slug === slug);
  if (!t) throw new Error(`no glossary term ${slug}`);
  return t;
};

describe("glossary: tax entries carry the 1 July 2027 law", () => {
  it("capital gains tax: the discount to 1 July 2027, then indexation and the minimum tax", () => {
    const { html } = entry("capital-gains-tax-cgt");
    expect(html).toContain("before 1 July 2027");
    expect(html).toContain("at least 12 months");
    expect(html).toContain("cost base indexation and a 30% minimum tax");
    expect(html).toContain("including on property you already own");
    expect(html).toContain("ATO, last updated 29 June 2026");
    expect(html).toContain('href="/guides/cgt-changes-2026-budget"');
    expect(html).not.toContain("Properties held for more than 12 months receive a 50% CGT discount.");
  });

  it("negative gearing: the cut-off, the quarantine and who keeps it", () => {
    const { html } = entry("negative-gearing");
    expect(html).toContain("7:30pm AEST on 12 May 2026");
    expect(html).toContain("From 1 July 2027");
    expect(html).toContain("new builds keep negative gearing");
    expect(html).toContain("ATO, last updated 29 June 2026");
    expect(html).toContain('href="/guides/negative-gearing-changes-2026-budget"');
  });
});

describe("glossary term names", () => {
  it("are plain text, with no HTML entities (the search page, rails and links print them as text)", () => {
    for (const t of GLOSSARY_TERMS) expect(t.term, t.slug).not.toMatch(/&[a-z]+;|&#\d+;/i);
  });

  it("keep their slugs: no URL changes", () => {
    expect(GLOSSARY_TERMS.find((t) => t.slug === "buyer-apos-s-agent")?.term).toBe("Buyer's Agent");
    expect(GLOSSARY_TERMS.find((t) => t.slug === "vendor-apos-s-statement")?.term).toBe("Vendor's Statement");
  });
});
