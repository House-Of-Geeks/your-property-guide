"use client";

import { useEffect, useRef, useState } from "react";
import { X, User, Mail, Phone, MessageSquare, Loader2, CheckCircle2 } from "lucide-react";
import { clarityEvent, clarityTag } from "@/lib/clarity";

const ENQUIRY_TYPES = [
  "Inspection times",
  "Rates and fees",
  "Property size",
  "Price guide",
] as const;
export type EnquiryType = (typeof ENQUIRY_TYPES)[number];

interface PropertyEnquireModalProps {
  propertyId: string;
  agentId: string;
  agencyId: string;
  propertyAddress: string;
  agentFirstName: string;
}

interface DialogProps extends PropertyEnquireModalProps {
  open: boolean;
  onClose: () => void;
  initialSelected?: readonly EnquiryType[];
}

/**
 * The modal dialog itself, with form state. Exported so callers (e.g. the
 * sidebar info-rows) can drive `open` + `initialSelected` from outside.
 */
export function PropertyEnquireDialog({
  open,
  onClose,
  initialSelected,
  propertyId,
  agentId,
  agencyId,
  propertyAddress,
  agentFirstName,
}: DialogProps) {
  const [selected, setSelected] = useState<EnquiryType[]>(initialSelected ? [...initialSelected] : []);
  const [message, setMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const successRef = useRef<HTMLDivElement | null>(null);

  // Re-sync the initial selection each time the dialog opens. Without this,
  // closing the modal and opening it again from a different info-row would
  // keep the old selection.
  useEffect(() => {
    if (open) setSelected(initialSelected ? [...initialSelected] : []);
  }, [open, initialSelected]);

  // When the success state appears, scroll it into view so the user can't
  // miss it. The Craig-Darr-5×-in-66-seconds pattern was almost certainly
  // someone not realising their submission went through.
  useEffect(() => {
    if (submitted) successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [submitted]);

  const toggle = (t: EnquiryType) =>
    setSelected((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || submitted) return; // double-submit guard
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName, lastName, email, phone,
          type: "property-enquiry",
          message: [
            selected.length ? `Enquiring about: ${selected.join(", ")}` : "",
            message,
          ].filter(Boolean).join("\n\n"),
          propertyId, agentId, agencyId,
          source: "property-enquire-modal",
        }),
      });
      if (!res.ok) throw new Error("Failed");
      clarityEvent("contact_us");
      clarityTag("enquiry_type", "property_enquiry");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again, or call the agent directly.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div ref={successRef} className="p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Enquiry sent</h2>
            <p className="text-gray-600 text-sm max-w-sm mx-auto">
              {agentFirstName} will be in touch shortly, usually within one
              business day. Check your inbox for a confirmation.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ask about this property</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Left: enquiry types + message */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                    My Enquiries
                  </p>
                  <div className="space-y-2.5">
                    {ENQUIRY_TYPES.map((t) => (
                      <label key={t} className="flex items-center gap-3 cursor-pointer group">
                        <span className={`w-5 h-5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors ${
                          selected.includes(t)
                            ? "border-primary bg-primary"
                            : "border-gray-300 group-hover:border-gray-400"
                        }`}>
                          {selected.includes(t) && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={selected.includes(t)}
                          onChange={() => toggle(t)}
                        />
                        <span className="text-sm text-gray-700">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Message
                  </p>
                  <div className="relative">
                    <MessageSquare className="absolute top-3 left-3 w-4 h-4 text-gray-400" />
                    <textarea
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="What can we help you with?"
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Right: contact details */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  My Contact Details
                </p>
                {([
                  { icon: <User className="w-4 h-4" />, placeholder: "First name *", value: firstName, onChange: setFirstName, required: true },
                  { icon: <User className="w-4 h-4" />, placeholder: "Last name *", value: lastName, onChange: setLastName, required: true },
                  { icon: <Mail className="w-4 h-4" />, placeholder: "Email *", type: "email", value: email, onChange: setEmail, required: true },
                  { icon: <Phone className="w-4 h-4" />, placeholder: "Phone (optional)", type: "tel", value: phone, onChange: setPhone },
                ] as Array<{ icon: React.ReactNode; placeholder: string; type?: string; value: string; onChange: (v: string) => void; required?: boolean }>).map((f) => (
                  <div key={f.placeholder} className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{f.icon}</span>
                    <input
                      type={f.type ?? "text"}
                      placeholder={f.placeholder}
                      value={f.value}
                      onChange={(e) => f.onChange(e.target.value)}
                      required={f.required}
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                    />
                  </div>
                ))}

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2 inline-flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending your enquiry…
                    </>
                  ) : (
                    "Send enquiry"
                  )}
                </button>
              </div>
            </div>

            {/* Footer */}
            <p className="mt-6 text-xs text-gray-400 leading-relaxed">
              By submitting your enquiry, you agree to our{" "}
              <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>.
              Your online safety is important to us.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

/**
 * The "Enquire" trigger button + dialog, owned together. Use this when you
 * just want the default button-opens-modal flow. For driving open state from
 * elsewhere (e.g. the sidebar info-rows opening pre-checked), use
 * `PropertyEnquireDialog` directly.
 */
export function PropertyEnquireModal(props: PropertyEnquireModalProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
      >
        <Mail className="w-4 h-4" />
        Enquire
      </button>
      <PropertyEnquireDialog {...props} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
