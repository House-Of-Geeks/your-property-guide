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
import { getBlogPostBySlug, getRelatedPosts } from "@/lib/services/blog-service";
import { processContent } from "@/lib/utils/blog-toc";
import { blogTitle, absoluteUrl } from "@/lib/utils/seo";
import { formatDate } from "@/lib/utils/format";
import { Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { SITE_URL } from "@/lib/constants";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

// ISR — DB-backed posts cache for 24h after first render. Static guide
// folders at /guides/<name>/page.tsx still take precedence; this dynamic
// segment only catches slugs without a matching folder.
//
// generateStaticParams returning [] is required to enable on-demand ISR
// for fully-dynamic [slug] routes — without it, Next.js treats the route
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
  return {
    title: blogTitle(post),
    description: post.excerpt,
    alternates: { canonical: `${SITE_URL}/guides/${slug}` },
    openGraph: {
      url: `${SITE_URL}/guides/${slug}`,
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: [{ url: absoluteUrl(post.coverImage) }],
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
            className="text-sm font-sans text-ink-muted hover:text-primary flex items-center gap-1.5 mb-5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to guides
          </Link>

          <Badge variant="primary">{post.category}</Badge>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-ink mt-3 leading-tight tracking-tight">
            {post.title}
          </h1>
          <p className="font-sans text-lg text-ink-muted leading-relaxed mt-4">
            {post.excerpt}
          </p>

          {/* Author + meta row */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 py-4 border-y border-line">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-line-warm">
                <Image src={post.author.image} alt={post.author.name} fill className="object-cover" sizes="40px" />
              </div>
              <div>
                <p className="text-sm font-sans font-semibold text-ink">{post.author.name}</p>
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
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>

          {/* Content */}
          <div
            className="mt-8 prose-ypg"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />

          {/* "Read next" rail of relevant guides — internal-link booster */}
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

          {/* Author box */}
          <div className="mt-10 rounded-2xl bg-surface-warm border border-line-warm p-6 flex gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border border-line-warm">
              <Image src={post.author.image} alt={post.author.name} fill className="object-cover" sizes="64px" />
            </div>
            <div>
              <p className="font-display text-lg text-ink leading-tight">{post.author.name}</p>
              <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mt-1">Property expert</p>
              <p className="text-sm font-sans text-ink-muted mt-2 leading-relaxed">
                Our team of local property experts researches and writes guides to help Australians make confident property decisions.
              </p>
            </div>
          </div>
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
        <div className="mt-16 pt-8 border-t border-line max-w-4xl">
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
            Keep reading
          </p>
          <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight mb-6">
            Related articles
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
