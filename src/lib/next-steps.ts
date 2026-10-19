// The next step after a priority guide or calculator (Oct 2026). Each one
// fits why people read that page: a worksheet after the agent-selection
// guides, a moving plan after sell-first-or-buy-first, the buyer's agent
// explainer after the fee guide. Personal help is offered as a quiet,
// optional line (its own form, its own permission), never as the default.
// Pages without an entry keep their guide funnel.

import type { NextStepAction } from "@/components/journeys/NextStepCard";

export interface ContextualNextStep {
  title: string;
  body: string;
  primary: NextStepAction;
  secondary: NextStepAction[];
  help?: { text: string; label: string; href: string };
}

const help = (service: "selling-agent" | "buyers-agent" | "both", from: string, text: string, label: string) => ({
  text,
  label,
  href: `/get-help?service=${service}&from=${from}`,
});

const STATES = ["nsw", "vic", "qld", "wa", "sa", "tas", "act", "nt"] as const;

function chooseAgent(slug: string): ContextualNextStep {
  return {
    title: "Compare the agents you meet, in dollars",
    body: "Put each agent’s price estimate, commission, marketing and terms into the worksheet. It shows what each would cost you at the same sale price, and flags the things worth asking about.",
    primary: { label: "Open the proposal worksheet", href: "/tools/agent-proposal-worksheet" },
    secondary: [
      { label: "Build my next-step plan", href: "/plan?j=selling&ss=choosing-agent" },
      { label: "Questions to ask an agent", href: "/guides/questions-to-ask-a-real-estate-agent" },
    ],
    help: help("selling-agent", slug, "Want one more proposal to compare?", "Ask us to introduce one participating local agent"),
  };
}

function sellingCosts(slug: string): ContextualNextStep {
  return {
    title: "Turn the costs into your own numbers",
    body: "The selling costs calculator works out what you’d keep after commission, marketing, conveyancing and your loan payout. Then a selling plan puts the next steps in order.",
    primary: { label: "Work out what you’d keep", href: "/selling-costs-calculator" },
    secondary: [{ label: "Build my next-step plan", href: "/plan?j=selling&ss=preparing" }],
    help: help("selling-agent", slug, "Ready for an appraisal?", "Ask for an introduction to one participating agent"),
  };
}

function preparing(slug: string): ContextualNextStep {
  return {
    title: "Make a plan for your sale",
    body: "Your next three steps, a preparation checklist and the questions to settle before you meet agents, for your state and timing.",
    primary: { label: "Build my next-step plan", href: "/plan?j=selling" },
    secondary: [
      { label: "Selling costs calculator", href: "/selling-costs-calculator" },
      { label: "Agent proposal worksheet", href: "/tools/agent-proposal-worksheet" },
    ],
    help: help("selling-agent", slug, "Ready for an appraisal?", "Ask for an introduction to one participating agent"),
  };
}

const MOVING: (slug: string) => ContextualNextStep = (slug) => ({
  title: "Make a plan for selling and buying",
  body: "A coordinated moving plan: which comes first, the money in between, and lining up the two settlements, with the tools for each step.",
  primary: { label: "Build my next-step plan", href: "/plan?j=buying-and-selling" },
  secondary: [
    { label: "Bridging loan calculator", href: "/bridging-loan-calculator" },
    { label: "Buying and selling: where to start", href: "/buying-and-selling" },
  ],
  help: help("both", slug, "Want help with one side or both?", "Ask for an introduction (each needs its own yes)"),
});

const BUYERS_AGENT: (slug: string) => ContextualNextStep = (slug) => ({
  title: "Is a buyer’s agent right for you?",
  body: "What a buyer’s agent does, how they’re paid, when they’re worth it, and the questions to ask before you sign an engagement.",
  primary: { label: "What a buyer’s agent does", href: "/buyers-agents" },
  secondary: [{ label: "Build my next-step plan", href: "/plan?j=buying&h=buyers-agent" }],
  help: help("buyers-agent", slug, "Want to talk to one?", "Ask about a buyer’s agent (we’ll tell you honestly if we can help)"),
});

const FIRST_HOME: ContextualNextStep = {
  title: "Make a first home plan",
  body: "Your next three steps for your state, with the grant, stamp duty and federal scheme checks in order, and a checklist before you start looking.",
  primary: { label: "Make a first home plan", href: "/plan?j=buying&bt=first-home" },
  secondary: [
    { label: "Stamp duty calculator", href: "/stamp-duty-calculator" },
    { label: "Borrowing power calculator", href: "/borrowing-power-calculator" },
  ],
};

const MAP: Record<string, (slug: string) => ContextualNextStep> = {
  "how-to-choose-a-selling-agent": chooseAgent,
  "questions-to-ask-a-real-estate-agent": chooseAgent,
  "how-to-negotiate-real-estate-agent-commission": chooseAgent,
  "real-estate-agent-fees-australia": chooseAgent,
  "real-estate-commission-calculator": chooseAgent,
  ...Object.fromEntries(STATES.map((s) => [`real-estate-commission-${s}`, chooseAgent])),
  "cost-of-selling-a-house-australia": sellingCosts,
  ...Object.fromEntries(STATES.map((s) => [`cost-of-selling-a-house-${s}`, sellingCosts])),
  "how-to-prepare-for-a-property-appraisal": preparing,
  "how-much-is-my-house-worth-australia": preparing,
  "what-to-fix-before-selling-a-house": preparing,
  "best-time-to-sell-a-house-australia": preparing,
  "how-to-sell-a-house-australia": preparing,
  "home-staging-cost-australia": preparing,
  "auction-vs-private-treaty": preparing,
  "sell-first-or-buy-first": MOVING,
  "bridging-loans-guide": MOVING,
  "bridging-loan-alternatives": MOVING,
  "bridging-loan-calculator": MOVING,
  "buyers-agent-cost-australia": BUYERS_AGENT,
  "first-home-buyer-guide": () => FIRST_HOME,
  ...Object.fromEntries(STATES.map((s) => [`first-home-buyer-${s}`, () => FIRST_HOME])),
};

/** The selling costs calculator's own step: what the result means, then the plan. */
const SELLING_COSTS_CALCULATOR: ContextualNextStep = {
  title: "What your result means",
  body: "This is an estimate from typical costs, not a quote. Commission and marketing are negotiable, so ask every agent for theirs in writing, then compare them in the worksheet. A selling plan puts the rest in order.",
  primary: { label: "Build my next-step plan", href: "/plan?j=selling&ss=preparing" },
  secondary: [{ label: "Agent proposal worksheet", href: "/tools/agent-proposal-worksheet" }],
  help: help("selling-agent", "selling-costs-calculator", "Want an appraisal to test the price?", "Ask for an introduction to one participating agent"),
};

export function nextStepFor(slug: string): ContextualNextStep | null {
  if (slug === "selling-costs-calculator") return SELLING_COSTS_CALCULATOR;
  const make = MAP[slug];
  return make ? make(slug) : null;
}

/** Every slug with a contextual next step (tests check each link resolves). */
export const NEXT_STEP_SLUGS: readonly string[] = ["selling-costs-calculator", ...Object.keys(MAP)];
