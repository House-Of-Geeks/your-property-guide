"use client";

import { useState } from "react";
import { User, Phone, Mail } from "lucide-react";
import { isValidPhone, PHONE_ERROR } from "@/lib/utils/phone";
import { clarityEvent, clarityTag } from "@/lib/clarity";
import { AGENT_ENQUIRY_TYPES } from "@/components/agent/enquiry-types";
import { PhoneFollowUp } from "@/components/forms/PhoneFollowUp";

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
    website: "", // honeypot, must stay empty
  });
  const [phoneError, setPhoneError] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ leadId: string | null; hadPhone: boolean } | null>(null);
  const [error, setError] = useState("");

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  // The chosen topic decides the lead type + whether a phone is a must:
  // like the agent profile page, every topic except a general question is
  // answered by the agency picking up the phone, and selling/appraisal
  // enquiries are appraisal-request leads, not general contact.
  const topic = AGENT_ENQUIRY_TYPES.find((t) => t.value === form.enquiryType);
  const requirePhone = Boolean(topic) && topic?.value !== "general";

  // Fires on first interaction with any field. Lets us separate "people who
  // saw the form" (Clarity page view) from "people who engaged with it"
  // (form_start) in the funnel — the gap between the two reveals friction.
  const markStart = () => {
    if (hasStarted) return;
    setHasStarted(true);
    clarityEvent("form_start");
    clarityTag("form_name", "agency-contact");
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const phone = form.phone.trim();
    if (requirePhone && !phone) {
      setPhoneError("Mobile is required so the agency can reach you");
      return;
    }
    // Optional or not, a typed number must be dialable — otherwise the API
    // rejects the whole enquiry with a generic error.
    if (phone && !isValidPhone(phone)) {
      setPhoneError(PHONE_ERROR);
      return;
    }
    setPhoneError("");
    setSubmitting(true);
    setError("");

    const apiType = topic?.apiType ?? "general-contact";
    const context = [`Enquiry type: ${topic?.label ?? "General"}`];
    if (form.postcode.trim()) context.push(`Postcode: ${form.postcode.trim()}`);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: apiType,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim() || undefined,
          email: form.email.trim(),
          phone: phone || undefined,
          message: `${context.join("\n")}\n\n${form.message}`,
          agencyId,
          website: form.website,
          // Topics collapse onto two API types, so the chosen one travels
          // in source (same convention as the agent profile page).
          source: `agency-page-${topic?.value ?? "general"}`,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const bodyJson: { id?: string } | null = await res.json().catch(() => null);
      clarityEvent("contact_us");
      clarityTag("enquiry_type", apiType);
      setSubmitted({ leadId: bodyJson?.id ?? null, hadPhone: Boolean(phone) });
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
        {!submitted.hadPhone && submitted.leadId && (
          <div className="mt-6 max-w-sm mx-auto text-left">
            <PhoneFollowUp
              leadId={submitted.leadId}
              source="agency-page"
              prompt="Want a faster answer? Add your mobile and they'll call instead of emailing."
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} onFocus={markStart} className="space-y-6">
      {/* Honeypot: visually hidden, off-screen, aria-hidden. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }}>
        <label htmlFor="agency-contact-website">Website</label>
        <input
          id="agency-contact-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => set("website", e.target.value)}
        />
      </div>
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
                autoComplete="given-name"
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                autoComplete="family-name"
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile {requirePhone && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(e) => {
                  set("phone", e.target.value);
                  if (phoneError) setPhoneError("");
                }}
                aria-invalid={phoneError ? true : undefined}
                className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                  phoneError ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-primary"
                }`}
              />
            </div>
            {phoneError && <p className="mt-1 text-xs text-red-500">{phoneError}</p>}
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
                autoComplete="email"
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
          {AGENT_ENQUIRY_TYPES.map((t) => (
            <label key={t.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="enquiryType"
                value={t.value}
                checked={form.enquiryType === t.value}
                onChange={(e) => {
                  set("enquiryType", e.target.value);
                  if (phoneError) setPhoneError("");
                }}
                className="accent-primary"
              />
              <span className="text-sm text-gray-700">{t.label}</span>
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Your postcode</label>
        <input
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
        className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
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
