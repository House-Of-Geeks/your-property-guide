import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { ArticleJsonLd, BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo";
import { BlogShareButtons } from "@/components/blog/BlogShareButtons";
import { BlogCover } from "@/components/blog/BlogCover";
import { blogReadNext } from "@/components/blog/BlogGuideRail";
import { AuthorBylineCard, GuideStartInline } from "@/components/guide";
import { GuideByline } from "@/components/guide/GuideByline";
import { GuideTOC, type GuideTOCEntry } from "@/components/guide/GuideTOC";
import { GuideNextStep } from "@/components/guide/GuideNextStep";
import { RelatedGuides, type RelatedGuide } from "@/components/guide/RelatedGuides";
import articleScope from "@/components/guide/article-scope.module.css";
import { categoryToSlug, getBlogPostBySlug, getRelatedPosts } from "@/lib/services/blog-service";
import { processContent, splitHtmlAfterFirstSection } from "@/lib/utils/blog-toc";
import { extractArticleFaqs } from "@/lib/utils/blog-faq";
import { guideAudienceForBlogCategory } from "@/lib/guide-funnel";
import { resolveBlogCoverPath } from "@/lib/utils/blog-cover";
import { blogTitle, absoluteUrl } from "@/lib/utils/seo";
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

// Same measure as GuideArticleLayout: a 40rem reading column and a 16rem
// rail, centred.
const SHELL = "mx-auto w-full max-w-[64rem] px-4 sm:px-6";

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(slug, 3);
  const { html: processedContent, toc } = processContent(post.content);
  const postUrl = `${SITE_URL}/guides/${slug}`;
  const updatedAt = post.updatedAt ?? post.publishedAt;
  // The FAQ the article already shows, as FAQPage JSON-LD (selling review P7).
  const faqs = extractArticleFaqs(post.content);
  const sourcesEntry = toc.find((t) => t.level === 2 && /^sources\b/i.test(t.text));

  // CTAs follow the post's blog category: selling posts start the selling
  // guide in place (after the first section and again at the end), buying
  // posts end on the buying guide, and everything else (news, market
  // updates) keeps the selling-guide default.
  const audience = guideAudienceForBlogCategory(post.category);
  const nextStep = audience ?? "selling";
  const sellingPost = audience === "selling";
  const sections = sellingPost ? splitHtmlAfterFirstSection(processedContent) : null;

  // A real photograph shows at every width. The typeset cover repeats the
  // H1, so it shows as a slim band from tablet up and not at all on phones.
  const realCover = resolveBlogCoverPath(post.coverImage);

  // Contents list the article's sections (h2); the h3s under them would
  // make the list longer than the article's first screen.
  const contents: GuideTOCEntry[] = toc.filter((t) => t.level === 2).map((t) => ({ id: t.id, label: t.text }));
  const keepReading = dedupe([
    ...blogReadNext(post.slug, post.category),
    ...relatedPosts.map((rp) => ({ title: rp.title, href: `/guides/${rp.slug}`, description: rp.excerpt })),
  ]).slice(0, 6);

  return (
    <>
      <ArticleJsonLd post={post} />
      {faqs.length > 0 && <FAQPageJsonLd faqs={faqs} />}
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", url: "/guides" },
          { name: post.title, url: `/guides/${post.slug}` },
        ]}
      />
      {/* Tells the phone bar (MobileBottomNav) which guide this reader gets. */}
      <span hidden data-guide-audience={nextStep} />

      <div className={SHELL}>
        <div className="pt-2 sm:pt-4 [&_ol]:flex-nowrap [&_li:last-child]:hidden sm:[&_li:last-child]:flex sm:[&_li:last-child]:min-w-0 [&_li:last-child_span]:min-w-0 [&_li:last-child_span]:truncate">
          <Breadcrumbs items={[{ label: "Guides", href: "/guides" }, { label: post.title }]} />
        </div>

        <header className="max-w-[46rem] pt-4 sm:pt-8 pb-8">
          <Link
            href={`/guides/category/${categoryToSlug(post.category)}`}
            className="inline-block text-sm font-semibold text-ink-muted hover:text-ink underline-offset-4 hover:underline mb-3"
          >
            {post.category}
          </Link>
          <h1 className="font-display font-bold text-ink text-[1.875rem] leading-[1.1] tracking-[-0.03em] sm:text-[2.375rem] lg:text-[2.625rem] lg:leading-[1.08]">
            {post.title}
          </h1>
          {/* Standfirst marked data-speakable-summary so voice assistants
              pick up this paragraph alongside the H1. */}
          <p data-speakable-summary className="mt-4 text-[1.0625rem] sm:text-xl text-ink-muted leading-relaxed">
            {post.excerpt}
          </p>
          <div className="mt-6">
            <GuideByline
              author={{ name: post.author.name, image: post.author.image }}
              updatedAt={updatedAt}
              publishedAt={post.publishedAt}
              readingMinutes={post.readingTime}
              sourcesHref={sourcesEntry ? `#${sourcesEntry.id}` : undefined}
            />
          </div>
        </header>
      </div>

      <div className={`${SHELL} pb-16`}>
        <div className="lg:grid lg:grid-cols-[minmax(0,40rem)_16rem] lg:justify-between lg:gap-x-16">
          <article className={`min-w-0 ${articleScope.scope}`}>
            <div
              className={`relative overflow-hidden rounded-xl border border-line ${
                realCover ? "aspect-[16/9]" : "hidden sm:block aspect-[3/1]"
              }`}
            >
              <BlogCover
                slug={post.slug}
                title={post.title}
                category={post.category}
                coverImage={post.coverImage}
                sizes="(max-width: 768px) 100vw, 640px"
                priority
              />
            </div>

            {contents.length > 1 && (
              <div className="lg:hidden mt-2 sm:mt-6">
                <GuideTOC entries={contents} title="In this article" />
              </div>
            )}

            {sections ? (
              <>
                <div className="mt-8 sm:mt-10 prose-ypg" dangerouslySetInnerHTML={{ __html: sections[0] }} />
                <GuideStartInline from={post.slug} />
                <div className="prose-ypg" dangerouslySetInnerHTML={{ __html: sections[1] }} />
              </>
            ) : (
              <div className="mt-8 sm:mt-10 prose-ypg" dangerouslySetInnerHTML={{ __html: processedContent }} />
            )}

            {/* The one end-of-article action, routed by the post's category. */}
            {nextStep === "selling" ? (
              <GuideStartInline from={post.slug} className="mt-12 mb-10" />
            ) : (
              <GuideNextStep audience="buying" from={post.slug} />
            )}

            <RelatedGuides items={keepReading} />

            <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
              <BlogShareButtons title={post.title} url={postUrl} />
              <Link
                href="/guides"
                className="text-sm font-medium text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink"
              >
                All guides
              </Link>
            </div>

            {/* About this article: the writer's own photo, role and bio. */}
            <AuthorBylineCard
              authorName={post.author.name}
              authorImage={post.author.image}
              lastReviewed={updatedAt}
            />
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-6 space-y-8">
              {contents.length > 0 && <GuideTOC entries={contents} variant="sidebar" title="In this article" />}
              <GuideNextStep audience={nextStep} from={post.slug} variant="rail" />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

function dedupe(items: RelatedGuide[]): RelatedGuide[] {
  const seen = new Set<string>();
  return items.filter((i) => (seen.has(i.href) ? false : (seen.add(i.href), true)));
}
