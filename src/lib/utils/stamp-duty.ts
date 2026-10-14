// Stamp duty (transfer / land transfer / conveyance duty) for the eight
// Australian states and territories. Every rate, threshold and surcharge here
// was checked against the state revenue office on 30 September 2026 (item 20
// of the September 2026 fix review). The dated source sits next to each table;
// the eight /guides/stamp-duty-{state} pages and /stamp-duty-calculator print
// these tables, so a correction here corrects every page.
//
// What the engine models: the standard (investor) schedule, the owner-occupier
// schedule where a state has one (Vic PPR rate, Qld home concession, ACT
// owner-occupier rate), the foreign purchaser surcharge, and the first home
// buyer relief for an established home, a new home or vacant land, on the
// rules in force on the transaction's date. The first home rules, with their
// dated versions and sources, live in src/lib/policy/first-home.ts (checked
// 14 October 2026); this file applies them. Call with no options and the
// engine assumes an established home and today's date, which is what every
// caller before October 2026 expected. What it does not model: off-the-plan
// concessions for all buyers, pensioner and downsizer concessions, income
// tests (the ACT's before 1 July 2026), partial concessions where a state
// publishes no formula (noted in the result), and registration and transfer
// fees. The pages say so.

import {
  DATE_BASIS_LABELS,
  FIRST_HOME_REVIEWED_ON,
  QLD_FIRST_HOME_DEDUCTION as POLICY_QLD_DEDUCTION,
  currentDutyRelief,
  dutyReliefFor,
  formatPolicyDate,
  grantFor,
  money as policyMoney,
  periodLabel,
  summariseRelief,
  toIsoDate,
  todayIso,
  type DateBasis,
  type DutyReliefVersion,
  type PolicySource,
  type PropertyKind,
  type ReliefMethod,
} from "@/lib/policy/first-home";

export type { PropertyKind } from "@/lib/policy/first-home";

export type AustralianState = "QLD" | "NSW" | "VIC" | "WA" | "SA" | "TAS" | "NT" | "ACT";

/** Optional facts about the transaction. Every field is optional; the defaults are today's date and an established home. */
export interface StampDutyOptions {
  /** The contract (agreement, exchange) date. Most states' first home rules follow it. Defaults to today. */
  contractDate?: Date | string | null;
  /** The settlement date. Tasmania's first home relief follows it; defaults to the contract date. */
  settlementDate?: Date | string | null;
  /** What is being bought. Defaults to an established home. */
  propertyKind?: PropertyKind;
  /** WA only, for agreements from 21 March 2025 to 6 May 2026, when the concession cap differed: Perth and Peel ("metro", the default) or elsewhere. */
  region?: "metro" | "regional";
}

/** The first home rule the engine applied, for the calculator to show with its source. */
export interface AppliedFirstHomeRule {
  state: AustralianState;
  kind: PropertyKind;
  name: string;
  /** The rule in one sentence, from the policy data. */
  summary: string;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  dateBasis: DateBasis;
  /** The date (ISO) the rule was chosen by. */
  dateUsed: string;
  source: PolicySource;
  reviewedOn: string;
  /** False where we hold no rules for the date, or the price falls in a band the state publishes no formula for. */
  modelled: boolean;
}

export const AUSTRALIAN_STATES: readonly AustralianState[] = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

/** The date the schedules below were verified against each revenue office. */
export const STAMP_DUTY_VERIFIED_ON = "2026-09-30";

export interface StampDutyResult {
  /** Duty on the schedule that applies to this buyer before any first home concession (owner-occupier rate where the state has one). */
  transferDuty: number;
  /** Duty at the standard rate, what an investor pays at this price. */
  standardDuty: number;
  /** standardDuty minus transferDuty where an owner-occupier schedule applied. */
  ownerOccupierConcession: number;
  foreignSurcharge: number;
  total: number;
  effectiveRate: number;
  concessionApplied: boolean;
  /** The first home buyer exemption or concession taken off transferDuty. */
  concessionAmount: number;
  notes: string[];
  /** Set for an eligible first home buyer (not foreign, not an investor): the rule looked up for the date and kind of property. */
  firstHomeRule?: AppliedFirstHomeRule;
}

export interface SourceRef {
  label: string;
  href: string;
  /** The date the figure was published or applies from, as printed on the page. */
  note: string;
}

// ─── Bracket helper ──────────────────────────────────────────────────────────

export interface Bracket {
  min: number;
  max: number;
  /** Duty at `min`. */
  base: number;
  /** Marginal rate on the value above `min`, as a decimal (0.035 = $3.50 per $100). */
  rate: number;
  /** The rate applies to the whole dutiable value, not the slice above `min` (Vic $960,001 to $2m, ACT over $1,455,000). `base` is then rate × min so the maths is unchanged. */
  flat?: boolean;
}

/**
 * Most states charge "for every $100, or part of $100", so the value is
 * rounded up to the next $100 before the rate applies. Victoria charges a
 * percentage of the dutiable value and is not rounded.
 */
function calcFromBrackets(price: number, brackets: Bracket[], per100: boolean): number {
  const v = per100 ? Math.ceil(price / 100) * 100 : price;
  for (const b of brackets) {
    if (v > b.min && v <= b.max) {
      return b.base + (v - b.min) * b.rate;
    }
  }
  return 0;
}

function finish(
  price: number,
  transferDuty: number,
  standardDuty: number,
  concessionAmount: number,
  foreignSurcharge: number,
  notes: string[],
  firstHomeRule?: AppliedFirstHomeRule,
): StampDutyResult {
  const dutyAfterConcession = Math.max(0, transferDuty - concessionAmount);
  const total = dutyAfterConcession + foreignSurcharge;
  const effectiveRate = price > 0 ? (total / price) * 100 : 0;
  return {
    transferDuty: Math.round(transferDuty),
    standardDuty: Math.round(standardDuty),
    ownerOccupierConcession: Math.max(0, Math.round(standardDuty) - Math.round(transferDuty)),
    foreignSurcharge: Math.round(foreignSurcharge),
    total: Math.round(total),
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    concessionApplied: concessionAmount > 0,
    concessionAmount: Math.round(concessionAmount),
    notes,
    ...(firstHomeRule ? { firstHomeRule } : {}),
  };
}

// ─── First home relief, from the policy data ─────────────────────────────────

interface Ctx {
  isFirstHome: boolean;
  isForeign: boolean;
  isInvestment: boolean;
  kind: PropertyKind;
  /** ISO dates; contract defaults to today. */
  contract: string;
  settlement: string | null;
  /** True when the caller passed a date (so the engine adds date notes). */
  dated: boolean;
  /** True when the caller passed a contract date (not just a settlement date). */
  contractGiven: boolean;
  region: "metro" | "regional";
}

function makeCtx(isFirstHome: boolean, isForeign: boolean, isInvestment: boolean, options?: StampDutyOptions): Ctx {
  const contract = toIsoDate(options?.contractDate ?? null);
  const settlement = toIsoDate(options?.settlementDate ?? null);
  return {
    isFirstHome,
    isForeign,
    isInvestment,
    kind: options?.propertyKind ?? "established",
    contract: contract ?? todayIso(),
    settlement,
    dated: contract !== null || settlement !== null,
    contractGiven: contract !== null,
    region: options?.region ?? "metro",
  };
}

