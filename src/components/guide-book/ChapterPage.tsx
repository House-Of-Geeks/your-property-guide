import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ReadingProgress } from "@/components/interactive/ReadingProgress";
import { BookCover } from "@/components/brand/BookCover";
import { BreadcrumbJsonLd, GuideArticleJsonLd } from "@/components/seo";
import { FOUNDER } from "@/lib/founder";
import { GUIDE_BOOKS, chapterHref, type GuideBookId } from "@/lib/guide-books";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";
import { chapterEntries, getChapter } from "@/content/guides";
import { ChapterContent } from "./ChapterContent";
import { GuideIntroNote } from "./GuideIntroNote";

// One chapter of a free guide as a page of its own (15 Oct 2026):
// /selling-guide/<slug> and /buying-guide/<slug>. The content is
// src/content/guides; the whole guide is still free as a PDF from the
// guide's landing page. v7 (20 Oct 2026): a reading page first, with the
// contents and the matched cover beside it.

const SHELL = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10";
const PUBLISHED = "2026-10-15";

export function chapterParams(guide: GuideBookId) {
  return GUIDE_BOOKS[guide].chapters.map((c) => ({ chapter: c.slug }));
}

export function chapterMetadata(guide: GuideBookId, slug: string): Metadata {
  const c = getChapter(guide, slug);
  if (!c) return {};
  const book = GUIDE_BOOKS[guide];
  const url = `${SITE_URL}${book.href}/${c.slug}`;
  const title = `${c.title}: chapter ${c.number} of ${book.name}, a free guide`;
  return {
    title,
    description: c.standfirst,
    alternates: { canonical: url },
    openGraph: { ...DEFAULT_OG,
      title: c.title,
      description: c.standfirst,
      url,
      type: "article",
      images: guideOgImages({ slug: `${book.id}-guide-${c.slug}`, title: c.title, description: c.standfirst, persona: guide }),
    },
    twitter: { card: "summary_large_image" },
  };
}

export function ChapterPage({ guide, slug }: { guide: GuideBookId; slug: string }) {
  const chapter = getChapter(guide, slug);
  if (!chapter) notFound();
  const book = GUIDE_BOOKS[guide];
  const all = chapterEntries(guide);
  const prev = all[chapter.number - 2];
  const next = all[chapter.number];
  const url = `${book.href}/${chapter.slug}`;

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: book.name, url: book.href }, { name: `Chapter ${chapter.number}`, url }]} />
      <GuideArticleJsonLd
        title={chapter.title}
        description={chapter.standfirst}
        url={url}
        datePublished={PUBLISHED}
        author={{ name: FOUNDER.name, role: "Founder and editor" }}
      />
      <ReadingProgress />

      <article>
        <header className="border-b border-line bg-background">
          <div className={`${SHELL} pb-10 pt-4 sm:pb-14`}>
            <Breadcrumbs items={[{ label: book.name, href: book.href }, { label: `Chapter ${chapter.number}` }]} />
            <div className="mt-7 max-w-3xl lg:mt-10">
              <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-primary">
                {`Chapter ${chapter.number} of 10 · ${chapter.step}`}
              </p>
              <h1 className="mt-4 text-[38px] leading-[1.06] tracking-[-0.04em] text-ink sm:text-[46px] lg:text-[54px]">{chapter.title}</h1>
              <p className="mt-5 text-[18px] leading-[1.65] text-ink-muted sm:text-[20px]" data-speakable-summary>
                {chapter.standfirst}
              </p>
              <div className="mt-7 flex items-center gap-3 border-t border-line pt-5 text-[14px] text-ink-muted">
                <Image src={FOUNDER.photo} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover object-top" />
                <span>
                  <Link href={`/about#${FOUNDER.id}`} className="font-medium text-ink underline decoration-line-strong underline-offset-4">
                    {FOUNDER.name}
                  </Link>
                  {", founder and editor · From "}
                  <Link href={book.href} className="text-ink underline decoration-line-strong underline-offset-4">
                    {book.name}
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className={`${SHELL} grid gap-12 py-12 sm:py-16 lg:grid-cols-12 lg:gap-16`}>
          <div className="min-w-0 lg:col-span-8">
            {chapter.number === 1 && <GuideIntroNote guide={guide} className="mb-12" />}
            <ChapterContent chapter={chapter} />

            <nav aria-label="Chapters" className="mt-12 grid border-y border-line sm:grid-cols-2">
              {prev ? (
                <Link href={chapterHref(guide, prev.number)} className="group py-5 sm:pr-6">
                  <span className="flex items-center gap-1.5 text-[13px] text-ink-muted">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Chapter {prev.number}
                  </span>
                  <span className="mt-1 block font-display text-[22px] leading-snug tracking-[-0.025em] text-ink group-hover:text-primary">{prev.title}</span>
                </Link>
              ) : (
                <Link href={book.href} className="group py-5 sm:pr-6">
                  <span className="flex items-center gap-1.5 text-[13px] text-ink-muted">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" /> The guide
                  </span>
                  <span className="mt-1 block font-display text-[22px] leading-snug tracking-[-0.025em] text-ink group-hover:text-primary">{book.name}</span>
                </Link>
              )}
              {next && (
                <Link href={chapterHref(guide, next.number)} className="group border-t border-line py-5 text-right sm:col-start-2 sm:border-l sm:border-t-0 sm:pl-6">
                  <span className="flex items-center justify-end gap-1.5 text-[13px] text-ink-muted">
                    Chapter {next.number} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="mt-1 block font-display text-[22px] leading-snug tracking-[-0.025em] text-ink group-hover:text-primary">{next.title}</span>
                </Link>
              )}
            </nav>
          </div>

          <aside className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-28">
              <nav aria-label={`${book.name}: contents`} className="border-t border-ink pt-5">
                <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-primary">{`${book.name}: contents`}</p>
                <ol className="mt-3">
                  {all.map((c) => {
                    const here = c.number === chapter.number;
                    return (
                      <li key={c.slug}>
                        <Link
                          href={chapterHref(guide, c.number)}
                          aria-current={here ? "page" : undefined}
                          className={`flex gap-3 border-b border-line py-2 text-[14px] leading-snug ${here ? "font-medium text-ink" : "text-ink-muted hover:text-ink"}`}
                        >
                          <span className={`w-5 shrink-0 font-display text-[16px] leading-tight ${here ? "text-primary" : "text-ink-subtle"}`}>{c.number}</span>
                          {c.title}
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </nav>
              <div className={`grid grid-cols-[88px_1fr] items-center gap-5 p-5 ${guide === "buying" ? "bg-stage-buy" : "bg-stage-sell"}`}>
                <BookCover guide={guide} className="w-[88px]" sizes="90px" />
                <div>
                  <p className="font-display text-[21px] leading-snug tracking-[-0.025em] text-ink">Get the whole guide as a PDF</p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-ink-muted">All ten chapters, with pointers for where you’re up to. Free.</p>
                  <Link
                    href={`${book.href}?from=${guide}-guide-ch${chapter.number}#get-the-guide`}
                    className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-[4px] bg-cta px-4 text-[14px] font-medium text-cta-ink hover:bg-cta-hover"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" /> Get the free PDF
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}
