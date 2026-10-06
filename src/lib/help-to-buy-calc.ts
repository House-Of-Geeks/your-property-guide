// The arithmetic behind /help-to-buy-calculator and the worked example on
// /guides/help-to-buy-scheme-australia (Help to Buy plan, 7 Oct 2026). Pure,
// so the guide and the tool print the same numbers; the rules it applies are
// in src/lib/data/help-to-buy.ts with their sources.
import { calculateStampDuty, type AustralianState } from "@/lib/utils/stamp-duty";
import { monthlyRepayment } from "@/lib/utils/repayment";
import {
  HTB_COMBINED_MIN_PCT,
  HTB_INCOME_LIMITS,
  HTB_MIN_DEPOSIT_PCT,
  HTB_SHARE,
  priceCap,
  type CapArea,
  type Household,
} from "@/lib/data/help-to-buy";

/** Example rates for the opening state and the guide; the visitor replaces them. */
export const EXAMPLE_LOAN_RATE = 6.5;
export const EXAMPLE_GROWTH_RATE = 4;

export type HomeType = "new" | "existing";

export interface HtbInput {
  state: AustralianState;
  area: CapArea;
  home: HomeType;
  price: number;
  deposit: number;
  household: Household;
  /** Taxable income, combined for a joint application. */
  income: number;
  /** The government share asked for, % of the price; clamped to the scheme's range. */
  sharePct: number;
  ratePct: number;
  termYears: number;
  /** For the "what the government gets at sale" line. */
  growthPct: number;
  yearsToSale: number;
}

export interface HtbCheck {
  key: "income" | "price" | "deposit" | "combined";
  ok: boolean;
  label: string;
}

export interface HtbResult {
  status: "ok" | "invalid";
  eligible: boolean;
  checks: HtbCheck[];
  incomeLimit: number;
  cap: number;
  maxSharePct: number;
  sharePct: number;
  depositPct: number;
  governmentContribution: number;
  loan: number;
  monthlyRepayment: number;
  /** The same purchase under the 5% Deposit Scheme: your deposit (at least 5%), no government share. */
  fivePercent: { deposit: number; loan: number; monthlyRepayment: number };
  /** First home buyer stamp duty on an established home; null for a new home, where state concessions differ. */
  stampDuty: number | null;
  valueAtSale: number;
  governmentAtSale: number;
}

const r = (n: number) => Math.round(n);
const fmtPct = (n: number) => Math.round(n * 10) / 10;

export function computeHelpToBuy(i: HtbInput): HtbResult {
  const price = Math.max(0, i.price);
  const deposit = Math.max(0, Math.min(i.deposit, price));
  const range = HTB_SHARE[i.home];
  const sharePct = Math.max(range.min, Math.min(range.max, i.sharePct || range.max));
  const depositPct = price > 0 ? (deposit / price) * 100 : 0;
  const incomeLimit = HTB_INCOME_LIMITS[i.household];
  const cap = priceCap(i.state, i.area);
  const checks: HtbCheck[] = [
    { key: "income", ok: i.income <= incomeLimit, label: `Income under the ${fmtLimit(incomeLimit)} limit` },
    { key: "price", ok: price <= cap, label: `Price under the ${fmtLimit(cap)} cap` },
    { key: "deposit", ok: depositPct >= HTB_MIN_DEPOSIT_PCT, label: `Deposit of at least ${HTB_MIN_DEPOSIT_PCT}%` },
    { key: "combined", ok: depositPct + sharePct >= HTB_COMBINED_MIN_PCT, label: `Deposit plus government share of at least ${HTB_COMBINED_MIN_PCT}%` },
  ];
  const governmentContribution = r((price * sharePct) / 100);
  const loan = Math.max(0, price - deposit - governmentContribution);
  const fiveDeposit = Math.max(deposit, r(price * 0.05));
  const fiveLoan = Math.max(0, price - fiveDeposit);
  const valueAtSale = r(price * Math.pow(1 + Math.max(0, i.growthPct) / 100, Math.max(0, i.yearsToSale)));
  return {
    status: price > 0 ? "ok" : "invalid",
    eligible: price > 0 && checks.every((c) => c.ok),
    checks,
    incomeLimit,
    cap,
    maxSharePct: range.max,
    sharePct,
    depositPct: fmtPct(depositPct),
    governmentContribution,
    loan,
    monthlyRepayment: monthlyRepayment(loan, i.ratePct, i.termYears),
    fivePercent: { deposit: fiveDeposit, loan: fiveLoan, monthlyRepayment: monthlyRepayment(fiveLoan, i.ratePct, i.termYears) },
    stampDuty: i.home === "existing" ? r(calculateStampDuty(price, i.state, true, false, false).total) : null,
    valueAtSale,
    governmentAtSale: r((valueAtSale * sharePct) / 100),
  };
}

function fmtLimit(n: number): string {
  return `$${n.toLocaleString("en-AU")}`;
}

/**
 * The calculator's opening state, which is also the guide's worked example:
 * a single buyer on $95,000 buying a $700,000 existing home in Melbourne with
 * a 2% deposit and the government's full 30%.
 */
export function defaultHtbInput(): HtbInput {
  return {
    state: "VIC",
    area: "capital",
    home: "existing",
    price: 700_000,
    deposit: 14_000,
    household: "single",
    income: 95_000,
    sharePct: HTB_SHARE.existing.max,
    ratePct: EXAMPLE_LOAN_RATE,
    termYears: 30,
    growthPct: EXAMPLE_GROWTH_RATE,
    yearsToSale: 10,
  };
}
