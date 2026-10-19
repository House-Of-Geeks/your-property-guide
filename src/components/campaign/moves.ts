// What the homepage says for each move (19 Oct 2026). Picking selling,
// buying or both in the hero changes the supporting message, the sample plan
// beside the button, the calculator under the hero, the tools that help you
// decide, and the agent the next action points at. One table, so the parts
// can't disagree about who they're talking to.

import type { NumbersTool } from "@/components/interactive/NumbersPanel";
import type { Move } from "@/components/interactive/move-context";
import type { PlanAnswers } from "@/lib/plans/questions";
import { AGREEMENT_CHECK } from "@/lib/service-model";

export interface DecisionTool {
  title: string;
  href: string;
  /** "Helps you decide …": the one decision the tool is for. */
  decides: string;
  body: string;
  /** Small print under the card (the agreement check's general-information line). */
  note?: string;
  /** A 15-minute call, not a tool: shown with a phone-call label. */
  kind?: "call";
}

export interface HomeMove {
  id: Move;
  label: string;
  placeholder: string;
  fieldLabel: string;
  message: string;
  /** The answers the hero's sample plan is built from (src/lib/plans/engine.ts), so the preview is a real plan. */
  sample: PlanAnswers;
  sampleNote: string;
  tools: readonly NumbersTool[];
  toolsTitle: string;
  toolsLead: string;
  decide: readonly DecisionTool[];
  agent: { service: "selling-agent" | "buyers-agent" | "both"; label: string };
}

const agreementCheck: DecisionTool = {
  title: `Free ${AGREEMENT_CHECK.minutes}-minute agreement check`,
  href: `${AGREEMENT_CHECK.href}?from=home-decide`,
  decides: "whether to sign the agency agreement you’ve been handed",
  body: "A call with our team before you sign: the commission, the marketing spend, the term and the exit clause.",
  note: AGREEMENT_CHECK.notAdvice,
  kind: "call",
};

const proposalWorksheet: DecisionTool = {
  title: "Agent proposal worksheet",
  href: "/tools/agent-proposal-worksheet",
  decides: "which agent’s proposal is better value, in dollars",
  body: "Put two or three proposals side by side: each one’s total cost at the same price, what you’d keep, and what to ask.",
};

const sellingCosts: DecisionTool = {
  title: "Selling costs calculator",
  href: "/selling-costs-calculator",
  decides: "your walk-away number before any agent quotes you",
  body: "Commission, marketing, conveyancing and your loan payout, for your state, with what you’d keep.",
};

export const HOME_MOVES: Record<Move, HomeMove> = {
  selling: {
    id: "selling",
    label: "Selling",
    placeholder: "Your address or suburb",
    fieldLabel: "Where’s the property?",
    message: "Know your walk-away number, prepare for the buyer who’ll pay most, and choose your agent on evidence, not the highest quote.",
    sample: { journey: "selling", state: null, timeframe: null, sellStage: "preparing" },
    sampleNote: "A sample plan for someone getting ready to sell. Yours follows your answers.",
    tools: ["sell"],
    toolsTitle: "What would you walk away with?",
    toolsLead: "The real cost of selling in your state, live as you drag. Nothing you enter leaves this page.",
    decide: [sellingCosts, proposalWorksheet, agreementCheck],
    agent: { service: "selling-agent", label: "Find a selling agent" },
  },
  buying: {
    id: "buying",
    label: "Buying",
    placeholder: "Suburb or postcode",
    fieldLabel: "Where are you buying?",
    message: "Know what you can spend and the upfront costs, then learn how the seller’s campaign works so you can answer it.",
    sample: { journey: "buying", state: null, timeframe: null, buyStage: "starting", buyerType: "next-home" },
    sampleNote: "A sample plan for someone starting to buy. Yours follows your answers.",
    tools: ["duty", "borrow"],
    toolsTitle: "What will it cost to buy?",
    toolsLead: "Stamp duty for your state and a rough borrowing figure, live as you drag. Nothing you enter leaves this page.",
    decide: [
      {
        title: "Borrowing power calculator",
        href: "/borrowing-power-calculator",
        decides: "the price range to search in",
        body: "A rough figure in two minutes, with the lender’s buffer built in and no credit check.",
      },
      {
        title: "First home buyers, state by state",
        href: "/first-home-buyers",
        decides: "which grants, concessions and schemes you can use",
        body: "The rules, caps and dates for each state, checked and dated.",
      },
      {
        title: "Due diligence checklist",
        href: "/guides/due-diligence-checklist-buying-a-house",
        decides: "whether a property is worth an offer",
        body: "What to check before you commit: the building, the strata, the contract and the surrounds.",
      },
    ],
    agent: { service: "buyers-agent", label: "Find a buyer’s agent" },
  },
  both: {
    id: "both",
    label: "Both",
    placeholder: "The address or suburb you’re selling",
    fieldLabel: "Where’s the property you’re selling?",
    message: "Get the order right, price the gap between selling and buying, and keep both sides on one timeline.",
    sample: { journey: "buying-and-selling", state: null, timeframe: null, order: "undecided" },
    sampleNote: "A sample plan for someone selling and buying. Yours follows your answers.",
    tools: ["sell", "duty"],
    toolsTitle: "Price both sides of the move.",
    toolsLead: "What you’d keep from the sale and the duty on the next purchase, live as you drag. Nothing you enter leaves this page.",
    decide: [
      {
        title: "Sell first or buy first?",
        href: "/guides/sell-first-or-buy-first",
        decides: "the order, with worked examples",
        body: "Certainty about money against certainty about where you’ll live, and what each costs.",
      },
      {
        title: "Bridging loan calculator",
        href: "/bridging-loan-calculator",
        decides: "whether you can afford to buy before you sell",
        body: "Peak debt, interest while you sell, and the cost against selling first.",
      },
      agreementCheck,
    ],
    agent: { service: "both", label: "Find an agent" },
  },
};

export const MOVE_ORDER: readonly Move[] = ["selling", "buying", "both"];
