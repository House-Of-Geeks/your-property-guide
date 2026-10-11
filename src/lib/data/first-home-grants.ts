// First home owner grants and first home buyer duty relief, state by state,
// for the eight /guides/first-home-buyer-{state} guides,
// /guides/first-home-owner-grant-australia, /guides/first-home-buyer-guide,
// the /first-home-buyers hub, /stamp-duty-calculator and the blog posts that
// quote them (commercial-intent review 10 Oct 2026, buying 0.2). Before this
// file the state grants and duty thresholds were typed by hand into each page
// and drifted: NSW still offered First Home Buyer Choice, WA's exemption was
// $450,000, Tasmania's grant $30,000. The duty thresholds come from the stamp
// duty engine (src/lib/utils/stamp-duty.ts), so the guides, the state stamp
// duty guides and the calculator print one set of figures.
//
// Every amount, cap and date below was read on the revenue office's own page
// on the state's `checkedOn` date. The grants change by budget: Tasmania's
// amount is set a year at a time (recheck before 30 June 2027), the NT grant
// window closes on 30 September 2027, and NSW, Victoria, Queensland, WA and SA
// publish no end date. tests/seo/first-home-grants.test.ts renders the pages
// and fails on a grant amount or threshold that is not in this file.
import {
  ACT_HBCS_FROM,
  AUSTRALIAN_STATES,
  NSW_FIRST_HOME,
  NSW_FIRST_HOME_LAND,
  QLD_FIRST_HOME,
  VIC_FIRST_HOME,
  WA_FIRST_HOME,
  WA_FIRST_HOME_LAND,
  type AustralianState,
} from "@/lib/utils/stamp-duty";

/** The latest date any row below was checked; each row carries its own. */
export const FHG_CHECKED_ON = "2026-10-11";

export interface Source {
  label: string;
  href: string;
}

export const STATE_NAMES: Record<AustralianState, string> = {
  NSW: "New South Wales", VIC: "Victoria", QLD: "Queensland", WA: "Western Australia",
  SA: "South Australia", TAS: "Tasmania", ACT: "the ACT", NT: "the Northern Territory",
};

/** How the state reads after "in": "in NSW", "in Victoria", "in the ACT". */
export const IN_STATE: Record<AustralianState, string> = {
  NSW: "NSW", VIC: "Victoria", QLD: "Queensland", WA: "WA", SA: "South Australia", TAS: "Tasmania", ACT: "the ACT", NT: "the Northern Territory",
};

export const fmt = (n: number) => `$${n.toLocaleString("en-AU")}`;

// ─── Grants ──────────────────────────────────────────────────────────────────

export interface GrantCap {
  /** What the cap applies to, as a phrase: "a new home you buy". */
  what: string;
  value: number;
  /** "atMost": the value may equal the cap. "below": it must be under it (Queensland). */
  rule: "atMost" | "below";
}

export interface StateGrant {
  state: AustralianState;
  /** What the state calls it. */
  name: string;
  /** null where the state pays no first home grant (the ACT since 1 July 2019). */
  amount: number | null;
  /** The office says "up to": the grant is the amount or the price if that is less. */
  upTo: boolean;
  /** Value caps, empty where the office says there is none. */
  caps: readonly GrantCap[];
  /** The contract-date window for this amount and these caps, as the office states it. */
  window: string;
  /** The last contract date, where one is published. */
  endsOn: string | null;
  /** What applied before, or what the grant replaced. */
  previously?: string;
  source: Source;
  /** ISO date the office's page was read. */
  checkedOn: string;
}

