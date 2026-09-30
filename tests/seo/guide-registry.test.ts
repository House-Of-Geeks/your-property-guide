// Commercial intent review (30 Sep 2026), index check: /guides listed 89 of
// the 155 guides, /first-home-buyers, /buying-guide and /tools linked none,
// /investing one, /selling two, and the glossary entries Google indexed in
// place of the conveyancing and LMI guides linked neither guide. Every one of
// those lists now reads the guide registry by slug; these tests keep each
// slug resolvable, each list complete, and the registry in step with the
// guide pages.
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { blogPosts } from "@/lib/data/blogs";
import { GLOSSARY_GUIDE_LINKS, GLOSSARY_SLUGS } from "@/lib/data/glossary";
import {
  ALL_GUIDES,
  GUIDE_SECTIONS,
  getGuide,
  guidesBySection,
  staticGuidesForCategoryPage,
} from "@/lib/guides/registry";
import { CALCULATOR_GUIDES, HUB_GUIDE_LISTS, getCalculator, hubGuideList } from "@/lib/guides/hub-guides";
import { MANIFEST_FILE, manifestJson } from "../../scripts/guides/static-guide-manifest";

const APP = path.resolve(__dirname, "../../src/app/(marketing)");
const SRC = path.resolve(__dirname, "../../src");
const read = (rel: string) => fs.readFileSync(path.join(APP, rel), "utf8");
const STATES = ["nsw", "vic", "qld", "wa", "sa", "tas", "act", "nt"];

describe("static guide manifest", () => {
  it("matches every guide page's FRONTMATTER (run npm run guides:manifest after editing one)", () => {
    expect(fs.readFileSync(MANIFEST_FILE, "utf8")).toBe(manifestJson());
  });

  // 155 when this was written; PR #92 (1 Oct 2026) folded the article
  // /guides/stamp-duty-queensland-what-you-need-to-know into the QLD stamp
  // duty guide with a redirect, leaving 154.
  it("holds 154 guides and articles in all", () => {
    expect(ALL_GUIDES.length).toBeGreaterThanOrEqual(154);
    expect(ALL_GUIDES.filter((g) => g.kind === "article").length).toBe(blogPosts.length);
  });
});

