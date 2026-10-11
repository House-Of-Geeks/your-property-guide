"use client";

import { useState, useMemo } from "react";
import { DollarSign, Info } from "lucide-react";
import { formatPriceFull } from "@/lib/utils/format";
import {
  CGT_OWNER_LABELS,
  MINIMUM_TAX_PCT,
  REFORM_START_ISO,
  SMSF_TAX_RATE,
  apportionedValueAt2027,
  computeCgt,
  defaultCgtInput,
  type CgtInput,
  type CgtOwner,
  type CompanyRate,
  type MainResidenceUse,
} from "@/lib/cgt-calc";
import { MEDICARE_LEVY_PCT } from "@/lib/utils/income-tax";

export function CGTCalculator() {
  const [input, setInput] = useState<CgtInput>(defaultCgtInput);
  const set = <K extends keyof CgtInput>(key: K, value: CgtInput[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const result = useMemo(() => computeCgt(input), [input]);
  const personal = input.owner === "individual" || input.owner === "joint";
  const taxedAsPerson = personal || input.owner === "trust";
  const afterReform = input.saleDate >= REFORM_START_ISO && taxedAsPerson;
  const ownedAt2027 = input.purchaseDate < REFORM_START_ISO;
  const estimate2027 = Math.round(
    apportionedValueAt2027(input.purchasePrice, input.salePrice, input.purchaseDate, input.saleDate),
  );

  const fmt = (n: number) => formatPriceFull(Math.round(n));
  const pct = (n: number) => `${Math.round(n * 1000) / 10}%`;

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none";
  const dollarInputClass =
    "w-full rounded-lg border border-gray-300 pl-9 pr-3 py-3 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none";
  const toggle = (active: boolean) =>
    `py-2 rounded-lg text-sm font-medium border transition-colors ${
      active
        ? "bg-primary text-white border-primary"
        : "bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary"
    }`;

  const money = (key: "purchasePrice" | "salePrice" | "purchaseCosts" | "saleCosts" | "otherIncome", label: string, hint?: string, step = 1000) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {hint && <span className="text-xs text-gray-400 ml-1">{hint}</span>}
      </label>
      <div className="relative">
        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="number"
          min={0}
          step={step}
          value={input[key]}
          onChange={(e) => set(key, Number(e.target.value))}
          className={dollarInputClass}
        />
      </div>
    </div>
  );

  let discountLine = "No CGT discount (held less than 12 months)";
  if (result.exemptShare === 1) discountLine = "Full main residence exemption";
  else if (result.heldAtLeast12Months && result.discount > 0)
    discountLine = `${input.owner === "smsf" ? "One-third" : "50%"} CGT discount applied (held at least 12 months)`;
  else if (result.heldAtLeast12Months && input.owner === "company") discountLine = "Companies get no CGT discount";

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Inputs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Property Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {money("purchasePrice", "Purchase Price")}
          {money("salePrice", "Sale Price")}
          {money("purchaseCosts", "Purchase Costs", "(stamp duty, legal, improvements)", 100)}
          {money("saleCosts", "Sale Costs", "(agent, legal)", 100)}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase contract date</label>
            <input
              type="date"
              value={input.purchaseDate}
              onChange={(e) => set("purchaseDate", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sale contract date
              <span className="text-xs text-gray-400 ml-1">(the CGT event)</span>
            </label>
            <input
              type="date"
              value={input.saleDate}
              onChange={(e) => set("saleDate", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 -mt-3">
          The discount needs at least 12 months between the two contract dates, leaving out
          both days (ATO). Owned for {result.daysOwned.toLocaleString("en-AU")} days:{" "}
          {result.heldAtLeast12Months ? "long enough for the discount." : "not long enough for the discount."}
        </p>

        {/* Ownership */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Who sells</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(Object.keys(CGT_OWNER_LABELS) as CgtOwner[]).map((t) => (
              <button key={t} type="button" onClick={() => set("owner", t)} className={toggle(input.owner === t)}>
                {CGT_OWNER_LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        {taxedAsPerson && (
          <div>
            {money(
              "otherIncome",
              input.owner === "joint"
                ? "Each owner's other taxable income this year"
                : input.owner === "trust"
                  ? "The beneficiary's other taxable income this year"
                  : "Your other taxable income this year",
              "(before the gain)",
            )}
            <p className="text-xs text-gray-500 mt-1">
              Rate on the next dollar: {result.marginalRateBefore}% ({result.taxYear} resident rates), plus the{" "}
              {MEDICARE_LEVY_PCT}% Medicare levy. The gain is taxed on top of this income, so a large gain can
              reach higher brackets.
            </p>
          </div>
        )}

        {input.owner === "company" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company tax rate</label>
            <div className="grid grid-cols-2 gap-2">
              {([30, 25] as CompanyRate[]).map((r) => (
                <button key={r} type="button" onClick={() => set("companyRate", r)} className={toggle(input.companyRate === r)}>
                  {r}%{r === 25 ? " (base rate entity)" : ""}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              A company pays 25% only as a base rate entity: turnover under $50 million and no more than 80% of
              its assessable income from passive income such as rent and capital gains. A company that mainly
              holds property usually pays 30% (ATO). Companies get no CGT discount.
            </p>
          </div>
        )}

        {input.owner === "smsf" && (
          <p className="text-xs text-gray-500 -mt-2">
            A complying SMSF pays {SMSF_TAX_RATE}% and gets a one-third discount on an asset held at least 12 months
            (ATO). Gains on assets supporting a retirement phase pension are exempt; this assumes accumulation phase.
          </p>
        )}

        {input.owner === "trust" && (
          <p className="text-xs text-gray-500 -mt-2">
            A trust&apos;s net capital gain is taxed in its beneficiaries&apos; hands. This assumes one adult Australian
            resident beneficiary takes the whole gain and uses the 50% discount.
          </p>
        )}

        {afterReform && (
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-4">
            <p className="text-sm text-gray-800">
              {ownedAt2027
                ? "A sale from 1 July 2027 of an asset owned before then: the gain up to 1 July 2027 keeps the discount, and the gain after it is indexed for inflation from the asset's value on that date, with a 30% minimum tax for resident individuals."
                : "Bought on or after 1 July 2027: the whole gain is worked out with cost base indexation instead of the discount, with a 30% minimum tax for resident individuals."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ownedAt2027 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Value on 1 July 2027
                    <span className="text-xs text-gray-400 ml-1">(blank: our estimate)</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      placeholder={estimate2027.toLocaleString("en-AU")}
                      value={input.valueAt2027 ?? ""}
                      onChange={(e) => set("valueAt2027", e.target.value === "" ? null : Number(e.target.value))}
                      className={dollarInputClass}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    A valuation at that date, or the apportioning method: our estimate assumes steady growth from
                    purchase to sale, as the Budget explainer&apos;s example does. The ATO&apos;s tool will set the real
                    method.
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inflation a year
                  <span className="text-xs text-gray-400 ml-1">(for indexation)</span>
                </label>
                <input
                  type="number"
                  min={0}
                  max={15}
                  step={0.1}
                  value={input.inflationPct ?? 2.5}
                  onChange={(e) => set("inflationPct", Number(e.target.value))}
                  className={inputClass}
                />
                <p className="text-xs text-gray-500 mt-1">
                  2.5% is the Budget explainer&apos;s assumption. The real index is the CPI.
                </p>
              </div>
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!input.exemptPayment}
                onChange={(e) => set("exemptPayment", e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">
                I receive the Age Pension, JobSeeker or another listed income support payment in the year of sale (no
                minimum tax)
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!input.newBuild}
                onChange={(e) => set("newBuild", e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">
                It is a new build and I am its first owner (I can choose the 50% discount instead)
              </span>
            </label>
          </div>
        )}

        {personal && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Was it your main residence?</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                ["no", "No"],
                ["always", "The whole time"],
                ["part", "Part of the time"],
              ] as [MainResidenceUse, string][]).map(([v, label]) => (
                <button key={v} type="button" onClick={() => set("mainResidence", v)} className={toggle(input.mainResidence === v)}>
                  {label}
                </button>
              ))}
            </div>
            {input.mainResidence === "part" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Days it was your main residence
                  <span className="text-xs text-gray-400 ml-1">(of {result.daysOwned} days owned)</span>
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={input.mainResidenceDays}
                  onChange={(e) => set("mainResidenceDays", Number(e.target.value))}
                  className={inputClass}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="rounded-xl bg-white shadow-card border border-gray-100 overflow-hidden">
        <div className="gradient-brand p-6 text-white text-center">
          <p className="text-sm opacity-90">Estimated tax on the gain</p>
          <p className="text-5xl font-bold mt-1 tracking-tight">{fmt(result.totalTax)}</p>
          <p className="text-sm opacity-80 mt-1">{discountLine}</p>
        </div>

        <div className="p-6 space-y-3">
          {result.newBuildChoice && (
            <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800">
              New build: {result.newBuildChoice.chosen === "discount" ? "the 50% discount" : "indexation"} gives the
              lower tax here; the other option would cost {fmt(result.newBuildChoice.alternativeTax)}.
            </div>
          )}
          <ResultRow label="Cost Base" value={fmt(result.costBase)} />
          <ResultRow label="Capital Proceeds" value={fmt(result.proceeds)} />
          <ResultRow
            label={result.grossGain < 0 ? "Capital Loss" : "Gross Capital Gain"}
            value={fmt(Math.abs(result.grossGain))}
            highlight={result.grossGain < 0 ? "red" : undefined}
          />
          {result.grossGain < 0 && (
            <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-700">
              A capital loss is not deductible against other income. It reduces capital gains this year or
              carries forward to reduce future ones.
            </div>
          )}
          {result.grossGain > 0 && result.exemptShare === 1 && (
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
              Full main residence exemption: no CGT on this sale.
            </div>
          )}
          {result.grossGain > 0 && result.exemptShare < 1 && (
            <>
              {result.exemptShare > 0 && (
                <ResultRow label={`Main residence exemption (${pct(result.exemptShare)} of days)`} value={`- ${fmt(result.grossGain - result.assessableGain)}`} />
              )}
              {result.rules === "split" && (
                <>
                  <ResultRow
                    label={`Value on 1 July 2027${result.valueAt2027Estimated ? " (estimate)" : ""}`}
                    value={fmt(result.valueAt2027 ?? 0)}
                  />
                  <ResultRow label="Gain up to 1 July 2027" value={fmt(result.gainBefore2027)} />
                  <ResultRow label="Gain after 1 July 2027, after indexation" value={fmt(result.indexedGainAfter2027)} />
                </>
              )}
              {result.rules === "indexation" && (
                <ResultRow label="Indexed cost base" value={fmt(result.indexedBase)} />
              )}
              <div className="border-t border-gray-100 pt-3">
                <ResultRow
                  label={
                    result.rules === "split"
                      ? `Taxable Capital Gain (${result.discount > 0 ? "50% discount to 1 July 2027, " : ""}indexation after)`
                      : result.rules === "indexation"
                        ? "Taxable Capital Gain (after indexation)"
                        : result.discount > 0
                          ? `Taxable Capital Gain (after the ${input.owner === "smsf" ? "one-third" : "50%"} discount)`
                          : "Taxable Capital Gain"
                  }
                  value={fmt(result.taxableGain)}
                />
              </div>
              {result.owners === 2 && <ResultRow label="Each Owner's Taxable Gain (50%)" value={fmt(result.taxableGainPerOwner)} />}
              <ResultRow
                label={
                  input.owner === "company"
                    ? `Company tax at ${input.companyRate}%`
                    : input.owner === "smsf"
                      ? `Fund tax at ${SMSF_TAX_RATE}%`
                      : `Income tax (${result.taxYear} resident rates)`
                }
                value={fmt(result.incomeTax)}
              />
              {result.minimumTaxTopUp > 0 && (
                <ResultRow label={`Top-up to the ${MINIMUM_TAX_PCT}% minimum tax`} value={fmt(result.minimumTaxTopUp)} />
              )}
              {taxedAsPerson && <ResultRow label={`Medicare levy (${MEDICARE_LEVY_PCT}%)`} value={fmt(result.medicareLevy)} />}
              <ResultRow label={result.owners === 2 ? "Total Tax (both owners)" : "Total Tax on the Gain"} value={fmt(result.totalTax)} highlight="primary" />
            </>
          )}
          <div className="border-t border-gray-100 pt-3 space-y-3">
            <ResultRow label="Effective Rate on the Gross Gain" value={`${result.effectiveRate.toFixed(1)}%`} />
            <ResultRow
              label="Net Profit After Tax"
              value={fmt(result.netProfit)}
              highlight={result.netProfit < 0 ? "red" : "green"}
            />
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              An estimate for Australian residents, at the ATO&apos;s resident rates for the year of the sale contract
              ({result.taxYear}; the 14% rate from 1 July 2027 is legislated). It leaves out tax offsets, the
              Medicare levy&apos;s low-income reduction and surcharge, other capital gains and losses, and the cost base
              effects of depreciation. Check your figures with a registered tax agent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: "primary" | "green" | "red";
}) {
  const valueClass =
    highlight === "primary"
      ? "text-sm font-bold text-primary"
      : highlight === "green"
        ? "text-sm font-semibold text-green-700"
        : highlight === "red"
          ? "text-sm font-semibold text-red-600"
          : "text-sm font-semibold text-gray-900";

  return (
    <div className="flex justify-between items-center gap-4">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}
