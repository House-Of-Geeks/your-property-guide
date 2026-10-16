"use client";

import { useState } from "react";
import Link from "next/link";
import { GUIDE_BOOKS, chapterHref, type GuideBookId } from "@/lib/guide-books";
import { track } from "@/lib/analytics";
import { Book3D } from "./Book3D";

// A guide's contents beside the book itself (v5, 14 Oct 2026). Point at a
// chapter and the book opens to it; "Look inside" opens it on a tap. The
// list is the real, readable contents (and the page's SEO body), each row
// linking to its chapter page; the book's own page is a picture of it.

export function GuideContents({ guide }: { guide: GuideBookId }) {
  const book = GUIDE_BOOKS[guide];
  const [open, setOpen] = useState(false);
  const [on, setOn] = useState<number | null>(null);
  const toggle = () => {
    if (!open) track("tool_used", { tool: "look-inside", guide, placement: `${guide}-guide-page` });
    setOpen(!open);
  };
  return (
    <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
      <div className="flex flex-col items-center lg:sticky lg:top-28 lg:col-span-5">
        <div onClick={toggle} className="cursor-pointer pb-4 pt-2">
          <Book3D guide={guide} open={open} highlight={on} turn={20} className="[--bw:min(200px,40vw)] xl:[--bw:240px]" />
        </div>
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          className="press mt-6 inline-flex h-12 items-center rounded-lg border border-ink px-5 text-base font-semibold text-ink transition-colors hover:bg-ink hover:text-ink-inverse"
        >
          {open ? "Close the book" : "Look inside"}
        </button>
      </div>
      <ol className="border-b border-line lg:col-span-7" onMouseLeave={() => setOn(null)}>
        {book.chapters.map((c, i) => (
          <li
            key={c.title}
            id={`chapter-${i + 1}`}
            onMouseEnter={() => {
              setOn(i);
              setOpen(true);
            }}
            className={`flex scroll-mt-28 items-start gap-4 border-t border-line px-2 py-4 transition-colors duration-200 target:bg-surface-warm ${on === i ? "bg-surface-warm" : ""}`}
          >
            <span className={`w-6 shrink-0 text-base font-semibold leading-6 transition-colors ${on === i ? "text-primary" : "text-ink-subtle"}`}>{i + 1}</span>
            <Link href={chapterHref(guide, i + 1)} className="group min-w-0 flex-1">
              <span className="block text-base font-semibold leading-6 text-ink group-hover:underline underline-offset-4">{c.title}</span>
              <span className="mt-0.5 block text-sm leading-snug text-ink-muted">{c.sub}</span>
            </Link>
            <span className="hidden shrink-0 self-center text-sm font-semibold text-ink sm:block" aria-hidden="true">Read →</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