export const FIRST_HOME_GRANTS: Record<AustralianState, StateGrant> = {
  NSW: {
    state: "NSW",
    name: "First Home Owner (New Homes) Grant",
    amount: 10_000,
    upTo: false,
    caps: [
      { what: "a new or substantially renovated home you buy", value: 600_000, rule: "atMost" },
      { what: "vacant land plus a building contract, or an owner-builder home", value: 750_000, rule: "atMost" },
    ],
    window: "No end date published",
    endsOn: null,
    source: { label: "Revenue NSW: First Home Owner (New Homes) Grant", href: "https://www.revenue.nsw.gov.au/grants-schemes/first-home-owner-new-homes-grant" },
    checkedOn: "2026-10-10",
  },
  VIC: {
    state: "VIC",
    name: "First Home Owner Grant",
    amount: 10_000,
    upTo: false,
    caps: [{ what: "a new home", value: 750_000, rule: "atMost" }],
    window: "No end date published",
    endsOn: null,
    source: { label: "State Revenue Office Victoria: First Home Owner Grant", href: "https://www.sro.vic.gov.au/buying-property/first-home-owner-grant" },
    checkedOn: "2026-10-10",
  },
  QLD: {
    state: "QLD",
    name: "First home owner grant",
    amount: 30_000,
    upTo: false,
    caps: [{ what: "a new home, land and contract variations included", value: 750_000, rule: "below" }],
    window: "Contracts signed on or after 20 November 2023; no end date published",
    endsOn: null,
    previously: "$15,000 for contracts signed before 20 November 2023",
    source: { label: "Queensland Revenue Office: First home owner grant eligibility", href: "https://qro.qld.gov.au/property-concessions-grants/first-home-grant/eligibility/" },
    checkedOn: "2026-10-10",
  },
  WA: {
    state: "WA",
    name: "First Home Owner Grant",
    amount: 10_000,
    upTo: true,
    caps: [
      { what: "a new home south of the 26th parallel, which takes in all of Perth", value: 800_000, rule: "atMost" },
      { what: "a new home north of the 26th parallel", value: 1_000_000, rule: "atMost" },
    ],
    window: "Transactions commencing on or after 7 May 2026; no end date published",
    endsOn: null,
    previously: "The southern cap was $750,000 for transactions that commenced on or before 6 May 2026",
    source: { label: "RevenueWA: About the First Home Owner Grant (page last updated 29 July 2026)", href: "https://www.wa.gov.au/government/publications/about-the-first-home-owner-grant" },
    checkedOn: "2026-10-10",
  },
  SA: {
    state: "SA",
    name: "First Home Owner Grant",
    amount: 15_000,
    upTo: true,
    caps: [],
    window: "No property value cap for contracts entered into on or after 6 June 2024; no end date published",
    endsOn: null,
    previously: "A $650,000 cap applied to contracts from 15 June 2023 to 5 June 2024",
    source: { label: "RevenueSA: First Home Owner Grant, eligible properties", href: "https://www.revenuesa.sa.gov.au/FHOG" },
    checkedOn: "2026-10-11",
  },
  TAS: {
    state: "TAS",
    name: "First Home Owner Grant",
    amount: 20_000,
    upTo: false,
    caps: [],
    window: "Transactions that commence between 1 July 2026 and 30 June 2027",
    endsOn: "30 June 2027",
    previously: "$30,000 for transactions that commenced between 1 July 2025 and 30 June 2026",
    source: { label: "State Revenue Office Tasmania: First Home Owner Grant eligibility (last published 14 July 2026)", href: "https://www.sro.tas.gov.au/first-home-owner/eligibility" },
    checkedOn: "2026-10-10",
  },
  ACT: {
    state: "ACT",
    name: "First Home Owner Grant",
    amount: null,
    upTo: false,
    caps: [],
    window: "Not paid for transactions with a commencement date from 1 July 2019; replaced by the Home Buyer Concession Scheme",
    endsOn: "30 June 2019",
    source: { label: "ACT Revenue Office: First Home Owner Grant (payments ceased 1 July 2019)", href: "https://www.revenue.act.gov.au/home-buyer-assistance/first-home-owner-grant" },
    checkedOn: "2026-10-10",
  },
  NT: {
    state: "NT",
    name: "HomeGrown Territory Grant",
    amount: 50_000,
    upTo: false,
    caps: [],
    window: "Contracts to buy or build signed between 1 October 2024 and 30 September 2027; apply by 30 September 2028",
    endsOn: "30 September 2027",
    previously: "It replaces the $10,000 First Home Owner Grant. A separate $10,000 grant for an established home applied only to contracts from 1 October 2024 to 30 September 2025",
    source: { label: "NT Government: Buying or building a new home, HomeGrown Territory (page updated 13 May 2026)", href: "https://nt.gov.au/property/home-owner-assistance/buy-build-new-home" },
    checkedOn: "2026-10-11",
  },
};

export const grantFor = (state: AustralianState) => FIRST_HOME_GRANTS[state];

/** "$10,000" or "up to $15,000"; "No grant" for the ACT. */
export function grantAmountText(state: AustralianState): string {
  const g = FIRST_HOME_GRANTS[state];
  if (g.amount === null) return "No grant";
  return `${g.upTo ? "up to " : ""}${fmt(g.amount)}`;
}

/** "$600,000 for a new or substantially renovated home you buy and $750,000 for ..."; "no price cap". */
export function grantCapText(state: AustralianState): string {
  const g = FIRST_HOME_GRANTS[state];
  if (g.amount === null) return "not paid";
  if (g.caps.length === 0) return "no price cap";
  return g.caps.map((c) => `${c.rule === "below" ? "under " : ""}${fmt(c.value)} for ${c.what}`).join(" and ");
}

