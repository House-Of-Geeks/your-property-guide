import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getBlogPostsByCategory } from "@/lib/services/blog-service";
import { BlogCover } from "@/components/blog/BlogCover";
import { formatDate } from "@/lib/utils/format";

// Compact, always-current "latest news" strip shown high on the homepage.
// Data-driven: it surfaces the single newest News post (by publishedAt), so it
// stays current automatically as new articles are published and never goes
// stale. Reads from the in-bundle blog data (no DB call), so it is safe in the
// static build.
export async function LatestNewsCallout() {
  const [post] = await getBlogPostsByCategory("News", 1);
  if (!post) return null;

  return (
    <section className="bg-surface-warm-sunken border-b border-line">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <Link href={`/guides/${post.slug}`} className="group flex items-center gap-3 sm:gap-5">
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-sans font-medium uppercase tracking-[0.2em] px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
            Latest news
          </span>
          <div className="relative hidden sm:block w-16 h-10 shrink-0 rounded-md overflow-hidden bg-surface-warm-sunken">
            <BlogCover
              slug={post.slug}
              title={post.title}
              category={post.category}
              coverImage={post.coverImage}
              sizes="64px"
            />
          </div>
          <p className="min-w-0 flex-1 font-sans text-sm sm:text-[15px] text-ink leading-snug">
            <span className="font-medium group-hover:text-primary transition-colors line-clamp-1">
              {post.title}
            </span>
            <time dateTime={post.publishedAt} className="hidden md:inline text-ink-subtle">
              {" "}
              &middot; {formatDate(post.publishedAt)}
            </time>
          </p>
          <span className="shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-ink group-hover:text-primary transition-colors">
            <span className="hidden sm:inline">Read</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </Link>
      </div>
    </section>
  );
}
