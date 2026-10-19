// Next-step plans (Oct 2026). Transparent rules, not a black box: each answer
// picks a block of existing guides, calculators and checklists. Every href is
// a real page on this site (tests/lib/plans.test.ts checks them all), and the
// copy never claims to be advice or a valuation.

import type { AustralianState } from "@/lib/utils/stamp-duty";
import type { IntroService } from "@/lib/service-model";
import { answersToParams, type PlanAnswers } from "./questions";

export interface PlanLink {
  label: string;
  href: string;
  note: string;
}

export interface PlanStep {
  title: string;
  body: string;
  link?: { label: string; href: string };
}

export interface PlanChecklistGroup {
  heading: string;
  items: string[];
}

export interface PlanHelp {
  /** "offer": a clear option to ask for help; "available": a quiet mention; "none": we won't introduce anyone. */
  level: "offer" | "available" | "none";
  services: IntroService[];
  headline: string;
  body: string;
  cta?: { label: string; href: string };
}

export interface Plan {
  title: string;
  intro: string;
  nextSteps: PlanStep[];
  tools: PlanLink[];
  guides: PlanLink[];
  checklist: { title: string; groups: PlanChecklistGroup[] };
  questions: string[];
  help: PlanHelp;
}

export const PLAN_DISCLAIMER =
  "This plan is general information built from your answers. It isn’t personal financial, legal or real estate advice, and it isn’t a valuation. Rules and costs change: check what applies to you with the official source or a licensed professional before you commit.";

// ---------------------------------------------------------------------------
// Links that depend on the state
// ---------------------------------------------------------------------------

const lc = (s: AustralianState) => s.toLowerCase();
const STATE_NAME: Record<AustralianState, string> = {
  NSW: "NSW", VIC: "Victoria", QLD: "Queensland", WA: "WA", SA: "SA", TAS: "Tasmania", ACT: "the ACT", NT: "the NT",
};
const inState = (s: AustralianState | null) => (s ? ` in ${STATE_NAME[s]}` : "");

