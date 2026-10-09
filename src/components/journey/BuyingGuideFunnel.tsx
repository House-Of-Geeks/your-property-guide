"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { SuburbAutocomplete, slugToSuburbLabel } from "@/components/search/SuburbAutocomplete";
import { clarityEvent, clarityTag } from "@/lib/clarity";
import { isValidPhone, PHONE_ERROR } from "@/lib/utils/phone";
import { BUYING_CONSENT } from "@/lib/guide-consent";

// ----- Option sets ---------------------------------------------------------
// Question order is fixed by conversion research, lowest-friction first,
// contact details last. Timeframe is the money question; agent status is
// the kill/branch question (already-listed vendors get the guide but are
// never passed to agents).

type PropertyType = "house" | "townhouse" | "unit" | "land" | "acreage";
type Timeframe = "0-3-months" | "3-6-months" | "6-12-months" | "12-plus-months" | "researching";
type BuyerPersona = "first-home" | "upgrading" | "investing" | "downsizing";
type FinanceStatus = "pre-approved" | "talking-to-lenders" | "not-started" | "cash";

const PROPERTY_TYPES: { id: PropertyType; label: string }[] = [
  { id: "house",     label: "House" },
  { id: "townhouse", label: "Townhouse" },
  { id: "unit",      label: "Unit or apartment" },
  { id: "land",      label: "Land" },
  { id: "acreage",   label: "Acreage or rural" },
];

const TIMEFRAMES: { id: Timeframe; label: string; sub: string }[] = [
  { id: "0-3-months",     label: "Within 3 months",  sub: "Actively looking now" },
  { id: "3-6-months",     label: "3 to 6 months",    sub: "Getting serious" },
  { id: "6-12-months",    label: "6 to 12 months",   sub: "Planning ahead" },
  { id: "12-plus-months", label: "More than a year", sub: "Long-range planning" },
  { id: "researching",    label: "Just researching", sub: "No firm plans yet" },
];

const PERSONAS: { id: BuyerPersona; label: string; sub: string }[] = [
  { id: "first-home",  label: "First home buyer",   sub: "Schemes, deposits, the lot" },
  { id: "upgrading",   label: "Upgrading or moving", sub: "Selling one, buying the next" },
  { id: "investing",   label: "Investing",           sub: "Yield, growth and tax" },
  { id: "downsizing",  label: "Downsizing",          sub: "Less house, more life" },
];

const FINANCE_STATUSES: { id: FinanceStatus; label: string; sub: string }[] = [
  { id: "pre-approved",       label: "Pre-approved",        sub: "A lender has signed off" },
  { id: "talking-to-lenders", label: "Talking to lenders",  sub: "Comparing or applying now" },
  { id: "not-started",        label: "Haven't started",     sub: "Finance is still ahead of me" },
  { id: "cash",               label: "Cash buyer",          sub: "No loan needed" },
];

const BUDGETS: string[] = [
  "Under $500k",
  "$500k to $750k",
  "$750k to $1m",
  "$1m to $1.5m",
  "$1.5m to $2m",
  "Over $2m",
  "Not sure yet",
];

// A restored answer, kept only when it is still one of the options.
function pick<T extends string>(value: unknown, options: readonly T[]): T | null {
  return typeof value === "string" && (options as readonly string[]).includes(value) ? (value as T) : null;
}

const timeframeLabel = (id: Timeframe) => TIMEFRAMES.find((t) => t.id === id)?.label ?? "";

// Mirrors the server-side scoring in /api/leads for display on the
// thank-you page. The server computes its own score; this one only
// drives copy.
function displayScore(timeframe: Timeframe | null, finance: FinanceStatus | null): string {
  const ready = finance === "pre-approved" || finance === "cash";
  if (timeframe === "0-3-months" && ready) return "hot";
  if (timeframe === "0-3-months" || timeframe === "3-6-months") return "warm";
  return "cold";
}

interface BuyingGuideFunnelProps {
  /** Pre-fill the suburb (deep-link from suburb pages). Overrides ?suburb=. */
  initialSuburbSlug?: string | null;
  /** Attribution string passed to /api/leads. */
  source?: string;
}

