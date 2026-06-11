"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { SuburbAutocomplete, slugToSuburbLabel } from "@/components/search/SuburbAutocomplete";
import { clarityEvent, clarityTag } from "@/lib/clarity";

// ----- Option sets ---------------------------------------------------------
// Question order is fixed by conversion research, lowest-friction first,
// contact details last. Timeframe is the money question; agent status is
// the kill/branch question (already-listed vendors get the guide but are
// never passed to agents).

type PropertyType = "house" | "townhouse" | "unit" | "land" | "acreage";
type Bedrooms = "1" | "2" | "3" | "4" | "5+";
type Timeframe = "0-3-months" | "3-6-months" | "6-12-months" | "12-plus-months" | "researching";
type AgentStatus = "comparing" | "not-started" | "already-listed";

const PROPERTY_TYPES: { id: PropertyType; label: string }[] = [
  { id: "house",     label: "House" },
  { id: "townhouse", label: "Townhouse" },
  { id: "unit",      label: "Unit or apartment" },
  { id: "land",      label: "Land" },
  { id: "acreage",   label: "Acreage or rural" },
];

const BEDROOMS: Bedrooms[] = ["1", "2", "3", "4", "5+"];

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

const MOTIVATIONS: string[] = [
  "Upsizing",
  "Downsizing",
  "Relocating",
  "Selling an investment",
  "Estate or separation",
  "Something else",
];

