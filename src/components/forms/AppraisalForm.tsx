"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input, Select } from "@/components/ui";
import { PROPERTY_TYPES } from "@/lib/constants";
import { SuburbAutocomplete } from "@/components/search/SuburbAutocomplete";
import { AddressAutocomplete } from "@/components/forms/AddressAutocomplete";
import { clarityEvent, clarityTag } from "@/lib/clarity";
import { requiredPhoneSchema } from "@/lib/utils/phone";

// Free-appraisal request form. Visitor is on /appraisal explicitly asking
// for a valuation, so intent is implicit. Trimmed from the original 9
// fields to 6 (3 required, 3 optional but in-line) — lastName and message
// removed because they were friction with no measurable lead-quality lift;
// the agent can ask either in their follow-up call.
// Phone is required here: an appraisal only happens once an agent calls
// to arrange the walk-through, so a number IS the deliverable. The field
// copy says exactly that, which keeps the ask feeling fair.
const appraisalSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  email: z.string().email("Valid email is required"),
  phone: requiredPhoneSchema("Mobile is required so your agent can arrange the appraisal"),
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
    setValue,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AppraisalFormData>({
    resolver: zodResolver(appraisalSchema),
    defaultValues: {
      address: searchParams.get("address") ?? "",
      suburb: searchParams.get("suburb") ?? "",
    },
  });

  const addressValue = watch("address") ?? "";
  // Suburb filled from the chosen address; when set, the suburb search is
  // replaced by a one-line confirmation with a "Change" link.
  const [resolvedSuburb, setResolvedSuburb] = useState<{ slug: string; label: string } | null>(null);

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
          autoComplete="given-name"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <Input
          id="appraisal-email"
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <div>
        <Input
          id="appraisal-phone"
          label="Mobile"
          type="tel"
          placeholder="04XX XXX XXX"
          autoComplete="tel"
          inputMode="tel"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <p className="mt-1 text-[11px] text-ink-subtle leading-relaxed">
          Your agent calls this number once to arrange the appraisal — nothing else.
        </p>
      </div>

      {/* Street address via Google Places (AU only). Selecting a suggestion
          fills the suburb below; typing free text still works. */}
      <input type="hidden" {...register("address")} />
      <AddressAutocomplete
        id="appraisal-address"
        label="Property address"
        placeholder="Start typing, e.g. 15 Smith Street"
        required
        value={addressValue}
        onChange={(v) => {
          setValue("address", v, { shouldValidate: Boolean(errors.address) });
          if (resolvedSuburb) { setResolvedSuburb(null); setValue("suburb", "", { shouldValidate: false }); }
        }}
        onSelect={({ parsed, suburb }) => {
          if (suburb) {
            setValue("suburb", suburb.slug, { shouldValidate: true });
            clearErrors("suburb");
            setResolvedSuburb({ slug: suburb.slug, label: `${suburb.name}, ${suburb.state} ${suburb.postcode}` });
          } else {
            setResolvedSuburb(null);
            void parsed;
          }
        }}
        error={errors.address?.message}
        labelClassName="block text-sm font-medium text-ink-muted mb-1"
        inputClassName="w-full rounded-lg border border-line-strong px-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus:border-primary outline-none"
      />

      {/* Suburb: live autocomplete over every suburb in the database (the
          old <Select> listed the six prototype seed suburbs). The chosen
          slug is written into the registered hidden field so validation and
          the payload are unchanged. */}
      <div>
        <label htmlFor="appraisal-suburb" className="block text-xs font-medium text-ink-muted mb-1">
          Suburb
        </label>
        {resolvedSuburb ? (
          <p className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface-warm px-3 py-2.5 text-sm text-ink">
            <span>{resolvedSuburb.label}</span>
            <button
              type="button"
              onClick={() => { setResolvedSuburb(null); setValue("suburb", "", { shouldValidate: false }); }}
              className="text-xs text-ink-muted hover:text-ink underline underline-offset-4"
            >
              Change
            </button>
          </p>
        ) : (
          <SuburbAutocomplete
            defaultSlug={searchParams.get("suburb") ?? undefined}
            placeholder="Suburb or postcode, e.g. Bondi or 2026"
            onSelectLocation={(slug) => {
              setValue("suburb", slug, { shouldValidate: true });
              clearErrors("suburb");
            }}
            onClear={() => setValue("suburb", "", { shouldValidate: false })}
          />
        )}
        <input type="hidden" id="appraisal-suburb" {...register("suburb")} />
        {errors.suburb?.message && (
          <p className="mt-1.5 text-xs text-danger">{errors.suburb.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        Free, no commitment. Your details go only to the one vetted local agent we match you with, who pays us for the introduction. We never sell them to anyone else.{" "}
        <a href="/privacy" className="underline underline-offset-2 hover:text-ink">Privacy policy</a>.
      </p>
    </form>
  );
}
