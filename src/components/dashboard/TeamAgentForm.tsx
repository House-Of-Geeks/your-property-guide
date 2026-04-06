"use client";

import { useState, useTransition } from "react";
import { updateTeamAgent } from "@/lib/actions/dashboard";
import type { Agent as DbAgent } from "@/generated/prisma/client";

interface Props {
  agent: DbAgent;
}

export function TeamAgentForm({ agent }: Props) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateTeamAgent(agent.id, formData);
      setResult(res as { success?: boolean; error?: string });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Personal */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Personal Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="First name" name="firstName" defaultValue={agent.firstName} required />
          <Field label="Last name"  name="lastName"  defaultValue={agent.lastName}  required />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Field label="Job title" name="title" defaultValue={agent.title} required />
          <Field label="Phone"     name="phone" defaultValue={agent.phone} required type="tel" />
        </div>
        <div className="mt-4">
          <Field
            label="Years experience"
            name="yearsExperience"
            defaultValue={String(agent.yearsExperience)}
            required
            type="number"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Specialties <span className="text-gray-400 font-normal">(comma-separated)</span>
          </label>
          <input
            name="specialties"
            defaultValue={agent.specialties.join(", ")}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </section>

      {/* Bio */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Bio</h2>
        <textarea
          name="bio"
          defaultValue={agent.bio}
          rows={6}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y"
        />
        <p className="text-xs text-gray-400 mt-1">Shown on the agent&apos;s public profile.</p>
      </section>

      {/* Profile image */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Profile Photo</h2>
        <Field
          label="Image alt text"
          name="imageAlt"
          defaultValue={agent.imageAlt ?? `${agent.fullName} - ${agent.title}`}
          placeholder={`${agent.fullName} - ${agent.title}, real estate agent`}
        />
        <p className="text-xs text-gray-400 mt-1">Descriptive alt text improves accessibility and Google Image SEO.</p>
      </section>

      {/* SEO */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">SEO Metadata</h2>
        <div className="space-y-4">
          <Field
            label="Meta title"
            name="metaTitle"
            defaultValue={agent.metaTitle ?? ""}
            placeholder={`${agent.fullName} – Real Estate Agent | Your Property Guide`}
            maxLength={70}
            hint="Max 70 characters. Leave blank to use the default."
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta description <span className="text-gray-400 font-normal">(max 160 chars)</span>
            </label>
            <textarea
              name="metaDescription"
              defaultValue={agent.metaDescription ?? ""}
              maxLength={160}
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">Leave blank to auto-generate from bio.</p>
          </div>
          <Field
            label="OG image URL"
            name="ogImage"
            defaultValue={agent.ogImage ?? ""}
            placeholder="https://..."
            hint="Used for social media previews. Leave blank to use the profile photo."
          />
        </div>
      </section>

      {result?.error && <p className="text-sm text-red-500">{result.error}</p>}
      {result?.success && <p className="text-sm text-green-600">Profile saved successfully.</p>}

      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
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
