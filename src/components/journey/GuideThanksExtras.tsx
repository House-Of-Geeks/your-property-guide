"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { ArrowRight, Check, Phone } from "lucide-react";
import { clarityEvent, clarityTag } from "@/lib/clarity";
import { auMobileError } from "@/lib/utils/au-mobile";
import { AuPhoneInput } from "@/components/forms/AuPhoneInput";
import { callConsentText, GUIDE_THANKS_KEY, type GuideThanksContext } from "@/lib/guide-consent";

// The guide thanks pages' client side (Oct 2026, Why Solar's ebook flow:
// the guide is given for an email, the next step is offered on the thanks
// page). Reads what the funnel left in sessionStorage: whether the guide
// email is on its way, and who an optional call would go to.

function useGuideThanks(guide: "selling" | "buying"): GuideThanksContext | null {
  // useSyncExternalStore, not setState in an effect: the server snapshot
  // (null) matches the server HTML, the client reads storage on hydration.
  const raw = useSyncExternalStore(
    () => () => {}, // storage doesn't change during the page's life
    () => {
      try {
        return sessionStorage.getItem(GUIDE_THANKS_KEY);
      } catch {
        return null; // storage blocked: no note, no call card
      }
    },
    () => null,
  );
  return useMemo(() => {
    if (!raw) return null;
    try {
      const ctx = JSON.parse(raw) as GuideThanksContext;
      return ctx.guide === guide && ctx.payload && typeof ctx.payload === "object" ? ctx : null;
    } catch {
      return null;
    }
  }, [raw, guide]);
}

/** "We've also emailed you the link", only when it's true. */
export function GuideEmailNote({ guide }: { guide: "selling" | "buying" }) {
  const ctx = useGuideThanks(guide);
  if (!ctx?.emailOnItsWay) return null;
  return (
    <p className="mt-2 text-xs text-ink-muted">
      We&rsquo;ve also emailed you the link, so it&rsquo;s there whenever you need it.
    </p>
  );
}

// `mobile`: how the copy asks for the number. "Check" once the funnel's
// mobile is prefilled, "Add" for a hand-off from before it asked for one.
function callCopy(ctx: GuideThanksContext, mobile: "Add" | "Check") {
  if (ctx.kind === "agent") {
    return {
      kicker: "Free appraisal",
      heading: "Want to know what your place is worth?",
      body: `${mobile} your mobile and one top local agent will call you to arrange a free appraisal. No obligation.`,
      button: "Book my call",
      done: "Done. One top local agent will call you within one business day.",
    };
  }
  const p = ctx.payload as { agentStatus?: string };
  const common = { kicker: "Optional", button: "Request a call", done: "Done. We'll give you a call soon." };
  if (ctx.guide === "buying") {
    return {
      ...common,
      heading: "Want help planning your next step?",
      body: `${mobile} your mobile and we'll give you a call. Buying help only, never selling agents.`,
    };
  }
  if (p.agentStatus === "already-listed") {
    return {
      ...common,
      heading: "Want a hand with your campaign?",
      body: `${mobile} your mobile and we'll give you a call. We won't pass your details to any agent.`,
    };
  }
  return {
    ...common,
    heading: "Want a call when you're closer?",
    body: `${mobile} your mobile and we'll check in when it's time to plan your sale. We won't pass it to an agent.`,
  };
}

/**
 * The optional call. "agent" (sellers moving within six months, not listed):
 * one agent calls, a vendor lead. "ypg": YPG calls, never passed on. Either
 * way /api/leads gets the download's answers again with the phone and
 * call: true, and only when they press the button, the action the consent
 * statement under it describes.
 */
export function GuideCallCard({ guide }: { guide: "selling" | "buying" }) {
  const ctx = useGuideThanks(guide);
  // The form mounts once storage has been read, so its state starts from
  // the funnel's hand-off (the prefilled mobile) rather than the server's
  // empty snapshot.
  return ctx ? <GuideCallForm ctx={ctx} /> : null;
}

function GuideCallForm({ ctx }: { ctx: GuideThanksContext }) {
  // The mobile the visitor gave for the guide: prefilled (still editable),
  // so booking the call is one tap.
  const savedPhone = typeof ctx.payload.phone === "string" ? ctx.payload.phone : "";
  // E.164 from the flagged field ("+61491570156"); the API stores 04…
  const [phone, setPhone] = useState(savedPhone);
  // Errors show once they've left the field or pressed the button, then
  // update as they type (Why Solar's rebate quiz).
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const copy = callCopy(ctx, savedPhone ? "Check" : "Add");
  const phoneError = phoneTouched ? auMobileError(phone) : null;

  // Nothing is sent on blur or before the button: the press is the request.
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const typed = phone;
    setPhoneTouched(true);
    if (auMobileError(typed)) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...ctx.payload, phone: typed, call: true }),
      });
      if (!res.ok) throw new Error("Submit failed");
      clarityEvent("guide_call_requested");
      clarityTag("guide_call_kind", ctx.kind);
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-call-card className="w-full text-left rounded-xl border border-line bg-white p-5 sm:p-6">
      {done ? (
        <p className="flex items-start gap-2.5 text-sm text-ink leading-relaxed" role="status">
          <Check className="check-pop mt-0.5 w-4 h-4 shrink-0 text-success" aria-hidden="true" />
          {copy.done}
        </p>
      ) : (
        <>
          <p className="text-[13px] text-ink-muted font-medium mb-1.5">{copy.kicker}</p>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-ink leading-tight tracking-[-0.02em] mb-2">{copy.heading}</h2>
          <p className="text-sm text-ink-muted leading-relaxed mb-4">{copy.body}</p>
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <AuPhoneInput
                value={phone}
                onChange={setPhone}
                onBlur={() => {
                  if (phone) setPhoneTouched(true);
                }}
                aria-label="Mobile"
                invalid={!!phoneError}
              />
              {phoneError && <p className="mt-1.5 text-xs text-danger">{phoneError}</p>}
            </div>
            {error && <p className="text-sm text-danger">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-cta hover:bg-cta-hover text-white font-semibold px-6 py-3.5 text-base sm:text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer press"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                  Sending…
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  {copy.button}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </>
              )}
            </button>
            <p className="text-[11px] text-ink-subtle leading-relaxed pt-1">
              {callConsentText(ctx.kind)} Read our{" "}
              <a href="/privacy" className="underline underline-offset-2 hover:text-ink">
                privacy policy
              </a>
              .
            </p>
          </form>
        </>
      )}
    </div>
  );
}
