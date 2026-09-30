// The sentence at the top of every ranking page, /best-suburbs/[category] and
// /best-suburbs/[category]/[state]. The H1, the ItemList name and the state
// page's <title> are composed here, once, and tested in
// tests/seo/best-suburbs-headlines.test.ts.
//
// Fix item 45. The H1 was "The {qualifier} suburbs in {place}." with the
// qualifier in italics, which reads for five categories ("The most affordable
// suburbs in Queensland.") and not for the sixth, whose qualifier belongs
// after the noun: "The for families suburbs in Western Australia." The state
// <title> and the ItemList name built the same fragment ("Best for Families
// suburbs in Western Australia"). Each category now names the words before
// "suburbs" and the words after, and every reader joins them the same way.
import type { RankingCategory } from "@/lib/ranking-notes";

export const STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"] as const;

export const STATE_NAME: Record<string, string> = {
  NSW: "New South Wales",
  VIC: "Victoria",
  QLD: "Queensland",
  WA: "Western Australia",
  SA: "South Australia",
  TAS: "Tasmania",
  NT: "Northern Territory",
  ACT: "Australian Capital Territory",
};

export interface CategoryHeadline {
  /** The words before "suburbs": italic in the H1, Title Case in the <title>. */
  lead: string;
  /** "suburbs", or "suburbs for families". */
  noun: string;
}

export const CATEGORY_HEADLINE: Record<RankingCategory, CategoryHeadline> = {
  "for-families": { lead: "best", noun: "suburbs for families" },
  "highest-growth": { lead: "highest growth", noun: "suburbs" },
  "most-affordable": { lead: "most affordable", noun: "suburbs" },
  "most-walkable": { lead: "most walkable", noun: "suburbs" },
  "lowest-flood-risk": { lead: "lowest flood risk", noun: "suburbs" },
  "best-rental-yield": { lead: "best rental yield", noun: "suburbs" },
};

/** "Western Australia" for WA; "Australia" on the national page. */
export function placeName(state: string | null): string {
  return state ? STATE_NAME[state] ?? state : "Australia";
}

/**
 * The H1 and the ItemList name: "The best suburbs for families in Western
 * Australia", "The most affordable suburbs in Queensland". No full stop; the
 * H1 adds its own.
 */
export function bestSuburbsHeadline(category: RankingCategory, state: string | null): string {
  const { lead, noun } = CATEGORY_HEADLINE[category];
  return `The ${lead} ${noun} in ${placeName(state)}`;
}

/**
 * The state page's <title>: "Best suburbs for families in Western Australia
 * (WA)". The other five categories keep the title they had, "Highest Growth
 * suburbs in New South Wales (NSW)". The national page's title is the
 * category's list title plus " in Australia" and was never affected.
 */
export function bestSuburbsStateTitle(category: RankingCategory, state: string): string {
  const { lead, noun } = CATEGORY_HEADLINE[category];
  return `${titleCase(lead)} ${noun} in ${placeName(state)} (${state})`;
}

function titleCase(words: string): string {
  return words.replace(/\b[a-z]/g, (c) => c.toUpperCase());
}