/** The caps for a table cell: "$750,000 (a new home)" or "No cap". */
export function grantCapCell(state: AustralianState): string {
  const g = FIRST_HOME_GRANTS[state];
  if (g.amount === null) return "Not applicable";
  if (g.caps.length === 0) return "No cap";
  return g.caps.map((c) => `${c.rule === "below" ? "Under " : ""}${fmt(c.value)} (${c.what})`).join("; ");
}

const SUBJECT: Record<AustralianState, string> = {
  NSW: "NSW", VIC: "Victoria", QLD: "Queensland", WA: "WA", SA: "South Australia", TAS: "Tasmania", ACT: "The ACT", NT: "The Northern Territory",
};

/** The office's short name: "Revenue NSW", "Queensland Revenue Office". */
export const grantOffice = (state: AustralianState) => FIRST_HOME_GRANTS[state].source.label.split(":")[0];

/** One sentence on the grant, with its window, source and the date it was checked. */
export function grantSentence(state: AustralianState): string {
  const g = FIRST_HOME_GRANTS[state];
  const read = `(${grantOffice(state)}, read ${longDate(g.checkedOn)})`;
  if (g.amount === null) {
    return `The ACT pays no first home owner grant: payments ceased for transactions from 1 July 2019 and the Home Buyer Concession Scheme replaced it ${read}.`;
  }
  const cap = g.caps.length === 0 ? "with no price cap" : `with a price cap of ${grantCapText(state)}`;
  return `${SUBJECT[state]} pays ${g.upTo ? "up to " : ""}${fmt(g.amount)} under its ${g.name}, on a new home only, ${cap}. ${g.window} ${read}.`;
}

// ─── First home buyer duty relief ───────────────────────────────────────────

export interface DutyRelief {
  state: AustralianState;
  scheme: string;
  /** What the relief covers: any home, new homes and land only, or nothing for a first home buyer. */
  covers: "any" | "newOnly" | "none";
  /** No duty on a home up to this value; Infinity where there is no cap; null where there is no relief. */
  exemptTo: number | null;
  /** Reduced duty above exemptTo and up to (or under) this value; null where there is no concession band. */
  concessionTo: number | null;
  /** Contracts or transactions the thresholds apply from. */
  from: string;
  /** The rule in one plain sentence. */
  rule: string;
  /** Vacant land for a first home, where the state has its own thresholds. */
  land?: { exemptTo: number; concessionTo: number | null };
  /** Relief that is not first-home-only, or that ended, worth naming beside the rule. */
  note?: string;
  source: Source;
  checkedOn: string;
}

