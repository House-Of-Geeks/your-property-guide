// Content fixes from the 10 Oct 2026 review in the rankings and markets
// vertical: what the copy may and may not claim.
import { describe, expect, it } from "vitest";
import { post as moretonBay } from "@/lib/data/blog-posts/top-5-suburbs-families-moreton-bay";

describe("the Moreton Bay families guide (tracker 23; review 3.4)", () => {
  it("claims no ranking it has not measured and no unsourced superlative", () => {
    const text = `${moretonBay.title} ${moretonBay.excerpt} ${moretonBay.content}`;
    expect(text).not.toMatch(/\bTop 5\b|most liveable|gold standard|hidden gem|unmatched|well-regarded/i);
    // "best" only in the refusal and in the name of the ranking that states its measure
    expect(text.replace("we do not call them the best or the top five", "").replace("the best suburbs for families in Brisbane", "").replace(/href="[^"]*"/g, "")).not.toMatch(/\bbest\b|\btop\b/i);
    expect(text).not.toMatch(/\$\d/); // QLD medians are withheld; the profiles print them where published
    expect(text).not.toMatch(/\u2014/);
    expect(moretonBay.title.length).toBeLessThanOrEqual(60);
    expect(moretonBay.updatedAt).toBe("2026-10-11");
  });
  it("sources its facts and points to the ranking that states its measure", () => {
    expect(moretonBay.content).toContain("<h2>Sources</h2>");
    expect(moretonBay.content).toContain("translink.com.au, read 11 October 2026");
    expect(moretonBay.content).toContain('href="/best-suburbs/for-families/brisbane"');
    expect(moretonBay.content).toContain('href="/regions/moreton-bay"');
    expect(moretonBay.content).toContain("family households are at least 40% of households");
  });
});
