import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { getBlogPosts } from "@/lib/services/blog-service";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Property Blog",
  description: "Property research, market commentary and editorial insights from across Australia.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: { url: `${SITE_URL}/blog`, title: "Property Blog", description: "Property research, market commentary and editorial insights from across Australia.", type: "website" },
  twitter: { card: "summary_large_image" },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const categories = [...new Set(posts.map((p) => p.category))];

  return (
    <>
      <CollectionPageJsonLd
        name="Property Blog"
        description="Property news, tips, and insights for Australian buyers, sellers, and investors."
        url="/blog"
      />
      <BreadcrumbJsonLd items={[{ name: "Blog", url: "/blog" }]} />

      {/* Editorial hero */}
      <section className="relative bg-surface-warm border-b border-line overflow-hidden">
        <Image
          src="/images/illustrations/contour.svg"
          alt=""
          width={1200}
          height={800}
          aria-hidden="true"
          className="absolute -right-40 -top-40 w-[1100px] max-w-none opacity-[0.10] pointer-events-none select-none"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pb-16">
          <div className="mb-8">
            <Breadcrumbs items={[{ label: "Blog" }]} />
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
                {posts.length} articles, market commentary
              </p>
              <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
                The editorial <span className="italic text-primary">desk</span>.
              </h1>
              <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-2xl">
                Market commentary, suburb analysis, and editorial pieces.
                Updated regularly. Looking for the long-form how-to guides
                instead?{" "}
                <Link href="/guides" className="text-ink hover:text-primary border-b border-line-strong hover:border-primary pb-0.5 inline-flex items-center gap-1">
                  Browse the guides <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </p>
            </div>

            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-line-warm bg-surface-raised shadow-card overflow-hidden">
                <Image
                  src="/images/illustrations/guides-hero.svg"
                  alt=""
                  width={320}
                  height={220}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <BlogGrid posts={posts} categories={categories} />
      </div>
    </>
  );
}