const L = {
  sellingCostsCalc: { label: "Selling costs calculator", href: "/selling-costs-calculator", note: "What you’d walk away with after commission, marketing, conveyancing and your loan" },
  commissionCalc: { label: "Commission calculator", href: "/real-estate-commission-calculator", note: "An agent’s fee in dollars at your likely price" },
  proposalWorksheet: { label: "Agent proposal worksheet", href: "/tools/agent-proposal-worksheet", note: "Compare up to three agents’ proposals side by side, with the cost of each in dollars" },
  stampDutyCalc: { label: "Stamp duty calculator", href: "/stamp-duty-calculator", note: "Duty on your purchase, with first home concessions" },
  borrowingCalc: { label: "Borrowing power calculator", href: "/borrowing-power-calculator", note: "A rough idea of what a lender might lend" },
  mortgageCalc: { label: "Mortgage repayment calculator", href: "/mortgage-calculator", note: "What a loan costs each month, and with a higher rate" },
  lmiCalc: { label: "LMI calculator", href: "/lmi-calculator", note: "Lenders mortgage insurance below a 20% deposit" },
  bridgingCalc: { label: "Bridging loan calculator", href: "/bridging-loan-calculator", note: "The cost of buying before you sell" },
  yieldCalc: { label: "Rental yield calculator", href: "/rental-yield-calculator", note: "Rent against price, before and after costs" },
  fhssCalc: { label: "First Home Super Saver calculator", href: "/fhss-calculator", note: "Saving part of a deposit through super" },
  costOfSelling: (s: AustralianState | null): PlanLink =>
    s
      ? { label: `Cost of selling a house in ${STATE_NAME[s]}`, href: `/guides/cost-of-selling-a-house-${lc(s)}`, note: "Every cost of a sale in your state" }
      : { label: "Cost of selling a house", href: "/guides/cost-of-selling-a-house-australia", note: "Every cost of a sale, state by state" },
  commission: (s: AustralianState | null): PlanLink =>
    s
      ? { label: `Agent commission in ${STATE_NAME[s]}`, href: `/guides/real-estate-commission-${lc(s)}`, note: "Typical rates and how they’re structured" }
      : { label: "Real estate agent fees", href: "/guides/real-estate-agent-fees-australia", note: "Typical rates by state" },
  stampDuty: (s: AustralianState | null): PlanLink =>
    s
      ? { label: `Stamp duty in ${STATE_NAME[s]}`, href: `/guides/stamp-duty-${lc(s)}`, note: "Rates, concessions and worked examples" }
      : { label: "Stamp duty calculator", href: "/stamp-duty-calculator", note: "Duty in every state" },
  firstHome: (s: AustralianState | null): PlanLink =>
    s
      ? { label: `First home buyers in ${STATE_NAME[s]}`, href: `/guides/first-home-buyer-${lc(s)}`, note: "Grants, duty concessions and schemes in your state" }
      : { label: "First home buyer guide", href: "/guides/first-home-buyer-guide", note: "Grants and schemes in every state" },
  howToSell: { label: "How to sell a house", href: "/guides/how-to-sell-a-house-australia", note: "The whole process in order" },
  bestTimeToSell: { label: "The best time to sell", href: "/guides/best-time-to-sell-a-house-australia", note: "Seasons, rates and your own timing" },
  whatToFix: { label: "What to fix before selling", href: "/guides/what-to-fix-before-selling-a-house", note: "Jobs that pay back, and ones that don’t" },
  worth: { label: "What’s my home worth?", href: "/guides/how-much-is-my-house-worth-australia", note: "How to read recent sales yourself" },
  appraisalPrep: { label: "Preparing for an appraisal", href: "/guides/how-to-prepare-for-a-property-appraisal", note: "What to have ready, and how to test an agent’s price" },
  chooseAgent: { label: "How to choose a selling agent", href: "/guides/how-to-choose-a-selling-agent", note: "What to compare, and what to ignore" },
  agentQuestions: { label: "Questions to ask an agent", href: "/guides/questions-to-ask-a-real-estate-agent", note: "Take them to every appraisal" },
  negotiateCommission: { label: "Negotiating commission", href: "/guides/how-to-negotiate-real-estate-agent-commission", note: "Structures that reward a better result" },
  auctionVsPrivate: { label: "Auction or private sale?", href: "/guides/auction-vs-private-treaty", note: "Which method suits your property" },
  coolingOff: { label: "Cooling-off periods by state", href: "/guides/cooling-off-period-by-state-australia", note: "Who gets one, for how long, and what it costs to use" },
  settlement: { label: "Settlement day", href: "/guides/settlement-day-australia", note: "What happens, and what to check" },
  stagingCost: { label: "Home staging costs", href: "/guides/home-staging-cost-australia", note: "When styling is worth paying for" },
  deposit: { label: "How much deposit do you need?", href: "/guides/how-much-deposit-to-buy-a-house", note: "Deposits, LMI and the schemes that lower them" },
  borrow: { label: "How much can I borrow?", href: "/guides/how-much-can-i-borrow-australia", note: "How lenders work it out" },
  preApproval: { label: "Home loan pre-approval", href: "/guides/home-loan-pre-approval-australia", note: "What it is, what it isn’t, and how long it lasts" },
  broker: { label: "Choosing a mortgage broker", href: "/guides/how-to-choose-a-mortgage-broker", note: "Questions to ask, and how brokers are paid" },
  homeGuarantee: { label: "The 5% Deposit Scheme", href: "/guides/first-home-guarantee", note: "Buying with 5% down and no LMI" },
  dueDiligence: { label: "Due diligence checklist", href: "/guides/due-diligence-checklist-buying-a-house", note: "What to check before you commit" },
  buildingPest: { label: "Building and pest inspections", href: "/guides/building-pest-inspection", note: "What they find, and what they cost" },
  negotiatePrice: { label: "Negotiating the price", href: "/guides/how-to-negotiate-property-price-australia", note: "Offers, counter-offers and walking away" },
  auctionGuide: { label: "Buying at auction", href: "/guides/property-auction-guide", note: "How to prepare and how to bid" },
  conveyancing: { label: "Conveyancing", href: "/guides/conveyancing-guide", note: "What a conveyancer does, and what to ask" },
  buyersAgent: { label: "What a buyer’s agent does", href: "/buyers-agents", note: "What they do, what they charge, and when they’re worth it" },
  buyersAgentCost: { label: "Buyer’s agent fees", href: "/guides/buyers-agent-cost-australia", note: "Fixed fees, percentages and what’s included" },
  sellFirstBuyFirst: { label: "Sell first or buy first?", href: "/guides/sell-first-or-buy-first", note: "The trade-offs, with worked examples" },
  bridgingGuide: { label: "Bridging loans", href: "/guides/bridging-loans-guide", note: "How they work and what they cost" },
  bridgingAlternatives: { label: "Alternatives to a bridging loan", href: "/guides/bridging-loan-alternatives", note: "Long settlements, rent-backs and more" },
  investing: { label: "Capital growth or cash flow?", href: "/guides/capital-growth-vs-cash-flow-australia", note: "Two ways to judge an investment" },
  downsizers: { label: "Downsizing", href: "/guides/downsizers-guide", note: "Costs, super contributions and timing" },
  firstHomeMistakes: { label: "First home buyer mistakes", href: "/guides/first-home-buyer-mistakes-to-avoid", note: "The ones that cost the most" },
  suburbs: { label: "Suburb profiles", href: "/suburbs", note: "Recent prices and data for your area" },
} as const;

