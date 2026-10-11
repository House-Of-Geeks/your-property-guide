import type { Metadata } from "next";
import Link from "next/link";
import { RefinancingCalculator } from "@/components/calculators/RefinancingCalculator";
import { CalculatorPageLayout, type CalculatorPageFrontmatter } from "@/components/calculators/CalculatorPageLayout";
import { Callout, KeyFigure, Sources, type FaqItem, type RelatedGuide } from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import {
  AVERAGE_NEW_VARIABLE_RATE,
  AVERAGE_OUTSTANDING_VARIABLE_RATE,
  F6_RATE_CAVEAT,
  F6_SOURCE,
  REFINANCE_EXAMPLE_CURRENT_RATE,
  REFINANCE_EXAMPLE_GAP,
  describeF6,
} from "@/lib/data/rba-lending-rates";
import { LENDER_POLICY_NOTE } from "@/lib/utils/borrowing-power";

const FRONTMATTER: CalculatorPageFrontmatter = {
  title: "Refinancing Calculator",
  description:
    "Find out whether switching your home loan is worth it. Calculate monthly savings, break-even point, and total interest saved over the life of the loan.",
  slug: "refinancing-calculator",
  schemaName: "Refinancing Calculator",
  schemaDescription: "Calculate savings from refinancing your home loan and your break-even point.",
  updatedAt: "2026-10-11",
  persona: "upgrading",
};

const META_TITLE = "Refinancing Calculator Australia 2026: Should I Refinance?";
const META_DESCRIPTION = "Free Australian refinancing calculator. Work out monthly savings, break-even point and lifetime interest saved before you switch home loans. No sign-up.";

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
    question: "What is the break-even point when refinancing?",
    answer:
      "The break-even point is the number of months it takes for your cumulative monthly savings to exceed the upfront costs of switching loans. For example, if you save $200 a month and it costs $3,600 to switch, your break-even is 18 months.",
  },
  {
    question: "What costs are involved in refinancing?",
    answer:
      "Common refinancing costs include a discharge fee from your current lender (typically $150 to $500), an establishment or application fee with the new lender (typically $0 to $1,000), legal/settlement fees (typically $500 to $1,500), and potentially Lenders Mortgage Insurance if your LVR is above 80%.",
  },
  {
    question: "What is an LVR and when does LMI apply?",
    answer:
      "LVR stands for Loan to Value Ratio, your loan balance divided by the property value. If your LVR exceeds 80%, most lenders will require Lenders Mortgage Insurance (LMI), which can cost thousands of dollars and significantly affect your refinancing break-even calculation.",
  },
  {
    question: "How much can I save by refinancing?",
    answer:
      "The savings depend on the difference between your current and new interest rates, your remaining loan balance, and the term. Even a 0.5% rate reduction on a $500,000 loan can save over $150 a month and more than $50,000 over a 30-year term.",
  },
  {
    question: "Can I negotiate a rate reduction without refinancing?",
    answer:
      "Yes, many borrowers succeed in getting a rate reduction simply by calling their lender and threatening to refinance. This costs nothing and should always be tried first, especially if your break-even calculation shows refinancing is marginal.",
  },
  {
    question: "Should I refinance if I'm on a fixed rate?",
    answer:
      "Usually not, until close to the end of the fixed term. Breaking a fixed-rate loan early triggers a break fee that can be substantial (potentially tens of thousands of dollars on a large loan during a falling-rate environment). Calculate the break fee with your current lender and add it to refinancing costs before deciding. In a rising-rate environment, the break fee is often small or zero.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Mortgage Repayments",          href: "/mortgage-calculator",        description: "Run the new loan numbers in detail before switching." },
  { title: "Borrowing Power Calculator",   href: "/borrowing-power-calculator", description: "An estimate of what a new lender may lend on your income and expenses, before you apply." },
  { title: "Fixed vs Variable Rate Guide", href: "/guides/fixed-vs-variable-rate-guide", description: "Whether to lock the new loan in or stay on variable." },
  { title: "Get connected",                href: "/find-an-expert?intent=refinancing",  description: "One mortgage broker receives your details and pays us a fee; a broker compares many lenders' policies for your situation." },
  { title: "First Home Buyer Guide",       href: "/guides/first-home-buyer-guide", description: "If your first loan was via a scheme, check the discharge implications." },
  { title: "Affordability Calculator",     href: "/affordability-calculator",   description: "If refinancing is part of an upgrade plan, model the next purchase." },
];