const eligibleFirstHome = (c: Ctx) => c.isFirstHome && !c.isForeign && !c.isInvestment;

const ceil100 = (v: number) => Math.ceil(v / 100) * 100;

/**
 * Applies the first home relief in force for the state, kind of property and
 * date. `transferDuty` is the duty before relief at the price; `dutyAt` gives
 * the duty before relief at another value (Revenue NSW's concession scales to
 * the duty at the top of the band).
 */
function applyFirstHome(
  state: AustralianState,
  c: Ctx,
  price: number,
  transferDuty: number,
  dutyAt: (value: number) => number,
): { concession: number; notes: string[]; rule?: AppliedFirstHomeRule } {
  if (!eligibleFirstHome(c)) return { concession: 0, notes: [] };
  const officeName = STATE_DUTY_SCHEDULES[state].office.name;
  const office = officeRef(state);
  const first = dutyReliefFor(state, c.kind, c.contract).relief.versions[0];
  const basis: DateBasis = first?.dateBasis ?? "contract";
  const notes: string[] = [];
  let dateUsed = c.contract;
  if (basis === "settlement") {
    dateUsed = c.settlement ?? c.contract;
    if (!c.settlement && c.dated) notes.push(`${officeName}'s first home relief follows the settlement date; we used the date you entered as the settlement date.`);
  }
  const { relief, version } = dutyReliefFor(state, c.kind, dateUsed);
  if (!version) {
    const earliest = relief.versions[relief.versions.length - 1];
    notes.push(
      `We don't hold ${state}'s first home rules for a ${DATE_BASIS_LABELS[basis]} of ${formatPolicyDate(dateUsed)}${earliest?.effectiveFrom ? ` (our records start ${formatPolicyDate(earliest.effectiveFrom)})` : ""}, so no first home relief is shown. Check with ${office}.`,
    );
    return {
      concession: 0,
      notes,
      rule: { state, kind: c.kind, name: relief.name, summary: "Rules for this date aren't held", effectiveFrom: null, effectiveTo: null, dateBasis: basis, dateUsed, source: relief.source, reviewedOn: relief.reviewedOn, modelled: false },
    };
  }
  const { concession, modelled, bandNote } = reliefAmount(version.method, price, transferDuty, dutyAt, c.region);
  const summary = summariseRelief(version);
  const when = version.effectiveFrom || version.effectiveTo ? `, ${DATE_BASIS_LABELS[basis]}s ${periodLabel(version)}` : "";
  notes.push(version.method.type === "none" ? `${summary} (${officeName}${when}).` : `${relief.name}: ${lowerFirst(summary)} (${officeName}${when}).`);
  if (bandNote) notes.push(bandNote.replace("{office}", office));
  for (const n of version.notes ?? []) notes.push(n);
  return {
    concession,
    notes,
    rule: {
      state,
      kind: c.kind,
      name: relief.name,
      summary,
      effectiveFrom: version.effectiveFrom,
      effectiveTo: version.effectiveTo,
      dateBasis: basis,
      dateUsed,
      source: version.source ?? relief.source,
      reviewedOn: relief.reviewedOn,
      modelled,
    },
  };
}

function reliefAmount(
  m: ReliefMethod,
  price: number,
  transferDuty: number,
  dutyAt: (value: number) => number,
  region: "metro" | "regional",
): { concession: number; modelled: boolean; bandNote?: string } {
  switch (m.type) {
    case "none":
      return { concession: 0, modelled: true };
    case "full":
      return { concession: transferDuty, modelled: true };
    case "linear": {
      if (price <= m.exemptTo) return { concession: transferDuty, modelled: true };
      const inBand = m.concessionBelow ? price < m.concessionTo : price <= m.concessionTo;
      if (!inBand) return { concession: 0, modelled: true };
      const base = m.scale === "duty-at-cap" ? dutyAt(m.concessionTo) : transferDuty;
      const payable = base * ((price - m.exemptTo) / (m.concessionTo - m.exemptTo));
      return { concession: Math.max(0, transferDuty - payable), modelled: true };
    }
    case "rate-per-100": {
      if (price <= m.exemptTo) return { concession: transferDuty, modelled: true };
      const band = m.bands.find((b) => b.area === "all" || b.area === region) ?? m.bands[0];
      if (price > band.concessionTo) return { concession: 0, modelled: true };
      const payable = ((ceil100(price) - m.exemptTo) / 100) * band.ratePer100;
      return { concession: Math.max(0, transferDuty - payable), modelled: true };
    }
    case "deduction-table": {
      const row = m.table.find((r) => price < r.below);
      return { concession: Math.min(transferDuty, row ? row.amount : 0), modelled: true };
    }
    case "flat-reduction":
      return { concession: Math.min(transferDuty, m.maxConcession), modelled: true };
    case "percent":
      return { concession: price <= m.capTo ? transferDuty * (m.percent / 100) : 0, modelled: true };
    case "exempt-partial-unmodelled":
      if (price <= m.exemptTo) return { concession: transferDuty, modelled: true };
      if (price < m.concessionTo) {
        return {
          concession: 0,
          modelled: false,
          bandNote: `A partial concession applied between ${policyMoney(m.exemptTo)} and ${policyMoney(m.concessionTo)}; the calculator doesn't model it, so this shows full duty. Check with {office}.`,
        };
      }
      return { concession: 0, modelled: true };
  }
}

/** A current relief version's method, checked for type, for the constants the pages print. */
function currentMethod<T extends ReliefMethod["type"]>(state: AustralianState, kind: PropertyKind, type: T): Extract<ReliefMethod, { type: T }> {
  const m = currentDutyRelief(state, kind).method;
  if (m.type !== type) throw new Error(`${state} ${kind}: expected a ${type} first home rule, found ${m.type}`);
  return m as Extract<ReliefMethod, { type: T }>;
}

function currentVersion(state: AustralianState, kind: PropertyKind): DutyReliefVersion {
  return currentDutyRelief(state, kind);
}

const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** Where the state helps first home buyers with a grant rather than duty relief (Tasmania, the NT): the grant for a new home on the contract date. */
function grantNote(state: AustralianState, c: Ctx): string[] {
  // Without a contract date, a settlement date is a better guide to the grant's date than today.
  const { grant, version } = grantFor(state, c.contractGiven ? c.contract : (c.settlement ?? c.contract), "new");
  if (!version || version.amount === 0) return [];
  return [`${version.name ?? grant.name}: ${lowerFirst(version.summary)} (${STATE_DUTY_SCHEDULES[state].office.name}). It is a grant, not a duty concession.`];
}

const fromLabel = (v: DutyReliefVersion) => (v.effectiveFrom ? formatPolicyDate(v.effectiveFrom) : "");

/**
 * The general schedules' start dates, where a contract before then was
 * assessed on a different table (NSW indexes its thresholds each 1 July; the
 * ACT sets a new table each 1 July).
 */
const SCHEDULE_FROM: Partial<Record<AustralianState, string>> = { NSW: "2026-07-01", ACT: "2025-07-01" };

function scheduleNote(state: AustralianState, c: Ctx): string[] {
  const from = SCHEDULE_FROM[state];
  if (!from || !c.dated || c.contract >= from) return [];
  return [`Duty is worked out on the schedule in force from ${formatPolicyDate(from)}; a contract signed before then was assessed on the schedule of the day, so the dollar figure is an estimate.`];
}

