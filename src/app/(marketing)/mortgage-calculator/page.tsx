import type { Metadata } from "next";
import Link from "next/link";
import { MortgageCalculator } from "@/components/calculators/MortgageCalculator";
import { CalculatorPageLayout, type CalculatorPageFrontmatter } from "@/components/calculators/CalculatorPageLayout";
import { Callout, KeyFigure, type FaqItem, type RelatedGuide } from "@/components/guide";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const FRONTMATTER: CalculatorPageFrontmatter = {
  title: "Mortgage Repayment Calculator",
  description:
    "Estimate your repayments, total interest, and view a full yearly amortisation schedule. Supports weekly, fortnightly and monthly frequencies.",
  slug: "mortgage-calculator",
  schemaName: "Mortgage Repayment Calculator",
  schemaDescription: "Calculate Australian mortgage repayments, total interest, and full amortization schedule.",
  updatedAt: "2026-04-15",
  persona: "first-home",
};

export const metadata: Metadata = {
  title: `${FRONTMATTER.title} | ${SITE_NAME}`,
  description: FRONTMATTER.description,
  alternates: { canonical: `${SITE_URL}/${FRONTMATTER.slug}` },
  openGraph: {
    url: `${SITE_URL}/${FRONTMATTER.slug}`,
    title: `${FRONTMATTER.title} | ${SITE_NAME}`,
    description: FRONTMATTER.description,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const FAQS: FaqItem[] = [
  {
    question: "How is a mortgage repayment calculated?",
    answer:
      "For a principal-and-interest loan, repayments are calculated using the formula: P × (r(1+r)^n) / ((1+r)^n − 1), where P is the loan amount, r is the periodic interest rate, and n is the total number of payments. For interest-only loans, the repayment is simply the loan amount multiplied by the periodic interest rate.",
  },
  {
    question: "What is the difference between fortnightly and monthly repayments?",
    answer:
      "Making fortnightly repayments results in 26 payments per year, the equivalent of 13 monthly payments. This extra payment each year reduces your principal faster, shortening the loan term and saving interest over the life of the loan.",
  },
  {
    question: "What does an interest-only loan mean?",
    answer:
      "With an interest-only loan your repayments cover only the interest charged each period. The loan principal does not reduce during the interest-only period. These loans are common for investment properties but result in higher total repayments over the life of the loan.",
  },
  {
    question: "How much deposit do I need for a home loan in Australia?",
    answer:
      "Most Australian lenders require a minimum 20% deposit to avoid Lenders Mortgage Insurance (LMI). Some lenders accept deposits as low as 5 to 10% with LMI. First home buyers may also be eligible for government schemes that reduce the required deposit, see our First Home Buyer Guide.",
  },
  {
    question: "Should I make extra repayments if I have an offset account?",
    answer:
      "An offset account effectively reduces the interest you pay without locking your money away. Money in offset is identical to money in extra repayments in terms of interest savings, but stays accessible. If you want flexibility, prefer offset; if you want to force discipline, prefer direct extra repayments. The interest saving is the same.",
  },
  {
    question: "How does loan term affect total interest?",
    answer:
      "A longer loan term means lower monthly repayments but dramatically higher total interest. A 25-year loan vs a 30-year loan on $600,000 at 6% saves around $130,000 in total interest, though the monthly repayments are about $300 higher. Use the calculator to compare.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Borrowing Power Calculator",  href: "/borrowing-power-calculator", description: "What you can borrow, before what you'll repay." },
  { title: "Affordability Calculator",    href: "/affordability-calculator",   description: "How much property you can afford on top of how much you can borrow." },
  { title: "Stamp Duty Calculator",       href: "/stamp-duty-calculator",      description: "Settlement-day cost in addition to your deposit." },
  { title: "Refinancing Calculator",      href: "/refinancing-calculator",     description: "Whether your current loan is still the best one for you." },
  { title: "First Home Buyer Guide",      href: "/guides/first-home-buyer-guide", description: "Federal schemes, state grants and concessions in plain English." },
  { title: "Fixed vs Variable Rate Guide",href: "/guides/fixed-vs-variable-rate-guide", description: "Which structure suits which buyer." },
];

export default function MortgageCalculatorPage() {
  return (
    <CalculatorPageLayout
      frontmatter={FRONTMATTER}
      calculator={<MortgageCalculator />}
      faqs={FAQS}
      related={RELATED}
      explainer={
        <>
          <h2>What you&rsquo;re actually paying for</h2>
          <p>
            Every monthly mortgage repayment is split between two things: a chunk
            that goes against your loan balance (principal) and a chunk that pays
            the lender for letting you have the money in the first place (interest).
            The split changes over the life of the loan.
          </p>
          <p>
            In year one of a 30-year, $600,000 loan at 6%, the vast majority of every
            repayment is interest. By year 25, the same repayment is mostly
            principal. The amortisation table the calculator produces shows that
            shift visually.
          </p>

          <KeyFigure
            value="~$695k"
            label="Total interest you'd pay over 30 years on a $600,000 loan at 6%, approximately doubling the original loan amount in interest alone."
            context="Estimate, principal and interest, monthly"
          />

          <h2>The biggest levers on total interest paid</h2>
          <h3>Repayment frequency</h3>
          <p>
            Switching from monthly to fortnightly repayments at the same monthly
            amount means you make 26 payments a year instead of 12, the equivalent
            of 13 monthly payments. That extra payment a year reduces principal
            faster and can save 4 to 5 years off a 30-year loan.
          </p>
          <h3>Loan term</h3>
          <p>
            A 25-year term costs less in total interest than a 30-year term but
            with higher monthly repayments. The trade-off is monthly cash flow vs
            lifetime cost.
          </p>
          <h3>Extra repayments</h3>
          <p>
            Even modest extra repayments compound powerfully. An extra $200 a month
            on a $600,000 loan can shave several years and tens of thousands of
            dollars off total interest. Variable-rate loans usually allow extra
            repayments without penalty; fixed-rate loans typically cap extras (often
            $10,000 a year) or charge a break fee.
          </p>
          <h3>Offset account</h3>
          <p>
            Money in an offset account reduces the interest charged on your loan
            without locking it away, you can withdraw it any time. For most owner
            occupiers, an offset account is a better tool than direct extra
            repayments because it preserves liquidity.
          </p>

          <Callout variant="info" title="The rate isn't the only thing that matters">
            <p>
              When comparing loans, look at fees (annual, monthly, discharge), redraw
              and offset features, the lender&rsquo;s revert rate after any honeymoon
              period, and how the rate is calculated (some lenders charge a higher
              rate on the borrowed amount, some on the average daily balance). The
              comparison rate on a loan is meant to capture most of these in one
              number, but always sanity-check.
            </p>
          </Callout>

          <h2>What this calculator doesn&rsquo;t do</h2>
          <ul>
            <li>It doesn&rsquo;t apply LMI (Lenders Mortgage Insurance) when LVR exceeds 80%, see our <Link href="/guides/lenders-mortgage-insurance-guide">LMI guide</Link>.</li>
            <li>It doesn&rsquo;t model split-rate loans (part fixed, part variable).</li>
            <li>It doesn&rsquo;t factor in offset balance reductions, run those scenarios separately.</li>
            <li>It doesn&rsquo;t cover construction loans (interest charged on drawn amount only).</li>
          </ul>
          <p>
            For a precise quote on your specific situation, a mortgage broker can
            compare 30+ lenders for you in one process.{" "}
            <Link href="/find-an-expert?intent=refinancing">Get connected</Link> if you want a free intro to one.
          </p>
        </>
      }
    />
  );
}
