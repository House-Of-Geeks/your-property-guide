// The arithmetic behind the renovation cost estimator on
// /guides/renovation-cost-australia-2026 (commercial intent review, 30 Sep
// 2026, section 3.7). Pure, so it can be tested, and fed only by the tables in
// src/lib/data/renovation-costs.ts so the estimate is exactly "built from the
// tables on this page": no figure lives here.
import type { StateCode } from "@/lib/data/commission-rates";
import {
  COST_ITEM_BY_KEY,
  FINISH_LABELS,
  ON_COSTS,
  REGIONAL_ADJUSTMENT_PCT,
  RENOVATION_SOURCES,
  STATE_COSTS,
  type Cell,
  type Finish,
  type ItemKey,
  type Range,
} from "@/lib/data/renovation-costs";

export interface RenovationEstimateInput {
  state: StateCode;
  /** Outside a capital city: CKA's rural adjustment applies. */
  regional: boolean;
  finish: Finish;
  kitchen: boolean;
  bathrooms: number;
  laundry: boolean;
  living: boolean;
  bedrooms: number;
  extensionM2: number;
  secondStoreyM2: number;
}

export interface EstimateLine {
  key: ItemKey;
  label: string;
  quantity: number;
  unit: "each" | "m2";
  /** Unit figures after any GST added, before the state adjustment. */
  unitLow: number;
  unitHigh: number;
  low: number;
  high: number;
  open: boolean;
  /** Where the unit figure comes from, e.g. "this guide, mid-range". */
  basis: string;
}

export interface EstimateTotal {
  low: number;
  high: number;
  /** True when any line's high figure is a floor, so the total is "or more". */
  open: boolean;
}

export interface RenovationEstimate {
  lines: EstimateLine[];
  subtotal: EstimateTotal;
  /** The combined state and regional adjustment, in percent, low and high. */
  adjustment: { lowPct: number; highPct: number; label: string };
  adjusted: EstimateTotal;
  /** Adjusted total plus design and approvals and contingency (this guide's on-costs). */
  budget: EstimateTotal;
  onCostsLabel: string;
  empty: boolean;
}

const GST = 1.1;
const r = (n: number) => Math.round(n);
const clampCount = (n: number, max: number) => Math.min(max, Math.max(0, Math.floor(Number.isFinite(n) ? n : 0)));
const clampArea = (n: number) => Math.min(1_000, Math.max(0, Number.isFinite(n) ? n : 0));

/**
 * The cell the estimator uses for an item at a finish level: the level's own
 * cell when it holds a range, otherwise the mid-range cell (the basis says
 * so). Returns null only when the item has no published figure at all.
 */
export function cellForFinish(key: ItemKey, finish: Finish): { cell: Cell; fellBack: boolean } | null {
  const item = COST_ITEM_BY_KEY[key];
  const own = item.byFinish[finish];
  if (own.range) return { cell: own, fellBack: false };
  const mid = item.byFinish.mid;
  if (mid.range) return { cell: mid, fellBack: true };
  const basic = item.byFinish.basic;
  if (basic.range) return { cell: basic, fellBack: true };
  return null;
}

function unitRange(cell: Cell): Range {
  const range = cell.range as Range;
  const f = cell.exGst ? GST : 1;
  return { low: r(range.low * f), high: r(range.high * f), open: range.open };
}

function basisText(cell: Cell, finish: Finish, fellBack: boolean): string {
  const src = RENOVATION_SOURCES[cell.source].short;
  const level = fellBack
    ? `no published ${FINISH_LABELS[finish].toLowerCase()} figure, mid-range used`
    : FINISH_LABELS[finish].toLowerCase();
  return `${src}, ${level}${cell.exGst ? ", plus 10% GST" : ""}`;
}

