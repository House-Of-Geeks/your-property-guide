// The glossary auto-linker (src/lib/utils/glossary-linker.ts). On 10 Oct 2026
// it nested links: after linking "Mortgage Broker" it matched "mortgage"
// inside the new link's href, so readers saw raw markup on four posts. And a
// term ending in ")" ("Capital Gains Tax (CGT)") could never match `\b...\b`.
import { describe, expect, it } from "vitest";
import { linkGlossaryTerms } from "@/lib/utils/glossary-linker";
import { blogPosts } from "@/lib/data/blogs";

/** True when an <a> opens inside another <a>, or a glossary attribute leaks into text. */
function nestedAnchor(html: string): boolean {
  let depth = 0;
  for (const m of html.matchAll(/<\/?a\b[^>]*>/gi)) {
    if (m[0].startsWith("</")) depth = Math.max(0, depth - 1);
    else if (++depth > 1) return true;
  }
  const text = html.replace(/<[^>]+>/g, " ");
  return /class="glossary-link"|data-glossary-slug/.test(text);
}

describe("linkGlossaryTerms", () => {
  it("never nests a link inside another, on any blog post", () => {
    const bad = blogPosts.filter((p) => nestedAnchor(linkGlossaryTerms(p.content))).map((p) => p.slug);
    expect(bad).toEqual([]);
  });

  it("links a longer term and a shorter one in the same paragraph without breaking either", () => {
    const out = linkGlossaryTerms("<p>Talk to a mortgage broker about your mortgage.</p>");
    expect(out).toContain('<a href="/glossary/mortgage-broker" class="glossary-link" data-glossary-slug="mortgage-broker">mortgage broker</a>');
    expect(nestedAnchor(out)).toBe(false);
  });

  it("links terms ending in a bracket, and their names without the acronym", () => {
    expect(linkGlossaryTerms("<p>Capital Gains Tax (CGT) applies.</p>")).toContain(
      'data-glossary-slug="capital-gains-tax-cgt">Capital Gains Tax (CGT)</a>',
    );
    expect(linkGlossaryTerms("<p>You pay capital gains tax when you sell.</p>")).toContain(
      'data-glossary-slug="capital-gains-tax-cgt">capital gains tax</a>',
    );
    expect(linkGlossaryTerms("<p>Most buyers pay lenders mortgage insurance.</p>")).toContain(
      'data-glossary-slug="lenders-mortgage-insurance-lmi">lenders mortgage insurance</a>',
    );
  });

  it("matches an apostrophe in any of its forms", () => {
    for (const s of ["buyer's agent", "buyer’s agent", "buyer&rsquo;s agent", "buyer&apos;s agent"]) {
      expect(linkGlossaryTerms(`<p>Ask a ${s}.</p>`), s).toContain('data-glossary-slug="buyer-apos-s-agent"');
    }
  });

  it("links each term once, skips headings and existing links, and not inside words", () => {
    const out = linkGlossaryTerms(
      '<h2>Negative gearing</h2><p>Negative gearing again. <a href="/x">negative gearing</a> and negative gearing.</p><p>Unnegative gearingx.</p>',
    );
    expect(out.match(/data-glossary-slug="negative-gearing"/g)?.length).toBe(1);
    expect(out).toContain("<h2>Negative gearing</h2>");
    expect(out).toContain('<a href="/x">negative gearing</a>');
    expect(out).toContain("Unnegative gearingx");
  });
});
