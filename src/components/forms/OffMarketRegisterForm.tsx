"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Button, Input, Select } from "@/components/ui";
import { SUBURBS, PROPERTY_TYPES, PRICE_RANGES_BUY, BEDROOM_OPTIONS } from "@/lib/constants";
import { CheckCircle, Lock } from "lucide-react";
import { clarityEvent, clarityTag } from "@/lib/clarity";

const offMarketSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(8, "Valid phone number is required"),
  suburbs: z.string().min(1, "Select at least one suburb"),
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
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          type: "off-market-register",
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
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900">You&apos;re Registered!</h3>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          You&apos;ll receive exclusive off-market property alerts matching your criteria. Keep an eye on your inbox!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input id="offmarket-firstName" label="First Name" error={errors.firstName?.message} {...register("firstName")} />
        <Input id="offmarket-lastName" label="Last Name" error={errors.lastName?.message} {...register("lastName")} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input id="offmarket-email" label="Email" type="email" error={errors.email?.message} {...register("email")} />
        <Input id="offmarket-phone" label="Phone" type="tel" error={errors.phone?.message} {...register("phone")} />
      </div>
      <h4 className="font-medium text-gray-900 pt-2">What are you looking for?</h4>
      <Select
        id="offmarket-suburbs"
        label="Preferred Suburb"
        options={SUBURBS.map((s) => ({ value: s.slug, label: s.name }))}
        placeholder="Select suburb"
        error={errors.suburbs?.message}
        {...register("suburbs")}
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          id="offmarket-propertyType"
          label="Property Type"
          options={PROPERTY_TYPES.map((t) => ({ value: t.value, label: t.label }))}
          placeholder="Any"
          {...register("propertyType")}
        />
        <Select
          id="offmarket-minPrice"
          label="Min Budget"
          options={PRICE_RANGES_BUY.map((p) => ({ value: p.value, label: p.label }))}
          placeholder="No min"
          {...register("minPrice")}
        />
        <Select
          id="offmarket-maxPrice"
          label="Max Budget"
          options={PRICE_RANGES_BUY.map((p) => ({ value: p.value, label: p.label }))}
          placeholder="No max"
          {...register("maxPrice")}
        />
      </div>
      <Select
        id="offmarket-minBeds"
        label="Min Bedrooms"
        options={BEDROOM_OPTIONS.map((b) => ({ value: b.value, label: b.label }))}
        placeholder="Any"
        {...register("minBeds")}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" variant="gradient" size="lg" className="w-full" isLoading={isSubmitting}>
        <Lock className="w-4 h-4" />
        Register for Off-Market Alerts
      </Button>
    </form>
  );
}
