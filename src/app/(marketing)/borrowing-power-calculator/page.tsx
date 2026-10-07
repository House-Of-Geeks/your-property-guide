import type { Metadata } from "next";
import Link from "next/link";
import { BorrowingPowerCalculator } from "@/components/calculators/BorrowingPowerCalculator";
import { BorrowingPowerTable } from "@/components/calculators/BorrowingPowerTable";
import { HemTable } from "@/components/calculators/HemTable";
import { CalculatorPageLayout, type CalculatorPageFrontmatter } from "@/components/calculators/CalculatorPageLayout";
import { Callout, KeyFigure, type FaqItem, type RelatedGuide } from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { borrowingPowerFaqs } from "@/lib/borrowing-power-table";
import {
  APRA_BUFFER_CONFIRMED,
  APRA_SERVICEABILITY_BUFFER,
  DEFAULT_ASSESSMENT_RATE,
  REFERENCE_LOAN_RATE,
  REFERENCE_LOAN_RATE_PERIOD,
} from "@/lib/utils/borrowing-power";

// Static content; a weekly re-render keeps the route on ISR like the rest of the site.
export const revalidate = 604800;

const FRONTMATTER: CalculatorPageFrontmatter = {
  title: "Borrowing Power Calculator",
  // The H1 carries the query the page is shown for ("how much can i borrow",
  // 12,100 searches a month, position 32 on 30 Sep 2026); the short title
  // stays for breadcrumbs and schema.
  h1: "How much can I borrow? Borrowing power calculator",
  description:
    "Estimate how much you can borrow for a home loan based on your income, living expenses and current Australian lending standards.",
  slug: "borrowing-power-calculator",
  schemaName: "Borrowing Power Calculator",
  schemaDescription: "Estimate how much you can borrow based on your income, expenses, and APRA buffer.",
  updatedAt: "2026-10-08",
  persona: "first-home",
};

// Title and H1 both carry "how much can I borrow", the dominant intent for
// this page (commercial intent review, 30 Sep 2026, section 3.3).
const META_TITLE = "How Much Can I Borrow? Borrowing Power Calculator Australia";
const META_DESCRIPTION = "Free Australian borrowing power calculator. Estimate how much a bank will lend you for a home loan, based on your income, expenses and the APRA 3% buffer. No sign-up.";

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
    question: "How do banks calculate borrowing power?",
    answer:
      "Australian banks assess your borrowing capacity by looking at your gross income (both applicants if applicable), then estimating your net income after tax. They deduct living expenses, using either your declared expenses or the Household Expenditure Measure (HEM) benchmark, whichever is higher, plus any existing debt repayments. The remaining surplus determines how much you can repay, and from that they back-calculate the maximum loan.",
  },
  {
    question: "What is the HEM benchmark?",
    answer:
      "The Household Expenditure Measure is a benchmark of living expenses produced by the Melbourne Institute from the ABS Household Expenditure Survey: the median spend on absolute basics plus the 25th-percentile spend on discretionary basics, varying by household composition, income band and location, updated quarterly. Lenders use the higher of the expenses you declare and the HEM for a household like yours, which APRA expects them to scale by income, so declaring less than HEM does not lift your borrowing power. HEM excludes rent and mortgage payments; childcare, school fees, HECS and loan repayments are assessed on top. The tables are licensed to lenders and not published; this calculator applies the indicative figures in the table above.",
  },
  {
    question: "What is a serviceability buffer?",
    answer:
      `APRA, the banking regulator, expects lenders to test whether you could repay at your loan rate plus a buffer, which it confirmed at ${APRA_SERVICEABILITY_BUFFER} percentage points on ${APRA_BUFFER_CONFIRMED}. The average rate on new owner-occupier variable loans was ${REFERENCE_LOAN_RATE}% in ${REFERENCE_LOAN_RATE_PERIOD} (RBA table F6), so a typical borrower is tested at about ${DEFAULT_ASSESSMENT_RATE}%. This protects borrowers from rate rises and is why the assessment rate in this calculator defaults to ${DEFAULT_ASSESSMENT_RATE}%.`,
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
    question: `Why does the calculator use a ${DEFAULT_ASSESSMENT_RATE}% assessment rate when actual rates are lower?`,
    answer:
      `Because that's how lenders actually assess you. APRA's serviceability rule adds a ${APRA_SERVICEABILITY_BUFFER} percentage point buffer on top of the rate the lender quotes. With the ${REFERENCE_LOAN_RATE}% average new variable rate of ${REFERENCE_LOAN_RATE_PERIOD}, the test rate is ${DEFAULT_ASSESSMENT_RATE}%. If your lender offers you less, lower the assessment rate by the difference. The buffer means your borrowing capacity is always lower than your repayments at the offered rate would suggest.`,
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Guide",   href: "/guides/first-home-buyer-guide", description: "How federal schemes, state grants, and stamp duty concessions stack." },
  { title: "Stamp Duty Calculator",    href: "/stamp-duty-calculator",         description: "What you'll actually pay (concessions included)." },
  { title: "Affordability Calculator", href: "/affordability-calculator",      description: "How much property you can afford on top of how much you can borrow." },
  { title: "What is HEM?",             href: "/glossary/hem-household-expenditure-measure", description: "The living-expense floor lenders apply, in a paragraph." },
  { title: "Mortgage Repayments",      href: "/mortgage-calculator",           description: "What the loan will actually cost you each month." },
  { title: "LMI Explained",            href: "/guides/lenders-mortgage-insurance-guide", description: "What it costs and the schemes that waive it." },
  { title: "Help to Buy Calculator",   href: "/help-to-buy-calculator",        description: "If the loan is too big: the government funds up to 40% and you borrow less." },
  { title: "FHSS Calculator",          href: "/fhss-calculator",               description: "How much the First Home Super Saver scheme adds to your deposit." },
  { title: "Refinancing Calculator",   href: "/refinancing-calculator",        description: "Whether your current loan is still the best one for you." },
];

export default function BorrowingPowerCalculatorPage() {
  return (
    <CalculatorPageLayout
      frontmatter={FRONTMATTER}
      calculator={<BorrowingPowerCalculator />}
      faqs={[...borrowingPowerFaqs(), ...FAQS]}
      related={RELATED}
      intent="buying"
      explainer={
        <>
          <BorrowingPowerTable />

          <HemTable />

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
              repayment capacity at your actual rate plus {APRA_SERVICEABILITY_BUFFER} percentage points.
              This is why the default assessment rate is {DEFAULT_ASSESSMENT_RATE}%, above the{" "}
              {REFERENCE_LOAN_RATE}% average new variable rate of {REFERENCE_LOAN_RATE_PERIOD}.
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
            context={`APRA, confirmed ${APRA_BUFFER_CONFIRMED}`}
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
