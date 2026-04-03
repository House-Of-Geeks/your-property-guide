"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Button, Input, Select } from "@/components/ui";
import { SUBURBS, PROPERTY_TYPES } from "@/lib/constants";
import { CheckCircle } from "lucide-react";
import { clarityEvent, clarityTag } from "@/lib/clarity";

const appraisalSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(8, "Valid phone number is required"),
  address: z.string().min(5, "Property address is required"),
  suburb: z.string().min(1, "Suburb is required"),
  propertyType: z.string().min(1, "Property type is required"),
  bedrooms: z.string().optional(),
  message: z.string().optional(),
});

type AppraisalFormData = z.infer<typeof appraisalSchema>;

export function AppraisalForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AppraisalFormData>({
    resolver: zodResolver(appraisalSchema),
  });

  const onSubmit = async (data: AppraisalFormData) => {
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          type: "appraisal-request",
          appraisalAddress: data.address,
          source: "website",
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      clarityEvent("request_quote");
      clarityTag("appraisal_suburb", data.suburb);
      clarityTag("appraisal_property_type", data.propertyType);
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900">Request Received!</h3>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          Thank you for your appraisal request. A local agent will contact you within 24 hours to arrange your free property appraisal.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="appraisal-firstName"
          label="First Name"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <Input
          id="appraisal-lastName"
          label="Last Name"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="appraisal-email"
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          id="appraisal-phone"
          label="Phone"
          type="tel"
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>
      <Input
        id="appraisal-address"
        label="Property Address"
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
          label="Property Type"
          options={PROPERTY_TYPES.map((t) => ({ value: t.value, label: t.label }))}
          placeholder="Select type"
          error={errors.propertyType?.message}
          {...register("propertyType")}
        />
        <Select
          id="appraisal-bedrooms"
          label="Bedrooms"
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
        <label htmlFor="appraisal-message" className="block text-sm font-medium text-gray-700 mb-1">
          Additional Information
        </label>
        <textarea
          id="appraisal-message"
          rows={3}
          placeholder="Any additional details about your property..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
          {...register("message")}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" variant="gradient" size="lg" className="w-full" isLoading={isSubmitting}>
        Request Free Appraisal
      </Button>
    </form>
  );
}
