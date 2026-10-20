"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ArrowRight } from "lucide-react";
import { DEFAULT_MOVE, journeyForMove, useMove, type Move } from "@/components/interactive/move-context";
import { MOVES, STAGES, STAGE_ANSWERS, STARTS, type Stage } from "@/lib/home-start";
import { PLAN_CTA_SHOW, PLAN_NAME } from "@/lib/plans/name";
import { planStartHref } from "@/lib/plans/start";
import { track } from "@/lib/analytics";
import { SHELL } from "./shell";

// "Start where you are." (20 Oct 2026, the approved design): buying, selling
// or both, and where you're up to, then three starting points on the page,
// each linked to the guide or tool that covers it. Nothing is sent anywhere;
// the full next-step plan is one link away with these answers filled in.
// The move is shared (MoveProvider publish), so the header, the phone bar
// and the rest of the homepage follow it.

export function StartPlanner() {
  const ctx = useMove();
  const move: Move = ctx?.move ?? DEFAULT_MOVE;
  const [stage, setStage] = useState<Stage>("exploring");
  const [built, setBuilt] = useState(false);
  const id = useId();

  const pickMove = (m: Move) => {
    ctx?.setMove(m);
    setBuilt(false);
  };
  const steps = STARTS[move][stage];
  const fullPlan = planStartHref({ journey: journeyForMove(move), answers: STAGE_ANSWERS[move][stage], from: "home-start" });
  const heading = move === "both" ? "Starting points for selling and buying" : `Starting points for ${move}`;

  return (
    <section id="start" aria-labelledby={`${id}-title`} className={`${SHELL} scroll-mt-24 pb-9 sm:pb-11`}>
      <form
        className="border-t border-ink border-b border-b-line pt-6 pb-5"
        onSubmit={(e) => {
          e.preventDefault();
          setBuilt(true);
          track("plan_started", { journey: journeyForMove(move), stage, placement: "home-start" });
        }}
      >
        <div className="grid gap-[18px] md:grid-cols-3 md:gap-[17px] lg:grid-cols-[1.02fr_1fr_1.08fr_auto] lg:items-center lg:gap-[23px]">
          <div className="md:col-span-3 md:flex md:items-baseline md:gap-[18px] lg:col-span-1 lg:block">
            <h2 id={`${id}-title`} className="text-[30px] leading-[1.15] tracking-[-0.035em] text-ink sm:text-[28px]">
              Start where you are.
            </h2>
            <p className="mt-1.5 text-[13px] text-ink-muted md:mt-0 lg:mt-1.5">A little clarity for your next move.</p>
          </div>
          <div>
            <div className="mb-2 text-[13px] font-medium text-ink-muted sm:text-[12px]" id={`${id}-move`}>
              What are you planning?
            </div>
            <div role="group" aria-labelledby={`${id}-move`} className="flex gap-0.5 overflow-hidden rounded-[4px] border border-line bg-paper p-[3px]">
              {MOVES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={move === m.id}
                  onClick={() => pickMove(m.id)}
                  className={`min-h-10 flex-1 rounded-[2px] px-2 text-[15px] transition-colors motion-reduce:transition-none sm:min-h-[37px] sm:text-[13px] ${
                    move === m.id ? "bg-cta text-cta-ink" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor={`${id}-stage`} className="mb-2 block text-[13px] font-medium text-ink-muted sm:text-[12px]">
              Where are you up to?
            </label>
            <select
              id={`${id}-stage`}
              value={stage}
              onChange={(e) => {
                setStage(e.target.value as Stage);
                setBuilt(false);
              }}
              className="block min-h-12 w-full rounded-[4px] border border-line bg-paper px-2.5 py-2.5 text-[16px] text-ink sm:min-h-[45px] sm:text-[14px]"
            >
              {STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className="md:self-end">
            <button
              type="submit"
              className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-[4px] bg-cta px-4 py-2.5 text-[15px] font-medium text-cta-ink transition-colors hover:bg-cta-hover sm:min-h-[45px] sm:text-[14px] lg:w-auto"
            >
              {PLAN_CTA_SHOW} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="mt-3.5 flex flex-col gap-1 text-[12px] text-ink-muted sm:flex-row sm:justify-between">
          <p>No sign-up. Nothing is sent to an agent.</p>
          <p>Free to explore, at your own pace.</p>
        </div>
        <div aria-live="polite">
          {built && (
            <div className="mt-5 border-t border-line pt-5">
              <h3 className="text-[16px] font-medium text-ink">{heading}</h3>
              <ol className="my-4 grid gap-3 sm:grid-cols-3 sm:gap-6">
                {steps.map((s, i) => (
                  <li key={s.href + s.label} className="flex items-baseline gap-3 text-[15px] leading-[1.6] sm:text-[14px]">
                    <span className="font-display text-[24px] leading-none text-primary" aria-hidden="true">
                      {i + 1}
                    </span>
                    <Link href={s.href} className="text-ink underline decoration-line-strong underline-offset-4 hover:text-primary hover:decoration-primary">
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ol>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[12px] text-ink-muted">A starting point for reading and research, not personal advice.</p>
                <Link
                  href={fullPlan}
                  className="inline-flex w-fit items-center gap-3 border-b border-line-strong py-1.5 text-[14px] font-medium text-ink hover:border-primary hover:text-primary"
                >
                  {`Build your full ${PLAN_NAME}`} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
