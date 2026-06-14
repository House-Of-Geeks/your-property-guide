import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  MatchCTA,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Fixed vs variable rate home loans: which is better in 2026?",
  description:
    "Pros and cons of fixed and variable rate home loans in Australia. Split loans explained, break costs that surprise borrowers, the RBA rate context for 2026, and the questions to ask before fixing.",
  slug: "fixed-vs-variable-rate-guide",
  publishedAt: "2026-04-01",
  updatedAt: "2026-04-15",
  readingTimeMinutes: 6,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "first-home",
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
  "Fixed-rate loans lock your interest rate for 1, 2, 3 or 5 years; your repayments don't change regardless of RBA decisions during that period.",
  "Variable-rate loans move with the market and typically come with offset accounts, unlimited extra repayments, and free refinancing.",
  "Most fixed loans cap or prohibit extra repayments and don't offer offset accounts. If you keep significant savings in offset, fixing usually costs you money even if rates rise.",
  "Split loans (part fixed, part variable) are a common compromise: rate certainty on the bulk of the loan plus offset flexibility on the remainder.",
  "Break costs on a fixed loan can run into tens of thousands of dollars if rates fall after you fix. Selling, refinancing or paying out early all trigger them.",
  "If rates have risen since you fixed, break costs may be zero. The only economic cost to the lender is when current rates are below your fixed rate.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-is-fixed",       label: "What a fixed-rate loan is" },
  { id: "what-is-variable",    label: "What a variable-rate loan is" },
  { id: "pros-cons-fixed",     label: "Pros and cons of fixed" },
  { id: "pros-cons-variable",  label: "Pros and cons of variable" },
  { id: "split-loans",         label: "Split loans: best of both?" },
  { id: "rba-context",         label: "The RBA rate environment in 2026" },
  { id: "break-costs",         label: "Break costs: the hidden danger" },
  { id: "questions",           label: "Questions to ask before fixing" },
];

