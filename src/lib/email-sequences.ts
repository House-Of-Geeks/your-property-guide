// Optional guidance email series (Oct 2026). Short, stage-specific, and only
// for people who ticked the box for it on a plan or a guide. Separate from
// the newsletter signup (src/lib/newsletter.ts): joining a series doesn't
// sign anyone up to that.
//
// /api/cron/follow-ups sends the next email when it falls due (switched on by
// GUIDANCE_SEQUENCE_ENABLED=true; src/lib/flags.ts, which also hides the
// box on the forms while it's off), and every email carries an unsubscribe
// link (/api/unsubscribe). Each email teaches one thing and links to one
// guide or tool; none of them asks for an introduction.

import type { Journey } from "@/lib/lead-kinds";

export type SequenceId = "seller-early" | "seller-choosing" | "buyer-early" | "buyer-active" | "mover";

export interface SequenceEmail {
  /** Days after the person signed up. */
  day: number;
  subject: string;
  paragraphs: string[];
  points: string[];
  link: { label: string; href: string };
}

export interface Sequence {
  id: SequenceId;
  label: string;
  /** What the opt-in box says the person will get. */
  promise: string;
  emails: SequenceEmail[];
}

export const SEQUENCES: Record<SequenceId, Sequence> = {
  "seller-early": {
    id: "seller-early",
    label: "getting ready to sell",
    promise: "Four short emails over three weeks on getting ready to sell: costs, repairs, value and choosing an agent.",
    emails: [
      {
        day: 3,
        subject: "What you’d actually keep from a sale",
        paragraphs: ["Before you talk to any agent, it helps to know your own numbers. The sale price is only the start."],
        points: [
          "Commission is usually the biggest cost, and it’s negotiable",
          "Marketing is often paid whether or not the property sells: ask for a cap",
          "Your loan payout and any fixed-rate break costs come off the top",
        ],
        link: { label: "Work out what you’d keep", href: "/selling-costs-calculator" },
      },
      {
        day: 8,
        subject: "The repairs worth doing before you sell",
        paragraphs: ["Buyers notice what’s broken far more than what’s dated. Small, cheap fixes usually pay back; big renovations often don’t."],
        points: ["Fix leaks, sticking doors and blown globes", "Clear out about a third of each room", "Tidy the front: it’s the first photo"],
        link: { label: "What to fix before selling", href: "/guides/what-to-fix-before-selling-a-house" },
      },
      {
        day: 14,
        subject: "How to read an agent’s appraisal",
        paragraphs: ["An agent’s price estimate is an opinion until it’s backed by sales. Ask every agent the same question: which sales support that figure?"],
        points: ["Look for recent sales of similar homes nearby", "Be wary of an estimate far above the others", "A range should be narrow enough to be useful"],
        link: { label: "Preparing for an appraisal", href: "/guides/how-to-prepare-for-a-property-appraisal" },
      },
      {
        day: 21,
        subject: "Choosing an agent without the guesswork",
        paragraphs: ["Compare agents on evidence and in dollars. The proposal worksheet puts up to three side by side."],
        points: ["Same questions for every agent", "Total cost in dollars at the same price", "Read the agency agreement’s term and exit before you sign"],
        link: { label: "Agent proposal worksheet", href: "/tools/agent-proposal-worksheet" },
      },
    ],
  },
  "seller-choosing": {
    id: "seller-choosing",
    label: "choosing a selling agent",
    promise: "Three short emails over ten days on interviewing agents, comparing proposals and the fee.",
    emails: [
      {
        day: 2,
        subject: "The questions to ask every agent you meet",
        paragraphs: ["Ask every agent the same questions, and write down the answers."],
        points: ["Which sales support your price?", "Who will actually negotiate for me?", "What does marketing cost, and is it capped?"],
        link: { label: "Questions to ask an agent", href: "/guides/questions-to-ask-a-real-estate-agent" },
      },
      {
        day: 5,
        subject: "Comparing proposals in dollars",
        paragraphs: ["A lower rate isn’t always a lower cost. Compare what each proposal would cost you at the same sale price."],
        points: ["Commission in dollars", "Marketing, and whether you pay it if unsold", "The agreement’s term and exit"],
        link: { label: "Agent proposal worksheet", href: "/tools/agent-proposal-worksheet" },
      },
      {
        day: 10,
        subject: "Negotiating the fee, calmly",
        paragraphs: ["Most agents expect a conversation about commission. Structure matters as much as the rate."],
        points: ["Ask about a tiered rate above a target price", "Agree marketing costs in writing", "Don’t trade away the agent’s motivation for a small saving"],
        link: { label: "Negotiating commission", href: "/guides/how-to-negotiate-real-estate-agent-commission" },
      },
    ],
  },
  "buyer-early": {
    id: "buyer-early",
    label: "getting ready to buy",
    promise: "Four short emails over three weeks on budgets, schemes, pre-approval and inspections.",
    emails: [
      {
        day: 3,
        subject: "The budget a lender sees",
        paragraphs: ["Lenders test your repayments at a rate about 3 percentage points above the actual one. Test yourself the same way before you fall for a place."],
        points: ["Borrowing power is a ceiling, not a target", "Keep a buffer for rate rises", "Count stamp duty and legal costs on top of the deposit"],
        link: { label: "Borrowing power calculator", href: "/borrowing-power-calculator" },
      },
      {
        day: 8,
        subject: "Grants, concessions and schemes",
        paragraphs: ["First home buyers may pay less stamp duty, get a grant on a new home, or buy with a smaller deposit through a federal scheme. Each has its own caps and dates."],
        points: ["Check your state’s rules for your contract date", "The 5% Deposit Scheme has price caps by area", "Help to Buy has income limits"],
        link: { label: "First home buyer guide", href: "/guides/first-home-buyer-guide" },
      },
      {
        day: 14,
        subject: "What pre-approval does, and doesn’t, mean",
        paragraphs: ["Pre-approval tells you a likely limit and makes offers credible. It isn’t a guarantee, and it expires."],
        points: ["Ask what conditions apply", "Avoid new debts before settlement", "Renew it if your search runs long"],
        link: { label: "Home loan pre-approval", href: "/guides/home-loan-pre-approval-australia" },
      },
      {
        day: 21,
        subject: "Your inspection checklist",
        paragraphs: ["The same checklist at every inspection stops you missing what matters."],
        points: ["Look for water damage", "Run taps and open every window", "Ask how long it’s been listed"],
        link: { label: "Due diligence checklist", href: "/guides/due-diligence-checklist-buying-a-house" },
      },
    ],
  },
  "buyer-active": {
    id: "buyer-active",
    label: "making an offer",
    promise: "Three short emails over ten days on due diligence, negotiating and auctions.",
    emails: [
      {
        day: 2,
        subject: "Before you offer: the checks that matter",
        paragraphs: ["A contract review and a building and pest inspection are cheap next to the problems they find."],
        points: ["Have the contract reviewed first", "Read the whole inspection report", "For units, read the strata records"],
        link: { label: "Due diligence checklist", href: "/guides/due-diligence-checklist-buying-a-house" },
      },
      {
        day: 5,
        subject: "Setting your limit",
        paragraphs: ["Decide your limit from real sales before you negotiate, and write it down."],
        points: ["Check the price guide against recent sold prices", "Know what would make you walk away", "Conditions can be worth more than a small discount"],
        link: { label: "Negotiating the price", href: "/guides/how-to-negotiate-property-price-australia" },
      },
      {
        day: 10,
        subject: "Auctions: prepare as if it’s unconditional",
        paragraphs: ["At auction there’s usually no cooling-off and no conditions. Everything has to be done first."],
        points: ["Finance confirmed", "Inspections done", "Contract reviewed and your limit set"],
        link: { label: "Buying at auction", href: "/guides/property-auction-guide" },
      },
    ],
  },
  mover: {
    id: "mover",
    label: "selling and buying",
    promise: "Three short emails over two weeks on the order, the money in between, and lining up the dates.",
    emails: [
      {
        day: 3,
        subject: "Sell first or buy first?",
        paragraphs: ["Selling first gives you certainty about money; buying first, about where you’ll live. Your market decides which matters more."],
        points: ["In a slow market, selling first is safer", "In a fast market, buying first can cost you a bridging loan", "A long settlement or rent-back can split the difference"],
        link: { label: "Sell first or buy first?", href: "/guides/sell-first-or-buy-first" },
      },
      {
        day: 7,
        subject: "The money in between",
        paragraphs: ["If the timing doesn’t line up, the gap has a cost. Know it before you sign either contract."],
        points: ["Bridging loans charge interest on both loans", "Subject-to-sale offers are weaker", "Rent-backs and long settlements cost little to ask for"],
        link: { label: "Bridging loan calculator", href: "/bridging-loan-calculator" },
      },
      {
        day: 14,
        subject: "Lining up two settlements",
        paragraphs: ["Ask both conveyancers to align the settlement dates, or leave a few days’ buffer."],
        points: ["Book removalists for the gap you’ve chosen", "Insure the new home from the date your contract requires", "Keep finance current until both settle"],
        link: { label: "Settlement day", href: "/guides/settlement-day-australia" },
      },
    ],
  },
};

/** The series that fits a journey and stage (plan or guide answers). */
export function sequenceFor(journey: Journey, stage: string | null | undefined): SequenceId {
  if (journey === "buying-and-selling") return "mover";
  if (journey === "selling") return stage === "choosing-agent" || stage === "comparing" ? "seller-choosing" : "seller-early";
  return stage === "searching" || stage === "offer" ? "buyer-active" : "buyer-early";
}

/** When email `step` (0-based) is due for someone who joined at `joinedAt`. */
export function dueAt(seq: SequenceId, step: number, joinedAt: Date): Date | null {
  const email = SEQUENCES[seq].emails[step];
  if (!email) return null;
  return new Date(joinedAt.getTime() + email.day * 86_400_000);
}
