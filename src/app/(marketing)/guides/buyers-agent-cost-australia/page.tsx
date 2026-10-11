import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  MatchCTA,
  Sources,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

// Commercial-intent review 10 Oct 2026, buying 0.1 row 17 and 3.6: every fee
// on this guide was unsourced and undated (unchanged since 6 May), the
// licence answer named the wrong NSW licence category, a link card offered a
// directory of checked agents on a page that makes one introduction, and both
// CTAs pushed the selling guide. Until a dated,
// sourced fee table exists, the guide explains how buyer's agents charge
// with worked arithmetic, not market ranges.

const FRONTMATTER: GuideFrontmatter = {
  title: "Buyer's Agent Fees in Australia 2026: How They Charge",
  description:
    "How buyer's agents charge in Australia: fixed fees, percentages and bidding-only, what each costs on a worked example, licensing, and how to check one first.",
  slug: "buyers-agent-cost-australia",
  publishedAt: "2026-05-06",
  updatedAt: "2026-10-11",
  readingTimeMinutes: 8,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "investing",
};

export const metadata: Metadata = {
  title: FRONTMATTER.title,
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

/** The buyer match: intent buying, the #57 disclosure, no new form. */
const MATCH_HREF = "/find-an-expert?intent=buying";
const NSW_BUYERS_AGENT = {
  label: "NSW Government: Using a real estate agent to buy a property",
  href: "https://www.nsw.gov.au/housing-and-construction/buying-and-selling-property/buying-property-nsw/using-a-real-estate-agent-to-buy-a-property",
};
const NSW_LICENCE_CHECK = {
  label: "NSW Government: Check a licence for a property agent or conveyancer",
  href: "https://www.nsw.gov.au/housing-and-construction/buying-and-selling-property/buying-property-nsw/preparing-to-purchase/property-agent-or-conveyancer-licence-check",
};
const CAV_ESTATE_AGENTS = {
  label: "Consumer Affairs Victoria: Estate agents (licensing and registration)",
  href: "https://www.consumer.vic.gov.au/licensing-and-registration/estate-agents",
};

/** Worked arithmetic for a percentage fee: the fee is the rate times the price. */
const pctFee = (pct: number, price: number) => `$${Math.round((price * pct) / 100).toLocaleString("en-AU")}`;

const TLDR = [
  "A buyer's agent works for you, the buyer, and charges you directly: a fixed fee, a percentage of the purchase price, or a per-auction fee for bidding only.",
  `A percentage fee grows with the price: at 2%, a $1,000,000 purchase costs ${pctFee(2, 1_000_000)} and a $1,500,000 purchase ${pctFee(2, 1_500_000)}. A fixed fee doesn't, which removes any reward for you paying more.`,
  "We have not found a regulator or survey figure for typical fees that we can source and date, so this guide gives no market range. Get three written quotes and compare them on the same price.",
  "In NSW a buyer's agent must hold a real estate agent's licence, or a certificate of registration and work under a licensed agent (NSW Government). Check the licence on the public register before you sign.",
  "Best fit: buying interstate, time-poor buyers, and contested markets. Less obvious value if you've bought in the suburb before.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-they-do",     label: "What buyer's agents actually do" },
  { id: "fee-models",       label: "How buyer's agents charge" },
  { id: "regulated",        label: "Are buyer's agents regulated?" },
  { id: "is-it-worth-it",   label: "Is a buyer's agent worth it?" },
  { id: "what-to-ask",      label: "How to check a buyer's agent before you sign" },
  { id: "vs-selling-agent", label: "Buyer's agent vs selling agent" },
  { id: "next-steps",       label: "Next steps" },
];

