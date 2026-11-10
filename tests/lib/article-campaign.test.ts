// The hooks on /guides/* articles (15 Oct 2026, reworded 20 Oct for "Clear
// decisions"): every hook says what matters in the topic in at most about
// 50 words, in no one's first person, and every entry is a real guide. Once
// the last batch is in, every guide in the registry has one.
import { describe, expect, it } from "vitest";
import { ARTICLE_CAMPAIGN, ARTICLE_CHAPTERS } from "@/content/articles";
import { GUIDE_BOOKS, chapterHref } from "@/lib/guide-books";
import { ALL_GUIDES, getGuide } from "@/lib/guides/registry";

const ALL_BATCHES_IN = true;

// Guides published with the approved copy exactly as written (28 Oct 2026),
// so no hook or call to action has been written for them yet. Remove a slug
// here when its entry is added to a batch.
const NO_HOOK_YET: readonly string[] = [
  "what-does-a-property-manager-do",
  "switching-property-managers",
  "how-to-choose-a-property-manager",
];

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
    expect(ALL_GUIDES.filter((g) => !ARTICLE_CAMPAIGN[g.slug] && !NO_HOOK_YET.includes(g.slug)).map((g) => g.slug)).toEqual([]);
  });

  it("every article points to a real guide chapter, on the side of its call to action", () => {
    const selling = new Set(["selling-plan", "agreement-check", "selling-agent", "moving-plan"]);
    const problems = entries.flatMap(([slug, c]) => {
      const ref = ARTICLE_CHAPTERS[slug];
      if (!ref) return [`${slug}: no chapter`];
      if (!GUIDE_BOOKS[ref.guide].chapters[ref.chapter - 1]) return [`${slug}: no chapter ${ref.chapter} in ${ref.guide}`];
      if ((ref.guide === "selling") !== selling.has(c.cta)) return [`${slug}: ${c.cta} points into the ${ref.guide} guide`];
      return [];
    });
    expect(problems).toEqual([]);
    expect(Object.keys(ARTICLE_CHAPTERS).filter((slug) => !ARTICLE_CAMPAIGN[slug])).toEqual([]);
  });

  it("chapter links go to the published chapter pages", () => {
    for (const ref of Object.values(ARTICLE_CHAPTERS)) {
      expect(chapterHref(ref.guide, ref.chapter)).toMatch(/^\/(selling|buying)-guide\/[a-z0-9-]+$/);
    }
  });
});
