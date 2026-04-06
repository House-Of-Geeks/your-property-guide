import type { Metadata } from "next";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_NAME } from "@/lib/constants";
import { MapPin, Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: `Contact Us | ${SITE_NAME}`,
  description: "Get in touch with Your Property Guide. We're here to help with all your property needs across Australia.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd items={[{ name: "Contact", url: "/contact" }]} />
      <Breadcrumbs items={[{ label: "Contact" }]} />

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
        <p className="text-gray-500 mt-2">
          Have a question? We&apos;d love to hear from you.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
          <div className="p-4 rounded-xl bg-white shadow-card border border-gray-100 text-center">
            <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Visit Us</p>
            <p className="text-xs text-gray-500 mt-1">Australia</p>
          </div>
          <div className="p-4 rounded-xl bg-white shadow-card border border-gray-100 text-center">
            <Phone className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Call Us</p>
            <p className="text-xs text-gray-500 mt-1">07 3000 0000</p>
          </div>
          <div className="p-4 rounded-xl bg-white shadow-card border border-gray-100 text-center">
            <Mail className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Email Us</p>
            <p className="text-xs text-gray-500 mt-1">hello@yourpropertyguide.com.au</p>
          </div>
        </div>

        <div className="rounded-xl bg-white shadow-card border border-gray-100 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
          <EnquiryForm type="general-contact" />
        </div>
      </div>
    </div>
  );
}
