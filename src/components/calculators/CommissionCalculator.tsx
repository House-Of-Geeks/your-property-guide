"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DollarSign, ArrowRight } from "lucide-react";
import { formatPriceFull } from "@/lib/utils/format";

// Typical residential commission ranges by state, mid-2026. These are
// market-wide ranges, not quotes: metro suburbs sit at the low end,
// regional at the high end. Sources: published averages from the major
// agent-comparison platforms, cross-checked in docs/lead-gen-strategy.md.
type StateCode = "NSW" | "VIC" | "QLD" | "SA" | "WA" | "TAS" | "NT" | "ACT";

const STATE_RATES: Record<StateCode, { low: number; high: number; typical: number }> = {
  NSW: { low: 1.8, high: 2.5,  typical: 2.0 },
  VIC: { low: 1.6, high: 2.5,  typical: 2.0 },
  QLD: { low: 2.3, high: 2.9,  typical: 2.5 },
  SA:  { low: 1.8, high: 2.75, typical: 2.0 },
  WA:  { low: 2.0, high: 2.8,  typical: 2.4 },
  TAS: { low: 2.5, high: 3.25, typical: 2.9 },
  NT:  { low: 2.4, high: 2.7,  typical: 2.5 },
  ACT: { low: 1.8, high: 2.25, typical: 2.1 },
};

const STATES = Object.keys(STATE_RATES) as StateCode[];

export function CommissionCalculator() {
  const [state, setState] = useState<StateCode>("NSW");
  const [salePrice, setSalePrice] = useState(850_000);
  const [rate, setRate] = useState(STATE_RATES.NSW.typical);
  const [rateTouched, setRateTouched] = useState(false);
  const [marketing, setMarketing] = useState(4_000);
  const [conveyancing, setConveyancing] = useState(1_400);
  const [other, setOther] = useState(0);

  const onStateChange = (s: StateCode) => {
    setState(s);
    // Track the state's typical rate until the user has set their own.
    if (!rateTouched) setRate(STATE_RATES[s].typical);
  };

  const result = useMemo(() => {
    const commission = (salePrice * rate) / 100;
    const totalCosts = commission + marketing + conveyancing + other;
    const net = salePrice - totalCosts;
    return {
      commission: Math.round(commission),
      totalCosts: Math.round(totalCosts),
      net: Math.round(net),
      costPct: salePrice > 0 ? Math.round((totalCosts / salePrice) * 1000) / 10 : 0,
      stateLow: Math.round((salePrice * STATE_RATES[state].low) / 100),
      stateHigh: Math.round((salePrice * STATE_RATES[state].high) / 100),
    };
  }, [salePrice, rate, marketing, conveyancing, other, state]);

  const fmt = (n: number) => formatPriceFull(n);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Inputs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Your Sale</h2>
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
              Check whether quotes include GST; add 10% to the commission if not.
            </p>
          </div>
          <NumberInput
            id="marketing-budget"
            label="Marketing budget"
            value={marketing}
            onChange={setMarketing}
            prefix="$"
            step={500}
            hint="Portal listings, photography, signage. Typically $2,000 to $10,000."
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            id="conveyancing-fees"
            label="Conveyancing"
            value={conveyancing}
            onChange={setConveyancing}
            prefix="$"
            step={100}
            hint="Typically $800 to $2,500."
          />
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
        <h2 className="text-lg font-semibold text-gray-900 mb-5">What Selling Costs You</h2>
        <dl className="space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <dt className="text-sm text-gray-600">Agent commission ({rate}%)</dt>
            <dd className="text-sm font-semibold text-gray-900">{fmt(result.commission)}</dd>
          </div>
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <dt className="text-sm text-gray-600">Commission range in {state} ({STATE_RATES[state].low}% to {STATE_RATES[state].high}%)</dt>
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
    </div>
  );
}

function NumberInput({
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
