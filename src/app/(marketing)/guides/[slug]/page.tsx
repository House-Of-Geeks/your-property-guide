import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo";
import { Badge } from "@/components/ui";
import { BlogTableOfContents } from "@/components/blog/BlogTableOfContents";
import { BlogShareButtons } from "@/components/blog/BlogShareButtons";
import { BlogGuideRail } from "@/components/blog/BlogGuideRail";
import { ExpertCTA } from "@/components/journey";
import { AuthorAvatar } from "@/components/blog/AuthorAvatar";
import { AuthorBylineCard } from "@/components/guide";
import { BlogCover } from "@/components/blog/BlogCover";
import { getBlogPostBySlug, getRelatedPosts } from "@/lib/services/blog-service";
import { processContent } from "@/lib/utils/blog-toc";
import { resolveBlogCoverPath } from "@/lib/utils/blog-cover";
import { blogTitle, absoluteUrl } from "@/lib/utils/seo";
import { formatDate } from "@/lib/utils/format";
import { Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { SITE_URL } from "@/lib/constants";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

// ISR, DB-backed posts cache for 24h after first render. Static guide
// folders at /guides/<name>/page.tsx still take precedence; this dynamic
// segment only catches slugs without a matching folder.
//
// generateStaticParams returning [] is required to enable on-demand ISR
// for fully-dynamic [slug] routes, without it, Next.js treats the route
// as opt-out of ISR even with revalidate set. dynamicParams = true (the
// default) lets unknown slugs render + cache on first hit.
export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  // Fall back to the dynamic OG renderer when the post has no real cover
  // file, so social cards always have something brand-consistent to show.
  const realCover = resolveBlogCoverPath(post.coverImage);
  const ogImage = realCover
    ? absoluteUrl(realCover)
    : `${SITE_URL}/api/og/guide/${slug}?title=${encodeURIComponent(post.title)}&desc=${encodeURIComponent(post.excerpt)}&persona=${encodeURIComponent(post.category)}`;
  return {
    title: blogTitle(post),
    description: post.excerpt,
    alternates: { canonical: `${SITE_URL}/guides/${slug}` },
    openGraph: {
      url: `${SITE_URL}/guides/${slug}`,
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: [{ url: ogImage }],
      publishedTime: post.publishedAt,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(slug, 3);
  const { html: processedContent, toc } = processContent(post.content);
  const postUrl = `${SITE_URL}/guides/${slug}`;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <ArticleJsonLd post={post} />
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: post.title, url: `/guides/${post.slug}` },
        ]}
      />
      <Breadcrumbs items={[{ label: "Guides", href: "/guides" }, { label: post.title }]} />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10 items-start">

        {/* ── Article column ── */}
        <article>
          <Link
            href="/guides"
            className="text-sm font-sans text-ink-muted hover:text-primary flex items-center gap-1.5 mb-8 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to guides
          </Link>

          {/* Magazine-style masthead: italic category + hairline + dated slug */}
          <div className="flex items-center gap-4 mb-8">
            <span className="font-display italic text-primary text-base sm:text-lg leading-none">
              {post.category}
            </span>
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
              {formatDate(post.publishedAt)}
            </span>
          </div>

          <h1 className="font-display text-ink leading-[0.98] tracking-tight text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-8 max-w-[22ch] font-medium">
            {post.title}
          </h1>
          {/* Standfirst marked data-speakable-summary so voice assistants
              pick up this paragraph alongside the H1. */}
          <p
            data-speakable-summary
            className="font-display font-light text-xl sm:text-2xl text-ink leading-[1.3] max-w-3xl mb-10"
          >
            {post.excerpt}
          </p>

          {/* Author + meta row with hairline above */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-5 pb-5 border-y border-line">
            <div className="flex items-center gap-3">
              <Link
                href="/about#andy-mcmaster"
                aria-label={`About ${post.author.name}`}
                className="block shrink-0"
              >
                <AuthorAvatar name={post.author.name} image={post.author.image} size={40} />
              </Link>
              <div>
                <p className="text-sm font-sans text-ink-muted">
                  By{" "}
                  <Link
                    href="/about#andy-mcmaster"
                    className="font-semibold text-ink hover:text-primary border-b border-transparent hover:border-primary transition-colors"
                  >
                    {post.author.name}
                  </Link>
                </p>
                <p className="text-xs font-sans text-ink-subtle flex items-center gap-2 mt-0.5">
                  <span>{formatDate(post.publishedAt)}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" aria-hidden="true" /> {post.readingTime} min read
                  </span>
                </p>
              </div>
            </div>
            <BlogShareButtons title={post.title} url={postUrl} />
          </div>

          {/* Hero image */}
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mt-6 border border-line">
            <BlogCover
              slug={post.slug}
              title={post.title}
              category={post.category}
              coverImage={post.coverImage}
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>

          {/* Content */}
          <div
            className="mt-8 prose-ypg"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />

          {/* Guide funnel exit. Every news/blog post points at the
              site's single conversion point. */}
          <ExpertCTA variant="inline" />

          {/* "Read next" rail of relevant guides, internal-link booster */}
          <BlogGuideRail blogSlug={post.slug} />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          )}

          {/* Share (bottom) */}
          <div className="mt-8 pt-6 border-t border-line flex items-center justify-between flex-wrap gap-3">
            <BlogShareButtons title={post.title} url={postUrl} />
            <Link
              href="/guides"
              className="text-sm font-sans font-medium text-ink hover:text-primary border-b border-line-strong hover:border-primary pb-0.5 inline-flex items-center gap-1"
            >
              More guides <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Author byline footer. Matches the AuthorBylineCard used on
              all 58 guide pages so news posts carry the same E-E-A-T
              attribution: portrait, role, last-updated date, link to
              /about. */}
          <AuthorBylineCard
            authorName={post.author.name}
            authorRole="Property writer"
            authorImage={post.author.image}
            lastReviewed={post.updatedAt ?? post.publishedAt}
          />
        </article>

        {/* ── Sticky sidebar ── */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <BlogTableOfContents toc={toc} />
          </div>
        </aside>
      </div>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-16 pt-10 border-t border-line max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="font-display italic text-primary text-base leading-none">
              Keep reading
            </span>
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight mb-8 font-medium">
            Related <span className="italic font-light text-primary">articles</span>.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {relatedPosts.map((rp) => (
              <Link key={rp.slug} href={`/guides/${rp.slug}`} className="group">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-3 border border-line">
                  <Image
                    src={rp.coverImage}
                    alt={rp.title}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    sizes="280px"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant="primary">{rp.category}</Badge>
                  </div>
                </div>
                <h3 className="font-display text-base text-ink leading-tight group-hover:text-primary line-clamp-2 transition-colors">
                  {rp.title}
                </h3>
                <p className="text-xs font-sans text-ink-muted mt-2 line-clamp-2 leading-relaxed">{rp.excerpt}</p>
                <p className="text-xs font-sans text-ink-subtle mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" aria-hidden="true" /> {rp.readingTime} min read
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
