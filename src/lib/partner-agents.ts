// The partner agents the site may show by name (15 Oct 2026).
//
// Agent profiles are paused (Andy, 3 Jul 2026): the Agent rows in the
// database are placeholders, and nothing should present them as real. A
// partner appears on the site only once Andy adds them here, with their
// written campaign approach. The homepage's agent card reads this list; while
// it is empty, the card doesn't render.

export interface PartnerAgent {
  /** The Agent row's slug in the database. */
  agentSlug: string;
  /** The suburbs the partner covers, as shown on the card. */
  suburbs: readonly string[];
  /** How they run a campaign, in their words, approved by them and by Andy. */
  campaignApproach: string;
}

export const PARTNER_AGENTS: readonly PartnerAgent[] = [];
