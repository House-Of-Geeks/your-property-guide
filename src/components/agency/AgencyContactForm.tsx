"use client";

import { useState } from "react";
import { User, Phone, Mail } from "lucide-react";

const ENQUIRY_TYPES = [
  "Selling my property and appraisals",
  "Buying a property",
  "I have a general enquiry",
  "Leasing my property",
  "Renting a property",
];

interface AgencyContactFormProps {
  agencyId: string;
  agencyName: string;
}

export function AgencyContactForm({ agencyId, agencyName }: AgencyContactFormProps) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    enquiryType: "",
    message: "",
    postcode: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "general-contact",
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone || "0000000000",
          message: `Enquiry type: ${form.enquiryType || "General"}\nPostcode: ${form.postcode}\n\n${form.message}`,
          agencyId,
          source: "agency-page",
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="py-10 text-center">
        <p className="text-lg font-semibold text-gray-900">Enquiry sent!</p>
        <p className="text-sm text-gray-500 mt-1">
          {agencyName} will be in touch with you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact details */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Contact Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                required
                type="text"
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                required
                type="text"
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry type */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Your Enquiry</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ENQUIRY_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="enquiryType"
                value={type}
                checked={form.enquiryType === type}
                onChange={(e) => set("enquiryType", e.target.value)}
                className="accent-primary"
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Your message</label>
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="What can we help you with?"
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>

      {/* Postcode */}
      <div className="max-w-xs">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your postcode <span className="text-red-500">*</span>
        </label>
        <input
          required
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={form.postcode}
          onChange={(e) => set("postcode", e.target.value.replace(/\D/g, ""))}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="px-6 py-2.5 bg-gray-400 hover:bg-primary text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send enquiry"}
      </button>

      <p className="text-xs text-gray-400">
        By submitting your enquiry, you agree to our{" "}
        <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
      </p>
    </form>
  );
}
