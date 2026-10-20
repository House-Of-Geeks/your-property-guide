// The homepage's two interactive bands (20 Oct 2026, "Clear decisions",
// from Andy's approved design):
//
//   "Start where you are": pick buying, selling or both and where you're up
//   to, and see three starting points, each linked to the guide or tool that
//   covers it, with a link into the full next-step plan with those answers.
//
//   "Good questions. Clearer decisions.": four questions; each answer says
//   what to look at and links to the tools and guides that help.
//
// Every href must be a real page (tests/lib/home-start.test.ts). This is
// general information for reading and research, never personal advice.

import { AGREEMENT_CHECK } from "@/lib/service-model";
import { chapterHref } from "@/lib/guide-books";
import type { Move } from "@/components/interactive/move-context";
import type { PlanStartAnswers } from "@/lib/plans/start";

export type Stage = "exploring" | "planning" | "ready";

export const STAGES: readonly { id: Stage; label: string }[] = [
  { id: "exploring", label: "Just exploring" },
  { id: "planning", label: "Working through the details" },
  { id: "ready", label: "Getting ready to act" },
];

export const MOVES: readonly { id: Move; label: string }[] = [
  { id: "buying", label: "Buying" },
  { id: "selling", label: "Selling" },
  { id: "both", label: "Both" },
];

export interface StartingPoint {
  label: string;
  href: string;
}

/** Three starting points for each move and stage. */
export const STARTS: Record<Move, Record<Stage, readonly [StartingPoint, StartingPoint, StartingPoint]>> = {
  buying: {
    exploring: [
      { label: "Work out your budget and upfront costs", href: chapterHref("buying", 2) },
      { label: "Understand the buying process in your state", href: "/guides/buying-property-australia" },
      { label: "Know what to look for at inspections", href: chapterHref("buying", 5) },
    ],
    planning: [
      { label: "Check the purchase costs alongside repayments", href: "/stamp-duty-calculator" },
      { label: "Read the checks to make before an offer", href: "/guides/due-diligence-checklist-buying-a-house" },
      { label: "Prepare the questions for your lender and conveyancer", href: chapterHref("buying", 8) },
    ],
    ready: [
      { label: "Work through the property and contract checks", href: "/guides/building-pest-inspection" },
      { label: "Understand offer conditions and finance timing", href: chapterHref("buying", 7) },
      { label: "Prepare for the steps from agreement to settlement", href: chapterHref("buying", 9) },
    ],
  },
  selling: {
    exploring: [
      { label: "Understand what selling could cost", href: "/selling-costs-calculator" },
      { label: "Gather evidence about your property’s value", href: chapterHref("selling", 2) },
      { label: "Decide what is worth preparing before sale", href: "/guides/what-to-fix-before-selling-a-house" },
    ],
    planning: [
      { label: "Compare agent proposals at the same sale price", href: "/tools/agent-proposal-worksheet" },
      { label: "Check the proposed marketing costs and agreement", href: "/guides/real-estate-agent-fees-australia" },
      { label: "Build a preparation and selling timeline", href: chapterHref("selling", 10) },
    ],
    ready: [
      { label: "Review the agency agreement before signing", href: AGREEMENT_CHECK.href },
      { label: "Confirm the preparation and marketing plan", href: chapterHref("selling", 7) },
      { label: "Understand offers, conditions and settlement", href: chapterHref("selling", 8) },
    ],
  },
  both: {
    exploring: [
      { label: "Look at the costs on both sides of the move", href: "/buying-and-selling" },
      { label: "Compare selling first with buying first", href: "/guides/sell-first-or-buy-first" },
      { label: "Read how the timing and finance can fit together", href: "/guides/bridging-loans-guide" },
    ],
    planning: [
      { label: "Work through your sale and purchase budgets", href: "/selling-costs-calculator" },
      { label: "Compare the timing options for both properties", href: "/guides/sell-first-or-buy-first" },
      { label: "Prepare questions about finance and settlement", href: "/bridging-loan-calculator" },
    ],
    ready: [
      { label: "Check the commitments on both sides", href: "/guides/due-diligence-checklist-buying-a-house" },
      { label: "Confirm the questions for your lender and conveyancer", href: "/guides/conveyancing-guide" },
      { label: "Coordinate the proposed settlement and moving dates", href: "/guides/settlement-day-australia" },
    ],
  },
};

