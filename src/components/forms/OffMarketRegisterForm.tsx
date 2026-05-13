"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Input, Select } from "@/components/ui";
import { SUBURBS, PROPERTY_TYPES, PRICE_RANGES_BUY, BEDROOM_OPTIONS } from "@/lib/constants";
import { CheckCircle, Lock } from "lucide-react";
import { clarityEvent, clarityTag } from "@/lib/clarity";

// Off-market alert signup. The user's already on /off-market explicitly
// asking for alerts, so we keep the criteria fields but trim required
// contact info to firstName + email + suburb. Last name and phone are
// optional, alerts are email-driven.
const offMarketSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  suburbs: z.string().min(1, "Pick at least one suburb"),
  propertyType: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  minBeds: z.string().optional(),
});

type OffMarketFormData = z.infer<typeof offMarketSchema>;

export function OffMarketRegisterForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OffMarketFormData>({
    resolver: zodResolver(offMarketSchema),
  });

  const onSubmit = async (data: OffMarketFormData) => {
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.firstName.trim(),
          lastName: data.lastName?.trim() || undefined,
          email: data.email.trim(),
          phone: data.phone?.trim() || undefined,
          type: "off-market-register",
          suburb: data.suburbs,
          buyingCriteria: {
            suburbs: [data.suburbs],
            propertyTypes: data.propertyType ? [data.propertyType] : undefined,
            minPrice: data.minPrice ? Number(data.minPrice) : undefined,
            maxPrice: data.maxPrice ? Number(data.maxPrice) : undefined,
            minBeds: data.minBeds ? Number(data.minBeds) : undefined,
          },
          source: "website",
        }),
      });
      if (!res.ok) throw new Error("Failed to register");
      clarityEvent("sign_up");
      clarityTag("signup_type", "off_market_alert");
      clarityTag("signup_suburb", data.suburbs);
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
        <h3 className="font-display text-2xl text-ink leading-tight">You&rsquo;re registered.</h3>
        <p className="text-ink-muted mt-3 max-w-md mx-auto leading-relaxed">
          We&rsquo;ll email you off-market properties matching your criteria as they come in.
          One email per match, no roundup spam. Unsubscribe anytime.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="offmarket-firstName"
        label="First name"
        error={errors.firstName?.message}
        {...register("firstName")}
      />
      <Input
        id="offmarket-email"
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        id="offmarket-phone"
        label="Mobile (optional)"
        type="tel"
        placeholder="04XX XXX XXX"
        {...register("phone")}
      />
      <Input
        id="offmarket-lastName"
        label="Last name (optional)"
        {...register("lastName")}
      />

      <div className="pt-2 border-t border-line">
        <p className="text-xs uppercase tracking-wider text-ink-subtle mb-3 mt-4">What are you looking for?</p>
        <Select
          id="offmarket-suburbs"
          label="Preferred suburb"
          options={SUBURBS.map((s) => ({ value: s.slug, label: s.name }))}
          placeholder="Select suburb"
          error={errors.suburbs?.message}
          {...register("suburbs")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          id="offmarket-propertyType"
          label="Type (optional)"
          options={PROPERTY_TYPES.map((t) => ({ value: t.value, label: t.label }))}
          placeholder="Any"
          {...register("propertyType")}
        />
        <Select
          id="offmarket-minPrice"
          label="Min budget (optional)"
          options={PRICE_RANGES_BUY.map((p) => ({ value: p.value, label: p.label }))}
          placeholder="No min"
          {...register("minPrice")}
        />
        <Select
          id="offmarket-maxPrice"
          label="Max budget (optional)"
          options={PRICE_RANGES_BUY.map((p) => ({ value: p.value, label: p.label }))}
          placeholder="No max"
          {...register("maxPrice")}
        />
      </div>
      <Select
        id="offmarket-minBeds"
        label="Min bedrooms (optional)"
        options={BEDROOM_OPTIONS.map((b) => ({ value: b.value, label: b.label }))}
        placeholder="Any"
        {...register("minBeds")}
      />

      {error && <p className="text-sm text-danger">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3.5 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting ? "Registering…" : (
          <>
            <Lock className="w-4 h-4" />
            Register for off-market alerts
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
