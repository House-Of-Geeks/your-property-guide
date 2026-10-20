import type { ReactNode } from "react";
import { BookCover } from "@/components/brand/BookCover";
import { GUIDE_BOOKS, type GuideBookId } from "@/lib/guide-books";

// The cover and what's inside, under a guide landing page's lede (v7,
// 20 Oct 2026): the matched cover on its stage, then four lines under fine
// rules. No tick icons; the list carries itself.

export function GuidePitch({ guide, lines, children }: { guide: GuideBookId; lines: readonly string[]; children?: ReactNode }) {
  const book = GUIDE_BOOKS[guide];
  return (
    <>
      <div className="grid items-center gap-6 sm:grid-cols-[minmax(0,13rem)_1fr] sm:gap-8">
        <div className={`flex justify-center px-6 py-7 ${guide === "buying" ? "bg-stage-buy" : "bg-stage-sell"}`}>
          <BookCover guide={guide} tilt={guide === "buying" ? -4 : 4} className="w-[132px] sm:w-[148px]" label={`Cover of ${book.title}`} sizes="150px" />
        </div>
        <ul className="border-t border-line">
          {lines.map((line) => (
            <li key={line} className="border-b border-line py-3 text-[15px] leading-snug text-ink">
              {line}
            </li>
          ))}
        </ul>
      </div>
      {children}
    </>
  );
}
