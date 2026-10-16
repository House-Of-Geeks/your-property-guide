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
      <aside className="tone-dark mb-10 rounded-3xl bg-eucalyptus p-6 break-inside-avoid sm:p-8" aria-label={CALLOUT_TITLE[guide]}>
        <div className="text-[13px] font-semibold uppercase tracking-[0.18em] text-primary">{CALLOUT_TITLE[guide]}</div>
        <div className="mt-3 font-display text-[21px] leading-snug text-ink sm:text-[23px]">{chapter.callout}</div>
      </aside>

      <div className="prose-ypg max-w-none">
        <Body />
      </div>

      <section aria-label={CHECKLIST_TITLE[guide]} className="mt-12 rounded-3xl border border-line bg-white p-6 break-inside-avoid sm:p-8">
        <h2 className="text-[26px] leading-tight text-ink sm:text-3xl">{CHECKLIST_TITLE[guide]}</h2>
        <ul className="mt-5 space-y-3">
          {chapter.checklist.map((item) => (
            <li key={item} className="flex gap-3 text-[16px] leading-snug text-ink">
              <span aria-hidden="true" className="mt-0.5 inline-block h-5 w-5 shrink-0 rounded-md border-2 border-line-strong" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Next step" className="mt-8 rounded-3xl bg-sand p-6 break-inside-avoid sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
        <div className="max-w-xl">
          <h2 className="font-sans text-xl font-bold tracking-[-0.01em] text-ink">{cta.title}</h2>
          <div className="mt-2 text-[16px] leading-relaxed text-ink-muted">{cta.body}</div>
        </div>
        {print ? (
          <div className="mt-4 text-[15px] font-semibold text-ink sm:mt-0">yourpropertyguide.com.au{cta.href.split("?")[0]}</div>
        ) : (
          <Link
            href={cta.href}
            className="press mt-5 inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-cta px-6 text-base font-semibold text-white transition-colors hover:bg-cta-hover sm:mt-0"
          >
            {cta.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </section>

      <div className="mt-8 text-sm leading-relaxed text-ink-muted">
        {chapter.checked} {CHAPTER_DISCLAIMER}
      </div>
    </>
  );
}
