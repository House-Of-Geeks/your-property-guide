"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { clarityEvent } from "@/lib/clarity";
import { LEAD_TYPE_OPTIONS, type LeadTypeValue } from "@/lib/data/real-estate-leads";

/**
 * Agent-side registration form for /real-estate-leads and its lead-type
 * pages. Posts as a general-contact lead; agency, coverage, lead types and
 * licence go into the message so the existing /api/leads contract is
 * untouched. source stays "for-agents" (the page's old slug) so partner
 * enquiries don't split into two sources in reporting.
 */
export function AgentEnquiryForm({ defaultLeadTypes = [] }: { defaultLeadTypes?: LeadTypeValue[] }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agency, setAgency] = useState("");
  const [coverage, setCoverage] = useState("");
  const [licence, setLicence] = useState("");
  const [leadTypes, setLeadTypes] = useState<LeadTypeValue[]>(defaultLeadTypes);
  const [website, setWebsite] = useState(""); // honeypot, must stay empty

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleLeadType = (value: LeadTypeValue) =>
    setLeadTypes((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const typeLabels = LEAD_TYPE_OPTIONS.filter((o) => leadTypes.includes(o.value)).map((o) => o.label);
      const message = [
        "Agent partnership enquiry",
        agency && `Agency: ${agency}`,
        coverage && `Coverage: ${coverage}`,
        typeLabels.length > 0 && `Lead types: ${typeLabels.join(", ")}`,
        licence && `Licence: ${licence}`,
      ]
        .filter(Boolean)
        .join(" · ");

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "general-contact",
          firstName: firstName.trim(),
          lastName: lastName.trim() || undefined,
          email: email.trim(),
          phone: phone.trim() || undefined,
          message,
          source: "for-agents",
          website,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Submit failed");
      }
      clarityEvent("agent_enquiry_submitted");
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div id="register" className="bg-surface-warm text-ink rounded-2xl p-8 border border-line text-center scroll-mt-24">
        <div className="w-12 h-12 rounded-full bg-cta text-white grid place-items-center mx-auto mb-4">
          <CheckCircle className="w-6 h-6" aria-hidden="true" />
        </div>
        <h3 className="font-display text-xl text-ink mb-2">Thanks, we&rsquo;ll be in touch.</h3>
        <p className="text-sm text-ink-muted leading-relaxed">
          Within one business day you&rsquo;ll hear back with current lead
          availability for your patch and a per-lead price in writing.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-line bg-surface-raised px-4 py-3 text-sm text-ink placeholder:text-ink-subtle focus:border-cta focus:ring-2 focus:ring-cta/20 outline-none transition-colors";

  return (
    <form
      id="register"
      onSubmit={onSubmit}
      className="bg-surface-warm text-ink rounded-2xl p-6 sm:p-8 border border-line shadow-2xl space-y-3 scroll-mt-24"
    >
      <p className="text-[11px] uppercase tracking-[0.18em] text-cta font-medium">
        Register for leads
      </p>
      <h3 className="font-display text-2xl text-ink leading-tight tracking-tight pb-1">
        Tell us your patch.
      </h3>

      {/* Honeypot: visually hidden, off-screen, aria-hidden. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }}>
        <label htmlFor="agent-website">Website</label>
        <input
          id="agent-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input type="text" required aria-label="First name" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
        <input type="text" aria-label="Last name" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
      </div>
      <input type="email" required aria-label="Work email" placeholder="Work email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
      <input type="tel" required aria-label="Mobile" placeholder="Mobile" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
      <input type="text" required aria-label="Agency or company name" placeholder="Agency or company name" value={agency} onChange={(e) => setAgency(e.target.value)} className={inputClass} />
      <input
        type="text"
        required
        aria-label="Suburbs or postcodes you cover"
        placeholder="Suburbs or postcodes you cover, e.g. North Lakes, 4509"
        value={coverage}
        onChange={(e) => setCoverage(e.target.value)}
        className={inputClass}
      />

      <fieldset className="pt-1">
        <legend className="text-xs font-medium text-ink-muted mb-2">Lead types you want</legend>
        <div className="flex flex-wrap gap-2">
          {LEAD_TYPE_OPTIONS.map((o) => {
            const on = leadTypes.includes(o.value);
            return (
              <button
                key={o.value}
                type="button"
                aria-pressed={on}
                onClick={() => toggleLeadType(o.value)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  on ? "border-cta bg-cta text-white" : "border-line-strong bg-surface-raised text-ink hover:border-cta"
                }`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <input
        type="text"
        aria-label="Licence or registration number (optional)"
        placeholder="Licence or registration number (optional)"
        value={licence}
        onChange={(e) => setLicence(e.target.value)}
        className={inputClass}
      />

      {error && <p className="text-sm text-danger">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3.5 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {submitting ? "Sending…" : "Register for leads"}
        {!submitting && <ArrowRight className="w-4 h-4" />}
      </button>
      <p className="text-[11px] text-ink-subtle leading-relaxed">
        No lock-in and no obligation. We&rsquo;ll tell you what lead volume
        looks like in your area, and the per-lead price, before you commit to
        anything.
      </p>
    </form>
  );
}
