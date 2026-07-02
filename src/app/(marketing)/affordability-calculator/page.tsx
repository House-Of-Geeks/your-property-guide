import type { Metadata } from "next";
import Link from "next/link";
import { AffordabilityCalculator } from "@/components/calculators/AffordabilityCalculator";
import { CalculatorPageLayout, type CalculatorPageFrontmatter } from "@/components/calculators/CalculatorPageLayout";
import { Callout, KeyFigure, type FaqItem, type RelatedGuide } from "@/components/guide";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const FRONTMATTER: CalculatorPageFrontmatter = {
  title: "Property Affordability Calculator",
  description:
    "Find out what property price you can realistically afford based on your deposit, income and living costs, using the same methods Australian banks use.",
  slug: "affordability-calculator",
  schemaName: "Property Affordability Calculator",
  schemaDescription: "Calculate how much property you can afford based on your deposit and borrowing power.",
  updatedAt: "2026-04-15",
  persona: "first-home",
};

const META_TITLE = "Property Affordability Calculator: How Much Can I Spend?";
const META_DESCRIPTION = "Free Australian property affordability calculator. Combines borrowing power, deposit, stamp duty and buying costs into the price you can actually afford. No sign-up.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/${FRONTMATTER.slug}` },
  openGraph: {
    url: `${SITE_URL}/${FRONTMATTER.slug}`,
    title: META_TITLE,
    description: META_DESCRIPTION,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const FAQS: FaqItem[] = [
  {
    question: "How does the affordability calculator work?",
    answer:
      "The calculator runs two tests and takes the lower result. First, it calculates the maximum purchase price your deposit can support at your chosen deposit percentage. Second, it estimates your borrowing capacity using your income, expenses, and the HEM benchmark, the same method Australian banks use. The binding constraint (whichever limits you more) determines your affordable purchase price.",
  },
  {
    question: "What is the difference between deposit-limited and serviceability-limited?",
    answer:
      "If you are deposit-limited, your savings are the bottleneck: even if a bank would lend you more, you don't have enough deposit for a higher-priced property. If you are serviceability-limited, your income cannot support repayments on a larger loan, but your deposit could cover a higher purchase price if you could borrow more.",
  },
  {
    question: "Why does the calculator deduct buying costs from my savings?",
    answer:
      "In addition to your deposit, you need to cover stamp duty, conveyancing fees, building inspections, and other settlement costs. These typically add 4 to 6% on top of the purchase price. The calculator uses approximately 7% of savings as a buffer for these costs, leaving the rest available as your deposit.",
  },
  {
    question: "What is LMI and when does it apply?",
    answer:
      "Lenders Mortgage Insurance (LMI) is a one-off premium charged by lenders when your deposit is less than 20% of the purchase price (i.e. LVR above 80%). LMI protects the lender, not you, in case you default. The cost typically ranges from 0.5% to 2.5% of the loan amount and can usually be added to (capitalised into) your loan. Saving a 20% deposit avoids LMI entirely.",
  },
  {
    question: "Are these figures accurate?",
    answer:
      "This is an estimate based on simplified assumptions. Actual borrowing capacity varies by lender, your credit history, employment type, and other factors. Stamp duty rates also vary by state and buyer status. Use our Stamp Duty Calculator for a precise duty estimate, and speak with a mortgage broker for a personalised borrowing assessment.",
  },
  {
    question: "Should I buy at my maximum affordable price?",
    answer:
      "Almost never. Buying at your absolute ceiling leaves no buffer for rate rises, unexpected repairs, life changes, or fluctuating income. Many buyers target 10 to 15% below their calculated max to keep the loan comfortable through the cycle. The calculator shows what's possible; what's wise depends on your situation.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Borrowing Power Calculator", href: "/borrowing-power-calculator", description: "Just the borrowing-capacity half of the equation." },
  { title: "Stamp Duty Calculator",      href: "/stamp-duty-calculator",      description: "Estimate the duty component of your buying costs." },
  { title: "Mortgage Repayments",        href: "/mortgage-calculator",        description: "What the loan will actually cost you each month." },
  { title: "First Home Buyer Guide",     href: "/guides/first-home-buyer-guide", description: "Schemes that change the deposit math." },
  { title: "LMI Explained",              href: "/guides/lenders-mortgage-insurance-guide", description: "What LMI is, what it costs, and how to avoid it." },
  { title: "Browse suburbs by median",   href: "/suburbs",                    description: "See what your affordable price actually buys you, by suburb." },
];

export default function AffordabilityCalculatorPage() {
  return (
    <CalculatorPageLayout
      frontmatter={FRONTMATTER}
      calculator={<AffordabilityCalculator />}
      faqs={FAQS}
      related={RELATED}
      intent="buying"
      explainer={
        <>
          <h2>Two limits, the lower one wins</h2>
          <p>
            Your maximum affordable purchase price is constrained by two separate
            factors, and the lower of the two wins.
          </p>

          <h3>1. Deposit constraint</h3>
          <p>
            With a 20% deposit requirement and $100,000 in savings (after buying
            costs), the most you can spend is $500,000, even if a bank would
            happily lend you more. Choosing a 10% or 15% deposit allows you to buy
            at a higher price with the same savings, but Lenders Mortgage Insurance
            (LMI) will apply.
          </p>

          <h3>2. Serviceability constraint</h3>
          <p>
            Banks assess whether you can afford repayments at your actual interest
            rate plus a 3% buffer (required by APRA). They deduct living expenses,
            using at least the HEM (Household Expenditure Measure) benchmark, and
            existing debts. The remaining surplus determines your maximum monthly
            repayment, which sets your borrowing limit.
          </p>

          <KeyFigure
            value="4–6%"
            label="Buying costs as a percentage of purchase price (stamp duty, conveyancing, inspections, lender fees). Always budget on top of the deposit."
            context="Varies by state and buyer type"
          />

          <h2>Understanding LMI</h2>
          <p>
            Lenders Mortgage Insurance (LMI) is charged when your loan-to-value
            ratio (LVR) exceeds 80%, meaning your deposit is less than 20% of the
            purchase price.
          </p>
          <ul>
            <li><strong>85% LVR (15% deposit):</strong> LMI typically costs around 0.5 to 0.8% of the loan amount.</li>
            <li><strong>90% LVR (10% deposit):</strong> LMI rises to around 1 to 1.5% of the loan amount.</li>
            <li><strong>95% LVR (5% deposit):</strong> LMI can reach 2.5%+ of the loan amount.</li>
          </ul>
          <p>
            LMI can be capitalised into your loan, you don&rsquo;t necessarily need to
            pay it upfront, but it increases your total loan balance and
            repayments. The best way to avoid LMI is to save a 20% deposit, or
            explore government schemes such as the First Home Guarantee, which
            allows eligible first home buyers to purchase with just 5% deposit and
            no LMI.
          </p>

          <Callout variant="tip" title="Run two scenarios">
            <p>
              Most buyers run the calculator at their absolute max, then run it
              again at 10 to 15% lower. The lower figure is usually the more
              comfortable target, leaving headroom for rate rises and life
              changes. Then check the suburbs that match the lower number using
              our <Link href="/suburbs">suburb search</Link>.
            </p>
          </Callout>

          <h2>What this calculator doesn&rsquo;t do</h2>
          <ul>
            <li>It doesn&rsquo;t apply your specific lender&rsquo;s policy on income shading or HEM.</li>
            <li>It uses an estimated stamp duty figure rather than the exact state schedule, use our <Link href="/stamp-duty-calculator">Stamp Duty Calculator</Link> for precision.</li>
            <li>It doesn&rsquo;t model government schemes (First Home Guarantee, Help to Buy, Family Home Guarantee) which change deposit math materially.</li>
            <li>It doesn&rsquo;t factor in self-employed or trust-structure income (which lenders treat differently).</li>
          </ul>
        </>
      }
    />
  );
}
