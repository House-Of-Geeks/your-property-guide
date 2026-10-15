// The campaign framing on /guides/* articles (15 Oct 2026): every hook ties
// the article to the campaign in at most about 50 words, in no one's first
// person, and every entry is a real guide. Once the last batch is in, every
// guide in the registry has one.
import { describe, expect, it } from "vitest";
import { ARTICLE_CAMPAIGN } from "@/content/articles";
import { ALL_GUIDES, getGuide } from "@/lib/guides/registry";

const ALL_BATCHES_IN = false;

const entries = Object.entries(ARTICLE_CAMPAIGN);

describe("article campaign hooks", () => {
  it("are keyed by real guide slugs", () => {
    expect(entries.filter(([slug]) => !getGuide(slug)).map(([slug]) => slug)).toEqual([]);
  });

  it.each(entries)("%s: a short hook with no first person and no straight quotes", (_, c) => {
    const words = c.hook.trim().split(/\s+/).length;
    expect(words).toBeGreaterThanOrEqual(10);
    expect(words).toBeLessThanOrEqual(55);
    expect(c.hook).not.toMatch(/\b(I|I’m|I’ve|my|me)\b/);
    expect(c.hook).not.toMatch(/['"]/);
  });

  it.runIf(ALL_BATCHES_IN)("cover every guide in the registry", () => {
    expect(ALL_GUIDES.filter((g) => !ARTICLE_CAMPAIGN[g.slug]).map((g) => g.slug)).toEqual([]);
  });
});