/**
 * The selling-guide qualification funnel. Eight single-question screens,
 * one tap each, contact details last. Every question is framed as
 * personalising the guide, which is what keeps top-of-funnel conversion
 * up versus a bare "compare agents" form.
 *
 * Reads ?suburb= so suburb pages can deep-link with the first step
 * pre-answered; the host page must wrap it in <Suspense>.
 */
export function BuyingGuideFunnel({
  initialSuburbSlug: propSuburbSlug,
  source = "buying-guide",
}: BuyingGuideFunnelProps = {}) {
  const params = useSearchParams();
  const router = useRouter();

  const urlSuburb = params.get("suburb");
  const startSuburbSlug = propSuburbSlug ?? urlSuburb;
  const startSuburbLabel = startSuburbSlug ? slugToSuburbLabel(startSuburbSlug) : null;

  const [step, setStep] = useState(startSuburbSlug ? 1 : 0);
  const [suburbSlug, setSuburbSlug] = useState<string | null>(startSuburbSlug);
  const [suburbLabel, setSuburbLabel] = useState<string | null>(startSuburbLabel);
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe | null>(null);
  const [persona, setPersona] = useState<BuyerPersona | null>(null);
  const [finance, setFinance] = useState<FinanceStatus | null>(null);
  const [budget, setBudget] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [website, setWebsite] = useState(""); // honeypot, must stay empty
  // The last partial step 6 saved, so Back then Continue with nothing
  // changed doesn't post it again.
  const savedPartial = useRef<string | null>(null);
  // The safety net's full-lead POST, made when a valid mobile loses focus,
  // so the button finishes that request instead of posting the lead twice.
  const promotion = useRef<{ phone: string; done: Promise<boolean> } | null>(null);
  // Resume token and click id from a recovery link (?resume, ?c).
  const resume = useRef<{ token?: string; clickId?: string }>({});

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  // Locks the option grid during the confirm beat between tap and advance.
  const [isAdvancing, setIsAdvancing] = useState(false);
  // Drives step-in-fwd vs step-in-back on the keyed step wrapper.
  const direction = useRef<"fwd" | "back">("fwd");

  const markStart = () => {
    if (hasStarted) return;
    setHasStarted(true);
    clarityEvent("form_start");
    clarityTag("form_name", "buying-guide");
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

  const answers = () => ({
    guideType: "buying" as const,
    suburb: suburbSlug ?? undefined,
    propertyType: propertyType ?? undefined,
    sellingTimeframe: timeframe ?? undefined,
    buyerPersona: persona ?? undefined,
    financeStatus: finance ?? undefined,
    budget: budget ?? undefined,
  });

  // The complete lead, less the mobile.
  const leadPayload = () => ({
    type: "guide-download",
    firstName: firstName.trim(),
    lastName: lastName.trim() || undefined,
    email: email.trim(),
    ...answers(),
    // Requesting the guide is the consent: the statement under the
    // button says we'll email tips and market updates (no checkbox
    // since Oct 2026). ActiveCampaign subscribes on this flag.
    marketingConsent: true,
    resumeToken: resume.current.token,
    resumeClickId: resume.current.clickId,
    source,
    website,
  });

  const postLead = async (body: Record<string, unknown>, keepalive = false) => {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive,
    });
    if (!res.ok) {
      const json = await res.json().catch(() => null);
      throw new Error(json?.error ?? "Submit failed");
    }
  };

  // Opened from a recovery link (?ws_resume= our PartialLead id, ?resume= a
  // Sent 24/7 token): restore the saved answers and open at the mobile step,
  // as Why Solar's quiz does. Buying partials are not sent to Sent 24/7 today
  // (never passed to agents), but the link works the same if they are.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const wsResume = params.get("ws_resume");
    const token = params.get("resume");
    if (!wsResume && !token) return;
    resume.current = { token: token ?? undefined, clickId: params.get("c") ?? undefined };
    let cancelled = false;
    (async () => {
      let saved: {
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
        answers?: Record<string, unknown>;
      } | null = null;
      try {
        const qs = wsResume
          ? `id=${encodeURIComponent(wsResume)}`
          : `token=${encodeURIComponent(token!)}&source=buying-guide`;
        const res = await fetch(`/api/partial-lead/restore?${qs}`);
        if (res.ok) saved = await res.json();
      } catch {
        // Restore is best-effort; the URL's own name and email still help.
      }
      if (cancelled) return;
      const a = saved?.answers ?? {};
      const first = saved?.firstName || params.get("first_name") || "";
      const last = saved?.lastName || params.get("last_name") || "";
      const mail = saved?.email || params.get("email") || "";
      setFirstName(first);
      setLastName(last);
      setEmail(mail);
      const slug = typeof a.suburb === "string" ? a.suburb : null;
      if (slug) {
        setSuburbSlug(slug);
        setSuburbLabel(slugToSuburbLabel(slug));
      }
      const tf = pick(a.sellingTimeframe, TIMEFRAMES.map((t) => t.id));
      const who = pick(a.buyerPersona, PERSONAS.map((p) => p.id));
      setPersona(who);
      setPropertyType(pick(a.propertyType, PROPERTY_TYPES.map((t) => t.id)));
      setBudget(pick(a.budget, BUDGETS));
      setTimeframe(tf);
      setFinance(pick(a.financeStatus, FINANCE_STATUSES.map((f) => f.id)));
      // Everything the mobile step needs is back: open it. Otherwise start
      // from the questions, with the contact details already filled in.
      direction.current = "fwd";
      if (tf && who && first && mail) setStep(7);
      else if (slug) setStep(1);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Step 6, name + email. Saved in the background as a partial (Why Solar's
  // model: /api/partial-lead keeps one row per email per guide) and the
  // visitor moves straight on. A partial is not a lead: no team email, no
  // guide yet.
  const onSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!timeframe || !persona) return;
    const body = JSON.stringify({
      email: email.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      source: "buying-guide",
      placement: source,
      answers: answers(),
      website,
    });
    if (savedPartial.current !== body) {
      savedPartial.current = body;
      fetch("/api/partial-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {
        // Never blocks the visitor: the complete lead is the record that matters.
      });
      clarityEvent("guide_email_captured");
      clarityTag("guide_type", "buying");
    }
    goForward(7);
  };

  // Safety net (Why Solar's usePartialLead promotion): a valid mobile that
  // loses focus creates the complete lead at once, keepalive, so a missed
  // tap or a closed tab doesn't lose it. Once only; the button finishes it.
  const promote = () => {
    const typed = phone.trim();
    if (promotion.current || !timeframe || !persona || !isValidPhone(typed)) return;
    promotion.current = {
      phone: typed,
      done: postLead({ ...leadPayload(), phone: typed }, true).then(
        () => true,
        () => false,
      ),
    };
  };

  // Step 7, the mobile. Creates the complete lead (unless the safety net
  // already did, with this number): the server emails the guide and the
  // team and deletes the partial.
  const onSubmitMobile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!timeframe || !persona) return;
    const typed = phone.trim();
    // `required` stops an empty submit; the number must also be dialable,
    // or the server rejects it and the user only sees a generic error.
    if (!isValidPhone(typed)) {
      setPhoneError(PHONE_ERROR);
      return;
    }
    setPhoneError(null);
    setError(null);
    setSubmitting(true);
    try {
      const promoted = promotion.current;
      const sent = promoted?.phone === typed && (await promoted.done);
      if (!sent) await postLead({ ...leadPayload(), phone: typed });
      clarityEvent("guide_download_submitted");
      clarityTag("guide_type", "buying");
      clarityTag("guide_timeframe", timeframe);
      clarityTag("guide_persona", persona);
      if (suburbSlug) clarityTag("guide_suburb", suburbSlug);
      const qs = new URLSearchParams({ score: displayScore(timeframe, finance) });
      if (suburbSlug) qs.set("suburb", suburbSlug);
      // Success beat: the button confirms before the route changes.
      setSubmitted(true);
      window.setTimeout(() => {
        router.push(`/buying-guide/thanks?${qs.toString()}`);
      }, reducedMotion() ? 0 : 600);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const stepTotal = 8;
  const stepIndex = Math.min(step, stepTotal - 1);

  // Shared option-button styling. Tactile: options rise a hair on hover
  // and press down on click, so every step feels like a physical choice.
  const optionClass = (active: boolean) =>
    `relative text-left rounded-xl border px-4 py-3.5 transition-all duration-200 cursor-pointer press active:translate-y-0 ${
      active
        ? "bg-ink text-white border-ink"
        : "bg-surface-raised text-ink border-line hover:border-line-strong hover:-translate-y-0.5 hover:shadow-md"
    }${active && isAdvancing ? " opt-confirm" : ""}`;

  // Tick on the just-selected card during the confirm beat.
  const confirmCheck = (active: boolean) =>
    active && isAdvancing ? (
      <Check className="check-pop absolute top-2 right-2 w-4 h-4" aria-hidden="true" />
    ) : null;

  const backButton = (to: number) => (
    <button
      type="button"
      onClick={() => {
        direction.current = "back";
        setStep(to);
      }}
      className="mt-4 inline-flex items-center gap-1.5 text-xs text-ink-subtle hover:text-ink transition-colors cursor-pointer"
    >
      <ArrowLeft className="w-3.5 h-3.5" /> Back
    </button>
  );

  // Collection statement, also the marketing-email consent (there is no
  // checkbox), so it sits under the button on both contact steps: where
  // the email is given and where the mobile is.
  const collectionStatement = (
    <p className="text-[11px] text-ink-subtle leading-relaxed pt-1">
      {BUYING_CONSENT} Read our{" "}
      <a href="/privacy" className="underline underline-offset-2 hover:text-ink">
        privacy policy
      </a>
      .
    </p>
  );

  return (
    <div data-funnel-card className="bg-surface-warm text-ink rounded-2xl p-6 sm:p-8 shadow-2xl border border-line border-t-[3px] border-t-cta">
      {/* Progress. Hidden on the opening question (a bar on screen one
          costs conversions); from step 2 it shows already-earned progress.
          Each segment is a track with a fill that sweeps in from the left;
          the newest segment waits a beat so the step lands first. */}
      {step > 0 && (
        <div className="flex items-center gap-2 mb-7">
          {Array.from({ length: stepTotal }, (_, i) => (
            <div key={i} className="flex-1 h-[3px] rounded-full bg-line overflow-hidden">
              <span
                className="block h-full bg-cta origin-left transition-transform duration-[450ms] ease-[var(--ease-out-quint)]"
                style={{
                  transform: i <= stepIndex ? "scaleX(1)" : "scaleX(0)",
                  transitionDelay: i === stepIndex ? "120ms" : "0ms",
                }}
              />
            </div>
          ))}
          <p className="ml-2 text-[11px] font-medium uppercase tracking-wider text-ink-subtle whitespace-nowrap">
            {Math.min(step + 1, stepTotal)} / {stepTotal}
          </p>
        </div>
      )}

      {/* Keyed wrapper: remounts on every step change so each question
          slides in from the direction of travel (see .step-in-fwd /
          .step-in-back in globals.css). */}
      <div key={step} className={direction.current === "back" ? "step-in-back" : "step-in-fwd"}>

      {/* Step 0, suburb */}
      {step === 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-cta font-medium mb-3">
            Free guide · Takes about 60 seconds
          </p>
          <h3 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-2">
            Where are you looking?
          </h3>
          <p className="text-sm text-ink-muted mb-5">
            We&rsquo;ll match the guide to your market: prices, schemes and
            buying conditions are different in every suburb.
          </p>
          <SuburbAutocomplete
            placeholder="Suburb or postcode, e.g. Burpengary or 4505"
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
              className="text-xs text-ink-muted hover:text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink transition-colors cursor-pointer"
            >
              Skip for now →
            </button>
          </div>
        </div>
      )}

      {/* Step 1, persona (personalises the whole guide) */}
      {step === 1 && (
        <div>
          <h3 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-2">
            Which best describes you?
          </h3>
          <p className="text-sm text-ink-muted mb-5">
            The playbook changes with the buyer. We&rsquo;ll point you at the
            chapters that fit.
          </p>
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${isAdvancing ? "pointer-events-none" : ""}`}>
            {PERSONAS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  markStart();
                  setPersona(opt.id);
                  advanceTo(2);
                }}
                className={optionClass(persona === opt.id)}
              >
                <p className="text-sm font-semibold mb-1">{opt.label}</p>
                <p className={`text-xs ${persona === opt.id ? "text-white/78" : "text-ink-subtle"}`}>{opt.sub}</p>
                {confirmCheck(persona === opt.id)}
              </button>
            ))}
          </div>
          {backButton(0)}
        </div>
      )}

      {/* Step 2, property type */}
      {step === 2 && (
        <div>
          <h3 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-6">
            What are you hoping to buy{suburbLabel ? ` in ${suburbLabel}` : ""}?
          </h3>
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${isAdvancing ? "pointer-events-none" : ""}`}>
            {PROPERTY_TYPES.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setPropertyType(opt.id);
                  advanceTo(3);
                }}
                className={optionClass(propertyType === opt.id)}
              >
                <p className="text-sm font-semibold">{opt.label}</p>
                {confirmCheck(propertyType === opt.id)}
              </button>
            ))}
          </div>
          {backButton(1)}
        </div>
      )}

      {/* Step 3, budget */}
      {step === 3 && (
        <div>
          <h3 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-2">
            Roughly what budget?
          </h3>
          <p className="text-sm text-ink-muted mb-5">
            A ballpark is fine. It points you at the right cost benchmarks
            and scheme caps.
          </p>
          <div className={`grid grid-cols-2 gap-2.5 ${isAdvancing ? "pointer-events-none" : ""}`}>
            {BUDGETS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => {
                  setBudget(b);
                  advanceTo(4);
                }}
                className={optionClass(budget === b)}
              >
                <p className="text-sm font-semibold">{b}</p>
                {confirmCheck(budget === b)}
              </button>
            ))}
          </div>
          {backButton(2)}
        </div>
      )}

      {/* Step 4, timeframe */}
      {step === 4 && (
        <div>
          <h3 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-6">
            When are you hoping to buy?
          </h3>
          <div className={`flex flex-col gap-2.5 ${isAdvancing ? "pointer-events-none" : ""}`}>
            {TIMEFRAMES.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setTimeframe(opt.id);
                  advanceTo(5);
                }}
                className={`relative flex items-center justify-between rounded-xl border px-5 py-3.5 transition-all duration-200 cursor-pointer press active:translate-y-0 ${
                  timeframe === opt.id
                    ? "bg-ink text-white border-ink"
                    : "bg-surface-raised text-ink border-line hover:border-line-strong hover:-translate-y-0.5 hover:shadow-md"
                }${timeframe === opt.id && isAdvancing ? " opt-confirm" : ""}`}
              >
                <div className="text-left">
                  <p className="text-sm font-semibold">{opt.label}</p>
                  <p className={`text-xs ${timeframe === opt.id ? "text-white/78" : "text-ink-subtle"}`}>{opt.sub}</p>
                </div>
                <ArrowRight className={`w-4 h-4 shrink-0 ${timeframe === opt.id ? "text-white/70" : "text-ink-subtle"}`} />
                {confirmCheck(timeframe === opt.id)}
              </button>
            ))}
          </div>
          {backButton(3)}
        </div>
      )}

      {/* Step 5, finance status (the buyer-readiness question) */}
      {step === 5 && (
        <div>
          <h3 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-2">
            Where&rsquo;s your finance up to?
          </h3>
          <p className="text-sm text-ink-muted mb-5">
            No wrong answer. It changes which chapter you should read first.
          </p>
          <div className={`flex flex-col gap-2.5 ${isAdvancing ? "pointer-events-none" : ""}`}>
            {FINANCE_STATUSES.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setFinance(opt.id);
                  advanceTo(6);
                }}
                className={`relative flex items-center justify-between rounded-xl border px-5 py-3.5 transition-all duration-200 cursor-pointer press active:translate-y-0 ${
                  finance === opt.id
                    ? "bg-ink text-white border-ink"
                    : "bg-surface-raised text-ink border-line hover:border-line-strong hover:-translate-y-0.5 hover:shadow-md"
                }${finance === opt.id && isAdvancing ? " opt-confirm" : ""}`}
              >
                <div className="text-left">
                  <p className="text-sm font-semibold">{opt.label}</p>
                  <p className={`text-xs ${finance === opt.id ? "text-white/78" : "text-ink-subtle"}`}>{opt.sub}</p>
                </div>
                <ArrowRight className={`w-4 h-4 shrink-0 ${finance === opt.id ? "text-white/70" : "text-ink-subtle"}`} />
                {confirmCheck(finance === opt.id)}
              </button>
            ))}
          </div>
          {backButton(4)}
        </div>
      )}

      {/* Step 6, contact (PII last) */}
      {step === 6 && (
        <div>
          <p className="rise text-[11px] uppercase tracking-[0.18em] text-cta font-medium mb-3">
            Your guide is ready
          </p>
          <h3 className="rise rise-d1 font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-3">
            Where should we send it?
          </h3>
          <form onSubmit={onSubmitContact} className="rise rise-d2 space-y-3">
            {/* Honeypot: visually hidden, off-screen, aria-hidden. */}
            <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }}>
              <label htmlFor="buying-guide-website">Website</label>
              <input
                id="buying-guide-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="First name"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full min-w-0 rounded-lg border border-line bg-surface-raised px-4 py-3 text-sm text-ink placeholder:text-ink-subtle caret-cta focus:border-cta focus:ring-[3px] focus:ring-cta/15 outline-none transition-[border-color,box-shadow] duration-200"
              />
              <input
                type="text"
                required
                placeholder="Last name"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full min-w-0 rounded-lg border border-line bg-surface-raised px-4 py-3 text-sm text-ink placeholder:text-ink-subtle caret-cta focus:border-cta focus:ring-[3px] focus:ring-cta/15 outline-none transition-[border-color,box-shadow] duration-200"
              />
            </div>
            <input
              type="email"
              required
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-line bg-surface-raised px-4 py-3 text-sm text-ink placeholder:text-ink-subtle caret-cta focus:border-cta focus:ring-[3px] focus:ring-cta/15 outline-none transition-[border-color,box-shadow] duration-200"
            />

            {error && <p className="text-sm text-danger">{error}</p>}

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3.5 text-sm transition-colors cursor-pointer press"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>

            {collectionStatement}
          </form>
          {backButton(5)}
        </div>
      )}

      {/* Step 7, mobile. Its own step, after the email is saved, so a
          visitor who won't give a number is still a (partial) lead. */}
      {step === 7 && (
        <div>
          <p className="rise text-[11px] uppercase tracking-[0.18em] text-cta font-medium mb-3">
            Last step
          </p>
          <h3 className="rise rise-d1 font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-3">
            What&rsquo;s your mobile?
          </h3>
          <form onSubmit={onSubmitMobile} className="rise rise-d2 space-y-3">
            <div>
              <input
                type="tel"
                required
                placeholder="Mobile"
                autoComplete="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (phoneError) setPhoneError(null);
                }}
                onBlur={promote}
                aria-invalid={phoneError ? true : undefined}
                className={`w-full rounded-lg border bg-surface-raised px-4 py-3 text-sm text-ink placeholder:text-ink-subtle caret-cta focus:ring-[3px] outline-none transition-[border-color,box-shadow] duration-200 ${
                  phoneError
                    ? "border-danger focus:border-danger focus:ring-danger/15"
                    : "border-line focus:border-cta focus:ring-cta/15"
                }`}
              />
              {phoneError ? (
                <p className="mt-1.5 text-xs text-danger">{phoneError}</p>
              ) : timeframe === "0-3-months" ? (
                <p className="mt-1.5 text-[11px] text-ink-subtle leading-relaxed">
                  So we can call to help plan your next steps — buying help
                  only, never selling agents.
                </p>
              ) : null}
            </div>

            {error && <p className="text-sm text-danger">{error}</p>}

            <button
              type="submit"
              disabled={submitting || submitted}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3.5 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer press"
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
                  Get my free guide
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {collectionStatement}
          </form>
          {backButton(6)}
        </div>
      )}

      </div>

      {/* Persistent answer recap under the active question, light-touch
          reassurance that their inputs are shaping the guide. */}
      {step > 0 && step < 6 && (suburbLabel || persona) && (
        <p className="mt-6 pt-4 border-t border-line text-[11px] text-ink-subtle leading-relaxed">
          {[
            suburbLabel,
            persona && PERSONAS.find((x) => x.id === persona)?.label,
            propertyType && PROPERTY_TYPES.find((x) => x.id === propertyType)?.label,
            budget,
            timeframe && timeframeLabel(timeframe),
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      )}
    </div>
  );
}
