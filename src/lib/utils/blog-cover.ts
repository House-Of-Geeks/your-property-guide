import "server-only";
import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

// Build-time / first-access scan of /public/images/blog so the BlogCover
// component can decide whether to render a real image or a generated
// fallback without an FS hit per render.
let cache: Set<string> | null = null;

export function getAvailableBlogCovers(): Set<string> {
  if (cache) return cache;
  const dir = join(process.cwd(), "public", "images", "blog");
  if (!existsSync(dir)) {
    cache = new Set();
    return cache;
  }
  try {
    cache = new Set(readdirSync(dir));
  } catch {
    cache = new Set();
  }
  return cache;
}

// Resolves a post's stored coverImage path to a usable public path, or
// returns null if the file isn't present and a fallback should be rendered.
//
// Accepts the standard "/images/blog/<filename>" convention and confirms
// the file exists in /public/images/blog. Anything outside that pattern is
// returned as-is on the assumption the caller meant to point at a remote
// URL or another known path.
// Brand v4 (Oct 2026): the /images/blog cover series was AI-generated, and
// the brand uses no generated imagery. Until real photography replaces it,
// every local cover resolves to null, so pages render the typeset cover
// (BlogCoverFallback) and social cards use the OG renderer. Set to true once
// the folder holds real photographs.
const PHOTO_COVERS_ENABLED = false;

export function resolveBlogCoverPath(
  coverImage: string | null | undefined,
): string | null {
  if (!coverImage) return null;
  if (!coverImage.startsWith("/images/blog/")) return coverImage;
  if (!PHOTO_COVERS_ENABLED) return null;
  const filename = coverImage.slice("/images/blog/".length);
  if (!filename) return null;
  return getAvailableBlogCovers().has(filename) ? coverImage : null;
}