const PRICE_BRACKETS: string[] = [
  "Under $500k",
  "$500k to $750k",
  "$750k to $1m",
  "$1m to $1.5m",
  "$1.5m to $2m",
  "Over $2m",
  "Not sure",
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
 * The selling-guide qualification funnel. Eight single-question screens,
 * one tap each, contact details last. Every question is framed as
 * personalising the guide, which is what keeps top-of-funnel conversion
 * up versus a bare "compare agents" form.
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
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null);
  const [bedrooms, setBedrooms] = useState<Bedrooms | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe | null>(null);
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null);
  const [motivation, setMotivation] = useState<string | null>(null);
  const [priceExpectation, setPriceExpectation] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot, must stay empty

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const markStart = () => {
    if (hasStarted) return;
    setHasStarted(true);
    clarityEvent("form_start");
    clarityTag("form_name", "selling-guide");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!timeframe || !agentStatus) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "guide-download",
          firstName: firstName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          suburb: suburbSlug ?? undefined,
          propertyType: propertyType ?? undefined,
          bedrooms: bedrooms ?? undefined,
          sellingTimeframe: timeframe,
          agentStatus,
          motivation: motivation ?? undefined,
          priceExpectation: priceExpectation ?? undefined,
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
      clarityTag("guide_timeframe", timeframe);
      clarityTag("guide_agent_status", agentStatus);
      if (suburbSlug) clarityTag("guide_suburb", suburbSlug);
      const qs = new URLSearchParams({ score: displayScore(timeframe, agentStatus) });
      if (suburbSlug) qs.set("suburb", suburbSlug);
      router.push(`/selling-guide/thanks?${qs.toString()}`);
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
    `text-left rounded-xl border px-4 py-3.5 transition-all duration-200 cursor-pointer active:scale-[0.985] active:translate-y-0 ${
      active
        ? "bg-ink text-white border-ink"
        : "bg-surface-raised text-ink border-line hover:border-line-strong hover:-translate-y-0.5 hover:shadow-md"
    }`;

  const backButton = (to: number) => (
    <button
      type="button"
      onClick={() => setStep(to)}
      className="mt-4 inline-flex items-center gap-1.5 text-xs text-ink-subtle hover:text-ink transition-colors cursor-pointer"
    >
      <ArrowLeft className="w-3.5 h-3.5" /> Back
    </button>
  );

  // The collection statement adapts to the branch. Already-listed vendors
  // are never passed to agents, and the statement says so. Everyone else
  // sees the agent-sharing disclosure stated plainly at the point of
  // collection (APP 5 / APP 7.3).
  const sharesWithAgents = agentStatus !== "already-listed";

  return (
    <div className="bg-surface-warm text-ink rounded-2xl p-6 sm:p-8 shadow-2xl border border-line border-t-[3px] border-t-cta">
      {/* Progress. Hidden on the opening question (a bar on screen one
          costs conversions); from step 2 it shows already-earned progress. */}
      {step > 0 && (
        <div className="flex items-center gap-2 mb-7">
          {Array.from({ length: stepTotal }, (_, i) => (
            <div
              key={i}
              className="flex-1 h-[3px] rounded-full transition-all duration-500"
              style={{ background: i <= stepIndex ? "var(--cta)" : "var(--line)" }}
            />
          ))}
          <p className="ml-2 text-[11px] font-medium uppercase tracking-wider text-ink-subtle whitespace-nowrap">
            {Math.min(step + 1, stepTotal)} / {stepTotal}
          </p>
        </div>
      )}

      {/* Keyed wrapper: remounts on every step change so each question
          rises in (see .step-in in globals.css). */}
      <div key={step} className="step-in">

      {/* Step 0, suburb */}
      {step === 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-cta font-medium mb-3">
            Free guide · Takes about 60 seconds
          </p>
          <h3 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-2">
            Where&rsquo;s the property?
          </h3>
          <p className="text-sm text-ink-muted mb-5">
            We&rsquo;ll match the guide to your market: prices, agent fees and
            selling conditions are different in every suburb.
          </p>
          <SuburbAutocomplete
            placeholder="Suburb or postcode, e.g. Burpengary or 4505"
            onSelectLocation={(slug, label) => {
              markStart();
              setSuburbSlug(slug);
              setSuburbLabel(label);
              setStep(1);
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
                setStep(1);
              }}
              className="text-xs text-ink-muted hover:text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink transition-colors cursor-pointer"
            >
              Skip for now →
            </button>
          </div>
        </div>
      )}

      {/* Step 1, property type */}
      {step === 1 && (
        <div>
          <h3 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-6">
            What type of property{suburbLabel ? ` in ${suburbLabel}` : ""}?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PROPERTY_TYPES.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  markStart();
                  setPropertyType(opt.id);
                  setStep(2);
                }}
                className={optionClass(propertyType === opt.id)}
              >
                <p className="text-sm font-semibold">{opt.label}</p>
              </button>
            ))}
          </div>
          {backButton(0)}
        </div>
      )}

      {/* Step 2, bedrooms */}
      {step === 2 && (
        <div>
          <h3 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-6">
            How many bedrooms?
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {BEDROOMS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => {
                  setBedrooms(b);
                  setStep(3);
                }}
                className={`rounded-xl border py-4 text-center text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-[0.97] ${
                  bedrooms === b
                    ? "bg-ink text-white border-ink"
                    : "bg-surface-raised text-ink border-line hover:border-line-strong hover:-translate-y-0.5 hover:shadow-md"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
          {backButton(1)}
        </div>
      )}

      {/* Step 3, timeframe (the money question) */}
      {step === 3 && (
        <div>
          <h3 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-6">
            When are you thinking of selling?
          </h3>
          <div className="flex flex-col gap-2.5">
            {TIMEFRAMES.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setTimeframe(opt.id);
                  setStep(4);
                }}
                className={`flex items-center justify-between rounded-xl border px-5 py-3.5 transition-all duration-200 cursor-pointer active:scale-[0.985] active:translate-y-0 ${
                  timeframe === opt.id
                    ? "bg-ink text-white border-ink"
                    : "bg-surface-raised text-ink border-line hover:border-line-strong hover:-translate-y-0.5 hover:shadow-md"
                }`}
              >
                <div className="text-left">
                  <p className="text-sm font-semibold">{opt.label}</p>
                  <p className={`text-xs ${timeframe === opt.id ? "text-white/78" : "text-ink-subtle"}`}>
                    {opt.sub}
                  </p>
                </div>
                <ArrowRight className={`w-4 h-4 shrink-0 ${timeframe === opt.id ? "text-white/70" : "text-ink-subtle"}`} />
              </button>
            ))}
          </div>
          {backButton(2)}
        </div>
      )}

      {/* Step 4, agent status (kill / branch question) */}
      {step === 4 && (
        <div>
          <h3 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-2">
            Where are you up to with agents?
          </h3>
          <p className="text-sm text-ink-muted mb-5">
            No wrong answer. It changes which chapters we point you to first.
          </p>
          <div className="flex flex-col gap-2.5">
            {AGENT_STATUSES.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setAgentStatus(opt.id);
                  setStep(5);
                }}
                className={`flex items-center justify-between rounded-xl border px-5 py-3.5 transition-all duration-200 cursor-pointer active:scale-[0.985] active:translate-y-0 ${
                  agentStatus === opt.id
                    ? "bg-ink text-white border-ink"
                    : "bg-surface-raised text-ink border-line hover:border-line-strong hover:-translate-y-0.5 hover:shadow-md"
                }`}
              >
                <div className="text-left">
                  <p className="text-sm font-semibold">{opt.label}</p>
                  <p className={`text-xs ${agentStatus === opt.id ? "text-white/78" : "text-ink-subtle"}`}>
                    {opt.sub}
                  </p>
                </div>
                <ArrowRight className={`w-4 h-4 shrink-0 ${agentStatus === opt.id ? "text-white/70" : "text-ink-subtle"}`} />
              </button>
            ))}
          </div>
          {backButton(3)}
        </div>
      )}

      {/* Step 5, motivation (optional) */}
      {step === 5 && (
        <div>
          <h3 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-6">
            What&rsquo;s prompting the move?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MOTIVATIONS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMotivation(m);
                  setStep(6);
                }}
                className={optionClass(motivation === m)}
              >
                <p className="text-sm font-semibold">{m}</p>
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            {backButton(4)}
            <button
              type="button"
              onClick={() => {
                setMotivation(null);
                setStep(6);
              }}
              className="mt-4 text-xs text-ink-muted hover:text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink transition-colors cursor-pointer"
            >
              Skip →
            </button>
          </div>
        </div>
      )}

      {/* Step 6, price expectation (optional) */}
      {step === 6 && (
        <div>
          <h3 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-2">
            Roughly what&rsquo;s it worth?
          </h3>
          <p className="text-sm text-ink-muted mb-5">
            A ballpark is fine. It helps us point you at the right fee and
            cost benchmarks.
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {PRICE_BRACKETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setPriceExpectation(p);
                  setStep(7);
                }}
                className={optionClass(priceExpectation === p)}
              >
                <p className="text-sm font-semibold">{p}</p>
              </button>
            ))}
          </div>
          {backButton(5)}
        </div>
      )}

      {/* Step 7, contact (PII last) */}
      {step === 7 && (
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-cta font-medium mb-3">
            Your guide is ready
          </p>
          <h3 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-3">
            Where should we send it?
          </h3>
          <form onSubmit={onSubmit} className="space-y-3">
            {/* Honeypot: visually hidden, off-screen, aria-hidden. */}
            <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }}>
              <label htmlFor="guide-website">Website</label>
              <input
                id="guide-website"
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
            <div>
              <input
                type="tel"
                placeholder="Mobile (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-line bg-surface-raised px-4 py-3 text-sm text-ink placeholder:text-ink-subtle focus:border-cta focus:ring-2 focus:ring-cta/20 outline-none transition-colors"
              />
              {sharesWithAgents && timeframe === "0-3-months" && (
                <p className="mt-1.5 text-[11px] text-ink-subtle leading-relaxed">
                  Add your mobile if you&rsquo;d like a free appraisal callback
                  from a top local agent.
                </p>
              )}
            </div>

            <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-line accent-[var(--cta)] cursor-pointer"
              />
              <span className="text-xs text-ink-muted leading-relaxed">
                Email me selling tips and market updates for my suburb.
                Unsubscribe anytime.
              </span>
            </label>

            {error && <p className="text-sm text-danger">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3.5 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? "Sending…" : "Get my free guide"}
              {!submitting && <ArrowRight className="w-4 h-4" />}
            </button>

            {/* Collection statement. The agent-sharing disclosure sits at
                the point of collection, in plain English, not buried in
                the privacy policy. Already-listed vendors get the
                no-sharing version. */}
            <p className="text-[11px] text-ink-subtle leading-relaxed pt-1">
              {sharesWithAgents ? (
                <>
                  By requesting the guide you agree we may share your details
                  with up to three top local agents, who may contact you about
                  selling your property. We never sell your data to anyone
                  else.{" "}
                </>
              ) : (
                <>
                  We&rsquo;ll email you the guide. Since you&rsquo;re already
                  listed, we won&rsquo;t pass your details to any agent.{" "}
                </>
              )}
              Read our{" "}
              <a href="/privacy" className="underline underline-offset-2 hover:text-ink">
                privacy policy
              </a>
              .
            </p>
          </form>
          {backButton(6)}
        </div>
      )}

      </div>

      {/* Persistent answer recap under the active question, light-touch
          reassurance that their inputs are shaping the guide. */}
      {step > 0 && step < 7 && (suburbLabel || timeframe) && (
        <p className="mt-6 pt-4 border-t border-line text-[11px] text-ink-subtle leading-relaxed">
          {[
            suburbLabel,
            propertyType && PROPERTY_TYPES.find((p) => p.id === propertyType)?.label,
            bedrooms && `${bedrooms} bed`,
            timeframe && timeframeLabel(timeframe),
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      )}
    </div>
  );
}
