// Commercial intent review, 10 Oct 2026 (finance-tax F12, report 0.2 item 14):
// three writers shared one bio, the editor's ("Editor of Your Property
// Guide..."), hard-coded in AuthorBylineCard, and every byline linked to
// /about#andy-mcmaster. Each writer now carries their own bio and /about
// anchor from src/lib/authors.ts, drawn from what /about says about them.
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

// The seo components index reaches a module marked server-only.
vi.mock("server-only", () => ({}));

import { AuthorBylineCard } from "@/components/guide/AuthorBylineCard";
import { AUTHOR_PROFILES, EDITORIAL_BIO, EDITORIAL_HREF, authorAboutHref, authorProfile } from "@/lib/authors";
import { blogPosts } from "@/lib/data/blogs";
import BlogDetailPage from "@/app/(marketing)/guides/[slug]/page";

const ABOUT_SRC = readFileSync("src/app/(marketing)/about/page.tsx", "utf8");
// /about as a reader sees it: entities decoded, JSX whitespace collapsed.
const ABOUT_TEXT = ABOUT_SRC
  .replace(/&rsquo;/g, "’")
  .replace(/&amp;/g, "&")
  .replace(/\s+/g, " ");
const plain = (s: string) => s.replace(/’/g, "'");

const NAMES = Object.keys(AUTHOR_PROFILES);
const EDITOR_BIO_START = "Editor of Your Property Guide";

const card = (props: Parameters<typeof AuthorBylineCard>[0]) =>
  renderToStaticMarkup(createElement(AuthorBylineCard, props))
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'");

describe("author profiles match /about", () => {
  it("covers the three writers /about introduces, and only them", () => {
    expect(NAMES.sort()).toEqual(["Andy McMaster", "Bec Ramirez", "Ellie Johnston"]);
  });

  for (const name of NAMES) {
    const p = AUTHOR_PROFILES[name];
    it(`${name}: the anchor is the id of their /about card`, () => {
      expect(ABOUT_SRC).toMatch(new RegExp(`<article\\s+id="${p.anchor}"`));
      expect(ABOUT_SRC).toContain(`href={\`\${SITE_URL}/about#${p.anchor}\`}`);
    });
    it(`${name}: the job title is the one /about gives`, () => {
      expect(ABOUT_TEXT).toContain(`itemProp="jobTitle"> ${p.jobTitle} </p>`);
    });
  }

  // Every claim in a bio is one /about makes about that person.
  const CLAIMS: Record<string, string[]> = {
    "Andy McMaster": [
      'bio="Editor of Your Property Guide. Writes the editorial methodology, scheme and policy commentary, and oversees the suburb data review. Based in Brisbane, Australia."',
    ],
    "Bec Ramirez": [
      "Bec is our senior writer on the tax, lending and investment side of property",
      "She came to Your Property Guide from a mortgage broking background",
      "she covers negative gearing, capital gains tax, depreciation, SMSF property, foreign buyer rules, and the federal and state policy changes that move the market",
    ],
    "Ellie Johnston": [
      "Ellie leads our market and suburb research",
      "Her background is in property data journalism, pulling apart Valuer-General releases, ABS data, and listing-portal aggregates",
      "She writes the capital-city market updates, state-by-state buying guides, regional research and most of the suburb profiles",
    ],
  };
  for (const name of NAMES) {
    it(`${name}: the bio repeats only what /about says`, () => {
      for (const claim of CLAIMS[name]) expect(plain(ABOUT_TEXT)).toContain(claim);
    });
  }
  it("only Andy carries the editor's bio", () => {
    for (const name of NAMES) {
      expect(AUTHOR_PROFILES[name].bio.startsWith(EDITOR_BIO_START)).toBe(name === "Andy McMaster");
    }
    expect(new Set(NAMES.map((n) => AUTHOR_PROFILES[n].bio)).size).toBe(NAMES.length);
  });
});

describe("every article byline names a writer /about introduces", () => {
  it("has a profile for each blog post author", () => {
    const missing = [...new Set(blogPosts.map((p) => p.author.name))].filter((n) => !authorProfile(n));
    expect(missing).toEqual([]);
  });
  it("links anyone else to the methodology, never to a writer's card", () => {
    expect(authorAboutHref("Your Property Guide editorial")).toBe(EDITORIAL_HREF);
    expect(authorAboutHref(undefined)).toBe(EDITORIAL_HREF);
    expect(authorAboutHref("toString")).toBe(EDITORIAL_HREF);
  });
});

describe("AuthorBylineCard", () => {
  for (const name of NAMES) {
    it(`${name}: own bio, title, portrait and /about anchor`, () => {
      const p = AUTHOR_PROFILES[name];
      const html = card({ authorName: name, lastReviewed: "2026-10-01" });
      expect(html).toContain(p.bio);
      expect(html).toContain(p.jobTitle);
      expect(html).toContain(`href="/about#${p.anchor}"`);
      expect(html).toContain(encodeURIComponent(p.image));
      for (const other of NAMES.filter((n) => n !== name)) {
        expect(html).not.toContain(`/about#${AUTHOR_PROFILES[other].anchor}`);
        expect(html).not.toContain(AUTHOR_PROFILES[other].bio);
      }
      expect(html).toContain(`More about ${name.split(" ")[0]}`);
      expect(html).not.toContain("the editor's page");
    });
  }

  it("an unlisted author gets the neutral line, the brand mark and the methodology link", () => {
    const html = card({
      authorName: "Your Property Guide editorial",
      authorRole: "Australian property research",
      reviewerName: "Andy McMaster",
      reviewerRole: "Editor",
      lastReviewed: "2026-10-01",
    });
    expect(html).toContain(EDITORIAL_BIO);
    expect(html).toContain("Australian property research");
    expect(html).not.toContain(EDITOR_BIO_START);
    // No one's portrait stands in for the editorial team.
    expect(html).not.toContain("<img");
    expect(html).toContain(`href="${EDITORIAL_HREF}"`);
    // The named reviewer links to their own card.
    expect(html).toMatch(/Reviewed by <a [^>]*href="\/about#andy-mcmaster"[^>]*>Andy McMaster<\/a>/);
  });
});

describe("article template byline (/guides/[slug])", () => {
  const firstBy = (name: string) => blogPosts.find((p) => p.author.name === name)!;
  for (const name of NAMES) {
    it(`${name}: every byline link goes to their own /about card`, async () => {
      const post = firstBy(name);
      const html = renderToStaticMarkup(await BlogDetailPage({ params: Promise.resolve({ slug: post.slug }) }));
      const aboutLinks = [...html.matchAll(/href="(\/about#[^"]+)"/g)].map((m) => m[1]);
      expect(aboutLinks.length).toBeGreaterThanOrEqual(3);
      expect(new Set(aboutLinks)).toEqual(new Set([`/about#${AUTHOR_PROFILES[name].anchor}`]));
      expect(html.replace(/&amp;/g, "&").replace(/&#x27;/g, "'")).toContain(AUTHOR_PROFILES[name].bio);
    });
  }
});
