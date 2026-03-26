import type { BlogPost } from "@/types";
import { db } from "@/lib/db";
import type { BlogPost as DbBlogPost } from "@/generated/prisma/client";

function toBlogPost(p: DbBlogPost): BlogPost {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    coverImage: p.coverImage,
    author: { name: p.authorName, image: p.authorImage },
    category: p.category,
    tags: p.tags,
    publishedAt: p.publishedAt.toISOString(),
    updatedAt: p.updatedAt?.toISOString(),
    readingTime: p.readingTime,
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const rows = await db.blogPost.findMany({ orderBy: { publishedAt: "desc" } });
  return rows.map(toBlogPost);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const row = await db.blogPost.findUnique({ where: { slug } });
  return row ? toBlogPost(row) : null;
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const rows = await db.blogPost.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
}

export async function getRelatedPosts(slug: string, limit = 3): Promise<BlogPost[]> {
  const current = await db.blogPost.findUnique({ where: { slug }, select: { category: true } });
  const rows = await db.blogPost.findMany({
    where: { slug: { not: slug }, ...(current ? { category: current.category } : {}) },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return rows.map(toBlogPost);
}
