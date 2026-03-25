import type { BlogPost } from "@/types";

async function loadBlogPosts(): Promise<BlogPost[]> {
  const { blogPosts } = await import("@/lib/data/blogs");
  return blogPosts;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const posts = await loadBlogPosts();
  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await loadBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const posts = await loadBlogPosts();
  return posts.map((p) => p.slug);
}

export async function getRelatedPosts(slug: string, limit = 3): Promise<BlogPost[]> {
  const posts = await loadBlogPosts();
  const current = posts.find((p) => p.slug === slug);
  if (!current) return posts.slice(0, limit);
  return posts
    .filter((p) => p.slug !== slug && p.category === current.category)
    .slice(0, limit);
}