const FAQS: FaqItem[] = [
  {
    question: "Should I fix my home loan rate?",
    answer:
      "It depends on your view of rates and your need for offset/extra-repayment flexibility. Fix if you value certainty over flexibility, expect rates to rise, and don't have significant savings parked in offset. Stay variable if you want the offset benefit, plan to make extra repayments, expect rates to fall or stay flat, or might sell or refinance during the fixed term.",
  },
  {
    question: "What's the typical fixed-rate period in Australia?",
    answer:
      "Most lenders offer 1, 2, 3 and 5-year fixed terms; some go to 7 or 10 years. The 2 to 3-year term is by far the most common because longer terms come with much higher rates and bigger break-cost risk if circumstances change.",
  },
  {
    question: "What's a split loan?",
    answer:
      "A split loan divides your mortgage into two portions, one fixed and one variable, in any ratio. A common structure is 60% fixed, 40% variable, giving you rate certainty on the bulk of the loan while keeping offset and extra repayment flexibility on the variable portion. The split doesn't have to be 50/50.",
  },
  {
    question: "How are break costs calculated?",
    answer:
      "Break costs compensate the lender for the economic loss of unwinding your fixed rate. Simplified: (your fixed rate minus current wholesale rate for the remaining term) × loan balance × remaining years. If rates have fallen since you fixed, break costs are large; if rates have risen, break costs are typically zero. Always get a written break-cost estimate from your lender before deciding.",
  },
  {
    question: "Can I make extra repayments on a fixed loan?",
    answer:
      "Most lenders cap extra repayments on fixed loans at $10,000 to $30,000 a year, or charge break-cost-style penalties on extras above the cap. Unlimited extra repayments are a feature of variable loans only. If you expect a windfall (bonus, inheritance, sale of an asset) within the fixed term, the cap can become a real issue.",
  },
  {
    question: "Do fixed loans have offset accounts?",
    answer:
      "Generally no. A few lenders offer partial-offset on fixed loans, but full-offset is overwhelmingly a variable-loan feature. If you keep significant savings ($30,000+) in offset, the interest you'd save on a variable loan often exceeds the certainty benefit of fixing.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "LMI Guide",                        href: "/guides/lenders-mortgage-insurance-guide", description: "Once your loan structure is set, what LMI means and how to avoid it." },
  { title: "First Home Buyer Guide",           href: "/guides/first-home-buyer-guide",           description: "Schemes that can let you buy with 5% deposit and no LMI." },
  { title: "Buying Property in Australia",     href: "/guides/buying-property-australia",        description: "The full step-by-step buying process." },
  { title: "Mortgage Repayment Calculator",    href: "/mortgage-calculator",                      description: "Run the numbers on either structure." },
  { title: "Refinancing Calculator",           href: "/refinancing-calculator",                   description: "Whether the next loan is worth switching to." },
  { title: "Borrowing Power Calculator",       href: "/borrowing-power-calculator",               description: "What you can borrow under each structure." },
];

export default function FixedVsVariableRateGuidePage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Rates change frequently">
        <p>
          This guide is for general information only and is not financial
          advice. Interest rates change frequently. Always compare current
          rates from multiple lenders and speak with a licensed mortgage
          broker before making decisions about your home loan structure.
        </p>
      </Callout>

      <h2 id="what-is-fixed">What a fixed-rate loan is</h2>
      <p className="lead">
        A fixed rate home loan locks in your interest rate for a set period,
        typically 1, 2, 3, or 5 years. During this fixed period, your interest
        rate (and therefore your monthly repayments) remain the same regardless
        of what the Reserve Bank of Australia (RBA) does with the official cash
        rate.
      </p>
      <p>
        After the fixed term expires, the loan typically reverts to the
        lender&rsquo;s standard variable rate, often a higher rate than
        comparable variable products. At this point, you can choose to refix,
        refinance to a new lender, or move to a variable rate.
      </p>
      <p>
        Fixed rate loans are priced by lenders based on their expectations of
        where interest rates will move over the fixed period, incorporating
        wholesale funding costs, competitive pressure, and rate expectations.
        Fixed rates are often <em>not</em> directly linked to the current RBA
        cash rate.
      </p>

      <h2 id="what-is-variable">What a variable-rate loan is</h2>
      <p>
        A variable rate loan has an interest rate that can change over the life
        of the loan. The most common driver of variable rate changes in
        Australia is the RBA&rsquo;s monthly cash rate decision, when the RBA
        raises or lowers the cash rate, most lenders pass on the change (in
        full or in part) to their variable rate borrowers.
      </p>
      <p>
        Variable rates are the &ldquo;default&rdquo; loan type in Australia.
        The majority of Australian mortgage holders have variable rate loans,
        and the variable rate market is highly competitive, meaning variable
        rates can be significantly lower than fixed rates when lenders are
        competing for business.
      </p>

      <h2 id="pros-cons-fixed">Pros and cons of fixed rates</h2>
      <Callout variant="success" title="Advantages of fixing">
        <p>
          Certainty of repayments, easy to budget. Protection if rates rise
          during the fixed period. Peace of mind, no monthly RBA anxiety. Can
          lock in a low rate if you believe rates will rise.
        </p>
      </Callout>
      <Callout variant="warning" title="Disadvantages of fixing">
        <p>
          Break costs can be very large if you need to exit early. Cannot
          benefit if rates fall during the fixed period. Most fixed loans limit
          or prohibit extra repayments. Offset accounts generally not available
          on fixed loans. May revert to a high standard variable rate at expiry.
        </p>
      </Callout>
      <p>
        The limitations on extra repayments and offset accounts are
        particularly significant for Australian borrowers who actively use
        offset accounts as a cash management tool. If you keep significant
        savings in an offset account to reduce your effective interest cost, a
        fixed loan may not suit your structure at all.
      </p>

      <h2 id="pros-cons-variable">Pros and cons of variable rates</h2>
      <Callout variant="success" title="Advantages of variable">
        <p>
          Benefit immediately when rates fall. Offset account typically
          available, powerful cash management tool. Make unlimited extra
          repayments without penalty. No break costs, can sell or refinance
          freely. More competitive rates in many market conditions. Redraw
          facility usually available.
        </p>
      </Callout>
      <Callout variant="warning" title="Disadvantages of variable">
        <p>
          Repayments can rise if rates increase. Budget uncertainty, harder to
          plan long-term. Psychological stress in a rising rate environment.
        </p>
      </Callout>
      <p>
        The offset account advantage of variable loans is significant for many
        borrowers. An <strong>offset account</strong> is a linked transaction
        account where the balance offsets against your loan balance for
        interest calculation purposes. If you have a $600,000 loan and $50,000
        in an offset account, you only pay interest on $550,000, effectively
        earning your mortgage rate on your savings, which is considerably
        better than a savings account in most rate environments.
      </p>

      <h2 id="split-loans">Split loans: the best of both worlds?</h2>
      <p>
        A <strong>split loan</strong> divides your mortgage into two portions:
        one fixed and one variable. This is the most common approach for
        borrowers who want rate certainty on part of their loan while
        maintaining flexibility on the rest.
      </p>
      <p>
        Example: on a $700,000 loan, you might fix $400,000 at 5.89% for 3
        years and keep $300,000 on a variable rate with full offset capability.
        This approach:
      </p>
      <ul>
        <li>Locks in certainty on the majority of your loan</li>
        <li>Maintains the offset account benefit on the variable portion</li>
        <li>Allows extra repayments on the variable portion without penalty</li>
        <li>Reduces (but does not eliminate) the impact of rate movements in either direction</li>
      </ul>
      <p>
        The split can be in any proportion, it does not need to be 50/50. Your
        mortgage broker can help you determine the right split based on your
        savings levels, income certainty, and financial strategy.
      </p>

      <h2 id="rba-context">The RBA rate environment in 2026</h2>
      <p>
        The choice between fixed and variable rates is heavily influenced by
        the current and expected RBA rate environment. General principles:
      </p>
      <ul>
        <li>
          <strong>In a rising rate environment.</strong> Fixing locks in the
          current lower rate and protects you from further increases. Variable
          borrowers face increasing repayments as the RBA raises rates.
        </li>
        <li>
          <strong>In a falling rate environment.</strong> Variable borrowers
          immediately benefit from RBA cuts. Fixed borrowers are locked out of
          the cuts and can end up paying above-market rates.
        </li>
        <li>
          <strong>At the top of a rate cycle.</strong> Fixing can capture the
          peak variable rate before the cycle turns, but timing this precisely
          is very difficult, even for professional economists.
        </li>
      </ul>
      <p>
        As of April 2026, the RBA has moved through a significant rate hiking
        cycle (2022 to 2023) and has subsequently begun reducing the cash rate.
        In a rate-cutting environment, variable rates have generally performed
        better than fixed rates, as variable borrowers benefit from each RBA
        cut while fixed borrowers remain locked to their prior rate.
      </p>
      <p>
        The key question for 2026 is: are we in the middle of a rate-cutting
        cycle, or near the bottom? If rates are expected to fall further,
        variable is likely the better choice. If rates are expected to
        stabilise or rise again, fixing provides security. No one can predict
        this with certainty, including the RBA.
      </p>

      <h2 id="break-costs">Break costs: the hidden danger of fixed rates</h2>
      <p>
        Break costs (also called early repayment costs or economic costs) are
        fees charged by lenders when a fixed rate loan is broken before the
        end of the fixed period. They can be shockingly large, sometimes tens
        of thousands of dollars, and catch many borrowers off guard.
      </p>
      <p><strong>When break costs are triggered:</strong></p>
      <ul>
        <li>Selling the property during the fixed period</li>
        <li>Refinancing to a different lender during the fixed period</li>
        <li>Paying out the loan in full before the fixed term ends</li>
        <li>Switching from fixed to variable during the fixed period</li>
      </ul>
      <p><strong>How break costs are calculated:</strong></p>
      <p>
        The calculation method varies by lender but is generally based on the
        &ldquo;economic cost&rdquo; to the lender of unwinding the fixed rate
        position. In simple terms, if you fix at a higher rate and rates
        subsequently fall, the lender can re-lend that money at a lower rate,
        and you compensate them for the difference.
      </p>
      <p>Formula (simplified):</p>
      <p>
        <code>
          Break cost ≈ (Fixed rate − Current wholesale rate) × Loan balance × Remaining term in years
        </code>
      </p>
      <p>
        Example: if you fixed at 6.5%, rates have since fallen and the current
        wholesale rate for the remaining 18-month term is 5.0%, and you have
        $500,000 remaining, the break cost could be approximately:
      </p>
      <p>
        <code>(6.5% − 5.0%) × $500,000 × 1.5 years = $11,250</code>
      </p>

      <KeyFigure
        value="$11k+"
        label="Indicative break cost on a $500,000 fixed loan with 18 months remaining if rates have fallen 1.5% since you fixed. Real figures vary by lender."
        context="Always get a written break-cost estimate"
      />

      <p>
        In practice, the exact calculation is more complex. Always ask your
        lender for a break cost estimate <em>before</em> committing to break a
        fixed loan.
      </p>

      <Callout variant="info" title="If rates have risen, break costs may be zero">
        <p>
          If rates have risen since you fixed (i.e. your fixed rate is now
          below the market), break costs may be zero or minimal, because
          there&rsquo;s no economic cost to the lender. This is the rare case
          where breaking a fixed loan is essentially free.
        </p>
      </Callout>

      <MatchCTA kind="mortgage-broker" />

      <h2 id="questions">Questions to ask before fixing your rate</h2>
      <p>Before committing to a fixed rate, consider:</p>
      <ul>
        <li>
          <strong>Are you planning to sell the property during the fixed period?</strong>{" "}
          If there is any possibility you might sell, weigh the break cost risk
          carefully. Selling a $700,000 home mid-fixed-term could cost you
          $15,000+ in break costs on top of agent fees.
        </li>
        <li>
          <strong>Do you need an offset account?</strong>{" "}
          If you keep significant savings (e.g. $50,000+) in an offset account,
          you may lose more from forgoing the offset benefit than you gain from
          rate certainty. Model the numbers with your broker.
        </li>
        <li>
          <strong>Are you expecting a significant change in income?</strong>{" "}
          A large bonus, inheritance, or other windfall that you want to use
          to pay down the mortgage will likely incur break costs on a fixed
          loan. Variable allows unlimited extra repayments.
        </li>
        <li>
          <strong>How confident are you about your rate outlook?</strong>{" "}
          Fixing is essentially a bet that rates will rise (or stay the same).
          Variable is a bet that rates will fall (or that you can absorb the
          uncertainty). How confident are you in your outlook?
        </li>
        <li>
          <strong>What happens at the end of the fixed term?</strong>{" "}
          Most lenders revert to a standard variable rate at expiry, which is
          often not competitive. Set a calendar reminder to review your loan 2
          to 3 months before expiry.
        </li>
      </ul>
      <p>
        Use our <Link href="/borrowing-power-calculator">borrowing power calculator</Link> to
        understand what you can afford under each structure, or our{" "}
        <Link href="/mortgage-calculator">mortgage repayment calculator</Link> to
        compare repayments at different rates.
      </p>
    </GuideArticleLayout>
  );
}
