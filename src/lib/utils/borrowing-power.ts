// Borrowing-power estimation, shared between the full /borrowing-power-calculator
// and the MiniBorrowingPowerEmbed used inside guides. Keeping the maths in one
// place means the tool and the guide can never disagree.
//
// Method (deliberately conservative, mirrors how lenders assess serviceability):
//   net income  = gross x 0.72 (rough average tax + Medicare)
//   expenses    = max(your figure, HEM benchmark for the household)
//   surplus     = net monthly income - expenses - existing debt repayments
//   capacity    = 85% of surplus, amortised at the assessment (buffered) rate
//   price       = max loan / 0.8 (assumes a 20% deposit)

// HEM (Household Expenditure Measure) base by number of dependants (monthly, $).
export const HEM_BASE: Record<number, number> = {
  0: 2_000,
  1: 2_500,
  2: 3_000,
  3: 3_500,
};
export const HEM_MAX_DEPENDANTS = 4;
export const HEM_4PLUS = 4_000;

/** Monthly HEM benchmark for a household with the given number of dependants. */
export function getHEM(dependants: number): number {
  if (dependants >= HEM_MAX_DEPENDANTS) return HEM_4PLUS;
  return HEM_BASE[dependants] ?? HEM_4PLUS;
}

/**
 * The loan rate the default assessment rate starts from: the average rate on
 * new owner-occupier variable-rate loans, all institutions, in the RBA's
 * statistical table F6 (series FLRHOFVA), July 2026. Update it, and the
 * period below, when the table moves; the calculator, the income table on
 * /borrowing-power-calculator and the guide embed all read it.
 */
export const REFERENCE_LOAN_RATE = 6.2;
export const REFERENCE_LOAN_RATE_PERIOD = "July 2026";
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

export interface BorrowingResult {
  maxLoan: number;
  estimatedPurchasePrice: number;
  monthlyRepayment: number;
  monthlyNetIncome: number;
  hemUsed: number;
  availableForRepayments: number;
}

export function computeBorrowingPower(
  income1: number,
  income2: number,
  monthlyExpenses: number,
  dependants: number,
  existingDebts: number,
  assessmentRate: number,
  termYears: number
): BorrowingResult | null {
  const grossAnnual = income1 + income2;
  if (grossAnnual <= 0) return null;

  const netAnnual = grossAnnual * 0.72;
  const monthlyNetIncome = netAnnual / 12;

  const hemBase = getHEM(dependants);
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
    availableForRepayments: Math.round(availableForRepayments),
  };
}
