import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GUIDE_BOOKS, chapterHref, type GuideBookId } from "@/lib/guide-books";
import { BandLead, BandTitle, Eyebrow } from "./parts";
import { SHELL } from "./shell";

// The two free guides (v6), each with its ten chapters. Chapter titles and
// covers come from src/lib/guide-books.ts.

const BLURB: Record<GuideBookId, { lead: string; cta: string }> = {
  selling: { lead: "Run a top-end campaign on your own home, from your number to settlement.", cta: "Get the free selling guide" },
  buying: { lead: "Every seller’s agent is running a campaign aimed at you. Learn how it works, then run your own.", cta: "Get the free buying guide" },
};

export function TwoGuides() {
  return (
    <section aria-labelledby="two-guides-title" className="bg-sand py-20 sm:py-28">
      <div className={SHELL}>
        <div className="max-w-3xl">
          <Eyebrow>The playbook, written down</Eyebrow>
          <BandTitle className="mt-5">
            <span id="two-guides-title">Two complete guides. Ten chapters each. Free.</span>
          </BandTitle>
          <BandLead className="mt-6">With the costs, rules and dates for your state, checked and dated.</BandLead>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-7">
          {(["selling", "buying"] as const).map((id) => {
            const book = GUIDE_BOOKS[id];
            return (
              <article key={id} className="flex flex-col rounded-3xl bg-white p-6 shadow-card sm:p-8">
                <div className="flex items-start gap-5">
                  <div className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden rounded-md shadow-[0_10px_24px_-12px_rgb(20_32_27/0.5)] sm:w-24">
                    <Image src={book.cover} alt="" fill sizes="96px" className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-display text-[26px] font-normal leading-tight tracking-[-0.01em] text-ink sm:text-[30px]">{book.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{BLURB[id].lead}</p>
                  </div>
                </div>
                <ol className="mt-7 grid flex-1 content-start gap-x-6 border-t border-line pt-5 sm:grid-cols-2">
                  {book.chapters.map((c, i) => (
                    <li key={c.slug}>
                      <Link href={chapterHref(id, i + 1)} className="flex gap-3 py-1.5 text-[15px] leading-snug text-ink hover:underline underline-offset-4">
                        <span className="w-5 shrink-0 text-ink-subtle">{i + 1}</span>
                        {c.title}
                      </Link>
                    </li>
                  ))}
                </ol>
                <Link href={`${book.href}?from=home-guides`} className="press mt-7 inline-flex h-12 w-fit items-center gap-2 rounded-full bg-cta px-6 text-base font-semibold text-white transition-colors hover:bg-cta-hover">
                  {BLURB[id].cta} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
