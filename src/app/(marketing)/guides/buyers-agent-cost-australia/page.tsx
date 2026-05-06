import type { Metadata } from "next";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "How Much Does a Buyer's Agent Cost in Australia? (2026)",
  description:
    "Buyer's agent fees in Australia: fixed fees vs percentage commissions, typical ranges by market, what's included, and when paying $10K to $25K is worth it.",
  slug: "buyers-agent-cost-australia",
  publishedAt: "2026-05-06",
  updatedAt: "2026-05-06",
  readingTimeMinutes: 8,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "investing",
};

export const metadata: Metadata = {
  title: `${FRONTMATTER.title} | ${SITE_NAME}`,
  description: FRONTMATTER.description,
  alternates: { canonical: `${SITE_URL}/guides/${FRONTMATTER.slug}` },
  openGraph: {
    url: `${SITE_URL}/guides/${FRONTMATTER.slug}`,
    title: FRONTMATTER.title,
    description: FRONTMATTER.description,
    type: "article",
    publishedTime: FRONTMATTER.publishedAt,
    modifiedTime: FRONTMATTER.updatedAt,
    images: guideOgImages({
      slug: FRONTMATTER.slug,
      title: FRONTMATTER.title,
      description: FRONTMATTER.description,
      persona: FRONTMATTER.persona,
    }),
  },
};

const TLDR = [
  "Buyer's agent fees in Australia typically range from $8,000 to $25,000 for a full-service engagement, depending on price point and market.",
  "Two pricing models dominate: a fixed fee (often $10,000 to $18,000 in capital cities) or a percentage of the purchase price (1.5% to 3%).",
  "Auction bidding only services are cheaper — typically $500 to $1,500 per auction.",
  "On a $1.5M Sydney purchase, a buyer's agent at 2% costs $30,000. The decision is whether they save you that much in price negotiation, off-market access, or research time.",
  "Best fit: investors buying interstate, time-poor professionals, and first-time buyers in tightly contested markets. Less obvious value if you've already bought in your suburb before.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-they-do",     label: "What buyer's agents actually do" },
  { id: "fee-models",       label: "Fee models &amp; ranges" },
  { id: "by-service",       label: "Cost by service tier" },
  { id: "by-market",        label: "Cost by market" },
  { id: "is-it-worth-it",   label: "When it's worth it" },
  { id: "what-to-ask",      label: "What to ask before signing" },
  { id: "vs-selling-agent", label: "Buyer's agent vs selling agent" },
  { id: "next-steps",       label: "Next steps" },
];

const FAQS: FaqItem[] = [
  {
    question: "What's the average buyer's agent fee in Australia?",
    answer:
      "For a full search-to-settlement engagement on a $1M to $1.5M property, expect $12,000 to $25,000. Fixed fees in Sydney and Melbourne sit around $15,000 to $18,000 for capital city houses; percentage fees of 1.5% to 2% are common at higher price points. Auction bidding only is much cheaper at $500 to $1,500 per auction.",
  },
  {
    question: "Do buyer's agents save money on the purchase price?",
    answer:
      "Sometimes, but not always. A skilled buyer's agent who knows the suburb can identify when the asking price is inflated and negotiate harder than an emotional buyer would. On a hot auction property, however, the ceiling is set by the highest bidder — your agent can't conjure a discount that the market won't give. The bigger value is often time saved and off-market access, not price.",
  },
  {
    question: "Is the fee tax deductible?",
    answer:
      "For investment properties, the buyer's agent fee is added to the cost base of the property and reduces capital gains tax when you sell. It's not immediately deductible like an interest expense. For owner-occupied purchases, the fee is not deductible at all. Check with your accountant for your specific circumstances.",
  },
  {
    question: "Can I negotiate the fee?",
    answer:
      "Yes. Fixed fees are more negotiable than percentage fees, especially if you're confident on the suburb already and only need search and negotiation help. Bringing your own pre-shortlisted properties or limiting the engagement to two or three suburbs can knock 10% to 20% off the quote.",
  },
  {
    question: "Are buyer's agents licensed?",
    answer:
      "Yes. Each state has a real estate or property licensing regime — for example, NSW requires a Class 1 or Class 2 Real Estate Licence (Stock and Station). Always check the licence number on your state's licensing register before signing an engagement letter.",
  },
  {
    question: "Do they have to be exclusive?",
    answer:
      "Most engagements are exclusive — you can't shop the same brief to multiple agents. Some firms offer a non-exclusive arrangement at a higher fee. Read the engagement letter carefully for the exclusivity clause and the term length (commonly 6 months).",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "How to Choose a Selling Agent", href: "/guides/how-to-choose-a-selling-agent", description: "On the other side of the deal: picking the agent who lists your existing home." },
  { title: "Property Auction Guide", href: "/guides/property-auction-guide", description: "If you're heading to auction with or without a buyer's agent, here's the playbook." },
  { title: "Real Estate Agent Fees in Australia", href: "/guides/real-estate-agent-fees-australia", description: "Selling agent commissions across every state, side-by-side." },
  { title: "Off-Market Properties", href: "/off-market", description: "Properties before they hit Domain or realestate.com.au — what buyer's agents access on your behalf." },
  { title: "Find an Expert", href: "/find-an-expert", description: "Browse buyer's agents and brokers we've vetted." },
];

