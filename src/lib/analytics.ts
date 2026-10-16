"use client";

import { clarityEvent, clarityTag } from "@/lib/clarity";
import { safeAnalyticsProps, type AnalyticsProps } from "@/lib/analytics-props";

export type { AnalyticsProps, AnalyticsKey } from "@/lib/analytics-props";

// Measurement for the two paths (Oct 2026). One typed call for every event, so
// the stages stay distinct and nothing personal leaves the browser:
//
//   engagement   tool_used, plan_started, plan_completed, guide_started,
//                journey_selected, help_cta_clicked, intro_started
//   learning     guide_delivered, plan_emailed, guide_downloaded_direct,
//                sequence_opted_in, newsletter_subscribed
//   introduction intro_submitted (with the server's status: sent, held,
//                not-introduced; a click is never counted as delivered)
//
// Downstream outcomes (partner accepted, appraisal or consultation booked,
// agreement signed, feedback, a partner's repeat business) are recorded in
// the database as LeadEvent rows by the server, the team or the partner,
// and reported from /dashboard/admin/leads, never from the browser.
//
// Only the keys below are sent, values are trimmed to 60 characters, and
// anything that looks like an email address or a phone number is dropped,
// so names, emails, phones, street addresses and free text can't reach
// Clarity even by mistake.

export type AnalyticsEvent =
  | "journey_selected"
  | "tool_used"
  | "plan_started"
  | "plan_completed"
  | "plan_emailed"
  | "guide_started"
  | "guide_delivered"
  | "guide_downloaded_direct"
  | "sequence_opted_in"
  | "newsletter_subscribed"
  | "help_cta_clicked"
  | "intro_started"
  | "intro_submitted"
  | "intro_duplicate_blocked"
  // The agreement check (15 Oct 2026): a call from our team, counted on the server's answer.
  | "agreement_check_submitted";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

/** Record one event in Clarity (and the dataLayer, if a tag manager is ever added). */
export function track(event: AnalyticsEvent, props: AnalyticsProps = {}): void {
  const clean = safeAnalyticsProps(props);
  try {
    clarityEvent(event);
    for (const [k, v] of Object.entries(clean)) clarityTag(k, v);
    if (typeof window !== "undefined" && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event, ...clean });
    }
  } catch {
    // Analytics must never break a form.
  }
}