// ─── NSW ─────────────────────────────────────────────────────────────────────
// Revenue NSW, "Transfer duty rates", 2026-27 thresholds (indexed to CPI each
// 1 July; page last updated 19 August 2026, read 30 September 2026):
// https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty/rates
// Minimum duty $20. Premium duty above $3,870,000.

export const NSW_BRACKETS: Bracket[] = [
  { min: 0,         max: 18_000,    base: 0,       rate: 0.0125 },
  { min: 18_000,    max: 38_000,    base: 225,     rate: 0.015 },
  { min: 38_000,    max: 103_000,   base: 525,     rate: 0.0175 },
  { min: 103_000,   max: 387_000,   base: 1_662,   rate: 0.035 },
  { min: 387_000,   max: 1_290_000, base: 11_602,  rate: 0.045 },
  { min: 1_290_000, max: 3_870_000, base: 52_237,  rate: 0.055 },
  { min: 3_870_000, max: Infinity,  base: 194_137, rate: 0.07 },
];

// Revenue NSW, First Home Buyers Assistance Scheme, contracts from 1 July
// 2023: exempt to $800,000, concession above $800,000 and under $1,000,000;
// vacant land exempt to $350,000, concession under $450,000. In the
// concession band the duty rises in a straight line from $0 at the threshold
// to the full duty at the top of the band (Revenue NSW's calculator; e.g.
// $850,000 pays $9,796.75 and $900,000 pays $19,593.50 on the 2026-27 table).
// The thresholds and their earlier versions are in src/lib/policy/first-home.ts.
// https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/assistance-scheme
const NSW_HOME_RULE = currentMethod("NSW", "established", "linear");
const NSW_LAND_RULE = currentMethod("NSW", "vacant-land", "linear");
export const NSW_FIRST_HOME = {
  exemptTo: NSW_HOME_RULE.exemptTo,
  concessionTo: NSW_HOME_RULE.concessionTo,
  from: fromLabel(currentVersion("NSW", "established")),
} as const;
/** Vacant land for a first home: exempt to $350,000, concession below $450,000. */
export const NSW_FIRST_HOME_LAND = { exemptTo: NSW_LAND_RULE.exemptTo, concessionTo: NSW_LAND_RULE.concessionTo } as const;

// Revenue NSW, surcharge purchaser duty: 9% for transactions on or after
// 1 January 2025 (8% before that). 2024-25 State Budget measure.
// https://www.revenue.nsw.gov.au/help-centre/resources-library/budget/2024-2025-state-budget
export const NSW_FOREIGN_SURCHARGE = 0.09;

function calcNSW(price: number, c: Ctx): StampDutyResult {
  const nswDuty = (v: number) => Math.max(v > 0 ? 20 : 0, calcFromBrackets(v, NSW_BRACKETS, true));
  const transferDuty = nswDuty(price);
  const notes: string[] = [];
  const fh = applyFirstHome("NSW", c, price, transferDuty, nswDuty);
  notes.push(...fh.notes);

  const foreignSurcharge = c.isForeign ? price * NSW_FOREIGN_SURCHARGE : 0;
  if (c.isForeign) notes.push("NSW surcharge purchaser duty of 9% applies to foreign persons (Revenue NSW, from 1 January 2025).");
  notes.push(...scheduleNote("NSW", c));

  return finish(price, transferDuty, transferDuty, fh.concession, foreignSurcharge, notes, fh.rule);
}

// ─── VIC ─────────────────────────────────────────────────────────────────────
// State Revenue Office Victoria, land transfer duty current rates, contracts
// from 1 July 2021 (read 30 September 2026):
// https://www.sro.vic.gov.au/about-us/rates-and-statistics/current-rates/land-transfer-duty-non-principal-place-residence-current-rates
// $960,001 to $2,000,000 is 5.5% of the whole dutiable value; over $2,000,000
// is $110,000 plus 6.5% of the excess.

export const VIC_BRACKETS: Bracket[] = [
  { min: 0,         max: 25_000,    base: 0,       rate: 0.014 },
  { min: 25_000,    max: 130_000,   base: 350,     rate: 0.024 },
  { min: 130_000,   max: 960_000,   base: 2_870,   rate: 0.06 },
  { min: 960_000,   max: 2_000_000, base: 52_800,  rate: 0.055, flat: true },
  { min: 2_000_000, max: Infinity,  base: 110_000, rate: 0.065 },
];

// SRO Victoria, principal place of residence (PPR) rates, contracts from
// 6 May 2008; above $550,000 the general rates apply:
// https://www.sro.vic.gov.au/about-us/rates-and-statistics/current-rates/land-transfer-duty-principal-place-residence-current-rates
export const VIC_PPR_BRACKETS: Bracket[] = [
  { min: 0,       max: 25_000,  base: 0,      rate: 0.014 },
  { min: 25_000,  max: 130_000, base: 350,    rate: 0.024 },
  { min: 130_000, max: 440_000, base: 2_870,  rate: 0.05 },
  { min: 440_000, max: 550_000, base: 18_370, rate: 0.06 },
];
export const VIC_PPR_MAX = 550_000;

// SRO Victoria, first home buyer duty exemption or concession (page updated
// 15 September 2026): no duty up to $600,000, reduced duty from $600,001 to
// $750,000 on a sliding scale ($700,000 pays $24,713, a saving of $12,357),
// on new and established homes and vacant land. Data in src/lib/policy/first-home.ts.
// https://www.sro.vic.gov.au/buying-property/land-transfer-stamp-duty/concessions-exemptions-and-waivers/first-home-buyers/first-home-buyer-duty-exemption-or-concession
const VIC_RULE = currentMethod("VIC", "established", "linear");
export const VIC_FIRST_HOME = { exemptTo: VIC_RULE.exemptTo, concessionTo: VIC_RULE.concessionTo, from: fromLabel(currentVersion("VIC", "established")) } as const;

// SRO Victoria, foreign purchaser additional duty: 8% for contracts on or
// after 1 July 2019 (State Budget 2019-20).
// https://www.sro.vic.gov.au/about-us/rates-and-statistics/current-rates/foreign-purchaser-additional-duty-current-rates
export const VIC_FOREIGN_SURCHARGE = 0.08;

function calcVIC(price: number, c: Ctx): StampDutyResult {
  const standardDuty = calcFromBrackets(price, VIC_BRACKETS, false);
  const notes: string[] = [];
  let transferDuty = standardDuty;
  if (!c.isInvestment && price <= VIC_PPR_MAX) {
    transferDuty = calcFromBrackets(price, VIC_PPR_BRACKETS, false);
    if (transferDuty < standardDuty) notes.push("Victorian principal place of residence rate applied (owner-occupiers up to $550,000, SRO Victoria).");
  }

  const fh = applyFirstHome("VIC", c, price, transferDuty, (v) => calcFromBrackets(v, VIC_BRACKETS, false));
  notes.push(...fh.notes);

  const foreignSurcharge = c.isForeign ? price * VIC_FOREIGN_SURCHARGE : 0;
  if (c.isForeign) notes.push("Victorian foreign purchaser additional duty of 8% applies (SRO Victoria, contracts from 1 July 2019).");

  return finish(price, transferDuty, standardDuty, fh.concession, foreignSurcharge, notes, fh.rule);
}

