// The next-step plan's questions (Oct 2026). Few, and each one changes the
// plan: the move, the state (rules and costs differ), where they're up to,
// one situation question, and timing. Nothing personal: the plan works with
// no name or email, and its answers fit in a shareable URL.

import type { AustralianState } from "@/lib/utils/stamp-duty";
import type { Journey } from "@/lib/lead-kinds";
import type { Timeframe } from "@/lib/introductions/rules";

export type SellStage = "thinking" | "preparing" | "choosing-agent" | "listed";
export type BuyStage = "starting" | "finance" | "searching" | "offer";
export type BuyerType = "first-home" | "next-home" | "investing" | "downsizing";
export type HelpPreference = "self" | "buyers-agent" | "unsure";
export type MoveOrder = "undecided" | "sell-first" | "buy-first" | "sold" | "bought";

export interface PlanAnswers {
  journey: Journey;
  state: AustralianState | null;
  timeframe: Timeframe | null;
  sellStage?: SellStage | null;
  buyStage?: BuyStage | null;
  buyerType?: BuyerType | null;
  help?: HelpPreference | null;
  order?: MoveOrder | null;
  /** A suburb slug ("paddington-qld-4064") from the homepage field, passed on to the agent step. Not personal data. */
  suburb?: string | null;
}

/** A suburb slug as the suburb pages and /get-help use it: name, state, postcode. */
export const SUBURB_SLUG = /^[a-z0-9-]+-[a-z]{2,3}-\d{4}$/;

export interface Option<T extends string> {
  id: T;
  label: string;
  sub?: string;
}

export const STATE_OPTIONS: Option<AustralianState>[] = [
  { id: "NSW", label: "NSW" },
  { id: "VIC", label: "VIC" },
  { id: "QLD", label: "QLD" },
  { id: "WA", label: "WA" },
  { id: "SA", label: "SA" },
  { id: "TAS", label: "TAS" },
  { id: "ACT", label: "ACT" },
  { id: "NT", label: "NT" },
];

export const SELL_STAGES: Option<SellStage>[] = [
  { id: "thinking", label: "Thinking about it", sub: "Working out whether and when to sell" },
  { id: "preparing", label: "Getting ready", sub: "Preparing the property and the numbers" },
  { id: "choosing-agent", label: "Choosing an agent", sub: "Getting appraisals or comparing proposals" },
  { id: "listed", label: "Already signed with an agent", sub: "The campaign is planned or under way" },
];

export const BUY_STAGES: Option<BuyStage>[] = [
  { id: "starting", label: "Just starting", sub: "Working out what I can afford" },
  { id: "finance", label: "Sorting finance", sub: "Deposit, schemes and pre-approval" },
  { id: "searching", label: "Looking at properties", sub: "Inspecting and shortlisting" },
  { id: "offer", label: "Ready to offer or bid", sub: "Found one, or close to it" },
];

export const BUYER_TYPES: Option<BuyerType>[] = [
  { id: "first-home", label: "My first home" },
  { id: "next-home", label: "My next home" },
  { id: "investing", label: "An investment" },
  { id: "downsizing", label: "Downsizing" },
];

export const HELP_PREFERENCES: Option<HelpPreference>[] = [
  { id: "self", label: "I’ll do it myself", sub: "With good guides and tools" },
  { id: "buyers-agent", label: "I’d like to consider a buyer’s agent", sub: "Someone who acts for me" },
  { id: "unsure", label: "Not sure yet", sub: "Show me what each involves" },
];

export const MOVE_ORDERS: Option<MoveOrder>[] = [
  { id: "undecided", label: "Not sure which comes first", sub: "Sell first, buy first, or at the same time" },
  { id: "sell-first", label: "Selling first", sub: "Then buying" },
  { id: "buy-first", label: "Buying first", sub: "Then selling" },
  { id: "sold", label: "I’ve sold", sub: "Now I need to buy" },
  { id: "bought", label: "I’ve bought", sub: "Now I need to sell" },
];

export const TIMEFRAMES: Option<Timeframe>[] = [
  { id: "0-3-months", label: "Within 3 months" },
  { id: "3-6-months", label: "3 to 6 months" },
  { id: "6-12-months", label: "6 to 12 months" },
  { id: "12-plus-months", label: "More than a year" },
  { id: "researching", label: "No firm plans" },
];

const pick = <T extends string>(opts: Option<T>[], v: string | null | undefined): T | null =>
  v && opts.some((o) => o.id === v) ? (v as T) : null;

/** A suburb slug from the URL, or null if it isn't one. */
export function suburbParam(v: string | null | undefined): string | null {
  return v && v.length <= 80 && SUBURB_SLUG.test(v) ? v : null;
}

/** A state from the URL ("qld"), or null. */
export function stateParam(v: string | null | undefined): AustralianState | null {
  return pick(STATE_OPTIONS, v?.toUpperCase());
}

/** Answers from URL search params (the plan result page is shareable, with no personal data). */
export function answersFromParams(get: (key: string) => string | null | undefined): PlanAnswers | null {
  const j = get("j");
  const journey = j === "buying" || j === "selling" || j === "buying-and-selling" ? j : null;
  if (!journey) return null;
  return {
    journey,
    state: stateParam(get("s")),
    timeframe: pick(TIMEFRAMES, get("t")),
    sellStage: pick(SELL_STAGES, get("ss")),
    buyStage: pick(BUY_STAGES, get("bs")),
    buyerType: pick(BUYER_TYPES, get("bt")),
    help: pick(HELP_PREFERENCES, get("h")),
    order: pick(MOVE_ORDERS, get("o")),
    suburb: suburbParam(get("sub")),
  };
}

/** The inverse of answersFromParams. */
export function answersToParams(a: PlanAnswers): URLSearchParams {
  const qs = new URLSearchParams({ j: a.journey });
  if (a.state) qs.set("s", a.state.toLowerCase());
  if (a.timeframe) qs.set("t", a.timeframe);
  if (a.sellStage) qs.set("ss", a.sellStage);
  if (a.buyStage) qs.set("bs", a.buyStage);
  if (a.buyerType) qs.set("bt", a.buyerType);
  if (a.help) qs.set("h", a.help);
  if (a.order) qs.set("o", a.order);
  if (a.suburb) qs.set("sub", a.suburb);
  return qs;
}

/** The stage word stored on Lead.stage for a plan or guide. */
export function stageOf(a: PlanAnswers): string | null {
  if (a.journey === "selling") return a.sellStage ?? null;
  if (a.journey === "buying") return a.buyStage ?? null;
  return a.order ?? null;
}
