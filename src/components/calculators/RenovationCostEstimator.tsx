"use client";

import { useMemo, useState } from "react";
import type { StateCode } from "@/lib/data/commission-rates";
import {
  COST_ITEM_BY_KEY,
  FINISHES,
  FINISH_LABELS,
  RENOVATION_COSTS_AS_AT,
  STATE_COSTS,
  STATE_ORDER,
  money,
  type Finish,
} from "@/lib/data/renovation-costs";
import {
  defaultRenovationInput,
  estimateRenovation,
  roundForDisplay,
  type RenovationEstimateInput,
} from "@/lib/renovation-estimate";

/**
 * Renovation cost estimator (commercial intent review, 30 Sep 2026, section
 * 3.7). Rooms, finish level and state in; a low-to-high range out. Every
 * figure comes from src/lib/data/renovation-costs.ts through
 * src/lib/renovation-estimate.ts, so the estimate is built from the tables on
 * the page and says so. No WebApplication schema: this is a guide section,
 * not a standalone tool.
 */
export function RenovationCostEstimator({ initialState = "NSW" }: { initialState?: StateCode }) {
  const [input, setInput] = useState<RenovationEstimateInput>(() => defaultRenovationInput(initialState));
  const set = <K extends keyof RenovationEstimateInput>(key: K, value: RenovationEstimateInput[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const result = useMemo(() => estimateRenovation(input), [input]);
  const fmt = (n: number) => money(roundForDisplay(n));
  const total = (t: { low: number; high: number; open: boolean }) =>
    `${fmt(t.low)} to ${fmt(t.high)}${t.open ? " or more" : ""}`;
  // A premium line with no published ceiling ($60,000+) has low equal to high.
  const lineText = (l: { low: number; high: number; open: boolean }) =>
    l.low === l.high ? `${fmt(l.low)}${l.open ? "+" : ""}` : `${fmt(l.low)} to ${fmt(l.high)}${l.open ? "+" : ""}`;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Your renovation</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="reno-state" className="block text-sm font-medium text-gray-700 mb-1">
              State or territory
            </label>
            <select
              id="reno-state"
              value={input.state}
              onChange={(e) => set("state", e.target.value as StateCode)}
              className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
            >
              {STATE_ORDER.map((s) => (
                <option key={s} value={s}>{s} ({STATE_COSTS[s].capital})</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="reno-finish" className="block text-sm font-medium text-gray-700 mb-1">
              Finish level
            </label>
            <select
              id="reno-finish"
              value={input.finish}
              onChange={(e) => set("finish", e.target.value as Finish)}
              className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
            >
              {FINISHES.map((f) => (
                <option key={f} value={f}>{FINISH_LABELS[f]}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700 pb-3">
              <input
                type="checkbox"
                checked={input.regional}
                onChange={(e) => set("regional", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              Regional, outside the capital
            </label>
          </div>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-gray-700 mb-2">Rooms</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Check id="reno-kitchen" label={COST_ITEM_BY_KEY.kitchen.label} checked={input.kitchen} onChange={(v) => set("kitchen", v)} />
            <Check id="reno-laundry" label={COST_ITEM_BY_KEY.laundry.label} checked={input.laundry} onChange={(v) => set("laundry", v)} />
            <Check id="reno-living" label={COST_ITEM_BY_KEY.living.label} checked={input.living} onChange={(v) => set("living", v)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Count id="reno-bathrooms" label="Bathrooms or ensuites renovated" value={input.bathrooms} max={6} onChange={(v) => set("bathrooms", v)} />
            <Count id="reno-bedrooms" label="Bedrooms refreshed" value={input.bedrooms} max={8} onChange={(v) => set("bedrooms", v)} />
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium text-gray-700 mb-2">Adding space (shell only; add rooms above for any new kitchen or bathroom)</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Area id="reno-extension" label="Ground-floor extension, m²" value={input.extensionM2} onChange={(v) => set("extensionM2", v)} />
            <Area id="reno-second-storey" label="Second storey, m²" value={input.secondStoreyM2} onChange={(v) => set("secondStoreyM2", v)} />
          </div>
        </fieldset>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6" aria-live="polite">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Estimated cost</h3>
        <p className="text-xs text-gray-500 mb-5">
          An estimate built from the tables on this page, as at {RENOVATION_COSTS_AS_AT}. Not a quote.
        </p>
        {result.empty ? (
          <p className="text-sm text-gray-600">Tick a room or enter an area to see a range.</p>
        ) : (
          <dl className="space-y-3">
            {result.lines.map((l) => (
              <div key={l.key} className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4 border-b border-gray-100 pb-3">
                <dt className="text-sm text-gray-600">
                  {l.label}
                  {l.unit === "m2" ? ` (${l.quantity} m² at ${money(l.unitLow)} to ${money(l.unitHigh)}/m²)` : l.quantity > 1 ? ` (${l.quantity} at ${money(l.unitLow)} to ${money(l.unitHigh)} each)` : ""}
                  <span className="block text-xs text-gray-400">{l.basis}</span>
                </dt>
                <dd className="text-sm font-semibold text-gray-900 sm:whitespace-nowrap">
                  {lineText(l)}
                </dd>
              </div>
            ))}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4 border-b border-gray-100 pb-3">
              <dt className="text-sm text-gray-600">Metro subtotal, incl. GST</dt>
              <dd className="text-sm font-semibold text-gray-900 sm:whitespace-nowrap">{total(result.subtotal)}</dd>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4 border-b border-gray-200 pb-3">
              <dt className="text-sm text-gray-600">
                Adjusted for {STATE_COSTS[input.state].capital}{input.regional ? " and regional" : ""}
                {" "}({result.adjustment.lowPct === result.adjustment.highPct
                  ? result.adjustment.lowPct === 0
                    ? "no adjustment"
                    : `${result.adjustment.lowPct > 0 ? "+" : ""}${result.adjustment.lowPct}%`
                  : `+${result.adjustment.lowPct}% to +${result.adjustment.highPct}%`})
                <span className="block text-xs text-gray-400">{result.adjustment.label}</span>
              </dt>
              <dd className="text-base font-bold text-gray-900 sm:whitespace-nowrap">{total(result.adjusted)}</dd>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4 pt-1">
              <dt className="text-sm font-medium text-gray-900">
                Budget to plan for
                <span className="block text-xs text-gray-400">
                  Adds {result.onCostsLabel}. Scope creep (3 to 7%) and somewhere to live during the build are extra.
                </span>
              </dt>
              <dd className="text-xl font-bold text-primary sm:whitespace-nowrap">{total(result.budget)}</dd>
            </div>
          </dl>
        )}
      </div>
    </div>
  );
}

function Check({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label htmlFor={id} className="inline-flex items-center gap-2 text-sm text-gray-700">
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
      {label}
    </label>
  );
}

function Count({ id, label, value, max, onChange }: { id: string; label: string; value: number; max: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
      >
        {Array.from({ length: max + 1 }, (_, n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
    </div>
  );
}

function Area({ id, label, value, onChange }: { id: string; label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        id={id}
        type="number"
        min={0}
        max={1000}
        step={5}
        value={value || ""}
        placeholder="0"
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
      />
    </div>
  );
}
