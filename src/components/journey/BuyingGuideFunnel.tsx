"use client";

import { useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { SuburbAutocomplete, slugToSuburbLabel } from "@/components/search/SuburbAutocomplete";
import { clarityEvent, clarityTag } from "@/lib/clarity";

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
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot, must stay empty

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!timeframe || !persona) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "guide-download",
          guideType: "buying",
          firstName: firstName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          suburb: suburbSlug ?? undefined,
          propertyType: propertyType ?? undefined,
          sellingTimeframe: timeframe,
          buyerPersona: persona,
          financeStatus: finance ?? undefined,
          budget: budget ?? undefined,
          marketingConsent,
          source,
          website,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Submit failed");
      }
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

  const stepTotal = 7;
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
          <form onSubmit={onSubmit} className="rise rise-d2 space-y-3">
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
            <input
              type="text"
              required
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-lg border border-line bg-surface-raised px-4 py-3 text-sm text-ink placeholder:text-ink-subtle caret-cta focus:border-cta focus:ring-[3px] focus:ring-cta/15 outline-none transition-[border-color,box-shadow] duration-200"
            />
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-line bg-surface-raised px-4 py-3 text-sm text-ink placeholder:text-ink-subtle caret-cta focus:border-cta focus:ring-[3px] focus:ring-cta/15 outline-none transition-[border-color,box-shadow] duration-200"
            />
            <input
              type="tel"
              placeholder="Mobile (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-line bg-surface-raised px-4 py-3 text-sm text-ink placeholder:text-ink-subtle caret-cta focus:border-cta focus:ring-[3px] focus:ring-cta/15 outline-none transition-[border-color,box-shadow] duration-200"
            />

            <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-line accent-[var(--cta)] cursor-pointer"
              />
              <span className="text-xs text-ink-muted leading-relaxed">
                Email me buying tips and market updates for my suburb.
                Unsubscribe anytime.
              </span>
            </label>

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

            <p className="text-[11px] text-ink-subtle leading-relaxed pt-1">
              We&rsquo;ll email you the guide. Your details are never sold and
              never passed to selling agents. Read our{" "}
              <a href="/privacy" className="underline underline-offset-2 hover:text-ink">
                privacy policy
              </a>
              .
            </p>
          </form>
          {backButton(5)}
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