/** The planner's answers for each move and stage, so it skips what's already been said. */
export const STAGE_ANSWERS: Record<Move, Record<Stage, PlanStartAnswers>> = {
  buying: { exploring: { bs: "starting" }, planning: { bs: "finance" }, ready: { bs: "offer" } },
  selling: { exploring: { ss: "thinking" }, planning: { ss: "preparing" }, ready: { ss: "choosing-agent" } },
  both: { exploring: { o: "undecided" }, planning: {}, ready: {} },
};

export type QuestionId = "cost" | "checks" | "agent" | "timing";

export const QUESTIONS: readonly { id: QuestionId; label: string }[] = [
  { id: "cost", label: "What will it all cost?" },
  { id: "checks", label: "What should I check before committing?" },
  { id: "agent", label: "How do I choose the right help?" },
  { id: "timing", label: "How do I get the timing right?" },
];

export interface DeskAnswer {
  kicker: string;
  heading: string;
  body: string;
  points: readonly string[];
  /** The fuller explanation, shown on request. */
  detailTitle: string;
  detail: string;
  /** Where to go next: the tools and guides that answer it. */
  links: readonly StartingPoint[];
}

export const DESK: Record<Move, Record<QuestionId, DeskAnswer>> = {
  buying: {
    cost: {
      kicker: "Buying costs",
      heading: "Look beyond the deposit.",
      body: "A purchase has upfront costs as well as repayments. The guides explain what to allow for and which figures need confirming.",
      points: ["Stamp duty and other upfront costs", "Borrowing estimates and repayments", "What grants and concessions depend on"],
      detailTitle: "Start with the full picture",
      detail: "Use the stamp duty, borrowing power and repayment calculators together. Each explains its assumptions; a lender confirms what you can borrow.",
      links: [
        { label: "Stamp duty calculator", href: "/stamp-duty-calculator" },
        { label: "Borrowing power calculator", href: "/borrowing-power-calculator" },
        { label: "Mortgage repayments", href: "/mortgage-calculator" },
      ],
    },
    checks: {
      kicker: "Property checks",
      heading: "Understand what you’re buying.",
      body: "An inspection is a starting point. The guides explain the questions, records and professional checks that can help you assess a property.",
      points: ["Building and pest inspections", "Strata records where relevant", "Contracts and the checks before an offer"],
      detailTitle: "A checklist for consistent inspections",
      detail: "Use the same questions each time you inspect. The guide points out what to look for and which matters need a qualified inspector, solicitor or conveyancer.",
      links: [
        { label: "Due diligence checklist", href: "/guides/due-diligence-checklist-buying-a-house" },
        { label: "Building and pest inspections", href: "/guides/building-pest-inspection" },
        { label: "Inspecting a property", href: chapterHref("buying", 5) },
      ],
    },
    agent: {
      kicker: "Choosing help",
      heading: "Know who each person works for.",
      body: "A selling agent acts for the seller. A buyer’s agent acts for the buyer and charges their own fee. Our guide explains the difference.",
      points: ["What a buyer’s agent does", "How to compare the service and fees", "When you may prefer to buy without one"],
      detailTitle: "Make the scope clear",
      detail: "Read what a buyer’s agent can help with, what to ask before engaging one and how to understand the proposed fee. An introduction is a separate choice.",
      links: [
        { label: "Buyer’s agents explained", href: "/buyers-agents" },
        { label: "What a buyer’s agent costs", href: "/guides/buyers-agent-cost-australia" },
      ],
    },
    timing: {
      kicker: "Planning a move",
      heading: "Take the process one step at a time.",
      body: "Finance, inspections, offers and settlement each have their own decisions. A plan helps you see the sequence.",
      points: ["Budget and pre-approval", "Inspections and preparing an offer", "Contracts, finance and settlement"],
      detailTitle: "A sequence to work through",
      detail: "The buying guide includes a timeline you can use alongside the dates and professional advice that apply to your purchase.",
      links: [
        { label: "Your 12-week buying timeline", href: chapterHref("buying", 10) },
        { label: "How long buying takes", href: "/guides/how-long-does-it-take-to-buy-a-house-australia" },
      ],
    },
  },
  selling: {
    cost: {
      kicker: "Selling costs",
      heading: "Work out what you could have left.",
      body: "Commission is one part of selling. The calculator brings the other costs together so you can see the effect on the money available for your next move.",
      points: ["Agent commission and GST", "Marketing and legal costs", "Mortgage payout and the amount left"],
      detailTitle: "Compare costs on the same basis",
      detail: "The selling-costs calculator shows its assumptions and a breakdown. The agent proposal worksheet helps compare proposals using the same expected sale price.",
      links: [
        { label: "Selling costs calculator", href: "/selling-costs-calculator" },
        { label: "Agent proposal worksheet", href: "/tools/agent-proposal-worksheet" },
        { label: "Agent fees and commission", href: "/guides/real-estate-agent-fees-australia" },
      ],
    },
    checks: {
      kicker: "Preparing to sell",
      heading: "Decide what is worth doing first.",
      body: "Preparation can range from a clean-out to more substantial work. The guides help you compare the cost with what buyers are likely to value.",
      points: ["Repairs, presentation and quotes", "Work that may not be worth doing", "Price evidence before committing to a budget"],
      detailTitle: "Start with the property in front of you",
      detail: "Read what to fix before selling and what may be better left alone. The Hamilton example below shows one redesign decision; its expected figures are not a general return promise.",
      links: [
        { label: "What to fix before selling", href: "/guides/what-to-fix-before-selling-a-house" },
        { label: "Preparing your property", href: chapterHref("selling", 4) },
      ],
    },
    agent: {
      kicker: "Comparing agents",
      heading: "Ask each agent the same questions.",
      body: "Compare the proposed work and costs alongside local evidence. A high price estimate alone does not explain how the sale would be handled.",
      points: ["Recent relevant sales", "Marketing, communication and fees", "The term and conditions of the agreement"],
      detailTitle: "Put the proposals side by side",
      detail: `The worksheet compares costs at the same sale price. If you have an agency agreement to sign, a free ${AGREEMENT_CHECK.minutes}-minute general-information check is also available.`,
      links: [
        { label: "Agent proposal worksheet", href: "/tools/agent-proposal-worksheet" },
        { label: "Choosing a selling agent", href: "/guides/how-to-choose-a-selling-agent" },
        { label: `Free ${AGREEMENT_CHECK.minutes}-minute agreement check`, href: AGREEMENT_CHECK.href },
      ],
    },
    timing: {
      kicker: "Planning a sale",
      heading: "See the decisions before the deadline.",
      body: "Preparation, selecting an agent, marketing and settlement each take planning. The guide gives you a sequence to adapt to your move.",
      points: ["Preparing the property and documents", "Choosing the agent and sale method", "Offers, conditions and settlement"],
      detailTitle: "A timeline you can adapt",
      detail: "The selling guide includes a 12-week timeline. Actual dates depend on the property, the work needed and the sale you agree.",
      links: [
        { label: "Your 12-week selling timeline", href: chapterHref("selling", 10) },
        { label: "Is now the right time to sell?", href: chapterHref("selling", 1) },
      ],
    },
  },
  both: {
    cost: {
      kicker: "Costs on both sides",
      heading: "Put the whole move on one page.",
      body: "Look at the selling costs, the purchase costs and the finance questions together. A sale price alone does not tell you what is available for the next home.",
      points: ["Selling costs and mortgage payout", "Purchase costs and deposit", "Repayments and any finance overlap"],
      detailTitle: "Start with both budgets",
      detail: "Use the selling-costs and purchase-cost tools, then list the timing and finance questions to confirm with your lender and conveyancer.",
      links: [
        { label: "Selling costs calculator", href: "/selling-costs-calculator" },
        { label: "Stamp duty calculator", href: "/stamp-duty-calculator" },
        { label: "Bridging loan calculator", href: "/bridging-loan-calculator" },
      ],
    },
    checks: {
      kicker: "Linked commitments",
      heading: "Understand what each agreement commits you to.",
      body: "A sale and a purchase can have different conditions and dates. The guides explain the questions to resolve on each side.",
      points: ["Agency and sale agreements", "The property you plan to buy", "Finance, conditions and settlement"],
      detailTitle: "Keep both sets of decisions visible",
      detail: "Use the seller’s agreement guidance alongside the buyer’s due-diligence checklist. A solicitor or conveyancer can explain how the contracts apply to your move.",
      links: [
        { label: "Due diligence checklist", href: "/guides/due-diligence-checklist-buying-a-house" },
        { label: `Free ${AGREEMENT_CHECK.minutes}-minute agreement check`, href: AGREEMENT_CHECK.href },
      ],
    },
    agent: {
      kicker: "Choosing help",
      heading: "Make each person’s role clear.",
      body: "The agent selling your current home and anyone helping you buy have different jobs. Understand their scope and fees separately.",
      points: ["A proposal for selling your home", "What buying help would involve", "Separate fees and permissions"],
      detailTitle: "One introduction for each service you request",
      detail: "Buying and selling are separate introductions. Each needs its own permission, and availability depends on the participating network.",
      links: [
        { label: "How introductions work", href: "/get-help" },
        { label: "Choosing a selling agent", href: "/guides/how-to-choose-a-selling-agent" },
      ],
    },
    timing: {
      kicker: "Selling and buying",
      heading: "Compare which order works for you.",
      body: "Selling first and buying first bring different timing and finance questions. The guide helps you put those trade-offs side by side.",
      points: ["Selling first versus buying first", "An overlap or a temporary gap", "Finance and settlement questions"],
      detailTitle: "Work through the trade-offs",
      detail: "The buying-and-selling guide explains the two sequences and the questions to ask about finance, settlement and moving dates.",
      links: [
        { label: "Sell first or buy first?", href: "/guides/sell-first-or-buy-first" },
        { label: "Buying and selling", href: "/buying-and-selling" },
      ],
    },
  },
};