// ─── QLD ─────────────────────────────────────────────────────────────────────
// Queensland Revenue Office, transfer duty rates (page updated 25 June 2026,
// read 30 September 2026): https://qro.qld.gov.au/duties/transfer-duty/calculate/rates/

export const QLD_BRACKETS: Bracket[] = [
  { min: 0,         max: 5_000,     base: 0,      rate: 0 },
  { min: 5_000,     max: 75_000,    base: 0,      rate: 0.015 },
  { min: 75_000,    max: 540_000,   base: 1_050,  rate: 0.035 },
  { min: 540_000,   max: 1_000_000, base: 17_325, rate: 0.045 },
  { min: 1_000_000, max: Infinity,  base: 38_025, rate: 0.0575 },
];

// QRO, transfer duty home concession rates (owner-occupiers who move in
// within a year): https://qro.qld.gov.au/duties/transfer-duty/calculate/concession-rates/
export const QLD_HOME_BRACKETS: Bracket[] = [
  { min: 0,         max: 350_000,   base: 0,      rate: 0.01 },
  { min: 350_000,   max: 540_000,   base: 3_500,  rate: 0.035 },
  { min: 540_000,   max: 1_000_000, base: 10_150, rate: 0.045 },
  { min: 1_000_000, max: Infinity,  base: 30_850, rate: 0.0575 },
];

// QRO, first home concession on an established home, contracts signed on or
// after 9 June 2024: a fixed amount deducted from the home concession duty, by
// price band. $17,350 clears the whole bill up to $700,000; nil from $800,000.
// A new home, or vacant land to build one, pays no duty for contracts from
// 1 May 2025, at any value. The table and the versions are in
// src/lib/policy/first-home.ts.
// https://qro.qld.gov.au/duties/transfer-duty/calculate/concession-rates/
export const QLD_FIRST_HOME_DEDUCTION = POLICY_QLD_DEDUCTION;
const QLD_RULE = currentMethod("QLD", "established", "deduction-table");
export const QLD_FIRST_HOME = { exemptTo: QLD_RULE.exemptTo, concessionTo: QLD_RULE.concessionTo, from: fromLabel(currentVersion("QLD", "established")) } as const;

export function qldFirstHomeDeduction(price: number): number {
  for (const row of QLD_FIRST_HOME_DEDUCTION) if (price < row.below) return row.amount;
  return 0;
}

// QRO, additional foreign acquirer duty: 8% (raised from 7% on 1 July 2024).
// https://qro.qld.gov.au/duties/investors/afad/
export const QLD_FOREIGN_SURCHARGE = 0.08;

function calcQLD(price: number, c: Ctx): StampDutyResult {
  const standardDuty = calcFromBrackets(price, QLD_BRACKETS, true);
  const notes: string[] = [];
  let transferDuty = standardDuty;
  // The home concession rate is for a home you live in; vacant land pays the general rate.
  if (!c.isInvestment && c.kind !== "vacant-land") {
    transferDuty = calcFromBrackets(price, QLD_HOME_BRACKETS, true);
    notes.push("Queensland home concession rate applied (owner-occupiers who move in within one year, Queensland Revenue Office).");
  }

  const fh = applyFirstHome("QLD", c, price, transferDuty, (v) => calcFromBrackets(v, QLD_HOME_BRACKETS, true));
  notes.push(...fh.notes);

  const foreignSurcharge = c.isForeign ? price * QLD_FOREIGN_SURCHARGE : 0;
  if (c.isForeign) notes.push("Queensland additional foreign acquirer duty of 8% applies (Queensland Revenue Office).");

  return finish(price, transferDuty, standardDuty, fh.concession, foreignSurcharge, notes, fh.rule);
}

// ─── WA ──────────────────────────────────────────────────────────────────────
// RevenueWA, transfer duty assessment, general rate (from 2 July 2014; the
// residential rate uses the same table), read 30 September 2026:
// https://www.wa.gov.au/organisation/department-of-treasury-and-finance/transfer-duty-assessment

export const WA_BRACKETS: Bracket[] = [
  { min: 0,       max: 120_000,  base: 0,      rate: 0.019 },
  { min: 120_000, max: 150_000,  base: 2_280,  rate: 0.0285 },
  { min: 150_000, max: 360_000,  base: 3_135,  rate: 0.038 },
  { min: 360_000, max: 725_000,  base: 11_115, rate: 0.0475 },
  { min: 725_000, max: Infinity, base: 28_453, rate: 0.0515 },
];

// RevenueWA, first home owner rate of duty, by the date of the agreement (not
// settlement). Agreements on or after 7 May 2026 (2026-27 Housing Taxation
// Package): no duty up to $600,000, then $16.15 per $100 of the value over
// $600,000 up to $800,000; vacant land nil to $450,000, $20.14 per $100 to
// $550,000. The earlier bands (21 March 2025, 9 May 2024 and before) are in
// src/lib/policy/first-home.ts and the engine applies them by date.
// https://www.wa.gov.au/government/publications/duties-fact-sheet-first-home-owner-rate
const WA_HOME_RULE = currentMethod("WA", "established", "rate-per-100");
const WA_LAND_RULE = currentMethod("WA", "vacant-land", "rate-per-100");
const WA_PREVIOUS_VERSION = dutyReliefFor("WA", "established", "2026-05-06").version as DutyReliefVersion;
const WA_PREVIOUS_RULE = WA_PREVIOUS_VERSION.method as Extract<ReliefMethod, { type: "rate-per-100" }>;
export const WA_FIRST_HOME = {
  exemptTo: WA_HOME_RULE.exemptTo,
  concessionTo: WA_HOME_RULE.bands[0].concessionTo,
  ratePer100: WA_HOME_RULE.bands[0].ratePer100,
  from: fromLabel(currentVersion("WA", "established")),
} as const;
export const WA_FIRST_HOME_LAND = {
  exemptTo: WA_LAND_RULE.exemptTo,
  concessionTo: WA_LAND_RULE.bands[0].concessionTo,
  ratePer100: WA_LAND_RULE.bands[0].ratePer100,
} as const;
/** Before 7 May 2026 (from 21 March 2025): nil to $500,000, concession to $700,000 in Perth and Peel ($13.63 per $100) or $750,000 elsewhere ($11.89 per $100). */
export const WA_FIRST_HOME_PREVIOUS = {
  exemptTo: WA_PREVIOUS_RULE.exemptTo,
  metroTo: WA_PREVIOUS_RULE.bands.find((b) => b.area === "metro")!.concessionTo,
  regionalTo: WA_PREVIOUS_RULE.bands.find((b) => b.area === "regional")!.concessionTo,
  from: fromLabel(WA_PREVIOUS_VERSION),
  to: formatPolicyDate(WA_PREVIOUS_VERSION.effectiveTo as string),
} as const;

// RevenueWA, foreign buyers duty: additional duty of 7% on the dutiable value.
// https://www.wa.gov.au/organisation/department-of-treasury-and-finance/foreign-buyers-duty
export const WA_FOREIGN_SURCHARGE = 0.07;

