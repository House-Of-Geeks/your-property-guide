"use client";

import { useState, useTransition } from "react";
import { updateAgencyProfile } from "@/lib/actions/dashboard";
import type { Agency } from "@/types";

export function AgencyForm({ agency }: { agency: Agency }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateAgencyProfile(formData);
      setResult(res);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Details */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Agency Details</h2>
        <Field label="Agency name" name="name" defaultValue={agency.name} required />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Field label="Phone" name="phone" defaultValue={agency.phone} required type="tel" />
          <Field label="Email" name="email" defaultValue={agency.email} required type="email" />
        </div>
        <div className="mt-4">
          <Field label="Website" name="website" defaultValue={agency.website} type="url" placeholder="https://..." />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">About / Description</label>
          <textarea
            name="description"
            defaultValue={agency.description}
            rows={8}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y"
          />
        </div>
      </section>

      {/* Social links */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Social Media</h2>
        <div className="space-y-4">
          <Field label="Facebook URL"  name="facebookUrl"  defaultValue={agency.facebookUrl  ?? ""} type="url" placeholder="https://facebook.com/..." />
          <Field label="Instagram URL" name="instagramUrl" defaultValue={agency.instagramUrl ?? ""} type="url" placeholder="https://instagram.com/..." />
          <Field label="LinkedIn URL"  name="linkedinUrl"  defaultValue={agency.linkedinUrl  ?? ""} type="url" placeholder="https://linkedin.com/company/..." />
          <Field label="YouTube URL"   name="youtubeUrl"   defaultValue={agency.youtubeUrl   ?? ""} type="url" placeholder="https://youtube.com/..." />
        </div>
      </section>

      {/* SEO */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">SEO Metadata</h2>
        <div className="space-y-4">
          <Field
            label="Meta title"
            name="metaTitle"
            defaultValue={agency.metaTitle ?? ""}
            placeholder={`${agency.name} | Real Estate Agency`}
            maxLength={70}
            hint="Max 70 characters. Leave blank to use the default."
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta description <span className="text-gray-400 font-normal">(max 160 chars)</span></label>
            <textarea
              name="metaDescription"
              defaultValue={agency.metaDescription ?? ""}
              maxLength={160}
              rows={3}
              placeholder={`${agency.name} is a real estate agency based in ${agency.address.suburb}, ${agency.address.state}.`}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">Leave blank to auto-generate from your description.</p>
          </div>
          <Field
            label="OG image URL"
            name="ogImage"
            defaultValue={agency.ogImage ?? ""}
            placeholder="https://..."
            hint="Used for social media previews. Leave blank to use your logo."
          />
        </div>
      </section>

      {result?.error && <p className="text-sm text-red-500">{result.error}</p>}
      {result?.success && <p className="text-sm text-green-600">Agency profile saved successfully.</p>}

      <button
        type="submit"
        disabled={isPending}
        className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

function Field({
  label, name, defaultValue, required, type = "text", placeholder, maxLength, hint,
}: {
  label: string; name: string; defaultValue?: string; required?: boolean;
  type?: string; placeholder?: string; maxLength?: number; hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}
