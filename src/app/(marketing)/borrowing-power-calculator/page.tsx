import type { Metadata } from "next";
import { BorrowingPowerCalculator } from "@/components/calculators/BorrowingPowerCalculator";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Borrowing Power Calculator | ${SITE_NAME}`,
  description:
    "Calculate how much you can borrow for a home loan in Australia. Free borrowing power calculator based on your income, expenses and current interest rates.",
  alternates: { canonical: `${SITE_URL}/borrowing-power-calculator` },
  openGraph: {
    url: `${SITE_URL}/borrowing-power-calculator`,
    title: `Borrowing Power Calculator | ${SITE_NAME}`,
    description:
      "Calculate how much you can borrow for a home loan in Australia. Free borrowing power calculator based on your income, expenses and current interest rates.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const FAQS = [
  {
    question: "How do banks calculate borrowing power?",
    answer:
      "Australian banks assess your borrowing capacity by looking at your gross income (both applicants if applicable), then estimating your net income after tax. They deduct living expenses — using either your declared expenses or the Household Expenditure Measure (HEM) benchmark, whichever is higher — plus any existing debt repayments. The remaining surplus determines how much you can repay, and from that they back-calculate the maximum loan.",
  },
  {
    question: "What is the HEM benchmark?",
    answer:
      "HEM (Household Expenditure Measure) is a benchmark developed by Melbourne Institute. Banks use it as a minimum living expense figure — if your declared expenses are lower than HEM, they'll use HEM instead. The amount varies based on household composition and location, but broadly ranges from around $2,000/month for singles to $4,000+/month for families.",
  },
  {
    question: "What is a serviceability buffer?",
    answer:
      "APRA (the banking regulator) requires lenders to assess your ability to repay at your actual interest rate plus a 3% buffer. So if current rates are around 6%, banks test whether you can afford repayments at 9%. This protects borrowers from rate rises and is why the assessment rate in this calculator defaults to 7.5%.",
  },
  {
    question: "How can I increase my borrowing power?",
    answer:
      "You can increase borrowing power by reducing existing debt (especially credit card limits, as banks count the full limit not just balances), increasing income, reducing declared living expenses (where genuine), extending the loan term, or applying jointly with a partner. Closing unused credit cards can make a significant difference.",
  },
  {
    question: "Does this calculator give an exact figure?",
    answer:
      "No. This is an estimate based on simplified assumptions. Each lender has its own policies, HEM tables, and income treatment rules. For an accurate figure, speak with a mortgage broker who can assess multiple lenders on your behalf.",
  },
];

export default function BorrowingPowerCalculatorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[{ name: "Borrowing Power Calculator", url: "/borrowing-power-calculator" }]}
      />
      <FAQPageJsonLd faqs={FAQS} />
      <Breadcrumbs items={[{ label: "Borrowing Power Calculator" }]} />

      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Borrowing Power Calculator
        </h1>
        <p className="text-gray-500 mt-2 max-w-xl mx-auto">
          Estimate how much you can borrow for a home loan based on your income, living expenses,
          and current Australian lending standards.
        </p>
      </div>

      <BorrowingPowerCalculator />

      {/* How it works explainer */}
      <div className="max-w-2xl mx-auto mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          How Banks Assess Your Borrowing Capacity
        </h2>
        <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
          <p>
            Australian banks use a serviceability assessment to determine the maximum loan you can
            afford. The process works roughly as follows:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong>Gross income</strong> — Your total income (wages, salary, rental income, etc.)
              from all applicants is added together.
            </li>
            <li>
              <strong>Net income</strong> — An after-tax estimate is calculated. This calculator
              uses a simple 72% net factor as an approximation.
            </li>
            <li>
              <strong>Living expenses (HEM)</strong> — Banks deduct your living costs. They use the
              higher of your declared expenses or the HEM benchmark — a minimum expense figure that
              varies by household size.
            </li>
            <li>
              <strong>Existing debts</strong> — All existing monthly debt repayments (credit cards,
              car loans, personal loans, other mortgages) are deducted.
            </li>
            <li>
              <strong>Serviceability buffer</strong> — APRA requires banks to test your repayment
              capacity at your actual rate plus 3%. This is why the default assessment rate is 7.5%
              even when market rates may be lower.
            </li>
            <li>
              <strong>Maximum loan</strong> — From the remaining surplus, the bank back-calculates
              the loan amount whose repayments fit within approximately 85-90% of that surplus.
            </li>
          </ol>
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-2xl mx-auto mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {FAQS.map((faq, i) => (
            <div key={i}>
              <h3 className="font-semibold text-gray-900">{faq.question}</h3>
              <p className="text-gray-600 mt-1">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
