import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CALLOUT_TITLE, CHAPTER_DISCLAIMER, CHECKLIST_TITLE, type ChapterEntry } from "@/content/guides";

// A chapter's content, the same on the web page and in the PDF: the callout
// that frames it, the body, the checklist and the one call to action, then
// the as-at line. `print` swaps the button for the address written out.

export function ChapterContent({ chapter, print = false }: { chapter: ChapterEntry; print?: boolean }) {
  const { guide, Body, cta } = chapter;
  return (
    <>
      <aside className="mb-10 border-l border-accent bg-surface-warm px-6 py-6 break-inside-avoid sm:px-8 sm:py-7" aria-label={CALLOUT_TITLE[guide]}>
        <div className="text-[12px] font-medium uppercase tracking-[0.1em] text-primary">{CALLOUT_TITLE[guide]}</div>
        <div className="mt-3 font-display text-[21px] leading-[1.45] tracking-[-0.015em] text-ink sm:text-[23px]">{chapter.callout}</div>
      </aside>

      <div className="prose-ypg max-w-none">
        <Body />
      </div>

      <section aria-label={CHECKLIST_TITLE[guide]} className="mt-12 border-t border-ink pt-6 break-inside-avoid">
        <h2 className="text-[28px] leading-tight tracking-[-0.035em] text-ink sm:text-[30px]">{CHECKLIST_TITLE[guide]}</h2>
        <ul className="mt-4">
          {chapter.checklist.map((item) => (
            <li key={item} className="flex gap-3 border-b border-line py-3 text-[16px] leading-snug text-ink">
              <span aria-hidden="true" className="mt-0.5 inline-block h-[18px] w-[18px] shrink-0 rounded-[2px] border border-line-strong bg-paper" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Next step" className="mt-10 bg-surface-warm p-6 break-inside-avoid sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
        <div className="max-w-xl">
          <h2 className="text-[24px] leading-snug tracking-[-0.03em] text-ink">{cta.title}</h2>
          <div className="mt-2 text-[16px] leading-relaxed text-ink-muted">{cta.body}</div>
        </div>
        {print ? (
          <div className="mt-4 text-[15px] font-semibold text-ink sm:mt-0">yourpropertyguide.com.au{cta.href.split("?")[0]}</div>
        ) : (
          <Link
            href={cta.href}
            className="mt-5 inline-flex min-h-12 shrink-0 items-center gap-3 rounded-[4px] bg-cta px-5 text-[15px] font-medium text-cta-ink transition-colors hover:bg-cta-hover sm:mt-0"
          >
            {cta.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </section>

      <div className="mt-8 text-[13px] leading-relaxed text-ink-muted">
        {chapter.checked} {CHAPTER_DISCLAIMER}
      </div>
    </>
  );
}
