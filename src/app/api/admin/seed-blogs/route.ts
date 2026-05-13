import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/data/blogs";

// POST /api/admin/seed-blogs
// Auth: Authorization: Bearer <INDEXNOW_KEY>
//
// One-shot admin endpoint: re-seeds blog posts from src/lib/data/blogs.ts
// against whichever database the running Vercel deployment is connected to.
// Required when the local seed script targeted a different DB than prod
// (Railway internal vs external proxy URLs). Idempotent — upserts on slug.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const key = process.env.INDEXNOW_KEY;
  const auth = request.headers.get("authorization");
  if (!key || auth !== `Bearer ${key}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: { slug: string; action: "created" | "updated" }[] = [];
  for (const post of blogPosts) {
    const existing = await db.blogPost.findUnique({ where: { slug: post.slug }, select: { id: true } });
    await db.blogPost.upsert({
      where: { slug: post.slug },
      create: {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        authorName: post.author.name,
        authorImage: post.author.image,
        category: post.category,
        tags: post.tags,
        publishedAt: new Date(post.publishedAt),
        updatedAt: post.updatedAt ? new Date(post.updatedAt) : null,
        readingTime: post.readingTime,
      },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        authorName: post.author.name,
        authorImage: post.author.image,
        category: post.category,
        tags: post.tags,
        publishedAt: new Date(post.publishedAt),
        updatedAt: post.updatedAt ? new Date(post.updatedAt) : null,
        readingTime: post.readingTime,
      },
    });
    results.push({ slug: post.slug, action: existing ? "updated" : "created" });
  }

  const total = await db.blogPost.count();
  const news = await db.blogPost.count({ where: { category: "News" } });

  return NextResponse.json({ ok: true, total, news, results });
}
