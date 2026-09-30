"use client";

import { useMemo, useState } from "react";
import { formatPriceFull } from "@/lib/utils/format";
import { STATE_NAMES, type StateCode } from "@/lib/data/commission-rates";
import {
  PM_FEES_AS_AT,
  PM_STATE_FEES,
  PM_STATE_ORDER,
  dollarCell,
  lettingCell,
  managementCell,
} from "@/lib/data/property-management-fees";
import { computePmFees, defaultPmFeesInput, type PmFeesInput } from "@/lib/property-management-fees-calc";
import { NumberInput } from "./CommissionCalculator";

type DefaultedKey = "managementPct" | "lettingWeeks" | "renewalFee" | "inspectionFee" | "inspectionsPerYear" | "adminFeePerYear";
const DEFAULTED: DefaultedKey[] = ["managementPct", "lettingWeeks", "renewalFee", "inspectionFee", "inspectionsPerYear", "adminFeePerYear"];

export interface PropertyManagementFeesCalculatorProps {
  initialState?: StateCode;
  initialRent?: number;
  /** "h3" when embedded under a guide's own h2. */
  headingLevel?: "h2" | "h3";
}

/**
 * Annual cost of a managed rental: management percentage, letting fee in
 * weeks spread over the tenancy, lease renewals, routine inspections and
 * statements, with the total as a share of the rent. Every field starts at
 * the state's published figure from the fee table and is editable; a field
 * the reader has changed keeps its value when the state changes.
 */
