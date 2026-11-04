"use client";

import { useRef, useState } from "react";
import { track } from "@/lib/analytics";
import type { PlanAnswers } from "@/lib/plans/questions";
import { answersToParams, stageOf } from "@/lib/plans/questions";
import { SEQUENCES, sequenceFor } from "@/lib/email-sequences";
import { planEmailConsent } from "@/lib/plans/consent";
import { useSiteFlags } from "@/components/flags/FlagsProvider";
import { BUTTON_SECONDARY } from "@/components/premium/buttons";
import { CheckField, Field, Honeypot, INPUT_CLASS, SubmitButton, describedBy, useRequestKey } from "./fields";

// "Email me this plan" (the learning path). Offered after the plan is on
// screen. Email only; no phone. The short series is its own unticked box,
// offered only while the series really sends (src/lib/flags.ts, 20 Oct 2026).

/** Where the form sits on /plan/result (the page wraps it in this id) and its email field. */
export const PLAN_EMAIL_ANCHOR = "email-plan";
const EMAIL_FIELD_ID = "plan-email";

/**
 * The plan's save actions at the top of /plan/result (20 Oct 2026): "Email
 * me this plan" takes the reader to the form where it already sits (beside
 * the steps on desktop, after them on phones) and puts the cursor in the
 * email field; "Save or print" opens the print dialog (save as PDF there).
 * Nothing opens over the steps. Without JavaScript the link is a plain jump.
 */
export function PlanSaveActions() {
  const toEmail = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(PLAN_EMAIL_ANCHOR);
    if (!target) return;
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    document.getElementById(EMAIL_FIELD_ID)?.focus({ preventScroll: true });
  };
  return (
    <div className="flex flex-wrap gap-3">
      <a href={`#${PLAN_EMAIL_ANCHOR}`} onClick={toEmail} className={BUTTON_SECONDARY}>
        Email me this plan
      </a>
      <button type="button" onClick={() => window.print()} className={BUTTON_SECONDARY}>
        Save or print
      </button>
    </div>
  );
}

export function PlanEmailForm({ answers }: { answers: PlanAnswers }) {
  const requestKey = useRequestKey();
  const { series } = useSiteFlags();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [wantsSequence, setWantsSequence] = useState(false);
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<null | { emailed: boolean; sequence: string | null }>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const inFlight = useRef(false);

  const seq = SEQUENCES[sequenceFor(answers.journey, stageOf(answers))];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inFlight.current || busy || done) return;
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError("Enter an email address like name@example.com.");
      return;
    }
    setEmailError(null);
    setFormError(null);
    inFlight.current = true;
    setBusy(true);
    try {
      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: Object.fromEntries(answersToParams(answers).entries()),
          email: value,
          firstName: firstName.trim() || undefined,
          wantsSequence: series && wantsSequence,
          requestKey,
          source: "plan-result",
          website,
        }),
      });
      const body = (await res.json().catch(() => null)) as { ok?: boolean; emailed?: boolean; sequence?: string | null; error?: string } | null;
      if (!res.ok || !body?.ok) {
        setFormError(res.status === 429 ? "Too many tries in a minute. Please wait a moment and try again." : body?.error ?? "We couldn’t send it. Please try again.");
        return;
      }
      setDone({ emailed: body.emailed !== false, sequence: body.sequence ?? null });
      track("plan_emailed", { journey: answers.journey, state: answers.state, stage: stageOf(answers), lead_type: "plan-email" });
      if (body.sequence) track("sequence_opted_in", { journey: answers.journey, sequence: body.sequence });
    } catch {
      setFormError("We couldn’t reach the server. Check your connection and try again.");
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  };

  // "emailed" means the email was accepted or queued for sending, never that
  // it arrived (/api/plans, 21 Oct 2026), so the words say it's on its way.
  if (done) {
    return (
      <div className="rounded-xl border border-line bg-white p-5 sm:p-6" role="status">
        <p className="text-lg font-bold text-ink">{done.emailed ? "It’s on its way." : "Saved, but the email didn’t go."}</p>
        <p className="mt-2 text-[15px] text-ink-muted leading-relaxed">
          {done.emailed
            ? done.sequence
              ? `Your plan usually arrives within a few minutes; if you can’t see it, check your spam or Promotions folder. The first of the short emails on ${seq.label} follows in a few days, and every email has an unsubscribe link.`
              : "Your plan usually arrives within a few minutes; if you can’t see it, check your spam or Promotions folder. That’s the only email we’ll send."
            : "Bookmark this page instead, or save it as a PDF: the plan lives at this address."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-xl border border-line bg-white p-5 sm:p-6 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-ink">Email me this plan</h2>
        <p className="mt-1 text-[15px] text-ink-muted leading-relaxed">
          {planEmailConsent(series)}
        </p>
      </div>
      <Honeypot value={website} onChange={setWebsite} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="plan-email" label="Email" error={emailError}>
          <input
            id="plan-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={emailError ? true : undefined}
            aria-describedby={describedBy("plan-email", null, emailError)}
            className={INPUT_CLASS}
            required
          />
        </Field>
        <Field id="plan-name" label="First name" optional>
          <input id="plan-name" type="text" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={INPUT_CLASS} />
        </Field>
      </div>
      {series && (
        <CheckField id="plan-sequence" checked={wantsSequence} onChange={setWantsSequence} hint={seq.promise}>
          Also send me a few short emails for my stage
        </CheckField>
      )}
      {formError && (
        <p className="text-sm font-medium text-danger" role="alert">
          {formError}
        </p>
      )}
      <SubmitButton busy={busy}>Email my plan</SubmitButton>
      <p className="text-sm text-ink-muted">
        See our <a href="/privacy" className="underline underline-offset-4">privacy policy</a>.
      </p>
    </form>
  );
}
