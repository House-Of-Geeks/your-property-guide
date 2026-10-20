"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { BookCover } from "@/components/brand/BookCover";
import { GUIDE_BOOKS, GUIDE_ORDER, chapterHref, type GuideBookId } from "@/lib/guide-books";
import { H2, KICKER, SECTION_HEAD, SHELL } from "./shell";

// The two free guides (20 Oct 2026, the approved design): the matched
// covers on their own stages, a line about each, and "Look inside" for the
// full ten chapters, each linked to its page. The chapter lists are in the
// HTML even while closed.

const COPY: Record<GuideBookId, { heading: string; body: string }> = {
  buying: {
    heading: "Your next home starts here.",
    body: "Work through the budget, property checks, offers and settlement, one decision at a time.",
  },
  selling: {
    heading: "Make room for your next chapter.",
    body: "Understand your costs, decide what to prepare and compare agents and proposals.",
  },
};

export function GuideShelf() {
  const [open, setOpen] = useState<Record<GuideBookId, boolean>>({ buying: false, selling: false });
  return (
    <section id="guides" aria-labelledby="guides-title" className="scroll-mt-20 border-y border-line bg-background">
      <div className={`${SHELL} py-11 sm:py-16`}>
        <div className={`${SECTION_HEAD} mb-6 sm:mb-9`}>
          <p className={`${KICKER} lg:pt-[9px]`}>The field guides</p>
          <h2 id="guides-title" className={`${H2} max-w-[390px]`}>
            Keep a clearer
            <br />
            head about home.
          </h2>
          <p className="text-[15px] leading-[1.7] text-ink-muted lg:pt-2">
            Considered, practical guides for the decisions ahead. Free to read online or save as a PDF.
          </p>
        </div>
        <div className="grid gap-9 md:grid-cols-2 md:gap-6 lg:gap-9">
          {GUIDE_ORDER.map((id) => {
            const book = GUIDE_BOOKS[id];
            const isOpen = open[id];
            return (
              <article key={id} aria-label={`${book.name}: the free guide`} className="min-w-0">
                <Link
                  href={book.href}
                  aria-label={`${book.name}: read the free guide`}
                  className={`flex min-h-[430px] items-center justify-center px-5 py-8 min-[560px]:min-h-[358px] md:min-h-[426px] lg:min-h-[464px] ${
                    id === "buying" ? "bg-stage-buy" : "bg-stage-sell"
                  }`}
                >
                  <BookCover
                    guide={id}
                    tilt={id === "buying" ? -4 : 4}
                    className="w-[228px] max-w-[calc(100%-16px)] min-[560px]:w-[175px] md:w-[220px] lg:w-[246px]"
                    sizes="(min-width: 1024px) 246px, 228px"
                  />
                </Link>
                <div className="pt-6">
                  <h3 className="font-display text-[28px] font-normal leading-[1.15] tracking-[-0.035em] text-ink lg:text-[29px]">{COPY[id].heading}</h3>
                  <p className="mt-3 max-w-[390px] text-[15px] leading-[1.65] text-ink-muted">{COPY[id].body}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`chapters-${id}`}
                      onClick={() => setOpen((o) => ({ ...o, [id]: !o[id] }))}
                      className="inline-flex min-h-9 items-center gap-3 border-b border-line-strong py-1.5 text-[14px] font-medium text-ink hover:border-primary hover:text-primary"
                    >
                      {isOpen ? "Close the contents" : "Look inside"}
                      <ArrowRight className={`h-4 w-4 transition-transform motion-reduce:transition-none ${isOpen ? "rotate-90" : ""}`} aria-hidden="true" />
                    </button>
                    <Link href={book.href} className="text-[14px] text-ink-muted underline decoration-line-strong underline-offset-4 hover:text-primary hover:decoration-primary">
                      {`Read ${book.name}`}
                    </Link>
                  </div>
                </div>
                <div id={`chapters-${id}`} hidden={!isOpen} className="mt-5 border-t border-line pt-4">
                  <ol className="list-decimal space-y-2 pl-5 text-[14px] text-ink-muted marker:font-display marker:text-primary">
                    {book.chapters.map((c, i) => (
                      <li key={c.slug} className="pl-1">
                        <Link href={chapterHref(id, i + 1)} className="text-ink hover:text-primary">
                          {c.title}
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