function line(key: ItemKey, quantity: number, finish: Finish): EstimateLine | null {
  if (quantity <= 0) return null;
  const found = cellForFinish(key, finish);
  if (!found) return null;
  const item = COST_ITEM_BY_KEY[key];
  const u = unitRange(found.cell);
  return {
    key,
    label: item.label,
    quantity,
    unit: item.unit,
    unitLow: u.low,
    unitHigh: u.high,
    low: r(u.low * quantity),
    high: r(u.high * quantity),
    open: Boolean(u.open),
    basis: basisText(found.cell, finish, found.fellBack),
  };
}

/** The state adjustment the estimator applies, with the sentence it prints. */
export function stateAdjustment(state: StateCode, regional: boolean): { lowPct: number; highPct: number; label: string } {
  const s = STATE_COSTS[state];
  const cka = s.ckaPct;
  const base = cka ?? 0;
  const lowPct = base + (regional ? REGIONAL_ADJUSTMENT_PCT.low : 0);
  const highPct = base + (regional ? REGIONAL_ADJUSTMENT_PCT.high : 0);
  const city =
    cka === null
      ? `No published adjustment for ${s.capital} (the CKA indicator covers six capitals), so the metro figures apply unchanged`
      : cka === 0
        ? `${s.capital} prices at the Sydney base in the CKA indicator (June 2026), so no adjustment`
        : `${s.capital} is ${cka > 0 ? "plus" : "minus"} ${Math.abs(cka)}% against Sydney in the CKA indicator (June 2026)`;
  const rural = regional ? `; regional areas add ${REGIONAL_ADJUSTMENT_PCT.low} to ${REGIONAL_ADJUSTMENT_PCT.high}% (CKA)` : "";
  return { lowPct, highPct, label: `${city}${rural}.` };
}

export function estimateRenovation(i: RenovationEstimateInput): RenovationEstimate {
  const lines = [
    line("kitchen", i.kitchen ? 1 : 0, i.finish),
    line("bathroom", clampCount(i.bathrooms, 6), i.finish),
    line("laundry", i.laundry ? 1 : 0, i.finish),
    line("living", i.living ? 1 : 0, i.finish),
    line("bedroom", clampCount(i.bedrooms, 8), i.finish),
    line("extension", clampArea(i.extensionM2), i.finish),
    line("secondStorey", clampArea(i.secondStoreyM2), i.finish),
  ].filter((l): l is EstimateLine => l !== null);

  const subtotal: EstimateTotal = {
    low: lines.reduce((s, l) => s + l.low, 0),
    high: lines.reduce((s, l) => s + l.high, 0),
    open: lines.some((l) => l.open),
  };
  const adjustment = stateAdjustment(i.state, i.regional);
  const adjusted: EstimateTotal = {
    low: r(subtotal.low * (1 + adjustment.lowPct / 100)),
    high: r(subtotal.high * (1 + adjustment.highPct / 100)),
    open: subtotal.open,
  };
  const d = ON_COSTS.designAndApprovalsPct;
  const c = ON_COSTS.contingencyPct;
  const budget: EstimateTotal = {
    low: r(adjusted.low * (1 + (d.low + c.low) / 100)),
    high: r(adjusted.high * (1 + (d.high + c.high) / 100)),
    open: subtotal.open,
  };
  return {
    lines,
    subtotal,
    adjustment,
    adjusted,
    budget,
    onCostsLabel: `design and approvals ${d.low} to ${d.high}% plus contingency ${c.low} to ${c.high}%`,
    empty: lines.length === 0,
  };
}

/** Round a display figure to the nearest $1,000 (nearest $100 under $10,000). */
export function roundForDisplay(n: number): number {
  const step = n < 10_000 ? 100 : 1_000;
  return Math.round(n / step) * step;
}

export function defaultRenovationInput(state: StateCode = "NSW"): RenovationEstimateInput {
  return {
    state,
    regional: false,
    finish: "mid",
    kitchen: true,
    bathrooms: 1,
    laundry: false,
    living: false,
    bedrooms: 0,
    extensionM2: 0,
    secondStoreyM2: 0,
  };
}
