// The arithmetic behind the agent proposal worksheet (/tools/agent-proposal-
// worksheet, Oct 2026). Pure, so it is unit-tested and the page can't drift
// from the tests. A seller types in two or three agents' proposals; this
// works out what each would cost in dollars at the SAME expected price, what
// the seller keeps before the loan payout and conveyancing, and a few neutral
// flags worth asking the agent about.
//
// Rules, said once:
//   - Commission is a percentage of the price or a fixed fee, quoted plus GST
//     or including it. GST is 10%.
//   - Marketing and the auctioneer's fee share one GST setting (proposals
//     usually quote them the same way).
//   - The typical commission range is STATE_RATES (commission-rates.ts), which
//     is quoted before GST, so a rate is compared with it before GST too.
//   - The flags use fixed, stated thresholds: an estimate more than
//     ESTIMATE_GAP_PCT above the average of the others' with no comparable
//     sales cited; marketing payable if unsold with no cap; a term longer than
//     LONG_TERM_DAYS; commission outside the state's typical range.
//
// Nothing here is advice, and nothing leaves the browser: the worksheet keeps
// its state in localStorage only.

import { STATE_NAMES, STATE_RATES, type StateCode } from "@/lib/data/commission-rates";

export const GST_RATE = 0.1;
/** An agreement longer than this is flagged. */
export const LONG_TERM_DAYS = 90;
/** An estimate this far (percent) above the average of the others is flagged when no comparable sales were cited. */
export const ESTIMATE_GAP_PCT = 5;
export const MAX_AGENTS = 3;
export const MIN_AGENTS = 2;
export const STORAGE_KEY = "ypg:proposal-worksheet:v1";

export type CommissionBasis = "percent" | "fixed";
export type GstBasis = "plus" | "included";
export type YesNo = "" | "yes" | "no";
export type SaleMethod = "" | "private-sale" | "auction" | "expressions-of-interest" | "undecided";
export type Negotiator = "" | "listing-agent" | "someone-else" | "not-said";

export const SALE_METHODS: ReadonlyArray<{ id: Exclude<SaleMethod, "">; label: string }> = [
  { id: "private-sale", label: "Private sale" },
  { id: "auction", label: "Auction" },
  { id: "expressions-of-interest", label: "Expressions of interest" },
  { id: "undecided", label: "Not decided yet" },
];

export const NEGOTIATORS: ReadonlyArray<{ id: Exclude<Negotiator, "">; label: string }> = [
  { id: "listing-agent", label: "The agent I met" },
  { id: "someone-else", label: "Someone else in the agency" },
  { id: "not-said", label: "They didn’t say" },
];

export const STATE_CODES = Object.keys(STATE_RATES) as StateCode[];

// ---------------------------------------------------------------------------
// What the form holds (strings, as typed) and what the maths uses (numbers)
// ---------------------------------------------------------------------------

/** One agent's proposal as typed. Strings, so "850,000" stays as the person wrote it. */
export interface ProposalDraft {
  name: string;
  estimateLow: string;
  estimateHigh: string;
  commissionBasis: CommissionBasis;
  commission: string;
  commissionGst: GstBasis;
  marketing: string;
  marketingIfUnsold: YesNo;
  marketingCapped: YesNo;
  auctioneer: string;
  otherFeesGst: GstBasis;
  method: SaleMethod;
  termDays: string;
  noticeDays: string;
  comparables: YesNo;
  negotiator: Negotiator;
}

export interface WorksheetDraft {
  version: 1;
  /** The person's own expected price, as typed; used once expectedPriceSet is true. */
  expectedPrice: string;
  expectedPriceSet: boolean;
  state: StateCode | "";
  agents: ProposalDraft[];
}

export interface ProposalFigures {
  estimateLow: number | null;
  estimateHigh: number | null;
  commissionBasis: CommissionBasis;
  /** A percentage (2.2) or dollars (18000), depending on the basis. */
  commission: number | null;
  commissionGst: GstBasis;
  marketing: number | null;
  marketingIfUnsold: YesNo;
  marketingCapped: YesNo;
  auctioneer: number | null;
  otherFeesGst: GstBasis;
  method: SaleMethod;
  termDays: number | null;
  noticeDays: number | null;
  comparables: YesNo;
  negotiator: Negotiator;
}

