"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Info } from "lucide-react";
import { track } from "@/lib/analytics";
import { SuburbAutocomplete } from "@/components/search/SuburbAutocomplete";
import { AuPhoneInput } from "@/components/forms/AuPhoneInput";
import { auMobileError } from "@/lib/utils/au-mobile";
import {
  BEST_TIMES,
  CONTACT_METHODS,
  FEE_DISCLOSURE,
  FEE_DISTINCTION,
  HOW_WE_ARE_PAID_HREF,
  MARKETING_CONSENT,
  RESPONSE_WINDOW,
  SERVICES,
  type BestTime,
  type ContactMethod,
  type IntroService,
} from "@/lib/service-model";
import { availabilityNote, type Timeframe } from "@/lib/introductions/rules";
import { INTRO_BUDGETS, INTRO_BUYER_TYPES } from "@/lib/introductions/labels";
import { TIMEFRAMES } from "@/lib/plans/questions";
import type { AustralianState } from "@/lib/utils/stamp-duty";
import type { Journey } from "@/lib/lead-kinds";
import { CheckField, ChoiceGroup, Field, Honeypot, INPUT_CLASS, SubmitButton, describedBy, useRequestKey, type ChoiceOption } from "./fields";

// The introduction path (Oct 2026): someone asks for personal help. We say
// who they'd be introduced to and why, ask only what the agent needs, show
// whether we can help in their area before they send anything, take a
// separate permission for each introduction, and then say exactly what
// happened, from the server's real status. A guide or plan never comes here.
//
// 19 Oct 2026: coverage shows as soon as the place is known (on the first
// step when a suburb or state came with the link, otherwise straight under
// the suburb field), the optional questions say so, and the best time and the
// note sit behind one "add" toggle. The permissions and the "what happens
// next" wording are unchanged.

export type ServiceChoice = IntroService | "both";

interface Props {
  defaultService?: ServiceChoice | null;
  defaultSuburb?: string | null;
  defaultState?: AustralianState | null;
  defaultTimeframe?: Timeframe | null;
  source?: string;
  /** Smaller headings for embedding in a page section. */
  compact?: boolean;
}

interface Outcome {
  leadId: string;
  service: IntroService;
  status: string;
  headline: string;
  body: string;
  who: string;
}

const SERVICE_OPTIONS: ChoiceOption<ServiceChoice>[] = [
  { id: "selling-agent", label: "A selling agent", sub: "For an appraisal and a proposal to sell" },
  { id: "buyers-agent", label: "A buyer’s agent", sub: "Someone who acts only for you when buying" },
  { id: "both", label: "Both", sub: "I’m selling one place and buying the next" },
];

const PROPERTY_TYPES: ChoiceOption<string>[] = [
  { id: "house", label: "House" },
  { id: "townhouse", label: "Townhouse" },
  { id: "unit", label: "Unit or apartment" },
  { id: "land", label: "Land or acreage" },
];

const SELLER_STATUS: ChoiceOption<"not-started" | "comparing" | "already-listed">[] = [
  { id: "not-started", label: "Not yet", sub: "I haven’t spoken to agents" },
  { id: "comparing", label: "I’m talking to agents", sub: "Getting appraisals or proposals" },
  { id: "already-listed", label: "Yes, I’ve signed with one", sub: "The agency agreement is signed" },
];

const BUYER_STATUS: ChoiceOption<"not-started" | "comparing" | "already-engaged">[] = [
  { id: "not-started", label: "No", sub: "I haven’t spoken to any" },
  { id: "comparing", label: "I’m comparing a few", sub: "Not signed with anyone" },
  { id: "already-engaged", label: "Yes, I’ve engaged one", sub: "I’ve signed with a buyer’s agent" },
];

// Shared with the Sent 24/7 payload (src/lib/introductions/labels.ts).
const BUYER_TYPES: ChoiceOption<string>[] = [...INTRO_BUYER_TYPES];
const BUDGETS: ChoiceOption<string>[] = [...INTRO_BUDGETS];

const stateFromSlug = (slug: string | null): AustralianState | null => {
  const m = slug?.match(/-([a-z]{2,3})-\d{4}$/);
  const s = m?.[1]?.toUpperCase();
  return s && ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"].includes(s) ? (s as AustralianState) : null;
};

