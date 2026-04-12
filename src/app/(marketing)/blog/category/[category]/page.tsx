import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { BlogGrid } from "@/components/blog/BlogGrid";
import {
  getBlogPostsByCategory,
  getDistinctBlogCategories,
} from "@/lib/services/blog-service";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

interface Props {
  params: Promise<{ category: string }>;
}

function formatCategoryLabel(slug: string): string {
  return slug
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateStaticParams() {
  const categories = await getDistinctBlogCategories();
  return categories.map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const label = formatCategoryLabel(category);
  return {
    title: `${label} Articles | Property Blog | ${SITE_NAME}`,
    description: `Browse all ${label} articles and guides from the ${SITE_NAME} property research blog.`,
    alternates: { canonical: `${SITE_URL}/blog/category/${category}` },
    openGraph: {
      url: `${SITE_URL}/blog/category/${category}`,
      title: `${label} Articles | Property Blog | ${SITE_NAME}`,
      description: `Browse all ${label} articles and guides from the ${SITE_NAME} property research blog.`,
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function BlogCategoryPage({ params }: Props) {
  const { category } = await params;
  const [posts, allCategories] = await Promise.all([
    getBlogPostsByCategory(category),
    getDistinctBlogCategories(),
  ]);

  if (posts.length === 0) notFound();

  const label = formatCategoryLabel(category);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Blog", url: "/blog" },
          { name: label, url: `/blog/category/${category}` },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Blog", href: "/blog" },
          { label },
        ]}
      />

      {/* Hero */}
      <div className="rounded-2xl bg-black px-8 py-10 mb-10 mt-4">
        <span className="inline-block rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs font-semibold text-white/80 mb-3">
          {label}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">{label} Articles</h1>
        <p className="text-white/70 mt-2 max-w-xl">
          All articles and guides in the {label} category from the Your Property Guide research blog.
        </p>
        <p className="text-white/40 text-sm mt-3">{posts.length} articles</p>
      </div>

      <BlogGrid posts={posts} categories={allCategories} />
    </div>
  );
}
