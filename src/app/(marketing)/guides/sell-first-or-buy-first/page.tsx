import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { HowToJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Sell First or Buy First? The Australian Mover's Decision Guide (2026)",
  description:
    "When you're moving home, do you sell first or buy first? Walk through the trade-offs, market signals, and the three financing options (sell first, subject-to-sale, bridging loan) with worked examples.",
  slug: "sell-first-or-buy-first",
  publishedAt: "2026-05-06",
  updatedAt: "2026-05-06",
  readingTimeMinutes: 8,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "upgrading",
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

const TLDR = [
  "There are three options for moving home: sell first, buy first with a subject-to-sale offer, or buy first with a bridging loan. Each trades cost against timing risk.",
  "Sell first is the cheapest financially but you may need short-term accommodation, and you might end up settling for the wrong next home in a hurry.",
  "Subject-to-sale offers work in slow private-treaty markets but are almost never accepted at auction or in hot conditions.",
  "Bridging loans give you the most timing flexibility but typically add $3,000 to $6,000+ in interest, fees, and double-holding costs over a 6-month bridging period.",
  "The right answer depends on three things: market direction (is it rising or softening?), your equity position, and your appetite for moving twice.",
  "Get appraisals on your existing home and pre-approval for the bridging or end-debt loan before you make the decision.",
];

const TOC: GuideTOCEntry[] = [
  { id: "the-question",   label: "Why this is hard" },
  { id: "three-options",  label: "The three options" },
  { id: "market-signal",  label: "What the market is telling you" },
  { id: "your-position",  label: "What your position is telling you" },
  { id: "decision-tree",  label: "Decision tree" },
  { id: "worked-examples",label: "Worked examples" },
  { id: "common-mistakes",label: "Common mistakes" },
  { id: "next-steps",     label: "Next steps" },
];

const FAQS: FaqItem[] = [
  {
    question: "Is it always cheaper to sell first?",
    answer:
      "On a pure interest-and-fees basis, almost always. Selling first avoids bridging interest, double council rates and insurance, and the second valuation. Where sell-first can become more expensive: if you can't find the right next home and end up settling for the wrong one, or if you're stuck in a sharply rising market and prices on your target suburb climb 5 to 10% during your search.",
  },
  {
    question: "What's a subject-to-sale offer?",
    answer:
      "A conditional offer on the new home, conditional on the sale of your existing one within a defined window (commonly 60 to 90 days). The seller can usually still accept other offers and you typically have right of first refusal. Common in soft private-treaty markets, almost never accepted at auction or in hot conditions.",
  },
  {
    question: "How long should a bridging period be?",
    answer:
      "Standard is 6 months for an established home, up to 12 months for a build. Most lenders won't extend much beyond that without a substantial price reduction on the old home. See our Bridging Loans guide for the detail.",
  },
  {
    question: "What if I need accommodation between selling and buying?",
    answer:
      "Three options: short-term rental ($600 to $1,200/week + bond + furniture), staying with family, or negotiating a leaseback with the buyer of your old home (often 30 to 90 days at market rent). Leaseback is increasingly common and the cleanest solution if your buyer is open to it. Build the leaseback ask into your sale negotiations.",
  },
  {
    question: "Should I buy or sell first in a rising market?",
    answer:
      "There's no clean answer, but the bias is toward buying first because the next home will cost more if you wait. Bridging or subject-to-sale lets you lock in today's price on the next purchase. The risk is that selling becomes harder than expected and you face a bridging extension or have to drop your asking price.",
  },
  {
    question: "What about in a softening market?",
    answer:
      "Selling first becomes the safer option. In a soft market, your next home will likely still be available (or cheaper) when you're ready to buy, but selling could take longer than the bridging period. Subject-to-sale offers also become more viable because sellers have less leverage.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Bridging Loans Guide",          href: "/guides/bridging-loans-guide",     description: "How peak debt, end debt and capitalised interest actually work." },
  { title: "How to Choose a Selling Agent", href: "/guides/how-to-choose-a-selling-agent", description: "Get the right agent listing the old home before you commit." },
  { title: "Property Auction Guide",        href: "/guides/property-auction-guide",   description: "If buying first, what to expect at auction (and why subject-to-sale won't fly there)." },
  { title: "Free Property Appraisal",       href: "/appraisal",                       description: "Know what your current home is worth, the foundation of every option." },
  { title: "Borrowing Power Calculator",    href: "/borrowing-power-calculator",      description: "What you can borrow on the next one before you commit either way." },
];

export default function SellFirstOrBuyFirstPage() {
  return (
    <>
      <HowToJsonLd
        name="How to decide whether to sell first or buy first"
        description="The decision framework for moving home: sell first, buy first with subject-to-sale, or use bridging finance."
        url={`/guides/${FRONTMATTER.slug}`}
        steps={[
          { name: "Get appraisals on your existing home", text: "Three written appraisals from local agents to set a realistic baseline value." },
          { name: "Get pre-approval for the bridging or end-debt loan", text: "Tells you what financial flexibility you have under each option.", url: "/borrowing-power-calculator" },
          { name: "Assess the market direction", text: "Rising market favours buying first; soft market favours selling first." },
          { name: "Pick your option", text: "Sell first, subject-to-sale offer, or bridging finance, based on cost, risk and timing fit." },
          { name: "Line up the supporting cast", text: "Conveyancer, broker, and buyer's agent or selling agent before you commit either way.", url: "/find-an-expert" },
          { name: "Execute and coordinate", text: "Run the two transactions in lockstep through to settlement." },
        ]}
      />
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="info" title="There's no universally right answer">
        <p>
          The right call depends on the market direction, your equity
          position, and your appetite for moving twice. We'll walk through the
          framework and a few worked examples, but get advice tailored to your
          actual numbers from a broker before committing.
        </p>
      </Callout>

      <h2 id="the-question">Why this is hard</h2>
      <p className="lead">
        When you're moving from one home to another, two transactions need to
        talk to each other. Sell too early and you're in temporary
        accommodation while you search. Buy too early and you're carrying two
        properties (and two mortgages) until the old one sells. Either path
        has costs, and either path has risks.
      </p>
      <p>
        The "right" answer isn't about a universal rule, it's about matching
        the option to your specific market, equity, and timing constraints.
      </p>

      <h2 id="three-options">The three options</h2>

      <h3>Option 1: Sell first, then buy</h3>
      <p>
        List and sell your existing home first. Settle. Use the proceeds (plus
        a new mortgage) to buy the next one.
      </p>
      <p>
        <strong>Pros:</strong> Cheapest financially. You know exactly what
        budget you have for the next home (no need to guess). Cleanest position
        for negotiating the next purchase.
      </p>
      <p>
        <strong>Cons:</strong> You typically need short-term accommodation
        between settlements (rental, family, or leaseback from your buyer). In
        a fast-rising market, prices on your target suburb may run away while
        you search. Pressure to settle for "good enough" on the next home.
      </p>

      <h3>Option 2: Buy first with a subject-to-sale offer</h3>
      <p>
        Make a conditional offer on the new home, conditional on the sale of
        your existing one within a defined window (60 to 90 days is common).
        The seller can usually still accept other offers; you typically have
        right of first refusal if a competing offer comes in.
      </p>
      <p>
        <strong>Pros:</strong> Locks in today's price on the next purchase
        without bridging cost. No double-mortgage risk. No bridging fees or
        interest.
      </p>
      <p>
        <strong>Cons:</strong> Sellers rarely accept subject-to-sale in hot
        markets or at auction. Your offer is weaker than an unconditional one
        from someone else. If your sale stalls, the seller can walk and accept
        another offer.
      </p>

      <h3>Option 3: Buy first with a bridging loan</h3>
      <p>
        Use a bridging loan to cover the gap. The lender holds both properties
        as security while you sell the old one. Standard bridging period is 6
        months for an established home.
      </p>
      <p>
        <strong>Pros:</strong> Most timing flexibility. You can move when you
        want, sell when the market suits, and avoid the rushed handover. You
        present as an unconditional buyer on the new home.
      </p>
      <p>
        <strong>Cons:</strong> Most expensive. Capitalised bridging interest,
        application/discharge fees, two valuations, and double holding costs
        (rates, insurance, utilities) for the bridging period. Read our{" "}
        <Link href="/guides/bridging-loans-guide">Bridging Loans guide</Link>{" "}
        for the full mechanics.
      </p>

      <h2 id="market-signal">What the market is telling you</h2>
      <p>
        Market direction is the strongest signal in this decision. Look at:
      </p>
      <ul>
        <li>
          <strong>Days on market</strong> in your target suburb (the next home).
          Under 30 days and falling? Hot market, sellers won't entertain
          subject-to-sale, and prices may rise during a sell-first search.
        </li>
        <li>
          <strong>Days on market</strong> in your existing suburb. Comparable
          properties selling within 30 days? Your sell-first risk is lower.
          Sitting at 60 to 90+ days? Bridging gets risky because your old home
          may not clear within the bridging period.
        </li>
        <li>
          <strong>Auction clearance rates</strong> in both suburbs. Above 70%
          suggests competitive demand. Below 55% suggests buyers have time and
          subject-to-sale offers may be entertained.
        </li>
        <li>
          <strong>Quarterly price movement</strong>. Up 2%+ over the last
          quarter on your target suburb argues for buying first. Flat or down
          argues for selling first.
        </li>
      </ul>

      <KeyFigure
        value="Hot vs Soft"
        label="In hot markets, bias toward buying first. In soft markets, bias toward selling first."
        context="Days on market is the cleanest single signal"
      />

      <h2 id="your-position">What your position is telling you</h2>
      <p>Run through these checks honestly:</p>
      <ul>
        <li>
          <strong>Equity in your existing home:</strong> Bridging needs
          meaningful equity (usually 20%+ after the new purchase) for peak debt
          to fit within lender LVR caps. Thin equity rules out bridging.
        </li>
        <li>
          <strong>End-debt serviceability:</strong> Can your income comfortably
          service the mortgage you'll be left with after the move? Lender will
          assess at standard rates plus a buffer. Tight serviceability is a
          warning sign for any path.
        </li>
        <li>
          <strong>Cash reserve:</strong> Even with bridging, you'll need cash
          for stamp duty, conveyancing, valuations, and a bridging period of
          double holding costs. Allow $20K to $50K of cash buffer for a
          straightforward move.
        </li>
        <li>
          <strong>Family flexibility:</strong> Can you stay with family,
          friends, or in a short-term rental between settlements if you sell
          first? Children's schools or work proximity may make this hard.
        </li>
        <li>
          <strong>Risk tolerance:</strong> Bridging makes the move smoother but
          introduces lender-forced-sale risk if the old home doesn't clear in
          time. Sell-first introduces "settling for the wrong next home" risk.
        </li>
      </ul>

      <h2 id="decision-tree">Decision tree</h2>
      <p>If we boil it down:</p>
      <ol>
        <li>
          <strong>Is the next-home market hot</strong> (days on market under
          30, clearance above 70%, prices rising 2%+/quarter)? <strong>If
          yes</strong>, buying first is favoured. <strong>If no</strong>, sell
          first becomes more attractive.
        </li>
        <li>
          <strong>If buying first, do you have the equity for bridging?</strong>{" "}
          Peak debt LVR has to fit within 75 to 80% on combined property value.
          <strong> If no</strong>, you're stuck with subject-to-sale or sell
          first.
        </li>
        <li>
          <strong>If subject-to-sale, will sellers in the target market
          entertain it?</strong> Soft private treaty: yes. Auction or hot
          market: rarely. <strong>If no</strong>, bridging or sell first are
          your options.
        </li>
        <li>
          <strong>If selling first, can you handle accommodation between
          settlements?</strong> Family, leaseback from your buyer, short-term
          rental. <strong>If no</strong>, bridging is the fallback.
        </li>
      </ol>

      <h2 id="worked-examples">Worked examples</h2>

      <h3>Example A, hot market, strong equity</h3>
      <p>
        Sydney inner-west. Existing home worth $1.6M, owe $400K. Target
        suburb (next home) has 18 days median on market, clearance rate 78%,
        prices up 3% last quarter. You've found a $2.1M home you love.
      </p>
      <p>
        <strong>Best option:</strong> Bridging. Subject-to-sale won't be
        accepted at auction in this market. Sell-first risks the next home
        going to a competing buyer or rising further in price. Equity supports
        peak debt LVR. Bridging cost (~$5K to $6K all in) is small relative to
        likely price rise on the target home if you delay.
      </p>

      <h3>Example B, soft market, average equity</h3>
      <p>
        Brisbane outer suburbs. Existing home worth $750K, owe $450K. Target
        suburb has 65 days median on market, clearance below 55%, flat prices.
        You've found a $850K home through private treaty.
      </p>
      <p>
        <strong>Best option:</strong> Subject-to-sale. The market gives you
        leverage and sellers in this segment routinely accept conditional
        offers. Bridging is risky because your old home may not clear within 6
        months in a soft market.
      </p>

      <h3>Example C, normal market, want to upgrade</h3>
      <p>
        Melbourne middle-ring. Existing home worth $1.2M, owe $600K. Target
        suburb has 40 days median on market, clearance 65%, prices up 1% last
        quarter. You've found a $1.5M place but you're flexible on which one.
      </p>
      <p>
        <strong>Best option:</strong> Sell first. Market is balanced enough
        that your next home (or one like it) will still be available in 2 to 3
        months. Subject-to-sale is plausible but you're competing with
        unconditional buyers. Sell-first gives you the cleanest position and
        avoids ~$5K of bridging cost. Negotiate a 60-day leaseback from your
        buyer if accommodation between settlements is a problem.
      </p>

      <h2 id="common-mistakes">Common mistakes</h2>
      <ul>
        <li>
          <strong>Treating optimism as a sale plan.</strong> "It'll definitely
          sell in 2 months" without a comparable-sales reality check is how
          bridging extensions happen.
        </li>
        <li>
          <strong>Underestimating end-debt serviceability.</strong> Peak debt
          gets all the attention, but the long-term mortgage is what you'll be
          paying for years. Don't stretch.
        </li>
        <li>
          <strong>Picking a selling agent based on appraisal price.</strong>{" "}
          Some agents quote high to win the listing, then condition you down.
          Use independent comparable sales as the reality check.
        </li>
        <li>
          <strong>Ignoring leaseback as an option.</strong> Negotiating a 30 to
          90 day leaseback from your buyer often gives you the bridging benefit
          (timing flexibility) without the cost. Build it into your sale terms.
        </li>
        <li>
          <strong>Treating bridging as a long-term solution.</strong> Bridging
          is for 6 months, not 12. If you can't be confident of selling in that
          window, look at sell-first or a different next home.
        </li>
      </ul>

      <h2 id="next-steps">Next steps</h2>
      <ol>
        <li>
          <strong>Get an independent appraisal</strong> on your existing home.{" "}
          <Link href="/appraisal">Free appraisal here</Link>. Use this for all
          your peak-debt and bridging-cost calculations.
        </li>
        <li>
          <strong>Run the numbers on all three options</strong> with realistic
          assumptions: market sale price, days to sell, bridging period,
          accommodation cost if selling first.
        </li>
        <li>
          <strong>Talk to a mortgage broker</strong> who's arranged bridging
          loans recently. Ask which lenders are writing them and at what
          terms.
        </li>
        <li>
          <strong>Pick the right selling agent</strong> for your existing home
          early, not after you've already committed to a path. See our{" "}
          <Link href="/guides/how-to-choose-a-selling-agent">selling agent guide</Link>.
        </li>
        <li>
          <strong>Make the decision and commit.</strong> Don't try to keep all
          three options open, you'll end up paying for optionality you can't
          use.
        </li>
      </ol>
    </GuideArticleLayout>
    </>
  );
}
