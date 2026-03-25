import type { Metadata } from "next";
import { StampDutyCalculator } from "@/components/calculators/StampDutyCalculator";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `QLD Stamp Duty Calculator 2025-2026 | ${SITE_NAME}`,
  description:
    "Calculate stamp duty (transfer duty) on property purchases in Queensland. Includes first home buyer concessions and foreign buyer surcharges.",
};

const FAQS = [
  {
    question: "How is stamp duty calculated in Queensland?",
    answer:
      "Queensland transfer duty is calculated on a sliding scale based on the property purchase price. Rates range from 1.5% for properties under $75,000 up to 5.75% for properties over $1,000,000.",
  },
  {
    question: "Do first home buyers pay stamp duty in QLD?",
    answer:
      "First home buyers in Queensland may be eligible for a stamp duty concession. Properties up to $700,000 receive a full concession, with a phased reduction for properties between $700,000 and $800,000.",
  },
  {
    question: "What is the foreign buyer surcharge?",
    answer:
      "Foreign buyers of residential property in Queensland pay an additional 8% surcharge on top of the standard transfer duty.",
  },
];

export default function StampDutyCalculatorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd items={[{ name: "Stamp Duty Calculator", url: "/stamp-duty-calculator" }]} />
      <FAQPageJsonLd faqs={FAQS} />
      <Breadcrumbs items={[{ label: "Stamp Duty Calculator" }]} />

      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          QLD Stamp Duty Calculator
        </h1>
        <p className="text-gray-500 mt-2 max-w-xl mx-auto">
          Estimate your transfer duty costs for property purchases in Queensland. Updated for 2025-2026 rates.
        </p>
      </div>

      <StampDutyCalculator />

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
