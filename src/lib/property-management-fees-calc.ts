// The arithmetic behind the property management cost calculator on
// /guides/property-management-fees-australia (commercial intent review,
// 30 Sep 2026, section 3.7). Pure so it can be tested and so the guide's
// worked example and the calculator share one set of numbers with
// src/lib/data/property-management-fees.ts.
import type { StateCode } from "@/lib/data/commission-rates";
import { PM_STATE_FEES, type PmDollarRange } from "@/lib/data/property-management-fees";

export interface PmFeesInput {
  weeklyRent: number;
  /** Ongoing management fee, percent of rent collected, e.g. 7.5. */
  managementPct: number;
  /** Letting fee in weeks of rent, charged each time a new tenant is signed. */
  lettingWeeks: number;
  /** Years between tenant changes; the letting fee is spread across them. */
  tenancyYears: number;
  /** Dollars per lease renewal with the same tenant. */
  renewalFee: number;
  /** Dollars per routine inspection. */
  inspectionFee: number;
  inspectionsPerYear: number;
  /** Statement, admin and postage charges, dollars a year. */
  adminFeePerYear: number;
  /** True when the quoted figures already include GST. */
  feesIncludeGst: boolean;
}

export interface PmFeesLine {
  key: "management" | "letting" | "renewal" | "inspections" | "admin" | "gst";
  label: string;
  amount: number;
}

export interface PmFeesResult {
  annualRent: number;
  /** The letting fee the agency charges when a tenant is placed. */
  lettingFeeOnce: number;
  /** Lease renewals a year on 12-month leases: a tenant who stays two years renews once. */
  renewalsPerYear: number;
  managementCost: number;
  /** The letting fee spread over the tenancy, per year. */
  lettingCost: number;
  /** Non-zero lines only, in the order shown. */
  lines: PmFeesLine[];
  gst: number;
  total: number;
  /** Total as a percentage of annual rent, one decimal. */
  pctOfRent: number;
}

const r = (n: number) => Math.round(n);
const nonNeg = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

/** Lease renewals a year, assuming 12-month leases inside a tenancy of the given length. */
export function renewalsPerYear(tenancyYears: number): number {
  const y = tenancyYears > 0 ? tenancyYears : 1;
  return Math.max(0, Math.ceil(y - 1e-9) - 1) / y;
}

export function computePmFees(i: PmFeesInput): PmFeesResult {
  const weeklyRent = nonNeg(i.weeklyRent);
  const annualRent = r(weeklyRent * 52);
  const years = i.tenancyYears > 0 ? Math.max(0.25, i.tenancyYears) : 1;
  const managementCost = r((annualRent * nonNeg(i.managementPct)) / 100);
  const lettingFeeOnce = r(weeklyRent * nonNeg(i.lettingWeeks));
  const lettingCost = r(lettingFeeOnce / years);
  const rpy = renewalsPerYear(years);
  const renewalCost = r(nonNeg(i.renewalFee) * rpy);
  const inspectionCost = r(nonNeg(i.inspectionFee) * nonNeg(i.inspectionsPerYear));
  const adminCost = r(nonNeg(i.adminFeePerYear));

  const lines: PmFeesLine[] = [{ key: "management", label: "Management fee", amount: managementCost }];
  if (lettingCost > 0) lines.push({ key: "letting", label: "Letting fee, spread over the tenancy", amount: lettingCost });
  if (renewalCost > 0) lines.push({ key: "renewal", label: "Lease renewal fee", amount: renewalCost });
  if (inspectionCost > 0) lines.push({ key: "inspections", label: "Routine inspections", amount: inspectionCost });
  if (adminCost > 0) lines.push({ key: "admin", label: "Statements and admin", amount: adminCost });
  const subtotal = lines.reduce((s, l) => s + l.amount, 0);
  const gst = i.feesIncludeGst ? 0 : r(subtotal * 0.1);
  if (gst > 0) lines.push({ key: "gst", label: "GST at 10%", amount: gst });
  const total = subtotal + gst;

  return {
    annualRent,
    lettingFeeOnce,
    renewalsPerYear: rpy,
    managementCost,
    lettingCost,
    lines,
    gst,
    total,
    pctOfRent: annualRent > 0 ? Math.round((total / annualRent) * 1000) / 10 : 0,
  };
}

/** Midpoint of a published dollar range, or the same number of weeks of rent; 0 where nothing is published. */
function dollarsOf(range: PmDollarRange | null, weeklyRent: number): number {
  if (!range) return 0;
  const mid = (range.low + range.high) / 2;
  return range.unit === "weeks" ? r(nonNeg(weeklyRent) * mid) : r(mid);
}

/**
 * The calculator's starting figures for a state: the state average
 * management percentage and letting weeks (LocalAgentFinder, March 2026),
 * the midpoint of each published extra, nothing where no range is published,
 * a two-year tenancy and GST-inclusive quotes.
 */
export function defaultPmFeesInput(state: StateCode, weeklyRent: number): PmFeesInput {
  const s = PM_STATE_FEES[state];
  return {
    weeklyRent,
    managementPct: s.management.average,
    lettingWeeks: s.letting.average,
    tenancyYears: 2,
    renewalFee: dollarsOf(s.renewal, weeklyRent),
    inspectionFee: dollarsOf(s.inspection, weeklyRent),
    inspectionsPerYear: s.inspectionsPerYear,
    adminFeePerYear: dollarsOf(s.admin, weeklyRent),
    feesIncludeGst: true,
  };
}
