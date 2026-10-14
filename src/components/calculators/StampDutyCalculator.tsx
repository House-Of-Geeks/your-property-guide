"use client";

import { useId, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { DollarSign, Info, ChevronDown } from "lucide-react";
import {
  STAMP_DUTY_VERIFIED_ON,
  STATE_DUTY_SCHEDULES,
  calculateStampDuty,
  officeRef,
  type AustralianState,
} from "@/lib/utils/stamp-duty";
import {
  DATE_BASIS_LABELS,
  FIRST_HOME_REVIEWED_ON,
  PROPERTY_KINDS,
  PROPERTY_KIND_LABELS,
  dutyReliefFor,
  formatPolicyDate,
  periodLabel,
  todayIso,
  type PropertyKind,
} from "@/lib/policy/first-home";

const STATES: { value: AustralianState; label: string }[] = [
  { value: "QLD", label: "Queensland (QLD)" },
  { value: "NSW", label: "New South Wales (NSW)" },
  { value: "VIC", label: "Victoria (VIC)" },
  { value: "WA",  label: "Western Australia (WA)" },
  { value: "SA",  label: "South Australia (SA)" },
  { value: "TAS", label: "Tasmania (TAS)" },
  { value: "NT",  label: "Northern Territory (NT)" },
  { value: "ACT", label: "Australian Capital Territory (ACT)" },
];

// Explicit locale so the server render and the browser agree on separators.
const fmt = (n: number) => `$${n.toLocaleString("en-AU")}`;

// Today's date comes from the browser, never the server: the page is built
// ahead of time, so a server date would be the build date. The server
// snapshot is "" and the engine treats an empty date as today.
const subscribeNever = () => () => {};
const useToday = () => useSyncExternalStore(subscribeNever, todayIso, () => "");

const field =
  "w-full rounded-lg border border-line-strong px-3 py-3 text-ink bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none";

/**
 * The stamp duty calculator. On /stamp-duty-calculator it has a state picker;
 * on a state guide (/guides/stamp-duty-{state}) it is locked to that state and
 * preset to a price, so the page renders with a result already showing. The
 * first home rules come from src/lib/policy/first-home.ts by date and kind of
 * property, and the result names the rule it applied with its source.
 */
export function StampDutyCalculator({
  state: lockedState,
  initialPrice,
}: {
  /** Lock the calculator to one state (the state guides). */
  state?: AustralianState;
  /** Preset purchase price. */
  initialPrice?: number;
} = {}) {
  const id = useId();
  const today = useToday();
  const [price, setPrice] = useState(initialPrice ? initialPrice.toLocaleString("en-AU") : "");
  const [pickedState, setPickedState] = useState<AustralianState>("QLD");
  const [pickedDate, setPickedDate] = useState<string | null>(null);
  const [isFirstHome, setIsFirstHome] = useState(false);
  const [propertyKind, setPropertyKind] = useState<PropertyKind>("established");
  const [region, setRegion] = useState<"metro" | "regional">("metro");
  const [isForeign, setIsForeign] = useState(false);
  const [isInvestment, setIsInvestment] = useState(false);

  const state = lockedState ?? pickedState;
  const numericPrice = Number(price.replace(/[^0-9]/g, ""));
  const date = pickedDate ?? today;
  // Tasmania's first home relief follows the settlement date; every other state's rules follow the contract date.
  const bySettlement = state === "TAS";
  const kind: PropertyKind = isFirstHome ? propertyKind : "established";

  // WA's concession cap depended on where the home is for agreements from 21 March 2025 to 6 May 2026.
  const waRegional = useMemo(() => {
    if (state !== "WA" || !isFirstHome) return false;
    const m = dutyReliefFor("WA", kind, date || null).version?.method;
    return m?.type === "rate-per-100" && m.bands.length > 1;
  }, [state, isFirstHome, kind, date]);

  const result = useMemo(() => {
    if (!numericPrice || numericPrice <= 0) return null;
    return calculateStampDuty(numericPrice, state, isFirstHome, isForeign, isInvestment, {
      ...(bySettlement ? { settlementDate: date || null } : { contractDate: date || null }),
      propertyKind: kind,
      region,
    });
  }, [numericPrice, state, isFirstHome, isForeign, isInvestment, bySettlement, date, kind, region]);

  const rule = result?.firstHomeRule;
  const office = STATE_DUTY_SCHEDULES[state].office.name;
  // The rule panel already says what the first home rule is, so drop the note that repeats it.
  const notes = (result?.notes ?? []).filter(
    (n) => !rule || !(n.startsWith(`${rule.name}:`) || n.startsWith(`${rule.summary} (`)),
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Input section */}
        <div className="space-y-4">
          {lockedState ? (
            <div className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-line bg-surface-sunken px-3 py-3">
              <p className="text-sm text-ink-muted">
                State: <span className="font-medium text-ink">{STATES.find((s) => s.value === lockedState)?.label}</span>
              </p>
              <Link href="/stamp-duty-calculator#by-state" className="text-sm font-medium text-primary hover:underline">
                Buying in another state?
              </Link>
            </div>
          ) : (
            <div>
              <label htmlFor={`${id}-state`} className="block text-sm font-medium text-ink mb-1">
                State or territory
              </label>
              <div className="relative">
                <select
                  id={`${id}-state`}
                  value={pickedState}
                  onChange={(e) => setPickedState(e.target.value as AustralianState)}
                  className={`${field} appearance-none pl-3 pr-9`}
                >
                  {STATES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
              </div>
            </div>
          )}

          {/* Purchase price */}
          <div>
            <label htmlFor={`${id}-price`} className="block text-sm font-medium text-ink mb-1">
              Purchase price
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
              <input
                id={`${id}-price`}
                type="text"
                inputMode="numeric"
                value={price}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, "");
                  setPrice(raw ? Number(raw).toLocaleString("en-AU") : "");
                }}
                placeholder="e.g. 650,000"
                className={`${field} pl-9 text-lg placeholder:text-ink-subtle`}
              />
            </div>
          </div>

          {/* Contract (or, in Tasmania, settlement) date */}
          <div>
            <label htmlFor={`${id}-date`} className="block text-sm font-medium text-ink mb-1">
              {bySettlement ? "Settlement date" : "Contract date"}
            </label>
            <input
              id={`${id}-date`}
              type="date"
              value={date}
              min="2017-07-01"
              onChange={(e) => setPickedDate(e.target.value)}
              aria-describedby={`${id}-date-hint`}
              className={field}
            />
            <p id={`${id}-date-hint`} className="mt-1 text-xs text-ink-muted">
              {bySettlement
                ? "Tasmania's first home relief follows the settlement date. Leave it as today to see the rules now."
                : "First home rules follow the date you sign the contract (in WA, the agreement date), not settlement. Leave it as today to see the rules now."}
            </p>
          </div>

          <div className="space-y-3">
            <CheckboxOption
              id={`${id}-first-home`}
              label="First home buyer"
              description="May be eligible for state concessions or exemptions"
              checked={isFirstHome}
              onChange={setIsFirstHome}
            />

            {isFirstHome && (
              <fieldset className="ml-7 rounded-lg border border-line px-3 py-3">
                <legend className="px-1 text-sm font-medium text-ink">What are you buying?</legend>
                <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-5">
                  {PROPERTY_KINDS.map((k) => (
                    <label key={k} htmlFor={`${id}-kind-${k}`} className="flex items-center gap-2 text-sm text-ink cursor-pointer">
                      <input
                        id={`${id}-kind-${k}`}
                        type="radio"
                        name={`${id}-kind`}
                        value={k}
                        checked={propertyKind === k}
                        onChange={() => setPropertyKind(k)}
                        className="h-4 w-4 border-line-strong text-primary focus:ring-primary"
                      />
                      {PROPERTY_KIND_LABELS[k]}
                    </label>
                  ))}
                </div>
                <p className="mt-2 text-xs text-ink-muted">
                  A new home includes off-the-plan and house-and-land. Some states treat each differently.
                </p>
              </fieldset>
            )}

            {waRegional && (
              <div className="ml-7">
                <label htmlFor={`${id}-region`} className="block text-sm font-medium text-ink mb-1">
                  Where in WA?
                </label>
                <select
                  id={`${id}-region`}
                  value={region}
                  onChange={(e) => setRegion(e.target.value as "metro" | "regional")}
                  className={field}
                >
                  <option value="metro">Perth and Peel</option>
                  <option value="regional">Elsewhere in WA</option>
                </select>
                <p className="mt-1 text-xs text-ink-muted">
                  For agreements from 21 March 2025 to 6 May 2026 the concession reached further outside Perth and Peel.
                </p>
              </div>
            )}

            <CheckboxOption
              id={`${id}-investment`}
              label="Investment property"
              description="Not your primary place of residence"
              checked={isInvestment}
              onChange={setIsInvestment}
            />
            <CheckboxOption
              id={`${id}-foreign`}
              label="Foreign buyer"
              description="Additional surcharge may apply (varies by state)"
              checked={isForeign}
              onChange={setIsForeign}
            />
          </div>
        </div>

        {/* Results */}
        {result && numericPrice > 0 && (
          <div className="rounded-xl bg-white shadow-card border border-line overflow-hidden" aria-live="polite">
            <div className="gradient-brand p-6 text-white text-center">
              <p className="text-sm opacity-90">Total stamp duty in {state}</p>
              <p className="text-4xl font-bold mt-1">{fmt(result.total)}</p>
              <p className="text-sm opacity-80 mt-1">
                Effective rate: {result.effectiveRate}% of {fmt(numericPrice)}
              </p>
            </div>
            <div className="p-6 space-y-4">
              {result.ownerOccupierConcession > 0 && (
                <>
                  <ResultRow label="Duty at the standard rate" value={fmt(result.standardDuty)} />
                  <ResultRow label="Owner-occupier rate saves" value={`-${fmt(result.ownerOccupierConcession)}`} highlight />
                </>
              )}
              <ResultRow label="Transfer duty" value={fmt(result.transferDuty)} />
              {result.concessionApplied && result.concessionAmount > 0 && (
                <ResultRow
                  label="First home concession"
                  value={`-${fmt(result.concessionAmount)}`}
                  highlight
                />
              )}
              {result.foreignSurcharge > 0 && (
                <ResultRow
                  label="Foreign buyer surcharge"
                  value={`+${fmt(result.foreignSurcharge)}`}
                  warning
                />
              )}
              <div className="border-t border-line pt-4">
                <ResultRow
                  label="Total payable"
                  value={fmt(result.total)}
                  bold
                />
              </div>
            </div>

            {/* The first home rule applied, from the shared policy data */}
            {rule && (
              <div className="px-6 pb-4">
                <div className="rounded-lg border border-line px-4 py-3 text-sm">
                  <p className="font-medium text-ink">First home rule applied: {rule.name}</p>
                  <p className="mt-1 text-ink-muted">
                    {rule.summary}.{" "}
                    {rule.effectiveFrom || rule.effectiveTo
                      ? `In force for ${DATE_BASIS_LABELS[rule.dateBasis]}s ${periodLabel(rule)}; we used ${formatPolicyDate(rule.dateUsed)}.`
                      : `We used a ${DATE_BASIS_LABELS[rule.dateBasis]} of ${formatPolicyDate(rule.dateUsed)}.`}
                  </p>
                  <p className="mt-1 text-ink-muted">
                    Source:{" "}
                    <a href={rule.source.href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {rule.source.label}
                    </a>
                    {rule.source.updated ? `, page updated ${formatPolicyDate(rule.source.updated)}` : ""}. Checked{" "}
                    {formatPolicyDate(rule.reviewedOn)}.
                  </p>
                </div>
              </div>
            )}

            {/* State-specific notes */}
            {notes.length > 0 && (
              <div className="px-6 pb-4 space-y-2">
                {notes.map((note, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-ink-muted bg-surface-sunken p-3 rounded-lg">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
                    <p>{note}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="px-6 pb-6">
              <div className="flex items-start gap-2 text-xs text-ink-subtle bg-surface-sunken p-3 rounded-lg">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>
                  Rates checked against {officeRef(state)} on {formatPolicyDate(STAMP_DUTY_VERIFIED_ON)}, first home
                  rules on {formatPolicyDate(FIRST_HOME_REVIEWED_ON)}. An estimate only: it excludes registration and
                  transfer fees and income tests, and your conveyancer or {office} confirms the exact figure.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckboxOption({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="flex items-start gap-3 cursor-pointer group">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-line-strong text-primary focus:ring-primary cursor-pointer"
      />
      <div>
        <p className="text-sm font-medium text-ink group-hover:text-primary transition-colors">
          {label}
        </p>
        <p className="text-xs text-ink-subtle">{description}</p>
      </div>
    </label>
  );
}

function ResultRow({
  label,
  value,
  bold,
  highlight,
  warning,
}: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
  warning?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className={`text-sm ${bold ? "font-semibold text-ink" : "text-ink-muted"}`}>
        {label}
      </span>
      <span
        className={`text-sm font-medium ${
          highlight
            ? "text-green-600"
            : warning
            ? "text-red-600"
            : bold
            ? "text-lg font-bold text-ink"
            : "text-ink"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
