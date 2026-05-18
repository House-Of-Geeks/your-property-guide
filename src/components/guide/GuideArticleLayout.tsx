import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { ExpertCTA, StickyMatchCTA } from "@/components/journey";
import { BreadcrumbJsonLd, GuideArticleJsonLd } from "@/components/seo";
import { ReadingProgressBar } from "./ReadingProgressBar";
import { GuideTOC, type GuideTOCEntry } from "./GuideTOC";
import { Tldr } from "./Tldr";
import { Faq, type FaqItem } from "./Faq";
import { RelatedGuides, type RelatedGuide } from "./RelatedGuides";
import { AuthorBylineCard } from "./AuthorBylineCard";
import { PERSONA_BY_ID, type PersonaId } from "@/lib/constants/journey";

export interface GuideFrontmatter {
  title: string;          // Article H1
  description: string;    // Meta description
  slug: string;           // URL slug under /guides/
  publishedAt: string;    // ISO date
  updatedAt?: string;     // ISO date; defaults to publishedAt
  readingTimeMinutes?: number;
  // EEAT signals per SEO ranking advice doc
  author: { name: string; role?: string };
  reviewedBy?: { name: string; role?: string };
  // Persona this guide primarily serves; powers the soft sidebar CTA.
  persona?: PersonaId;
}

interface GuideArticleLayoutProps {
  frontmatter: GuideFrontmatter;
  tldr: readonly string[];
  toc: readonly GuideTOCEntry[];
  faqs?: readonly FaqItem[];
  related?: readonly RelatedGuide[];
  children: React.ReactNode;
}

