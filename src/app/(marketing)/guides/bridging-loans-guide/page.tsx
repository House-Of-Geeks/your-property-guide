import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  SectionDivider,
  MiniStampDutyEmbed,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Bridging Loans Australia: How They Work, Costs & When to Use One (2026)",
  description:
    "Bridging loan guide for Australians moving home: how peak debt and end debt work, typical interest rates, capitalised interest, the 6 to 12 month bridging period, and the alternatives.",
  slug: "bridging-loans-guide",
  publishedAt: "2026-05-06",
  updatedAt: "2026-05-06",
  readingTimeMinutes: 9,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "upgrading",
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
  "A bridging loan covers the gap between buying your new home and selling your old one. The lender holds both properties as security during the bridging period.",
  "The standard bridging period is 6 months for an established sale, up to 12 months for a build. After that, the loan typically reverts to standard terms or the lender forces a sale.",
  "Two figures matter: peak debt (existing mortgage + new property purchase + costs) and end debt (what's left after your old home sells).",
  "Most lenders capitalise the bridging interest, you don't service it monthly, it adds to peak debt and is paid down at sale. That makes the all-in cost higher than the headline rate suggests.",
  "Typical bridging rates sit around 0.5 to 1.5 percentage points above standard variable. On a $500K bridging amount over 6 months, that's roughly $1,500 to $4,500 of additional interest cost.",
  "Bridging is one of three options for moving home; the other two (sell first, buy first with conditional offer) often work out cheaper if your timing is flexible.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-is",          label: "What is a bridging loan?" },
  { id: "how-it-works",     label: "How bridging loans work" },
  { id: "peak-vs-end-debt", label: "Peak debt and end debt" },
  { id: "interest",         label: "Interest rates and capitalisation" },
  { id: "costs",            label: "True cost of bridging" },
  { id: "qualification",    label: "Will a lender approve me?" },
  { id: "timeframes",       label: "Bridging period and what happens after" },
  { id: "alternatives",     label: "Alternatives to bridging" },
  { id: "when-it-makes-sense", label: "When bridging is the right call" },
  { id: "process",          label: "The bridging loan process" },
];

const FAQS: FaqItem[] = [
  {
    question: "How long does a bridging loan last?",
    answer:
      "Standard bridging period is 6 months for buying an established home (assuming you're selling an existing one), and up to 12 months for a new build. If your old property hasn't sold by the end of the bridging period, lenders typically increase the rate substantially or require you to put it on the market with a price reduction. They can ultimately force a sale.",
  },
  {
    question: "Do I have to make repayments during the bridging period?",
    answer:
      "Most bridging loans capitalise the interest, meaning you don't make monthly repayments. The interest accrues and is added to the peak debt, paid down when your old home sells. This protects your cash flow during the move but increases the total interest cost. Some lenders allow you to service the bridging interest monthly if you prefer.",
  },
  {
    question: "What's peak debt vs end debt?",
    answer:
      "Peak debt is the maximum the lender owes during the bridging period: existing mortgage + new property purchase price + stamp duty + capitalised bridging interest. End debt is what remains after your old property sells and the proceeds pay down peak debt. The lender assesses your ability to service the end debt, not the peak.",
  },
  {
    question: "What if my old home doesn't sell in time?",
    answer:
      "The lender will typically extend by 1 to 3 months at a higher rate, then require you to drop the asking price. Worst case, they force a sale to recover their position. Practical mitigations: list the old home before settlement on the new one, price realistically, and accept a slightly lower offer rather than letting the bridging period blow out.",
  },
  {
    question: "Can I get a bridging loan with no equity in my old home?",
    answer:
      "Generally no. Most lenders require meaningful equity in the existing property (often 20% or more after the new purchase) so peak debt sits within their LVR limits. If you have very little equity, you'll usually be steered toward selling first or making a subject-to-sale offer.",
  },
  {
    question: "How much extra does bridging cost vs selling first?",
    answer:
      "On a $500K bridging amount over 6 months at a rate 1 percentage point above standard variable, you're looking at roughly $2,500 of additional interest cost (capitalised). Plus you pay double council rates, insurance, and possibly utilities for the bridging period. Sell-first avoids almost all of this but introduces accommodation costs (rent, storage). Run the numbers both ways before deciding.",
  },
  {
    question: "Do bridging loans need a separate mortgage application?",
    answer:
      "Yes. The bridging loan is a separate facility, even if it's with your existing lender. You'll need a fresh application, valuations on both properties, and serviceability assessment on the end debt. Allow 4 to 8 weeks from application to settlement of the new property.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Sell First or Buy First?",          href: "/guides/sell-first-or-buy-first",  description: "The decision tree before you commit to a bridging loan." },
  { title: "How to Choose a Selling Agent",     href: "/guides/how-to-choose-a-selling-agent", description: "Get the right agent listing your old home before bridging starts." },
  { title: "Free Property Appraisal",           href: "/appraisal",                       description: "Know what your current home is worth, the foundation of any bridging plan." },
  { title: "Borrowing Power Calculator",        href: "/borrowing-power-calculator",      description: "Estimate end-debt serviceability before you talk to a broker." },
  { title: "Stamp Duty Calculator",             href: "/stamp-duty-calculator",           description: "Stamp duty on the new place is part of peak debt, factor it in." },
];

