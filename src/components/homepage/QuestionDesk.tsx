"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { DEFAULT_MOVE, useMove } from "@/components/interactive/move-context";
import { DESK, QUESTIONS, type QuestionId } from "@/lib/home-start";
import { H2, KICKER, SECTION_HEAD, SHELL } from "./shell";

// "Good questions. Clearer decisions." (20 Oct 2026, the approved design).
// Four questions on the left; the answer for the move picked above on the
// right, with what the tools and guides cover. The answers' links are in
// the HTML even while their detail is closed.

export function QuestionDesk() {
  const ctx = useMove();
  const move = ctx?.move ?? DEFAULT_MOVE;
  const [question, setQuestion] = useState<QuestionId>("cost");
  const [open, setOpen] = useState(false);
  const a = DESK[move][question];

  return (
    <section id="decisions" aria-labelledby="decisions-title" className={`${SHELL} pt-5 pb-11 sm:pt-5 sm:pb-16`}>
      <div className={`${SECTION_HEAD} mb-6 sm:mb-9`}>
        <p className={`${KICKER} lg:pt-[9px]`}>Make sense of it</p>
        <h2 id="decisions-title" className={`${H2} max-w-[390px]`}>
          Good questions.
          <br />
          Clearer decisions.
        </h2>
        <p className="text-[15px] leading-[1.7] text-ink-muted lg:pt-2">
          You don’t need to have the whole move figured out. Start with something you’d like to understand.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 md:gap-7 lg:gap-11">
        <div role="group" aria-label="Questions to explore" className="border-t border-line [counter-reset:question]">
          {QUESTIONS.map((q, i) => {
            const on = q.id === question;
            return (
              <button
                key={q.id}
                type="button"
                aria-pressed={on}
                aria-controls="desk-answer"
                onClick={() => {
                  setQuestion(q.id);
                  setOpen(false);
                }}
                className={`flex min-h-[65px] w-full items-center justify-between gap-3 border-b border-line px-1 py-[19px] text-left text-[16px] transition-colors motion-reduce:transition-none sm:min-h-[76px] sm:py-[22px] sm:text-[17px] ${
                  on ? "text-ink shadow-[inset_0_-2px_var(--cta)]" : "text-ink-muted hover:text-ink"
                }`}
              >
                <span className="mr-2 w-5 shrink-0 text-[12px] text-ink-subtle" aria-hidden="true">{`0${i + 1}`}</span>
                <span className="flex-1">{q.label}</span>
                <ArrowUpRight className="h-[17px] w-[17px] shrink-0" aria-hidden="true" />
              </button>
            );
          })}
        </div>
        <div id="desk-answer" aria-live="polite" className="bg-surface-warm px-6 py-6 sm:px-8 sm:pt-7 sm:pb-6 md:min-h-[320px]">
          <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.1em] text-primary">{a.kicker}</p>
          <h3 className="font-display text-[29px] font-normal leading-[1.15] tracking-[-0.03em] text-ink sm:text-[30px]">{a.heading}</h3>
          <p className="mt-3 text-[15px] leading-[1.65] text-ink-muted">{a.body}</p>
          <ul className="my-4 list-disc space-y-1.5 pl-[18px] text-[14px] text-ink-muted marker:text-accent">
            {a.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="desk-detail"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex min-h-9 items-center gap-3 border-b border-line-strong py-1.5 text-left text-[14px] font-medium text-ink hover:border-primary hover:text-primary"
          >
            {open ? "Hide the detail" : "See what the tools cover"} <ArrowRight className={`h-4 w-4 transition-transform motion-reduce:transition-none ${open ? "rotate-90" : ""}`} aria-hidden="true" />
          </button>
          <div id="desk-detail" hidden={!open} className="mt-4 border-t border-line pt-4">
            <h4 className="text-[14px] font-medium text-ink">{a.detailTitle}</h4>
            <p className="mt-1.5 text-[14px] leading-[1.65] text-ink-muted">{a.detail}</p>
            <ul className="mt-3 grid gap-1.5">
              {a.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex items-center gap-2 text-[14px] font-medium text-ink underline decoration-line-strong underline-offset-4 hover:text-primary hover:decoration-primary">
                    {l.label} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
