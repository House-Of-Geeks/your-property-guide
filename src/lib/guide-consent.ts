// The guide funnels' collection statements, and who an optional call goes
// to. Pure (no server imports): the funnels and the thanks pages render these
// words, and /api/leads stores the same words with the row (and sends them to
// Sent 24/7 as consent_text), so the record always matches what was read.
//
// Since 14 Oct 2026 ("confident moves") a guide is a learning request: it is
// given for an email address, nothing else is bundled with it. Each extra is
// its own clear choice on the same step: a mobile (optional) if they'd like
// our team to call, and an unticked box for the short tips series. Agent
// contact is never part of a guide request; it's the introduction form
// (/get-help), with its own permission box.

export const SELLING_EMAIL_CONSENT =
  "We’ll email you the guide. Nothing else is sent unless you tick the box above, and we never pass your details to an agent from this form.";

export const BUYING_EMAIL_CONSENT =
  "We’ll email you the guide. Nothing else is sent unless you tick the box above, and we never pass your details to any agent from this form.";

// While the tips series is switched off (src/lib/flags.ts) there's no box to
// tick, so the statement doesn't mention one (20 Oct 2026).
export const SELLING_EMAIL_CONSENT_PLAIN = "We’ll email you the guide, and we never pass your details to an agent from this form.";
export const BUYING_EMAIL_CONSENT_PLAIN = "We’ll email you the guide, and we never pass your details to any agent from this form.";

/** Under the optional mobile field. Giving the number is the yes to a call from us, and only that. */
export const GUIDE_PHONE_NOTE =
  "Optional. Add it only if you’d like someone from our team to call with your questions. We never pass it to an agent.";

/** The guide's separate opt-in for the short tips series (sequence copy in lib/email-sequences). */
export const GUIDE_SEQUENCE_LABEL = "Also send me a few short emails for my stage";

// Legacy: the thanks-page call card (until 14 Oct 2026). Kept so a call
// request from a page that loaded before the deploy still records the words
// that page showed. New pages link to /get-help instead.
export const AGENT_CALL_CONSENT =
  "By booking a call you agree we may share your details with one participating local agent, who will call you about selling your property. The agent pays us a flat fee for the introduction, never a share of their commission. You pay nothing. We never sell your details to anyone else.";

export const YPG_CALL_CONSENT =
  "We’ll use your mobile only to call you ourselves. We never pass it to an agent or sell it.";

/** The statement the email step shows: with the series box when the series is on, without it when it's off. */
export function downloadConsentText(guideType?: string, series = false): string {
  if (guideType === "buying") return series ? BUYING_EMAIL_CONSENT : BUYING_EMAIL_CONSENT_PLAIN;
  return series ? SELLING_EMAIL_CONSENT : SELLING_EMAIL_CONSENT_PLAIN;
}

export type GuideCallKind = "agent" | "ypg";

/**
 * Who an optional call goes to. "agent": sellers moving within six months
 * who aren't listed, whose call request is a vendor lead for one agent (the
 * ones YPG may sell; cold vendors aren't sold). "ypg": everyone else, called
 * by YPG and never passed on. Must agree with sent247HoldReason (tested),
 * except that an agent call with no suburb is held for the team to call
 * first (it keeps its one-agent consent).
 */
export function guideCallKind(a: { guideType?: string; sellingTimeframe?: string; agentStatus?: string }): GuideCallKind {
  if (a.guideType === "buying") return "ypg";
  if (a.agentStatus === "already-listed") return "ypg";
  return a.sellingTimeframe === "0-3-months" || a.sellingTimeframe === "3-6-months" ? "agent" : "ypg";
}

export function callConsentText(kind: GuideCallKind): string {
  return kind === "agent" ? AGENT_CALL_CONSENT : YPG_CALL_CONSENT;
}

/** sessionStorage key: what the funnel hands its thanks page (never the URL). */
export const GUIDE_THANKS_KEY = "ypg-guide-thanks";

/**
 * What the funnel hands its thanks page (sessionStorage, this tab only).
 * Since 14 Oct 2026 nothing personal: no name, email or phone, because the
 * thanks page no longer re-submits anything.
 */
export interface GuideThanksContext {
  guide: "selling" | "buying";
  /** True when the guide email is on its way (Sent 24/7 started the series, or YPG sent it). */
  emailOnItsWay: boolean;
  /** True when they ticked the tips series. */
  sequence?: boolean;
}