const STEPS = ["Who you’d meet", "Your situation", "How to reach you", "Your permission"] as const;

export function IntroductionForm({ defaultService, defaultSuburb, defaultState, defaultTimeframe, source = "get-help", compact = false }: Props) {
  const requestKey = useRequestKey();
  const [step, setStep] = useState(defaultService ? 1 : 0);
  const [choice, setChoice] = useState<ServiceChoice | null>(defaultService ?? null);
  const services: IntroService[] = choice === "both" ? ["selling-agent", "buyers-agent"] : choice ? [choice] : [];
  const selling = services.includes("selling-agent");
  const buying = services.includes("buyers-agent");
  const journey: Journey = choice === "both" ? "buying-and-selling" : choice === "buyers-agent" ? "buying" : "selling";

  // Situation
  const [suburb, setSuburb] = useState<string | null>(defaultSuburb ?? null);
  const [suburbLabel, setSuburbLabel] = useState<string | null>(null);
  const [suburbKey, setSuburbKey] = useState(0);
  const [stateChoice, setStateChoice] = useState<AustralianState | null>(defaultState ?? stateFromSlug(defaultSuburb ?? null));
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe | null>(defaultTimeframe ?? null);
  const [sellerStatus, setSellerStatus] = useState<"not-started" | "comparing" | "already-listed" | null>(null);
  const [buyerStatus, setBuyerStatus] = useState<"not-started" | "comparing" | "already-engaged" | null>(null);
  const [buyerType, setBuyerType] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);

  // The instant price range on /appraisal and /property-valuation writes
  // ?suburb= and ?type= into the page URL (src/lib/appraisal-prefill.ts);
  // take them up when they change, as the old appraisal form did.
  const params = useSearchParams();
  const urlPrefill = `${params.get("suburb") ?? ""}|${params.get("type") ?? ""}`;
  const [seenPrefill, setSeenPrefill] = useState("|");
  if (urlPrefill !== seenPrefill) {
    setSeenPrefill(urlPrefill);
    const slug = params.get("suburb");
    if (slug && /^[a-z0-9-]+-[a-z]{2,3}-\d{4}$/.test(slug)) {
      setSuburb(slug);
      const st = stateFromSlug(slug);
      if (st) setStateChoice(st);
      setSuburbKey((k) => k + 1);
    }
    const t = params.get("type");
    const mapped = t === "house" ? "house" : t === "townhouse" || t === "villa" ? "townhouse" : t === "unit" || t === "apartment" ? "unit" : t === "land" || t === "acreage" ? "land" : null;
    if (mapped) setPropertyType(mapped);
  }

  // Contact
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferred, setPreferred] = useState<ContactMethod | null>(null);
  const [bestTime, setBestTime] = useState<BestTime>("any");
  const [notes, setNotes] = useState("");
  const [extrasOpen, setExtrasOpen] = useState(false);

  // Permission
  const [consents, setConsents] = useState<Partial<Record<IntroService, boolean>>>({});
  const [marketing, setMarketing] = useState(false);
  const [website, setWebsite] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [outcomes, setOutcomes] = useState<Outcome[] | null>(null);
  const started = useRef(false);
  // Set synchronously, so a double click can't send twice before React re-renders.
  const inFlight = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  const state = stateChoice ?? stateFromSlug(suburb);
  const signedSeller = selling && sellerStatus === "already-listed";
  const signedBuyer = buying && buyerStatus === "already-engaged";
  // Everyone they asked about is already working with an agent: nothing to introduce.
  const nothingToIntroduce = services.length > 0 && services.every((s) => (s === "selling-agent" ? signedSeller : signedBuyer));
  const introducible = services.filter((s) => (s === "selling-agent" ? !signedSeller : !signedBuyer));

  useEffect(() => {
    if (moved.current) panelRef.current?.focus();
  }, [step, outcomes]);

  const begin = () => {
    if (started.current) return;
    started.current = true;
    track("intro_started", { journey, service: choice ?? undefined, placement: source });
  };

  const availability = useMemo(() => introducible.map((s) => ({ service: s, ...availabilityNote(s, state) })), [introducible.join(","), state]); // eslint-disable-line react-hooks/exhaustive-deps
  const coverage = availability.length > 0 && state && (
    <div className="space-y-2" aria-live="polite">
      {availability.map((a) => (
        <p key={a.service} className={`rounded-lg border p-4 text-[15px] leading-relaxed ${a.level === "direct" ? "border-line" : "border-warning/40 bg-surface-warm"}`}>
          <strong className="block text-ink">{`${SERVICES[a.service].label} in ${state}`}</strong>
          {a.text}
        </p>
      ))}
    </div>
  );

  const validateStep = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0 && !choice) e.service = "Choose who you’d like to be introduced to.";
    if (step === 1) {
      if (selling && !sellerStatus) e.sellerStatus = "Tell us whether you’ve signed with an agent.";
      if (buying && !buyerStatus) e.buyerStatus = "Tell us whether you’re working with a buyer’s agent.";
      if (!nothingToIntroduce) {
        if (selling && !signedSeller && !suburb) e.suburb = "Choose the suburb of the property you’re selling.";
        if (!selling && buying && !suburb && !stateChoice) e.suburb = "Choose a suburb, or the state you’re buying in.";
        if (!timeframe) e.timeframe = "Choose your timing.";
      }
    }
    if (step === 2) {
      if (!firstName.trim()) e.firstName = "Enter your first name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Enter an email address like name@example.com.";
      const pe = auMobileError(phone, { landline: true });
      if (pe) e.phone = phone ? pe : "Enter a phone number. The agent needs one to arrange a time.";
      if (!preferred) e.preferred = "Choose how you’d like to be contacted first.";
    }
    if (step === 3) {
      if (!introducible.some((s) => consents[s])) e.consents = "Tick the box for at least one introduction, or we can’t pass your details on.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    begin();
    if (!validateStep()) return;
    moved.current = true;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => {
    setErrors({});
    moved.current = true;
    setStep((s) => Math.max(0, s - 1));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < STEPS.length - 1) return next();
    if (inFlight.current || busy || outcomes) return;
    if (!validateStep()) return;
    inFlight.current = true;
    setFormError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/introductions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          services: introducible,
          consents,
          journey,
          firstName: firstName.trim(),
          lastName: lastName.trim() || undefined,
          email: email.trim(),
          phone,
          preferredContact: preferred,
          bestTime,
          state: state ?? undefined,
          suburb: suburb ?? undefined,
          propertyType: selling ? propertyType ?? undefined : undefined,
          timeframe: timeframe ?? undefined,
          sellerStatus: selling ? sellerStatus ?? undefined : undefined,
          buyerStatus: buying ? buyerStatus ?? undefined : undefined,
          buyerType: buying ? buyerType ?? undefined : undefined,
          budget: buying ? budget ?? undefined : undefined,
          notes: notes.trim() || undefined,
          marketingConsent: marketing,
          requestKey,
          source,
          website,
        }),
      });
      const body = (await res.json().catch(() => null)) as { ok?: boolean; items?: Outcome[]; duplicate?: boolean; error?: string } | null;
      if (!res.ok || !body?.ok) {
        setFormError(
          res.status === 429
            ? "Too many tries in a minute. Please wait a moment and try again."
            : body?.error ?? "Something went wrong on our side. Please try again, or call us.",
        );
        return;
      }
      moved.current = true;
      setOutcomes(body.items ?? []);
      track(body.duplicate ? "intro_duplicate_blocked" : "intro_submitted", {
        journey,
        service: introducible.join("+"),
        state,
        timeframe,
        contact_method: preferred,
        status: (body.items ?? []).map((i) => i.status).join("+"),
        lead_type: "introduction-request",
        placement: source,
      });
    } catch {
      setFormError("We couldn’t reach the server. Check your connection and try again.");
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  };

  const h2 = compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-[28px]";

  // ---------------------------------------------------------------------
  // Result
  // ---------------------------------------------------------------------
  if (outcomes) {
    return (
      <div ref={panelRef} tabIndex={-1} className="tone-light rounded-xl border border-line bg-white p-5 sm:p-8 text-ink outline-none" role="status">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-success">
          <Check className="h-4 w-4" aria-hidden="true" /> Request received
        </p>
        <h2 className={`${h2} mt-2 font-bold leading-tight`}>Here’s what happens next</h2>
        <div className="mt-6 space-y-4">
          {outcomes.map((o) => (
            <div key={o.leadId} className="rounded-lg border border-line p-4 sm:p-5">
              <p className="text-sm font-semibold text-ink-muted">{SERVICES[o.service].label}</p>
              <p className="mt-1 text-lg font-bold">{o.headline}</p>
              <p className="mt-2 text-[15px] leading-relaxed">{o.body}</p>
              <p className="mt-3 text-sm text-ink-muted">
                <strong className="text-ink">Who will contact you:</strong> {o.who}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[15px] leading-relaxed text-ink-muted">
          We’ve emailed you a copy. {FEE_DISTINCTION}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/plan?j=${journey}`} className="inline-flex items-center gap-2 rounded-lg border border-ink px-5 py-3 text-[15px] font-semibold text-ink hover:bg-ink hover:text-white">
            Make a next-step plan while you wait <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          {selling && (
            <Link href="/tools/agent-proposal-worksheet" className="inline-flex items-center gap-2 rounded-lg px-2 py-3 text-[15px] font-semibold text-ink underline underline-offset-4">
              Agent proposal worksheet
            </Link>
          )}
          {buying && (
            <Link href="/buyers-agents" className="inline-flex items-center gap-2 rounded-lg px-2 py-3 text-[15px] font-semibold text-ink underline underline-offset-4">
              Questions to ask a buyer’s agent
            </Link>
          )}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------
  // Form
  // ---------------------------------------------------------------------
  return (
    <form onSubmit={submit} noValidate className="tone-light rounded-xl border border-line bg-white p-5 sm:p-8 text-ink" aria-describedby="intro-steps">
      <Honeypot value={website} onChange={setWebsite} />
      <ol id="intro-steps" className="mb-6 flex flex-wrap gap-x-4 gap-y-1 text-sm" aria-label="Steps">
        {STEPS.map((label, i) => (
          <li key={label} className={i === step ? "font-semibold text-ink" : i < step ? "text-ink-muted" : "text-ink-subtle"} aria-current={i === step ? "step" : undefined}>
            <span className="mr-1">{i + 1}.</span>
            {label}
          </li>
        ))}
      </ol>

      <div ref={panelRef} tabIndex={-1} key={step} className="space-y-6 outline-none">
        {step === 0 && (
          <>
            <ChoiceGroup legend="Who would you like to be introduced to?" options={SERVICE_OPTIONS} value={choice} onChange={(v) => { begin(); setChoice(v); setConsents({}); }} error={errors.service} size={compact ? "md" : "lg"} />
            {choice && (
              <div className="space-y-4">
                {(choice === "both" ? (["selling-agent", "buyers-agent"] as IntroService[]) : [choice as IntroService]).map((s) => (
                  <div key={s} className="rounded-lg bg-surface-warm p-4 text-[15px] leading-relaxed">
                    <p className="font-semibold">{SERVICES[s].label}</p>
                    <p className="mt-1 text-ink-muted">{SERVICES[s].who}</p>
                    <p className="mt-2 text-ink-muted">
                      <strong className="text-ink">Their fees:</strong> {SERVICES[s].fees}
                    </p>
                  </div>
                ))}
                <p className="text-sm text-ink-muted">
                  We match on the suburb, the type of property and your timing, and introduce one participating agent for each job. <Link href="/get-help#how-we-choose" className="underline underline-offset-4">How we choose agents</Link>
                </p>
                {coverage}
              </div>
            )}
          </>
        )}

        {step === 1 && (
          <>
            {selling && (
              <ChoiceGroup legend="Have you signed with a selling agent?" options={SELLER_STATUS} value={sellerStatus} onChange={setSellerStatus} error={errors.sellerStatus} />
            )}
            {buying && (
              <ChoiceGroup legend="Are you working with a buyer’s agent already?" options={BUYER_STATUS} value={buyerStatus} onChange={setBuyerStatus} error={errors.buyerStatus} />
            )}

            {(signedSeller || signedBuyer) && (
              <div className="flex gap-3 rounded-lg border border-line bg-surface-warm p-4 text-[15px] leading-relaxed" role="note">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-ink-muted" aria-hidden="true" />
                <p>
                  {signedSeller && signedBuyer
                    ? "You’re already working with agents for both, so we won’t introduce anyone else. "
                    : signedSeller
                      ? "You’ve signed with a selling agent, so we won’t introduce another one. "
                      : "You’re working with a buyer’s agent, so we won’t introduce another one. "}
                  Our guides and tools are still yours.{" "}
                  <Link href={`/plan?j=${journey}`} className="font-semibold underline underline-offset-4">
                    Make a plan for the stage you’re at
                  </Link>
                  .
                </p>
              </div>
            )}

            {!nothingToIntroduce && (
              <>
                <Field
                  id="intro-suburb"
                  label={selling ? "Suburb of the property you’re selling" : "Where are you looking to buy?"}
                  hint={selling ? undefined : "A suburb helps most. If you’re open to an area, choose the state below instead."}
                  error={errors.suburb}
                >
                  <SuburbAutocomplete
                    key={suburbKey}
                    id="intro-suburb"
                    defaultSlug={suburb ?? ""}
                    placeholder="Suburb or postcode"
                    onSelectLocation={(slug, label) => {
                      begin();
                      setSuburb(slug);
                      setSuburbLabel(label);
                      const st = stateFromSlug(slug);
                      if (st) setStateChoice(st);
                    }}
                    onClear={() => {
                      setSuburb(null);
                      setSuburbLabel(null);
                    }}
                    aria-describedby={describedBy("intro-suburb", !selling, errors.suburb)}
                    aria-invalid={!!errors.suburb}
                  />
                </Field>
                {!selling && !suburb && (
                  <ChoiceGroup
                    legend="Or the state you’re buying in"
                    options={(["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"] as AustralianState[]).map((s) => ({ id: s, label: s }))}
                    columns={4}
                    value={stateChoice}
                    onChange={setStateChoice}
                  />
                )}
                {coverage}
                {selling && !signedSeller && (
                  <ChoiceGroup legend="What type of property?" optional options={PROPERTY_TYPES} columns={2} value={propertyType} onChange={setPropertyType} />
                )}
                {buying && !signedBuyer && (
                  <>
                    <ChoiceGroup legend="What are you buying?" optional options={BUYER_TYPES} columns={2} value={buyerType} onChange={setBuyerType} />
                    <ChoiceGroup legend="Roughly what budget?" optional hint="A range is fine. It helps match you with someone who works at that price." options={BUDGETS} columns={2} value={budget} onChange={setBudget} />
                  </>
                )}
                <ChoiceGroup
                  legend={choice === "both" ? "When are you hoping to move?" : selling ? "When are you hoping to sell?" : "When are you hoping to buy?"}
                  options={TIMEFRAMES}
                  columns={2}
                  value={timeframe}
                  onChange={setTimeframe}
                  error={errors.timeframe}
                />
              </>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="intro-first" label="First name" error={errors.firstName}>
                <input id="intro-first" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} aria-invalid={errors.firstName ? true : undefined} aria-describedby={describedBy("intro-first", null, errors.firstName)} className={INPUT_CLASS} />
              </Field>
              <Field id="intro-last" label="Last name" optional>
                <input id="intro-last" autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} className={INPUT_CLASS} />
              </Field>
            </div>
            <Field id="intro-email" label="Email" error={errors.email}>
              <input id="intro-email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={errors.email ? true : undefined} aria-describedby={describedBy("intro-email", null, errors.email)} className={INPUT_CLASS} />
            </Field>
            <Field id="intro-phone" label="Phone" hint="Mobile or landline. The agent uses it to arrange a time." error={errors.phone}>
              <AuPhoneInput
                id="intro-phone"
                value={phone}
                onChange={(v) => {
                  setPhone(v);
                  if (errors.phone) setErrors((x) => ({ ...x, phone: "" }));
                }}
                invalid={!!errors.phone}
                tone="raised"
                placeholder="e.g. 0491 570 156"
                aria-describedby={describedBy("intro-phone", true, errors.phone)}
              />
            </Field>
            <ChoiceGroup legend="How would you like to be contacted first?" options={CONTACT_METHODS} columns={3} value={preferred} onChange={setPreferred} error={errors.preferred} />
            <details className="group rounded-lg border border-line" open={extrasOpen} onToggle={(e) => setExtrasOpen(e.currentTarget.open)}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[15px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                <span>
                  Add a best time or a note <span className="font-normal text-ink-muted">(optional)</span>
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-ink-muted transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
              </summary>
              <div className="space-y-5 border-t border-line px-4 pb-4 pt-4">
                <Field id="intro-time" label="Best time to reach you">
                  <select id="intro-time" value={bestTime} onChange={(e) => setBestTime(e.target.value as BestTime)} className={INPUT_CLASS}>
                    {BEST_TIMES.map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </Field>
                <Field id="intro-notes" label="Anything the agent should know?" optional hint="For example, a deadline, a tenant in the property, or what matters most to you. Please don’t include bank or ID details.">
                  <textarea id="intro-notes" rows={3} maxLength={500} value={notes} onChange={(e) => setNotes(e.target.value)} aria-describedby="intro-notes-hint" className={INPUT_CLASS} />
                </Field>
              </div>
            </details>
          </>
        )}

        {step === 3 && (
          <>
            <div>
              <h2 className={`${h2} font-bold leading-tight`}>Your permission</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
                We only pass your details on if you tick the box. {introducible.length > 1 ? "These are two separate introductions: tick one or both." : ""}
              </p>
            </div>
            <div className="space-y-3">
              {introducible.map((s) => (
                <CheckField
                  key={s}
                  id={`consent-${s}`}
                  strong
                  checked={!!consents[s]}
                  onChange={(v) => setConsents((c) => ({ ...c, [s]: v }))}
                  error={errors.consents && !introducible.some((x) => consents[x]) ? errors.consents : null}
                >
                  {SERVICES[s].permission}
                </CheckField>
              ))}
            </div>
            <CheckField id="intro-marketing" checked={marketing} onChange={setMarketing}>
              {MARKETING_CONSENT}
            </CheckField>
            <div className="rounded-lg bg-surface-warm p-4 text-[15px] leading-relaxed">
              <p className="font-semibold text-ink">What happens when you send this</p>
              <p className="mt-1 text-ink-muted">
                If a participating agent covers your area, we pass your request to that one agent and they contact you the way you chose, normally {RESPONSE_WINDOW}. If not, our team tells you so. Either way we email you to confirm.
              </p>
              <p className="mt-3 text-ink-muted">
                {FEE_DISCLOSURE}{" "}
                <Link href={HOW_WE_ARE_PAID_HREF} className="font-semibold text-ink underline underline-offset-4">How we’re paid</Link>
              </p>
            </div>
          </>
        )}
      </div>

      {formError && (
        <p className="mt-6 rounded-lg border border-danger/40 bg-white p-3 text-sm font-medium text-danger" role="alert">
          {formError}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
        {step > 0 ? (
          <button type="button" onClick={back} className="inline-flex items-center gap-1.5 rounded-md px-2 py-2 text-[15px] font-medium text-ink-muted hover:text-ink">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
          </button>
        ) : (
          <span />
        )}
        {step === 1 && nothingToIntroduce ? (
          <Link href={`/plan?j=${journey}`} className="inline-flex items-center gap-2 rounded-lg bg-cta hover:bg-cta-hover px-6 py-3.5 text-base font-semibold text-cta-ink">
            Make a plan instead <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        ) : step < STEPS.length - 1 ? (
          <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-cta hover:bg-cta-hover px-6 py-3.5 text-base font-semibold text-cta-ink">
            Continue <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : (
          <SubmitButton busy={busy}>{introducible.length > 1 ? "Send my requests" : "Send my request"}</SubmitButton>
        )}
      </div>
      {suburbLabel && step === 1 && <span className="sr-only" aria-live="polite">{suburbLabel} selected</span>}
    </form>
  );
}
