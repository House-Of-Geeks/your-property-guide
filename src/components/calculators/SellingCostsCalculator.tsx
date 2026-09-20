"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatPriceFull } from "@/lib/utils/format";
import { STATE_NAMES, STATE_RATES, type StateCode } from "@/lib/data/commission-rates";
import { STATE_DOCUMENTS } from "@/lib/data/selling-costs";
import { computeSellingCosts, defaultSellingCostsInput } from "@/lib/selling-costs-calc";
import { NumberInput } from "./CommissionCalculator";

const STATES = Object.keys(STATE_RATES) as StateCode[];

export interface SellingCostsCalculatorProps {
  initialState?: StateCode;
  initialPrice?: number;
  /** "h3" when embedded under a guide's own h2. */
  headingLevel?: "h2" | "h3";
  showGuideCta?: boolean;
}

/**
 * Every cost of a sale in one place: commission (with GST), marketing,
 * conveyancing, the state's legal documents, presentation, auctioneer, the
 * mortgage payout and discharge fee, with net proceeds. The commission
 * calculator covers the agent's fee; this one covers the whole bill.
 */
export function SellingCostsCalculator({
  initialState = "NSW",
  initialPrice = 850_000,
  headingLevel = "h2",
  showGuideCta = true,
}: SellingCostsCalculatorProps = {}) {
  const Heading = headingLevel;
  const [state, setState] = useState<StateCode>(initialState);
  const [input, setInput] = useState(() => defaultSellingCostsInput(initialState, initialPrice));
  const [rateTouched, setRateTouched] = useState(false);
  const [docsTouched, setDocsTouched] = useState(false);

  const set = <K extends keyof typeof input>(k: K, v: (typeof input)[K]) => setInput((p) => ({ ...p, [k]: v }));

  const onStateChange = (s: StateCode) => {
    setState(s);
    const d = defaultSellingCostsInput(s, input.price);
    setInput((p) => ({
      ...p,
      commissionRate: rateTouched ? p.commissionRate : d.commissionRate,
      documents: docsTouched ? p.documents : d.documents,
    }));
  };

  const result = useMemo(() => computeSellingCosts(input), [input]);
  const fmt = (n: number) => formatPriceFull(n);
  const rates = STATE_RATES[state];
  const docs = STATE_DOCUMENTS[state];
  const field = "w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white";

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <Heading className="text-lg font-semibold text-gray-900">Your sale</Heading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sc-state" className="block text-sm font-medium text-gray-700 mb-1">State or territory</label>
            <select id="sc-state" value={state} onChange={(e) => onStateChange(e.target.value as StateCode)} className={field}>
              {STATES.map((s) => <option key={s} value={s}>{STATE_NAMES[s].replace(/^the /, "")}</option>)}
            </select>
          </div>
          <NumberInput id="sc-price" label="Expected sale price" value={input.price} onChange={(v) => set("price", v)} prefix="$" step={25_000} />
        </div>

        <Heading className="text-base font-semibold text-gray-900 pt-2">Agent</Heading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sc-rate" className="block text-sm font-medium text-gray-700 mb-1">Commission rate (%)</label>
            <input
              id="sc-rate" type="number" min={0} max={10} step={0.05} value={input.commissionRate || ""}
              onChange={(e) => { setRateTouched(true); set("commissionRate", Number(e.target.value) || 0); }}
              className={field}
            />
            <p className="text-xs text-gray-500 mt-1">Typical in {state}: {rates.low}% to {rates.high}%, most often around {rates.typical}%.</p>
          </div>
          <div>
            <label htmlFor="sc-gst" className="block text-sm font-medium text-gray-700 mb-1">Does the quoted rate include GST?</label>
            <select id="sc-gst" value={input.commissionIncludesGst ? "yes" : "no"} onChange={(e) => set("commissionIncludesGst", e.target.value === "yes")} className={field}>
              <option value="no">No, add 10% GST</option>
              <option value="yes">Yes, GST included</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Most quotes exclude it. Check the agency agreement.</p>
          </div>
          <NumberInput id="sc-marketing" label="Marketing and photography" value={input.marketing} onChange={(v) => set("marketing", v)} prefix="$" step={500} hint="Portal listing, photos, floor plan, signboard. Typically $2,000 to $8,000; payable even if it does not sell." />
          <div>
            <label htmlFor="sc-auction" className="block text-sm font-medium text-gray-700 mb-1">Method of sale</label>
            <select id="sc-auction" value={input.auction ? "auction" : "private"} onChange={(e) => set("auction", e.target.value === "auction")} className={field}>
              <option value="private">Private treaty</option>
              <option value="auction">Auction</option>
            </select>
          </div>
          {input.auction && (
            <NumberInput id="sc-auctioneer" label="Auctioneer fee" value={input.auctioneer} onChange={(v) => set("auctioneer", v)} prefix="$" step={100} hint="Typically $400 to $1,200; sometimes included in the commission." />
          )}
        </div>

        <Heading className="text-base font-semibold text-gray-900 pt-2">Legal and presentation</Heading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput id="sc-conveyancing" label="Conveyancing or solicitor" value={input.conveyancing} onChange={(v) => set("conveyancing", v)} prefix="$" step={100} hint="Typically $800 to $2,500 including disbursements." />
          <NumberInput
            id="sc-documents" label={docs.label} value={input.documents}
            onChange={(v) => { setDocsTouched(true); set("documents", v); }} prefix="$" step={50}
            hint={`${STATE_NAMES[state]}: typically ${formatPriceFull(docs.low)} to ${formatPriceFull(docs.high)}.`}
          />
          <NumberInput id="sc-presentation" label="Styling, repairs and cleaning" value={input.presentation} onChange={(v) => set("presentation", v)} prefix="$" step={500} hint="Optional. Styling alone often runs $2,000 to $8,000 for a six-week campaign." />
          <NumberInput id="sc-other" label="Other costs" value={input.other} onChange={(v) => set("other", v)} prefix="$" step={250} hint="Pool safety or smoke alarm certificates, strata certificates, removalists." />
        </div>

        <Heading className="text-base font-semibold text-gray-900 pt-2">Mortgage</Heading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput id="sc-loan" label="Loan balance paid out at settlement" value={input.loanBalance} onChange={(v) => set("loanBalance", v)} prefix="$" step={10_000} hint="Leave at 0 if the property is unencumbered." />
          {input.loanBalance > 0 && (
            <NumberInput id="sc-discharge" label="Discharge fee" value={input.discharge} onChange={(v) => set("discharge", v)} prefix="$" step={50} hint="Lender fee plus registration, typically $150 to $400. Fixed-rate break costs are extra." />
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <Heading className="text-lg font-semibold text-gray-900 mb-5">What selling costs you in {STATE_NAMES[state]}</Heading>
        <dl className="space-y-3">
          {result.lines.map((l) => (
            <div key={l.key} className="flex items-center justify-between border-b border-gray-100 pb-3">
              <dt className="text-sm text-gray-600">{l.label}{l.key === "commission" ? ` (${input.commissionRate}%)` : ""}</dt>
              <dd className="text-sm font-semibold text-gray-900">{fmt(l.amount)}</dd>
            </div>
          ))}
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <dt className="text-sm font-medium text-gray-900">Total cost of selling ({result.costPct}% of the price)</dt>
            <dd className="text-base font-bold text-gray-900">{fmt(result.totalCosts)}</dd>
          </div>
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <dt className="text-sm text-gray-600">Net proceeds before the loan</dt>
            <dd className="text-sm font-semibold text-gray-900">{fmt(result.netBeforeLoan)}</dd>
          </div>
          <div className="flex items-center justify-between pt-1">
            <dt className="text-sm font-medium text-gray-900">{input.loanBalance > 0 ? "Estimated cash at settlement after the loan" : "Estimated cash at settlement"}</dt>
            <dd className="text-xl font-bold text-primary">{fmt(result.netAfterLoan)}</dd>
          </div>
        </dl>
        <p className="text-xs text-gray-500 mt-4">
          Indicative only. Commission is negotiable and every other line is quoted individually. Capital gains tax on an investment property and
          rates or water adjustments at settlement are not included; the{" "}
          <Link href="/cgt-calculator" className="underline">CGT calculator</Link> covers the tax.
        </p>
      </div>

      {showGuideCta && (
        <div className="rounded-xl border border-line bg-surface-warm p-6 sm:p-7">
          <p className="text-[11px] uppercase tracking-[0.18em] text-cta font-medium mb-2">Free guide</p>
          <h3 className="font-display text-xl sm:text-2xl text-ink leading-tight tracking-tight mb-2">
            Commission is the line you can move. Most sellers never try.
          </h3>
          <p className="text-sm text-ink-muted leading-relaxed mb-4">
            Our free selling guide covers how to compare agents on results instead of rate, the questions to ask before
            you sign, and the fee negotiation tactics that work. Personalised to your suburb.
          </p>
          <Link href="/selling-guide" className="inline-flex items-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3 text-sm transition-colors">
            Get the free selling guide
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  );
}
