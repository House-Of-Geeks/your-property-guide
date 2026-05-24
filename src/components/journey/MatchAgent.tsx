"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { SuburbAutocomplete, slugToSuburbLabel } from "@/components/search/SuburbAutocomplete";
import { clarityEvent, clarityTag } from "@/lib/clarity";

type Intent =
  | "buying"
  | "selling"
  | "investing"
  | "refinancing"
  | "something-else"
  | "researching";
type Timeframe = "looking" | "soon" | "now";

interface IntentOption {
  id: Intent;
  label: string;
  sub: string;
}

interface TimeframeOption {
  id: Timeframe;
  label: string;
  sub: string;
}

// Broad intent set, property situations are messier than buy/sell/invest.
// "Something else" exists so people in unique situations (divorce, inheritance,
// estate, downsizing, planning ahead) feel covered. The right "person" we
// match them with depends on the intent, could be a buyer's agent, a
// listing agent, a broker, a property accountant, or a conveyancer.
const INTENTS: IntentOption[] = [
  { id: "buying",         label: "Buying",         sub: "First or next home" },
  { id: "selling",        label: "Selling",        sub: "Get an appraisal or plan" },
  { id: "investing",      label: "Investing",      sub: "Build or expand a portfolio" },
  { id: "refinancing",    label: "Refinancing",    sub: "Lower my rate or restructure" },
  { id: "something-else", label: "Something else", sub: "Inheritance, divorce, downsizing, planning" },
  { id: "researching",    label: "Just researching", sub: "Understanding the market" },
];

const TIMEFRAMES: TimeframeOption[] = [
  { id: "looking", label: "Just looking",    sub: "No deadline yet" },
  { id: "soon",    label: "Within 3 months", sub: "Ready to take action" },
  { id: "now",     label: "Right now",       sub: "I have a deadline" },
];

const labelForIntent = (id: Intent) => INTENTS.find((i) => i.id === id)?.label ?? "";
const labelForTimeframe = (id: Timeframe) => TIMEFRAMES.find((t) => t.id === id)?.label ?? "";

const isIntent = (v: string | null): v is Intent =>
  v !== null && INTENTS.some((opt) => opt.id === v);

/**
 * MatchAgent, homepage lead engine.
 * Three single-question screens (intent / suburb / timeframe) → compact contact form.
 * Mirrors the conversion pattern that's working on Your Finance Guide.
 *
 * Pre-fills via URL params so suburb pages and other entry points can deep-link:
 *   /?suburb={slug}#match           → suburb pre-filled, ask intent first
 *   /?intent={id}#match             → intent pre-filled, ask suburb next
 *   /?suburb={slug}&intent={id}#match → both pre-filled, jump to timeframe
 *
 * Because this component reads useSearchParams, the page that hosts it must
 * wrap it in <Suspense> (the homepage already does this, see app/(marketing)/page.tsx).
 *
 * Props override URL params, useful when rendering the form inside a drawer
 * (StickyMatchCTA on suburb/property pages) where the page's URL doesn't
 * carry the suburb/intent.
 */
interface MatchAgentProps {
  initialSuburbSlug?: string | null;
  initialIntent?: Intent | null;
  /** Hide the marketing pitch column, useful inside a drawer. */
  compact?: boolean;
  /** Override the source string sent to /api/leads (for attribution). */
  source?: string;
}

