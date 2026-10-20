"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { DEFAULT_MOVE, useMove } from "@/components/interactive/move-context";
import { INTRO_PREVIEW } from "@/lib/home-start";
import { HOW_WE_ARE_PAID_HREF } from "@/lib/service-model";
import { SHELL } from "./shell";

// "When you want personal help" (20 Oct 2026, the approved design): the
// introduction path, offered and never pushed. "How introductions work"
// opens what an introduction means for the move picked above, with the way
// in; how we're paid is one click away. Promises stay within
// src/lib/service-model.ts.

const SERVICE = { buying: "buyers-agent", selling: "selling-agent", both: "both" } as const;

export function IntroductionsBand() {
  const ctx = useMove();
  const move = ctx?.move ?? DEFAULT_MOVE;
  const [open, setOpen] = useState(false);
  const preview = INTRO_PREVIEW[move];
  return (
    <section aria-labelledby="intro-title" className="tone-dark bg-surface-inverse">
      <div className={`${SHELL} py-11 sm:py-16`}>
        <div className="grid items-center gap-7 md:grid-cols-[1fr_0.85fr] md:gap-10 lg:gap-[70px]">
          <div>
            <p className="mb-4 text-[12px] font-medium uppercase tracking-[0.1em] text-ink/80">When you want personal help</p>
            <h2 id="intro-title" className="max-w-[400px] text-[36px] leading-[1.08] tracking-[-0.04em] text-ink sm:text-[40px] lg:text-[43px]">
              Your next step
              <br />
              is your choice.
            </h2>
            <p className="mt-5 text-[15px] leading-[1.7] text-ink">
              When you’re ready, ask about an introduction to a selling agent or buyer’s agent in our participating network.
            </p>
            <p className="mt-4 text-[13px] leading-[1.65] text-ink-muted">
              Availability depends on your area. We explain the arrangements and get your permission before making an introduction.
            </p>
          </div>
          <div>
            <button
              type="button"
              aria-expanded={open}
              aria-controls="intro-preview"
              onClick={() => setOpen((o) => !o)}
              className="inline-flex min-h-12 w-full items-center justify-between gap-3 rounded-[4px] bg-cta px-[18px] py-3 text-left text-[15px] font-medium text-cta-ink transition-colors hover:bg-cta-hover sm:w-auto sm:justify-center"
            >
              How introductions work <ArrowRight className={`h-4 w-4 transition-transform motion-reduce:transition-none ${open ? "rotate-90" : ""}`} aria-hidden="true" />
            </button>
            <p className="mt-4 text-[13px] leading-[1.65] text-ink-muted">
              The agent pays us a flat introduction fee. You pay us nothing; any agent fees are agreed with the agent directly.
            </p>
            <div id="intro-preview" hidden={!open} className="mt-5 border-t border-line pt-5" aria-live="polite">
              <h3 className="text-[16px] font-medium text-ink">{preview.heading}</h3>
              <p className="mt-2 text-[14px] leading-[1.65] text-ink-muted">{preview.body}</p>
              <Link
                href={`/get-help?service=${SERVICE[move]}&from=home-intro`}
                className="mt-4 inline-flex items-center gap-3 border-b border-line-strong py-1.5 text-[14px] font-medium text-ink hover:border-ink"
              >
                Ask about an introduction <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <details className="mt-5 border-t border-line pt-1.5">
              <summary className="min-h-[42px] cursor-pointer py-2.5 text-[14px] font-medium text-ink">How we’re paid</summary>
              <p className="mt-1.5 text-[14px] leading-[1.65] text-ink-muted">
                Our guides, tools and plans are free. Participating agents pay a flat fee for introductions you request, whether or not you engage them. We take no share of their commission. You choose whether to use the agent, and agree their own fees with them.{" "}
                <Link href={HOW_WE_ARE_PAID_HREF} className="text-ink underline underline-offset-4">
                  More about how we’re paid
                </Link>
                .
              </p>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}
