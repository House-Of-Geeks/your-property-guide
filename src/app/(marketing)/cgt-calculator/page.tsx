import type { Metadata } from "next";
import { CGTCalculator } from "@/components/calculators/CGTCalculator";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Capital Gains Tax Calculator for Property | ${SITE_NAME}`,
  description:
    "Calculate capital gains tax on your investment property sale. Includes 50% CGT discount, main residence exemption, and partial exemption calculations.",
  alternates: { canonical: `${SITE_URL}/cgt-calculator` },
  openGraph: {
    url: `${SITE_URL}/cgt-calculator`,
    title: `Capital Gains Tax Calculator for Property | ${SITE_NAME}`,
    description:
      "Calculate capital gains tax on your investment property sale. Includes 50% CGT discount, main residence exemption, and partial exemption calculations.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const FAQS = [
  {
    question: "What is the 50% CGT discount?",
    answer:
      "If you hold an investment property for more than 12 months, you are eligible for a 50% CGT discount as an individual or trust. This means only half of your capital gain is added to your taxable income. Companies are not eligible for this discount.",
  },
  {
    question: "What is the main residence exemption?",
    answer:
      "If you sell your primary place of residence and have never rented it out, you generally pay no CGT on the sale. This is known as the main residence (or principal place of residence) exemption.",
  },
  {
    question: "What happens if I rented out my home for part of the time?",
    answer:
      "A partial main residence exemption applies. Only the proportion of time the property was rented is taxable. For example, if you owned the property for 5 years and rented it for 2 years, 40% of the gain would be assessable — and if held more than 12 months, the 50% discount would then also apply to that assessable portion.",
  },
  {
    question: "How does joint ownership affect CGT?",
    answer:
      "In a 50/50 joint ownership arrangement, each owner is liable for CGT on their own share of the gain. Each party applies their own marginal tax rate and any applicable discounts to their half of the taxable gain.",
  },
  {
    question: "What costs can I include in my cost base?",
    answer:
      "Your cost base includes the original purchase price, stamp duty, legal fees, building and pest inspection costs, and capital improvements made during ownership. Agent commissions and legal fees paid on sale reduce your capital proceeds.",
  },
];

export default function CGTCalculatorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[{ name: "CGT Calculator", url: "/cgt-calculator" }]}
      />
      <FAQPageJsonLd faqs={FAQS} />
      <Breadcrumbs items={[{ label: "CGT Calculator" }]} />

      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Capital Gains Tax Calculator
        </h1>
        <p className="text-gray-500 mt-2 max-w-xl mx-auto">
          Estimate the CGT on your Australian investment property sale. Includes the 50%
          discount for assets held over 12 months, main residence exemption, and partial
          exemption for properties rented while being your primary residence.
        </p>
      </div>

      <CGTCalculator />

      {/* Explainer */}
      <div className="max-w-2xl mx-auto mt-16 space-y-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How Capital Gains Tax Works on Property in Australia
          </h2>
          <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
            <p>
              When you sell an investment property in Australia, the profit (capital gain)
              is added to your assessable income in the year of sale and taxed at your
              marginal rate.
            </p>
            <p>
              <strong>Cost base</strong> — your cost base is what you paid for the property,
              plus most costs associated with buying it (stamp duty, conveyancing, building
              inspection) and any capital improvements you made.
            </p>
            <p>
              <strong>Capital proceeds</strong> — the amount you receive on sale, less costs
              of sale such as real estate agent commissions and legal fees.
            </p>
            <p>
              <strong>50% CGT discount</strong> — if you&apos;ve owned the property for more than
              12 months as an individual or via a trust, only 50% of the net capital gain is
              taxable. Companies do not qualify.
            </p>
            <p>
              <strong>Main residence exemption</strong> — if the property is your principal
              place of residence and you never rented it out, no CGT applies. If you rented
              it for part of the time, a partial exemption applies based on the proportion
              of days it was your main residence.
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
