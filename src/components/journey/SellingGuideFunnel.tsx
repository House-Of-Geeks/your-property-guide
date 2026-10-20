"use client";

import { useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { SuburbAutocomplete, slugToSuburbLabel } from "@/components/search/SuburbAutocomplete";
import { clarityEvent, clarityTag } from "@/lib/clarity";
import { track } from "@/lib/analytics";
import { auMobileError } from "@/lib/utils/au-mobile";
import { AuPhoneInput } from "@/components/forms/AuPhoneInput";
import {
  GUIDE_PHONE_NOTE,
  GUIDE_SEQUENCE_LABEL,
  GUIDE_THANKS_KEY,
  type GuideThanksContext,
  downloadConsentText,
} from "@/lib/guide-consent";
import { GUIDE_PDF_PATH } from "@/lib/guide-pdfs";
import { SELLING_CHAPTERS } from "@/lib/guide-books";
import { SEQUENCES, sequenceFor } from "@/lib/email-sequences";
import { useSiteFlags } from "@/components/flags/FlagsProvider";

// ----- Option sets ---------------------------------------------------------
// Since 14 Oct 2026 ("confident moves") the guide is a learning request:
// three questions that change what we point the reader to (where, when, and
// where they're up to with agents), then delivery. Property type, bedrooms,
// motivation and price were dropped: they didn't change the guide. Nothing
// here ever reaches an agent; personal help is the /get-help form.

type Timeframe = "0-3-months" | "3-6-months" | "6-12-months" | "12-plus-months" | "researching";
type AgentStatus = "comparing" | "not-started" | "already-listed";

const TIMEFRAMES: { id: Timeframe; label: string; sub: string }[] = [
  { id: "0-3-months",     label: "Within 3 months",  sub: "Ready to go to market" },
  { id: "3-6-months",     label: "3 to 6 months",    sub: "Planning ahead" },
  { id: "6-12-months",    label: "6 to 12 months",   sub: "Getting organised early" },
  { id: "12-plus-months", label: "More than a year", sub: "Long-range planning" },
  { id: "researching",    label: "Just researching", sub: "No firm plans yet" },
];

const AGENT_STATUSES: { id: AgentStatus; label: string; sub: string }[] = [
  { id: "comparing",      label: "Comparing agents now",     sub: "Talking to or shortlisting agents" },
  { id: "not-started",    label: "Haven't started",          sub: "No agent conversations yet" },
  { id: "already-listed", label: "Already listed",           sub: "Signed with an agent" },
];

const timeframeLabel = (id: Timeframe) => TIMEFRAMES.find((t) => t.id === id)?.label ?? "";

// Mirrors the server-side scoring in /api/leads for display on the
// thank-you page. The server computes its own score; this one only
// drives copy.
function displayScore(timeframe: Timeframe | null, agentStatus: AgentStatus | null): string {
  if (agentStatus === "already-listed") return "listed";
  if (timeframe === "0-3-months") return "hot";
  if (timeframe === "3-6-months") return "warm";
  return "cold";
}

interface SellingGuideFunnelProps {
  /** Pre-fill the suburb (deep-link from suburb pages). Overrides ?suburb=. */
  initialSuburbSlug?: string | null;
  /** Attribution string passed to /api/leads. */
  source?: string;
}

/**
 * The selling-guide funnel: three one-tap questions, then delivery. The
 * last screen shows the reader's starting chapters and offers the PDF
 * straight away; email (and a mobile, and the tips series) are each their
 * own optional choice.
 *
 * Reads ?suburb= so suburb pages can deep-link with the first step
 * pre-answered; the host page must wrap it in <Suspense>.
 */
export function SellingGuideFunnel({
  initialSuburbSlug: propSuburbSlug,
  source = "selling-guide",
}: SellingGuideFunnelProps = {}) {
  const params = useSearchParams();
  const router = useRouter();

  const urlSuburb = params.get("suburb");
  const startSuburbSlug = propSuburbSlug ?? urlSuburb;
  const startSuburbLabel = startSuburbSlug ? slugToSuburbLabel(startSuburbSlug) : null;

  const [step, setStep] = useState(startSuburbSlug ? 1 : 0);
  const [suburbSlug, setSuburbSlug] = useState<string | null>(startSuburbSlug);
  const [suburbLabel, setSuburbLabel] = useState<string | null>(startSuburbLabel);
  const [timeframe, setTimeframe] = useState<Timeframe | null>(null);
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  // E.164 from the flagged field ("+61491570156"); the API stores 04…
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [wantsSequence, setWantsSequence] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  // The tips series box only while the series really sends (src/lib/flags.ts, 20 Oct 2026).
  const { series } = useSiteFlags();
  // Stops a double click or a retry making two rows (/api/leads requestKey).
  const [requestKey] = useState(() =>
    typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `k${Date.now()}${Math.random().toString(36).slice(2)}`,
  );
  const [website, setWebsite] = useState(""); // honeypot, must stay empty

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  // Locks the option grid during the confirm beat between tap and advance.
  const [isAdvancing, setIsAdvancing] = useState(false);
  // Drives step-in-fwd vs step-in-back on the keyed step wrapper.
  const direction = useRef<"fwd" | "back">("fwd");
  // Set synchronously, so a double click can't send twice before React re-renders.
  const inFlight = useRef(false);

  const markStart = () => {
    if (hasStarted) return;
    setHasStarted(true);
    clarityEvent("form_start");
    clarityTag("form_name", "selling-guide");
  };

  const reducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Single-tap options: paint the selection, hold a brief confirm beat,
  // then advance. The beat is skipped under reduced motion.
  const advanceTo = (to: number) => {
    setIsAdvancing(true);
    window.setTimeout(() => {
      direction.current = "fwd";
      setStep(to);
      setIsAdvancing(false);
    }, reducedMotion() ? 0 : 220);
  };

  // Forward moves with no card to confirm (suburb select, skip links).
  const goForward = (to: number) => {
    direction.current = "fwd";
    setStep(to);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inFlight.current || submitted) return;
    if (!timeframe || !agentStatus) return;
    // The server needs a first name; say so here rather than "Something went wrong".
    if (!firstName.trim()) {
      setFirstNameError("Enter your first name.");
      return;
    }
    setFirstNameError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Enter an email address like name@example.com.");
      return;
    }
    setEmailError(null);
    // The mobile is optional (14 Oct 2026); when given it must be a real one.
    const mobileError = phone ? auMobileError(phone) : null;
    if (mobileError) {
      setPhoneError(mobileError);
      return;
    }
    setPhoneError(null);
    setError(null);
    inFlight.current = true;
    setSubmitting(true);
    try {
      const payload = {
        type: "guide-download",
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        email: email.trim(),
        phone: phone || undefined,
        suburb: suburbSlug ?? undefined,
        sellingTimeframe: timeframe,
        agentStatus,
        stage: agentStatus,
        // The tips series is its own unticked box; requesting the guide
        // sends the guide and nothing else.
        wantsSequence: series && wantsSequence,
        marketingConsent: series && wantsSequence,
        requestKey,
        // ?c= from a Sent 24/7 email link: credits that email.
        resumeClickId: params.get("c") ?? undefined,
        source,
        website,
      };
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Submit failed");
      }
      const saved = (await res.json().catch(() => null)) as { emailOnItsWay?: boolean; sequence?: boolean } | null;
      // Tell the thanks page whether the email is on its way (sessionStorage,
      // this tab only). Nothing personal: the thanks page sends nothing.
      const handoff: GuideThanksContext = {
        guide: "selling",
        emailOnItsWay: saved?.emailOnItsWay === true,
        // What the server actually started, not just the tick.
        sequence: saved?.sequence === true,
      };
      try {
        sessionStorage.setItem(GUIDE_THANKS_KEY, JSON.stringify(handoff));
      } catch {
        // Storage blocked: the thanks page shows the download without the email note.
      }
      clarityEvent("guide_download_submitted");
      track("guide_delivered", { journey: "selling", lead_type: "guide-download", timeframe, stage: agentStatus, placement: source, sequence: wantsSequence ? "yes" : "no" });
      clarityTag("guide_timeframe", timeframe);
      clarityTag("guide_agent_status", agentStatus);
      if (suburbSlug) clarityTag("guide_suburb", suburbSlug);
      const qs = new URLSearchParams({ score: displayScore(timeframe, agentStatus) });
      if (suburbSlug) qs.set("suburb", suburbSlug);
      // Success beat: the button confirms before the route changes.
      setSubmitted(true);
      window.setTimeout(() => {
        router.push(`/selling-guide/thanks?${qs.toString()}`);
      }, reducedMotion() ? 0 : 600);
    } catch {
      setError("Something went wrong. Please try again.");
      inFlight.current = false;
    } finally {
      setSubmitting(false);
    }
  };

  const stepTotal = 4;
  const stepIndex = Math.min(step, stepTotal - 1);
  const seq = SEQUENCES[sequenceFor("selling", agentStatus)];

  // What to read first, from the answers: the value shown before any
  // contact details are asked for. Chapter titles from src/lib/guide-books.ts.
  const chapter = (n: number) => `Chapter ${n}: ${SELLING_CHAPTERS[n - 1].title}`;
  const startWith =
    agentStatus === "already-listed"
      ? [chapter(7), chapter(8), chapter(9)]
      : agentStatus === "comparing"
        ? [chapter(5), chapter(3), chapter(2)]
        : timeframe === "0-3-months" || timeframe === "3-6-months"
          ? [chapter(3), chapter(4), chapter(5)]
          : [chapter(1), chapter(3), chapter(4)];

  const optionCard = (active: boolean) =>
    `relative flex items-center justify-between rounded-lg border px-4 sm:px-5 py-3.5 transition-colors duration-150 cursor-pointer press ${
      active ? "bg-ink text-white border-ink" : "bg-white text-ink border-line-strong hover:border-ink"
    }${active && isAdvancing ? " opt-confirm" : ""}`;

  const fieldClass =
    "w-full min-w-0 rounded-lg border border-line-strong bg-white px-4 py-3 text-base text-ink placeholder:text-ink-subtle caret-cta focus:border-cta focus:ring-[3px] focus:ring-cta/15 outline-none transition-[border-color,box-shadow] duration-200 aria-[invalid=true]:border-danger";

  const backButton = (to: number) => (
    <button
      type="button"
      onClick={() => {
        direction.current = "back";
        setStep(to);
      }}
      className="mt-4 inline-flex items-center gap-1.5 rounded-md py-1 text-sm text-ink-muted hover:text-ink transition-colors cursor-pointer"
    >
      <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" /> Back
    </button>
  );

  return (
    <div data-funnel-card className="tone-light bg-white text-ink rounded-xl p-5 sm:p-8 border border-line shadow-[0_12px_40px_-14px_rgb(22_25_29/0.22)]">
      {step > 0 && (
        <div className="mb-6">
          <p className="mb-2 text-[13px] font-medium text-ink-muted" aria-live="polite">
            Step {Math.min(step + 1, stepTotal)} of {stepTotal}
          </p>
          <div
            className="h-1 rounded-full bg-line overflow-hidden"
            role="progressbar"
            aria-label="Guide questions"
            aria-valuemin={1}
            aria-valuemax={stepTotal}
            aria-valuenow={stepIndex + 1}
          >
            <span
              className="block h-full bg-ink origin-left transition-transform duration-300 ease-[var(--ease-out-quint)]"
              style={{ transform: `scaleX(${(stepIndex + 1) / stepTotal})` }}
            />
          </div>
        </div>
      )}

      <div key={step} className={direction.current === "back" ? "step-in-back" : "step-in-fwd"}>

      {/* Step 0, suburb (skippable) */}
      {step === 0 && (
        <div>
          <p className="text-[13px] text-ink-muted font-medium mb-2">Free guide · Three quick questions</p>
          <h3 className="font-display text-[1.375rem] sm:text-2xl font-normal text-ink leading-tight tracking-[-0.02em] mb-2">
            <label htmlFor="guide-suburb">Where&rsquo;s the property?</label>
          </h3>
          <p id="guide-suburb-hint" className="text-sm text-ink-muted mb-5">
            Costs, agent fees and contract rules differ by state, so we point you to the right ones.
          </p>
          <SuburbAutocomplete
            id="guide-suburb"
            aria-describedby="guide-suburb-hint"
            placeholder="Suburb or postcode"
            onSelectLocation={(slug, label) => {
              markStart();
              setSuburbSlug(slug);
              setSuburbLabel(label);
              goForward(1);
            }}
            onClear={() => {
              setSuburbSlug(null);
              setSuburbLabel(null);
            }}
          />
          <div className="mt-4 text-right">
            <button
              type="button"
              onClick={() => {
                markStart();
                setSuburbSlug(null);
                setSuburbLabel(null);
                goForward(1);
              }}
              className="text-sm text-ink-muted hover:text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink transition-colors cursor-pointer"
            >
              Skip this question
            </button>
          </div>
        </div>
      )}

      {/* Step 1, timeframe */}
      {step === 1 && (
        <fieldset>
          <legend className="font-display text-[1.375rem] sm:text-2xl font-normal text-ink leading-tight tracking-[-0.02em] mb-6">
            When are you thinking of selling?
          </legend>
          <div className={`flex flex-col gap-2.5 ${isAdvancing ? "pointer-events-none" : ""}`}>
            {TIMEFRAMES.map((opt) => (
              <button
                key={opt.id}
                type="button"
                aria-pressed={timeframe === opt.id}
                onClick={() => {
                  markStart();
                  setTimeframe(opt.id);
                  advanceTo(2);
                }}
                className={optionCard(timeframe === opt.id)}
              >
                <span className="text-left">
                  <span className="block text-[15px] font-semibold">{opt.label}</span>
                  <span className={`block text-sm ${timeframe === opt.id ? "text-white/80" : "text-ink-subtle"}`}>{opt.sub}</span>
                </span>
                <ArrowRight className={`w-4 h-4 shrink-0 ${timeframe === opt.id ? "text-white/70" : "text-ink-subtle"}`} aria-hidden="true" />
                {timeframe === opt.id && isAdvancing && <Check className="check-pop absolute top-2 right-2 w-4 h-4" aria-hidden="true" />}
              </button>
            ))}
          </div>
          {backButton(0)}
        </fieldset>
      )}

      {/* Step 2, agent status */}
      {step === 2 && (
        <fieldset>
          <legend className="font-display text-[1.375rem] sm:text-2xl font-normal text-ink leading-tight tracking-[-0.02em] mb-2">
            Where are you up to with agents?
          </legend>
          <p className="text-sm text-ink-muted mb-5">It changes which chapters we point you to first.</p>
          <div className={`flex flex-col gap-2.5 ${isAdvancing ? "pointer-events-none" : ""}`}>
            {AGENT_STATUSES.map((opt) => (
              <button
                key={opt.id}
                type="button"
                aria-pressed={agentStatus === opt.id}
                onClick={() => {
                  setAgentStatus(opt.id);
                  advanceTo(3);
                }}
                className={optionCard(agentStatus === opt.id)}
              >
                <span className="text-left">
                  <span className="block text-[15px] font-semibold">{opt.label}</span>
                  <span className={`block text-sm ${agentStatus === opt.id ? "text-white/80" : "text-ink-subtle"}`}>{opt.sub}</span>
                </span>
                <ArrowRight className={`w-4 h-4 shrink-0 ${agentStatus === opt.id ? "text-white/70" : "text-ink-subtle"}`} aria-hidden="true" />
                {agentStatus === opt.id && isAdvancing && <Check className="check-pop absolute top-2 right-2 w-4 h-4" aria-hidden="true" />}
              </button>
            ))}
          </div>
          {backButton(1)}
        </fieldset>
      )}

      {/* Step 3, the reading order first, then delivery */}
      {step === 3 && (
        <div>
          <h3 className="font-display text-[1.375rem] sm:text-2xl font-normal text-ink leading-tight tracking-[-0.02em]">
            Your guide is ready
          </h3>
          <p className="mt-2 text-sm text-ink-muted">{suburbLabel ? `For ${suburbLabel}. ` : ""}Start with:</p>
          <ol className="mt-2 mb-5 space-y-1 text-[15px] text-ink">
            {startWith.map((c) => (
              <li key={c} className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-success" aria-hidden="true" strokeWidth={3} />{c}</li>
            ))}
          </ol>
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }}>
              <label htmlFor="guide-website">Website</label>
              <input id="guide-website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
            <p className="text-[15px] font-semibold text-ink">Email it to me</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="guide-first" className="block text-sm font-medium text-ink mb-1">First name</label>
                <input id="guide-first" type="text" required autoComplete="given-name" value={firstName} onChange={(e) => { setFirstName(e.target.value); if (firstNameError) setFirstNameError(null); }} aria-invalid={firstNameError ? true : undefined} aria-describedby={firstNameError ? "guide-first-error" : undefined} className={fieldClass} />
                {firstNameError && <p id="guide-first-error" className="mt-1.5 text-sm text-danger" role="alert">{firstNameError}</p>}
              </div>
              <div>
                <label htmlFor="guide-last" className="block text-sm font-medium text-ink mb-1">Last name <span className="font-normal text-ink-muted">(optional)</span></label>
                <input id="guide-last" type="text" autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} className={fieldClass} />
              </div>
            </div>
            <div>
              <label htmlFor="guide-email" className="block text-sm font-medium text-ink mb-1">Email</label>
              <input
                id="guide-email"
                type="email"
                required
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(null);
                }}
                aria-invalid={emailError ? true : undefined}
                aria-describedby={emailError ? "guide-email-error" : undefined}
                className={fieldClass}
              />
              {emailError && <p id="guide-email-error" className="mt-1.5 text-sm text-danger" role="alert">{emailError}</p>}
            </div>
            <div>
              <label htmlFor="guide-phone" className="block text-sm font-medium text-ink mb-1">Mobile <span className="font-normal text-ink-muted">(optional)</span></label>
              <AuPhoneInput
                id="guide-phone"
                value={phone}
                onChange={(v) => {
                  setPhone(v);
                  if (phoneError) setPhoneError(null);
                }}
                aria-describedby="guide-phone-note"
                invalid={!!phoneError}
                tone="raised"
                placeholder="e.g. 0491 570 156"
              />
              {phoneError ? (
                <p id="guide-phone-note" className="mt-1.5 text-sm text-danger" role="alert">{phoneError}</p>
              ) : (
                <p id="guide-phone-note" className="mt-1.5 text-[13px] text-ink-muted leading-relaxed">{GUIDE_PHONE_NOTE}</p>
              )}
            </div>
            {series && (
              <div className="flex items-start gap-3">
                <input id="guide-sequence" type="checkbox" checked={wantsSequence} onChange={(e) => setWantsSequence(e.target.checked)} aria-describedby="guide-sequence-hint" className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--cta)]" />
                <div>
                  <label htmlFor="guide-sequence" className="text-[15px] text-ink cursor-pointer">{GUIDE_SEQUENCE_LABEL}</label>
                  <p id="guide-sequence-hint" className="text-[13px] text-ink-muted leading-relaxed">{seq.promise} Optional. Unsubscribe anytime.</p>
                </div>
              </div>
            )}

            {error && <p className="text-sm text-danger" role="alert">{error}</p>}

            <button
              type="submit"
              disabled={submitting || submitted}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-cta-ink font-semibold px-6 py-3.5 text-base transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer press"
            >
              {submitted ? (
                <>
                  <Check className="check-pop w-4 h-4" aria-hidden="true" />
                  On its way
                </>
              ) : submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                  Sending…
                </>
              ) : (
                <>
                  Email me the guide
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </>
              )}
            </button>
            <p className="text-[13px] text-ink-muted leading-relaxed">
              {downloadConsentText("selling", series)}{" "}
              <a href="/privacy" className="underline underline-offset-2 hover:text-ink">Privacy policy</a>.
            </p>
          </form>
          <p className="mt-4 border-t border-line pt-4 text-sm text-ink-muted">
            Rather not give an email?{" "}
            <a
              href={GUIDE_PDF_PATH}
              onClick={() => track("guide_downloaded_direct", { journey: "selling", timeframe, stage: agentStatus, placement: source })}
              className="font-semibold text-ink underline underline-offset-4"
            >
              Download the PDF now
            </a>
          </p>
          {backButton(2)}
        </div>
      )}

      </div>

      {step > 0 && step < 3 && (suburbLabel || timeframe) && (
        <p className="mt-6 pt-4 border-t border-line text-[13px] text-ink-subtle leading-relaxed">
          {[suburbLabel, timeframe && timeframeLabel(timeframe)].filter(Boolean).join(" · ")}
        </p>
      )}
    </div>
  );
}
