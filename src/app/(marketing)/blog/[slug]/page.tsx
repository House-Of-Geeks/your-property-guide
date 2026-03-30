import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo";
import { Badge } from "@/components/ui";
import { getBlogPostBySlug, getRelatedPosts } from "@/lib/services/blog-service";
import { blogTitle, absoluteUrl } from "@/lib/utils/seo";
import { formatDate } from "@/lib/utils/format";
import { Clock, ArrowLeft } from "lucide-react";
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

      <article className="max-w-3xl mx-auto mt-6">
        <Link href="/blog" className="text-sm text-primary flex items-center gap-1 mb-4 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Blog
        </Link>

        <Badge variant="primary">{post.category}</Badge>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">{post.title}</h1>

        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image src={post.author.image} alt={post.author.name} fill className="object-cover" sizes="32px" />
            </div>
            <span>{post.author.name}</span>
          </div>
          <span>{formatDate(post.publishedAt)}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {post.readingTime} min read
          </span>
        </div>

        <div className="relative aspect-[16/9] rounded-xl overflow-hidden mt-6">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>

        <div
          className="mt-8 prose prose-gray max-w-none prose-headings:text-gray-900 prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
        )}
      </article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="max-w-3xl mx-auto mt-16 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedPosts.map((rp) => (
              <Link key={rp.slug} href={`/blog/${rp.slug}`} className="group">
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-2">
                  <Image src={rp.coverImage} alt={rp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="250px" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary line-clamp-2">
                  {rp.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
