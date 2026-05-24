import type { Metadata } from "next";
import Link from "next/link";
import { BorrowingPowerCalculator } from "@/components/calculators/BorrowingPowerCalculator";
import { CalculatorPageLayout, type CalculatorPageFrontmatter } from "@/components/calculators/CalculatorPageLayout";
import { Callout, KeyFigure, type FaqItem, type RelatedGuide } from "@/components/guide";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const FRONTMATTER: CalculatorPageFrontmatter = {
  title: "Borrowing Power Calculator",
  description:
    "Estimate how much you can borrow for a home loan based on your income, living expenses and current Australian lending standards.",
  slug: "borrowing-power-calculator",
  schemaName: "Borrowing Power Calculator",
  schemaDescription: "Estimate how much you can borrow based on your income, expenses, and APRA buffer.",
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
    question: "How do banks calculate borrowing power?",
    answer:
      "Australian banks assess your borrowing capacity by looking at your gross income (both applicants if applicable), then estimating your net income after tax. They deduct living expenses, using either your declared expenses or the Household Expenditure Measure (HEM) benchmark, whichever is higher, plus any existing debt repayments. The remaining surplus determines how much you can repay, and from that they back-calculate the maximum loan.",
  },
  {
    question: "What is the HEM benchmark?",
    answer:
      "HEM (Household Expenditure Measure) is a benchmark developed by Melbourne Institute. Banks use it as a minimum living-expense figure: if your declared expenses are lower than HEM, they'll use HEM instead. The amount varies based on household composition and location, but broadly ranges from around $2,000 a month for singles to $4,000+ a month for families.",
  },
  {
    question: "What is a serviceability buffer?",
    answer:
      "APRA, the banking regulator, requires lenders to assess your ability to repay at your actual interest rate plus a 3% buffer. So if current rates are around 6%, banks test whether you can afford repayments at 9%. This protects borrowers from rate rises and is why the assessment rate in this calculator defaults to 7.5%.",
  },
  {
    question: "How can I increase my borrowing power?",
    answer:
      "Reduce existing debt, especially credit card limits (banks count the full limit, not just the balance), increase income, reduce declared living expenses where genuine, extend the loan term, or apply jointly with a partner. Closing unused credit cards can make a significant difference.",
  },
  {
    question: "Does this calculator give an exact figure?",
    answer:
      "No. This is an estimate based on simplified assumptions. Each lender has its own policies, HEM tables, and income treatment rules. For an accurate figure, speak with a mortgage broker who can assess multiple lenders on your behalf.",
  },
  {
    question: "Why does the calculator use a 7.5% assessment rate when actual rates are lower?",
    answer:
      "Because that's how lenders actually assess you. APRA's serviceability rule adds a 3% buffer on top of the rate the lender quotes. With a 4.5% offer rate, the test rate is 7.5%. The buffer means your borrowing capacity is always lower than your repayments at the offered rate would suggest.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Guide",   href: "/guides/first-home-buyer-guide", description: "How federal schemes, state grants, and stamp duty concessions stack." },
  { title: "Stamp Duty Calculator",    href: "/stamp-duty-calculator",         description: "What you'll actually pay (concessions included)." },
  { title: "Affordability Calculator", href: "/affordability-calculator",      description: "How much property you can afford on top of how much you can borrow." },
  { title: "Mortgage Repayments",      href: "/mortgage-calculator",           description: "What the loan will actually cost you each month." },
  { title: "LMI Explained",            href: "/guides/lenders-mortgage-insurance-guide", description: "What it costs and the schemes that waive it." },
  { title: "Refinancing Calculator",   href: "/refinancing-calculator",        description: "Whether your current loan is still the best one for you." },
];

