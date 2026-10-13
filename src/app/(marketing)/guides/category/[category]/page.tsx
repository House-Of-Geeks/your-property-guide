import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { GuideLinkList } from "@/components/guide/GuideLinkList";
import { GuideStartInline } from "@/components/guide/GuideStartInline";
import { GuideNextStep } from "@/components/guide/GuideNextStep";
import { formatGuideDate } from "@/components/guide/people";
import { guideAudienceForBlogCategory } from "@/lib/guide-funnel";
import {
  categoryToSlug,
  getBlogPostsByCategory,
  getDistinctBlogCategories,
} from "@/lib/services/blog-service";
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

// Page headings by category slug; any other category reads "<Label> articles".
const H1_BY_SLUG: Record<string, string> = {
  selling: "Selling guides and articles",
  "buying-guide": "Buying guides and articles",
  investment: "Investment guides and articles",
  news: "Property news",
  "market-update": "Market updates",
  "suburb-guide": "Suburb guides",
};

const SHELL = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8";

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

  // posts is non-empty here, so the stored label is always available.
  const label = posts[0].category;
  const heading = H1_BY_SLUG[slug] ?? `${label} articles`;
  const audience = guideAudienceForBlogCategory(label) ?? "selling";
  const from = `category-${slug}`;

  return (
    <>
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

      <div className={SHELL}>
        <div className="pt-2 sm:pt-4">
          <Breadcrumbs
            items={[
              { label: "Guides", href: "/guides" },
              { label },
            ]}
          />
        </div>

        <header className="max-w-3xl pt-4 sm:pt-8 pb-6">
          <h1 className="font-display font-bold text-ink text-[2rem] leading-[1.08] tracking-[-0.03em] sm:text-5xl">
            {heading}
          </h1>
          <p className="mt-3 text-[1.0625rem] sm:text-lg text-ink-muted leading-relaxed">
            {guideCount > 0 ? `${posts.length} articles and ${guideCount} guides` : `${posts.length} articles`}, newest
            first. Every one is dated and names who wrote it.
          </p>
        </header>

        {/* The other categories, as links (the old pills filtered this
            page's own posts, so every other pill showed an empty list). */}
        <nav aria-label="Article categories" className="border-y border-line py-3">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <li>
              <Link href="/guides" className="font-medium text-ink-muted hover:text-ink">All guides</Link>
            </li>
            {allCategories.map((c) => {
              const cs = categoryToSlug(c);
              const current = cs === slug;
              return (
                <li key={c}>
                  <Link
                    href={`/guides/category/${cs}`}
                    aria-current={current ? "page" : undefined}
                    className={current ? "font-semibold text-ink underline underline-offset-4" : "font-medium text-ink-muted hover:text-ink"}
                  >
                    {c}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="grid gap-x-16 lg:grid-cols-[minmax(0,1fr)_18rem] pb-16">
          <div className="min-w-0">
            <ul>
              {posts.map((p) => (
                <li key={p.slug} className="border-b border-line">
                  <Link href={`/guides/${p.slug}`} className="group flex items-start gap-4 py-5">
                    <span className="min-w-0 flex-1">
                      <span className="block text-[17px] sm:text-lg font-bold text-ink leading-snug tracking-[-0.01em] group-hover:underline underline-offset-4 decoration-line-strong">
                        {p.title}
                      </span>
                      <span className="mt-1.5 text-[15px] text-ink-muted leading-relaxed line-clamp-2">{p.excerpt}</span>
                      <span className="mt-2 block text-sm text-ink-muted">
                        {p.author.name}
                        <span aria-hidden="true" className="px-1.5 text-line-strong">·</span>
                        <time dateTime={(p.updatedAt ?? p.publishedAt).slice(0, 10)}>
                          {p.updatedAt ? "Updated " : ""}
                          {formatGuideDate(p.updatedAt ?? p.publishedAt)}
                        </time>
                        <span aria-hidden="true" className="px-1.5 text-line-strong">·</span>
                        {p.readingTime} min read
                      </span>
                    </span>
                    <ArrowRight className="w-4 h-4 shrink-0 mt-1.5 text-ink-muted group-hover:text-ink" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>

            {audience === "selling" ? (
              <GuideStartInline from={from} className="mt-12" />
            ) : (
              <GuideNextStep audience="buying" from={from} />
            )}

            {guideSections.length > 0 && (
              <section className="mt-14 border-t border-line pt-10">
                <h2 className="font-display text-[1.625rem] sm:text-[2rem] font-bold text-ink leading-tight tracking-[-0.02em] mb-2">
                  Step-by-step guides
                </h2>
                <p className="text-[15px] sm:text-base text-ink-muted leading-relaxed max-w-2xl mb-6">
                  {`The guides that sit alongside the ${label} articles above.`}
                </p>
                <GuideLinkList
                  columns={2}
                  groups={guideSections.map(({ section, guides }) => ({ label: section.label, links: toGuideLinks(guides) }))}
                />
              </section>
            )}
          </div>

          <aside className="hidden lg:block pt-6">
            <div className="sticky top-24">
              <GuideNextStep audience={audience} from={from} variant="rail" />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
