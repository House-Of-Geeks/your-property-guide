import { describe, expect, it } from "vitest";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { ALL_GUIDES } from "@/lib/guides/registry";

// Guard against the recurring "sitemap-orphaned guide" failure: static
// guides live as directories under (marketing)/guides/<slug>/page.tsx, and
// the guides sitemap used to ship only the slugs someone remembered to
// append to a hand-kept array (forgotten and batch-fixed twice, commits
// 7589635 and the 2026-07-03 sprint). Since 30 Sep 2026 the sitemap, /guides
// and the hubs read the guide registry, which is built from the page
// folders (scripts/guides/static-guide-manifest.ts); this test diffs the
// filesystem against the registry so a folder the registry misses fails
// here instead of in a future SEO audit.

const GUIDES_DIR = join(__dirname, "../../src/app/(marketing)/guides");

// Route groups/dynamic segments that are not static guide pages.
const NON_GUIDE_DIRS = new Set(["[slug]", "category"]);

function guideDirsOnDisk(): string[] {
  return readdirSync(GUIDES_DIR).filter((name) => {
    if (NON_GUIDE_DIRS.has(name)) return false;
    const full = join(GUIDES_DIR, name);
    return statSync(full).isDirectory() && existsSync(join(full, "page.tsx"));
  });
}

const staticSlugs = () => ALL_GUIDES.filter((g) => g.kind === "guide").map((g) => g.slug);

describe("guide registry covers every guide folder", () => {
  it("every guide page directory is a static guide in the registry", () => {
    const registered = new Set(staticSlugs());
    const orphaned = guideDirsOnDisk().filter((slug) => !registered.has(slug));
    expect(orphaned, `guides missing from the registry (run npm run guides:manifest): ${orphaned.join(", ")}`).toEqual([]);
  });

  it("the registry has no static guide without a page directory", () => {
    const onDisk = new Set(guideDirsOnDisk());
    const ghosts = staticSlugs().filter((slug) => !onDisk.has(slug));
    expect(ghosts, `registry guides with no page.tsx (would 404 in the sitemap): ${ghosts.join(", ")}`).toEqual([]);
  });

  it("no two guides share a slug (a static guide and an article would fight over one URL)", () => {
    const slugs = ALL_GUIDES.map((g) => g.slug);
    const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    expect(dupes).toEqual([]);
  });
});
