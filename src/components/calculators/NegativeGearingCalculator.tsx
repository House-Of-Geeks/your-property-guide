"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatPriceFull } from "@/lib/utils/format";
import {
  PURCHASE_TIMING_LABELS,
  TAX_RATES_2026_27,
  TAX_RATES_SOURCE,
  computeNegativeGearing,
  defaultNegativeGearingInput,
  type NegativeGearingInput,
  type PurchaseTiming,
} from "@/lib/negative-gearing-calc";
import { NumberInput } from "./CommissionCalculator";

const field =
  "w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white";

/** "$1,234" or "-$1,234"; formatPriceFull alone prints "$-1,234". */
function money(n: number): string {
  const v = Math.round(n);
  return v < 0 ? `-${formatPriceFull(-v)}` : formatPriceFull(v);
}

/**
 * Rent in, costs and interest out, depreciation as a paper deduction, and the
 * tax effect at a 2026–27 marginal rate: the after-tax cost of holding an
 * investment property, per year and per week, and what the 1 July 2027 change
 * does to it. The numbers come from src/lib/negative-gearing-calc.ts.
 */
export function NegativeGearingCalculator() {
  const [input, setInput] = useState<NegativeGearingInput>(defaultNegativeGearingInput);
  const set = <K extends keyof NegativeGearingInput>(k: K, v: NegativeGearingInput[K]) => setInput((p) => ({ ...p, [k]: v }));
  const r = useMemo(() => computeNegativeGearing(input), [input]);
  const loss = r.netRentalResult < 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Property and loan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput id="ng-price" label="Purchase price" value={input.price} onChange={(v) => set("price", v)} prefix="$" step={10_000} />
          <NumberInput id="ng-loan" label="Loan amount" value={input.loan} onChange={(v) => set("loan", v)} prefix="$" step={10_000} />
          <PercentInput id="ng-rate" label="Interest rate (% a year)" value={input.interestRate} onChange={(v) => set("interestRate", v)} step={0.05} hint="Interest only, so the whole repayment is deductible interest." />
          <div>
            <label htmlFor="ng-timing" className="block text-sm font-medium text-gray-700 mb-1">Which describes the property?</label>
            <select id="ng-timing" value={input.timing} onChange={(e) => set("timing", e.target.value as PurchaseTiming)} className={field}>
              {(Object.keys(PURCHASE_TIMING_LABELS) as PurchaseTiming[]).map((t) => (
                <option key={t} value={t}>{PURCHASE_TIMING_LABELS[t]}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Decides whether the 1 July 2027 change applies. The contract date counts.</p>
          </div>
        </div>

        <h2 className="text-base font-semibold text-gray-900 pt-2">Rent</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput id="ng-rent" label="Weekly rent" value={input.weeklyRent} onChange={(v) => set("weeklyRent", v)} prefix="$" step={10} />
          <PercentInput id="ng-vacancy" label="Vacant weeks a year" value={input.vacancyWeeks} onChange={(v) => set("vacancyWeeks", v)} step={1} max={52} hint="Weeks with no tenant; no rent comes in." />
        </div>

        <h2 className="text-base font-semibold text-gray-900 pt-2">Annual costs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput id="ng-council" label="Council and water rates" value={input.councilRates} onChange={(v) => set("councilRates", v)} prefix="$" step={100} />
          <NumberInput id="ng-insurance" label="Landlord and building insurance" value={input.insurance} onChange={(v) => set("insurance", v)} prefix="$" step={100} />
          <PercentInput id="ng-mgmt" label="Management fee (% of rent collected)" value={input.managementPct} onChange={(v) => set("managementPct", v)} step={0.1} hint="Set to 0 if you manage it yourself." />
          <NumberInput id="ng-maint" label="Repairs and maintenance" value={input.maintenance} onChange={(v) => set("maintenance", v)} prefix="$" step={100} />
          <NumberInput id="ng-strata" label="Strata or body corporate" value={input.strata} onChange={(v) => set("strata", v)} prefix="$" step={100} hint="0 for a freestanding house." />
          <NumberInput id="ng-dep" label="Depreciation" value={input.depreciation} onChange={(v) => set("depreciation", v)} prefix="$" step={500} hint="From a quantity surveyor's schedule. A deduction, not a cash cost." />
        </div>

        <h2 className="text-base font-semibold text-gray-900 pt-2">Tax</h2>
        <div>
          <label htmlFor="ng-tax" className="block text-sm font-medium text-gray-700 mb-1">Your marginal tax rate, 2026–27</label>
          <select id="ng-tax" value={input.marginalRate} onChange={(e) => set("marginalRate", Number(e.target.value))} className={field}>
            {TAX_RATES_2026_27.map((t) => <option key={t.rate} value={t.rate}>{t.label}</option>)}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Resident rates from the{" "}
            <a href={TAX_RATES_SOURCE.url} className="underline" rel="noopener" target="_blank">ATO</a>,{" "}
            {TAX_RATES_SOURCE.dated}. Pick the band your taxable income falls in before the rental loss.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">Your year, 2026–27</h2>
        <dl className="space-y-3">
          <Row label={`Rental income (${r.weeksLet} weeks let)`} value={money(r.rentalIncome)} />
          <Row label={`Cash expenses (management ${money(r.managementFee)})`} value={money(-r.cashExpenses)} />
          <Row label="Loan interest" value={money(-r.interest)} />
          <Row label="Cash flow before tax" value={money(r.cashFlowBeforeTax)} />
          {r.depreciation > 0 && <Row label="Depreciation (paper deduction)" value={money(-r.depreciation)} />}
          <Row
            label={loss ? "Net rental loss" : r.netRentalResult > 0 ? "Net rental profit" : "Net rental result"}
            value={money(r.netRentalResult)}
            strong
          />
          <Row
            label={loss ? `Tax saving at ${input.marginalRate}%` : `Tax on the profit at ${input.marginalRate}%`}
            value={money(r.taxEffect)}
          />
          <Row
            label={r.cashFlowAfterTax > 0 ? "Surplus after tax, per year" : "Cost after tax, per year"}
            value={money(Math.abs(r.cashFlowAfterTax))}
          />
          <div className="flex items-center justify-between pt-1">
            <dt className="text-sm font-medium text-gray-900">
              {r.weeklyCostAfterTax >= 0 ? "Your weekly cost after tax" : "Your weekly surplus after tax"}
            </dt>
            <dd className="text-xl font-bold text-primary">{money(Math.abs(r.weeklyCostAfterTax))}</dd>
          </div>
        </dl>
        <p className="text-xs text-gray-500 mt-4">
          Gross yield {r.grossYieldPct}%. The property is {r.gearing === "neutral" ? "neutrally" : r.gearing === "negative" ? "negatively" : "positively"} geared
          on these figures. General information, not tax advice.
        </p>
      </div>

      <div className="rounded-xl border border-line bg-surface-warm p-6 sm:p-7">
        <p className="text-[11px] uppercase tracking-[0.18em] text-cta font-medium mb-2">From 1 July 2027</p>
        {!loss ? (
          <p className="text-sm text-ink leading-relaxed">
            On these figures the property makes no rental loss, so the change to negative gearing from 1 July 2027 does not
            alter the result.
          </p>
        ) : r.lossOffsetsOtherIncomeFrom2027 ? (
          <p className="text-sm text-ink leading-relaxed">
            {input.timing === "new-build"
              ? "A new build keeps negative gearing after 1 July 2027, so the loss can still reduce the tax on your wages."
              : "A property held at 7:30pm AEST on 12 May 2026 is exempt from the negative gearing change, so the loss can still reduce the tax on your wages."}{" "}
            The weekly cost above carries on.
          </p>
        ) : (
          <p className="text-sm text-ink leading-relaxed">
            From 1 July 2027 this loss can no longer reduce the tax on your wages. It can be used against residential rental
            income or the capital gain when you sell, and carries forward until then. With no other rental income, the weekly
            cost from 2027–28 is <strong>{money(r.weeklyCostFrom2027)}</strong> on these figures.
          </p>
        )}
        <p className="text-sm text-ink-muted leading-relaxed mt-3">
          The same package replaces the 50% CGT discount for gains that accrue after 1 July 2027. Read{" "}
          <Link href="/guides/negative-gearing-changes-2026-budget" className="underline">the negative gearing changes</Link>,{" "}
          <Link href="/guides/cgt-changes-2026-budget" className="underline">the CGT changes</Link> and{" "}
          <Link href="/guides/negative-gearing-cgt-changes-now-law-2026" className="underline">what passed into law</Link>.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
      <dt className={`text-sm ${strong ? "font-medium text-gray-900" : "text-gray-600"}`}>{label}</dt>
      <dd className={`text-sm text-right ${strong ? "font-bold text-gray-900" : "font-semibold text-gray-900"}`}>{value}</dd>
    </div>
  );
}

function PercentInput({
  id,
  label,
  value,
  onChange,
  step,
  max = 100,
  hint,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  step: number;
  max?: number;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        id={id}
        type="number"
        min={0}
        max={max}
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className={field}
      />
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}
