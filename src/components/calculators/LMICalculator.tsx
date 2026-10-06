"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatPriceFull } from "@/lib/utils/format";
import { STATE_NAMES, type StateCode } from "@/lib/data/commission-rates";
import { LMI_DUTY, LMI_RATE_SOURCE, computeLmi, defaultLmiInput, type LmiInput } from "@/lib/lmi-calc";
import { HG_MIN_DEPOSIT_PCT, HG_NO_OWNERSHIP_YEARS, HG_PRICE_CAPS, fmtCap, hgCapSentence } from "@/lib/data/home-guarantee";
import { NumberInput } from "./CommissionCalculator";

const STATES = Object.keys(LMI_DUTY) as StateCode[];
const field =
  "w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white";

/**
 * Lenders mortgage insurance from the price and deposit (or loan amount):
 * LVR, the premium from a published lender table, the state's duty on the
 * premium, and what the 5% Deposit Scheme would save a first home buyer.
 * The numbers come from src/lib/lmi-calc.ts, which cites every source.
 */
export function LMICalculator() {
  const [input, setInput] = useState<LmiInput>(defaultLmiInput);
  const set = <K extends keyof LmiInput>(k: K, v: LmiInput[K]) => setInput((p) => ({ ...p, [k]: v }));
  const r = useMemo(() => computeLmi(input), [input]);
  const fmt = (n: number) => formatPriceFull(Math.round(n));
  const duty = LMI_DUTY[input.state];
  // The 5% Deposit Scheme needs the price under the area's cap (the capital-city
  // cap is the highest in each state) and at least a 5% deposit.
  const overCap = input.price > HG_PRICE_CAPS[input.state].capital;
  const underSchemeDeposit = r.lvr > 100 - HG_MIN_DEPOSIT_PCT.firstHome;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Your purchase</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput id="lmi-price" label="Property price" value={input.price} onChange={(v) => set("price", v)} prefix="$" step={10_000} />
          <div>
            <label htmlFor="lmi-state" className="block text-sm font-medium text-gray-700 mb-1">State or territory</label>
            <select id="lmi-state" value={input.state} onChange={(e) => set("state", e.target.value as StateCode)} className={field}>
              {STATES.map((s) => <option key={s} value={s}>{STATE_NAMES[s].replace(/^the /, "")}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="lmi-mode" className="block text-sm font-medium text-gray-700 mb-1">I know my</label>
            <select id="lmi-mode" value={input.mode} onChange={(e) => set("mode", e.target.value as LmiInput["mode"])} className={field}>
              <option value="deposit">Deposit</option>
              <option value="loan">Loan amount</option>
            </select>
          </div>
          {input.mode === "deposit" ? (
            <NumberInput id="lmi-deposit" label="Deposit" value={input.deposit} onChange={(v) => set("deposit", v)} prefix="$" step={5_000} hint="Cash towards the price, after stamp duty and other costs." />
          ) : (
            <NumberInput id="lmi-loan" label="Loan amount" value={input.loan} onChange={(v) => set("loan", v)} prefix="$" step={5_000} />
          )}
          <div>
            <label htmlFor="lmi-fhb" className="block text-sm font-medium text-gray-700 mb-1">First home buyer?</label>
            <select id="lmi-fhb" value={input.firstHomeBuyer ? "yes" : "no"} onChange={(e) => set("firstHomeBuyer", e.target.value === "yes")} className={field}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">Estimated LMI</h2>
        <dl className="space-y-3">
          <Row label="Loan amount" value={fmt(r.loan)} />
          <Row label="Deposit" value={fmt(r.deposit)} />
          <Row label="Loan to value ratio (LVR)" value={r.status === "invalid" ? "Check the figures" : `${r.lvr}%`} />
          {r.status === "priced" && (
            <>
              <Row label={`Premium rate (LVR ${r.lvrBand}, loan ${r.loanBand?.toLowerCase()})`} value={`${r.ratePct}%`} />
              <Row label="LMI premium" value={fmt(r.premium)} />
              <Row
                label={`Stamp duty on the premium, ${STATE_NAMES[input.state]}`}
                value={r.duty > 0 ? fmt(r.duty) : "None"}
              />
              <div className="flex items-center justify-between pt-1">
                <dt className="text-sm font-medium text-gray-900">Estimated LMI cost</dt>
                <dd className="text-xl font-bold text-primary">{fmt(r.total)}</dd>
              </div>
            </>
          )}
        </dl>

        {r.status === "no-lmi" && (
          <p className="mt-4 text-sm text-gray-700">
            At {r.lvr}% LVR you are borrowing 80% or less of the price, so most lenders charge no LMI.
          </p>
        )}
        {r.status === "lvr-above-table" && (
          <p className="mt-4 text-sm text-gray-700">
            At {r.lvr}% LVR you are above 95%, where the published table stops and most lenders will not lend with LMI.
            A guarantor or the 5% Deposit Scheme are the usual routes; see below.
          </p>
        )}
        {r.status === "loan-above-table" && (
          <p className="mt-4 text-sm text-gray-700">
            LMI still applies, but the published table stops at loans of $1,000,000, so we do not estimate it. Ask a
            lender or broker for a quote.
          </p>
        )}
        {r.status === "invalid" && (
          <p className="mt-4 text-sm text-gray-700">Enter a price, and a deposit or loan smaller than the price.</p>
        )}

        {r.depositGapTo80 > 0 && r.status !== "invalid" && (
          <p className="mt-4 text-sm text-gray-700">
            To avoid LMI with a 20% deposit you would need {fmt(r.depositFor80)}, which is {fmt(r.depositGapTo80)} more than
            this deposit.
          </p>
        )}
        <p className="mt-2 text-xs text-gray-500">{duty.note}</p>
        <p className="mt-4 text-xs text-gray-500">
          An estimate, not a quote: premiums differ between lenders and insurers. Rates from{" "}
          <a href={LMI_RATE_SOURCE.url} className="underline" rel="noopener" target="_blank">{LMI_RATE_SOURCE.name}</a>,{" "}
          {LMI_RATE_SOURCE.dated}, read {LMI_RATE_SOURCE.readOn}.
        </p>
      </div>

      {r.lvr > 80 && r.status !== "invalid" && (
        <div className="rounded-xl border border-line bg-surface-warm p-6 sm:p-7">
          <p className="text-[11px] uppercase tracking-[0.18em] text-cta font-medium mb-2">The alternative</p>
          {input.firstHomeBuyer ? (
            <>
              <h3 className="font-display text-xl sm:text-2xl text-ink leading-tight tracking-tight mb-2">
                {overCap
                  ? `This price is over the 5% Deposit Scheme cap in ${STATE_NAMES[input.state]}`
                  : underSchemeDeposit
                    ? `The 5% Deposit Scheme needs at least a ${HG_MIN_DEPOSIT_PCT.firstHome}% deposit`
                    : r.status === "priced"
                      ? `The 5% Deposit Scheme could save you ${fmt(r.total)}`
                      : "The 5% Deposit Scheme removes LMI"}
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed mb-4">
                Under the Australian Government 5% Deposit Scheme (the expanded First Home Guarantee), an eligible first
                home buyer can buy with a {HG_MIN_DEPOSIT_PCT.firstHome}% deposit and pay no LMI, because the government
                guarantees the rest of the deposit a lender wants. There is no income test, but the price must be under
                the cap for your area: {hgCapSentence(input.state)}.
                {overCap && <> At {fmt(input.price)} this home is over even the {fmtCap(HG_PRICE_CAPS[input.state].capital)} cap.</>}
              </p>
            </>
          ) : (
            <>
              <h3 className="font-display text-xl sm:text-2xl text-ink leading-tight tracking-tight mb-2">
                Not a first home buyer? A guarantor may still avoid LMI
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed mb-4">
                The 5% Deposit Scheme is for first home buyers and anyone who hasn&rsquo;t owned property in Australia
                in the last {HG_NO_OWNERSHIP_YEARS} years. Single parents and guardians can use the Family Home Guarantee
                with a {HG_MIN_DEPOSIT_PCT.singleParent}% deposit even if they have owned before. A family guarantor or a
                professional package are the other routes.
              </p>
            </>
          )}
          <Link href="/guides/first-home-guarantee" className="inline-flex items-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3 text-sm transition-colors">
            How the First Home Guarantee works
          </Link>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
      <dt className="text-sm text-gray-600">{label}</dt>
      <dd className="text-sm font-semibold text-gray-900 text-right">{value}</dd>
    </div>
  );
}