export const FIRST_HOME_DUTY: Record<AustralianState, DutyRelief> = {
  NSW: {
    state: "NSW",
    scheme: "First Home Buyers Assistance Scheme",
    covers: "any",
    exemptTo: NSW_FIRST_HOME.exemptTo,
    concessionTo: NSW_FIRST_HOME.concessionTo,
    from: NSW_FIRST_HOME.from,
    rule: `No transfer duty on a new or established home up to ${fmt(NSW_FIRST_HOME.exemptTo)}, and a concessional rate over ${fmt(NSW_FIRST_HOME.exemptTo)} and under ${fmt(NSW_FIRST_HOME.concessionTo)}, for contracts exchanged on or after ${NSW_FIRST_HOME.from}.`,
    land: { exemptTo: NSW_FIRST_HOME_LAND.exemptTo, concessionTo: NSW_FIRST_HOME_LAND.concessionTo },
    source: { label: "Revenue NSW: First Home Buyers Assistance Scheme", href: "https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/assistance-scheme" },
    checkedOn: "2026-10-10",
  },
  VIC: {
    state: "VIC",
    scheme: "First home buyer duty exemption or concession",
    covers: "any",
    exemptTo: VIC_FIRST_HOME.exemptTo,
    concessionTo: VIC_FIRST_HOME.concessionTo,
    from: VIC_FIRST_HOME.from,
    rule: `No land transfer duty on a home valued up to ${fmt(VIC_FIRST_HOME.exemptTo)}, and a reduced amount from ${fmt(VIC_FIRST_HOME.exemptTo + 1)} to ${fmt(VIC_FIRST_HOME.concessionTo)}.`,
    source: { label: "State Revenue Office Victoria: First home buyer duty exemption or concession (updated 15 September 2026)", href: "https://www.sro.vic.gov.au/buying-property/land-transfer-stamp-duty/concessions-exemptions-and-waivers/first-home-buyers/first-home-buyer-duty-exemption-or-concession" },
    checkedOn: "2026-10-10",
  },
  QLD: {
    state: "QLD",
    scheme: "First home concession",
    covers: "any",
    exemptTo: QLD_FIRST_HOME.exemptTo,
    concessionTo: QLD_FIRST_HOME.concessionTo,
    from: QLD_FIRST_HOME.from,
    rule: `On an established home, no transfer duty up to ${fmt(QLD_FIRST_HOME.exemptTo)} and a shrinking concession under ${fmt(QLD_FIRST_HOME.concessionTo)} (contracts from ${QLD_FIRST_HOME.from}). On a new home or vacant land to build one, no transfer duty at any price (transactions from 1 May 2025).`,
    note: "The first home (new home) and first home vacant land concessions have no cap on the value, for transactions entered into on or after 1 May 2025.",
    source: { label: "Queensland Revenue Office: Transfer duty concession rates (first home, first home (new home) and first home vacant land)", href: "https://qro.qld.gov.au/duties/transfer-duty/calculate/concession-rates/" },
    checkedOn: "2026-10-10",
  },
  WA: {
    state: "WA",
    scheme: "First home owner rate of duty",
    covers: "any",
    exemptTo: WA_FIRST_HOME.exemptTo,
    concessionTo: WA_FIRST_HOME.concessionTo,
    from: WA_FIRST_HOME.from,
    rule: `No transfer duty on a home up to ${fmt(WA_FIRST_HOME.exemptTo)}, then $${WA_FIRST_HOME.ratePer100.toFixed(2)} per $100 of the value over ${fmt(WA_FIRST_HOME.exemptTo)} up to ${fmt(WA_FIRST_HOME.concessionTo)}, for transactions on or after ${WA_FIRST_HOME.from}.`,
    land: { exemptTo: WA_FIRST_HOME_LAND.exemptTo, concessionTo: WA_FIRST_HOME_LAND.concessionTo },
    source: { label: "RevenueWA: Duties fact sheet, first home owner rate (last updated 27 August 2026)", href: "https://www.wa.gov.au/government/publications/duties-fact-sheet-first-home-owner-rate" },
    checkedOn: "2026-10-10",
  },
  SA: {
    state: "SA",
    scheme: "Stamp duty relief for eligible first home buyers",
    covers: "newOnly",
    exemptTo: Infinity,
    concessionTo: null,
    from: "6 June 2024",
    rule: "No stamp duty on a new home, an off-the-plan apartment or vacant land to build on, with no property value cap for contracts entered into on or after 6 June 2024. An established home gets no relief.",
    source: { label: "RevenueSA: Stamp duty relief for eligible first home buyers, eligible properties", href: "https://www.revenuesa.sa.gov.au/stampduty/first-home-buyer-relief" },
    checkedOn: "2026-10-11",
  },
  TAS: {
    state: "TAS",
    scheme: "None (the established-home exemption ended)",
    covers: "none",
    exemptTo: null,
    concessionTo: null,
    from: "1 July 2026",
    rule: "No first home buyer duty relief. The 100% exemption on an established home valued up to $750,000 applied to transfers settling from 18 February 2024 to 30 June 2026 and is not available for transactions settling after 30 June 2026.",
    source: { label: "State Revenue Office Tasmania: First home buyers of established homes duty relief", href: "https://www.sro.tas.gov.au/property-transfer-duties/concessions-exemptions/first-home-buyers-of-established-homes-duty-relief" },
    checkedOn: "2026-10-10",
  },
  ACT: {
    state: "ACT",
    scheme: "Home Buyer Concession Scheme",
    covers: "any",
    exemptTo: Infinity,
    concessionTo: null,
    from: ACT_HBCS_FROM,
    rule: `No conveyance duty for an eligible buyer of a new home, an established home or residential land, from ${ACT_HBCS_FROM}: the income threshold and the property value limit were removed. You and your partner must not have owned property in the last 5 years, and you must live in the home for at least a year.`,
    note: "The scheme is not only for first home buyers: it covers anyone who has not owned property in the last 5 years.",
    source: { label: "ACT Revenue Office: About the Home Buyer Concession Scheme", href: "https://www.revenue.act.gov.au/home-buyer-assistance/home-buyer-concession-scheme/about-the-home-buyer-concession-scheme" },
    checkedOn: "2026-10-10",
  },
  NT: {
    state: "NT",
    scheme: "None",
    covers: "none",
    exemptTo: null,
    concessionTo: null,
    from: "",
    rule: "No first home buyer duty concession. The Territory Revenue Office's list of stamp duty exemptions and concessions has none for first home buyers.",
    note: "Any buyer of a house and land package from a building contractor, contract signed between 1 July 2022 and 30 June 2027, can claim the House and Land Package Exemption, with no cap on the value.",
    source: { label: "NT Government: Stamp duty exemption (House and Land Package Exemption)", href: "https://nt.gov.au/property/home-owner-assistance/stamp-duty-exemption" },
    checkedOn: "2026-10-11",
  },
};

