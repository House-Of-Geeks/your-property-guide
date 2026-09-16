"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Home, ArrowRight, Loader2 } from "lucide-react";
import { clarityEvent, clarityTag } from "@/lib/clarity";
import { ENRICH_LEAD_STORAGE_KEY } from "@/components/forms/ThanksPhoneAsk";

interface Props {
  suburbName: string;
  suburbSlug: string;
  /** Attribution string passed to /api/leads. Defaults to the suburb-page source. */
  source?: string;
  /** Clarity form name. Defaults to "suburb-appraisal". */
  formName?: string;
}

// One-tap, optional. Feeds the same hot/warm/cold scoring the selling-guide
// funnel uses, so an appraisal lead can be prioritised on speed-to-lead
// without adding a required field to a form that converts because it's short.
const TIMEFRAMES: { id: string; label: string }[] = [
  { id: "0-3-months",     label: "Within 3 months" },
  { id: "3-6-months",     label: "3 to 6 months" },
  { id: "6-12-months",    label: "6 to 12 months" },
  { id: "researching",    label: "Just curious" },
];

/**
 * Inline seller-capture CTA on suburb pages. The brief flagged the old
 * "property alerts" widget as the lowest-value action with the most
 * friction (4 required fields for a passive email subscription); this
 * replaces it with a 3-field appraisal request that converts traffic at
 * the moment of highest intent ("what's my home worth in this suburb?").
 *
 * Form is intentionally minimal: first name + email + property address.
 * Phone is collected post-submit on /appraisal/thanks via ThanksPhoneAsk +
 * /api/leads/enrich (the lead id is handed over in sessionStorage below).
 * Suburb is implicit from the page context, no second guess required.
 */
export function SuburbAppraisalCTA({ suburbName, suburbSlug, source, formName = "suburb-appraisal" }: Props) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [timeframe, setTimeframe] = useState<string | null>(null);
  const [website, setWebsite] = useState(""); // honeypot
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const markStart = () => {
    if (hasStarted) return;
    setHasStarted(true);
    clarityEvent("form_start");
    clarityTag("form_name", formName);
    clarityTag("form_suburb", suburbSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "appraisal-request",
          firstName: firstName.trim(),
          email: email.trim(),
          address: address.trim(),
          appraisalAddress: address.trim(),
          suburb: suburbSlug,
          sellingTimeframe: timeframe ?? undefined,
          website,
          source: source ?? `suburb-page-${suburbSlug}-appraisal`,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const saved = (await res.json().catch(() => null)) as { id?: string } | null;
      clarityEvent("request_quote");
      clarityTag("appraisal_suburb", suburbSlug);
      clarityTag("appraisal_source", source ? "home-value-guide" : "suburb-inline");
      if (timeframe) clarityTag("appraisal_timeframe", timeframe);
      // This form is deliberately phone-less, so every lead needs the
      // thanks-page follow-up. Hand the lead id over in sessionStorage
      // (it's the enrich bearer credential — never in the URL).
      try {
        if (saved?.id) {
          sessionStorage.setItem(ENRICH_LEAD_STORAGE_KEY, saved.id);
        } else {
          sessionStorage.removeItem(ENRICH_LEAD_STORAGE_KEY);
        }
      } catch {
        // Storage blocked — the thanks page just skips the phone ask.
      }
      const qs = new URLSearchParams({ suburb: suburbSlug });
      router.push(`/appraisal/thanks?${qs.toString()}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-cta/30 shadow-card">
      <div className="bg-ink band-glow px-6 sm:px-8 py-6 sm:py-7 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-cta text-ink grid place-items-center">
            <Home className="w-4.5 h-4.5" />
          </div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/78 font-medium">
            Free property appraisal in {suburbName}
          </p>
        </div>
        <h3 className="font-display text-2xl sm:text-3xl text-white leading-tight tracking-tight mb-2">
          What&rsquo;s your home worth in {suburbName}?
        </h3>
        <p className="text-sm text-white/75 leading-relaxed max-w-md">
          A local agent who actually sells in {suburbName} will give you an
          honest number, backed by recent comparable sales. Free, no commitment
          to list.
        </p>
      </div>

      <form onSubmit={handleSubmit} onFocus={markStart} className="bg-surface-raised px-6 sm:px-8 py-6 sm:py-7 space-y-3">
        {/* Honeypot: visually hidden, off-screen, aria-hidden. */}
        <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }}>
          <label htmlFor="suburb-appraisal-website">Website</label>
          <input
            id="suburb-appraisal-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="suburb-appraisal-firstName" className="block text-xs font-medium text-ink-muted mb-1">
              First name
            </label>
            <input
              id="suburb-appraisal-firstName"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Jane"
              className="w-full rounded-lg border border-line bg-surface-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink-subtle outline-none transition-[border-color,box-shadow] duration-200 focus:border-cta focus:ring-[3px] focus:ring-cta/15"
            />
          </div>
          <div>
            <label htmlFor="suburb-appraisal-email" className="block text-xs font-medium text-ink-muted mb-1">
              Email
            </label>
            <input
              id="suburb-appraisal-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              className="w-full rounded-lg border border-line bg-surface-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink-subtle outline-none transition-[border-color,box-shadow] duration-200 focus:border-cta focus:ring-[3px] focus:ring-cta/15"
            />
          </div>
        </div>

        <div>
          <label htmlFor="suburb-appraisal-address" className="block text-xs font-medium text-ink-muted mb-1">
            Property address in {suburbName}
          </label>
          <input
            id="suburb-appraisal-address"
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={`e.g. 15 Smith Street, ${suburbName}`}
            className="w-full rounded-lg border border-line bg-surface-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink-subtle outline-none transition-[border-color,box-shadow] duration-200 focus:border-cta focus:ring-[3px] focus:ring-cta/15"
          />
        </div>

        <fieldset>
          <legend className="block text-xs font-medium text-ink-muted mb-1.5">
            Thinking of selling? <span className="font-normal text-ink-subtle">Optional</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {TIMEFRAMES.map((t) => {
              const active = timeframe === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setTimeframe(active ? null : t.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? "bg-ink text-white border-ink"
                      : "bg-surface-raised text-ink border-line hover:border-line-strong"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        {error && <p className="step-in text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="group press w-full inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-ink font-semibold px-5 py-3 text-sm transition-colors active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending&hellip;
            </>
          ) : (
            <>
              Get my free appraisal
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>

        <p className="text-[11px] text-ink-subtle leading-relaxed pt-1 flex flex-wrap items-center gap-x-2">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cta" aria-hidden="true" />
            Reply within 1 business day
          </span>
          <span aria-hidden="true">·</span>
          <span>No commitment to list</span>
          <span aria-hidden="true">·</span>
          <a href="/privacy" className="underline underline-offset-2 hover:text-ink">Privacy</a>
        </p>
      </form>
    </div>
  );
}
