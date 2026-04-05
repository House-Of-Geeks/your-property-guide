import type { Metadata } from "next";
import { AppraisalForm } from "@/components/forms/AppraisalForm";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Property Appraisal",
  description: "Request a free property appraisal from a local real estate agent. No obligation, expert advice on your property's value.",
  alternates: { canonical: `${SITE_URL}/appraisal` },
  openGraph: { title: "Free Property Appraisal", description: "Request a free property appraisal from a local real estate agent.", type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function AppraisalPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd items={[{ name: "Free Appraisal", url: "/appraisal" }]} />
      <Breadcrumbs items={[{ label: "Free Appraisal" }]} />

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Free Property Appraisal
          </h1>
          <p className="text-gray-500 mt-2">
            Find out what your property is worth with a free, no-obligation appraisal from a local expert.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            "Local market expertise",
            "No obligation",
            "Response within 24 hours",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 p-3 rounded-lg bg-green-50">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm font-medium text-green-700">{item}</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
          <AppraisalForm />
        </div>
      </div>
    </div>
  );
}