export const dutyReliefFor = (state: AustralianState) => FIRST_HOME_DUTY[state];

/** A short cell for a table: "$0 to $800,000; concession to $1,000,000". */
export function dutyReliefCell(state: AustralianState): string {
  const d = FIRST_HOME_DUTY[state];
  if (d.covers === "none") return "None";
  if (d.exemptTo === Infinity) return d.covers === "newOnly" ? "$0 on a new home or land, no cap" : "$0 for an eligible buyer, no cap";
  const base = `$0 to ${fmt(d.exemptTo!)}`;
  if (d.concessionTo === null) return base;
  return `${base}; concession ${d.state === "QLD" ? "under" : "to"} ${fmt(d.concessionTo)}${d.state === "QLD" ? "; $0 on a new home, no cap" : ""}`;
}

// ─── Closed or misnamed schemes ─────────────────────────────────────────────

export interface ClosedScheme {
  name: string;
  state: AustralianState | "national";
  status: string;
  source: Source;
}

/**
 * Schemes our pages used to describe as current. The test fails if a page
 * names one without saying it closed. HomeSeeker SA is not a scheme at all:
 * it is the SA Government's listings site for affordable homes.
 */
export const CLOSED_SCHEMES: readonly ClosedScheme[] = [
  {
    name: "First Home Buyer Choice",
    state: "NSW",
    status: "closed to new applications on 1 July 2023",
    source: { label: "Revenue NSW: First Home Buyer Choice (previous schemes)", href: "https://www.revenue.nsw.gov.au/grants-schemes/previous-schemes/first-home-buyer-choice" },
  },
  {
    name: "Shared Equity Home Buyer Helper",
    state: "NSW",
    status: "closed on 30 June 2024",
    source: { label: "Revenue NSW: Shared Equity Home Buyer Helper (previous schemes)", href: "https://www.revenue.nsw.gov.au/grants-schemes/previous-schemes/shared-equity-home-buyer-helper" },
  },
  {
    name: "First Home Owner Grant",
    state: "ACT",
    status: "ceased for transactions from 1 July 2019",
    source: FIRST_HOME_GRANTS.ACT.source,
  },
];

/** Names that must not appear on our pages as a current scheme. */
export const NOT_CURRENT_NAMES = ["First Home Buyer Choice", "First Home Owner Discount", "HomeSeeker", "Shared Equity Home Buyer Helper"] as const;

// ─── Every figure, for the drift test ───────────────────────────────────────

/** Every grant amount and cap, current or previous, that a page may print. */
export function allGrantFigures(): number[] {
  const out = new Set<number>();
  for (const s of AUSTRALIAN_STATES) {
    const g = FIRST_HOME_GRANTS[s];
    if (g.amount !== null) out.add(g.amount);
    for (const c of g.caps) out.add(c.value);
  }
  return [...out];
}

/** Every first home duty threshold (homes and land) a page may print. */
export function allDutyThresholds(): number[] {
  const out = new Set<number>();
  for (const s of AUSTRALIAN_STATES) {
    const d = FIRST_HOME_DUTY[s];
    if (d.exemptTo !== null && d.exemptTo !== Infinity) out.add(d.exemptTo);
    if (d.concessionTo !== null) out.add(d.concessionTo);
    if (d.land) {
      out.add(d.land.exemptTo);
      if (d.land.concessionTo !== null) out.add(d.land.concessionTo);
    }
  }
  return [...out];
}

// ─── Small helpers ──────────────────────────────────────────────────────────

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
/** "2026-10-10" to "10 October 2026". */
export function longDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** Every grant and duty source, deduplicated, for a page's Sources block. */
export function firstHomeSources(states: readonly AustralianState[] = AUSTRALIAN_STATES): Array<{ label: string; href: string; note: string }> {
  const seen = new Set<string>();
  const out: Array<{ label: string; href: string; note: string }> = [];
  for (const s of states) {
    for (const row of [FIRST_HOME_GRANTS[s], FIRST_HOME_DUTY[s]]) {
      if (seen.has(row.source.href)) continue;
      seen.add(row.source.href);
      out.push({ ...row.source, note: `read ${longDate(row.checkedOn)}` });
    }
  }
  return out;
}
