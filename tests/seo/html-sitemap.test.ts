// The HTML sitemap is the XML urlsets with titles. These checks stay off the
// database: pages, guides, glossary, states, best suburbs, market reports
// and the property market are bundled data.
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));
import nextConfig from "../../next.config";
import pagesSitemap, { getPageSitemapEntries } from "@/app/pages/sitemap";
import guidesSitemap, { getGuideSitemapLinks } from "@/app/(marketing)/guides/sitemap";
import glossarySitemap, { getGlossarySitemapLinks } from "@/app/(marketing)/glossary/sitemap";
import statesSitemap, { getStateSitemapLinks } from "@/app/(marketing)/states/sitemap";
import bestSuburbsSitemap, { getBestSuburbSitemapLinks } from "@/app/(marketing)/best-suburbs/sitemap";
import marketReportsSitemap, { getMarketReportSitemapLinks } from "@/app/(marketing)/market-reports/sitemap";
import propertyMarketSitemap, { getPropertyMarketSitemapLinks } from "@/app/(marketing)/property-market/sitemap";
import { SUBPAGE_TYPES } from "@/app/(marketing)/suburbs/subpages/sitemap";
import { SITE_URL } from "@/lib/constants";
import {
  HTML_SITEMAP_PAGE_SIZE,
  HTML_SITEMAP_SECTION_IDS,
  compareSitemapLinks,
  loadHtmlSitemapSection,
  paginateSitemapLinks,
} from "@/lib/html-sitemap";

const ROOT = path.resolve(__dirname, "../..");
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), "utf8");

function pathOf(url: string): string {
  return new URL(url).pathname;
}

describe("HTML sitemap sections that do not need the database", () => {
  const cases = [
    ["pages", getPageSitemapEntries, pagesSitemap],
    ["guides", async () => getGuideSitemapLinks(), guidesSitemap],
    ["glossary", async () => getGlossarySitemapLinks(), glossarySitemap],
    ["states", async () => getStateSitemapLinks(), statesSitemap],
    ["best-suburbs", async () => getBestSuburbSitemapLinks(), bestSuburbsSitemap],
    ["market-reports", async () => getMarketReportSitemapLinks(), marketReportsSitemap],
    ["property-market", async () => getPropertyMarketSitemapLinks(), propertyMarketSitemap],
  ] as const;

  it.each(cases)("%s lists the same URLs as its XML sitemap, with titles, in alphabetical order", async (id, linksOf, xmlOf) => {
    const [links, xml] = await Promise.all([loadHtmlSitemapSection(id), Promise.resolve(xmlOf())]);
    expect(links).not.toBeNull();
    const hrefs = links!.map((l) => l.href);
    expect([...hrefs].sort()).toEqual(xml.map((e) => pathOf(e.url)).sort());
    expect(links!.every((l) => l.title.trim().length > 0 && l.title !== l.href && !l.title.startsWith("http"))).toBe(true);
    expect(links).toEqual([...links!].sort(compareSitemapLinks));
    const fromGetter = await linksOf();
    expect(fromGetter.map((e) => pathOf(e.url)).sort()).toEqual(xml.map((e) => pathOf(e.url)).sort());
  });

  it("submits /sitemap and not the old /site-map address", async () => {
    const links = await loadHtmlSitemapSection("pages");
    expect(links!.some((l) => l.href === "/sitemap")).toBe(true);
    expect(links!.some((l) => l.href === "/site-map")).toBe(false);
  });
});

describe("HTML sitemap pages stay under about 1,000 links and off the XML id paths", () => {
  it("pages a list in chunks of 1,000", () => {
    const items = Array.from({ length: 2500 }, (_, i) => i);
    expect(HTML_SITEMAP_PAGE_SIZE).toBe(1000);
    expect(paginateSitemapLinks(items, 1)?.links).toHaveLength(1000);
    expect(paginateSitemapLinks(items, 2)?.links[0]).toBe(1000);
    expect(paginateSitemapLinks(items, 3)?.links).toHaveLength(500);
    expect(paginateSitemapLinks(items, 3)?.pageCount).toBe(3);
    expect(paginateSitemapLinks(items, 4)).toBeNull();
    expect(paginateSitemapLinks([], 1)).toBeNull();
  });

  it("section ids are words, so they cannot collide with /sitemap/0.xml", () => {
    expect(HTML_SITEMAP_SECTION_IDS.length).toBeGreaterThan(10);
    for (const id of HTML_SITEMAP_SECTION_IDS) {
      expect(id).toMatch(/^[a-z]+(-[a-z]+)*$/);
      expect(id).not.toMatch(/^\d/);
      expect(id).not.toContain(".");
    }
    expect(fs.existsSync(path.join(ROOT, "src/app/sitemap.ts"))).toBe(false);
    expect(fs.existsSync(path.join(ROOT, "src/app/sitemap.xml/route.ts"))).toBe(true);
  });

  it("includes a child list for every suburb sub-page sitemap id", () => {
    const src = read("src/lib/html-sitemap.ts");
    for (const type of SUBPAGE_TYPES) {
      expect(src).toContain(`getSubpageSitemapLinks("${type}")`);
    }
  });
});

describe("sitemap redirects and footer", () => {
  it("301s the old HTML addresses to /sitemap", async () => {
    const rules = await nextConfig.redirects!();
    expect(rules).toContainEqual({ source: "/site-map", destination: "/sitemap", statusCode: 301 });
    expect(rules).toContainEqual({ source: "/sitemap.html", destination: "/sitemap", statusCode: 301 });
  });

  it("the footer Sitemap link points at the HTML page", () => {
    const footer = read("src/components/layout/Footer.tsx");
    expect(footer).toContain('href="/sitemap"');
    expect(footer).not.toContain('href="/sitemap.xml"');
  });
});

describe("lastmod is not a timestamp taken at request time", () => {
  it("regions, agents and agencies omit it", () => {
    for (const file of [
      "src/app/(marketing)/regions/sitemap.ts",
      "src/app/(marketing)/agents/sitemap.ts",
      "src/app/(marketing)/real-estate-agencies/sitemap.ts",
    ]) {
      const src = read(file).replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, "");
      expect(src, file).not.toMatch(/new Date\(/);
      expect(src, file).not.toMatch(/lastModified/);
    }
  });
});