export function MatchAgent({
  initialSuburbSlug: propSuburbSlug,
  initialIntent: propIntent,
  compact = false,
  source = "homepage-match",
}: MatchAgentProps = {}) {
  const params = useSearchParams();
  const router = useRouter();

  // Pre-fill: props win over URL params. Slug is enough to derive a label.
  const initialSuburbSlug = propSuburbSlug ?? params.get("suburb");
  const initialSuburbLabel = initialSuburbSlug ? slugToSuburbLabel(initialSuburbSlug) : null;
  const urlIntent = params.get("intent");
  const initialIntent: Intent | null =
    propIntent ?? (isIntent(urlIntent) ? urlIntent : null);

  // Skip steps that are already filled. With suburb+intent pre-set we land
  // straight on the timeframe question; with one set we skip just that step.
  const initialStep =
    initialIntent && initialSuburbSlug ? 2 : initialIntent ? 1 : 0;

  const [step, setStep] = useState(initialStep);
  const [intent, setIntent] = useState<Intent | null>(initialIntent);
  const [suburbSlug, setSuburbSlug] = useState<string | null>(initialSuburbSlug);
  const [suburbLabel, setSuburbLabel] = useState<string | null>(initialSuburbLabel);
  const [timeframe, setTimeframe] = useState<Timeframe | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState(""); // honeypot, must stay empty

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  // Mark the funnel as started on first step transition out of the intent
  // chooser. Lets us measure "saw the form" vs "engaged with it" gap.
  const markStart = () => {
    if (hasStarted) return;
    setHasStarted(true);
    clarityEvent("form_start");
    clarityTag("form_name", "match-agent");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intent || !timeframe) return;
    setError(null);
    setSubmitting(true);
    try {
      const message = [
        `Intent: ${labelForIntent(intent)}`,
        `Suburb: ${suburbLabel ?? "Not specified"}`,
        `Timeframe: ${labelForTimeframe(timeframe)}`,
      ].join(" · ");

      const trimmedLast = lastName.trim();
      const trimmedPhone = phone.trim();
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "match-request",
          firstName: firstName.trim(),
          lastName: trimmedLast || undefined,
          email: email.trim(),
          phone: trimmedPhone || undefined,
          message,
          suburb: suburbSlug ?? undefined,
          source,
          website,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Submit failed");
      }
      clarityEvent("match_request_submitted");
      clarityTag("match_intent", intent);
      clarityTag("match_timeframe", timeframe);
      if (suburbSlug) clarityTag("match_suburb", suburbSlug);
      // Hand off to the thank-you page. The ConversionTracker there fires
      // the canonical `lead_conversion` event for this funnel.
      const qs = new URLSearchParams({ intent });
      if (suburbSlug) qs.set("suburb", suburbSlug);
      router.push(`/get-connected/thanks?${qs.toString()}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const stepTotal = 4;
  const stepIndex = Math.min(step, stepTotal - 1);

  return (
    <section
      id="match"
      className={compact ? "" : "bg-surface-inverse text-white scroll-mt-24"}
    >
      <div className={compact ? "" : "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28"}>
        <div className={compact ? "" : "grid lg:grid-cols-12 gap-10 lg:gap-16 items-start"}>
          {/* Left, pitch (hidden in compact/drawer mode) */}
          {!compact && (
          <div className="lg:col-span-5">
            {/* Magazine masthead in dark mode */}
            <div className="flex items-center gap-4 mb-10">
              <span className="font-display italic text-cta text-base sm:text-lg leading-none">
                When you&rsquo;re ready
              </span>
              <span className="w-12 h-px bg-white/20" aria-hidden="true" />
              <span className="text-[11px] uppercase tracking-[0.32em] text-white/60 font-sans font-medium">
                The match
              </span>
            </div>
            <h2 className="font-display text-white leading-[0.98] tracking-tight text-5xl sm:text-6xl lg:text-7xl mb-8 font-medium">
              Tell us your situation.{" "}
              <span className="italic font-light text-cta">We&rsquo;ll find</span>{" "}
              the right person.
            </h2>
            <p className="font-display font-light text-xl sm:text-2xl text-white/80 leading-snug max-w-md mb-12">
              Three quick questions. We&rsquo;ll point you to one specialist
              who fits your situation, whether that&rsquo;s an agent, broker,
              property accountant or conveyancer.
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-6 max-w-md">
              {[
                ["01", "You answer 3 quick questions"],
                ["02", "We pick the best-fit specialist"],
                ["03", "They reach out within 24 hours"],
                ["04", "You decide whether to proceed"],
              ].map(([n, t]) => (
                <div key={n} className="border-t border-white/15 pt-4">
                  <p className="font-display italic text-cta text-base mb-1.5 tabular-nums">{n}</p>
                  <p className="text-sm text-white/85 leading-snug">{t}</p>
                </div>
              ))}
            </div>
          </div>
          )}

          {/* Right, form panel */}
          <div className={compact ? "" : "lg:col-span-7 lg:col-start-6"}>
            <div className={compact ? "text-ink" : "bg-surface-warm text-ink rounded-2xl p-8 sm:p-10 shadow-2xl"}>
              {/* Progress bar */}
              <div className="flex items-center gap-2 mb-8">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex-1 h-[3px] rounded-full transition-colors duration-300"
                    style={{
                      background: i <= stepIndex ? "var(--cta)" : "var(--line)",
                    }}
                  />
                ))}
                <p className="ml-2 text-[11px] font-medium uppercase tracking-wider text-ink-subtle whitespace-nowrap">
                  {Math.min(step + 1, stepTotal)} / {stepTotal}
                </p>
              </div>

              {/* Step 0, Intent */}
              {step === 0 && (
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-6">
                    What&rsquo;s your situation?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {INTENTS.map((opt) => {
                      const active = intent === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            markStart();
                            setIntent(opt.id);
                            // If suburb is already pre-filled (deep-link from a
                            // suburb page), skip the suburb step.
                            setStep(suburbSlug ? 2 : 1);
                          }}
                          className={`text-left rounded-xl border px-4 py-4 transition-all cursor-pointer ${
                            active
                              ? "bg-ink text-white border-ink"
                              : "bg-surface-raised text-ink border-line hover:border-line-strong"
                          }`}
                        >
                          <p className="text-sm font-semibold mb-1">{opt.label}</p>
                          <p className={`text-xs ${active ? "text-white/65" : "text-ink-subtle"}`}>
                            {opt.sub}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 1, Suburb */}
              {step === 1 && (
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-2">
                    Which suburb?
                  </h3>
                  <p className="text-sm text-ink-muted mb-5">
                    Pick the suburb you&rsquo;re focused on, or skip if you&rsquo;re still narrowing it down.
                  </p>
                  <SuburbAutocomplete
                    placeholder="e.g. Burpengary, 4505, North Lakes"
                    onSelectLocation={(slug, label) => {
                      setSuburbSlug(slug);
                      setSuburbLabel(label);
                      setStep(2);
                    }}
                    onClear={() => {
                      setSuburbSlug(null);
                      setSuburbLabel(null);
                    }}
                  />
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={() => setStep(0)}
                      className="inline-flex items-center gap-1.5 text-xs text-ink-subtle hover:text-ink transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <button
                      onClick={() => {
                        setSuburbSlug(null);
                        setSuburbLabel("Not sure yet");
                        setStep(2);
                      }}
                      className="text-xs text-ink-muted hover:text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink transition-colors cursor-pointer"
                    >
                      Skip, not sure yet →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2, Timeframe */}
              {step === 2 && (
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-6">
                    What&rsquo;s the timing?
                  </h3>
                  <div className="flex flex-col gap-3">
                    {TIMEFRAMES.map((opt) => {
                      const active = timeframe === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setTimeframe(opt.id);
                            setStep(3);
                          }}
                          className={`flex items-center justify-between rounded-xl border px-5 py-4 transition-all cursor-pointer ${
                            active
                              ? "bg-ink text-white border-ink"
                              : "bg-surface-raised text-ink border-line hover:border-line-strong"
                          }`}
                        >
                          <div className="text-left">
                            <p className="text-sm font-semibold mb-1">{opt.label}</p>
                            <p className={`text-xs ${active ? "text-white/65" : "text-ink-subtle"}`}>
                              {opt.sub}
                            </p>
                          </div>
                          <ArrowRight className={`w-4 h-4 ${active ? "text-white/70" : "text-ink-subtle"}`} />
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs text-ink-subtle hover:text-ink transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                </div>
              )}

              {/* Step 3, Contact */}
              {step === 3 && (
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-cta font-medium mb-3">
                    We&rsquo;ve got the right person for you
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-3">
                    Pop your details in and we&rsquo;ll make the introduction.
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed mb-5">
                    You&rsquo;ll get an email confirmation with their profile before they reach out.
                    No commitment, no comparison spam.
                  </p>
                  <form onSubmit={onSubmit} className="space-y-3">
                    {/* Honeypot: visually hidden, off-screen, aria-hidden. */}
                    <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }}>
                      <label htmlFor="match-website">Website</label>
                      <input
                        id="match-website"
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
                      className="w-full rounded-lg border border-line bg-surface-raised px-4 py-3 text-sm text-ink placeholder:text-ink-subtle focus:border-cta focus:ring-2 focus:ring-cta/20 outline-none transition-colors"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-line bg-surface-raised px-4 py-3 text-sm text-ink placeholder:text-ink-subtle focus:border-cta focus:ring-2 focus:ring-cta/20 outline-none transition-colors"
                    />
                    <input
                      type="tel"
                      placeholder="Mobile (optional)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg border border-line bg-surface-raised px-4 py-3 text-sm text-ink placeholder:text-ink-subtle focus:border-cta focus:ring-2 focus:ring-cta/20 outline-none transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="Last name (optional)"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-lg border border-line bg-surface-raised px-4 py-3 text-sm text-ink placeholder:text-ink-subtle focus:border-cta focus:ring-2 focus:ring-cta/20 outline-none transition-colors"
                    />
                    {error && (
                      <p className="text-sm text-danger">{error}</p>
                    )}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3.5 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {submitting ? "Sending…" : "Send my introduction"}
                      {!submitting && <ArrowRight className="w-4 h-4" />}
                    </button>
                    <p className="text-[11px] text-ink-subtle leading-relaxed pt-1">
                      Free, no commitment. We&rsquo;ll never sell your details. Read our{" "}
                      <a href="/privacy" className="underline underline-offset-2 hover:text-ink">privacy policy</a>.
                    </p>
                  </form>
                  <button
                    onClick={() => setStep(2)}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs text-ink-subtle hover:text-ink transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
