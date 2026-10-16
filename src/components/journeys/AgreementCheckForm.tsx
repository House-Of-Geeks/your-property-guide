"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics";
import { SuburbAutocomplete } from "@/components/search/SuburbAutocomplete";
import { AuPhoneInput } from "@/components/forms/AuPhoneInput";
import { auMobileError } from "@/lib/utils/au-mobile";
import { AGREEMENT_CHECK, HOW_WE_ARE_PAID_HREF, MARKETING_CONSENT } from "@/lib/service-model";
import { CheckField, Field, Honeypot, INPUT_CLASS, SubmitButton, describedBy, useRequestKey } from "./fields";

// The free agreement check (15 Oct 2026): a call from our team before
// someone signs an agency agreement. Posts to /api/leads as
// "agreement-check", which keeps it with the team and never sends it to an
// agent. The collection statement shown here is stored with the row.

const today = () => new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Sydney" }); // YYYY-MM-DD
const noSubscribe = () => () => {};

// Where the reader came from (?from=<article slug>), read at submit time so
// the form renders in the page's HTML instead of waiting for the URL on the
// client (that wait shifted the page by 0.1 CLS on phones, 16 Oct 2026).
function sourceTag(): string {
  const from = new URLSearchParams(window.location.search).get("from");
  return `agreement-check${from && /^[a-z0-9-]{1,40}$/.test(from) ? `-${from}` : ""}`;
}

export function AgreementCheckForm() {
  const router = useRouter();
  const requestKey = useRequestKey();
  // Today's date only on the client: the page is static, so the server's
  // date would be the build's.
  const minDate = useSyncExternalStore(noSubscribe, today, () => undefined);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [suburb, setSuburb] = useState<string | null>(null);
  const [agency, setAgency] = useState("");
  const [signDate, setSignDate] = useState("");
  const [marketing, setMarketing] = useState(false);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = "Enter your first name.";
    const pe = auMobileError(phone, { landline: true });
    if (pe) e.phone = phone ? pe : "Enter a phone number, so we can call you.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Enter an email address like name@example.com.";
    if (!suburb) e.suburb = "Choose the suburb of the property you’re selling.";
    if (signDate && signDate < today()) e.signDate = "Choose today or a later date, or leave it blank.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (inFlight.current || busy) return;
    setFormError(null);
    if (!validate()) return;
    inFlight.current = true;
    setBusy(true);
    const source = sourceTag();
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "agreement-check",
          firstName: firstName.trim(),
          lastName: lastName.trim() || undefined,
          email: email.trim(),
          phone,
          suburb: suburb ?? undefined,
          agencyName: agency.trim() || undefined,
          signDate: signDate || undefined,
          marketingConsent: marketing,
          requestKey,
          source,
          website,
        }),
      });
      const body = (await res.json().catch(() => null)) as { success?: boolean; error?: string } | null;
      if (!res.ok || !body?.success) {
        setFormError(
          res.status === 429
            ? "Too many tries in a minute. Please wait a moment and try again."
            : "Something went wrong on our side. Please try again, or call us.",
        );
        return;
      }
      track("agreement_check_submitted", { lead_type: "agreement-check", placement: source, state: suburb?.split("-").at(-2)?.toUpperCase() ?? null });
      router.push("/agreement-check/thanks");
    } catch {
      setFormError("We couldn’t reach the server. Check your connection and try again.");
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="tone-light relative rounded-3xl border border-line bg-white p-6 text-ink shadow-card sm:p-8">
      <h2 className="font-sans text-2xl font-bold tracking-[-0.015em] text-ink">Book my free agreement check</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">Two minutes. You don’t need the agreement in front of you yet.</p>

      <div className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="ac-first" label="First name" error={errors.firstName}>
            <input id="ac-first" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} aria-invalid={errors.firstName ? true : undefined} aria-describedby={describedBy("ac-first", null, errors.firstName)} className={INPUT_CLASS} />
          </Field>
          <Field id="ac-last" label="Last name" optional>
            <input id="ac-last" autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} className={INPUT_CLASS} />
          </Field>
        </div>
        <Field id="ac-phone" label="Phone" hint="Mobile or landline. We call you to go through the agreement." error={errors.phone}>
          <AuPhoneInput
            id="ac-phone"
            value={phone}
            onChange={(v) => {
              setPhone(v);
              if (errors.phone) setErrors((x) => ({ ...x, phone: "" }));
            }}
            invalid={!!errors.phone}
            tone="raised"
            placeholder="e.g. 0491 570 156"
            aria-describedby={describedBy("ac-phone", true, errors.phone)}
          />
        </Field>
        <Field id="ac-email" label="Email" error={errors.email}>
          <input id="ac-email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={errors.email ? true : undefined} aria-describedby={describedBy("ac-email", null, errors.email)} className={INPUT_CLASS} />
        </Field>
        <Field id="ac-suburb" label="Where’s the property?" error={errors.suburb}>
          <SuburbAutocomplete
            id="ac-suburb"
            placeholder="Suburb or postcode"
            onSelectLocation={(slug) => {
              setSuburb(slug);
              if (errors.suburb) setErrors((x) => ({ ...x, suburb: "" }));
            }}
            onClear={() => setSuburb(null)}
            aria-invalid={errors.suburb ? true : undefined}
            aria-describedby={describedBy("ac-suburb", null, errors.suburb)}
          />
        </Field>
        <Field id="ac-agency" label="Agent or agency" optional hint="If you know who the agreement is with.">
          <input id="ac-agency" maxLength={120} value={agency} onChange={(e) => setAgency(e.target.value)} aria-describedby="ac-agency-hint" className={INPUT_CLASS} />
        </Field>
        <Field id="ac-date" label="When do you plan to sign?" optional hint="Leave it blank if you’re not sure yet." error={errors.signDate}>
          <input id="ac-date" type="date" min={minDate} value={signDate} onChange={(e) => setSignDate(e.target.value)} aria-invalid={errors.signDate ? true : undefined} aria-describedby={describedBy("ac-date", true, errors.signDate)} className={INPUT_CLASS} />
        </Field>
        <CheckField id="ac-marketing" checked={marketing} onChange={setMarketing}>
          {MARKETING_CONSENT}
        </CheckField>
        <Honeypot value={website} onChange={setWebsite} />
      </div>

      {formError && (
        <p className="mt-6 rounded-lg border border-danger/40 bg-white p-3 text-sm font-medium text-danger" role="alert">
          {formError}
        </p>
      )}

      <div className="mt-6">
        <SubmitButton busy={busy}>Book my agreement check</SubmitButton>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ink-muted">
        {AGREEMENT_CHECK.collection} {AGREEMENT_CHECK.notAdvice}{" "}
        <Link href={HOW_WE_ARE_PAID_HREF} className="font-semibold text-ink underline underline-offset-4">How we’re paid</Link>
        {" · "}
        <Link href="/privacy" className="font-semibold text-ink underline underline-offset-4">Privacy</Link>
      </p>
    </form>
  );
}
