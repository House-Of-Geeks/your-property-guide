"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { clarityEvent } from "@/lib/clarity";

/**
 * Agent-side enquiry form. Posts as a general-contact lead with
 * source=for-agents; agency and coverage go into the message so the
 * existing /api/leads contract is untouched.
 */
export function AgentEnquiryForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agency, setAgency] = useState("");
  const [coverage, setCoverage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot, must stay empty

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const message = [
        "Agent partnership enquiry",
        agency && `Agency: ${agency}`,
        coverage && `Coverage: ${coverage}`,
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
      <div className="bg-surface-warm text-ink rounded-2xl p-8 border border-line text-center">
        <div className="w-12 h-12 rounded-full bg-cta text-white grid place-items-center mx-auto mb-4">
          <CheckCircle className="w-6 h-6" aria-hidden="true" />
        </div>
        <h3 className="font-display text-xl text-ink mb-2">Thanks, we&rsquo;ll be in touch.</h3>
        <p className="text-sm text-ink-muted leading-relaxed">
          We&rsquo;ll come back to you within one business day with current
          lead availability for your patch and how the numbers work.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-line bg-surface-raised px-4 py-3 text-sm text-ink placeholder:text-ink-subtle focus:border-cta focus:ring-2 focus:ring-cta/20 outline-none transition-colors";

  return (
    <form onSubmit={onSubmit} className="bg-surface-warm text-ink rounded-2xl p-6 sm:p-8 border border-line shadow-2xl space-y-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-cta font-medium">
        Register your interest
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
        <input type="text" required placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
        <input type="text" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
      </div>
      <input type="email" required placeholder="Work email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
      <input type="tel" required placeholder="Mobile" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
      <input type="text" required placeholder="Agency name" value={agency} onChange={(e) => setAgency(e.target.value)} className={inputClass} />
      <input
        type="text"
        required
        placeholder="Suburbs you cover, e.g. North Lakes, Mango Hill, Griffin"
        value={coverage}
        onChange={(e) => setCoverage(e.target.value)}
        className={inputClass}
      />

      {error && <p className="text-sm text-danger">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3.5 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {submitting ? "Sending…" : "Register interest"}
        {!submitting && <ArrowRight className="w-4 h-4" />}
      </button>
      <p className="text-[11px] text-ink-subtle leading-relaxed">
        No lock-in and no obligation. We&rsquo;ll tell you what lead volume
        looks like in your suburbs before you commit to anything.
      </p>
    </form>
  );
}
