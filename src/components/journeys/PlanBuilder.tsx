"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin, Pencil } from "lucide-react";
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
  answersFromParams,
  stateOfSuburb,
  stateParam,
  suburbParam,
  suburbSlugLabel,
  type Option,
  type PlanAnswers,
} from "@/lib/plans/questions";
import { planHref } from "@/lib/plans/engine";
import { PLAN_NAME } from "@/lib/plans/name";
import { SuburbAutocomplete } from "@/components/search/SuburbAutocomplete";
import { ChoiceGroup, Field, type ChoiceOption } from "./fields";

// The next-step plan, question by question (Oct 2026). Nothing personal is
// asked: the answers go into the result page's URL, the plan is built there,
// and email is offered only after the plan is on screen.
//
// 19 Oct 2026: answers are kept, shown and editable one at a time.
//   - Every answer in the URL is taken up (the homepage sends the move, the
//     state and the suburb; "Change my answers" on a plan sends them all), and
//     questions already answered are skipped.
//   - What's been chosen sits above the question as buttons, so a skipped
//     question still shows in the progress and can be reopened.
//   - Continue goes to the next question still unanswered. Changing a
//     finished plan ends on a review of every answer, not a fresh start.
//   - The state question takes an optional suburb, which the plan links to.

type QuestionId = "journey" | "state" | "stage" | "situation" | "timeframe" | "help";

const JOURNEY_OPTIONS: ChoiceOption<Journey>[] = JOURNEYS.map((j) => ({
  id: j.id,
  label: j.label,
  sub: j.id === "buying" ? "A first home, a next home or an investment" : j.id === "selling" ? "From thinking about it to settlement" : "Selling one place and buying the next",
}));

const SHORT_JOURNEY: Record<Journey, string> = { selling: "Selling", buying: "Buying", "buying-and-selling": "Selling and buying" };

function questionsFor(journey: Journey | null): QuestionId[] {
  if (journey === "selling") return ["journey", "state", "stage", "timeframe"];
  if (journey === "buying") return ["journey", "state", "situation", "stage", "timeframe", "help"];
  if (journey === "buying-and-selling") return ["journey", "state", "situation", "timeframe"];
  return ["journey", "state", "stage", "timeframe"];
}

const labelOf = <T extends string>(opts: readonly Option<T>[], id: T | null | undefined) => opts.find((o) => o.id === id)?.label ?? null;

/** The question's name in the review list. */
function questionName(q: QuestionId, journey: Journey): string {
  switch (q) {
    case "journey":
      return "Your move";
    case "state":
      return "State and suburb";
    case "stage":
      return "Where you’re up to";
    case "situation":
      return journey === "buying" ? "What you’re buying" : "Which comes first";
    case "timeframe":
      return "Timing";
    case "help":
      return "Help you want";
  }
}

/** The answer to a question, in words, or null when it's unanswered. */
function answerText(q: QuestionId, a: PlanAnswers, journeyChosen: boolean): string | null {
  switch (q) {
    case "journey":
      return journeyChosen ? SHORT_JOURNEY[a.journey] : null;
    case "state":
      if (!a.state) return null;
      return a.suburb ? suburbSlugLabel(a.suburb) : a.state;
    case "stage":
      return a.journey === "selling" ? labelOf(SELL_STAGES, a.sellStage) : labelOf(BUY_STAGES, a.buyStage);
    case "situation":
      return a.journey === "buying" ? labelOf(BUYER_TYPES, a.buyerType) : labelOf(MOVE_ORDERS, a.order);
    case "timeframe":
      return labelOf(TIMEFRAMES, a.timeframe);
    case "help":
      return labelOf(HELP_PREFERENCES, a.help);
  }
}