export default function BuyersAgentCostGuide() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="info" title="Buyer's agents work for you, not the seller">
        <p>
          A selling agent is paid by the vendor and acts in their interest. A
          buyer's agent is paid by you and acts in yours. Different role,
          different fee structure, different incentives — don't confuse the two.
        </p>
      </Callout>

      <h2 id="what-they-do">What buyer's agents actually do</h2>
      <p className="lead">
        A full-service buyer's agent runs the purchase from brief to settlement:
        suburb research, shortlisting, due diligence, contract review,
        negotiation, and (often) bidding at auction. A bidding-only service is
        narrower — they show up on auction day and bid to your maximum.
      </p>

      <ul>
        <li><strong>Brief &amp; shortlist:</strong> Translate your goals into a property brief, then surface 5 to 15 candidates per week from on-market and off-market sources.</li>
        <li><strong>Inspection &amp; due diligence:</strong> Inspect on your behalf, commission building/pest reports, review strata records.</li>
        <li><strong>Pricing intelligence:</strong> Pull recent comparable sales and tell you what the property is genuinely worth (not what the agent claims).</li>
        <li><strong>Negotiation or bidding:</strong> Handle private treaty negotiations or bid at auction, often saving you the emotional component of the contest.</li>
        <li><strong>Settlement coordination:</strong> Coordinate with your conveyancer and broker through to handover.</li>
      </ul>

      <h2 id="fee-models">Fee models &amp; ranges</h2>

      <h3>Fixed fee</h3>
      <p>
        A flat dollar amount agreed upfront, regardless of the purchase price.
        Common at capital city houses around the median ($800K to $2M).
        Typical range: $10,000 to $18,000.
      </p>

      <h3>Percentage of purchase price</h3>
      <p>
        Usually 1.5% to 3% of the final purchase price. More common at higher
        price points and for prestige work. Drawback: misaligned incentive (the
        agent earns more if you pay more).
      </p>

      <h3>Tiered fixed fee</h3>
      <p>
        Some firms set fixed fees in price brackets, e.g. $12,000 up to $1.2M,
        $16,000 from $1.2M to $1.8M. Cleaner than a flat percentage and avoids
        the "incentive to overpay" problem.
      </p>

      <h3>Bidding only</h3>
      <p>
        $500 to $1,500 per auction. You handle research and inspection
        yourself; the agent attends the auction and bids on your behalf to a
        pre-agreed maximum.
      </p>

      <KeyFigure
        value="$10K to $25K"
        label="Typical full-service fee for an Australian capital city purchase"
        context="Fixed or percentage. Bidding-only is much cheaper at $500 to $1,500."
      />

      <h2 id="by-service">Cost by service tier</h2>
      <ul>
        <li><strong>Auction bidding only:</strong> $500 to $1,500 per auction</li>
        <li><strong>Negotiation only (you've found the property):</strong> $2,000 to $5,000</li>
        <li><strong>Shortlist + inspect (no negotiation):</strong> $5,000 to $9,000</li>
        <li><strong>Full search to settlement:</strong> $10,000 to $25,000+</li>
        <li><strong>Premium / prestige:</strong> 2% to 3% of purchase price</li>
      </ul>

      <h2 id="by-market">Cost by market</h2>
      <p>
        Fees scale with market size and complexity:
      </p>
      <ul>
        <li><strong>Sydney:</strong> $15,000 to $25,000 fixed for full service; 2% to 2.5% common at $2M+.</li>
        <li><strong>Melbourne:</strong> $13,000 to $20,000 fixed for full service.</li>
        <li><strong>Brisbane:</strong> $11,000 to $17,000 fixed.</li>
        <li><strong>Perth, Adelaide:</strong> $9,000 to $15,000 fixed.</li>
        <li><strong>Regional / interstate:</strong> Add 10% to 25% if the agent is travelling or working outside their home market.</li>
      </ul>

      <h2 id="is-it-worth-it">When a buyer's agent is worth it</h2>

      <h3>Strong fit</h3>
      <ul>
        <li>You're buying interstate and don't know the local market.</li>
        <li>You're a time-poor professional and the search itself is the bottleneck.</li>
        <li>You're an investor where access to off-market stock matters.</li>
        <li>You've lost two or three auctions and need professional bidding to break the streak.</li>
      </ul>

      <h3>Weaker fit</h3>
      <ul>
        <li>You've already bought in this suburb before and know the comps cold.</li>
        <li>The market is soft and stock is plentiful — negotiation leverage already favours buyers.</li>
        <li>You're buying near the bottom of the market ($400K to $600K) where the fixed fee swallows a large slice of your savings.</li>
      </ul>

      <Callout variant="warning" title="Watch for hidden referrals">
        <p>
          Some "free" buyer's agents are paid by selling agents or developers
          for steering buyers their way. The fee feels free to you but you may
          end up looking only at properties from a narrow seller pool. Read the
          engagement letter for any third-party commissions.
        </p>
      </Callout>

      <h2 id="what-to-ask">What to ask before signing</h2>
      <ol>
        <li>What's your fee, and is it fixed, percentage, or capped?</li>
        <li>What's included in the fee (inspections, reports, contract review)?</li>
        <li>How many properties have you transacted in my target suburb in the last 12 months?</li>
        <li>Are you taking any commission from selling agents or developers? If so, on which properties?</li>
        <li>What's the engagement term, and what happens if I withdraw?</li>
        <li>Will you bid at auction, and is that included or extra?</li>
        <li>Can I see your three most recent client outcomes (price paid vs comparable sales)?</li>
      </ol>

      <h2 id="vs-selling-agent">Buyer's agent vs selling agent</h2>
      <p>
        A selling agent (what most people just call "the agent") is hired by
        the vendor to market and sell their property. They're paid commission
        when the property sells, on a contract usually capped at 6 to 12 weeks.
      </p>
      <p>
        A buyer's agent is hired by you, the buyer. They get paid whether you
        buy or not (depending on the engagement structure), and have a fiduciary
        obligation to you. The two roles never act for the same client at once.
      </p>

      <h2 id="next-steps">Next steps</h2>
      <ol>
        <li>
          Decide which service tier fits — bidding-only is often enough if you
          already know the suburb.
        </li>
        <li>
          Get three written quotes. Compare fee structures, inclusions, and
          recent transactions.
        </li>
        <li>
          Cross-check their licence number on your state's real estate licensing
          register.
        </li>
        <li>
          Run a parallel{" "}
          <a href="/borrowing-power-calculator">Borrowing Power Calculator</a>{" "}
          and pre-approval so the agent knows your real budget on day one.
        </li>
      </ol>
    </GuideArticleLayout>
  );
}
