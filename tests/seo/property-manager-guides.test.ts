// PR B (28 Oct 2026): the three property manager guides. Rendered <title>
// including the " | Your Property Guide" suffix stays at 60 characters or
// fewer, metas stay inside 155, the visible FAQ equals the FAQPage JSON-LD,
// the dates and the reviewer line are what the page data says, the fee
// disclosure is the one in service-model, the pages carry no placeholder or
// dash, and the registry, the /investing hub, the guides sitemap and the
// search index list all three.
import fs from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { SITE_NAME } from "@/lib/constants/seo";
import { FEE_DISCLOSURE } from "@/lib/service-model";
import { ALL_GUIDES, GUIDE_SECTIONS, getGuide } from "@/lib/guides/registry";
import { hubGuideList } from "@/lib/guides/hub-guides";
import sitemap from "@/app/(marketing)/guides/sitemap";
import WhatDoes, { FAQS as WHAT_FAQS, metadata as whatMeta } from "@/app/(marketing)/guides/what-does-a-property-manager-do/page";
import Switching, { FAQS as SWITCH_FAQS, metadata as switchMeta } from "@/app/(marketing)/guides/switching-property-managers/page";
import Choose, { FAQS as CHOOSE_FAQS, metadata as chooseMeta } from "@/app/(marketing)/guides/how-to-choose-a-property-manager/page";

// The shared layouts reach a module marked server-only.
vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push() {}, replace() {}, prefetch() {}, back() {}, refresh() {} }),
  usePathname: () => "/guides",
  useSearchParams: () => new URLSearchParams(),
}));

const ROOT = path.resolve(__dirname, "../..");
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), "utf8");

const PAGES = [
  { slug: "what-does-a-property-manager-do", Page: WhatDoes, meta: whatMeta, faqs: WHAT_FAQS, title: "What Does a Property Manager Do? | Your Property Guide", h1: "What does a property manager do?", disclosure: false },
  { slug: "switching-property-managers", Page: Switching, meta: switchMeta, faqs: SWITCH_FAQS, title: "Switching Property Managers | Your Property Guide", h1: "Switching property managers: what to check and how to do it", disclosure: true },
  { slug: "how-to-choose-a-property-manager", Page: Choose, meta: chooseMeta, faqs: CHOOSE_FAQS, title: "How to Choose a Property Manager | Your Property Guide", h1: "How to choose a property manager", disclosure: true },
] as const;

// The root layout's template is `%s | ${SITE_NAME}`.
const rendered = (t: unknown) => `${String(t)} | ${SITE_NAME}`;
const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;|&apos;/g, "'").replace(/&rsquo;/g, "’").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const text = (html: string) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const pageFile = (slug: string) => `src/app/(marketing)/guides/${slug}/page.tsx`;

function jsonLd(html: string): Array<Record<string, unknown>> {
  return [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) =>
    JSON.parse(m[1].replace(/\\u003c/g, "<")),
  );
}

const html = Object.fromEntries(PAGES.map((p) => [p.slug, renderToStaticMarkup(createElement(p.Page))]));

describe("rendered titles and metas", () => {
  for (const p of PAGES) {
    it(`${p.slug}: <title> is exact and 60 characters or fewer including the suffix`, () => {
      const t = rendered(p.meta.title);
      expect(t).toBe(p.title);
      expect(t.length).toBeLessThanOrEqual(60);
    });
    it(`${p.slug}: meta description is 155 characters or fewer and matches the manifest`, () => {
      const d = String(p.meta.description);
      expect(d.length).toBeLessThanOrEqual(155);
      expect(getGuide(p.slug)?.description).toBe(d);
    });
    it(`${p.slug}: the H1 is the copy's H1`, () => {
      expect(html[p.slug]).toContain(`>${p.h1}<`);
      expect(html[p.slug].match(/<h1[\s>]/g)).toHaveLength(1);
    });
  }
  it("the three rendered titles measure 54, 49 and 54 and the metas 137, 133 and 135", () => {
    expect(PAGES.map((p) => rendered(p.meta.title).length)).toEqual([54, 49, 54]);
    expect(PAGES.map((p) => String(p.meta.description).length)).toEqual([137, 133, 135]);
  });
});

describe("FAQ and FAQPage JSON-LD", () => {
  for (const p of PAGES) {
    it(`${p.slug}: every visible question and answer is the FAQPage entry, in order`, () => {
      const faqLd = jsonLd(html[p.slug]).filter((j) => j["@type"] === "FAQPage");
      expect(faqLd).toHaveLength(1);
      const entries = faqLd[0].mainEntity as Array<{ name: string; acceptedAnswer: { text: string } }>;
      expect(entries.map((e) => e.name)).toEqual(p.faqs.map((f) => f.question));
      expect(entries.map((e) => e.acceptedAnswer.text)).toEqual(p.faqs.map((f) => f.answer));
      const body = text(html[p.slug]);
      let at = 0;
      for (const f of p.faqs) {
        const i = body.indexOf(text(f.answer), at);
        expect(i, f.question).toBeGreaterThanOrEqual(at);
        at = i;
      }
      const h3 = [...html[p.slug].matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].map((m) => text(m[1]));
      for (const f of p.faqs) expect(h3).toContain(text(f.question));
    });
  }
  it("question counts are 8, 7 and 8", () => {
    expect(PAGES.map((p) => p.faqs.length)).toEqual([8, 7, 8]);
  });
});

