// The guide funnels' collection statements: the consent a visitor gives by
// requesting a guide (agent contact where it applies, and tips emails; there
// is no checkbox since Oct 2026). One source for the words shown under the
// funnel buttons and the consent_text sent to Sent 24/7 with a lead, so the
// record always matches what the visitor read.

export const SELLING_CONSENT_SHARES =
  "By requesting the guide you agree we may share your details with one top local agent, who may contact you about selling your property, and that we may email you selling tips and market updates for your suburb (unsubscribe anytime). The agent pays us for the introduction. You pay nothing. We never sell your details to anyone else.";

export const SELLING_CONSENT_LISTED =
  "By requesting the guide you agree we may email it to you, plus selling tips and market updates for your suburb (unsubscribe anytime). Since you’re already listed, we won’t pass your details to any agent.";

export const BUYING_CONSENT =
  "By requesting the guide you agree we may email it to you, plus buying tips and market updates for your suburb (unsubscribe anytime). Your details are never sold and never passed to selling agents.";

/** The statement a guide lead saw, from the answers that choose it. */
export function guideConsentText(lead: { guideType?: string; agentStatus?: string }): string {
  if (lead.guideType === "buying") return BUYING_CONSENT;
  return lead.agentStatus === "already-listed" ? SELLING_CONSENT_LISTED : SELLING_CONSENT_SHARES;
}
