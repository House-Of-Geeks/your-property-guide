"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Input, Select } from "@/components/ui";
import { SUBURBS, PROPERTY_TYPES } from "@/lib/constants";
import { CheckCircle } from "lucide-react";
import { clarityEvent, clarityTag } from "@/lib/clarity";

// Free-appraisal request form. The user is on /appraisal explicitly asking
// for a property valuation, so intent is implicit. The address is the only
// extra-required field beyond contact info, we genuinely need it to deliver
// the appraisal. Everything else is optional and labelled as such.
const appraisalSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  address: z.string().min(5, "Property address is required"),
  suburb: z.string().min(1, "Suburb is required"),
  propertyType: z.string().optional(),
  bedrooms: z.string().optional(),
  message: z.string().optional(),
});

type AppraisalFormData = z.infer<typeof appraisalSchema>;

export function AppraisalForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AppraisalFormData>({
    resolver: zodResolver(appraisalSchema),
    defaultValues: {
      address: searchParams.get("address") ?? "",
      suburb: searchParams.get("suburb") ?? "",
    },
  });

  const onSubmit = async (data: AppraisalFormData) => {
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "appraisal-request",
          firstName: data.firstName.trim(),
          lastName: data.lastName?.trim() || undefined,
          email: data.email.trim(),
          phone: data.phone?.trim() || undefined,
          address: data.address.trim(),
          appraisalAddress: data.address.trim(),
          suburb: data.suburb,
          propertyType: data.propertyType || undefined,
          bedrooms: data.bedrooms || undefined,
          message: data.message?.trim() || undefined,
          source: "website",
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      clarityEvent("request_quote");
      clarityTag("appraisal_suburb", data.suburb);
      if (data.propertyType) clarityTag("appraisal_property_type", data.propertyType);
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 rounded-full bg-cta text-white grid place-items-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7" />
        </div>
        <h3 className="font-display text-2xl text-ink leading-tight">Request received.</h3>
        <p className="text-ink-muted mt-3 max-w-md mx-auto leading-relaxed">
          A local agent will be in touch within one business day to arrange your free appraisal.
          No commitment until you decide to take it further.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="appraisal-firstName"
        label="First name"
        error={errors.firstName?.message}
        {...register("firstName")}
      />
      <Input
        id="appraisal-email"
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        id="appraisal-phone"
        label="Mobile (optional)"
        type="tel"
        placeholder="04XX XXX XXX"
        {...register("phone")}
      />
      <Input
        id="appraisal-lastName"
        label="Last name (optional)"
        {...register("lastName")}
      />

      <div className="pt-2 border-t border-line">
        <p className="text-xs uppercase tracking-wider text-ink-subtle mb-3 mt-4">About the property</p>
        <Input
          id="appraisal-address"
          label="Property address"
          placeholder="e.g. 15 Smith Street"
          error={errors.address?.message}
          {...register("address")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          id="appraisal-suburb"
          label="Suburb"
          options={SUBURBS.map((s) => ({ value: s.slug, label: s.name }))}
          placeholder="Select suburb"
          error={errors.suburb?.message}
          {...register("suburb")}
        />
        <Select
          id="appraisal-propertyType"
          label="Type (optional)"
          options={PROPERTY_TYPES.map((t) => ({ value: t.value, label: t.label }))}
          placeholder="Type"
          {...register("propertyType")}
        />
        <Select
          id="appraisal-bedrooms"
          label="Bedrooms (optional)"
          options={[
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
            { value: "5+", label: "5+" },
          ]}
          placeholder="Beds"
          {...register("bedrooms")}
        />
      </div>

      <div>
        <label htmlFor="appraisal-message" className="block text-sm font-medium text-ink-muted mb-1">
          Anything else? (optional)
        </label>
        <textarea
          id="appraisal-message"
          rows={3}
          placeholder="Renovations, timing, things the agent should know..."
          className="w-full rounded-lg border border-line-strong bg-surface-raised px-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
          {...register("message")}
        />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3.5 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting ? "Sending…" : "Request free appraisal"}
      </button>
      <p className="text-[11px] text-ink-subtle leading-relaxed pt-1">
        Free, no commitment. We&rsquo;ll never sell your details. Read our{" "}
        <a href="/privacy" className="underline underline-offset-2 hover:text-ink">privacy policy</a>.
      </p>
    </form>
  );
}
