// A sitemap must not submit a page that tells crawlers not to index it.
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const APP = path.resolve(__dirname, "../../src/app");
const read = (rel: string) => fs.readFileSync(path.join(APP, rel), "utf8");

describe("static pages sitemap", () => {
  const src = read("pages/sitemap.ts");
  const paths = [...src.matchAll(/url: `\$\{SITE_URL\}(\/[a-z0-9/-]*)`/g)].map((m) => m[1]);

  it("lists the static pages", () => {
    expect(paths.length).toBeGreaterThan(30);
  });

  for (const p of paths) {
    const file = path.join(APP, "(marketing)", p, "page.tsx");
    if (!fs.existsSync(file)) continue;
    it(`${p} is not an always-noindex page`, () => {
      const code = fs.readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, "");
      // Unconditional noindex only: `robots: { index: false` directly in the metadata.
      expect(code).not.toMatch(/^\s*robots:\s*\{\s*index:\s*false/m);
    });
  }
});

describe("suburb sitemaps", () => {
  it("the suburbs sitemap uses the profile gate, not the raw one", () => {
    const src = read("(marketing)/suburbs/sitemap.ts");
    expect(src).toContain("getIndexableSuburbProfilesForSitemaps");
    expect(src).not.toMatch(/getIndexableSuburbsForSitemaps\(/);
  });
  it("the compare sitemap submits canonical pair order", () => {
    expect(read("(marketing)/compare/sitemap.ts")).toContain("canonicalComparePath(");
  });
});

describe("canonicals", () => {
  it("every indexable marketing page sets a canonical, itself or through the helper it imports", () => {
    const root = path.join(APP, "(marketing)");
    const pages: string[] = [];
    const walk = (dir: string) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walk(full);
        else if (e.name === "page.tsx") pages.push(full);
      }
    };
    walk(root);
    // Pages whose metadata comes from a shared builder that sets the canonical.
    const viaHelper = /cost-of-selling-a-house-[a-z]+\/page\.tsx$/;
    const missing = pages.filter((file) => {
      const code = fs.readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, "");
      if (/robots:\s*\{\s*index:\s*false/.test(code)) return false; // noindex pages need none
      if (viaHelper.test(file)) return false;
      return !/canonical/.test(code);
    });
    expect(missing.map((f) => path.relative(root, f))).toEqual([]);
  });
});
