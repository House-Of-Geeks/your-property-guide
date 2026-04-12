import type { Metadata } from "next";
import { RentalYieldCalculator } from "@/components/calculators/RentalYieldCalculator";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Rental Yield Calculator | ${SITE_NAME}`,
  description:
    "Calculate gross and net rental yield for any Australian investment property. Free rental yield calculator with expense breakdown.",
  alternates: { canonical: `${SITE_URL}/rental-yield-calculator` },
  openGraph: {
    url: `${SITE_URL}/rental-yield-calculator`,
    title: `Rental Yield Calculator | ${SITE_NAME}`,
    description:
      "Calculate gross and net rental yield for any Australian investment property. Free rental yield calculator with expense breakdown.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const FAQS = [
  {
    question: "What is rental yield?",
    answer:
      "Rental yield is the annual return on a property investment expressed as a percentage of its value. A higher yield means greater income relative to the property's cost. It is one of the key metrics investors use to compare investment properties.",
  },
  {
    question: "What is the difference between gross and net rental yield?",
    answer:
      "Gross rental yield is simply the annual rental income divided by the purchase price, expressed as a percentage. Net rental yield factors in all ongoing costs (council rates, insurance, property management, maintenance, etc.) and is calculated against the full cost base (purchase price plus buying costs). Net yield gives a more realistic picture of your actual return.",
  },
  {
    question: "What is a good rental yield in Australia?",
    answer:
      "Gross rental yields in Australian capital cities typically range from 3–6%. Sydney and Melbourne often yield 2.5–4% gross, while regional areas and higher-density markets like Brisbane, Adelaide, and Perth can yield 4–6%+. 'Good' depends on your strategy — higher yields often come with lower capital growth prospects, and vice versa.",
  },
  {
    question: "What is cash flow and why does it matter?",
    answer:
      "Cash flow is the money left over after all expenses (including loan repayments) are paid from rental income. A positively geared property generates cash flow surplus each week. A negatively geared property costs more to hold than it earns in rent — the shortfall is often offset against other income for tax purposes.",
  },
  {
    question: "What costs should I include in my yield calculation?",
    answer:
      "Key ongoing costs include council rates, water rates, landlord insurance, property management fees (typically 7–10% of rent in most states), maintenance and repairs allowance (commonly 0.5–1% of property value per year), strata levies if applicable, and land tax if applicable. Purchase costs include stamp duty, legal/conveyancing fees, and building inspection fees.",
  },
];

export default function RentalYieldCalculatorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[{ name: "Rental Yield Calculator", url: "/rental-yield-calculator" }]}
      />
      <FAQPageJsonLd faqs={FAQS} />
      <Breadcrumbs items={[{ label: "Rental Yield Calculator" }]} />

      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Rental Yield Calculator
        </h1>
        <p className="text-gray-500 mt-2 max-w-xl mx-auto">
          Calculate gross and net rental yield for any Australian investment property.
          Include purchase costs and ongoing expenses for a complete picture.
        </p>
      </div>

      <RentalYieldCalculator />

      {/* Explainer */}
      <div className="max-w-2xl mx-auto mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Gross vs Net Yield Explained
        </h2>
        <div className="space-y-4 text-gray-600">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-1">Gross Rental Yield</h3>
            <p className="text-sm">
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs text-gray-700">
                (Weekly Rent × 52 / Purchase Price) × 100
              </code>
            </p>
            <p className="text-sm mt-2">
              A quick benchmark for comparing properties. Does not account for costs, so it
              overstates the true return. Most property listings and market reports quote gross yield.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-1">Net Rental Yield</h3>
            <p className="text-sm">
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs text-gray-700">
                ((Annual Rent − Annual Costs) / (Purchase Price + Buying Costs)) × 100
              </code>
            </p>
            <p className="text-sm mt-2">
              A more accurate measure that reflects what you actually earn after expenses. Net yield
              is typically 1–2% lower than gross yield once management fees, rates, insurance, and
              maintenance are accounted for.
            </p>
          </div>
          <p className="text-sm">
            When comparing investment properties, always use net yield for a like-for-like
            comparison. Properties with high gross yields can have surprisingly low net yields
            if costs are high (e.g., older buildings with high maintenance requirements or
            strata levies).
          </p>
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