function calcWA(price: number, c: Ctx): StampDutyResult {
  const transferDuty = calcFromBrackets(price, WA_BRACKETS, true);
  const notes: string[] = [];
  const fh = applyFirstHome("WA", c, price, transferDuty, (v) => calcFromBrackets(v, WA_BRACKETS, true));
  notes.push(...fh.notes);
  const v = fh.rule && dutyReliefFor("WA", c.kind, fh.rule.dateUsed).version;
  if (v && v.method.type === "rate-per-100" && v.method.bands.length > 1) {
    notes.push(`For this agreement date the concession cap depended on where the home is; we used ${c.region === "regional" ? "the cap outside Perth and Peel" : "the Perth and Peel cap"}.`);
  }

  const foreignSurcharge = c.isForeign ? price * WA_FOREIGN_SURCHARGE : 0;
  if (c.isForeign) notes.push("WA foreign buyers duty of 7% applies (RevenueWA).");

  return finish(price, transferDuty, transferDuty, fh.concession, foreignSurcharge, notes, fh.rule);
}

// ─── SA ──────────────────────────────────────────────────────────────────────
// RevenueSA, rate of stamp duty on conveyances of land (read 30 September
// 2026): https://www.revenuesa.sa.gov.au/stamp-duty-land/rate-of-stamp-duty

export const SA_BRACKETS: Bracket[] = [
  { min: 0,       max: 12_000,   base: 0,      rate: 0.01 },
  { min: 12_000,  max: 30_000,   base: 120,    rate: 0.02 },
  { min: 30_000,  max: 50_000,   base: 480,    rate: 0.03 },
  { min: 50_000,  max: 100_000,  base: 1_080,  rate: 0.035 },
  { min: 100_000, max: 200_000,  base: 2_830,  rate: 0.04 },
  { min: 200_000, max: 250_000,  base: 6_830,  rate: 0.0425 },
  { min: 250_000, max: 300_000,  base: 8_955,  rate: 0.0475 },
  { min: 300_000, max: 500_000,  base: 11_330, rate: 0.05 },
  { min: 500_000, max: Infinity, base: 21_330, rate: 0.055 },
];

// RevenueSA, stamp duty relief for eligible first home buyers: full relief on
// a new home, off-the-plan apartment or vacant land for a first home, with no
// value cap for contracts from 6 June 2024; established homes are not
// eligible. https://www.revenuesa.sa.gov.au/stamp-duty-land/first-home-buyer-relief
// RevenueSA, foreign ownership surcharge: 7% of the value of residential land,
// from 1 January 2018. https://www.revenuesa.sa.gov.au/stamp-duty-land/FOS
export const SA_FOREIGN_SURCHARGE = 0.07;

function calcSA(price: number, c: Ctx): StampDutyResult {
  const transferDuty = calcFromBrackets(price, SA_BRACKETS, true);
  const notes: string[] = [];
  const fh = applyFirstHome("SA", c, price, transferDuty, (v) => calcFromBrackets(v, SA_BRACKETS, true));
  notes.push(...fh.notes);
  if (c.isFirstHome && c.kind === "established") {
    const newHome = dutyReliefFor("SA", "new", c.contract).version;
    if (newHome && newHome.method.type !== "none") {
      notes.push(`A new home, an off-the-plan apartment or vacant land to build is different for a first home buyer: ${lowerFirst(summariseRelief(newHome))} (RevenueSA, contracts ${periodLabel(newHome)}).`);
    }
  }
  const foreignSurcharge = c.isForeign ? price * SA_FOREIGN_SURCHARGE : 0;
  if (c.isForeign) notes.push("SA foreign ownership surcharge of 7% applies (RevenueSA, from 1 January 2018).");
  return finish(price, transferDuty, transferDuty, fh.concession, foreignSurcharge, notes, fh.rule);
}

// ─── TAS ─────────────────────────────────────────────────────────────────────
// State Revenue Office Tasmania, rates of duty, transfers from 21 October
// 2013 (read 30 September 2026): $50 up to $3,000, then the table.
// https://www.sro.tas.gov.au/property-transfer-duties/rates-of-duty

export const TAS_BRACKETS: Bracket[] = [
  { min: 3_000,   max: 25_000,   base: 50,     rate: 0.0175 },
  { min: 25_000,  max: 75_000,   base: 435,    rate: 0.0225 },
  { min: 75_000,  max: 200_000,  base: 1_560,  rate: 0.035 },
  { min: 200_000, max: 375_000,  base: 5_935,  rate: 0.04 },
  { min: 375_000, max: 725_000,  base: 12_935, rate: 0.0425 },
  { min: 725_000, max: Infinity, base: 27_810, rate: 0.045 },
];

// SRO Tasmania: the 100% duty exemption for first home buyers of an
// established home up to $750,000 applied to transfers settling 18 February
// 2024 to 30 June 2026 and "is not available for transactions settling after
// 30 June 2026". No duty relief replaced it; the 2026-27 Budget (20 May 2026)
// set the First Home Owner Grant at $20,000 for new homes from 1 July 2026 to
// 30 June 2027 instead.
// https://www.sro.tas.gov.au/property-transfer-duties/concessions-exemptions/first-home-buyers-of-established-homes-duty-relief
// SRO Tasmania, foreign investor duty surcharge: 8% of the dutiable value of
// residential property, on or after 1 April 2020.
// https://sro.tas.gov.au/property-transfer-duties/foreign-investor-duty-surcharge/rates-of-surcharge
export const TAS_FOREIGN_SURCHARGE = 0.08;

function calcTAS(price: number, c: Ctx): StampDutyResult {
  const tasDuty = (v: number) => (v <= 0 ? 0 : v <= 3_000 ? 50 : calcFromBrackets(v, TAS_BRACKETS, true));
  const transferDuty = tasDuty(price);
  const notes: string[] = [];
  const fh = applyFirstHome("TAS", c, price, transferDuty, tasDuty);
  notes.push(...fh.notes);
  if (c.isFirstHome && c.kind !== "vacant-land") notes.push(...grantNote("TAS", c));
  const foreignSurcharge = c.isForeign ? price * TAS_FOREIGN_SURCHARGE : 0;
  if (c.isForeign) notes.push("Tasmanian foreign investor duty surcharge of 8% applies (State Revenue Office Tasmania, from 1 April 2020).");
  return finish(price, transferDuty, transferDuty, fh.concession, foreignSurcharge, notes, fh.rule);
}

// ─── NT ──────────────────────────────────────────────────────────────────────
// Territory Revenue Office, stamp duty rates from 1 July 2019 (TRO information
// sheet I-SD-002, read 30 September 2026): up to $525,000 the formula
// D = (0.06571441 × V²) + 15V where V is the value in thousands; over
// $525,000 and under $3 million 4.95%; $3 million to under $5 million 5.75%;
// $5 million or more 5.95%. https://treasury.nt.gov.au/dtf/territory-revenue-office/stamp-duty
// No first home buyer duty concession. HomeGrown Territory grant: $50,000 for
// a first home buyer building or buying a new home, contracts 1 October 2024
// to 30 September 2027; the $10,000 established-home grant closed to contracts
// after 30 September 2025. https://treasury.nt.gov.au/dtf/territory-revenue-office/homegrown-territory-guide-grants
// No foreign purchaser surcharge.

