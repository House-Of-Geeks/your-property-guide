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

export async function getBlogPostsByCategory(category: string, limit = 100): Promise<BlogPost[]> {
  return SORTED.filter((p) => p.category === category).slice(0, limit);
}

export async function getDistinctBlogCategories(): Promise<string[]> {
  return [...new Set(SORTED.map((p) => p.category))].sort();
}

export async function getRelatedPosts(slug: string, limit = 3): Promise<BlogPost[]> {
  const current = SORTED.find((p) => p.slug === slug);
  if (!current) return [];
  return SORTED.filter((p) => p.slug !== slug && p.category === current.category).slice(0, limit);
}
