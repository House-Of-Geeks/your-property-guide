// Lead-type sub-pages under /real-estate-leads. One entry per lead type the
// agent-facing supply page sells. Structure ported from the sister site's
// /finance-leads (Your Finance Guide, src/data/finance-leads.ts).
//
// Everything here must stay true to what the consumer-side forms actually
// capture and consent to:
//   vendor     SellingGuideFunnel (type "guide-download", guideType selling):
//              suburb, property type + beds, timeframe, agent status,
//              motivation (opt), price expectation (opt), name, email,
//              mobile (opt), marketing consent. Scored HOT/WARM/COLD by
//              scoreGuideLead(); already-listed vendors are never shared.
//   appraisal  AppraisalForm + SuburbAppraisalCTA ("appraisal-request"):
//              name, email, mobile (required), address, suburb, property
//              type, bedrooms. Consent: one vetted local agent.
//   buyer      MatchAgent ("match-request") with a buying or investing
//              intent: intent, suburb, timeframe, contact preference, name,
//              email, mobile. Consent: one specialist. NOT the buying-guide
//              funnel or the off-market register, whose consent copy says
//              details are never passed on.
//   developer  House-and-land package enquiries ("house-and-land-enquiry")
//              on /house-and-land/[slug], routed to the package's listing
//              agent or builder: name, email, mobile, message, package.
//
// Commercial terms (pay per lead, no lock-in, 7-day replacement, exclusive)
// are stated policy, agreed 25 Sep 2026. No conversion-rate claims.

export interface DocketRow {
  key: string;
  value: string;
  /** Muted trailing detail rendered after the value. */
  note?: string;
  /** Render the value in the monospace path style (URLs). */
  path?: boolean;
}

export interface LeadSource {
  label: string;
  href: string;
  why: string;
}

export interface LeadProfile {
  title: string;
  text: string;
}

export interface LeadFaq {
  question: string;
  answer: string;
}

/** An extra long-form chapter unique to one lead type (the "go beyond" content). */
export interface LeadChapter {
  title: string;
  kicker: string;
  paragraphs: string[];
  table?: { head: string[]; rows: string[][]; caption?: string };
}

export interface LeadTypePage {
  slug: string;
  /** Index number shown on the hub and the sub-page, e.g. "01". */
  n: string;
  /** AgentEnquiryForm lead-type value to preselect. */
  formValue: LeadTypeValue;
  name: string;
  /** Short noun phrase used in cross-links, e.g. "vendor leads". */
  shortName: string;
  /** Who buys this lead type, e.g. "Selling agents". */
  audience: string;
  /** Singular noun for the one recipient of each lead, e.g. "agent". */
  recipient: string;
  /** Plural noun for the FAQ heading, e.g. "agents". */
  askers: string;
  title: string;
  description: string;
  h1: string;
  h1Em: string;
  lede: string;
  /** Short kicker on the hub card, e.g. "Highest volume". */
  volume: string;
  docketTitle: string;
  docket: DocketRow[];
  docketConsents: string[];
  stats: Array<{ value: string; label: string }>;
  sourcesIntro: string;
  sources: LeadSource[];
  contents: string[];
  profilesIntro: string;
  profiles: LeadProfile[];
  working: Array<{ head: string; text: string }>;
  chapter?: LeadChapter;
  faqs: LeadFaq[];
  /** Hub page card blurb. */
  cardText: string;
  cardTags: string[];
}

export const LEAD_TYPE_OPTIONS = [
  { value: "vendor", label: "Vendor leads" },
  { value: "appraisal", label: "Appraisal leads" },
  { value: "buyer", label: "Buyer leads" },
  { value: "developer", label: "Project enquiries (developers, builders)" },
] as const;

export type LeadTypeValue = (typeof LEAD_TYPE_OPTIONS)[number]["value"];

