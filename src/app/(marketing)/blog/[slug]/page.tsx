import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo";
import { Badge } from "@/components/ui";
import { BlogTableOfContents } from "@/components/blog/BlogTableOfContents";
import { BlogShareButtons } from "@/components/blog/BlogShareButtons";
import { getBlogPostBySlug, getRelatedPosts } from "@/lib/services/blog-service";
import { processContent } from "@/lib/utils/blog-toc";
import { blogTitle, absoluteUrl } from "@/lib/utils/seo";
import { formatDate } from "@/lib/utils/format";
import { Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { SITE_URL } from "@/lib/constants";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: blogTitle(post),
    description: post.excerpt,
    alternates: { canonical: `${SITE_URL}/blog/${slug}` },
    openGraph: {
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
  const postUrl = `${SITE_URL}/blog/${slug}`;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <ArticleJsonLd post={post} />
      <BreadcrumbJsonLd
        items={[
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10 items-start">

        {/* ── Article column ── */}
        <article>
          <Link href="/blog" className="text-sm text-primary flex items-center gap-1 mb-5 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Blog
          </Link>

          <Badge variant="primary">{post.category}</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 leading-tight">
            {post.title}
          </h1>
          <p className="text-lg text-gray-500 mt-3">{post.excerpt}</p>

          {/* Author + meta row */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-5 py-4 border-y border-gray-100">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image src={post.author.image} alt={post.author.name} fill className="object-cover" sizes="40px" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{post.author.name}</p>
                <p className="text-xs text-gray-400 flex items-center gap-2">
                  <span>{formatDate(post.publishedAt)}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.readingTime} min read
                  </span>
                </p>
              </div>
            </div>
            <BlogShareButtons title={post.title} url={postUrl} />
          </div>

          {/* Hero image */}
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden mt-6">
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
            className="mt-8 prose prose-gray max-w-none prose-headings:text-gray-900 prose-headings:scroll-mt-24 prose-a:text-primary prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          )}

          {/* Share (bottom) */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <BlogShareButtons title={post.title} url={postUrl} />
            <Link href="/blog" className="text-sm text-primary hover:underline flex items-center gap-1">
              More articles <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Author box */}
          <div className="mt-8 rounded-2xl bg-gray-50 border border-gray-200 p-6 flex gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
              <Image src={post.author.image} alt={post.author.name} fill className="object-cover" sizes="64px" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{post.author.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">Property Expert</p>
              <p className="text-sm text-gray-600 mt-2">
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
        <div className="mt-16 pt-8 border-t border-gray-200 max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {relatedPosts.map((rp) => (
              <Link key={rp.slug} href={`/blog/${rp.slug}`} className="group">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3">
                  <Image
                    src={rp.coverImage}
                    alt={rp.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="280px"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant="primary">{rp.category}</Badge>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary line-clamp-2">
                  {rp.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{rp.excerpt}</p>
                <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {rp.readingTime} min read
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
