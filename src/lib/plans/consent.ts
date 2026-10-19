// What the "Email me this plan" form tells people (20 Oct 2026). The form
// shows these words and /api/plans stores the same words with the row
// (Lead.consentText), as the guides and the agreement check do.

export const PLAN_EMAIL_CONSENT =
  "One email with your steps, links and checklist. Nothing else unless you tick the box. We don’t pass these details to anyone.";

/** While the tips series is switched off (src/lib/flags.ts), the box isn't offered. */
export const PLAN_EMAIL_CONSENT_PLAIN = "One email with your steps, links and checklist, and nothing else. We don’t pass these details to anyone.";

export const planEmailConsent = (series: boolean) => (series ? PLAN_EMAIL_CONSENT : PLAN_EMAIL_CONSENT_PLAIN);
