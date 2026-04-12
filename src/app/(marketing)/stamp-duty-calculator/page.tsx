import type { Metadata } from "next";
import { StampDutyCalculator } from "@/components/calculators/StampDutyCalculator";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Stamp Duty Calculator 2025-2026 | All Australian States",
  description:
    "Calculate stamp duty on property purchases across all 8 Australian states and territories. Includes first home buyer concessions and foreign buyer surcharges. Updated for 2025-2026 rates.",
  alternates: { canonical: `${SITE_URL}/stamp-duty-calculator` },
  openGraph: {
    url: `${SITE_URL}/stamp-duty-calculator`,
    title: "Stamp Duty Calculator 2025-2026 | All Australian States",
    description:
      "Calculate stamp duty on property purchases across all 8 Australian states and territories. Updated for 2025-2026 rates.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const FAQS = [
  {
    question: "How is stamp duty calculated in Australia?",
    answer:
      "Stamp duty (also called transfer duty or conveyance duty) is calculated on a sliding scale based on the property purchase price. Each state and territory sets its own rates and brackets, so the amount varies significantly depending on where you buy.",
  },
  {
    question: "Do first home buyers pay stamp duty?",
    answer:
      "Most states offer concessions or full exemptions for first home buyers. Queensland offers a full concession up to $700,000, NSW up to $800,000, VIC up to $600,000, and WA up to $450,000. The ACT has an income-tested exemption scheme. SA does not offer a stamp duty concession but has a separate First Home Owner Grant.",
  },
  {
    question: "What is the foreign buyer surcharge?",
    answer:
      "Foreign buyers of residential property pay an additional surcharge on top of standard duty. Rates are: NSW 8%, VIC 8%, QLD 8%, WA 7%, SA 7%, TAS 8%. The NT and ACT do not charge a foreign buyer surcharge.",
  },
  {
    question: "When is stamp duty paid?",
    answer:
      "Stamp duty is typically due at settlement (when you take possession of the property). Your conveyancer or solicitor will arrange payment as part of the settlement process.",
  },
  {
    question: "Is stamp duty tax deductible?",
    answer:
      "For investment properties, stamp duty forms part of the cost base of the asset and may reduce capital gains tax when you sell. It is not immediately deductible in the year of purchase. For owner-occupied homes, stamp duty is not deductible. Always consult a tax professional for your specific situation.",
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
          Stamp Duty Calculator
        </h1>
        <p className="text-gray-500 mt-2 max-w-xl mx-auto">
          Estimate your stamp duty costs for property purchases across all Australian states and territories.
          Select your state to see accurate 2025-2026 rates.
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