/** The introduction request, pre-filled from the plan (no personal data in the URL). */
export function helpHref(services: IntroService[], a: PlanAnswers): string {
  const qs = new URLSearchParams({ from: "plan" });
  qs.set("service", services.length > 1 ? "both" : services[0]);
  if (a.state) qs.set("state", a.state);
  if (a.timeframe) qs.set("timeframe", a.timeframe);
  if (a.suburb) qs.set("suburb", a.suburb);
  return `/get-help?${qs.toString()}`;
}

const NEAR = (a: PlanAnswers) => a.timeframe === "0-3-months" || a.timeframe === "3-6-months";

// ---------------------------------------------------------------------------
// Selling
// ---------------------------------------------------------------------------

const PREP_CHECKLIST: PlanChecklistGroup[] = [
  {
    heading: "Paperwork",
    items: [
      "Find your title details and latest council rates notice",
      "Ask your lender for a payout figure and any break costs on a fixed loan",
      "Gather approvals for any renovations, extensions or pools",
      "Ask a conveyancer what your state requires in the contract and any disclosure statement",
    ],
  },
  {
    heading: "The property",
    items: [
      "Fix what’s broken: leaks, sticking doors, cracked tiles, blown globes",
      "Clear out: aim to remove about a third of what’s in each room",
      "Tidy the front: garden, letterbox, front door and path",
      "Decide whether to commission your own building and pest report",
    ],
  },
  {
    heading: "Timing",
    items: [
      "Note school terms, holidays and local events that affect buyers",
      "Decide whether you need to buy before you sell, or rent in between",
    ],
  },
];