export default function BorrowingPowerCalculatorPage() {
  return (
    <CalculatorPageLayout
      frontmatter={FRONTMATTER}
      calculator={<BorrowingPowerCalculator />}
      faqs={FAQS}
      related={RELATED}
      explainer={
        <>
          <h2>How banks assess your borrowing capacity</h2>
          <p>
            Australian banks use a serviceability assessment to determine the maximum
            loan you can afford. The process works roughly as follows.
          </p>
          <ol>
            <li>
              <strong>Gross income.</strong> Your total income (wages, salary, rental
              income, etc.) from all applicants is added together.
            </li>
            <li>
              <strong>Net income.</strong> An after-tax estimate is calculated. This
              calculator uses a simple 72% net factor as an approximation.
            </li>
            <li>
              <strong>Living expenses (HEM).</strong> Banks deduct your living costs.
              They use the higher of your declared expenses or the HEM benchmark, a
              minimum expense figure that varies by household size.
            </li>
            <li>
              <strong>Existing debts.</strong> All existing monthly debt repayments
              (credit cards, car loans, personal loans, other mortgages) are
              deducted.
            </li>
            <li>
              <strong>Serviceability buffer.</strong> APRA requires banks to test your
              repayment capacity at your actual rate plus 3%. This is why the default
              assessment rate is 7.5% even when market rates may be lower.
            </li>
            <li>
              <strong>Maximum loan.</strong> From the remaining surplus, the bank
              back-calculates the loan amount whose repayments fit within
              approximately 85 to 90% of that surplus.
            </li>
          </ol>

          <KeyFigure
            value="3%"
            label="The APRA serviceability buffer added to every loan assessment. Your borrowing capacity is always tested at your offered rate plus three percent."
            context="APRA prudential standard APS 220"
          />

          <h2>The biggest levers on your borrowing power</h2>
          <p>
            Income matters most, but a few moves can shift the number meaningfully
            in either direction.
          </p>
          <h3>Credit card limits, not balances</h3>
          <p>
            Banks count the <strong>full limit</strong> of every credit card you hold,
            not just what you owe. A $20,000 unused card can shave $80,000 to
            $100,000 off your borrowing capacity. Cancelling cards you don&rsquo;t use
            is often the single biggest thing you can do before applying.
          </p>
          <h3>Existing debts and HECS</h3>
          <p>
            Personal loans, car loans, BNPL accounts and HECS / HELP debt all reduce
            borrowing capacity. HECS in particular is treated as a recurring expense
            by every lender, but its impact varies, some lenders are stricter than
            others. A broker who knows lender policy can often place the same
            applicant with a lender that takes a softer view.
          </p>
          <h3>Living expenses below HEM</h3>
          <p>
            If you genuinely live below the HEM benchmark, declaring real (lower)
            expenses helps, but only if the lender accepts your declaration over the
            benchmark. Most apply the higher of the two as a floor.
          </p>
          <h3>Joint application versus single</h3>
          <p>
            Adding a second income usually lifts the cap substantially, but adds
            another applicant&rsquo;s expenses and dependants to the calculation too.
            For couples it almost always helps; for guarantor or family-pledge
            arrangements the maths gets more complex.
          </p>

          <Callout variant="info" title="The numbers above are an estimate">
            <p>
              Every lender has its own income shading rules (overtime, bonus,
              commission, casual income, parental-leave income), HEM tables, and
              policy on existing debt. The same household can be approved for
              significantly different amounts at different lenders.
            </p>
          </Callout>

          <h2>What this calculator doesn&rsquo;t do</h2>
          <ul>
            <li>It doesn&rsquo;t apply any specific lender&rsquo;s income-shading policy.</li>
            <li>It doesn&rsquo;t factor in self-employed income (typically requires 2 years of financials, with policy varying widely).</li>
            <li>It doesn&rsquo;t model rental income from an investment property (treated differently from salary).</li>
            <li>It doesn&rsquo;t cover guarantor or family-pledge structures.</li>
            <li>It doesn&rsquo;t apply LMI or scheme-specific guarantees (FHBG, FHG, Help to Buy).</li>
          </ul>
          <p>
            For any of those, run the basic numbers here, then verify with a broker
            or a participating lender. <Link href="/find-an-expert?intent=refinancing">Get connected</Link>{" "}
            if you want a free intro to one.
          </p>
        </>
      }
    />
  );
}
