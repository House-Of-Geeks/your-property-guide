"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui";
import { CheckCircle, Send } from "lucide-react";
import { clarityEvent, clarityTag } from "@/lib/clarity";
import { optionalPhoneSchema, requiredPhoneSchema } from "@/lib/utils/phone";
import { PhoneFollowUp } from "./PhoneFollowUp";

// Property-page enquiry form. Required fields kept to the minimum that's
// genuinely needed to follow up: a name, an email — and for property
// enquiries a mobile, because those leads go straight to a listing agent
// whose next step is a call (REA and Domain both require phone on their
// enquiry forms, so buyers expect the ask). General contact stays
// email-only; a post-submit follow-up harvests the phone instead so the
// extra field never costs the conversion.
const makeEnquirySchema = (requirePhone: boolean) =>
  z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().optional(),
    email: z.string().email("Valid email is required"),
    phone: requirePhone
      ? requiredPhoneSchema("Mobile is required so the agent can reach you")
      : optionalPhoneSchema,
    message: z.string().optional(),
    // Honeypot — must remain empty. Real users never see this field.
    website: z.string().optional(),
  });

type EnquiryFormData = z.infer<ReturnType<typeof makeEnquirySchema>>;

interface EnquiryFormProps {
  propertyId?: string;
  agentId?: string;
  agencyId?: string;
  /** Must be a value the /api/leads zod enum accepts. */
  type?: string;
  /** Lead attribution, persisted and shown in the admin email. Callers that
   *  collapse several UI topics into one API type (the agent profile page)
   *  keep the chosen topic here. */
  source?: string;
  /** Override the phone requirement where the API type doesn't tell the
   *  whole story — the agent profile page maps call-bound topics (leasing,
   *  buying, renting) onto "general-contact", which would otherwise make
   *  phone optional for leads whose next step is an agent call. */
  requirePhone?: boolean;
  defaultMessage?: string;
}

export function EnquiryForm({
  propertyId,
  agentId,
  agencyId,
  type = "property-enquiry",
  source = "website",
  requirePhone: requirePhoneProp,
  defaultMessage,
}: EnquiryFormProps) {
  // General contact is the one enquiry flavour where demanding a phone
  // feels off (people often just want an email answer). Everything else
  // is an agent-bound lead where the next step is a call.
  const requirePhone = requirePhoneProp ?? type !== "general-contact";
  const [submitted, setSubmitted] = useState<{ leadId: string | null; hadPhone: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resolver = useMemo(() => zodResolver(makeEnquirySchema(requirePhone)), [requirePhone]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormData>({
    resolver,
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
          source,
        }),
      });
      if (!res.ok) throw new Error("Failed to send enquiry");
      const bodyJson: { id?: string } | null = await res.json().catch(() => null);
      clarityEvent("contact_us");
      clarityTag("enquiry_type", type);
      setSubmitted({ leadId: bodyJson?.id ?? null, hadPhone: Boolean(data.phone?.trim()) });
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
        {!submitted.hadPhone && submitted.leadId && (
          <div className="mt-6 max-w-sm mx-auto text-left">
            <PhoneFollowUp
              leadId={submitted.leadId}
              source={`enquiry-${type}`}
              prompt="Want a faster answer? Add your mobile and we’ll call instead of emailing."
            />
          </div>
        )}
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
        autoComplete="given-name"
        error={errors.firstName?.message}
        {...register("firstName")}
      />
      <Input
        id="enquiry-email"
        label="Email"
        type="email"
        placeholder="john@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        id="enquiry-phone"
        label={requirePhone ? "Mobile" : "Mobile (optional)"}
        type="tel"
        placeholder="04XX XXX XXX"
        autoComplete="tel"
        inputMode="tel"
        error={errors.phone?.message}
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
