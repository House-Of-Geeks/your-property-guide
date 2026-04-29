"use client";

import { useState } from "react";
import { Bookmark, CheckCircle, Loader2 } from "lucide-react";
import { clarityEvent, clarityTag } from "@/lib/clarity";

interface Props {
  address: string;
  suburbName: string;
  suburbSlug?: string;
}

export function PropertyInterestForm({ address, suburbName, suburbSlug }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "property-interest",
          firstName,
          lastName,
          email,
          phone,
          address,
          suburb: suburbName,
          message: `Registered interest in: ${address}`,
          source: "property-page",
        }),
      });
      if (!res.ok) throw new Error("Failed");
      clarityEvent("contact_us");
      clarityTag("enquiry_type", "property_interest");
      if (suburbSlug) clarityTag("enquiry_suburb", suburbSlug);
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-gray-100 p-8 text-center">
        <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-gray-900">Property tracked!</h3>
        <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
          We&apos;ll notify you when this property or something similar comes to market.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 p-6">
      <div className="flex items-start gap-3 mb-5">
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
          <Bookmark className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Track this property</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Not currently listed — we&apos;ll notify you the moment it or something similar hits the market.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="pi-firstName" className="block text-xs font-medium text-gray-600 mb-1">
              First name <span className="text-red-500">*</span>
            </label>
            <input
              id="pi-firstName"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Jane"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
          </div>
          <div>
            <label htmlFor="pi-lastName" className="block text-xs font-medium text-gray-600 mb-1">
              Last name <span className="text-red-500">*</span>
            </label>
            <input
              id="pi-lastName"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Smith"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
          </div>
        </div>
        <div>
          <label htmlFor="pi-email" className="block text-xs font-medium text-gray-600 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="pi-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
          />
        </div>
        <div>
          <label htmlFor="pi-phone" className="block text-xs font-medium text-gray-600 mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            id="pi-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="04XX XXX XXX"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
          {loading ? "Tracking…" : "Track This Property"}
        </button>

        <p className="text-xs text-gray-400 leading-relaxed">
          By submitting you agree to our{" "}
          <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
        </p>
      </form>
    </div>
  );
}
