"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Home, ArrowRight, Loader2 } from "lucide-react";
import { clarityEvent, clarityTag } from "@/lib/clarity";

interface Props {
  suburbName: string;
  suburbSlug: string;
}

/**
 * Inline seller-capture CTA on suburb pages. The brief flagged the old
 * "property alerts" widget as the lowest-value action with the most
 * friction (4 required fields for a passive email subscription); this
 * replaces it with a 3-field appraisal request that converts traffic at
 * the moment of highest intent ("what's my home worth in this suburb?").
 *
 * Form is intentionally minimal: first name + email + property address.
 * Phone is optional and lives on /appraisal/thanks if the agent needs it.
 * Suburb is implicit from the page context, no second guess required.
 */
export function SuburbAppraisalCTA({ suburbName, suburbSlug }: Props) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const markStart = () => {
    if (hasStarted) return;
    setHasStarted(true);
    clarityEvent("form_start");
    clarityTag("form_name", "suburb-appraisal");
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
          website,
          source: `suburb-page-${suburbSlug}-appraisal`,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      clarityEvent("request_quote");
      clarityTag("appraisal_suburb", suburbSlug);
      clarityTag("appraisal_source", "suburb-inline");
      const qs = new URLSearchParams({ suburb: suburbSlug });
      router.push(`/appraisal/thanks?${qs.toString()}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-cta/30 shadow-card">
      <div className="bg-ink px-6 sm:px-8 py-6 sm:py-7 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-cta text-ink grid place-items-center">
            <Home className="w-4.5 h-4.5" />
          </div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/65 font-medium">
            Free appraisal
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
              className="w-full rounded-lg border border-line bg-surface-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors"
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
              className="w-full rounded-lg border border-line bg-surface-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors"
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
            className="w-full rounded-lg border border-line bg-surface-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors"
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-ink font-semibold px-5 py-3 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending&hellip;
            </>
          ) : (
            <>
              Get my free appraisal
              <ArrowRight className="w-4 h-4" />
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
