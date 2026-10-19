// The campaign (15 Oct 2026, "It's the campaign that wins"): the checklist
// every top-end campaign has and the five steps that teach it. The homepage
// reads these now; the selling guide's chapters and the articles' calls to
// action will read them too, so the steps are named the same everywhere.
// (19 Oct 2026: the homepage no longer shows them; the illustrative "same
// playbook" homes were replaced by the real Hamilton example.)

import { chapterHref } from "@/lib/guide-books";

/** What every top-end campaign has, at any price. */
export const CAMPAIGN_CHECKLIST = [
  "Price evidence before any quote",
  "Styled for the top buyer",
  "Method chosen on evidence",
  "A launch built for one buyer",
  "Every offer negotiated hard",
  "Fees agreed in writing",
] as const;

export interface CampaignStep {
  title: string;
  body: string;
  /** The selling-guide chapter (1-based) that teaches the step. */
  chapter: number;
  href: string;
}

const step = (title: string, body: string, chapter: number): CampaignStep => ({
  title,
  body,
  chapter,
  href: chapterHref("selling", chapter),
});

/** The five steps of a campaign, each linked to its selling-guide chapter. */
export const CAMPAIGN_STEPS: readonly CampaignStep[] = [
  step("Know your number", "Recent nearby sales and the real cost of selling, before an agent quotes you.", 2),
  step("Present for the top buyer", "The pre-sale fixes that pay back, and the ones that don’t.", 4),
  step("Choose the method on evidence", "Auction, private treaty or off-market, for your suburb right now.", 6),
  step("Launch it properly", "Photos, copy, portals and open homes, all aimed at the buyer who’ll pay the most.", 7),
  step("Negotiate every dollar", "Reading offers, countering in writing and knowing when to sign.", 8),
];
