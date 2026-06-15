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

/** Default assessment (buffered) rate, ~3% above a typical current rate. */
export const DEFAULT_ASSESSMENT_RATE = 7.5;

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