describe("dates, reviewer and structured data", () => {
  for (const p of PAGES) {
    it(`${p.slug}: Article datePublished and dateModified are 2026-10-28, with no reviewer`, () => {
      const article = jsonLd(html[p.slug]).find((j) => j["@type"] === "Article" || j["@type"] === "BlogPosting");
      expect(article, "Article JSON-LD").toBeTruthy();
      expect(article!.datePublished).toContain("2026-10-28");
      expect(article!.dateModified).toContain("2026-10-28");
      expect(JSON.stringify(article)).not.toMatch(/reviewedBy|reviewer/i);
      expect(html[p.slug]).not.toMatch(/Reviewed by/i);
      expect(html[p.slug]).toContain('dateTime="2026-10-28"');
    });
  }
});

describe("fee disclosure", () => {
  it("is the service-model text, word for word, where the copy has it", () => {
    expect(FEE_DISCLOSURE).toBe(
      "Our introductions are free for you. The agent we introduce you to pays us a flat fee for the introduction, whether or not you go ahead with them. We take no share of their commission. It doesn’t change what you pay them, and you’re never obliged to use them.",
    );
    expect(text(html["switching-property-managers"])).toContain(FEE_DISCLOSURE);
    expect(text(html["how-to-choose-a-property-manager"])).toContain(FEE_DISCLOSURE);
    expect(CHOOSE_FAQS[7].answer).toBe(FEE_DISCLOSURE);
    expect(read(pageFile("switching-property-managers"))).toContain("{FEE_DISCLOSURE}");
  });
});

describe("links", () => {
  const hrefs = (slug: string) => [...html[slug].matchAll(/<a [^>]*href="([^"]+)"/g)].map((m) => m[1]);
  it("the switching and choosing guides link each other", () => {
    expect(hrefs("switching-property-managers")).toContain("/guides/how-to-choose-a-property-manager");
    expect(hrefs("how-to-choose-a-property-manager")).toContain("/guides/switching-property-managers");
  });
  it("every guide links all its siblings (body or related list)", () => {
    for (const p of PAGES) {
      for (const other of PAGES.filter((o) => o.slug !== p.slug)) expect(hrefs(p.slug), `${p.slug} -> ${other.slug}`).toContain(`/guides/${other.slug}`);
    }
  });
  it("no page links the fees calculator (it ships in another PR) or the unconfirmed tenants guide", () => {
    for (const p of PAGES) {
      expect(html[p.slug]).not.toContain("/property-management-fees-calculator");
      expect(html[p.slug]).not.toContain("selling-a-house-with-tenants");
      expect(read(pageFile(p.slug))).not.toContain("selling-a-house-with-tenants");
    }
  });
});

describe("no placeholders, dev notes or dashes", () => {
  const BANNED = /TODO|TBC|TBD|\[NEEDS|add when live|lorem|placeholder|FIXME|XXX/i;
  for (const p of PAGES) {
    it(`${p.slug}: source and rendered text`, () => {
      const src = read(pageFile(p.slug));
      const body = text(html[p.slug]);
      expect(src).not.toMatch(BANNED);
      expect(body).not.toMatch(BANNED);
      expect(src).not.toMatch(/[—–]/);
      expect(body).not.toMatch(/[—–]/);
      expect(html[p.slug]).not.toMatch(/&#x2014;|&#x2013;|&mdash;|&ndash;/);
    });
  }
});

describe("registry, hub, sitemap and search index", () => {
  const slugs: string[] = PAGES.map((p) => p.slug);
  it("the guide registry lists all three, dated 2026-10-28, in the investing section", () => {
    for (const s of slugs) {
      const g = getGuide(s);
      expect(g, s).toBeDefined();
      expect(g!.href).toBe(`/guides/${s}`);
      expect(g!.publishedAt).toBe("2026-10-28");
      expect(g!.updatedAt).toBe("2026-10-28");
    }
    expect(GUIDE_SECTIONS.find((s) => s.id === "investing")!.guides).toEqual(expect.arrayContaining(slugs));
  });
  it("the /investing hub lists all three once", () => {
    const hub = hubGuideList("/investing")!;
    const all = hub.groups.flatMap((g) => g.slugs);
    for (const s of slugs) expect(all.filter((x) => x === s), s).toHaveLength(1);
  });
  it("the guides sitemap has each URL once with lastmod 2026-10-28", () => {
    const entries = sitemap();
    for (const s of slugs) {
      const hits = entries.filter((e) => e.url.endsWith(`/guides/${s}`));
      expect(hits, s).toHaveLength(1);
      expect(hits[0].lastModified).toBe("2026-10-28");
    }
  });
  it("the search index lists each guide once", () => {
    const src = read("src/lib/services/search-service.ts");
    for (const s of slugs) expect(src.match(new RegExp(`slug: "${s}",`, "g")), s).toHaveLength(1);
    expect(ALL_GUIDES.filter((g) => slugs.includes(g.slug))).toHaveLength(3);
  });
});
