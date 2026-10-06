// The arithmetic behind /fhss-calculator and the worked example on
// /guides/first-home-super-saver-scheme (FHSS plan, 7 Oct 2026). Pure, so the
// guide and the tool print the same numbers; the rules it applies are in
// src/lib/data/fhss.ts with their sources.
//
// Contributions go in evenly each month from the start of a financial year,
// and the determination is made at the end of the last month. Deemed earnings
// follow TAA 1953 Sch 1 s 138-40: the SIC rate compounding daily on each
// counted contribution (85% of a concessional one) from the first day of its
// month. The SIC rate is held at the rate entered, where the real one moves
// each quarter. Tax on release follows ITAA 1997 Div 313: the assessable
// amount at your marginal rate plus Medicare levy, less a 30% non-refundable
// offset, in the year of release.
import {
  CONCESSIONAL_CAP,
  CONTRIBUTIONS_TAX_PCT,
  CURRENT_SIC,
  FHSS_ANNUAL_LIMIT,
  FHSS_CONCESSIONAL_RELEASE_PCT,
  FHSS_TAX_OFFSET_PCT,
  FHSS_TOTAL_LIMIT,
  SUPER_GUARANTEE_PCT,
} from "@/lib/data/fhss";
import { MEDICARE_LEVY_PCT, incomeTax, marginalRate } from "@/lib/utils/income-tax";

/** An example savings rate for the opening state: about the 90-day bank bill rate behind the current SIC rate. */
export const EXAMPLE_BANK_RATE = 4.5;
export const MAX_YEARS = 10;

export type ContributionType = "before-tax" | "after-tax";

export const CONTRIBUTION_TYPE_LABELS: Record<ContributionType, string> = {
  "before-tax": "Before tax (salary sacrifice)",
  "after-tax": "After tax (no deduction)",
};

export interface FhssInput {
  /** Salary before super and before any salary sacrifice; treated as your taxable income. */
  salary: number;
  type: ContributionType;
  /** Voluntary contributions a year, spread evenly over the months. */
  perYear: number;
  years: number;
  /** Interest rate on a savings account, % a year, for the comparison. */
  bankRatePct: number;
  /** The SIC rate used for deemed earnings, % a year. */
  sicRatePct: number;
}

export interface FhssResult {
  status: "ok" | "invalid";
  contributed: number;
  /** Contributions counted towards the FHSS limits ($15,000 a year, $50,000 in total). */
  counted: number;
  /** Contributions over the limits, which stay in super until you can access it. */
  notCounted: number;
  /** The fund's 15% tax on the counted before-tax contributions. */
  contributionsTax: number;
  /** Counted contributions you can release: 85% of before-tax ones, 100% of after-tax ones. */
  releasableContributions: number;
  earnings: number;
  /** The FHSS maximum release amount. */
  maxRelease: number;
  /** The assessable FHSS released amount: the before-tax part and all the earnings. */
  assessable: number;
  /** Income tax on the assessable amount less the 30% offset (not below zero), plus the Medicare levy. */
  releaseTax: number;
  /** What reaches your bank account for the deposit, once the tax is settled. */
  inHand: number;
  /** The same counted contributions, taken as pay and saved in a bank account. */
  bank: {
    /** Income tax and Medicare levy on the pay (none for after-tax contributions). */
    taxGoingIn: number;
    saved: number;
    /** Interest after tax at your marginal rate. */
    interest: number;
    total: number;
  };
  /** inHand less the bank total. */
  advantage: number;
  /** Marginal rate on your salary, %, before the Medicare levy. */
  marginalRatePct: number;
  /** Super guarantee plus before-tax contributions in a year. */
  concessionalPerYear: number;
  overConcessionalCap: boolean;
  overAnnualLimit: boolean;
  overTotalLimit: boolean;
}

