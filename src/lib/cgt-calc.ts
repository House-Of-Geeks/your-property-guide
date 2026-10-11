// The arithmetic behind /cgt-calculator. Pure, so the widget, the page's
// worked figures and the tests share one engine.
//
// Until 10 Oct 2026 the widget asked for a marginal rate from the retired
// 2023-24 scale (19%, 32.5%, 37%, 45%), halved the gain for companies (which
// get no discount), missed a sale at exactly 12 months, and left out the
// Medicare levy. It now taxes the gain at the ATO's 2026-27 resident rates on
// top of the owner's other taxable income, adds the 2% Medicare levy, applies
// the discount each kind of owner actually gets, and works out the 12 months
// from the contract dates as the ATO does.

import { MEDICARE_LEVY_PCT, incomeTax, marginalRate } from "@/lib/utils/income-tax";

export const CGT_DISCOUNT_SOURCE = {
  name: "ATO, CGT discount",
  url: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/cgt-discount",
  dated: "last updated 29 June 2026",
  readOn: "11 October 2026",
} as const;

export const COMPANY_RATE_SOURCE = {
  name: "ATO, Changes to company tax rates",
  url: "https://www.ato.gov.au/tax-rates-and-codes/company-tax-rate-changes",
  dated: "last updated 4 September 2026",
  readOn: "11 October 2026",
} as const;

export const SMSF_TAX_SOURCE = {
  name: "ATO, How SMSFs are taxed",
  url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/self-managed-super-funds-smsf/smsf-administration-and-reporting/how-smsfs-are-taxed",
  dated: "last updated 2 April 2025",
  readOn: "11 October 2026",
} as const;

/** Who sells. A trust is modelled as one adult resident beneficiary taking the whole gain. */
export type CgtOwner = "individual" | "joint" | "trust" | "company" | "smsf";

export const CGT_OWNER_LABELS: Record<CgtOwner, string> = {
  individual: "Individual",
  joint: "Joint (50/50)",
  trust: "Trust",
  company: "Company",
  smsf: "SMSF",
};

/** The discount on a gain from an asset held at least 12 months (ATO, CGT discount). */
export const CGT_DISCOUNT: Record<CgtOwner, number> = {
  individual: 0.5,
  joint: 0.5,
  trust: 0.5,
  company: 0,
  smsf: 1 / 3,
};

/** Complying super funds pay 15% on income, capital gains included (ATO). */
export const SMSF_TAX_RATE = 15;
/** 25% for a base rate entity, 30% otherwise; rent and capital gains count as passive income (ATO). */
export type CompanyRate = 25 | 30;

export type MainResidenceUse = "no" | "always" | "part";

export interface CgtInput {
  purchasePrice: number;
  /** Stamp duty, legal costs, inspections and capital improvements. */
  purchaseCosts: number;
  salePrice: number;
  /** Agent's commission, marketing and legal costs of the sale. */
  saleCosts: number;
  /** Contract date of the purchase, YYYY-MM-DD. */
  purchaseDate: string;
  /** Contract date of the sale (the CGT event), YYYY-MM-DD. */
  saleDate: string;
  owner: CgtOwner;
  /** Each owner's taxable income for the year before the gain (individuals, joint owners, the trust's beneficiary). */
  otherIncome: number;
  companyRate: CompanyRate;
  /** Whether the property was the owner's main residence (individuals, joint owners only). */
  mainResidence: MainResidenceUse;
  /** Days it was the main residence, when mainResidence is "part". */
  mainResidenceDays: number;
}

export interface CgtResult {
  costBase: number;
  proceeds: number;
  /** Proceeds less cost base; negative is a capital loss. */
  grossGain: number;
  daysOwned: number;
  heldAtLeast12Months: boolean;
  /** Share of the gain exempt as a main residence, 0 to 1. */
  exemptShare: number;
  /** The gain after the main residence exemption. */
  assessableGain: number;
  /** The discount applied, 0 to 1. */
  discount: number;
  /** The gain added to taxable income, after the discount (all owners). */
  taxableGain: number;
  owners: number;
  /** Each owner's share of the taxable gain. */
  taxableGainPerOwner: number;
  /** The rate on the owner's next dollar before the gain, for individuals. */
  marginalRateBefore: number;
  incomeTax: number;
  medicareLevy: number;
  totalTax: number;
  /** Total tax as a share of the gross gain, %. */
  effectiveRate: number;
  netProfit: number;
}

const pos = (n: number) => Math.max(0, Number.isFinite(n) ? n : 0);
const round = (n: number) => Math.round(n) + 0;

