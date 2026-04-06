"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createListing } from "@/lib/actions/dashboard";
import type { Agent as DbAgent } from "@/generated/prisma/client";

interface Props {
  agents: Pick<DbAgent, "id" | "fullName">[];
  agencyId: string;
  currentAgentId: string;
}

const PROPERTY_TYPES = ["house", "townhouse", "apartment", "unit", "land", "acreage", "villa"] as const;
const STATUSES = ["active", "under-contract", "sold", "off-market"] as const;
const LISTING_TYPES = [
  { value: "buy", label: "For Sale" },
  { value: "rent", label: "For Rent" },
] as const;

function toKebab(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function ListingCreateForm({ agents, agencyId, currentAgentId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success?: boolean; error?: string; slug?: string } | null>(null);

  // Live slug preview
  const [street, setStreet] = useState("");
  const [suburb, setSuburb] = useState("");
  const [state, setState] = useState("QLD");
  const [postcode, setPostcode] = useState("");

  const slugPreview = street || suburb
    ? toKebab(`${street} ${suburb} ${state} ${postcode}`)
    : "";
  const suburbSlugPreview = suburb
    ? toKebab(`${suburb} ${state} ${postcode}`)
    : "";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createListing(formData);
      const r = res as { success?: boolean; error?: string; slug?: string };
      setResult(r);
      if (r.success) {
        router.push("/dashboard/listings");
      }
    });
  }

  const inputClass = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Listing type + agent */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Listing Setup</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Listing type</label>
            <select name="listingType" className={inputClass}>
              {LISTING_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Agent</label>
            <select name="agentId" defaultValue={currentAgentId} className={inputClass}>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.fullName}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Address */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Address</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Street address</label>
            <input
              name="addressStreet"
              type="text"
              required
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="1 Example Street"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className={labelClass}>Suburb</label>
              <input
                name="addressSuburb"
                type="text"
                required
                value={suburb}
                onChange={(e) => setSuburb(e.target.value)}
                placeholder="North Lakes"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>State</label>
              <select
                name="addressState"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className={inputClass}
              >
                {["QLD","NSW","VIC","WA","SA","TAS","ACT","NT"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Postcode</label>
              <input
                name="addressPostcode"
                type="text"
                required
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                maxLength={4}
                placeholder="4509"
                className={inputClass}
              />
            </div>
          </div>
          {slugPreview && (
            <div className="text-xs text-gray-400 space-y-0.5">
              <p>Listing slug: <span className="font-mono text-gray-500">{slugPreview}-…</span></p>
              <p>Suburb slug: <span className="font-mono text-gray-500">{suburbSlugPreview}</span></p>
            </div>
          )}
        </div>
      </section>

      {/* Status & type */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Property Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Status</label>
            <select name="status" defaultValue="active" className={inputClass}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Property type</label>
            <select name="propertyType" className={inputClass}>
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
            <input name="title" type="text" required placeholder="Stunning family home in the heart of North Lakes" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Price display</label>
              <input name="priceDisplay" type="text" required placeholder="$849,000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Price value (numeric)</label>
              <input name="priceValue" type="number" placeholder="849000" className={inputClass} />
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
            <input name="bedrooms" type="number" min="0" defaultValue="4" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Bathrooms</label>
            <input name="bathrooms" type="number" min="0" defaultValue="2" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Car spaces</label>
            <input name="carSpaces" type="number" min="0" defaultValue="2" required className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className={labelClass}>Land size (m²) <span className="text-gray-400 font-normal">optional</span></label>
            <input name="landSize" type="number" min="0" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Building size (m²) <span className="text-gray-400 font-normal">optional</span></label>
            <input name="buildingSize" type="number" min="0" className={inputClass} />
          </div>
        </div>
      </section>

      {/* Description */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Description</h2>
        <textarea name="description" rows={8} className={`${inputClass} resize-y`} />
      </section>

      {/* Inspection times */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Inspection Times</h2>
        <textarea
          name="inspectionTimes"
          rows={4}
          placeholder={"Saturday 10:00am – 10:30am\nSunday 11:00am – 11:30am"}
          className={`${inputClass} resize-y`}
        />
        <p className="text-xs text-gray-400 mt-1">One inspection time per line.</p>
      </section>

      {/* Co-agent & featured */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Agent Settings</h2>
        <div className="grid grid-cols-2 gap-4 items-end">
          <div>
            <label className={labelClass}>Co-agent <span className="text-gray-400 font-normal">optional</span></label>
            <select name="coAgentId" className={inputClass}>
              <option value="">— No co-agent —</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.fullName}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 pb-2">
            <input
              id="isFeatured"
              name="isFeatured"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">Featured listing</label>
          </div>
        </div>
      </section>

      {result?.error && <p className="text-sm text-red-500">{result.error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {isPending ? "Creating…" : "Create Listing"}
        </button>
        <a
          href="/dashboard/listings"
          className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