export function emptyProposal(): ProposalDraft {
  return {
    name: "",
    estimateLow: "",
    estimateHigh: "",
    commissionBasis: "percent",
    // Most agents quote commission before GST (the selling costs calculator's FAQ).
    commission: "",
    commissionGst: "plus",
    marketing: "",
    marketingIfUnsold: "",
    marketingCapped: "",
    auctioneer: "",
    otherFeesGst: "included",
    method: "",
    termDays: "",
    noticeDays: "",
    comparables: "",
    negotiator: "",
  };
}

export function emptyWorksheet(): WorksheetDraft {
  return { version: 1, expectedPrice: "", expectedPriceSet: false, state: "", agents: [emptyProposal(), emptyProposal()] };
}

/**
 * A dollar amount as people type it: "$850,000", "850000", "850k", "1.2m".
 * Null when empty, unreadable or negative.
 */
export function parseAmount(raw: string | null | undefined): number | null {
  if (raw == null) return null;
  const s = String(raw).trim().toLowerCase().replace(/[$,\s]/g, "").replace(/aud$/, "");
  if (!s) return null;
  const m = /^(\d+(?:\.\d+)?|\.\d+)(k|m)?$/.exec(s);
  if (!m) return null;
  const n = Number(m[1]) * (m[2] === "k" ? 1_000 : m[2] === "m" ? 1_000_000 : 1);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/** A percentage as typed: "2.2", "2.2%". */
export function parsePercent(raw: string | null | undefined): number | null {
  if (raw == null) return null;
  const s = String(raw).trim().replace(/%$/, "").trim();
  if (!s || !/^(\d+(?:\.\d+)?|\.\d+)$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/** Whole days as typed: "90", "90 days". */
export function parseDays(raw: string | null | undefined): number | null {
  if (raw == null) return null;
  const s = String(raw).trim().toLowerCase().replace(/\s*days?$/, "");
  if (!s || !/^\d+$/.test(s)) return null;
  return Number(s);
}

export function toFigures(d: ProposalDraft): ProposalFigures {
  return {
    estimateLow: parseAmount(d.estimateLow),
    estimateHigh: parseAmount(d.estimateHigh),
    commissionBasis: d.commissionBasis,
    commission: d.commissionBasis === "percent" ? parsePercent(d.commission) : parseAmount(d.commission),
    commissionGst: d.commissionGst,
    marketing: parseAmount(d.marketing),
    marketingIfUnsold: d.marketingIfUnsold,
    marketingCapped: d.marketingCapped,
    auctioneer: parseAmount(d.auctioneer),
    otherFeesGst: d.otherFeesGst,
    method: d.method,
    termDays: parseDays(d.termDays),
    noticeDays: parseDays(d.noticeDays),
    comparables: d.comparables,
    negotiator: d.negotiator,
  };
}

// ---------------------------------------------------------------------------
// Checks on what was typed (tied to the field on the page)
// ---------------------------------------------------------------------------

export type ProposalField = keyof ProposalDraft;
export type ProposalErrors = Partial<Record<ProposalField, string>>;

const PRICE_FLOOR = 10_000;

/** Messages for figures that can't be right, keyed by field. Empty when all is well. */
export function validateProposal(d: ProposalDraft): ProposalErrors {
  const e: ProposalErrors = {};
  const unreadable = "Enter a number, for example 850,000";
  for (const k of ["estimateLow", "estimateHigh", "marketing", "auctioneer"] as const) {
    if (d[k].trim() && parseAmount(d[k]) === null) e[k] = unreadable;
  }
  const low = parseAmount(d.estimateLow);
  const high = parseAmount(d.estimateHigh);
  if (low !== null && low > 0 && low < PRICE_FLOOR) e.estimateLow = "Enter the full price in dollars, for example 850,000";
  if (high !== null && high > 0 && high < PRICE_FLOOR) e.estimateHigh = "Enter the full price in dollars, for example 900,000";
  if (!e.estimateLow && !e.estimateHigh && low !== null && high !== null && low > high) {
    e.estimateHigh = "The high estimate is below the low one";
  }
  if (d.commission.trim()) {
    if (d.commissionBasis === "percent") {
      const rate = parsePercent(d.commission);
      if (rate === null) e.commission = "Enter the rate as a percentage, for example 2.2";
      else if (rate > 10) e.commission = "That’s more than 10%. Enter the rate as a percentage, for example 2.2";
    } else {
      const fee = parseAmount(d.commission);
      if (fee === null) e.commission = "Enter the fee in dollars, for example 18,000";
      else if (fee > 0 && fee < 100) e.commission = "That looks like a percentage. Choose ‘% of the sale price’ above, or enter the fee in dollars";
    }
  }
  for (const k of ["termDays", "noticeDays"] as const) {
    if (d[k].trim() && parseDays(d[k]) === null) e[k] = "Enter a whole number of days, for example 90";
  }
  return e;
}

/** The expected price as typed, checked. */
export function validateExpectedPrice(raw: string): string | null {
  if (!raw.trim()) return null;
  const n = parseAmount(raw);
  if (n === null) return "Enter a number, for example 850,000";
  if (n > 0 && n < PRICE_FLOOR) return "Enter the full price in dollars, for example 850,000";
  return null;
}

// ---------------------------------------------------------------------------
// The maths
// ---------------------------------------------------------------------------

/** The middle of one agent's estimate; one end alone when only one is given. */
export function estimateMidpoint(low: number | null, high: number | null): number | null {
  const lo = low && low > 0 ? low : null;
  const hi = high && high > 0 ? high : null;
  if (lo !== null && hi !== null) return (lo + hi) / 2;
  return lo ?? hi;
}

/** The worksheet's starting price: the average of the agents' midpoints, to the nearest $1,000. */
export function defaultExpectedPrice(agents: readonly ProposalFigures[]): number | null {
  const mids = agents.map((a) => estimateMidpoint(a.estimateLow, a.estimateHigh)).filter((m): m is number => m !== null && m >= PRICE_FLOOR);
  if (mids.length === 0) return null;
  return Math.round(mids.reduce((s, m) => s + m, 0) / mids.length / 1_000) * 1_000;
}

/** The price the costs are worked at: the person's own figure when they've given one, otherwise the default. */
export function effectiveExpectedPrice(draft: Pick<WorksheetDraft, "expectedPrice" | "expectedPriceSet">, agents: readonly ProposalFigures[]): { price: number | null; fromEstimates: boolean } {
  const own = draft.expectedPriceSet ? parseAmount(draft.expectedPrice) : null;
  if (own !== null && own >= PRICE_FLOOR) return { price: own, fromEstimates: false };
  return { price: defaultExpectedPrice(agents), fromEstimates: true };
}

export interface ProposalCost {
  commissionExGst: number;
  commissionGst: number;
  commissionInclGst: number;
  marketingInclGst: number;
  auctioneerInclGst: number;
  /** Commission + marketing + auctioneer, GST included. */
  totalCost: number;
  /** Total cost as a percentage of the price, one decimal. */
  totalCostPct: number;
  /** Commission before GST as a percentage of the price, two decimals. */
  rateExGst: number;
  /** The price less the total cost: before the loan payout, conveyancing and the state's documents. */
  keep: number;
}

const round = (n: number) => Math.round(n);
const withGst = (n: number, basis: GstBasis) => (basis === "included" ? n : n * (1 + GST_RATE));
const round2 = (n: number) => Math.round(n * 100) / 100;

/** One proposal's cost at a price. Null until the commission is known (and the price is). */
export function proposalCost(f: ProposalFigures, price: number | null): ProposalCost | null {
  if (price === null || price <= 0 || f.commission === null) return null;
  const quoted = f.commissionBasis === "percent" ? (price * f.commission) / 100 : f.commission;
  const inclRaw = withGst(quoted, f.commissionGst);
  const exRaw = f.commissionGst === "included" ? quoted / (1 + GST_RATE) : quoted;
  const commissionInclGst = round(inclRaw);
  const commissionExGst = round(exRaw);
  const marketingInclGst = round(withGst(f.marketing ?? 0, f.otherFeesGst));
  const auctioneerInclGst = round(withGst(f.auctioneer ?? 0, f.otherFeesGst));
  const totalCost = commissionInclGst + marketingInclGst + auctioneerInclGst;
  return {
    commissionExGst,
    commissionGst: commissionInclGst - commissionExGst,
    commissionInclGst,
    marketingInclGst,
    auctioneerInclGst,
    totalCost,
    totalCostPct: Math.round((totalCost / price) * 1000) / 10,
    rateExGst: round2((exRaw / price) * 100),
    keep: price - totalCost,
  };
}

export type FlagKey = "estimate-above-others" | "marketing-unsold-uncapped" | "long-term" | "commission-outside-range";

export interface ProposalFlag {
  key: FlagKey;
  text: string;
}

/** "2.2", "2.25", "2" (no trailing zeros). */
export const pctText = (n: number) => `${round2(n)}%`;

/** "$850,000"; "−$1,200" for a negative. */
export function aud(n: number): string {
  const s = `$${Math.abs(Math.round(n)).toLocaleString("en-AU")}`;
  return n < 0 ? `−${s}` : s;
}

/** Points worth raising with one agent, in neutral words. */
export function proposalFlags(
  index: number,
  agents: readonly ProposalFigures[],
  cost: ProposalCost | null,
  state: StateCode | null,
): ProposalFlag[] {
  const f = agents[index];
  const flags: ProposalFlag[] = [];

  const mid = estimateMidpoint(f.estimateLow, f.estimateHigh);
  const others = agents
    .filter((_, i) => i !== index)
    .map((a) => estimateMidpoint(a.estimateLow, a.estimateHigh))
    .filter((m): m is number => m !== null);
  if (mid !== null && others.length > 0 && f.comparables !== "yes") {
    const avg = others.reduce((s, m) => s + m, 0) / others.length;
    const gap = ((mid - avg) / avg) * 100;
    if (gap > ESTIMATE_GAP_PCT) {
      const pct = Math.round(gap);
      flags.push({
        key: "estimate-above-others",
        text:
          f.comparables === "no"
            ? `Their estimate is about ${pct}% above the others’, and they didn’t show recent comparable sales. Ask which sales support it.`
            : `Their estimate is about ${pct}% above the others’. Ask which recent comparable sales support it.`,
      });
    }
  }

  if (f.marketingIfUnsold === "yes" && f.marketingCapped === "no") {
    flags.push({
      key: "marketing-unsold-uncapped",
      text: "Marketing is payable even if the property doesn’t sell, and the amount isn’t capped. Ask for a fixed or capped figure in the agreement.",
    });
  }

  if (f.termDays !== null && f.termDays > LONG_TERM_DAYS) {
    flags.push({
      key: "long-term",
      text: `The agreement runs for ${f.termDays} days, longer than ${LONG_TERM_DAYS}. Check how you could end it early and what notice that needs.`,
    });
  }

  if (cost && state) {
    const range = STATE_RATES[state];
    const where = STATE_NAMES[state];
    const how = f.commissionBasis === "fixed" ? "Their fixed fee works out to about" : "Their commission is";
    if (cost.rateExGst > range.high) {
      flags.push({
        key: "commission-outside-range",
        text: `${how} ${pctText(cost.rateExGst)} plus GST at your expected price, above the typical ${range.low}% to ${range.high}% in ${where}. Ask what it includes, and whether it’s negotiable.`,
      });
    } else if (cost.rateExGst < range.low) {
      flags.push({
        key: "commission-outside-range",
        text: `${how} ${pctText(cost.rateExGst)} plus GST at your expected price, below the typical ${range.low}% to ${range.high}% in ${where}. Check what’s included and what’s charged separately.`,
      });
    }
  }

  return flags;
}

export interface ProposalResult {
  index: number;
  cost: ProposalCost | null;
  /** Dollars above the lowest total cost; 0 for the lowest; null without a cost. */
  aboveLowest: number | null;
  isLowest: boolean;
  flags: ProposalFlag[];
}

export interface WorksheetResult {
  price: number | null;
  priceFromEstimates: boolean;
  results: ProposalResult[];
}

/** Every proposal's cost at the same price, with the difference from the lowest and the flags. */
export function compareProposals(draft: WorksheetDraft): WorksheetResult {
  const agents = draft.agents.map(toFigures);
  const { price, fromEstimates } = effectiveExpectedPrice(draft, agents);
  const state = draft.state || null;
  const costs = agents.map((a) => proposalCost(a, price));
  const totals = costs.filter((c): c is ProposalCost => c !== null).map((c) => c.totalCost);
  const lowest = totals.length ? Math.min(...totals) : null;
  const comparable = totals.length > 1;
  return {
    price,
    priceFromEstimates: fromEstimates,
    results: agents.map((_, i) => {
      const cost = costs[i];
      return {
        index: i,
        cost,
        aboveLowest: cost && lowest !== null ? cost.totalCost - lowest : null,
        isLowest: comparable && cost !== null && cost.totalCost === lowest,
        flags: proposalFlags(i, agents, cost, state),
      };
    }),
  };
}

// ---------------------------------------------------------------------------
// Saved state (localStorage), read defensively
// ---------------------------------------------------------------------------

const str = (v: unknown, max = 40) => (typeof v === "string" ? v.slice(0, max) : "");
const oneOf = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T =>
  typeof v === "string" && (allowed as readonly string[]).includes(v) ? (v as T) : fallback;

const YES_NO: readonly YesNo[] = ["", "yes", "no"];
const METHODS: readonly SaleMethod[] = ["", ...SALE_METHODS.map((m) => m.id)];
const NEGOTIATOR_IDS: readonly Negotiator[] = ["", ...NEGOTIATORS.map((n) => n.id)];

function restoreProposal(v: unknown): ProposalDraft {
  const o = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  return {
    name: str(o.name, 80),
    estimateLow: str(o.estimateLow),
    estimateHigh: str(o.estimateHigh),
    commissionBasis: oneOf(o.commissionBasis, ["percent", "fixed"] as const, "percent"),
    commission: str(o.commission),
    commissionGst: oneOf(o.commissionGst, ["plus", "included"] as const, "plus"),
    marketing: str(o.marketing),
    marketingIfUnsold: oneOf(o.marketingIfUnsold, YES_NO, ""),
    marketingCapped: oneOf(o.marketingCapped, YES_NO, ""),
    auctioneer: str(o.auctioneer),
    otherFeesGst: oneOf(o.otherFeesGst, ["plus", "included"] as const, "included"),
    method: oneOf(o.method, METHODS, ""),
    termDays: str(o.termDays),
    noticeDays: str(o.noticeDays),
    comparables: oneOf(o.comparables, YES_NO, ""),
    negotiator: oneOf(o.negotiator, NEGOTIATOR_IDS, ""),
  };
}

/** A saved worksheet, checked field by field; null when there's nothing usable. */
export function restoreWorksheet(raw: unknown): WorksheetDraft | null {
  let v = raw;
  if (typeof v === "string") {
    try {
      v = JSON.parse(v);
    } catch {
      return null;
    }
  }
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  if (o.version !== 1 || !Array.isArray(o.agents)) return null;
  const agents = o.agents.slice(0, MAX_AGENTS).map(restoreProposal);
  while (agents.length < MIN_AGENTS) agents.push(emptyProposal());
  return {
    version: 1,
    expectedPrice: str(o.expectedPrice),
    expectedPriceSet: o.expectedPriceSet === true,
    state: oneOf(o.state, ["", ...STATE_CODES] as const, ""),
    agents,
  };
}
