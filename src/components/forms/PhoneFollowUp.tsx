"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { clarityEvent, clarityTag } from "@/lib/clarity";
import { isValidPhone, PHONE_ERROR } from "@/lib/utils/phone";

interface PhoneFollowUpProps {
  /** Lead to enrich — the id returned by POST /api/leads. */
  leadId: string;
  /** Where this follow-up is rendered, for Clarity segmentation. */
  source: string;
  /** Lead-in line above the field. Keep it a reason, not a demand. */
  prompt?: string;
}

/**
 * One-field "add your mobile" step shown AFTER a lead has converted on an
 * email-first form. The conversion is already banked, so this can only add
 * phone numbers — it can never cost a lead. Posts to /api/leads/enrich,
 * which fills the phone in on the existing lead and pings the team.
 */
export function PhoneFollowUp({
  leadId,
  source,
  prompt = "Prefer to talk it through? Add your mobile and we’ll call you first.",
}: PhoneFollowUpProps) {
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "expired">("idle");
  const [error, setError] = useState<string | null>(null);

  if (state === "done") {
    return (
      <div className="flex items-center gap-2.5 rounded-xl border border-line bg-surface-raised px-4 py-3.5">
        <CheckCircle className="w-4 h-4 text-cta shrink-0" />
        <p className="text-sm text-ink">
          Got it — expect a call on <span className="font-medium">{phone.trim()}</span>.
        </p>
      </div>
    );
  }

  // The enrich window has passed (week-old bookmarked thanks page).
  // A retry can never succeed, so don't offer one.
  if (state === "expired") {
    return (
      <div className="rounded-xl border border-line bg-surface-raised px-4 py-3.5">
        <p className="text-sm text-ink-muted leading-snug">
          This request has expired — reply to your confirmation email instead
          and we&rsquo;ll pick it up from there.
        </p>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPhone(phone)) {
      setError(PHONE_ERROR);
      return;
    }
    setError(null);
    setState("saving");
    try {
      const res = await fetch("/api/leads/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, phone: phone.trim() }),
      });
      if (res.status === 404) {
        setState("expired");
        return;
      }
      if (!res.ok) throw new Error("enrich failed");
      clarityEvent("phone_added");
      clarityTag("phone_added_source", source);
      setState("done");
    } catch {
      setState("idle");
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-line bg-surface-raised px-4 py-4">
      <p className="text-sm text-ink leading-snug mb-3">{prompt}</p>
      <div className="flex gap-2">
        <input
          type="tel"
          placeholder="04XX XXX XXX"
          autoComplete="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (error) setError(null);
          }}
          aria-label="Mobile number"
          aria-invalid={error ? true : undefined}
          className={`min-w-0 flex-1 rounded-lg border bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:ring-1 outline-none transition-colors ${
            error
              ? "border-danger focus:border-danger focus:ring-danger"
              : "border-line-strong focus:border-primary focus:ring-primary"
          }`}
        />
        <button
          type="submit"
          disabled={state === "saving"}
          className="inline-flex items-center gap-1.5 rounded-lg bg-cta hover:bg-cta-hover text-white font-medium px-4 py-2.5 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
        >
          {state === "saving" ? "Saving…" : "Call me"}
          {state !== "saving" && <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </form>
  );
}