export function PropertyManagementFeesCalculator({
  initialState = "NSW",
  initialRent = 600,
  headingLevel = "h2",
}: PropertyManagementFeesCalculatorProps = {}) {
  const Heading = headingLevel;
  const [state, setState] = useState<StateCode>(initialState);
  const [input, setInput] = useState<PmFeesInput>(() => defaultPmFeesInput(initialState, initialRent));
  const [touched, setTouched] = useState<Set<DefaultedKey>>(() => new Set());

  const set = <K extends keyof PmFeesInput>(k: K, v: PmFeesInput[K]) => {
    if ((DEFAULTED as string[]).includes(k)) setTouched((t) => new Set(t).add(k as DefaultedKey));
    setInput((p) => ({ ...p, [k]: v }));
  };

  const onStateChange = (s: StateCode) => {
    setState(s);
    setInput((p) => {
      const d = defaultPmFeesInput(s, p.weeklyRent);
      const next = { ...p };
      for (const k of DEFAULTED) if (!touched.has(k)) next[k] = d[k];
      return next;
    });
  };

  const result = useMemo(() => computePmFees(input), [input]);
  const fees = PM_STATE_FEES[state];
  const name = STATE_NAMES[state];
  const fmt = (n: number) => formatPriceFull(n);
  const field = "w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white";
  const published = (cellText: string) => `${name.replace(/^the /, "").replace(/^ACT$/, "The ACT")}: ${cellText}.`;

  return (
    <div className="max-w-3xl mx-auto space-y-8" data-calculator="property-management-fees">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <Heading className="text-lg font-semibold text-gray-900">Your rental</Heading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pm-state" className="block text-sm font-medium text-gray-700 mb-1">State or territory</label>
            <select id="pm-state" value={state} onChange={(e) => onStateChange(e.target.value as StateCode)} className={field}>
              {PM_STATE_ORDER.map((s) => (
                <option key={s} value={s}>{STATE_NAMES[s].replace(/^the /, "")}</option>
              ))}
            </select>
          </div>
          <NumberInput id="pm-rent" label="Weekly rent" value={input.weeklyRent} onChange={(v) => set("weeklyRent", v)} prefix="$" step={10} />
        </div>

        <Heading className="text-base font-semibold text-gray-900 pt-2">Ongoing and letting fees</Heading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pm-pct" className="block text-sm font-medium text-gray-700 mb-1">Management fee (% of rent)</label>
            <input
              id="pm-pct" type="number" min={0} max={30} step={0.1} value={input.managementPct || ""}
              onChange={(e) => set("managementPct", Number(e.target.value) || 0)}
              className={field}
            />
            <p className="text-xs text-gray-500 mt-1">{published(managementCell(fees).text)} The average is the starting figure.</p>
          </div>
          <div>
            <label htmlFor="pm-letting" className="block text-sm font-medium text-gray-700 mb-1">Letting fee (weeks of rent)</label>
            <input
              id="pm-letting" type="number" min={0} max={8} step={0.1} value={input.lettingWeeks || ""}
              onChange={(e) => set("lettingWeeks", Number(e.target.value) || 0)}
              className={field}
            />
            <p className="text-xs text-gray-500 mt-1">{published(lettingCell(fees).text)} Charged each time a new tenant is signed.</p>
          </div>
          <div>
            <label htmlFor="pm-years" className="block text-sm font-medium text-gray-700 mb-1">Years between tenant changes</label>
            <input
              id="pm-years" type="number" min={0.5} max={10} step={0.5} value={input.tenancyYears || ""}
              onChange={(e) => set("tenancyYears", Number(e.target.value) || 0)}
              className={field}
            />
            <p className="text-xs text-gray-500 mt-1">The letting fee is spread over this. With 12-month leases, a tenant who stays two years renews once.</p>
          </div>
          <div>
            <label htmlFor="pm-gst" className="block text-sm font-medium text-gray-700 mb-1">Do the quoted fees include GST?</label>
            <select id="pm-gst" value={input.feesIncludeGst ? "yes" : "no"} onChange={(e) => set("feesIncludeGst", e.target.value === "yes")} className={field}>
              <option value="yes">Yes, GST included</option>
              <option value="no">No, add 10% GST</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Queensland&rsquo;s Form 6 states the fee inclusive of GST; elsewhere check the agreement.</p>
          </div>
        </div>

        <Heading className="text-base font-semibold text-gray-900 pt-2">Extra charges</Heading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            id="pm-renewal" label="Lease renewal fee" value={input.renewalFee} onChange={(v) => set("renewalFee", v)} prefix="$" step={25}
            hint={`${published(dollarCell(state, fees.renewal).text)}${fees.renewal ? "" : " Enter your quote; leave blank if the agency does not charge one."}`}
          />
          <NumberInput
            id="pm-inspection" label="Routine inspection fee (each)" value={input.inspectionFee} onChange={(v) => set("inspectionFee", v)} prefix="$" step={5}
            hint={`${published(dollarCell(state, fees.inspection).text)}${fees.inspection ? "" : " Many agencies include inspections in the management fee."}`}
          />
          <div>
            <label htmlFor="pm-inspections" className="block text-sm font-medium text-gray-700 mb-1">Routine inspections a year</label>
            <input
              id="pm-inspections" type="number" min={0} max={12} step={1} value={input.inspectionsPerYear || ""}
              onChange={(e) => set("inspectionsPerYear", Number(e.target.value) || 0)}
              className={field}
            />
            <p className="text-xs text-gray-500 mt-1">{fees.inspectionsNote}</p>
          </div>
          <NumberInput
            id="pm-admin" label="Statements and admin (a year)" value={input.adminFeePerYear} onChange={(v) => set("adminFeePerYear", v)} prefix="$" step={10}
            hint={`${published(dollarCell(state, fees.admin).text)}${fees.admin ? "" : " Monthly statement, EOFY summary and postage charges, if any."}`}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <Heading className="text-lg font-semibold text-gray-900 mb-5">What management costs a year in {name}</Heading>
        <dl className="space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <dt className="text-sm text-gray-600">Annual rent ({fmt(input.weeklyRent)} a week)</dt>
            <dd className="text-sm font-semibold text-gray-900">{fmt(result.annualRent)}</dd>
          </div>
          {result.lines.map((l) => (
            <div key={l.key} className="flex items-center justify-between border-b border-gray-100 pb-3">
              <dt className="text-sm text-gray-600">
                {l.label}
                {l.key === "management" ? ` (${input.managementPct}%)` : ""}
                {l.key === "letting" ? ` (${fmt(result.lettingFeeOnce)} each time, over ${input.tenancyYears} year${input.tenancyYears === 1 ? "" : "s"})` : ""}
                {l.key === "inspections" ? ` (${input.inspectionsPerYear} at ${fmt(input.inspectionFee)})` : ""}
              </dt>
              <dd className="text-sm font-semibold text-gray-900">{fmt(l.amount)}</dd>
            </div>
          ))}
          <div className="flex items-center justify-between pt-1">
            <dt className="text-sm font-medium text-gray-900">Annual cost of management ({result.pctOfRent}% of rent)</dt>
            <dd className="text-xl font-bold text-primary">{fmt(result.total)}</dd>
          </div>
        </dl>
        <p className="text-xs text-gray-500 mt-4">
          Indicative only. The starting figures are each state&rsquo;s published averages and ranges as at {PM_FEES_AS_AT} (sources under the
          table above); every line is negotiable and quoted individually. Where a state has no published range the line starts empty.
          Management fees are deductible against rental income.
        </p>
      </div>
    </div>
  );
}