function sellingPlan(a: PlanAnswers): Plan {
  const s = a.state;
  const stage = a.sellStage ?? "thinking";

  if (stage === "listed") {
    return {
      title: "Your next-step plan: from campaign to settlement",
      intro: "You’ve chosen your agent, so we won’t introduce another. Here’s what helps between now and handing over the keys.",
      nextSteps: [
        {
          title: "Agree checkpoints with your agent",
          body: "Ask for buyer feedback after each open home and a weekly update with enquiry numbers. If interest is thin by week three, review the price guide together.",
          link: { label: "How a sale runs, step by step", href: L.howToSell.href },
        },
        {
          title: "Know your walk-away number",
          body: "Recheck what you’d keep after commission, marketing, conveyancing and your loan, so you can judge offers quickly and calmly.",
          link: { label: "Selling costs calculator", href: L.sellingCostsCalc.href },
        },
        {
          title: "Get the contract side ready",
          body: `Cooling-off rules, deposits and settlement periods differ by state. Know the rules${inState(s)} before the offers arrive.`,
          link: { label: "Cooling-off periods by state", href: L.coolingOff.href },
        },
      ],
      tools: [L.sellingCostsCalc, L.commissionCalc],
      guides: [L.coolingOff, L.settlement, L.costOfSelling(s), L.auctionVsPrivate],
      checklist: {
        title: "From offer to settlement",
        groups: [
          { heading: "Before offers", items: ["Confirm with your conveyancer that the contract is ready", "Decide which conditions you’ll accept (finance, building and pest)"] },
          { heading: "Comparing offers", items: ["Weigh price, conditions, deposit and settlement date together, not price alone", "Ask your agent for every offer in writing"] },
          { heading: "After exchange", items: ["Keep the home insured until settlement", "Book removalists and final meter readings", "Check the settlement date works for your next move"] },
        ],
      },
      questions: [
        "What conditions are you willing to accept in a contract?",
        "What settlement period suits your next move?",
        "What happens to the deposit if a buyer pulls out?",
      ],
      help: {
        level: "none",
        services: [],
        headline: "We won’t introduce another selling agent",
        body: "You’re signed with an agent, so introducing another wouldn’t be fair to you or to them. If you’re also buying, the buying plan covers the purchase.",
        cta: { label: "Build a next-step plan for both", href: "/plan?j=buying-and-selling" },
      },
    };
  }

  if (stage === "choosing-agent") {
    return {
      title: "Your next-step plan: choosing the right agent",
      intro: "The agent you choose affects your price, your costs and how the sale feels. Compare them on evidence and in dollars, not on the highest estimate.",
      nextSteps: [
        {
          title: "Interview every agent with the same questions",
          body: "Ask each one for the sales that support their price, their marketing plan and costs, and who will actually negotiate for you.",
          link: { label: "Questions to ask an agent", href: L.agentQuestions.href },
        },
        {
          title: "Compare proposals side by side",
          body: "Put each agent’s price estimate, commission, marketing and terms into the worksheet. It shows what each would cost you in dollars at the same price.",
          link: { label: "Agent proposal worksheet", href: L.proposalWorksheet.href },
        },
        {
          title: "Check the fee before you sign",
          body: `Know the usual range${inState(s)}, and negotiate the structure as well as the rate.`,
          link: { label: L.commission(s).label, href: L.commission(s).href },
        },
      ],
      tools: [L.proposalWorksheet, L.commissionCalc, L.sellingCostsCalc],
      guides: [L.chooseAgent, L.agentQuestions, L.negotiateCommission, L.commission(s), L.auctionVsPrivate],
      checklist: {
        title: "Agent interview checklist",
        groups: [
          {
            heading: "Ask every agent",
            items: [
              "Which recent sales support your price estimate?",
              "How will you market it, and what will that cost me?",
              "Who runs the open homes and the negotiation: you, or someone else?",
              "How and how often will you report buyer feedback?",
            ],
          },
          {
            heading: "Read in the agency agreement",
            items: [
              "The commission, and exactly when it becomes payable",
              "The term, and the notice needed to end it",
              "Marketing costs: fixed or capped, and payable if it doesn’t sell?",
              "Any period after the term ends when the agent can still claim commission",
            ],
          },
          {
            heading: "Be wary of",
            items: [
              "A price estimate well above the others with no sales to back it",
              "Pressure to sign at the first meeting",
              "Uncapped marketing costs paid upfront",
            ],
          },
        ],
      },
      questions: [
        "Is the highest estimate backed by sales, or is it there to win your listing?",
        "What will each agent cost you in total, in dollars, at your likely price?",
        "Which method of sale does the evidence support for your property?",
      ],
      help: {
        level: "offer",
        services: ["selling-agent"],
        headline: "Want one more proposal to compare?",
        body: "We can introduce one participating agent who covers your suburb, so you have another appraisal to test the others against. Only with your permission, and with no obligation to list.",
        cta: { label: "Ask for an introduction", href: helpHref(["selling-agent"], a) },
      },
    };
  }

  if (stage === "preparing") {
    return {
      title: "Your next-step plan: getting ready to sell",
      intro: "This is where a few hours of preparation pay off most: know your costs, prepare for appraisals, and meet more than one agent.",
      nextSteps: [
        {
          title: `Know your costs${inState(s)}`,
          body: "Commission, marketing and conveyancing vary by state and by agent. Run your own numbers before any agent quotes you.",
          link: { label: "Selling costs calculator", href: L.sellingCostsCalc.href },
        },
        {
          title: "Prepare for appraisals",
          body: "Have recent nearby sales, renovation dates and your questions ready, so you can test each agent’s price estimate.",
          link: { label: "Preparing for an appraisal", href: L.appraisalPrep.href },
        },
        {
          title: "Meet two or three agents",
          body: "Ask each for a written proposal covering method of sale, marketing, price evidence and fees, then compare them in one place.",
          link: { label: "Agent proposal worksheet", href: L.proposalWorksheet.href },
        },
      ],
      tools: [L.sellingCostsCalc, L.commissionCalc, L.proposalWorksheet],
      guides: [L.appraisalPrep, L.chooseAgent, L.costOfSelling(s), L.whatToFix, L.stagingCost],
      checklist: {
        title: "A 12-week selling timeline",
        groups: [
          { heading: "12 to 8 weeks before listing", items: ["Get two or three appraisals", "Choose your agent and method of sale", "Book repairs, a clean-out and any garden work"] },
          { heading: "8 to 4 weeks", items: ["Read the agency agreement before you sign it", "Book photography and any styling", "Ask your conveyancer to prepare the contract and any disclosure statement your state requires"] },
          { heading: "4 weeks to launch", items: ["Finish presentation: touch-ups, lights, garden", "Agree the price guide and marketing schedule in writing"] },
          { heading: "During the campaign", items: ["Ask for feedback after every open home", "Judge offers against your walk-away number"] },
        ],
      },
      questions: [
        "Auction or private sale: which suits your property and your market?",
        "What evidence supports each agent’s price estimate?",
        "What’s included in the commission, and what’s extra?",
        "How long is the agency agreement, and how do you end it?",
      ],
      help: NEAR(a)
        ? {
            level: "offer",
            services: ["selling-agent"],
            headline: "Want an appraisal arranged for you?",
            body: "We can introduce one participating local agent for a free appraisal, alongside any agents you’ve found yourself. Only with your permission, and with no obligation to list.",
            cta: { label: "Ask for an introduction", href: helpHref(["selling-agent"], a) },
          }
        : {
            level: "available",
            services: ["selling-agent"],
            headline: "When you’re ready for appraisals",
            body: "Appraisals are most useful within about six months of selling. When you get there, we can introduce one participating local agent, with your permission.",
            cta: { label: "How introductions work", href: helpHref(["selling-agent"], a) },
          },
    };
  }

  // thinking
  return {
    title: "Your next-step plan: working out whether and when",
    intro: "You don’t need an agent yet. The useful work now is knowing your numbers and what would make the property easier to sell.",
    nextSteps: [
      {
        title: "Work out what you’d walk away with",
        body: "Likely price, minus commission, marketing, conveyancing and your loan payout. The calculator does it in a couple of minutes.",
        link: { label: "Selling costs calculator", href: L.sellingCostsCalc.href },
      },
      {
        title: "Get a realistic feel for value",
        body: "Recent sales of similar homes nearby tell you more than an online estimate. The guide shows how to read them yourself.",
        link: { label: "What’s my home worth?", href: L.worth.href },
      },
      {
        title: "Pick the jobs worth doing",
        body: "Small repairs and a clean, clear house usually pay back; big renovations often don’t. Start the list now so nothing’s rushed.",
        link: { label: "What to fix before selling", href: L.whatToFix.href },
      },
    ],
    tools: [L.sellingCostsCalc, L.commissionCalc],
    guides: [L.bestTimeToSell, L.howToSell, L.costOfSelling(s), L.whatToFix, L.suburbs],
    checklist: { title: "Preparation checklist", groups: PREP_CHECKLIST },
    questions: [
      "What’s the least you’d accept, after costs?",
      "Do you need to buy before you sell, or could you rent in between?",
      "Is capital gains tax a question for you (an investment, or a home you’ve rented out)? If so, ask an accountant early.",
      "Is anything likely to come up in a buyer’s building inspection?",
    ],
    help: {
      level: "available",
      services: ["selling-agent"],
      headline: "When you’re ready for an appraisal",
      body: "Appraisals are most useful within about six months of selling. When you get there, we can introduce one participating local agent, with your permission.",
      cta: { label: "How introductions work", href: helpHref(["selling-agent"], a) },
    },
  };
}

