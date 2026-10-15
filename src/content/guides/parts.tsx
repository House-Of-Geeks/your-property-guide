import Link from "next/link";
import type { ReactNode } from "react";
import { chapterHref, type GuideBookId } from "@/lib/guide-books";

// The pieces a chapter's body is written with. Plain tags (h2, p, ul, ol,
// table) take the article styles from .prose-ypg; these cover the rest.
// .prose-ypg is unlayered CSS, so it beats Tailwind utilities on the tags it
// styles: these parts use div and span for their own text so their classes
// hold. Every one prints cleanly too (the PDF renders the same body).

/** A headline figure from the chapter, with what it means. */
export function Stat({ value, children }: { value: string; children: ReactNode }) {
  return (
    <div className="my-8 flex items-baseline gap-5 border-y border-line py-5 break-inside-avoid">
      <div className="shrink-0 font-display text-[40px] leading-none text-accent-dark">{value}</div>
      <div className="text-[15px] leading-snug text-ink-muted">{children}</div>
    </div>
  );
}

/** A boxed aside: "Watch for", a persona note, or a list worth printing. */
export function Box({ title, children, tone = "plain" }: { title: string; children: ReactNode; tone?: "plain" | "warm" }) {
  return (
    <aside className={`my-8 rounded-2xl border border-line p-5 sm:p-6 break-inside-avoid ${tone === "warm" ? "bg-sand" : "bg-white"}`}>
      <div className="text-[13px] font-semibold uppercase tracking-[0.16em] text-primary">{title}</div>
      <div className="mt-3 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">{children}</div>
    </aside>
  );
}

/** A line worth remembering, set large. */
export function Pull({ children }: { children: ReactNode }) {
  return (
    <figure className="my-10 border-l-2 border-primary pl-6 break-inside-avoid">
      <div className="font-display text-[24px] italic leading-snug text-ink sm:text-[26px]">{children}</div>
    </figure>
  );
}

/** A table that scrolls sideways on a phone rather than squeezing. */
export function TableWrap({ children }: { children: ReactNode }) {
  return <div className="my-8 overflow-x-auto break-inside-avoid">{children}</div>;
}

/** "Chapter 5", linked to that chapter. */
export function Ch({ n, guide, children }: { n: number; guide: GuideBookId; children?: ReactNode }) {
  return <Link href={chapterHref(guide, n)}>{children ?? `Chapter ${n}`}</Link>;
}
