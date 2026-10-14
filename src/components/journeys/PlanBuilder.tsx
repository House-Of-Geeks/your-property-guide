"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { track } from "@/lib/analytics";
import { JOURNEYS, isJourney, type Journey } from "@/lib/lead-kinds";
import {
  BUYER_TYPES,
  BUY_STAGES,
  HELP_PREFERENCES,
  MOVE_ORDERS,
  SELL_STAGES,
  STATE_OPTIONS,
  TIMEFRAMES,
  type PlanAnswers,
} from "@/lib/plans/questions";
import { planHref } from "@/lib/plans/engine";
import { ChoiceGroup, type ChoiceOption } from "./fields";

// The next-step plan, question by question (Oct 2026). Nothing personal is
// asked: the answers go into the result page's URL, the plan is built there,
// and email is offered only after the plan is on screen.

type QuestionId = "journey" | "state" | "stage" | "situation" | "timeframe" | "help";

const JOURNEY_OPTIONS: ChoiceOption<Journey>[] = JOURNEYS.map((j) => ({
  id: j.id,
  label: j.label,
  sub: j.id === "buying" ? "A first home, a next home or an investment" : j.id === "selling" ? "From thinking about it to settlement" : "Selling one place and buying the next",
}));

function questionsFor(journey: Journey | null): QuestionId[] {
  if (journey === "selling") return ["journey", "state", "stage", "timeframe"];
  if (journey === "buying") return ["journey", "state", "situation", "stage", "timeframe", "help"];
  if (journey === "buying-and-selling") return ["journey", "state", "situation", "timeframe"];
  return ["journey", "state", "stage", "timeframe"];
}

export function PlanBuilder({ placement = "plan-page" }: { placement?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const preset = params.get("j");
  const initialJourney: Journey | null = isJourney(preset) ? preset : null;

  const [answers, setAnswers] = useState<PlanAnswers>({
    journey: initialJourney ?? "selling",
    state: null,
    timeframe: null,
  });
  const [journeyChosen, setJourneyChosen] = useState<boolean>(initialJourney !== null);
  const [step, setStep] = useState(initialJourney ? 1 : 0);
  const [error, setError] = useState<string | null>(null);
  const [going, setGoing] = useState(false);
  const started = useRef(false);
  // Focus follows the question only after the person moves (never on page load).
  const moved = useRef(false);
  const headingRef = useRef<HTMLDivElement>(null);

  const journey = journeyChosen ? answers.journey : null;
  const questions = questionsFor(journey);
  const q = questions[Math.min(step, questions.length - 1)];
  const isLast = step >= questions.length - 1;

  // Move focus to the new question so keyboard and screen reader users land on it.
  useEffect(() => {
    if (moved.current) headingRef.current?.focus();
  }, [step]);

  const set = (patch: Partial<PlanAnswers>) => {
    if (!started.current) {
      started.current = true;
      track("plan_started", { placement, journey: patch.journey ?? answers.journey });
    }
    setError(null);
    setAnswers((a) => ({ ...a, ...patch }));
  };

  const answered = (): boolean => {
    switch (q) {
      case "journey":
        return journeyChosen;
      case "state":
        return !!answers.state;
      case "stage":
        return answers.journey === "selling" ? !!answers.sellStage : !!answers.buyStage;
      case "situation":
        return answers.journey === "buying" ? !!answers.buyerType : !!answers.order;
      case "timeframe":
        return !!answers.timeframe;
      case "help":
        return !!answers.help;
    }
  };

  const next = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!answered()) {
      setError("Choose one option to continue.");
      return;
    }
    if (q === "journey") track("journey_selected", { journey: answers.journey, placement });
    if (!isLast) {
      moved.current = true;
      setStep((s) => s + 1);
      return;
    }
    setGoing(true);
    track("plan_completed", {
      journey: answers.journey,
      state: answers.state,
      stage: answers.sellStage ?? answers.buyStage ?? answers.order,
      timeframe: answers.timeframe,
      placement,
    });
    router.push(planHref(answers));
  };

  const back = () => {
    setError(null);
    moved.current = true;
    setStep((s) => Math.max(0, s - 1));
  };

  const stageOptions = answers.journey === "selling" ? SELL_STAGES : BUY_STAGES;

  return (
    <form onSubmit={next} className="tone-light rounded-xl border border-line bg-white p-5 sm:p-8 text-ink" noValidate>
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-ink-muted" aria-live="polite">
          Question {step + 1} of {questions.length}
        </p>
        <div className="h-1 w-28 overflow-hidden rounded-full bg-line" aria-hidden="true">
          <span className="block h-full bg-ink transition-[width] duration-300" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      <div ref={headingRef} key={q} tabIndex={-1} className="outline-none">
        {q === "journey" && (
          <ChoiceGroup
            size="lg"
            legend="What are you planning?"
            options={JOURNEY_OPTIONS}
            value={journey}
            onChange={(v) => {
              setJourneyChosen(true);
              set({ journey: v, sellStage: null, buyStage: null, buyerType: null, order: null, help: null });
            }}
            error={error}
          />
        )}
        {q === "state" && (
          <ChoiceGroup
            size="lg"
            legend="Which state or territory?"
            hint="Costs, grants and contract rules differ by state."
            options={STATE_OPTIONS}
            columns={4}
            value={answers.state}
            onChange={(v) => set({ state: v })}
            error={error}
          />
        )}
        {q === "stage" && (
          <ChoiceGroup
            size="lg"
            legend="Where are you up to?"
            options={stageOptions}
            value={answers.journey === "selling" ? answers.sellStage : answers.buyStage}
            onChange={(v) => (answers.journey === "selling" ? set({ sellStage: v as PlanAnswers["sellStage"] }) : set({ buyStage: v as PlanAnswers["buyStage"] }))}
            error={error}
          />
        )}
        {q === "situation" && answers.journey === "buying" && (
          <ChoiceGroup size="lg" legend="What are you buying?" options={BUYER_TYPES} columns={2} value={answers.buyerType} onChange={(v) => set({ buyerType: v })} error={error} />
        )}
        {q === "situation" && answers.journey === "buying-and-selling" && (
          <ChoiceGroup size="lg" legend="Which comes first?" options={MOVE_ORDERS} value={answers.order} onChange={(v) => set({ order: v })} error={error} />
        )}
        {q === "timeframe" && (
          <ChoiceGroup
            size="lg"
            legend={answers.journey === "buying" ? "When are you hoping to buy?" : answers.journey === "selling" ? "When are you hoping to sell?" : "When are you hoping to move?"}
            options={TIMEFRAMES}
            columns={2}
            value={answers.timeframe}
            onChange={(v) => set({ timeframe: v })}
            error={error}
          />
        )}
        {q === "help" && (
          <ChoiceGroup
            size="lg"
            legend="How much help do you want?"
            hint="This only changes what the plan suggests. Nobody contacts you."
            options={HELP_PREFERENCES}
            value={answers.help}
            onChange={(v) => set({ help: v })}
            error={error}
          />
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        {step > 0 ? (
          <button type="button" onClick={back} className="inline-flex items-center gap-1.5 rounded-md px-2 py-2 text-[15px] font-medium text-ink-muted hover:text-ink">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
          </button>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={going}
          className="inline-flex items-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-white px-6 py-3 text-base font-semibold transition-colors disabled:opacity-70"
        >
          {isLast ? (going ? "Building your plan…" : "See my plan") : "Continue"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <p className="mt-5 border-t border-line pt-4 text-sm text-ink-muted">
        No sign-up. Your answers stay in your browser and the plan’s web address; we don’t ask for your name or contact details.
      </p>
    </form>
  );
}
