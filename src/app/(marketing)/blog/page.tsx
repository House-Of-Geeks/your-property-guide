import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { Badge } from "@/components/ui";
import { getBlogPosts } from "@/lib/services/blog-service";
import { formatDate } from "@/lib/utils/format";
import { SITE_NAME } from "@/lib/constants";
import { Clock } from "lucide-react";

export const metadata: Metadata = {
  title: `Property Blog | ${SITE_NAME}`,
  description:
    "Expert property insights, market updates, and buying guides for the Moreton Bay region.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd items={[{ name: "Blog", url: "/blog" }]} />
      <Breadcrumbs items={[{ label: "Blog" }]} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Property Blog</h1>
        <p className="text-gray-500 mt-1">
          Expert insights and market updates from our local team
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-[16/10]">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <Badge variant="primary">{post.category}</Badge>
                <h2 className="text-lg font-semibold text-gray-900 mt-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                  <span>{formatDate(post.publishedAt)}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.readingTime} min read
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
