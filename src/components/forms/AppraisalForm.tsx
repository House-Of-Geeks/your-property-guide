"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input, Select } from "@/components/ui";
import { SUBURBS, PROPERTY_TYPES } from "@/lib/constants";
import { clarityEvent, clarityTag } from "@/lib/clarity";

// Free-appraisal request form. Visitor is on /appraisal explicitly asking
// for a valuation, so intent is implicit. Trimmed from the original 9
// fields to 6 (3 required, 3 optional but in-line) — lastName and message
// removed because they were friction with no measurable lead-quality lift;
// the agent can ask either in their follow-up call.
const appraisalSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  address: z.string().min(5, "Property address is required"),
  suburb: z.string().min(1, "Suburb is required"),
  propertyType: z.string().optional(),
  bedrooms: z.string().optional(),
  // Honeypot — must remain empty. Real users never see this field.
  website: z.string().optional(),
});

type AppraisalFormData = z.infer<typeof appraisalSchema>;

export function AppraisalForm() {
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Fires on first interaction with any field. Lets us separate "people who
  // saw the form" (Clarity page view) from "people who engaged with it"
  // (form_start) in the funnel — the gap between the two reveals friction.
  const markStart = () => {
    if (hasStarted) return;
    setHasStarted(true);
    clarityEvent("form_start");
    clarityTag("form_name", "appraisal");
  };

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
          email: data.email.trim(),
          phone: data.phone?.trim() || undefined,
          address: data.address.trim(),
          appraisalAddress: data.address.trim(),
          suburb: data.suburb,
          propertyType: data.propertyType || undefined,
          bedrooms: data.bedrooms || undefined,
          website: data.website ?? "",
          source: "website",
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      clarityEvent("request_quote");
      clarityTag("appraisal_suburb", data.suburb);
      if (data.propertyType) clarityTag("appraisal_property_type", data.propertyType);
      // Hand off to the thank-you page. The ConversionTracker there fires
      // the canonical `lead_conversion` event so this funnel is measurable
      // separately from the request_quote event we just fired.
      const params = new URLSearchParams({ suburb: data.suburb });
      router.push(`/appraisal/thanks?${params.toString()}`);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} onFocus={markStart} className="space-y-4">
      {/* Honeypot: visually hidden, off-screen, aria-hidden. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }}>
        <label htmlFor="appraisal-website">Website</label>
        <input id="appraisal-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </div>

      <Input
        id="appraisal-phone"
        label="Mobile (optional)"
        type="tel"
        placeholder="04XX XXX XXX"
        {...register("phone")}
      />

      <Input
        id="appraisal-address"
        label="Property address"
        placeholder="e.g. 15 Smith Street"
        error={errors.address?.message}
        {...register("address")}
      />

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
          label="Type"
          options={PROPERTY_TYPES.map((t) => ({ value: t.value, label: t.label }))}
          placeholder="Any"
          {...register("propertyType")}
        />
        <Select
          id="appraisal-bedrooms"
          label="Beds"
          options={[
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
            { value: "5+", label: "5+" },
          ]}
          placeholder="Any"
          {...register("bedrooms")}
        />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-ink font-semibold px-6 py-3.5 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting ? "Sending…" : "Get my free appraisal"}
        {!isSubmitting && <span aria-hidden="true">→</span>}
      </button>
      <p className="text-[11px] text-ink-subtle leading-relaxed pt-1">
        Free, no commitment. One vetted local agent. We&rsquo;ll never sell your details.{" "}
        <a href="/privacy" className="underline underline-offset-2 hover:text-ink">Privacy policy</a>.
      </p>
    </form>
  );
}