export default function RefinancingCalculatorPage() {
  return (
    <CalculatorPageLayout
      frontmatter={FRONTMATTER}
      calculator={<RefinancingCalculator />}
      estimateNote={LENDER_POLICY_NOTE}
      faqs={FAQS}
      related={RELATED}
      intent="buying"
      explainer={
        <>
          <p>
            The calculator opens with a new loan at {describeF6(AVERAGE_NEW_VARIABLE_RATE)}, and a current
            rate {REFINANCE_EXAMPLE_GAP} points higher, {REFINANCE_EXAMPLE_CURRENT_RATE}%, as an illustration.
            In {AVERAGE_OUTSTANDING_VARIABLE_RATE.period} the average rate on {AVERAGE_OUTSTANDING_VARIABLE_RATE.measure} was{" "}
            {AVERAGE_OUTSTANDING_VARIABLE_RATE.rate}% (RBA table F6), so on average existing borrowers paid about what new
            ones did: the saving depends on your own rate. Both figures are {F6_RATE_CAVEAT}. Enter your own.
          </p>

          <h2>Should you refinance your home loan?</h2>
          <p>
            Refinancing can save tens of thousands of dollars over the life of a
            loan, but it comes with upfront costs that need to be weighed against
            your savings. The key metric is the break-even point: how many months
            until cumulative savings exceed switching costs.
          </p>

          <h3>When refinancing usually makes sense</h3>
          <p>
            Your break-even is under 24 months, you plan to keep the loan for
            several years, and the new lender has no hidden fees or restrictive
            conditions. A 0.5% rate cut on a $500,000 loan typically saves
            $150+ a month, with break-even inside 12 to 18 months even with
            switching costs.
          </p>

          <h3>When to be cautious</h3>
          <p>
            If you&rsquo;re planning to sell or pay off the loan in the next few
            years, a long break-even period means you may never recoup the
            switching costs. Also consider whether a fixed-rate break fee applies
            to your current loan, those can be substantial on large loans during
            a falling-rate environment.
          </p>

          <h3>A quick alternative: ask first</h3>
          <p>
            Before going through the refinancing process, call your current lender
            and ask for a rate match. Many lenders will reduce your rate to
            retain your business, with zero cost or paperwork. The threat of
            refinancing is often enough; sometimes the savings are nearly as
            good without the disruption.
          </p>

          <KeyFigure
            value="$50k+"
            label="Total interest saved over 30 years on a $500,000 loan from a 0.5% rate reduction. The annual saving compounds dramatically over the loan term."
            context="Estimate, principal and interest"
          />

          <h2>What to consider beyond the rate</h2>
          <ul>
            <li><strong>Annual / monthly fees.</strong> A $0 ongoing-fee loan with a slightly higher rate often beats a low-rate loan with $400 a year in fees, especially on smaller loans.</li>
            <li><strong>Offset and redraw.</strong> Some no-frills loans drop the offset and redraw features. If you keep significant savings parked in offset, losing it can reduce your effective interest saving substantially.</li>
            <li><strong>Cashback offers.</strong> Lenders periodically offer $2,000 to $4,000 cashback for switching. Build it into the calculator and your break-even gets dramatically shorter.</li>
            <li><strong>Future flexibility.</strong> If you plan to upgrade, refinance again, or restructure within a few years, look for loans without exit fees and with flexible top-up policies.</li>
          </ul>

          <Callout variant="tip" title="Refinance every two to three years">
            <p>
              The Australian lending market is competitive, and rates drift over
              time. Reviewing your loan every two to three years (and acting if a
              meaningful saving exists) is a habit worth keeping for the life of
              the loan. A broker can do this review for you, paid by the lender,
              not by you.
            </p>
          </Callout>

          <h2>What this calculator doesn&rsquo;t do</h2>
          <ul>
            <li>It doesn&rsquo;t calculate fixed-rate break fees, ask your current lender.</li>
            <li>It doesn&rsquo;t apply LMI if your refinance pushes LVR above 80%.</li>
            <li>It doesn&rsquo;t value features (offset, redraw, package benefits) that may differ between loans.</li>
            <li>It doesn&rsquo;t factor in cashback offers, add manually if applicable.</li>
          </ul>
          <p>
            For a full refinancing analysis on your specific loan, a mortgage
            broker compares many lenders&rsquo; policies and packages for your situation.
            <Link href="/find-an-expert?intent=refinancing">Get connected</Link> if
            you want a free intro to one.
          </p>

          <Sources
            items={[
              {
                label: F6_SOURCE.name,
                href: F6_SOURCE.url,
                note: `series ${AVERAGE_NEW_VARIABLE_RATE.series} and ${AVERAGE_OUTSTANDING_VARIABLE_RATE.series}, ${AVERAGE_NEW_VARIABLE_RATE.period}; published ${F6_SOURCE.published}, read ${F6_SOURCE.readOn}. The calculator's example rates.`,
              },
            ]}
          />
        </>
      }
    />
  );
}