export function PlanBuilder({ placement = "plan-page" }: { placement?: string }) {
  const router = useRouter();
  const params = useSearchParams();

  // Every answer the URL carries. The homepage sends j, s and sub; a plan's
  // "Change my answers" sends the lot with edit=1.
  const [initial] = useState(() => {
    const preset = params.get("j");
    const journeyChosen = isJourney(preset);
    const fromUrl = journeyChosen ? answersFromParams((k) => params.get(k)) : null;
    const suburb = suburbParam(params.get("sub"));
    const answers: PlanAnswers = fromUrl ?? {
      journey: "selling",
      state: stateParam(params.get("s")) ?? stateOfSuburb(suburb),
      timeframe: null,
      suburb,
    };
    if (!answers.state && answers.suburb) answers.state = stateOfSuburb(answers.suburb);
    // A suburb in another state from the one chosen isn't theirs: keep the state.
    if (answers.suburb && stateOfSuburb(answers.suburb) !== answers.state) answers.suburb = null;
    const order = questionsFor(journeyChosen ? answers.journey : null);
    const first = order.findIndex((q) => !answerText(q, answers, journeyChosen));
    const editing = params.get("edit") === "1" && first === -1;
    // ?q=state opens that question first; Continue then comes back to the review.
    const open = editing ? order.indexOf(params.get("q") as QuestionId) : -1;
    return { answers, journeyChosen, editing, step: open !== -1 ? open : first === -1 ? order.length : first };
  });

  const [answers, setAnswers] = useState<PlanAnswers>(initial.answers);
  const [journeyChosen, setJourneyChosen] = useState<boolean>(initial.journeyChosen);
  // The question on screen; questions.length means the review of every answer.
  const [step, setStep] = useState(initial.step);
  // Once someone has seen every answer together (a plan being changed), the
  // flow comes back to that review instead of building the plan straight away.
  const [reviewing] = useState(initial.editing);
  const [error, setError] = useState<string | null>(null);
  const [going, setGoing] = useState(false);
  const [suburbKey, setSuburbKey] = useState(0);
  const started = useRef(false);
  // Focus follows the question only after the person moves (never on page load).
  const moved = useRef(false);
  const headingRef = useRef<HTMLDivElement>(null);

  const journey = journeyChosen ? answers.journey : null;
  const questions = questionsFor(journey);
  const inReview = step >= questions.length;
  const q = questions[Math.min(step, questions.length - 1)];
  const isAnswered = (id: QuestionId) => !!answerText(id, answers, journeyChosen);
  const unansweredAfter = questions.findIndex((id, i) => i > step && !isAnswered(id));
  const unansweredAny = questions.findIndex((id) => !isAnswered(id));
  const willFinish = !inReview && unansweredAfter === -1 && (unansweredAny === -1 || unansweredAny === step) && !reviewing;
  const answeredCount = questions.filter(isAnswered).length;

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

  const goTo = (i: number) => {
    setError(null);
    moved.current = true;
    setStep(i);
  };

  const finish = () => {
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

  const next = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (going) return;
    if (inReview) return finish();
    if (!isAnswered(q)) {
      setError("Choose one option to continue.");
      return;
    }
    if (q === "journey") track("journey_selected", { journey: answers.journey, placement });
    if (unansweredAfter !== -1) return goTo(unansweredAfter);
    if (unansweredAny !== -1 && unansweredAny !== step) return goTo(unansweredAny);
    if (reviewing) return goTo(questions.length);
    finish();
  };

  const back = () => goTo(Math.max(0, Math.min(step, questions.length) - 1));

  const stageOptions = answers.journey === "selling" ? SELL_STAGES : BUY_STAGES;
  const backToReview = reviewing && !inReview && unansweredAfter === -1 && (unansweredAny === -1 || unansweredAny === step);
  const submitLabel = going ? "Building your plan…" : inReview ? (reviewing ? "See my updated plan" : "See my plan") : willFinish ? "See my plan" : backToReview ? "Back to my answers" : "Continue";
  const chosen = questions.map((id, i) => ({ id, i, text: answerText(id, answers, journeyChosen) })).filter((c) => c.text && c.i !== step);

  return (
    <form onSubmit={next} className="tone-light rounded-xl border border-line bg-white p-5 sm:p-8 text-ink" noValidate aria-label={`Your ${PLAN_NAME}`}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-ink-muted" aria-live="polite">
          {inReview ? "Check your answers" : `Question ${step + 1} of ${questions.length}`}
          <span className="sr-only">{`, ${answeredCount} answered`}</span>
        </p>
        <ol className="flex gap-1" aria-hidden="true">
          {questions.map((id, i) => (
            <li
              key={id}
              className={`h-1.5 w-6 rounded-full transition-colors ${i === step ? "bg-cta" : isAnswered(id) ? "bg-ink" : "bg-line"}`}
            />
          ))}
        </ol>
      </div>

      {/* What's been chosen so far, including anything filled in before
          this page (the homepage's move and suburb). Each one reopens its
          question. */}
      {!inReview && chosen.length > 0 && (
        <div className="mb-5">
          <p className="text-[13px] font-semibold text-ink-muted">Your answers so far</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {chosen.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => goTo(c.i)}
                  aria-label={`${questionName(c.id, answers.journey)}: ${c.text}. Change`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-surface-warm px-3 py-1.5 text-[13px] font-semibold text-ink hover:border-ink"
                >
                  {c.id === "state" && answers.suburb && <MapPin className="h-3.5 w-3.5" aria-hidden="true" />}
                  {c.text}
                  <Pencil className="h-3 w-3 text-ink-muted" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div ref={headingRef} key={inReview ? "review" : q} tabIndex={-1} className="outline-none">
        {inReview && (
          <div>
            <h2 className="text-xl font-bold leading-snug tracking-[-0.015em] text-ink sm:text-2xl">Your answers</h2>
            <p className="mt-1 text-sm text-ink-muted">Change any of them, then see your updated plan.</p>
            <dl className="mt-4 divide-y divide-line border-y border-line">
              {questions.map((id, i) => (
                <div key={id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <dt className="text-[13px] text-ink-muted">{questionName(id, answers.journey)}</dt>
                    <dd className="text-[15px] font-semibold text-ink">{answerText(id, answers, journeyChosen)}</dd>
                  </div>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    className="shrink-0 rounded-md px-2 py-1.5 text-sm font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
                    aria-label={`Change ${questionName(id, answers.journey).toLowerCase()}`}
                  >
                    Change
                  </button>
                </div>
              ))}
            </dl>
          </div>
        )}
        {!inReview && q === "journey" && (
          <ChoiceGroup
            size="lg"
            legend="What are you planning?"
            options={JOURNEY_OPTIONS}
            value={journey}
            onChange={(v) => {
              setJourneyChosen(true);
              // A different move asks different questions, so its answers start again.
              if (v === answers.journey && journeyChosen) return;
              set({ journey: v, sellStage: null, buyStage: null, buyerType: null, order: null, help: null });
            }}
            error={error}
          />
        )}
        {!inReview && q === "state" && (
          <div className="space-y-6">
            <ChoiceGroup
              size="lg"
              legend="Which state or territory?"
              hint="Costs, grants and contract rules differ by state."
              options={STATE_OPTIONS}
              columns={4}
              value={answers.state}
              onChange={(v) => {
                // A suburb in another state no longer fits.
                if (answers.suburb && stateOfSuburb(answers.suburb) !== v) setSuburbKey((k) => k + 1);
                set({ state: v, suburb: answers.suburb && stateOfSuburb(answers.suburb) === v ? answers.suburb : null });
              }}
              error={error}
            />
            <Field id="plan-suburb" label="Your suburb" optional hint="Your plan links to its profile: recent prices and local data.">
              <SuburbAutocomplete
                key={suburbKey}
                id="plan-suburb"
                defaultSlug={answers.suburb ?? ""}
                placeholder="Suburb or postcode"
                onSelectLocation={(slug) => set({ suburb: slug, state: stateOfSuburb(slug) ?? answers.state })}
                onClear={() => set({ suburb: null })}
                aria-describedby="plan-suburb-hint"
              />
            </Field>
          </div>
        )}
        {!inReview && q === "stage" && (
          <ChoiceGroup
            size="lg"
            legend="Where are you up to?"
            options={stageOptions}
            value={answers.journey === "selling" ? answers.sellStage : answers.buyStage}
            onChange={(v) => (answers.journey === "selling" ? set({ sellStage: v as PlanAnswers["sellStage"] }) : set({ buyStage: v as PlanAnswers["buyStage"] }))}
            error={error}
          />
        )}
        {!inReview && q === "situation" && answers.journey === "buying" && (
          <ChoiceGroup size="lg" legend="What are you buying?" options={BUYER_TYPES} columns={2} value={answers.buyerType} onChange={(v) => set({ buyerType: v })} error={error} />
        )}
        {!inReview && q === "situation" && answers.journey === "buying-and-selling" && (
          <ChoiceGroup size="lg" legend="Which comes first?" options={MOVE_ORDERS} value={answers.order} onChange={(v) => set({ order: v })} error={error} />
        )}
        {!inReview && q === "timeframe" && (
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
        {!inReview && q === "help" && (
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
          className="inline-flex items-center gap-2 rounded-full bg-cta hover:bg-cta-hover text-white px-6 py-3 text-base font-semibold transition-colors disabled:opacity-70"
        >
          {submitLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <p className="mt-5 border-t border-line pt-4 text-sm text-ink-muted">
        No sign-up. Your answers stay in your browser and the plan’s web address; we don’t ask for your name or contact details.
      </p>
    </form>
  );
}
