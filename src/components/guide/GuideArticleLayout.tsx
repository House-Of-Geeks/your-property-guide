import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { ExpertCTA } from "@/components/journey";
import { BreadcrumbJsonLd, GuideArticleJsonLd } from "@/components/seo";
import { ReadingProgressBar } from "./ReadingProgressBar";
import { GuideTOC, type GuideTOCEntry } from "./GuideTOC";
import { Tldr } from "./Tldr";
import { Faq, type FaqItem } from "./Faq";
import { RelatedGuides, type RelatedGuide } from "./RelatedGuides";
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
  // Optional opening illustration. Defaults to the persona illustration when
  // a persona is set.
  heroIllustration?: string;
  tldr: readonly string[];
  toc: readonly GuideTOCEntry[];
  faqs?: readonly FaqItem[];
  related?: readonly RelatedGuide[];
  children: React.ReactNode;
}

export function GuideArticleLayout({
  frontmatter,
  heroIllustration,
  tldr,
  toc,
  faqs = [],
  related = [],
  children,
}: GuideArticleLayoutProps) {
  const persona = frontmatter.persona ? PERSONA_BY_ID[frontmatter.persona] : null;
  const illustration = heroIllustration ?? persona?.illustration ?? null;
  const updatedAt = frontmatter.updatedAt ?? frontmatter.publishedAt;
  const reading = frontmatter.readingTimeMinutes;

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
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className={illustration ? "lg:col-span-8" : "lg:col-span-12"}>
              {/* Top eyebrow row: persona + last-reviewed badge */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5">
                {persona && (
                  <Link
                    href={persona.hubPath}
                    className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] text-cta hover:text-cta-hover"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cta"></span>
                    For {persona.cardLabel.toLowerCase()}
                  </Link>
                )}
                {persona && (
                  <span className="text-ink-subtle hidden sm:inline">·</span>
                )}
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border border-line-warm bg-surface-raised px-2.5 py-1 text-[11px] font-sans uppercase tracking-[0.18em] text-ink-muted"
                  title={`Last reviewed by ${frontmatter.reviewedBy?.name ?? frontmatter.author.name}`}
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-700" aria-hidden="true" />
                  Last reviewed <FormattedDate iso={updatedAt} />
                </span>
              </div>
              <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
                {frontmatter.title}
              </h1>
              <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-2xl mb-8">
                {frontmatter.description}
              </p>

              {/* Byline strip */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-sm text-ink-muted">
                <span className="inline-flex items-center gap-2">
                  <User className="w-4 h-4 text-ink-subtle" aria-hidden="true" />
                  Written by <span className="text-ink font-medium">{frontmatter.author.name}</span>
                  {frontmatter.author.role && (
                    <span className="text-ink-subtle">, {frontmatter.author.role}</span>
                  )}
                </span>
                {frontmatter.reviewedBy && (
                  <span className="inline-flex items-center gap-2">
                    Reviewed by <span className="text-ink font-medium">{frontmatter.reviewedBy.name}</span>
                    {frontmatter.reviewedBy.role && (
                      <span className="text-ink-subtle">, {frontmatter.reviewedBy.role}</span>
                    )}
                  </span>
                )}
                <span className="inline-flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-ink-subtle" aria-hidden="true" />
                  Updated <FormattedDate iso={updatedAt} />
                </span>
                {reading && (
                  <span className="inline-flex items-center gap-2">
                    <Clock className="w-4 h-4 text-ink-subtle" aria-hidden="true" />
                    {reading} min read
                  </span>
                )}
              </div>
            </div>

            {illustration && (
              <div className="lg:col-span-4">
                <div className="rounded-2xl border border-line-warm bg-surface-raised shadow-card overflow-hidden">
                  <Image
                    src={illustration}
                    alt=""
                    width={320}
                    height={220}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Body, two-column with sticky sidebar on desktop */}
      <article className="bg-surface-raised">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Sidebar — sticky TOC + meta on desktop, hidden on mobile (TOC renders inline below) */}
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
                  body="If you&rsquo;ve done the reading and want a real human to talk it through, we&rsquo;ll find the right specialist for your situation &mdash; agent, broker, accountant, conveyancer, whoever fits. Free, no commitment."
                />
              )}

              <Faq items={faqs} />
              <RelatedGuides items={related} />
            </div>
          </div>
        </div>
      </article>
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