export const NT_FORMULA_MAX = 525_000;
export const NT_FLAT_BANDS: ReadonlyArray<{ min: number; max: number; rate: number }> = [
  { min: 525_000,   max: 3_000_000, rate: 0.0495 },
  { min: 3_000_000, max: 5_000_000, rate: 0.0575 },
  { min: 5_000_000, max: Infinity,  rate: 0.0595 },
];

export function ntDuty(price: number): number {
  if (price <= 0) return 0;
  if (price <= NT_FORMULA_MAX) {
    const V = price / 1000;
    return 0.06571441 * V * V + 15 * V;
  }
  // "Exceeds $525,000 but is less than $3 million": 4.95%; "less than
  // $5 million": 5.75%; "$5 million or more": 5.95% of the whole value.
  if (price < 3_000_000) return price * 0.0495;
  if (price < 5_000_000) return price * 0.0575;
  return price * 0.0595;
}

function calcNT(price: number, c: Ctx): StampDutyResult {
  const transferDuty = ntDuty(price);
  const notes: string[] = [];
  const fh = applyFirstHome("NT", c, price, transferDuty, ntDuty);
  notes.push(...fh.notes);
  if (c.isFirstHome && c.kind !== "vacant-land") notes.push(...grantNote("NT", c));
  if (c.isForeign) notes.push("The NT does not charge a foreign purchaser surcharge.");
  return finish(price, transferDuty, transferDuty, fh.concession, 0, notes, fh.rule);
}

// ─── ACT ─────────────────────────────────────────────────────────────────────
// ACT Revenue Office, conveyance duty for non-commercial property, rates for
// eligible owner-occupier transactions and for other transactions, schedule
// dated 1 July 2025 (read 30 September 2026; the 2026-27 Budget update lists
// changes to the concession schemes, not to this table). Over $1,455,000 a
// flat $4.54 per $100 applies to the whole value.
// https://www.revenue.act.gov.au/rates-and-property-charges/conveyance-duty-stamp-duty/conveyance-duty-for-non-commercial-property

export const ACT_OWNER_OCCUPIER_BRACKETS: Bracket[] = [
  { min: 0,         max: 260_000,   base: 0,      rate: 0.0028 },
  { min: 260_000,   max: 300_000,   base: 728,    rate: 0.022 },
  { min: 300_000,   max: 500_000,   base: 1_608,  rate: 0.034 },
  { min: 500_000,   max: 750_000,   base: 8_408,  rate: 0.0432 },
  { min: 750_000,   max: 1_000_000, base: 19_208, rate: 0.059 },
  { min: 1_000_000, max: 1_455_000, base: 33_958, rate: 0.064 },
  { min: 1_455_000, max: Infinity,  base: 66_057, rate: 0.0454, flat: true },
];

export const ACT_BRACKETS: Bracket[] = [
  { min: 0,         max: 200_000,   base: 0,      rate: 0.012 },
  { min: 200_000,   max: 300_000,   base: 2_400,  rate: 0.022 },
  { min: 300_000,   max: 500_000,   base: 4_600,  rate: 0.034 },
  { min: 500_000,   max: 750_000,   base: 11_400, rate: 0.0432 },
  { min: 750_000,   max: 1_000_000, base: 22_200, rate: 0.059 },
  { min: 1_000_000, max: 1_455_000, base: 36_950, rate: 0.064 },
  { min: 1_455_000, max: Infinity,  base: 66_057, rate: 0.0454, flat: true },
];

// ACT Revenue Office, Home Buyer Concession Scheme, by transaction date: from
// 1 July 2026 the income threshold and the property value limit are removed,
// so an eligible buyer (no interest in any property in the last five years,
// lives in the home for at least one year) pays no conveyance duty. From
// 1 July 2025 to 30 June 2026: $0 to $1,020,000 and $35,238 off the
// owner-occupier duty above that, with an income test. Data in
// src/lib/policy/first-home.ts.
// https://www.revenue.act.gov.au/home-buyer-assistance/home-buyer-concession-scheme/about-the-home-buyer-concession-scheme
// https://www.revenue.act.gov.au/about-the-act-revenue-office/news/act-budget-2026-27-updates
export const ACT_HBCS_FROM = fromLabel(currentVersion("ACT", "established"));