function parseIso(iso: string): { y: number; m: number; d: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) } : null;
}

const utc = (y: number, m: number, d: number) => Date.UTC(y, m - 1, d);

/** Days from one ISO date to another (0 when either is invalid or the order is wrong). */
export function daysBetween(fromIso: string, toIso: string): number {
  const a = parseIso(fromIso);
  const b = parseIso(toIso);
  if (!a || !b) return 0;
  return Math.max(0, Math.round((utc(b.y, b.m, b.d) - utc(a.y, a.m, a.d)) / 86_400_000));
}

/**
 * The ATO's 12-month test: you must own the asset for at least 12 months
 * before the CGT event, leaving out the day you acquired it and the day of the
 * event. Its example: acquired 2 February 2021, discount on a CGT event on or
 * after 3 February 2022. So the sale contract must fall after the same date a
 * year on (the end of the month where that day does not exist).
 */
export function heldAtLeast12Months(purchaseIso: string, saleIso: string): boolean {
  const a = parseIso(purchaseIso);
  const b = parseIso(saleIso);
  if (!a || !b) return false;
  const lastDay = new Date(Date.UTC(a.y + 1, a.m, 0)).getUTCDate();
  const anniversary = utc(a.y + 1, a.m, Math.min(a.d, lastDay));
  return utc(b.y, b.m, b.d) > anniversary;
}

/** Income tax and Medicare levy on a slice of income on top of `other`, 2026-27 resident rates. */
function personalTaxOnGain(other: number, gain: number) {
  const before = pos(other);
  const tax = incomeTax(before + gain) - incomeTax(before);
  return { incomeTax: tax, medicareLevy: (gain * MEDICARE_LEVY_PCT) / 100 };
}

export function computeCgt(i: CgtInput): CgtResult {
  const costBase = round(pos(i.purchasePrice) + pos(i.purchaseCosts));
  const proceeds = round(pos(i.salePrice) - pos(i.saleCosts));
  const grossGain = proceeds - costBase;
  const daysOwned = daysBetween(i.purchaseDate, i.saleDate);
  const held = heldAtLeast12Months(i.purchaseDate, i.saleDate);

  const personal = i.owner === "individual" || i.owner === "joint";
  let exemptShare = 0;
  if (personal && i.mainResidence === "always") exemptShare = 1;
  else if (personal && i.mainResidence === "part" && daysOwned > 0) {
    exemptShare = Math.min(1, pos(i.mainResidenceDays) / daysOwned);
  }

  const assessableGain = grossGain > 0 ? grossGain * (1 - exemptShare) : 0;
  const discount = held ? CGT_DISCOUNT[i.owner] : 0;
  const taxableGain = assessableGain * (1 - discount);
  const owners = i.owner === "joint" ? 2 : 1;
  const perOwner = taxableGain / owners;

  let incomeTaxTotal = 0;
  let medicare = 0;
  if (perOwner > 0) {
    if (i.owner === "company") incomeTaxTotal = (taxableGain * i.companyRate) / 100;
    else if (i.owner === "smsf") incomeTaxTotal = (taxableGain * SMSF_TAX_RATE) / 100;
    else {
      const each = personalTaxOnGain(i.otherIncome, perOwner);
      incomeTaxTotal = each.incomeTax * owners;
      medicare = each.medicareLevy * owners;
    }
  }

  const totalTax = round(incomeTaxTotal + medicare);
  return {
    costBase,
    proceeds,
    grossGain,
    daysOwned,
    heldAtLeast12Months: held,
    exemptShare,
    assessableGain: round(assessableGain),
    discount,
    taxableGain: round(taxableGain),
    owners,
    taxableGainPerOwner: round(perOwner),
    marginalRateBefore: personal || i.owner === "trust" ? marginalRate(pos(i.otherIncome)) : 0,
    incomeTax: round(incomeTaxTotal),
    medicareLevy: round(medicare),
    totalTax,
    effectiveRate: grossGain > 0 ? Math.round((totalTax / grossGain) * 1000) / 10 : 0,
    netProfit: grossGain - totalTax,
  };
}

/** The calculator's starting figures: a $500,000 investment sold for $700,000 after five years. */
export function defaultCgtInput(): CgtInput {
  return {
    purchasePrice: 500_000,
    purchaseCosts: 0,
    salePrice: 700_000,
    saleCosts: 0,
    purchaseDate: "2021-11-01",
    saleDate: "2026-11-01",
    owner: "individual",
    otherIncome: 100_000,
    companyRate: 30,
    mainResidence: "no",
    mainResidenceDays: 0,
  };
}