// ---------------------------------------------------------------------------
// Buying
// ---------------------------------------------------------------------------

function buyingHelp(a: PlanAnswers): PlanHelp {
  if (a.help === "buyers-agent") {
    return {
      level: "offer",
      services: ["buyers-agent"],
      headline: "Talk to a buyer’s agent",
      body: `A buyer’s agent acts only for you and charges you a fee. We’re still building our network, so we’ll tell you honestly whether we can introduce one${inState(a.state)} before anyone contacts you.`,
      cta: { label: "Ask about a buyer’s agent", href: helpHref(["buyers-agent"], a) },
    };
  }
  return {
    level: "available",
    services: ["buyers-agent"],
    headline: a.help === "unsure" ? "Not sure whether you need help?" : "If you want help later",
    body: "Most people buy without a buyer’s agent. If you’d like someone to search and negotiate for you, here’s what they do, what they charge and when it’s worth it.",
    cta: { label: "What a buyer’s agent does", href: L.buyersAgent.href },
  };
}

function buyingPlan(a: PlanAnswers): Plan {
  const s = a.state;
  const stage = a.buyStage ?? "starting";
  const type = a.buyerType ?? "next-home";
  const firstHome = type === "first-home";

  const typeGuide: PlanLink =
    firstHome ? L.firstHome(s) : type === "investing" ? L.investing : type === "downsizing" ? L.downsizers : L.deposit;

  if (stage === "offer") {
    return {
      title: "Your next-step plan: making an offer",
      intro: "You’ve found one, or you’re close. Now it’s about paying the right price on terms that protect you.",
      nextSteps: [
        { title: "Set your limit before you negotiate", body: "Base it on what similar homes actually sold for, not the price guide. Decide what would make you walk away.", link: { label: "Negotiating the price", href: L.negotiatePrice.href } },
        { title: "If it’s an auction, prepare differently", body: "At auction there’s usually no cooling-off and no conditions, so finance, inspections and the contract review must be done first.", link: { label: "Buying at auction", href: L.auctionGuide.href } },
        { title: "Know the contract terms in your state", body: `Deposits, cooling-off and settlement periods differ by state. Have a conveyancer review the contract before you sign${inState(s)}.`, link: { label: "Cooling-off periods by state", href: L.coolingOff.href } },
      ],
      tools: [L.stampDutyCalc, L.mortgageCalc],
      guides: [L.negotiatePrice, L.auctionGuide, L.conveyancing, L.coolingOff, L.settlement],
      checklist: {
        title: "From offer to keys",
        groups: [
          { heading: "The offer", items: ["Put it in writing with your conditions (finance, building and pest)", "Know the deposit amount and when it’s due"] },
          { heading: "Exchange to settlement", items: ["Your conveyancer checks the contract before you sign", "Get unconditional finance approval before the finance date", "Arrange insurance from the date your contract requires", "Do a final inspection before settlement"] },
        ],
      },
      questions: [
        "Which conditions do you need in the contract?",
        "Can you bid unconditionally at auction?",
        "Is the settlement date realistic for your lender and your move?",
      ],
      help: buyingHelp(a),
    };
  }

  if (stage === "searching") {
    return {
      title: "Your next-step plan: inspecting and shortlisting",
      intro: "Inspections are where expensive problems hide. A consistent checklist and real sales data keep you from falling for the wrong place.",
      nextSteps: [
        { title: "Use the same checklist at every inspection", body: "Water damage, structure, noise, orientation and strata health are cheaper to spot now than to fix later.", link: { label: "Due diligence checklist", href: L.dueDiligence.href } },
        { title: "Get the building and pest inspection right", body: "Book a qualified inspector, read the full report, and know how your state handles inspections and cooling-off.", link: { label: "Building and pest inspections", href: L.buildingPest.href } },
        { title: "Know what homes really sell for", body: "Look up recent sales in the suburbs you like, so you can judge each price guide.", link: { label: "Suburb profiles", href: L.suburbs.href } },
      ],
      tools: [L.stampDutyCalc, L.mortgageCalc, L.borrowingCalc],
      guides: [L.dueDiligence, L.buildingPest, L.negotiatePrice, L.auctionGuide, typeGuide],
      checklist: {
        title: "At every inspection",
        groups: [
          { heading: "Look and test", items: ["Check ceilings and walls for stains, smells or fresh patches of paint", "Run taps, flush toilets, and open every window and door", "Note noise, parking and the light at different times of day"] },
          { heading: "Ask", items: ["How long has it been listed, and has the price changed?", "What’s included in the sale?", "For units and townhouses: can I see the strata records?"] },
          { heading: "Before you offer", items: ["Have the contract reviewed by a conveyancer or solicitor", "Book a building and pest inspection"] },
        ],
      },
      questions: [
        "What did similar homes nearby actually sell for?",
        "What’s your limit, and what would make you walk away?",
        "Auction or private sale, and does that change how you prepare?",
      ],
      help: buyingHelp(a),
    };
  }

  if (stage === "finance") {
    return {
      title: "Your next-step plan: sorting your finance",
      intro: "Pre-approval tells you your real price range, and the right scheme can lower the deposit you need.",
      nextSteps: [
        { title: "Get pre-approval", body: "It shows what a lender will likely lend and makes your offers credible. Ask what conditions apply and how long it lasts.", link: { label: "Home loan pre-approval", href: L.preApproval.href } },
        firstHome
          ? { title: `Check the help available${inState(s)}`, body: "Grants, stamp duty concessions and federal schemes can change your deposit and upfront costs a lot.", link: { label: L.firstHome(s).label, href: L.firstHome(s).href } }
          : { title: "Know your deposit and LMI position", body: "Below a 20% deposit most lenders charge lenders mortgage insurance. Know the cost before you decide.", link: { label: "LMI calculator", href: L.lmiCalc.href } },
        { title: "Decide on a broker or a lender", body: "A broker compares lenders for you and is usually paid by the lender. Ask how they’re paid and which lenders they use.", link: { label: "Choosing a mortgage broker", href: L.broker.href } },
      ],
      tools: firstHome ? [L.borrowingCalc, L.stampDutyCalc, L.fhssCalc, L.lmiCalc] : [L.borrowingCalc, L.lmiCalc, L.mortgageCalc],
      guides: firstHome ? [L.preApproval, L.firstHome(s), L.homeGuarantee, L.deposit, L.broker] : [L.preApproval, L.deposit, L.broker, L.borrow, typeGuide],
      checklist: {
        title: "Getting pre-approved",
        groups: [
          { heading: "Documents", items: ["Photo ID", "Two recent payslips, or two years’ tax returns if self-employed", "Three months of bank and savings statements", "Details of debts, credit cards and limits"] },
          { heading: "Before you apply", items: ["Close credit cards you don’t use (lenders count the limit)", "Avoid new debts or a job change before settlement if you can", "Ask how long the pre-approval lasts and what would change it"] },
        ],
      },
      questions: [
        "Is your pre-approval conditional, and on what?",
        "Fixed, variable or split, and why?",
        firstHome ? "Are you eligible for a grant, a duty concession, the 5% Deposit Scheme or Help to Buy?" : "Will you need lenders mortgage insurance, and is it worth it to buy sooner?",
      ],
      help: buyingHelp(a),
    };
  }

  // starting
  return {
    title: "Your next-step plan: working out your budget",
    intro: "Before you inspect anything, know three numbers: what a lender might lend, what you can comfortably repay, and the upfront costs on top of the deposit.",
    nextSteps: [
      { title: "Estimate your borrowing power", body: "A rough figure in two minutes, with no credit check. A lender’s figure comes later, at pre-approval.", link: { label: "Borrowing power calculator", href: L.borrowingCalc.href } },
      { title: "Add up the upfront costs", body: `Stamp duty, legal fees, inspections and any lenders mortgage insurance.${firstHome ? ` First home buyers${inState(s)} may pay less duty.` : ""}`, link: { label: "Stamp duty calculator", href: L.stampDutyCalc.href } },
      firstHome
        ? { title: `Check the schemes${inState(s)}`, body: "Grants, duty concessions, the 5% Deposit Scheme and Help to Buy each have their own rules and caps.", link: { label: L.firstHome(s).label, href: L.firstHome(s).href } }
        : type === "investing"
          ? { title: "Run the investment numbers", body: "Rent against price, holding costs and what happens if rates rise.", link: { label: "Rental yield calculator", href: L.yieldCalc.href } }
          : { title: "Work out your deposit", body: "How much you need, and what happens below 20%.", link: { label: "How much deposit do you need?", href: L.deposit.href } },
    ],
    tools: firstHome ? [L.borrowingCalc, L.stampDutyCalc, L.fhssCalc, L.mortgageCalc] : type === "investing" ? [L.borrowingCalc, L.yieldCalc, L.stampDutyCalc] : [L.borrowingCalc, L.stampDutyCalc, L.mortgageCalc],
    guides: firstHome ? [L.firstHome(s), L.deposit, L.borrow, L.firstHomeMistakes, L.stampDuty(s)] : [L.borrow, L.deposit, typeGuide, L.stampDuty(s)],
    checklist: {
      title: "Before you start looking",
      groups: [
        { heading: "Your numbers", items: ["Check your credit report (it’s free from the credit reporting bodies)", "Work out savings, deposit and a buffer for costs", "Test the repayment at a rate about 3 percentage points higher, as lenders do"] },
        { heading: "Your brief", items: ["List must-haves and nice-to-haves", "Pick two or three suburbs and follow their sales", "Decide how far you’ll travel to work, school and family"] },
      ],
    },
    questions: [
      "How much deposit do you have, and will you need lenders mortgage insurance?",
      firstHome ? "Which grants, concessions or federal schemes are you eligible for?" : "Will you sell anything first, and how does that change your budget?",
      "What would you cut back if rates rose?",
    ],
    help: buyingHelp(a),
  };
}