const FAQS: FaqItem[] = [
  {
    question: "What's the average buyer's agent fee in Australia?",
    answer:
      `We have not found an official or survey average we can source and date, and agencies quote case by case. What you can compare is the structure: a fixed fee, or a percentage of the price, which at 2% is ${pctFee(2, 1_000_000)} on a $1,000,000 home. Ask three agents for a written quote on the same brief and price.`,
  },
  {
    question: "Are buyers agents worth it in Australia?",
    answer:
      "They can be when the search is the bottleneck: buying interstate, buying with little time, or in a market where you keep losing at auction. They are worth less if you know the suburb's recent sales already. Weigh the quoted fee against what you would otherwise spend in time, and against the price discipline an agent who is not emotionally invested brings.",
  },
  {
    question: "Do you pay a buyer's agent upfront?",
    answer:
      "It depends on the engagement agreement, which sets what is payable when you sign, what on exchange or settlement, and what if you withdraw. Ask for it in writing before you pay anything, and check whether any part is refundable if you don't buy.",
  },
  {
    question: "Is the fee tax deductible?",
    answer:
      "For an investment property, a buyer's agent fee is a cost of buying the asset, so it forms part of the cost base and reduces capital gains tax when you sell; it is not deducted in the year you pay it. For a home you live in, it is not deductible. Check with your accountant for your circumstances.",
  },
  {
    question: "Are buyer's agents licensed?",
    answer:
      "Yes. In NSW a buyer's agent must hold a real estate agent's licence, or hold a certificate of registration and work under the direction of a licensed real estate agent (NSW Government, read 11 October 2026). Other states license estate agents too. Check the licence on your state's public register before you sign an engagement.",
  },
  {
    question: "What is the difference between a selling agent and a buyer's agent?",
    answer:
      "A selling agent is hired and paid by the vendor to get the best price for the vendor. A buyer's agent is hired and paid by you to find the right property and pay no more than it is worth. They work for opposite sides of the same deal.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Property Auction Guide", href: "/guides/property-auction-guide", description: "If you're heading to auction with or without a buyer's agent, here's the playbook." },
  { title: "How to Negotiate a Property Price", href: "/guides/how-to-negotiate-property-price-australia", description: "Negotiating a private sale yourself." },
  { title: "Buying Property in Australia", href: "/guides/buying-property-australia", description: "The full step-by-step buying process." },
  { title: "Off-Market Properties", href: "/off-market", description: "Properties before they hit Domain or realestate.com.au." },
  { title: "Find an Expert", href: MATCH_HREF, description: "Tell us your situation: one specialist receives your details and pays us a fee for the introduction." },
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
          buyer&rsquo;s agent is paid by you and acts in yours. Different role,
          different fee structure, different incentives.
        </p>
      </Callout>

      <h2 id="what-they-do">What buyer&rsquo;s agents actually do</h2>
      <p className="lead">
        A full-service buyer&rsquo;s agent runs the purchase from brief to settlement:
        suburb research, shortlisting, due diligence, contract review,
        negotiation, and often bidding at auction. A bidding-only service is
        narrower: they attend the auction and bid to your maximum.
      </p>

      <ul>
        <li><strong>Brief and shortlist:</strong> turn your goals into a property brief, then find candidates on and off the market.</li>
        <li><strong>Inspection and due diligence:</strong> inspect for you, arrange building and pest reports, review strata records.</li>
        <li><strong>Pricing:</strong> pull recent comparable sales and say what the property is worth, not what the selling agent quotes.</li>
        <li><strong>Negotiation or bidding:</strong> handle a private sale negotiation or bid at auction for you.</li>
        <li><strong>Settlement:</strong> work with your conveyancer and broker through to handover.</li>
      </ul>

      <h2 id="fee-models">How buyer&rsquo;s agents charge</h2>
      <p>
        Fees are set by each agency and quoted case by case. We have not found a regulator or
        survey figure for typical fees that we can source and date, so there is no market range
        here. What you can compare is the structure, and the arithmetic behind it.
      </p>

      <h3>Fixed fee</h3>
      <p>
        A flat dollar amount agreed upfront, whatever the purchase price. Its advantage is that the
        agent earns nothing extra if you pay more. Some agencies set fixed fees in price brackets.
      </p>

      <h3>Percentage of the purchase price</h3>
      <p>
        The fee is a percentage of what you pay. At 1.5%, a $1,000,000 purchase costs{" "}
        {pctFee(1.5, 1_000_000)}; at 2%, {pctFee(2, 1_000_000)}; at 2% on $1,500,000,{" "}
        {pctFee(2, 1_500_000)}. The drawback is the incentive: the agent earns more if you pay more,
        so ask for a cap.
      </p>

      <h3>Bidding only</h3>
      <p>
        A per-auction fee. You do the research and inspections; the agent attends the auction
        and bids for you to a maximum you agree in writing beforehand.
      </p>

      <Callout variant="warning" title="Watch for hidden referrals">
        <p>
          Some &ldquo;free&rdquo; buyer&rsquo;s agents are paid by selling agents or developers
          for steering buyers their way. The fee feels free to you but you may
          end up looking only at properties from a narrow seller pool. Read the
          engagement agreement for any third-party commissions.
        </p>
      </Callout>

      <h2 id="regulated">Are buyer&rsquo;s agents regulated?</h2>
      <p>
        Yes, as real estate agents. In NSW a buyer&rsquo;s agent must hold either a real estate
        agent&rsquo;s licence, or a certificate of registration and work under the direction of a
        licensed real estate agent (
        <a href={NSW_BUYERS_AGENT.href} target="_blank" rel="noopener noreferrer">NSW Government</a>
        , read 11 October 2026). Every other state and territory licenses estate agents too, through
        its consumer affairs or fair trading agency; in Victoria that is{" "}
        <a href={CAV_ESTATE_AGENTS.href} target="_blank" rel="noopener noreferrer">Consumer Affairs Victoria</a>.
      </p>
      <p>
        Before you sign, look the agent and the agency up on the state&rsquo;s public register (in
        NSW, through the{" "}
        <a href={NSW_LICENCE_CHECK.href} target="_blank" rel="noopener noreferrer">licence check</a>
        ) and confirm the name on the engagement agreement matches.
      </p>

      <h2 id="is-it-worth-it">Is a buyer&rsquo;s agent worth it?</h2>

      <h3>Strong fit</h3>
      <ul>
        <li>You&rsquo;re buying interstate and don&rsquo;t know the local market.</li>
        <li>You&rsquo;re time-poor and the search itself is the bottleneck.</li>
        <li>You&rsquo;re an investor and off-market stock matters to you.</li>
        <li>You&rsquo;ve lost several auctions and want a professional bidder.</li>
      </ul>

      <h3>Weaker fit</h3>
      <ul>
        <li>You&rsquo;ve bought in this suburb before and know its recent sales.</li>
        <li>The market is soft and stock is plentiful, so leverage already favours buyers.</li>
        <li>The fee would be a large share of a modest price, so work it out against your budget first.</li>
      </ul>

      <MatchCTA
        kind="buyers-agent"
        lead="Buying soon? Tell us where you're buying: one buyer's agent receives your details and pays us a fee for the introduction. You pay us nothing, and there's no commitment."
        ctaLabel="Tell us what you're buying"
        href={MATCH_HREF}
      />

      <h2 id="what-to-ask">How to check a buyer&rsquo;s agent before you sign</h2>
      <ol>
        <li>Check the licence (or registration) on your state&rsquo;s public register.</li>
        <li>What&rsquo;s your fee, and is it fixed, a percentage, or capped? Put it in writing.</li>
        <li>What&rsquo;s included (inspections, reports, contract review, auction bidding)?</li>
        <li>What is payable on signing, on exchange or settlement, and if I withdraw?</li>
        <li>How many properties have you bought in my target suburb in the last 12 months?</li>
        <li>Do you take any payment from selling agents or developers? On which properties?</li>
        <li>Can I see recent client outcomes (price paid against comparable sales)?</li>
      </ol>

      <h2 id="vs-selling-agent">Buyer&rsquo;s agent vs selling agent</h2>
      <p>
        A selling agent (what most people just call &ldquo;the agent&rdquo;) is hired by
        the vendor to market and sell their property, and is paid commission when it sells.
        Our <Link href="/guides/real-estate-agent-fees-australia">agent fees guide</Link> covers
        what sellers pay.
      </p>
      <p>
        A buyer&rsquo;s agent is hired by you, the buyer, and acts for you. The engagement agreement
        sets when they are paid and whether you pay if you don&rsquo;t buy.
      </p>

      <h2 id="next-steps">Next steps</h2>
      <ol>
        <li>Decide which service fits: bidding-only can be enough if you already know the suburb.</li>
        <li>Get three written quotes on the same brief and price, and compare structures and inclusions.</li>
        <li>Check each agent&rsquo;s licence on your state&rsquo;s register.</li>
        <li>
          Get pre-approval and run our{" "}
          <Link href="/borrowing-power-calculator">borrowing power calculator</Link>{" "}
          so the agent works to a budget a lender may support.
        </li>
      </ol>

      <Sources
        items={[
          { label: NSW_BUYERS_AGENT.label, href: NSW_BUYERS_AGENT.href, note: "read 11 October 2026" },
          { label: NSW_LICENCE_CHECK.label, href: NSW_LICENCE_CHECK.href, note: "read 11 October 2026" },
          { label: CAV_ESTATE_AGENTS.label, href: CAV_ESTATE_AGENTS.href, note: "read 11 October 2026" },
          "Fee examples are arithmetic on the rates shown, not market figures.",
        ]}
      />
    </GuideArticleLayout>
  );
}
