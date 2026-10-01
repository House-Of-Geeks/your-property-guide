// The rental yield engine behind /rental-yield-calculator, shared by the
// widget (src/components/calculators/RentalYieldCalculator.tsx) and the
// server-rendered worked example on the same page, so the two cannot
// disagree. Pure; tested in tests/lib/rental-yield-calc.test.ts.
import { calculateStampDuty } from "@/lib/utils/stamp-duty";

export interface RentalYieldInput {
  purchasePrice: number;
  weeklyRent: number;
  /** Purchase costs, $ once. */
  stampDuty: number;
  legalFees: number;
  buildingInspection: number;
  /** Ongoing costs, $ a year. */
  councilRates: number;
  waterRates: number;
  insurance: number;
  /** Property management, % of rent. */
  managementPct: number;
  /** Maintenance allowance, % of the purchase price a year. */
  maintenancePct: number;
  /** Optional loan, for the cash-flow line. 0 for none. */
  loanAmount: number;
  loanRate: number;
  loanTermYears: number;
}

export interface RentalYieldResult {
  annualRentalIncome: number;
  grossYield: number;
  netYield: number;
  totalPurchaseCosts: number;
  /** Purchase price plus purchase costs: the denominator of the net yield. */
  totalCostBase: number;
  managementCost: number;
  maintenanceCost: number;
  totalAnnualCosts: number;
  annualNetIncome: number;
  weeklyCashFlow: number;
  annualLoanRepayments: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Gross yield = weekly rent × 52 ÷ price; net yield = (annual rent − annual costs) ÷ (price + purchase costs). Null without a price and a rent. */
export function computeRentalYield(input: RentalYieldInput): RentalYieldResult | null {
  const { purchasePrice, weeklyRent } = input;
  if (purchasePrice <= 0 || weeklyRent <= 0) return null;

  const annualRentalIncome = weeklyRent * 52;

  const totalPurchaseCosts = input.stampDuty + input.legalFees + input.buildingInspection;
  const totalCostBase = purchasePrice + totalPurchaseCosts;

  const managementCost = (input.managementPct / 100) * annualRentalIncome;
  const maintenanceCost = (input.maintenancePct / 100) * purchasePrice;
  const totalAnnualCosts = input.councilRates + input.waterRates + input.insurance + managementCost + maintenanceCost;

  const grossYield = (annualRentalIncome / purchasePrice) * 100;
  const netYield = ((annualRentalIncome - totalAnnualCosts) / totalCostBase) * 100;
  const annualNetIncome = annualRentalIncome - totalAnnualCosts;

  let annualLoanRepayments = 0;
  if (input.loanAmount > 0 && input.loanRate > 0) {
    const r = input.loanRate / 100 / 12;
    const n = input.loanTermYears * 12;
    const monthly = (input.loanAmount * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
    annualLoanRepayments = monthly * 12;
  }

  const weeklyCashFlow = (annualNetIncome - annualLoanRepayments) / 52;

  return {
    annualRentalIncome: Math.round(annualRentalIncome),
    grossYield: round2(grossYield),
    netYield: round2(netYield),
    totalPurchaseCosts: Math.round(totalPurchaseCosts),
    totalCostBase: Math.round(totalCostBase),
    managementCost: Math.round(managementCost),
    maintenanceCost: Math.round(maintenanceCost),
    totalAnnualCosts: Math.round(totalAnnualCosts),
    annualNetIncome: Math.round(annualNetIncome),
    weeklyCashFlow: Math.round(weeklyCashFlow),
    annualLoanRepayments: Math.round(annualLoanRepayments),
  };
}

/**
 * The worked example under "How to calculate rental yield, step by step":
 * a $600,000 Queensland house let at $550 a week, with the widget's default
 * cost inputs and the transfer duty our stamp duty calculator works out for
 * an investor at that price. No loan, so the yields stand alone.
 */
export const WORKED_EXAMPLE: RentalYieldInput = {
  purchasePrice: 600_000,
  weeklyRent: 550,
  stampDuty: Math.round(calculateStampDuty(600_000, "QLD", false, false, true).total),
  legalFees: 2_000,
  buildingInspection: 600,
  councilRates: 2_000,
  waterRates: 800,
  insurance: 2_500,
  managementPct: 8,
  maintenancePct: 0.5,
  loanAmount: 0,
  loanRate: 0,
  loanTermYears: 30,
};

export function workedExample(): { input: RentalYieldInput; result: RentalYieldResult } {
  const result = computeRentalYield(WORKED_EXAMPLE);
  if (!result) throw new Error("worked example has no result");
  return { input: WORKED_EXAMPLE, result };
}
