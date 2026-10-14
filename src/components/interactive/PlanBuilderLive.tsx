"use client";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buildPlan, planHref } from "@/lib/plans/engine";
import { BUY_STAGES, MOVE_ORDERS, SELL_STAGES, STATE_OPTIONS, TIMEFRAMES, type BuyStage, type MoveOrder, type PlanAnswers, type SellStage } from "@/lib/plans/questions";
import type { AustralianState } from "@/lib/utils/stamp-duty";
import type { Timeframe } from "@/lib/introductions/rules";
import { track } from "@/lib/analytics";
import { Chips, Segmented } from "./Segmented";
import { useMove, type Move } from "./move-context";

// The plan, live (v5, 14 Oct 2026): three taps and the next three steps
// rewrite themselves on the card beside them. The same engine as /plan, so
// "Open my full plan" lands on exactly this plan with the tools, guides and
// checklist added. No personal details; the answers ride in the URL.

const MOVES = [
  { id: "selling", label: "Selling" },
  { id: "buying", label: "Buying" },
  { id: "both", label: "Both" },
] as const;

const short = <T extends string>(opts: { id: T; label: string }[], drop: T[] = []) =>
  opts.filter((o) => !drop.includes(o.id)).map((o) => ({ id: o.id, label: o.label }));

const SELL = short(SELL_STAGES);
const BUY = short(BUY_STAGES);
const ORDER = short(MOVE_ORDERS);
const WHEN = short(TIMEFRAMES);

export function PlanBuilderLive({ initialMove = "selling" }: { initialMove?: Move }) {
  const ctx = useMove();
  const [ownMove, setOwnMove] = useState<Move>(initialMove);
  const move = ctx?.move ?? ownMove;
  const setMove = ctx?.setMove ?? setOwnMove;

  const [state, setState] = useState<AustralianState>("QLD");
  const [timeframe, setTimeframe] = useState<Timeframe>("3-6-months");
  const [sellStage, setSellStage] = useState<SellStage>("preparing");
  const [buyStage, setBuyStage] = useState<BuyStage>("starting");
  const [order, setOrder] = useState<MoveOrder>("undecided");

  const answers: PlanAnswers =
    move === "selling"
      ? { journey: "selling", state, timeframe, sellStage }
      : move === "buying"
        ? { journey: "buying", state, timeframe, buyStage }
        : { journey: "buying-and-selling", state, timeframe, order };
  const plan = buildPlan(answers);

  const started = useRef(false);
  const touch = () => {
    if (started.current) return;
    started.current = true;
    track("plan_started", { journey: answers.journey, placement: "home-live" });
  };

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14" onPointerDown={touch}>
      <div className="space-y-7 lg:col-span-5">
        <Segmented label="Your move" options={MOVES} value={move} onChange={setMove} />
        <Question label="Where?">
          <Chips label="State" options={STATE_OPTIONS} value={state} onChange={setState} />
        </Question>
        <Question label="When?">
          <Chips label="Timing" options={WHEN} value={timeframe} onChange={setTimeframe} />
        </Question>
        <Question label="Where are you up to?">
          {move === "selling" && <Chips label="Stage" options={SELL} value={sellStage} onChange={setSellStage} />}
          {move === "buying" && <Chips label="Stage" options={BUY} value={buyStage} onChange={setBuyStage} />}
          {move === "both" && <Chips label="Order" options={ORDER} value={order} onChange={setOrder} />}
        </Question>
      </div>

      <div className="lg:col-span-7">
        <div className="relative">
          {/* The sheet under the plan: a printed plan, not a widget. */}
          <span aria-hidden="true" className="absolute inset-0 translate-x-2 translate-y-2 rotate-[1.2deg] rounded-2xl border border-line bg-white" />
          <article className="relative rounded-2xl border border-line bg-white p-6 shadow-[0_30px_60px_-35px_rgb(22_25_29/0.45)] sm:p-9" aria-live="polite">
            <div className="flex items-center justify-between gap-4 border-b border-line pb-5">
              <p className="text-sm font-semibold text-ink-muted">Your next-step plan</p>
              <p className="text-sm text-ink-muted">{state}</p>
            </div>
            <h3 key={plan.title} className="swap-in mt-6 text-2xl leading-tight text-ink sm:text-[28px]">{plan.title}</h3>
            <ol className="mt-7 space-y-6">
              {plan.nextSteps.slice(0, 3).map((s, i) => (
                <li key={`${i}-${s.title}`} className="swap-in grid grid-cols-[2.25rem_1fr] gap-x-4" style={{ animationDelay: `${i * 60}ms` }}>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink text-[15px] font-bold text-ink-inverse" aria-hidden="true">{i + 1}</span>
                  <div className="pt-1">
                    <p className="text-lg font-bold leading-snug text-ink">{s.title}</p>
                    <p className="mt-1 text-base leading-relaxed text-ink-muted line-clamp-2">{s.body}</p>
                    {s.link && (
                      <Link href={s.link.href} className="mt-2 inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink underline-offset-4 hover:underline">
                        {s.link.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[15px] text-ink-muted">The full plan adds your tools, guides and a checklist.</p>
              <Link
                href={planHref(answers)}
                onClick={() => track("plan_completed", { journey: answers.journey, placement: "home-live" })}
                className="press inline-flex h-12 shrink-0 items-center justify-between gap-4 rounded-lg bg-cta px-5 text-base font-semibold text-white transition-colors hover:bg-cta-hover"
              >
                Open my full plan <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

function Question({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2.5 text-[15px] font-semibold text-ink">{label}</p>
      {children}
    </div>
  );
}
