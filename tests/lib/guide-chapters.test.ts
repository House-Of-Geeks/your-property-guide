// The guides' chapters (15 Oct 2026): ten per guide, in the contents' order,
// each with its callout, checklist and one call to action, and every link in
// the body pointing somewhere real.
import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CHAPTERS, chapterEntries } from "@/content/guides";
import { GUIDE_BOOKS, type GuideBookId } from "@/lib/guide-books";
import { getGuide } from "@/lib/guides/registry";

const MARKETING = join(__dirname, "../../src/app/(marketing)");
const GUIDES: GuideBookId[] = ["selling", "buying"];

/** Whether an internal path is a page on the site (a static route, a chapter, or a guide in the registry). */
function resolves(path: string): boolean {
  const clean = path.split(/[?#]/)[0].replace(/\/$/, "");
  if (clean === "") return true;
  const guide = clean.match(/^\/guides\/([a-z0-9-]+)$/);
  if (guide) return !!getGuide(guide[1]);
  const chapter = clean.match(/^\/(selling|buying)-guide\/([a-z0-9-]+)$/);
  if (chapter) return GUIDE_BOOKS[chapter[1] as GuideBookId].chapters.some((c) => c.slug === chapter[2]);
  return existsSync(join(MARKETING, clean, "page.tsx"));
}

describe.each(GUIDES)("the %s guide", (guide) => {
  const chapters = chapterEntries(guide);

  it("has ten chapters, numbered in the contents’ order", () => {
    expect(CHAPTERS[guide]).toHaveLength(10);
    expect(chapters.map((c) => c.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(chapters.map((c) => c.slug)).toEqual(GUIDE_BOOKS[guide].chapters.map((c) => c.slug));
    expect(chapters.every((c) => c.guide === guide)).toBe(true);
  });

  it.each(chapters.map((c) => [c.number, c] as const))("chapter %i has a callout, a checklist and one call to action", (_, c) => {
    const sentences = c.callout.split(/(?<=[.!?])\s+/).filter(Boolean);
    expect(sentences.length).toBeGreaterThanOrEqual(2);
    expect(sentences.length).toBeLessThanOrEqual(4);
    expect(c.checklist.length).toBeGreaterThanOrEqual(4);
    expect(c.checklist.length).toBeLessThanOrEqual(7);
    expect(resolves(c.cta.href)).toBe(true);
    expect(c.standfirst.length).toBeGreaterThan(40);
    expect(c.checked.length).toBeGreaterThan(5);
  });

  it.each(chapters.map((c) => [c.number, c] as const))("chapter %i links only to real pages", (_, c) => {
    const html = renderToStaticMarkup(createElement(c.Body));
    const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    const broken = hrefs.filter((h) => h.startsWith("/") && !resolves(h));
    expect(broken).toEqual([]);
  });
});

describe("the selling guide’s calls to action", () => {
  it("offer a tool or the plan up to chapter 4, and the agreement check from chapter 5", () => {
    const kinds = chapterEntries("selling").map((c) => c.cta.kind);
    expect(kinds.slice(0, 4).every((k) => k === "tool" || k === "plan")).toBe(true);
    expect(kinds[4]).toBe("agreement-check");
  });
});
