"use client";

import { useState, useTransition } from "react";
import { updateListing } from "@/lib/actions/dashboard";
import type { Property as DbProperty, Agent as DbAgent } from "@/generated/prisma/client";

interface Props {
  property: DbProperty;
  agents: Pick<DbAgent, "id" | "fullName">[];
  isAdmin: boolean;
}

const PROPERTY_TYPES = ["house", "townhouse", "apartment", "unit", "land", "acreage", "villa"] as const;
const STATUSES = ["active", "under-contract", "sold", "off-market"] as const;

export function ListingEditForm({ property, agents, isAdmin }: Props) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateListing(property.id, formData);
      setResult(res as { success?: boolean; error?: string });
    });
  }

  const inputClass = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Listing status & type */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Listing Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Status</label>
            <select name="status" defaultValue={property.status} className={inputClass}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Property Type</label>
            <select name="propertyType" defaultValue={property.propertyType} className={inputClass}>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Title & price */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Price & Title</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Listing title</label>
            <input name="title" type="text" defaultValue={property.title} required className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Price display</label>
              <input name="priceDisplay" type="text" defaultValue={property.priceDisplay} required placeholder="$849,000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Price value (numeric)</label>
              <input name="priceValue" type="number" defaultValue={property.priceValue ?? ""} placeholder="849000" className={inputClass} />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Features</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Bedrooms</label>
            <input name="bedrooms" type="number" min="0" defaultValue={property.bedrooms} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Bathrooms</label>
            <input name="bathrooms" type="number" min="0" defaultValue={property.bathrooms} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Car spaces</label>
            <input name="carSpaces" type="number" min="0" defaultValue={property.carSpaces} required className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className={labelClass}>Land size (m²) <span className="text-gray-400 font-normal">optional</span></label>
            <input name="landSize" type="number" min="0" defaultValue={property.landSize ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Building size (m²) <span className="text-gray-400 font-normal">optional</span></label>
            <input name="buildingSize" type="number" min="0" defaultValue={property.buildingSize ?? ""} className={inputClass} />
          </div>
        </div>
      </section>

      {/* Description */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Description</h2>
        <textarea
          name="description"
          defaultValue={property.description}
          rows={8}
          className={`${inputClass} resize-y`}
        />
      </section>

      {/* Inspection times */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Inspection Times</h2>
        <textarea
          name="inspectionTimes"
          defaultValue={property.inspectionTimes.join("\n")}
          rows={4}
          placeholder={"Saturday 10:00am – 10:30am\nSunday 11:00am – 11:30am"}
          className={`${inputClass} resize-y`}
        />
        <p className="text-xs text-gray-400 mt-1">One inspection time per line.</p>
      </section>

      {/* Co-agent & featured */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Agent Settings</h2>
        <div className={isAdmin ? "grid grid-cols-2 gap-4 items-end" : ""}>
          <div>
            <label className={labelClass}>Co-agent <span className="text-gray-400 font-normal">optional</span></label>
            <select name="coAgentId" defaultValue={property.coAgentId ?? ""} className={inputClass}>
              <option value="">— No co-agent —</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.fullName}</option>
              ))}
            </select>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-2 pb-2">
              <input
                id="isFeatured"
                name="isFeatured"
                type="checkbox"
                defaultChecked={property.isFeatured}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">Featured listing</label>
            </div>
          )}
        </div>
      </section>

      {result?.error && <p className="text-sm text-red-500">{result.error}</p>}
      {result?.success && <p className="text-sm text-green-600">Listing saved successfully.</p>}

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