export function GuideArticleLayout({
  frontmatter,
  tldr,
  toc,
  faqs = [],
  related = [],
  children,
}: GuideArticleLayoutProps) {
  const persona = frontmatter.persona ? PERSONA_BY_ID[frontmatter.persona] : null;
  const updatedAt = frontmatter.updatedAt ?? frontmatter.publishedAt;
  const reading = frontmatter.readingTimeMinutes;

  // Map the guide's persona onto a MatchAgent intent so the sticky CTA
  // pre-fills the form when the reader clicks through. Guides without a
  // persona (e.g. general explainers) skip the sticky entirely, see below.
  const stickyIntent: "buying" | "selling" | "investing" | undefined =
    frontmatter.persona === "first-home" ? "buying" :
    frontmatter.persona === "upgrading"  ? "buying" :
    frontmatter.persona === "selling"    ? "selling" :
    frontmatter.persona === "investing"  ? "investing" :
                                            undefined;

  const guideUrl = `/guides/${frontmatter.slug}`;
  const breadcrumbItems = [
    { label: "Guides", href: "/guides" },
    { label: frontmatter.title },
  ];
  const schemaBreadcrumbItems = [
    { name: "Guides", url: "/guides" },
    { name: frontmatter.title, url: guideUrl },
  ];

  return (
    <>
      <ReadingProgressBar />
      <BreadcrumbJsonLd items={schemaBreadcrumbItems} />
      <GuideArticleJsonLd
        title={frontmatter.title}
        description={frontmatter.description}
        url={guideUrl}
        datePublished={frontmatter.publishedAt}
        dateModified={updatedAt}
        author={frontmatter.author}
        reviewedBy={frontmatter.reviewedBy}
      />

      {/* Editorial hero. Magazine-style masthead with persona department
          slug, display-scale H1, serif standfirst, hairline-separated
          byline. Illustration column dropped: guides read as authoritative
          editorial when the headline owns the page. */}
      <section className="relative bg-surface-warm border-b border-line overflow-hidden">
        <Image
          src="/images/illustrations/contour.svg"
          alt=""
          width={1200}
          height={800}
          aria-hidden="true"
          className="absolute -right-40 -top-40 w-[1100px] max-w-none opacity-[0.10] pointer-events-none select-none"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-14 sm:pb-20 lg:pb-24">
          <div className="mb-10">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          {/* Editorial masthead: persona department + hairline + dated slug */}
          <div className="flex items-center gap-4 mb-10">
            {persona ? (
              <Link
                href={persona.hubPath}
                className="font-display italic text-primary hover:text-cta-hover text-base sm:text-lg leading-none transition-colors"
              >
                For {persona.cardLabel.toLowerCase()}
              </Link>
            ) : (
              <span className="font-display italic text-primary text-base sm:text-lg leading-none">
                The reading list
              </span>
            )}
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-emerald-700" aria-hidden="true" />
              Reviewed <FormattedDate iso={updatedAt} />
            </span>
          </div>

          {/* Display-scale H1. text-7xl/lg:8xl for editorial weight */}
          <h1 className="font-display text-ink leading-[0.98] tracking-tight text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-8 max-w-[22ch] font-medium">
            {frontmatter.title}
          </h1>

          {/* Standfirst in serif light for editorial colour. Marked
              data-speakable-summary so voice assistants (Google Assistant,
              Siri Reading Mode) pick up this paragraph as the canonical
              spoken summary alongside the H1. */}
          <p
            data-speakable-summary
            className="font-display font-light text-xl sm:text-2xl text-ink leading-[1.3] max-w-3xl mb-10"
          >
            {frontmatter.description}
          </p>

          {/* Byline strip with hairline rule above. Cleaner typographic
              hierarchy. */}
          <div className="pt-6 border-t border-line flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-sm text-ink-muted">
            <span className="inline-flex items-center gap-2">
              <User className="w-4 h-4 text-ink-subtle" aria-hidden="true" />
              By <span className="text-ink font-medium">{frontmatter.author.name}</span>
              {frontmatter.author.role && (
                <span className="text-ink-subtle">, {frontmatter.author.role}</span>
              )}
            </span>
            {frontmatter.reviewedBy && (
              <span className="inline-flex items-center gap-2">
                <span className="text-ink-subtle">·</span>
                Reviewed by <span className="text-ink font-medium">{frontmatter.reviewedBy.name}</span>
                {frontmatter.reviewedBy.role && (
                  <span className="text-ink-subtle">, {frontmatter.reviewedBy.role}</span>
                )}
              </span>
            )}
            <span className="inline-flex items-center gap-2">
              <span className="text-ink-subtle">·</span>
              <Calendar className="w-4 h-4 text-ink-subtle" aria-hidden="true" />
              Updated <FormattedDate iso={updatedAt} />
            </span>
            {reading && (
              <span className="inline-flex items-center gap-2">
                <span className="text-ink-subtle">·</span>
                <Clock className="w-4 h-4 text-ink-subtle" aria-hidden="true" />
                {reading} min read
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Body, two-column with sticky sidebar on desktop */}
      <article className="bg-surface-raised">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Sidebar, sticky TOC + meta on desktop, hidden on mobile (TOC renders inline below) */}
            <aside className="hidden lg:block lg:col-span-3 lg:order-2">
              <div className="sticky top-28 space-y-8">
                <GuideTOC entries={toc} variant="sidebar" />

                <div className="rounded-2xl border border-line bg-surface-warm p-5">
                  <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mb-2 inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                    Last reviewed
                  </p>
                  <p className="font-display text-lg text-ink leading-tight mb-1">
                    <FormattedDate iso={updatedAt} />
                  </p>
                  {frontmatter.reviewedBy && (
                    <p className="font-sans text-xs text-ink-muted leading-relaxed">
                      by {frontmatter.reviewedBy.name}
                      {frontmatter.reviewedBy.role && (
                        <span className="text-ink-subtle">, {frontmatter.reviewedBy.role}</span>
                      )}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mb-2">
                    Editorial integrity
                  </p>
                  <p className="font-sans text-sm text-ink-muted leading-relaxed">
                    Every figure on this page is sourced and dated. If anything looks off, tell us and we&rsquo;ll fix it within a week.
                  </p>
                  <p className="mt-3">
                    <Link
                      href="/methodology"
                      className="inline-flex items-center gap-1 font-sans text-sm font-medium text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
                    >
                      How we source data →
                    </Link>
                  </p>
                </div>
              </div>
            </aside>

            {/* Main column */}
            <div className="lg:col-span-9 lg:order-1">
              <Tldr points={tldr} />

              {/* Mobile-only inline TOC */}
              <div className="lg:hidden">
                <GuideTOC entries={toc} />
              </div>

              <div className="prose-ypg">
                {children}
              </div>

              {persona && (
                <ExpertCTA
                  variant="inline"
                  headline="Want one-on-one help with this stage?"
                  body="If you&rsquo;ve done the reading and want a real human to talk it through, we&rsquo;ll find the right specialist for your situation, whether that&rsquo;s an agent, broker, accountant or conveyancer. Free, no commitment."
                />
              )}

              <Faq items={faqs} />
              <RelatedGuides items={related} />

              {/* Author byline footer. E-E-A-T signal for Google + Bing: a
                  named author with portrait, role and link to /about
                  appears on every guide. */}
              <AuthorBylineCard
                authorName={frontmatter.author.name}
                authorRole={frontmatter.author.role}
                reviewerName={frontmatter.reviewedBy?.name}
                reviewerRole={frontmatter.reviewedBy?.role}
                lastReviewed={updatedAt}
              />
            </div>
          </div>
        </div>
      </article>

      {/* Floating "Get connected" pill for guide readers. Only renders when
          the guide has a persona, general explainers (no persona) skip the
          sticky to keep them quiet. Per-guide dismiss key. */}
      {persona && stickyIntent && (
        <StickyMatchCTA
          intent={stickyIntent}
          label="Get connected"
          dismissKey={`guide:${frontmatter.slug}`}
        />
      )}
    </>
  );
}

// Render YYYY-MM-DD as "Month YYYY" for human reading. Server-rendered so no
// hydration mismatch.
function FormattedDate({ iso }: { iso: string }) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return <>{iso}</>;
  const month = d.toLocaleString("en-AU", { month: "long", timeZone: "Australia/Brisbane" });
  return <>{month} {d.getUTCFullYear()}</>;
}
