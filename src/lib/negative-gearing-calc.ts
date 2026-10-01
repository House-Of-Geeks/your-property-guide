// The arithmetic behind /negative-gearing-calculator (commercial intent
// review, 30 Sep 2026, section 3.3). Pure, so the page's worked example and
// FAQ figures come from the same code as the calculator, and so it can be
// tested against the worked example in /guides/negative-gearing-australia.

export const TAX_RATES_SOURCE = {
  name: "ATO, tax rates for Australian residents, 2026–27",
  url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents",
  dated: "last updated 13 August 2026",
  readOn: "30 September 2026",
} as const;

/** Resident marginal rates for 2026–27, before the Medicare levy (ATO, read 30 Sep 2026). */
export const TAX_RATES_2026_27 = [
  { rate: 0, label: "0% (taxable income up to $18,200)" },
  { rate: 15, label: "15% ($18,201 to $45,000)" },
  { rate: 30, label: "30% ($45,001 to $135,000)" },
  { rate: 37, label: "37% ($135,001 to $190,000)" },
  { rate: 45, label: "45% ($190,001 and over)" },
] as const;

export const BUDGET_SOURCE = {
  name: "ATO, Tax reform: reforming negative gearing and capital gains tax",
  url: "https://www.ato.gov.au/about-ato/new-legislation/in-detail/individuals/tax-reform-boosting-home-ownership-reforming-negative-gearing-and-capital-gains-tax",
  dated: "last updated 29 June 2026",
  readOn: "30 September 2026",
} as const;

/**
 * Which side of the 2026–27 Budget change the property sits on. The measures
 * are law and apply from 1 July 2027 (ATO, updated 29 June 2026): negative
 * gearing is limited to new builds, and properties held at 7:30pm AEST on
 * 12 May 2026 are exempt. The contract date decides which side a purchase is on
 * (our explainer, /guides/negative-gearing-changes-2026-budget).
 */
export type PurchaseTiming = "held-before-cutoff" | "new-build" | "established-after-cutoff";

export const PURCHASE_TIMING_LABELS: Record<PurchaseTiming, string> = {
  "held-before-cutoff": "I held it at 7:30pm AEST on 12 May 2026",
  "new-build": "A new build (never lived in or sold as a home)",
  "established-after-cutoff": "An established home, contract signed after that time",
};

export interface NegativeGearingInput {
  price: number;
  loan: number;
  /** Interest rate in percent a year. */
  interestRate: number;
  weeklyRent: number;
  vacancyWeeks: number;
  councilRates: number;
  insurance: number;
  /** Management fee in percent of the rent collected. */
  managementPct: number;
  maintenance: number;
  strata: number;
  depreciation: number;
  /** Marginal tax rate in percent. */
  marginalRate: number;
  timing: PurchaseTiming;
}

export interface NegativeGearingResult {
  weeksLet: number;
  rentalIncome: number;
  managementFee: number;
  /** Rates, insurance, management, maintenance and strata. */
  cashExpenses: number;
  interest: number;
  depreciation: number;
  /** Rent less cash expenses and interest: what leaves your account before tax. */
  cashFlowBeforeTax: number;
  /** Rent less every deduction, depreciation included. Negative is a loss. */
  netRentalResult: number;
  gearing: "negative" | "neutral" | "positive";
  /** Tax saved on a loss (positive) or tax owed on a profit (negative), at the marginal rate. */
  taxEffect: number;
  cashFlowAfterTax: number;
  /** After-tax cost per week; negative means the property pays you. */
  weeklyCostAfterTax: number;
  /** From 1 July 2027, for an established home bought after the cut-off the loss no longer reduces tax on other income. */
  lossOffsetsOtherIncomeFrom2027: boolean;
  weeklyCostFrom2027: number;
  grossYieldPct: number;
}

// `+ 0` turns -0 into 0, so a break-even property reads as $0, not -$0.
const round = (n: number) => Math.round(n) + 0;
const pos = (n: number) => Math.max(0, Number.isFinite(n) ? n : 0);

export function computeNegativeGearing(i: NegativeGearingInput): NegativeGearingResult {
  const weeksLet = Math.min(52, Math.max(0, 52 - pos(i.vacancyWeeks)));
  const rentalIncome = round(pos(i.weeklyRent) * weeksLet);
  const managementFee = round((rentalIncome * pos(i.managementPct)) / 100);
  const cashExpenses = round(pos(i.councilRates) + pos(i.insurance) + managementFee + pos(i.maintenance) + pos(i.strata));
  const interest = round((pos(i.loan) * pos(i.interestRate)) / 100);
  const depreciation = round(pos(i.depreciation));
  const cashFlowBeforeTax = rentalIncome - cashExpenses - interest;
  const netRentalResult = cashFlowBeforeTax - depreciation;
  const rate = pos(i.marginalRate) / 100;
  // A loss saves tax at the marginal rate; a profit is taxed at it.
  const taxEffect = round(-netRentalResult * rate);
  const cashFlowAfterTax = cashFlowBeforeTax + taxEffect;
  const lossOffsetsOtherIncomeFrom2027 = i.timing !== "established-after-cutoff";
  // From 1 July 2027 a quarantined loss saves no tax this year; a profit is still taxed.
  const taxEffectFrom2027 = lossOffsetsOtherIncomeFrom2027 || netRentalResult >= 0 ? taxEffect : 0;
  const price = pos(i.price);
  return {
    weeksLet,
    rentalIncome,
    managementFee,
    cashExpenses,
    interest,
    depreciation,
    cashFlowBeforeTax,
    netRentalResult,
    gearing: netRentalResult < 0 ? "negative" : netRentalResult > 0 ? "positive" : "neutral",
    taxEffect,
    cashFlowAfterTax,
    weeklyCostAfterTax: round(-cashFlowAfterTax / 52),
    lossOffsetsOtherIncomeFrom2027,
    weeklyCostFrom2027: round(-(cashFlowBeforeTax + taxEffectFrom2027) / 52),
    grossYieldPct: price > 0 ? Math.round(((pos(i.weeklyRent) * 52) / price) * 1000) / 10 : 0,
  };
}

/**
 * The starting figures: the worked example in our negative gearing guide
 * ($700,000 property, $560,000 loan at 6.5%, $625 a week), so the calculator
 * opens on the numbers the guide explains.
 */
export function defaultNegativeGearingInput(): NegativeGearingInput {
  return {
    price: 700_000,
    loan: 560_000,
    interestRate: 6.5,
    weeklyRent: 625,
    vacancyWeeks: 0,
    councilRates: 2_000,
    insurance: 1_500,
    managementPct: 8.5,
    maintenance: 1_000,
    strata: 0,
    depreciation: 0,
    marginalRate: 37,
    timing: "established-after-cutoff",
  };
}
