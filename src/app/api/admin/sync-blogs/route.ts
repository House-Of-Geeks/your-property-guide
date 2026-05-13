import { type NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/data/blogs";
import { submitToIndexNow } from "@/lib/indexnow";
import { SITE_URL } from "@/lib/constants";

// POST /api/admin/sync-blogs
// Auth: Authorization: Bearer <INDEXNOW_KEY>
// Optional body: { prune?: boolean, indexnow?: boolean, revalidate?: boolean }
//
// Source-of-truth sync: upserts every entry from src/lib/data/blogs.ts into
// the production DB (whichever the running deployment is connected to),
// then revalidates ISR for the affected paths so the changes show up
// immediately. Optionally pings IndexNow for any newly-created post URLs.
//
// Workflow: edit blogs.ts -> commit -> push -> hit this endpoint.
// `npm run publish:blogs` wraps the curl call.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface SyncBody {
  prune?: boolean;
  indexnow?: boolean;
  revalidate?: boolean;
}

export async function POST(request: NextRequest) {
  const key = process.env.INDEXNOW_KEY;
  const auth = request.headers.get("authorization");
  if (!key || auth !== `Bearer ${key}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: SyncBody = {};
  try {
    body = (await request.json()) as SyncBody;
  } catch {
    // empty body is fine, use defaults
  }
  const doPrune = body.prune === true;
  const doIndexNow = body.indexnow !== false; // default true
  const doRevalidate = body.revalidate !== false; // default true

  const existingSlugs = new Set(
    (await db.blogPost.findMany({ select: { slug: true } })).map((r) => r.slug),
  );
  const sourceSlugs = new Set(blogPosts.map((p) => p.slug));

  const created: string[] = [];
  const updated: string[] = [];

  for (const post of blogPosts) {
    const wasNew = !existingSlugs.has(post.slug);
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
    (wasNew ? created : updated).push(post.slug);
  }

  // Orphan handling: posts in DB but not in source. Opt-in only.
  const orphaned = [...existingSlugs].filter((s) => !sourceSlugs.has(s));
  let pruned: string[] = [];
  if (doPrune && orphaned.length > 0) {
    await db.blogPost.deleteMany({ where: { slug: { in: orphaned } } });
    pruned = orphaned;
  }

  // Revalidate any path that may show the changed content. We always hit the
  // listing + category indexes, plus the per-slug page for everything created
  // or updated. This is cheap and keeps the editor's mental model simple:
  // sync = the site reflects blogs.ts.
  const revalidated: string[] = [];
  if (doRevalidate) {
    const paths = new Set<string>(["/", "/guides"]);
    const categories = new Set(blogPosts.map((p) => p.category));
    for (const c of categories) paths.add(`/guides/category/${c}`);
    for (const slug of created) paths.add(`/guides/${slug}`);
    for (const slug of updated) paths.add(`/guides/${slug}`);
    for (const slug of pruned) paths.add(`/guides/${slug}`);
    for (const p of paths) {
      revalidatePath(p);
      revalidated.push(p);
    }
  }

  // IndexNow ping for newly-created posts only (existing URLs don't need it).
  let indexnow: { submitted: number; urls: string[] } | { skipped: true } = { skipped: true };
  if (doIndexNow && created.length > 0) {
    const urls = created.map((s) => `${SITE_URL}/guides/${s}`);
    try {
      const r = await submitToIndexNow(urls);
      indexnow = { submitted: r.submitted, urls };
    } catch (err) {
      indexnow = { submitted: 0, urls } as { submitted: number; urls: string[] };
      console.error("[sync-blogs] indexnow failed:", err);
    }
  }

  return NextResponse.json({
    ok: true,
    counts: {
      sourceTotal: blogPosts.length,
      created: created.length,
      updated: updated.length,
      pruned: pruned.length,
      orphanedInDb: orphaned.length, // present in DB but not source; deleted only if prune=true
    },
    created,
    updated: updated.length > 50 ? `${updated.length} posts` : updated,
    orphaned,
    pruned,
    revalidated,
    indexnow,
    siteUrl: SITE_URL,
  });
}
