"use client";

import { useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { SuburbAutocomplete, slugToSuburbLabel } from "@/components/search/SuburbAutocomplete";
import { clarityEvent, clarityTag } from "@/lib/clarity";
import { track } from "@/lib/analytics";
import { auMobileError } from "@/lib/utils/au-mobile";
import { AuPhoneInput } from "@/components/forms/AuPhoneInput";
import { GUIDE_PHONE_NOTE, GUIDE_SEQUENCE_LABEL, GUIDE_THANKS_KEY, downloadConsentText, type GuideThanksContext } from "@/lib/guide-consent";
import { BUYING_GUIDE_PDF_PATH } from "@/lib/guide-pdfs";
import { BUYING_CHAPTERS } from "@/lib/guide-books";
import { SEQUENCES, sequenceFor } from "@/lib/email-sequences";
import { useSiteFlags } from "@/components/flags/FlagsProvider";

// ----- Option sets ---------------------------------------------------------
// Since 14 Oct 2026 ("confident moves") the buying guide is a learning
// request: where (state rules), who (first home, next home, investing,
// downsizing) and where finance is up to change what we point the reader
// to; budget, property type and timing didn't, so they're gone. Nothing
// here reaches any agent; a buyer's agent introduction is /get-help.

type BuyerPersona = "first-home" | "upgrading" | "investing" | "downsizing";
type FinanceStatus = "pre-approved" | "talking-to-lenders" | "not-started" | "cash";

const PERSONAS: { id: BuyerPersona; label: string; sub: string }[] = [
  { id: "first-home",  label: "First home buyer",    sub: "Grants, concessions and deposits" },
  { id: "upgrading",   label: "Buying my next home", sub: "Often selling one at the same time" },
  { id: "investing",   label: "Investing",           sub: "Yield, growth and tax" },
  { id: "downsizing",  label: "Downsizing",          sub: "Smaller home, costs and timing" },
];

const FINANCE_STATUSES: { id: FinanceStatus; label: string; sub: string }[] = [
  { id: "not-started",        label: "Haven’t started",    sub: "Finance is still ahead of me" },
  { id: "talking-to-lenders", label: "Talking to lenders", sub: "Comparing or applying now" },
  { id: "pre-approved",       label: "Pre-approved",       sub: "A lender has signed off" },
  { id: "cash",               label: "Cash buyer",         sub: "No loan needed" },
];

// The plan stage each finance answer maps to (Lead.stage, the tips series).
const STAGE: Record<FinanceStatus, string> = {
  "not-started": "starting",
  "talking-to-lenders": "finance",
  "pre-approved": "searching",
  cash: "searching",
};

interface BuyingGuideFunnelProps {
  /** Pre-fill the suburb (deep-link from suburb pages). Overrides ?suburb=. */
  initialSuburbSlug?: string | null;
  /** Attribution string passed to /api/leads. */
  source?: string;
}

/**
 * The buying-guide funnel: three one-tap questions, then delivery. The last
 * screen shows the reader's starting chapters and offers the PDF straight
 * away; email, a mobile and the tips series are each optional choices.
 *
 * Reads ?suburb= so suburb pages can deep-link with the first step
 * pre-answered; the host page must wrap it in <Suspense>.
 */
export function BuyingGuideFunnel({ initialSuburbSlug: propSuburbSlug, source = "buying-guide" }: BuyingGuideFunnelProps = {}) {
  const params = useSearchParams();
  const router = useRouter();

  const urlSuburb = params.get("suburb");
  const startSuburbSlug = propSuburbSlug ?? urlSuburb;
  const startSuburbLabel = startSuburbSlug ? slugToSuburbLabel(startSuburbSlug) : null;

  const [step, setStep] = useState(startSuburbSlug ? 1 : 0);
  const [suburbSlug, setSuburbSlug] = useState<string | null>(startSuburbSlug);
  const [suburbLabel, setSuburbLabel] = useState<string | null>(startSuburbLabel);
  const [persona, setPersona] = useState<BuyerPersona | null>(null);
  const [finance, setFinance] = useState<FinanceStatus | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  // The tips series box only while the series really sends (src/lib/flags.ts, 20 Oct 2026).
  const { series } = useSiteFlags();
  // E.164 from the flagged field ("+61491570156"); the API stores 04…
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [wantsSequence, setWantsSequence] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot, must stay empty
  const [requestKey] = useState(() =>
    typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `k${Date.now()}${Math.random().toString(36).slice(2)}`,
  );

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const direction = useRef<"fwd" | "back">("fwd");
  // Set synchronously, so a double click can't send twice before React re-renders.
  const inFlight = useRef(false);

  const markStart = () => {
    if (hasStarted) return;
    setHasStarted(true);
    clarityEvent("form_start");
    clarityTag("form_name", "buying-guide");
    track("guide_started", { journey: "buying", placement: source });
  };

  const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const advanceTo = (to: number) => {
    setIsAdvancing(true);
    window.setTimeout(() => {
      direction.current = "fwd";
      setStep(to);
      setIsAdvancing(false);
    }, reducedMotion() ? 0 : 220);
  };

  const goForward = (to: number) => {
    direction.current = "fwd";
    setStep(to);
  };

  const stage = finance ? STAGE[finance] : "starting";
  const seq = SEQUENCES[sequenceFor("buying", stage)];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inFlight.current || submitted) return;
    if (!persona || !finance) return;
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
        guideType: "buying",
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        email: email.trim(),
        phone: phone || undefined,
        suburb: suburbSlug ?? undefined,
        buyerPersona: persona,
        financeStatus: finance,
        stage,
        wantsSequence: series && wantsSequence,
        marketingConsent: series && wantsSequence,
        requestKey,
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
      const handoff: GuideThanksContext = { guide: "buying", emailOnItsWay: saved?.emailOnItsWay === true, sequence: saved?.sequence === true };
      try {
        sessionStorage.setItem(GUIDE_THANKS_KEY, JSON.stringify(handoff));
      } catch {
        // Storage blocked: the thanks page shows the download without the email note.
      }
      clarityEvent("guide_download_submitted");
      clarityTag("guide_type", "buying");
      clarityTag("guide_persona", persona);
      track("guide_delivered", { journey: "buying", lead_type: "guide-download", stage, placement: source, sequence: wantsSequence ? "yes" : "no" });
      const qs = new URLSearchParams({ who: persona, stage });
      if (suburbSlug) qs.set("suburb", suburbSlug);
      setSubmitted(true);
      window.setTimeout(() => {
        router.push(`/buying-guide/thanks?${qs.toString()}`);
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

  // Chapter titles as in /buying-guide's contents (src/lib/guide-books.ts).
  const chapter = (n: number) => `Chapter ${n}: ${BUYING_CHAPTERS[n - 1].title}`;
  const startWith =
    persona === "first-home"
      ? [chapter(3), chapter(2), finance === "pre-approved" || finance === "cash" ? chapter(5) : chapter(8)]
      : persona === "investing"
        ? [chapter(2), chapter(4), chapter(6)]
        : finance === "pre-approved" || finance === "cash"
          ? [chapter(5), chapter(6), chapter(7)]
          : [chapter(2), chapter(8), chapter(6)];

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

  const optionList = <T extends string>(
    legend: string,
    hint: string | null,
    options: { id: T; label: string; sub: string }[],
    value: T | null,
    pick: (v: T) => void,
    back: number | null,
  ) => (
    <fieldset>
      <legend className="font-display text-[1.375rem] sm:text-2xl font-normal text-ink leading-tight tracking-[-0.02em] mb-2">{legend}</legend>
      {hint && <p className="text-sm text-ink-muted mb-5">{hint}</p>}
      <div className={`mt-4 flex flex-col gap-2.5 ${isAdvancing ? "pointer-events-none" : ""}`}>
        {options.map((opt) => (
          <button key={opt.id} type="button" aria-pressed={value === opt.id} onClick={() => pick(opt.id)} className={optionCard(value === opt.id)}>
            <span className="text-left">
              <span className="block text-[15px] font-semibold">{opt.label}</span>
              <span className={`block text-sm ${value === opt.id ? "text-white/80" : "text-ink-subtle"}`}>{opt.sub}</span>
            </span>
            <ArrowRight className={`w-4 h-4 shrink-0 ${value === opt.id ? "text-white/70" : "text-ink-subtle"}`} aria-hidden="true" />
            {value === opt.id && isAdvancing && <Check className="check-pop absolute top-2 right-2 w-4 h-4" aria-hidden="true" />}
          </button>
        ))}
      </div>
      {back !== null && backButton(back)}
    </fieldset>
  );

  return (
    <div data-funnel-card className="tone-light bg-white text-ink rounded-xl p-5 sm:p-8 border border-line shadow-[0_12px_40px_-14px_rgb(22_25_29/0.22)]">
      {step > 0 && (
        <div className="mb-6">
          <p className="mb-2 text-[13px] font-medium text-ink-muted" aria-live="polite">
            Step {Math.min(step + 1, stepTotal)} of {stepTotal}
          </p>
          <div className="h-1 rounded-full bg-line overflow-hidden" role="progressbar" aria-label="Guide questions" aria-valuemin={1} aria-valuemax={stepTotal} aria-valuenow={stepIndex + 1}>
            <span className="block h-full bg-ink origin-left transition-transform duration-300 ease-[var(--ease-out-quint)]" style={{ transform: `scaleX(${(stepIndex + 1) / stepTotal})` }} />
          </div>
        </div>
      )}

      <div key={step} className={direction.current === "back" ? "step-in-back" : "step-in-fwd"}>
        {step === 0 && (
          <div>
            <p className="text-[13px] text-ink-muted font-medium mb-2">Free guide · Three quick questions</p>
            <h3 className="font-display text-[1.375rem] sm:text-2xl font-normal text-ink leading-tight tracking-[-0.02em] mb-2">
              <label htmlFor="buy-guide-suburb">Where are you looking?</label>
            </h3>
            <p id="buy-guide-suburb-hint" className="text-sm text-ink-muted mb-5">Grants, stamp duty and contract rules differ by state, so we point you to the right ones.</p>
            <SuburbAutocomplete
              id="buy-guide-suburb"
              aria-describedby="buy-guide-suburb-hint"
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

        {step === 1 &&
          optionList("Which best describes you?", null, PERSONAS, persona, (v) => {
            markStart();
            setPersona(v);
            advanceTo(2);
          }, 0)}

        {step === 2 &&
          optionList("Where’s your finance up to?", "It changes which chapters we point you to first.", FINANCE_STATUSES, finance, (v) => {
            setFinance(v);
            advanceTo(3);
          }, 1)}

        {step === 3 && (
          <div>
            <h3 className="font-display text-[1.375rem] sm:text-2xl font-normal text-ink leading-tight tracking-[-0.02em]">Your guide is ready</h3>
            <p className="mt-2 text-sm text-ink-muted">{suburbLabel ? `For ${suburbLabel}. ` : ""}Start with:</p>
            <ol className="mt-2 mb-5 space-y-1 text-[15px] text-ink">
              {startWith.map((c) => (
                <li key={c} className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-success" aria-hidden="true" strokeWidth={3} />{c}</li>
              ))}
            </ol>
            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }}>
                <label htmlFor="buy-guide-website">Website</label>
                <input id="buy-guide-website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
              <p className="text-[15px] font-semibold text-ink">Email it to me</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="buy-guide-first" className="block text-sm font-medium text-ink mb-1">First name</label>
                  <input id="buy-guide-first" type="text" required autoComplete="given-name" value={firstName} onChange={(e) => { setFirstName(e.target.value); if (firstNameError) setFirstNameError(null); }} aria-invalid={firstNameError ? true : undefined} aria-describedby={firstNameError ? "buy-guide-first-error" : undefined} className={fieldClass} />
                {firstNameError && <p id="buy-guide-first-error" className="mt-1.5 text-sm text-danger" role="alert">{firstNameError}</p>}
                </div>
                <div>
                  <label htmlFor="buy-guide-last" className="block text-sm font-medium text-ink mb-1">Last name <span className="font-normal text-ink-muted">(optional)</span></label>
                  <input id="buy-guide-last" type="text" autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} className={fieldClass} />
                </div>
              </div>
              <div>
                <label htmlFor="buy-guide-email" className="block text-sm font-medium text-ink mb-1">Email</label>
                <input
                  id="buy-guide-email"
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
                  aria-describedby={emailError ? "buy-guide-email-error" : undefined}
                  className={fieldClass}
                />
                {emailError && <p id="buy-guide-email-error" className="mt-1.5 text-sm text-danger" role="alert">{emailError}</p>}
              </div>
              <div>
                <label htmlFor="buy-guide-phone" className="block text-sm font-medium text-ink mb-1">Mobile <span className="font-normal text-ink-muted">(optional)</span></label>
                <AuPhoneInput
                  id="buy-guide-phone"
                  value={phone}
                  onChange={(v) => {
                    setPhone(v);
                    if (phoneError) setPhoneError(null);
                  }}
                  aria-describedby="buy-guide-phone-note"
                  invalid={!!phoneError}
                  tone="raised"
                  placeholder="e.g. 0491 570 156"
                />
                {phoneError ? (
                  <p id="buy-guide-phone-note" className="mt-1.5 text-sm text-danger" role="alert">{phoneError}</p>
                ) : (
                  <p id="buy-guide-phone-note" className="mt-1.5 text-[13px] text-ink-muted leading-relaxed">{GUIDE_PHONE_NOTE}</p>
                )}
              </div>
              {series && (
                <div className="flex items-start gap-3">
                  <input id="buy-guide-sequence" type="checkbox" checked={wantsSequence} onChange={(e) => setWantsSequence(e.target.checked)} aria-describedby="buy-guide-sequence-hint" className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--cta)]" />
                  <div>
                    <label htmlFor="buy-guide-sequence" className="text-[15px] text-ink cursor-pointer">{GUIDE_SEQUENCE_LABEL}</label>
                    <p id="buy-guide-sequence-hint" className="text-[13px] text-ink-muted leading-relaxed">{seq.promise} Optional. Unsubscribe anytime.</p>
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
                    <Check className="check-pop w-4 h-4" aria-hidden="true" /> On its way
                  </>
                ) : submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" /> Sending…
                  </>
                ) : (
                  <>
                    Email me the guide <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </>
                )}
              </button>
              <p className="text-[13px] text-ink-muted leading-relaxed">
                {downloadConsentText("buying", series)}{" "}
                <a href="/privacy" className="underline underline-offset-2 hover:text-ink">Privacy policy</a>.
              </p>
            </form>
            <p className="mt-4 border-t border-line pt-4 text-sm text-ink-muted">
              Rather not give an email?{" "}
              <a
                href={BUYING_GUIDE_PDF_PATH}
                onClick={() => track("guide_downloaded_direct", { journey: "buying", stage, placement: source })}
                className="font-semibold text-ink underline underline-offset-4"
              >
                Download the PDF now
              </a>
            </p>
            {backButton(2)}
          </div>
        )}
      </div>

      {step > 0 && step < 3 && (suburbLabel || persona) && (
        <p className="mt-6 pt-4 border-t border-line text-[13px] text-ink-subtle leading-relaxed">
          {[suburbLabel, persona && PERSONAS.find((p) => p.id === persona)?.label].filter(Boolean).join(" · ")}
        </p>
      )}
    </div>
  );
}