/** The introduction band's preview for each move (the approved design's words, within src/lib/service-model.ts). */
export const INTRO_PREVIEW: Record<Move, { heading: string; body: string }> = {
  buying: {
    heading: "A buyer’s agent acts for the buyer.",
    body: "Our buyer’s-agent network is still being built. We review requests and explain whether an introduction is available. Reading a guide or making a plan does not send a request.",
  },
  selling: {
    heading: "One participating selling agent, with permission.",
    body: "An introduction is for an appraisal and a proposal to sell. You decide whether to engage the agent. If our network does not cover the suburb, we explain that before anything is sent.",
  },
  both: {
    heading: "Separate introductions for separate jobs.",
    body: "If you ask for both selling and buying help, each introduction needs its own permission. We explain availability and the contact arrangements before sending a request.",
  },
};

/** The Hamilton band's question and what it means for each reader. */
export const CASE_CONTEXT: Record<Move, { heading: string; context: string }> = {
  buying: {
    heading: "What could a different layout change?",
    context: "For a buyer, it’s a reminder to separate what can be changed from what needs professional checks and a realistic budget.",
  },
  selling: {
    heading: "Should we renovate before selling?",
    context: "It’s an example of looking at the property before deciding where to spend.",
  },
  both: {
    heading: "Which changes are worth considering?",
    context: "Preparation is one part of the move. The useful question is how the work, budget and timing fit together.",
  },
};
