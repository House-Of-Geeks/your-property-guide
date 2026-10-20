// The selling steps (15 Oct 2026): a short checklist for a well-prepared
// sale and the five steps that teach it, each linked to its selling-guide
// chapter, so the steps are named the same wherever they appear. Nothing
// reads them at the moment (the homepage stopped showing them on 19 Oct).
// 20 Oct 2026 ("Clear decisions"): reworded as plain preparation steps; the
// export names keep their original "campaign" wording.

import { chapterHref } from "@/lib/guide-books";

/** What a well-prepared sale has, at any price. */
export const CAMPAIGN_CHECKLIST = [
  "Price evidence before any quote",
  "Presentation that suits likely buyers",
  "Method chosen on evidence",
  "Marketing planned before launch",
  "Offers compared on price and conditions",
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

/** The five steps of a sale, each linked to its selling-guide chapter. */
export const CAMPAIGN_STEPS: readonly CampaignStep[] = [
  step("Know your number", "Recent nearby sales and the real cost of selling, before an agent quotes you.", 2),
  step("Prepare the property", "The pre-sale work that’s worth doing, and what may be better left alone.", 4),
  step("Choose the method on evidence", "Auction, private treaty or off-market, for your suburb right now.", 6),
  step("Plan the marketing", "Photos, copy, portals and open homes, planned for the buyers most likely to want your home.", 7),
  step("Weigh offers carefully", "Reading offers and conditions, countering in writing and knowing when to sign.", 8),
];
