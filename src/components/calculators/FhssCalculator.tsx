"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { MatchAgent } from "@/components/journey/MatchAgent";
import { formatPriceFull } from "@/lib/utils/format";
import {
  CONCESSIONAL_CAP,
  CURRENT_SIC,
  FHSS_ANNUAL_LIMIT,
  FHSS_CONCESSIONAL_RELEASE_PCT,
  FHSS_TOTAL_LIMIT,
  SUPER_GUARANTEE_PCT,
} from "@/lib/data/fhss";
import {
  CONTRIBUTION_TYPE_LABELS,
  MAX_YEARS,
  computeFhss,
  defaultFhssInput,
  type ContributionType,
  type FhssInput,
} from "@/lib/fhss-calc";
import { MEDICARE_LEVY_PCT } from "@/lib/utils/income-tax";
import { NumberInput } from "./CommissionCalculator";

const field =
  "w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white";
const TYPES = Object.keys(CONTRIBUTION_TYPE_LABELS) as ContributionType[];

/** Lead source for buyer matches started on the FHSS calculator. */
export const FHSS_CALCULATOR_SOURCE = "fhss-calculator";

/**
 * The First Home Super Saver scheme for a salary, a yearly contribution and
 * a number of years: what counts towards the limits, the release (85% or
 * 100% plus deemed earnings), the tax on release, the deposit in hand, and
 * the same money saved in a bank account. Rules in src/lib/data/fhss.ts;
 * arithmetic in src/lib/fhss-calc.ts.
 */
