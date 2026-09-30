"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, KeyRound, Loader2 } from "lucide-react";
import { clarityEvent, clarityTag } from "@/lib/clarity";
import { isValidPhone, PHONE_ERROR } from "@/lib/utils/phone";
import { AddressAutocomplete } from "@/components/forms/AddressAutocomplete";
import { PROPERTY_TYPES } from "@/lib/constants";
import { MANAGER_TIMEFRAMES, type ManagerTimeframe } from "@/lib/rental-landlord";

interface Props {
  suburbName: string;
  suburbSlug: string;
  state: string;
  postcode: string;
}

// Dwelling types a landlord lets; land and acreage are sold, not managed.
const DWELLING_TYPES = PROPERTY_TYPES.filter((t) => t.value !== "land" && t.value !== "acreage");
const BEDROOMS = ["1", "2", "3", "4", "5+"] as const;

const inputClass =
  "w-full rounded-lg border border-line bg-surface-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink-subtle outline-none transition-[border-color,box-shadow] duration-200 focus:border-cta focus:ring-[3px] focus:ring-cta/15";
const labelClass = "block text-xs font-medium text-ink-muted mb-1";
const chipClass = (active: boolean) =>
  `rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${active ? "bg-ink text-white border-ink" : "bg-surface-raised text-ink border-line hover:border-line-strong"}`;

/**
 * Landlord lead form on the rental-market sub-page (commercial intent review
 * 30 Sep 2026, section 3.1): "rental appraisal {suburb}" and "property
 * managers {suburb}" searches land here wanting a property manager to call.
 * Posts type "rental-appraisal" to /api/leads. Suburb is the page's; a
 * Google-selected address in another suburb we hold overrides it, as the
 * sale-appraisal CTA does. Thanks in place: the /appraisal/thanks page is
 * written for sellers.
 */
