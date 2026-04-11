import type { Metadata } from "next";
import { MortgageCalculator } from "@/components/calculators/MortgageCalculator";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Mortgage Repayment Calculator | Your Property Guide",
  description:
    "Calculate your mortgage repayments, total interest, and see a full amortization breakdown. Free Australian mortgage calculator.",
  alternates: { canonical: `${SITE_URL}/mortgage-calculator` },
  openGraph: {
    url: `${SITE_URL}/mortgage-calculator`,
    title: "Mortgage Repayment Calculator | Your Property Guide",
    description:
      "Calculate your mortgage repayments, total interest, and see a full amortization breakdown. Free Australian mortgage calculator.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const FAQS = [
  {
    question: "How is a mortgage repayment calculated?",
    answer:
      "For a principal and interest loan, repayments are calculated using the formula: P × (r(1+r)^n) / ((1+r)^n − 1), where P is the loan amount, r is the periodic interest rate, and n is the total number of payments. For interest-only loans, the repayment is simply the loan amount multiplied by the periodic interest rate.",
  },
  {
    question: "What is the difference between fortnightly and monthly repayments?",
    answer:
      "Making fortnightly repayments results in 26 payments per year — the equivalent of 13 monthly payments. This extra payment each year reduces your principal faster, shortening the loan term and saving interest over the life of the loan.",
  },
  {
    question: "What does an interest-only loan mean?",
    answer:
      "With an interest-only loan your repayments cover only the interest charged each period. The loan principal does not reduce during the interest-only period. These loans are common for investment properties but result in higher total repayments over the life of the loan.",
  },
  {
    question: "How much deposit do I need for a home loan in Australia?",
    answer:
      "Most Australian lenders require a minimum 20% deposit to avoid Lenders Mortgage Insurance (LMI). Some lenders accept deposits as low as 5–10% with LMI. First home buyers may also be eligible for government schemes that reduce the required deposit.",
  },
];

export default function MortgageCalculatorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd items={[{ name: "Mortgage Calculator", url: "/mortgage-calculator" }]} />
      <FAQPageJsonLd faqs={FAQS} />
      <Breadcrumbs items={[{ label: "Mortgage Calculator" }]} />

      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Mortgage Repayment Calculator
        </h1>
        <p className="text-gray-500 mt-2 max-w-xl mx-auto">
          Estimate your repayments, total interest paid, and view a full yearly amortization schedule.
          Supports weekly, fortnightly, and monthly repayment frequencies.
        </p>
      </div>

      <MortgageCalculator />

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
