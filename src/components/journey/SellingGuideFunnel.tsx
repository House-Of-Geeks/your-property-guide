"use client";

import { useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { SuburbAutocomplete, slugToSuburbLabel } from "@/components/search/SuburbAutocomplete";
import { clarityEvent, clarityTag } from "@/lib/clarity";
import { isValidPhone, PHONE_ERROR } from "@/lib/utils/phone";

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
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [website, setWebsite] = useState(""); // honeypot, must stay empty
  // The partial lead step 7 saved (id from the API) and the name + email
  // it was saved with, so going back and continuing unchanged reuses it.
  const [partial, setPartial] = useState<{ id: string | null; key: string } | null>(null);

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

  // Everything the API needs except the mobile. Sent twice: from the
  // contact step (saves a partial lead) and again with the mobile and the
  // partial's id (completes it; only then is the guide emailed).
  const leadPayload = () => ({
    type: "guide-download",
    firstName: firstName.trim(),
    lastName: lastName.trim() || undefined,
    email: email.trim(),
    suburb: suburbSlug ?? undefined,
    propertyType: propertyType ?? undefined,
    bedrooms: bedrooms ?? undefined,
    sellingTimeframe: timeframe,
    agentStatus,
    motivation: motivation ?? undefined,
    priceExpectation: priceExpectation ?? undefined,
    // Requesting the guide is the consent: the statement under the
    // button says we'll email tips and market updates (no checkbox
    // since Oct 2026). ActiveCampaign subscribes on this flag.
    marketingConsent: true,
    source,
    website,
  });

  const postLead = async (body: Record<string, unknown>): Promise<{ id?: string } | null> => {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => null);
      throw new Error(json?.error ?? "Submit failed");
    }
    return res.json().catch(() => null);
  };

  // Step 7, name + email. Saved at once as a partial lead (no mobile, no
  // guide sent yet), so someone who stops at the mobile step is still in
  // the database and ActiveCampaign. A partial is never passed to an
  // agent: agents are only charged for vendor leads with a mobile.
  const onSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!timeframe || !agentStatus) return;
    const key = [firstName.trim(), lastName.trim(), email.trim().toLowerCase()].join("\n");
    if (partial?.key === key) {
      goForward(8);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const saved = await postLead(leadPayload());
      // No id back (only the honeypot path answers without one) just
      // means step 8 creates the lead whole instead of completing it.
      setPartial({ id: saved?.id ?? null, key });
      clarityEvent("guide_email_captured");
      clarityTag("guide_type", "selling");
      goForward(8);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Step 8, the mobile. Completes the partial lead: the server adds the
  // number, emails the guide and sends the team the full lead.
  const onSubmitMobile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!timeframe || !agentStatus) return;
    // `required` stops an empty submit; the number must also be dialable,
    // or the server rejects it and the user only sees a generic error.
    if (!isValidPhone(phone)) {
      setPhoneError(PHONE_ERROR);
      return;
    }
    setPhoneError(null);
    setError(null);
    setSubmitting(true);
    try {
      await postLead({ ...leadPayload(), phone: phone.trim(), partialLeadId: partial?.id ?? undefined });
      clarityEvent("guide_download_submitted");
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
    } finally {
      setSubmitting(false);
    }
  };

  const stepTotal = 9;
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

  // The collection statement adapts to the branch. Already-listed vendors
  // are never passed to agents, and the statement says so. Everyone else
  // sees the agent-sharing disclosure stated plainly at the point of
  // collection (APP 5 / APP 7.3).
  const sharesWithAgents = agentStatus !== "already-listed";

  // Collection statement: the agent-sharing disclosure and the
  // marketing-email consent (there is no checkbox), in plain English at
  // the point of collection, not buried in the privacy policy. Shown on
  // both contact steps, where the email is given and where the mobile
  // is. Already-listed vendors get the no-sharing version.
  const collectionStatement = (
    <p className="text-[11px] text-ink-subtle leading-relaxed pt-1">
      {sharesWithAgents ? (
        <>
          By requesting the guide you agree we may share your details
          with one top local agent, who may contact you about selling
          your property, and that we may email you selling tips and
          market updates for your suburb (unsubscribe anytime). The
          agent pays us for the introduction. You pay nothing. We
          never sell your details to anyone else.{" "}
        </>
      ) : (
        <>
          By requesting the guide you agree we may email it to you,
          plus selling tips and market updates for your suburb
          (unsubscribe anytime). Since you&rsquo;re already listed, we
          won&rsquo;t pass your details to any agent.{" "}
        </>
      )}
      Read our{" "}
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

      {/* Step 1, property type */}
      {step === 1 && (
        <div>
          <h3 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-6">
            What type of property{suburbLabel ? ` in ${suburbLabel}` : ""}?
          </h3>
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${isAdvancing ? "pointer-events-none" : ""}`}>
            {PROPERTY_TYPES.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  markStart();
                  setPropertyType(opt.id);
                  advanceTo(2);
                }}
                className={optionClass(propertyType === opt.id)}
              >
                <p className="text-sm font-semibold">{opt.label}</p>
                {confirmCheck(propertyType === opt.id)}
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
          <div className={`grid grid-cols-5 gap-2 ${isAdvancing ? "pointer-events-none" : ""}`}>
            {BEDROOMS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => {
                  setBedrooms(b);
                  advanceTo(3);
                }}
                className={`relative rounded-xl border py-4 text-center text-sm font-semibold transition-all duration-200 cursor-pointer press ${
                  bedrooms === b
                    ? "bg-ink text-white border-ink"
                    : "bg-surface-raised text-ink border-line hover:border-line-strong hover:-translate-y-0.5 hover:shadow-md"
                }${bedrooms === b && isAdvancing ? " opt-confirm" : ""}`}
              >
                {b}
                {bedrooms === b && isAdvancing && (
                  <Check className="check-pop absolute top-1 right-1 w-3.5 h-3.5" aria-hidden="true" />
                )}
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
          <div className={`flex flex-col gap-2.5 ${isAdvancing ? "pointer-events-none" : ""}`}>
            {TIMEFRAMES.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setTimeframe(opt.id);
                  advanceTo(4);
                }}
                className={`relative flex items-center justify-between rounded-xl border px-5 py-3.5 transition-all duration-200 cursor-pointer press active:translate-y-0 ${
                  timeframe === opt.id
                    ? "bg-ink text-white border-ink"
                    : "bg-surface-raised text-ink border-line hover:border-line-strong hover:-translate-y-0.5 hover:shadow-md"
                }${timeframe === opt.id && isAdvancing ? " opt-confirm" : ""}`}
              >
                <div className="text-left">
                  <p className="text-sm font-semibold">{opt.label}</p>
                  <p className={`text-xs ${timeframe === opt.id ? "text-white/78" : "text-ink-subtle"}`}>
                    {opt.sub}
                  </p>
                </div>
                <ArrowRight className={`w-4 h-4 shrink-0 ${timeframe === opt.id ? "text-white/70" : "text-ink-subtle"}`} />
                {confirmCheck(timeframe === opt.id)}
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
          <div className={`flex flex-col gap-2.5 ${isAdvancing ? "pointer-events-none" : ""}`}>
            {AGENT_STATUSES.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setAgentStatus(opt.id);
                  advanceTo(5);
                }}
                className={`relative flex items-center justify-between rounded-xl border px-5 py-3.5 transition-all duration-200 cursor-pointer press active:translate-y-0 ${
                  agentStatus === opt.id
                    ? "bg-ink text-white border-ink"
                    : "bg-surface-raised text-ink border-line hover:border-line-strong hover:-translate-y-0.5 hover:shadow-md"
                }${agentStatus === opt.id && isAdvancing ? " opt-confirm" : ""}`}
              >
                <div className="text-left">
                  <p className="text-sm font-semibold">{opt.label}</p>
                  <p className={`text-xs ${agentStatus === opt.id ? "text-white/78" : "text-ink-subtle"}`}>
                    {opt.sub}
                  </p>
                </div>
                <ArrowRight className={`w-4 h-4 shrink-0 ${agentStatus === opt.id ? "text-white/70" : "text-ink-subtle"}`} />
                {confirmCheck(agentStatus === opt.id)}
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
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${isAdvancing ? "pointer-events-none" : ""}`}>
            {MOTIVATIONS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMotivation(m);
                  advanceTo(6);
                }}
                className={optionClass(motivation === m)}
              >
                <p className="text-sm font-semibold">{m}</p>
                {confirmCheck(motivation === m)}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            {backButton(4)}
            <button
              type="button"
              onClick={() => {
                setMotivation(null);
                goForward(6);
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
          <div className={`grid grid-cols-2 gap-2.5 ${isAdvancing ? "pointer-events-none" : ""}`}>
            {PRICE_BRACKETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setPriceExpectation(p);
                  advanceTo(7);
                }}
                className={optionClass(priceExpectation === p)}
              >
                <p className="text-sm font-semibold">{p}</p>
                {confirmCheck(priceExpectation === p)}
              </button>
            ))}
          </div>
          {backButton(5)}
        </div>
      )}

      {/* Step 7, contact (PII last) */}
      {step === 7 && (
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
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3.5 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer press"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                  Saving…
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {collectionStatement}
          </form>
          {backButton(6)}
        </div>
      )}

      {/* Step 8, mobile. Its own step, after the email is saved, so a
          visitor who won't give a number is still a (partial) lead. */}
      {step === 8 && (
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
                aria-invalid={phoneError ? true : undefined}
                className={`w-full rounded-lg border bg-surface-raised px-4 py-3 text-sm text-ink placeholder:text-ink-subtle caret-cta focus:ring-[3px] outline-none transition-[border-color,box-shadow] duration-200 ${
                  phoneError
                    ? "border-danger focus:border-danger focus:ring-danger/15"
                    : "border-line focus:border-cta focus:ring-cta/15"
                }`}
              />
              {phoneError ? (
                <p className="mt-1.5 text-xs text-danger">{phoneError}</p>
              ) : sharesWithAgents && timeframe === "0-3-months" ? (
                <p className="mt-1.5 text-[11px] text-ink-subtle leading-relaxed">
                  So a top local agent can call you about your free
                  appraisal.
                </p>
              ) : sharesWithAgents && timeframe === "3-6-months" ? (
                <p className="mt-1.5 text-[11px] text-ink-subtle leading-relaxed">
                  So we can give you a quick heads-up call when it&rsquo;s the
                  right time to start comparing agents.
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
          {backButton(7)}
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
