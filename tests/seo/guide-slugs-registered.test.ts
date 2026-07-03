import { describe, expect, it } from "vitest";
import { readdirSync, statSync, existsSync } from "node:fs";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Guard against the recurring "sitemap-orphaned guide" failure: static
// guides live as directories under (marketing)/guides/<slug>/page.tsx but
// only ship in the sitemap when someone remembers to append the slug to
// GUIDE_SLUGS (this has been forgotten and batch-fixed twice — commits
// 7589635 and the 2026-07-03 sprint). This test diffs the filesystem
// against the array so the build's test run catches the drift instead of
// a future SEO audit.

const GUIDES_DIR = join(__dirname, "../../src/app/(marketing)/guides");
const SITEMAP_FILE = join(GUIDES_DIR, "sitemap.ts");

// Route groups/dynamic segments that are not static guide pages.
const NON_GUIDE_DIRS = new Set(["[slug]", "category"]);

function guideDirsOnDisk(): string[] {
  return readdirSync(GUIDES_DIR).filter((name) => {
    if (NON_GUIDE_DIRS.has(name)) return false;
    const full = join(GUIDES_DIR, name);
    return statSync(full).isDirectory() && existsSync(join(full, "page.tsx"));
  });
}

function slugsInSitemap(): string[] {
  const src = readFileSync(SITEMAP_FILE, "utf8");
  const arrayMatch = src.match(/const GUIDE_SLUGS = \[([\s\S]*?)\];/);
  if (!arrayMatch) throw new Error("GUIDE_SLUGS array not found in guides/sitemap.ts");
  return [...arrayMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

describe("guides sitemap registration", () => {
  it("every guide page directory is listed in GUIDE_SLUGS", () => {
    const onDisk = guideDirsOnDisk();
    const registered = new Set(slugsInSitemap());
    const orphaned = onDisk.filter((slug) => !registered.has(slug));
    expect(orphaned, `sitemap-orphaned guides (add to GUIDE_SLUGS in guides/sitemap.ts): ${orphaned.join(", ")}`).toEqual([]);
  });

  it("GUIDE_SLUGS has no entries without a page directory", () => {
    const onDisk = new Set(guideDirsOnDisk());
    const ghosts = slugsInSitemap().filter((slug) => !onDisk.has(slug));
    expect(ghosts, `GUIDE_SLUGS entries with no page.tsx (would 404 in the sitemap): ${ghosts.join(", ")}`).toEqual([]);
  });

  it("GUIDE_SLUGS has no duplicates", () => {
    const slugs = slugsInSitemap();
    const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    expect(dupes).toEqual([]);
  });
});