describe("/guides lists every published guide, grouped by section", () => {
  const sections = guidesBySection();
  const listed = sections.flatMap((s) => s.guides.map((g) => g.slug));

  it("lists each guide exactly once", () => {
    expect(listed.length).toBe(ALL_GUIDES.length);
    expect(new Set(listed).size).toBe(ALL_GUIDES.length);
  });

  it("files every guide under a named section (no 'More guides' catch-all)", () => {
    expect(sections.map((s) => s.section.id)).not.toContain("more");
  });

  it("every static guide is named by exactly one section, and every section slug is a static guide", () => {
    const named = GUIDE_SECTIONS.flatMap((s) => s.guides);
    expect(named.filter((s, i) => named.indexOf(s) !== i)).toEqual([]);
    for (const slug of named) expect(getGuide(slug)?.kind, slug).toBe("guide");
    const statics = ALL_GUIDES.filter((g) => g.kind === "guide").map((g) => g.slug);
    expect(statics.filter((s) => !named.includes(s))).toEqual([]);
  });

  it("every blog category is claimed by exactly one section", () => {
    const claimed = GUIDE_SECTIONS.flatMap((s) => s.articleCategories);
    for (const category of new Set(blogPosts.map((p) => p.category))) {
      expect(claimed.filter((c) => c === category).length, category).toBe(1);
    }
  });

  it("the page reads the registry, not a hand-typed list", () => {
    const src = read("guides/page.tsx");
    expect(src).toContain("guidesBySection()");
    expect(src).not.toMatch(/href: "\/guides\//);
  });
});

describe("category pages list their static guides", () => {
  const slugsFor = (category: string) => staticGuidesForCategoryPage(category).flatMap((s) => s.guides.map((g) => g.slug));

  it("buying-guide carries the first home, buying and loan guides", () => {
    const slugs = slugsFor("buying-guide");
    for (const s of ["conveyancing-guide", "lenders-mortgage-insurance-guide", "first-home-buyer-qld", "stamp-duty-nsw"]) {
      expect(slugs, s).toContain(s);
    }
  });

  it("selling and investment carry theirs", () => {
    expect(slugsFor("selling")).toEqual(expect.arrayContaining(["real-estate-commission-nsw", "cost-of-selling-a-house-vic"]));
    expect(slugsFor("Investment")).toEqual(expect.arrayContaining(["negative-gearing-australia", "property-depreciation-guide"]));
  });

  it("news and market updates stay article-only", () => {
    expect(slugsFor("news")).toEqual([]);
    expect(slugsFor("market-update")).toEqual([]);
  });

  it("the category page renders them", () => {
    const src = read("guides/category/[category]/page.tsx");
    expect(src).toContain("staticGuidesForCategoryPage(slug)");
    expect(src).toMatch(/export const revalidate = 86400/);
  });
});

describe("hub guide lists", () => {
  const slugsOf = (hub: keyof typeof HUB_GUIDE_LISTS) => HUB_GUIDE_LISTS[hub].groups.flatMap((g) => g.slugs);

  it("every slug on every hub resolves to a published guide", () => {
    for (const [hub, list] of Object.entries(HUB_GUIDE_LISTS)) {
      for (const slug of list.groups.flatMap((g) => g.slugs)) expect(getGuide(slug), `${hub}: ${slug}`).toBeDefined();
    }
  });

  it("/first-home-buyers lists the national guide, the eight states and each scheme", () => {
    expect(slugsOf("/first-home-buyers")).toEqual(
      expect.arrayContaining([
        "first-home-buyer-guide",
        ...STATES.map((s) => `first-home-buyer-${s}`),
        "first-home-owner-grant-australia",
        "first-home-guarantee",
        "first-home-super-saver-scheme",
        "help-to-buy-scheme-australia",
        "how-much-deposit-to-buy-a-house",
        "lenders-mortgage-insurance-guide",
      ]),
    );
  });

  it("/buying-guide lists the buying-process guides", () => {
    expect(slugsOf("/buying-guide")).toEqual(
      expect.arrayContaining([
        "conveyancing-guide",
        "building-pest-inspection",
        "cooling-off-period-by-state-australia",
        "property-auction-guide",
        "how-to-negotiate-property-price-australia",
        "due-diligence-checklist-buying-a-house",
        "how-much-deposit-to-buy-a-house",
        "home-loan-pre-approval-australia",
      ]),
    );
  });

  it("/selling lists commission and cost of selling by state and the agent guides", () => {
    expect(slugsOf("/selling")).toEqual(
      expect.arrayContaining([
        ...STATES.map((s) => `real-estate-commission-${s}`),
        ...STATES.map((s) => `cost-of-selling-a-house-${s}`),
        "how-to-sell-a-house-australia",
        "home-staging-cost-australia",
        "what-to-fix-before-selling-a-house",
        "how-to-choose-a-selling-agent",
        "real-estate-agency-agreements-by-state",
        "underquoting-laws-by-state",
      ]),
    );
  });

  it("/investing lists the investor guides", () => {
    expect(slugsOf("/investing")).toEqual(
      expect.arrayContaining([
        "negative-gearing-australia",
        "cgt-changes-2026-budget",
        "property-depreciation-guide",
        "rentvesting-australia",
        "smsf-property-guide",
        "house-vs-apartment-investment-australia",
        "capital-growth-vs-cash-flow-australia",
        "property-management-fees-australia",
      ]),
    );
  });

  it("the persona hubs, /buying-guide and /tools render their lists", () => {
    for (const hub of ["/first-home-buyers", "/selling", "/investing"]) expect(hubGuideList(hub), hub).toBeDefined();
    expect(hubGuideList("/upgrading")).toBeUndefined();
    expect(fs.readFileSync(path.join(SRC, "components/journey/PersonaHubLayout.tsx"), "utf8")).toContain("hubGuideList(persona.hubPath)");
    expect(read("buying-guide/page.tsx")).toContain('hubGuideGroups(HUB_GUIDE_LISTS["/buying-guide"])');
    expect(read("tools/page.tsx")).toContain("calculatorGuideGroups()");
  });
});

describe("calculators and their guides", () => {
  it("every calculator exists and every paired guide resolves", () => {
    for (const c of CALCULATOR_GUIDES) {
      expect(fs.existsSync(path.join(APP, c.href.slice(1), "page.tsx")), c.href).toBe(true);
      expect(c.guides.length, c.href).toBeGreaterThan(0);
      for (const slug of c.guides) expect(getGuide(slug), `${c.href}: ${slug}`).toBeDefined();
    }
  });

  it("every calculator the site has, and every one /tools links, is paired", () => {
    const onDisk = fs.readdirSync(APP).filter((d) => d.endsWith("-calculator") && fs.existsSync(path.join(APP, d, "page.tsx")));
    const onTools = [...read("tools/page.tsx").matchAll(/href: "\/([a-z-]+-calculator)"/g)].map((m) => m[1]);
    for (const dir of new Set([...onDisk, ...onTools])) expect(getCalculator(`/${dir}`), dir).toBeDefined();
  });
});

describe("glossary terms link the guide on their topic", () => {
  it("every mapped term exists, every guide resolves, every tool is a known calculator", () => {
    for (const [term, links] of Object.entries(GLOSSARY_GUIDE_LINKS)) {
      expect(GLOSSARY_SLUGS.has(term), term).toBe(true);
      for (const slug of links.guides ?? []) expect(getGuide(slug), `${term}: ${slug}`).toBeDefined();
      for (const href of links.tools ?? []) expect(getCalculator(href), `${term}: ${href}`).toBeDefined();
    }
  });

  it("the topics Google indexed in place of the guide point at the guide", () => {
    expect(GLOSSARY_GUIDE_LINKS["conveyancer-conveyancing"].guides).toContain("conveyancing-guide");
    expect(GLOSSARY_GUIDE_LINKS["lenders-mortgage-insurance-lmi"].guides).toContain("lenders-mortgage-insurance-guide");
    expect(GLOSSARY_GUIDE_LINKS["negative-gearing"].guides).toContain("negative-gearing-australia");
    expect(GLOSSARY_GUIDE_LINKS["capital-gains-tax-cgt"].tools).toContain("/cgt-calculator");
    expect(GLOSSARY_GUIDE_LINKS["capital-gains-tax-cgt"].guides).toContain("cgt-changes-2026-budget");
    expect(GLOSSARY_GUIDE_LINKS["stamp-duty-transfer-duty"].tools).toContain("/stamp-duty-calculator");
    expect(GLOSSARY_GUIDE_LINKS["stamp-duty-transfer-duty"].guides).toEqual(STATES.map((s) => `stamp-duty-${s}`));
  });

  it("the term page renders the mapping", () => {
    expect(read("glossary/[term]/page.tsx")).toContain("GLOSSARY_GUIDE_LINKS[entry.slug]");
  });
});

// Guardrail: the hubs were static and stay static; nothing here may add a
// cached read, a revalidate window or a database query to them.
describe("hub pages stay static", () => {
  const files = [
    path.join(APP, "guides/page.tsx"),
    path.join(APP, "first-home-buyers/page.tsx"),
    path.join(APP, "selling/page.tsx"),
    path.join(APP, "investing/page.tsx"),
    path.join(APP, "buying-guide/page.tsx"),
    path.join(APP, "tools/page.tsx"),
    path.join(SRC, "components/journey/PersonaHubLayout.tsx"),
    path.join(SRC, "components/guide/GuideLinkList.tsx"),
    path.join(SRC, "lib/guides/registry.ts"),
    path.join(SRC, "lib/guides/hub-guides.ts"),
  ];
  for (const file of files) {
    it(`${path.relative(SRC, file)} has no revalidate, cache or database read`, () => {
      const code = fs.readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, "");
      expect(code).not.toMatch(/export const (revalidate|dynamic)\b/);
      expect(code).not.toMatch(/unstable_cache|"use cache"|cacheLife/);
      expect(code).not.toMatch(/@\/lib\/(db|prisma)|@\/generated\/prisma/);
    });
  }
});
