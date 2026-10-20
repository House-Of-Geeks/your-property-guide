import { existsSync } from "node:fs";
import { join } from "node:path";
import { ALL_GUIDES } from "@/lib/guides/registry";
import { GUIDE_BOOKS } from "@/lib/guide-books";

// Does an internal href resolve to a real page? Static marketing routes are
// checked on disk; /guides/<slug> against the guide registry (static guides
// and articles); a few dynamic hubs by pattern.
const APP = join(process.cwd(), "src/app/(marketing)");
const GUIDE_SLUGS = new Set(ALL_GUIDES.map((g) => g.slug));

export function routeExists(href: string): boolean {
  const path = href.split(/[?#]/)[0].replace(/\/$/, "") || "/";
  if (path === "/") return existsSync(join(APP, "page.tsx"));
  const guide = path.match(/^\/guides\/([a-z0-9-]+)$/);
  if (guide) return GUIDE_SLUGS.has(guide[1]) || existsSync(join(APP, "guides", guide[1], "page.tsx"));
  if (/^\/guides\/category\/[a-z0-9-]+$/.test(path)) return existsSync(join(APP, "guides/category/[category]/page.tsx"));
  if (/^\/suburbs\/[a-z0-9-]+$/.test(path)) return existsSync(join(APP, "suburbs/[slug]/page.tsx"));
  // A free guide's chapter pages (/buying-guide/<slug>, /selling-guide/<slug>).
  const chapter = path.match(/^\/(buying|selling)-guide\/([a-z0-9-]+)$/);
  if (chapter) return GUIDE_BOOKS[chapter[1] as "buying" | "selling"].chapters.some((c) => c.slug === chapter[2]);
  return existsSync(join(APP, path.slice(1), "page.tsx"));
}