const r = (n: number) => Math.round(n);
const pos = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function computeFhss(i: FhssInput): FhssResult {
  const salary = pos(i.salary);
  const perYear = pos(i.perYear);
  const years = Math.min(MAX_YEARS, Math.round(pos(i.years)));
  const beforeTax = i.type === "before-tax";
  const months = years * 12;
  const monthly = perYear / 12;
  const releasePct = beforeTax ? FHSS_CONCESSIONAL_RELEASE_PCT / 100 : 1;
  const dailySic = pos(i.sicRatePct) / 100 / 365;

  // Tax on the pay you'd otherwise take home, as a share of each dollar contributed.
  const payTaxRate = beforeTax && perYear > 0
    ? (incomeTax(salary) - incomeTax(Math.max(0, salary - perYear))) / perYear + MEDICARE_LEVY_PCT / 100
    : 0;
  const bankNetMonthly = (pos(i.bankRatePct) / 100) * (1 - (marginalRate(salary) + MEDICARE_LEVY_PCT) / 100) / 12;

  let counted = 0;
  let earnings = 0;
  let bankSaved = 0;
  let bankTotal = 0;
  let countedThisYear = 0;
  for (let m = 0; m < months; m++) {
    if (m % 12 === 0) countedThisYear = 0;
    const c = Math.max(0, Math.min(monthly, FHSS_ANNUAL_LIMIT - countedThisYear, FHSS_TOTAL_LIMIT - counted));
    countedThisYear += c;
    counted += c;
    const monthsHeld = months - m;
    // s 138-40(2) rounds each contribution's earnings down to the dollar.
    earnings += Math.floor(c * releasePct * (Math.pow(1 + dailySic, (monthsHeld * 365) / 12) - 1));
    const deposit = c * (1 - payTaxRate);
    bankSaved += deposit;
    bankTotal += deposit * Math.pow(1 + bankNetMonthly, monthsHeld);
  }

  const contributed = perYear * years;
  const releasableContributions = counted * releasePct;
  const maxRelease = releasableContributions + earnings;
  const assessable = (beforeTax ? releasableContributions : 0) + earnings;

  // In the year of release, on top of the taxable income the ATO estimates from your last
  // return (your salary less any salary sacrifice). Below a 30% marginal rate the offset can
  // also cut tax on your other income; that isn't counted, so lower incomes are understated.
  const base = Math.max(0, beforeTax ? salary - perYear : salary);
  const incomeTaxOnRelease = Math.max(0, incomeTax(base + assessable) - incomeTax(base) - (assessable * FHSS_TAX_OFFSET_PCT) / 100);
  const releaseTax = incomeTaxOnRelease + (assessable * MEDICARE_LEVY_PCT) / 100;
  const inHand = maxRelease - releaseTax;

  const concessionalPerYear = (beforeTax ? perYear : 0) + (salary * SUPER_GUARANTEE_PCT) / 100;
  return {
    status: salary > 0 && perYear > 0 && years > 0 ? "ok" : "invalid",
    contributed: r(contributed),
    counted: r(counted),
    notCounted: r(contributed - counted),
    contributionsTax: beforeTax ? r((counted * CONTRIBUTIONS_TAX_PCT) / 100) : 0,
    releasableContributions: r(releasableContributions),
    earnings: r(earnings),
    maxRelease: r(maxRelease),
    assessable: r(assessable),
    releaseTax: r(releaseTax),
    inHand: r(inHand),
    bank: {
      taxGoingIn: r(counted - bankSaved),
      saved: r(bankSaved),
      interest: r(bankTotal - bankSaved),
      total: r(bankTotal),
    },
    advantage: r(inHand) - r(bankTotal),
    marginalRatePct: marginalRate(salary),
    concessionalPerYear: r(concessionalPerYear),
    overConcessionalCap: beforeTax && concessionalPerYear > CONCESSIONAL_CAP.amount,
    overAnnualLimit: perYear > FHSS_ANNUAL_LIMIT,
    overTotalLimit: Math.min(perYear, FHSS_ANNUAL_LIMIT) * years > FHSS_TOTAL_LIMIT,
  };
}

/**
 * The calculator's opening state, which is also the guide's worked example:
 * salary sacrificing $10,000 a year for three years on a $90,000 salary,
 * against saving the same pay in a bank at 4.5%.
 */
export function defaultFhssInput(): FhssInput {
  return {
    salary: 90_000,
    type: "before-tax",
    perYear: 10_000,
    years: 3,
    bankRatePct: EXAMPLE_BANK_RATE,
    sicRatePct: CURRENT_SIC.rate,
  };
}