export function RentalAppraisalForm({ suburbName, suburbSlug, state, postcode }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [addressSuburbSlug, setAddressSuburbSlug] = useState<string | null>(null);
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [tenanted, setTenanted] = useState<"yes" | "no" | null>(null);
  const [timeframe, setTimeframe] = useState<ManagerTimeframe | null>(null);
  const [website, setWebsite] = useState(""); // honeypot
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const markStart = () => {
    if (hasStarted) return;
    setHasStarted(true);
    clarityEvent("form_start");
    clarityTag("form_name", "rental-appraisal");
    clarityTag("form_suburb", suburbSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPhone(phone)) {
      setPhoneError(PHONE_ERROR);
      return;
    }
    setPhoneError(null);
    const [firstName, ...rest] = name.trim().split(/\s+/);
    const lastName = rest.join(" ") || undefined;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "rental-appraisal",
          firstName,
          lastName,
          email: email.trim(),
          phone: phone.trim(),
          address: address.trim(),
          appraisalAddress: address.trim(),
          suburb: addressSuburbSlug ?? suburbSlug,
          propertyType: propertyType || undefined,
          bedrooms: bedrooms || undefined,
          tenanted: tenanted ?? undefined,
          managerTimeframe: timeframe ?? undefined,
          website,
          source: `suburb-page-${suburbSlug}-rental-appraisal`,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      clarityEvent("request_quote");
      clarityEvent("lead_conversion");
      clarityTag("conversion_flow", "rental-appraisal");
      clarityTag("appraisal_suburb", suburbSlug);
      if (timeframe) clarityTag("rental_appraisal_timeframe", timeframe);
      setDone(firstName);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-cta/30 bg-surface-raised p-6 sm:p-8 shadow-card" role="status">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-cta text-ink grid place-items-center"><CheckCircle className="w-5 h-5" /></div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink-subtle font-medium">Request received</p>
        </div>
        <h3 className="font-display text-2xl text-ink leading-tight mb-2">Your rental appraisal request is in, {done}.</h3>
        <p className="font-sans text-sm text-ink-muted leading-relaxed max-w-md">
          {`Look for a confirmation in your inbox in the next few minutes. A property manager who works in ${suburbName} will call within one business day to arrange the appraisal.`}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-cta/30 shadow-card">
      <div className="bg-ink band-glow px-6 sm:px-8 py-6 sm:py-7 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-cta text-ink grid place-items-center">
            <KeyRound className="w-4.5 h-4.5" />
          </div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/78 font-medium">Free rental appraisal in {suburbName}</p>
        </div>
        <h3 className="font-display text-2xl sm:text-3xl text-white leading-tight tracking-tight mb-2">
          What should your {suburbName} property rent for?
        </h3>
        <p className="text-sm text-white/75 leading-relaxed max-w-md">
          {`A property manager who lets homes in ${suburbName} will give you a rent figure from recent comparable lettings, and their fee schedule if you want it. Free, no obligation to appoint them.`}
        </p>
      </div>

      <form onSubmit={handleSubmit} onFocus={markStart} className="bg-surface-raised px-6 sm:px-8 py-6 sm:py-7 space-y-3">
        {/* Honeypot: visually hidden, off-screen, aria-hidden. */}
        <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }}>
          <label htmlFor="rental-appraisal-website">Website</label>
          <input id="rental-appraisal-website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="rental-appraisal-name" className={labelClass}>Name</label>
            <input id="rental-appraisal-name" type="text" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Citizen" className={inputClass} />
          </div>
          <div>
            <label htmlFor="rental-appraisal-email" className={labelClass}>Email</label>
            <input id="rental-appraisal-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="rental-appraisal-phone" className={labelClass}>
            Mobile <span className="font-normal text-ink-subtle">so the property manager can arrange the appraisal</span>
          </label>
          <input
            id="rental-appraisal-phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); if (phoneError) setPhoneError(null); }}
            aria-invalid={phoneError ? true : undefined}
            aria-describedby={phoneError ? "rental-appraisal-phone-error" : undefined}
            placeholder="0412 345 678"
            className={`${inputClass} ${phoneError ? "border-danger focus:border-danger" : ""}`}
          />
          {phoneError && <p id="rental-appraisal-phone-error" className="mt-1.5 text-xs text-danger">{phoneError}</p>}
        </div>

        <AddressAutocomplete
          id="rental-appraisal-address"
          label={<>Street address of the property</>}
          placeholder={`e.g. 15 Smith Street, ${suburbName}`}
          required
          value={address}
          onChange={(v) => { setAddress(v); setAddressSuburbSlug(null); }}
          onSelect={({ suburb }) => setAddressSuburbSlug(suburb?.slug ?? null)}
        />
        <p className="text-xs text-ink-muted">
          Suburb: <span className="text-ink">{suburbName}, {state} {postcode}</span>
          <span className="text-ink-subtle">{" (from this page; pick the address above if the property is next door)"}</span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="rental-appraisal-type" className={labelClass}>Dwelling type</label>
            <select id="rental-appraisal-type" value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className={inputClass}>
              <option value="">Choose</option>
              {DWELLING_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="rental-appraisal-bedrooms" className={labelClass}>Bedrooms</label>
            <select id="rental-appraisal-bedrooms" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className={inputClass}>
              <option value="">Choose</option>
              {BEDROOMS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>

        <fieldset>
          <legend className="block text-xs font-medium text-ink-muted mb-1.5">
            Currently tenanted? <span className="font-normal text-ink-subtle">Optional</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {(["yes", "no"] as const).map((v) => (
              <button key={v} type="button" aria-pressed={tenanted === v} onClick={() => setTenanted(tenanted === v ? null : v)} className={chipClass(tenanted === v)}>
                {v === "yes" ? "Yes, tenanted" : "No, vacant"}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="block text-xs font-medium text-ink-muted mb-1.5">
            When do you want a manager or an appraisal? <span className="font-normal text-ink-subtle">Optional</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {MANAGER_TIMEFRAMES.map((t) => (
              <button key={t.id} type="button" aria-pressed={timeframe === t.id} onClick={() => setTimeframe(timeframe === t.id ? null : t.id)} className={chipClass(timeframe === t.id)}>
                {t.label}
              </button>
            ))}
          </div>
        </fieldset>

        {error && <p className="step-in text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="group press w-full inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-ink font-semibold px-5 py-3 text-sm transition-colors active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Sending</>
          ) : (
            <>Get my free rental appraisal<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></>
          )}
        </button>

        <p className="text-[11px] text-ink-subtle leading-relaxed pt-1 flex flex-wrap items-center gap-x-2">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cta" aria-hidden="true" />
            Reply within 1 business day
          </span>
          <span aria-hidden="true">·</span>
          <span>No obligation to appoint</span>
          <span aria-hidden="true">·</span>
          <a href="/privacy" className="underline underline-offset-2 hover:text-ink">Privacy</a>
        </p>
        <p className="text-[11px] text-ink-subtle leading-relaxed">
          Free, no commitment. Your details go only to the one local property manager we match you with, who pays us for the introduction. We never sell them to anyone else.
        </p>
      </form>
    </div>
  );
}
