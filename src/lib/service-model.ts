// What Your Property Guide does, said once (Oct 2026 "confident moves").
//
// Every consumer page, form, email and the agent-facing pages read their
// promises from here, so the homepage can't promise a team call, fee
// negotiation or settlement support that the lead pipeline and the agent
// terms don't deliver. What the business actually does today:
//
//   - Free guides, calculators and next-step plans. No sign-up to read or use them.
//   - When someone asks, and ticks the permission box, one introduction per
//     service: a selling agent, or a buyer's agent where one takes part.
//   - Selling-agent requests in partner coverage go straight to one
//     participating agent (the Sent 24/7 vendor campaign). Our team reviews
//     anything outside that by hand before anyone is introduced.
//   - Afterwards we ask whether the introduction was useful.
//   - The agreement check (15 Oct 2026): a free 15-minute call with our team
//     before someone signs an agency agreement, going through commission,
//     marketing spend, term and the exit clause. It's general information,
//     not legal advice, and it never sends anyone to an agent.
//
// What it does NOT do (the agent terms say "We do not give real estate advice
// or act for buyers or sellers"): compare the whole market, negotiate fees,
// act for you, or manage a sale through to settlement. If any of that becomes
// a real, staffed service, change it here first.

/**
 * The page-one promise (v6, 15 Oct 2026, "It's the campaign that wins").
 * `lead` and `accent` are the headline's two halves; the accent is set in the
 * serif italic in light copper.
 */
export const PROMISE = {
  headline: "It’s the campaign that wins. Not the market.",
  lead: "It’s the campaign that wins.",
  accent: "Not the market.",
  eyebrow: "The $20 million playbook, for every home",
  support:
    "I learnt to sell Australia’s $10 to $20 million homes. The campaign that gets top dollar there is the same one that gets it for yours. Learn it free, then meet one agent who runs it in your suburb.",
  closing: "Every home deserves a $20 million campaign.",
} as const;

/**
 * How many agents we introduce, said the same way everywhere (v6). Buying
 * and selling are separate jobs with separate yeses, so "both" can mean a
 * selling agent and a buyer's agent, never two of either.
 */
export const ONE_AGENT = "One agent for each job you ask us to help with. Never a list.";

/**
 * What we take from an agent's commission (nothing), and the contrast with
 * agent-finder sites. Keep the contrast general: we hold no published source
 * for a competitor's percentage, so we don't quote one.
 */
export const COMMISSION_STANCE = {
  ours: "We take 0% of the agent’s commission. Agents pay us a flat fee for each introduction, whether or not you go ahead with them.",
  theirs: "Many agent-finder sites are paid a share of the agent’s commission.",
  /** The two sides of the homepage comparison box. */
  theirsLabel: "Paid a share of the agent’s commission",
  oursFigure: "0%",
  oursLabel: "of the agent’s commission",
  short: "Many agent-finder sites are paid a share of the agent’s commission. We take none of it.",
} as const;

/** The free agency agreement check (15 Oct 2026). A call with our team; general information, not legal advice. */
export const AGREEMENT_CHECK = {
  href: "/agreement-check",
  headline: "Before you sign anything, call us. It’s free.",
  minutes: 15,
  covers: ["Commission", "Marketing spend", "Term", "Exit clause"],
  summary: "A 15-minute check of the agency agreement you’ve been handed: the commission, the marketing spend, the term and the exit clause.",
  notAdvice: "It’s general information, not legal advice. For advice on your contract, speak to a solicitor or conveyancer.",
} as const;

/**
 * How soon someone hears back, said the same way everywhere. Participating
 * agents agree to make first contact promptly; the team reads every request
 * held for review on business days.
 */
export const RESPONSE_WINDOW = "within one business day";

/** The fee disclosure beside every introduction form (BRAND.md §8). */
export const FEE_DISCLOSURE =
  "Our introductions are free for you. The agent we introduce you to pays us a flat fee for the introduction, whether or not you go ahead with them. We take no share of their commission. It doesn’t change what you pay them, and you’re never obliged to use them.";

/** The difference between our free service and what a professional charges. */
export const FEE_DISTINCTION =
  "We don’t charge you anything. If you go on to engage the agent, they charge their own fee (a selling agent’s commission, or a buyer’s agent’s fee), which you agree with them directly. Get it in writing before you sign.";

export const HOW_WE_ARE_PAID_HREF = "/about#ownership-funding";

/** The introduction, step by step, as it really runs. */
export const INTRODUCTION_STEPS = [
  {
    title: "Tell us what you need",
    body: "A few questions about the property or the purchase, where it is and your timing. Choose how you’d like to be contacted.",
  },
  {
    title: "Give your permission",
    body: "We only introduce you if you tick the box. Buying and selling are separate introductions, each with its own yes.",
  },
  {
    title: "We find a participating agent who covers your area",
    body: "If one does, we pass your request to that one agent, and say who will be in touch. If we can’t cover your area, we tell you plainly and point you to what to do next.",
  },
  {
    title: "They contact you",
    body: `The agent contacts you the way you asked, normally ${RESPONSE_WINDOW}. You decide whether to meet them. There’s no obligation.`,
  },
  {
    title: "We check it was useful",
    body: "A short email afterwards asks how it went. It tells us which agents keep their place.",
  },
] as const;

/**
 * What an agent must show before they can receive introductions. The agent
 * terms (/real-estate-leads) and the homepage both read this list. Each says
 * how we check it, so the claim can be tested.
 */