export function FhssCalculator() {
  const [input, setInput] = useState<FhssInput>(defaultFhssInput);
  const set = <K extends keyof FhssInput>(k: K, v: FhssInput[K]) => setInput((p) => ({ ...p, [k]: v }));
  const r = useMemo(() => computeFhss(input), [input]);
  const fmt = (n: number) => formatPriceFull(Math.round(n));
  const beforeTax = input.type === "before-tax";
  const years = Math.min(MAX_YEARS, Math.round(input.years));

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">You and your contributions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            id="fhss-salary"
            label="Salary before super"
            value={input.salary}
            onChange={(v) => set("salary", v)}
            prefix="$"
            step={1_000}
            hint="Before tax and before any salary sacrifice. Used as your taxable income."
          />
          <div>
            <label htmlFor="fhss-type" className="block text-sm font-medium text-gray-700 mb-1">How you&rsquo;d contribute</label>
            <select id="fhss-type" value={input.type} onChange={(e) => set("type", e.target.value as ContributionType)} className={field}>
              {TYPES.map((t) => <option key={t} value={t}>{CONTRIBUTION_TYPE_LABELS[t]}</option>)}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {beforeTax
                ? "Salary sacrifice, or a personal contribution you claim a tax deduction for."
                : "A personal contribution from your take-home pay, with no tax deduction."}
            </p>
          </div>
          <NumberInput
            id="fhss-per-year"
            label="Extra contributions a year"
            value={input.perYear}
            onChange={(v) => set("perYear", v)}
            prefix="$"
            step={500}
            hint={`Up to ${fmt(FHSS_ANNUAL_LIMIT)} a year counts, and ${fmt(FHSS_TOTAL_LIMIT)} in total.`}
          />
          <NumberInput
            id="fhss-years"
            label="Years until you buy"
            value={input.years}
            onChange={(v) => set("years", v)}
            step={1}
            hint={`1 to ${MAX_YEARS}. Contributions are spread evenly over each year.`}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Rates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            id="fhss-sic"
            label="FHSS deemed earnings rate (% a year)"
            value={input.sicRatePct}
            onChange={(v) => set("sicRatePct", v)}
            step={0.01}
            hint={`The ATO's shortfall interest charge rate, ${CURRENT_SIC.rate}% for ${CURRENT_SIC.quarter}. It changes every quarter.`}
          />
          <NumberInput
            id="fhss-bank"
            label="Savings account rate (% a year)"
            value={input.bankRatePct}
            onChange={(v) => set("bankRatePct", v)}
            step={0.05}
            hint="For the comparison. Interest is taxed at your marginal rate."
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your FHSS release</h2>
        {r.status === "invalid" ? (
          <p className="text-sm text-gray-700">Enter your salary, an amount a year and the number of years.</p>
        ) : (
          <>
            <dl className="space-y-3">
              <Row label={`You contribute over ${years} ${years === 1 ? "year" : "years"}`} value={fmt(r.contributed)} />
              {r.notCounted > 0 && <Row label="Over the FHSS limits (stays in super)" value={fmt(r.notCounted)} />}
              <Row label="Counts towards FHSS" value={fmt(r.counted)} />
              <Row
                label={beforeTax ? `Releasable (${FHSS_CONCESSIONAL_RELEASE_PCT}%, after the fund's 15% tax)` : "Releasable (100%)"}
                value={fmt(r.releasableContributions)}
              />
              <Row label={`Deemed earnings at ${input.sicRatePct}%`} value={fmt(r.earnings)} />
              <Row label="Maximum release" value={fmt(r.maxRelease)} />
              <Row label={`Tax on release (${r.marginalRatePct}% + ${MEDICARE_LEVY_PCT}% Medicare, less the 30% offset)`} value={r.releaseTax === 0 ? "None" : fmt(r.releaseTax)} />
              <div className="flex items-center justify-between pt-1">
                <dt className="text-sm font-medium text-gray-900">For your deposit</dt>
                <dd className="text-lg font-semibold text-gray-900">{fmt(r.inHand)}</dd>
              </div>
            </dl>

            {(r.overAnnualLimit || r.overTotalLimit || r.overConcessionalCap) && (
              <ul className="mt-5 space-y-2">
                {r.overAnnualLimit && (
                  <Warning>
                    Only {fmt(FHSS_ANNUAL_LIMIT)} a year counts. The rest stays in super until you can access it, usually
                    when you retire after 60.
                  </Warning>
                )}
                {r.overTotalLimit && (
                  <Warning>Only {fmt(FHSS_TOTAL_LIMIT)} counts in total. Later contributions stay in super.</Warning>
                )}
                {r.overConcessionalCap && (
                  <Warning>
                    Your employer&rsquo;s {SUPER_GUARANTEE_PCT}% plus this salary sacrifice is {fmt(r.concessionalPerYear)} a year,
                    over the {fmt(CONCESSIONAL_CAP.amount)} concessional cap for {CONCESSIONAL_CAP.year}. The excess is taxed at
                    your marginal rate unless you have unused cap from earlier years.
                  </Warning>
                )}
              </ul>
            )}
          </>
        )}
      </div>

      {r.status === "ok" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">FHSS or a savings account?</h2>
          <p className="text-sm text-gray-700">
            The same {fmt(r.counted)} {beforeTax ? "of pay before tax" : "from your take-home pay"}, each way:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2 pr-4 font-medium"></th>
                  <th className="py-2 pr-4 font-medium">FHSS</th>
                  <th className="py-2 font-medium">Savings account</th>
                </tr>
              </thead>
              <tbody className="text-gray-900">
                <tr className="border-t border-gray-100">
                  <td className="py-2 pr-4 text-gray-600">Tax going in</td>
                  <td className="py-2 pr-4">{beforeTax ? `${fmt(r.contributionsTax)} (15% in the fund)` : "None"}</td>
                  <td className="py-2">{beforeTax ? `${fmt(r.bank.taxGoingIn)} (income tax and Medicare)` : "None"}</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="py-2 pr-4 text-gray-600">Saved</td>
                  <td className="py-2 pr-4">{fmt(r.releasableContributions)}</td>
                  <td className="py-2">{fmt(r.bank.saved)}</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="py-2 pr-4 text-gray-600">Earnings</td>
                  <td className="py-2 pr-4">{fmt(r.earnings)} deemed</td>
                  <td className="py-2">{fmt(r.bank.interest)} after tax</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="py-2 pr-4 text-gray-600">Tax coming out</td>
                  <td className="py-2 pr-4">{fmt(r.releaseTax)}</td>
                  <td className="py-2">None</td>
                </tr>
                <tr className="border-t border-gray-100 font-semibold">
                  <td className="py-2 pr-4">For your deposit</td>
                  <td className="py-2 pr-4">{fmt(r.inHand)}</td>
                  <td className="py-2">{fmt(r.bank.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-700">
            {r.advantage > 0
              ? `FHSS leaves you ${fmt(r.advantage)} more for the deposit on these figures.`
              : r.advantage < 0
                ? `A savings account leaves you ${fmt(-r.advantage)} more on these figures.`
                : "The two come out the same on these figures."}{" "}
            The catch: the FHSS money is locked in super until you request it, and if you don&rsquo;t buy you must put it
            back into super or pay 20% FHSS tax.{" "}
            <Link href="/guides/first-home-super-saver-scheme#worth-it" className="text-primary underline underline-offset-4">Is FHSS worth it?</Link>
          </p>
          <p className="text-xs text-gray-500">
            An estimate with {r.marginalRatePct === 0 ? "no" : `${r.marginalRatePct}%`} marginal tax on your salary, 2026–27
            rates and a {MEDICARE_LEVY_PCT}% Medicare levy. It leaves out the low income tax offset, Division 293 tax,
            study loan repayments and fund fees. Below a 30% tax rate the offset can also reduce tax on your other income,
            which isn&rsquo;t counted. The ATO works out the actual release amount.
          </p>
        </div>
      )}

      <div id="match-fhss" className="scroll-mt-24 rounded-xl border border-line bg-surface-warm p-6 sm:p-7">
        <p className="text-[11px] uppercase tracking-[0.18em] text-cta font-medium mb-2">Next step</p>
        <h3 className="font-display text-xl sm:text-2xl text-ink leading-tight tracking-tight mb-2">
          Plan the rest of your deposit with someone who does this every day
        </h3>
        <p className="text-sm text-ink-muted leading-relaxed mb-5">
          FHSS is one part of a first home deposit, alongside the 5% Deposit Scheme, grants and stamp duty concessions.
          Tell us where you&rsquo;re buying and we&rsquo;ll introduce one vetted specialist. Free, no commitment.
        </p>
        <Suspense fallback={<div className="h-64" aria-busy="true" />}>
          <MatchAgent compact initialIntent="buying" source={FHSS_CALCULATOR_SOURCE} />
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

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
      <span>{children}</span>
    </li>
  );
}
