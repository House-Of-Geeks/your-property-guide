// The arithmetic behind the conveyancing cost estimator on
// /guides/conveyancing-guide. Pure, so it can be tested and so the guide's
// worked examples and the estimator print the same figures from
// src/lib/data/conveyancing-fees.ts.
import type { StateCode } from "@/lib/data/commission-rates";
import {
  CONVEYANCING_FEES,
  NSW_LRS_DEALING_FEE,
  QLD_TRANSFER,
  STATE_DISBURSEMENTS,
  VIC_TRANSFER,
  type ConveyancingSide,
  type DisbursementLine,
  type FeeRange,
} from "@/lib/data/conveyancing-fees";

export interface ConveyancingEstimateInput {
  state: StateCode;
  side: ConveyancingSide;
  price: number;
}

export interface EstimateLine {
  key: string;
  label: string;
  low: number;
  high: number;
  source: string;
}

export interface ConveyancingEstimate {
  state: StateCode;
  side: ConveyancingSide;
  price: number;
  practitioner: string;
  professional: FeeRange;
  professionalSource: string;
  average?: { amount: number; source: string };
  /** Disbursements every transaction of this kind pays, registration included. */
  lines: EstimateLine[];
  /** Added when there is a mortgage to register or discharge. */
  mortgageLines: EstimateLine[];
  /** Added for a strata or owners-corporation property. */
  strataLines: EstimateLine[];
  disbursements: FeeRange;
  total: FeeRange;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Land Use Victoria electronic transfer lodgement fee, 2026/27. */
export function vicTransferLodgementFee(price: number): number {
  const p = Math.max(0, price);
  const fee = VIC_TRANSFER.base + VIC_TRANSFER.perThousand * Math.floor(p / 1_000);
  return round2(Math.min(VIC_TRANSFER.cap, fee));
}

/** Titles Queensland transfer lodgement fee, FY2026/27. */
export function qldTransferLodgementFee(price: number): number {
  const p = Math.max(0, price);
  const over = Math.max(0, p - QLD_TRANSFER.threshold);
  return round2(QLD_TRANSFER.base + Math.ceil(over / 10_000) * QLD_TRANSFER.perTenThousand);
}

/**
 * The buyer's transfer registration fee where the state publishes an exact
 * figure. WA, SA, TAS, ACT and NT fold registration into a sourced
 * disbursement range instead, so this returns null for them.
 */
export function transferRegistrationLine(state: StateCode, price: number): EstimateLine | null {
  switch (state) {
    case "NSW":
      return { key: "registration", label: "Transfer registration (NSW LRS)", low: NSW_LRS_DEALING_FEE, high: NSW_LRS_DEALING_FEE, source: "NSW LRS customer fees from 1 July 2026" };
    case "VIC": {
      const fee = vicTransferLodgementFee(price);
      return { key: "registration", label: "Transfer lodgement (Land Use Victoria)", low: fee, high: fee, source: "Land Use Victoria 2026/27: $104.30 plus $2.34 per whole $1,000, capped at $3,614 (All Conveyancing Australia, 28 Aug 2026)" };
    }
    case "QLD": {
      const fee = qldTransferLodgementFee(price);
      return { key: "registration", label: "Transfer lodgement (Titles Queensland)", low: fee, high: fee, source: "Titles Queensland FY2026/27: $248.04 plus $46.56 per $10,000 or part over $180,000" };
    }
    default:
      return null;
  }
}

const toLine = (d: DisbursementLine): EstimateLine => ({ key: d.key, label: d.label, low: d.low, high: d.high, source: d.source });

export function estimateConveyancingCost(input: ConveyancingEstimateInput): ConveyancingEstimate {
  const price = Math.max(0, input.price);
  const fees = CONVEYANCING_FEES[input.state];
  const professional = input.side === "buy" ? fees.buy : fees.sell;
  const all = STATE_DISBURSEMENTS[input.state][input.side];

  // NSW's flat registration fee is already a data line; VIC and QLD are
  // price-based, so the engine inserts them for buyers.
  const lines = all.filter((d) => d.when === "always").map(toLine);
  if (input.side === "buy" && input.state !== "NSW") {
    const reg = transferRegistrationLine(input.state, price);
    if (reg) lines.push(reg);
  }
  const mortgageLines = all.filter((d) => d.when === "mortgage").map(toLine);
  const strataLines = all.filter((d) => d.when === "strata").map(toLine);

  const disbursements: FeeRange = {
    low: Math.round(lines.reduce((s, l) => s + l.low, 0)),
    high: Math.round(lines.reduce((s, l) => s + l.high, 0)),
  };
  return {
    state: input.state,
    side: input.side,
    price,
    practitioner: fees.practitioner,
    professional,
    professionalSource: fees.source,
    average: fees.average,
    lines,
    mortgageLines,
    strataLines,
    disbursements,
    total: { low: professional.low + disbursements.low, high: professional.high + disbursements.high },
  };
}

/** "$1,463" or "$182.73": whole dollars stay whole, cents show two places. */
export function formatFee(n: number): string {
  const whole = Number.isInteger(n);
  return `$${(whole ? n : round2(n)).toLocaleString("en-AU", { minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: 2 })}`;
}

/** Table cells "$1,000–$2,500"; prose "$1,000 to $2,500". One figure when low equals high. */
export function formatFeeRange(r: FeeRange, style: "cell" | "prose" = "cell"): string {
  if (r.low === r.high) return formatFee(r.low);
  return `${formatFee(r.low)}${style === "prose" ? " to " : "–"}${formatFee(r.high)}`;
}
