"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DollarSign, ArrowRight } from "lucide-react";
import { formatPriceFull } from "@/lib/utils/format";
import { computeSellingCosts, type SellingCostsResult } from "@/lib/selling-costs-calc";

// Typical residential commission ranges by state. The ranges, their sources
// and their as-at date live in src/lib/data/commission-rates.ts.
import { STATE_RATES, type StateCode } from "@/lib/data/commission-rates";

const STATES = Object.keys(STATE_RATES) as StateCode[];

export interface CommissionCalculatorInput {
  price: number;
  /** Percent, e.g. 2. */
  rate: number;
  /** True when the quoted rate already includes GST. */
  includesGst: boolean;
  marketing: number;
  conveyancing: number;
  other: number;
}

/**
 * The calculator's arithmetic. It runs through the selling costs
 * calculator's own function, so the same sale gives the same commission,
 * GST, total and net on both tools (commercial-intent review, 10 Oct 2026,
 * 0.6): GST of 10% is added to the commission unless the quote includes it.
 */
export function commissionCalculatorResult(i: CommissionCalculatorInput): SellingCostsResult {
  return computeSellingCosts({
    price: i.price,
    commissionRate: i.rate,
    commissionIncludesGst: i.includesGst,
    marketing: i.marketing,
    conveyancing: i.conveyancing,
    documents: 0,
    presentation: 0,
    auction: false,
    auctioneer: 0,
    loanBalance: 0,
    discharge: 0,
    other: i.other,
  });
}

export interface CommissionCalculatorProps {
  /** Preset state; the state guides pass their own (fix item 8). */
  initialState?: StateCode;
  initialPrice?: number;
  /** "h3" when embedded under a guide's own h2. */
  headingLevel?: "h2" | "h3";
  /** The selling-guide CTA block; off inside a guide that has its own CTAs. */
  showGuideCta?: boolean;
}

