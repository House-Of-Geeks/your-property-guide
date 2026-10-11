"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { MatchAgent } from "@/components/journey/MatchAgent";
import { formatPriceFull } from "@/lib/utils/format";
import { STATE_NAMES } from "@/lib/data/commission-rates";
import { AUSTRALIAN_STATES, type AustralianState } from "@/lib/utils/stamp-duty";
import {
  HOUSEHOLD_LABELS,
  HTB_INCOME_LIMITS,
  HTB_PRICE_CAPS,
  HTB_SHARE,
  HTB_YEAR,
  STATE_CAPITALS,
  type CapArea,
  type Household,
} from "@/lib/data/help-to-buy";
import { computeHelpToBuy, defaultHtbInput, type HomeType, type HtbInput } from "@/lib/help-to-buy-calc";
import { NumberInput } from "./CommissionCalculator";

const field =
  "w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white";
const HOUSEHOLDS = Object.keys(HTB_INCOME_LIMITS) as Household[];

/** Lead source for buyer matches started on the Help to Buy calculator. */
export const HELP_TO_BUY_CALCULATOR_SOURCE = "help-to-buy-calculator";

/**
 * Help to Buy for a given price, deposit and income: the eligibility checks
 * (income limit, price cap, 2% deposit, 20% combined), the government's
 * share, the loan and repayments, the same purchase under the 5% Deposit
 * Scheme, first home buyer duty, and what the government receives at sale.
 * Rules in src/lib/data/help-to-buy.ts; arithmetic in src/lib/help-to-buy-calc.ts.
 */
