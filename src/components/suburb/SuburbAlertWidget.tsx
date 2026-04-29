"use client";

import { useState } from "react";
import { Bell, CheckCircle, Loader2 } from "lucide-react";
import { clarityEvent, clarityTag } from "@/lib/clarity";

interface Props {
  suburbName: string;
  suburbSlug: string;
}

export function SuburbAlertWidget({ suburbName, suburbSlug }: Props) {
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
          type: "suburb-alert",
          firstName,
          lastName,
          email,
          phone,
          suburb: suburbName,
          source: `suburb-page-${suburbSlug}`,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      clarityEvent("sign_up");
      clarityTag("signup_type", "suburb_alert");
      clarityTag("signup_suburb", suburbSlug);
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl bg-primary/5 border border-primary/20 p-8 text-center">
        <CheckCircle className="w-10 h-10 text-primary mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-900">You&apos;re on the list!</h3>
        <p className="text-sm text-gray-600 mt-1">
          We&apos;ll notify you when new properties hit the market in {suburbName}.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-primary/20 shadow-sm">
      {/* Header band */}
      <div className="bg-primary px-6 py-4 flex items-center gap-3">
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          <Bell className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-white font-bold text-base leading-tight">
            Get property alerts for {suburbName}
          </h3>
          <p className="text-white/75 text-xs mt-0.5">
            Be the first to know when new listings hit the market.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white px-6 py-5">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="alert-firstName" className="block text-xs font-medium text-gray-600 mb-1">
                First name <span className="text-red-500">*</span>
              </label>
              <input
                id="alert-firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jane"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="alert-lastName" className="block text-xs font-medium text-gray-600 mb-1">
                Last name <span className="text-red-500">*</span>
              </label>
              <input
                id="alert-lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Smith"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="alert-email" className="block text-xs font-medium text-gray-600 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="alert-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="alert-phone" className="block text-xs font-medium text-gray-600 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                id="alert-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="04XX XXX XXX"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
            </div>
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
              <Bell className="w-4 h-4" />
            )}
            {loading ? "Registering…" : "Get Property Alerts"}
          </button>

          <p className="text-xs text-gray-400 text-center leading-relaxed">
            No spam. Unsubscribe anytime. By submitting you agree to our{" "}
            <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
          </p>
        </form>
      </div>
    </div>
  );
}