function calcACT(price: number, c: Ctx): StampDutyResult {
  const standardDuty = calcFromBrackets(price, ACT_BRACKETS, true);
  const notes: string[] = [];
  let transferDuty = standardDuty;
  if (!c.isInvestment) {
    transferDuty = calcFromBrackets(price, ACT_OWNER_OCCUPIER_BRACKETS, true);
    if (transferDuty < standardDuty) notes.push("ACT owner-occupier rate applied (ACT Revenue Office).");
  }
  const fh = applyFirstHome("ACT", c, price, transferDuty, (v) => calcFromBrackets(v, ACT_OWNER_OCCUPIER_BRACKETS, true));
  notes.push(...fh.notes);
  if (c.isForeign) notes.push("The ACT does not charge a foreign purchaser surcharge.");
  notes.push(...scheduleNote("ACT", c));
  return finish(price, transferDuty, standardDuty, fh.concession, 0, notes, fh.rule);
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Duty on a purchase. The first five arguments are unchanged from the original
 * signature; `options` adds the contract date, settlement date and kind of
 * property, which decide the first home relief. Without options: today's date
 * and an established home.
 */
export function calculateStampDuty(
  purchasePrice: number,
  state: AustralianState,
  isFirstHomeBuyer: boolean,
  isForeignBuyer: boolean,
  isInvestment: boolean,
  options?: StampDutyOptions,
): StampDutyResult {
  const c = makeCtx(isFirstHomeBuyer, isForeignBuyer, isInvestment, options);
  switch (state) {
    case "QLD": return calcQLD(purchasePrice, c);
    case "NSW": return calcNSW(purchasePrice, c);
    case "VIC": return calcVIC(purchasePrice, c);
    case "WA":  return calcWA(purchasePrice, c);
    case "SA":  return calcSA(purchasePrice, c);
    case "TAS": return calcTAS(purchasePrice, c);
    case "NT":  return calcNT(purchasePrice, c);
    case "ACT": return calcACT(purchasePrice, c);
  }
}

/** The date the first home rules were last checked against each revenue office. */
export const FIRST_HOME_RULES_REVIEWED_ON = FIRST_HOME_REVIEWED_ON;

// ─── Published schedule per state, for the pages' tables ─────────────────────

export interface StateDutySchedule {
  state: AustralianState;
  name: string;
  /** What the state calls it. */
  dutyName: string;
  office: { name: string; href: string };
  /** Rates are "per $100 or part of $100" (rounded up) rather than a percentage of the value. */
  per100: boolean;
  standard: { rows: Bracket[]; label: string; source: SourceRef };
  /** A cheaper schedule for owner-occupiers, where the state has one. */
  ownerOccupier?: { rows: Bracket[]; label: string; upTo?: number; source: SourceRef };
  firstHome: {
    /** Full exemption up to this value on an established home, null where there is none. */
    exemptTo: number | null;
    /** Partial concession up to this value, null where there is none. */
    concessionTo: number | null;
    /** The date the current thresholds apply from. */
    from: string;
    schemeName: string;
    source: SourceRef;
  };
  /** `from` is set only where the revenue office states the start date. */
  foreign: { rate: number; name: string; from?: string; source: SourceRef } | null;
}

export const STATE_DUTY_SCHEDULES: Record<AustralianState, StateDutySchedule> = {
  NSW: {
    state: "NSW",
    name: "New South Wales",
    dutyName: "transfer duty",
    office: { name: "Revenue NSW", href: "https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty" },
    per100: true,
    standard: {
      rows: NSW_BRACKETS,
      label: "NSW transfer duty rates, 2026-27",
      source: { label: "Revenue NSW: Transfer duty rates (2026-27 thresholds, indexed each 1 July)", href: "https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty/rates", note: "page updated 19 August 2026, read 30 September 2026" },
    },
    firstHome: {
      exemptTo: NSW_FIRST_HOME.exemptTo,
      concessionTo: NSW_FIRST_HOME.concessionTo,
      from: NSW_FIRST_HOME.from,
      schemeName: "First Home Buyers Assistance Scheme",
      source: { label: "Revenue NSW: First Home Buyers Assistance Scheme", href: "https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/assistance-scheme", note: "thresholds for contracts from 1 July 2023, read 30 September 2026" },
    },
    foreign: {
      rate: NSW_FOREIGN_SURCHARGE,
      name: "surcharge purchaser duty",
      from: "1 January 2025",
      source: { label: "Revenue NSW: 2024-25 State Budget (surcharge purchaser duty 8% to 9%)", href: "https://www.revenue.nsw.gov.au/help-centre/resources-library/budget/2024-2025-state-budget", note: "transactions on or after 1 January 2025" },
    },
  },
  VIC: {
    state: "VIC",
    name: "Victoria",
    dutyName: "land transfer duty",
    office: { name: "State Revenue Office Victoria", href: "https://www.sro.vic.gov.au/buying-property/land-transfer-stamp-duty" },
    per100: false,
    standard: {
      rows: VIC_BRACKETS,
      label: "Victorian land transfer duty, general rates",
      source: { label: "SRO Victoria: Land transfer duty, general (non-principal place of residence) current rates", href: "https://www.sro.vic.gov.au/about-us/rates-and-statistics/current-rates/land-transfer-duty-non-principal-place-residence-current-rates", note: "contracts from 1 July 2021, read 30 September 2026" },
    },
    ownerOccupier: {
      rows: VIC_PPR_BRACKETS,
      label: "Principal place of residence rates (owner-occupiers, up to $550,000)",
      upTo: VIC_PPR_MAX,
      source: { label: "SRO Victoria: Land transfer duty, principal place of residence current rates", href: "https://www.sro.vic.gov.au/about-us/rates-and-statistics/current-rates/land-transfer-duty-principal-place-residence-current-rates", note: "contracts from 6 May 2008, read 30 September 2026" },
    },
    firstHome: {
      exemptTo: VIC_FIRST_HOME.exemptTo,
      concessionTo: VIC_FIRST_HOME.concessionTo,
      from: VIC_FIRST_HOME.from,
      schemeName: "first home buyer duty exemption and concession",
      source: { label: "SRO Victoria: First home buyer duty exemption or concession", href: "https://www.sro.vic.gov.au/buying-property/land-transfer-stamp-duty/concessions-exemptions-and-waivers/first-home-buyers/first-home-buyer-duty-exemption-or-concession", note: "page updated 15 September 2026" },
    },
    foreign: {
      rate: VIC_FOREIGN_SURCHARGE,
      name: "foreign purchaser additional duty",
      from: "1 July 2019",
      source: { label: "SRO Victoria: Foreign purchaser additional duty, current rates", href: "https://www.sro.vic.gov.au/about-us/rates-and-statistics/current-rates/foreign-purchaser-additional-duty-current-rates", note: "8% for contracts on or after 1 July 2019" },
    },
  },
  QLD: {
    state: "QLD",
    name: "Queensland",
    dutyName: "transfer duty",
    office: { name: "Queensland Revenue Office", href: "https://qro.qld.gov.au/duties/transfer-duty/" },
    per100: true,
    standard: {
      rows: QLD_BRACKETS,
      label: "Queensland transfer duty rates",
      source: { label: "Queensland Revenue Office: Transfer duty rates", href: "https://qro.qld.gov.au/duties/transfer-duty/calculate/rates/", note: "page updated 25 June 2026, read 30 September 2026" },
    },
    ownerOccupier: {
      rows: QLD_HOME_BRACKETS,
      label: "Home concession rates (owner-occupiers who move in within a year)",
      source: { label: "Queensland Revenue Office: Transfer duty home concession rates", href: "https://qro.qld.gov.au/duties/transfer-duty/calculate/concession-rates/", note: "read 30 September 2026" },
    },
    firstHome: {
      exemptTo: QLD_FIRST_HOME.exemptTo,
      concessionTo: QLD_FIRST_HOME.concessionTo,
      from: QLD_FIRST_HOME.from,
      schemeName: "first home concession",
      source: { label: "Queensland Revenue Office: First home concession amounts (contracts from 9 June 2024) and first home new home concession (from 1 May 2025)", href: "https://qro.qld.gov.au/duties/transfer-duty/calculate/concession-rates/", note: "read 30 September 2026" },
    },
    foreign: {
      rate: QLD_FOREIGN_SURCHARGE,
      name: "additional foreign acquirer duty",
      from: "1 July 2024",
      source: { label: "Queensland Revenue Office: Additional foreign acquirer duty", href: "https://qro.qld.gov.au/duties/investors/afad/", note: "8%, raised from 7% on 1 July 2024" },
    },
  },
  WA: {
    state: "WA",
    name: "Western Australia",
    dutyName: "transfer duty",
    office: { name: "RevenueWA", href: "https://www.wa.gov.au/organisation/department-of-treasury-and-finance/transfer-duty-assessment" },
    per100: true,
    standard: {
      rows: WA_BRACKETS,
      label: "WA transfer duty, general and residential rate",
      source: { label: "RevenueWA: Transfer duty assessment (general rate, from 2 July 2014; the residential rate uses the same table)", href: "https://www.wa.gov.au/organisation/department-of-treasury-and-finance/transfer-duty-assessment", note: "read 30 September 2026" },
    },
    firstHome: {
      exemptTo: WA_FIRST_HOME.exemptTo,
      concessionTo: WA_FIRST_HOME.concessionTo,
      from: WA_FIRST_HOME.from,
      schemeName: "first home owner rate of duty",
      source: { label: "RevenueWA: Duties fact sheet, first home owner rate (thresholds for transactions on or after 7 May 2026)", href: "https://www.wa.gov.au/government/publications/duties-fact-sheet-first-home-owner-rate", note: "2026-27 Housing Taxation Package, read 30 September 2026" },
    },
    foreign: {
      rate: WA_FOREIGN_SURCHARGE,
      name: "foreign buyers duty",
      source: { label: "RevenueWA: Foreign buyers duty (additional duty of 7% on the dutiable value)", href: "https://www.wa.gov.au/organisation/department-of-treasury-and-finance/foreign-buyers-duty", note: "read 30 September 2026" },
    },
  },
  SA: {
    state: "SA",
    name: "South Australia",
    dutyName: "stamp duty",
    office: { name: "RevenueSA", href: "https://www.revenuesa.sa.gov.au/stamp-duty-land" },
    per100: true,
    standard: {
      rows: SA_BRACKETS,
      label: "SA stamp duty rates on residential land",
      source: { label: "RevenueSA: Rate of stamp duty (conveyance of land)", href: "https://www.revenuesa.sa.gov.au/stamp-duty-land/rate-of-stamp-duty", note: "read 30 September 2026" },
    },
    firstHome: {
      exemptTo: null,
      concessionTo: null,
      from: "6 June 2024",
      schemeName: "stamp duty relief for eligible first home buyers (new homes and vacant land only)",
      source: { label: "RevenueSA: Stamp duty relief for eligible first home buyers (new home, off-the-plan apartment or vacant land, no value cap for contracts from 6 June 2024; established homes not eligible)", href: "https://www.revenuesa.sa.gov.au/stamp-duty-land/first-home-buyer-relief", note: "read 30 September 2026" },
    },
    foreign: {
      rate: SA_FOREIGN_SURCHARGE,
      name: "foreign ownership surcharge",
      from: "1 January 2018",
      source: { label: "RevenueSA: Foreign ownership surcharge (7% of the value of residential land)", href: "https://www.revenuesa.sa.gov.au/stamp-duty-land/FOS", note: "instruments from 1 January 2018" },
    },
  },
  TAS: {
    state: "TAS",
    name: "Tasmania",
    dutyName: "property transfer duty",
    office: { name: "State Revenue Office Tasmania", href: "https://www.sro.tas.gov.au/property-transfer-duties" },
    per100: true,
    standard: {
      rows: TAS_BRACKETS,
      label: "Tasmanian property transfer duty rates",
      source: { label: "State Revenue Office Tasmania: Rates of duty (transfers from 21 October 2013; $50 up to $3,000)", href: "https://www.sro.tas.gov.au/property-transfer-duties/rates-of-duty", note: "read 30 September 2026" },
    },
    firstHome: {
      exemptTo: null,
      concessionTo: null,
      from: "1 July 2026",
      schemeName: "first home buyer duty relief (ended 30 June 2026)",
      source: { label: "State Revenue Office Tasmania: First home buyers of established homes duty relief (100% exemption to $750,000 for settlements 18 February 2024 to 30 June 2026; not available after 30 June 2026)", href: "https://www.sro.tas.gov.au/property-transfer-duties/concessions-exemptions/first-home-buyers-of-established-homes-duty-relief", note: "read 30 September 2026" },
    },
    foreign: {
      rate: TAS_FOREIGN_SURCHARGE,
      name: "foreign investor duty surcharge",
      from: "1 April 2020",
      source: { label: "State Revenue Office Tasmania: Foreign investor duty surcharge, rates of surcharge (8% of residential property)", href: "https://sro.tas.gov.au/property-transfer-duties/foreign-investor-duty-surcharge/rates-of-surcharge", note: "on or after 1 April 2020" },
    },
  },
  ACT: {
    state: "ACT",
    name: "the ACT",
    dutyName: "conveyance duty",
    office: { name: "ACT Revenue Office", href: "https://www.revenue.act.gov.au/duties/conveyance-duty" },
    per100: true,
    standard: {
      rows: ACT_BRACKETS,
      label: "ACT conveyance duty, other (non-owner-occupier) transactions",
      source: { label: "ACT Revenue Office: Conveyance duty for non-commercial property (schedule dated 1 July 2025; the 2026-27 Budget update changed the concession schemes, not this table)", href: "https://www.revenue.act.gov.au/rates-and-property-charges/conveyance-duty-stamp-duty/conveyance-duty-for-non-commercial-property", note: "read 30 September 2026" },
    },
    ownerOccupier: {
      rows: ACT_OWNER_OCCUPIER_BRACKETS,
      label: "Eligible owner-occupier transactions",
      source: { label: "ACT Revenue Office: Conveyance duty for non-commercial property, eligible owner-occupier rates", href: "https://www.revenue.act.gov.au/rates-and-property-charges/conveyance-duty-stamp-duty/conveyance-duty-for-non-commercial-property", note: "schedule dated 1 July 2025, read 30 September 2026" },
    },
    firstHome: {
      exemptTo: Infinity,
      concessionTo: null,
      from: ACT_HBCS_FROM,
      schemeName: "Home Buyer Concession Scheme",
      source: { label: "ACT Revenue Office: About the Home Buyer Concession Scheme, and ACT Budget 2026-27 updates (income threshold and property value limit removed from 1 July 2026)", href: "https://www.revenue.act.gov.au/about-the-act-revenue-office/news/act-budget-2026-27-updates", note: "read 30 September 2026" },
    },
    foreign: null,
  },
  NT: {
    state: "NT",
    name: "the Northern Territory",
    dutyName: "stamp duty",
    office: { name: "Territory Revenue Office", href: "https://treasury.nt.gov.au/dtf/territory-revenue-office/stamp-duty" },
    per100: false,
    standard: {
      rows: NT_FLAT_BANDS.map((b) => ({ min: b.min, max: b.max, base: b.min * b.rate, rate: b.rate, flat: true })),
      label: "NT stamp duty on a home or land",
      source: { label: "Territory Revenue Office: Stamp duty (conveyance rates from 1 July 2019, information sheet I-SD-002)", href: "https://treasury.nt.gov.au/dtf/territory-revenue-office/stamp-duty", note: "read 30 September 2026" },
    },
    firstHome: {
      exemptTo: null,
      concessionTo: null,
      from: "1 October 2024",
      schemeName: "HomeGrown Territory grant (a grant, not a duty concession)",
      source: { label: "Territory Revenue Office: HomeGrown Territory grants ($50,000 for a first new home, contracts 1 October 2024 to 30 September 2027; the $10,000 established-home grant closed to contracts after 30 September 2025)", href: "https://treasury.nt.gov.au/dtf/territory-revenue-office/homegrown-territory-guide-grants", note: "read 30 September 2026" },
    },
    foreign: null,
  },
};

/** The office as it reads in a sentence: "Revenue NSW", "the Queensland Revenue Office". */
export function officeRef(state: AustralianState, sentenceStart = false): string {
  const name = STATE_DUTY_SCHEDULES[state].office.name;
  if (!/Office/.test(name)) return name;
  return `${sentenceStart ? "The" : "the"} ${name}`;
}

// ─── Legacy single-object signature (backward compat) ────────────────────────

export interface StampDutyInput {
  purchasePrice: number;
  isFirstHomeBuyer: boolean;
  isForeignBuyer: boolean;
  isInvestment: boolean;
  /** defaults to QLD */
  state?: AustralianState;
}

/** @deprecated Prefer calling calculateStampDuty() with explicit parameters */
export function calculateStampDutyLegacy(input: StampDutyInput): {
  transferDuty: number;
  foreignBuyerSurcharge: number;
  totalDuty: number;
  firstHomeConcession: number;
  effectiveRate: number;
} {
  const result = calculateStampDuty(
    input.purchasePrice,
    input.state ?? "QLD",
    input.isFirstHomeBuyer,
    input.isForeignBuyer,
    input.isInvestment
  );
  return {
    transferDuty: result.transferDuty,
    foreignBuyerSurcharge: result.foreignSurcharge,
    totalDuty: result.total,
    firstHomeConcession: result.concessionAmount,
    effectiveRate: result.effectiveRate,
  };
}
