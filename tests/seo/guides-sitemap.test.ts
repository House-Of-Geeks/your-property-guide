// Tracker, commercial intent review (30 Sep 2026), index check: the guides
// sitemap stamped the request time as lastmod on 97 of 155 entries (every
// static guide read 2026-09-30T06:03:41Z while the pages said April to
// September), so Google could not tell a refreshed guide from an untouched
// one. Every entry's lastmod must be the date the page itself records, read
// here from the page source, never later and never invented.
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/(marketing)/guides/sitemap";
import { SITE_URL } from "@/lib/constants";
import { blogPosts } from "@/lib/data/blogs";
import { COST_OF_SELLING_STATE, COST_OF_SELLING_STATES } from "@/lib/data/cost-of-selling-state";
import { costOfSellingFrontmatter } from "@/lib/guides/cost-of-selling-frontmatter";
import { AUSTRALIAN_STATES } from "@/lib/data/stamp-duty-state";
import { stampDutyFrontmatter } from "@/lib/guides/stamp-duty-frontmatter";
import { guideLastModified, type GuideEntry } from "@/lib/guides/registry";
import { GUIDES_DIR, readFrontmatter } from "../../scripts/guides/static-guide-manifest";

const SITE = SITE_URL;

/** The dateModified each guide page emits, taken from its source, not from the registry. */
function recordedDates(): Map<string, string> {
  const out = new Map<string, string>();
  for (const name of fs.readdirSync(GUIDES_DIR)) {
    const file = path.join(GUIDES_DIR, name, "page.tsx");
    if (name === "[slug]" || name === "category" || !fs.existsSync(file)) continue;
    const fm = readFrontmatter(file);
    if (fm) out.set(name, fm.updatedAt ?? fm.publishedAt);
  }
  for (const state of COST_OF_SELLING_STATES) {
    const fm = costOfSellingFrontmatter(state);
    out.set(COST_OF_SELLING_STATE[state].slug, fm.updatedAt ?? fm.publishedAt);
  }
  for (const state of AUSTRALIAN_STATES) {
    const fm = stampDutyFrontmatter(state);
    out.set(fm.slug, fm.updatedAt ?? fm.publishedAt);
  }
  for (const post of blogPosts) out.set(post.slug, post.updatedAt || post.publishedAt);
  return out;
}

describe("guides sitemap", () => {
  const entries = sitemap();
  const recorded = recordedDates();
  const slugOf = (url: string) => url.replace(`${SITE}/guides/`, "");

  it("lists every guide and article once", () => {
    expect(entries.length).toBe(recorded.size);
    expect(new Set(entries.map((e) => e.url)).size).toBe(entries.length);
    for (const e of entries) expect(recorded.has(slugOf(e.url)), e.url).toBe(true);
  });

  it("no entry carries a lastmod later than the guide's recorded date", () => {
    const late = entries.filter((e) => {
      const date = recorded.get(slugOf(e.url));
      return e.lastModified !== undefined && (!date || new Date(e.lastModified) > new Date(date));
    });
    expect(late.map((e) => `${e.url} ${String(e.lastModified)}`)).toEqual([]);
  });

  it("every lastmod is the page's own dateModified, as a date string", () => {
    for (const e of entries) {
      expect(e.lastModified, e.url).toBe(recorded.get(slugOf(e.url)));
      expect(e.lastModified, e.url).not.toBeInstanceOf(Date);
    }
  });

  it("the entries do not share one timestamp (the build-time stamp is gone)", () => {
    const counts = new Map<string, number>();
    for (const e of entries) counts.set(String(e.lastModified), (counts.get(String(e.lastModified)) ?? 0) + 1);
    expect(Math.max(...counts.values())).toBeLessThan(entries.length / 2);
  });

  it("a guide with no recorded date gets no lastmod rather than today's", () => {
    const undated: GuideEntry = { slug: "x", href: "/guides/x", title: "x", description: "", publishedAt: "", kind: "guide" };
    expect(guideLastModified(undated)).toBeUndefined();
    const src = fs.readFileSync(path.join(GUIDES_DIR, "sitemap.ts"), "utf8").replace(/\/\/[^\n]*/g, "");
    expect(src).not.toMatch(/new Date\(/);
  });
});