export default function BridgingLoansGuidePage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Talk to a broker before you commit">
        <p>
          Bridging loans are one of the more expensive ways to move home and
          are quoted differently by every lender. Peak-debt LVR caps, rate
          margins, and how interest is capitalised vary significantly. Run
          the numbers with a mortgage broker before signing anything.
        </p>
      </Callout>

      <h2 id="what-is">What is a bridging loan?</h2>
      <p className="lead">
        A bridging loan is a short-term mortgage that covers the gap between
        buying your new home and selling your old one. The lender holds both
        properties as security during the bridging period, and the loan
        unwinds when the old home sells.
      </p>
      <p>
        Bridging exists because the property market doesn't synchronise to
        your moving date. You've found the new place, you don't want to lose
        it, but your current home hasn't sold (or the timing is awkward). The
        bridging loan lets you buy the new home now and worry about selling
        the old one over the next few months.
      </p>

      <h2 id="how-it-works">How bridging loans work</h2>
      <p>
        Mechanically, a bridging loan is structured as two facilities under
        one approval:
      </p>
      <ol>
        <li>
          <strong>The bridging facility:</strong> Covers the new property's
          purchase price plus costs (stamp duty, conveyancing). Usually
          interest-only and interest-capitalised for the bridging period.
        </li>
        <li>
          <strong>The end-debt loan:</strong> The mortgage you'll be left with
          once the old home sells and the proceeds pay down the bridging
          facility. This is the loan the lender will assess your serviceability
          against.
        </li>
      </ol>
      <p>
        During the bridging period, the lender holds first mortgages over both
        properties. You complete the purchase on the new home, you can move in,
        and you have a defined window (usually 6 months) to sell the old one
        and discharge the bridging facility.
      </p>

      <h2 id="peak-vs-end-debt">Peak debt and end debt</h2>
      <p>Two numbers matter more than any others in a bridging loan:</p>

      <KeyFigure
        value="Peak vs End"
        label="Peak debt is the maximum lender exposure during bridging. End debt is what remains after the old home sells."
        context="Lenders assess serviceability against end debt, not peak"
      />

      <h3>Peak debt</h3>
      <p>The maximum the lender owes you during bridging. Calculated as:</p>
      <ul>
        <li>Outstanding balance on your existing mortgage</li>
        <li>+ Purchase price of the new property</li>
        <li>+ Stamp duty and conveyancing on the new property</li>
        <li>+ Capitalised bridging interest (typically 6 months')</li>
      </ul>
      <p>
        Peak debt has to fit within the lender's loan-to-value ratio (LVR)
        cap on the combined value of both properties. Most lenders cap peak
        debt LVR at 75 to 80%. If your peak debt would exceed that, the
        bridging loan won't be approved.
      </p>

      <h3>End debt</h3>
      <p>
        What's left after your old home sells and the proceeds pay down the
        bridging facility. End debt = peak debt minus net sale proceeds (sale
        price less agent commission, marketing, conveyancing).
      </p>
      <p>
        The lender will assess your ability to service the <strong>end
        debt</strong>, not peak debt, on your normal income. This is the loan
        you'll be paying off long-term once the move is done.
      </p>

      <h3>Worked example</h3>
      <p>
        You currently owe $400,000 on a home worth $1,100,000. You're buying a
        new home for $1,500,000. You expect to sell the existing home for
        $1,050,000 net of agent fees and marketing.
      </p>
      <ul>
        <li><strong>New purchase + costs:</strong> $1,500,000 + $80,000 stamp duty + $5,000 conveyancing = $1,585,000</li>
        <li><strong>Existing mortgage:</strong> $400,000</li>
        <li><strong>Capitalised bridging interest (6 months @ 7.5%):</strong> ~$28,000</li>
        <li><strong>Peak debt:</strong> $400,000 + $1,585,000 + $28,000 = $2,013,000</li>
        <li><strong>Combined property value:</strong> $1,100,000 + $1,500,000 = $2,600,000</li>
        <li><strong>Peak debt LVR:</strong> 77% (within 80% cap, OK)</li>
        <li><strong>End debt after sale:</strong> $2,013,000 − $1,050,000 = $963,000</li>
      </ul>
      <p>
        The lender's serviceability test is on the $963,000 end debt at
        standard rates, not the $2,013,000 peak. If your income can service
        $963K comfortably, the bridging loan is on the table.
      </p>

      <h2 id="interest">Interest rates and capitalisation</h2>
      <p>
        Bridging interest sits roughly <strong>0.5 to 1.5 percentage points</strong>{" "}
        above standard variable rates, depending on the lender, the bridging
        period, and your loan size. As of mid-2026, that puts most bridging
        rates in the 7.0 to 8.5% range.
      </p>
      <p>
        Most bridging loans <strong>capitalise interest</strong>: you don't
        make monthly repayments during the bridging period. Each month's
        interest is added to peak debt and paid down when the old home sells.
        This protects cash flow during the move (you're not paying two
        mortgages), but it increases total interest cost because you're paying
        interest on interest.
      </p>
      <p>
        Some lenders let you service the bridging interest monthly if you
        prefer. The trade-off is cash flow vs total cost. If you can
        comfortably afford to service both loans, monthly servicing is cheaper.
        If not, capitalising the interest is the safer choice.
      </p>

      <h2 id="costs">True cost of bridging</h2>
      <p>The headline rate isn't the full picture. Real costs include:</p>
      <ul>
        <li><strong>Capitalised interest</strong> on peak debt for the bridging period</li>
        <li><strong>Application/establishment fee</strong>: $500 to $2,000</li>
        <li><strong>Two valuations</strong> (one on each property): $300 to $800 each, usually paid by you</li>
        <li><strong>Discharge fee</strong> on the bridging facility when it unwinds: $200 to $400</li>
        <li><strong>Double holding costs:</strong> council rates, insurance, possibly utilities on both properties for the bridging period</li>
        <li><strong>Selling costs on the old home:</strong> agent commission (1.5 to 3%), marketing ($3K to $8K), conveyancing ($1K to $2K)</li>
      </ul>
      <p>
        On a $500K bridging amount over 6 months at a 1pp rate margin, you're
        looking at roughly $2,500 of capitalised interest plus $1,000 to $3,000
        of fees and double-holding costs. Total bridging-specific cost: $3,500
        to $5,500 versus selling first.
      </p>

      <p>
        And don&rsquo;t forget the second-biggest cost on the new purchase —
        stamp duty:
      </p>
      <MiniStampDutyEmbed />

      <h2 id="qualification">Will a lender approve me?</h2>
      <p>To qualify for a bridging loan, lenders typically require:</p>
      <ul>
        <li><strong>Meaningful equity</strong> in the existing property (often 20%+ after the new purchase) so peak debt fits within LVR caps</li>
        <li><strong>Serviceability on end debt</strong> at the lender's assessment rate (usually 3pp above the actual rate)</li>
        <li><strong>A credible sale plan:</strong> the old home listed (or contracted to be listed within 30 days), priced realistically, with a competent agent engaged</li>
        <li><strong>Clean credit history</strong> on both the borrower and the existing mortgage</li>
        <li><strong>Stable income</strong>, lenders are conservative on bridging because the recovery position depends on a clean sale</li>
      </ul>
      <p>
        Bridging is harder to get than a standard mortgage. A broker who
        regularly arranges bridging loans (not all do) will know which lenders
        are currently writing them and at what terms.
      </p>

      <h2 id="timeframes">Bridging period and what happens after</h2>
      <ul>
        <li><strong>Standard bridging period:</strong> 6 months for established home, up to 12 months for new construction</li>
        <li><strong>Extension:</strong> Typically 1 to 3 months at a higher rate, often with a requirement to drop the asking price</li>
        <li><strong>End of bridging:</strong> If the old home still hasn't sold, the lender can force a sale to recover their position</li>
      </ul>
      <p>
        Practical mitigation: list the old home <strong>before</strong>{" "}
        settlement on the new one. Set a realistic price (use a recent
        appraisal, not optimism). Accept a slightly lower offer rather than
        letting the bridging period blow out, the rate margin and fees on an
        extension typically cost more than the price difference.
      </p>

      <h2 id="alternatives">Alternatives to bridging</h2>
      <p>
        Bridging is the most expensive of the three main options for moving
        home. The other two:
      </p>

      <h3>Sell first, then buy</h3>
      <p>
        Sell your existing home first, settle, and use the proceeds (plus a
        new mortgage) to buy the next one. You'll typically need short-term
        accommodation (rental, family) between settlements. Cleanest
        financially, but stressful if the market is moving fast and you can't
        find the right next home.
      </p>

      <h3>Buy first with a subject-to-sale offer</h3>
      <p>
        Make a conditional offer on the new home, conditional on the sale of
        your existing one within a defined window (often 60 to 90 days). The
        seller can usually still receive other offers and you have right of
        first refusal. Common for private treaty sales, almost never accepted
        at auction or in a hot market.
      </p>

      <h3>Comparing the three</h3>
      <table>
        <thead>
          <tr><th>Option</th><th>Cost</th><th>Risk</th><th>Timing flexibility</th></tr>
        </thead>
        <tbody>
          <tr><td>Sell first</td><td>Lowest</td><td>You may move twice (rental in between)</td><td>You set the buying timeline</td></tr>
          <tr><td>Subject-to-sale</td><td>Low</td><td>You may lose the new home if your sale stalls</td><td>Tight, defined by the conditional period</td></tr>
          <tr><td>Bridging loan</td><td>Highest</td><td>Lender forces sale if old home doesn't sell</td><td>Most flexible, you control both transactions</td></tr>
        </tbody>
      </table>

      <p>
        Read our{" "}
        <Link href="/guides/sell-first-or-buy-first">Sell First or Buy First guide</Link>{" "}
        for the full decision tree before committing to bridging.
      </p>

      <SectionDivider label="Putting it together" />

      <h2 id="when-it-makes-sense">When bridging is the right call</h2>
      <p>Bridging usually wins on the numbers when:</p>
      <ul>
        <li>The market is moving fast and the new property won't wait for a subject-to-sale offer</li>
        <li>You have meaningful equity in the existing home and can comfortably service the end debt</li>
        <li>The cost of double moves and short-term rental approaches or exceeds the bridging cost</li>
        <li>You're emotionally committed to the new home and the cost of losing it would be high</li>
        <li>You're confident your old home will sell within the bridging period (good agent, realistic price, prepped property)</li>
      </ul>
      <p>Bridging tends to be the wrong call when:</p>
      <ul>
        <li>Your equity is thin and peak debt would push LVR above lender caps</li>
        <li>The market is soft and recent comparable sales are taking 4+ months</li>
        <li>You don't have a credible sale plan or a strong selling agent</li>
        <li>End-debt serviceability is tight, you'd be stretching to make the long-term mortgage work</li>
      </ul>

      <h2 id="process">The bridging loan process</h2>
      <ol>
        <li>
          <strong>Get an appraisal</strong> on your existing home from a local
          agent who actually sells in the area. Use it as the basis for peak-debt
          calculations.
        </li>
        <li>
          <strong>Talk to a broker</strong> who regularly arranges bridging
          loans, not all do. Ask which lenders are currently writing bridging
          and at what terms.
        </li>
        <li>
          <strong>Get pre-approval</strong> for the bridging facility before
          you sign a contract on the new home, especially at auction.
        </li>
        <li>
          <strong>Engage your selling agent</strong> and prep the old home for
          sale. Time it so the property is on market by settlement of the new
          one (or shortly after).
        </li>
        <li>
          <strong>Settle the new property</strong> using the bridging facility.
          Move in.
        </li>
        <li>
          <strong>Sell the old home</strong> within the bridging period.
        </li>
        <li>
          <strong>Settle the sale</strong>, the proceeds pay down the bridging
          facility automatically. You're left with the end-debt loan you've
          been assessed for.
        </li>
      </ol>

      <Callout variant="info" title="One last thing">
        <p>
          Some lenders charge break costs if you discharge the bridging
          facility earlier than expected (e.g. your old home sells in 2 months
          rather than 6). Read the loan documentation, or ask your broker
          specifically, before assuming a fast sale is unambiguously good news.
        </p>
      </Callout>
    </GuideArticleLayout>
  );
}