export function HelpToBuyCalculator() {
  const [input, setInput] = useState<HtbInput>(defaultHtbInput);
  const set = <K extends keyof HtbInput>(k: K, v: HtbInput[K]) => setInput((p) => ({ ...p, [k]: v }));
  const r = useMemo(() => computeHelpToBuy(input), [input]);
  const fmt = (n: number) => formatPriceFull(Math.round(n));
  const caps = HTB_PRICE_CAPS[input.state];
  const capitalLabel = `${STATE_CAPITALS[input.state]}${caps.regionalCentres.length ? " and regional centres" : ""}`;
  const saving = r.fivePercent.monthlyRepayment - r.monthlyRepayment;

  // A share at the old maximum moves to the new one (30% existing, 40% new); a lower share is kept.
  const setHome = (home: HomeType) =>
    setInput((p) => ({
      ...p,
      home,
      sharePct: p.sharePct >= HTB_SHARE[p.home].max ? HTB_SHARE[home].max : Math.min(p.sharePct, HTB_SHARE[home].max),
    }));

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="htb-household" className="block text-sm font-medium text-gray-700 mb-1">Applying as</label>
            <select id="htb-household" value={input.household} onChange={(e) => set("household", e.target.value as Household)} className={field}>
              {HOUSEHOLDS.map((h) => <option key={h} value={h}>{HOUSEHOLD_LABELS[h]}</option>)}
            </select>
          </div>
          <NumberInput
            id="htb-income"
            label={input.household === "joint" ? "Combined taxable income" : "Taxable income"}
            value={input.income}
            onChange={(v) => set("income", v)}
            prefix="$"
            step={1_000}
            hint={`From your latest ATO notice of assessment. The ${HTB_YEAR} limit is ${fmt(HTB_INCOME_LIMITS[input.household])}.`}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">The home</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="htb-state" className="block text-sm font-medium text-gray-700 mb-1">State or territory</label>
            <select id="htb-state" value={input.state} onChange={(e) => set("state", e.target.value as AustralianState)} className={field}>
              {AUSTRALIAN_STATES.map((s) => <option key={s} value={s}>{STATE_NAMES[s].replace(/^the /, "")}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="htb-area" className="block text-sm font-medium text-gray-700 mb-1">Where in the state</label>
            <select id="htb-area" value={caps.rest === null ? "capital" : input.area} onChange={(e) => set("area", e.target.value as CapArea)} className={field} disabled={caps.rest === null}>
              <option value="capital">{capitalLabel} (cap {fmt(caps.capital)})</option>
              {caps.rest !== null && <option value="rest">Rest of the state (cap {fmt(caps.rest)})</option>}
            </select>
            {caps.regionalCentres.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">Regional centres: {caps.regionalCentres.join(", ")}.</p>
            )}
          </div>
          <div>
            <label htmlFor="htb-home" className="block text-sm font-medium text-gray-700 mb-1">New or existing home</label>
            <select id="htb-home" value={input.home} onChange={(e) => setHome(e.target.value as HomeType)} className={field}>
              <option value="existing">Existing home (government share up to {HTB_SHARE.existing.max}%)</option>
              <option value="new">New home (government share up to {HTB_SHARE.new.max}%)</option>
            </select>
          </div>
          <NumberInput id="htb-price" label="Purchase price" value={input.price} onChange={(v) => set("price", v)} prefix="$" step={10_000} />
          <NumberInput id="htb-deposit" label="Your deposit" value={input.deposit} onChange={(v) => set("deposit", v)} prefix="$" step={1_000} hint="At least 2% of the price. The lender may ask for more if you can afford it." />
          <NumberInput
            id="htb-share"
            label="Government share (% of the price)"
            value={input.sharePct}
            onChange={(v) => set("sharePct", v)}
            step={1}
            hint={`Between ${HTB_SHARE[input.home].min}% and ${HTB_SHARE[input.home].max}%. The lender and Housing Australia set the final figure.`}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Your loan and the future</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NumberInput id="htb-rate" label="Interest rate (% a year)" value={input.ratePct} onChange={(v) => set("ratePct", v)} step={0.05} hint="An example rate. Use your lender's quote." />
          <NumberInput id="htb-growth" label="Price growth (% a year)" value={input.growthPct} onChange={(v) => set("growthPct", v)} step={0.5} hint="An assumption for the sale line, not a forecast." />
          <NumberInput id="htb-years" label="Years until you sell" value={input.yearsToSale} onChange={(v) => set("yearsToSale", v)} step={1} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Help to Buy figures</h2>
        {r.status === "invalid" ? (
          <p className="text-sm text-gray-700">Enter the price of the home.</p>
        ) : (
          <>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6" aria-label="Eligibility checks">
              {r.checks.map((c) => (
                <li key={c.key} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${c.ok ? "bg-green-50 text-green-900" : "bg-red-50 text-red-800"}`}>
                  {c.ok ? <Check className="w-4 h-4 shrink-0" aria-hidden="true" /> : <X className="w-4 h-4 shrink-0" aria-hidden="true" />}
                  <span>{c.label}</span>
                </li>
              ))}
            </ul>
            <dl className="space-y-3">
              <Row label={`Government share (${r.sharePct}%)`} value={fmt(r.governmentContribution)} />
              <Row label={`Your deposit (${r.depositPct}%)`} value={fmt(input.deposit)} />
              <Row label="Your home loan" value={fmt(r.loan)} />
              <Row label={`Monthly repayment (${input.termYears} years at ${input.ratePct}%)`} value={fmt(r.monthlyRepayment)} />
              {r.stampDuty !== null ? (
                <Row label={`Stamp duty with the ${STATE_NAMES[input.state].replace(/^the /, "")} first home buyer concession`} value={r.stampDuty === 0 ? "None" : fmt(r.stampDuty)} />
              ) : (
                <Row label="Stamp duty on a new home" value="See your state" />
              )}
              <div className="flex items-center justify-between gap-4 pt-1">
                <dt className="text-sm font-medium text-gray-900">
                  {r.eligible
                    ? `Within the ${HTB_YEAR} income limit and your area's price cap`
                    : `Outside a ${HTB_YEAR} limit on these figures`}
                </dt>
                <dd className={`text-sm font-semibold ${r.eligible ? "text-green-800" : "text-red-700"}`}>{r.eligible ? "Within" : "Outside"}</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-gray-500">
              An estimate, not an approval: Housing Australia and the lender decide eligibility. You also need to be an
              Australian citizen aged 18 or over, not own property now, and live in the home. Lenders check that you
              couldn&rsquo;t buy without the scheme.
              {r.stampDuty === null && " Several states exempt first home buyers from duty on new homes; check your state guide."}
            </p>
          </>
        )}
      </div>

      {r.status === "ok" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Help to Buy or the 5% Deposit Scheme?</h2>
          <p className="text-sm text-gray-700">You can&rsquo;t use both. The same {fmt(input.price)} home each way:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2 pr-4 font-medium"></th>
                  <th className="py-2 pr-4 font-medium">Help to Buy</th>
                  <th className="py-2 font-medium">5% Deposit Scheme</th>
                </tr>
              </thead>
              <tbody className="text-gray-900">
                <tr className="border-t border-gray-100"><td className="py-2 pr-4 text-gray-600">Deposit</td><td className="py-2 pr-4">{fmt(input.deposit)}</td><td className="py-2">{fmt(r.fivePercent.deposit)}</td></tr>
                <tr className="border-t border-gray-100"><td className="py-2 pr-4 text-gray-600">Government share</td><td className="py-2 pr-4">{fmt(r.governmentContribution)}</td><td className="py-2">None, a guarantee only</td></tr>
                <tr className="border-t border-gray-100"><td className="py-2 pr-4 text-gray-600">Home loan</td><td className="py-2 pr-4">{fmt(r.loan)}</td><td className="py-2">{fmt(r.fivePercent.loan)}</td></tr>
                <tr className="border-t border-gray-100"><td className="py-2 pr-4 text-gray-600">Monthly repayment</td><td className="py-2 pr-4">{fmt(r.monthlyRepayment)}</td><td className="py-2">{fmt(r.fivePercent.monthlyRepayment)}</td></tr>
                <tr className="border-t border-gray-100"><td className="py-2 pr-4 text-gray-600">Sell after {input.yearsToSale} years for {fmt(r.valueAtSale)}: to the government</td><td className="py-2 pr-4">{fmt(r.governmentAtSale)}</td><td className="py-2">$0</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-700">
            {saving > 0 ? `Help to Buy repayments are ${fmt(saving)} a month lower. ` : ""}
            In exchange the government keeps {r.sharePct}% of the home&rsquo;s value until you buy it back, in steps of at least
            5% of the value at the time. The 5% Deposit Scheme has no income test and its own price caps.{" "}
            <Link href="/guides/help-to-buy-scheme-australia#vs-guarantee" className="text-primary underline underline-offset-4">How the two compare</Link>
          </p>
        </div>
      )}

      <div id="match-help-to-buy" className="scroll-mt-24 rounded-xl border border-line bg-surface-warm p-6 sm:p-7">
        <p className="text-[11px] uppercase tracking-[0.18em] text-cta font-medium mb-2">Next step</p>
        <h3 className="font-display text-xl sm:text-2xl text-ink leading-tight tracking-tight mb-2">
          Talk to someone who works with Help to Buy
        </h3>
        <p className="text-sm text-ink-muted leading-relaxed mb-5">
          Help to Buy only runs through a handful of lenders, and the government share is set when you apply. Tell us where
          you&rsquo;re buying: one specialist receives your details and pays us a fee for the introduction. You pay us
          nothing, and there&rsquo;s no commitment.
        </p>
        <Suspense fallback={<div className="h-64" aria-busy="true" />}>
          <MatchAgent compact initialIntent="buying" source={HELP_TO_BUY_CALCULATOR_SOURCE} />
        </Suspense>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
      <dt className="text-sm text-gray-600">{label}</dt>
      <dd className="text-sm font-semibold text-gray-900 text-right whitespace-nowrap">{value}</dd>
    </div>
  );
}