export const leadTypePages: LeadTypePage[] = [
  {
    slug: "vendor-leads",
    n: "01",
    formValue: "vendor",
    name: "Vendor leads",
    shortName: "vendor leads",
    audience: "Selling agents",
    recipient: "agent",
    askers: "agents",
    title: "Vendor Leads for Real Estate Agents | Exclusive Seller Leads, Australia",
    description:
      "Exclusive vendor leads (seller leads) from Australian homeowners who answered our selling questions before giving their details: suburb, property, timeframe and agent status, scored hot, warm or cold. Already-listed vendors never sold. Pay per lead, no lock-in.",
    h1: "Vendor leads from homeowners who",
    h1Em: "told us when they are selling.",
    lede:
      "A vendor lead here is a homeowner who worked through our seven-question selling guide before they gave us a name: their suburb, the property, when they plan to sell, and whether an agent already has them. We score each one on our side, drop anyone already listed, and send the rest to one agent who sells in that suburb.",
    volume: "Highest volume",
    docketTitle: "Vendor lead",
    docket: [
      { key: "Received", value: "Tue 8 Sep 2026", note: "· 8:12pm AEST" },
      { key: "Score", value: "Hot", note: "· selling inside 3 months, no agent signed" },
      { key: "Suburb", value: "North Lakes", note: "· QLD 4509" },
      { key: "Property", value: "House", note: "· 4 bedrooms" },
      { key: "Timeframe", value: "0 to 3 months" },
      { key: "Agent status", value: "Haven't started", note: "· no agent conversations yet" },
      { key: "Motivation", value: "Upsizing", note: "· optional, given" },
      { key: "Price in mind", value: "$800k to $900k", note: "· optional, given" },
      { key: "Contact", value: "Leanne", note: "· mobile and email" },
    ],
    docketConsents: ["Agent contact consent", "Mobile supplied", "Suburb matched"],
    stats: [
      { value: "7", label: "Questions before contact details" },
      { value: "3", label: "Scores: hot, warm, cold" },
      { value: "0", label: "Already-listed vendors sold" },
      { value: "1 : 1", label: "One lead, one agent" },
    ],
    sourcesIntro:
      "These are the pages that produce vendor leads. A homeowner who arrives from one of them has already read what selling costs, what commission is negotiable and how to choose an agent, which is why the first call is a conversation about their property rather than a pitch.",
    sources: [
      { label: "The selling guide", href: "/selling-guide", why: "The seven-question funnel every vendor lead comes through. The guide itself is the reason they answer." },
      { label: "Real estate commission calculator", href: "/real-estate-commission-calculator", why: "Homeowners working out what an agent will cost them on their own sale price." },
      { label: "Selling costs calculator", href: "/selling-costs-calculator", why: "Commission, marketing, conveyancing and state costs added up before they commit." },
      { label: "Real estate agent fees in Australia", href: "/guides/real-estate-agent-fees-australia", why: "Rates by state, what is negotiable, and what a fair marketing budget looks like." },
      { label: "Cost of selling a house", href: "/guides/cost-of-selling-a-house-australia", why: "The full bill, state by state, from agent fees to the final adjustments." },
      { label: "How to choose a selling agent", href: "/guides/how-to-choose-a-selling-agent", why: "Readers who are deciding who to call. The questions they will ask you are in it." },
      { label: "Best time to sell a house", href: "/guides/best-time-to-sell-a-house-australia", why: "Timing research, usually six to twelve weeks before a spring listing." },
      { label: "Suburb profiles", href: "/suburbs", why: "Every suburb profile carries a selling-guide prompt for owners checking their own suburb's median." },
    ],
    contents: [
      "Full name, email and mobile (we only charge for vendor leads with a mobile)",
      "Suburb and postcode, matched to your area",
      "Property type and number of bedrooms",
      "Selling timeframe: 0 to 3, 3 to 6, 6 to 12 or 12+ months",
      "Agent status: comparing agents, or no agent conversations yet",
      "Reason for selling, where given",
      "Price expectation bracket, where given",
      "Hot, warm or cold score, worked out on our side",
      "Timestamp, and the form they used, so you know exactly what they were told",
    ],
    profilesIntro:
      "Three vendors typical of what the selling guide produces. Composites, not real people, but the shape is right.",
    profiles: [
      {
        title: "The spring seller",
        text: "Owner-occupier, selling inside three months, has not spoken to an agent yet and has already run the commission calculator. They want someone who knows the suburb's recent sales and will talk about commission without flinching. The first competent call usually gets the appraisal.",
      },
      {
        title: "The six-month planner",
        text: "Selling in three to six months, often downsizing or relocating, and doing the reading now. Scored warm. They will not list next week, but the agent who gives them a straight appraisal and checks in monthly is the one they call when they are ready.",
      },
      {
        title: "The comparer",
        text: "Has started talking to agents and is shortlisting. Timeframe is short and the decision is live. They are testing who explains the numbers best, so arrive with comparable sales and a clear view on price, not a brochure.",
      },
    ],
    working: [
      { head: "Call inside the hour.", text: "The vendor was told a local agent would contact them. The first agent who rings and sounds like they know the street has the advantage, and that advantage is gone by the next afternoon." },
      { head: "Open with their answers, not your pitch.", text: "You already know the timeframe, the property and why they are selling. Say so. \"You mentioned you're upsizing in the next few months\" beats \"are you thinking of selling?\"" },
      { head: "Book the appraisal on the first call.", text: "The aim of call one is a time in the diary, not a listing. Offer two times, confirm by SMS, and send your recent sales in the suburb before you arrive." },
      { head: "Nurture the warm ones for 90 days.", text: "Three-to-six-month vendors are most of the value and most of the patience. A monthly market update for their suburb and one real check-in a month keeps you the agent they think of first." },
      { head: "Tell us what listed.", text: "Mark each lead listed, appraised, not ready or unreachable. It is how replacements get sorted fast and how we learn which pages produce vendors who sign." },
    ],
    chapter: {
      title: "Vendor lead, appraisal request or listing lead?",
      kicker: "Three names for different things, and the seller-intent tiers we score by",
      paragraphs: [
        "The words get used interchangeably, and they should not be. A listing lead is the loosest: anyone who might one day sell. An appraisal request is narrower: a homeowner who has asked an agent to value their property, with an address attached, but who may simply be curious. A vendor lead, the way we use it, sits between the two with more context than either: a homeowner who has told us when they plan to sell and whether an agent already has them, before they gave us a single contact detail.",
        "That order matters. Because the questions come first, nobody is answering them to get a price estimate out of us, and nobody can score themselves. We work the score out on our side from two answers, the timeframe and the agent status, and we never pass on a vendor who says they are already listed.",
        "Seller leads from the portals and referral platforms work differently. A portal seller lead is someone who clicked contact on an agent's profile or a sold listing. A referral platform takes the homeowner's details and chooses agents for them, then charges the agent a share of the commission when the property sells. Neither asks the timeframe question before the contact form.",
      ],
      table: {
        head: ["Score", "What the vendor told us", "What it means for you"],
        rows: [
          ["Hot", "Selling in 0 to 3 months, and no agency agreement signed", "Call inside the hour and book an appraisal. These are the vendors choosing an agent this month."],
          ["Warm", "Selling in 3 to 6 months", "Appraise now, then keep in touch. Most listings from warm vendors come from the agent who stayed in contact."],
          ["Cold", "6 to 12 months, 12+ months or still researching", "Kept in our own nurture until their timeframe shortens. Not sold as a vendor lead until then."],
          ["Never sold", "Already listed with an agent", "They get the guide and nothing else. Their details are never passed on."],
        ],
      },
    },
    faqs: [
      {
        question: "What is a vendor lead?",
        answer:
          "A vendor lead is an introduction to a homeowner who plans to sell and wants to talk to a local agent. On Your Property Guide it means someone who answered our selling questions (suburb, property, timeframe and whether they have an agent) before giving their contact details, and agreed that a local agent will contact them about selling.",
      },
      {
        question: "Are vendor leads and seller leads the same thing?",
        answer:
          "Yes. Vendor is the Australian term for the seller, so vendor leads and seller leads mean the same thing. What differs between suppliers is how much the homeowner told them before the lead was made, and whether the lead is shared.",
      },
      {
        question: "Are your vendor leads exclusive?",
        answer:
          "Yes. Each vendor lead goes to one agent who sells in that suburb. It is not shared with other agents, resold later or passed to a call centre.",
      },
      {
        question: "Do I pay for cold leads?",
        answer:
          "No. Vendors who are six months or more out, or still researching, stay in our own nurture and are not sold as vendor leads until their timeframe shortens. You buy hot and warm vendors, matched to your suburbs.",
      },
      {
        question: "What if the vendor has already signed with another agent?",
        answer:
          "We filter out anyone who tells us they are already listed. If a vendor tells you on the call that they signed with another agent before you rang, flag it within seven days and the lead is replaced.",
      },
      {
        question: "How much do vendor leads cost?",
        answer:
          "Vendor leads are priced per lead by suburb and the weekly volume you want, with no platform fee, no minimum and no share of your commission. Register your suburbs and we will send current availability and a per-lead price in writing within one business day.",
      },
      {
        question: "How many vendor leads will I get?",
        answer:
          "It depends on your suburbs and the season. Seller enquiries build through late winter and peak in spring, and they follow population. We will tell you honestly what volume looks like in your area before you commit, and we would rather send you fewer leads you can list than pad a number.",
      },
    ],
    cardText:
      "Homeowners who answered seven selling questions before giving their details. Scored hot or warm on timeframe and agent status; already-listed vendors never sold.",
    cardTags: ["Timeframe", "Agent status", "Property type and beds", "Motivation and price, where given"],
  },
  {
    slug: "appraisal-leads",
    n: "02",
    formValue: "appraisal",
    name: "Appraisal leads",
    shortName: "appraisal leads",
    audience: "Selling agents",
    recipient: "agent",
    askers: "agents",
    title: "Property Appraisal Leads for Real Estate Agents | Exclusive, Australia",
    description:
      "Exclusive property appraisal leads: Australian homeowners who asked for a local agent to appraise their property, with the street address, property details and a mobile on every one. One agent per request. Pay per lead, no lock-in.",
    h1: "Appraisal leads from homeowners who",
    h1Em: "asked an agent to come and look.",
    lede:
      "An appraisal lead is the most direct request we produce: a homeowner who has asked for one local agent to appraise their property. It comes with the street address, the property details and a mobile, because an appraisal only happens once an agent calls to book it. One request, one agent.",
    volume: "Address on every lead",
    docketTitle: "Appraisal request",
    docket: [
      { key: "Received", value: "Sun 13 Sep 2026", note: "· 4:26pm AEST" },
      { key: "Request", value: "Sale appraisal", note: "· one local agent" },
      { key: "Address", value: "Street address supplied", note: "· Mango Hill QLD 4509" },
      { key: "Property", value: "Townhouse", note: "· 3 bedrooms" },
      { key: "Timeframe", value: "3 to 6 months", note: "· from the suburb-page form" },
      { key: "Came from", value: "/suburbs/mango-hill-qld-4509", path: true },
      { key: "Contact", value: "Daniel", note: "· mobile and email" },
    ],
    docketConsents: ["One-agent consent", "Mobile required", "Address supplied"],
    stats: [
      { value: "1", label: "Agent per request" },
      { value: "100%", label: "With a street address" },
      { value: "100%", label: "With a mobile" },
      { value: "7 days", label: "Replacement window" },
    ],
    sourcesIntro:
      "Appraisal requests come from two places: the appraisal page itself, and the appraisal prompt on every suburb profile, where homeowners are usually checking their own suburb's median and recent sales. Suburb-page requests tell you which suburb page they came from.",
    sources: [
      { label: "Free property appraisal", href: "/appraisal", why: "The dedicated appraisal request, with property type and bedrooms." },
      { label: "Suburb profiles", href: "/suburbs", why: "The appraisal prompt on each suburb page, under the median and recent sales. Captures a timeframe too." },
      { label: "Find an agent by suburb", href: "/agents", why: "Homeowners looking at who sells in their suburb, one step from asking for an appraisal." },
      { label: "How much is my house worth?", href: "/guides/how-much-is-my-house-worth-australia", why: "The online-estimate question. The guide explains why an agent appraisal is different." },
      { label: "How to prepare for a property appraisal", href: "/guides/how-to-prepare-for-a-property-appraisal", why: "Homeowners who have already decided to get one and want to be ready." },
      { label: "Property price guide", href: "/price-guide", why: "Readers checking what their type of property is worth in their area." },
    ],
    contents: [
      "Full name, email and mobile (mobile required)",
      "Street address, suburb and postcode",
      "Property type and bedrooms, where given",
      "Selling timeframe, on suburb-page requests",
      "The suburb page the request came from, on suburb-page requests",
      "Timestamp, and the form they used, so you know exactly what they were told",
    ],
    profilesIntro: "Three homeowners typical of the appraisal requests we see. Composites, but the shape is right.",
    profiles: [
      {
        title: "The ready seller",
        text: "Wants to list inside three months and asked for an appraisal to pick the agent. The address is in the lead, so you can pull the comparable sales before you ring. Book the visit on the first call.",
      },
      {
        title: "The price checker",
        text: "Curious about value after a neighbour sold. Not ready to list, but the appraisal is the conversation that makes you their agent when they are. Treat it as the start of a six-to-eighteen-month relationship.",
      },
      {
        title: "The life-event seller",
        text: "Downsizing, a separation or a deceased estate. Timing is driven by something other than the market, and they want an agent who is calm, clear and local. Speed and tact matter more than the pitch.",
      },
    ],
    working: [
      { head: "Pull the comparables before you dial.", text: "You have the address. Look up the last six sales within a few streets so the first call already sounds like an appraisal." },
      { head: "Book a time, then confirm by SMS.", text: "Offer two slots in the next three days. A same-day text confirmation with your name and photo cuts no-shows." },
      { head: "Send a short pre-appraisal questionnaire.", text: "Improvements, strata or body corporate details, timing and what they want from the sale. You walk in knowing the story." },
      { head: "Leave with a written price range and a date.", text: "A range backed by named sales, and a date for the follow-up conversation. The appraisal is the pitch." },
      { head: "Stay in touch if they are not ready.", text: "Many homeowners take months to list after an appraisal. A quarterly update on their suburb keeps you the agent they call." },
    ],
    chapter: {
      title: "The appraisal funnel, with Australian numbers.",
      kicker: "From request to listing, and where agents lose them",
      paragraphs: [
        "An appraisal request only becomes a listing through four steps: you try to reach them, you connect, you appraise, and they sign. The best published Australian data on those steps comes from OpenAgent's study of more than 2,000 agents and 58,000 referrals, run from February 2018 to February 2019. It is old and it is the platform's own data, but the gap it shows between average and top agents is the useful part.",
        "The difference is not the leads. Both groups received the same kind of referral. The top agents attempted every lead, answered faster, connected with more homeowners, and turned far more of their appraisals into listings. Stepps, a real estate marketing agency, reports a similar pattern on agency-website appraisal requests: speed in the first 24 hours is where most of the result is decided.",
      ],
      table: {
        head: ["Step", "Average agent", "Top 10% of agents"],
        rows: [
          ["Leads attempted", "96.7%", "100%"],
          ["Time to first response", "146 minutes", "98 minutes"],
          ["Homeowners connected with", "69.9%", "75.4%"],
          ["Appraisal to listing", "Lists about 10% of leads overall", "63.7% of appraisals become listings"],
        ],
        caption:
          "Source: OpenAgent, \"How do top performing agents convert more leads?\", study of 2,049 agents, Feb 2018 to Feb 2019. The platform's own figures, not verified by us, and not a forecast of results from our leads.",
      },
    },
    faqs: [
      {
        question: "What is an appraisal lead?",
        answer:
          "A property appraisal lead is a homeowner who has asked a real estate agent to appraise their property, usually as the first step towards selling. Ours come with the street address and a mobile, because the homeowner asked for a local agent to call and book the appraisal.",
      },
      {
        question: "How is an appraisal lead different from a vendor lead?",
        answer:
          "An appraisal lead is a direct request for an agent to value a specific property, with the address attached. A vendor lead comes from our selling guide and carries more context about timing and motivation, but not the street address. Appraisal leads are closer to a booked appointment; vendor leads tell you more about where the homeowner is in the decision.",
      },
      {
        question: "Are appraisal leads exclusive?",
        answer:
          "Yes. The homeowner asked for one local agent, and one agent gets the request. It is never shared or resold.",
      },
      {
        question: "Is an online estimate the same as an appraisal lead?",
        answer:
          "No. An online estimate is a number from a pricing model. An appraisal lead is a request for an agent to look at the property and give a price opinion. We only sell the second: homeowners who asked for an agent, not people who typed an address into a calculator.",
      },
      {
        question: "Do you supply rental or leasing appraisal leads?",
        answer:
          "Not at the moment. Our appraisal requests are for sale appraisals. If you run a property management business and want landlord enquiries, tell us on the registration form and we will let you know if that changes.",
      },
      {
        question: "Is buying appraisal leads legal?",
        answer:
          "Yes, when the homeowner has agreed to be contacted by an agent and the supplier discloses their details with that consent. Our appraisal forms say, at the point the homeowner gives their details, that one local agent will contact them.",
      },
    ],
    cardText:
      "Homeowners who asked one local agent to appraise their property. Street address and mobile on every request.",
    cardTags: ["Street address", "Mobile, required", "Property type and beds", "Timeframe, suburb-page requests"],
  },
  {
    slug: "buyer-leads",
    n: "03",
    formValue: "buyer",
    name: "Buyer leads",
    shortName: "buyer leads",
    audience: "Buyers agents",
    recipient: "buyers agent",
    askers: "buyers agents",
    title: "Buyer Leads for Buyers Agents & Real Estate Agents | Australia",
    description:
      "Exclusive buyer leads for Australian buyers agents: people buying or investing who asked to be matched with one property specialist, with their suburb, timeframe and preferred contact method. Pay per lead, no lock-in.",
    h1: "Buyer leads from people who",
    h1Em: "asked for help buying.",
    lede:
      "A buyer lead here is someone who told us they are buying or investing, named the suburb and their timeframe, and asked to be matched with one specialist. That makes them a fit for buyers agents: a person looking for representation, not a browser on a listing. One lead, one agent.",
    volume: "For buyers agents",
    docketTitle: "Buyer match request",
    docket: [
      { key: "Received", value: "Wed 16 Sep 2026", note: "· 9:05pm AEST" },
      { key: "Intent", value: "Investing", note: "· build or expand a portfolio" },
      { key: "Suburb", value: "Ipswich", note: "· QLD 4305" },
      { key: "Timeframe", value: "Within 3 months", note: "· ready to take action" },
      { key: "Contact by", value: "Text first" },
      { key: "Contact", value: "Priya", note: "· mobile and email" },
    ],
    docketConsents: ["One-specialist consent", "Mobile supplied", "Suburb matched"],
    stats: [
      { value: "1", label: "Specialist per match" },
      { value: "3", label: "Questions before contact" },
      { value: "2", label: "Intents: buying, investing" },
      { value: "7 days", label: "Replacement window" },
    ],
    sourcesIntro:
      "Buyer leads come from the specialist match on our suburb, region and comparison pages, where people researching where to buy ask to be matched with someone who can help. The research they did first is usually suburb-level: medians, growth, schools, rental yield.",
    sources: [
      { label: "Find an expert", href: "/find-an-expert", why: "The specialist match: intent, suburb and timeframe, then contact details." },
      { label: "Suburb agent pages", href: "/agents", why: "Who sells in each suburb, with the match form for people who want help." },
      { label: "Compare two suburbs", href: "/compare", why: "Buyers weighing two suburbs side by side, a step before engaging help." },
      { label: "Best suburbs", href: "/best-suburbs", why: "Investors and families shortlisting where to buy." },
      { label: "What a buyers agent costs", href: "/guides/buyers-agent-cost-australia", why: "Readers pricing representation. They arrive knowing your fee model." },
      { label: "Investing hub", href: "/investing", why: "Yield, growth and strategy content for investors building a portfolio." },
      { label: "First home buyers", href: "/first-home-buyers", why: "Grants, schemes and deposit guides for buyers doing it for the first time." },
    ],
    contents: [
      "Full name, email and mobile",
      "Intent: buying a first or next home, or investing",
      "The suburb they are focused on",
      "Timeframe: just looking, within 3 months, or right now",
      "How they want to be contacted: call, text first or email first",
      "Timestamp, and the form they used, so you know exactly what they were told",
    ],
    profilesIntro: "Three buyers typical of the match requests we see. Composites, but the shape is right.",
    profiles: [
      {
        title: "The interstate investor",
        text: "Buying outside their home state, investing, and short on time to inspect. They have done the suburb research and want someone on the ground. Price your service against the time and mistakes it saves them.",
      },
      {
        title: "The first home buyer with a deadline",
        text: "A scheme deadline or a lease ending. They have read the grant and deposit guides and want someone to stop them overpaying. Ask about pre-approval on the first call; it decides your next step.",
      },
      {
        title: "The upgrader in a tight market",
        text: "Buying their next home while selling the current one, in a suburb where good stock goes off-market. They want access and a negotiator. The sell-first-or-buy-first question is often the opening.",
      },
    ],
    working: [
      { head: "Honour the contact preference.", text: "If they chose \"text first\", text first. Introduce yourself, say how you got their details, and ask when suits for a call." },
      { head: "Qualify finance on call one.", text: "We do not ask budget or pre-approval on the form. You should, early: pre-approval, deposit and the lender decide whether this is a client now or in three months." },
      { head: "Lead with the suburb.", text: "They told us the suburb. Open with what you know about it: recent sales, what is selling off-market, what they should avoid." },
      { head: "Send the engagement terms the same day.", text: "Your fee, what is included, and how you are paid, in writing. Buyers who have read our buyers agent cost guide expect it." },
      { head: "Tell us who signed.", text: "Engagements signed, not ready, or unreachable. It sorts replacements fast and tells us which pages produce clients." },
    ],
    chapter: {
      title: "What a buyer lead is worth to a buyers agent.",
      kicker: "Work backwards from your fee, not forwards from a lead price",
      paragraphs: [
        "Buyers agents can work out what a lead is worth before they buy one. Take your average engagement fee, multiply it by the share of leads that become signed clients, and you have the most a lead is worth to you. Anything below that is margin; anything above it loses money no matter how good the lead feels.",
        "The table uses a $15,000 engagement fee as an example. Plug in your own. The lead-to-client rate is the number to track honestly from your first ten leads, because it moves more with how fast you call and how well you qualify finance than with the lead source.",
      ],
      table: {
        head: ["Lead-to-client rate", "Break-even per lead on a $15,000 fee", "Break-even per lead on a $25,000 fee"],
        rows: [
          ["1 in 50 (2%)", "$300", "$500"],
          ["1 in 20 (5%)", "$750", "$1,250"],
          ["1 in 10 (10%)", "$1,500", "$2,500"],
        ],
        caption:
          "Illustrative. Engagement fees and conversion rates vary widely by market and service; these are not our prices or a forecast of your results.",
      },
    },
    faqs: [
      {
        question: "What is a buyer lead?",
        answer:
          "A buyer lead is someone planning to buy property who has agreed to be contacted by a professional who can help. Ours are people who told us they are buying or investing, named a suburb and timeframe, and asked to be matched with one specialist.",
      },
      {
        question: "Are these leads for buyers agents or selling agents?",
        answer:
          "Mainly buyers agents. The buyer asked for help buying, which is representation. Selling agents who want buyers for their own stock get those through their listings: an enquiry on a listing goes to that listing's agent and is never sold as a lead.",
      },
      {
        question: "Do buyer leads include budget and pre-approval?",
        answer:
          "Not yet. The match form asks intent, suburb, timeframe and preferred contact method, then contact details. Budget, deposit and pre-approval are the first things to ask on your call.",
      },
      {
        question: "How do buyers agents get clients?",
        answer:
          "Mostly through referrals, past clients, broker and accountant partnerships, content and a local reputation, with paid leads as a top-up. Buyer leads from us suit agents who can call fast and qualify finance early, and who want clients in specific suburbs.",
      },
      {
        question: "Are buyer leads exclusive?",
        answer:
          "Yes. The buyer asked to be matched with one specialist, and one agent receives the lead. It is not shared or resold.",
      },
      {
        question: "Do you sell leads from the off-market register or the buying guide?",
        answer:
          "No. Those readers were told their details would not be passed on, so they are never sold. Buyer leads come only from people who asked to be matched with a specialist.",
      },
    ],
    cardText:
      "People buying or investing who asked to be matched with one specialist. Suits buyers agents who call fast and qualify finance early.",
    cardTags: ["Buying or investing", "Suburb", "Timeframe", "Preferred contact method"],
  },
  {
    slug: "property-developer-leads",
    n: "04",
    formValue: "developer",
    name: "Property developer leads",
    shortName: "project enquiries",
    audience: "Property developers and builders",
    recipient: "developer or builder",
    askers: "developers and builders",
    title: "Property Developer Leads | House & Land and New Project Buyer Enquiries",
    description:
      "Buyer enquiries for Australian property developers and home builders: list your house-and-land packages on Your Property Guide and enquiries on your packages come to you, with no share of the sale. Pay per enquiry, no lock-in.",
    h1: "Buyer enquiries for developers and builders, from people",
    h1Em: "already reading about new homes.",
    lede:
      "This is a listing model, not a list of names. You put your house-and-land packages in front of buyers researching new homes, grants and stamp duty on our site. When one of them enquires about your package, the enquiry comes to you and nobody else. We will tell you what enquiry volume looks like for your location before you commit.",
    volume: "Listing model",
    docketTitle: "Package enquiry",
    docket: [
      { key: "Received", value: "Sat 19 Sep 2026", note: "· 11:40am AEST" },
      { key: "Package", value: "Four-bedroom home and 400 m² lot", note: "· illustrative" },
      { key: "Estate", value: "Your estate", note: "· your listing" },
      { key: "Message", value: "\"Is the block titled, and can we inspect the display home this weekend?\"" },
      { key: "Contact", value: "Sam", note: "· mobile and email" },
    ],
    docketConsents: ["Enquiry to you only", "Mobile required", "Package named"],
    stats: [
      { value: "1", label: "Recipient per enquiry" },
      { value: "0%", label: "Share of the sale" },
      { value: "100%", label: "With a mobile" },
      { value: "7 days", label: "Replacement window" },
    ],
    sourcesIntro:
      "New-home buyers on the site are usually part-way through the research: grants, stamp duty concessions, whether house and land is worth it, and how to choose a builder. Your packages sit in the house-and-land section they browse, and each package page carries its own enquiry form.",
    sources: [
      { label: "House and land packages", href: "/house-and-land", why: "Where your packages are listed, by location and price." },
      { label: "Are house and land packages worth it?", href: "/guides/house-and-land-packages-are-they-worth-it", why: "The honest pros and cons. Readers who finish it and keep going are serious." },
      { label: "How to find a builder", href: "/guides/how-to-find-a-builder-australia", why: "Buyers vetting builders before they commit to a package." },
      { label: "First home owner grant", href: "/guides/first-home-owner-grant-australia", why: "New-build grants by state, the main reason many first home buyers look at new stock." },
      { label: "Stamp duty calculator", href: "/stamp-duty-calculator", why: "Buyers working out land-only and new-home concessions." },
      { label: "First home buyers", href: "/first-home-buyers", why: "Schemes, deposits and grants, state by state." },
    ],
    contents: [
      "Full name, email and mobile (mobile required)",
      "The package and estate they enquired about",
      "Their message, in their words",
      "Timestamp, and confirmation that the enquiry went to you",
    ],
    profilesIntro: "Three new-home buyers typical of the people who enquire on packages. Composites, but the shape is right.",
    profiles: [
      {
        title: "The first home buyer chasing the grant",
        text: "Has read the grant and stamp duty guides for their state and knows a new build is where the concessions are. Wants to know what is titled, what the build timeline is, and what the total cost looks like.",
      },
      {
        title: "The investor comparing stock",
        text: "Comparing house and land with established property on yield and depreciation. Wants rental estimates, the land size and the build contract terms. Answer with numbers, not a brochure.",
      },
      {
        title: "The upgrader building next",
        text: "Selling an established home and building their next one. Timing is everything: land settlement, build time and when they need to be out. A builder who talks through the timeline wins the conversation.",
      },
    ],
    working: [
      { head: "Answer the question they asked.", text: "Package enquiries come with a message. Reply to it specifically, with the land, the price and the next available inspection time." },
      { head: "Call the same day.", text: "New-home buyers enquire on several packages in one sitting. The first builder or sales consultant to ring with answers gets the display-home visit." },
      { head: "Qualify finance and timing early.", text: "Pre-approval, deposit, grant eligibility and when they need to move. It decides whether they are buying this release or the next." },
      { head: "Plan for a long cycle.", text: "From first enquiry to settlement on a new build can take many months. Construction updates and display-home invites keep the buyer engaged." },
      { head: "Report what sold.", text: "Deposits and contracts from our enquiries. It shows which package pages work and helps us place your stock in front of the right readers." },
    ],
    chapter: {
      title: "From a pre-sales target back to the enquiries you need.",
      kicker: "The maths developers skip, worked through",
      paragraphs: [
        "Lenders usually want a share of a project sold before they fund construction. Work backwards from that number and you get the enquiry volume a campaign has to produce: pre-sales needed, divided by the share of qualified buyers who pay a deposit, divided by the share of enquiries who become qualified buyers.",
        "The example below uses a 40-lot release with 26 pre-sales needed. The conversion rates are placeholders, not benchmarks; use your own from the last release. The point is the shape: small changes in how many enquiries you follow up properly change the enquiry count you need far more than the price of each enquiry does.",
      ],
      table: {
        head: ["If this many enquiries become qualified buyers", "And this many qualified buyers pay a deposit", "Enquiries needed for 26 pre-sales"],
        rows: [
          ["1 in 5 (20%)", "1 in 2 (50%)", "260"],
          ["1 in 10 (10%)", "1 in 2 (50%)", "520"],
          ["1 in 10 (10%)", "1 in 4 (25%)", "1,040"],
        ],
        caption:
          "Illustrative. Pre-sale requirements vary by lender and project, and your conversion rates will differ. Not a forecast of enquiry volume from Your Property Guide.",
      },
    },
    faqs: [
      {
        question: "What are property developer leads?",
        answer:
          "For us, they are buyer enquiries for new homes: people who enquired about your house-and-land package on Your Property Guide. They are not contact lists of developers, and they are not trade or renovation job leads.",
      },
      {
        question: "How do developers and builders receive enquiries?",
        answer:
          "You list your house-and-land packages on the site. Each package page has an enquiry form, and an enquiry on your package goes to you alone, by email, with the buyer's name, mobile, email and message.",
      },
      {
        question: "How much do enquiries cost?",
        answer:
          "Pay per enquiry, priced by location and volume, with no platform fee, no minimum and no share of the sale. Register and we will send current availability and pricing in writing within one business day.",
      },
      {
        question: "How many enquiries will we get?",
        answer:
          "It depends on your location, your price point and how many packages you list. We will quote realistic enquiry numbers for your location before you list, and we will not promise a number we cannot back.",
      },
      {
        question: "Do you supply off-the-plan apartment buyers?",
        answer:
          "Not as a separate product yet. Our new-home enquiries today come from house-and-land package listings. If you are marketing an off-the-plan project, tell us on the form and we will let you know what we can do.",
      },
      {
        question: "Are these the same as builder leads on trade directories?",
        answer:
          "No. Trade directories send renovation and construction jobs. These are home buyers enquiring about a specific house-and-land package, which suits volume builders, developers and their sales teams.",
      },
    ],
    cardText:
      "New-home buyers enquiring about your house-and-land packages, sent to you alone. A listing model with no share of the sale.",
    cardTags: ["Package and estate", "Buyer's message", "Mobile, required", "Enquiry to you only"],
  },
];

export function getLeadTypePage(slug: string): LeadTypePage | undefined {
  return leadTypePages.find((p) => p.slug === slug);
}
