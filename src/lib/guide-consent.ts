// The guide funnels' collection statements, and who an optional call goes
// to. Pure (no server imports): the funnels and the thanks-page call card
// render these words, and /api/leads sends the same words to Sent 24/7 as
// consent_text, so the record always matches what the visitor read.
//
// Since Oct 2026 the guide is given for an email (the email step's consent
// covers the guide and tips emails only). Agent contact is a separate,
// optional request on the thanks page, with its own consent.

export const SELLING_EMAIL_CONSENT =
  "By requesting the guide you agree we may email it to you, plus selling tips and market updates for your suburb (unsubscribe anytime). We never sell your details.";

export const BUYING_EMAIL_CONSENT =
  "By requesting the guide you agree we may email it to you, plus buying tips and market updates for your suburb (unsubscribe anytime). Your details are never sold and never passed to selling agents.";

export const AGENT_CALL_CONSENT =
  "By booking a call you agree we may share your details with one top local agent, who will call you about selling your property. The agent pays us for the introduction. You pay nothing. We never sell your details to anyone else.";

export const YPG_CALL_CONSENT =
  "We’ll use your mobile only to call you ourselves. We never pass it to an agent or sell it.";

export function downloadConsentText(guideType?: string): string {
  return guideType === "buying" ? BUYING_EMAIL_CONSENT : SELLING_EMAIL_CONSENT;
}

export type GuideCallKind = "agent" | "ypg";

/**
 * Who an optional call goes to. "agent": sellers moving within six months
 * who aren't listed, whose call request is a vendor lead for one agent (the
 * ones YPG may sell; cold vendors aren't sold). "ypg": everyone else, called
 * by YPG and never passed on. Must agree with sent247HoldReason (tested).
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

export interface GuideThanksContext {
  guide: "selling" | "buying";
  kind: GuideCallKind;
  /** True when the guide email is on its way (Sent 24/7 started the series, or YPG sent it). */
  emailOnItsWay: boolean;
  /** The download's lead payload, less a phone: the call request re-sends it with one. */
  payload: Record<string, unknown>;
}