export const PARTNER_CHECKS = [
  {
    title: "Proven local sales results",
    body: "We review their recent sales in the suburbs they want introductions for, not just an office nearby.",
  },
  {
    title: "Strong reviews from past clients",
    body: "We read their reviews from past sellers or buyers, not just the ones they choose to show.",
  },
  {
    title: "Licensed, with a clean record",
    body: "We look them up on their state’s licence register before they join, and you can too (links below).",
  },
  {
    title: "Interviewed by our team",
    body: "We talk to every agent about how they work before they join. They agree to contact you promptly and tell us what happened.",
  },
] as const;

/** Said plainly, so nobody expects more than we do. */
export const WHAT_WE_DONT_DO = [
  "We don’t compare every agent in your area. We introduce agents from our participating network only.",
  "We don’t act for you, give real estate or financial advice, or negotiate fees on your behalf. Our guides and worksheets help you do that well.",
  "We don’t cover every suburb. If no participating agent covers yours, we say so before you send anything.",
  "We never sell your details, and we never pass your request to a second agent.",
] as const;

/** State licence registers, for checking any agent yourself. */
export const LICENCE_REGISTERS: ReadonlyArray<{ state: string; label: string; href: string }> = [
  { state: "NSW", label: "NSW Fair Trading licence check", href: "https://verify.licence.nsw.gov.au/" },
  { state: "VIC", label: "Consumer Affairs Victoria licence search", href: "https://www.consumer.vic.gov.au/licensing-and-registration/estate-agents" },
  { state: "QLD", label: "Queensland licence search (Office of Fair Trading)", href: "https://www.qld.gov.au/law/fair-trading/fair-trading-licence-search" },
  { state: "WA", label: "WA Consumer Protection licence search", href: "https://www.commerce.wa.gov.au/consumer-protection/licence-search" },
  { state: "SA", label: "SA Consumer and Business Services licence search", href: "https://www.cbs.sa.gov.au/licensing-and-registration/search-for-a-licence-or-registration" },
  { state: "TAS", label: "Property Agents Board of Tasmania register", href: "https://www.pab.tas.gov.au/" },
  { state: "ACT", label: "Access Canberra public register", href: "https://www.accesscanberra.act.gov.au/business-and-work/licensing-and-registration/public-registers" },
  { state: "NT", label: "NT Agents Licensing Board", href: "https://nt.gov.au/industry/agents-licensing-board" },
];

export type IntroService = "selling-agent" | "buyers-agent";

/** What each introduction is, who it suits, and what the professional charges. */
export const SERVICES: Record<IntroService, {
  label: string;
  short: string;
  who: string;
  what: readonly string[];
  fees: string;
  whenUseful: readonly string[];
  permission: string;
}> = {
  "selling-agent": {
    label: "A selling agent",
    short: "selling agent",
    who: "A licensed real estate agent who acts for you, the seller: appraises the property, markets it, negotiates with buyers and manages the sale up to exchange.",
    what: [
      "A free appraisal: what they think the property will sell for, with recent sales as evidence",
      "A written proposal: method of sale, marketing plan and costs, and their commission",
      "If you sign with them: the campaign, inspections, negotiation and the contract",
    ],
    fees: "Selling agents charge commission, typically about 1.6% to 3.25% of the sale price depending on the state and the agent, plus marketing costs. It’s negotiable and must be in your agency agreement.",
    whenUseful: [
      "You’re selling within about six months and want an appraisal",
      "You want a second opinion alongside agents you’ve already met",
    ],
    permission:
      "Yes, introduce me to one participating local selling agent. I agree you may pass my name, contact details and the answers above to that agent so they can contact me about selling.",
  },
  "buyers-agent": {
    label: "A buyer’s agent",
    short: "buyer’s agent",
    who: "A licensed agent who acts only for you, the buyer. A selling agent works for the vendor and is paid to get the best price for them; a buyer’s agent is paid by you to find, assess and negotiate for you.",
    what: [
      "A first consultation about your brief, budget and timing",
      "Searching, including properties not yet advertised, and checking them against your brief",
      "Price evidence, negotiation or bidding at auction on your behalf, and managing due diligence to exchange",
    ],
    // Same ranges as /guides/buyers-agent-cost-australia.
    fees: "Buyer’s agents charge you directly: often a fixed fee (about $10,000 to $18,000 in capital cities for a full search) or 1.5% to 3% of the purchase price, sometimes with an upfront engagement fee. Auction bidding alone costs much less. Ask for the full fee in writing before you sign.",
    whenUseful: [
      "You’re buying in an area you don’t know, or from interstate",
      "You’re short on time, or uncomfortable negotiating or bidding",
      "You’re buying at a price where a better negotiation can outweigh the fee",
    ],
    permission:
      "Yes, introduce me to one participating buyer’s agent. I agree you may pass my name, contact details and the answers above to that buyer’s agent so they can contact me about buying.",
  },
};

/** The separate, unticked box for our own emails (never a condition of anything). */
export const MARKETING_CONSENT =
  "Also send me Your Property Guide’s tips by email. Optional. Unsubscribe anytime.";

/** Words for the preferred-contact choice. */
export const CONTACT_METHODS = [
  { id: "phone", label: "Phone call" },
  { id: "sms", label: "Text message" },
  { id: "email", label: "Email" },
] as const;
export type ContactMethod = (typeof CONTACT_METHODS)[number]["id"];

export const BEST_TIMES = [
  { id: "any", label: "Any time" },
  { id: "morning", label: "Mornings" },
  { id: "afternoon", label: "Afternoons" },
  { id: "evening", label: "After 5pm" },
] as const;
export type BestTime = (typeof BEST_TIMES)[number]["id"];
