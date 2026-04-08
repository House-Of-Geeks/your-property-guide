import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { getBlogPosts } from "@/lib/services/blog-service";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Property Blog",
  description: "Expert property insights, market updates, and buying guides from across Australia.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: { title: "Property Blog", description: "Expert property insights, market updates, and buying guides from across Australia.", type: "website" },
  twitter: { card: "summary_large_image" },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const categories = [...new Set(posts.map((p) => p.category))];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd items={[{ name: "Blog", url: "/blog" }]} />
      <Breadcrumbs items={[{ label: "Blog" }]} />

      {/* Hero */}
      <div className="rounded-2xl bg-black px-8 py-10 mb-10 mt-4">
        <span className="inline-block rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs font-semibold text-white/80 mb-3">
          Property Research Blog
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Expert Property Guides &amp; Insights
        </h1>
        <p className="text-white/70 mt-2 max-w-xl">
          Market trends, suburb analysis, buying tips and investment guides from our local property experts.
        </p>
        <p className="text-white/40 text-sm mt-3">{posts.length} articles</p>
      </div>

      <BlogGrid posts={posts} categories={categories} />
    </div>
  );
}
