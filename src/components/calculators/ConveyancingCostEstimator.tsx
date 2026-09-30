"use client";

import { useMemo, useState } from "react";
import { STATE_NAMES, STATE_RATES, type StateCode } from "@/lib/data/commission-rates";
import type { ConveyancingSide } from "@/lib/data/conveyancing-fees";
import { estimateConveyancingCost, formatFeeRange, type EstimateLine } from "@/lib/conveyancing-costs";
import { NumberInput } from "./CommissionCalculator";

const STATES = Object.keys(STATE_RATES) as StateCode[];

export interface ConveyancingCostEstimatorProps {
  initialState?: StateCode;
  initialSide?: ConveyancingSide;
  initialPrice?: number;
  /** "h3" when embedded under a guide's own h2. */
  headingLevel?: "h2" | "h3";
}

function Row({ line, muted = false }: { line: EstimateLine; muted?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3">
      <dt className={`text-sm ${muted ? "text-gray-500" : "text-gray-600"}`}>
        {line.label}
        <span className="block text-xs text-gray-400">{line.source}</span>
      </dt>
      <dd className="text-sm font-semibold text-gray-900 whitespace-nowrap">{formatFeeRange(line)}</dd>
    </div>
  );
}

/**
 * State, buying or selling, and price in; the published professional fee
 * range for that state plus the disbursements a standard transaction pays,
 * with the exact 2026/27 registry and PEXA fees where the state publishes
 * them. Mortgage and strata lines are shown as additions rather than asked
 * for, so the tool stays at three inputs.
 */
export function ConveyancingCostEstimator({
  initialState = "NSW",
  initialSide = "buy",
  initialPrice = 800_000,
  headingLevel = "h2",
}: ConveyancingCostEstimatorProps = {}) {
  const Heading = headingLevel;
  const [state, setState] = useState<StateCode>(initialState);
  const [side, setSide] = useState<ConveyancingSide>(initialSide);
  const [price, setPrice] = useState(initialPrice);
  const est = useMemo(() => estimateConveyancingCost({ state, side, price }), [state, side, price]);
  const field = "w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white";
  const name = STATE_NAMES[state];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <Heading className="text-lg font-semibold text-gray-900">Your transaction</Heading>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="cc-state" className="block text-sm font-medium text-gray-700 mb-1">State or territory</label>
            <select id="cc-state" value={state} onChange={(e) => setState(e.target.value as StateCode)} className={field}>
              {STATES.map((s) => <option key={s} value={s}>{STATE_NAMES[s].replace(/^the /, "")}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="cc-side" className="block text-sm font-medium text-gray-700 mb-1">Buying or selling</label>
            <select id="cc-side" value={side} onChange={(e) => setSide(e.target.value as ConveyancingSide)} className={field}>
              <option value="buy">Buying</option>
              <option value="sell">Selling</option>
            </select>
          </div>
          <NumberInput id="cc-price" label="Property price" value={price} onChange={setPrice} prefix="$" step={25_000} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <Heading className="text-lg font-semibold text-gray-900 mb-1">
          Conveyancing cost estimate: {side === "buy" ? "buying" : "selling"} in {name}
        </Heading>
        <p className="text-xs text-gray-500 mb-5">{est.practitioner}. Figures include GST.</p>
        <dl className="space-y-3">
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3">
            <dt className="text-sm text-gray-600">
              Professional fee
              <span className="block text-xs text-gray-400">{est.professionalSource}</span>
            </dt>
            <dd className="text-sm font-semibold text-gray-900 whitespace-nowrap">{formatFeeRange(est.professional)}</dd>
          </div>
          {est.lines.map((l) => <Row key={l.key} line={l} />)}
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <dt className="text-sm font-medium text-gray-900">Disbursements</dt>
            <dd className="text-sm font-semibold text-gray-900">{formatFeeRange(est.disbursements)}</dd>
          </div>
          <div className="flex items-center justify-between pb-1">
            <dt className="text-base font-semibold text-gray-900">Estimated total</dt>
            <dd className="text-lg font-bold text-gray-900">{formatFeeRange(est.total)}</dd>
          </div>
        </dl>
        {est.average && (
          <p className="text-xs text-gray-500 mt-3">
            Published average professional fee for {name}: ${est.average.amount.toLocaleString("en-AU")} ({est.average.source}).
          </p>
        )}
        {est.mortgageLines.length > 0 && (
          <div className="mt-5">
            <p className="text-sm font-medium text-gray-900 mb-2">If there is a mortgage, add</p>
            <dl className="space-y-3">{est.mortgageLines.map((l) => <Row key={l.key} line={l} muted />)}</dl>
          </div>
        )}
        {est.strataLines.length > 0 && (
          <div className="mt-5">
            <p className="text-sm font-medium text-gray-900 mb-2">If it is a strata or owners-corporation property, add</p>
            <dl className="space-y-3">{est.strataLines.map((l) => <Row key={l.key} line={l} muted />)}</dl>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-5">
          An estimate from published fee ranges and the 2026/27 registry and PEXA schedules, not a quote. Transfer (stamp) duty is separate; get a fixed-fee quote that lists every disbursement before you engage anyone.
        </p>
      </div>
    </div>
  );
}
