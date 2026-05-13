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
// Diff-aware DB mirror + ISR busting. Mirrors src/lib/data/blogs.ts to the
// production DB (so any external consumer that reads the table stays in
// sync), but revalidates ISR paths only for posts whose content actually
// changed. This stops every publish from invalidating the entire blog
// surface area and burning function-duration on regenerations.
//
// Note: the site itself no longer reads blog data from the DB — services
// read directly from the in-source array. This endpoint is now mainly a
// DB mirror + ISR revalidation trigger. Both are skipped automatically when
// there are no real changes, so calling it twice in a row is essentially
// free.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface SyncBody {
  prune?: boolean;
  indexnow?: boolean;
  revalidate?: boolean;
}

// Content-equivalence check: only the fields that affect the rendered page
// or the DB row. If none of these changed, the row needs no write and the
// page needs no revalidation.
type DbRow = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  authorName: string;
  authorImage: string;
  category: string;
  tags: string[];
  publishedAt: Date;
  updatedAt: Date | null;
  readingTime: number;
};

function isSamePost(row: DbRow, source: typeof blogPosts[number]): boolean {
  if (row.title !== source.title) return false;
  if (row.excerpt !== source.excerpt) return false;
  if (row.content !== source.content) return false;
  if (row.coverImage !== source.coverImage) return false;
  if (row.authorName !== source.author.name) return false;
  if (row.authorImage !== source.author.image) return false;
  if (row.category !== source.category) return false;
  if (row.readingTime !== source.readingTime) return false;
  if (row.publishedAt.toISOString().slice(0, 10) !== source.publishedAt.slice(0, 10)) return false;
  const rowUpdated = row.updatedAt?.toISOString().slice(0, 10) ?? null;
  const srcUpdated = source.updatedAt ? source.updatedAt.slice(0, 10) : null;
  if (rowUpdated !== srcUpdated) return false;
  if (row.tags.length !== source.tags.length) return false;
  for (let i = 0; i < row.tags.length; i++) {
    if (row.tags[i] !== source.tags[i]) return false;
  }
  return true;
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
    // empty body is fine — use defaults
  }
  const doPrune = body.prune === true;
  const doIndexNow = body.indexnow !== false;
  const doRevalidate = body.revalidate !== false;

  const existingRows = await db.blogPost.findMany({
    select: {
      slug: true, title: true, excerpt: true, content: true, coverImage: true,
      authorName: true, authorImage: true, category: true, tags: true,
      publishedAt: true, updatedAt: true, readingTime: true,
    },
  });
  const existingMap = new Map(existingRows.map((r) => [r.slug, r as DbRow]));
  const sourceSlugs = new Set(blogPosts.map((p) => p.slug));

  const created: string[] = [];
  const updated: string[] = [];
  const unchanged: string[] = [];
  const changedCategories = new Set<string>();

  for (const post of blogPosts) {
    const row = existingMap.get(post.slug);
    if (row && isSamePost(row, post)) {
      unchanged.push(post.slug);
      continue;
    }
    const wasNew = !row;
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
    changedCategories.add(post.category);
    if (row) changedCategories.add(row.category);
  }

  const orphaned = [...existingMap.keys()].filter((s) => !sourceSlugs.has(s));
  let pruned: string[] = [];
  if (doPrune && orphaned.length > 0) {
    await db.blogPost.deleteMany({ where: { slug: { in: orphaned } } });
    pruned = orphaned;
    for (const s of orphaned) {
      const r = existingMap.get(s);
      if (r) changedCategories.add(r.category);
    }
  }

  // Revalidate only paths that actually changed. Stops every publish from
  // wiping the whole blog surface and triggering needless ISR regens.
  const revalidated: string[] = [];
  if (doRevalidate && (created.length > 0 || updated.length > 0 || pruned.length > 0)) {
    const paths = new Set<string>(["/", "/guides", "/insights"]);
    for (const c of changedCategories) paths.add(`/guides/category/${c}`);
    for (const slug of [...created, ...updated, ...pruned]) paths.add(`/guides/${slug}`);
    for (const p of paths) {
      revalidatePath(p);
      revalidated.push(p);
    }
  }

  // IndexNow only for newly-created post URLs. Existing URLs don't need it.
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
      unchanged: unchanged.length,
      pruned: pruned.length,
      orphanedInDb: orphaned.length,
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
