"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Input } from "@/components/ui";
import { CheckCircle, Send } from "lucide-react";
import { clarityEvent, clarityTag } from "@/lib/clarity";

// Property-page enquiry form. Required fields kept to the minimum that's
// genuinely needed to follow up: a name and an email. Phone and last name
// are optional, leads with just an email still close. The user is already
// on a specific property page, so "what are you working on" doesn't apply
// here; intent is implicit.
const enquirySchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  message: z.string().optional(),
  // Honeypot — must remain empty. Real users never see this field.
  website: z.string().optional(),
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

interface EnquiryFormProps {
  propertyId?: string;
  agentId?: string;
  agencyId?: string;
  type?: string;
  defaultMessage?: string;
}

export function EnquiryForm({
  propertyId,
  agentId,
  agencyId,
  type = "property-enquiry",
  defaultMessage,
}: EnquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { message: defaultMessage || "" },
  });

  const onSubmit = async (data: EnquiryFormData) => {
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          firstName: data.firstName.trim(),
          lastName: data.lastName?.trim() || undefined,
          email: data.email.trim(),
          phone: data.phone?.trim() || undefined,
          message: data.message?.trim() || undefined,
          propertyId,
          agentId,
          agencyId,
          website: data.website ?? "",
          source: "website",
        }),
      });
      if (!res.ok) throw new Error("Failed to send enquiry");
      clarityEvent("contact_us");
      clarityTag("enquiry_type", type);
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 rounded-full bg-cta text-white grid place-items-center mx-auto mb-4">
          <CheckCircle className="w-6 h-6" />
        </div>
        <h3 className="font-display text-xl text-ink leading-tight">Enquiry sent.</h3>
        <p className="text-sm text-ink-muted mt-2 leading-relaxed max-w-sm mx-auto">
          Look for a confirmation in your inbox. We&rsquo;ll connect you with the listing agent
          within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Honeypot: visually hidden, off-screen, aria-hidden. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }}>
        <label htmlFor="enquiry-website">Website</label>
        <input id="enquiry-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>
      <Input
        id="enquiry-firstName"
        label="First name"
        placeholder="John"
        error={errors.firstName?.message}
        {...register("firstName")}
      />
      <Input
        id="enquiry-email"
        label="Email"
        type="email"
        placeholder="john@example.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        id="enquiry-phone"
        label="Mobile (optional)"
        type="tel"
        placeholder="04XX XXX XXX"
        {...register("phone")}
      />
      <Input
        id="enquiry-lastName"
        label="Last name (optional)"
        placeholder="Smith"
        {...register("lastName")}
      />
      <div>
        <label htmlFor="enquiry-message" className="block text-sm font-medium text-ink-muted mb-1">
          Message (optional)
        </label>
        <textarea
          id="enquiry-message"
          rows={3}
          placeholder="Tell the agent what you'd like to know about this property..."
          className="w-full rounded-lg border border-line-strong bg-surface-raised px-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
          {...register("message")}
        />
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting ? "Sending…" : (
          <>
            <Send className="w-4 h-4" />
            Send enquiry
          </>
        )}
      </button>
      <p className="text-[11px] text-ink-subtle leading-relaxed pt-1">
        Free, no commitment. We&rsquo;ll never sell your details. Read our{" "}
        <a href="/privacy" className="underline underline-offset-2 hover:text-ink">privacy policy</a>.
      </p>
    </form>
  );
}