export function CommissionCalculator({
  initialState = "NSW",
  initialPrice = 850_000,
  headingLevel = "h2",
  showGuideCta = true,
}: CommissionCalculatorProps = {}) {
  const Heading = headingLevel;
  const [state, setState] = useState<StateCode>(initialState);
  const [salePrice, setSalePrice] = useState(initialPrice);
  const [rate, setRate] = useState(STATE_RATES[initialState].typical);
  const [rateTouched, setRateTouched] = useState(false);
  // Default "add 10%": most agency agreements state the rate before GST.
  const [includesGst, setIncludesGst] = useState(false);
  const [marketing, setMarketing] = useState(4_000);
  const [conveyancing, setConveyancing] = useState(1_400);
  const [other, setOther] = useState(0);

  const onStateChange = (s: StateCode) => {
    setState(s);
    // Track the state's typical rate until the user has set their own.
    if (!rateTouched) setRate(STATE_RATES[s].typical);
  };

  const result = useMemo(() => {
    const r = commissionCalculatorResult({ price: salePrice, rate, includesGst, marketing, conveyancing, other });
    return {
      commission: r.commission,
      gst: r.commissionGst,
      totalCosts: r.totalCosts,
      net: r.netBeforeLoan,
      costPct: r.costPct,
      stateLow: Math.round((salePrice * STATE_RATES[state].low) / 100),
      stateHigh: Math.round((salePrice * STATE_RATES[state].high) / 100),
    };
  }, [salePrice, rate, includesGst, marketing, conveyancing, other, state]);

  const fmt = (n: number) => formatPriceFull(n);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Inputs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <Heading className="text-lg font-semibold text-gray-900">Your Sale</Heading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="commission-state" className="block text-sm font-medium text-gray-700 mb-1">
              State or territory
            </label>
            <select
              id="commission-state"
              value={state}
              onChange={(e) => onStateChange(e.target.value as StateCode)}
              className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
            >
              {STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <NumberInput
            id="sale-price"
            label="Expected sale price"
            value={salePrice}
            onChange={setSalePrice}
            prefix="$"
            step={25_000}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="commission-rate" className="block text-sm font-medium text-gray-700 mb-1">
              Commission rate (%)
            </label>
            <input
              id="commission-rate"
              type="number"
              min={0}
              max={10}
              step={0.05}
              value={rate || ""}
              onChange={(e) => {
                setRateTouched(true);
                setRate(Number(e.target.value) || 0);
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Typical in {state}: {STATE_RATES[state].low}% to {STATE_RATES[state].high}%.
            </p>
          </div>
          <div>
            <label htmlFor="commission-gst" className="block text-sm font-medium text-gray-700 mb-1">
              Does the quoted rate include GST?
            </label>
            <select
              id="commission-gst"
              value={includesGst ? "yes" : "no"}
              onChange={(e) => setIncludesGst(e.target.value === "yes")}
              className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
            >
              <option value="no">No, add 10% GST</option>
              <option value="yes">Yes, GST included</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Check the agency agreement: it states the rate and whether GST is on top.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            id="marketing-budget"
            label="Marketing budget"
            value={marketing}
            onChange={setMarketing}
            prefix="$"
            step={500}
            hint="Portal listings, photography, signage. Typically $2,000 to $10,000."
          />
          <NumberInput
            id="conveyancing-fees"
            label="Conveyancing"
            value={conveyancing}
            onChange={setConveyancing}
            prefix="$"
            step={100}
            hint="Typically $800 to $2,500."
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            id="other-costs"
            label="Other costs"
            value={other}
            onChange={setOther}
            prefix="$"
            step={500}
            hint="Styling, repairs, lender discharge fee."
          />
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <Heading className="text-lg font-semibold text-gray-900 mb-5">What Selling Costs You</Heading>
        <dl className="space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <dt className="text-sm text-gray-600">Agent commission ({rate}%{includesGst ? ", incl. GST" : ""})</dt>
            <dd className="text-sm font-semibold text-gray-900">{fmt(result.commission)}</dd>
          </div>
          {result.gst > 0 && (
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <dt className="text-sm text-gray-600">GST on commission (10%)</dt>
              <dd className="text-sm font-semibold text-gray-900">{fmt(result.gst)}</dd>
            </div>
          )}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <dt className="text-sm text-gray-600">Commission range in {state} ({STATE_RATES[state].low}% to {STATE_RATES[state].high}%, before GST)</dt>
            <dd className="text-sm text-gray-500">{fmt(result.stateLow)} to {fmt(result.stateHigh)}</dd>
          </div>
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <dt className="text-sm text-gray-600">Marketing, conveyancing and other</dt>
            <dd className="text-sm font-semibold text-gray-900">{fmt(marketing + conveyancing + other)}</dd>
          </div>
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <dt className="text-sm font-medium text-gray-900">Total cost of selling ({result.costPct}% of sale price)</dt>
            <dd className="text-base font-bold text-gray-900">{fmt(result.totalCosts)}</dd>
          </div>
          <div className="flex items-center justify-between pt-1">
            <dt className="text-sm font-medium text-gray-900">Estimated net proceeds (before loan payout)</dt>
            <dd className="text-xl font-bold text-primary">{fmt(result.net)}</dd>
          </div>
        </dl>
      </div>

      {/* Funnel CTA. The calculator answers "what does it cost"; the guide
          answers "how do I keep that number down". */}
      {showGuideCta && (
      <div className="rounded-xl border border-line bg-surface-warm p-6 sm:p-7">
        <p className="text-[11px] uppercase tracking-[0.18em] text-cta font-medium mb-2">
          Free guide
        </p>
        <h3 className="font-display text-xl sm:text-2xl text-ink leading-tight tracking-tight mb-2">
          Commission is negotiable. Most sellers never ask.
        </h3>
        <p className="text-sm text-ink-muted leading-relaxed mb-4">
          Our free selling guide covers how to compare agents on results
          instead of rate, the 10 questions to ask before you sign, and the
          fee negotiation tactics that actually work. Personalised to your
          suburb, in your inbox in 60 seconds.
        </p>
        <Link
          href="/selling-guide"
          className="inline-flex items-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3 text-sm transition-colors"
        >
          Get the free selling guide
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
      )}
    </div>
  );
}

export function NumberInput({
  id,
  label,
  value,
  onChange,
  prefix,
  step = 1000,
  hint,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  step?: number;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        )}
        <input
          id={id}
          type="number"
          min={0}
          step={step}
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className={`w-full rounded-lg border border-gray-300 ${prefix ? "pl-9" : "pl-3"} pr-3 py-3 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none`}
        />
      </div>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}
