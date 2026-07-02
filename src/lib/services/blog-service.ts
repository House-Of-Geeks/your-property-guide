import type { BlogPost } from "@/types";
import { blogPosts } from "@/lib/data/blogs";

// Blog posts are authored in src/lib/data/blogs.ts and shipped in the
// deploy bundle. We used to mirror this to the DB and read it back at
// request time, which cost a DB round-trip on every blog-touching page
// render. Since the source array is already in-memory at runtime, reading
// directly from it is faster, free of function-duration cost, and removes
// connection-pool pressure on Postgres.
//
// All exports keep their original async signatures so callers don't change.
// The sync-blogs admin endpoint still writes to the DB for any external
// consumer that wants the data there, but the site itself no longer reads
// from it.

function byPublishedDesc(a: BlogPost, b: BlogPost): number {
  return b.publishedAt.localeCompare(a.publishedAt);
}

const SORTED = [...blogPosts].sort(byPublishedDesc);

export async function getBlogPosts(limit = 100): Promise<BlogPost[]> {
  return SORTED.slice(0, limit);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return SORTED.find((p) => p.slug === slug) ?? null;
}

export async function getAllBlogSlugs(): Promise<string[]> {
  return SORTED.map((p) => p.slug);
}

export async function getBlogSitemapEntries(): Promise<
  { slug: string; publishedAt: Date; updatedAt: Date | null }[]
> {
  return SORTED.map((p) => ({
    slug: p.slug,
    publishedAt: new Date(p.publishedAt),
    updatedAt: p.updatedAt ? new Date(p.updatedAt) : null,
  }));
}

// Canonical URL segment for a category: "Buying Guide" -> "buying-guide".
// Category pages, the sitemap, and internal links all use this form; the
// stored labels keep their display casing.
export function categoryToSlug(label: string): string {
  let decoded = label;
  try {
    // Route params arrive still percent-encoded ("Buying%20Guide").
    decoded = decodeURIComponent(label);
  } catch {
    // Malformed escape (stray "%") — slug the raw string instead.
  }
  return decoded.trim().toLowerCase().replace(/[\s_]+/g, "-");
}

// `category` accepts either the canonical slug ("buying-guide") or a raw
// label in any casing ("Buying Guide", "news") — both sides are normalised
// so legacy label URLs keep resolving.
export async function getBlogPostsByCategory(category: string, limit = 100): Promise<BlogPost[]> {
  const slug = categoryToSlug(category);
  return SORTED.filter((p) => categoryToSlug(p.category) === slug).slice(0, limit);
}

export async function getDistinctBlogCategories(): Promise<string[]> {
  return [...new Set(SORTED.map((p) => p.category))].sort();
}

export async function getRelatedPosts(slug: string, limit = 3): Promise<BlogPost[]> {
  const current = SORTED.find((p) => p.slug === slug);
  if (!current) return [];
  const sameCategory = SORTED.filter(
    (p) => p.slug !== slug && p.category === current.category,
  ).slice(0, limit);
  if (sameCategory.length >= limit) return sameCategory;
  // Single-post categories (e.g. Selling, Suburb Guide) would otherwise
  // return nothing and drop the related-posts internal-link block, so pad
  // the remaining slots with the most recent posts from other categories.
  const filler = SORTED.filter(
    (p) => p.slug !== slug && p.category !== current.category,
  ).slice(0, limit - sameCategory.length);
  return [...sameCategory, ...filler];
}
