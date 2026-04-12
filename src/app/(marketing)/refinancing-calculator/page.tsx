import type { Metadata } from "next";
import { RefinancingCalculator } from "@/components/calculators/RefinancingCalculator";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Refinancing Calculator | Break-Even Analysis | ${SITE_NAME}`,
  description:
    "Calculate whether refinancing your home loan is worth it. Find your break-even point, monthly savings, and total interest saved over the life of your loan.",
  alternates: { canonical: `${SITE_URL}/refinancing-calculator` },
  openGraph: {
    url: `${SITE_URL}/refinancing-calculator`,
    title: `Refinancing Calculator | Break-Even Analysis | ${SITE_NAME}`,
    description:
      "Calculate whether refinancing your home loan is worth it. Find your break-even point, monthly savings, and total interest saved over the life of your loan.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const FAQS = [
  {
    question: "What is the break-even point when refinancing?",
    answer:
      "The break-even point is the number of months it takes for your cumulative monthly savings to exceed the upfront costs of switching loans. For example, if you save $200/month and it costs $3,600 to switch, your break-even is 18 months.",
  },
  {
    question: "What costs are involved in refinancing?",
    answer:
      "Common refinancing costs include a discharge fee from your current lender (typically $150–$500), an establishment or application fee with the new lender (typically $0–$1,000), legal/settlement fees (typically $500–$1,500), and potentially Lender's Mortgage Insurance if your LVR is above 80%.",
  },
  {
    question: "What is an LVR and when does LMI apply?",
    answer:
      "LVR stands for Loan to Value Ratio — your loan balance divided by the property value. If your LVR exceeds 80%, most lenders will require Lenders Mortgage Insurance (LMI), which can cost thousands of dollars and significantly affect your refinancing break-even calculation.",
  },
  {
    question: "How much can I save by refinancing?",
    answer:
      "The savings depend on the difference between your current and new interest rates, your remaining loan balance, and the term. Even a 0.5% rate reduction on a $500,000 loan can save over $150/month and more than $50,000 over a 30-year term.",
  },
  {
    question: "Can I negotiate a rate reduction without refinancing?",
    answer:
      "Yes — many borrowers succeed in getting a rate reduction simply by calling their lender and threatening to refinance. This costs nothing and should always be tried first, especially if your break-even calculation shows refinancing is marginal.",
  },
];

export default function RefinancingCalculatorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[{ name: "Refinancing Calculator", url: "/refinancing-calculator" }]}
      />
      <FAQPageJsonLd faqs={FAQS} />
      <Breadcrumbs items={[{ label: "Refinancing Calculator" }]} />

      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Refinancing Break-Even Calculator
        </h1>
        <p className="text-gray-500 mt-2 max-w-xl mx-auto">
          Find out whether switching your home loan is worth it. Enter your current loan
          details and the new rate on offer to calculate your monthly savings, break-even
          point, and total interest saved.
        </p>
      </div>

      <RefinancingCalculator />

      {/* Explainer */}
      <div className="max-w-2xl mx-auto mt-16 space-y-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Should You Refinance Your Home Loan?
          </h2>
          <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
            <p>
              Refinancing can save tens of thousands of dollars over the life of a loan,
              but it comes with upfront costs that need to be weighed against your savings.
              The key metric is the break-even point.
            </p>
            <p>
              <strong>When refinancing usually makes sense:</strong> your break-even is
              under 24 months, you plan to keep the loan for several years, and the new
              lender has no hidden fees or restrictive conditions.
            </p>
            <p>
              <strong>When to be cautious:</strong> if you&apos;re planning to sell or pay off
              the loan in the next few years, a long break-even period means you may never
              recoup the switching costs. Also consider whether a fixed-rate break fee
              applies to your current loan.
            </p>
            <p>
              <strong>A quick alternative:</strong> before going through the refinancing
              process, call your current lender and ask for a rate match. Many lenders will
              reduce your rate to retain your business, with zero cost or paperwork.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
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
    </div>
  );
}
