"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PROMISE, AGREEMENT_CHECK } from "@/lib/service-model";
import { PLAN_CTA, PLAN_TERMS } from "@/lib/plans/name";
import { planStartHref } from "@/lib/plans/start";
import { DEFAULT_MOVE, journeyForMove, useMove } from "@/components/interactive/move-context";
import { HOME_MOVES } from "./moves";
import { SHELL } from "./shell";

// The closing line and the next step (v6; 19 Oct 2026 the button follows the
// move picked in the hero). The plan is the one solid button; an agent and
// the agreement check are the other two ways on. On cream, so it never
// stacks on the dark footer.

export function FinalCta() {
  const ctx = useMove();
  const move = ctx?.move ?? DEFAULT_MOVE;
  const m = HOME_MOVES[move];
  const sells = move !== "buying";
  return (
    <section aria-labelledby="final-cta-title" className="border-t border-line bg-cream py-20 sm:py-28">
      <div className={`${SHELL} text-center`}>
        <h2 id="final-cta-title" className="mx-auto max-w-4xl text-[38px] leading-[1.05] tracking-[-0.02em] text-ink sm:text-6xl lg:text-[72px]">
          {PROMISE.closing}
        </h2>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href={planStartHref({ journey: journeyForMove(move), place: ctx?.place, from: "home-final" })} className="press inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-cta px-8 text-base font-semibold text-white transition-colors hover:bg-cta-hover sm:w-auto">
            {PLAN_CTA} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href={`/get-help?service=${m.agent.service}&from=home-final`} className="inline-flex h-14 w-full items-center justify-center rounded-full border border-ink px-8 text-base font-semibold text-ink transition-colors hover:bg-ink hover:text-ink-inverse sm:w-auto">
            {m.agent.label}
          </Link>
        </div>
        <p className="mt-4 text-sm text-ink-muted">{`The plan: ${PLAN_TERMS.join(" · ").toLowerCase()}.`}</p>
        {sells && (
          <p className="mt-6 text-[15px] text-ink-muted">
            {`Been handed an agency agreement? `}
            <Link href={`${AGREEMENT_CHECK.href}?from=home-final`} className="font-semibold text-ink underline underline-offset-4">
              {`Book the free ${AGREEMENT_CHECK.minutes}-minute agreement check`}
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