// ---------------------------------------------------------------------------
// Buying and selling
// ---------------------------------------------------------------------------

const MOVING_TIMELINE: PlanChecklistGroup[] = [
  { heading: "First", items: ["Get an appraisal so your sale price is realistic", "Get pre-approval that takes the sale into account", "Decide the order: sell first, buy first, or at the same time"] },
  { heading: "If you sell first", items: ["Ask for a longer settlement or a rent-back so you have time to buy", "Keep your pre-approval current while you search"] },
  { heading: "If you buy first", items: ["Price a bridging loan, or ask for a longer settlement on the purchase", "Offer subject to your sale only if the vendor will accept it", "Set a date to review your price if the sale is slow"] },
  { heading: "Lining up the dates", items: ["Ask both conveyancers to align the settlements, or leave a buffer of a few days", "Book removalists and any storage for the gap", "Insure the new home from the date your contract requires"] },
];

function bothPlan(a: PlanAnswers): Plan {
  const s = a.state;
  const order = a.order ?? "undecided";
  const services: IntroService[] = order === "sold" ? ["buyers-agent"] : order === "bought" ? ["selling-agent"] : ["selling-agent", "buyers-agent"];

  const steps: Record<string, PlanStep[]> = {
    undecided: [
      { title: "Decide the order", body: "Selling first gives you certainty about money; buying first gives you certainty about where you’ll live. Your market and finances decide which matters more.", link: { label: "Sell first or buy first?", href: L.sellFirstBuyFirst.href } },
      { title: "Work out your net position", body: "Expected sale price, minus selling costs and your loan, against the purchase plus stamp duty. The gap is what you’d need to borrow.", link: { label: "Selling costs calculator", href: L.sellingCostsCalc.href } },
      { title: "Ask about the in-between", body: "A bridging loan, a long settlement or a rent-back can each cover a gap. Know the cost before you need it.", link: { label: "Bridging loan calculator", href: L.bridgingCalc.href } },
    ],
    "sell-first": [
      { title: "Get your sale under way", body: "Appraisals and a well-chosen agent set your budget for the purchase.", link: { label: "How to choose a selling agent", href: L.chooseAgent.href } },
      { title: "Negotiate time to buy", body: "Ask buyers for a longer settlement or a rent-back, so you’re not forced into a quick purchase.", link: { label: "Alternatives to a bridging loan", href: L.bridgingAlternatives.href } },
      { title: "Keep your finance ready", body: "Pre-approval usually lasts a few months. Renew it so you can move as soon as you find the right place.", link: { label: "Home loan pre-approval", href: L.preApproval.href } },
    ],
    "buy-first": [
      { title: "Price the overlap", body: "Work out what carrying two loans would cost if the sale takes three, six or nine months.", link: { label: "Bridging loan calculator", href: L.bridgingCalc.href } },
      { title: "Compare the ways to cover it", body: "Bridging loans, a longer settlement on the purchase, or a subject-to-sale offer each carry different risks.", link: { label: "Bridging loans", href: L.bridgingGuide.href } },
      { title: "Line up your sale early", body: "Get appraisals before you buy, so your sale price assumption is real.", link: { label: "Preparing for an appraisal", href: L.appraisalPrep.href } },
    ],
    sold: [
      { title: "Lock in your finance", body: "With the sale price known, update your pre-approval so it reflects your real deposit.", link: { label: "Home loan pre-approval", href: L.preApproval.href } },
      { title: "Use your settlement period well", body: "Plan inspections around it, and ask about a rent-back or short-term rental if you need more time.", link: { label: "Alternatives to a bridging loan", href: L.bridgingAlternatives.href } },
      { title: "Check before you commit", body: "Same discipline as any purchase: due diligence, inspections and a contract review.", link: { label: "Due diligence checklist", href: L.dueDiligence.href } },
    ],
    bought: [
      { title: "Work back from your settlement date", body: "Your purchase settlement date sets the deadline. Work out the cost if your sale isn’t done by then.", link: { label: "Bridging loan calculator", href: L.bridgingCalc.href } },
      { title: "Choose your selling agent soon", body: "Get appraisals now. A realistic price matters more than a high one when you have a deadline.", link: { label: "Questions to ask an agent", href: L.agentQuestions.href } },
      { title: "Know what you’ll net", body: "Selling costs and your loan payout decide how much bridging, if any, you’ll need.", link: { label: "Selling costs calculator", href: L.sellingCostsCalc.href } },
    ],
  };

  const helpBody =
    services.length > 1
      ? "If you want them: one participating selling agent for the sale, and, where we can, a buyer’s agent for the purchase. They’re separate introductions, and each needs its own yes."
      : services[0] === "selling-agent"
        ? "We can introduce one participating local selling agent for an appraisal, with your permission."
        : "We can tell you whether a participating buyer’s agent covers your area. We’re still building that network, so we won’t promise one.";

  return {
    title: "Your next-step plan: selling and buying",
    intro: "Selling and buying at once is mostly a timing problem. Get the order and the money right, and the rest follows.",
    nextSteps: steps[order] ?? steps.undecided,
    tools: [L.sellingCostsCalc, L.bridgingCalc, L.stampDutyCalc, L.borrowingCalc],
    guides: [L.sellFirstBuyFirst, L.bridgingGuide, L.bridgingAlternatives, L.costOfSelling(s), L.stampDuty(s)],
    checklist: { title: "A coordinated moving timeline", groups: MOVING_TIMELINE },
    questions: [
      "What happens if your sale takes longer than you expect?",
      "How much could you borrow before you’ve sold?",
      "Could you live with a short-term rental between the two?",
    ],
    help: {
      level: NEAR(a) || order === "sold" || order === "bought" ? "offer" : "available",
      services,
      headline: services.length > 1 ? "Personal help, for one side or both" : "Personal help with the next part",
      body: helpBody,
      cta: { label: "Ask for an introduction", href: helpHref(services, a) },
    },
  };
}

/** The plan for a set of answers. */
export function buildPlan(a: PlanAnswers): Plan {
  if (a.journey === "selling") return sellingPlan(a);
  if (a.journey === "buying") return buyingPlan(a);
  return bothPlan(a);
}

/** The shareable result URL for a set of answers (no personal data). */
export function planHref(a: PlanAnswers): string {
  return `/plan/result?${answersToParams(a).toString()}`;
}
