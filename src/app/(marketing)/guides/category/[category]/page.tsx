import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { GuideLinkList } from "@/components/guide/GuideLinkList";
import {
  categoryToSlug,
  getBlogPostsByCategory,
  getDistinctBlogCategories,
} from "@/lib/services/blog-service";
import { resolveBlogCoverPath } from "@/lib/utils/blog-cover";
import { staticGuidesForCategoryPage } from "@/lib/guides/registry";
import { toGuideLinks } from "@/lib/guides/hub-guides";
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

export const revalidate = 86400; // cache as ISR for 24h, regen on demand

export async function generateStaticParams() {
  // Skip prerender at build time, DB isn't reachable during `next build`.
  // Pages render on-demand via dynamicParams=true (App Router default).
  if (process.env.NEXT_PHASE === "phase-production-build") return [];
  const categories = await getDistinctBlogCategories();
  return categories.map((category) => ({ category: categoryToSlug(category) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const slug = categoryToSlug(category);
  // Use the stored label for display; fall back to title-casing the slug so
  // metadata still renders for unknown categories (the page 404s anyway).
  const [post] = await getBlogPostsByCategory(category, 1);
  const label = post?.category ?? formatCategoryLabel(slug);
  return {
    title: `${label} Articles | Property Blog`,
    description: `Browse all ${label} articles and guides from the ${SITE_NAME} property research blog.`,
    alternates: { canonical: `${SITE_URL}/guides/category/${slug}` },
    openGraph: {
      url: `${SITE_URL}/guides/category/${slug}`,
      title: `${label} Articles | Property Blog | ${SITE_NAME}`,
      description: `Browse all ${label} articles and guides from the ${SITE_NAME} property research blog.`,
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function BlogCategoryPage({ params }: Props) {
  const { category } = await params;
  const slug = categoryToSlug(category);
  // Raw-label URLs ("/guides/category/News", ".../Buying%20Guide") used to be
  // the advertised form, so they may still be indexed or bookmarked. Send
  // them to the canonical slug URL so only one form accumulates ranking.
  if (category !== slug) permanentRedirect(`/guides/category/${slug}`);

  // Every article in the category (the default limit of 100 would cut a
  // growing category short), then the static guides filed under it, so the
  // page lists its full set. All bundled data: no database read, and the
  // 24-hour ISR window is unchanged.
  const [posts, allCategories] = await Promise.all([
    getBlogPostsByCategory(slug, Number.POSITIVE_INFINITY),
    getDistinctBlogCategories(),
  ]);
  const guideSections = staticGuidesForCategoryPage(slug);
  const guideCount = guideSections.reduce((n, s) => n + s.guides.length, 0);

  if (posts.length === 0) notFound();

  // Pre-resolve cover paths on the server so BlogGrid (client) doesn't need
  // filesystem access. Missing files become "", BlogGrid renders the
  // BlogCoverFallback in that case.
  const resolvedPosts = posts.map((p) => ({
    ...p,
    coverImage: resolveBlogCoverPath(p.coverImage) ?? "",
  }));

  // posts is non-empty here, so the stored label is always available.
  const label = posts[0].category;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <CollectionPageJsonLd
        name={label + " Articles"}
        url={"/guides/category/" + slug}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: label, url: `/guides/category/${slug}` },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
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
        <p className="text-white/40 text-sm mt-3">
          {guideCount > 0 ? `${posts.length} articles and ${guideCount} guides` : `${posts.length} articles`}
        </p>
      </div>

      <BlogGrid posts={resolvedPosts} categories={allCategories} />

      {guideSections.length > 0 && (
        <section className="mt-16 border-t border-line pt-12">
          <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl mb-3">
            Step-by-step guides
          </h2>
          <p className="font-sans text-base text-ink-muted leading-relaxed max-w-2xl mb-8">
            {`The guides that sit alongside the ${label} articles above.`}
          </p>
          <GuideLinkList
            groups={guideSections.map(({ section, guides }) => ({ label: section.label, links: toGuideLinks(guides) }))}
          />
        </section>
      )}
    </div>
  );
}
