// Borrowing-power estimation, shared between the full /borrowing-power-calculator
// and the MiniBorrowingPowerEmbed used inside guides. Keeping the maths in one
// place means the tool and the guide can never disagree.
//
// Method (deliberately conservative, mirrors how lenders assess serviceability):
//   net income  = gross x 0.72 (rough average tax + Medicare)
//   expenses    = max(your figure, indicative HEM for the household, income band and region)
//   surplus     = net monthly income - expenses - existing debt repayments
//   capacity    = 85% of surplus, amortised at the assessment (buffered) rate
//   price       = max loan / 0.8 (assumes a 20% deposit)

import { indicativeHem, type Household, type Region } from "@/lib/data/hem";
import { AVERAGE_NEW_VARIABLE_RATE } from "@/lib/data/rba-lending-rates";

export type { Household, Region } from "@/lib/data/hem";

export interface HemOptions {
  /** Defaults to "single"; the calculators pass "couple" when a second income is entered. */
  household?: Household;
  /** Gross annual household income; picks the income band. Defaults to the middle band. */
  grossIncome?: number;
  region?: Region;
}

/**
 * Indicative monthly HEM benchmark for a household (src/lib/data/hem.ts):
 * scaled by household composition, income band and location, as APRA's
 * guide expects lenders to do, rather than a flat figure by dependants.
 */
export function getHEM(dependants: number, opts: HemOptions = {}): number {
  return indicativeHem({
    household: opts.household ?? "single",
    dependants,
    grossIncome: opts.grossIncome ?? 100_000,
    region: opts.region ?? "capital",
  });
}

/**
 * The loan rate the default assessment rate starts from: the average rate on
 * new owner-occupier variable-rate loans, all institutions, in the RBA's
 * statistical table F6 (series FLRHOFVA). It comes from the one dated F6
 * constant in src/lib/data/rba-lending-rates.ts, which the mortgage,
 * refinancing and bridging calculators also read; update it there.
 */
export const REFERENCE_LOAN_RATE = AVERAGE_NEW_VARIABLE_RATE.rate;
export const REFERENCE_LOAN_RATE_PERIOD = AVERAGE_NEW_VARIABLE_RATE.period;
/** APRA's minimum serviceability buffer over the loan rate, confirmed at 3 percentage points on 28 May 2026. */
export const APRA_SERVICEABILITY_BUFFER = 3;
export const APRA_BUFFER_CONFIRMED = "28 May 2026";

/**
 * Default assessment (buffered) rate: the reference loan rate plus APRA's
 * buffer, 9.2% as at 30 Sep 2026. It was 7.5% until then, which implied a
 * 4.5% loan rate that no lender offered in 2026 and overstated capacity by
 * about 17%.
 */
export const DEFAULT_ASSESSMENT_RATE = Math.round((REFERENCE_LOAN_RATE + APRA_SERVICEABILITY_BUFFER) * 10) / 10;

/**
 * How much loan each dollar a month of living expenses or debt repayments
 * removes, on this engine: 85% of the dollar, amortised at the assessment
 * rate. At 9.2% over 30 years it is about $104. (The pages said "$130" until
 * 11 Oct 2026, which is the purchase price with a 20% deposit, not the loan.)
 */
export function loanPerMonthlyDollar(assessmentRate: number, termYears: number): number {
  const r = assessmentRate / 100 / 12;
  const n = termYears * 12;
  const factor = r === 0 ? n : (1 - Math.pow(1 + r, -n)) / r;
  return 0.85 * factor;
}

export interface BorrowingResult {
  maxLoan: number;
  estimatedPurchasePrice: number;
  monthlyRepayment: number;
  monthlyNetIncome: number;
  /** The living expenses deducted: the declared figure or the HEM benchmark, whichever is higher. */
  hemUsed: number;
  /** The indicative HEM benchmark for the household at this income. */
  hemBenchmark: number;
  /** Which figure hemUsed is. */
  expensesSource: "declared" | "hem";
  availableForRepayments: number;
}

export interface BorrowingOptions {
  /** Defaults to "couple" when income2 > 0, else "single". */
  household?: Household;
  region?: Region;
}

export function computeBorrowingPower(
  income1: number,
  income2: number,
  monthlyExpenses: number,
  dependants: number,
  existingDebts: number,
  assessmentRate: number,
  termYears: number,
  opts: BorrowingOptions = {}
): BorrowingResult | null {
  const grossAnnual = income1 + income2;
  if (grossAnnual <= 0) return null;

  const netAnnual = grossAnnual * 0.72;
  const monthlyNetIncome = netAnnual / 12;

  const household: Household = opts.household ?? (income2 > 0 ? "couple" : "single");
  const hemBase = getHEM(dependants, { household, grossIncome: grossAnnual, region: opts.region });
  const hemUsed = Math.max(monthlyExpenses, hemBase);

  const availableForRepayments = monthlyNetIncome - hemUsed - existingDebts;
  if (availableForRepayments <= 0) return null;

  const maxMonthlyRepayment = availableForRepayments * 0.85;

  const r = assessmentRate / 100 / 12;
  const n = termYears * 12;

  let maxLoan: number;
  if (r === 0) {
    maxLoan = maxMonthlyRepayment * n;
  } else {
    const factor = (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
    maxLoan = maxMonthlyRepayment * factor;
  }

  maxLoan = Math.max(0, maxLoan);
  const estimatedPurchasePrice = maxLoan / 0.8; // assumes 20% deposit
  const monthlyRepayment = maxMonthlyRepayment;

  return {
    maxLoan: Math.round(maxLoan),
    estimatedPurchasePrice: Math.round(estimatedPurchasePrice),
    monthlyRepayment: Math.round(monthlyRepayment),
    monthlyNetIncome: Math.round(monthlyNetIncome),
    hemUsed: Math.round(hemUsed),
    hemBenchmark: Math.round(hemBase),
    expensesSource: monthlyExpenses > hemBase ? "declared" : "hem",
    availableForRepayments: Math.round(availableForRepayments),
  };
}
