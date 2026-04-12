import type { Metadata } from "next";
import { AffordabilityCalculator } from "@/components/calculators/AffordabilityCalculator";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, FAQPageJsonLd, WebApplicationJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Property Affordability Calculator | How Much Can I Spend? | ${SITE_NAME}`,
  description:
    "Calculate what property price you can afford based on your deposit, income, and expenses. Free Australian property affordability calculator.",
  alternates: { canonical: `${SITE_URL}/affordability-calculator` },
  openGraph: {
    url: `${SITE_URL}/affordability-calculator`,
    title: `Property Affordability Calculator | How Much Can I Spend? | ${SITE_NAME}`,
    description:
      "Calculate what property price you can afford based on your deposit, income, and expenses. Free Australian property affordability calculator.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const FAQS = [
  {
    question: "How does the affordability calculator work?",
    answer:
      "The calculator uses two tests and takes the lower result. First, it calculates the maximum purchase price your deposit can support at your chosen deposit percentage. Second, it estimates your borrowing capacity using your income, expenses, and the HEM benchmark — the same method Australian banks use. The binding constraint (whichever limits you more) determines your affordable purchase price.",
  },
  {
    question: "What is the difference between deposit-limited and serviceability-limited?",
    answer:
      "If you are deposit-limited, your savings are the bottleneck — even if a bank would lend you more, you don't have enough deposit for a higher-priced property. If you are serviceability-limited, your income cannot support repayments on a larger loan — but your deposit could cover a higher purchase price if you could borrow more.",
  },
  {
    question: "Why does the calculator deduct buying costs from my savings?",
    answer:
      "In addition to your deposit, you need to cover stamp duty, conveyancing fees, building inspections, and other settlement costs. These typically add 4–6% on top of the purchase price. The calculator uses approximately 7% of savings as a buffer for these costs, leaving the rest available as your deposit.",
  },
  {
    question: "What is LMI and when does it apply?",
    answer:
      "Lender's Mortgage Insurance (LMI) is a one-off premium charged by lenders when your deposit is less than 20% of the purchase price (i.e. LVR above 80%). LMI protects the lender — not you — in case you default. The cost typically ranges from 0.5% to 2.5% of the loan amount and can usually be added to (capitalised into) your loan. Saving a 20% deposit avoids LMI entirely.",
  },
  {
    question: "Are these figures accurate?",
    answer:
      "This is an estimate based on simplified assumptions. Actual borrowing capacity varies by lender, your credit history, employment type, and other factors. Stamp duty rates also vary by state and buyer status. Use our Stamp Duty Calculator for a precise duty estimate, and speak with a mortgage broker for a personalised borrowing assessment.",
  },
];

export default function AffordabilityCalculatorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[{ name: "Affordability Calculator", url: "/affordability-calculator" }]}
      />
      <WebApplicationJsonLd
        name="Property Affordability Calculator"
        description="Calculate how much property you can afford based on your deposit and borrowing power."
        url="/affordability-calculator"
      />
      <FAQPageJsonLd faqs={FAQS} />
      <Breadcrumbs items={[{ label: "Affordability Calculator" }]} />

      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Property Affordability Calculator
        </h1>
        <p className="text-gray-500 mt-2 max-w-xl mx-auto">
          Find out what property price you can realistically afford — based on your deposit,
          income, and living costs — using the same methods Australian banks use.
        </p>
      </div>

      <AffordabilityCalculator />

      {/* Explainer */}
      <div className="max-w-2xl mx-auto mt-16 space-y-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Deposit vs Borrowing: Two Different Limits
          </h2>
          <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
            <p>
              Your maximum affordable purchase price is constrained by two separate factors, and
              the lower of the two wins:
            </p>
            <h3 className="text-base font-semibold text-gray-900">1. Deposit constraint</h3>
            <p>
              With a 20% deposit requirement and $100,000 in savings (after buying costs), the
              most you can spend is $500,000 — even if a bank would happily lend you more.
              Choosing a 10% or 15% deposit allows you to buy at a higher price with the same
              savings, but Lender&apos;s Mortgage Insurance (LMI) will apply.
            </p>
            <h3 className="text-base font-semibold text-gray-900">2. Serviceability constraint</h3>
            <p>
              Banks assess whether you can afford repayments at your actual interest rate plus a
              3% buffer (required by APRA). They deduct living expenses — using at least the HEM
              (Household Expenditure Measure) benchmark — and existing debts. The remaining
              surplus determines your maximum monthly repayment, which sets your borrowing limit.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Understanding LMI
          </h2>
          <div className="prose prose-gray max-w-none text-gray-600 space-y-3">
            <p>
              Lender&apos;s Mortgage Insurance (LMI) is charged when your loan-to-value ratio (LVR)
              exceeds 80% — meaning your deposit is less than 20% of the purchase price.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>85% LVR (15% deposit):</strong> LMI typically costs around 0.5–0.8% of
                the loan amount
              </li>
              <li>
                <strong>90% LVR (10% deposit):</strong> LMI rises to around 1–1.5% of the loan
                amount
              </li>
              <li>
                <strong>95% LVR (5% deposit):</strong> LMI can reach 2.5%+ of the loan amount
              </li>
            </ul>
            <p>
              LMI can be capitalised into your loan — you don&apos;t necessarily need to pay it
              upfront — but it increases your total loan balance and repayments. The best way to
              avoid LMI is to save a 20% deposit, or explore government schemes such as the First
              Home Guarantee (formerly FHLDS) which allows eligible first-home buyers to purchase
              with just 5% deposit and no LMI.
            </p>
          </div>
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
